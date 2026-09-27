/*
 * scenes/p3.js — LAB scenes, part 3 (see SCENE_API.md, CONTEXT_RULE.md).
 * InclusionExclusion · VennDiagram · LookupTable · Precomputation · OfflineAlgorithm ·
 * LazyInitialization · PrefixSum · Memoization · LatticePaths · DynamicProgramming ·
 * RestrictedPartitionCount · NextPermutation · Composition · BitmaskSubsetEnumeration
 * Every scene follows NARRATIVE.md: task → head-on → notice → solve steps; captions come from
 * stories/<Id>.json (copied into ST below), on-stage strings are bilingual via api.L.
 */(function(){
'use strict';
if(!window.LAB || !LAB.register) return;

/* ---------------- local helpers ---------------- */

// flat plate with text on top: box + floor text, moved/colored as one group
function plate(api, str, pos, o){
  o = o || {};
  var w = o.w || 1.6, h = o.h || 0.3, d = o.d || 0.9, col = o.color || 'plain';
  var b = api.box([w, h, d], {pos: pos, color: col});
  var t = api.text(str, [pos[0], (pos[1] || 0) + h + 0.01, pos[2]], {size: o.size || 0.42, color: col === 'plain' ? 'ink' : col});
  var g = api.group([b, t]);
  g.b = b; g.t = t; g.h = h; g.at0 = pos.slice();
  g.setText = function(v, oo){ t.setText(v, oo); return g; };
  g.top = function(){ var p = g.obj.position; return [g.at0[0] + p.x, g.at0[1] + p.y + h, g.at0[2] + p.z]; };
  return g;
}

// replace a Box's geometry (keeps Thing color/opacity behaviour)
function reshape(t, geom, edgeAngle){
  t.box.geometry = geom;
  t.edges.geometry = new THREE.EdgesGeometry(geom, edgeAngle || 25);
  return t;
}
// cylinder "disc" of radius r, height h
function disc(api, r, h, pos, color){
  var t = api.box([2*r, h, 2*r], {pos: pos, color: color});
  return reshape(t, new THREE.CylinderGeometry(0.5, 0.5, 1, 72), 20);
}
// lens = intersection of two discs of radius r whose centers are 2c apart (along x)
function lens(api, r, c, h, pos, color){
  var th = Math.acos(c/r), yh = Math.sqrt(r*r - c*c), s = new THREE.Shape();
  s.moveTo(0, -yh);
  s.absarc(-c, 0, r, -th, th, false);
  s.absarc(c, 0, r, Math.PI - th, Math.PI + th, false);
  var g = new THREE.ExtrudeGeometry(s, {depth: 1, bevelEnabled: false, curveSegments: 40});
  g.rotateX(-Math.PI/2);
  var t = api.box([1, h, 1], {pos: pos, color: color});
  reshape(t, g, 20);
  t.box.position.y = 0; t.edges.position.y = 0;
  return t;
}

// hop: move a Thing along an arc (lift → move → land) with one tween, idempotent
function hopper(api, t){
  var st = {p: 1}, from = t.obj.position.clone(), to = from.clone(), hh = 0, last = -1;
  api._ticks.push(function(){
    if(st.p === last) return; last = st.p;
    var p = st.p;
    t.obj.position.set(from.x + (to.x - from.x)*p, from.y + (to.y - from.y)*p + Math.sin(Math.PI*p)*hh, from.z + (to.z - from.z)*p);
    if(LAB._E) LAB._E.dirty = true;
  });
  return function(pos, height, o){
    from = t.obj.position.clone(); to = new THREE.Vector3(pos[0], pos[1] || 0, pos[2] || 0);
    t.base.copy(to);
    hh = from.distanceTo(to) < 1e-3 ? 0 : (height || 0);
    st.p = 0; last = -1;
    api.tween(st, {p: 1}, Object.assign({ms: 650}, o || {}));
  };
}

// stretch a Box along x from its left edge: f in (0..1]
function growX(t, W, f, o){
  f = Math.max(0.001, f);
  api_tw(t.box.scale, {x: W*f}, o); api_tw(t.edges.scale, {x: W*f}, o);
  api_tw(t.box.position, {x: -W/2 + W*f/2}, o); api_tw(t.edges.position, {x: -W/2 + W*f/2}, o);
}
function api_tw(target, props, o){ LAB.tween(target, props, o); }

function vis(t, on, o){ if(on) t.fadeIn(o); else t.fadeOut(); }

var pl = LAB.plural || function(n, a, b, c){ return c; };
function task(api, str, pos, o){ return api.text(str, pos, Object.assign({size: 0.42, color: 'ink', align: 'left'}, o || {})); }
// naive board: counts up in the first problem step, then stays with its full formula
function naiveBoard(s, i, n, o){
  o = o || {};
  s.ops.fadeIn(); s.ops.color('red');
  if(i === (o.at || 0)){ s.ops.set(0, {ms: 0}); s.ops.set(n, {ms: o.ms || 1600, delay: o.delay || 250}); }
  else if(i > (o.at || 0)) s.ops.set(n);
  else s.ops.set(0);
}
function meterAt(s, on, a, b){ if(on){ s.meter.fadeIn({delay: 400}); s.meter.set(0, 0, {ms: 0}); s.meter.set(a, b, {delay: 500}); } else s.meter.fadeOut(); }

var ST = {
 "InclusionExclusion": {
  "ru": {
   "task": "Сколько чисел от 1 до 180 делится на 2 или на 3 (хотя бы на одно из них)?",
   "headOn": "В лоб: выписываем 90 чисел, которые делятся на 2, и 60 чисел, которые делятся на 3, и у каждого проверяем, не встречалось ли оно уже, — 90 + 60 = 150 проверок.",
   "notice": "Числа, которые делятся и на 2, и на 3, — это числа, которые делятся на 6. Они попали в оба списка, значит, при сложении посчитаны дважды — их нужно один раз вычесть.",
   "steps": [
    "Считаем каждый список одним делением: 180 ÷ 2 = 90, 180 ÷ 3 = 60, 180 ÷ 6 = 30.",
    "Складываем списки: 90 + 60 = 150 — но 30 чисел, которые делятся на 6, здесь посчитаны дважды.",
    "Вычитаем их один раз: 150 − 30 = 120 чисел — за 5 действий вместо 150 проверок."
   ]
  },
  "en": {
   "task": "How many numbers from 1 to 180 divide evenly by 2 or by 3 (by at least one of them)?",
   "headOn": "Head-on: list the 90 numbers that divide by 2 and the 60 that divide by 3, and check each one to see if it has already appeared — 90 + 60 = 150 checks.",
   "notice": "Numbers that divide by both 2 and 3 are exactly the numbers that divide by 6. They are on both lists, so adding the lists counts them twice — subtract them once.",
   "steps": [
    "Count each list with one division: 180 ÷ 2 = 90, 180 ÷ 3 = 60, 180 ÷ 6 = 30.",
    "Add the lists: 90 + 60 = 150 — but the 30 numbers that divide by 6 are counted twice here.",
    "Subtract them once: 150 − 30 = 120 numbers — in 5 steps instead of 150 checks."
   ]
  }
 },
 "LookupTable": {
  "ru": {
   "task": "Нужно назвать число 11 по-английски. Есть подсказки «число — слово» для всех чисел от 0 до 19.",
   "headOn": "В лоб: сверяем 11 с подсказками по очереди — 0? нет, 1? нет… — и находим «eleven» только на 12-й проверке.",
   "notice": "Разложим слова по пронумерованным ячейкам так, чтобы номер ячейки совпадал с числом. Тогда слово для 11 лежит в ячейке 11 — искать не нужно.",
   "steps": [
    "Один раз раскладываем 20 слов по ячейкам с номерами от 0 до 19 — 20 записей.",
    "Вопрос «11»: открываем ячейку 11 и сразу читаем «eleven» — вместе с раскладкой 21 действие.",
    "Второй вопрос «17»: ещё одно чтение. Итого 22 действия, а сверкой по очереди было бы 12 + 18 = 30."
   ]
  },
  "en": {
   "task": "We need the English word for the number 11. We have a hint “number — word” for every number from 0 to 19.",
   "headOn": "Head-on: compare 11 with the hints one by one — 0? no, 1? no… — and find “eleven” only on the 12th check.",
   "notice": "Put the words into numbered boxes so that the box number matches the number. Then the word for 11 sits in box 11 — no searching needed.",
   "steps": [
    "Once, put the 20 words into boxes numbered 0 to 19 — 20 writes.",
    "Question “11”: open box 11 and read “eleven” straight away — 21 steps including the setup.",
    "Second question “17”: one more read. 22 steps in all, while checking one by one would take 12 + 18 = 30."
   ]
  }
 },
 "Precomputation": {
  "ru": {
   "task": "Про каждое из чисел 16, 25 и 30 нужно узнать: можно ли получить его, умножив какое-то целое число само на себя (как 4 × 4 = 16)?",
   "headOn": "В лоб: для каждого числа заново перемножаем 1 × 1, 2 × 2, 3 × 3… пока не дойдём до него или не перескочим — 4 + 5 + 6 = 15 умножений.",
   "notice": "Произведения 1, 4, 9, 16, 25 одни и те же для всех трёх вопросов. Их можно посчитать один раз заранее, а потом только сверяться.",
   "steps": [
    "Один раз считаем 1 × 1, 2 × 2, … 5 × 5: 1, 4, 9, 16, 25 — 5 умножений; 6 × 6 = 36 уже больше 30, дальше не нужно.",
    "Каждый вопрос — одна сверка с готовым списком: 16 есть, 25 есть, 30 нет. Всего 5 + 3 = 8 действий вместо 15."
   ]
  },
  "en": {
   "task": "For each of the numbers 16, 25 and 30, find out: can it be made by multiplying some whole number by itself (like 4 × 4 = 16)?",
   "headOn": "Head-on: for each number, multiply 1 × 1, 2 × 2, 3 × 3… again until we reach it or go past it — 4 + 5 + 6 = 15 multiplications.",
   "notice": "The products 1, 4, 9, 16, 25 are the same for all three questions. They can be worked out once in advance, and then we only look them up.",
   "steps": [
    "Once, work out 1 × 1, 2 × 2, … 5 × 5: 1, 4, 9, 16, 25 — 5 multiplications; 6 × 6 = 36 is already past 30, so we stop.",
    "Each question is one look-up in the ready list: 16 is there, 25 is there, 30 is not. 5 + 3 = 8 steps in all instead of 15."
   ]
  }
 },
 "OfflineAlgorithm": {
  "ru": {
   "task": "Приходят три вопроса: сколько простых чисел (делятся только на 1 и на себя) от 1 до 12, от 1 до 30 и от 1 до 7? Для ответа нужна таблица чисел от 1 до названной границы.",
   "headOn": "В лоб: отвечаем на вопросы по мере прихода и каждый раз строим таблицу заново — 12 + 30 + 7 = 49 клеток.",
   "notice": "Если сначала прочитать все три вопроса, видна самая большая граница — 30. Одной таблицы от 1 до 30 хватит на все три ответа.",
   "steps": [
    "Строим одну таблицу от 1 до 30 — 30 клеток.",
    "Отвечаем в том порядке, в каком спрашивали: до 12 — 5 простых, до 30 — 10, до 7 — 4. Всего 30 клеток вместо 49."
   ]
  },
  "en": {
   "task": "Three questions come in: how many prime numbers (divisible only by 1 and themselves) are there from 1 to 12, from 1 to 30 and from 1 to 7? Answering needs a table of the numbers from 1 up to the given limit.",
   "headOn": "Head-on: answer each question as it arrives and build the table from scratch each time — 12 + 30 + 7 = 49 cells.",
   "notice": "If we read all three questions first, the largest limit is visible — 30. One table from 1 to 30 is enough for all three answers.",
   "steps": [
    "Build one table from 1 to 30 — 30 cells.",
    "Answer in the order the questions came: up to 12 — 5 primes, up to 30 — 10, up to 7 — 4. 30 cells in all instead of 49."
   ]
  }
 },
 "LazyInitialization": {
  "ru": {
   "task": "Программу запускают два раза. В первый раз ей понадобится таблица на 1000 клеток, во второй раз — нет. Сколько раз строить таблицу?",
   "headOn": "В лоб: строим таблицу в начале каждого запуска — 2 × 1000 = 2000 клеток, причём во втором запуске впустую.",
   "notice": "Поставим перед таблицей отметку «готово / не готово» и будем строить таблицу только тогда, когда её впервые спросили.",
   "steps": [
    "Вопрос к таблице смотрит на отметку: «не готово» — строим таблицу и ставим «готово»; «готово» — просто читаем.",
    "Первый запуск строит таблицу один раз — 1000 клеток; второй не строит её вовсе. 1000 клеток вместо 2000."
   ]
  },
  "en": {
   "task": "A program is run twice. The first run will need a table of 1000 cells, the second will not. How many times should the table be built?",
   "headOn": "Head-on: build the table at the start of every run — 2 × 1000 = 2000 cells, and in the second run for nothing.",
   "notice": "Put a “ready / not ready” flag in front of the table and build the table only when someone asks for it for the first time.",
   "steps": [
    "A question to the table looks at the flag: “not ready” — build the table and set “ready”; “ready” — just read.",
    "The first run builds the table once — 1000 cells; the second never builds it. 1000 cells instead of 2000."
   ]
  }
 },
 "PrefixSum": {
  "ru": {
   "task": "Дан ряд чисел 3, 1, 4, 5, 9, 2, 6, 8. Нас будут много раз спрашивать сумму чисел на участке ряда — например, с 3-го по 6-е место.",
   "headOn": "В лоб: складываем числа участка 4 + 5 + 9 + 2 = 20 — 3 сложения, и на каждый новый вопрос всё заново.",
   "notice": "Сумма с 3-го по 6-е место — это сумма первых шести чисел минус сумма первых двух. Если заранее знать суммы от начала ряда до каждого места, хватит одного вычитания.",
   "steps": [
    "Один раз записываем суммы от начала до каждого места: 3, 4, 8, 13, 22, 24, 30, 38 — 7 сложений.",
    "Вопрос «места 3–6»: сумма до 6-го места 24 минус сумма до 2-го места 4 — 24 − 4 = 20, одно вычитание.",
    "На четырёх вопросах: 7 сложений + 4 вычитания = 11 действий против 4 × 3 = 12 — подготовка окупилась."
   ]
  },
  "en": {
   "task": "We have the numbers 3, 1, 4, 5, 9, 2, 6, 8 in a row. We will be asked many times for the sum of a stretch of the row — for example, from the 3rd to the 6th place.",
   "headOn": "Head-on: add up the stretch 4 + 5 + 9 + 2 = 20 — 3 additions, and for every new question all over again.",
   "notice": "The sum from the 3rd to the 6th place is the sum of the first six numbers minus the sum of the first two. If we know in advance the total from the start up to every place, one subtraction is enough.",
   "steps": [
    "Once, write down the running total up to each place: 3, 4, 8, 13, 22, 24, 30, 38 — 7 additions.",
    "Question “places 3–6”: the total up to place 6, 24, minus the total up to place 2, 4 — 24 − 4 = 20, one subtraction.",
    "Over four questions: 7 additions + 4 subtractions = 11 steps against 4 × 3 = 12 — the preparation has paid off."
   ]
  }
 },
 "Memoization": {
  "ru": {
   "task": "В ряду 0, 1, 1, 2, 3, 5… каждое число — сумма двух предыдущих. fib(n) — число на n-м месте, считая с нуля. Нужно найти fib(4).",
   "headOn": "В лоб: fib(4) = fib(3) + fib(2), а fib(3) сам снова просит fib(2) — всего 9 расчётов, и fib(2) считается дважды.",
   "notice": "Каждый найденный ответ можно записать в тетрадку. Когда тот же ответ понадобится снова, его не считают, а читают из тетрадки.",
   "steps": [
    "Первый раз fib(2) = 1 + 0 = 1 считаем и записываем в тетрадку.",
    "Второй раз fib(2) читаем из тетрадки. Итог: 5 расчётов + 2 чтения = 7 вместо 9."
   ]
  },
  "en": {
   "task": "In the row 0, 1, 1, 2, 3, 5… each number is the sum of the two before it. fib(n) is the number in place n, counting from zero. We need fib(4).",
   "headOn": "Head-on: fib(4) = fib(3) + fib(2), and fib(3) asks for fib(2) all over again — 9 calculations in all, with fib(2) worked out twice.",
   "notice": "Every answer we find can be written down in a notebook. When the same answer is needed again, we do not work it out — we read it from the notebook.",
   "steps": [
    "The first time, fib(2) = 1 + 0 = 1 is worked out and written in the notebook.",
    "The second time, fib(2) is read from the notebook. Result: 5 calculations + 2 reads = 7 instead of 9."
   ]
  }
 },
 "LatticePaths": {
  "ru": {
   "task": "Сетка 2 на 2 клетки. Идём из левого верхнего угла в правый нижний, только вправо (П) или вниз (Н). Сколько разных путей?",
   "headOn": "В лоб: выписываем все цепочки из 4 ходов — на каждом ходе 2 варианта, 2 × 2 × 2 × 2 = 16 цепочек — и оставляем те, где ровно 2 П и 2 Н.",
   "notice": "Любой путь — это 4 хода, и ровно 2 из них вправо. Значит, путей столько, сколькими способами можно выбрать 2 места из 4 под ходы вправо.",
   "steps": [
    "По сетке: в каждую точку приходят сверху или слева, поэтому число путей в точку = сверху + слева; в правом нижнем углу выходит 6.",
    "То же одной формулой: выбрать 2 места из 4 = (4 × 3) ÷ (2 × 1) = 6; по шагам: × 3, ÷ 1, × 4, ÷ 2 — 4 действия вместо 16 проверок."
   ]
  },
  "en": {
   "task": "A grid of 2 by 2 squares. We walk from the top-left corner to the bottom-right, moving only right (R) or down (D). How many different paths are there?",
   "headOn": "Head-on: write out every chain of 4 moves — 2 choices at each move, 2 × 2 × 2 × 2 = 16 chains — and keep those with exactly 2 R and 2 D.",
   "notice": "Every path is 4 moves, and exactly 2 of them go right. So there are as many paths as there are ways to pick 2 of the 4 places for the right moves.",
   "steps": [
    "On the grid: every point is reached from above or from the left, so paths to a point = above + left; the bottom-right corner gets 6.",
    "The same with one formula: pick 2 places out of 4 = (4 × 3) ÷ (2 × 1) = 6; step by step: × 3, ÷ 1, × 4, ÷ 2 — 4 steps instead of 16 checks."
   ]
  }
 },
 "DynamicProgramming": {
  "ru": {
   "task": "Треугольник из чисел: 3 / 7 4 / 2 4 6 / 8 5 9 3. Идём сверху вниз, каждый раз на одно из двух соседних чисел ниже. Какая самая большая сумма чисел на пути?",
   "headOn": "В лоб: перебираем все 8 путей и в каждом складываем 4 числа — 8 × 3 = 24 сложения.",
   "notice": "Лучший путь от числа 2 вниз — это 2 плюс большее из двух чисел под ним, 8 и 5: 2 + 8 = 10. Так можно заменить каждое число лучшей суммой, идя снизу вверх.",
   "steps": [
    "Снизу вверх: каждое число прибавляет большее из двух соседей под ним — всего 6 сложений.",
    "В вершине получается 23 — это самая большая сумма (путь 3 + 7 + 4 + 9)."
   ]
  },
  "en": {
   "task": "A triangle of numbers: 3 / 7 4 / 2 4 6 / 8 5 9 3. We go from top to bottom, each time to one of the two neighbouring numbers below. What is the largest sum along a path?",
   "headOn": "Head-on: try all 8 paths and add up the 4 numbers on each — 8 × 3 = 24 additions.",
   "notice": "The best path down from the number 2 is 2 plus the larger of the two numbers below it, 8 and 5: 2 + 8 = 10. So every number can be replaced by its best sum, working from the bottom up.",
   "steps": [
    "From the bottom up: each number adds the larger of its two neighbours below — 6 additions in all.",
    "The top ends up as 23 — that is the largest sum (the path 3 + 7 + 4 + 9)."
   ]
  }
 },
 "RestrictedPartitionCount": {
  "ru": {
   "task": "Полосу длины 4 нужно выложить плитками длины 1 и 2. Сколько разных наборов плиток подходит, если порядок плиток не важен?",
   "headOn": "В лоб: перебираем, сколько взять двоек (0, 1 или 2) и сколько единиц (от 0 до 4), — 3 × 5 = 15 вариантов, и проверяем длину; подходят только 3.",
   "notice": "Будем добавлять виды плиток по очереди: сначала только единицы, потом двойки. Тогда каждый набор получается ровно один раз, в одном порядке, и повторов нет.",
   "steps": [
    "Подходят три набора: 2 + 2, 2 + 1 + 1 и 1 + 1 + 1 + 1.",
    "Если порядок важен, раскладок пять: набор 2 + 1 + 1 можно выложить тремя способами. Поэтому виды плиток и добавляем по очереди.",
    "Таблица способов для длин 0…4: с одними единицами — 4 сложения, с двойками — ещё 3. Всего 7 сложений, в клетке длины 4 — ответ 3."
   ]
  },
  "en": {
   "task": "A strip of length 4 has to be covered with tiles of length 1 and 2. How many different sets of tiles fit, if the order of the tiles does not matter?",
   "headOn": "Head-on: try how many 2-tiles to take (0, 1 or 2) and how many 1-tiles (0 to 4) — 3 × 5 = 15 options — and check the length; only 3 fit.",
   "notice": "Add the tile sizes one at a time: first only 1-tiles, then 2-tiles. Then each set comes out exactly once, in one order, with no repeats.",
   "steps": [
    "Three sets fit: 2 + 2, 2 + 1 + 1 and 1 + 1 + 1 + 1.",
    "If order mattered there would be five layouts: the set 2 + 1 + 1 can be laid down in three ways. That is why we add the tile sizes one at a time.",
    "A table of ways for lengths 0…4: with only 1-tiles, 4 additions; with 2-tiles, 3 more. 7 additions in all, and the cell for length 4 holds the answer 3."
   ]
  }
 },
 "NextPermutation": {
  "ru": {
   "task": "Числа 1 3 5 4 2 стоят в ряд. Если выписать все расстановки этих пяти чисел по возрастанию, как слова в словаре, какая идёт сразу после 1 3 5 4 2?",
   "headOn": "В лоб: выписываем все 5 × 4 × 3 × 2 × 1 = 120 расстановок, упорядочиваем и ищем следующую.",
   "notice": "Конец ряда 5 4 2 уже стоит по убыванию — это самая большая расстановка этих трёх чисел, больше из них не сделать. Значит, менять нужно число перед ним — 3.",
   "steps": [
    "Меняем 3 на наименьшее из чисел конца, которое больше 3, — это 4: получаем 1 4 5 3 2.",
    "Переворачиваем конец 5 3 2 в 2 3 5: ответ 1 4 2 3 5 — за 7 сравнений и обменов."
   ]
  },
  "en": {
   "task": "The numbers 1 3 5 4 2 stand in a row. If every arrangement of these five numbers were listed in increasing order, like words in a dictionary, which one comes right after 1 3 5 4 2?",
   "headOn": "Head-on: write out all 5 × 4 × 3 × 2 × 1 = 120 arrangements, sort them and look for the next one.",
   "notice": "The end of the row, 5 4 2, is already in decreasing order — that is the largest arrangement of those three numbers, nothing bigger can be made from them. So the number to change is the one before it: 3.",
   "steps": [
    "Swap 3 with the smallest number in the end that is larger than 3 — that is 4: we get 1 4 5 3 2.",
    "Flip the end 5 3 2 into 2 3 5: the answer is 1 4 2 3 5 — in 7 comparisons and swaps."
   ]
  }
 },
 "Composition": {
  "ru": {
   "task": "Число 5 нужно разложить на 3 части, каждая больше нуля, и порядок важен: 1 + 3 + 1 и 3 + 1 + 1 — разные разложения. Сколько их?",
   "headOn": "В лоб: перебираем все тройки чисел от 1 до 5 — 5 × 5 × 5 = 125 троек — и проверяем сумму; подходят 6.",
   "notice": "Выложим 5 палочек в ряд: между ними 4 промежутка. Поставив 2 перегородки в 2 промежутка из 4, получаем ровно разложение на 3 части.",
   "steps": [
    "Перегородки в 1-м и 4-м промежутке дают части 1, 3, 1.",
    "Выбрать 2 промежутка из 4 можно (4 × 3) ÷ (2 × 1) = 6 способами; по шагам: × 3, ÷ 1, × 4, ÷ 2 — 4 действия вместо 125 троек."
   ]
  },
  "en": {
   "task": "The number 5 has to be split into 3 parts, each above zero, and order matters: 1 + 3 + 1 and 3 + 1 + 1 are different splits. How many are there?",
   "headOn": "Head-on: try every triple of numbers from 1 to 5 — 5 × 5 × 5 = 125 triples — and check the sum; 6 of them fit.",
   "notice": "Lay 5 sticks in a row: there are 4 gaps between them. Putting 2 dividers into 2 of the 4 gaps gives exactly a split into 3 parts.",
   "steps": [
    "Dividers in the 1st and 4th gaps give the parts 1, 3, 1.",
    "Picking 2 gaps out of 4 can be done in (4 × 3) ÷ (2 × 1) = 6 ways; step by step: × 3, ÷ 1, × 4, ÷ 2 — 4 steps instead of 125 triples."
   ]
  }
 },
 "BitmaskSubsetEnumeration": {
  "ru": {
   "task": "Есть три игрушки: А, Б и В. Нужно перечислить все способы выбрать ровно две из них.",
   "headOn": "В лоб: выписываем каждый возможный выбор отдельным списком — 8 списков, в которых 0 + 1 + 1 + 2 + 1 + 2 + 2 + 3 = 12 записанных игрушек.",
   "notice": "Любой выбор можно записать тремя цифрами: 1 — игрушку взяли, 0 — нет. Например, 101 — взяли В и А. Все выборы — это просто числа от 0 до 7, записанные нулями и единицами.",
   "steps": [
    "Перебираем числа от 0 до 7: цифры каждого числа сразу показывают, какие игрушки взяты.",
    "Оставляем числа ровно с двумя единицами: 011, 101, 110 — три способа. 8 чисел вместо 12 записей."
   ]
  },
  "en": {
   "task": "There are three toys: A, B and C. We need to list every way to choose exactly two of them.",
   "headOn": "Head-on: write each possible choice out as a separate list — 8 lists holding 0 + 1 + 1 + 2 + 1 + 2 + 2 + 3 = 12 written toys.",
   "notice": "Any choice can be written with three digits: 1 means the toy is taken, 0 means it is not. For example, 101 means C and A are taken. All the choices are just the numbers 0 to 7 written in 0s and 1s.",
   "steps": [
    "Go through the numbers 0 to 7: the digits of each number show at once which toys are taken.",
    "Keep the numbers with exactly two 1s: 011, 101, 110 — three ways. 8 numbers instead of 12 writes."
   ]
  }
 }
};

// steps from the story (captions = story sentences, one source of truth: stories/<Id>.json → ST)
function mkSteps(id, tags){
  var s = ST[id], out = [], T = [['задача', 'task'], ['в лоб', 'head-on'], ['замечаем', 'notice']].concat(tags);
  var parts = [['problem', 'task'], ['problem', 'headOn'], ['idea', 'notice']];
  parts.forEach(function(p, k){ out.push({chapter: p[0], caption: {ru: s.ru[p[1]], en: s.en[p[1]]}, tag: {ru: T[k][0], en: T[k][1]}}); });
  s.ru.steps.forEach(function(x, k){ out.push({chapter: 'solve', caption: {ru: x, en: s.en.steps[k]}, tag: {ru: T[3 + k][0], en: T[3 + k][1]}}); });
  return out;
}
// head-on board: hidden on the task step, counts up on the head-on step, then stays
function headOnBoard(s, i, n, o){
  o = o || {};
  if(i === 0){ s.ops.fadeOut(); return; }
  s.ops.fadeIn(); s.ops.color('red');
  if(i === 1){ s.ops.set(0, {ms: 0}); s.ops.set(n, {ms: o.ms || 1600, delay: o.delay || 250}); }
  else s.ops.set(n);
}
function doneBoard(s, j, v, note, last){
  if(j < 0 || v == null){ s.done.fadeOut(); return; }
  s.done.fadeIn(); s.done.set(v, {delay: 300}); if(note != null) s.done.setNote(note); s.done.color(last ? 'green' : 'violet');
}

/* ================= InclusionExclusion =================
 * Numbers 1…180: divisible by 2 — 90, by 3 — 60, by both (= by 6) — 30; answer 120.
 * head-on: 90 + 60 = 150 checks for repeats. Counted: 3 divisions + 1 addition + 1 subtraction = 5 steps. */
LAB.register({
  id: 'InclusionExclusion',
  steps: mkSteps('InclusionExclusion', [['деления', 'divisions'], ['сложили', 'add'], ['вычли', 'subtract']]),
  view: {yaw: 0.18, pitch: 0.95, fill: 0.92},
  build: function(api){
    var L = api.L, s = {blue: [], red: []}, W = 0.96, H = 0.4, x0 = -6;
    s.H = H;
    s.bx = function(k){ return x0 + 0.5 + k; };                        // block k = numbers 10k+1…10k+10 of the bar
    for(var k = 0; k < 9; k++) s.blue.push(api.box([W, H, 1.0], {pos: [s.bx(k), 0, 0], color: 'blue'}));
    for(k = 0; k < 6; k++) s.red.push(api.box([W, H, 1.0], {pos: [s.bx(k + 6), 0, 1.4], color: 'red'}));
    s.tb = api.text(L('делятся на 2: 90 чисел', 'divide by 2: 90 numbers'), [x0, 0, -0.95], {size: 0.4, color: 'blue', align: 'left'});
    s.tr = api.text(L('делятся на 3: 60 чисел', 'divide by 3: 60 numbers'), [s.bx(6) - 0.5, 0, 2.35], {size: 0.4, color: 'red', align: 'left'});
    s.div = [['180 ÷ 2', 90, 'blue'], ['180 ÷ 3', 60, 'red'], ['180 ÷ 6', 30, 'violet']].map(function(d, k){
      var t = api.tile(d[1], {pos: [-3 + k*3, 0, -3.1], color: d[2], size: 1.0, h: 0.4});
      return {t: t, m: api.marks(t, [{text: d[0], color: 'amber'}], {dir: 'front'})};
    });
    s.call = api.label('', [s.bx(7), 0.9, 0.7], {color: 'violet'});
    s.pieces = [['60', 3, 'blue', L('только на 2', 'by 2 only')], ['30', 7, 'violet', L('и на 2, и на 3', 'by both')], ['30', 10, 'red', L('только на 3', 'by 3 only')]].map(function(p){
      var x = s.bx(p[1]) - (p[1] === 3 ? 0.5 : 0);
      return {n: api.text(p[0], [x, H + 0.02, 0], {size: 0.8, color: p[2]}), l: api.text(p[3], [x, 0, 1.0], {size: 0.4, color: p[2]})};
    });
    s.sum = api.text('60 + 30 + 30 = 120', [0, 0, 2.1], {size: 0.62, color: 'green'});
    s.ops = api.counter(L('проверок в лоб', 'head-on checks'), {pos: [-3.6, 0, 4.2], w: 3.6, d: 1.6, noteSize: 0.38, noteFitValue: 150,
      note: function(v){ return v <= 90 ? L('делятся на 2: ', 'divide by 2: ') + v : L('90 (на 2) + ', '90 (by 2) + ') + (v - 90) + L(' (на 3)', ' (by 3)'); }});
    s.done = api.counter(L('действий', 'steps'), {pos: [3.6, 0, 4.2], w: 3.6, d: 1.6, color: 'violet', noteSize: 0.38, note: ''});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3, H = s.H;
    headOnBoard(s, i, 150, {ms: 15*130});
    s.blue.forEach(function(b, k){
      var shared = k >= 6;
      b.fadeIn({delay: i === 1 ? 250 + k*130 : 0}); b.color((i === 2 || j >= 1) && shared ? 'violet' : 'blue'); b.lift(0);
    });
    s.red.forEach(function(b, k){
      var shared = k < 3, z = 1.4, lift = 0;
      if(j >= 1){ z = 0; lift = H + 0.02; }
      if(j === 2) lift = 0;
      if(j === 2 && shared) b.fadeOut({delay: 200}); else b.fadeIn({delay: i === 1 ? 250 + (9 + k)*130 : 0});
      b.moveTo([s.bx(k + 6), 0, z]); b.lift(lift); b.color((i === 2 || j >= 1) && shared ? 'violet' : 'red');
    });
    vis(s.tb, j < 2); vis(s.tr, j < 1);
    var ct = [null, L('6, 12, 18… есть в обоих списках', '6, 12, 18… are on both lists'), L('делятся и на 2, и на 3 — то есть на 6', 'divide by 2 and by 3 — that is, by 6'),
              null, L('эти 30 чисел лежат двумя слоями', 'these 30 numbers lie in two layers'), null][i];
    if(ct){ s.call.setText(ct); s.call.show(true, {delay: 400}); } else s.call.show(false);
    s.div.forEach(function(d, k){ vis(d.t, j >= 0, {delay: j === 0 ? k*300 : 0}); d.m.show(j >= 0 ? 1 : 0, {delay: j === 0 ? 200 + k*300 : 0}); });
    s.pieces.forEach(function(p, k){ vis(p.n, j === 2, {delay: 400 + k*120}); vis(p.l, j === 2, {delay: 400 + k*120}); });
    vis(s.sum, j === 2, {delay: 800});
    doneBoard(s, j, [3, 4, 5][j], [L('3 деления', '3 divisions'), L('3 деления + 1 сложение', '3 divisions + 1 addition'), L('3 деления + 1 сложение + 1 вычитание', '3 divisions + 1 addition + 1 subtraction')][j], j === 2);
  }
});

/* ================= VennDiagram (pilot of NARRATIVE.md) =================
 * 90 pupils go to football, 63 to chess, 36 of them to both.
 * head-on: 90 + 63 = 153 (wrong — the 36 who go to both are counted twice)
 * circles: 90 − 36 = 54 football only, 63 − 36 = 27 chess only, 54 + 36 + 27 = 117      */
LAB.register({
  id: 'VennDiagram',
  steps: [
    {chapter: 'problem', caption: {ru: '90 учеников ходят на футбол, 63 — на шахматы, 36 из них ходят и туда, и туда. Сколько всего разных учеников?', en: '90 students play football, 63 play chess, and 36 of them do both. How many different students are there in total?'}, tag: {ru: 'задача', en: 'task'}},
    {chapter: 'problem', caption: {ru: 'В лоб: складываем 90 + 63 = 153. Но так 36 учеников, которые ходят в обе секции, посчитаны дважды, и ответ неверный.', en: 'Head-on: add 90 + 63 = 153. But that counts the 36 students who do both twice, so the answer is wrong.'}, tag: {ru: 'в лоб', en: 'head-on'}},
    {chapter: 'idea', caption: {ru: 'Нарисуем каждую секцию кругом и наложим круги: 36 учеников, которые ходят в обе секции, окажутся в общей части. Тогда каждого ученика можно посчитать ровно один раз.', en: 'Draw each club as a circle and let the circles overlap: the 36 students who do both land in the shared part. Now every student can be counted exactly once.'}, tag: {ru: 'замечаем', en: 'notice'}},
    {chapter: 'solve', caption: {ru: 'Только футбол: 90 − 36 = 54 ученика. Только шахматы: 63 − 36 = 27 учеников.', en: 'Football only: 90 − 36 = 54 students. Chess only: 63 − 36 = 27 students.'}, tag: {ru: 'части', en: 'parts'}},
    {chapter: 'solve', caption: {ru: 'Складываем три части: 54 + 36 + 27 = 117 разных учеников — каждый посчитан один раз.', en: 'Add the three parts: 54 + 36 + 27 = 117 different students — each counted once.'}, tag: {ru: 'сумма', en: 'sum'}}
  ],
  view: {yaw: 0.2, pitch: 0.95, fill: 0.9},
  build: function(api){
    var L = api.L;
    var R = 2, C = 1.2, hA = 0.3, hB = 0.26, hL = 0.38, s = {R: R, C: C, hA: hA, hB: hB, hL: hL};
    s.A = disc(api, R, hA, [-2.15, 0, 0], 'blue');
    s.B = disc(api, R, hB, [2.15, 0, 0], 'red');
    s.L = lens(api, R, C, hL, [0, 0, 0], 'violet');
    s.t90 = api.text('90', [-2.15, hA + 0.01, 0], {size: 0.85, color: 'blue'});
    s.t63 = api.text('63', [2.15, hB + 0.01, 0], {size: 0.85, color: 'red'});
    s.t36 = api.text('36', [0, hL + 0.01, 0], {size: 0.85, color: 'violet'});
    s.t54 = api.text('54', [-2.1, hA + 0.01, 0], {size: 0.85, color: 'blue'});
    s.t27 = api.text('27', [2.1, hB + 0.01, 0], {size: 0.85, color: 'red'});
    s.nA = api.text(L('футбол', 'football'), [-2.4, 0, -2.5], {size: 0.5, color: 'blue'});
    s.nB = api.text(L('шахматы', 'chess'), [2.4, 0, -2.5], {size: 0.5, color: 'red'});
    s.lTw = api.label(L('эти 36 учеников есть и в 90, и в 63', 'these 36 students are in both the 90 and the 63'), [0, 0.3, 1.6], {color: 'red'});
    s.lL = api.label(L('36 ходят в обе секции', '36 do both'), [0, hL, -0.8], {color: 'violet'});
    s.sum = api.text('54 + 36 + 27 = 117', [0, 0, 2.7], {size: 0.62, color: 'green'});
    s.ops = api.counter(L('учеников, если сложить', 'students, if we just add'), {pos: [-3.6, 0, 4.9], w: 3.6, d: 1.6, noteSize: 0.38, noteFitValue: 153, color: 'red',
      note: function(v){ return v <= 90 ? L('футбол: ', 'football: ') + v : L('90 футбол + ', '90 football + ') + (v - 90) + L(' шахматы — 36 дважды', ' chess: 36 twice'); }});
    s.done = api.counter(L('учеников по частям', 'students, part by part'), {pos: [4.0, 0, 4.9], w: 3.6, d: 1.6, color: 'violet', noteSize: 0.38, note: ''});
    return s;
  },
  step: function(api, s, i){
    var L = api.L;
    var j = i - 3, x = i <= 1 ? 2.15 : s.C;
    if(i === 0) s.ops.fadeOut();
    else { s.ops.fadeIn(); if(i === 1){ s.ops.set(0, {ms: 0}); s.ops.set(153, {ms: 1800, delay: 250}); } else s.ops.set(153); }
    s.A.moveTo([-x, 0, 0]); s.B.moveTo([x, 0, 0]);
    s.t90.moveTo([i <= 1 ? -2.15 : -2.1, s.hA + 0.01, 0]); s.t63.moveTo([i <= 1 ? 2.15 : 2.1, s.hB + 0.01, 0]);
    vis(s.t90, j < 0); vis(s.t63, j < 0);
    s.t90.color(i === 2 ? 'dim' : 'blue'); s.t63.color(i === 2 ? 'dim' : 'red');
    vis(s.L, i >= 2, {delay: 380});
    vis(s.t36, i >= 2, {delay: 500});
    vis(s.t54, j >= 0, {delay: 300}); vis(s.t27, j >= 0, {delay: 450});
    s.lTw.show(i === 1, {delay: 1900}); s.lL.show(i === 2, {delay: 600});
    vis(s.sum, j === 1, {delay: 500});
    if(j < 0) s.done.fadeOut();
    else { s.done.fadeIn(); s.done.set(j === 0 ? 81 : 117, {delay: 300}); s.done.setNote(j === 0 ? L('54 только футбол + 27 только шахматы', '54 football only + 27 chess only') : L('54 + 36 в обеих + 27', '54 + 36 in both + 27')); s.done.color(j === 1 ? 'green' : 'violet'); }
  }
});


/* ================= LookupTable =================
 * English words for 0…19. head-on: compare 11 with 0, 1, …, 11 = 12 checks.
 * boxes: 20 writes (once) + 1 read = 21; the second question (17) costs 1 more read,
 * while checking one by one needs 18 more: 22 vs 30.                                              */
var NAMES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
LAB.register({
  id: 'LookupTable',
  steps: mkSteps('LookupTable', [['раскладка', 'fill boxes'], ['вопрос 11', 'question 11'], ['вопрос 17', 'question 17']]),
  view: {yaw: 0.08, pitch: 1.05, fill: 0.95},
  build: function(api){
    var L = api.L, s = {cells: [], words: [], idx: [], cmp: [], wr: []};
    s.x = function(k){ return (k % 10 - 4.5)*1.95; };
    s.z = function(k){ return k < 10 ? -0.9 : 1.0; };
    NAMES.forEach(function(nm, k){
      var x = s.x(k), z = s.z(k);
      s.cells.push(api.box([1.8, 0.25, 1.45], {pos: [x, 0, z], color: 'plain'}));
      s.idx.push(api.badge(String(k), {pos: [x - 0.52, 0.26, z - 0.42], color: 'plain', w: 0.62, d: 0.34}));
      s.words.push(api.text(nm, [x, 0.26, z + 0.02], {size: 0.36, color: 'ink'}));
      s.cmp.push(k <= 11 ? api.badge(k === 11 ? '= 11' : '≠ 11', {pos: [x + 0.4, 0.26, z - 0.42], color: k === 11 ? 'green' : 'red', w: 0.8, d: 0.34}) : null);
      s.wr.push(api.badge(L('запись', 'write'), {pos: [x + 0.35, 0.26, z - 0.42], color: 'teal', w: 1.0, d: 0.34}));
    });
    s.key = api.tile(11, {pos: [-11.2, 0, 1.0], color: 'blue', size: 1.0, h: 0.45});
    s.key17 = api.tile(17, {pos: [11.2, 0, 1.0], color: 'blue', size: 1.0, h: 0.45});
    s.a11 = api.arrow(s.key, [s.x(11), 0.3, 1.0], {color: 'green', bend: 1.2});
    s.a17 = api.arrow(s.key17, [s.x(17), 0.3, 1.0], {color: 'green', bend: 1.2});
    s.call = api.label('', s.cells[11], {color: 'violet', dy: 0.5});
    s.ops = api.counter(L('сверок по очереди', 'one-by-one checks'), {pos: [-5.4, 0, 4.2], w: 3.8, d: 1.6, noteSize: 0.38, noteFitValue: 30,
      note: function(v){ return v <= 12 ? L('сверили 11 с подсказками 0…', 'compared 11 with hints 0…') + Math.max(0, v - 1) : L('12 (для 11) + ', '12 (for 11) + ') + (v - 12) + L(' (для 17)', ' (for 17)'); }});
    s.done = api.counter(L('действий с ячейками', 'steps with boxes'), {pos: [4.6, 0, 4.2], w: 3.8, d: 1.6, color: 'violet', noteSize: 0.38, note: ''});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3;
    headOnBoard(s, i, 12, {ms: 12*170});
    if(j === 2) s.ops.set(30, {delay: 300});
    s.cells.forEach(function(b, k){
      var hit = (j >= 1 && k === 11) || (j === 2 && k === 17);
      b.color(hit ? 'green' : j >= 0 ? (j === 0 ? 'teal' : 'dim') : i === 2 && k === 11 ? 'violet' : 'plain', {delay: j === 0 ? k*60 : 0});
      b.lift(hit ? 0.25 : 0); s.words[k].lift(hit ? 0.25 : 0); s.idx[k].lift(hit ? 0.25 : 0);
      s.idx[k].color(i === 2 ? 'violet' : 'plain');
      if(s.cmp[k]) vis(s.cmp[k], i === 1, {delay: 250 + k*170});
      vis(s.wr[k], j === 0, {delay: k*60});
    });
    vis(s.a11, j >= 1, {delay: 200}); vis(s.key17, j === 2); vis(s.a17, j === 2, {delay: 200});
    var ct = [null, L('совпало только на 12-й проверке', 'a match only on the 12th check'), L('номер ячейки = число', 'box number = the number'), null,
              L('eleven — одно чтение', 'eleven — one read'), L('17 по очереди — ещё 18 сверок', '17 one by one — 18 more checks')][i];
    if(ct){ s.call.to(i === 5 ? s.cells[17] : s.cells[11]); s.call.setText(ct); s.call.color(i === 2 ? 'violet' : i === 1 ? 'red' : 'green'); s.call.show(true, {delay: i === 1 ? 2300 : 400}); } else s.call.show(false);
    doneBoard(s, j, [20, 21, 22][j], [L('20 записей', '20 writes'), L('20 записей + 1 чтение', '20 writes + 1 read'), L('20 записей + 2 чтения', '20 writes + 2 reads')][j], j === 2);
  }
});

/* ================= Precomputation =================
 * Questions 16, 25, 30: can it be made as n × n?
 * head-on: 1×1, 2×2, … for every question until reaching it: 4 + 5 + 6 = 15 multiplications.
 * once: 1×1…5×5 (5 multiplications) + 3 look-ups = 8.                                              */
LAB.register({
  id: 'Precomputation',
  steps: mkSteps('Precomputation', [['заранее', 'in advance'], ['сверки', 'look-ups']]),
  view: {yaw: 0.2, pitch: 0.95, fill: 0.9},
  build: function(api){
    var L = api.L, s = {};
    s.q = api.row([16, 25, 30], {gap: 3, pos: [0, 0, -2.2], size: 1.0, h: 0.42});
    var lists = [['1×1=1', '2×2=4', '3×3=9', {text: '4×4=16', color: 'green'}],
                 ['1×1=1', '2×2=4', '3×3=9', '4×4=16', {text: '5×5=25', color: 'green'}],
                 ['1×1=1', '2×2=4', '3×3=9', '4×4=16', '5×5=25', {text: '6×6=36', color: 'red'}]];
    s.m = lists.map(function(Ls, k){ return api.marks(s.q.at(k), Ls, {dir: 'front', color: 'amber', gap: 0.52}); });
    s.leg = api.text(L('зелёная метка — совпало, красная — перескочили', 'green tag: a match; red tag: went past'), [-4.6, 0, -3.6], {size: 0.4, color: 'ink', align: 'left'});
    s.sq = api.row([1, 4, 9, 16, 25], {gap: 1.5, pos: [0, 0, 1.2], size: 1.0, h: 0.42, color: 'amber'});
    s.pw = [1, 2, 3, 4, 5].map(function(n, k){ return api.text(n + '×' + n, [s.sq.pos(k)[0], 0, 2.1], {size: 0.4, color: 'amber'}); });
    s.t36 = api.tile(36, {pos: [4.5, 0, 1.2], color: 'red', size: 1.0, h: 0.2, strike: true});
    s.chk = [0, 1, 2].map(function(k){ return api.marks(s.q.at(k), [{text: k < 2 ? L('есть', 'found') : L('нет', 'no'), color: k < 2 ? 'green' : 'red'}], {dir: 'front'}); });
    s.a16 = api.arc(s.q.at(0), s.sq.at(3), {color: 'green', height: 1.4, head: true});
    s.a25 = api.arc(s.q.at(1), s.sq.at(4), {color: 'green', height: 1.4, head: true});
    s.call = api.label('', s.sq.at(2), {color: 'violet'});
    s.ops = api.counter(L('умножений в лоб', 'head-on multiplications'), {pos: [-3.6, 0, 5.4], w: 3.8, d: 1.6, noteSize: 0.38, noteFitValue: 15,
      note: function(v){ return v <= 4 ? L('для 16: ', 'for 16: ') + v : v <= 9 ? L('4 (для 16) + ', '4 (for 16) + ') + (v - 4) : L('4 + 5 + ', '4 + 5 + ') + (v - 9) + L(' (для 30)', ' (for 30)'); }});
    s.done = api.counter(L('действий', 'steps'), {pos: [4.2, 0, 5.4], w: 3.6, d: 1.6, color: 'violet', noteSize: 0.38, note: ''});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3, start = [0, 4, 9];
    headOnBoard(s, i, 15, {ms: 15*140, delay: 200});
    s.m.forEach(function(m, k){ m.show(i === 1 ? m.items.length : 0, {delay: 200 + start[k]*140, every: 140}); });
    vis(s.leg, i === 1);
    s.q.each(function(t, k){ t.color(j === 1 ? (k < 2 ? 'green' : 'red') : 'plain', {delay: j === 1 ? 400 + k*200 : 0}); t.strike(j === 1 && k === 2, {delay: 900}); });
    s.sq.each(function(t, k){
      vis(t, i >= 2, {delay: j === 0 ? k*200 : 0}); vis(s.pw[k], i >= 2, {delay: j === 0 ? k*200 : 0});
      var hit = j === 1 && k >= 3;
      t.color(i === 2 ? 'violet' : hit ? 'green' : 'amber'); t.lift(hit ? 0.3 : 0);
      s.pw[k].color(i === 2 ? 'violet' : 'amber');
    });
    vis(s.t36, j === 0, {delay: 1100});
    s.chk.forEach(function(m, k){ m.show(j === 1 ? 1 : 0, {delay: 300 + k*250}); });
    vis(s.a16, j === 1, {delay: 300}); vis(s.a25, j === 1, {delay: 550});
    var ct = [null, null, L('одни и те же для всех трёх вопросов', 'the same for all three questions'), L('6 × 6 = 36 — больше 30, не нужно', '6 × 6 = 36 is past 30 — not needed'), L('30 нет в списке', '30 is not in the list')][i];
    if(ct){ s.call.to(i === 3 ? s.t36 : i === 4 ? s.q.at(2) : s.sq.at(2)); s.call.setText(ct); s.call.color(i === 2 ? 'violet' : 'red'); s.call.show(true, {delay: 500}); } else s.call.show(false);
    doneBoard(s, j, [5, 8][j], [L('5 умножений (один раз)', '5 multiplications (once)'), L('5 умножений + 3 сверки', '5 multiplications + 3 look-ups')][j], j === 1);
  }
});

/* ================= OfflineAlgorithm =================
 * Question k: how many primes from 1 to k? Needs a table 1…k (up to 12: 5, up to 30: 10, up to 7: 4).
 * head-on: a fresh table per question, 12 + 30 + 7 = 49 cells. Read all first: one table 1…30 = 30 cells. */
LAB.register({
  id: 'OfflineAlgorithm',
  steps: mkSteps('OfflineAlgorithm', [['таблица', 'table'], ['ответы', 'answers']]),
  view: {yaw: 0.15, pitch: 0.95, fill: 0.92},
  build: function(api){
    var L = api.L, s = {rows: []}, B = [12, 30, 7], CW = 0.3, X0 = -5.4;
    s.cx = function(c){ return X0 + CW/2 + c*CW; };
    B.forEach(function(b, r){
      var z = -3.0 + r*1.4, cells = [];
      for(var c = 0; c < b; c++) cells.push(api.box([CW - 0.04, 0.3, 0.7], {pos: [s.cx(c), 0, z], color: 'red'}));
      s.rows.push({q: api.tile(b, {pos: [-6.4, 0, z], color: 'blue', size: 0.9, h: 0.4}), cells: cells, b: b, z: z});
    });
    s.green = [];
    for(var c = 0; c < 30; c++) s.green.push(api.box([CW - 0.04, 0.3, 0.7], {pos: [s.cx(c), 0, 1.9], color: 'green'}));
    s.ticks = [7, 12, 30].map(function(v){ return api.text(String(v), [s.cx(v - 1), 0, 1.25], {size: 0.4, color: 'green'}); });
    s.ans = [[L('до 12: 5', 'up to 12: 5'), 12], [L('до 30: 10', 'up to 30: 10'), 30], [L('до 7: 4', 'up to 7: 4')]].map(function(a, k){
      var v = [12, 30, 7][k];
      var p = plate(api, a[0], [-4.2 + k*3.6, 0, 3.4], {w: 3.0, d: 0.8, color: 'green', size: 0.36});
      return {p: p, ar: api.arrow([s.cx(v - 1), 0.32, 2.3], [-4.2 + k*3.6, 0.32, 2.95], {color: 'green'})};
    });
    s.call = api.label('', s.rows[1].q, {color: 'red'});
    s.ops = api.counter(L('клеток: таблица на каждый вопрос', 'cells: a table per question'), {pos: [-3.6, 0, 5.6], w: 3.9, d: 1.6, noteSize: 0.38, noteFitValue: 49,
      note: function(v){ return v <= 12 ? L('для 12: ', 'for 12: ') + v : v <= 42 ? L('12 + для 30: ', '12 + for 30: ') + (v - 12) : L('12 + 30 + для 7: ', '12 + 30 + for 7: ') + (v - 42); }});
    s.done = api.counter(L('клеток: одна таблица', 'cells: one table'), {pos: [4.2, 0, 5.6], w: 3.6, d: 1.6, color: 'violet', noteSize: 0.38, note: L('одна таблица до 30', 'one table up to 30')});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3;
    headOnBoard(s, i, 49, {ms: 49*50, delay: 200});
    var start = [0, 12, 42];
    s.rows.forEach(function(r, k){
      r.q.color(i === 2 ? (k === 1 ? 'violet' : 'dim') : j >= 0 ? 'dim' : 'blue'); r.q.lift(i === 2 && k === 1 ? 0.3 : 0);
      r.cells.forEach(function(c, n){ vis(c, i >= 1, {delay: i === 1 ? 200 + (start[k] + n)*50 : 0}); c.color(i >= 2 ? 'dim' : 'red'); });
    });
    s.green.forEach(function(b, n){ vis(b, j >= 0, {delay: j === 0 ? n*50 : 0}); });
    s.ticks.forEach(function(t){ vis(t, j >= 0, {delay: j === 0 ? 1500 : 0}); });
    s.ans.forEach(function(a, k){ vis(a.p, j === 1, {delay: 300 + k*300}); vis(a.ar, j === 1, {delay: 200 + k*300}); });
    var ct = [null, L('таблица для 30 строится с нуля: 1…12 — повторно', 'the table for 30 starts from scratch: 1…12 again'), L('самая большая граница — 30', 'the largest limit is 30'), null, null][i];
    if(ct){ s.call.setText(ct); s.call.color(i === 2 ? 'violet' : 'red'); s.call.show(true, {delay: i === 1 ? 2600 : 300}); } else s.call.show(false);
    doneBoard(s, j, 30, null, j === 1);
  }
});

/* ================= LazyInitialization =================
 * Two runs of a program: run 1 asks the table (1000 cells), run 2 never does.
 * head-on: build at the start of each run — 2 × 1000 = 2000 cells. With a ready flag: 1000 + 0 = 1000.    */
LAB.register({
  id: 'LazyInitialization',
  steps: mkSteps('LazyInitialization', [['отметка', 'flag'], ['итог', 'result']]),
  view: {yaw: 0.15, pitch: 0.95, fill: 0.92},
  build: function(api){
    var L = api.L, s = {}, zA = -2.2, zN = -0.8, qx = [0.2, 1.8, 3.4];
    s.nA = api.text(L('запуск 1', 'run 1'), [-6.4, 0, zA], {size: 0.42, align: 'right', color: 'ink'});
    s.nN = api.text(L('запуск 2', 'run 2'), [-6.4, 0, zN], {size: 0.42, align: 'right', color: 'ink'});
    s.tabA = plate(api, L('таблица', 'table'), [-5.2, 0, zA], {w: 1.8, color: 'amber', size: 0.38});
    s.tabN = plate(api, L('таблица', 'table'), [-5.2, 0, zN], {w: 1.8, color: 'red', size: 0.38});
    s.hop = hopper(api, s.tabA);
    s.bA = api.badge(L('+1000 клеток', '+1000 cells'), {pos: [-7.3, 0, zA + 0.7], color: 'amber'});
    s.bN = api.badge(L('+1000 клеток', '+1000 cells'), {pos: [-7.3, 0, zN + 0.7], color: 'red'});
    s.flagA = plate(api, L('не готово', 'not ready'), [-2.2, 0, zA], {w: 2.2, color: 'violet', size: 0.34});
    s.flagN = plate(api, L('не готово', 'not ready'), [-2.2, 0, zN], {w: 2.2, color: 'violet', size: 0.34});
    s.qA = [L('другое', 'other'), L('вопрос', 'question'), L('вопрос', 'question')].map(function(t, k){ return plate(api, t, [qx[k], 0, zA], {w: 1.4, color: k ? 'violet' : 'plain', size: 0.32}); });
    s.qN = [0, 1, 2].map(function(k){ return plate(api, L('другое', 'other'), [qx[k], 0, zN], {w: 1.4, color: 'plain', size: 0.32}); });
    s.tailA = api.text('', [4.4, 0, zA], {size: 0.38, align: 'left', color: 'amber'});
    s.tailN = api.text('', [4.4, 0, zN], {size: 0.38, align: 'left', color: 'red'});
    s.leg = api.text(L('вопрос — обращение к таблице; другое — дело, где таблица не нужна', 'question: asks the table; other: a job that does not need it'), [-7.6, 0, -3.6], {size: 0.38, color: 'ink', align: 'left'});
    var zG = 2.0;
    s.gate = [plate(api, L('вопрос', 'question'), [-4.4, 0, zG], {w: 1.6, color: 'violet', size: 0.34}),
              plate(api, L('отметка', 'flag'), [-1.9, 0, zG], {w: 1.6, color: 'violet', size: 0.36}),
              plate(api, L('строим таблицу', 'build the table'), [2.4, 0, zG - 0.8], {w: 2.9, color: 'amber', size: 0.34}),
              plate(api, L('читаем готовое', 'read what is there'), [2.4, 0, zG + 0.8], {w: 2.9, color: 'green', size: 0.34}),
              api.arrow([-3.55, 0.2, zG], [-2.75, 0.2, zG], {color: 'ink'}),
              api.arrow([-1.05, 0.2, zG - 0.15], [0.9, 0.2, zG - 0.8], {color: 'amber'}),
              api.arrow([-1.05, 0.2, zG + 0.15], [0.9, 0.2, zG + 0.8], {color: 'green'}),
              api.text(L('не готово', 'not ready'), [-0.1, 0, zG - 0.95], {size: 0.32, color: 'amber'}),
              api.text(L('готово', 'ready'), [-0.1, 0, zG + 1.0], {size: 0.32, color: 'green'})];
    s.call = api.label('', s.qN[2].t, {color: 'red', dy: 0.3});
    s.ops = api.counter(L('клеток, если строить при старте', 'cells, if built at start'), {pos: [-3.6, 0, 5.2], w: 3.6, d: 1.6, noteSize: 0.38, noteFitValue: 2000, quant: 1000,
      note: function(v){ return v < 2000 ? L('запуск 1: ', 'run 1: ') + v : L('2 запуска × 1000 клеток', '2 runs × 1000 cells'); }});
    s.done = api.counter(L('клеток, если строить по вопросу', 'cells, if built on request'), {pos: [4.2, 0, 5.2], w: 3.6, d: 1.6, color: 'violet', noteSize: 0.38, note: ''});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3;
    headOnBoard(s, i, 2000, {ms: 1200});
    vis(s.tabA, i >= 1); vis(s.tabN, i >= 1 && j < 1);
    vis(s.bA, i === 1, {delay: 300}); vis(s.bN, i === 1, {delay: 900});
    s.tabA.color(i === 2 || j === 0 ? 'dim' : 'amber'); s.tabN.color(i === 1 ? 'red' : 'dim');
    s.hop(j === 1 ? [7.0, 0.33, 0] : [0, 0, 0], 1.2, {delay: 200});
    [s.flagA, s.flagN].forEach(function(f, k){ vis(f, i >= 2, {delay: i === 2 ? 200 + k*200 : 0}); });
    s.flagA.setText(j === 1 ? L('готово', 'ready') : L('не готово', 'not ready')); s.flagA.color(j === 1 ? 'green' : 'violet');
    s.qA.forEach(function(q, k){ q.color(k === 0 ? 'plain' : j === 0 ? 'dim' : 'violet'); q.lift(i === 2 && k === 1 ? 0.3 : 0); });
    s.qN.forEach(function(q){ q.color(j === 0 ? 'dim' : 'plain'); });
    s.tailA.setText(j === 1 ? L('1000 клеток', '1000 cells') : i >= 1 ? L('таблица нужна', 'table needed') : '');
    s.tailN.setText(j === 1 ? L('0 клеток', '0 cells') : i >= 1 ? L('1000 клеток впустую', '1000 cells for nothing') : '');
    s.tailN.color(j === 1 ? 'green' : 'red');
    vis(s.leg, i === 0);
    s.gate.forEach(function(t, k){ vis(t, j === 0, {delay: k*90}); });
    var ct = [null, L('таблицу ни разу не спросили', 'nobody asked for the table'), L('первый вопрос видит «не готово» и строит', 'the first question sees “not ready” and builds'), null, null][i];
    if(ct){ s.call.to(i === 2 ? s.qA[1].t : s.qN[2].t); s.call.setText(ct); s.call.color(i === 2 ? 'violet' : 'red'); s.call.show(true, {delay: 900}); } else s.call.show(false);
    doneBoard(s, j, j === 0 ? 0 : 1000, j === 0 ? L('пока ни одного вопроса', 'no questions yet') : L('запуск 1: 1000 + запуск 2: 0', 'run 1: 1000 + run 2: 0'), j === 1);
  }
});

/* ================= PrefixSum =================
 * Row 3 1 4 5 9 2 6 8, question: sum of places 3…6 = 4 + 5 + 9 + 2 = 20.
 * head-on: 3 additions per question. Running totals: 7 additions once + 1 subtraction per question;
 * over 4 questions 7 + 4 = 11 < 4 × 3 = 12.                                                         */
LAB.register({
  id: 'PrefixSum',
  steps: mkSteps('PrefixSum', [['суммы от начала', 'running totals'], ['вычитание', 'subtract'], ['окупилось', 'paid off']]),
  view: {yaw: 0.25, pitch: 0.78, fill: 0.9},
  build: function(api){
    var L = api.L, a = [3, 1, 4, 5, 9, 2, 6, 8], P = [3, 4, 8, 13, 22, 24, 30, 38], s = {P: P, H: 2.6};
    s.row = api.row(a, {gap: 1.15, pos: [0, 0, 1.0], h: 0.34});
    s.pos = a.map(function(_, k){ return api.text(String(k + 1), [s.row.pos(k)[0], 0, 1.85], {size: 0.36, color: 'ink'}); });
    s.posT = api.text(L('место', 'place'), [s.row.pos(0)[0] - 0.7, 0, 1.85], {size: 0.36, color: 'ink', align: 'right'});
    s.bars = P.map(function(v, k){ return api.bar(v, 38, {pos: [s.row.pos(k)[0], 0, -0.6], height: 2.6, size: 0.85, color: 'teal'}); });
    s.br = api.bracket(s.row.at(2), s.row.at(5), {color: 'blue', text: L('места 3–6: сумма ?', 'places 3–6: sum ?'), dz: 1.45});
    s.lad = ['4 + 5 = 9', '9 + 9 = 18', '18 + 2 = 20'].map(function(t, n){ return api.badge(t, {pos: [s.row.pos(3 + n)[0], 0, -0.1 - n*0.62], color: 'red'}); });
    s.prep = ['3 + 1', '4 + 4', '8 + 5', '13 + 9', '22 + 2', '24 + 6', '30 + 8'].map(function(t, n){ return api.badge(t, {pos: [s.row.pos(n + 1)[0], 0, 0.2], color: 'teal', w: 1.08}); });
    s.leg = api.text(L('столбик над местом — сумма чисел от начала до этого места', 'the column over a place is the total from the start up to that place'), [-4.9, 0, 3.3], {size: 0.38, color: 'teal', align: 'left'});
    s.res = api.text('24 − 4 = 20', [0, 0, 4.4], {size: 0.7, color: 'green'});
    s.pay = api.text(L('4 вопроса: 7 + 4 = 11 против 4 × 3 = 12', '4 questions: 7 + 4 = 11 against 4 × 3 = 12'), [0, 0, 4.4], {size: 0.46, color: 'green'});
    s.call = api.label('', s.bars[5], {color: 'violet'});
    s.ops = api.counter(L('сложений в лоб', 'head-on additions'), {pos: [-3.8, 0, 6.2], w: 3.6, d: 1.6, noteSize: 0.38, noteFitValue: 12,
      note: function(v){ return v <= 3 ? [L('складываем участок…', 'adding the stretch…'), '4 + 5', '4 + 5 + 9', L('4 + 5 + 9 + 2: 3 сложения', '4 + 5 + 9 + 2: 3 additions')][v] : L('4 вопроса × 3 сложения', '4 questions × 3 additions'); }});
    s.done = api.counter(L('действий с суммами от начала', 'steps with running totals'), {pos: [4.2, 0, 6.2], w: 3.6, d: 1.6, color: 'violet', noteSize: 0.38, note: ''});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3;
    headOnBoard(s, i, 3, {ms: 3*550, delay: 500});
    if(j === 2) s.ops.set(12, {delay: 300});
    s.row.each(function(t, k){ var inR = k >= 2 && k <= 5; t.color(inR ? (i === 1 ? 'red' : 'blue') : 'plain', {delay: i === 1 && inR ? 300 + Math.max(0, k - 3)*550 : 0}); });
    s.lad.forEach(function(b, n){ vis(b, i === 1, {delay: 500 + (n + 1)*550}); });
    s.bars.forEach(function(b, k){
      var on = i >= 2;
      vis(b, on, {delay: j === 0 ? k*160 : 0}); b.height(on ? Math.max(0.02, s.H*s.P[k]/38) : 0.02, {delay: j === 0 ? k*160 : 0});
      b.color(i === 2 || j >= 1 ? (k === 5 ? 'green' : k === 1 ? 'red' : 'dim') : 'teal');
    });
    s.prep.forEach(function(b, n){ vis(b, j === 0, {delay: 200 + (n + 1)*160}); });
    vis(s.leg, j === 0);
    s.br.setText(j >= 1 ? L('места 3–6: сумма 20', 'places 3–6: sum 20') : L('места 3–6: сумма ?', 'places 3–6: sum ?')); s.br.color(j >= 1 ? 'green' : 'blue');
    vis(s.res, j === 1, {delay: 600}); vis(s.pay, j === 2, {delay: 400});
    var ct = [null, null, L('24 (первые 6) − 4 (первые 2)', '24 (first 6) − 4 (first 2)'), null, L('до 6-го места 24, до 2-го — 4', 'up to place 6: 24; up to place 2: 4'), null][i];
    if(ct){ s.call.setText(ct); s.call.show(true, {delay: 600}); } else s.call.show(false);
    doneBoard(s, j, [7, 8, 11][j], [L('7 сложений (один раз)', '7 additions (once)'), L('7 сложений + 1 вычитание', '7 additions + 1 subtraction'), L('7 сложений + 4 вычитания', '7 additions + 4 subtractions')][j], j === 2);
  }
});

/* ================= Memoization =================
 * fib(n): the row 0, 1, 1, 2, 3… where each number is the sum of the two before; fib(4) = 3.
 * head-on: 9 calculations (levels 1 + 2 + 4 + 2). With a notebook: 5 calculations + 2 reads = 7.   */
LAB.register({
  id: 'Memoization',
  steps: mkSteps('Memoization', [['записали', 'written'], ['прочитали', 'read']]),
  view: {yaw: 0.22, pitch: 0.95, fill: 0.9},
  build: function(api){
    var L = api.L;
    var nA1 = {value: 'fib(1)'}, nA0 = {value: 'fib(0)'};
    var n2a = {value: 'fib(2)', children: [nA1, nA0]}, n1 = {value: 'fib(1)'};
    var n3 = {value: 'fib(3)', children: [n2a, n1]}, n2b = {value: 'fib(2)'};
    var root = {value: 'fib(4)', children: [n3, n2b]};
    var tr = api.tree(root, {dx: 2.4, dz: 2.0, size: 1.1});
    var s = {tr: tr, root: root, n3: n3, n2a: n2a, n2b: n2b, n1: n1, nA1: nA1, nA0: nA0};
    var pb = n2b.thing.pos(), zd2 = n1.thing.pos()[2];
    s.g = [api.tile('fib(1)', {pos: [pb[0] - 1.0, 0, zd2], size: 1.1}), api.tile('fib(0)', {pos: [pb[0] + 1.0, 0, zd2], size: 1.1})];
    s.ge = s.g.map(function(t){ return api.arrow(n2b.thing, t, {color: 'red', lift: 0.02}); });
    var zc = n2b.thing.pos()[2];
    s.cache = api.tile(1, {pos: [pb[0] + 3.0, 0, zc], color: 'teal', size: 1.0, h: 0.45});
    s.cacheT = api.text(L('тетрадка: fib(2) = 1', 'notebook: fib(2) = 1'), [pb[0] + 3.0, 0, zc + 0.95], {size: 0.36, color: 'teal'});
    s.store = api.arc(n2a.thing, s.cache, {color: 'blue', height: 1.8, head: true, dashed: true});
    s.read = api.arrow(s.cache, n2b.thing, {color: 'green', bend: 0.6});
    s.calc = [root, n3, n2a, nA1, nA0].map(function(n){ return api.marks(n.thing, [{text: L('считаем', 'work out'), color: 'green'}], {dir: 'front'}); });
    s.rd = [n2b, n1].map(function(n){ return api.marks(n.thing, [{text: L('читаем', 'read'), color: 'teal'}], {dir: 'front'}); });
    s.call = api.label('', s.g[0], {color: 'red', dy: 0.35});
    var zb = Math.max(nA1.thing.pos()[2], zd2) + 2.4;
    s.ops = api.counter(L('расчётов в лоб', 'head-on calculations'), {pos: [-3.6, 0, zb], w: 3.6, d: 1.6, noteSize: 0.38, noteFitValue: 9,
      note: function(v){ return L('по уровням: ', 'by levels: ') + (v <= 1 ? String(v) : v <= 3 ? '1 + ' + (v - 1) : v <= 7 ? '1 + 2 + ' + (v - 3) : '1 + 2 + 4 + ' + (v - 7)); }});
    s.done = api.counter(L('расчётов и чтений', 'calculations and reads'), {pos: [4.4, 0, zb], w: 3.6, d: 1.6, color: 'violet', noteSize: 0.38, note: ''});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3, at = [0, 1, 3, 7], lvl = function(n){ return n._d; };
    headOnBoard(s, i, 9, {ms: 9*200, delay: 0});
    s.tr.nodes.forEach(function(n){
      var d = i === 1 ? at[lvl(n)]*200 : 0, col = 'plain';
      if(i === 1 && n === s.n2b) col = 'red';
      if(i === 2 && (n === s.n2a || n === s.n2b)) col = 'violet';
      if(j >= 0 && n === s.n2a) col = 'blue';
      if(j === 1 && (n === s.n2b || n === s.n1)) col = 'teal';
      if(j === 1 && n === s.n3) col = 'blue';
      if(j === 1 && n === s.root) col = 'green';
      n.thing.fadeIn({delay: d}); n.thing.color(col, {delay: d});
    });
    s.tr.edges.forEach(function(e){ e.fadeIn({delay: i === 1 ? at[lvl(e.to)]*200 : 0}); });
    s.g.forEach(function(t, k){ vis(t, i === 1 || i === 2, {delay: i === 1 ? (5 + k)*200 : 0}); t.color(i === 1 ? 'red' : 'dim'); });
    s.ge.forEach(function(e, k){ vis(e, i === 1 || i === 2, {delay: i === 1 ? (5 + k)*200 : 0}); e.color(i === 1 ? 'red' : 'dim'); });
    vis(s.cache, i >= 2, {delay: 300}); vis(s.cacheT, i >= 2, {delay: 300});
    vis(s.store, j === 0, {delay: 400}); vis(s.read, j === 1, {delay: 900});
    s.calc.forEach(function(m, k){ m.show(j === 1 || (j === 0 && k >= 2) ? 1 : 0, {delay: 300 + k*150}); });
    s.rd.forEach(function(m){ m.show(j === 1 ? 1 : 0, {delay: 1000}); });
    var ct = [null, L('fib(2) заново: ещё 3 расчёта', 'fib(2) again: 3 more calculations'), L('ответ fib(2) записываем в тетрадку', 'write the answer for fib(2) in the notebook'),
              L('fib(2) = 1 + 0 = 1', 'fib(2) = 1 + 0 = 1'), L('fib(4) = 2 + 1 = 3', 'fib(4) = 2 + 1 = 3')][i];
    if(ct){ s.call.to([null, s.g[0], s.cache, s.n2a.thing, s.root.thing][i]); s.call.setText(ct); s.call.color(i === 1 ? 'red' : i === 2 ? 'teal' : 'green'); s.call.show(true, {delay: i === 1 ? 1900 : 500}); } else s.call.show(false);
    doneBoard(s, j, j === 0 ? 3 : 7, j === 0 ? L('fib(1), fib(0), fib(2): 3 расчёта', 'fib(1), fib(0), fib(2): 3 calculations') : L('5 расчётов + 2 чтения', '5 calculations + 2 reads'), j === 1);
  }
});

/* ================= LatticePaths =================
 * Grid of 2 × 2 squares (3 × 3 points), moves right (R) or down (D), top-left → bottom-right.
 * head-on: every chain of 4 moves, 2⁴ = 16, keep those with 2 R and 2 D (6).
 * formula: pick 2 of 4 = (4 × 3) ÷ (2 × 1): × 3, ÷ 1, × 4, ÷ 2 — 4 steps.                             */
function opBadges(api, x, z){
  return ['× 3 → 3', '÷ 1 → 3', '× 4 → 12', '÷ 2 → 6'].map(function(t, k){ return api.badge(t, {pos: [x + k*2.1, 0, z], color: k % 2 ? 'violet' : 'amber'}); });
}
LAB.register({
  id: 'LatticePaths',
  steps: mkSteps('LatticePaths', [['по сетке', 'on the grid'], ['формула', 'formula']]),
  view: {yaw: -0.3, pitch: 0.9, fill: 0.9},
  build: function(api){
    var L = api.L, V = [[1, 1, 1], [1, 2, 3], [1, 3, 6]], g = 1.5, s = {V: V, cells: [], arcs: [], seq: []};
    s.h = function(v){ return 0.3 + 0.2*v; };
    s.px = function(c){ return -3.2 + c*g; }; s.pz = function(r){ return -1.5 + r*g; };
    for(var r = 0; r < 3; r++){ s.cells.push([]); for(var c = 0; c < 3; c++) s.cells[r].push(api.tile(V[r][c], {pos: [s.px(c), 0, s.pz(r)], h: s.h(V[r][c]), size: 0.9})); }
    for(r = 0; r < 3; r++) for(c = 0; c < 3; c++){
      if(r > 0) s.arcs.push({a: api.arc(s.cells[r - 1][c], s.cells[r][c], {color: 'blue', height: 1.9, head: true}), d: r + c, col: 'blue'});
      if(c > 0) s.arcs.push({a: api.arc(s.cells[r][c - 1], s.cells[r][c], {color: 'violet', height: 1.9, head: true}), d: r + c, col: 'violet'});
    }
    s.add = [[1, 1, '1 + 1'], [1, 2, '1 + 2'], [2, 1, '1 + 2'], [2, 2, '3 + 3']].map(function(a){ return api.marks(s.cells[a[0]][a[1]], [{text: a[2], color: 'amber'}], {dir: 'front'}); });
    s.tStart = api.text(L('старт', 'start'), [s.px(0) - 0.8, 0, s.pz(0)], {size: 0.4, color: 'blue', align: 'right'});
    s.tFin = api.text(L('финиш', 'finish'), [s.px(2) + 0.8, 0, s.pz(2)], {size: 0.4, color: 'green', align: 'left'});
    s.path = [[0, 0, 0, 1], [0, 1, 0, 2], [0, 2, 1, 2], [1, 2, 2, 2]].map(function(p){
      return api.arrow([s.px(p[1]), 0.45, s.pz(p[0])], [s.px(p[3]), 0.45, s.pz(p[2])], {color: 'violet'}); });
    var MV = [L('П', 'R'), L('Н', 'D')];
    for(var m = 0; m < 16; m++){
      var str = '', rr = 0;
      for(var b = 3; b >= 0; b--){ var bit = (m >> b) & 1; str += MV[bit]; rr += 1 - bit; }
      s.seq.push({t: api.tile(str, {pos: [2.6 + (m % 4)*1.3, 0, -1.95 + Math.floor(m/4)*1.3], size: 1.15, h: 0.2}), ok: rr === 2, m: m, first: m === 3});
    }
    s.leg = api.text(L('зелёные — ровно 2 П и 2 Н', 'green: exactly 2 R and 2 D'), [1.9, 0, 3.1], {size: 0.4, color: 'ink', align: 'left'});
    s.form = api.text('(4 × 3) ÷ (2 × 1) = 6', [0, 0, 3.9], {size: 0.62, color: 'green'});
    s.ops4 = opBadges(api, -3.1, 4.9);
    s.call = api.label('', s.cells[0][2], {color: 'violet'});
    s.ops = api.counter(L('проверенных цепочек', 'checked chains'), {pos: [-2.4, 0, 6.8], w: 3.8, d: 1.6, noteSize: 0.38, noteFitValue: 16,
      note: function(v){ return v < 16 ? v + L(' из 16', ' of 16') : '2 × 2 × 2 × 2'; }});
    s.done = api.counter(L('действий', 'steps'), {pos: [5.2, 0, 6.8], w: 3.4, d: 1.6, color: 'violet', noteSize: 0.38, note: ''});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3;
    headOnBoard(s, i, 16, {ms: 16*90, delay: 200});
    for(var r = 0; r < 3; r++) for(var c = 0; c < 3; c++){
      var t = s.cells[r][c], v = s.V[r][c], d = (r + c)*320, first = r === 0 && c === 0, last = r === 2 && c === 2, shown = j >= 0 || first;
      t.setText(shown ? v : '?', {delay: j === 0 ? d : 0});
      t.height(j >= 0 ? s.h(v) : 0.3, {delay: j === 0 ? d : 0});
      var col = first ? 'blue' : last ? 'green' : 'plain';
      if(j === 0) col = r === 0 || c === 0 ? 'blue' : 'violet';
      if(j === 1) col = last ? 'green' : 'dim';
      t.color(col, {delay: j === 0 ? d : 0});
    }
    s.arcs.forEach(function(o){ if(j !== 0) o.a.fadeOut(); else { o.a.opacity(0.45, {delay: o.d*320 - 200}); o.a.draw(1); o.a.color(o.col); } });
    s.add.forEach(function(m, k){ m.show(j === 0 ? 1 : 0, {delay: 700 + k*320}); });
    vis(s.tStart, j < 1); vis(s.tFin, j < 1);
    s.path.forEach(function(a, k){ vis(a, i === 2, {delay: 300 + k*200}); });
    s.seq.forEach(function(q){
      var d = i === 1 ? 200 + q.m*90 : 0;
      vis(q.t, i === 1 || i === 2, {delay: d});
      q.t.color(i === 1 ? (q.ok ? 'green' : 'red') : (q.ok ? 'violet' : 'dim'), {delay: d});
      q.t.lift(i === 2 && q.first ? 0.3 : 0);
    });
    vis(s.leg, i === 1);
    vis(s.form, j === 1, {delay: 300});
    s.ops4.forEach(function(b, k){ vis(b, j === 1, {delay: 600 + k*250}); });
    var ct = [null, null, L('ППНН: ходы вправо — на местах 1 и 2', 'RRDD: the right moves are in places 1 and 2'), L('в финиш — 3 сверху + 3 слева = 6', 'into the finish: 3 from above + 3 from the left = 6'),
              L('выбрать 2 места из 4', 'pick 2 places out of 4')][i];
    if(ct){ s.call.to(i === 3 ? s.cells[2][2] : i === 4 ? s.form : s.cells[0][2]); s.call.setText(ct); s.call.color(i === 2 ? 'violet' : 'green'); s.call.show(true, {delay: i === 3 ? 1400 : 700}); } else s.call.show(false);
    doneBoard(s, j, 4, j === 0 ? L('4 сложения по сетке', '4 additions on the grid') : L('2 умножения + 2 деления', '2 multiplications + 2 divisions'), j === 1);
  }
});

/* ================= DynamicProgramming =================
 * Triangle 3 / 7 4 / 2 4 6 / 8 5 9 3, best top-to-bottom sum = 23 (3 + 7 + 4 + 9).
 * head-on: 8 paths × 3 additions = 24. Bottom-up: one addition per number above the bottom row = 6.  */
var TRI = [[3], [7, 4], [2, 4, 6], [8, 5, 9, 3]], TRB = [[23], [20, 19], [10, 13, 15], [8, 5, 9, 3]];
LAB.register({
  id: 'DynamicProgramming',
  steps: mkSteps('DynamicProgramming', [['снизу вверх', 'bottom up'], ['вершина', 'top']]),
  view: {yaw: 0.3, pitch: 0.85, fill: 0.9},
  build: function(api){
    var L = api.L, pick = [[0], [1, 2], [0, 2, 2]], s = {cells: [], arcs: [], path: [[0, 0], [1, 0], [2, 1], [3, 2]], paths: []};
    s.h = function(v){ return 0.3 + 0.06*v; };
    for(var r = 0; r < 4; r++){
      s.cells.push([]);
      for(var c = 0; c <= r; c++) s.cells[r].push(api.tile(TRB[r][c], {pos: [(c - r/2)*1.5 - 1.5, 0, (r - 1.5)*1.5], h: s.h(TRB[r][c]), size: 1.0}));
    }
    for(r = 0; r < 3; r++) for(c = 0; c <= r; c++){ var k = pick[r][c]; s.arcs.push({a: api.arc(s.cells[r + 1][k], s.cells[r][c], {color: 'blue', height: 1.8, head: true}), r: r, c: c, k: k}); }
    for(var m = 0; m < 8; m++){
      var cc = 0, nums = [3];
      for(r = 1; r < 4; r++){ cc += (m >> (3 - r)) & 1; nums.push(TRI[r][cc]); }
      var sum = nums.reduce(function(a, b){ return a + b; }, 0);
      s.paths.push({t: api.text(nums.join(' + ') + ' = ' + sum, [2.6, 0, -2.4 + m*0.62], {size: 0.4, align: 'left', color: sum === 23 ? 'green' : 'red'}), m: m});
    }
    s.call = api.label('', s.cells[2][0], {color: 'violet', dy: 0.5});
    s.ops = api.counter(L('сложений в лоб', 'head-on additions'), {pos: [-3.2, 0, 5.0], w: 3.6, d: 1.6, noteSize: 0.38, noteFitValue: 24, quant: 3,
      note: function(v){ return (v/3) + ' ' + L(pl(v/3, 'путь', 'пути', 'путей'), pl(v/3, 'path', 'paths')) + L(' × 3 сложения', ' × 3 additions'); }});
    s.done = api.counter(L('сложений снизу вверх', 'bottom-up additions'), {pos: [4.4, 0, 5.0], w: 3.6, d: 1.6, color: 'violet', noteSize: 0.38,
      note: L('по одному на число выше нижней строки', 'one per number above the bottom row')});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3, onPath = function(r, c){ return s.path.some(function(p){ return p[0] === r && p[1] === c; }); };
    headOnBoard(s, i, 24, {ms: 8*260, delay: 200});
    for(var r = 0; r < 4; r++) for(var c = 0; c <= r; c++){
      var t = s.cells[r][c], d = j === 0 ? (3 - r)*420 : 0;
      t.setText(j >= 0 ? TRB[r][c] : TRI[r][c], {delay: d});
      t.height(j >= 0 ? s.h(TRB[r][c]) : 0.35, {delay: d});
      var col = 'plain';
      if(i === 2) col = (r === 2 && c === 0) ? 'violet' : (r === 3 && c <= 1) ? 'amber' : 'dim';
      if(j === 0) col = r === 3 ? 'ink' : 'blue';
      if(j === 1) col = r === 0 ? 'green' : onPath(r, c) ? 'violet' : 'dim';
      t.color(col, {delay: d}); t.lift(j === 1 && r === 0 ? 0.3 : i === 2 && r === 2 && c === 0 ? 0.25 : 0, {delay: 300});
    }
    s.arcs.forEach(function(o){
      if(j < 0){ o.a.fadeOut(); return; }
      o.a.opacity(0.45, {delay: j === 0 ? (2 - o.r)*420 + 250 : 0}); o.a.draw(1);
      o.a.color(j === 1 ? (onPath(o.r, o.c) && onPath(o.r + 1, o.k) ? 'green' : 'dim') : 'blue');
    });
    s.paths.forEach(function(p){ vis(p.t, i === 1, {delay: 200 + p.m*260}); });
    var ct = [null, null, L('2 + больше из 8 и 5 = 10', '2 + the larger of 8 and 5 = 10'), L('каждое число + больший сосед снизу', 'each number + the larger neighbour below'), L('23 = 3 + 7 + 4 + 9', '23 = 3 + 7 + 4 + 9')][i];
    if(ct){ s.call.to(i === 4 ? s.cells[0][0] : s.cells[2][0]); s.call.setText(ct); s.call.color(i === 4 ? 'green' : 'violet'); s.call.show(true, {delay: 500}); } else s.call.show(false);
    doneBoard(s, j, 6, null, j === 1);
  }
});

/* ================= RestrictedPartitionCount =================
 * Strip of length 4, tiles of length 1 and 2, order does not matter: 3 sets.
 * head-on: every (2-tiles 0…2) × (1-tiles 0…4) = 15 checks. Table: 4 + 3 = 7 additions.            */
LAB.register({
  id: 'RestrictedPartitionCount',
  steps: mkSteps('RestrictedPartitionCount', [['наборы', 'sets'], ['порядки', 'orders'], ['таблица', 'table']]),
  view: {yaw: 0.12, pitch: 1.0, fill: 0.92},
  build: function(api){
    var L = api.L, s = {pairs: [], sets: [], comps: [], tab: []};
    s.strip = api.row(['', '', '', ''], {gap: 1.05, pos: [-3.2, 0, -3.9], color: 'dim', size: 1.0, h: 0.08});
    s.stripT = api.text(L('полоса длины 4', 'strip of length 4'), [-3.2, 0, -3.1], {size: 0.4, color: 'ink'});
    s.p1 = api.tile(1, {pos: [1.2, 0, -3.9], color: 'blue', size: 1.0});
    s.p2 = plate(api, '2', [3.3, 0, -3.9], {w: 2.05, d: 1.0, color: 'violet', size: 0.5});
    s.pT = api.text(L('плитки длины 1 и 2', 'tiles of length 1 and 2'), [2.4, 0, -3.1], {size: 0.4, color: 'ink'});
    for(var b = 0; b <= 2; b++) for(var a = 0; a <= 4; a++)
      s.pairs.push({t: api.tile(a + 2*b, {pos: [-2.0 + a*1.25, 0, -1.6 + b*1.25], size: 1.05, h: 0.25}), ok: a + 2*b === 4, n: s.pairs.length});
    s.axX = [0, 1, 2, 3, 4].map(function(a){ return api.text(String(a), [-2.0 + a*1.25, 0, -2.5], {size: 0.42, color: 'blue'}); });
    s.axZ = [0, 1, 2].map(function(b){ return api.text(String(b), [-2.9, 0, -1.6 + b*1.25], {size: 0.42, color: 'violet', align: 'right'}); });
    s.axXT = api.text(L('единиц', 'ones'), [3.6, 0, -2.5], {size: 0.4, color: 'blue', align: 'left'});
    s.axZT = api.text(L('двоек', 'twos'), [-3.4, 0, -0.35], {size: 0.4, color: 'violet', align: 'right'});
    s.cellT = api.text(L('в клетке — длина набора; зелёные — ровно 4', 'each cell holds the set’s length; green: exactly 4'), [-2.6, 0, 2.3], {size: 0.38, color: 'ink', align: 'left'});
    function lay(list, z){
      var x = -1.4, out = [];
      list.forEach(function(v){
        var w = v*1.05 - 0.08, cx = x + w/2;
        out.push(v === 1 ? api.tile(1, {pos: [cx, 0, z], color: 'blue', size: 0.97}) : plate(api, '2', [cx, 0, z], {w: w, d: 0.97, color: 'violet', size: 0.5}));
        x += v*1.05;
      });
      return out;
    }
    [[2, 2], [2, 1, 1], [1, 1, 1, 1]].forEach(function(Ls, r){ s.sets.push({p: lay(Ls, -1.6 + r*1.3), t: api.text(Ls.join(' + '), [-1.9, 0, -1.6 + r*1.3], {size: 0.42, color: 'green', align: 'right'})}); });
    [[2, 2], [2, 1, 1], [1, 2, 1], [1, 1, 2], [1, 1, 1, 1]].forEach(function(Ls, r){ s.comps.push({p: lay(Ls, -1.8 + r*1.1), t: api.text(Ls.join(' + '), [-1.9, 0, -1.8 + r*1.1], {size: 0.42, color: r === 0 || r === 4 ? 'green' : 'blue', align: 'right'})}); });
    var Wt = [[1, 1, 1, 1, 1], [1, 1, 2, 2, 3]], F = [['', '0 + 1', '0 + 1', '0 + 1', '0 + 1'], ['', '', '1 + 1', '1 + 1', '1 + 2']];
    Wt.forEach(function(rw, r){ rw.forEach(function(v, k){
      var t = api.tile(v, {pos: [-1.4 + k*1.3, 0, -1.2 + r*2.2], size: 1.1, h: 0.3});
      s.tab.push({t: t, r: r, k: k, v: v, add: F[r][k] !== '', m: F[r][k] ? api.marks(t, [{text: F[r][k], color: 'amber'}], {dir: 'front'}) : null});
    }); });
    s.tabH = [0, 1, 2, 3, 4].map(function(k){ return api.text(String(k), [-1.4 + k*1.3, 0, -2.2], {size: 0.42, color: 'ink'}); });
    s.tabHT = api.text(L('длина', 'length'), [-2.3, 0, -2.2], {size: 0.4, color: 'ink', align: 'right'});
    s.tabR = [api.text(L('только единицы', 'ones only'), [-2.2, 0, -1.2], {size: 0.4, color: 'blue', align: 'right'}),
              api.text(L('единицы и двойки', 'ones and twos'), [-2.2, 0, 1.0], {size: 0.4, color: 'violet', align: 'right'})];
    s.tabNote = api.text(L('клетка = та же длина строкой выше + клетка левее на длину плитки', 'cell = same length in the row above + the cell one tile-length to the left'), [-5.4, 0, 2.9], {size: 0.36, color: 'amber', align: 'left'});
    s.ideaT = [api.text(L('сначала единицы, потом двойки: 1 + 1 + 2 — один раз', 'ones first, then twos: 1 + 1 + 2 appears once'), [-5.4, 0, 2.5], {size: 0.4, color: 'violet', align: 'left'}),
               api.text(L('по длинам подряд: 1 + 1 + 2, 1 + 2 + 1, 2 + 1 + 1 — трижды', 'by length in turn: 1 + 1 + 2, 1 + 2 + 1, 2 + 1 + 1 — three times'), [-5.4, 0, 3.2], {size: 0.4, color: 'blue', align: 'left'})];
    s.call = api.label('', s.pairs[14].t, {color: 'red'});
    s.ops = api.counter(L('проверенных вариантов', 'checked options'), {pos: [-3.6, 0, 5.0], w: 3.6, d: 1.6, noteSize: 0.38, noteFitValue: 15,
      note: function(v){ return v < 15 ? v + L(' из 3 × 5', ' of 3 × 5') : L('3 варианта двоек × 5 единиц', '3 choices of twos × 5 of ones'); }});
    s.done = api.counter(L('сложений в таблице', 'additions in the table'), {pos: [4.2, 0, 5.0], w: 3.6, d: 1.6, color: 'violet', noteSize: 0.38,
      note: L('единицы: 4 + двойки: 3', 'ones: 4 + twos: 3')});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3;
    headOnBoard(s, i, 15, {ms: 15*110, delay: 200});
    s.p1.color(i === 0 ? 'blue' : 'dim'); s.p2.color(i === 0 ? 'violet' : 'dim');
    s.pairs.forEach(function(p){ var d = i === 1 ? 200 + p.n*110 : 0; vis(p.t, i === 1, {delay: d}); p.t.color(p.ok ? 'green' : 'red', {delay: d}); });
    s.axX.concat(s.axZ, [s.axXT, s.axZT, s.cellT]).forEach(function(t){ vis(t, i === 1); });
    s.sets.forEach(function(r, k){ r.p.forEach(function(p){ vis(p, j === 0, {delay: 200 + k*250}); }); vis(r.t, j === 0, {delay: 200 + k*250}); });
    s.comps.forEach(function(r, k){ r.p.forEach(function(p){ vis(p, j === 1, {delay: 200 + k*200}); }); vis(r.t, j === 1, {delay: 200 + k*200}); });
    var tabOn = i === 2 || j === 2;
    s.tab.forEach(function(c, n){
      vis(c.t, tabOn, {delay: j === 2 ? n*120 : 0});
      c.t.setText(i === 2 ? '' : String(c.v));
      c.t.color(i === 2 ? 'violet' : c.r === 1 && c.k === 4 ? 'green' : c.add ? 'amber' : 'plain');
      if(c.m) c.m.show(j === 2 ? 1 : 0, {delay: 300 + n*120});
    });
    s.tabH.concat([s.tabHT, s.tabR[0], s.tabR[1]]).forEach(function(t){ vis(t, tabOn); });
    vis(s.tabNote, j === 2);
    s.ideaT.forEach(function(t, k){ vis(t, i === 2, {delay: 300 + k*300}); });
    var ct = [null, L('длина 4: только 3 варианта из 15', 'length 4: only 3 options out of 15'), null, null, L('порядок важен — 5 раскладок', 'order matters: 5 layouts'), L('ответ: 3 набора', 'answer: 3 sets')][i];
    if(ct){ s.call.to(i === 1 ? s.pairs[14].t : i === 4 ? s.comps[2].p[1] : s.tab[9].t); s.call.setText(ct); s.call.color(i === 1 ? 'red' : i === 4 ? 'blue' : 'green'); s.call.show(true, {delay: i === 1 ? 1900 : 900}); } else s.call.show(false);
    if(j === 2){ s.done.fadeIn(); s.done.set(7, {delay: 300, ms: 1200}); s.done.color('green'); } else s.done.fadeOut();
  }
});

/* ================= NextPermutation =================
 * The arrangement right after 1 3 5 4 2 in dictionary order: 1 4 2 3 5.
 * head-on: all 5! = 120 arrangements (+ sorting). Here: 5 comparisons + 2 swaps = 7.                 */
LAB.register({
  id: 'NextPermutation',
  steps: mkSteps('NextPermutation', [['обмен', 'swap'], ['переворот', 'flip']]),
  view: {yaw: 0.1, pitch: 0.95, fill: 0.9},
  build: function(api){
    var L = api.L, vals = [1, 3, 5, 4, 2], gap = 1.4, s = {t: {}, hop: {}, tw: []};
    s.x = function(k){ return (k - 2)*gap; };
    vals.forEach(function(v, k){ s.t[v] = api.tile(v, {pos: [s.x(k), 0, 0], size: 1.05, h: 0.42}); s.hop[v] = hopper(api, s.t[v]); });
    s.order = [[1, 3, 5, 4, 2], [1, 3, 5, 4, 2], [1, 3, 5, 4, 2], [1, 4, 5, 3, 2], [1, 4, 2, 3, 5]];
    for(var k = 0; k < 10; k++) s.tw.push(api.box([1.3, 0.16, 0.9], {pos: [-6.3, k*0.2, 0], color: 'red'}));
    s.twT = api.text(L('10 слоёв × 12 = 120 расстановок', '10 layers × 12 = 120 arrangements'), [-6.3, 0, 1.1], {size: 0.36, color: 'red'});
    s.ops7 = [L('1) 4 > 2', '1) 4 > 2'), L('2) 5 > 4', '2) 5 > 4'), L('3) 3 < 5 — здесь', '3) 3 < 5 — here'), L('4) 2 > 3? нет', '4) 2 > 3? no'), L('5) 4 > 3: да', '5) 4 > 3: yes'), L('6) обмен 3 и 4', '6) swap 3 and 4'), L('7) обмен 5 и 2', '7) swap 5 and 2')].map(function(t, n){
      return api.badge(t, {pos: [-6.4, 0, -1.9 + n*0.62], color: n < 5 ? 'amber' : 'violet'}); });
    s.br = api.bracket([s.x(2), 0, 0], [s.x(4), 0, 0], {color: 'violet', text: L('конец 5 3 2 → 2 3 5', 'end 5 3 2 → 2 3 5'), dz: 1.0, half: 0.55});
    s.res = api.text('1 4 2 3 5', [0, 0, 2.5], {size: 0.8, color: 'green'});
    s.call = api.label('', [s.x(3), 0.6, 0], {color: 'amber'});
    s.ops = api.counter(L('расстановок в лоб', 'head-on arrangements'), {pos: [-3.4, 0, 4.6], w: 3.8, d: 1.6, noteSize: 0.38, noteFitValue: 120,
      note: function(v){ return v < 120 ? v + L(' из 120', ' of 120') : L('5 × 4 × 3 × 2 × 1, плюс сортировка', '5 × 4 × 3 × 2 × 1, plus sorting'); }});
    s.done = api.counter(L('сравнений и обменов', 'comparisons and swaps'), {pos: [4.4, 0, 4.6], w: 3.6, d: 1.6, color: 'violet', noteSize: 0.38, note: ''});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3, ord = s.order[i];
    headOnBoard(s, i, 120, {ms: 10*160, delay: 200});
    ord.forEach(function(v, k){
      var h = (j === 0 && (v === 3 || v === 4)) ? (v === 3 ? 1.5 : 0.8) : (j === 1 && (v === 5 || v === 2)) ? (v === 5 ? 1.5 : 0.8) : 0.6;
      s.hop[v]([s.x(k), 0, 0], h, {delay: 600});
      var col = 'plain';
      if(i === 2) col = v === 3 ? 'violet' : (v === 5 || v === 4 || v === 2) ? 'amber' : 'plain';
      if(j === 0) col = v === 3 ? 'violet' : v === 4 ? 'red' : 'plain';
      if(j === 1 && k >= 2) col = 'green';
      s.t[v].color(col, {delay: j === 1 ? 900 : 0});
    });
    s.tw.forEach(function(b, k){ vis(b, i === 1, {delay: 200 + k*160}); });
    vis(s.twT, i === 1);
    var n = j === 0 ? 6 : j === 1 ? 7 : 0;
    s.ops7.forEach(function(b, k){ vis(b, k < n, {delay: j === 0 ? 200 + k*200 : j === 1 && k === 6 ? 600 : 0}); });
    vis(s.br, j === 1, {delay: 100}); vis(s.res, j === 1, {delay: 1000});
    var ct = [null, null, L('5 4 2 уже по убыванию — больше не сделать', '5 4 2 already goes down — nothing bigger'), L('меняем 3 и 4', 'swap 3 and 4'), null][i];
    if(ct){ s.call.to(i === 3 ? [s.x(2), 0.6, 1.3] : [s.x(3), 0.6, 0]); s.call.setText(ct); s.call.color(i === 2 ? 'amber' : 'red'); s.call.show(true, {delay: 600}); } else s.call.show(false);
    doneBoard(s, j, j === 0 ? 6 : 7, j === 0 ? L('5 сравнений + 1 обмен', '5 comparisons + 1 swap') : L('5 сравнений + 2 обмена', '5 comparisons + 2 swaps'), j === 1);
  }
});

/* ================= Composition =================
 * Split 5 into 3 parts > 0, order matters. head-on: all 5 × 5 × 5 = 125 triples (6 fit).
 * 5 sticks, 4 gaps, 2 dividers: (4 × 3) ÷ (2 × 1) = 6, step by step × 3, ÷ 1, × 4, ÷ 2 — 4 steps.   */
LAB.register({
  id: 'Composition',
  steps: mkSteps('Composition', [['перегородки', 'dividers'], ['все способы', 'all ways']]),
  view: {yaw: 0.15, pitch: 0.98, fill: 0.92},
  build: function(api){
    var L = api.L, s = {cells: [], rows: []}, zU = -4.0;
    s.units = api.row([1, 1, 1, 1, 1], {gap: 1.2, pos: [0, 0, zU], size: 0.9, h: 0.36});
    var gx = [-1.8, -0.6, 0.6, 1.8];
    s.gaps = gx.map(function(x, k){ var cut = k === 0 || k === 3; return api.box(cut ? [0.12, 1.0, 1.0] : [0.16, 0.16, 0.16], {pos: [x, 0, zU], color: cut ? 'blue' : 'dim'}); });
    s.gapN = gx.map(function(x, k){ return api.text(String(k + 1), [x, 0, zU - 0.85], {size: 0.42, color: 'violet'}); });
    s.parts = api.row([1, 3, 1], {gap: 1.4, pos: [0, 0, zU + 1.5], color: 'blue', size: 0.95, h: 0.36});
    s.eq = api.text('1 + 3 + 1 = 5', [0, 0, zU + 2.4], {size: 0.46, color: 'blue'});
    for(var b = 1; b <= 5; b++) for(var a = 1; a <= 5; a++){
      var c = 5 - a - b, ok = c >= 1;
      s.cells.push({t: api.tile(ok ? a + '+' + b + '+' + c : '—', {pos: [-2.4 + (a - 1)*1.2, 0, -2.0 + (b - 1)*1.05], size: 0.98, h: 0.2}), ok: ok, n: (b - 1)*5 + (a - 1)});
    }
    s.axA = api.text(L('1-е число: 1 … 5 →', '1st number: 1 … 5 →'), [-2.9, 0, -2.85], {size: 0.38, color: 'ink', align: 'left'});
    s.axB = api.text(L('2-е число: 1 … 5', '2nd number: 1 … 5'), [-3.2, 0, 0.1], {size: 0.38, color: 'ink', align: 'right'});
    s.cellT = api.text(L('в каждой клетке перебираем 5 вариантов 3-го числа: 25 × 5 = 125', 'in each cell we try 5 choices of the 3rd number: 25 × 5 = 125'), [-6.4, 0, 3.3], {size: 0.36, color: 'ink', align: 'left'});
    [[1, 1, 3], [1, 3, 1], [3, 1, 1], [1, 2, 2], [2, 1, 2], [2, 2, 1]].forEach(function(cp, r){
      var z = -2.6 + r*1.05, x = -1.2, bx = [];
      cp.forEach(function(v, k){ var w = v*0.9 - 0.08; bx.push(api.box([w, 0.3, 0.62], {pos: [x + w/2, 0, z], color: k === 1 ? 'violet' : 'blue'})); x += v*0.9; });
      s.rows.push({bx: bx, t: api.text(cp.join(' + '), [-1.6, 0, z], {size: 0.42, align: 'right', color: 'green'}), cur: r === 1});
    });
    s.form = api.text('(4 × 3) ÷ (2 × 1) = 6', [0, 0, 3.7], {size: 0.6, color: 'green'});
    s.ops4 = opBadges(api, -3.1, 4.6);
    s.call = api.label('', s.units.at(4), {color: 'violet'});
    s.ops = api.counter(L('проверенных троек', 'checked triples'), {pos: [-6.4, 0, 6.2], w: 3.6, d: 1.6, noteSize: 0.38, noteFitValue: 125, quant: 5,
      note: function(v){ return v < 125 ? v + L(' из 125', ' of 125') : '5 × 5 × 5'; }});
    s.done = api.counter(L('действий', 'steps'), {pos: [4.4, 0, 6.2], w: 3.4, d: 1.6, color: 'violet', noteSize: 0.38, note: L('2 умножения + 2 деления', '2 multiplications + 2 divisions')});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3;
    headOnBoard(s, i, 125, {ms: 25*70, delay: 200});
    s.units.each(function(t, k){ t.color(j === 0 ? (k === 0 || k === 4 ? 'blue' : 'violet') : j === 1 ? 'dim' : 'plain', {delay: j === 0 ? 400 : 0}); });
    s.gaps.forEach(function(g, k){ var cut = k === 0 || k === 3; vis(g, i === 2 || (j === 0 && cut), {delay: k*120}); g.color(i === 2 ? 'violet' : cut ? 'blue' : 'dim'); });
    s.gapN.forEach(function(t, k){ vis(t, i === 2 || j === 0); t.color(j === 0 && (k === 0 || k === 3) ? 'blue' : 'violet'); });
    s.parts.each(function(t, k){ vis(t, j === 0, {delay: 600 + k*120}); }); vis(s.eq, j === 0, {delay: 900});
    s.cells.forEach(function(c){ var d = i === 1 ? 200 + c.n*70 : 0; vis(c.t, i === 1, {delay: d}); c.t.color(c.ok ? 'green' : 'red', {delay: d}); });
    [s.axA, s.axB, s.cellT].forEach(function(t){ vis(t, i === 1); });
    s.rows.forEach(function(r, k){ r.bx.forEach(function(b){ vis(b, j === 1, {delay: k*150}); b.lift(j === 1 && r.cur ? 0.2 : 0, {delay: 900}); }); vis(r.t, j === 1, {delay: k*150}); });
    vis(s.form, j === 1, {delay: 900});
    s.ops4.forEach(function(b, k){ vis(b, j === 1, {delay: 1100 + k*250}); });
    var ct = [null, L('сумма 5: подходят 6 из 125', 'sum 5: 6 of 125 fit'), L('между 5 палочками 4 промежутка', '4 gaps between 5 sticks'), null, L('выбрать 2 промежутка из 4', 'pick 2 gaps out of 4')][i];
    if(ct){ s.call.to(i === 1 ? s.cells[4].t : i === 4 ? s.form : s.units.at(4)); s.call.setText(ct); s.call.color(i === 1 ? 'red' : i === 2 ? 'violet' : 'green'); s.call.show(true, {delay: i === 1 ? 1900 : 700}); } else s.call.show(false);
    if(j === 1){ s.done.fadeIn(); s.done.set(4, {delay: 300}); s.done.color('green'); } else s.done.fadeOut();
  }
});

/* ================= BitmaskSubsetEnumeration =================
 * Three toys A, B, C; all ways to choose exactly two. head-on: 8 separate lists, 0+1+1+2+1+2+2+3 = 12 writes.
 * A choice = three digits 0/1 (rightmost = A): the numbers 0…7, keep those with two 1s — 8 numbers.  */
var PCS = [0, 1, 1, 2, 1, 2, 2, 3], CUM = [0, 1, 2, 4, 5, 7, 9, 12];
LAB.register({
  id: 'BitmaskSubsetEnumeration',
  steps: mkSteps('BitmaskSubsetEnumeration', [['числа 0…7', 'numbers 0…7'], ['две единицы', 'two 1s']]),
  view: {yaw: 0.3, pitch: 0.95, fill: 0.92},
  build: function(api){
    var L = api.L, s = {rows: []}, NM = [L('А', 'A'), L('Б', 'B'), L('В', 'C')];
    s.head = api.row([NM[2], NM[1], NM[0]], {gap: 1.0, pos: [0, 0, -4.8], color: 'ink', size: 0.85, h: 0.4});
    s.pcH = api.text(L('сколько взято', 'how many taken'), [4.7, 0, -4.1], {size: 0.36, color: 'ink'});
    for(var m = 0; m < 8; m++){
      var z = -3.3 + m*0.95, bits = [(m >> 2) & 1, (m >> 1) & 1, m & 1], pc = bits[0] + bits[1] + bits[2];
      var set = []; if(bits[2]) set.push(NM[0]); if(bits[1]) set.push(NM[1]); if(bits[0]) set.push(NM[2]);
      s.rows.push({m: m, pc: pc, bits: bits,
        idx: api.text(String(m), [-1.7, 0, z], {size: 0.42, align: 'right', color: 'ink'}),
        b: api.row(bits, {gap: 1.0, pos: [0, 0, z], size: 0.8, h: 0.26}),
        set: api.text(set.length ? set.join(', ') : '—', [1.75, 0, z], {size: 0.4, align: 'left', color: 'ink'}),
        bar: api.bar(pc, 3, {pos: [4.7, 0, z], height: 1.3, size: 0.7, color: 'blue'}),
        wr: api.badge(PCS[m] + ' ' + L(pl(PCS[m], 'запись', 'записи', 'записей'), pl(PCS[m], 'write', 'writes')), {pos: [0, 0, z], color: 'red'})});
    }
    var r5 = s.rows[5];
    s.link = [0, 2].map(function(k){ return api.arrow([r5.b.pos(k)[0], 0.3, -3.3 + 5*0.95 - 0.45], [s.head.pos(k)[0], 0.4, -4.35], {color: 'violet'}); });
    s.call = api.label('', r5.set, {color: 'violet'});
    s.ops = api.counter(L('записанных игрушек', 'written toys'), {pos: [-3.4, 0, 6.2], w: 3.6, d: 1.6, noteSize: 0.38, noteFitValue: 12,
      note: function(v){ var k = 0; while(k < 7 && CUM[k] < v) k++; return v < 12 ? PCS.slice(0, k + 1).join(' + ') : '0 + 1 + 1 + 2 + 1 + 2 + 2 + 3'; }});
    s.done = api.counter(L('перебранных чисел', 'numbers gone through'), {pos: [4.4, 0, 6.2], w: 3.4, d: 1.6, color: 'violet', noteSize: 0.38, note: L('числа от 0 до 7', 'the numbers 0 to 7')});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3;
    headOnBoard(s, i, 12, {ms: 8*200, delay: 200});
    s.head.color(i === 2 ? 'violet' : 'ink');
    vis(s.pcH, j >= 0);
    s.rows.forEach(function(r){
      var d = j === 0 ? r.m*110 : i === 1 ? 200 + r.m*200 : 0, win = r.pc === 2, idea5 = i === 2 && r.m === 5;
      vis(r.wr, i === 1, {delay: d});
      vis(r.set, i === 1 || idea5 || j >= 0, {delay: d});
      vis(r.idx, j >= 0, {delay: d}); vis(r.b, idea5 || j >= 0, {delay: d}); vis(r.bar, j >= 0, {delay: d});
      r.b.each(function(t, k){
        var col = r.bits[k] ? 'blue' : 'plain';
        if(idea5) col = r.bits[k] ? 'violet' : 'plain';
        if(j === 1) col = win ? (r.bits[k] ? 'green' : 'plain') : 'dim';
        t.color(col, {delay: d});
      });
      r.set.color(i === 1 ? 'red' : idea5 ? 'violet' : j === 1 ? (win ? 'green' : 'dim') : 'ink');
      r.idx.color(j === 1 ? (win ? 'green' : 'dim') : 'ink');
      r.bar.color(j === 1 ? (win ? 'green' : 'dim') : 'blue');
      r.b.lift(j === 1 && win ? 0.25 : 0, {delay: 300});
    });
    s.link.forEach(function(a){ vis(a, i === 2, {delay: 400}); });
    var ct = [null, null, L('101: В взяли, Б нет, А взяли', '101: C taken, B not, A taken'), null, L('ровно две единицы — 3 способа', 'exactly two 1s: 3 ways')][i];
    if(ct){ s.call.to(i === 4 ? s.rows[6].set : s.rows[5].set); s.call.setText(ct); s.call.color(i === 2 ? 'violet' : 'green'); s.call.show(true, {delay: 500}); } else s.call.show(false);
    doneBoard(s, j, 8, null, j === 1);
  }
});

})();

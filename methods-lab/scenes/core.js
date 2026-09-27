/*
 * scenes/core.js — reference scenes for the LAB engine (see SCENE_API.md, CONTEXT_RULE.md).
 * SkipCounting · BinarySearch · SieveOfEratosthenes
 * Chapters: problem (the naive way, every operation drawn and counted) → idea → solve.
 * Every number on screen says what is counted, where it comes from and why it matters.
 * The naive-cost board stays on the table in all chapters; the method board appears next to it.
 */
(function(){
'use strict';
if(!window.LAB || !LAB.register) return;
var pl = LAB.plural;

/* ---------------- Skip counting: 1..19, steps of 2 and of 3 (pilot of NARRATIVE.md) ----------------
 * story: task → head-on (38 divisions) → notice (+2 lands on the next one) → steps by 2, by 3, overlap.
 * Captions are the story sentences from the passport (props_a.json → story).                         */
LAB.register({
  id: 'SkipCounting',
  steps: [
    {chapter: 'problem', caption: {ru: 'Есть числа от 1 до 19. Нужно узнать, какие из них делятся на 2, какие на 3, а какие — и на 2, и на 3.', en: 'Take the numbers from 1 to 19. Which of them divide evenly by 2, which by 3, and which by both?'}, tag: {ru: 'задача', en: 'task'}},
    {chapter: 'problem', caption: {ru: 'В лоб: делим каждое число и на 2, и на 3 — это 19 × 2 = 38 делений, и больше половины из них впустую.', en: 'Head-on: divide every number by 2 and by 3. That is 19 × 2 = 38 divisions, and more than half of them are wasted.'}, tag: {ru: 'в лоб', en: 'head-on'}},
    {chapter: 'idea', caption: {ru: 'Числа, которые делятся на 2, идут ровно через одно: 2, 4, 6… Их не нужно искать делением — достаточно прибавлять по 2. С числами, которые делятся на 3, так же: прибавляем по 3.', en: 'Numbers that divide by 2 come every other number: 2, 4, 6… There is no need to find them by dividing — just keep adding 2. The same goes for 3: keep adding 3.'}, tag: {ru: 'замечаем', en: 'notice'}},
    {chapter: 'solve', caption: {ru: 'Шагаем по 2 от 2 до 18 — 9 шагов, и каждый попадает на число, которое делится на 2.', en: 'Count by 2s from 2 to 18: 9 steps, and every one lands on a number that divides by 2.'}, tag: {ru: 'по 2', en: 'by 2s'}},
    {chapter: 'solve', caption: {ru: 'Шагаем по 3 от 3 до 18 — 6 шагов, и каждый попадает на число, которое делится на 3.', en: 'Count by 3s from 3 to 18: 6 steps, and every one lands on a number that divides by 3.'}, tag: {ru: 'по 3', en: 'by 3s'}},
    {chapter: 'solve', caption: {ru: 'Где отметки совпали — на 6, 12 и 18, — число делится и на 2, и на 3.', en: 'Where the marks meet — at 6, 12 and 18 — the number divides by both 2 and 3.'}, tag: {ru: 'совпали', en: 'overlap'}}
  ],
  view: {yaw: 0.08, pitch: 1.0, fill: 0.92},
  build: function(api){
    var L = api.L;
    var nums = [], n;
    for(n = 1; n <= 19; n++) nums.push(n);
    var row = api.row(nums, {gap: 1.1});
    var x0 = row.pos(0)[0] - 1.1;
    var hops2 = [], hops3 = [], prev = [x0, 0.32, 0];
    for(n = 2; n <= 18; n += 2){ hops2.push(api.arc(prev, row.at(n - 1), {color: 'blue', height: 0.7})); prev = row.at(n - 1); }
    prev = [x0, 0.32, 0];
    for(n = 3; n <= 18; n += 3){ hops3.push(api.arc(prev, row.at(n - 1), {color: 'red', height: 1.25})); prev = row.at(n - 1); }
    var lab2 = api.label(L('синие — делятся на 2', 'blue: divides by 2'), row.at(1), {color: 'blue', dy: 0.9});
    var lab3 = api.label(L('красные — делятся на 3', 'red: divides by 3'), row.at(2), {color: 'red', dy: 1.4});
    var labBoth = api.label(L('фиолетовые — делятся и на 2, и на 3', 'purple: divides by both 2 and 3'), row.at(5), {color: 'violet', dy: 1.4});
    var marks = nums.map(function(v, k){
      return api.marks(row.at(k), [
        {text: '÷2', color: v % 2 === 0 ? 'green' : 'red'},
        {text: '÷3', color: v % 3 === 0 ? 'green' : 'red'}
      ]);
    });
    var legend = api.text(L('зелёная метка — делится, красная — деление впустую', 'green tag: divides evenly; red tag: a wasted division'), [x0 - 0.4, 0, -2.3], {color: 'ink', size: 0.42, align: 'left'});
    var ops = api.counter(L('делений в лоб', 'head-on divisions'), {pos: [row.pos(3)[0], 0, 2.7], color: 'red', quant: 2, noteFitValue: 38,
      note: function(v){ var k = v/2; return k + ' ' + L(pl(k, 'число', 'числа', 'чисел'), pl(k, 'number', 'numbers')) + L(' × 2 деления (на 2 и на 3)', ' × 2 divisions (by 2 and by 3)'); }});
    var hops = api.counter(L('шагов', 'steps'), {pos: [row.pos(14)[0], 0, 2.7], color: 'green', note: ''});
    var ideaHop = api.arc(row.at(1), row.at(3), {color: 'violet', height: 0.9, head: true});
    var ideaLab = api.label(L('2 + 2 = 4 — следующее нашли без деления', '2 + 2 = 4: the next one, found without dividing'), row.at(3), {color: 'violet', dy: 1.0});
    return {row: row, hops2: hops2, hops3: hops3, lab2: lab2, lab3: lab3, labBoth: labBoth, marks: marks,
      ops: ops, legend: legend, hops: hops, ideaHop: ideaHop, ideaLab: ideaLab};
  },
  step: function(api, s, i){
    var L = api.L;
    var j = i - 3, n, t;
    for(n = 1; n <= 19; n++){
      t = s.row.at(n - 1);
      var m2 = n % 2 === 0, m3 = n % 3 === 0, col = 'plain', lift = 0, d = 0;
      if(i === 2){ col = (n === 2 || n === 4) ? 'violet' : 'plain'; lift = (n === 2 || n === 4) ? 0.25 : 0; }
      if(j === 0 && m2){ col = 'blue'; d = n*55; }
      if(j === 1){ if(m3){ col = 'red'; d = n*45; } else if(m2) col = 'blue'; }
      if(j === 2){ col = m2 && m3 ? 'violet' : m2 ? 'blue' : m3 ? 'red' : 'plain'; lift = m2 && m3 ? 0.25 : 0; }
      t.color(col, {delay: d});
      t.lift(lift);
    }
    // head-on: badges appear number by number, in step with the board (sum of badges = number on the board)
    s.marks.forEach(function(m, k){ if(i === 1) m.show(2, {delay: 150 + k*120, every: 60}); else m.show(0); });
    if(i === 0) s.ops.fadeOut();
    else { s.ops.fadeIn(); if(i === 1){ s.ops.set(0, {ms: 0}); s.ops.set(38, {ms: 19*120, delay: 150}); } else s.ops.set(38); }
    if(i === 1) s.legend.fadeIn({delay: 300}); else s.legend.fadeOut();
    s.hops2.forEach(function(h, k){ if(j < 0) h.fadeOut(); else { h.fadeIn({delay: j === 0 ? k*110 : 0}); h.color('blue'); } });
    s.hops3.forEach(function(h, k){ if(j < 1) h.fadeOut(); else { h.fadeIn({delay: j === 1 ? k*140 : 0}); h.color('red'); } });
    s.lab2.show(j === 0);
    s.lab3.show(j === 1);
    s.labBoth.show(j === 2, {delay: 250});
    if(i === 2) s.ideaHop.fadeIn({delay: 150}); else s.ideaHop.fadeOut();
    s.ideaLab.show(i === 2, {delay: 400});
    if(j >= 0){
      s.hops.fadeIn();
      s.hops.set([9, 15, 15][j], {ms: 900});
      s.hops.setNote([L('9 шагов по 2', '9 steps of 2'), L('9 шагов по 2 + 6 шагов по 3', '9 steps of 2 + 6 steps of 3'), L('9 шагов по 2 + 6 шагов по 3', '9 steps of 2 + 6 steps of 3')][j]);
    } else s.hops.fadeOut();
  }
});

/* ---------------- Binary search: 4 9 15 23 31 40 52, looking for 52 (pilot of NARRATIVE.md) ----------------
 * head-on: compare 52 with each number left to right = 7 comparisons (52 is last)
 * halving: middle 23, then 40, then 52 = 3 comparisons                                                    */
var BS_VALS = [4, 9, 15, 23, 31, 40, 52];
LAB.register({
  id: 'BinarySearch',
  steps: [
    {chapter: 'problem', caption: {ru: 'Есть 7 чисел, записанных по возрастанию: 4, 9, 15, 23, 31, 40, 52. Нужно найти, на каком месте стоит число 52.', en: 'Seven numbers are written in increasing order: 4, 9, 15, 23, 31, 40, 52. Where in the list is 52?'}, tag: {ru: 'задача', en: 'task'}},
    {chapter: 'problem', caption: {ru: 'В лоб: сравниваем 52 с каждым числом слева направо. 52 стоит последним, поэтому понадобится 7 сравнений.', en: 'Head-on: compare 52 with each number from left to right. 52 is last, so that takes 7 comparisons.'}, tag: {ru: 'в лоб', en: 'head-on'}},
    {chapter: 'idea', caption: {ru: 'Числа стоят по возрастанию. Значит, если число в середине меньше 52, то и все числа левее него меньше 52 — на них можно больше не смотреть.', en: 'The numbers go up in order. So if the number in the middle is smaller than 52, every number to its left is smaller too — we can stop looking at them.'}, tag: {ru: 'замечаем', en: 'notice'}},
    {chapter: 'solve', caption: {ru: 'Смотрим на середину — число 23. Оно меньше 52, значит 52 правее: отбрасываем 23 и всё, что левее.', en: 'Look at the middle: 23. It is smaller than 52, so 52 is further right. Drop 23 and everything to its left.'}, tag: {ru: 'середина 23', en: 'middle 23'}},
    {chapter: 'solve', caption: {ru: 'Из оставшихся 31, 40, 52 смотрим на середину — число 40. Оно меньше 52: отбрасываем 31 и 40.', en: 'Of the remaining 31, 40 and 52, look at the middle: 40. It is smaller than 52, so drop 31 and 40.'}, tag: {ru: 'середина 40', en: 'middle 40'}},
    {chapter: 'solve', caption: {ru: 'Осталось одно число — 52. Это оно: 52 стоит на 7-м месте.', en: 'One number is left — 52. That is it: 52 is in 7th place.'}, tag: {ru: 'нашли', en: 'found'}}
  ],
  view: {yaw: 0.3, pitch: 0.9, fill: 0.86},
  build: function(api){
    var L = api.L;
    var row = api.row(BS_VALS, {gap: 1.25, h: 0.36});
    var goal = api.tile(52, {pos: [row.pos(0)[0] - 0.2, 0, -2.2], color: 'blue', size: 0.9, h: 0.5});
    var goalText = api.text(L('ищем', 'find'), [row.pos(0)[0] - 0.9, 0, -2.2], {color: 'blue', size: 0.42, align: 'right'});
    var ptr = api.pointer({color: 'violet'});
    var br = api.bracket(row.at(0), row.at(6), {color: 'ink', text: L('осталось чисел: 7', 'numbers left: 7')});
    var cmp = api.label('', row.at(3), {color: 'violet'});
    var marks = BS_VALS.map(function(v, k){ return api.marks(row.at(k), [{text: v === 52 ? '=52' : '≠52', color: v === 52 ? 'green' : 'red'}]); });
    var ops = api.counter(L('сравнений в лоб', 'head-on comparisons'), {pos: [row.pos(1)[0] - 0.4, 0, 2.8], w: 3.4, d: 1.6, color: 'red', noteFitValue: 7,
      note: function(v){ return v + ' ' + L(pl(v, 'число', 'числа', 'чисел'), pl(v, 'number', 'numbers')) + L(' × 1 сравнение', ' × 1 comparison'); }});
    var cut = api.box([3*1.25 + 0.2, 0.04, 1.3], {pos: [row.pos(1)[0], 0, 0], color: 'violet'});
    var ideaMark = api.marks(row.at(3), [{text: '23<52', color: 'violet'}]);
    var ideaLab = api.label(L('4, 9, 15 меньше 23 — значит, и меньше 52', '4, 9, 15 are below 23, so below 52 too'), row.at(1), {color: 'violet', dy: 1.0});
    var done = api.counter(L('сравнений пополам', 'halving comparisons'), {pos: [row.pos(5)[0] + 1.6, 0, 2.8], w: 3.4, d: 1.6, color: 'violet', note: ''});
    return {row: row, goal: goal, goalText: goalText, ptr: ptr, br: br, cmp: cmp, marks: marks, ops: ops,
      cut: cut, ideaMark: ideaMark, ideaLab: ideaLab, done: done};
  },
  step: function(api, s, i){
    var L = api.L;
    var j = i - 3;
    s.marks.forEach(function(m, k){ if(i === 1) m.show(1, {delay: 200 + k*260}); else m.show(0); });
    if(i === 0) s.ops.fadeOut();
    else { s.ops.fadeIn(); if(i === 1){ s.ops.set(0, {ms: 0}); s.ops.set(7, {ms: 7*260, delay: 200}); } else s.ops.set(7); }
    if(i === 2){ s.cut.fadeIn({delay: 200}); s.ideaMark.show(1, {delay: 100}); } else { s.cut.fadeOut(); s.ideaMark.show(0); }
    s.ideaLab.show(i === 2, {delay: 350});
    if(j < 0){
      s.row.each(function(t, k){
        var col = i === 1 ? (k < 6 ? 'red' : 'green') : i === 2 ? (k < 3 ? 'dim' : k === 3 ? 'violet' : 'plain') : 'plain';
        t.color(col, {delay: i === 1 ? 200 + k*260 : 0});
        t.lift(i === 2 && k === 3 ? 0.3 : 0);
      });
      s.ptr.fadeOut(); s.br.fadeOut(); s.cmp.show(false); s.done.fadeOut();
      s.goal.color('blue');
      return;
    }
    var plan = [
      {lo: 4, hi: 6, mid: 3, n: 1, cmp: L('23 &lt; 52 → 52 правее', '23 &lt; 52 → 52 is to the right'), note: L('1 сравнение: 23 с 52', '1 comparison: 23 with 52')},
      {lo: 6, hi: 6, mid: 5, n: 2, cmp: L('40 &lt; 52 → 52 правее', '40 &lt; 52 → 52 is to the right'), note: L('2 сравнения: 23 и 40 с 52', '2 comparisons: 23 and 40 with 52')},
      {lo: 6, hi: 6, mid: 6, n: 3, cmp: L('52 = 52 — нашли', '52 = 52: found'), note: L('3 сравнения: 23, 40 и 52 с 52', '3 comparisons: 23, 40 and 52 with 52')}
    ][j];
    var left = plan.hi - plan.lo + 1;
    s.br.fadeIn();
    s.row.each(function(t, k){
      var col = 'plain', lift = 0;
      if(k < plan.lo || k > plan.hi) col = 'dim';
      if(k === plan.mid && j < 2) col = 'violet';
      if(j === 2 && k === 6){ col = 'green'; lift = 0.35; }
      var away = Math.abs(k - plan.mid);
      t.color(col, {delay: col === 'dim' ? 120 + away*70 : 0});
      t.lift(lift, {delay: 150});
    });
    s.ptr.fadeIn(); s.ptr.at(s.row.at(plan.mid)); s.ptr.color(j === 2 ? 'green' : 'violet');
    s.br.set(s.row.at(plan.lo), s.row.at(plan.hi), {delay: 250});
    s.br.setText(j === 2 ? L('52 — на 7-м месте', '52 is in 7th place') : L('осталось чисел: ', 'numbers left: ') + left, {delay: 250});
    s.br.color(j === 2 ? 'green' : 'ink');
    s.goal.color(j === 2 ? 'green' : 'blue');
    s.cmp.to(s.row.at(plan.mid)); s.cmp.setText(plan.cmp); s.cmp.color(j === 2 ? 'green' : 'violet'); s.cmp.show(true, {delay: 200});
    s.done.fadeIn(); s.done.color(j === 2 ? 'green' : 'violet'); s.done.set(plan.n); s.done.setNote(plan.note);
  }
});

/* ---------------- Sieve of Eratosthenes: 2..19 (NARRATIVE, RU/EN; text = stories/SieveOfEratosthenes.json) ----------------
 * head-on: trial division of n by 2, 3, … until a divisor is found (primes: by all 2..n-1)
 *          per number 0,1,1,3,1,5,1,2,1,9,1,11,1,2,1,15,1,17 → sum 73
 * sieve:   crossing multiples of p starts at p²: 8 multiples of 2 (4..18) + 4 of 3 (9, 12, 15, 18) = 12 */
LAB.register({
  id: 'SieveOfEratosthenes',
  steps: [
    {chapter: 'problem', caption: {ru: 'Есть числа от 2 до 19. Нужно найти среди них все простые — те, что делятся только на 1 и на себя.', en: 'Take the numbers from 2 to 19. Find all the primes among them — the numbers that divide only by 1 and by themselves.'}, tag: {ru: 'задача', en: 'task'}},
    {chapter: 'problem', caption: {ru: 'В лоб: каждое число делим на 2, 3, 4… пока не найдём делитель. Простое приходится делить на все меньшие числа — всего выходит 73 деления.', en: 'Head-on: divide each number by 2, 3, 4… until something divides it. A prime has to be divided by every smaller number — 73 divisions in all.'}, tag: {ru: 'в лоб', en: 'head-on'}},
    {chapter: 'idea', caption: {ru: 'Числа, кратные 2, — это 4, 6, 8…: их можно найти шагами по 2, без деления. Если так вычеркнуть кратные каждого простого, оставшиеся числа и будут простыми.', en: 'The multiples of 2 are 4, 6, 8…: you can reach them by counting in 2s, with no dividing. Cross out the multiples of each prime this way, and whatever is left is prime.'}, tag: {ru: 'замечаем', en: 'notice'}},
    {chapter: 'solve', caption: {ru: '2 — простое. Шагаем по 2 от 4 до 18 и вычёркиваем 8 чисел: все они делятся на 2.', en: '2 is prime. Count by 2s from 4 to 18 and cross out 8 numbers: all of them divide by 2.'}, tag: {ru: 'кратные 2', en: 'multiples of 2'}},
    {chapter: 'solve', caption: {ru: 'Следующее невычеркнутое — 3, оно простое. Его кратные начинаем с 9 = 3 × 3 (6 уже вычеркнуто) и вычёркиваем 9, 12, 15, 18 — ещё 4 раза.', en: 'The next number not crossed out is 3, so it is prime. Start its multiples at 9 = 3 × 3 (6 is already gone) and cross out 9, 12, 15, 18 — 4 more.'}, tag: {ru: 'кратные 3', en: 'multiples of 3'}},
    {chapter: 'solve', caption: {ru: 'Следующее простое — 5, но 5 × 5 = 25 больше 19, значит, все составные уже вычеркнуты. Остались 8 простых: 2, 3, 5, 7, 11, 13, 17, 19.', en: 'The next prime is 5, but 5 × 5 = 25 is more than 19, so every non-prime is already crossed out. 8 primes are left: 2, 3, 5, 7, 11, 13, 17, 19.'}, tag: {ru: 'стоп', en: 'stop'}}
  ],
  view: {yaw: 0.08, pitch: 1.0, fill: 0.92},
  build: function(api){
    var L = api.L;
    var nums = [], n; for(n = 2; n <= 19; n++) nums.push(n);
    var row = api.row(nums, {gap: 1.08});
    var at = function(n){ return row.at(n - 2); };
    var hops2 = [], hops3 = [];
    for(n = 2; n + 2 <= 19; n += 2) hops2.push(api.arc(at(n), at(n + 2), {color: 'blue', height: 0.6}));
    for(n = 9; n + 3 <= 19; n += 3) hops3.push(api.arc(at(n), at(n + 3), {color: 'red', height: 1.1}));
    var jump3 = api.arc(at(3), at(9), {color: 'violet', height: 1.6, dashed: true, head: true});
    var lp = api.label(L('2 не вычеркнуто — значит, простое', '2 is not crossed out, so it is prime'), at(2), {color: 'green', dy: 0.8});
    var lnew = api.label(L('6 уже вычеркнуто — начинаем с 9 = 3 × 3', '6 is already gone — start at 9 = 3 × 3'), at(9), {color: 'red', dy: 1.7});
    var lstop = api.label(L('5 × 5 = 25 больше 19 — стоп', '5 × 5 = 25 is more than 19 — stop'), at(5), {color: 'green', dy: 0.8});
    // head-on trial division: divide n by 2, 3, … until a divisor is found
    var cost = {}, prefix = {}, total = 0, parts = [];
    for(n = 2; n <= 19; n++){ var c = 0; for(var d = 2; d < n; d++){ c++; if(n % d === 0) break; } cost[n] = c; total += c; prefix[n] = total; parts.push(c); }
    var marks = nums.map(function(v){ var prime = cost[v] === v - 2; return api.marks(at(v), [{text: String(cost[v]), color: prime ? 'red' : 'amber'}]); });
    var legendT = api.text(L('число на метке — сколько раз делили; красная — простое, делили до конца', 'tag = how many divisions; red means a prime, divided all the way'), [at(2).pos()[0] - 0.5, 0, -2.2], {color: 'ink', size: 0.42, align: 'left'});
    var marks3 = [9, 12, 15, 18].map(function(v){ return api.marks(at(v), [{text: (v === 12 || v === 18) ? L('×3 повторно', '×3 again') : '×3', color: 'red'}]); });
    var wall = api.label(L('19 — простое: делили на все 17 чисел от 2 до 18', '19 is prime: divided by all 17 numbers from 2 to 18'), marks[17].at(0), {color: 'red', dy: 1.1});
    var ops = api.counter(L('делений в лоб', 'head-on divisions'), {pos: [at(5).pos()[0], 0, 2.6], color: 'red', noteFitValue: 73,
      note: function(v){ var m = 2; for(var q = 2; q <= 19; q++) if(prefix[q] <= v) m = q; return L('числа 2–', 'numbers 2–') + m + ': ' + parts.slice(0, m - 1).join('+'); }});
    var ideaHops = [api.arc(at(2), at(4), {color: 'violet', height: 0.7, head: true}), api.arc(at(4), at(6), {color: 'violet', height: 0.7, head: true}), api.arc(at(6), at(8), {color: 'violet', height: 0.7, head: true})];
    var ideaLab = api.label(L('4, 6, 8 — шагами по 2, без деления', '4, 6, 8 — counting by 2s, no dividing'), at(6), {color: 'violet', dy: 1.0});
    var crossed = api.counter(L('вычёркиваний', 'cross-outs'), {pos: [at(13).pos()[0], 0, 2.6], color: 'green', note: ''});
    return {row: row, at: at, hops2: hops2, hops3: hops3, jump3: jump3, lp: lp, lnew: lnew, lstop: lstop, marks: marks,
      total: total, cost: cost, ops: ops, legendT: legendT, marks3: marks3, wall: wall, ideaHops: ideaHops, ideaLab: ideaLab, crossed: crossed};
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3;
    for(var n = 2; n <= 19; n++){
      var t = s.at(n), col = 'plain', strike = false, lift = 0, d = 0;
      var by2 = n > 2 && n % 2 === 0, by3 = n > 3 && n % 3 === 0 && !by2;
      if(i === 2){ if(n === 2) { col = 'violet'; lift = 0.25; } else if(n === 4 || n === 6 || n === 8) col = 'blue'; }
      if(j >= 0){ if(n === 2) col = 'green'; if(by2){ col = 'blue'; strike = true; d = j === 0 ? n*45 : 0; } }
      if(j >= 1){ if(n === 3) col = 'green'; if(by3){ col = 'red'; strike = true; d = j === 1 ? n*45 : 0; } }
      if(j === 1 && (n === 12 || n === 18)) lift = 0.15;        // crossed again by the 3-pass
      if(j === 2 && !by2 && !by3){ col = 'green'; lift = 0.22; d = n*30; }
      t.color(col, {delay: d});
      t.strike(strike, {delay: d});
      t.lift(lift, {delay: d});
    }
    s.marks.forEach(function(m, k){ if(i === 1) m.show(1, {delay: 150 + k*110}); else m.show(0); });
    if(i === 0) s.ops.fadeOut();
    else { s.ops.fadeIn(); if(i === 1){ s.ops.set(0, {ms: 0}); s.ops.set(s.total, {ms: 18*110, delay: 150}); } else s.ops.set(s.total); }
    if(i === 1) s.legendT.fadeIn({delay: 300}); else s.legendT.fadeOut();
    s.marks3.forEach(function(m, k){ if(j === 1) m.show(1, {delay: 380 + k*120}); else m.show(0); });
    s.wall.show(i === 1, {delay: 2300});
    s.hops2.forEach(function(h, k){
      if(j === 0) { h.fadeIn({delay: 80 + k*95}); h.color('blue'); }
      else if(j === 1) { h.fadeIn(); h.color('dim'); }
      else h.fadeOut();
    });
    s.hops3.forEach(function(h, k){ if(j === 1) { h.fadeIn({delay: 380 + k*120}); h.color('red'); } else h.fadeOut(); });
    if(j === 1) s.jump3.fadeIn({delay: 60}); else s.jump3.fadeOut();
    s.lp.show(j === 0);
    s.lnew.show(j === 1, {delay: 500});
    s.lstop.show(j === 2, {delay: 300});
    s.ideaHops.forEach(function(h, k){ if(i === 2) h.fadeIn({delay: 150 + k*160}); else h.fadeOut(); });
    s.ideaLab.show(i === 2, {delay: 500});
    if(j >= 0){
      s.crossed.fadeIn(); s.crossed.set([8, 12, 12][j]);
      s.crossed.setNote([L('8 кратных 2 (4, 6, …, 18)', '8 multiples of 2 (4, 6, …, 18)'), L('8 + 4 кратных 3 (9, 12, 15, 18)', '8 + 4 multiples of 3 (9, 12, 15, 18)'),
        L('8 + 4; 5 × 5 = 25 больше 19 — стоп', '8 + 4; 5 × 5 = 25 > 19: stop')][j]);
    } else s.crossed.fadeOut();
  }
});
})();

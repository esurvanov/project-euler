/*
 * scenes/p4.js — LAB scenes, part 4 (SCENE_API.md §8–13, NARRATIVE.md, CONTRACT_I18N.md).
 * ArithmeticProgressionSum · SumOfSquares · InPlaceAlgorithm · BruteForceSearch ·
 * VariableElimination · Canonicalization · SymmetryBreaking · LogarithmProductRule ·
 * FixedPointIteration · Sorting · HashGrouping · EquivalenceClass · EuclidsFormula ·
 * QuadraticFormula
 * Every method tells one story: task → head-on → what we notice → how we solve.
 * Step captions are the story sentences; they are generated into the STORIES block below by
 * tools/p4_stories.py, which also writes stories/<Id>.json — edit the story there, not here.
 * On the stage: numbers on objects, the head-on counter (red) and the counter of the trick (green),
 * and at most one callout per step. Every string goes through L(ru, en).
 */
(function(){
'use strict';
if(!window.LAB || !LAB.register) return;

/*STORIES-BEGIN*/
var STEPS = {
 "ArithmeticProgressionSum": [
  {
   "chapter": "problem",
   "caption": {
    "ru": "Нужно сложить 4 + 8 + 12 + 16 + 20 — пять чисел, где каждое следующее на 4 больше предыдущего.",
    "en": "Add up 4 + 8 + 12 + 16 + 20: five numbers, each one 4 more than the one before."
   },
   "tag": {
    "ru": "задача",
    "en": "task"
   }
  },
  {
   "chapter": "problem",
   "caption": {
    "ru": "В лоб: складываем по одному слева направо — 4 + 8 = 12, потом 24, 40 и 60. Это 4 сложения, и чем длиннее ряд, тем их больше.",
    "en": "Head-on: add them one by one from left to right — 4 + 8 = 12, then 24, 40 and 60. That is 4 additions, and a longer row needs more."
   },
   "tag": {
    "ru": "в лоб",
    "en": "head-on"
   }
  },
  {
   "chapter": "idea",
   "caption": {
    "ru": "Если брать числа парами с двух концов, каждая пара даёт одно и то же: 4 + 20 = 24 и 8 + 16 = 24. Значит, складывать все числа по одному не нужно.",
    "en": "Pair the numbers from both ends and every pair gives the same total: 4 + 20 = 24 and 8 + 16 = 24. So there is no need to add them one at a time."
   },
   "tag": {
    "ru": "замечаем",
    "en": "notice"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Пара 4 + 20 даёт 24, пара 8 + 16 тоже 24, а 12 в середине — ровно половина от 24.",
    "en": "The pair 4 + 20 gives 24, the pair 8 + 16 gives 24 too, and the 12 in the middle is exactly half of 24."
   },
   "tag": {
    "ru": "пары",
    "en": "pairs"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Каждые два числа вместе дают 24, а чисел 5 — значит, сумма равна 24 × 5 ÷ 2 = 60.",
    "en": "Every two numbers together make 24, and there are 5 numbers, so the sum is 24 × 5 ÷ 2 = 60."
   },
   "tag": {
    "ru": "сумма",
    "en": "sum"
   }
  }
 ],
 "SumOfSquares": [
  {
   "chapter": "problem",
   "caption": {
    "ru": "Пирамида сложена из квадратных слоёв кубиков: 1 × 1, 2 × 2, 3 × 3 и 4 × 4. Сколько в ней всего кубиков, то есть чему равно 1² + 2² + 3² + 4²?",
    "en": "A pyramid is built from square layers of cubes: 1 × 1, 2 × 2, 3 × 3 and 4 × 4. How many cubes does it have — what is 1² + 2² + 3² + 4²?"
   },
   "tag": {
    "ru": "задача",
    "en": "task"
   }
  },
  {
   "chapter": "problem",
   "caption": {
    "ru": "В лоб: считаем кубики каждого слоя — 1, 4, 9, 16 — и складываем. Это 4 умножения и 3 сложения, всего 7 действий, а для пирамиды из 100 слоёв — уже 199.",
    "en": "Head-on: count the cubes in each layer — 1, 4, 9, 16 — and add them up. That is 4 multiplications and 3 additions, 7 steps in all, and a pyramid of 100 layers needs 199."
   },
   "tag": {
    "ru": "в лоб",
    "en": "head-on"
   }
  },
  {
   "chapter": "idea",
   "caption": {
    "ru": "Каждый квадратный слой делится по диагонали на две лесенки, и из таких лесенок складывается ровный брусок: шесть одинаковых пирамид укладываются в брусок 4 × 5 × 9.",
    "en": "Each square layer splits along its diagonal into two staircases, and such staircases fit together into a neat box: six identical pyramids fill a 4 × 5 × 9 block."
   },
   "tag": {
    "ru": "замечаем",
    "en": "notice"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Нижний слой 4 × 4 делится на синюю лесенку из 1 + 2 + 3 + 4 = 10 кубиков и красную из 1 + 2 + 3 = 6: вместе 16.",
    "en": "The bottom 4 × 4 layer splits into a blue staircase of 1 + 2 + 3 + 4 = 10 cubes and a red one of 1 + 2 + 3 = 6: 16 together."
   },
   "tag": {
    "ru": "лесенки",
    "en": "stairs"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Так делится каждый слой: синих кубиков 1 + 3 + 6 + 10 = 20, красных 0 + 1 + 3 + 6 = 10, всего 30.",
    "en": "Every layer splits the same way: 1 + 3 + 6 + 10 = 20 blue cubes and 0 + 1 + 3 + 6 = 10 red ones, 30 in all."
   },
   "tag": {
    "ru": "все слои",
    "en": "all layers"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Шесть таких пирамид складываются в брусок 4 × 5 × 9 = 180 кубиков, значит, одна пирамида — это 180 ÷ 6 = 30.",
    "en": "Six such pyramids fill a block of 4 × 5 × 9 = 180 cubes, so one pyramid holds 180 ÷ 6 = 30."
   },
   "tag": {
    "ru": "брусок",
    "en": "block"
   }
  }
 ],
 "InPlaceAlgorithm": [
  {
   "chapter": "problem",
   "caption": {
    "ru": "Число 7 удваивают четыре раза подряд: 7, 14, 28, 56, 112. В конце нужно только последнее число. Сколько ячеек памяти для этого нужно?",
    "en": "The number 7 is doubled four times in a row: 7, 14, 28, 56, 112. Only the last number is needed. How many memory cells does that take?"
   },
   "tag": {
    "ru": "задача",
    "en": "task"
   }
  },
  {
   "chapter": "problem",
   "caption": {
    "ru": "В лоб: каждое новое число записываем в новую ячейку — 1 начальное и 4 удвоения, 5 занятых ячеек, хотя четыре из них больше никогда не читаются.",
    "en": "Head-on: write each new number into a new cell — 1 starting number and 4 doublings, 5 cells in use, although four of them are never read again."
   },
   "tag": {
    "ru": "в лоб",
    "en": "head-on"
   }
  },
  {
   "chapter": "idea",
   "caption": {
    "ru": "Чтобы получить следующее число, нужно только предыдущее. Как только 14 записано, число 7 больше не нужно — его место можно занять.",
    "en": "To get the next number you only need the previous one. As soon as 14 is written, the 7 is no longer needed — its place can be reused."
   },
   "tag": {
    "ru": "замечаем",
    "en": "notice"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Каждое удвоение читает число и записывает удвоенное — после этого старое число уже никому не нужно.",
    "en": "Each doubling reads a number and writes twice that — after that nobody needs the old number any more."
   },
   "tag": {
    "ru": "не нужны",
    "en": "unused"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Пишем каждое новое число поверх старого: в одной ячейке по очереди лежат 7, 14, 28, 56 и 112.",
    "en": "Write each new number over the old one: one cell holds 7, 14, 28, 56 and 112 in turn."
   },
   "tag": {
    "ru": "одна ячейка",
    "en": "one cell"
   }
  }
 ],
 "BruteForceSearch": [
  {
   "chapter": "problem",
   "caption": {
    "ru": "На поле 6 × 6 в одной клетке лежит приз, снаружи все клетки одинаковые. Открыть можно не больше 100 клеток. Успеем ли найти приз?",
    "en": "A 6 × 6 board has a prize under one cell, and all cells look the same from outside. You may open at most 100 cells. Will you find the prize in time?"
   },
   "tag": {
    "ru": "задача",
    "en": "task"
   }
  },
  {
   "chapter": "problem",
   "caption": {
    "ru": "В лоб: открываем клетки подряд, не посчитав их заранее. Приз нашёлся на 23-й клетке, но пока мы открывали, мы не знали, хватит ли 100 попыток.",
    "en": "Head-on: open cells one after another without counting them first. The prize turned up in the 23rd cell, but while opening we did not know whether 100 tries would be enough."
   },
   "tag": {
    "ru": "вслепую",
    "en": "blind"
   }
  },
  {
   "chapter": "idea",
   "caption": {
    "ru": "Клетки можно посчитать, ничего не открывая: 6 рядов по 6 клеток — это 36. А 36 меньше 100, значит, открыть все клетки мы успеем в любом случае.",
    "en": "The cells can be counted without opening any: 6 rows of 6 cells make 36. And 36 is less than 100, so we can open every cell in any case."
   },
   "tag": {
    "ru": "замечаем",
    "en": "notice"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "До первой попытки считаем: 6 × 6 = 36 клеток — даже в худшем случае это меньше 100 попыток.",
    "en": "Before the first try, count: 6 × 6 = 36 cells — even in the worst case that is fewer than 100 tries."
   },
   "tag": {
    "ru": "считаем",
    "en": "count"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Теперь спокойно открываем по порядку: приз на 23-й клетке, и то, что попыток хватит, было известно заранее.",
    "en": "Now open them in order with no worry: the prize is in the 23rd cell, and we knew in advance there would be enough tries."
   },
   "tag": {
    "ru": "открываем",
    "en": "open"
   }
  }
 ],
 "VariableElimination": [
  {
   "chapter": "problem",
   "caption": {
    "ru": "Два числа a и b, каждое от 1 до 6. Нужно найти все пары, у которых a + b = 7.",
    "en": "Two numbers a and b, each from 1 to 6. Find every pair with a + b = 7."
   },
   "tag": {
    "ru": "задача",
    "en": "task"
   }
  },
  {
   "chapter": "problem",
   "caption": {
    "ru": "В лоб: перебираем все пары подряд — 6 значений a на 6 значений b, это 36 пар, а сумма 7 получается только у шести.",
    "en": "Head-on: try every pair — 6 values of a times 6 values of b, 36 pairs, and only six of them add up to 7."
   },
   "tag": {
    "ru": "в лоб",
    "en": "head-on"
   }
  },
  {
   "chapter": "idea",
   "caption": {
    "ru": "Если a уже выбрано, b можно не искать: из a + b = 7 сразу следует b = 7 − a.",
    "en": "Once a is chosen there is nothing to search for: a + b = 7 means b = 7 − a straight away."
   },
   "tag": {
    "ru": "замечаем",
    "en": "notice"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Для каждого a от 1 до 6 сразу считаем b = 7 − a: получаются пары (1, 6), (2, 5), (3, 4), (4, 3), (5, 2), (6, 1).",
    "en": "For each a from 1 to 6, compute b = 7 − a at once: the pairs are (1, 6), (2, 5), (3, 4), (4, 3), (5, 2), (6, 1)."
   },
   "tag": {
    "ru": "b = 7 − a",
    "en": "b = 7 − a"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Каждое b попало в промежуток от 1 до 6 — все шесть пар подходят, а остальные 30 клеток проверять не нужно.",
    "en": "Every b lands between 1 and 6 — all six pairs fit, and the other 30 cells never need checking."
   },
   "tag": {
    "ru": "все пары",
    "en": "all pairs"
   }
  }
 ],
 "Canonicalization": [
  {
   "chapter": "problem",
   "caption": {
    "ru": "Для каждого числа от 2 до 10 нужно выписать его степени — квадрат, куб и так далее. Какие числа можно пропустить, потому что все их степени уже выписаны у меньшего числа?",
    "en": "For each number from 2 to 10 we write down its powers — square, cube and so on. Which numbers can be skipped because all their powers already appear under a smaller number?"
   },
   "tag": {
    "ru": "задача",
    "en": "task"
   }
  },
  {
   "chapter": "problem",
   "caption": {
    "ru": "В лоб: выписываем степени всех 9 чисел. Но степени 4, 8 и 9 повторяют уже выписанные: 4² = 16 = 2⁴ и 4³ = 64 = 2⁶ — работа сделана второй раз.",
    "en": "Head-on: write out the powers of all 9 numbers. But the powers of 4, 8 and 9 repeat ones already written: 4² = 16 = 2⁴ and 4³ = 64 = 2⁶ — the same work done twice."
   },
   "tag": {
    "ru": "в лоб",
    "en": "head-on"
   }
  },
  {
   "chapter": "idea",
   "caption": {
    "ru": "Число 4 само является степенью двойки: 4 = 2². Значит, любая степень четвёрки — это тоже степень двойки. Такие числа видно сразу, ещё до всякого счёта.",
    "en": "4 is itself a power of 2: 4 = 2². So every power of 4 is also a power of 2. Numbers like that can be spotted at once, before any counting."
   },
   "tag": {
    "ru": "замечаем",
    "en": "notice"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Находим числа, которые сами являются степенью меньшего: 4 = 2², 8 = 2³, 9 = 3².",
    "en": "Find the numbers that are themselves a power of a smaller one: 4 = 2², 8 = 2³, 9 = 3²."
   },
   "tag": {
    "ru": "повторы",
    "en": "repeats"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Пропускаем 4, 8 и 9 и выписываем степени только у 2, 3, 5, 6, 7 и 10 — 6 чисел вместо 9.",
    "en": "Skip 4, 8 and 9 and write out powers only for 2, 3, 5, 6, 7 and 10 — 6 numbers instead of 9."
   },
   "tag": {
    "ru": "пропуск",
    "en": "skip"
   }
  }
 ],
 "SymmetryBreaking": [
  {
   "chapter": "problem",
   "caption": {
    "ru": "Номера i и j берутся от 1 до 4. Сколько получается разных пар, если (1, 2) и (2, 1) считать одной и той же парой?",
    "en": "The numbers i and j run from 1 to 4. How many different pairs are there if (1, 2) and (2, 1) count as the same pair?"
   },
   "tag": {
    "ru": "задача",
    "en": "task"
   }
  },
  {
   "chapter": "problem",
   "caption": {
    "ru": "В лоб: перебираем все 4 × 4 = 16 клеток доски, но клетки вроде (2, 1) и (1, 2) — одна и та же пара, посчитанная дважды.",
    "en": "Head-on: go through all 4 × 4 = 16 squares of the board, but squares like (2, 1) and (1, 2) are the same pair counted twice."
   },
   "tag": {
    "ru": "в лоб",
    "en": "head-on"
   }
  },
  {
   "chapter": "idea",
   "caption": {
    "ru": "Каждая клетка под диагональю доски — зеркальная копия клетки над ней. Если всегда брать j не меньше i, копии просто не появятся.",
    "en": "Every square below the diagonal is a mirror copy of a square above it. If j is always at least i, the copies never appear."
   },
   "tag": {
    "ru": "замечаем",
    "en": "notice"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Под диагональю 6 клеток, и каждая повторяет клетку над диагональю: (2, 1) = (1, 2), (3, 1) = (1, 3) и так далее.",
    "en": "Below the diagonal there are 6 squares, and each repeats one above it: (2, 1) = (1, 2), (3, 1) = (1, 3) and so on."
   },
   "tag": {
    "ru": "зеркала",
    "en": "mirrors"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Для каждого i берём j от i до 4: 4 + 3 + 2 + 1 = 10 пар, а копии не появляются вовсе.",
    "en": "For each i, take j from i to 4: 4 + 3 + 2 + 1 = 10 pairs, and the copies never appear at all."
   },
   "tag": {
    "ru": "j ≥ i",
    "en": "j ≥ i"
   }
  }
 ],
 "LogarithmProductRule": [
  {
   "chapter": "problem",
   "caption": {
    "ru": "Нужно найти ln(4 × 8) — логарифм произведения. (ln числа — это степень, в которую надо возвести число e ≈ 2,718, чтобы получить это число.) Само произведение хранить не хочется: в больших задачах оно огромное.",
    "en": "Find ln(4 × 8), the logarithm of a product. (The ln of a number is the power you raise e ≈ 2.718 to in order to get that number.) We would rather not store the product itself: in big problems it is huge."
   },
   "tag": {
    "ru": "задача",
    "en": "task"
   }
  },
  {
   "chapter": "problem",
   "caption": {
    "ru": "В лоб: сначала перемножаем 4 × 8 = 32 и берём ln 32. Пока 32 маленькое, это не страшно, но произведение всех чисел от 1 до 1000 состоит из 2568 цифр и в обычную ячейку памяти не помещается.",
    "en": "Head-on: first multiply 4 × 8 = 32, then take ln 32. While 32 is small that is fine, but the product of all numbers from 1 to 1000 has 2,568 digits and does not fit into an ordinary memory cell."
   },
   "tag": {
    "ru": "в лоб",
    "en": "head-on"
   }
  },
  {
   "chapter": "idea",
   "caption": {
    "ru": "Логарифм превращает умножение в сложение: ln(4 × 8) = ln 4 + ln 8. На линейке, где каждое деление — это умножение на 2, длины отрезков просто складываются.",
    "en": "A logarithm turns multiplying into adding: ln(4 × 8) = ln 4 + ln 8. On a ruler where each mark means \"times 2\", lengths simply add up."
   },
   "tag": {
    "ru": "замечаем",
    "en": "notice"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Отрезок длиной ln 4 = 1,386 доходит до метки 4, а за ним отрезок ln 8 = 2,079 доходит до метки 32.",
    "en": "A bar of length ln 4 = 1.386 reaches the mark 4, and after it a bar of length ln 8 = 2.079 reaches the mark 32."
   },
   "tag": {
    "ru": "отрезки",
    "en": "bars"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Вместе они дают 1,386 + 2,079 = 3,466 — это и есть ln 32, а само число 32 мы так и не хранили.",
    "en": "Together they make 1.386 + 2.079 = 3.466 — which is ln 32, and the number 32 was never stored."
   },
   "tag": {
    "ru": "сумма",
    "en": "sum"
   }
  }
 ],
 "FixedPointIteration": [
  {
   "chapter": "problem",
   "caption": {
    "ru": "Нужно найти √2 с четырьмя знаками после запятой. Известно, что √2 — это такое число x, для которого (x + 2/x) ÷ 2 снова даёт x.",
    "en": "Find √2 to four decimal places. We know √2 is the number x for which (x + 2/x) ÷ 2 gives x back again."
   },
   "tag": {
    "ru": "задача",
    "en": "task"
   }
  },
  {
   "chapter": "problem",
   "caption": {
    "ru": "В лоб: перебираем x от 1 с шагом 0,0001 и проверяем, не стало ли x × x больше 2. До 1,4142 это 4142 проверки.",
    "en": "Head-on: step x up from 1 by 0.0001 and check whether x × x has passed 2. Reaching 1.4142 takes 4,142 checks."
   },
   "tag": {
    "ru": "перебор",
    "en": "scan"
   }
  },
  {
   "chapter": "idea",
   "caption": {
    "ru": "Если подставить в (x + 2/x) ÷ 2 грубую догадку, получится догадка точнее. Подставляем ответ снова и снова — и каждый раз верных знаков становится примерно вдвое больше.",
    "en": "Put a rough guess into (x + 2/x) ÷ 2 and a better guess comes out. Feed the answer back in again and again — each time the number of correct digits roughly doubles."
   },
   "tag": {
    "ru": "замечаем",
    "en": "notice"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Начинаем с 1: (1 + 2/1) ÷ 2 = 1,5. Подставляем 1,5 — получаем 1,4167, подставляем 1,4167 — получаем 1,4142.",
    "en": "Start with 1: (1 + 2/1) ÷ 2 = 1.5. Put in 1.5 to get 1.4167, put in 1.4167 to get 1.4142."
   },
   "tag": {
    "ru": "подстановки",
    "en": "repeat"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Последняя подстановка сдвинула ответ на 0,0025, а следующая сдвинет меньше чем на 0,0001 — останавливаемся: √2 ≈ 1,4142.",
    "en": "The last round moved the answer by 0.0025, and the next would move it by less than 0.0001 — so stop: √2 ≈ 1.4142."
   },
   "tag": {
    "ru": "стоп",
    "en": "stop"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "На графике подстановки выглядят как лесенка: каждая ступенька ближе к точке, где ответ перестаёт меняться, — это и есть √2.",
    "en": "On a graph the rounds form a staircase: each step lands closer to the point where the answer stops changing — that point is √2."
   },
   "tag": {
    "ru": "график",
    "en": "graph"
   }
  }
 ],
 "Sorting": [
  {
   "chapter": "problem",
   "caption": {
    "ru": "Пять столбиков высотой 3, 5, 1, 4, 2. Нужно расставить их по возрастанию.",
    "en": "Five bars have heights 3, 5, 1, 4, 2. Put them in increasing order."
   },
   "tag": {
    "ru": "задача",
    "en": "task"
   }
  },
  {
   "chapter": "problem",
   "caption": {
    "ru": "В лоб: перебираем все расстановки — их 5 × 4 × 3 × 2 × 1 = 120 — и каждую проверяем четырьмя сравнениями соседей: до 480 сравнений.",
    "en": "Head-on: try every arrangement — there are 5 × 4 × 3 × 2 × 1 = 120 — and check each with four comparisons of neighbours: up to 480 comparisons."
   },
   "tag": {
    "ru": "в лоб",
    "en": "head-on"
   }
  },
  {
   "chapter": "idea",
   "caption": {
    "ru": "Если два соседа стоят не по порядку, достаточно поменять их местами — это исправляет один беспорядок, и перебирать расстановки не нужно.",
    "en": "If two neighbours are out of order, just swap them — that fixes one piece of disorder, and there is no need to try arrangements."
   },
   "tag": {
    "ru": "замечаем",
    "en": "notice"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Идём слева направо и сравниваем соседей: 4 сравнения, 3 обмена — самый высокий столбик 5 уезжает в конец.",
    "en": "Go from left to right comparing neighbours: 4 comparisons, 3 swaps — the tallest bar, 5, travels to the end."
   },
   "tag": {
    "ru": "проход 1",
    "en": "pass 1"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Второй проход: 3 сравнения, 2 обмена — на своё место встаёт 4.",
    "en": "Second pass: 3 comparisons, 2 swaps — 4 reaches its place."
   },
   "tag": {
    "ru": "проход 2",
    "en": "pass 2"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Третий проход: 2 сравнения, 1 обмен — на своё место встаёт 3.",
    "en": "Third pass: 2 comparisons, 1 swap — 3 reaches its place."
   },
   "tag": {
    "ru": "проход 3",
    "en": "pass 3"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Четвёртый проход: 1 сравнение без обмена — всё по порядку: 1, 2, 3, 4, 5.",
    "en": "Fourth pass: 1 comparison and no swap — everything is in order: 1, 2, 3, 4, 5."
   },
   "tag": {
    "ru": "проход 4",
    "en": "pass 4"
   }
  }
 ],
 "HashGrouping": [
  {
   "chapter": "problem",
   "caption": {
    "ru": "Среди чисел 21, 12, 13, 31, 11 нужно найти пары, составленные из одних и тех же цифр, — как 21 и 12.",
    "en": "Among the numbers 21, 12, 13, 31, 11, find the pairs made of the same digits — like 21 and 12."
   },
   "tag": {
    "ru": "задача",
    "en": "task"
   }
  },
  {
   "chapter": "problem",
   "caption": {
    "ru": "В лоб: сравниваем каждое число с каждым — 5 × 4 ÷ 2 = 10 пар, а подходящих среди них только 2.",
    "en": "Head-on: compare every number with every other — 5 × 4 ÷ 2 = 10 pairs, and only 2 of them match."
   },
   "tag": {
    "ru": "в лоб",
    "en": "head-on"
   }
  },
  {
   "chapter": "idea",
   "caption": {
    "ru": "Если записать цифры каждого числа по возрастанию, у чисел из одних и тех же цифр получится одинаковая запись: 21 → 12 и 12 → 12. Сравнивать нужно только числа с одинаковой записью.",
    "en": "Write each number's digits in increasing order, and numbers made of the same digits get the same label: 21 → 12 and 12 → 12. Only numbers with the same label need comparing."
   },
   "tag": {
    "ru": "замечаем",
    "en": "notice"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Для каждого числа записываем его цифры по возрастанию и кладём числа с одинаковой записью в одну коробку: «12», «13» и «11» — 5 записей.",
    "en": "For each number, write its digits in increasing order and put numbers with the same label into one box: \"12\", \"13\" and \"11\" — 5 labels."
   },
   "tag": {
    "ru": "коробки",
    "en": "boxes"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Сравниваем числа только внутри коробок: 21 с 12 и 13 с 31 — 2 сравнения, а 11 сравнивать не с кем.",
    "en": "Compare numbers only inside the boxes: 21 with 12 and 13 with 31 — 2 comparisons, and 11 has nothing to compare with."
   },
   "tag": {
    "ru": "внутри",
    "en": "inside"
   }
  }
 ],
 "EquivalenceClass": [
  {
   "chapter": "problem",
   "caption": {
    "ru": "Карточки с числами от 1 до 9 нужно разложить по группам так, чтобы в одной группе были числа с одинаковым остатком от деления на 3.",
    "en": "Cards with the numbers 1 to 9 must be sorted into groups so that each group holds numbers with the same remainder when divided by 3."
   },
   "tag": {
    "ru": "задача",
    "en": "task"
   }
  },
  {
   "chapter": "problem",
   "caption": {
    "ru": "В лоб: для каждой пары карточек проверяем, одинаковые ли у них остатки, — 9 × 8 ÷ 2 = 36 проверок.",
    "en": "Head-on: for every pair of cards, check whether their remainders match — 9 × 8 ÷ 2 = 36 checks."
   },
   "tag": {
    "ru": "в лоб",
    "en": "head-on"
   }
  },
  {
   "chapter": "idea",
   "caption": {
    "ru": "Остаток — это готовая метка группы: его можно посчитать у каждой карточки отдельно, ни с кем её не сравнивая.",
    "en": "The remainder is a ready-made group label: it can be worked out for each card on its own, without comparing it with anything."
   },
   "tag": {
    "ru": "замечаем",
    "en": "notice"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Считаем остаток от деления на 3 у каждой карточки: у 1, 4, 7 он равен 1; у 2, 5, 8 — 2; у 3, 6, 9 — 0. Это 9 делений.",
    "en": "Work out the remainder after dividing by 3 for each card: 1, 4, 7 give 1; 2, 5, 8 give 2; 3, 6, 9 give 0. That is 9 divisions."
   },
   "tag": {
    "ru": "остатки",
    "en": "remainders"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Раскладываем карточки по остатку: получаются 3 группы, и ни одну пару сравнивать не пришлось.",
    "en": "Sort the cards by remainder: that makes 3 groups, and not a single pair had to be compared."
   },
   "tag": {
    "ru": "группы",
    "en": "groups"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Каждую группу можно назвать по её наименьшему числу — 1, 2 и 3: по этому имени сразу находится вся группа.",
    "en": "Each group can be named after its smallest number — 1, 2 and 3: the name leads straight to the whole group."
   },
   "tag": {
    "ru": "имена",
    "en": "names"
   }
  }
 ],
 "EuclidsFormula": [
  {
   "chapter": "problem",
   "caption": {
    "ru": "Нужно найти прямоугольный треугольник с целыми сторонами и периметром 12.",
    "en": "Find a right triangle with whole-number sides and a perimeter of 12."
   },
   "tag": {
    "ru": "задача",
    "en": "task"
   }
  },
  {
   "chapter": "problem",
   "caption": {
    "ru": "В лоб: перебираем две меньшие стороны a < b, третью считаем как 12 − a − b и проверяем, прямой ли угол (a² + b² = c²): 7 пар, подходит только 3, 4, 5.",
    "en": "Head-on: try the two shorter sides a < b, take the third as 12 − a − b, and check for a right angle (a² + b² = c²): 7 pairs, and only 3, 4, 5 works."
   },
   "tag": {
    "ru": "в лоб",
    "en": "head-on"
   }
  },
  {
   "chapter": "idea",
   "caption": {
    "ru": "Любой такой треугольник можно построить из двух чисел m и n: его стороны равны m² − n², 2 × m × n и m² + n², и угол между первыми двумя всегда прямой.",
    "en": "Every such triangle can be built from two numbers m and n: its sides are m² − n², 2 × m × n and m² + n², and the angle between the first two is always a right angle."
   },
   "tag": {
    "ru": "замечаем",
    "en": "notice"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Периметр такого треугольника равен 2 × m × (m + n); чтобы получилось 12, подходит только m = 2, n = 1.",
    "en": "The perimeter of such a triangle is 2 × m × (m + n); to get 12, only m = 2, n = 1 fits."
   },
   "tag": {
    "ru": "m и n",
    "en": "m and n"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Стороны: 2² − 1² = 3, 2 × 2 × 1 = 4, 2² + 1² = 5. Проверка: 9 + 16 = 25, периметр 3 + 4 + 5 = 12.",
    "en": "Sides: 2² − 1² = 3, 2 × 2 × 1 = 4, 2² + 1² = 5. Check: 9 + 16 = 25, and the perimeter is 3 + 4 + 5 = 12."
   },
   "tag": {
    "ru": "стороны",
    "en": "sides"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Если умножить все стороны на 2, получится треугольник 6, 8, 10 с периметром 24 — так строятся и все остальные.",
    "en": "Doubling every side gives the triangle 6, 8, 10 with perimeter 24 — that is how all the others are built."
   },
   "tag": {
    "ru": "× 2",
    "en": "× 2"
   }
  }
 ],
 "QuadraticFormula": [
  {
   "chapter": "problem",
   "caption": {
    "ru": "Треугольник сложен из 21 точки: 1 точка в первом ряду, 2 во втором и так далее. Сколько в нём рядов?",
    "en": "A triangle is made of 21 dots: 1 dot in the first row, 2 in the second, and so on. How many rows does it have?"
   },
   "tag": {
    "ru": "задача",
    "en": "task"
   }
  },
  {
   "chapter": "problem",
   "caption": {
    "ru": "В лоб: считаем точки для 1, 2, 3… рядов по формуле n × (n + 1) ÷ 2 — прибавить 1, умножить, разделить на 2, 3 действия: 1, 3, 6, 10, 15, 21. Это 6 проверок, 18 действий.",
    "en": "Head-on: count the dots for 1, 2, 3… rows with n × (n + 1) ÷ 2 — add 1, multiply, halve, 3 steps each: 1, 3, 6, 10, 15, 21. That is 6 checks and 18 steps."
   },
   "tag": {
    "ru": "в лоб",
    "en": "head-on"
   }
  },
  {
   "chapter": "idea",
   "caption": {
    "ru": "Условие n × (n + 1) ÷ 2 = 21 — это уравнение n² + n − 42 = 0, а у таких уравнений ответ находится сразу по готовой формуле, без перебора.",
    "en": "The condition n × (n + 1) ÷ 2 = 21 is the equation n² + n − 42 = 0, and equations like that are solved straight away by a ready-made formula, without trying values."
   },
   "tag": {
    "ru": "замечаем",
    "en": "notice"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "По формуле: 4 × 42 = 168, 1 + 168 = 169, √169 = 13, −1 + 13 = 12, 12 ÷ 2 = 6 — 5 действий.",
    "en": "By the formula: 4 × 42 = 168, 1 + 168 = 169, √169 = 13, −1 + 13 = 12, 12 ÷ 2 = 6 — 5 steps."
   },
   "tag": {
    "ru": "формула",
    "en": "formula"
   }
  },
  {
   "chapter": "solve",
   "caption": {
    "ru": "Формула даёт два ответа, 6 и −7; рядов меньше нуля не бывает, поэтому ответ — 6 рядов (6 × 7 ÷ 2 = 21).",
    "en": "The formula gives two answers, 6 and −7; a triangle cannot have fewer than zero rows, so the answer is 6 rows (6 × 7 ÷ 2 = 21)."
   },
   "tag": {
    "ru": "ответ",
    "en": "answer"
   }
  }
 ]
};
/*STORIES-END*/

var P = 3;                                   // task, head-on, notice — then the solve steps
var pl = LAB.plural;

/* ---------- local helpers ---------- */
function hidden(t){ return t.items ? t.items.some(hidden) : t._op < 1; }
function vis(api, t, v, o){ if(v){ if(api.instant || hidden(t)) t.fadeIn(o); } else t.fadeOut(); }
function each(list, fn){ for(var k = 0; k < list.length; k++) fn(list[k], k); }
function fmt(api, v, d){ return api.fmt ? api.fmt(v, d) : String(v); }
// head-on counter: hidden on the task step, counts up on the head-on step, then stays on the table
function headOn(api, c, i, target, ms, delay){
  if(i === 0){ c.fadeOut(); return; }
  c.fadeIn(); c.color('red');
  if(i === 1){ c.set(0, {ms: 0}); c.set(target, {ms: ms, delay: delay || 200}); } else c.set(target);
}
// counter of the trick: hidden before the solve chapter; values/notes per solve step (null = hidden)
function trick(api, c, i, vals, notes){
  var j = i - P;
  if(j < 0 || vals[j] == null){ c.fadeOut(); return; }
  c.fadeIn(); c.color('green'); c.set(vals[j], {ms: 800}); c.setNote(notes[j] || '');
}
function hbar(api, x0, w, z, o){
  var b = api.box([w, o.h || 0.3, o.d || 0.5], {pos: [x0, 0, z], color: o.color});
  b.box.position.x = w/2; b.edges.position.x = w/2;
  b.obj.scale.x = 0.001;
  b.grow = function(p, oo){ api.tween(b.obj.scale, {x: Math.max(0.001, p)}, Object.assign({ms: 650}, oo || {})); return b; };
  b.mid = [x0 + w/2, (o.h || 0.3), z];
  return b;
}
function gridLines(api, x0, z0, x1, z1, nx, nz, o){
  var a = [], b = [], k;
  for(k = 0; k <= nz; k++){ var z = z0 + k*(z1 - z0)/nz; if(k % 2 === 0) a.push([x0, 0.1, z], [x1, 0.1, z]); else a.push([x1, 0.1, z], [x0, 0.1, z]); }
  for(k = 0; k <= nx; k++){ var x = x0 + k*(x1 - x0)/nx; if(k % 2 === 0) b.push([x, 0.1, z0], [x, 0.1, z1]); else b.push([x, 0.1, z1], [x, 0.1, z0]); }
  return api.group([api.line(a, o), api.line(b, o)]);
}
function sarrow(api, a, b, o){
  var pts = [];
  for(var k = 0; k <= 30; k++){ var t = k/30; pts.push([a[0] + (b[0] - a[0])*t, (a[1] || 0.05) + ((b[1] || 0.05) - (a[1] || 0.05))*t, a[2] + (b[2] - a[2])*t]); }
  return api.line(pts, {color: (o && o.color) || 'ink', head: true});
}
function allPairs(api, xs, y, z, o){
  var arcs = [];
  for(var a = 0; a < xs.length; a++) for(var b = a + 1; b < xs.length; b++){
    var arc = api.arc([xs[a], y, z], [xs[b], y, z], {color: o.color || 'plain', height: (o.h0 || 0.6) + (o.dh || 0.5)*(b - a) + (o.da || 0)*a, dashed: o.dashed});
    arc.a = a; arc.b = b; arcs.push(arc);
  }
  return arcs;
}

/* ================= 1. ArithmeticProgressionSum: 4 + 8 + 12 + 16 + 20 ================= */
LAB.register({
  id: 'ArithmeticProgressionSum',
  steps: STEPS.ArithmeticProgressionSum,
  view: {yaw: 0.1, pitch: 0.95, fill: 0.9},
  build: function(api){
    var L = api.L;
    var vals = [4, 8, 12, 16, 20], gap = 1.9, run = [null, 12, 24, 40, 60];
    var row = api.row(vals, {gap: gap, h: 0.4, size: 1.1});
    var plus = [];
    for(var k = 0; k < 4; k++) plus.push(api.text('+', [row.pos(k)[0] + gap/2, 0, 0], {size: 0.7, color: 'ink'}));
    var marks = [1, 2, 3, 4].map(function(k){ return api.marks(row.at(k), [{text: '= ' + run[k], color: 'red'}], {dir: 'front'}); });
    var arcB = api.arc(row.at(0), row.at(4), {color: 'blue', height: 2.6});
    var arcR = api.arc(row.at(1), row.at(3), {color: 'red', height: 1.4});
    var lab = api.label('', row.at(2), {color: 'violet', dy: 1.9});
    var ans = api.tile(60, {pos: [0, 0, 3.0], size: 1.6, h: 0.5, color: 'green'});
    var ops = api.counter(L('сложений в лоб', 'head-on additions'), {pos: [-7.4, 0, -2.2], color: 'red', noteFitValue: 4,
      note: function(v){ return v + ' ' + L(pl(v, 'сложение', 'сложения', 'сложений'), pl(v, 'addition', 'additions')); }});
    var done = api.counter(L('действий парами', 'steps with pairs'), {pos: [-7.4, 0, 2.4], color: 'green', noteFitValue: 3, note: ''});
    return {row: row, plus: plus, marks: marks, arcB: arcB, arcR: arcR, lab: lab, ans: ans, ops: ops, done: done};
  },
  step: function(api, s, i){
    var L = api.L, j = i - P, cols = ['blue', 'red', 'violet', 'red', 'blue'];
    s.row.each(function(t, k){
      var col = 'plain', lift = 0, d = 0;
      if(i === 1){ col = 'red'; d = 200 + k*420; }
      if(i === 2 && k !== 2){ col = k === 0 || k === 4 ? 'blue' : 'red'; lift = 0.15; }
      if(j >= 0){ col = cols[k]; d = j === 0 ? Math.min(k, 4 - k)*160 : 0; }
      t.color(col, {delay: d}); t.lift(lift);
    });
    each(s.marks, function(m, k){ if(i === 1) m.show(1, {delay: 200 + (k + 1)*420}); else m.show(0); });
    each(s.plus, function(p){ vis(api, p, i <= 1); p.color(i === 1 ? 'red' : 'ink'); });
    vis(api, s.arcB, i >= 2, {delay: 150}); vis(api, s.arcR, i >= 2, {delay: 450});
    if(i === 2){ s.lab.setText(L('4 + 20 = 24 и 8 + 16 = 24', '4 + 20 = 24 and 8 + 16 = 24')); s.lab.show(true, {delay: 600}); }
    else if(j === 0){ s.lab.setText(L('12 — половина от 24', '12 is half of 24')); s.lab.show(true, {delay: 500}); }
    else s.lab.show(false);
    vis(api, s.ans, j === 1, {delay: 300}); s.ans.lift(j === 1 ? 0.3 : 0, {delay: 300});
    headOn(api, s.ops, i, 4, 4*420, 200);
    trick(api, s.done, i, [1, 3], [L('4 + 20 = 24', '4 + 20 = 24'), L('24 × 5 ÷ 2 = 60', '24 × 5 ÷ 2 = 60')]);
  }
});

/* ================= 2. SumOfSquares: 1² + 2² + 3² + 4² = 30, a pyramid of cubes ================= */
var SQ_OPS = ['1² = 1', '2² = 4', '3² = 9', '4² = 16', '1 + 4 = 5', '5 + 9 = 14', '14 + 16 = 30'];
var SQ_F = ['4 + 1 = 5', '2 × 4 = 8', '8 + 1 = 9', '4 × 5 = 20', '20 × 9 = 180', '180 ÷ 6 = 30'];
LAB.register({
  id: 'SumOfSquares',
  steps: STEPS.SumOfSquares,
  view: {yaw: 0.4, pitch: 0.8, fill: 0.9},
  build: function(api){
    var L = api.L;
    var H = 0.58, layers = {};
    for(var k = 1; k <= 4; k++){
      layers[k] = [];
      for(var r = 0; r < k; r++) for(var c = 0; c < k; c++){
        var b = api.box([0.9, H - 0.04, 0.9], {pos: [c - (k - 1)/2, (4 - k)*H, r - (k - 1)/2], color: 'plain'});
        b.blue = c <= r; b.r = r; b.c = c;
        layers[k].push(b);
      }
    }
    var ops7 = SQ_OPS.map(function(t, k){ return api.badge(t, {pos: [4.4, 0, -2.4 + k*0.62], color: k < 4 ? 'amber' : 'red'}); });
    var u = 0.34, bx = 5.8, bz = 3.2, BW = 4*u, BH = 5*u, BD = 9*u;
    var brick = api.box([BW, BH, BD], {pos: [bx, 0, bz], color: 'violet'});
    var bl = [], q;
    for(q = 1; q < 9; q++) bl.push(api.line([[bx - BW/2, BH + 0.01, bz - BD/2 + q*u], [bx + BW/2, BH + 0.01, bz - BD/2 + q*u]], {color: 'violet'}));
    for(q = 1; q < 4; q++) bl.push(api.line([[bx - BW/2 + q*u, BH + 0.01, bz - BD/2], [bx - BW/2 + q*u, BH + 0.01, bz + BD/2]], {color: 'violet'}));
    var bgrid = api.group(bl);
    var bdims = api.group([
      api.text('4', [bx, 0, bz + BD/2 + 0.45], {size: 0.45, color: 'violet'}),
      api.text('9', [bx + BW/2 + 0.4, 0, bz], {size: 0.45, color: 'violet'}),
      api.text('5', [bx - BW/2 - 0.4, 0, bz - BD/2 + 0.3], {size: 0.45, color: 'violet'})
    ]);
    var fb = SQ_F.map(function(t, k){ return api.badge(t, {pos: [-6.4, 0, 3.4 + k*0.6], color: 'green'}); });
    var lab = api.label('', [-1.5, H, 1.5], {color: 'violet', dy: 1.4});
    var ops = api.counter(L('действий в лоб', 'head-on steps'), {pos: [-6.0, 0, -4.4], color: 'red', noteFitValue: 7,
      note: function(v){ v = Math.round(v); return v <= 4 ? v + ' ' + L(pl(v, 'квадрат', 'квадрата', 'квадратов'), pl(v, 'square', 'squares'))
        : L('4 квадрата + ', '4 squares + ') + (v - 4) + ' ' + L(pl(v - 4, 'сложение', 'сложения', 'сложений'), pl(v - 4, 'addition', 'additions')); }});
    var done = api.counter(L('действий с бруском', 'steps with the block'), {pos: [-6.0, 0, 0.8], color: 'green', noteFitValue: 6, note: ''});
    return {layers: layers, ops7: ops7, brick: brick, bgrid: bgrid, bdims: bdims, fb: fb, lab: lab, ops: ops, done: done};
  },
  step: function(api, s, i){
    var L = api.L, j = i - P;
    for(var k = 1; k <= 4; k++){
      s.layers[k].forEach(function(b){
        var col = 'plain', d = 0;
        if(i === 1){ col = 'amber'; d = 200 + (k - 1)*420; }
        if(i === 2) col = b.blue ? 'violet' : 'amber';
        if(j >= 0) col = b.blue ? 'blue' : 'red';
        if(k === 4){
          if(j === 0) d = b.blue ? b.r*120 : 500 + b.c*120;
          b.color(col, {delay: d}); b.fadeIn(); b.lift(0); return;
        }
        b.color(col, {delay: d});
        var on = i <= 1 || j >= 1;
        if(on){ b.fadeIn({delay: j === 1 ? (4 - k)*380 : 0}); b.lift(0, {delay: j === 1 ? (4 - k)*380 : 0, ms: 520}); }
        else { b.fadeOut(); b.lift(1.4); }
      });
    }
    each(s.ops7, function(b, k){ vis(api, b, i === 1, {delay: 200 + k*420}); });
    vis(api, s.brick, j === 2, {delay: 200}); vis(api, s.bgrid, j === 2, {delay: 400}); vis(api, s.bdims, j === 2, {delay: 500});
    each(s.fb, function(b, k){ vis(api, b, j === 2, {delay: 800 + k*250}); });
    var lt = i === 2 ? L('16 = 10 + 6', '16 = 10 + 6')
      : j === 0 ? L('синих 10, красных 6', '10 blue, 6 red')
      : j === 1 ? L('синих 20 + красных 10 = 30', '20 blue + 10 red = 30')
      : j === 2 ? L('6 пирамид = брусок 4 × 5 × 9', '6 pyramids = a 4 × 5 × 9 block') : '';
    if(lt){ s.lab.setText(lt); s.lab.to(j === 2 ? s.brick : [-1.5, 0.58, 1.5]); s.lab.show(true, {delay: 500}); } else s.lab.show(false);
    headOn(api, s.ops, i, 7, 7*420, 200);
    trick(api, s.done, i, [null, null, 6], [null, null, L('180 ÷ 6 = 30', '180 ÷ 6 = 30')]);
  }
});

/* ================= 3. InPlaceAlgorithm: 7 → 14 → 28 → 56 → 112 ================= */
LAB.register({
  id: 'InPlaceAlgorithm',
  steps: STEPS.InPlaceAlgorithm,
  view: {yaw: 0.08, pitch: 0.95, fill: 0.9},
  build: function(api){
    var L = api.L;
    var vals = [7, 14, 28, 56, 112], gap = 2.1;
    var row = api.row(vals, {gap: gap, size: 1.2, h: 0.42});
    var home = []; row.each(function(t, k){ home.push(row.pos(k)); });
    var hops = [], x2 = [];
    for(var k = 0; k < 4; k++){
      hops.push(api.arc(row.at(k), row.at(k + 1), {color: 'amber', height: 0.9, head: true}));
      x2.push(api.text('×2', [home[k][0] + gap/2, 0, -1.0], {size: 0.42, color: 'amber'}));
    }
    var marks = vals.map(function(v, k){ return api.marks(row.at(k), [{text: L('ячейка ', 'cell ') + (k + 1), color: 'red'}], {dir: 'front'}); });
    var lab = api.label(L('14 записано — 7 больше не нужно', '14 is written — 7 is no longer needed'), row.at(0), {color: 'violet', dy: 1.4});
    var ops = api.counter(L('ячеек в лоб', 'head-on cells'), {pos: [-3.6, 0, -3.4], color: 'red', noteFitValue: 5,
      note: function(v){ v = Math.round(v); return v < 1 ? '' : L('1 начальное + ', '1 start + ') + (v - 1) + ' ' + L(pl(v - 1, 'удвоение', 'удвоения', 'удвоений'), pl(v - 1, 'doubling', 'doublings')); }});
    var done = api.counter(L('ячеек поверх старого', 'cells, writing over'), {pos: [3.6, 0, -3.4], color: 'green', noteFitValue: 1, note: ''});
    return {row: row, home: home, hops: hops, x2: x2, marks: marks, lab: lab, ops: ops, done: done};
  },
  step: function(api, s, i){
    var L = api.L, j = i - P;
    s.row.each(function(t, k){
      var last = k === 4, col = 'plain', d = 0, on = true;
      if(i === 0) on = k === 0;
      if(i === 1){ col = 'red'; d = 200 + k*420; }
      if(i === 2 && k <= 1) col = 'violet';
      if(j === 0){ col = last ? 'green' : 'red'; d = last ? 900 : 200 + k*220; }
      if(j === 1) col = 'green';
      t.color(col, {delay: d});
      t.strike(!last && j === 0, {delay: d});
      t.lift(last && j === 1 ? 0.35 : 0, {delay: 300});
      if(last){
        t.moveTo(j === 1 ? [0, 0, 0] : s.home[k], {delay: 300, ms: 600});
        if(on) t.fadeIn({delay: d}); else t.fadeOut();
        if(j === 1){ [7, 14, 28, 56, 112].forEach(function(v, q){ t.setText(v, {delay: 900 + q*450}); }); }
        else t.setText(112);
        return;
      }
      if(j === 1){ t.moveTo([0, 0, 0], {ms: 500, delay: k*80}); t.fadeOut({delay: 250 + k*80}); }
      else { t.moveTo(s.home[k]); if(on) t.fadeIn({delay: d}); else t.fadeOut(); }
    });
    each(s.marks, function(m, k){ if(i === 1) m.show(1, {delay: 200 + k*420}); else m.show(0); });
    each(s.hops, function(h, k){ vis(api, h, j === 0 || (i === 2 && k === 0), {delay: j === 0 ? 200 + k*220 : 300}); h.color(i === 2 ? 'violet' : 'amber'); });
    each(s.x2, function(x, k){ vis(api, x, i === 1 || j === 0, {delay: i === 1 ? 400 + k*420 : 200 + k*220}); });
    s.lab.show(i === 2, {delay: 400});
    headOn(api, s.ops, i, 5, 5*420, 200);
    trick(api, s.done, i, [null, 1], [null, L('7, 14, 28, 56, 112 — по очереди', '7, 14, 28, 56, 112 in turn')]);
  }
});

/* ================= 4. BruteForceSearch: 6×6 board, budget 100, prize at the 23rd cell ================= */
LAB.register({
  id: 'BruteForceSearch',
  steps: STEPS.BruteForceSearch,
  view: {yaw: 0.1, pitch: 1.0, fill: 0.9},
  build: function(api){
    var L = api.L;
    var field = api.grid(6, 6, function(){ return '?'; }, {pos: [-3.8, 0, 0], gap: 1.05, size: 0.9, h: 0.3});
    var cap = api.box([5.4, 0.08, 5.4], {pos: [4.4, 0, 0], color: 'teal'});
    var capGrid = gridLines(api, 1.7, -2.7, 7.1, 2.7, 10, 10, {color: 'teal'});
    var le = api.text('36 ≤ 100', [0.45, 0, 3.7], {size: 0.6, color: 'ink'});
    var t100 = api.text(L('100 попыток', '100 tries'), [4.4, 0, 3.4], {size: 0.5, color: 'teal'});
    var ptr = api.pointer({color: 'green'});
    var lab = api.label('', field.at(0, 5), {color: 'violet', dy: 0.4});
    var ops = api.counter(L('открыто вслепую', 'opened blind'), {pos: [-5.4, 0, -6.4], color: 'red', w: 3.2, d: 1.4, noteFitValue: 23,
      note: function(v){ v = Math.round(v); return v + L(' — сколько впереди, неизвестно', ' — how many are left: unknown'); }});
    var done = api.counter(L('открыто после подсчёта', 'opened after counting'), {pos: [3.4, 0, -6.4], color: 'green', w: 3.2, d: 1.4, noteFitValue: 23, note: ''});
    return {field: field, cap: cap, capGrid: capGrid, le: le, t100: t100, ptr: ptr, lab: lab, ops: ops, done: done};
  },
  step: function(api, s, i){
    var L = api.L, j = i - P;
    s.field.each(function(t, k){
      var col = 'plain', tx = '?', d = 0;
      if((i === 1 || j === 1) && k < 22){ col = i === 1 ? 'red' : 'blue'; tx = k + 1; d = 200 + k*70; }
      if((i === 1 || j === 1) && k === 22){ col = 'green'; tx = 23; d = 200 + k*70; }
      if(i === 2 || j === 0){ col = 'violet'; d = (k % 6 + Math.floor(k/6))*40; }
      t.color(col, {delay: d});
      t.setText(tx, {delay: i === 1 || j === 1 ? d : 0});
      t.lift((i === 1 || j === 1) && k === 22 ? 0.35 : 0, {delay: d});
    });
    [s.cap, s.capGrid, s.t100].forEach(function(t){ vis(api, t, j === 0, {delay: 350}); });
    vis(api, s.le, j === 0, {delay: 600});
    if(j === 1){ s.ptr.fadeIn({delay: 22*70}); s.ptr.at(s.field.at(3, 4)); } else s.ptr.fadeOut();
    var lt = i === 2 ? L('6 рядов × 6 клеток = 36', '6 rows × 6 cells = 36') : j === 0 ? L('36 меньше 100 — успеем', '36 is less than 100 — enough') : '';
    if(lt){ s.lab.setText(lt); s.lab.show(true, {delay: 400}); } else s.lab.show(false);
    headOn(api, s.ops, i, 23, 23*70, 200);
    trick(api, s.done, i, [null, 23], [null, L('худший случай — 36', 'worst case: 36')]);
  }
});

/* ================= 5. VariableElimination: a + b = 7, 36 pairs → 6 ================= */
LAB.register({
  id: 'VariableElimination',
  steps: STEPS.VariableElimination,
  view: {yaw: 0.12, pitch: 1.0, fill: 0.88},
  build: function(api){
    var L = api.L;
    var gap = 1.1;
    var g = api.grid(6, 6, function(){ return ''; }, {gap: gap, size: 0.95, h: 0.32});
    var axis = [];
    for(var k = 0; k < 6; k++){
      axis.push(api.text(String(k + 1), [-3.6, 0, (k - 2.5)*gap], {size: 0.42, color: 'blue'}));
      axis.push(api.text(String(k + 1), [(k - 2.5)*gap, 0, -3.5], {size: 0.42, color: 'red'}));
    }
    axis.push(api.text('a', [-4.4, 0, 0], {size: 0.6, color: 'blue'}));
    axis.push(api.text('b', [0, 0, -4.3], {size: 0.6, color: 'red'}));
    var lab = api.label('', [3.6, 0.2, 3.4], {color: 'violet', dy: 0.3});
    var ops = api.counter(L('пар в лоб', 'head-on pairs'), {pos: [6.4, 0, -1.8], color: 'red', quant: 6, noteFitValue: 36,
      note: function(v){ var r = Math.round(v/6); return r + ' × 6 ' + L(pl(r*6, 'пар', 'пары', 'пар'), 'pairs'); }});
    var done = api.counter(L('пар с b = 7 − a', 'pairs with b = 7 − a'), {pos: [6.4, 0, 2.2], color: 'green', noteFitValue: 6, note: ''});
    return {g: g, axis: axis, lab: lab, ops: ops, done: done};
  },
  step: function(api, s, i){
    var L = api.L, j = i - P;
    for(var r = 0; r < 6; r++) for(var c = 0; c < 6; c++){
      var t = s.g.at(r, c), on = (r + 1) + (c + 1) === 7, d = 0;
      var col = 'plain', h = 0.32, lift = 0, tx = '';
      if(i === 1){ col = on ? 'green' : 'red'; d = 200 + (r*6 + c)*55; tx = String(r + c + 2); }
      if(i === 2 && r === 1){ col = c === 4 ? 'violet' : 'dim'; lift = c === 4 ? 0.3 : 0; tx = c === 4 ? '2 5' : ''; h = c === 4 ? 0.32 : 0.08; }
      if(j === 0 && on){ col = 'violet'; d = r*110; }
      if(j === 1){ if(on){ col = 'green'; lift = 0.25; d = r*110; } else { col = 'dim'; h = 0.06; d = 150 + (r + c)*30; } }
      if(j >= 0 && on) tx = (r + 1) + ' ' + (c + 1);
      t.color(col, {delay: d}); t.setText(tx, {delay: i === 1 || j >= 0 ? d : 0});
      t.height(h, {delay: d}); t.lift(lift, {delay: d});
    }
    var lt = i === 2 ? L('a = 2 → b = 7 − 2 = 5', 'a = 2 → b = 7 − 2 = 5') : j === 0 ? L('b = 7 − a', 'b = 7 − a') : j === 1 ? L('все b от 1 до 6', 'every b is between 1 and 6') : '';
    if(lt){ s.lab.setText(lt); s.lab.to(i === 2 ? s.g.at(1, 4) : [3.6, 0.2, 3.4]); s.lab.show(true, {delay: 400}); } else s.lab.show(false);
    headOn(api, s.ops, i, 36, 36*55, 200);
    trick(api, s.done, i, [6, 6], [L('6 значений a', '6 values of a'), L('6 значений a × 1', '6 values of a × 1')]);
  }
});

/* ================= 6. Canonicalization: numbers 2..10, 4 8 9 are powers of smaller ones ================= */
LAB.register({
  id: 'Canonicalization',
  steps: STEPS.Canonicalization,
  view: {yaw: 0.08, pitch: 0.8, fill: 0.92},
  build: function(api){
    var L = api.L;
    var nums = []; for(var n = 2; n <= 10; n++) nums.push(n);
    var row = api.row(nums, {gap: 1.3, size: 1.0, h: 0.38});
    var at = function(n){ return row.at(n - 2); };
    var arcs = [
      api.arc(at(2), at(4), {color: 'blue', height: 0.9, dashed: true}),
      api.arc(at(2), at(8), {color: 'blue', height: 1.9, dashed: true}),
      api.arc(at(3), at(9), {color: 'blue', height: 1.4, dashed: true})
    ];
    var eqm = [[4, '= 2²'], [8, '= 2³'], [9, '= 3²']].map(function(e){ return api.marks(at(e[0]), [{text: e[1], color: 'blue'}], {dir: 'front'}); });
    var marks = nums.map(function(n){ var dup = n === 4 || n === 8 || n === 9; return api.marks(at(n), [{text: dup ? L('повтор', 'repeat') : L('новое', 'new'), color: dup ? 'red' : 'amber'}], {dir: 'back'}); });
    var lab = api.label('', at(4), {color: 'violet', dy: 1.6});
    var ops = api.counter(L('чисел в лоб', 'head-on numbers'), {pos: [-4.2, 0, -3.2], color: 'red', noteFitValue: 9,
      note: function(v){ v = Math.round(v); return v + L(' из 9: от 2 до 10', ' of 9: from 2 to 10'); }});
    var done = api.counter(L('чисел без повторов', 'numbers without repeats'), {pos: [3.4, 0, -3.2], color: 'green', noteFitValue: 6, note: ''});
    return {row: row, at: at, arcs: arcs, eqm: eqm, marks: marks, lab: lab, ops: ops, done: done};
  },
  step: function(api, s, i){
    var L = api.L, j = i - P;
    for(var n = 2; n <= 10; n++){
      var t = s.at(n), dup = n === 4 || n === 8 || n === 9, col = 'plain', lift = 0, d = 0;
      if(i === 1){ col = dup ? 'red' : 'amber'; d = 200 + (n - 2)*300; }
      if(i === 2 && (n === 2 || n === 4)){ col = 'violet'; lift = n === 4 ? 0.25 : 0; }
      if(j === 0){ col = dup ? 'blue' : (n === 2 || n === 3 ? 'blue' : 'plain'); lift = dup ? 0.2 : 0; d = dup ? 400 : 0; }
      if(j === 1){ col = dup ? 'dim' : 'green'; lift = dup ? 0 : 0.28; d = (n - 2)*90; }
      t.color(col, {delay: d}); t.lift(lift, {delay: j === 1 ? d : 0});
    }
    each(s.marks, function(m, k){ if(i === 1) m.show(1, {delay: 200 + k*300}); else m.show(0); });
    each(s.eqm, function(m, k){ if(j === 0) m.show(1, {delay: 300 + k*250}); else m.show(0); });
    each(s.arcs, function(a, k){ vis(api, a, j === 0 || (i === 2 && k === 0), {delay: k*250}); a.color(i === 2 ? 'violet' : 'blue'); });
    var lt = i === 1 ? L('4² = 16 = 2⁴ — уже было', '4² = 16 = 2⁴ — already there') : i === 2 ? L('4 = 2²', '4 = 2²') : '';
    if(lt){ s.lab.setText(lt); s.lab.show(true, {delay: i === 1 ? 2900 : 400}); } else s.lab.show(false);
    headOn(api, s.ops, i, 9, 9*300, 200);
    trick(api, s.done, i, [null, 6], [null, L('9 − 3 повтора', '9 − 3 repeats')]);
  }
});

/* ================= 7. SymmetryBreaking: 4×4 board, 6 mirror copies, 10 pairs ================= */
LAB.register({
  id: 'SymmetryBreaking',
  steps: STEPS.SymmetryBreaking,
  view: {yaw: 0.25, pitch: 0.95, fill: 0.88},
  build: function(api){
    var L = api.L;
    var gap = 1.25;
    var g = api.grid(4, 4, function(r, c){ return (r + 1) + ' ' + (c + 1); }, {gap: gap, size: 1.08, h: 0.34});
    var ax = [
      api.arrow([-1.9, 0, -3.0], [2.4, 0, -3.0], {color: 'ink'}), api.text('j', [-2.5, 0, -3.0], {size: 0.55}),
      api.arrow([-3.1, 0, -1.9], [-3.1, 0, 2.4], {color: 'ink'}), api.text('i', [-3.1, 0, -2.5], {size: 0.55})
    ];
    var mirrors = [];
    for(var r = 0; r < 4; r++) for(var c = 0; c < r; c++)
      mirrors.push(api.arc(g.at(r, c), g.at(c, r), {color: 'violet', height: 1.0 + 0.25*(r - c)}));
    var rowN = [4, 3, 2, 1].map(function(n, rr){ return api.text(String(n), [3.3, 0, (rr - 1.5)*gap], {size: 0.5, color: 'green'}); });
    var lab = api.label('', g.at(1, 0), {color: 'violet', dy: 1.3});
    var ops = api.counter(L('пар в лоб', 'head-on pairs'), {pos: [7.0, 0, -1.6], color: 'red', quant: 4, noteFitValue: 16,
      note: function(v){ var q = Math.round(v/4); return q + ' × 4'; }});
    var done = api.counter(L('пар при j ≥ i', 'pairs with j ≥ i'), {pos: [7.0, 0, 2.2], color: 'green', noteFitValue: 10, note: ''});
    return {g: g, ax: ax, mirrors: mirrors, rowN: rowN, lab: lab, ops: ops, done: done};
  },
  step: function(api, s, i){
    var L = api.L, j = i - P;
    for(var r = 0; r < 4; r++) for(var c = 0; c < 4; c++){
      var t = s.g.at(r, c), below = r > c, diag = r === c, col = 'plain', tx = (r + 1) + ' ' + (c + 1), h = 0.34, lift = 0, d = 0;
      if(i === 1){ col = 'red'; d = 200 + (r*4 + c)*110; }
      if(i === 2 && ((r === 1 && c === 0) || (r === 0 && c === 1))){ col = 'violet'; lift = 0.2; }
      if(j === 0){ if(below){ col = 'red'; d = 300 + (r - c)*150; } else col = 'blue'; }
      if(j === 1){ d = (r + c)*80; if(below){ col = 'dim'; tx = ''; h = 0.05; } else { col = 'green'; lift = diag ? 0.3 : 0.12; } }
      t.color(col, {delay: d}); t.setText(tx, {delay: j >= 0 ? d : 0}); t.height(h, {delay: d}); t.lift(lift, {delay: d});
    }
    each(s.mirrors, function(m, k){ vis(api, m, j === 0 || (i === 2 && k === 0), {delay: 300 + k*120}); });
    each(s.rowN, function(t, k){ vis(api, t, j === 1, {delay: 600 + k*200}); });
    var lt = i === 2 ? L('(2, 1) — та же пара, что (1, 2)', '(2, 1) is the same pair as (1, 2)') : j === 0 ? L('красные — копии', 'red: copies') : '';
    if(lt){ s.lab.setText(lt); s.lab.show(true, {delay: 400}); } else s.lab.show(false);
    headOn(api, s.ops, i, 16, 16*110, 200);
    trick(api, s.done, i, [10, 10], [L('16 − 6 копий', '16 − 6 copies'), L('4 + 3 + 2 + 1', '4 + 3 + 2 + 1')]);
  }
});

/* ================= 8. LogarithmProductRule: ln 4 + ln 8 = ln 32 ================= */
LAB.register({
  id: 'LogarithmProductRule',
  steps: STEPS.LogarithmProductRule,
  view: {yaw: 0.06, pitch: 0.9, fill: 0.9},
  build: function(api){
    var L = api.L;
    var step = 1.5, x0 = -3.75, zr = 0.75;
    var X = function(k){ return x0 + k*step; };
    var ruler = api.line([[X(0) - 0.3, 0.02, zr], [X(5) + 0.3, 0.02, zr]], {color: 'plain'});
    var ticks = [], tickT = [], lnT = [];
    [1, 2, 4, 8, 16, 32].forEach(function(v, k){
      ticks.push(api.line([[X(k), 0.02, zr - 0.25], [X(k), 0.02, zr + 0.25]], {color: 'ink'}));
      tickT.push(api.text(String(v), [X(k), 0, zr + 0.75], {size: 0.45}));
      lnT.push(api.text(fmt(api, k*Math.LN2, 3), [X(k), 0, zr + 1.35], {size: 0.32, color: 'violet'}));
    });
    var blue = hbar(api, X(0), 2*step, 0, {color: 'blue'});
    var red = hbar(api, X(2), 3*step, 0, {color: 'red'});
    var green = hbar(api, X(0), 5*step, -1.1, {color: 'green'});
    var bT = api.text(fmt(api, 1.386, 3), [X(1), 0, -0.55], {size: 0.4, color: 'blue'});
    var rT = api.text(fmt(api, 2.079, 3), [X(3.5), 0, -0.55], {size: 0.4, color: 'red'});
    var gT = api.text(fmt(api, 3.466, 3), [X(2.5), 0, -1.65], {size: 0.45, color: 'green'});
    var col = api.bar(32, 32, {pos: [6.4, 0, -1.6], height: 3.0, size: 1.0, color: 'red'});
    var lab = api.label('', col, {color: 'red', dy: 0.4});
    var f3 = function(v){ return Math.abs(v - Math.round(v)) < 1e-6 || v >= 10 ? String(Math.round(v)) : fmt(api, v, 3); };
    var ops = api.counter(L('самое большое число в лоб', 'biggest number head-on'), {pos: [-6.6, 0, -2.4], color: 'red', format: f3, w: 3.2, d: 1.4, noteFitValue: 32,
      note: L('4 × 8 — держим в памяти', '4 × 8, kept in memory')});
    var done = api.counter(L('самое большое число с ln', 'biggest number with ln'), {pos: [6.6, 0, 2.6], color: 'green', format: f3, w: 3.2, d: 1.4, noteFitValue: 3.466, note: ''});
    return {ruler: ruler, ticks: ticks, tickT: tickT, lnT: lnT, blue: blue, red: red, green: green, bT: bT, rT: rT, gT: gT, col: col, lab: lab, ops: ops, done: done};
  },
  step: function(api, s, i){
    var L = api.L, j = i - P;
    s.blue.grow(j >= 0 ? 1 : 0); vis(api, s.blue, j >= 0);
    s.red.grow(j >= 0 ? 1 : 0, {delay: j === 0 ? 700 : 0}); vis(api, s.red, j >= 0, {delay: j === 0 ? 700 : 0});
    s.green.grow(j === 1 ? 1 : 0, {delay: 200}); vis(api, s.green, j === 1, {delay: 200});
    vis(api, s.bT, j >= 0, {delay: 500}); vis(api, s.rT, j >= 0, {delay: 1200}); vis(api, s.gT, j === 1, {delay: 800});
    each(s.tickT, function(t, k){
      var c = 'plain';
      if(i === 2) c = 'violet';
      if(j >= 0 && k === 2) c = 'blue';
      if(j >= 0 && k === 5) c = j === 1 ? 'green' : 'red';
      t.color(c);
    });
    each(s.lnT, function(t){ vis(api, t, i >= 2); });
    each(s.ticks, function(t){ t.color(i === 2 ? 'violet' : 'ink'); });
    s.ruler.color(i === 2 ? 'violet' : 'plain');
    vis(api, s.col, i === 1);
    if(i === 1){ s.col.height(0.02, {ms: 0}); s.col.height(3.0, {ms: 1500, delay: 200}); } else s.col.height(3.0);
    var lt = i === 1 ? L('1 × 2 × … × 1000 — 2568 цифр', '1 × 2 × … × 1000 has 2,568 digits') : i === 2 ? L('каждое деление — ×2', 'each mark is ×2') : '';
    if(lt){ s.lab.setText(lt); s.lab.to(i === 1 ? s.col : s.tickT[3]); s.lab.show(true, {delay: i === 1 ? 1800 : 400}); } else s.lab.show(false);
    headOn(api, s.ops, i, 32, 1500, 200);
    trick(api, s.done, i, [2.079, 3.466], [L('ln 4 и ln 8 — меньше 3', 'ln 4 and ln 8 are below 3'), L('1,386 + 2,079', '1.386 + 2.079')]);
  }
});

/* ================= 9. FixedPointIteration: x = (x + 2/x) ÷ 2, 1 → 1.5 → 1.4167 → 1.4142 ================= */
LAB.register({
  id: 'FixedPointIteration',
  steps: STEPS.FixedPointIteration,
  view: {yaw: 0.05, pitch: 1.05, fill: 0.92},
  build: function(api){
    var L = api.L;
    var f = function(x){ return (x + 2/x)/2; };
    var G = function(x, y){ return [4.3 + (x - 1.3)*7, 0.03, -(y - 1.25)*7]; };
    var tf = api.text('x = (x + 2/x) ÷ 2', [-5.3, 0, -2.6], {size: 0.6});
    var rows = [[1, 1.5], [1.5, 1.41667], [1.41667, 1.41422]];
    var tab = rows.map(function(r, k){
      var z = -1.2 + k*1.5, a = fmt(api, r[0], k === 0 ? 0 : k === 1 ? 1 : 4), b = fmt(api, r[1], k === 0 ? 1 : 4);
      return {
        a: api.tile(a, {pos: [-9.2, 0, z], size: 1.25, h: 0.3, color: k === 0 ? 'amber' : 'plain'}),
        ar1: sarrow(api, [-8.4, 0.05, z], [-7.6, 0.05, z], {color: 'plain'}),
        tx: api.text('(' + a + ' + 2/' + a + ') ÷ 2', [-5.3, 0, z], {size: 0.4}),
        ar2: sarrow(api, [-3.0, 0.05, z], [-2.2, 0.05, z], {color: 'plain'}),
        b: api.tile(b, {pos: [-1.3, 0, z], size: 1.25, h: 0.3, color: k === 2 ? 'green' : 'plain'})
      };
    });
    var back = api.arc(tab[0].b, tab[0].a, {color: 'violet', height: 1.8, head: true});
    var axes = api.group([api.line([G(0.9, 0.9), G(1.72, 0.9)], {color: 'plain'}), api.line([G(0.9, 0.9), G(0.9, 1.66)], {color: 'plain'})]);
    var diag = api.line([G(0.9, 0.9), G(1.66, 1.66)], {color: 'ink', dashed: true});
    var pts = []; for(var x = 0.9; x <= 1.7001; x += 0.025) pts.push(G(x, f(x)));
    var curve = api.line(pts, {color: 'blue'});
    var web = [
      api.line([G(1, 1), G(1, 1.5), G(1.5, 1.5)], {color: 'amber'}),
      api.line([G(1.5, 1.5), G(1.5, 1.41667), G(1.41667, 1.41667)], {color: 'amber'}),
      api.line([G(1.41667, 1.41667), G(1.41667, 1.41422)], {color: 'amber'})
    ];
    var pf = G(1.41421, 1.41421);
    var fix = api.box([0.34, 0.34, 0.34], {pos: [pf[0], 0, pf[2]], color: 'green'});
    var ticks = api.group([1, 1.5, 1.41421].map(function(xv, k){
      return api.line([G(xv, 0.9), G(xv, xv)], {color: k === 2 ? 'green' : 'amber', dashed: true});
    }).concat([
      api.text('1', [G(1, 0.9)[0], 0, G(1, 0.9)[2] + 0.5], {size: 0.4, color: 'amber'}),
      api.text(fmt(api, 1.5, 1), [G(1.5, 0.9)[0], 0, G(1.5, 0.9)[2] + 0.5], {size: 0.4, color: 'amber'}),
      api.text(fmt(api, 1.4142, 4), [G(1.41421, 0.9)[0], 0, G(1.41421, 0.9)[2] + 1.1], {size: 0.4, color: 'green'})
    ]));
    var SX = function(v){ return -9.4 + (v - 1)*16; }, sz = 0.8;
    var scan = api.group([api.line([[SX(1), 0.03, sz], [SX(1.5), 0.03, sz]], {color: 'red'})]);
    [1, 1.1, 1.2, 1.3, 1.4, 1.5].forEach(function(v){
      scan.add(api.line([[SX(v), 0.03, sz - 0.2], [SX(v), 0.03, sz + 0.2]], {color: 'red'}));
      scan.add(api.text(fmt(api, v, 1), [SX(v), 0, sz + 0.65], {size: 0.4, color: 'red'}));
    });
    var probe = api.box([0.24, 0.5, 0.24], {pos: [SX(1), 0, sz], color: 'red'});
    var lab = api.label('', tab[0].b, {color: 'violet', dy: 1.9});
    var ops = api.counter(L('проверок x в лоб', 'head-on checks of x'), {pos: [-5.3, 0, -6.0], color: 'red', w: 3.2, d: 1.4, noteFitValue: 4142,
      note: function(v){ var n = Math.round(v); return 'x = ' + fmt(api, 1 + n*0.0001, 4); }});
    var done = api.counter(L('подстановок', 'rounds'), {pos: [5.0, 0, -6.0], color: 'green', w: 3.2, d: 1.4, noteFitValue: 3, note: ''});
    return {tf: tf, tab: tab, back: back, axes: axes, diag: diag, curve: curve, web: web, fix: fix, ticks: ticks,
      SX: SX, sz: sz, scan: scan, probe: probe, lab: lab, ops: ops, done: done};
  },
  step: function(api, s, i){
    var L = api.L, j = i - P;
    s.tf.color(i === 2 ? 'violet' : 'ink');
    each(s.tab, function(r, k){
      var on = j >= 0 || (i === 2 && k === 0), d = j === 0 ? k*450 : 0;
      [r.a, r.ar1, r.tx, r.ar2, r.b].forEach(function(t, q){ vis(api, t, on, {delay: d + q*80}); });
      r.a.color(i === 2 ? 'violet' : (k === 0 ? 'amber' : 'plain'));
      r.b.color(i === 2 ? 'violet' : (k === 2 && j >= 1 ? 'green' : 'plain'));
    });
    vis(api, s.back, i === 2, {delay: 500});
    var g = j === 2;
    vis(api, s.axes, g); vis(api, s.diag, g, {delay: 150}); vis(api, s.curve, g, {delay: 300});
    each(s.web, function(w, k){ vis(api, w, g, {delay: 700 + k*550}); });
    vis(api, s.fix, g, {delay: 2300}); s.fix.lift(g ? 0.15 : 0, {delay: 2300});
    vis(api, s.ticks, g, {delay: 600});
    vis(api, s.scan, i === 1); vis(api, s.probe, i === 1);
    if(i === 1){ s.probe.moveTo([s.SX(1), 0, s.sz], {ms: 0}); s.probe.moveTo([s.SX(1.4142), 0, s.sz], {ms: 1800, delay: 200}); }
    else s.probe.moveTo([s.SX(1.4142), 0, s.sz]);
    var lt = i === 2 ? L('ответ — снова в формулу', 'the answer goes back in')
      : j === 1 ? L('сдвиг 0,0025 → стоп', 'moved by 0.0025 → stop')
      : j === 2 ? L('√2 ≈ 1,4142: ответ перестал меняться', '√2 ≈ 1.4142: the answer stopped changing') : '';
    if(lt){ s.lab.setText(lt); s.lab.to(j === 2 ? s.fix : j === 1 ? s.tab[2].b : s.tab[0].b); s.lab.show(true, {delay: j === 2 ? 2400 : 400}); } else s.lab.show(false);
    headOn(api, s.ops, i, 4142, 1800, 200);
    trick(api, s.done, i, [3, 3, 3], [L('1 → 1,5 → 1,4167 → 1,4142', '1 → 1.5 → 1.4167 → 1.4142'), L('следующая — меньше 0,0001', 'the next one: under 0.0001'), '']);
  }
});

/* ================= 10. Sorting: 3 5 1 4 2 → 1 2 3 4 5 by swapping neighbours ================= */
var SORT_PASSES = (function(){
  var a = [3, 5, 1, 4, 2], out = [];
  for(var p = 0; p < 4; p++){
    var cmps = [];
    for(var k = 0; k < 4 - p; k++){
      var x = a[k], y = a[k + 1], sw = x > y;
      cmps.push({k: k, text: sw ? x + ' > ' + y : x + ' < ' + y, sw: sw});
      if(sw){ a[k] = y; a[k + 1] = x; }
    }
    out.push({cmps: cmps, order: a.slice(), swaps: cmps.filter(function(c){ return c.sw; }).length});
  }
  return out;
})();
LAB.register({
  id: 'Sorting',
  steps: STEPS.Sorting,
  view: {yaw: 0.28, pitch: 0.7, fill: 0.88},
  build: function(api){
    var L = api.L;
    var gap = 1.35, X = function(k){ return (k - 2)*gap; };
    var bars = {};
    [3, 5, 1, 4, 2].forEach(function(v, k){ bars[v] = api.bar(v, 5, {pos: [X(k), 0, 0], height: 3.2, size: 1.0, color: 'plain'}); });
    var sw1 = api.arrow([X(1), 0, 1.0], [X(2), 0, 1.0], {color: 'violet', bend: 0.6});
    var sw2 = api.arrow([X(2), 0, 1.4], [X(1), 0, 1.4], {color: 'violet', bend: 0.6});
    var passB = SORT_PASSES.map(function(ps, p){
      return ps.cmps.map(function(c){ return api.badge(c.text, {pos: [(X(c.k) + X(c.k + 1))/2, 0, 1.5 + p*0.62], color: c.sw ? 'red' : 'green'}); });
    });
    var cmp = [['3 < 5', 'green'], ['5 > 1', 'red'], ['1 < 4', 'green'], ['4 > 2', 'red']].map(function(c, k){
      return api.badge(c[0], {pos: [(X(k) + X(k + 1))/2, 0, 1.5], color: c[1]});
    });
    var gx0 = 4.2, gx1 = 9.0, gz0 = -4.0, gz1 = -1.2;
    var board = gridLines(api, gx0, gz0, gx1, gz1, 12, 10, {color: 'red'});
    var fill = hbar(api, gx0, gx1 - gx0, (gz0 + gz1)/2, {color: 'red', h: 0.04, d: gz1 - gz0});
    var lab = api.label('', [gx1, 0.1, gz0], {color: 'red', dy: 0.3});
    var ops = api.counter(L('сравнений в лоб', 'head-on comparisons'), {pos: [6.6, 0, 0.6], color: 'red', w: 3.4, d: 1.4, quant: 4, noteFitValue: 480,
      note: function(v){ var r = Math.round(v/4); return r + ' ' + L(pl(r, 'расстановка', 'расстановки', 'расстановок'), pl(r, 'arrangement', 'arrangements')) + ' × 4'; }});
    var done = api.counter(L('сравнений соседей', 'neighbour comparisons'), {pos: [6.6, 0, 3.4], color: 'green', w: 3.4, d: 1.4, noteFitValue: 10, note: ''});
    return {X: X, bars: bars, sw1: sw1, sw2: sw2, passB: passB, cmp: cmp, board: board, fill: fill, lab: lab, ops: ops, done: done};
  },
  step: function(api, s, i){
    var L = api.L, j = i - P;
    var order = j >= 0 ? SORT_PASSES[j].order : [3, 5, 1, 4, 2];
    order.forEach(function(v, k){
      var b = s.bars[v], col = 'plain', d = 0, lift = 0;
      if(i === 1) col = 'amber';
      if(i === 2 && (v === 5 || v === 1)){ col = 'violet'; lift = 0.2; }
      if(j >= 0){ col = k >= 4 - j ? 'green' : 'plain'; d = 700; }
      if(j === 3) col = 'green';
      b.moveTo([s.X(k), 0, 0], {delay: 350, ms: 600});
      b.color(col, {delay: d}); b.lift(lift);
    });
    vis(api, s.sw1, i === 2); vis(api, s.sw2, i === 2, {delay: 150});
    each(s.passB, function(row, p){ each(row, function(b, k){ vis(api, b, j >= p, {delay: j === p ? 200 + k*250 : 0}); }); });
    each(s.cmp, function(b, k){ vis(api, b, i === 1, {delay: 200 + k*200}); });
    vis(api, s.board, i === 1); vis(api, s.fill, i === 1);
    s.fill.grow(i === 1 ? 1 : 0, {ms: 2000, delay: 200});
    var lt = i === 1 ? L('5 × 4 × 3 × 2 × 1 = 120 расстановок', '5 × 4 × 3 × 2 × 1 = 120 arrangements') : i === 2 ? L('5 > 1 — меняем местами', '5 > 1 — swap them') : '';
    if(lt){ s.lab.setText(lt); s.lab.to(i === 1 ? [9.0, 0.1, -4.0] : s.bars[5]); s.lab.show(true, {delay: 400}); } else s.lab.show(false);
    headOn(api, s.ops, i, 480, 2000, 200);
    trick(api, s.done, i, [4, 7, 9, 10], [L('4, из них 3 обмена', '4, of them 3 swaps'), '4 + 3', '4 + 3 + 2', L('4 + 3 + 2 + 1, обменов 6', '4 + 3 + 2 + 1, 6 swaps')]);
  }
});

/* ================= 11. HashGrouping: 21 12 13 31 11 → boxes "12", "13", "11" ================= */
LAB.register({
  id: 'HashGrouping',
  steps: STEPS.HashGrouping,
  view: {yaw: 0.1, pitch: 0.8, fill: 0.9},
  build: function(api){
    var L = api.L;
    var vals = [21, 12, 13, 31, 11], keysV = ['12', '12', '13', '13', '11'];
    var home = vals.map(function(v, k){ return [(k - 2)*1.6, 0, -2.6]; });
    var slot = [[-4.1, 0, 1.8], [-2.9, 0, 1.8], [-0.6, 0, 1.8], [0.6, 0, 1.8], [3.0, 0, 1.8]];
    var tiles = vals.map(function(v, k){ return api.tile(v, {pos: home[k], size: 1.0, h: 0.36}); });
    var all = allPairs(api, home.map(function(p){ return p[0]; }), 0.36, -2.6, {color: 'plain', h0: 0.5, dh: 0.75, da: 0.2, dashed: true});
    var boxes = [
      api.box([2.7, 0.06, 1.7], {pos: [-3.5, 0, 1.8], color: 'teal'}),
      api.box([2.7, 0.06, 1.7], {pos: [0, 0, 1.8], color: 'teal'}),
      api.box([1.6, 0.06, 1.7], {pos: [3.0, 0, 1.8], color: 'teal'})
    ];
    var names = [['«12»', -3.5], ['«13»', 0], ['«11»', 3.0]].map(function(k){ return api.text(L(k[0], k[0].replace('«', '"').replace('»', '"')), [k[1], 0, 0.5], {size: 0.45, color: 'teal'}); });
    var inner = [
      api.arc([slot[0][0], 0.42, 1.8], [slot[1][0], 0.42, 1.8], {color: 'green', height: 0.8}),
      api.arc([slot[2][0], 0.42, 1.8], [slot[3][0], 0.42, 1.8], {color: 'green', height: 0.8})
    ];
    var keyT = keysV.map(function(v, k){ return api.text(v, [home[k][0], 0, -1.4], {size: 0.4, color: 'violet'}); });
    var lab = api.label('', tiles[0], {color: 'violet', dy: 1.9});
    var ops = api.counter(L('сравнений в лоб', 'head-on comparisons'), {pos: [-8.4, 0, -2.6], color: 'red', noteFitValue: 10,
      note: L('5 × 4 ÷ 2 пар', '5 × 4 ÷ 2 pairs')});
    var done = api.counter(L('действий с коробками', 'steps with boxes'), {pos: [-8.4, 0, 1.6], color: 'green', w: 3.2, d: 1.4, noteFitValue: 7, note: ''});
    return {tiles: tiles, home: home, slot: slot, all: all, boxes: boxes, names: names, inner: inner, keyT: keyT, lab: lab, ops: ops, done: done};
  },
  step: function(api, s, i){
    var L = api.L, j = i - P;
    each(s.tiles, function(t, k){
      var col = 'plain', d = 0;
      if(i === 2 && k < 2) col = 'violet';
      if(j === 0){ col = k < 2 ? 'blue' : k < 4 ? 'red' : 'plain'; d = 300 + k*160; }
      if(j === 1) col = k === 4 ? 'dim' : 'green';
      t.moveTo(j >= 0 ? s.slot[k] : s.home[k], {delay: j === 0 ? 300 + k*160 : 0, ms: 650});
      t.color(col, {delay: d});
    });
    each(s.all, function(a, k){ vis(api, a, i === 1, {delay: 200 + k*200}); a.color((a.a === 0 && a.b === 1) || (a.a === 2 && a.b === 3) ? 'green' : 'red'); });
    each(s.boxes, function(b, k){ vis(api, b, j >= 0, {delay: k*120}); });
    each(s.names, function(t, k){ vis(api, t, j >= 0, {delay: k*120}); });
    each(s.inner, function(a, k){ vis(api, a, j === 1, {delay: 200 + k*250}); });
    each(s.keyT, function(t, k){ vis(api, t, i === 2 || j === 0, {delay: 200 + k*120}); });
    var lt = i === 2 ? L('21 → 12 и 12 → 12', '21 → 12 and 12 → 12') : j === 1 ? L('11 сравнивать не с кем', '11 has no partner') : '';
    if(lt){ s.lab.setText(lt); s.lab.to(j === 1 ? s.tiles[4] : s.tiles[0]); s.lab.show(true, {delay: 600}); } else s.lab.show(false);
    headOn(api, s.ops, i, 10, 10*200, 200);
    trick(api, s.done, i, [5, 7], [L('5 записей', '5 labels'), L('5 записей + 2 сравнения', '5 labels + 2 comparisons')]);
  }
});

/* ================= 12. EquivalenceClass: cards 1..9 sorted by the remainder after dividing by 3 =================
 * No picture in the catalog: frames built from the method record; example from the passport. */
LAB.register({
  id: 'EquivalenceClass',
  steps: STEPS.EquivalenceClass,
  view: {yaw: 0.1, pitch: 0.85, fill: 0.9},
  build: function(api){
    var L = api.L;
    var nums = [1, 2, 3, 4, 5, 6, 7, 8, 9], cls = ['blue', 'red', 'violet'];
    var home = nums.map(function(n, k){ return [(k - 4)*1.25, 0, -3.0]; });
    var cx = [-4.2, 0, 4.2];
    var dest = nums.map(function(n){ var c = (n - 1) % 3, m = Math.floor((n - 1)/3); return [cx[c] + (m - 1)*1.15, 0, 1.6]; });
    var tiles = nums.map(function(n, k){ return api.tile(n, {pos: home[k], size: 1.0, h: 0.36}); });
    var cells = [], pz0 = -0.9, px0 = -2.6, ps = 0.62;
    for(var a = 1; a <= 8; a++) for(var b = a + 1; b <= 9; b++){
      var cell = api.tile('', {pos: [px0 + (b - 2)*ps, 0, pz0 + (a - 1)*ps], size: 0.52, h: 0.08, color: 'plain'});
      cell.same = a % 3 === b % 3; cells.push(cell);
    }
    var legend = api.text(L('клетка — пара карточек; зелёная — остатки равны', 'a square is a pair of cards; green: same remainder'), [0, 0, pz0 + 8*ps + 0.3], {size: 0.36, color: 'ink'});
    var marks = nums.map(function(n, k){ return api.marks(tiles[k], [{text: L('ост. ', 'rem. ') + (n % 3), color: cls[(n - 1) % 3]}], {dir: 'front'}); });
    var plates = cx.map(function(x, c){ return api.box([3.6, 0.05, 1.7], {pos: [x, 0, 1.6], color: cls[c]}); });
    var names = cx.map(function(x, c){ return api.text(L('остаток ', 'remainder ') + ((c + 1) % 3), [x, 0, 2.95], {size: 0.4, color: cls[c]}); });
    var lab = api.label('', tiles[3], {color: 'violet', dy: 1.4});
    var ops = api.counter(L('проверок пар в лоб', 'head-on pair checks'), {pos: [-8.6, 0, -1.2], color: 'red', w: 3.2, d: 1.4, noteFitValue: 36,
      note: L('9 × 8 ÷ 2 пар', '9 × 8 ÷ 2 pairs')});
    var done = api.counter(L('делений на 3', 'divisions by 3'), {pos: [-8.6, 0, 2.4], color: 'green', w: 3.2, d: 1.4, noteFitValue: 9, note: ''});
    return {tiles: tiles, home: home, dest: dest, cls: cls, cells: cells, legend: legend, marks: marks, plates: plates, names: names, lab: lab, ops: ops, done: done};
  },
  step: function(api, s, i){
    var L = api.L, j = i - P;
    each(s.tiles, function(t, k){
      var n = k + 1, c = (n - 1) % 3, isRep = n <= 3, col = 'plain';
      if(i === 2 && c === 0) col = 'violet';
      if(j >= 0) col = s.cls[c];
      if(j === 2) col = isRep ? 'green' : s.cls[c];
      t.moveTo(j >= 1 ? s.dest[k] : s.home[k], {delay: j === 1 ? 200 + c*250 + k*40 : 0, ms: 650});
      t.color(col, {delay: j === 0 ? 200 + k*150 : 0});
      t.lift(j === 2 && isRep ? 0.35 : 0, {delay: 200});
    });
    each(s.cells, function(t, k){ vis(api, t, i === 1, {delay: 200 + k*55}); t.color(t.same ? 'green' : 'red', {delay: 200 + k*55}); });
    vis(api, s.legend, i === 1, {delay: 300});
    each(s.marks, function(m, k){ if(j === 0 || (i === 2 && k % 3 === 0)) m.show(1, {delay: j === 0 ? 200 + k*150 : 300}); else m.show(0); });
    each(s.plates, function(p, c){ vis(api, p, j >= 1, {delay: c*200}); });
    each(s.names, function(p, c){ vis(api, p, j >= 1, {delay: 600 + c*200}); });
    var lt = i === 2 ? L('у 1, 4, 7 остаток 1', '1, 4, 7 all leave 1') : j === 2 ? L('имена групп: 1, 2, 3', 'group names: 1, 2, 3') : '';
    if(lt){ s.lab.setText(lt); s.lab.to(j === 2 ? s.tiles[0] : s.tiles[3]); s.lab.show(true, {delay: 500}); } else s.lab.show(false);
    headOn(api, s.ops, i, 36, 36*55, 200);
    trick(api, s.done, i, [9, 9, 9], [L('9 карточек × 1', '9 cards × 1'), L('пары не сравнивали', 'no pairs compared'), '']);
  }
});

/* ================= 13. EuclidsFormula: m = 2, n = 1 → 3, 4, 5 (perimeter 12); × 2 → 6, 8, 10 ================= */
var EU_C = [[1, 2, 9], [1, 3, 8], [1, 4, 7], [1, 5, 6], [2, 3, 7], [2, 4, 6], [3, 4, 5]];
LAB.register({
  id: 'EuclidsFormula',
  steps: STEPS.EuclidsFormula,
  view: {yaw: 0.1, pitch: 1.0, fill: 0.9},
  build: function(api){
    var L = api.L;
    var m = api.tile(2, {pos: [-7.0, 0, -4.4], size: 1.2, h: 0.42, color: 'blue'});
    var n = api.tile(1, {pos: [-5.5, 0, -4.4], size: 1.2, h: 0.42, color: 'blue'});
    var mn = api.group([api.text('m', [-7.0, 0, -5.5], {size: 0.5}), api.text('n', [-5.5, 0, -5.5], {size: 0.5})]);
    var fr = [['m² − n² = 4 − 1', 3, 'amber'], ['2 × m × n = 2 × 2 × 1', 4, 'blue'], ['m² + n² = 4 + 1', 5, 'red']].map(function(r, k){
      var z = -2.1 + k*1.35;
      var tt = api.text(r[0] + ' =', [-7.9, 0, z], {size: 0.5});
      return {t: tt, eq: tt, v: api.tile(r[1], {pos: [-4.6, 0, z], size: 1.05, h: 0.3, color: r[2]})};
    });
    var sc = 0.7;
    function tri(ax, az, k, vals){
      var A = [ax, 0.03, az], B = [ax + 3*k*sc, 0.03, az], C = [ax, 0.03, az - 4*k*sc];
      var ln = api.line([A, B, C, A], {color: 'ink'});
      var ra = api.line([[ax + 0.3, 0.03, az], [ax + 0.3, 0.03, az - 0.3], [ax, 0.03, az - 0.3]], {color: 'plain'});
      var mid = function(p, q){ return [(p[0] + q[0])/2, 0, (p[2] + q[2])/2]; };
      var ma = mid(A, B), mb = mid(A, C), mc = mid(B, C);
      return {ln: ln, ra: ra, tiles: [
        api.tile(vals[0], {pos: [ma[0], 0, ma[2] + 0.65], size: 0.95, h: 0.3, color: 'amber'}),
        api.tile(vals[1], {pos: [mb[0] - 0.7, 0, mb[2]], size: 0.95, h: 0.3, color: 'blue'}),
        api.tile(vals[2], {pos: [mc[0] + 0.6, 0, mc[2] - 0.45], size: 0.95, h: 0.3, color: 'red'})]};
    }
    var t1 = tri(-2.0, 3.0, 1, [3, 4, 5]);
    var t2 = tri(2.4, 3.0, 2, [6, 8, 10]);
    var cand = [], cmarks = [];
    EU_C.forEach(function(c, k){
      var x = 0.2 + k*1.3 + (c[0] - 1)*0.7;
      var t = api.tile(c[0] + ' ' + c[1], {pos: [x, 0, -4.6], size: 1.1, h: 0.3});
      cand.push(t);
      cmarks.push(api.marks(t, [{text: 'c = ' + c[2], color: c[2] === 5 ? 'green' : 'red'}], {dir: 'front'}));
    });
    var lab = api.label('', n, {color: 'violet', dy: 1.0});
    var ops = api.counter(L('пар сторон в лоб', 'head-on pairs of sides'), {pos: [9.8, 0, -0.6], color: 'red', w: 3.2, d: 1.4, noteFitValue: 7,
      note: function(v){ v = Math.round(v); return v <= 4 ? 'a = 1: ' + v : v <= 6 ? '4 + ' + (v - 4) : '4 + 2 + 1'; }});
    var done = api.counter(L('пар m и n', 'pairs m and n'), {pos: [9.8, 0, 2.8], color: 'green', w: 3.2, d: 1.4, noteFitValue: 1, note: ''});
    return {m: m, n: n, mn: mn, fr: fr, t1: t1, t2: t2, cand: cand, cmarks: cmarks, lab: lab, ops: ops, done: done};
  },
  step: function(api, s, i){
    var L = api.L, j = i - P;
    [s.m, s.n].forEach(function(t){ vis(api, t, i >= 2); t.color(i >= 2 && j <= 0 ? 'violet' : 'blue'); t.lift(i === 2 ? 0.25 : 0); });
    vis(api, s.mn, i >= 2);
    each(s.fr, function(r, k){
      var d = k*400;
      vis(api, r.t, j >= 1, {delay: d}); vis(api, r.eq, j >= 1, {delay: d + 150}); vis(api, r.v, j >= 1, {delay: d + 300});
    });
    function showTri(t, on){ vis(api, t.ln, on); vis(api, t.ra, on, {delay: 400}); each(t.tiles, function(x, k){ vis(api, x, on, {delay: 300 + k*200}); }); }
    showTri(s.t1, j >= 1);
    showTri(s.t2, j === 2);
    each(s.cand, function(t, k){
      var col = 'plain', d = 0;
      if(i === 1){ col = k === 6 ? 'green' : 'red'; d = 200 + k*300; }
      if(i >= 2) col = 'dim';
      vis(api, t, i <= 2); t.color(col, {delay: d}); t.lift(i === 1 && k === 6 ? 0.25 : 0, {delay: d});
    });
    each(s.cmarks, function(m, k){ if(i === 1) m.show(1, {delay: 200 + k*300}); else m.show(0); });
    var lt = i === 2 ? L('a = m² − n², b = 2 × m × n, c = m² + n²', 'a = m² − n², b = 2 × m × n, c = m² + n²')
      : j === 0 ? L('2 × 2 × (2 + 1) = 12', '2 × 2 × (2 + 1) = 12')
      : j === 1 ? L('9 + 16 = 25 — угол прямой', '9 + 16 = 25 — a right angle')
      : j === 2 ? L('все стороны × 2', 'every side × 2') : '';
    if(lt){ s.lab.setText(lt); s.lab.to(j === 1 ? s.t1.tiles[2] : j === 2 ? s.t2.tiles[2] : s.n); s.lab.show(true, {delay: 500}); } else s.lab.show(false);
    headOn(api, s.ops, i, 7, 7*300, 200);
    trick(api, s.done, i, [1, 1, 1], [L('только m = 2, n = 1', 'only m = 2, n = 1'), L('стороны 3, 4, 5', 'sides 3, 4, 5'), L('та же пара, × 2', 'the same pair, × 2')]);
  }
});

/* ================= 14. QuadraticFormula: a triangle of 21 dots → n² + n − 42 = 0 → 6 rows ================= */
var QF_T = [1, 3, 6, 10, 15, 21];
var QF_M = ['4 × 42 = 168', '1 + 168 = 169', '√169 = 13', '−1 + 13 = 12', '12 ÷ 2 = 6'];
LAB.register({
  id: 'QuadraticFormula',
  steps: STEPS.QuadraticFormula,
  view: {yaw: 0.05, pitch: 1.05, fill: 0.92},
  build: function(api){
    var L = api.L;
    var G = function(n, y){ return [3.9 + n*0.5, 0.03, 0.6 - y*0.1]; };
    var dots = [];
    for(var r = 0; r < 6; r++) for(var c = 0; c <= r; c++) dots.push(api.box([0.32, 0.32, 0.32], {pos: [3.6 + (c - r/2)*0.62, 0, -2.4 + r*0.62], color: 'amber'}));
    var eq = api.text('n² + n − 42 = 0', [-5.6, 0, -3.3], {size: 0.7});
    var mb = QF_M.map(function(t, k){ return api.badge(t, {pos: [-5.6, 0, -1.8 + k*0.62], color: 'green'}); });
    var axis = api.line([G(-8.6, 0), G(7.6, 0)], {color: 'plain'});
    var pts = []; for(var x = -8.5; x <= 7.501; x += 0.25) pts.push(G(x, x*x + x - 42));
    var curve = api.line(pts, {color: 'blue'});
    var r1 = G(-7, 0), r2 = G(6, 0);
    var m1 = api.box([0.3, 0.3, 0.3], {pos: [r1[0], 0, r1[2]], color: 'red'});
    var m2 = api.box([0.36, 0.36, 0.36], {pos: [r2[0], 0, r2[2]], color: 'green'});
    var rt = api.group([api.text('−7', [r1[0], 0, r1[2] + 0.6], {size: 0.45, color: 'red'}), api.text('6', [r2[0], 0, r2[2] + 0.6], {size: 0.45, color: 'green'}),
      api.text('n', [G(7.6, 0)[0] + 0.4, 0, G(7.6, 0)[2]], {size: 0.45, color: 'plain'})]);
    var tri = api.row(QF_T, {pos: [-6.6, 0, 0.8], gap: 1.2, size: 1.0, h: 0.3});
    var trn = api.row(['n=1', 'n=2', 'n=3', 'n=4', 'n=5', 'n=6'], {pos: [-6.6, 0, 2.1], gap: 1.2, size: 0.9, h: 0.04});
    var tmarks = QF_T.map(function(v, k){ return api.marks(tri.at(k), [{text: '+1', color: 'red'}, {text: '×n', color: 'red'}, {text: '÷2', color: 'red'}], {gap: 0.5}); });
    var lab = api.label('', eq, {color: 'violet', dy: 0.3});
    var ops = api.counter(L('действий в лоб', 'head-on steps'), {pos: [-0.2, 0, -4.4], color: 'red', w: 3.0, d: 1.4, quant: 3, noteFitValue: 18,
      note: function(v){ var k = Math.round(v/3); return k + ' ' + L(pl(k, 'проверка', 'проверки', 'проверок'), pl(k, 'check', 'checks')) + ' × 3'; }});
    var done = api.counter(L('действий по формуле', 'steps by the formula'), {pos: [4.6, 0, -6.8], color: 'green', w: 3.0, d: 1.4, noteFitValue: 5, note: ''});
    return {dots: dots, eq: eq, mb: mb, axis: axis, curve: curve, m1: m1, m2: m2, rt: rt, tri: tri, trn: trn, tmarks: tmarks, lab: lab, ops: ops, done: done};
  },
  step: function(api, s, i){
    var L = api.L, j = i - P;
    each(s.dots, function(b, k){ vis(api, b, i <= 1, {delay: k*30}); });
    vis(api, s.eq, i >= 2);
    each(s.mb, function(b, k){ vis(api, b, j >= 0, {delay: j === 0 ? 200 + k*300 : 0}); });
    var g = j === 1;
    vis(api, s.axis, g); vis(api, s.curve, g, {delay: 200}); vis(api, s.rt, g, {delay: 700});
    vis(api, s.m1, g, {delay: 800}); vis(api, s.m2, g, {delay: 1000}); s.m2.lift(g ? 0.15 : 0, {delay: 1000});
    s.tri.each(function(t, k){
      var col = 'plain', d = 0;
      if(i === 1){ col = k === 5 ? 'green' : 'red'; d = 200 + k*300; }
      vis(api, t, i === 1); t.color(col, {delay: d});
    });
    each(s.tmarks, function(m, k){ if(i === 1) m.show(3, {delay: 200 + k*300, every: 90}); else m.show(0); });
    s.trn.each(function(t){ vis(api, t, i === 1); });
    var lt = i === 2 ? L('× 2 и перенести 42 влево', '× 2 and move 42 to the left') : j === 1 ? L('−7 рядов не бывает', 'there are no −7 rows') : '';
    if(lt){ s.lab.setText(lt); s.lab.to(j === 1 ? s.m1 : s.eq); s.lab.show(true, {delay: 600}); } else s.lab.show(false);
    headOn(api, s.ops, i, 18, 6*300, 200);
    trick(api, s.done, i, [5, 5], [L('ответы 6 и −7', 'answers 6 and −7'), L('ответ — 6 рядов', 'answer: 6 rows')]);
  }
});

})();

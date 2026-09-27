/*
 * scenes/p1.js — LAB scenes, part 1 (see SCENE_API.md §13, NARRATIVE.md, CONTRACT_I18N.md).
 * TrialDivision · EuclideanAlgorithm · LCMViaGCD · SievingOverMultiples · LinearSieve ·
 * WheelFactorization · NthPrimeBound · PrimeNumberTheorem · DivisorCountFormula ·
 * MultiplicativeFunction · IntegerOverflowAvoidance · ExplicitStackRecursion · SparseSet ·
 * MillerRabinPrimalityTest
 * Every scene tells the 5-part story: task → head-on (problem) → what we notice (idea) → how we solve (2–4 steps).
 * Step captions are the story sentences of stories/<Id>.json (block ST below is generated from the same source,
 * so tools/shoot.py --sync holds). On stage: numbers on objects + at most one callout per step.
 */
(function(){
'use strict';
if(!window.LAB || !LAB.register) return;
var pl = LAB.plural;

/*ST*/
var ST = {
"TrialDivision": [
{
"chapter": "problem",
"caption": {
"ru": "Нужно разложить 30 на простые множители — узнать, из каких простых чисел оно получается умножением.",
"en": "Break 30 into prime factors: find the prime numbers that multiply together to give 30."
},
"tag": {
"ru": "задача",
"en": "task"
}
},
{
"chapter": "problem",
"caption": {
"ru": "В лоб: пробуем делить на каждое число от 2 до 30, а после удачного деления пробуем то же число ещё раз. Это 29 + 3 = 32 пробы.",
"en": "Head-on: try dividing by every number from 2 to 30, and after a division works, try the same number once more. That is 29 + 3 = 32 tries."
},
"tag": {
"ru": "в лоб",
"en": "head-on"
}
},
{
"chapter": "idea",
"caption": {
"ru": "Если оставшееся число можно разделить дальше, у него есть делитель d, у которого d · d не больше самого числа. Значит, как только d · d стало больше оставшегося числа, оно простое — дальше пробовать незачем.",
"en": "If what is left can still be split, it has a divisor d with d · d no bigger than itself. So once d · d is bigger than what is left, what is left is prime — there is no point trying further."
},
"tag": {
"ru": "замечаем",
"en": "notice"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Делим 30 на 2 — получаем 15. Пробуем 15 на 2 ещё раз — не делится. Это 2 пробы.",
"en": "Divide 30 by 2: 15. Try 2 again on 15: it does not go. That is 2 tries."
},
"tag": {
"ru": "на 2",
"en": "by 2"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Делим 15 на 3 — получаем 5. Пробуем 5 на 3 — не делится. Уже 4 пробы.",
"en": "Divide 15 by 3: 5. Try 3 again on 5: it does not go. 4 tries so far."
},
"tag": {
"ru": "на 3",
"en": "by 3"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Следующее d = 4, а 4 · 4 = 16 больше 5 — значит, 5 простое. Ответ: 30 = 2 · 3 · 5 за 4 пробы.",
"en": "Next is d = 4, and 4 · 4 = 16 is more than 5, so 5 is prime. Answer: 30 = 2 · 3 · 5, in 4 tries."
},
"tag": {
"ru": "стоп",
"en": "stop"
}
}
],
"EuclideanAlgorithm": [
{
"chapter": "problem",
"caption": {
"ru": "Нужно найти наибольший общий делитель чисел 35 и 15 — самое большое число, на которое делятся оба.",
"en": "Find the greatest common divisor of 35 and 15: the largest number that divides both evenly."
},
"tag": {
"ru": "задача",
"en": "task"
}
},
{
"chapter": "problem",
"caption": {
"ru": "В лоб: пробуем числа от 15 вниз — 15, 14, 13… — и каждое проверяем делением. Первым подойдёт 5, и на это уйдёт 13 проверок.",
"en": "Head-on: try 15, 14, 13 and so on downward, checking each one by dividing. The first that fits is 5, and it takes 13 checks to get there."
},
"tag": {
"ru": "в лоб",
"en": "head-on"
}
},
{
"chapter": "idea",
"caption": {
"ru": "Всё, что делит и 35, и 15, делит и то, что остаётся от 35 после того, как дважды убрать 15: 35 − 15 − 15 = 5. Значит, вместо 35 и 15 можно искать общий делитель 15 и 5 — числа меньше, ответ тот же.",
"en": "Anything that divides both 35 and 15 also divides what is left of 35 after taking away 15 twice: 35 − 15 − 15 = 5. So instead of 35 and 15 we can look for the common divisor of 15 and 5 — smaller numbers, same answer."
},
"tag": {
"ru": "замечаем",
"en": "notice"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Делим 35 на 15: помещается 2 раза, в остатке 5. Теперь ищем общий делитель 15 и 5.",
"en": "Divide 35 by 15: it goes 2 times with 5 left over. Now look for the common divisor of 15 and 5."
},
"tag": {
"ru": "35 на 15",
"en": "35 by 15"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Делим 15 на 5: ровно 3 раза, остатка нет. Значит, ответ — 5, и хватило 2 делений.",
"en": "Divide 15 by 5: exactly 3 times, nothing left over. So the answer is 5, found with 2 divisions."
},
"tag": {
"ru": "15 на 5",
"en": "15 by 5"
}
}
],
"LCMViaGCD": [
{
"chapter": "problem",
"caption": {
"ru": "Нужно найти наименьшее общее кратное чисел 35 и 15 — самое маленькое число, которое делится и на 35, и на 15.",
"en": "Find the least common multiple of 35 and 15: the smallest number that divides evenly by both 35 and 15."
},
"tag": {
"ru": "задача",
"en": "task"
}
},
{
"chapter": "problem",
"caption": {
"ru": "В лоб: проверяем подряд 35, 36, 37… пока не встретим число, которое делится на оба. Это 105, и до него придётся проверить 71 число.",
"en": "Head-on: check 35, 36, 37 and so on until one divides by both. That is 105, and it takes 71 checks to reach it."
},
"tag": {
"ru": "в лоб",
"en": "head-on"
}
},
{
"chapter": "idea",
"caption": {
"ru": "35 = 7 × 5, а 15 = 3 × 5: у них общая часть 5. В ответе должны быть и 7, и 3, и 5, но пятёрку достаточно взять один раз: 7 × 3 × 5.",
"en": "35 = 7 × 5 and 15 = 3 × 5: they share the part 5. The answer must contain 7, 3 and 5, but the 5 only needs to be taken once: 7 × 3 × 5."
},
"tag": {
"ru": "замечаем",
"en": "notice"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Находим общую часть — наибольший общий делитель 35 и 15. Двумя делениями получаем 5.",
"en": "Find the shared part — the greatest common divisor of 35 and 15. Two divisions give 5."
},
"tag": {
"ru": "общая часть",
"en": "shared part"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Делим 35 на 5 — получаем 7: столько раз нужно взять 15.",
"en": "Divide 35 by 5: 7. That is how many times we need to take 15."
},
"tag": {
"ru": "35 на 5",
"en": "35 by 5"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Умножаем 7 на 15 — получаем 105. Это ответ: 105 делится и на 35, и на 15. Всего 4 действия.",
"en": "Multiply 7 by 15: 105. That is the answer — 105 divides by both 35 and 15. 4 operations in all."
},
"tag": {
"ru": "ответ",
"en": "answer"
}
}
],
"SievingOverMultiples": [
{
"chapter": "problem",
"caption": {
"ru": "Для каждого числа от 1 до 20 нужно узнать, сколько у него делителей — чисел, на которые оно делится без остатка.",
"en": "For every number from 1 to 20, find how many divisors it has — the numbers it divides by evenly."
},
"tag": {
"ru": "задача",
"en": "task"
}
},
{
"chapter": "problem",
"caption": {
"ru": "В лоб: каждое число n проверяем делением на 1, 2, … n. Для всех чисел это 1 + 2 + … + 20 = 210 проверок.",
"en": "Head-on: check each number n by dividing it by 1, 2, … up to n. For all of them that is 1 + 2 + … + 20 = 210 checks."
},
"tag": {
"ru": "в лоб",
"en": "head-on"
}
},
{
"chapter": "idea",
"caption": {
"ru": "Посмотрим с другой стороны: 3 — делитель у 3, 6, 9, 12, 15 и 18. Эти числа не нужно искать делением: проходим по ним шагами по 3 и каждому добавляем 1 в счётчик.",
"en": "Look at it the other way round: 3 is a divisor of 3, 6, 9, 12, 15 and 18. We do not have to find those numbers by dividing — just step through them by 3s and add 1 to each one’s counter."
},
"tag": {
"ru": "замечаем",
"en": "notice"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Шагаем по 1: каждое из 20 чисел получает +1 — 20 шагов.",
"en": "Step by 1s: each of the 20 numbers gets +1 — 20 steps."
},
"tag": {
"ru": "по 1",
"en": "by 1s"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Шагаем по 2 и по 3: +1 получают ещё 10 и 6 чисел — уже 36 шагов.",
"en": "Step by 2s and by 3s: 10 more numbers and then 6 more get +1 — 36 steps so far."
},
"tag": {
"ru": "по 2 и 3",
"en": "by 2s, 3s"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Шаги по 4, 5, … 10 дают ещё 5 + 4 + 3 + 2 + 2 + 2 + 2 = 20 — уже 56 шагов.",
"en": "Steps of 4, 5, … 10 add 5 + 4 + 3 + 2 + 2 + 2 + 2 = 20 more — 56 steps so far."
},
"tag": {
"ru": "4…10",
"en": "4…10"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Числа от 11 до 20 попадают шагом только сами в себя — ещё 10 шагов. Все счётчики готовы за 66 шагов: например, у 12 делителей 6.",
"en": "Each number from 11 to 20 only lands on itself — 10 more steps. All counters are ready after 66 steps: for example, 12 has 6 divisors."
},
"tag": {
"ru": "итог",
"en": "result"
}
}
],
"LinearSieve": [
{
"chapter": "problem",
"caption": {
"ru": "Для каждого числа от 2 до 20 нужно записать его наименьший простой делитель — самое маленькое простое число, на которое оно делится. По такой таблице потом легко разложить любое число.",
"en": "For every number from 2 to 20, write down its smallest prime divisor — the smallest prime it divides by. With such a table, any number is easy to break into factors later."
},
"tag": {
"ru": "задача",
"en": "task"
}
},
{
"chapter": "problem",
"caption": {
"ru": "В лоб: для 2, 3, 5 и 7 проходим по их кратным и пишем делитель в ячейку. Выходит 18 записей, и 7 ячеек (6, 10, 12, 14, 15, 18, 20) переписываются дважды.",
"en": "Head-on: for 2, 3, 5 and 7, walk through their multiples and write the divisor into each cell. That is 18 writes, and 7 cells (6, 10, 12, 14, 15, 18, 20) get written twice."
},
"tag": {
"ru": "в лоб",
"en": "head-on"
}
},
{
"chapter": "idea",
"caption": {
"ru": "Каждое составное число — это меньшее число i, умноженное на простое p, которое не больше наименьшего делителя i. Например, 12 = 6 · 2, но не 4 · 3: у 4 делитель 2 меньше 3. Так каждое число получается ровно одним способом.",
"en": "Every composite number is a smaller number i times a prime p that is no bigger than the smallest divisor of i. For example 12 = 6 · 2, but not 4 · 3: 4 already has the smaller divisor 2. So each number is made in exactly one way."
},
"tag": {
"ru": "замечаем",
"en": "notice"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Идём по числам i от 2 до 10 и умножаем на подходящие простые: 2 · 2, 3 · 2, 3 · 3, 4 · 2… — 11 записей, по одной на каждое составное.",
"en": "Go through i from 2 to 10 and multiply by the allowed primes: 2 · 2, 3 · 2, 3 · 3, 4 · 2… — 11 writes, one for each composite number."
},
"tag": {
"ru": "записи",
"en": "writes"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Пустыми остались 8 ячеек — это простые числа: у них наименьший делитель — они сами, в счёт они не входят.",
"en": "Eight cells are still empty — those are the primes: their smallest divisor is themselves, and they are not counted."
},
"tag": {
"ru": "простые",
"en": "primes"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Разложение читается по таблице: у 20 делитель 2, у 10 — 2, у 5 — 5. Значит, 20 = 2 · 2 · 5.",
"en": "The table gives the factors directly: 20 has divisor 2, 10 has 2, 5 has 5. So 20 = 2 · 2 · 5."
},
"tag": {
"ru": "разбор",
"en": "read-out"
}
}
],
"WheelFactorization": [
{
"chapter": "problem",
"caption": {
"ru": "Мы ищем делители большого числа и пробуем делить его на числа по очереди. Какие из чисел от 1 до 30 вообще стоит пробовать?",
"en": "We are looking for divisors of a big number by trying numbers one after another. Which of the numbers from 1 to 30 are worth trying at all?"
},
"tag": {
"ru": "задача",
"en": "task"
}
},
{
"chapter": "problem",
"caption": {
"ru": "В лоб: пробуем все 30. Но если число не делится на 2, оно не делится и на 4, 6, 8…; так 22 пробы из 30 уходят впустую — на числа, кратные 2, 3 или 5.",
"en": "Head-on: try all 30. But if the number does not divide by 2, it does not divide by 4, 6, 8… either, so 22 tries out of 30 are wasted on multiples of 2, 3 or 5."
},
"tag": {
"ru": "в лоб",
"en": "head-on"
}
},
{
"chapter": "idea",
"caption": {
"ru": "Разложим числа 1–30 по кругу на 6 лучей — по остатку от деления на 6. Всё, что делится на 2 или на 3, попадает на 4 луча. Кандидаты остаются только на двух: 1, 7, 13… и 5, 11, 17…",
"en": "Lay the numbers 1–30 around a circle on 6 spokes, by their remainder when divided by 6. Everything that divides by 2 or 3 lands on 4 of the spokes. Candidates remain on just two: 1, 7, 13… and 5, 11, 17…"
},
"tag": {
"ru": "замечаем",
"en": "notice"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Убираем лучи с чётными числами — остаётся 15 кандидатов.",
"en": "Remove the spokes with even numbers: 15 candidates are left."
},
"tag": {
"ru": "без чётных",
"en": "no evens"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Убираем луч с числами, которые делятся на 3, — остаётся 10.",
"en": "Remove the spoke with numbers that divide by 3: 10 are left."
},
"tag": {
"ru": "без 3",
"en": "no 3s"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Из них убираем 5 и 25 — они делятся на 5. Остаётся 8 чисел: 1, 7, 11, 13, 17, 19, 23, 29, и дальше этот узор повторяется каждые 30 чисел.",
"en": "Of those, remove 5 and 25 — they divide by 5. That leaves 8 numbers: 1, 7, 11, 13, 17, 19, 23, 29, and the pattern repeats every 30 numbers."
},
"tag": {
"ru": "без 5",
"en": "no 5s"
}
}
],
"NthPrimeBound": [
{
"chapter": "problem",
"caption": {
"ru": "Нужно найти 6-е по счёту простое число с помощью решета — ряда чисел, из которого вычёркивают составные. Длину ряда нужно выбрать заранее.",
"en": "Find the 6th prime number with a sieve — a row of numbers from which the composite ones are crossed out. The length of the row has to be chosen in advance."
},
"tag": {
"ru": "задача",
"en": "task"
}
},
{
"chapter": "problem",
"caption": {
"ru": "В лоб: берём ряд до 8 — там только 4 простых, мало. Удваиваем до 16 — теперь 6-е простое, 13, нашлось. Всего пройдено 8 + 16 = 24 числа.",
"en": "Head-on: take a row up to 8 — only 4 primes there, not enough. Double it to 16 — now the 6th prime, 13, turns up. That is 8 + 16 = 24 numbers gone through."
},
"tag": {
"ru": "в лоб",
"en": "head-on"
}
},
{
"chapter": "idea",
"caption": {
"ru": "Простые встречаются всё реже, и насколько — известно заранее: доказано, что n-е простое не больше n · (ln n + ln ln n), где ln — натуральный логарифм. Около 6 простые идут примерно через ln 6 ≈ 1,79 числа.",
"en": "Primes get rarer, and by how much is known in advance: it is proved that the n-th prime is at most n · (ln n + ln ln n), where ln is the natural logarithm. Around 6, primes come about every ln 6 ≈ 1.79 numbers."
},
"tag": {
"ru": "замечаем",
"en": "notice"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Шесть шагов по 1,79 дают 10,75 — это меньше 13: одной средней длины шага не хватает, дальше шаги длиннее.",
"en": "Six steps of 1.79 reach 10.75 — less than 13: one average step length is not enough, the steps get longer further on."
},
"tag": {
"ru": "оценка",
"en": "guess"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Добавка ln ln 6 ≈ 0,58 учитывает, что шаги растут: 6 · (1,79 + 0,58) = 14,25, округляем вверх до 15.",
"en": "The extra ln ln 6 ≈ 0.58 allows for the growing steps: 6 · (1.79 + 0.58) = 14.25, rounded up to 15."
},
"tag": {
"ru": "уточнение",
"en": "better"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Строим одно решето до 15 — 6-е простое 13 в него попало.",
"en": "Build a single sieve up to 15 — the 6th prime, 13, is inside it."
},
"tag": {
"ru": "решето",
"en": "sieve"
}
}
],
"PrimeNumberTheorem": [
{
"chapter": "problem",
"caption": {
"ru": "Нужно узнать, сколько простых чисел среди чисел от 1 до 100. Точный ответ не обязателен — хватит примерного.",
"en": "How many prime numbers are there among the numbers from 1 to 100? An exact answer is not needed — a rough one will do."
},
"tag": {
"ru": "задача",
"en": "task"
}
},
{
"chapter": "problem",
"caption": {
"ru": "В лоб: строим решето до 100 — вычёркиваем кратные 2, 3, 5 и 7 (104 вычёркивания) и пересчитываем 99 чисел. Это 203 действия и точный ответ 25.",
"en": "Head-on: build a sieve up to 100 — cross out the multiples of 2, 3, 5 and 7 (104 cross-outs), then count through 99 numbers. That is 203 operations and the exact answer, 25."
},
"tag": {
"ru": "в лоб",
"en": "head-on"
}
},
{
"chapter": "idea",
"caption": {
"ru": "Около числа x простые идут в среднем через ln x чисел (ln — натуральный логарифм). До 100 это примерно через каждые 4,61 — значит, простых около 100 ÷ 4,61.",
"en": "Around a number x, primes come on average every ln x numbers (ln is the natural logarithm). Up to 100 that is about every 4.61 — so there are about 100 ÷ 4.61 primes."
},
"tag": {
"ru": "замечаем",
"en": "notice"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Два действия: ln 100 ≈ 4,61, затем 100 ÷ 4,61 ≈ 21,7. Точный ответ 25 — оценка меньше на 13%.",
"en": "Two operations: ln 100 ≈ 4.61, then 100 ÷ 4.61 ≈ 21.7. The exact answer is 25 — the estimate is 13% short."
},
"tag": {
"ru": "до 100",
"en": "up to 100"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Для 10 000 и для миллиона те же два действия дают 1086 и 72 382, а точные ответы — 1229 и 78 498. Ошибка падает: 13%, 12%, 8%.",
"en": "For 10,000 and for a million the same two operations give 1,086 and 72,382, while the exact answers are 1,229 and 78,498. The error shrinks: 13%, 12%, 8%."
},
"tag": {
"ru": "дальше",
"en": "further"
}
}
],
"DivisorCountFormula": [
{
"chapter": "problem",
"caption": {
"ru": "Нужно узнать, сколько делителей у числа 36 — чисел, на которые оно делится без остатка.",
"en": "How many divisors does 36 have — how many numbers does it divide by evenly?"
},
"tag": {
"ru": "задача",
"en": "task"
}
},
{
"chapter": "problem",
"caption": {
"ru": "В лоб: проверяем делением все числа от 1 до 36 — это 36 проверок, из них 27 впустую.",
"en": "Head-on: check every number from 1 to 36 by dividing — 36 checks, 27 of them wasted."
},
"tag": {
"ru": "в лоб",
"en": "head-on"
}
},
{
"chapter": "idea",
"caption": {
"ru": "36 = 2 · 2 · 3 · 3. Любой делитель 36 — это двойка, взятая 0, 1 или 2 раза, умноженная на тройку, взятую 0, 1 или 2 раза. Значит, делителей 3 × 3.",
"en": "36 = 2 · 2 · 3 · 3. Every divisor of 36 is 2 taken 0, 1 or 2 times, multiplied by 3 taken 0, 1 or 2 times. So there are 3 × 3 divisors."
},
"tag": {
"ru": "замечаем",
"en": "notice"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Раскладываем: 36 на 2 — 18, 18 на 2 — 9, 9 на 2 не делится, 9 на 3 — 3, 3 на 3 — 1. Это 5 делений: 36 = 2² · 3².",
"en": "Split it: 36 by 2 is 18, 18 by 2 is 9, 9 does not divide by 2, 9 by 3 is 3, 3 by 3 is 1. That is 5 divisions: 36 = 2² · 3²."
},
"tag": {
"ru": "разложение",
"en": "factors"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Двойку можно взять 0, 1 или 2 раза — 3 варианта; тройку тоже — 3 варианта. Это 2 сложения: 2 + 1 и 2 + 1.",
"en": "The 2 can be taken 0, 1 or 2 times — 3 choices; the same for the 3 — 3 choices. That is 2 additions: 2 + 1 and 2 + 1."
},
"tag": {
"ru": "варианты",
"en": "choices"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Умножаем: 3 × 3 = 9 делителей — сетка 3 на 3 показывает их все. Всего 8 действий.",
"en": "Multiply: 3 × 3 = 9 divisors, and the 3-by-3 grid shows them all. 8 operations in all."
},
"tag": {
"ru": "сетка",
"en": "grid"
}
}
],
"MultiplicativeFunction": [
{
"chapter": "problem",
"caption": {
"ru": "Нужно узнать, сколько делителей у 20, если известно, что 20 = 4 × 5.",
"en": "How many divisors does 20 have, if we know that 20 = 4 × 5?"
},
"tag": {
"ru": "задача",
"en": "task"
}
},
{
"chapter": "problem",
"caption": {
"ru": "В лоб: проверяем делением все числа от 1 до 20 — это 20 проверок.",
"en": "Head-on: check every number from 1 to 20 by dividing — 20 checks."
},
"tag": {
"ru": "в лоб",
"en": "head-on"
}
},
{
"chapter": "idea",
"caption": {
"ru": "У 4 и у 5 нет общих простых множителей: 4 = 2 · 2, а 5 — простое. Тогда каждый делитель 20 — это делитель 4, умноженный на делитель 5, и ответы для частей можно просто перемножить.",
"en": "4 and 5 share no prime factors: 4 = 2 · 2, and 5 is prime. Then every divisor of 20 is a divisor of 4 times a divisor of 5, and the answers for the parts can simply be multiplied."
},
"tag": {
"ru": "замечаем",
"en": "notice"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Делители 4: проверяем 1, 2, 3, 4 — подходят 3 числа (1, 2, 4). Это 4 проверки.",
"en": "Divisors of 4: check 1, 2, 3, 4 — 3 of them fit (1, 2, 4). That is 4 checks."
},
"tag": {
"ru": "части 4",
"en": "part 4"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Делители 5: проверяем 1, 2, 3, 4, 5 — подходят 2 (1 и 5). Всего уже 9 проверок.",
"en": "Divisors of 5: check 1, 2, 3, 4, 5 — 2 fit (1 and 5). 9 checks so far."
},
"tag": {
"ru": "части 5",
"en": "part 5"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Перемножаем: 3 × 2 = 6 делителей у 20 — это 1, 2, 4, 5, 10, 20. Вместе с умножением вышло 10 действий.",
"en": "Multiply: 3 × 2 = 6 divisors of 20 — they are 1, 2, 4, 5, 10, 20. With the multiplication that makes 10 operations."
},
"tag": {
"ru": "итог",
"en": "result"
}
}
],
"IntegerOverflowAvoidance": [
{
"chapter": "problem",
"caption": {
"ru": "Нужно вычислить 120 × 45 ÷ 15, но в ячейку помещаются только числа из 3 цифр — до 999.",
"en": "Work out 120 × 45 ÷ 15, when a cell can only hold numbers of 3 digits — up to 999."
},
"tag": {
"ru": "задача",
"en": "task"
}
},
{
"chapter": "problem",
"caption": {
"ru": "В лоб: сначала 120 × 45 = 5400 — это 4 цифры, и в ячейке остаётся только 400. Дальше 400 ÷ 15 даёт 26,7 вместо 360: ответ испорчен.",
"en": "Head-on: first 120 × 45 = 5400 — 4 digits, and only 400 stays in the cell. Then 400 ÷ 15 gives 26.7 instead of 360: the answer is ruined."
},
"tag": {
"ru": "в лоб",
"en": "head-on"
}
},
{
"chapter": "idea",
"caption": {
"ru": "15 делит 120 без остатка: 120 = 15 × 8. Если сначала разделить, промежуточное число станет маленьким.",
"en": "15 divides 120 evenly: 120 = 15 × 8. If we divide first, the number in between stays small."
},
"tag": {
"ru": "замечаем",
"en": "notice"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Сначала 120 ÷ 15 = 8 — одна цифра.",
"en": "First 120 ÷ 15 = 8 — one digit."
},
"tag": {
"ru": "делим",
"en": "divide"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Потом 8 × 45 = 360 — три цифры, помещается. Ответ верный: 360.",
"en": "Then 8 × 45 = 360 — three digits, it fits. The answer is right: 360."
},
"tag": {
"ru": "умножаем",
"en": "multiply"
}
}
],
"ExplicitStackRecursion": [
{
"chapter": "problem",
"caption": {
"ru": "Есть цепочка D → C → B → A: каждое звено указывает на следующее. Для каждого звена нужно узнать, сколько шагов от него до A.",
"en": "There is a chain D → C → B → A: each link points to the next. For each link, find how many steps it is from A."
},
"tag": {
"ru": "задача",
"en": "task"
}
},
{
"chapter": "problem",
"caption": {
"ru": "В лоб: D спрашивает у C, C — у B, B — у A, и каждый вопрос ждёт ответа внутри предыдущего. Сразу открыто 4 вопроса, а места для таких ждущих вопросов у компьютера мало — в языке Python около 1000.",
"en": "Head-on: D asks C, C asks B, B asks A, and each question waits for its answer inside the one before. That is 4 questions open at once, and a computer has little room for waiting questions — about 1000 in the Python language."
},
"tag": {
"ru": "в лоб",
"en": "head-on"
}
},
{
"chapter": "idea",
"caption": {
"ru": "Звенья можно не вкладывать друг в друга, а сложить в свою стопку: дойти по цепочке до A, складывая звенья, а потом снимать их по одному сверху.",
"en": "The links do not have to be nested inside each other. Put them on a stack of your own instead: walk the chain down to A, piling up the links, then take them off the top one by one."
},
"tag": {
"ru": "замечаем",
"en": "notice"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Идём по цепочке от D к A и кладём D, C, B в стопку — открыт один вопрос.",
"en": "Walk the chain from D to A and put D, C, B on the stack — only one question is open."
},
"tag": {
"ru": "спуск",
"en": "down"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Снимаем сверху B: у него 0 + 1 = 1 шаг до A. Затем C — 2, затем D — 3.",
"en": "Take B off the top: 0 + 1 = 1 step to A. Then C: 2, then D: 3."
},
"tag": {
"ru": "подъём",
"en": "up"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Все ответы готовы: D = 3, C = 2, B = 1. Открытым был всего один вопрос, а стопка может быть любой длины.",
"en": "All answers are ready: D = 3, C = 2, B = 1. Only one question was ever open, and the stack can be as long as needed."
},
"tag": {
"ru": "итог",
"en": "result"
}
}
],
"SparseSet": [
{
"chapter": "problem",
"caption": {
"ru": "В ряду из 12 ячеек данные записаны только в трёх — с номерами 2, 6 и 9. Нужно очистить ряд — сделать все ячейки пустыми.",
"en": "In a row of 12 cells, only three hold data — cells 2, 6 and 9. The row has to be cleared: every cell made empty."
},
"tag": {
"ru": "задача",
"en": "task"
}
},
{
"chapter": "problem",
"caption": {
"ru": "В лоб: обнуляем все 12 ячеек, хотя 9 из них и так пустые.",
"en": "Head-on: wipe all 12 cells, even though 9 of them are already empty."
},
"tag": {
"ru": "в лоб",
"en": "head-on"
}
},
{
"chapter": "idea",
"caption": {
"ru": "Если при каждой записи отмечать номер ячейки в коротком списке, то для очистки хватит пройти только по этому списку.",
"en": "If every time we write to a cell we note its number in a short list, then clearing only needs to go through that list."
},
"tag": {
"ru": "замечаем",
"en": "notice"
}
},
{
"chapter": "solve",
"caption": {
"ru": "При записи номера 2, 6 и 9 попадают в список — 3 действия.",
"en": "While writing, the numbers 2, 6 and 9 go into the list — 3 operations."
},
"tag": {
"ru": "список",
"en": "list"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Очищаем по списку: обнуляем ячейки 2, 6 и 9 — ещё 3 действия. Ряд чист за 6 действий, 9 пустых ячеек мы не трогали.",
"en": "Clear by the list: wipe cells 2, 6 and 9 — 3 more operations. The row is clean after 6, and the 9 empty cells were never touched."
},
"tag": {
"ru": "очистка",
"en": "clear"
}
}
],
"MillerRabinPrimalityTest": [
{
"chapter": "problem",
"caption": {
"ru": "Нужно узнать, простое ли число 25 — делится ли оно только на 1 и на себя. Способ должен работать быстро и для чисел около 10¹⁸.",
"en": "Is 25 a prime number — does it divide only by 1 and by itself? The way of checking should also be fast for numbers around 10¹⁸."
},
"tag": {
"ru": "задача",
"en": "task"
}
},
{
"chapter": "problem",
"caption": {
"ru": "В лоб: делим 25 на 2, 3, 4, 5 — до числа, которое в квадрате даёт 25. На 5 делится: 25 составное, 4 деления. Но для числа около 10¹⁸ таких делений будет миллиард.",
"en": "Head-on: divide 25 by 2, 3, 4, 5 — up to the number whose square is 25. It divides by 5: 25 is not prime, 4 divisions. But for a number around 10¹⁸ that would be a billion divisions."
},
"tag": {
"ru": "в лоб",
"en": "head-on"
}
},
{
"chapter": "idea",
"caption": {
"ru": "У простого числа n есть свойство: если возвести 2 в степень, а потом возводить в квадрат ещё и ещё, каждый раз оставляя только остаток от деления на n, то цепочка остатков обязательно встретит 1 или n − 1. Не встретила — n точно составное.",
"en": "A prime n has a property: raise 2 to a power, then square it again and again, each time keeping only the remainder after dividing by n — the chain of remainders is sure to hit 1 or n − 1. If it does not, n is certainly not prime."
},
"tag": {
"ru": "замечаем",
"en": "notice"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Раскладываем 25 − 1 = 24 = 3 × 2 × 2 × 2: нечётная часть 3 и три двойки. Значит, начинаем со степени 3 и возводим в квадрат дважды.",
"en": "Split 25 − 1 = 24 = 3 × 2 × 2 × 2: the odd part 3 and three 2s. So we start with the power 3 and then square twice."
},
"tag": {
"ru": "24 = 3 · 8",
"en": "24 = 3 · 8"
}
},
{
"chapter": "solve",
"caption": {
"ru": "2 в степени 3 — это 8. В квадрате 64, остаток от деления на 25 — 14. Ещё раз в квадрат: 196, остаток 21.",
"en": "2 to the power 3 is 8. Squared, that is 64, remainder after dividing by 25: 14. Squared again: 196, remainder 21."
},
"tag": {
"ru": "степени",
"en": "powers"
}
},
{
"chapter": "solve",
"caption": {
"ru": "Цепочка 8, 14, 21 не встретила ни 1, ни 24 — значит, 25 составное. Хватило 4 умножений.",
"en": "The chain 8, 14, 21 never hit 1 or 24 — so 25 is not prime. 4 multiplications were enough."
},
"tag": {
"ru": "итог",
"en": "result"
}
}
]
};
/*ST-END*/

function vis(t, on, fresh, o){
  if(!on) t.fadeOut();
  else if(fresh) t.fadeIn(o);
  else t.show(true);
}
function each(list, fn){ for(var k = 0; k < list.length; k++) fn(list[k], k); }

/* Two counters. Red: the head-on cost; counts up on the head-on step (1), holds on the idea step (2) and stays,
   muted, through the solve steps. Violet: the trick's own count in the solve steps (green on the last one).
   b = {naive, nLab, nNote, pos, mLab, mPos, seq[], mNotes[], ms}; seq[j] == null hides the violet counter. */
function boards(api, b){
  b.n = api.counter(b.nLab, {pos: b.pos, color: 'red', w: 3.6, d: 1.6, noteFitValue: b.naive, note: b.nNote, noteSize: 0.5});
  b.m = api.counter(b.mLab, {pos: b.mPos, color: 'violet', w: 3.6, d: 1.6, note: b.mNotes[b.mNotes.length - 1], noteSize: 0.5});
  return b;
}
function runBoards(b, i, last){
  var j = i - 3;
  if(i === 0){ b.n.fadeOut(); b.m.fadeOut(); return; }
  b.n.opacity(j >= 0 ? 0.45 : 1);
  if(i === 1){ b.n.set(0, {ms: 0}); b.n.set(b.naive, {ms: b.ms || 1800, delay: b.d0 || 200}); } else b.n.set(b.naive);
  if(j < 0 || b.seq[j] == null){ b.m.fadeOut(); return; }
  b.m.fadeIn(); b.m.color(last ? 'green' : 'violet'); b.m.set(b.seq[j]); b.m.setNote(b.mNotes[j]);
}
function reg(def){ def.steps = ST[def.id]; LAB.register(def); }

/* ---------------- Trial division: 30 = 2 · 3 · 5 ----------------
 * head-on 32 = 29 numbers 2…30 + 3 repeat tries after a hit; the trick: 30÷2, 15÷2, 15÷3, 5÷3 = 4, stop at 4·4 > 5 */
reg({
  id: 'TrialDivision',
  view: {yaw: 0.12, pitch: 1.05, fill: 0.84},
  build: function(api){
    var L = api.L, s = {}, d;
    s.tiles = []; s.marks = [];
    for(d = 2; d <= 30; d++){
      var k = d - 2, t = api.tile(d, {pos: [3.6 + (k % 8)*1.0, 0, -1.2 + Math.floor(k/8)*1.9], size: 0.82, h: 0.2});
      var hit = d === 2 || d === 3 || d === 5;
      s.tiles.push(t);
      s.marks.push(api.marks(t, hit ? [{text: '÷', color: 'green'}, {text: '÷', color: 'red'}] : [{text: '÷', color: 'red'}], {gap: 0.5}));
    }
    s.legend = api.text(L('зелёная ÷ — делится, красная — проба впустую', 'green ÷: it divides; red: a wasted try'), [7.1, 0, 6.6], {size: 0.4, color: 'ink'});
    s.idea = api.label(L('4 · 4 = 16 больше 5', '4 · 4 = 16 is more than 5'), s.tiles[2], {color: 'amber', dy: 0.3});
    var Q = [[0, -2.2], [0.6, -1.0], [1.2, 0.2]];                 // the column: number, then what is left
    s.q = [30, 15, 5].map(function(v, k){ return api.tile(v, {pos: [Q[k][0], 0, Q[k][1]], h: 0.4}); });
    s.d = [2, 3, 4].map(function(v, k){ return api.tile(v, {pos: [Q[k][0] - 1.2, 0, Q[k][1]], color: k === 2 ? 'amber' : 'blue'}); });
    s.ladders = [0, 1].map(function(k){
      var x = Q[k][0] - 0.6, z = Q[k][1];
      return api.line([[x, 0.02, z + 1.15], [x, 0.02, z - 0.6], [x + 1.35, 0.02, z - 0.6]], {color: 'ink'});
    });
    s.tries = [['30÷2', 'green', 0], ['15÷2', 'red', 0], ['15÷3', 'green', 1], ['5÷3', 'red', 1]].map(function(b, k){
      return api.badge(b[0], {pos: [Q[b[2]][0] - 2.55 - (k % 2)*1.25, 0, Q[b[2]][1]], color: b[1]});
    });
    s.stop = api.label(L('4 · 4 = 16 &gt; 5 — стоп: 5 простое', '4 · 4 = 16 &gt; 5: stop, 5 is prime'), s.d[2], {color: 'green'});
    s.b = boards(api, {naive: 32, pos: [7.1, 0, -4.6], mPos: [-4.2, 0, 2.8], ms: 2200,
      nLab: L('проб в лоб', 'head-on tries'),
      nNote: function(v){ return v <= 29 ? L(v + ' из 29 чисел от 2 до 30', v + ' of the 29 numbers from 2 to 30')
        : L('29 чисел + ' + (v - 29) + ' ' + pl(v - 29, 'повторная проба', 'повторные пробы', 'повторных проб'), '29 numbers + ' + (v - 29) + ' ' + pl(v - 29, 'repeat try', 'repeat tries')); },
      mLab: L('проб до d · d', 'tries up to d · d'), seq: [2, 4, 4],
      mNotes: [L('30 на 2 — да, 15 на 2 — нет', '30 by 2: yes; 15 by 2: no'), L('15 на 3 — да, 5 на 3 — нет', '15 by 3: yes; 5 by 3: no'), L('на d = 4 проб больше нет', 'at d = 4 no more tries')]});
    return s;
  },
  step: function(api, s, i){
    var j = i - 3, field = i === 1 || i === 2;
    each(s.tiles, function(t, k){
      var v = k + 2, col = 'plain', lift = 0, dl = 0;
      if(i === 1){ col = (v === 2 || v === 3 || v === 5) ? 'green' : 'red'; dl = 200 + k*65; }
      if(i === 2){ col = v <= 3 ? 'violet' : v === 4 ? 'amber' : 'dim'; lift = v === 4 ? 0.25 : 0; }
      vis(t, field, true); t.color(col, {delay: dl}); t.lift(lift);
      if(i === 1) s.marks[k].show(s.marks[k].items.length, {delay: dl, every: 30}); else s.marks[k].show(0);
    });
    vis(s.legend, i === 1, true, {delay: 400});
    s.idea.show(i === 2, {delay: 300});
    s.q[0].color(j >= 0 ? 'plain' : 'violet'); s.q[0].lift(i === 0 ? 0.25 : 0);
    vis(s.q[1], j >= 0, j === 0, {delay: 350});
    vis(s.q[2], j >= 1, j === 1, {delay: 350});
    s.q[2].color(j === 2 ? 'green' : 'plain', {delay: j === 2 ? 600 : 0}); s.q[2].lift(j === 2 ? 0.35 : 0, {delay: 600});
    each(s.d, function(t, k){ vis(t, j >= k, j === k); t.color(k === 2 ? 'amber' : j === k ? 'violet' : 'blue'); });
    each(s.ladders, function(l, k){ vis(l, j >= k, j === k, {delay: 120}); });
    each(s.tries, function(b, k){ vis(b, j >= (k >> 1), j === (k >> 1), {delay: 300 + (k % 2)*300}); });
    s.stop.show(j === 2, {delay: 700});
    runBoards(s.b, i, j === 2);
  }
});

/* ---------------- Euclid: gcd(35, 15) = 5 ----------------
 * a 35 × 15 rectangle; head-on: candidates 15…5 checked on 35 (and on 15 when 35 divides): 11 + 2 = 13;
 * the trick: two 15-squares leave a 5-strip (35 = 2·15 + 5), the strip splits 15 into three 5-squares */
reg({
  id: 'EuclideanAlgorithm',
  view: {yaw: 0.15, pitch: 1.0, fill: 0.84},
  build: function(api){
    var L = api.L, s = {}, c = [], v;
    s.frame = api.box([7, 0.06, 3], {pos: [0, 0, 0], color: 'plain'});        // 1 unit of length = 0.2 world units
    s.w = api.text('35', [0, 0, -1.95], {size: 0.5, color: 'ink'});
    s.h = api.text('15', [-4.1, 0, 0], {size: 0.5, color: 'ink'});
    for(v = 15; v >= 5; v--) c.push(v);
    s.cand = api.row(c, {pos: [0, 0, 3.2], gap: 1.22, size: 0.8, h: 0.2});
    s.marks = c.map(function(v, k){
      var l = [{text: '35', color: 35 % v ? 'red' : 'green'}];
      if(35 % v === 0) l.push({text: '15', color: 15 % v ? 'red' : 'green'});
      return api.marks(s.cand.at(k), l, {dir: 'front', gap: 0.5});
    });
    s.legend = api.text(L('метка 35 — проверили 35, метка 15 — проверили 15; зелёная — делится', 'tag 35: 35 was checked, tag 15: 15 was checked; green: it divides'), [0, 0, 5.6], {size: 0.4, color: 'ink'});
    s.sq = [api.tile(15, {pos: [-2, 0, 0], size: 2.94, h: 0.45, color: 'blue'}),
            api.tile(15, {pos: [1, 0, 0], size: 2.94, h: 0.45, color: 'blue'})];
    s.strip = api.box([0.94, 0.45, 2.94], {pos: [3, 0, 0], color: 'red'});
    s.small = [-1, 0, 1].map(function(z){ return api.tile(5, {pos: [3, 0, z], size: 0.94, h: 0.46, color: 'green'}); });
    s.call = api.label('', s.strip, {color: 'violet'});
    s.b = boards(api, {naive: 13, pos: [7.8, 0, -3.8], mPos: [7.8, 0, 0.9], ms: 2000,
      nLab: L('проверок в лоб', 'head-on checks'),
      nNote: function(v){ return v <= 11 ? L(v + ' ' + pl(v, 'проверка', 'проверки', 'проверок') + ' числа 35', v + ' ' + pl(v, 'check', 'checks') + ' of 35')
        : L('11 проверок 35 + ' + (v - 11) + ' ' + pl(v - 11, 'проверка', 'проверки', 'проверок') + ' 15', '11 checks of 35 + ' + (v - 11) + ' of 15'); },
      mLab: L('делений с остатком', 'divisions with remainder'), seq: [1, 2],
      mNotes: [L('35 = 2 · 15 + 5', '35 = 2 · 15 + 5'), L('15 = 3 · 5, остатка нет', '15 = 3 · 5, nothing left')]});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3;
    s.frame.color(i <= 1 ? 'plain' : 'dim');
    s.cand.each(function(t, k){ t.color(i === 1 ? (k === 10 ? 'green' : 'red') : 'plain', {delay: i === 1 ? 200 + k*140 : 0}); });
    vis(s.cand, i === 1, true);
    each(s.marks, function(m, k){ if(i === 1) m.show(2, {delay: 200 + k*140, every: 60}); else m.show(0); });
    vis(s.legend, i === 1, true, {delay: 300});
    each(s.sq, function(t, k){ vis(t, i >= 2, i === 2 || j === 0, {delay: k*250}); t.color(i === 2 ? 'dim' : j === 1 ? 'dim' : 'blue'); });
    vis(s.strip, i === 2 || j === 0, true, {delay: 500});
    s.strip.color(i === 2 ? 'violet' : 'red');
    each(s.small, function(t, k){ vis(t, j === 1, true, {delay: 200 + k*260}); t.lift(j === 1 && k === 0 ? 0.3 : 0, {delay: 1000}); });
    var txt = i === 2 ? L('35 − 15 − 15 = 5', '35 − 15 − 15 = 5') : j === 0 ? L('остаток 5', '5 left over') : j === 1 ? L('5 укладывается в 15 ровно 3 раза', '5 fits into 15 exactly 3 times') : '';
    s.call.to(j === 1 ? s.small[0] : s.strip); s.call.setText(txt); s.call.color(j === 1 ? 'green' : i === 2 ? 'violet' : 'red');
    s.call.show(!!txt, {delay: 700});
    runBoards(s.b, i, j === 1);
  }
});

/* ---------------- LCM through the common divisor: lcm(35, 15) = 105 ----------------
 * head-on: 35, 36, …, 105 = 71 checks; the trick: gcd = 5 (2 divisions), 35 ÷ 5 = 7, 7 × 15 = 105 → 4 operations */
reg({
  id: 'LCMViaGCD',
  view: {yaw: 0.1, pitch: 1.0, fill: 0.88},
  build: function(api){
    var L = api.L, s = {}, U = 0.5, x0 = -5.25, k, ZA = -3.2, ZB = -2.2;
    s.n35 = api.tile(35, {pos: [x0 - 1.0, 0, ZA], size: 0.9, h: 0.4, color: 'blue'});
    s.n15 = api.tile(15, {pos: [x0 - 1.0, 0, ZB], size: 0.9, h: 0.4, color: 'red'});
    s.a = []; s.b = [];
    for(k = 0; k < 7; k++) s.a.push(api.tile(5, {pos: [x0 + U/2 + k*U, 0, ZA], size: 0.46, h: 0.28, color: 'blue'}));
    for(k = 0; k < 3; k++) s.b.push(api.tile(5, {pos: [x0 + U/2 + k*U, 0, ZB], size: 0.46, h: 0.28, color: 'red'}));
    s.g = api.grid(8, 9, function(r, c){ var v = 35 + r*9 + c; return v <= 105 ? v : null; }, {pos: [1.4, 0, 0.2], gap: 0.66, size: 0.58, h: 0.12});
    s.legend = api.label(L('первое, что делится и на 35, и на 15', 'the first that divides by both 35 and 15'), s.g.at(7, 7), {color: 'green', dy: 0.3});
    s.share = api.label(L('общая часть 5 — в ответ берём один раз', 'shared part 5: taken only once in the answer'), s.a[6], {color: 'violet', dy: 0.3});
    s.gcd = [api.badge(L('35 ÷ 15 = 2, ост. 5', '35 ÷ 15 = 2, rem 5'), {pos: [0.6, 0, ZA], color: 'teal'}),
             api.badge(L('15 ÷ 5 = 3, ост. 0', '15 ÷ 5 = 3, rem 0'), {pos: [0.6, 0, ZB], color: 'teal'})];
    s.gcdL = api.label(L('общая часть — 5', 'shared part: 5'), s.gcd[1], {color: 'teal'});
    s.n7 = api.tile(7, {pos: [3.6, 0, ZB], size: 0.8, h: 0.4, color: 'violet'});
    s.n7L = api.label(L('35 ÷ 5 = 7 — столько раз берём 15', '35 ÷ 5 = 7: how many times to take 15'), s.n7, {color: 'violet'});
    var ZC = -0.4, ZD = 0.7;
    s.rowC = []; s.rowCT = []; s.rowD = []; s.rowDT = [];
    for(k = 0; k < 3; k++){
      s.rowC.push(api.box([7*U - 0.08, 0.05, 0.8], {pos: [x0 + 3.5*U + k*7*U, 0, ZC], color: 'green'}));
      s.rowCT.push(api.text('35', [x0 + 3.5*U + k*7*U, 0.06, ZC], {size: 0.5, color: 'ink'}));
    }
    for(k = 0; k < 7; k++){
      s.rowD.push(api.box([3*U - 0.08, 0.05, 0.8], {pos: [x0 + 1.5*U + k*3*U, 0, ZD], color: 'green'}));
      s.rowDT.push(api.text('15', [x0 + 1.5*U + k*3*U, 0.06, ZD], {size: 0.45, color: 'ink'}));
    }
    s.eq = api.text(L('7 × 15 = 3 × 35 = 105', '7 × 15 = 3 × 35 = 105'), [0, 0, 1.9], {size: 0.5, color: 'green'});
    s.bb = boards(api, {naive: 71, pos: [-3.2, 0, 4.4], mPos: [2.6, 0, 4.4], ms: 2400,
      nLab: L('проверок подряд', 'checks in a row'),
      nNote: function(v){ return L('проверено: 35 … ' + (34 + Math.max(1, v)), 'checked: 35 … ' + (34 + Math.max(1, v))); },
      mLab: L('действий через общую часть', 'operations via the shared part'), seq: [2, 3, 4],
      mNotes: [L('2 деления: общая часть 5', '2 divisions: shared part 5'), L('+ 35 ÷ 5 = 7', '+ 35 ÷ 5 = 7'), L('+ 7 × 15 = 105', '+ 7 × 15 = 105')]});
    return s;
  },
  step: function(api, s, i){
    var j = i - 3, rows = i >= 2;
    s.g.each(function(t, k){ t.color(i === 1 ? (k === 70 ? 'green' : 'red') : 'dim', {delay: i === 1 ? 200 + k*32 : 0}); });
    vis(s.g, i === 1, true);
    s.legend.show(i === 1, {delay: 2500});
    each(s.a.concat(s.b), function(t, k){ vis(t, rows, i === 2, {delay: k*60}); t.color(j === 2 ? 'dim' : k < 7 ? 'blue' : 'red'); });
    s.a[6].lift(i === 2 ? 0.25 : 0); s.b[2].lift(i === 2 ? 0.25 : 0);
    s.a[6].color(i === 2 ? 'violet' : j === 2 ? 'dim' : 'blue'); s.b[2].color(i === 2 ? 'violet' : j === 2 ? 'dim' : 'red');
    s.share.show(i === 2, {delay: 400});
    each(s.gcd, function(b, k){ vis(b, j === 0 || j === 1, j === 0, {delay: 200 + k*300}); });
    s.gcdL.show(j === 0, {delay: 900});
    vis(s.n7, j >= 1, j === 1, {delay: 200});
    s.n7L.show(j === 1, {delay: 500});
    each(s.rowC, function(t, k){ vis(t, j === 2, true, {delay: k*220}); vis(s.rowCT[k], j === 2, true, {delay: k*220}); });
    each(s.rowD, function(t, k){ vis(t, j === 2, true, {delay: 700 + k*110}); vis(s.rowDT[k], j === 2, true, {delay: 700 + k*110}); });
    vis(s.eq, j === 2, true, {delay: 1500});
    runBoards(s.bb, i, j === 2);
  }
});

/* ---------------- Sieving over multiples: divisor counts for 1…20 ----------------
 * head-on: number n needs n checks → 1 + 2 + … + 20 = 210; the trick: from each d step d, 2d, 3d … and add 1
 * steps: d = 1 (20), d = 2 and 3 (10 + 6), d = 4…10 (20; only d = 4 drawn), d = 11…20 (10) → 66 */
reg({
  id: 'SievingOverMultiples',
  view: {yaw: 0.08, pitch: 1.0, fill: 0.92},
  build: function(api){
    var L = api.L, s = {}, N = 20, nums = [], n;
    for(n = 1; n <= N; n++) nums.push(n);
    s.row = api.row(nums, {gap: 1.1, h: 0.36});
    s.cnt = api.row(nums.map(function(){ return 0; }), {gap: 1.1, pos: [0, 0, 1.3], size: 0.92, h: 0.3, color: 'teal'});
    var x0 = s.row.pos(0)[0] - 1.1;
    s.at = function(n){ return s.row.at(n - 1); };
    var hop = function(d, color, h){
      var list = [], prev = [x0, 0.36, 0];
      for(var m = d; m <= N; m += d){ list.push(api.arc(prev, s.at(m), {color: color, height: h})); prev = s.at(m); }
      return list;
    };
    s.h1 = hop(1, 'teal', 0.45); s.h2 = hop(2, 'blue', 0.9); s.h3 = hop(3, 'red', 1.4); s.h4 = hop(4, 'amber', 1.8);
    s.rowL = api.text(L('счётчик делителей', 'divisor counter'), [x0 - 0.3, 0, 1.3], {size: 0.4, color: 'teal', align: 'right'});
    s.call = api.label('', s.at(6), {color: 'violet', dy: 1.6});
    s.b = boards(api, {naive: 210, pos: [-8.0, 0, -3.4], mPos: [-3.2, 0, -3.4], ms: 2200,
      nLab: L('проверок в лоб', 'head-on checks'),
      nNote: function(v){ return L('сумма нижнего ряда: ' + v, 'sum of the bottom row: ' + v); },
      mLab: L('шагов по кратным', 'steps through multiples'), seq: [20, 36, 56, 66],
      mNotes: [L('20 шагов по 1', '20 steps of 1'), L('20 + 10 + 6', '20 + 10 + 6'), L('36 + 20', '36 + 20'), L('56 + 10', '56 + 10')]});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3;
    function tau(n, maxD){ var c = 0; for(var d = 1; d <= Math.min(maxD, n); d++) if(n % d === 0) c++; return c; }
    var maxD = [0, 1, 3, 10, 20][j + 1] || 0, prevD = [0, 0, 1, 3, 10][j + 1] || 0;
    for(var n = 1; n <= 20; n++){
      var t = s.cnt.at(n - 1), num = s.at(n);
      if(i === 0){ t.setText('?'); t.color('dim'); }
      if(i === 1){ t.setText(n, {delay: 150 + n*85}); t.color('amber', {delay: 150 + n*85}); }
      if(i === 2){ t.setText(n % 3 === 0 ? 1 : 0); t.color(n % 3 === 0 ? 'violet' : 'dim'); }
      if(j >= 0){
        var c = tau(n, maxD), changed = c !== tau(n, prevD);
        t.setText(c, {delay: changed ? 250 + n*40 : 0});
        t.color(j === 3 ? 'green' : changed ? 'amber' : 'teal', {delay: changed ? 250 + n*40 : 0});
      }
      t.lift(j === 3 && n === 12 ? 0.3 : 0, {delay: 300});
      num.color(i === 2 && n % 3 === 0 ? 'violet' : 'plain');
    }
    each(s.h1, function(h, k){ vis(h, j === 0, true, {delay: k*70}); });
    each(s.h2, function(h, k){ vis(h, j === 1, true, {delay: k*110}); });
    each(s.h3, function(h, k){ vis(h, i === 2 || j === 1, true, {delay: (j === 1 ? 700 : 150) + k*150}); h.color(i === 2 ? 'violet' : 'red'); });
    each(s.h4, function(h, k){ vis(h, j === 2, true, {delay: k*200}); });
    var txt = i === 1 ? L('внизу — сколько проверок нужно числу', 'bottom row: checks each number needs')
      : i === 2 ? L('шаги по 3: у 3, 6, 9 … 18 делитель 3', 'steps of 3: 3, 6, 9 … 18 all have divisor 3')
      : j === 0 ? L('жёлтые счётчики выросли на этом шаге', 'yellow counters grew on this step')
      : j === 2 ? L('нарисованы шаги по 4; по 5 … 10 — так же', 'steps of 4 are drawn; 5 … 10 work the same way')
      : j === 3 ? L('у 12 — 6 делителей', '12 has 6 divisors') : '';
    s.call.to(j === 3 ? s.cnt.at(11) : i === 1 ? s.cnt.at(19) : s.at(j === 2 ? 8 : 6));
    s.call.setText(txt); s.call.color(j === 3 ? 'green' : i === 1 ? 'amber' : j === 2 ? 'amber' : 'violet');
    s.call.show(!!txt, {delay: 600});
    runBoards(s.b, i, j === 3);
  }
});

/* ---------------- Linear sieve: smallest prime divisor of 2…20 ----------------
 * head-on: multiples of 2, 3, 5, 7 → 9 + 5 + 3 + 1 = 18 writes (7 cells twice); the trick: i·p with p ≤ lp(i) → 11 writes */
reg({
  id: 'LinearSieve',
  view: {yaw: 0.06, pitch: 1.0, fill: 0.94},
  build: function(api){
    var L = api.L, s = {}, nums = [], n, P = [2, 3, 5, 7];
    for(n = 2; n <= 20; n++) nums.push(n);
    s.row = api.row(nums, {gap: 1.1, h: 0.3});
    s.lp = api.row(nums.map(function(){ return ''; }), {gap: 1.1, pos: [0, 0, 1.2], h: 0.2, color: 'dim'});
    s.at = function(n){ return s.row.at(n - 2); }; s.lpAt = function(n){ return s.lp.at(n - 2); };
    s.lpT = api.text(L('наименьший простой делитель', 'smallest prime divisor'), [s.row.pos(0)[0] - 0.7, 0, 1.2], {size: 0.38, color: 'teal', align: 'right'});
    s.marks = {};
    for(n = 4; n <= 20; n++){
      var l = []; P.forEach(function(p){ if(n > p && n % p === 0) l.push({text: '×' + p, color: l.length ? 'amber' : 'blue'}); });
      if(l.length) s.marks[n] = {m: api.marks(s.at(n), l, {gap: 0.5}), ps: l.map(function(b){ return +b.text.slice(1); })};
    }
    s.writes = [[2, 2], [3, 2], [3, 3], [4, 2], [5, 2], [5, 3], [6, 2], [7, 2], [8, 2], [9, 2], [10, 2]];
    s.arcs = s.writes.map(function(w, k){                        // each write its own height: the 11 arcs stay countable
      return api.arc(s.at(w[0]), s.at(w[0]*w[1]), {color: w[1] === 2 ? 'blue' : 'red', height: 0.5 + k*0.34});
    });
    s.f1 = api.arc(s.at(20), s.at(10), {color: 'violet', height: 1.6, head: true});
    s.f2 = api.arc(s.at(10), s.at(5), {color: 'violet', height: 1.2, head: true});
    s.call = api.label('', s.at(12), {color: 'violet', dy: 1.7});
    s.b = boards(api, {naive: 18, pos: [-8.0, 0, -3.6], mPos: [-2.4, 0, -3.6], ms: 2400,
      nLab: L('записей в лоб', 'head-on writes'),
      nNote: L('кратные 2: 9, 3: 5, 5: 3, 7: 1', 'multiples of 2: 9, of 3: 5, of 5: 3, of 7: 1'),
      mLab: L('записей по одной', 'writes, one each'), seq: [11, 11, 11],
      mNotes: [L('по одной на каждое составное', 'one per composite number'), L('простые не считаются', 'primes are not counted'), L('таблица только читается', 'the table is only read')]});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3, P = [2, 3, 5, 7];
    var spf = function(n){ for(var p = 2; p*p <= n; p++) if(n % p === 0) return p; return n; };
    var chain = {20: 1, 10: 1, 5: 1};
    for(var n = 2; n <= 20; n++){
      var p = spf(n), prime = p === n, t = s.lpAt(n), num = s.at(n), e = s.marks[n];
      var text = '', col = 'dim', d = 0;
      if(i === 1 && e){ var lastP = e.ps[e.ps.length - 1]; d = 200 + P.indexOf(lastP)*650 + n*20; text = lastP; col = e.ps.length > 1 ? 'amber' : 'plain'; }
      if(i === 2 && (n === 12)){ text = 2; col = 'violet'; }
      var wi = -1; s.writes.forEach(function(w, k){ if(w[0]*w[1] === n) wi = k; });
      if(j >= 0 && !prime){ text = p; col = p === 2 ? 'blue' : 'red'; d = j === 0 ? 200 + wi*160 : 0; }
      if(j >= 1 && prime){ text = n; col = 'green'; d = j === 1 ? n*40 : 0; }
      if(j === 2) col = chain[n] ? (n === 5 ? 'green' : 'blue') : 'dim';
      t.setText(text, {delay: d}); t.color(col, {delay: d});
      num.color(j === 2 ? (chain[n] ? 'ink' : 'dim') : i === 2 ? (n === 12 || n === 6 ? 'violet' : 'dim') : 'plain');
      num.lift(j === 2 && chain[n] ? 0.25 : 0); t.lift(j === 2 && chain[n] ? 0.25 : 0);
      num.strike(i === 1 && !!e, {delay: i === 1 && e ? 200 + P.indexOf(e.ps[0])*650 + n*20 : 0});
      if(e) e.m.items.forEach(function(b, k){ if(i === 1) b.fadeIn({delay: 200 + P.indexOf(e.ps[k])*650 + n*20}); else b.fadeOut(); });
    }
    each(s.arcs, function(a, k){ vis(a, j === 0 || (i === 2 && k === 6), true, {delay: i === 2 ? 150 : 150 + k*160}); a.color(i === 2 ? 'violet' : s.writes[k][1] === 2 ? 'blue' : 'red'); });
    vis(s.f1, j === 2, true, {delay: 200});
    vis(s.f2, j === 2, true, {delay: 700});
    var txt = i === 1 ? L('метка ×p — запись в ячейку; жёлтая — повторная', 'tag ×p: a write into the cell; yellow: written again')
      : i === 2 ? L('12 = 6 · 2 — единственный способ', '12 = 6 · 2 — the only way')
      : j === 0 ? L('11 дуг — 11 записей', '11 arcs — 11 writes')
      : j === 1 ? L('зелёные — простые', 'green: primes')
      : j === 2 ? L('20 = 2 · 2 · 5', '20 = 2 · 2 · 5') : '';
    s.call.to(j === 2 ? s.at(20) : j === 1 ? s.lpAt(19) : i === 1 ? s.at(4) : s.at(12));
    s.call.setText(txt); s.call.color(j === 1 || j === 2 ? 'green' : i === 1 ? 'amber' : 'violet');
    s.call.show(!!txt, {delay: i === 1 ? 2600 : 900});
    runBoards(s.b, i, j === 2);
  }
});

/* ---------------- Wheel: candidates among 1…30 ----------------
 * 6 spokes by remainder mod 6; remove evens (15 left), multiples of 3 (10), then 5 and 25 → 8 per 30 */
reg({
  id: 'WheelFactorization',
  view: {yaw: 0, pitch: 1.2, fill: 0.9},
  build: function(api){
    var L = api.L, s = {}, n, D = Math.PI/180;
    s.tiles = [];
    for(n = 1; n <= 30; n++){
      var r = (n - 1) % 6, k = Math.floor((n - 1)/6), a = (30 + 60*r)*D, R = 1.5 + k*0.85;
      s.tiles.push(api.tile(n, {pos: [R*Math.sin(a), 0, -R*Math.cos(a)], size: 0.64, h: 0.24}));
    }
    s.spokes = [];
    for(var q = 0; q < 6; q++){
      var b = 60*q*D;
      s.spokes.push(api.line([[0.75*Math.sin(b), 0.01, -0.75*Math.cos(b)], [5.3*Math.sin(b), 0.01, -5.3*Math.cos(b)]], {color: 'plain'}));
    }
    s.spokeT = [1, 2, 3, 4, 5, 0].map(function(r, k){ var a = (30 + 60*k)*D; return api.text(L('ост. ', 'rem ') + r, [5.8*Math.sin(a), 0, -5.8*Math.cos(a)], {size: 0.34, color: 'plain'}); });
    s.call = api.text('', [0, 0, 6.6], {size: 0.46, color: 'ink'});
    s.b = boards(api, {naive: 30, pos: [8.4, 0, -3.8], mPos: [8.4, 0, -0.2], ms: 1800,
      nLab: L('кандидатов в лоб', 'head-on candidates'),
      nNote: function(v){ return L('числа 1…' + Math.max(1, v), 'numbers 1…' + Math.max(1, v)); },
      mLab: L('кандидатов на колесе', 'candidates on the wheel'), seq: [15, 10, 8],
      mNotes: [L('30 − 15 чётных', '30 − 15 even'), L('15 − 5 кратных 3', '15 − 5 multiples of 3'), L('10 − 5 и 25', '10 − 5 and 25')]});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3;
    each(s.tiles, function(t, k){
      var n = k + 1, col = 'plain', lift = 0, d = 0, sp = n % 6 === 1 || n % 6 === 5;
      if(i === 1){ col = (n % 2 && n % 3 && n % 5) || n === 1 ? 'plain' : 'amber'; d = 200 + k*55; }
      if(i === 2){ col = sp ? 'violet' : 'dim'; lift = sp ? 0.15 : 0; }
      if(j >= 0 && n % 2 === 0){ col = 'blue'; d = j === 0 ? n*30 : 0; }
      if(j >= 1 && n % 2 && n % 3 === 0){ col = 'red'; d = j === 1 ? n*30 : 0; }
      if(j >= 1 && n % 2 && n % 3){ col = 'violet'; }
      if(j === 2 && n % 2 && n % 3){ if(n % 5 === 0){ col = 'amber'; d = 200; } else { col = 'green'; lift = 0.2; d = 500 + n*25; } }
      t.color(col, {delay: d}); t.lift(lift, {delay: d});
    });
    var txt = i === 1 ? L('жёлтые 22 числа делятся на 2, 3 или 5', 'the 22 yellow numbers divide by 2, 3 or 5')
      : i === 2 ? L('кандидаты — только на лучах «ост. 1» и «ост. 5»', 'candidates sit only on the spokes “rem 1” and “rem 5”')
      : j === 0 ? L('синие — чётные, убраны', 'blue: even, removed')
      : j === 1 ? L('красные — делятся на 3, убраны', 'red: divide by 3, removed')
      : j === 2 ? L('жёлтые 5 и 25 убраны; зелёные — 8 кандидатов', 'yellow 5 and 25 removed; green: the 8 candidates') : '';
    s.call.setText(txt); s.call.color(j === 2 ? 'green' : i === 2 ? 'violet' : j === 0 ? 'blue' : j === 1 ? 'red' : 'amber');
    vis(s.call, !!txt, true, {delay: 500});
    runBoards(s.b, i, j === 2);
  }
});

/* ---------------- n-th prime bound: the 6th prime (13) ----------------
 * head-on: sieve to 8 (4 primes), double to 16 → 24 numbers; the trick: 6 · (ln 6 + ln ln 6) = 14.25 → 15 */
reg({
  id: 'NthPrimeBound',
  view: {yaw: 0.05, pitch: 1.05, fill: 0.97},
  build: function(api){
    var L = api.L, s = {}, K = 0.8, X = function(v){ return -8 + v*K; }, ZW = 2.4, k;
    s.axis = api.line([[X(0), 0.01, 0], [X(20.5), 0.01, 0]], {color: 'plain'});
    s.qEnd = api.text('?', [X(21.3), 0, 0], {size: 0.7, color: 'ink'});
    var P = [2, 3, 5, 7, 11, 13, 17, 19];
    s.primes = P.map(function(p){ return api.tile(p, {pos: [X(p), 0, 0], size: 0.66, h: 0.26, color: 'blue'}); });
    s.idx = P.map(function(p, k){ return api.text(String(k + 1), [X(p), 0, 0.65], {size: 0.4, color: 'plain'}); });
    s.r8 = api.box([8*K, 0.05, 1.0], {pos: [X(4), 0, 0], color: 'red'});
    s.r16 = api.box([16*K, 0.03, 1.3], {pos: [X(8), 0, 0], color: 'amber'});
    s.gaps = []; s.gapT = [];
    for(k = 1; k < P.length; k++){
      s.gaps.push(api.arc(s.primes[k - 1], s.primes[k], {color: 'amber', height: 0.25 + 0.12*(P[k] - P[k - 1])}));
      s.gapT.push(api.text(String(P[k] - P[k - 1]), [X((P[k] + P[k - 1])/2), 0, -0.8], {size: 0.36, color: 'amber'}));
    }
    var pts = [];
    for(var v = 1; v <= 20; v += 0.25) pts.push([X(v), Math.log(v)*0.8, -2.0]);
    s.curve = api.line(pts, {color: 'blue'});
    s.bar6 = api.box([0.26, Math.log(6)*0.8, 0.26], {pos: [X(6), 0, -2.0], color: 'amber'});
    var h1 = Math.log(6), h2 = Math.log(6*h1);
    s.walk = api.line([[X(0), 0.01, ZW], [X(16), 0.01, ZW]], {color: 'plain'});
    s.tick13 = api.box([0.07, 0.6, 0.07], {pos: [X(13), 0, ZW], color: 'ink'});
    s.t13 = api.text('13', [X(13), 0, ZW - 0.6], {size: 0.46, color: 'ink'});
    s.hops1 = []; s.hops2 = [];
    for(k = 0; k < 6; k++) s.hops1.push(api.arc([X(k*h1), 0, ZW], [X((k + 1)*h1), 0, ZW], {color: 'amber', height: 0.6}));
    for(k = 0; k < 6; k++) s.hops2.push(api.arc([X(k*h2), 0, ZW], [X((k + 1)*h2), 0, ZW], {color: 'green', height: 1.0}));
    s.land1 = api.tile(L('10,75', '10.75'), {pos: [X(6*h1), 0, ZW], size: 0.9, h: 0.24, color: 'red'});
    s.land2 = api.tile(L('14,25', '14.25'), {pos: [X(6*h2), 0, ZW], size: 0.9, h: 0.24, color: 'green'});
    s.short = api.line([[X(6*h1), 0.06, ZW], [X(13), 0.06, ZW]], {color: 'red', dashed: true});
    s.range = api.box([15*K, 0.04, 0.9], {pos: [X(7.5), 0, 0], color: 'blue'});
    s.tick15 = api.box([0.08, 0.7, 0.08], {pos: [X(15), 0, 0], color: 'green'});
    s.call = api.label('', s.primes[5], {color: 'amber'});
    s.b = boards(api, {naive: 24, pos: [-5.6, 0, -6.4], mPos: [-1.2, 0, -6.4], ms: 2000,
      nLab: L('чисел в решётах в лоб', 'head-on numbers sieved'),
      nNote: function(v){ return v <= 8 ? L('решето до 8: ' + v, 'sieve to 8: ' + v) : L('до 8 + до 16: 8 + ' + (v - 8), 'to 8 + to 16: 8 + ' + (v - 8)); },
      mLab: L('чисел в одном решете', 'numbers in one sieve'), seq: [null, 15, 15],
      mNotes: ['', L('14,25 вверх до 15', '14.25 up to 15'), L('одно решето до 15', 'one sieve up to 15')]});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3;
    vis(s.qEnd, i === 0, true);
    vis(s.axis, i <= 2 || j === 2, i === 0);
    each(s.primes, function(t, k){
      var on = i === 1 || i === 2 || j === 2;
      vis(t, on, true, {delay: k*70});
      t.color(i === 1 ? (k < 4 ? 'red' : k === 5 ? 'amber' : 'plain') : j === 2 ? (k === 5 ? 'green' : k > 5 ? 'dim' : 'blue') : (k === 5 ? 'violet' : 'blue'), {delay: i === 1 && k >= 4 ? 900 : 0});
      t.lift(k === 5 && (i === 2 || j === 2) ? 0.25 : 0);
    });
    each(s.idx, function(t, k){ vis(t, i === 2, true, {delay: k*70}); });
    vis(s.r8, i === 1, true, {delay: 150});
    vis(s.r16, i === 1, true, {delay: 1000});
    each(s.gaps, function(a, k){ vis(a, i === 2, true, {delay: 300 + k*100}); });
    each(s.gapT, function(t, k){ vis(t, i === 2, true, {delay: 300 + k*100}); });
    vis(s.curve, i === 2, true, {delay: 400});
    vis(s.bar6, i === 2, true, {delay: 900});
    var w = j === 0 || j === 1;
    vis(s.walk, w, j === 0); vis(s.tick13, w, j === 0); vis(s.t13, w, j === 0);
    each(s.hops1, function(h, k){ vis(h, w, j === 0, {delay: 150 + k*160}); h.color(j === 1 ? 'dim' : 'amber'); });
    each(s.hops2, function(h, k){ vis(h, j === 1, true, {delay: 400 + k*160}); });
    vis(s.land1, w, j === 0, {delay: 1100}); s.land1.color(j === 1 ? 'dim' : 'red');
    vis(s.short, j === 0, true, {delay: 1300});
    vis(s.land2, j === 1, true, {delay: 1350});
    vis(s.range, j === 2, true, {delay: 200});
    vis(s.tick15, j === 2, true, {delay: 400});
    var txt = i === 1 ? L('до 16 шестое простое 13 нашлось', 'up to 16 the 6th prime, 13, turns up')
      : i === 2 ? L('ln 6 ≈ 1,79 — средний шаг около 6', 'ln 6 ≈ 1.79: the average step near 6')
      : j === 0 ? L('не дошли до 13', 'short of 13')
      : j === 1 ? L('6 · (1,79 + 0,58) = 14,25 → 15', '6 · (1.79 + 0.58) = 14.25 → 15')
      : j === 2 ? L('13 внутри решета до 15', '13 is inside the sieve up to 15') : '';
    s.call.to(i === 2 ? s.bar6 : j === 0 ? s.land1 : j === 1 ? s.land2 : s.primes[5]);
    s.call.setText(txt); s.call.color(j >= 1 ? 'green' : j === 0 ? 'red' : 'amber');
    s.call.show(!!txt, {delay: i === 1 ? 1300 : 900});
    runBoards(s.b, i, j === 2);
  }
});

/* ---------------- Prime number theorem: primes up to 100 ≈ 100 ÷ ln 100 ----------------
 * head-on: sieve to 100 = 104 cross-outs + 99 looks = 203, exact 25; the trick: 2 operations → 21.7 (13% short) */
reg({
  id: 'PrimeNumberTheorem',
  view: {yaw: 0.25, pitch: 0.8, fill: 0.88},
  build: function(api){
    var L = api.L, s = {};
    s.isP = function(n){ if(n < 2) return false; for(var d = 2; d*d <= n; d++) if(n % d === 0) return false; return true; };
    s.g = api.grid(10, 10, function(r, c){ return r*10 + c + 1; }, {pos: [0, 0, 0.6], gap: 0.6, size: 0.54, h: 0.1});
    s.gapA = [[11, 13], [13, 17], [17, 19]].map(function(p){ return api.arc(s.g.at(1, (p[0] - 1) % 10), s.g.at(1, (p[1] - 1) % 10), {color: 'violet', height: 0.4}); });
    s.G = [{x: -4.2, name: L('до 100', 'up to 100'), real: 25, g: 21.7, err: '13%'},
           {x: 0, name: L('до 10 000', 'up to 10,000'), real: 1229, g: 1086, err: '12%'},
           {x: 4.2, name: L('до 1 000 000', 'up to 1,000,000'), real: 78498, g: 72382, err: '8%'}];
    s.G.forEach(function(g){
      g.rb = api.tile(api.fmt(g.real), {pos: [g.x - 0.6, 0, 0], size: 1.05, h: 0.08, color: 'blue', face: 'front'});
      g.gb = api.tile(api.fmt(g.g, g.g < 100 ? 1 : 0), {pos: [g.x + 0.6, 0, 0], size: 1.05, h: 0.08, color: 'green', face: 'front'});
      g.t = api.text(g.name, [g.x, 0, 1.1], {size: 0.42, color: 'ink'});
      g.e = api.tile(g.err, {pos: [g.x, 0, 2.6], size: 1.3, h: 0.3, color: 'red'});
    });
    s.call = api.label('', s.G[0].gb, {color: 'green'});
    s.b = boards(api, {naive: 203, pos: [-11.0, 0, -1.6], mPos: [-11.0, 0, 3.4], ms: 2400,
      nLab: L('действий решета в лоб', 'head-on sieve operations'),
      nNote: function(v){ return v <= 104 ? L('вычеркнуто: ' + v, 'crossed out: ' + v) : L('104 вычёркивания + ' + (v - 104) + ' просмотров', '104 cross-outs + ' + (v - 104) + ' looks'); },
      mLab: L('действия по формуле', 'operations by formula'), seq: [2, 2],
      mNotes: [L('ln 100 и одно деление', 'ln 100 and one division'), L('по 2 на каждую границу', '2 for each limit')]});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3;
    s.g.each(function(t, k){
      var p = s.isP(k + 1);
      t.color(i === 1 ? (p ? 'green' : 'red') : i === 2 ? (p ? 'violet' : 'dim') : 'plain', {delay: i === 1 ? 100 + k*14 : 0});
      t.strike(i === 1 && !p && k > 0, {delay: i === 1 ? 100 + k*14 : 0});
    });
    vis(s.g, i <= 2, true);
    each(s.gapA, function(a, k){ vis(a, i === 2, true, {delay: 300 + k*200}); });
    s.G.forEach(function(g, k){
      var on = j === 1 || (j === 0 && k === 0), d = j === 1 ? k*250 : 0;
      vis(g.rb, on, true, {delay: d}); vis(g.gb, on, true, {delay: d + 120}); vis(g.t, on, true, {delay: d});
      g.rb.height(on ? 2.4 : 0.08, {delay: d, ms: 600});
      g.gb.height(on ? 2.4*g.g/g.real : 0.08, {delay: d + 120, ms: 600});
      vis(g.e, on, true, {delay: 700 + k*300});
      g.e.color(k === 2 ? 'green' : 'red');
    });
    var txt = i === 1 ? L('зелёные — простые, красные — вычеркнуты', 'green: prime; red: crossed out')
      : i === 2 ? L('до 100 простые идут примерно через 4,61', 'up to 100, primes come about every 4.61')
      : j === 0 ? L('синий — точно, зелёный — оценка', 'blue: exact; green: estimate')
      : j === 1 ? L('ошибка падает с ростом границы', 'the error shrinks as the limit grows') : '';
    s.call.to(i === 1 ? s.g.at(9, 9) : i === 2 ? s.g.at(1, 6) : j === 1 ? s.G[2].e : s.G[0].gb);
    s.call.setText(txt); s.call.color(i === 2 ? 'violet' : j === 1 ? 'green' : i === 1 ? 'ink' : 'green');
    s.call.show(!!txt, {delay: i === 1 ? 1600 : 800});
    runBoards(s.b, i, j === 1);
  }
});

/* ---------------- Divisor count formula: τ(36) = 3 × 3 = 9 ----------------
 * head-on: 36 checks; the trick: 5 divisions (36 = 2²·3²) + 2 additions + 1 multiplication = 8 operations */
reg({
  id: 'DivisorCountFormula',
  view: {yaw: 0.3, pitch: 1.0, fill: 0.86},
  build: function(api){
    var L = api.L, s = {};
    s.big = api.tile(36, {pos: [0, 0, -3.4], size: 1.5, h: 0.5, color: 'ink'});
    s.g = api.grid(6, 6, function(r, c){ return r*6 + c + 1; }, {pos: [5.8, 0, 0.6], gap: 0.72, size: 0.6, h: 0.2});
    s.divB = [['36 ÷ 2 = 18', 'green'], ['18 ÷ 2 = 9', 'green'], [L('9 ÷ 2 — нет', '9 ÷ 2: no'), 'red'], ['9 ÷ 3 = 3', 'green'], ['3 ÷ 3 = 1', 'green']].map(function(b, k){
      return api.badge(b[0], {pos: k < 3 ? [-3.2 + k*3.0, 0, -6.0] : [-1.7 + (k - 3)*3.0, 0, -5.2], color: b[1]}); });
    s.two = ['2⁰=1', '2¹=2', '2²=4'].map(function(v, k){ return api.tile(v, {pos: [-4.4 + k*1.1, 0, -1.2], size: 1.0, h: 0.3, color: 'blue'}); });
    s.three = ['3⁰=1', '3¹=3', '3²=9'].map(function(v, k){ return api.tile(v, {pos: [1.85 + k*1.1, 0, -1.2], size: 1.0, h: 0.3, color: 'red'}); });
    var vals = [[1, 3, 9], [2, 6, 18], [4, 12, 36]];
    s.cells = [];
    for(var r = 0; r < 3; r++) for(var c = 0; c < 3; c++) s.cells.push(api.tile(vals[r][c], {pos: [0.1 + c*1.1, 0, 0.1 + r*1.1], size: 1.0, h: 0.3, color: 'green'}));
    s.call = api.label('', s.big, {color: 'violet'});
    s.b = boards(api, {naive: 36, pos: [-6.4, 0, -3.2], mPos: [-6.6, 0, 1.2], ms: 2000,
      nLab: L('проверок в лоб', 'head-on checks'),
      nNote: function(v){ return L('36 ÷ d для d = 1…' + Math.max(1, v), '36 ÷ d for d = 1…' + Math.max(1, v)); },
      mLab: L('действий по формуле', 'operations by formula'), seq: [5, 7, 8],
      mNotes: [L('5 делений', '5 divisions'), L('+ 2 сложения', '+ 2 additions'), L('+ 1 умножение', '+ 1 multiplication')]});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3;
    s.g.each(function(t, k){ var n = k + 1; t.color(36 % n ? 'red' : 'green', {delay: 200 + k*45}); });
    vis(s.g, i === 1, true);
    s.big.color(j === 2 ? 'green' : i === 2 ? 'violet' : 'ink', {delay: j === 2 ? 1400 : 0});
    s.big.lift(i === 0 ? 0.3 : 0);
    each(s.divB, function(b, k){ vis(b, j >= 0, j === 0, {delay: 200 + k*250}); });
    each(s.two, function(t, k){
      vis(t, i === 2 || j >= 1, true, {delay: 300 + k*150});
      t.moveTo(j === 2 ? [-1.0, 0, 0.1 + k*1.1] : [-4.4 + k*1.1, 0, -1.2], {ms: 650});
    });
    each(s.three, function(t, k){
      vis(t, i === 2 || j >= 1, true, {delay: 600 + k*150});
      t.moveTo(j === 2 ? [0.1 + k*1.1, 0, -1.0] : [1.85 + k*1.1, 0, -1.2], {ms: 650});
    });
    each(s.cells, function(t, k){ vis(t, j === 2, true, {delay: 600 + k*110}); });
    var txt = i === 1 ? L('зелёные — делители 36', 'green: divisors of 36')
      : i === 2 ? L('36 = 2 · 2 · 3 · 3', '36 = 2 · 2 · 3 · 3')
      : j === 0 ? L('36 = 2² · 3²', '36 = 2² · 3²')
      : j === 1 ? L('3 варианта у двойки, 3 у тройки', '3 choices for the 2, 3 for the 3')
      : j === 2 ? L('3 × 3 = 9 делителей', '3 × 3 = 9 divisors') : '';
    s.call.to(i === 1 ? s.g.at(5, 5) : j === 1 ? s.two[2] : j === 2 ? s.cells[8] : s.big);
    s.call.setText(txt); s.call.color(i === 1 || j === 2 ? 'green' : 'violet');
    s.call.show(!!txt, {delay: i === 1 ? 1900 : 900});
    runBoards(s.b, i, j === 2);
  }
});

/* ---------------- Multiplicative function: τ(20) = τ(4) · τ(5) ----------------
 * head-on: 20 checks; the trick: 4 checks for 4 + 5 for 5 + 1 multiplication = 10 */
reg({
  id: 'MultiplicativeFunction',
  view: {yaw: 0.3, pitch: 1.0, fill: 0.86},
  build: function(api){
    var L = api.L, s = {};
    s.big = api.tile(20, {pos: [0, 0, -4.4], size: 1.3, h: 0.45, color: 'ink'});
    s.f4 = api.tile(4, {pos: [-1.2, 0, -3.0], size: 1.0, h: 0.35, color: 'blue'});
    s.f5 = api.tile(5, {pos: [1.2, 0, -3.0], size: 1.0, h: 0.35, color: 'green'});
    s.times = api.text('×', [0, 0, -3.0], {size: 0.6, color: 'ink'});
    s.g = api.grid(4, 5, function(r, c){ return r*5 + c + 1; }, {pos: [5.8, 0, -1.4], gap: 0.75, size: 0.62, h: 0.2});
    s.p2 = api.tile('2·2', {pos: [-1.2, 0, -1.8], size: 0.8, h: 0.25, color: 'blue'});
    s.p5 = api.tile(5, {pos: [1.2, 0, -1.8], size: 0.8, h: 0.25, color: 'green'});
    s.c4 = [1, 2, 3, 4].map(function(d, k){ return api.badge('4÷' + d, {pos: [-4.6 + k*1.2, 0, -0.4], color: 4 % d ? 'red' : 'green'}); });
    s.c5 = [1, 2, 3, 4, 5].map(function(d, k){ return api.badge('5÷' + d, {pos: [1.0 + k*1.2, 0, -0.4], color: 5 % d ? 'red' : 'green'}); });
    var vals = [[1, 5], [2, 10], [4, 20]];
    s.cells = [];
    for(var r = 0; r < 3; r++) for(var c = 0; c < 2; c++) s.cells.push(api.tile(vals[r][c], {pos: [-0.55 + c*1.1, 0, 1.0 + r*1.1], size: 1.0, h: 0.3, color: 'green'}));
    s.rows = [1, 2, 4].map(function(v, r){ return api.text(String(v), [-1.85, 0, 1.0 + r*1.1], {size: 0.5, color: 'blue'}); });
    s.cols = [1, 5].map(function(v, c){ return api.text(String(v), [-0.55 + c*1.1, 0, -0.1], {size: 0.5, color: 'green'}); });
    s.call = api.label('', s.big, {color: 'violet'});
    s.b = boards(api, {naive: 20, pos: [-6.4, 0, -4.4], mPos: [-6.4, 0, 2.4], ms: 1800,
      nLab: L('проверок в лоб', 'head-on checks'),
      nNote: function(v){ return L('20 ÷ d для d = 1…' + Math.max(1, v), '20 ÷ d for d = 1…' + Math.max(1, v)); },
      mLab: L('действий по частям', 'operations by parts'), seq: [4, 9, 10],
      mNotes: [L('4 проверки для 4', '4 checks for 4'), L('+ 5 проверок для 5', '+ 5 checks for 5'), L('+ 1 умножение 3 × 2', '+ 1 multiplication 3 × 2')]});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3;
    s.g.each(function(t, k){ var n = k + 1; t.color(20 % n ? 'red' : 'green', {delay: 200 + k*75}); });
    vis(s.g, i === 1, true);
    vis(s.p2, i === 2, true, {delay: 200}); vis(s.p5, i === 2, true, {delay: 350});
    each(s.c4, function(b, k){ vis(b, j >= 0 && j < 2, j === 0, {delay: 200 + k*150}); });
    each(s.c5, function(b, k){ vis(b, j === 1, true, {delay: 200 + k*150}); });
    each(s.cells, function(t, k){ vis(t, j === 2, true, {delay: 400 + k*130}); });
    each(s.rows, function(t, k){ vis(t, j === 2, true, {delay: k*120}); });
    each(s.cols, function(t, k){ vis(t, j === 2, true, {delay: 300 + k*120}); });
    s.big.color(j === 2 ? 'green' : 'ink', {delay: j === 2 ? 1100 : 0});
    s.f4.color(i === 2 ? 'violet' : 'blue'); s.f5.color(i === 2 ? 'violet' : 'green');
    var txt = i === 1 ? L('зелёные — делители 20', 'green: divisors of 20')
      : i === 2 ? L('общих простых множителей нет', 'no shared prime factors')
      : j === 0 ? L('делители 4: 1, 2, 4 — их 3', 'divisors of 4: 1, 2, 4 — three')
      : j === 1 ? L('делители 5: 1 и 5 — их 2', 'divisors of 5: 1 and 5 — two')
      : j === 2 ? L('3 × 2 = 6 делителей у 20', '3 × 2 = 6 divisors of 20') : '';
    s.call.to(i === 1 ? s.g.at(3, 4) : i === 2 ? s.p5 : j === 0 ? s.c4[3] : j === 1 ? s.c5[4] : s.cells[5]);
    s.call.setText(txt); s.call.color(i === 1 || j === 2 ? 'green' : 'violet');
    s.call.show(!!txt, {delay: i === 1 ? 1800 : 800});
    runBoards(s.b, i, j === 2);
  }
});

/* ---------------- Integer overflow: 120 × 45 ÷ 15 in a 3-digit cell ----------------
 * head-on: 5400 has 4 digits, 400 stays, 400 ÷ 15 = 26.7; the trick: 120 ÷ 15 = 8, 8 × 45 = 360 (3 digits) */
reg({
  id: 'IntegerOverflowAvoidance',
  view: {yaw: 0.2, pitch: 1.0, fill: 0.84},
  build: function(api){
    var L = api.L, s = {};
    s.head = api.text('120 × 45 ÷ 15 = ?', [0, 0, -3.0], {size: 0.62, color: 'ink'});
    s.line = api.text('', [0, 0, -1.9], {size: 0.5, color: 'red'});
    s.frame = api.box([3.6, 0.08, 1.4], {pos: [0.5, 0, 0], color: 'teal'});
    s.slots = [-0.7, 0.5, 1.7].map(function(x){ return api.tile('', {pos: [x, 0.08, 0], size: 1.0, h: 0.35}); });
    s.over = api.tile(5, {pos: [-2.3, 0, 0], size: 1.0, h: 0.35, color: 'red'});
    s.cap = api.text(L('ячейка на 3 цифры: до 999', 'a 3-digit cell: up to 999'), [0.5, 0, 1.2], {size: 0.4, color: 'teal'});
    s.call = api.text('', [0.5, 0, 2.3], {size: 0.46, color: 'red'});
    s.b = boards(api, {naive: 4, pos: [6.0, 0, -0.4], mPos: [6.0, 0, -3.8], ms: 900, d0: 600,
      nLab: L('цифр в самом большом числе в лоб', 'digits in the biggest number, head-on'),
      nNote: '120 × 45 = 5400',
      mLab: L('цифр, если делить первым', 'digits when dividing first'), seq: [1, 3],
      mNotes: ['120 ÷ 15 = 8', '8 × 45 = 360']});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3;
    var digits = [['', '', ''], ['4', '0', '0'], ['', '', '8'], ['', '', '8'], ['3', '6', '0']][i];
    s.head.setText(j === 1 ? '120 × 45 ÷ 15 = 360' : '120 × 45 ÷ 15 = ?');
    s.head.color(j === 1 ? 'green' : 'ink');
    s.line.setText(['', '120 × 45 = 5400', '120 = 15 × 8', '120 ÷ 15 = 8', '8 × 45 = 360'][i]);
    s.line.color(['ink', 'red', 'violet', 'ink', 'green'][i]);
    vis(s.line, i >= 1, true);
    each(s.slots, function(t, k){
      var d = 200 + k*150;
      t.setText(digits[k], {delay: d});
      t.color(i === 1 ? 'red' : i === 2 ? (digits[k] ? 'violet' : 'dim') : digits[k] ? 'green' : 'dim', {delay: d});
      t.lift(j === 1 ? 0.25 : 0, {delay: d});
    });
    vis(s.over, i === 1, true, {delay: 300});
    s.over.lift(i === 1 ? 0.35 : 0, {delay: 300});
    var txt = i === 1 ? L('старшая 5 не поместилась: 400 ÷ 15 = 26,7, а не 360', 'the leading 5 did not fit: 400 ÷ 15 = 26.7, not 360')
      : j === 1 ? L('проверка: 5400 ÷ 15 = 360', 'check: 5400 ÷ 15 = 360') : '';
    s.call.setText(txt); s.call.color(j === 1 ? 'green' : 'red');
    vis(s.call, !!txt, true, {delay: 700});
    runBoards(s.b, i, j === 1);
  }
});

/* ---------------- Explicit stack: steps to A along D → C → B → A ----------------
 * head-on: 4 questions waiting inside each other; the trick: push D, C, B on our own stack, pop and add 1 */
reg({
  id: 'ExplicitStackRecursion',
  view: {yaw: 0.35, pitch: 0.8, fill: 0.86},
  build: function(api){
    var L = api.L, s = {}, X = [-2.7, -0.9, 0.9, 2.7], names = ['D', 'C', 'B', 'A'];
    s.st = names.map(function(n, k){ return api.tile(n, {pos: [X[k], 0, -2.6], size: 1.0, h: 0.4}); });
    s.ans = names.map(function(n, k){ return api.tile(k === 3 ? 0 : '?', {pos: [X[k], 0, -1.5], size: 0.8, h: 0.2, color: k === 3 ? 'green' : 'plain'}); });
    s.arr = [0, 1, 2].map(function(k){ return api.arrow([X[k] + 0.55, 0.2, -2.6], [X[k + 1] - 0.55, 0.2, -2.6], {color: 'ink'}); });
    s.ansT = api.text(L('шагов до A', 'steps to A'), [-3.4, 0, -1.5], {size: 0.36, color: 'green', align: 'right'});
    s.frames = api.stack(['D', 'C', 'B', 'A'], {pos: [4.8, 0, 2.2], size: 1.1, h: 0.6, gap: 0.06, color: 'red'});
    s.stack = api.stack(['D', 'C', 'B'], {pos: [0, 0, 2.0], size: 1.2, h: 0.6, gap: 0.08, color: 'violet'});
    s.base = api.tile('', {pos: [0, 0, 2.0], size: 1.4, h: 0.02, color: 'teal'});
    s.call = api.label('', s.base, {color: 'violet'});
    s.b = boards(api, {naive: 4, pos: [-6.6, 0, 0.8], mPos: [-6.8, 0, -3.4], ms: 1400,
      nLab: L('вопросов ждут сразу в лоб', 'questions waiting at once, head-on'),
      nNote: function(v){ return ['', 'D', 'D, C', 'D, C, B', 'D, C, B, A'][Math.max(0, Math.min(4, v))]; },
      mLab: L('вопросов открыто со стопкой', 'questions open with the stack'), seq: [1, 1, 1],
      mNotes: [L('в стопке D, C, B', 'on the stack: D, C, B'), L('стопка разбирается', 'the stack empties'), L('1 вопрос вместо 4', '1 question instead of 4')]});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3, answers = ['3', '2', '1', '0'];
    each(s.st, function(t, k){ t.color(k === 3 ? 'green' : i === 1 ? 'red' : j === 0 || j === 1 ? 'violet' : j === 2 ? 'green' : 'plain', {delay: i === 1 || j === 0 ? k*250 : 0}); t.lift(j === 2 && k === 0 ? 0.3 : 0); });
    each(s.ans, function(t, k){
      if(k === 3) return;
      var filled = j >= 1, d = j === 1 ? 400 + (2 - k)*450 : 0;
      t.setText(filled ? answers[k] : '?', {delay: d});
      t.color(filled ? 'green' : 'plain', {delay: d});
    });
    s.frames.each(function(t, k){ vis(t, i === 1, true, {delay: 200 + k*350}); });
    s.stack.each(function(t, k){
      if(j === 1){ t.show(true); t.color('green'); t.fadeOut({delay: 400 + (2 - k)*450}); }
      else { vis(t, j === 0, true, {delay: k*300}); t.color('violet'); }
    });
    vis(s.base, i === 2 || j === 0 || j === 1, true);
    s.base.color(i === 2 ? 'violet' : 'teal');
    var txt = i === 1 ? L('4 вопроса ждут ответа один в другом', '4 questions wait, one inside another')
      : i === 2 ? L('своя стопка — кладём и снимаем сверху', 'our own stack: put on and take off the top')
      : j === 0 ? L('сверху B — его снимем первым', 'B is on top: it comes off first')
      : j === 1 ? L('B: 0 + 1, C: 1 + 1, D: 2 + 1', 'B: 0 + 1, C: 1 + 1, D: 2 + 1')
      : j === 2 ? L('D = 3, C = 2, B = 1', 'D = 3, C = 2, B = 1') : '';
    s.call.to(i === 1 ? s.frames.at(3) : j === 0 ? s.stack.at(2) : j >= 1 ? s.ans[0] : s.base);
    s.call.setText(txt); s.call.color(i === 1 ? 'red' : j >= 1 ? 'green' : 'violet');
    s.call.show(!!txt, {delay: i === 1 ? 1600 : 900});
    runBoards(s.b, i, j === 2);
  }
});

/* ---------------- Sparse set: clear a row of 12 cells, 3 in use ----------------
 * head-on: wipe all 12; the trick: 3 notes in a list while writing + 3 wipes by the list = 6 */
reg({
  id: 'SparseSet',
  view: {yaw: 0.08, pitch: 1.0, fill: 0.9},
  build: function(api){
    var L = api.L, s = {}, idx = [];
    s.used = [2, 6, 9];
    for(var k = 0; k < 12; k++) idx.push(k);
    s.buf = api.row(idx, {gap: 1.05, size: 0.9, h: 0.3});
    s.br = api.bracket(s.buf.at(0), s.buf.at(11), {color: 'ink', text: L('12 ячеек', '12 cells'), dz: 0.75});
    s.marks = s.buf.items.map(function(t, k){ return api.marks(t, [{text: '=0', color: s.used.indexOf(k) >= 0 ? 'green' : 'red'}], {gap: 0.5}); });
    s.ros = api.row(s.used, {gap: 1.05, pos: [0, 0, 3.2], size: 0.9, h: 0.35, color: 'violet'});
    s.links = s.used.map(function(u, k){ return api.arrow(s.ros.at(k), s.buf.at(u), {color: 'violet', bend: 0.6}); });
    s.call = api.label('', s.ros.at(1), {color: 'violet'});
    s.b = boards(api, {naive: 12, pos: [-6.0, 0, 3.4], mPos: [6.0, 0, 3.4], ms: 1800,
      nLab: L('обнулений в лоб', 'head-on wipes'),
      nNote: function(v){ return L('ячейки 0…' + Math.max(0, v - 1), 'cells 0…' + Math.max(0, v - 1)); },
      mLab: L('действий со списком', 'operations with the list'), seq: [3, 6],
      mNotes: [L('3 отметки в списке', '3 notes in the list'), L('+ 3 обнуления по списку', '+ 3 wipes by the list')]});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3;
    s.buf.each(function(t, k){
      var w = s.used.indexOf(k) >= 0, col = w ? 'blue' : 'plain', d = 0;
      if(i === 1){ col = w ? 'blue' : 'red'; d = 200 + k*130; }
      if(i === 2) col = w ? 'violet' : 'dim';
      if(j === 1){ col = w ? 'green' : 'dim'; d = w ? 300 + s.used.indexOf(k)*300 : 0; }
      t.color(col, {delay: d}); t.lift(j === 1 && w ? 0.25 : 0, {delay: d});
    });
    each(s.marks, function(m, k){ if(i === 1) m.show(1, {delay: 200 + k*130}); else m.show(0); });
    vis(s.br, i <= 1, true);
    vis(s.ros, i >= 2, i === 2, {delay: 100});
    each(s.links, function(l, k){ vis(l, i >= 2, i === 2 || j === 1, {delay: 300 + k*300}); l.color(j === 1 ? 'green' : 'violet'); });
    var txt = i === 1 ? L('красная =0 — обнулили пустую ячейку', 'red =0: an empty cell wiped for nothing')
      : i === 2 ? L('короткий список номеров записанных ячеек', 'a short list of the cells in use')
      : j === 0 ? L('в списке 3 номера', '3 numbers in the list')
      : j === 1 ? L('9 пустых ячеек не тронуты', 'the 9 empty cells are untouched') : '';
    s.call.to(i === 1 ? s.buf.at(0) : j === 1 ? s.buf.at(4) : s.ros.at(1));
    s.call.setText(txt); s.call.color(i === 1 ? 'red' : j === 1 ? 'green' : 'violet');
    s.call.show(!!txt, {delay: i === 1 ? 1900 : 700});
    runBoards(s.b, i, j === 1);
  }
});

/* ---------------- Miller–Rabin: is 25 prime? ----------------
 * head-on: 25 ÷ 2, 3, 4, 5 = 4 divisions; the trick: 24 = 3 · 2³, 2³ = 8 (2 multiplications), squares 8 → 14 → 21
 * (2 more) = 4; neither 1 nor 24 appeared → composite */
reg({
  id: 'MillerRabinPrimalityTest',
  view: {yaw: 0.25, pitch: 1.0, fill: 0.86},
  build: function(api){
    var L = api.L, s = {}, X = [-2.4, 0, 2.4];
    s.n = api.tile(25, {pos: [0, 0, -3.6], size: 1.4, h: 0.5, color: 'ink'});
    s.tr = api.row([2, 3, 4, 5], {pos: [4.8, 0, -3.6], gap: 1.45, size: 0.8, h: 0.25});
    s.trm = s.tr.items.map(function(t, k){ return api.marks(t, [{text: '25÷' + (k + 2), color: k === 3 ? 'green' : 'red'}], {dir: 'front', gap: 0.5}); });
    s.ex = [api.tile(8, {pos: [-1.2, 0, 1.5], size: 1.0, h: 0.35, color: 'violet'}), api.tile(12, {pos: [1.2, 0, 1.5], size: 1.0, h: 0.35, color: 'violet'})];
    s.exA = api.arrow([-0.6, 0.2, 1.5], [0.6, 0.2, 1.5], {color: 'violet', bend: 0.5});
    s.m1 = api.tile(24, {pos: [-2.4, 0, -1.0], size: 1.0, h: 0.35, color: 'plain'});
    s.eq = api.text('=', [-1.2, 0, -1.0], {size: 0.55, color: 'ink'});
    s.d = api.tile(3, {pos: [0, 0, -1.0], size: 1.0, h: 0.35, color: 'violet'});
    s.tm = api.text('×', [1.2, 0, -1.0], {size: 0.55, color: 'ink'});
    s.p = api.tile('2³', {pos: [2.4, 0, -1.0], size: 1.0, h: 0.35, color: 'teal'});
    s.ch = [8, 14, 21].map(function(v, k){ return api.tile(v, {pos: [X[k], 0, 1.5], size: 1.0, h: 0.35, color: 'red'}); });
    s.ft = ['2³', '8²', '14²'].map(function(f, k){ return api.text(f, [X[k], 0, 2.35], {size: 0.36, color: 'ink'}); });
    s.sq = [0, 1].map(function(k){ return api.arrow([X[k] + 0.6, 0.2, 1.5], [X[k + 1] - 0.6, 0.2, 1.5], {color: 'red', bend: 0.5}); });
    s.tg = [api.tile(1, {pos: [-1.0, 0, 3.6], size: 0.8, h: 0.25, color: 'amber'}), api.tile(24, {pos: [1.0, 0, 3.6], size: 0.8, h: 0.25, color: 'amber'})];
    s.call = api.label('', s.n, {color: 'violet'});
    s.b = boards(api, {naive: 4, pos: [-6.2, 0, -3.4], mPos: [-6.6, 0, 0.6], ms: 1400,
      nLab: L('делений в лоб', 'head-on divisions'),
      nNote: function(v){ return L('делили на ', 'divided by ') + [2, 3, 4, 5].slice(0, Math.max(1, v)).join(', '); },
      mLab: L('умножений с остатком', 'multiplications with remainder'), seq: [0, 4, 4],
      mNotes: [L('разложение — без умножений', 'the split needs no multiplications'), L('2 умножения + 2 квадрата', '2 multiplications + 2 squarings'), L('4 умножения', '4 multiplications')]});
    return s;
  },
  step: function(api, s, i){
    var L = api.L, j = i - 3;
    s.tr.each(function(t, k){ t.color(k === 3 ? 'green' : 'red', {delay: 200 + k*350}); });
    vis(s.tr, i === 1, true);
    each(s.trm, function(m, k){ if(i === 1) m.show(1, {delay: 200 + k*350}); else m.show(0); });
    each(s.ex, function(t, k){ vis(t, i === 2, true, {delay: 200 + k*400}); });
    vis(s.exA, i === 2, true, {delay: 400});
    [s.m1, s.eq, s.d, s.tm, s.p].forEach(function(t, k){ vis(t, j >= 0, j === 0, {delay: k*150}); });
    [s.m1, s.d, s.p].forEach(function(t, k){ t.color(j >= 1 ? 'dim' : ['plain', 'violet', 'teal'][k]); });
    each(s.ch, function(t, k){ vis(t, j >= 1, j === 1, {delay: k*500}); });
    each(s.ft, function(t, k){ vis(t, j >= 1, j === 1, {delay: k*500}); });
    each(s.sq, function(a, k){ vis(a, j >= 1, j === 1, {delay: 250 + k*500}); });
    each(s.tg, function(t){ vis(t, j >= 1, j === 1, {delay: 1300}); t.strike(j === 2); });
    s.n.color(j === 2 ? 'red' : 'ink', {delay: j === 2 ? 500 : 0});
    var txt = i === 2 ? L('у простого 13: 2³ = 8, 8 · 8 = 64, остаток 12 = 13 − 1', 'for the prime 13: 2³ = 8, 8 · 8 = 64, remainder 12 = 13 − 1')
      : j === 0 ? L('нечётная часть 3 и три двойки', 'odd part 3 and three 2s')
      : j === 1 ? L('остатки от деления на 25; ждём 1 или 24', 'remainders after dividing by 25; we want 1 or 24')
      : j === 2 ? L('ни 1, ни 24 — 25 составное', 'no 1 and no 24: 25 is not prime') : '';
    s.call.to(i === 2 ? s.ex[1] : j === 0 ? s.d : j === 1 ? s.ch[2] : s.n);
    s.call.setText(txt); s.call.color(j === 2 ? 'red' : 'violet');
    s.call.show(!!txt, {delay: 900});
    runBoards(s.b, i, j === 2);
  }
});
})();

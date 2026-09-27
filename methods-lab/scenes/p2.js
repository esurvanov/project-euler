/*
 * scenes/p2.js — digits, bases and remainders (see SCENE_API.md §13, NARRATIVE.md).
 * DigitalInvariantBound · PositionalNotation · BigIntegerArithmetic · CrossMultiplication ·
 * FastExponentiation · ModularArithmetic · ModularInverseFermat · BatchInversion ·
 * DayOfWeekFormula · LehmerCode · CycleDetectionViaRemainders · PalindromeCheck ·
 * PandigitalCheck · ChampernowneConstant · DigitSumDivisibilityRule
 * Every scene tells the story of stories/<Id>.json: task → head-on → what we notice → how we solve.
 * Captions are the story sentences (ST below is generated from stories/<Id>.json — keep them equal).
 */
(function(){
'use strict';
if(!window.LAB || !LAB.register) return;
var pl = LAB.plural;

/* ---------- story sentences (generated from stories/<Id>.json) ---------- */
var ST = {
"DigitalInvariantBound": {
"ru": {
"task": "370 = 3³ + 7³ + 0³ = 27 + 343 + 0: число равно сумме кубов своих цифр. Нужно найти все такие числа — но до какого числа искать?",
"headOn": "В лоб: проверяем числа 1, 2, 3, … подряд. Где остановиться, непонятно — перебор никогда не кончается.",
"notice": "Самый большой куб одной цифры — 9³ = 729. Поэтому у числа из k цифр сумма кубов не больше k × 729: с каждой новой цифрой она растёт всего на 729, а само число — в 10 раз.",
"steps": [
"Потолок суммы кубов: у 1 цифры — 729, у 2 — 1458, у 3 — 2187, у 4 — 2916, у 5 — 3645.",
"Самое маленькое число из k цифр: 1, 10, 100, 1000, 10 000.",
"У пяти цифр самое маленькое число 10 000 уже больше потолка 3645 — такие числа не подходят. Искать нужно только среди чисел меньше 10 000."
]
},
"en": {
"task": "370 = 3³ + 7³ + 0³ = 27 + 343 + 0: the number equals the sum of the cubes of its digits. We want all such numbers — but how far do we have to search?",
"headOn": "Head-on: check 1, 2, 3, … one after another. There is no obvious place to stop, so the search never ends.",
"notice": "The biggest cube of a single digit is 9³ = 729. So for a number with k digits the sum of cubes is at most k × 729: each extra digit adds only 729 to it, while the number itself grows tenfold.",
"steps": [
"Ceiling of the sum of cubes: 1 digit — 729, 2 digits — 1458, 3 — 2187, 4 — 2916, 5 — 3645.",
"The smallest number with k digits: 1, 10, 100, 1000, 10,000.",
"With five digits even the smallest number, 10,000, is already above the ceiling of 3645 — none of them can work. We only need to search below 10,000."
]
},
"tags": {
"ru": [
"потолок",
"наименьшее",
"граница"
],
"en": [
"ceiling",
"smallest",
"bound"
]
}
},
"PositionalNotation": {
"ru": {
"task": "Есть 29 фишек. Нужно записать это количество как можно короче.",
"headOn": "В лоб: рисуем по палочке на каждую фишку — 29 палочек. Чем больше фишек, тем длиннее запись.",
"notice": "Фишки можно собирать в группы: 10 фишек заменить одним знаком на месте левее. Каждое место левее весит в 10 раз больше — так устроены обычные цифры.",
"steps": [
"Группами по 10: две полные десятки и ещё 9 фишек — пишем 29, всего 2 знака.",
"Группами по 16, 8, 4, 2, 1 (каждая вдвое меньше): 29 = 16 + 8 + 4 + 1, группы 2 нет — пишем 11101, 5 знаков.",
"Веса мест могут расти и по-разному, например 24, 6, 2, 1: 29 = 1 · 24 + 0 · 6 + 2 · 2 + 1 · 1 — запись 1021."
]
},
"en": {
"task": "There are 29 counters. Write down how many there are as briefly as possible.",
"headOn": "Head-on: draw one stick for each counter — 29 sticks. The more counters, the longer the record.",
"notice": "Counters can be grouped: 10 counters are replaced by one sign in the place to the left. Each place to the left is worth 10 times more — that is how ordinary digits work.",
"steps": [
"In groups of 10: two full tens and 9 more counters — we write 29, just 2 signs.",
"In groups of 16, 8, 4, 2, 1 (each half the one before): 29 = 16 + 8 + 4 + 1, there is no group of 2 — we write 11101, 5 signs.",
"Place weights can also grow unevenly, say 24, 6, 2, 1: 29 = 1 · 24 + 0 · 6 + 2 · 2 + 1 · 1 — written 1021."
]
},
"tags": {
"ru": [
"по 10",
"по 2",
"свои веса"
],
"en": [
"tens",
"twos",
"own weights"
]
}
},
"BigIntegerArithmetic": {
"ru": {
"task": "Нужно сложить два 25-значных числа: 4839201746582930174658293 и 5270918364529173820465718.",
"headOn": "В лоб: кладём каждое число в одну ячейку памяти компьютера. Но ячейка вмещает только 19 цифр — 6 старших цифр не помещаются, и ответ выйдет неверным.",
"notice": "Число можно хранить по одной цифре в ячейке и складывать, как учат в школе: столбиком, справа налево, перенося лишний десяток в соседний столбец.",
"steps": [
"Справа налево: 3 + 8 = 11 — пишем 1, 1 переносим; 9 + 1 + 1 = 11; 2 + 7 + 1 = 10 — пишем 0, 1 переносим.",
"Так проходим все 25 столбцов: получается сумма из 26 цифр, и ни одна цифра не потеряна."
]
},
"en": {
"task": "Add two 25-digit numbers: 4839201746582930174658293 and 5270918364529173820465718.",
"headOn": "Head-on: put each number into one memory cell of the computer. But a cell holds only 19 digits — the 6 leading digits do not fit, and the answer comes out wrong.",
"notice": "A number can be stored one digit per cell and added the way we learn at school: in columns, right to left, carrying the extra ten into the next column.",
"steps": [
"Right to left: 3 + 8 = 11 — write 1, carry 1; 9 + 1 + 1 = 11; 2 + 7 + 1 = 10 — write 0, carry 1.",
"Go through all 25 columns like this: the sum has 26 digits, and not one digit is lost."
]
},
"tags": {
"ru": [
"столбцы",
"все 25"
],
"en": [
"columns",
"all 25"
]
}
},
"CrossMultiplication": {
"ru": {
"task": "Какая дробь больше: 3/7 или 4/9?",
"headOn": "В лоб: делим. 3 ÷ 7 = 0,428571…, 4 ÷ 9 = 0,4444… — дроби бесконечные. Если округлить до одного знака, обе станут 0,4, и покажется, что они равны.",
"notice": "3/7 < 4/9 ровно тогда, когда 3 · 9 < 4 · 7: умножим обе дроби на 7 · 9, и знаменатели исчезнут. Останутся целые числа — их можно сравнить точно.",
"steps": [
"Каждый числитель умножаем на знаменатель другой дроби: 3 · 9 = 27 и 4 · 7 = 28.",
"27 < 28, значит 3/7 < 4/9 — точно, без всякого округления."
]
},
"en": {
"task": "Which fraction is bigger: 3/7 or 4/9?",
"headOn": "Head-on: divide. 3 ÷ 7 = 0.428571…, 4 ÷ 9 = 0.4444… — the decimals never end. Rounded to one place, both become 0.4, and they look equal.",
"notice": "3/7 < 4/9 exactly when 3 · 9 < 4 · 7: multiply both fractions by 7 · 9 and the bottoms disappear. What is left are whole numbers, and those compare exactly.",
"steps": [
"Multiply each top number by the bottom of the other fraction: 3 · 9 = 27 and 4 · 7 = 28.",
"27 < 28, so 3/7 < 4/9 — exactly, with no rounding at all."
]
},
"tags": {
"ru": [
"крест",
"ответ"
],
"en": [
"cross",
"answer"
]
}
},
"FastExponentiation": {
"ru": {
"task": "Нужно вычислить 3¹³ — перемножить 13 троек.",
"headOn": "В лоб: умножаем на 3 раз за разом: 3 · 3 · 3 · … — между 13 тройками 12 умножений.",
"notice": "Квадрат уже сосчитанного числа даёт степень вдвое больше: 3² · 3² = 3⁴, 3⁴ · 3⁴ = 3⁸. А 13 = 8 + 4 + 1, поэтому 3¹³ = 3⁸ · 3⁴ · 3.",
"steps": [
"Делим 13 пополам с остатком: 13 → 6 → 3 → 1. На каждой строке число возводим в квадрат: 3, 9, 81, 6561 — это 3 умножения.",
"Где показатель нечётный — 13, 3 и 1, — берём число строки в результат: 3, потом 3 · 81 = 243, потом 243 · 6561 = 1 594 323. Ещё 2 умножения."
]
},
"en": {
"task": "Work out 3¹³ — thirteen 3s multiplied together.",
"headOn": "Head-on: multiply by 3 again and again: 3 · 3 · 3 · … — 13 threes need 12 multiplications.",
"notice": "Squaring a power you already have doubles it: 3² · 3² = 3⁴, 3⁴ · 3⁴ = 3⁸. And 13 = 8 + 4 + 1, so 3¹³ = 3⁸ · 3⁴ · 3.",
"steps": [
"Halve 13, dropping the remainder: 13 → 6 → 3 → 1. On each row square the number: 3, 9, 81, 6561 — that is 3 multiplications.",
"Where the exponent is odd — 13, 3 and 1 — take that row's number into the result: 3, then 3 · 81 = 243, then 243 · 6561 = 1,594,323. Two more multiplications."
]
},
"tags": {
"ru": [
"квадраты",
"результат"
],
"en": [
"squares",
"result"
]
}
},
"ModularArithmetic": {
"ru": {
"task": "На циферблате 12 делений: 0, 1, …, 11. Стрелка стоит на 0. Где она остановится, если пройти 34 деления? А если 34 + 5? А если 34 × 5?",
"headOn": "В лоб: отсчитываем по одному делению — 34 шага, ещё 5 шагов, потом 34 × 5 = 170 шагов. Всего 209 шагов.",
"notice": "Полный круг из 12 делений возвращает стрелку на место. Значит, полные круги можно выбросить и оставить только остаток: 34 = 2 · 12 + 10 — стрелка на 10.",
"steps": [
"34 ÷ 12 = 2, остаток 10: два полных круга, стрелка на 10.",
"34 + 5: берём остаток 10 + 5 = 15; 15 = 12 + 3 — стрелка на 3.",
"34 × 5: берём 10 × 5 = 50; 50 = 4 · 12 + 2 — стрелка на 2. Проверка: 170 = 14 · 12 + 2, тоже 2."
]
},
"en": {
"task": "A dial has 12 marks: 0, 1, …, 11. The hand points at 0. Where does it stop after 34 marks? After 34 + 5? After 34 × 5?",
"headOn": "Head-on: count mark by mark — 34 steps, 5 more steps, then 34 × 5 = 170 steps. 209 steps in all.",
"notice": "A full turn of 12 marks brings the hand back to where it was. So full turns can be thrown away and only the remainder kept: 34 = 2 · 12 + 10 — the hand is at 10.",
"steps": [
"34 ÷ 12 = 2, remainder 10: two full turns, the hand is at 10.",
"34 + 5: take the remainder, 10 + 5 = 15; 15 = 12 + 3 — the hand is at 3.",
"34 × 5: take 10 × 5 = 50; 50 = 4 · 12 + 2 — the hand is at 2. Check: 170 = 14 · 12 + 2, also 2."
]
},
"tags": {
"ru": [
"34",
"+5",
"×5"
],
"en": [
"34",
"+5",
"×5"
]
}
},
"ModularInverseFermat": {
"ru": {
"task": "Остатки от деления на 7 — это числа 0…6. Нужно найти такое x, чтобы 3 · x давало остаток 1. Тогда вместо «разделить на 3» можно умножать на x.",
"headOn": "В лоб: пробуем x = 1, 2, 3, …: 3 · x даёт остатки 3, 6, 2, 5, 1. Нашли x = 5 за 5 проб, но для больших чисел проб будут миллиарды.",
"notice": "Теорема Ферма: раз 7 — простое число, 3⁶ даёт остаток 1 при делении на 7. А 3⁶ = 3 · 3⁵ — значит, x = 3⁵, и его можно просто вычислить.",
"steps": [
"Считаем 3⁵ квадратами и держим только остатки от деления на 7: 3² = 9 → 2; 3⁴ = 2 · 2 = 4; 3⁵ = 4 · 3 = 12 → 5. Три умножения.",
"Проверка: 3 · 5 = 15 = 2 · 7 + 1 — остаток 1. Ответ: x = 5."
]
},
"en": {
"task": "The remainders after dividing by 7 are the numbers 0…6. Find x such that 3 · x leaves remainder 1. Then instead of \"dividing by 3\" we can multiply by x.",
"headOn": "Head-on: try x = 1, 2, 3, …: 3 · x leaves remainders 3, 6, 2, 5, 1. We find x = 5 after 5 tries, but with big numbers it would take billions of tries.",
"notice": "Fermat's theorem: since 7 is a prime, 3⁶ leaves remainder 1 when divided by 7. And 3⁶ = 3 · 3⁵ — so x = 3⁵, and we can simply compute it.",
"steps": [
"Compute 3⁵ by squaring, keeping only remainders after dividing by 7: 3² = 9 → 2; 3⁴ = 2 · 2 = 4; 3⁵ = 4 · 3 = 12 → 5. Three multiplications.",
"Check: 3 · 5 = 15 = 2 · 7 + 1 — remainder 1. The answer is x = 5."
]
},
"tags": {
"ru": [
"квадраты",
"проверка"
],
"en": [
"squares",
"check"
]
}
},
"BatchInversion": {
"ru": {
"task": "Нужно найти обратные к 1!, 2!, 3!, 4!, 5! при делении на 29. Здесь 5! = 1 · 2 · 3 · 4 · 5 = 120, а обратное к числу a — такое b, что a · b даёт остаток 1.",
"headOn": "В лоб: 4 умножения, чтобы получить факториалы, и для каждого из 5 чисел отдельный долгий поиск обратного по 7 умножений. Всего 4 + 5 · 7 = 39 умножений.",
"notice": "Обратное к 4! получается из обратного к 5! одним умножением на 5, ведь 5! = 4! · 5. Значит, долгим способом нужно искать только одно обратное — к 5!.",
"steps": [
"Считаем факториалы и оставляем только остатки от деления на 29: 1, 2, 6, 24, 120 → 4. Это 4 умножения.",
"Одно долгое вычисление — 4 в степени 27 (27 = 29 − 2, по теореме Ферма) — даёт обратное к 5!: это 22, ведь 4 · 22 = 88 = 3 · 29 + 1. Ещё 7 умножений.",
"Спускаемся: 22 · 5 → 23 (к 4!), 23 · 4 → 5 (к 3!), 5 · 3 → 15 (к 2!), 15 · 2 → 1 (к 1!). Ещё 4 умножения."
]
},
"en": {
"task": "Find the inverses of 1!, 2!, 3!, 4!, 5! when dividing by 29. Here 5! = 1 · 2 · 3 · 4 · 5 = 120, and the inverse of a number a is the b for which a · b leaves remainder 1.",
"headOn": "Head-on: 4 multiplications to get the factorials, then a separate long search for each of the 5 inverses, 7 multiplications each. 4 + 5 · 7 = 39 multiplications in all.",
"notice": "The inverse of 4! comes from the inverse of 5! with one multiplication by 5, because 5! = 4! · 5. So only one inverse — that of 5! — has to be found the long way.",
"steps": [
"Compute the factorials, keeping only remainders after dividing by 29: 1, 2, 6, 24, 120 → 4. That is 4 multiplications.",
"One long computation — 4 to the power 27 (27 = 29 − 2, by Fermat's theorem) — gives the inverse of 5!: it is 22, since 4 · 22 = 88 = 3 · 29 + 1. 7 more multiplications.",
"Go down: 22 · 5 → 23 (for 4!), 23 · 4 → 5 (for 3!), 5 · 3 → 15 (for 2!), 15 · 2 → 1 (for 1!). 4 more multiplications."
]
},
"tags": {
"ru": [
"факториалы",
"одно долгое",
"спуск"
],
"en": [
"factorials",
"one long",
"going down"
]
}
},
"DayOfWeekFormula": {
"ru": {
"task": "Известно, что 1 января 1900 года был понедельник. Каким днём недели было 1 января 2000 года?",
"headOn": "В лоб: шагаем по календарю день за днём — 100 лет по 365 дней и ещё 24 лишних дня високосных лет, всего 36 524 шага.",
"notice": "Неделя повторяется каждые 7 дней. Год из 365 дней — это 52 недели и 1 день, поэтому обычный год сдвигает день недели на 1, а високосный — на 2. Дни можно не шагать, а сложить сдвиги.",
"steps": [
"Складываем: 1999 (номер года — январь считаем концом прошлого года) + 499 високосных (4 помещается в 1999 целых 499 раз) − 19 (годы, кратные 100, не високосные) + 4 (кратные 400 — всё-таки високосные) + 0 (январь) + 1 (число) = 2484.",
"Делим на 7: 2484 = 354 · 7 + 6. Остаток 6 — это суббота (воскресенье — 0, понедельник — 1, …, суббота — 6)."
]
},
"en": {
"task": "We know that 1 January 1900 was a Monday. What day of the week was 1 January 2000?",
"headOn": "Head-on: walk through the calendar day by day — 100 years of 365 days plus 24 extra leap-year days, 36,524 steps in all.",
"notice": "The week repeats every 7 days. A 365-day year is 52 weeks and 1 day, so an ordinary year moves the weekday on by 1 and a leap year by 2. Instead of walking the days we can add up the shifts.",
"steps": [
"Add up: 1999 (the year — January counts as the end of the year before) + 499 leap years (4 goes into 1999 a whole 499 times) − 19 (years divisible by 100 are not leap years) + 4 (those divisible by 400 are after all) + 0 (January) + 1 (the day) = 2484.",
"Divide by 7: 2484 = 354 · 7 + 6. Remainder 6 means Saturday (Sunday is 0, Monday 1, …, Saturday 6)."
]
},
"tags": {
"ru": [
"сумма",
"остаток"
],
"en": [
"sum",
"remainder"
]
}
},
"LehmerCode": {
"ru": {
"task": "Из букв a, b, c, d можно составить 24 разных порядка: abcd, abdc, acbd, … — по алфавиту. Какой порядок стоит 15-м?",
"headOn": "В лоб: выписываем порядки по алфавиту один за другим и считаем до 15-го — это 15 выписанных порядков.",
"notice": "Порядков, которые начинаются с a, ровно 6: остальные 3 буквы можно расставить 3 · 2 · 1 = 6 способами. С b — тоже 6. Перед 15-м стоят 14 порядков: 14 ÷ 6 = 2 полные группы (a… и b…), значит 15-й начинается с c.",
"steps": [
"14 ÷ 6 = 2, остаток 2: пропускаем 2 группы — первая буква c. Остались a, b, d.",
"Остаток 2 делим на 2 (две последние буквы можно расставить 2 способами): 2 ÷ 2 = 1, остаток 0 — пропускаем 1 группу, вторая буква b. Остались a, d.",
"Остаток 0: берём первую из оставшихся — a, последней остаётся d. Ответ: c b a d."
]
},
"en": {
"task": "The letters a, b, c, d can be put in 24 different orders: abcd, abdc, acbd, … — alphabetically. Which order comes 15th?",
"headOn": "Head-on: write the orders out alphabetically one after another and count to the 15th — 15 orders written out.",
"notice": "Exactly 6 orders start with a: the other 3 letters can be arranged in 3 · 2 · 1 = 6 ways. Another 6 start with b. Fourteen orders come before the 15th: 14 ÷ 6 = 2 full groups (a… and b…), so the 15th starts with c.",
"steps": [
"14 ÷ 6 = 2, remainder 2: skip 2 groups — the first letter is c. Left: a, b, d.",
"Divide the remainder 2 by 2 (the last two letters can be arranged 2 ways): 2 ÷ 2 = 1, remainder 0 — skip 1 group, the second letter is b. Left: a, d.",
"Remainder 0: take the first of what is left — a, and d comes last. The answer: c b a d."
]
},
"tags": {
"ru": [
"первая",
"вторая",
"ответ"
],
"en": [
"first",
"second",
"answer"
]
}
},
"CycleDetectionViaRemainders": {
"ru": {
"task": "1/7 = 0,142857142857… — цифры повторяются. Сколько цифр в повторяющемся блоке?",
"headOn": "В лоб: делим столбиком и каждый новый остаток сравниваем со всеми прежними, пока не встретится повтор. Остатки 1, 3, 2, 6, 4, 5, 1 — это 1 + 2 + 3 + 4 + 5 + 6 = 21 сравнение.",
"notice": "Следующая цифра зависит только от текущего остатка. Как только остаток повторился, повторятся и все цифры. А узнать, был ли такой остаток, можно одним взглядом в таблицу «на каком шаге был этот остаток».",
"steps": [
"Делим 1 на 7 столбиком: остатки 1, 3, 2, 6, 4, 5 записываем в таблицу с номером шага — каждый раз одного взгляда хватает, чтобы увидеть, что такого ещё не было.",
"На шаге 6 остаток снова 1 — он уже был на шаге 0. Повторяющийся блок — 6 − 0 = 6 цифр: 1/7 = 0,(142857)."
]
},
"en": {
"task": "1/7 = 0.142857142857… — the digits repeat. How many digits are in the repeating block?",
"headOn": "Head-on: do long division and compare each new remainder with all the earlier ones until one repeats. The remainders are 1, 3, 2, 6, 4, 5, 1 — that is 1 + 2 + 3 + 4 + 5 + 6 = 21 comparisons.",
"notice": "The next digit depends only on the current remainder. Once a remainder repeats, all the digits repeat too. And whether a remainder has been seen can be told with one glance at a table \"at which step did this remainder appear\".",
"steps": [
"Divide 1 by 7 in long division: write the remainders 1, 3, 2, 6, 4, 5 into the table with their step numbers — each time one glance shows it has not appeared yet.",
"At step 6 the remainder is 1 again — it already appeared at step 0. The repeating block is 6 − 0 = 6 digits: 1/7 = 0.(142857)."
]
},
"tags": {
"ru": [
"таблица",
"повтор"
],
"en": [
"table",
"repeat"
]
}
},
"PalindromeCheck": {
"ru": {
"task": "Читается ли число 232 одинаково слева направо и справа налево?",
"headOn": "В лоб: переводим 232 в текст, разворачиваем текст и сравниваем с исходным — три прохода по цифрам.",
"notice": "Число можно развернуть без текста: последняя цифра — это остаток от деления на 10, а разделив на 10 нацело, мы эту цифру отбрасываем. Цифры по одной приписываем к новому числу.",
"steps": [
"Снимаем цифры справа: 2, потом 3, потом 2. Новое число растёт: 0 · 10 + 2 = 2, 2 · 10 + 3 = 23, 23 · 10 + 2 = 232.",
"Сравниваем: 232 = 232 — число читается одинаково с обеих сторон."
]
},
"en": {
"task": "Does the number 232 read the same from left to right and from right to left?",
"headOn": "Head-on: turn 232 into text, reverse the text and compare it with the original — three passes over the digits.",
"notice": "A number can be reversed without text: its last digit is the remainder after dividing by 10, and whole-number division by 10 drops that digit. Attach the digits one by one to a new number.",
"steps": [
"Take the digits off from the right: 2, then 3, then 2. The new number grows: 0 · 10 + 2 = 2, 2 · 10 + 3 = 23, 23 · 10 + 2 = 232.",
"Compare: 232 = 232 — the number reads the same both ways."
]
},
"tags": {
"ru": [
"разворот",
"сравнение"
],
"en": [
"reverse",
"compare"
]
}
},
"PandigitalCheck": {
"ru": {
"task": "В числе 18365472 каждая цифра от 1 до 8 встречается ровно один раз?",
"headOn": "В лоб: для каждой цифры от 1 до 8 просматриваем всё число — 8 цифр × 8 мест = 64 сравнения.",
"notice": "Цифра сама говорит, куда её положить: цифра 5 — в ячейку номер 5. Ничего искать не нужно — хватит одной отметки на цифру.",
"steps": [
"Готовим 8 пустых ячеек с номерами от 1 до 8.",
"Каждая цифра числа ставит отметку в свою ячейку: 1 — в ячейку 1, 8 — в ячейку 8, и так далее. Все 8 ячеек отмечены по одному разу — ответ «да».",
"Для числа 18365572 шестая цифра 5 попадает в уже занятую ячейку 5, а ячейка 4 остаётся пустой — ответ «нет»."
]
},
"en": {
"task": "Does each digit from 1 to 8 appear exactly once in the number 18365472?",
"headOn": "Head-on: for each digit from 1 to 8 look through the whole number — 8 digits × 8 places = 64 comparisons.",
"notice": "A digit tells you where it goes: the digit 5 goes into box 5. Nothing needs to be searched — one tick per digit is enough.",
"steps": [
"Set out 8 empty boxes numbered 1 to 8.",
"Each digit of the number ticks its own box: 1 ticks box 1, 8 ticks box 8, and so on. All 8 boxes are ticked exactly once — the answer is yes.",
"For the number 18365572 the sixth digit, 5, lands in box 5, which is already ticked, and box 4 stays empty — the answer is no."
]
},
"tags": {
"ru": [
"ячейки",
"отметки",
"повтор"
],
"en": [
"boxes",
"ticks",
"repeat"
]
}
},
"ChampernowneConstant": {
"ru": {
"task": "Выписываем числа подряд без пробелов: 123456789101112… Какая цифра стоит на 12-м месте?",
"headOn": "В лоб: выписываем и считаем — 9 цифр от 1 до 9, ещё 2 цифры числа 10, ещё 1 цифра числа 11: 12 выписанных цифр. Для миллионного места пришлось бы выписать миллион цифр.",
"notice": "Однозначные числа 1…9 занимают ровно 9 мест, двузначные 10…99 — 90 · 2 = 180 мест. Целый блок можно перескочить одним вычитанием.",
"steps": [
"12 − 9 = 3: перескакиваем однозначные числа — нужно 3-е место среди двузначных.",
"У двузначных чисел по 2 цифры: места 1–2 — число 10, места 3–4 — число 11. 3-е место — первая цифра числа 11, это 1."
]
},
"en": {
"task": "Write the numbers in a row with no spaces: 123456789101112… Which digit is in 12th place?",
"headOn": "Head-on: write them out and count — 9 digits for 1 to 9, 2 more for the number 10, 1 more for 11: 12 digits written. For the millionth place you would have to write a million digits.",
"notice": "The one-digit numbers 1…9 take exactly 9 places, the two-digit numbers 10…99 take 90 · 2 = 180 places. A whole block can be skipped with one subtraction.",
"steps": [
"12 − 9 = 3: skip the one-digit numbers — we need the 3rd place among the two-digit ones.",
"Two-digit numbers have 2 digits each: places 1–2 are the number 10, places 3–4 are 11. The 3rd place is the first digit of 11, which is 1."
]
},
"tags": {
"ru": [
"блок",
"число 11"
],
"en": [
"block",
"number 11"
]
}
},
"DigitSumDivisibilityRule": {
"ru": {
"task": "Берём числа из цифр 1…n, где каждая цифра стоит ровно один раз, — например, 2143 для n = 4. Для каких n от 1 до 9 среди таких чисел могут быть простые (делящиеся только на 1 и на себя)?",
"headOn": "В лоб: проверяем на простоту каждое такое число. Чисел длины n — 1 · 2 · … · n, а всех длин вместе 1 + 2 + 6 + … + 362 880 = 409 113.",
"notice": "Число делится на 3, если сумма его цифр делится на 3. А у всех чисел одной длины сумма цифр одна и та же: 1 + 2 + … + n. Если она делится на 3 — вся длина отпадает сразу.",
"steps": [
"Сумма цифр для длин 1…9: 1, 3, 6, 10, 15, 21, 28, 36, 45.",
"На 3 делятся суммы для n = 2, 3, 5, 6, 8, 9 — эти длины отпадают. Длина 1 — это само число 1, оно не простое.",
"Остаются n = 4 и n = 7: чисел этих длин 24 и 5040 — всего 5064 проверки."
]
},
"en": {
"task": "Take numbers made of the digits 1…n, each digit used exactly once — say 2143 for n = 4. For which n from 1 to 9 can such a number be prime (divisible only by 1 and itself)?",
"headOn": "Head-on: test every such number for being prime. There are 1 · 2 · … · n numbers of length n, and 1 + 2 + 6 + … + 362,880 = 409,113 of all lengths together.",
"notice": "A number divides by 3 when the sum of its digits divides by 3. And all numbers of one length share the same digit sum: 1 + 2 + … + n. If that sum divides by 3, the whole length drops out at once.",
"steps": [
"Digit sums for lengths 1…9: 1, 3, 6, 10, 15, 21, 28, 36, 45.",
"The sums for n = 2, 3, 5, 6, 8, 9 divide by 3 — those lengths drop out. Length 1 is just the number 1, which is not prime.",
"n = 4 and n = 7 remain: there are 24 and 5040 numbers of those lengths — 5064 tests in all."
]
},
"tags": {
"ru": [
"суммы",
"на 3",
"остались"
],
"en": [
"sums",
"by 3",
"left"
]
}
}
};

/* ---------- local helpers ---------- */
// visibility without re-drawing a line that is already shown
function vis(t, on, o){
  if(!t) return t;
  if(on){ if(t.line && t._op >= 1 && t.prog && t.prog.p >= 1) return t; t.fadeIn(o); }
  else t.fadeOut(o);
  return t;
}
function visAll(list, on, o){ list.forEach(function(t){ vis(t, on, o); }); }
function xs(n, gap, cx){ var a = []; for(var k = 0; k < n; k++) a.push((cx || 0) + (k - (n - 1)/2)*gap); return a; }
function F(n){ return LAB.fmt ? LAB.fmt(n) : String(n); }
function qm(v){ return v < 0 ? '—' : F(Math.round(v)); }
function inf(v){ return v >= 99999 ? '∞' : qm(v); }
function T(api, str, pos, size, color, align){ return api.text(str, pos, {size: size, color: color || 'ink', align: align}); }
// a badge placed radially outside a ring tile
function ringBadge(api, ring, k, dist, text, color){
  var c = ring.center, a = ring.angle(k), R = ring.radius + dist;
  return api.badge(text, {pos: [c[0] + R*Math.sin(a), 0, c[2] - R*Math.cos(a)], color: color || 'red'});
}

/* ---------- chapters: task → head-on → notice → solve steps ----------
 * chap(def, x) registers the solve scene `def` with the story steps in front (NARRATIVE.md):
 *   step 0 = task, step 1 = head-on (red board counts the head-on work), step 2 = what we notice,
 *   then one step per story sentence of «how we solve» (def step solveMap[j]); the green board
 *   counts the work of the trick. Compare / properties chapters are built by the engine from the story.
 * pre(api, s, X, k, j): k = −1 task, 0 head-on, 1 notice, 2+ solve; j = solve index (−1 before).
 * x = {solveMap, naive, method, fmt, quant, nLabel:{ru,en}, nNote(v, L), mLabel:{ru,en},
 *      solve:[[value, ru, en]...], counter:[x,y,z], counter2:[x,y,z], countMs, ideaVal?, ideaNote?:[ru,en],
 *      build(api, s), pre(api, s, X, k, j)}                                                        */
function chap(def, x){
  var st = ST[def.id], map = x.solveMap || st.ru.steps.map(function(_, k){ return k; });
  var cap = function(f, k){ return {ru: k == null ? st.ru[f] : st.ru[f][k], en: k == null ? st.en[f] : st.en[f][k]}; };
  var steps = [
    {chapter: 'problem', caption: cap('task'), tag: {ru: 'задача', en: 'task'}},
    {chapter: 'problem', caption: cap('headOn'), tag: {ru: 'в лоб', en: 'head-on'}},
    {chapter: 'idea', caption: cap('notice'), tag: {ru: 'замечаем', en: 'notice'}}
  ].concat(map.map(function(_, m){ return {chapter: 'solve', caption: cap('steps', m), tag: {ru: st.tags.ru[m], en: st.tags.en[m]}}; }));
  LAB.register({
    id: def.id, view: x.view || def.view, steps: steps,
    build: function(api){
      var L = api.L, s = def.build(api);
      var X = s._x = (x.build ? x.build(api, s) : null) || {};
      var c2 = x.counter2 || [x.counter[0], 0, x.counter[2] + 3.1];
      X.ops = api.counter(x.nLabel, {pos: x.counter, color: 'red', format: x.fmt, quant: x.quant, noteFitValue: x.naive, noteSize: 0.46,
        note: typeof x.nNote === 'function' ? function(v){ return x.nNote(v, L); } : x.nNote});
      X.done = api.counter(x.mLabel, {pos: c2, color: 'green', note: '', format: x.fmt, noteSize: 0.46});
      return s;
    },
    step: function(api, s, i){
      var L = api.L, j = i - 3, X = s._x, k = i - 1;
      def.step(api, s, j < 0 ? 0 : map[j]);
      if(x.pre) x.pre(api, s, X, k, j);
      if(i === 0) X.ops.fadeOut();
      else {
        X.ops.fadeIn();
        if(i === 1){ X.ops.set(0, {ms: 0}); X.ops.set(x.naive, {ms: x.countMs || 1800, delay: 200}); } else X.ops.set(x.naive);
      }
      if(j < 0){
        if(i === 2 && x.ideaNote){ X.done.fadeIn(); X.done.set(x.ideaVal); X.done.setNote(L(x.ideaNote[0], x.ideaNote[1])); }
        else X.done.fadeOut();
      } else {
        var v = x.solve[j];
        X.done.fadeIn(); X.done.set(v[0], {delay: 300}); X.done.setNote(L(v[1], v[2]));
      }
    }
  });
}

/* ================= DigitalInvariantBound: 370 = 27 + 343 + 0; ceiling k·729 vs smallest k-digit number ================= */
chap({
  id: 'DigitalInvariantBound',
  view: {yaw: 0.2, pitch: 1.05, fill: 0.95},
  build: function(api){
    var L = api.L, s = {}, Z0 = -7.4;
    s.n370 = api.tile(370, {pos: [-4.5, 0, Z0], color: 'green', size: 1.25, h: 0.45});
    s.ops = [T(api, '=', [-3.35, 0, Z0], 0.6), T(api, '+', [-0.8, 0, Z0], 0.6), T(api, '+', [1.6, 0, Z0], 0.6)];
    s.cubes = api.row([27, 343, 0], {pos: [0.4, 0, Z0], gap: 2.4, size: 1.15, h: 0.36});
    s.cubeCap = ['3³', '7³', '0³'].map(function(c, k){ return T(api, c, [s.cubes.pos(k)[0], 0, Z0 - 1.05], 0.46, 'plain'); });
    // candidates 1..5 and "6, 7, … ?" — the endless head-on search
    s.slots = api.row([1, 2, 3, 4, 5], {pos: [-1.4, 0, -5.2], gap: 1.5, size: 0.75, h: 0.15});
    s.chk = ['1³ = 1', '2³ = 8', '3³ = 27', '4³ = 64', '5³ = 125'].map(function(c, k){ return T(api, c, [s.slots.pos(k)[0], 0, -4.45], 0.38, 'plain'); });
    s.more = T(api, '6, 7, … ?', [5.8, 0, -5.2], 0.55, 'amber', 'left');
    s.hK = T(api, L('цифр', 'digits'), [-4.1, 0, -3.6], 0.46, 'plain');
    s.hMax = T(api, L('потолок', 'ceiling'), [-2.0, 0, -3.6], 0.46, 'violet');
    s.hMin = T(api, L('наименьшее', 'smallest'), [1.4, 0, -3.6], 0.46, 'blue');
    s.ks = []; s.ceil = []; s.floor = []; s.hC = []; s.hF = [];
    for(var r = 0; r < 5; r++){
      var z = -2.6 + r*1.32, c = 729*(r + 1), f = Math.pow(10, r);
      s.ks.push(T(api, String(r + 1), [-4.1, 0, z], 0.55, 'plain'));
      s.hC.push(0.22 + 0.7*c/10000); s.hF.push(0.22 + 0.7*f/10000);
      s.ceil.push(api.tile(c, {pos: [-2.0, 0, z], color: 'violet', size: 1.1, h: s.hC[r]}));
      s.floor.push(api.tile(f, {pos: [1.4, 0, z], color: 'blue', size: 1.1, h: s.hF[r]}));
    }
    s.cross = api.label(L('10 000 &gt; 3645: пятизначные не подходят', '10,000 &gt; 3645: five digits cannot work'), s.floor[4], {color: 'amber'});
    s.why = T(api, L('ищем только среди 0…9999', 'search only 0…9999'), [-0.3, 0, 4.4], 0.55, 'green');
    return s;
  },
  step: function(api, s, i){
    // i: 0 start, 1 ceilings, 2 smallest numbers, 3 bound
    s.cubes.color(i === 0 ? 'plain' : 'dim');
    s.slots.color('dim'); visAll(s.chk, false); s.more.color('dim');
    vis(s.hK, i >= 1); vis(s.hMax, i >= 1); vis(s.hMin, i >= 2);
    for(var r = 0; r < 5; r++){
      var d = r*140;
      vis(s.ks[r], i >= 1, {delay: i === 1 ? d : 0});
      vis(s.ceil[r], i >= 1, {delay: i === 1 ? d : 0});
      s.ceil[r].height(i >= 1 ? s.hC[r] : 0.05, {delay: i === 1 ? d : 0});
      s.ceil[r].color(i === 3 && r === 4 ? 'dim' : 'violet');
      vis(s.floor[r], i >= 2, {delay: i === 2 ? d : 0});
      s.floor[r].height(i >= 2 ? s.hF[r] : 0.05, {delay: i === 2 ? d : 0});
      s.floor[r].color(r === 4 ? (i === 3 ? 'amber' : 'blue') : (i === 3 ? 'green' : 'blue'));
      s.ks[r].color(i === 3 ? (r < 4 ? 'green' : 'amber') : 'plain');
    }
    s.cross.show(i === 3, {delay: 300});
    vis(s.why, i === 3, {delay: 600});
  }
}, {
  solveMap: [1, 2, 3],
  naive: 100000, method: 10000, fmt: inf,
  nLabel: {ru: 'проверенных чисел в лоб', en: 'numbers checked head-on'},
  nNote: function(v, L){ return L('конца не видно', 'no end in sight'); },
  mLabel: {ru: 'проверок с границей', en: 'checks with the bound'},
  solve: [[100000, 'граница ещё не найдена', 'no bound yet'], [100000, 'граница ещё не найдена', 'no bound yet'],
    [10000, 'числа 0…9999', 'the numbers 0…9999']],
  counter: [8.8, 0, -5.4],
  build: function(api, s){
    var L = api.L, X = {bars: [], kl: []}, B0 = 2.3, Lz = 4.2;
    // flat bar chart on the floor: bar length ∝ value (10000 → 4.2 units)
    for(var k = 1; k <= 5; k++){
      var x = -3.8 + (k - 1)*1.5, c = 729*k, f = Math.pow(10, k - 1), lc = Math.max(0.08, Lz*c/10000), lf = Math.max(0.08, Lz*f/10000);
      X.bars.push(api.box([0.5, 0.12, lc], {pos: [x - 0.3, 0, B0 - lc/2], color: 'violet'}));
      X.bars.push(api.box([0.5, 0.12, lf], {pos: [x + 0.3, 0, B0 - lf/2], color: 'amber'}));
      X.kl.push(T(api, String(k), [x, 0, B0 + 0.45], 0.46, 'plain'));
    }
    X.v5 = T(api, '3645', [-3.8 + 4*1.5 - 0.95, 0, B0 - Lz*0.3645 - 0.1], 0.42, 'violet', 'right');
    X.a5 = T(api, '10000', [-3.8 + 4*1.5 + 0.7, 0, B0 - Lz + 0.3], 0.42, 'amber', 'left');
    X.leg = T(api, L('цифр в числе · фиолетовые — потолок суммы кубов · жёлтые — само число', 'digits in the number · purple: ceiling of the cube sum · yellow: the number itself'), [-4.3, 0, B0 + 1.2], 0.42, 'plain', 'left');
    X.wall = api.label(L('конца перебора не видно', 'the search never ends'), s.more, {color: 'red'});
    return X;
  },
  pre: function(api, s, X, k, j){
    if(j < 0){
      s.slots.each(function(t, n){ t.color(k === 0 ? 'red' : 'dim', {delay: k === 0 ? 200 + n*300 : 0}); });
      s.chk.forEach(function(t, n){ vis(t, k === 0, {delay: 200 + n*300}); t.color(n === 0 ? 'green' : 'red'); });
      s.more.color(k === 0 ? 'red' : 'dim');
      s.cubes.color(k === 1 ? 'dim' : 'plain');
    }
    X.wall.show(k === 0, {delay: 1700});
    X.bars.forEach(function(t, n){ vis(t, k === 1, {delay: 100 + n*80}); });
    visAll(X.kl, k === 1, {delay: 200}); vis(X.v5, k === 1, {delay: 600}); vis(X.a5, k === 1, {delay: 600});
    vis(X.leg, k === 1, {delay: 300});
  }
});

/* ================= PositionalNotation: 29 counters in groups of 10, of 2 and with weights 24, 6, 2, 1 ================= */
chap({
  id: 'PositionalNotation',
  view: {yaw: 0.08, pitch: 1.02, fill: 0.92},
  build: function(api){
    var L = api.L, s = {}, CZ = -1.7, SP = 0.36;
    s.cnt = [];
    for(var k = 0; k < 29; k++) s.cnt.push(api.tile('', {pos: [-5.6 + k*0.4, 0, CZ], color: 'blue', size: 0.28, h: 0.2}));
    function block(out, n, cx, cols, sp){
      sp = sp || SP; var rows = Math.ceil(n/cols);
      for(var j = 0; j < n; j++){ var c = j % cols, r = Math.floor(j/cols); out.push([cx + (c - (cols - 1)/2)*sp, 0, CZ + (r - (rows - 1)/2)*sp]); }
    }
    var L0 = [], L1 = [], L2 = [], L3 = [];
    for(k = 0; k < 29; k++) L0.push([-5.6 + k*0.4, 0, CZ]);
    block(L1, 10, -3.4, 5); block(L1, 10, -1.4, 5); block(L1, 9, 2.4, 9, 0.45);
    block(L2, 16, -4.4, 4); block(L2, 8, -2.2, 4); block(L2, 4, 0, 2); block(L2, 1, 4.4, 1);
    block(L3, 24, -3.3, 6); block(L3, 2, 0.75, 2); block(L3, 2, 1.45, 2); block(L3, 1, 3.3, 1);
    s.lay = [L0, L1, L2, L3];
    s.n29 = T(api, L('29 фишек', '29 counters'), [0, 0, -0.9], 0.55, 'blue');
    var P = [[-2.4, 2.4], [-4.4, -2.2, 0, 2.2, 4.4], [-3.3, -1.1, 1.1, 3.3]];
    var W = [[10, 1], [16, 8, 4, 2, 1], [24, 6, 2, 1]];
    var D = [[2, 9], [1, 1, 1, 0, 1], [1, 0, 2, 1]];
    s.D = D;
    s.wT = T(api, L('вес места', 'place weight'), [-6.2, 0, -3.2], 0.46, 'violet', 'right');
    s.w = W.map(function(ws, b){ return ws.map(function(w, j){ return T(api, String(w), [P[b][j], 0, -3.2], 0.55, 'violet'); }); });
    s.gap2 = api.box([0.8, 0.04, 0.6], {pos: [2.2, 0, CZ], color: 'amber'});
    s.gap6 = api.box([0.9, 0.04, 0.8], {pos: [-1.1, 0, CZ], color: 'amber'});
    s.gapL = api.label(L('группы 2 нет — пишем 0', 'no group of 2 — write 0'), s.gap2, {color: 'amber'});
    var SZ = [1.8, 2.95, 4.1], NAME = [L('по 10', 'tens'), L('по 2', 'twos'), '24, 6, 2, 1'];
    s.under = D.map(function(ds, b){ return ds.map(function(d, j){ return [P[b][j], 0, 0.35]; }); });
    s.summ = D.map(function(ds, b){ return ds.map(function(d, j){ return [-1.8 + j*0.95, 0, SZ[b]]; }); });
    s.strip = D.map(function(ds, b){ return ds.map(function(d, j){ return api.tile(d, {pos: s.summ[b][j], color: d === 0 ? 'amber' : 'plain', size: 0.75, h: 0.3}); }); });
    s.sName = NAME.map(function(n, b){ return T(api, n, [-2.5, 0, SZ[b]], 0.46, 'plain', 'right'); });
    s.sep = api.box([9.0, 0.02, 0.03], {pos: [0.4, 0, 1.1], color: 'dim'});
    s.fact = T(api, '1 · 24 + 0 · 6 + 2 · 2 + 1 · 1 = 29', [0.4, 0, 5.3], 0.5, 'green');
    return s;
  },
  step: function(api, s, i){
    // i: 0 sticks, 1 tens, 2 twos, 3 weights 24, 6, 2, 1
    var L = s.lay[i];
    s.cnt.forEach(function(t, k){ t.moveTo(L[k], {delay: k*18}); });
    vis(s.n29, i === 0);
    vis(s.wT, i >= 1);
    s.w.forEach(function(ws, b){ visAll(ws, i === b + 1, {delay: 400}); });
    vis(s.gap2, i === 2, {delay: 500}); vis(s.gap6, i === 3, {delay: 500});
    s.gapL.show(i === 2, {delay: 600});
    s.strip.forEach(function(ds, b){
      var on = i >= b + 1, act = i === b + 1, fin = act && b === 2;
      ds.forEach(function(t, j){
        var d = act ? 550 + j*90 : 0;
        vis(t, on, {delay: d});
        if(!on) t.moveTo(s.under[b][j]);
        else if(fin){ t.moveTo(s.under[b][j]); t.moveTo(s.summ[b][j], {delay: 1700 + j*60}); }
        else t.moveTo(act ? s.under[b][j] : s.summ[b][j], {delay: act ? 0 : j*60});
        t.color(s.D[b][j] === 0 ? 'amber' : act ? 'violet' : 'plain');
      });
      var inSum = on && (!act || fin);
      vis(s.sName[b], inSum, {delay: fin ? 1700 : 0}); s.sName[b].color(act ? 'violet' : 'plain');
    });
    vis(s.sep, i >= 2);
    vis(s.fact, i === 3, {delay: 2100});
  }
}, {
  solveMap: [1, 2, 3],
  naive: 29, method: 5, fmt: qm, countMs: 29*55,
  nLabel: {ru: 'палочек', en: 'sticks'},
  nNote: function(v, L){ return v + ' ' + L(pl(v, 'фишка', 'фишки', 'фишек'), pl(v, 'counter', 'counters')) + ' → ' + v + ' ' + L(pl(v, 'палочка', 'палочки', 'палочек'), pl(v, 'stick', 'sticks')); },
  mLabel: {ru: 'знаков записи', en: 'signs'},
  solve: [[2, 'группами по 10: 2 и 9', 'in tens: 2 and 9'], [5, 'группы 16, 8, 4, 2, 1 → 11101', 'groups 16, 8, 4, 2, 1 → 11101'],
    [4, 'веса 24, 6, 2, 1 → 1021', 'weights 24, 6, 2, 1 → 1021']],
  counter: [9.2, 0, -1.7],
  build: function(api, s){
    var L = api.L;
    return {wall: api.label(L('каждая фишка — своя палочка', 'each counter is a stick of its own'), s.cnt[28], {color: 'red', dy: 0.6}),
      idea: api.label(L('10 фишек = 1 знак на месте левее', '10 counters = 1 sign one place to the left'), s.cnt[9], {color: 'violet', dy: 0.6})};
  },
  pre: function(api, s, X, k, j){
    s.cnt.forEach(function(t, n){
      var c = j >= 0 || k < 0 ? 'blue' : k === 0 ? 'red' : n < 10 ? 'violet' : n < 20 ? 'amber' : 'blue';
      t.color(c, {delay: k === 0 ? 200 + n*55 : 0});
    });
    X.wall.show(k === 0, {delay: 1900});
    X.idea.show(k === 1, {delay: 300});
  }
});

/* ================= BigIntegerArithmetic: two 25-digit numbers — a 19-digit cell vs column addition ================= */
chap({
  id: 'BigIntegerArithmetic',
  view: {yaw: 0.05, pitch: 1.0, fill: 0.92},
  build: function(api){
    var L = api.L, s = {}, A = '4839201746582930174658293', B = '5270918364529173820465718', S = '10110120111112103995124011', G = 0.56;
    function cx(col){ return (col - 12.5)*G; }            // columns 0..25, 25 = units
    s.cx = cx; s.G = G;
    s.a = A.split('').map(function(d, k){ return api.tile(d, {pos: [cx(k + 1), 0, -2.3], size: 0.5, h: 0.2}); });
    s.b = B.split('').map(function(d, k){ return api.tile(d, {pos: [cx(k + 1), 0, -1.55], size: 0.5, h: 0.2}); });
    s.plus = T(api, '+', [cx(0) - 0.2, 0, -1.55], 0.6);
    s.bar = api.box([26*G, 0.03, 0.05], {pos: [cx(12.5), 0, -1.1], color: 'ink'});
    s.sum = S.split('').map(function(d, k){ return api.tile(d, {pos: [cx(k), 0, -0.6], size: 0.5, h: 0.2, color: 'blue'}); });
    s.sumT = T(api, L('сумма', 'sum'), [cx(0) - 0.6, 0, -0.6], 0.46, 'blue', 'right');
    s.carry = [24, 23, 22].map(function(col){ return api.tile(1, {pos: [cx(col), 0, -3.05], color: 'amber', size: 0.4, h: 0.15}); });
    s.carryL = api.label(L('перенос 1 — в столбец левее', 'carry 1 into the next column'), s.carry[0], {color: 'amber'});
    s.allL = api.label(L('26 цифр, ни одна не потеряна', '26 digits, none lost'), s.sum[0], {color: 'green'});
    return s;
  },
  step: function(api, s, i){
    // i: 0 start, 1 three right columns, 2 all columns
    s.a.concat(s.b).forEach(function(t, k){ var r = (k % 25) >= 22; t.color(i === 1 && r ? 'violet' : 'plain'); t.lift(0); });
    s.sum.forEach(function(t, k){
      var r = k >= 23, on = i === 2 || (i === 1 && r), d = i === 1 ? 300 + (25 - k)*700 : i === 2 ? (25 - k)*40 : 0;
      vis(t, on, {delay: d}); t.color(i === 2 ? 'green' : 'blue');
    });
    vis(s.sumT, i >= 1);
    s.carry.forEach(function(t, k){ vis(t, i === 1, {delay: 600 + k*700}); });
    s.carryL.show(i === 1, {delay: 700});
    s.allL.show(i === 2, {delay: 1100});
  }
}, {
  solveMap: [1, 2],
  naive: 6, method: 0, fmt: qm, countMs: 1500,
  nLabel: {ru: 'цифр не поместилось', en: 'digits that do not fit'},
  nNote: function(v, L){ return v < 6 ? L('за краем ячейки: ', 'past the end of the cell: ') + v : L('25 цифр − 19 мест = 6', '25 digits − 19 places = 6'); },
  mLabel: {ru: 'сложений столбцов', en: 'column additions'},
  solve: [[3, 'первые 3 столбца', 'the first 3 columns'], [25, '25 столбцов → 25 сложений', '25 columns → 25 additions']],
  counter: [-11.2, 0, -3.8], counter2: [-11.2, 0, 0.6],
  build: function(api, s){
    var L = api.L, X = {};
    X.cellA = api.box([19*s.G, 0.03, 0.62], {pos: [s.cx(16), 0, -2.3], color: 'blue'});
    X.cellB = api.box([19*s.G, 0.03, 0.62], {pos: [s.cx(16), 0, -1.55], color: 'blue'});
    X.cellT = T(api, L('ячейка памяти: 19 цифр', 'memory cell: 19 digits'), [s.cx(16), 0, -3.05], 0.46, 'blue');
    X.lostL = api.label(L('6 цифр не помещаются', '6 digits do not fit'), s.a[2], {color: 'red'});
    X.idea = api.label(L('3 + 8 = 11: пишем 1, 1 переносим', '3 + 8 = 11: write 1, carry 1'), s.a[24], {color: 'violet'});
    return X;
  },
  pre: function(api, s, X, k, j){
    if(j < 0){
      s.a.concat(s.b).forEach(function(t, n){ var m = n % 25; t.color(k === 0 && m < 6 ? 'red' : k === 1 && m === 24 ? 'violet' : 'plain', {delay: k === 0 ? 200 + m*60 : 0}); t.lift(k === 0 && m < 6 ? 0.2 : 0); });
    }
    [X.cellA, X.cellB, X.cellT].forEach(function(t){ vis(t, k === 0); });
    X.lostL.show(k === 0, {delay: 900});
    X.idea.show(k === 1, {delay: 300});
  }
});

/* ================= CrossMultiplication: 3/7 vs 4/9 ================= */
chap({
  id: 'CrossMultiplication',
  view: {yaw: 0.1, pitch: 1.05, fill: 0.9},
  build: function(api){
    var L = api.L, s = {};
    function frac(n, d, x){
      return {n: api.tile(n, {pos: [x, 0, -3.7], size: 1.0, h: 0.36}), d: api.tile(d, {pos: [x, 0, -1.9], size: 1.0, h: 0.36}),
        bar: api.box([1.2, 0.04, 0.08], {pos: [x, 0, -2.8], color: 'ink'})};
    }
    s.A = frac(3, 7, -2.4); s.B = frac(4, 9, 2.4);
    s.mid = T(api, '?', [0, 0, -2.8], 0.9, 'plain');
    s.div = [T(api, L('3 ÷ 7 = 0,428571…', '3 ÷ 7 = 0.428571…'), [0, 0, -0.6], 0.5, 'red'), T(api, L('4 ÷ 9 = 0,444444…', '4 ÷ 9 = 0.444444…'), [0, 0, 0.2], 0.5, 'red')];
    s.xA = api.arc(s.A.n, s.B.d, {color: 'blue', height: 0.45});
    s.xB = api.arc(s.B.n, s.A.d, {color: 'violet', height: 0.45});
    s.p27 = api.tile(27, {pos: [-1.4, 0, 2.3], color: 'blue', size: 1.1, h: 0.4});
    s.p28 = api.tile(28, {pos: [1.4, 0, 2.3], color: 'violet', size: 1.1, h: 0.4});
    s.t27 = T(api, '3 · 9', [-1.4, 0, 3.3], 0.5, 'blue');
    s.t28 = T(api, '4 · 7', [1.4, 0, 3.3], 0.5, 'violet');
    s.lt = T(api, '<', [0, 0, 2.3], 0.9, 'green');
    s.res = api.label(L('27 &lt; 28, значит 3/7 &lt; 4/9', '27 &lt; 28, so 3/7 &lt; 4/9'), s.p28, {color: 'green'});
    return s;
  },
  step: function(api, s, i){
    // i: 0 start, 1 cross products, 2 answer
    var cA = i === 1 ? 'blue' : i === 2 ? 'green' : 'plain', cB = i === 1 ? 'violet' : i === 2 ? 'green' : 'plain';
    s.A.n.color(cA); s.B.d.color(i === 1 ? 'blue' : cB);
    s.B.n.color(cB); s.A.d.color(i === 1 ? 'violet' : cA);
    s.mid.setText(i === 2 ? '<' : '?', {delay: i === 2 ? 500 : 0});
    s.mid.color(i === 2 ? 'green' : 'plain');
    visAll(s.div, false);
    vis(s.xA, i >= 1, {delay: i === 1 ? 100 : 0}); vis(s.xB, i >= 1, {delay: i === 1 ? 500 : 0});
    s.xA.color(i === 2 ? 'dim' : 'blue'); s.xB.color(i === 2 ? 'dim' : 'violet');
    vis(s.p27, i >= 1, {delay: i === 1 ? 400 : 0}); vis(s.t27, i >= 1, {delay: i === 1 ? 400 : 0});
    vis(s.p28, i >= 1, {delay: i === 1 ? 800 : 0}); vis(s.t28, i >= 1, {delay: i === 1 ? 800 : 0});
    s.p27.lift(i === 2 ? 0.3 : 0); s.p28.lift(i === 2 ? 0.3 : 0);
    vis(s.lt, i === 2, {delay: 200}); s.res.show(i === 2, {delay: 600});
  }
}, {
  solveMap: [1, 2],
  naive: 2, method: 2, fmt: qm,
  nLabel: {ru: 'делений с округлением', en: 'rounded divisions'},
  nNote: function(v, L){ return v < 2 ? L('3 ÷ 7 = 0,4285…', '3 ÷ 7 = 0.4285…') : L('после округления обе 0,4', 'both round to 0.4'); },
  mLabel: {ru: 'умножений целых чисел', en: 'whole-number multiplications'},
  solve: [[2, '3 · 9 и 4 · 7', '3 · 9 and 4 · 7'], [2, 'столько же работы, ответ точный', 'same work, exact answer']],
  counter: [6.4, 0, -3.4],
  build: function(api, s){
    var L = api.L;
    return {round: api.label(L('округлим: 0,4 и 0,4 — «равны», а это неверно', 'rounded: 0.4 and 0.4 — "equal", which is wrong'), s.div[1], {color: 'red'}),
      idea: api.label(L('умножим обе дроби на 7 · 9 — знаменатели исчезнут', 'multiply both by 7 · 9 — the bottoms vanish'), s.mid, {color: 'violet'})};
  },
  pre: function(api, s, X, k, j){
    if(j < 0){
      s.div.forEach(function(t, n){ vis(t, k === 0, {delay: 300 + n*900}); });
      vis(s.xA, k === 1, {delay: 100}); vis(s.xB, k === 1, {delay: 400});
      if(k === 1){ s.xA.color('violet'); s.xB.color('amber'); s.A.n.color('violet'); s.B.d.color('violet'); s.B.n.color('amber'); s.A.d.color('amber'); }
    }
    X.round.show(k === 0, {delay: 1400});
    X.idea.show(k === 1, {delay: 500});
  }
});

/* ================= FastExponentiation: 3¹³ by squaring ================= */
chap({
  id: 'FastExponentiation',
  view: {yaw: 0.08, pitch: 1.0, fill: 0.9},
  build: function(api){
    var L = api.L, s = {}, R = [-1.7, -0.5, 0.7, 1.9];
    s.R = R;
    s.title = T(api, '3¹³ = ?', [0, 0, -6.1], 0.7);
    var ones = []; for(var k = 0; k < 13; k++) ones.push(3);
    s.naive = api.row(ones, {pos: [0, 0, -4.9], gap: 0.68, size: 0.55, h: 0.22});
    s.head = [T(api, L('показатель', 'exponent'), [-3.7, 0, -2.95], 0.46, 'plain'), T(api, L('нечётный?', 'odd?'), [-2.0, 0, -2.95], 0.46, 'plain'),
      T(api, L('в квадрат', 'squared'), [0, 0, -2.95], 0.46, 'teal'), T(api, L('результат', 'result'), [2.2, 0, -2.95], 0.46, 'blue')];
    var E = [13, 6, 3, 1], ODD = [1, 0, 1, 1], B = [3, 9, 81, 6561], RES = [3, 3, 243, 1594323];
    s.ODD = ODD;
    s.rows = R.map(function(z, r){
      return {e: api.tile(E[r], {pos: [-3.7, 0, z], size: 0.9, h: 0.3}),
        o: T(api, ODD[r] ? L('да', 'yes') : L('нет', 'no'), [-2.0, 0, z], 0.5, ODD[r] ? 'green' : 'plain'),
        b: api.tile(B[r], {pos: [0, 0, z], size: 1.05, h: 0.3, color: 'teal'}),
        res: api.tile(RES[r], {pos: [2.2, 0, z], size: 1.05, h: 0.3, color: ODD[r] ? 'blue' : 'plain'})};
    });
    s.chain = [];
    for(var r = 0; r < 3; r++) s.chain.push(api.arc(s.rows[r].e, s.rows[r + 1].e, {color: 'violet', height: 0.5, head: true}));
    s.mul = [T(api, '3 · 81', [3.6, 0, R[2]], 0.46, 'blue', 'left'), T(api, '243 · 6561', [3.6, 0, R[3]], 0.46, 'blue', 'left')];
    s.sqL = api.label(L('каждая строка — квадрат предыдущей', 'each row is the square of the one above'), s.rows[2].b, {color: 'teal'});
    s.ans = api.label('3¹³ = 1 594 323', s.rows[3].res, {color: 'green'});
    return s;
  },
  step: function(api, s, i){
    // i: 0 start, 1 halving + squares, 2 result
    s.naive.each(function(t, k){ t.color(i === 0 ? 'plain' : 'dim', {delay: i === 0 ? 0 : k*25}); });
    s.title.color(i === 2 ? 'green' : 'ink');
    visAll(s.head.slice(0, 3), i >= 1); vis(s.head[3], i >= 2);
    s.rows.forEach(function(row, r){
      var d = i === 1 ? 200 + r*500 : 0, last = r === 3;
      [row.e, row.o, row.b].forEach(function(t){ vis(t, i >= 1, {delay: d}); });
      vis(row.res, i >= 2, {delay: i === 2 ? 200 + r*300 : 0});
      row.res.color(last && i === 2 ? 'green' : s.ODD[r] ? 'blue' : 'plain');
      row.res.lift(last && i === 2 ? 0.3 : 0);
      if(r < 3) vis(s.chain[r], i >= 1, {delay: d + 300});
    });
    s.mul.forEach(function(t, k){ vis(t, i === 2, {delay: 800 + k*300}); });
    s.sqL.show(i === 1, {delay: 1500});
    s.ans.show(i === 2, {delay: 1400});
  }
}, {
  solveMap: [1, 2],
  naive: 12, method: 5, fmt: qm, countMs: 12*130,
  nLabel: {ru: 'умножений на 3 подряд', en: 'multiplications by 3'},
  nNote: function(v, L){ return (v + 1) + ' ' + L(pl(v + 1, 'тройка', 'тройки', 'троек'), pl(v + 1, 'three', 'threes')) + ' → ' + v + ' ' + L(pl(v, 'умножение', 'умножения', 'умножений'), pl(v, 'multiplication', 'multiplications')); },
  mLabel: {ru: 'умножений квадратами', en: 'multiplications by squaring'},
  solve: [[3, '3 квадрата: 9, 81, 6561', '3 squarings: 9, 81, 6561'], [5, '3 квадрата + 2 умножения результата', '3 squarings + 2 multiplications of the result']],
  counter: [-8.2, 0, 3.0],
  build: function(api, s){
    var L = api.L, X = {marks: []};
    for(var k = 1; k < 13; k++) X.marks.push(api.marks(s.naive.at(k), ['×3'], {dir: 'front', color: 'red'}));
    X.idea = api.label('13 = 8 + 4 + 1 → 3¹³ = 3⁸ · 3⁴ · 3', s.rows[0].e, {color: 'violet'});
    return X;
  },
  pre: function(api, s, X, k, j){
    if(j < 0){
      s.naive.each(function(t, n){ t.color(k === 0 ? (n === 0 ? 'plain' : 'red') : k === 1 ? 'dim' : 'plain', {delay: k === 0 ? 200 + (n - 1)*130 : 0}); });
      s.rows.forEach(function(row, r){ vis(row.e, k === 1, {delay: r*300}); vis(row.b, k === 1, {delay: r*300}); if(r < 3) vis(s.chain[r], k === 1, {delay: 150 + r*300}); });
      vis(s.head[0], k === 1); vis(s.head[2], k === 1);
    }
    X.marks.forEach(function(m, n){ m.show(k === 0 ? 1 : 0, {delay: 200 + n*130}); });
    s.rows.forEach(function(row){ row.e.color(j < 0 && k === 1 ? 'violet' : 'plain'); });
    X.idea.show(k === 1, {delay: 1200});
  }
});

/* ================= ModularArithmetic: dial of 12 — 34, 34 + 5, 34 × 5 ================= */
chap({
  id: 'ModularArithmetic',
  view: {yaw: 0.2, pitch: 1.05, fill: 0.9},
  build: function(api){
    var L = api.L, s = {}, vals = []; for(var k = 0; k < 12; k++) vals.push(k);
    s.ring = api.ring(12, {radius: 3.3, values: vals, size: 0.85});
    s.n34 = api.tile(34, {pos: [0, 0, -0.6], size: 1.1, h: 0.5});
    s.eq = T(api, '', [0, 0, 0.8], 0.5);
    s.left = []; for(k = 0; k < 10; k++) s.left.push(api.arc(s.ring.at(k), s.ring.at(k + 1), {color: 'blue', height: 0.35}));
    s.add = []; for(k = 10; k < 15; k++) s.add.push(api.arc(s.ring.at(k % 12), s.ring.at((k + 1) % 12), {color: 'violet', height: 0.55}));
    s.mul = api.arc(s.ring.at(10), s.ring.at(2), {color: 'red', height: 1.6, head: true, dashed: true});
    s.hand = api.label('', s.ring.at(10), {color: 'blue'});
    return s;
  },
  step: function(api, s, i){
    // i: 0 start, 1 34, 2 +5, 3 ×5
    var L = api.L, at = [null, 10, 3, 2][i], col = ['plain', 'blue', 'violet', 'red'][i];
    s.ring.each(function(t, k){
      var c = k === at ? col : 'plain';
      t.color(c, {delay: k === at ? 900 : 0}); t.lift(k === at ? 0.3 : 0, {delay: k === at ? 900 : 0});
    });
    s.n34.color(i === 0 ? 'ink' : i === 1 ? 'blue' : 'dim');
    s.eq.setText(['', '34 = 2 · 12 + 10', '10 + 5 = 15 = 12 + 3', '10 × 5 = 50 = 4 · 12 + 2'][i]);
    s.eq.color(col);
    s.left.forEach(function(a, k){ vis(a, i === 1, {delay: k*90}); a.color('blue'); });
    s.add.forEach(function(a, k){ vis(a, i === 2, {delay: k*150}); });
    vis(s.mul, i === 3, {delay: 150});
    if(at != null){ s.hand.to(s.ring.at(at)); s.hand.setText(L('стрелка на ', 'the hand is at ') + at); s.hand.color(col); }
    s.hand.show(at != null, {delay: 900});
  }
}, {
  solveMap: [1, 2, 3],
  naive: 209, method: 5, fmt: qm, countMs: 2600,
  nLabel: {ru: 'шагов по циферблату', en: 'steps around the dial'},
  nNote: function(v, L){
    if(v <= 34) return v + L(' шагов до 34', ' steps to 34');
    if(v <= 39) return '34 + ' + (v - 34) + L(' (ещё 5)', ' (5 more)');
    return '34 + 5 + ' + (v - 39) + L(' (170 для «×5»)', ' (170 for "×5")');
  },
  mLabel: {ru: 'действий с остатками', en: 'operations on remainders'},
  solve: [[1, '1 деление: 34 → 10', '1 division: 34 → 10'], [3, '+ сложение и деление: 15 → 3', '+ an addition and a division: 15 → 3'],
    [5, '+ умножение и деление: 50 → 2', '+ a multiplication and a division: 50 → 2']],
  counter: [10.0, 0, -2.4],
  build: function(api, s){
    var L = api.L, X = {steps: []};
    for(var c = 0; c < 12; c++){ var ns = []; for(var n = 1; n <= 34; n++) if(n % 12 === c) ns.push(n); X.steps.push(ringBadge(api, s.ring, c, 1.7, ns.join(' · '), c === 10 ? 'red' : 'amber')); }
    X.plus = api.arc(s.ring.at(10), s.ring.at(3), {color: 'violet', height: 1.2, head: true});
    X.times = api.arc(s.ring.at(0), s.ring.at(2), {color: 'red', height: 2.4, head: true, dashed: true});
    X.wall = api.label(L('шаг 34 — на делении 10; дальше ещё 5 и 170 шагов', 'step 34 lands on 10; then 5 and 170 more steps'), s.ring.at(10), {color: 'red'});
    X.jump = api.arc(s.n34, s.ring.at(10), {color: 'violet', height: 1.2, head: true});
    X.idea = api.label(L('два полных круга выбрасываем', 'drop the two full turns'), s.n34, {color: 'violet'});
    return X;
  },
  pre: function(api, s, X, k, j){
    if(j < 0){
      s.ring.each(function(t, n){ t.color(k === 0 ? (n === 10 ? 'red' : 'plain') : k === 1 && n === 10 ? 'violet' : 'plain', {delay: k === 0 ? 1600 : 0}); t.lift(k === 1 && n === 10 ? 0.3 : 0); });
      s.n34.color(k === 1 ? 'violet' : 'ink');
      s.eq.setText(k === 1 ? '34 = 12 + 12 + 10' : ''); s.eq.color('violet');
      s.hand.show(false);
    }
    X.steps.forEach(function(b, n){ if(k === 0) b.fadeIn({delay: 200 + n*120}); else b.fadeOut(); });
    vis(X.plus, k === 0, {delay: 1800}); vis(X.times, k === 0, {delay: 2100});
    X.wall.show(k === 0, {delay: 1700});
    vis(X.jump, k === 1, {delay: 200});
    X.idea.show(k === 1, {delay: 500});
  }
});

/* ================= ModularInverseFermat: 3 · x leaves remainder 1 after dividing by 7 → x = 3⁵ → 5 ================= */
chap({
  id: 'ModularInverseFermat',
  view: {yaw: 0.15, pitch: 1.05, fill: 0.9},
  build: function(api){
    var L = api.L, s = {};
    s.ring = api.ring(7, {radius: 3.0, values: [0, 1, 2, 3, 4, 5, 6], size: 0.85});
    s.ringT = T(api, L('остатки от деления на 7', 'remainders after dividing by 7'), [0, 0, -4.6], 0.5, 'plain');
    var P = [3, 2, 4, 5];
    s.pw = []; for(var k = 0; k < 3; k++) s.pw.push(api.arc(s.ring.at(P[k]), s.ring.at(P[k + 1]), {color: 'violet', height: 0.7, head: true}));
    s.pwT = ['3² = 9 → 2', '3⁴ = 2 · 2 = 4', '3⁵ = 4 · 3 = 12 → 5'].map(function(t, k){ return T(api, t, [0, 0, 4.0 + k*0.7], 0.5, 'violet'); });
    s.strip = [api.tile(7, {pos: [-1.4, 0, 5.1], color: 'blue', size: 1.3, h: 0.35}), api.tile(7, {pos: [0, 0, 5.1], color: 'blue', size: 1.3, h: 0.35}),
      api.tile(1, {pos: [1.2, 0, 5.1], color: 'green', size: 0.9, h: 0.35})];
    s.stripT = T(api, '3 · 5 = 15 = 7 + 7 + 1', [0, 0, 6.2], 0.55, 'green');
    s.lx = api.label('x = 5', s.ring.at(5), {color: 'green'});
    return s;
  },
  step: function(api, s, i){
    // i: 0 start, 1 3⁵ by squaring, 2 check
    s.ring.each(function(t, k){
      var c = 'plain', l = 0, d = 0;
      if(k === 3) c = i === 1 ? 'violet' : 'blue';
      if(i === 1 && (k === 2 || k === 4)){ c = 'violet'; d = {2: 300, 4: 600}[k]; }
      if(k === 5 && i >= 1){ c = 'green'; l = 0.3; d = i === 1 ? 900 : 0; }
      if(k === 1 && i === 2){ c = 'green'; l = 0.3; }
      t.color(c, {delay: d}); t.lift(l, {delay: d});
    });
    s.pw.forEach(function(a, k){ vis(a, i === 1, {delay: k*300}); });
    s.pwT.forEach(function(t, k){ vis(t, i === 1, {delay: 150 + k*300}); });
    s.strip.forEach(function(t, k){ vis(t, i === 2, {delay: 400 + k*350}); });
    vis(s.stripT, i === 2, {delay: 1400});
    s.lx.show(i >= 1, {delay: i === 1 ? 900 : 0});
  }
}, {
  solveMap: [1, 2],
  naive: 5, method: 3, fmt: qm, countMs: 5*350,
  nLabel: {ru: 'пробных умножений', en: 'trial multiplications'},
  nNote: function(v, L){ return v ? 'x = 1…' + v + ' → ' + v + ' ' + L(pl(v, 'проба', 'пробы', 'проб'), pl(v, 'try', 'tries')) : L('пробуем по порядку', 'trying in order'); },
  mLabel: {ru: 'умножений для 3⁵', en: 'multiplications for 3⁵'},
  solve: [[3, '2 квадрата + 1 умножение', '2 squarings + 1 multiplication'], [3, 'проверка — не в счёт', 'the check is not counted']],
  counter: [-9.0, 0, -2.0],
  build: function(api, s){
    var L = api.L, X = {}, T5 = ['x = 1: 3 → 3', 'x = 2: 6 → 6', 'x = 3: 9 → 2', 'x = 4: 12 → 5', 'x = 5: 15 → 1'];
    X.order = [3, 6, 2, 5, 1];
    X.probes = T5.map(function(t, n){ return T(api, t, [4.9, 0, -2.4 + n*0.8], 0.5, n === 4 ? 'green' : 'red', 'left'); });
    X.found = api.label(L('остаток 1 — нашли', 'remainder 1 — found'), X.probes[4], {color: 'green'});
    X.idea = api.label(L('3⁶ даёт остаток 1, а 3⁶ = 3 · 3⁵ → x = 3⁵', '3⁶ leaves remainder 1, and 3⁶ = 3 · 3⁵ → x = 3⁵'), s.ring.at(3), {color: 'violet'});
    return X;
  },
  pre: function(api, s, X, k, j){
    if(j < 0){
      s.ring.each(function(t, n){
        var q = X.order.indexOf(n), c = 'plain', d = 0, l = 0;
        if(k === 0 && q >= 0){ c = n === 1 ? 'green' : 'red'; d = 200 + q*350; l = n === 1 ? 0.3 : 0; }
        if(k === 1 && n === 3){ c = 'violet'; l = 0.3; }
        t.color(c, {delay: d}); t.lift(l, {delay: d});
      });
      s.lx.show(false);
    }
    X.probes.forEach(function(t, n){ vis(t, k === 0, {delay: 200 + n*350}); });
    X.found.show(k === 0, {delay: 2000});
    X.idea.show(k === 1, {delay: 300});
  }
});

/* ================= BatchInversion: inverses of 1!…5! after dividing by 29 ================= */
chap({
  id: 'BatchInversion',
  view: {yaw: 0.1, pitch: 1.02, fill: 0.9},
  build: function(api){
    var L = api.L, s = {}, X = xs(5, 2.0), k;
    s.A = api.row(['?', '?', '?', '?', '?'], {pos: [0, 0, -4.3], gap: 2.0, size: 1.0, color: 'red'});
    s.Atop = X.map(function(x, k){ return T(api, (k + 1) + '!', [x, 0, -5.25], 0.5, 'plain'); });
    s.Alab = T(api, L('обратные к', 'inverses of'), [-5.3, 0, -5.25], 0.46, 'plain', 'right');
    s.B = api.row([1, 2, 6, 24, 4], {pos: [0, 0, -1.7], gap: 2.0, size: 1.0, color: 'amber'});
    s.Blab = T(api, L('факториалы', 'factorials'), [-5.3, 0, -1.7], 0.46, 'amber', 'right');
    s.Bx = []; for(k = 0; k < 4; k++) s.Bx.push(T(api, '×' + (k + 2), [(X[k] + X[k + 1])/2, 0, -1.7], 0.5, 'amber'));
    s.B120 = api.label(L('120 → остаток 4', '120 → remainder 4'), s.B.at(4), {color: 'blue'});
    s.C4 = api.tile(4, {pos: [-2.6, 0, 0.9], size: 1.0, color: 'blue'});
    s.Cp = T(api, L('в степени 27 →', 'to the power 27 →'), [0, 0, 0.9], 0.5, 'blue');
    s.C22 = api.tile(22, {pos: [2.6, 0, 0.9], size: 1.0, color: 'green'});
    s.Chop = api.arc(s.B.at(4), s.C4, {color: 'blue', height: 1.0, dashed: true});
    s.Cl = api.label(L('обратное к 5!', 'inverse of 5!'), s.C22, {color: 'green'});
    s.D = api.row([22, 23, 5, 15, 1], {pos: [0, 0, 3.5], gap: 2.0, size: 1.0, color: 'green'});
    s.Dtop = X.map(function(x, k){ return T(api, (5 - k) + '!', [x, 0, 2.4], 0.5, 'green'); });
    s.Dx = []; s.Dhop = [];
    for(k = 0; k < 4; k++){
      s.Dx.push(T(api, '×' + (5 - k), [(X[k] + X[k + 1])/2, 0, 3.5], 0.5, 'amber'));
      s.Dhop.push(api.arc(s.D.at(k), s.D.at(k + 1), {color: 'amber', height: 0.7, head: true}));
    }
    s.Dfrom = api.arc(s.C22, s.D.at(0), {color: 'green', height: 0.8, dashed: true});
    return s;
  },
  step: function(api, s, i){
    // i: 0 start, 1 factorials, 2 one long computation, 3 going down
    var ans = [1, 15, 5, 23, 22];
    s.A.each(function(t, k){
      t.setText(i === 3 ? ans[k] : '?', {delay: i === 3 ? 1800 + k*120 : 0});
      t.color(i === 3 ? 'green' : 'plain', {delay: i === 3 ? 1800 + k*120 : 0});
      t.lift(0);
    });
    s.B.each(function(t, k){ vis(t, i >= 1, {delay: i === 1 ? k*260 : 0}); t.color(k === 4 ? 'blue' : i >= 2 ? 'dim' : 'amber'); });
    vis(s.Blab, i >= 1);
    s.Bx.forEach(function(t, k){ vis(t, i >= 1, {delay: i === 1 ? 130 + k*260 : 0}); t.color(i >= 2 ? 'dim' : 'amber'); });
    s.B120.show(i === 1, {delay: 1200});
    vis(s.Chop, i >= 2, {delay: i === 2 ? 100 : 0}); s.Chop.color(i === 3 ? 'dim' : 'blue');
    vis(s.C4, i >= 2, {delay: i === 2 ? 350 : 0}); vis(s.Cp, i >= 2, {delay: i === 2 ? 550 : 0});
    vis(s.C22, i >= 2, {delay: i === 2 ? 800 : 0}); s.C22.lift(i === 2 ? 0.25 : 0, {delay: 800});
    s.Cl.show(i === 2, {delay: 1000});
    vis(s.Dfrom, i === 3);
    s.D.each(function(t, k){ vis(t, i === 3, {delay: 200 + k*300}); });
    s.Dtop.forEach(function(t, k){ vis(t, i === 3, {delay: 200 + k*300}); });
    s.Dx.forEach(function(t, k){ vis(t, i === 3, {delay: 350 + k*300}); });
    s.Dhop.forEach(function(t, k){ vis(t, i === 3, {delay: 300 + k*300}); });
  }
}, {
  solveMap: [1, 2, 3],
  naive: 39, method: 15, fmt: qm, countMs: 2200,
  nLabel: {ru: 'умножений по одному', en: 'multiplications one by one'},
  nNote: function(v, L){ if(v <= 4) return v + L(' — факториалы', ' — factorials'); var k = Math.floor((v - 4)/7); return '4 + ' + k + ' × 7 = ' + (4 + 7*k); },
  mLabel: {ru: 'умножений на весь список', en: 'multiplications for the whole list'},
  solve: [[4, '4 — факториалы', '4 — factorials'], [11, '4 + 7 — одно долгое вычисление', '4 + 7 — one long computation'], [15, '4 + 7 + 4 — спуск', '4 + 7 + 4 — going down']],
  counter: [-9.6, 0, -2.2],
  build: function(api, s){
    var L = api.L, X = {b: []};
    s.A.each(function(t, k){ X.b.push(api.badge(L('7 умн.', '7 mult.'), {pos: [s.A.pos(k)[0], 0, -3.3], color: 'red'})); });
    X.wall = api.label(L('каждое обратное — отдельно, по 7 умножений', 'each inverse separately, 7 multiplications each'), s.A.at(4), {color: 'red'});
    X.idea = api.label(L('5! = 4! · 5 → обратное к 4! = обратное к 5! · 5', '5! = 4! · 5 → inverse of 4! = inverse of 5! · 5'), s.A.at(3), {color: 'violet'});
    X.arr = api.arc(s.A.at(4), s.A.at(3), {color: 'violet', height: 0.8, head: true});
    return X;
  },
  pre: function(api, s, X, k, j){
    if(j < 0){
      s.A.each(function(t, n){
        var d = k === 0 ? 200 + n*330 : 0;
        t.color(k === 0 ? 'red' : k === 1 && n >= 3 ? 'violet' : 'plain', {delay: d});
        t.lift(k === 0 ? 0.2 : 0, {delay: d});
      });
    }
    X.b.forEach(function(b, n){ if(k === 0) b.fadeIn({delay: 200 + n*330}); else b.fadeOut(); });
    X.wall.show(k === 0, {delay: 1900});
    X.idea.show(k === 1, {delay: 300}); vis(X.arr, k === 1, {delay: 200});
  }
});

/* ================= DayOfWeekFormula: 1 January 2000 ================= */
chap({
  id: 'DayOfWeekFormula',
  view: {yaw: 0.08, pitch: 1.0, fill: 0.9},
  build: function(api){
    var L = api.L, s = {}, V = [1999, 499, 19, 4, 0, 1], TX = -4.2, CX = -3.5;
    s.Z = V.map(function(v, k){ return -4.3 + k*0.95; });
    s.terms = V.map(function(v, k){ return api.tile(v, {pos: [TX, 0, s.Z[k]], size: 0.85, h: 0.25, color: k === 2 ? 'red' : k >= 4 ? 'plain' : 'blue'}); });
    s.cap = [L('год − 1', 'year − 1'), L('+ високосные (1999 ÷ 4)', '+ leap years (1999 ÷ 4)'), L('− кратные 100 (1999 ÷ 100)', '− multiples of 100 (1999 ÷ 100)'),
      L('+ кратные 400 (1999 ÷ 400)', '+ multiples of 400 (1999 ÷ 400)'), L('+ январь: 0', '+ January: 0'), L('+ число: 1', '+ the day: 1')]
      .map(function(c, k){ return T(api, c, [CX, 0, s.Z[k]], 0.46, k === 2 ? 'red' : 'ink', 'left'); });
    s.sum = api.tile(2484, {pos: [TX, 0, 1.5], size: 1.0, h: 0.35, color: 'ink'});
    s.sumT = T(api, '= 2484', [CX, 0, 1.5], 0.55, 'ink', 'left');
    s.mod = T(api, L('2484 = 354 · 7 + 6', '2484 = 354 · 7 + 6'), [CX, 0, 2.45], 0.55, 'green', 'left');
    s.days = api.row([L('Вс', 'Sun'), L('Пн', 'Mon'), L('Вт', 'Tue'), L('Ср', 'Wed'), L('Чт', 'Thu'), L('Пт', 'Fri'), L('Сб', 'Sat')], {pos: [0.8, 0, 3.8], gap: 1.1, size: 0.9});
    s.idx = [0, 1, 2, 3, 4, 5, 6].map(function(k){ return T(api, String(k), [s.days.pos(k)[0], 0, 4.65], 0.46, 'plain'); });
    s.sat = api.label(L('остаток 6 — суббота', 'remainder 6 — Saturday'), s.days.at(6), {color: 'green'});
    return s;
  },
  step: function(api, s, i){
    // i: 0 start, 1 sum, 2 remainder
    s.terms.forEach(function(t, k){
      var d = i === 1 ? k*220 : 0;
      vis(t, i >= 1, {delay: d}); t.color(i === 2 ? 'dim' : k === 2 ? 'red' : k >= 4 ? 'plain' : 'blue');
      vis(s.cap[k], i >= 1, {delay: d}); s.cap[k].color(i === 2 ? 'plain' : k === 2 ? 'red' : 'ink');
    });
    vis(s.sum, i >= 1, {delay: i === 1 ? 1400 : 0}); vis(s.sumT, i >= 1, {delay: i === 1 ? 1400 : 0});
    vis(s.mod, i === 2, {delay: 200});
    s.days.each(function(t, k){
      vis(t, i === 2, {delay: k*60});
      var sat = k === 6 && i === 2;
      t.color(sat ? 'green' : 'plain', {delay: sat ? 900 : 0}); t.lift(sat ? 0.3 : 0, {delay: sat ? 900 : 0});
      vis(s.idx[k], i === 2, {delay: k*60});
    });
    s.sat.show(i === 2, {delay: 1000});
  }
}, {
  solveMap: [1, 2],
  naive: 36524, method: 10, fmt: qm, countMs: 2200,
  nLabel: {ru: 'шагов по дням', en: 'steps through the days'},
  nNote: function(v, L){ return L('100 лет × 365 + 24 дня', '100 years × 365 + 24 days'); },
  mLabel: {ru: 'действий в формуле', en: 'operations in the formula'},
  solve: [[9, '1 вычитание + 3 деления + 5 сложений', '1 subtraction + 3 divisions + 5 additions'], [10, '+ 1 остаток от деления на 7', '+ 1 remainder after dividing by 7']],
  counter: [-11.8, 0, -2.4],
  build: function(api, s){
    var L = api.L, X = {};
    X.jump = api.arc(s.days.at(1), s.days.at(6), {color: 'red', height: 1.0, head: true});
    X.start = api.label(L('1 января 1900 — понедельник', '1 January 1900 — Monday'), s.days.at(1), {color: 'blue'});
    X.i1 = T(api, L('365 = 52 · 7 + 1', '365 = 52 · 7 + 1'), [0.8, 0, 1.6], 0.6, 'violet');
    X.il = api.label(L('обычный год: +1 день недели, високосный: +2', 'ordinary year: +1 weekday, leap year: +2'), X.i1, {color: 'violet'});
    return X;
  },
  pre: function(api, s, X, k, j){
    if(j < 0){
      s.days.each(function(t, n){ vis(t, k <= 0); t.color(n === 1 ? 'blue' : k === 0 && n === 6 ? 'red' : 'plain', {delay: 200 + n*120}); t.lift(0); vis(s.idx[n], k <= 0); });
      s.sat.show(false);
    }
    X.start.show(k <= 0, {delay: 300}); vis(X.jump, k === 0, {delay: 900});
    vis(X.i1, k === 1, {delay: 300}); X.il.show(k === 1, {delay: 900});
  }
});

/* ================= LehmerCode: the 15th order of the letters abcd ================= */
chap({
  id: 'LehmerCode',
  view: {yaw: 0.08, pitch: 1.02, fill: 0.9},
  build: function(api){
    var L = api.L, s = {}, POOL = [['a', 'b', 'c', 'd'], ['a', 'b', 'd'], ['a', 'd']], PICK = [2, 1, 0];
    var F = [L('14 ÷ 6 = 2, остаток 2 → c', '14 ÷ 6 = 2, remainder 2 → c'), L('2 ÷ 2 = 1, остаток 0 → b', '2 ÷ 2 = 1, remainder 0 → b'), L('0 → a, остаётся d', '0 → a, d is left')];
    s.PICK = PICK;
    s.title = T(api, L('15-й порядок букв abcd = ?', 'the 15th order of abcd = ?'), [0, 0, -5.0], 0.6);
    s.headP = T(api, L('буквы в запасе', 'letters left'), [-3.85, 0, -3.6], 0.46, 'plain');
    s.rows = POOL.map(function(p, r){
      var z = -2.5 + r*1.6;
      return {pool: p.map(function(c, j){ return api.tile(c, {pos: [-5.2 + j*0.9, 0, z], size: 0.75, h: 0.26}); }),
        f: T(api, F[r], [-1.3, 0, z], 0.55, 'ink', 'left')};
    });
    s.ans = api.row(['c', 'b', 'a', 'd'], {pos: [0, 0, 3.4], gap: 1.6, size: 1.1, h: 0.4, color: 'green'});
    s.ansL = api.label(L('15-й порядок: cbad', 'the 15th order: cbad'), s.ans.at(3), {color: 'green'});
    s.grpL = api.label(L('2 полные группы по 6: a… и b…', '2 full groups of 6: a… and b…'), s.rows[0].pool[2], {color: 'violet'});
    return s;
  },
  step: function(api, s, i){
    // i: 0 start, 1 first letter, 2 second letter, 3 answer
    s.title.color(i === 3 ? 'plain' : 'ink');
    vis(s.headP, i >= 1);
    s.rows.forEach(function(row, r){
      var on = r === 0 || i >= r + 1, act = i === r + 1 || (r === 2 && i === 3);
      row.pool.forEach(function(t, j){
        vis(t, on, {delay: act ? 200 : 0});
        var pick = i >= r + 1 && j === s.PICK[r];
        t.color(pick ? 'green' : i === 3 ? 'dim' : 'plain', {delay: pick && act ? 500 : 0});
        t.lift(pick && act ? 0.2 : 0, {delay: 500});
      });
      vis(row.f, i >= r + 1, {delay: act ? 300 : 0}); row.f.color(act ? 'ink' : 'plain');
    });
    s.ans.each(function(t, k){ vis(t, i === 3, {delay: 400 + k*200}); t.lift(i === 3 ? 0.25 : 0, {delay: 400 + k*200}); });
    s.ansL.show(i === 3, {delay: 1300});
    s.grpL.show(i === 1, {delay: 600});
  }
}, {
  solveMap: [1, 2, 3],
  naive: 15, method: 3, fmt: qm, countMs: 15*115,
  nLabel: {ru: 'выписанных порядков', en: 'orders written out'},
  nNote: function(v, L){ return v + L('-й: ', ': ') + (v <= 1 ? 'abcd' : v === 15 ? 'cbad' : '…'); },
  mLabel: {ru: 'делений номера', en: 'divisions of the rank'},
  solve: [[1, '14 ÷ 6', '14 ÷ 6'], [2, '14 ÷ 6, 2 ÷ 2', '14 ÷ 6, 2 ÷ 2'], [3, '+ 0 ÷ 1 — 3 деления', '+ 0 ÷ 1 — 3 divisions']],
  counter: [10.4, 0, -1.4],
  build: function(api, s){
    var L = api.L, X = {perm: []}, all = [];
    (function rec(pre, rest){ if(!rest.length){ all.push(pre); return; } for(var k = 0; k < rest.length; k++) rec(pre + rest[k], rest.slice(0, k) + rest.slice(k + 1)); })('', 'abcd');
    for(var k = 0; k < 15; k++){
      var r = Math.floor(k/6), c = k % 6;
      X.perm.push(api.tile(all[k], {pos: [-3.25 + c*1.3, 0, -2.5 + r*1.3], size: 1.05, h: 0.26}));
    }
    X.head = ['a…', 'b…', 'c…'].map(function(t, r){ return T(api, t, [-4.3, 0, -2.5 + r*1.3], 0.55, 'plain', 'right'); });
    X.wall = api.label(L('15-й — cbad, после 14 выписанных', 'the 15th is cbad, after 14 written out'), X.perm[14], {color: 'red'});
    X.idea = api.label(L('по 6 порядков на каждую первую букву', '6 orders for each first letter'), X.perm[5], {color: 'violet'});
    return X;
  },
  pre: function(api, s, X, k, j){
    X.perm.forEach(function(t, n){
      vis(t, j < 0 && k >= 0);
      var c = k === 0 ? (n === 14 ? 'green' : 'red') : n >= 12 ? 'violet' : n < 6 ? 'blue' : 'amber';
      t.color(c, {delay: k === 0 ? 200 + n*115 : 0});
    });
    X.head.forEach(function(t){ vis(t, j < 0 && k >= 0); });
    if(j < 0 && k >= 0) s.rows[0].pool.forEach(function(t){ vis(t, false); });
    X.wall.show(k === 0, {delay: 1900});
    X.idea.show(k === 1, {delay: 300});
  }
});

/* ================= CycleDetectionViaRemainders: 1/7 ================= */
chap({
  id: 'CycleDetectionViaRemainders',
  view: {yaw: 0.08, pitch: 1.05, fill: 0.9},
  build: function(api){
    var L = api.L, s = {}, k;
    s.R = [1, 3, 2, 6, 4, 5, 1];
    s.DIG = {1: 1, 3: 4, 2: 2, 6: 8, 4: 5, 5: 7};
    s.title = T(api, L('1 ÷ 7 = 0,142857142857…', '1 ÷ 7 = 0.142857142857…'), [0, 0, -5.4], 0.6);
    s.ring = api.ring(7, {radius: 2.6, values: [0, 1, 2, 3, 4, 5, 6], size: 0.85});
    s.th = [T(api, L('шаг', 'step'), [3.9, 0, -4.1], 0.5, 'plain'), T(api, L('остаток', 'remainder'), [5.9, 0, -4.1], 0.46, 'plain'), T(api, L('цифра', 'digit'), [7.5, 0, -4.1], 0.5, 'plain')];
    s.tr = [];
    for(k = 0; k < 7; k++){
      var z = -3.0 + k*1.05;
      s.tr.push({lab: T(api, String(k), [3.9, 0, z], 0.55, 'plain'),
        st: api.tile('—', {pos: [5.9, 0, z], size: 0.8, h: 0.22}),
        dg: api.tile(k === 6 ? '—' : s.DIG[s.R[k]], {pos: [7.5, 0, z], size: 0.8, h: 0.22, color: 'blue'})});
    }
    s.rep = api.label(L('остаток 1 уже был на шаге 0', 'remainder 1 already appeared at step 0'), s.tr[6].st, {color: 'red'});
    s.zero = T(api, '0,', [-3.4, 0, 4.3], 0.6, 'plain');
    s.dig = api.row([1, 4, 2, 8, 5, 7], {pos: [0, 0, 4.3], gap: 0.95, size: 0.8, color: 'blue'});
    s.blk = api.bracket(s.dig.at(0), s.dig.at(5), {color: 'green', text: L('повторяется: 6 цифр', 'repeats: 6 digits'), dz: 0.8});
    return s;
  },
  step: function(api, s, i){
    // i: 0 start, 1 table filled up to the repeat, 2 block of 6
    var D = 300;
    s.ring.fadeOut();
    visAll(s.th, true);
    s.tr.forEach(function(row, k){
      var d = i === 1 ? D + k*D : 0, rep = k === 6;
      visAll([row.lab, row.st], true);
      row.st.setText(i >= 1 ? s.R[k] : '—', {delay: d});
      row.st.color(i >= 1 ? (rep ? 'red' : i === 2 ? 'green' : 'blue') : 'plain', {delay: d});
      row.lab.color(rep && i >= 1 ? 'red' : 'plain');
      vis(row.dg, i >= 1 && !rep, {delay: d});
      row.dg.color(i === 2 ? 'green' : 'blue');
    });
    s.rep.show(i === 1, {delay: 7*D});
    vis(s.zero, i >= 1);
    s.dig.each(function(t, k){ vis(t, i >= 1, {delay: i === 1 ? D + k*D : 0}); t.color(i === 2 ? 'green' : 'blue'); });
    if(i === 2) s.blk.fadeIn({delay: 300}); else s.blk.fadeOut();
  }
}, {
  solveMap: [1, 2],
  naive: 21, method: 7, fmt: qm, countMs: 6*300 + 200,
  nLabel: {ru: 'сравнений остатков', en: 'comparisons of remainders'},
  nNote: function(v, L){ return '1 + 2 + 3 + 4 + 5 + 6 = 21'; },
  mLabel: {ru: 'взглядов в таблицу', en: 'glances at the table'},
  solve: [[7, '7 шагов × 1 взгляд', '7 steps × 1 glance'], [7, 'блок: 6 − 0 = 6 цифр', 'block: 6 − 0 = 6 digits']],
  counter: [-9.6, 0, -2.4],
  build: function(api, s){
    var L = api.L, X = {cmp: [], rows: []};
    var DV = ['10 ÷ 7 = 1, ост. 3', '30 ÷ 7 = 4, ост. 2', '20 ÷ 7 = 2, ост. 6', '60 ÷ 7 = 8, ост. 4', '40 ÷ 7 = 5, ост. 5', '50 ÷ 7 = 7, ост. 1', ''];
    var DVe = ['10 ÷ 7 = 1, rem. 3', '30 ÷ 7 = 4, rem. 2', '20 ÷ 7 = 2, rem. 6', '60 ÷ 7 = 8, rem. 4', '40 ÷ 7 = 5, rem. 5', '50 ÷ 7 = 7, rem. 1', ''];
    for(var k = 0; k < 7; k++){
      var z = -3.0 + k*1.05;
      X.rows.push({t: api.tile(s.R[k], {pos: [4.3, 0, z], size: 0.7, h: 0.22, color: k === 6 ? 'red' : 'blue'}),
        dv: T(api, L(DV[k], DVe[k]), [5.0, 0, z], 0.5, 'ink', 'left')});
    }
    // comparisons climb on the left of the remainder column
    for(k = 1; k < 7; k++) for(var m = 0; m < k; m++){
      X.cmp.push({k: k, a: api.arc([3.85, 0.25, -3.0 + k*1.05], [3.85, 0.25, -3.0 + m*1.05], {color: 'red', height: 0.2 + 0.13*(k - m), dashed: true})});
    }
    X.wall = api.label(L('каждый новый остаток — со всеми прежними', 'each new remainder against all earlier ones'), X.rows[5].t, {color: 'red'});
    X.idea = api.label(L('следующая цифра зависит только от остатка', 'the next digit depends only on the remainder'), s.ring.at(1), {color: 'violet'});
    return X;
  },
  pre: function(api, s, X, k, j){
    if(j < 0){
      visAll(s.th, false); s.rep.show(false);
      s.tr.forEach(function(row){ visAll([row.lab, row.st, row.dg], false); });
      if(k === 1){ s.ring.fadeIn(); s.ring.each(function(t){ t.color('violet'); }); } else s.ring.fadeOut();
    }
    X.rows.forEach(function(r, n){ [r.t, r.dv].forEach(function(t){ vis(t, k === 0, {delay: 200 + n*300}); }); });
    X.cmp.forEach(function(c, n){ vis(c.a, k === 0, {delay: 200 + c.k*300 + (n % 6)*40}); });
    X.wall.show(k === 0, {delay: 2300});
    X.idea.show(k === 1, {delay: 300});
  }
});

/* ================= PalindromeCheck: 232 ================= */
chap({
  id: 'PalindromeCheck',
  view: {yaw: 0.12, pitch: 1.0, fill: 0.85},
  build: function(api){
    var L = api.L, s = {}, X = xs(3, 1.25);
    s.X = X;
    s.orig = api.row([2, 3, 2], {pos: [0, 0, -1.6], gap: 1.25, size: 1.0, h: 0.36});
    s.oT = T(api, L('число', 'number'), [-2.4, 0, -1.6], 0.5, 'plain', 'right');
    s.slots = api.row(['', '', ''], {pos: [0, 0, 1.2], gap: 1.25, size: 1.0, h: 0.1, color: 'dim'});
    s.rT = T(api, L('новое число', 'new number'), [-2.4, 0, 1.2], 0.5, 'plain', 'right');
    s.mv = [2, 1, 0].map(function(j){ return api.tile(j === 1 ? 3 : 2, {pos: [X[j], 0, -1.6], size: 1.0, h: 0.36, color: 'blue'}); });
    s.acc = ['0 · 10 + 2 = 2', '2 · 10 + 3 = 23', '23 · 10 + 2 = 232'].map(function(t, k){ return T(api, t, [2.5, 0, -0.4 + k*0.7], 0.5, 'blue', 'left'); });
    s.eq = X.map(function(x){ return api.line([[x, 0.4, -1.05], [x, 0.4, 0.65]], {color: 'green', dashed: true}); });
    s.res = api.label(L('232 = 232 — читается одинаково', '232 = 232 — reads the same'), s.slots.at(2), {color: 'green'});
    return s;
  },
  step: function(api, s, i){
    // i: 0 start, 1 digits moved one by one, 2 compare
    s.orig.each(function(t, j){
      var peel = 2 - j;                                // the right digit is taken first
      t.color(i === 1 ? 'dim' : i === 2 ? 'green' : 'plain', {delay: i === 1 ? peel*600 : 0});
    });
    s.mv.forEach(function(t, k){
      var d = i === 1 ? k*600 : 0;
      vis(t, i >= 1, {delay: d});
      t.moveTo(i >= 1 ? [s.X[k], 0, 1.2] : [s.X[2 - k], 0, -1.6], {delay: d + 100});
      t.color(i === 2 ? 'green' : 'blue');
    });
    vis(s.rT, i >= 1);
    s.slots.each(function(t){ vis(t, false); });
    s.acc.forEach(function(t, k){ vis(t, i === 1, {delay: 300 + k*600}); });
    s.eq.forEach(function(l, k){ vis(l, i === 2, {delay: k*150}); });
    s.res.show(i === 2, {delay: 500});
  }
}, {
  solveMap: [1, 2],
  naive: 3, method: 1, fmt: qm, countMs: 3*550,
  nLabel: {ru: 'проходов через текст', en: 'passes via text'},
  nNote: function(v, L){ return L('в текст + разворот + сравнение', 'to text + reverse + compare'); },
  mLabel: {ru: 'проходов по цифрам', en: 'passes over the digits'},
  solve: [[1, 'цифры 2, 3, 2 по одной', 'digits 2, 3, 2 one by one'], [1, '1 проход + 1 сравнение', '1 pass + 1 comparison']],
  counter: [-7.8, 0, -1.8],
  build: function(api, s){
    var L = api.L, X = {};
    X.str = [L('1) в текст «232»', '1) to text "232"'), L('2) разворот «232»', '2) reverse "232"'), L('3) сравнение', '3) compare')]
      .map(function(t, k){ return T(api, t, [2.5, 0, -2.0 + k*0.75], 0.5, 'red', 'left'); });
    X.idea = api.label(L('последняя цифра — остаток от деления на 10', 'the last digit is the remainder after dividing by 10'), s.orig.at(2), {color: 'violet'});
    return X;
  },
  pre: function(api, s, X, k, j){
    if(j < 0) s.orig.each(function(t, n){ t.color(k === 0 ? 'red' : k === 1 && n === 2 ? 'violet' : 'plain', {delay: k === 0 ? 200 + n*200 : 0}); });
    X.str.forEach(function(t, n){ vis(t, k === 0, {delay: 200 + n*550}); });
    X.idea.show(k === 1, {delay: 300});
  }
});

/* ================= PandigitalCheck: 18365472 (and 18365572) ================= */
chap({
  id: 'PandigitalCheck',
  view: {yaw: 0.1, pitch: 1.0, fill: 0.9},
  build: function(api){
    var L = api.L, s = {}, D = [1, 8, 3, 6, 5, 4, 7, 2];
    s.D = D;
    s.dig = api.row(D, {pos: [0, 0, -1.9], gap: 1.05, size: 0.85});
    s.dT = T(api, L('число', 'number'), [-4.6, 0, -1.9], 0.5, 'plain', 'right');
    s.slot = api.row([1, 2, 3, 4, 5, 6, 7, 8], {pos: [0, 0, 1.9], gap: 1.05, size: 0.85, h: 0.14, color: 'dim'});
    s.sT = T(api, L('ячейки', 'boxes'), [-4.6, 0, 1.9], 0.5, 'plain', 'right');
    s.marks = [1, 2, 3, 4, 5, 6, 7, 8].map(function(v, k){ return api.marks(s.slot.at(k), ['•'], {dir: 'front', color: 'blue'}); });
    s.links = D.map(function(d, k){ return api.arc(s.dig.at(k), s.slot.at(d - 1), {color: 'violet', height: 0.8}); });
    s.dup = api.marks(s.slot.at(4), ['•', '•'], {dir: 'front', color: 'red'});
    s.yes = api.label(L('все 8 ячеек — по одной отметке: «да»', 'all 8 boxes ticked once: yes'), s.slot.at(7), {color: 'green'});
    s.no = api.label(L('в ячейке 5 две отметки, ячейка 4 пуста: «нет»', 'box 5 ticked twice, box 4 empty: no'), s.slot.at(4), {color: 'red'});
    return s;
  },
  step: function(api, s, i){
    // i: 0 empty boxes, 1 ticks (not used), 2 all ticked — yes, 3 18365572 — no
    var neg = i === 3, on = i >= 1;
    s.dig.at(5).setText(neg ? 5 : 4);
    s.dig.each(function(t, k){ t.color(neg && k === 5 ? 'red' : i === 2 ? 'green' : on ? 'violet' : 'plain', {delay: on && !neg ? k*220 : 0}); });
    s.slot.each(function(t, k){
      var when = s.D.indexOf(k + 1), bad = neg && (k === 3 || k === 4);
      t.color(bad ? 'red' : i === 0 ? 'dim' : 'green', {delay: on && !bad ? when*220 + 350 : 0});
      t.lift(bad || i === 2 ? 0.25 : 0, {delay: i === 2 ? k*60 : 0});
      s.marks[k].show(on && !bad ? 1 : 0, {delay: on ? when*220 + 350 : 0});
    });
    s.links.forEach(function(a, k){ vis(a, on && !neg && i < 2, {delay: k*220}); });
    s.dup.show(neg ? 2 : 0, {delay: 400});
    s.yes.show(i === 2, {delay: 2100});
    s.no.show(neg, {delay: 700});
  }
}, {
  solveMap: [0, 2, 3],
  naive: 64, method: 8, quant: 8, fmt: qm, countMs: 8*230,
  nLabel: {ru: 'сравнений цифр', en: 'digit comparisons'},
  nNote: function(v, L){ var k = v/8; return k + ' ' + L(pl(k, 'цифра', 'цифры', 'цифр'), pl(k, 'digit', 'digits')) + L(' × 8 мест', ' × 8 places'); },
  mLabel: {ru: 'отметок', en: 'ticks'},
  solve: [[0, 'отметок пока нет', 'no ticks yet'], [8, '8 цифр × 1 отметка', '8 digits × 1 tick'], [6, '6-я отметка — в занятую ячейку', 'the 6th tick hits a ticked box']],
  counter: [8.6, 0, -1.2],
  build: function(api, s){
    var L = api.L, X = {scan: []};
    s.dig.each(function(t){ X.scan.push(api.arc(s.slot.at(4), t, {color: 'red', height: 0.45, dashed: true})); });
    X.wall = api.label(L('ищем 5: просматриваем все 8 мест — и так для каждой цифры', 'looking for 5: all 8 places — and so for every digit'), s.slot.at(4), {color: 'red'});
    X.idea = api.label(L('цифра 8 — сразу в ячейку 8', 'the digit 8 goes straight to box 8'), s.slot.at(7), {color: 'violet'});
    return X;
  },
  pre: function(api, s, X, k, j){
    if(j < 0){
      s.slot.each(function(t, n){ t.color(k === 0 ? 'amber' : k === 1 && n === 7 ? 'violet' : 'dim', {delay: k === 0 ? 200 + n*230 : 0}); t.lift(k === 1 && n === 7 ? 0.3 : 0); });
      s.dig.each(function(t, n){ t.color(k === 0 ? 'red' : k === 1 && n === 1 ? 'violet' : 'plain'); });
      vis(s.links[1], k === 1, {delay: 200}); s.links[1].color('violet');
    }
    X.scan.forEach(function(a, n){ vis(a, k === 0, {delay: 1100 + n*80}); });
    X.wall.show(k === 0, {delay: 1300});
    X.idea.show(k === 1, {delay: 400});
  }
});

/* ================= ChampernowneConstant: the digit in 12th place of 123456789101112… ================= */
chap({
  id: 'ChampernowneConstant',
  view: {yaw: 0.08, pitch: 1.0, fill: 0.94},
  build: function(api){
    var L = api.L, s = {}, V = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 0, '?', 1, 1, 2];
    s.row = api.row(V, {gap: 0.82, size: 0.72, h: 0.28});
    s.more = T(api, '…', [s.row.pos(14)[0] + 0.8, 0, 0], 0.6, 'plain', 'left');
    s.pos = V.map(function(v, k){ return T(api, String(k + 1), [s.row.pos(k)[0], 0, -0.85], 0.42, 'plain'); });
    s.posT = T(api, L('место', 'place'), [s.row.pos(0)[0] - 0.6, 0, -0.85], 0.46, 'plain', 'right');
    s.cnt = [0, 1, 2].map(function(k){ return T(api, String(k + 1), [s.row.pos(9 + k)[0], 0, -1.7], 0.5, 'violet'); });
    s.br = api.bracket(s.row.at(0), s.row.at(8), {color: 'ink', text: '', dz: 0.75, half: 0.36});
    s.l12 = api.label(L('12-е место', '12th place'), s.row.at(11), {color: 'blue'});
    return s;
  },
  step: function(api, s, i){
    // i: 0 start, 1 skip the one-digit block, 2 the number 11
    var L = api.L;
    s.row.each(function(t, k){
      var c = 'plain', l = 0, d = 0;
      if(k === 11) c = i === 2 ? 'green' : 'blue';
      if(i === 1){ if(k < 9){ c = 'dim'; d = k*40; } else if(k <= 11){ c = k === 11 ? 'blue' : 'violet'; d = 400 + (k - 9)*250; } }
      if(i === 2){ if(k < 9) c = 'dim'; else if(k === 9 || k === 10) c = 'teal'; else if(k === 12) c = 'violet'; }
      if(k === 11 && i === 2) l = 0.3;
      t.color(c, {delay: d}); t.lift(l, {delay: i === 2 ? 600 : 0});
    });
    s.row.at(11).setText(i === 2 ? 1 : '?', {delay: i === 2 ? 600 : 0});
    s.cnt.forEach(function(t, k){ vis(t, i === 1, {delay: 400 + k*250}); });
    s.pos.forEach(function(t, k){ t.color(k === 11 ? 'blue' : 'plain'); });
    s.br.fadeIn();
    if(i === 0){ s.br.set(s.row.at(0), s.row.at(8)); s.br.setText(L('однозначные: 9 мест', 'one-digit: 9 places')); s.br.color('ink'); }
    else if(i === 1){ s.br.set(s.row.at(0), s.row.at(8), {delay: 200}); s.br.setText(L('перескакиваем: 12 − 9 = 3', 'skip them: 12 − 9 = 3'), {delay: 200}); s.br.color('violet'); }
    else { s.br.set(s.row.at(11), s.row.at(12), {delay: 200}); s.br.setText(L('число 11', 'the number 11'), {delay: 200}); s.br.color('green'); }
    s.l12.to(s.row.at(11)); s.l12.setText(i === 2 ? L('12-е место: цифра 1', '12th place: the digit 1') : L('12-е место', '12th place'));
    s.l12.color(i === 2 ? 'green' : 'blue'); s.l12.show(i !== 1);
  }
}, {
  solveMap: [1, 2],
  naive: 12, method: 2, fmt: qm, countMs: 12*140,
  nLabel: {ru: 'выписанных цифр', en: 'digits written'},
  nNote: function(v, L){ return v <= 9 ? v + L(' (числа 1…' + v + ')', ' (numbers 1…' + v + ')') : '9 + ' + (v === 10 ? '1' : '2') + (v === 12 ? ' + 1' : ''); },
  mLabel: {ru: 'действий', en: 'operations'},
  solve: [[1, 'вычитание 12 − 9', 'subtraction 12 − 9'], [2, '+ деление на 2 цифры', '+ division by 2 digits']],
  counter: [10.2, 0, -1.2],
  pre: function(api, s, X, k, j){
    if(j < 0){
      s.row.each(function(t, n){
        var c = k === 0 ? (n <= 11 ? 'red' : 'dim') : k === 1 ? (n < 9 ? 'violet' : n === 11 ? 'blue' : 'plain') : n === 11 ? 'blue' : 'plain';
        t.color(c, {delay: k === 0 ? 200 + n*140 : 0});
      });
      if(k === 0) s.br.fadeOut();
      else { s.br.set(s.row.at(0), s.row.at(8)); s.br.setText(k === 1 ? api.L('однозначные 1…9: ровно 9 мест', 'one-digit 1…9: exactly 9 places') : api.L('однозначные: 9 мест', 'one-digit: 9 places')); s.br.color(k === 1 ? 'violet' : 'ink'); }
      s.l12.show(k !== 1);
    }
  }
});

/* ================= DigitSumDivisibilityRule: numbers made of the digits 1…n, n = 1..9 ================= */
chap({
  id: 'DigitSumDivisibilityRule',
  view: {yaw: 0.1, pitch: 0.95, fill: 0.9},
  build: function(api){
    var L = api.L, s = {}, N = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    s.S = N.map(function(n){ return n*(n + 1)/2; });
    s.R = s.S.map(function(v){ return v % 3; });
    s.H = s.S.map(function(v){ return 0.2 + 2.0*v/45; });
    s.n = api.row(N, {pos: [0, 0, 1.3], gap: 1.2, size: 0.9, h: 0.34});
    s.nT = T(api, L('длина n', 'length n'), [-5.9, 0, 1.3], 0.5, 'plain', 'right');
    s.sumT = T(api, L('сумма цифр', 'digit sum'), [-5.9, 0, -1.1], 0.5, 'teal', 'right');
    s.bars = N.map(function(n, k){ return api.tile(s.S[k], {pos: [s.n.pos(k)[0], 0, -1.1], size: 0.8, h: s.H[k], color: 'teal'}); });
    s.cnt = [1, 2, 6, 24, 120, 720, 5040, 40320, 362880].map(function(v, k){ return api.badge(F(v), {pos: [s.n.pos(k)[0], 0, 2.5 + (k % 2)*0.6], color: 'red'}); });
    s.cntT = T(api, L('чисел этой длины', 'numbers of this length'), [-5.9, 0, 2.8], 0.46, 'red', 'right');
    s.drop = api.label(L('сумма делится на 3 — вся длина отпадает', 'the sum divides by 3 — the whole length drops out'), s.n.at(2), {color: 'red'});
    s.keep = api.label(L('остаются n = 4 и n = 7: 24 + 5040', 'n = 4 and n = 7 remain: 24 + 5040'), s.n.at(6), {color: 'green'});
    return s;
  },
  step: function(api, s, i){
    // i: 0 start, 1 digit sums, 2 divisible by 3 dropped, 3 lengths 4 and 7
    s.n.each(function(t, k){
      var r = s.R[k], c = 'plain', l = 0, d = i === 2 ? 400 + k*120 : 0;
      if(i === 2) c = r ? 'green' : 'red';
      if(i === 2 && k === 0) c = 'amber';
      if(i === 3){ c = (k === 3 || k === 6) ? 'green' : 'dim'; l = (k === 3 || k === 6) ? 0.3 : 0; }
      t.color(c, {delay: d}); t.lift(l); t.strike(i >= 2 && (r === 0 || k === 0), {delay: d});
    });
    s.bars.forEach(function(t, k){
      var d = i === 1 ? k*120 : 0;
      vis(t, i >= 1, {delay: d}); t.height(i >= 1 ? s.H[k] : 0.05, {delay: d});
      t.color(i >= 2 && (s.R[k] === 0 || k === 0) ? 'red' : i === 3 && !(k === 3 || k === 6) ? 'dim' : 'teal');
    });
    vis(s.sumT, i >= 1);
    s.cnt.forEach(function(b, k){ if(i === 3 && (k === 3 || k === 6)) b.fadeIn({delay: 300}); else b.fadeOut(); });
    vis(s.cntT, i === 3);
    s.drop.show(i === 2, {delay: 800});
    s.keep.show(i === 3, {delay: 600});
  }
}, {
  solveMap: [1, 2, 3],
  naive: 409113, method: 5064, fmt: qm, countMs: 2000,
  nLabel: {ru: 'чисел на проверку', en: 'numbers to test'},
  nNote: function(v, L){ return '1 + 2 + 6 + … + ' + F(362880); },
  mLabel: {ru: 'чисел после отсева', en: 'numbers after the test'},
  solve: [[409113, 'пока ни одна длина не отброшена', 'no length dropped yet'], [5064, 'остались длины 4 и 7', 'lengths 4 and 7 remain'], [5064, '24 + 5040', '24 + 5040']],
  counter: [10.0, 0, -0.8],
  build: function(api, s){
    var L = api.L, X = {};
    X.wall = api.label(L('всего 409 113 чисел', '409,113 numbers in all'), s.cnt[8], {color: 'red'});
    X.ex = api.label(L('1234, 2143, 4321, …: у всех сумма цифр 10', '1234, 2143, 4321, …: every digit sum is 10'), s.n.at(3), {color: 'violet'});
    return X;
  },
  pre: function(api, s, X, k, j){
    if(j < 0){
      s.n.each(function(t, n){ t.color(k === 0 ? 'red' : k === 1 && n === 3 ? 'violet' : 'plain', {delay: k === 0 ? 200 + n*200 : 0}); t.lift(k === 1 && n === 3 ? 0.3 : 0); });
      s.cnt.forEach(function(b, n){ if(k === 0) b.fadeIn({delay: 200 + n*200}); else b.fadeOut(); });
      vis(s.cntT, k === 0);
    }
    X.wall.show(k === 0, {delay: 2000});
    X.ex.show(k === 1, {delay: 400});
  }
});

})();

# Project Euler

C++ solutions to the [Project Euler](https://projecteuler.net/) problem set, as posed on the
[HackerRank Project Euler track](https://www.hackerrank.com/contests/projecteuler).

Each problem lives in its own directory under [`problems/`](problems/) (`problems/euler001`,
`problems/euler002`, ...) with a single `solution.cpp`. Solutions read multiple test cases from
`stdin` — first line is the number of cases `T`, followed by `T` lines of input — and print one
answer per line.

## Build & run

```
g++ -O2 -std=c++20 -o solution problems/eulerNNN/solution.cpp && ./solution < input.txt
```

## Methods workshop

An interactive 3D walkthrough of the 60 solving methods catalogued in [`memory-bank/`](memory-bank/):
each method plays out as problem → idea → solution → comparison → properties, in English or Russian.

Open it: <https://esurvanov.github.io/project-euler/methods-lab/> (source: [`methods-lab/`](methods-lab/)).

## Problems

| # | Problem | Status |
|---|---|---|
| [001](problems/euler001) | Multiples of 3 and 5 | Accepted, 100% |
| [002](problems/euler002) | Even Fibonacci numbers | Accepted, 100% |
| [003](problems/euler003) | Largest prime factor | Accepted, 100% |
| [004](problems/euler004) | Largest palindrome product | Accepted, 100% |
| [005](problems/euler005) | Smallest multiple | Accepted, 100% |
| [006](problems/euler006) | Sum square difference | Accepted, 100% |
| [007](problems/euler007) | 10001st prime | Accepted, 100% |
| [008](problems/euler008) | Largest product in a series | Accepted, 100% |
| [009](problems/euler009) | Special Pythagorean triplet | Accepted, 100% |
| [010](problems/euler010) | Summation of primes | Accepted, 100% |
| [011](problems/euler011) | Largest product in a grid | Accepted, 100% |
| [012](problems/euler012) | Highly divisible triangular number | Accepted, 100% |
| [013](problems/euler013) | Large sum | Accepted, 100% |
| [014](problems/euler014) | Longest Collatz sequence | Accepted, 100% |
| [015](problems/euler015) | Lattice paths | Accepted, 100% |
| [016](problems/euler016) | Power digit sum | Accepted, 100% |
| [017](problems/euler017) | Number to Words | Accepted, 100% |
| [018](problems/euler018) | Maximum path sum I | Accepted, 100% |
| [019](problems/euler019) | Counting Sundays | Accepted, 100% |
| [020](problems/euler020) | Factorial digit sum | Accepted, 100% |
| [021](problems/euler021) | Amicable numbers | Accepted, 100% |
| [022](problems/euler022) | Names scores | Accepted, 100% |
| [023](problems/euler023) | Non-abundant sums | Accepted, 100% |
| [024](problems/euler024) | Lexicographic permutations | Accepted, 100% |
| [025](problems/euler025) | N-digit Fibonacci number | Accepted, 100% |
| [026](problems/euler026) | Reciprocal cycles | Accepted, 100% |
| [027](problems/euler027) | Quadratic primes | Accepted, 100% |
| [028](problems/euler028) | Number spiral diagonals | Accepted, 100% |
| [029](problems/euler029) | Distinct powers | Accepted, 100% |
| [030](problems/euler030) | Digit Nth powers | Accepted, 100% |
| [031](problems/euler031) | Coin sums | Accepted, 100% |
| [032](problems/euler032) | Pandigital products | Accepted, 100% |
| [033](problems/euler033) | Digit canceling fractions | Accepted, 100% |
| [034](problems/euler034) | Digit factorials | Accepted, 100% |
| [035](problems/euler035) | Circular primes | Accepted, 100% |
| [036](problems/euler036) | Double-base palindromes | Accepted, 100% |
| [037](problems/euler037) | Truncatable primes | Accepted, 100% |
| [038](problems/euler038) | Pandigital multiples | Accepted, 100% |
| [039](problems/euler039) | Integer right triangles | Accepted, 100% |
| [040](problems/euler040) | Champernowne's constant | Accepted, 100% |
| [041](problems/euler041) | Pandigital prime | Accepted, 100% |
| [042](problems/euler042) | Coded triangle numbers | Accepted, 100% |
| [043](problems/euler043) | Sub-string divisibility | Accepted, 100% |
| [044](problems/euler044) | Pentagon numbers | Accepted, 100% |
| [045](problems/euler045) | Triangular, pentagonal, and hexagonal | Accepted, 100% |
| [046](problems/euler046) | Goldbach's other conjecture | Accepted, 100% |
| [047](problems/euler047) | Distinct primes factors | Accepted, 100% |
| [048](problems/euler048) | Self powers | Accepted, 100% |
| [049](problems/euler049) | Prime permutations | Accepted, 100% |
| [050](problems/euler050) | Consecutive prime sum | Accepted, 100% |
| [051](problems/euler051) | Prime digit replacements | Accepted, 100% |
| [052](problems/euler052) | Permuted multiples | Accepted, 100% |

Each problem's own directory README has the write-up — the approach, why it works, and (where one
exists) a picture of the idea — and links to its RFC-style spec (requirements and acceptance
criteria), which lives in [`memory-bank/specs/tasks/`](memory-bank/specs/tasks/). The format that
spec must follow is itself specified: see
[`memory-bank/specs/tasks.md`](memory-bank/specs/tasks.md). Shared write-ups that don't belong to
any single problem — the methods themselves, each with its own picture — live in
[`memory-bank/`](memory-bank/_terms.md).

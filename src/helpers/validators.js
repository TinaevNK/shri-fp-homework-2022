import {
  allPass,
  propEq,
  prop,
  compose,
  equals,
  all,
  countBy,
  lte,
  apply,
  values,
  omit,
  trim,
  complement,
  converge,
  not,
  propSatisfies,
  props,
  count,
} from "ramda";

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

// цвета
const isWhite = equals("white");
const isGreen = equals("green");
const isRed = equals("red");
const isBlue = equals("blue");
const isOrange = equals("orange");
// фигуры
const circle = prop("circle");
const star = prop("star");
const square = prop("square");
const triangle = prop("triangle");

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
  propSatisfies(isGreen, "square"),
  propSatisfies(isRed, "star"),
  compose(all(isWhite), props(["triangle", "circle"])),
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(lte(2), count(isGreen), values);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (props) =>
  equals(
    compose(count(isBlue), values)(props),
    compose(count(isRed), values)(props)
  );

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
  compose(isBlue, circle),
  compose(isRed, star),
  compose(isOrange, square),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(
  lte(3),
  apply(Math.max),
  values,
  omit(["white"]),
  countBy(trim),
  values,
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
const isTriangleGreen = propEq("triangle", "green");
const colorsCount = compose(countBy(trim), values);
const greens2AndRed1 = compose(
  allPass([propEq("green", 2), propEq("red", 1)]),
  colorsCount
);
export const validateFieldN6 = allPass([isTriangleGreen, greens2AndRed1]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(all(isOrange), values);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([
  complement(propEq("star", "white")),
  complement(propEq("star", "red")),
]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(all(isGreen), values);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
  converge(equals, [triangle, square]),
  compose(not, isWhite, triangle),
  compose(not, isWhite, square),
]);

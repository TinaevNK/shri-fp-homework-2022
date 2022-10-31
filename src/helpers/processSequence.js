import {
  allPass,
  compose,
  gt,
  match,
  not,
  prop,
  when,
  lt,
  tap,
  partialRight,
  otherwise,
  andThen,
  tryCatch,
} from "ramda";
import Api from "../tools/api";

const api = new Api();

const getLength = prop("length");
const getMessage = prop("message");
const getResult = prop("result");

const parseValueToInt = compose(Math.round, parseFloat);

const isValid = allPass([
  compose(lt(2), getLength),
  compose(gt(10), getLength),
  match(/^[0-9]*\.?[0-9]*$/g),
  compose(lt(0), parseValueToInt),
]);

const pow = partialRight(Math.pow, [2]);
const divideByThree = (x) => x % 3;

const throwValidationError = () => {
  throw new Error("ValidationError");
};

const validateValue = when(compose(not, isValid), throwValidationError);

const getAnimal = (value) => api.get(`https://animals.tech/${value}`, {});
const convertToBinary = (value) =>
  api.get("https://api.tech/numbers/base", { from: 10, to: 2, number: value });

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const handleErrorMessage = compose(handleError, getMessage);

  const processBinaryValue = compose(
    tap(writeLog),
    divideByThree,
    tap(writeLog),
    pow,
    tap(writeLog),
    getLength,
    tap(writeLog),
    getResult
  );

  const handleResultSuccess = compose(handleSuccess, getResult);

  const processValue = compose(
    otherwise(handleError),
    andThen(handleResultSuccess),
    andThen(getAnimal),
    andThen(processBinaryValue),
    convertToBinary,
    tap(writeLog),
    parseValueToInt,
    tap(validateValue),
    tap(writeLog)
  );

  const processSafe = tryCatch(processValue, handleErrorMessage);
  processSafe(value);
};

export default processSequence;

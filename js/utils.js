export function getRandomInteger(min, max) {
  // both min and max should be Integers
  // Math.random() gives random number [0, 1)
  let range = max - min;
  let randomInRange = Math.floor((range + 1) * Math.random());
  let randomNumber = Math.floor(min + randomInRange);
  return randomNumber;
}

export function getRandomTrueFalse() {
  let randomNumber = Math.random();
  if (randomNumber < 0.5) {
    return true;
  } else {
    return false;
  }
}

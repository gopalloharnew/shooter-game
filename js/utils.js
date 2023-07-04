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

export function getDistanceBetween(obj1, obj2) {
  return Math.hypot(
    obj1.position.x - obj2.position.x,
    obj1.position.y - obj2.position.y
  );
}

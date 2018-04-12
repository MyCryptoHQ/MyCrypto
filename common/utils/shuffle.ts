export default function shuffle(array: any[]) {
  const finalArray = [...array];

  if (finalArray.length === 0 || finalArray.length === 1) {
    return finalArray;
  }

  while (finalArray.toString() === array.toString()) {
    // Fisher-Yates shuffle
    for (let i = finalArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalArray[i], finalArray[j]] = [finalArray[j], finalArray[i]];
    }
  }

  return finalArray;
}

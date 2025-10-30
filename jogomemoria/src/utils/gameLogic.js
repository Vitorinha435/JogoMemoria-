const EMOJIS = [
  "🍎", "🍌", "🍇", "🍉", "🍓", "🍒", "🍑", "🍍", "🥝", "🥭",
  "🥥", "🍅", "🍆", "🥑", "🥦", "🥬", "🌶️", "🌽", "🥕", "🥔",
  "🍠", "🥐", "🍞", "🥨", "🧀", "🥚", "🍳", "🥞", "🧇", "🥓",
  "🥩", "🍗", "🍖", "🦴", "🌭", "🍔", "🍟", "🍕", "🥪", "🥙",
  "🧆", "🌮", "🌯", "🥗", "🥘", "🥫", "🍝", "🍜", "🍲", "🍛",
  "🍣", "🍱", "🥟", "🍤", "🍙", "🍚", "🍘", "🍥", "🥠", "🥮",
  "🍢", "🍡", "🍧", "🍨", "🍦", "🥧", "🧁", "🍰", "🎂", "🍮",
  "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🌰", "🥜", "🍯", "🥛",
  "🍼", "☕", "🍵", "🧃", "🥤", "🍶", "🍺", "🍻", "🥂", "🍷",
  "🥃", "🍸", "🍹", "🧉", "🍾", "🧊", "🥄", "🍴", "🍽️", "🥣",
  "🥡", "🥢", "🧂",
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const getNumPairsForLevel = (level) => {
  return level + 1;
};

export const getGridDimensions = (level) => {
  const numPairs = getNumPairsForLevel(level);
  const totalCards = numPairs * 2;
  let cols = Math.ceil(Math.sqrt(totalCards));
  let rows = Math.ceil(totalCards / cols);
  while (rows * cols < totalCards) {
    cols++;
    rows = Math.ceil(totalCards / cols);
  }
  return { rows, cols };
};

export const generateCards = (level) => {
  const numPairs = getNumPairsForLevel(level);
  const numCards = numPairs * 2;
  console.log(
    `Generating cards for level ${level}: ${numPairs} pairs, ${numCards} total cards.`
  );
  let selectedEmojis;
  if (numPairs > EMOJIS.length) {
    console.warn(
      `Não há emojis suficientes (${EMOJIS.length}) para ${numPairs} pares no nível ${level}!`
    );
    const neededEmojis = [];
    let emojisCopy = [...EMOJIS];
    for (let i = 0; i < numPairs; i++) {
      if (emojisCopy.length === 0) emojisCopy = [...EMOJIS];
      neededEmojis.push(emojisCopy.pop());
    }
    selectedEmojis = shuffleArray(neededEmojis);
  } else {
    selectedEmojis = shuffleArray([...EMOJIS]).slice(0, numPairs);
  }
  const cardPairs = selectedEmojis.flatMap((emoji, index) => [
    {
      id: `${level}-${index}a`,
      content: emoji,
      isFlipped: false,
      isMatched: false,
    },
    {
      id: `${level}-${index}b`,
      content: emoji,
      isFlipped: false,
      isMatched: false,
    },
  ]);
  const shuffledCards = shuffleArray(cardPairs);
  console.log(
    "Generated cards:",
    shuffledCards.map((c) => ({ id: c.id, content: c.content }))
  );
  return shuffledCards;
};

export const getTimeLimit = (level) => {
  const numPairs = getNumPairsForLevel(level);
  const baseTimePerPair = 5;
  const baseTime = 10;
  return numPairs * baseTimePerPair + baseTime;
};

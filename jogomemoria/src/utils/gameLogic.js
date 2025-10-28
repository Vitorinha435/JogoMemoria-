// src/utils/gameLogic.js

const EMOJIS = [
  "🍎",
  "🍌",
  "🍇",
  "🍉",
  "🍓",
  "🍒",
  "🍑",
  "🍍",
  "🥝",
  "🥭",
  "🥥",
  "🍅",
  "🍆",
  "🥑",
  "🥦",
  "🥬",
  "🌶️",
  "🌽",
  "🥕",
  "🥔",
  "🍠",
  "🥐",
  "🍞",
  "🥨",
  "🧀",
  "🥚",
  "🍳",
  "🥞",
  "🧇",
  "🥓",
  "🥩",
  "🍗",
  "🍖",
  "🦴",
  "🌭",
  "🍔",
  "🍟",
  "🍕",
  "🥪",
  "🥙",
  "🧆",
  "🌮",
  "🌯",
  "🥗",
  "🥘",
  "🥫",
  "🍝",
  "🍜",
  "🍲",
  "🍛",
  "🍣",
  "🍱",
  "🥟",
  "🍤",
  "🍙",
  "🍚",
  "🍘",
  "🍥",
  "🥠",
  "🥮",
  "🍢",
  "🍡",
  "🍧",
  "🍨",
  "🍦",
  "🥧",
  "🧁",
  "🍰",
  "🎂",
  "🍮",
  "🍭",
  "🍬",
  "🍫",
  "🍿",
  "🍩",
  "🍪",
  "🌰",
  "🥜",
  "🍯",
  "🥛",
  "🍼",
  "☕",
  "🍵",
  "🧃",
  "🥤",
  "🍶",
  "🍺",
  "🍻",
  "🥂",
  "🍷",
  "🥃",
  "🍸",
  "🍹",
  "🧉",
  "🍾",
  "🧊",
  "🥄",
  "🍴",
  "🍽️",
  "🥣",
  "🥡",
  "🥢",
  "🧂",
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Define o número de pares para cada nível, seguindo N x N (N par).
 * Nível 1: 2x2 = 4 cartas = 2 pares
 * Nível 2: 4x4 = 16 cartas = 8 pares
 * Nível 3: 6x6 = 36 cartas = 18 pares
 * ... e assim por diante
 * @param {number} level O nível do jogo.
 * @returns {number} O número de pares de cartas.
 */
const getNumPairsForLevel = (level) => {
  const dimension = level * 2; // Nível 1 -> 2x2, Nível 2 -> 4x4, Nível 3 -> 6x6
  return (dimension * dimension) / 2; // Total de cartas / 2
};

// --- Função getGridDimensions adicionada para ajudar o GameBoard ---
/**
 * Retorna as dimensões do grid para um determinado nível.
 * @param {number} level O nível do jogo.
 * @returns {{rows: number, cols: number}} As dimensões do grid.
 */
export const getGridDimensions = (level) => {
  const dimension = level * 2; // Nível 1 -> 2, Nível 2 -> 4, Nível 3 -> 6
  return { rows: dimension, cols: dimension };
};
// --- Fim da função adicionada ---

export const generateCards = (level) => {
  const numPairs = getNumPairsForLevel(level);
  const numCards = numPairs * 2;

  console.log(
    `Generating cards for level ${level}: ${numPairs} pairs, ${numCards} total cards.`
  );

  if (numPairs > EMOJIS.length) {
    console.warn(
      `Não há emojis suficientes (${EMOJIS.length}) para ${numPairs} pares no nível ${level}!`
    );
    // Poderia retornar um erro ou limitar os emojis
    // Por enquanto, vamos usar emojis repetidos se necessário
    const neededEmojis = [];
    let emojisCopy = [...EMOJIS];
    for (let i = 0; i < numPairs; i++) {
      if (emojisCopy.length === 0) emojisCopy = [...EMOJIS]; // Reinicia se acabarem os emojis
      neededEmojis.push(emojisCopy.pop());
    }
    const selectedEmojis = shuffleArray(neededEmojis);

    // return []; // Descomente se preferir parar o jogo
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
  // Ajuste a fórmula do tempo como preferir
  // Exemplo: 5 segundos por par + 10 segundos base, aumentando a dificuldade
  const baseTimePerPair = 5;
  const baseTime = 10;
  return numPairs * baseTimePerPair + baseTime;
};

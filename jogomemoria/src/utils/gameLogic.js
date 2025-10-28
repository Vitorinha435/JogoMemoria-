// src/utils/gameLogic.js

// Lista de emojis/ícones para as cartas 
const EMOJIS = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍑', '🍍', '🥝', '🥭', '🥥', '🍅', '🍆', '🥑', '🥦', '🥬', '🌶️', '🌽', '🥕', '🥔', '🍠', '🥐', '🍞', '🥨', '🧀', '🥚', '🍳', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🍵', '🧃', '🥤', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾', '🧊', '🥄', '🍴', '🍽️', '🥣', '🥡', '🥢', '🧂'];

/**
 * Embaralha um array usando o algoritmo Fisher-Yates.
 * @param {Array} array O array a ser embaralhado.
 * @returns {Array} O array embaralhado.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Troca elementos
  }
  return array;
}

/**
 * Gera o conjunto de cartas para um determinado nível.
 * @param {number} level O nível do jogo.
 * @returns {Array} Um array de objetos representando as cartas.
 */
export const generateCards = (level) => {
  // Define o tamanho do tabuleiro com base no nível 
  // Nível 1: 2x2 = 4 cartas (2 pares)
  // Nível 2: 4x4 = 16 cartas (8 pares)
  // Nível 3: 4x4 = 16 cartas (8 pares) - Vamos manter 4x4 por enquanto ou aumentar gradualmente
  // Nível 4: 6x6 = 36 cartas (18 pares)
  let gridSize = 2 + Math.floor((level -1) / 2) * 2; // Ex: 1->2, 2->4, 3->4, 4->6
  if (gridSize > 6) gridSize = 6; // Limitar a 6x6 por enquanto
  const numCards = gridSize * gridSize;
  const numPairs = numCards / 2;

  if (numPairs > EMOJIS.length) {
    console.warn("Não há emojis suficientes para este nível!");
    // Poderia retornar um erro ou um array menor
    return [];
  }

  // Seleciona emojis aleatórios
  const selectedEmojis = shuffleArray([...EMOJIS]).slice(0, numPairs);

  // Cria os pares de cartas
  const cardPairs = selectedEmojis.flatMap((emoji, index) => [
    { id: `${index}a`, content: emoji, isFlipped: false, isMatched: false },
    { id: `${index}b`, content: emoji, isFlipped: false, isMatched: false },
  ]);

  // Embaralha as cartas finais [cite: 10]
  return shuffleArray(cardPairs);
};

/**
 * Calcula o tempo limite para o nível (exemplo simples).
 * @param {number} level Nível atual.
 * @returns {number} Tempo em segundos.
 */
export const getTimeLimit = (level) => {
    let gridSize = 2 + Math.floor((level - 1) / 2) * 2;
    if (gridSize > 6) gridSize = 6;
    return (gridSize * gridSize) * 2 + 30;
}
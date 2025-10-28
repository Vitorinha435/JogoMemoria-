// src/components/GameBoard.js
import React from "react";
import { View, StyleSheet } from "react-native"; // 1. Remova o 'Dimensions'
import Card from "./Card";

// 2. Defina as constantes de tamanho (DEVEM SER AS MESMAS DO Card.js)
const CARD_WIDTH = 80;
const CARD_MARGIN = 5;
const CONTAINER_PADDING = 10; // O padding do 'boardContainer'

const GameBoard = ({ cards, onCardPress, isDisabled, level }) => {
  // 3. Lógica para colunas (esta linha dá 2 colunas para o Nível 1)
  let numColumns = 2 + Math.floor((level - 1) / 2) * 2;
  if (numColumns > 6) numColumns = 6;

  // 4. (Remova todos os cálculos de screenWidth, cardWidth, cardHeight)

  // 5. Calcule a LARGURA DO TABULEIRO
  const cardTotalWidth = CARD_WIDTH + CARD_MARGIN * 2;
  const boardWidth = numColumns * cardTotalWidth + CONTAINER_PADDING * 2;

  return (
    // 6. Aplique a 'boardWidth' calculada ao container
    //    Isso força o 'flexWrap' a funcionar após o número correto de colunas.
    <View style={[styles.boardContainer, { width: boardWidth }]}>
      {cards.map((card) => (
        // 7. Renderize o Card simples, sem passar a prop 'style'
        <Card
          key={card.id}
          card={card}
          onPress={onCardPress}
          isDisabled={isDisabled}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    padding: CONTAINER_PADDING, // 10
  },
});

export default GameBoard;

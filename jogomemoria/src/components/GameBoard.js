import React from "react";
import { View, StyleSheet } from "react-native";
import Card from "./Card";

const CARD_WIDTH = 80;
const CARD_MARGIN = 5;
const CONTAINER_PADDING = 10;

const GameBoard = ({ cards, onCardPress, isDisabled, level }) => {
  let numColumns = 2 + Math.floor((level - 1) / 2) * 2;
  if (numColumns > 6) numColumns = 6;

  const cardTotalWidth = CARD_WIDTH + CARD_MARGIN * 2;
  const boardWidth = numColumns * cardTotalWidth + CONTAINER_PADDING * 2;

  return (
    <View style={[styles.boardContainer, { width: boardWidth }]}>
      {cards.map((card) => (
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
    padding: CONTAINER_PADDING,
  },
});

export default GameBoard;

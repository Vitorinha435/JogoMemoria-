// src/components/GameBoard.js
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Card from './Card';

const GameBoard = ({ cards, onCardPress, isDisabled, level }) => {
  // Calcula o número de colunas baseado no nível
  let numColumns = 2 + Math.floor((level -1) / 2) * 2;
  if (numColumns > 6) numColumns = 6;

  // Calcula a largura da carta para caber na tela
  const screenWidth = Dimensions.get('window').width;
  const cardMargin = 5;
  const totalMargin = (numColumns + 1) * cardMargin * 2;
  const cardWidth = (screenWidth - totalMargin) / numColumns;
  // Ajusta a altura proporcionalmente (exemplo)
  const cardHeight = cardWidth * 1.33;

  return (
    <View style={[styles.boardContainer, { width: screenWidth }]}>
      {cards.map((card) => (
        <View key={card.id} style={{ width: cardWidth + cardMargin * 2, height: cardHeight + cardMargin * 2}}>
             {/* Ajusta o tamanho e margem do Card diretamente */}
             <Card
                card={card}
                onPress={onCardPress}
                isDisabled={isDisabled}
                style={{ width: cardWidth, height: cardHeight, margin: cardMargin }} // Passa estilo para o Card se ele aceitar
             />
         </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});

export default GameBoard;
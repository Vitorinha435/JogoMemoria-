// src/components/Card.js
import React, { useRef, useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet, Animated } from "react-native";

const Card = ({ card, onPress, isDisabled }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  useEffect(() => {
    // Animação ao virar ou desvirar
    Animated.timing(animatedValue, {
      // Usando Animated.timing [cite: 33]
      toValue: card.isFlipped || card.isMatched ? 180 : 0,
      duration: 300, // Duração da animação
      useNativeDriver: true, // Melhora performance
    }).start();
  }, [card.isFlipped, card.isMatched]);

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };
  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  const handlePress = () => {
    if (!isDisabled && !card.isFlipped && !card.isMatched) {
      onPress(card.id);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.cardContainer}
      disabled={isDisabled || card.isFlipped || card.isMatched}
    >
      {/* Frente da Carta (Oculta) */}
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        <Text style={styles.cardText}>{card.content}</Text>
      </Animated.View>
      {/* Verso da Carta (Visível inicialmente) */}
      <Animated.View
        style={[styles.card, styles.cardFront, frontAnimatedStyle]}
      >
        <Text style={styles.cardText}>?</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 60, // Ajuste o tamanho conforme necessário
    height: 80, // Ajuste o tamanho conforme necessário
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden", // Importante para a animação de virada
    position: "absolute", // Permite sobrepor frente e verso
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cardFront: {
    backgroundColor: "#4a90e2", // Cor do verso
  },
  cardBack: {
    backgroundColor: "#f0f0f0", // Cor da frente
  },
  cardText: {
    fontSize: 24, // Tamanho do emoji/texto
  },
});

export default Card;

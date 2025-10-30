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
    Animated.timing(animatedValue, {
      toValue: card.isFlipped || card.isMatched ? 180 : 0,
      duration: 300,
      useNativeDriver: true,
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
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        <Text style={styles.cardText}>{card.content}</Text>
      </Animated.View>
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
    width: 80,
    height: 100,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
    position: "absolute",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cardFront: {
    backgroundColor: "#4a90e2",
  },
  cardBack: {
    backgroundColor: "#f0f0f0",
  },
  cardText: {
    fontSize: 24,
  },
});

export default Card;

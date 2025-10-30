import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GameBoard from "../components/GameBoard";
import { generateCards, getTimeLimit } from "../utils/gameLogic";

const LEVEL_KEY = "currentLevel";
const HIGHSCORE_KEY_PREFIX = "highscore_level_";

const GameScreen = ({ setCurrentScreen, playerName, startLevel }) => {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isChecking, setIsChecking] = useState(false);
  const [highScore, setHighScore] = useState(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isLevelComplete, setIsLevelComplete] = useState(false);

  const timerIntervalRef = useRef(null);

  const setupLevel = async (currentLevel) => {
    console.log(`Setting up Level ${currentLevel}`);
    const newCards = generateCards(currentLevel);
    const timeLimit = getTimeLimit(currentLevel);
    setCards(newCards);
    setTimeLeft(timeLimit);
    setAttempts(0);
    setFlippedCards([]);
    setMatchedPairs(0);
    setIsChecking(false);
    setIsTimeUp(false);
    setIsLevelComplete(false);
    await loadHighScore(currentLevel);
    startTimer();
  };

  useEffect(() => {
    const loadProgress = async () => {
      let currentLevel = 1;
      if (startLevel === 1) {
        await AsyncStorage.setItem(LEVEL_KEY, '1');
      } else {
        try {
          const savedLevel = await AsyncStorage.getItem(LEVEL_KEY);
          if (savedLevel !== null) {
            currentLevel = parseInt(savedLevel, 10);
          }
        } catch (e) {
          console.error("Failed to load level.", e);
        }
      }
      setLevel(currentLevel);
      setupLevel(currentLevel);
    };
    loadProgress();

    return () => stopTimer();
  }, [startLevel]);

  const startTimer = () => {
    stopTimer();
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          stopTimer();
          handleTimeOut();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const handleTimeOut = () => {
    setIsTimeUp(true);
    Alert.alert("Tempo Esgotado!", "Tente novamente.", [
      { text: "OK", onPress: () => setupLevel(level) },
    ]);
  };

  const loadHighScore = async (currentLevel) => {
    try {
      const scoreData = await AsyncStorage.getItem(
        `${HIGHSCORE_KEY_PREFIX}${currentLevel}`
      );
      if (scoreData !== null) {
        const { score } = JSON.parse(scoreData);
        setHighScore(score);
      } else {
        setHighScore(null);
      }
    } catch (e) {
      console.error("Failed to load high score.", e);
      setHighScore(null);
    }
  };

  const saveHighScore = async (currentLevel, currentAttempts) => {
    try {
      const scoreData = await AsyncStorage.getItem(
        `${HIGHSCORE_KEY_PREFIX}${currentLevel}`
      );

      let currentHighScore = null;
      if (scoreData) {
        try {
          const parsedData = JSON.parse(scoreData);
          currentHighScore = parsedData.score;
        } catch (e) {
          currentHighScore = parseInt(scoreData, 10);
        }
      }

      if (currentHighScore === null || currentAttempts < currentHighScore) {
        const newScore = {
          score: currentAttempts,
          player: playerName || "Anônimo",
        };
        await AsyncStorage.setItem(
          `${HIGHSCORE_KEY_PREFIX}${currentLevel}`,
          JSON.stringify(newScore)
        );
        setHighScore(currentAttempts);
        console.log(
          `Novo recorde para Nível ${currentLevel}: ${currentAttempts} tentativas por ${newScore.player}.`
        );
      }
    } catch (e) {
      console.error("Failed to save high score.", e);
    }
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true);
      setAttempts((prev) => prev + 1);
      const [firstCardId, secondCardId] = flippedCards;
      const firstCard = cards.find((c) => c.id === firstCardId);
      const secondCard = cards.find((c) => c.id === secondCardId);

      if (firstCard.content === secondCard.content) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstCardId || card.id === secondCardId
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatchedPairs((prev) => prev + 1);
        setFlippedCards([]);
        setIsChecking(false);
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstCardId || card.id === secondCardId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    const totalPairs = cards.length / 2;
    console.log(
      `Verificando conclusão do nível: Pares encontrados=${matchedPairs}, Total de pares=${totalPairs}`
    );
    if (totalPairs > 0 && matchedPairs === totalPairs) {
      stopTimer();
      console.log(`Nível ${level} completo em ${attempts} tentativas!`);
      setIsLevelComplete(true);
    }
  }, [matchedPairs, cards.length, level, attempts]);

  const handleNextLevelClick = async () => {
    await saveHighScore(level, attempts);
    const nextLevel = level + 1;
    try {
      await AsyncStorage.setItem(LEVEL_KEY, String(nextLevel));
    } catch (e) {
      console.error("Failed to save level.", e);
    }
    setLevel(nextLevel);
    setupLevel(nextLevel);
  };

  const handleCardPress = (cardId) => {
    if (
      flippedCards.length < 2 &&
      !isChecking &&
      !isTimeUp &&
      !isLevelComplete
    ) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, isFlipped: true } : card
        )
      );
      setFlippedCards((prev) => [...prev, cardId]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Nível: {level}</Text>
        <Text style={styles.headerText}>Tempo: {timeLeft}s</Text>
        <Text style={styles.headerText}>Tentativas: {attempts}</Text>
      </View>
      {highScore !== null && (
        <Text style={styles.highscoreText}>
          Recorde Nível {level}: {highScore} tentativas
        </Text>
      )}

      {isLevelComplete && (
        <View style={styles.completionContainer}>
          <Text style={styles.completionText}>
            Parabéns! Nível {level} completo em {attempts} tentativas!
          </Text>
          <Button title="Próximo Nível" onPress={handleNextLevelClick} />
        </View>
      )}

      {!isLevelComplete && (
        <GameBoard
          cards={cards}
          onCardPress={handleCardPress}
          isDisabled={
            isChecking ||
            flippedCards.length === 2 ||
            isTimeUp ||
            isLevelComplete
          }
          level={level}
        />
      )}

      <View style={styles.bottomButton}>
        <Button title="Voltar Menu" onPress={() => setCurrentScreen("Menu")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  highscoreText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 15,
  },
  completionContainer: {
    alignItems: "center",
    marginVertical: 20,
    padding: 15,
    backgroundColor: "#e0ffe0",
    borderRadius: 8,
    width: "80%",
  },
  completionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  bottomButton: {
    marginTop: 20,
    width: "60%",
  },
});

export default GameScreen;

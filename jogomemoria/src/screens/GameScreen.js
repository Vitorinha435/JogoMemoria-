// src/screens/GameScreen.js
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; //
import GameBoard from "../components/GameBoard"; // Importa o componente real
import { generateCards, getTimeLimit } from "../utils/gameLogic";

// Constantes para AsyncStorage
const LEVEL_KEY = "currentLevel";
const HIGHSCORE_KEY_PREFIX = "highscore_level_";

const GameScreen = ({ setCurrentScreen }) => {
  const [level, setLevel] = useState(1); // Nível inicial
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]); // Guarda IDs das cartas viradas temporariamente
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // Será ajustado pelo nível [cite: 12]
  const [isChecking, setIsChecking] = useState(false); // Para desabilitar cliques durante a verificação
  const [highScore, setHighScore] = useState(null); // Menor número de tentativas [cite: 22]

  const timerIntervalRef = useRef(null);

  // Função para iniciar/reiniciar um nível
  const setupLevel = async (currentLevel) => {
    console.log(`Setting up Level ${currentLevel}`);
    const newCards = generateCards(currentLevel);
    const timeLimit = getTimeLimit(currentLevel); // Pega o tempo do utils [cite: 34]
    setCards(newCards);
    setTimeLeft(timeLimit);
    setAttempts(0);
    setFlippedCards([]);
    setMatchedPairs(0);
    setIsChecking(false);
    await loadHighScore(currentLevel); // Carrega o recorde para o nível atual
    startTimer();
  };

  // Carregar progresso ao iniciar [cite: 11, 21]
  useEffect(() => {
    const loadProgress = async () => {
      let currentLevel = 1;
      try {
        const savedLevel = await AsyncStorage.getItem(LEVEL_KEY);
        if (savedLevel !== null) {
          currentLevel = parseInt(savedLevel, 10);
        }
      } catch (e) {
        console.error("Failed to load level.", e);
      }
      setLevel(currentLevel);
      setupLevel(currentLevel); // Inicia o jogo no nível carregado/inicial
    };
    loadProgress();

    // Limpa o timer ao desmontar
    return () => stopTimer();
  }, []);

  // Iniciar timer
  const startTimer = () => {
    stopTimer(); // Garante que não haja timers duplicados
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

  // Parar timer
  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Lidar com o fim do tempo [cite: 12]
  const handleTimeOut = () => {
    Alert.alert("Tempo Esgotado!", "Tente novamente.", [
      { text: "OK", onPress: () => setupLevel(level) },
    ]);
  };

  // Carregar recorde para o nível
  const loadHighScore = async (currentLevel) => {
    try {
      const score = await AsyncStorage.getItem(
        `${HIGHSCORE_KEY_PREFIX}${currentLevel}`
      );
      setHighScore(score !== null ? parseInt(score, 10) : null);
    } catch (e) {
      console.error("Failed to load high score.", e);
      setHighScore(null);
    }
  };

  // Salvar recorde para o nível
  const saveHighScore = async (currentLevel, currentAttempts) => {
    try {
      const currentHighScore = await AsyncStorage.getItem(
        `${HIGHSCORE_KEY_PREFIX}${currentLevel}`
      );
      if (
        currentHighScore === null ||
        currentAttempts < parseInt(currentHighScore, 10)
      ) {
        await AsyncStorage.setItem(
          `${HIGHSCORE_KEY_PREFIX}${currentLevel}`,
          String(currentAttempts)
        );
        setHighScore(currentAttempts); // Atualiza o estado
        console.log(
          `Novo recorde para Nível ${currentLevel}: ${currentAttempts} tentativas.`
        );
      }
    } catch (e) {
      console.error("Failed to save high score.", e);
    }
  };

  // Lógica de verificação de pares
  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true); // Bloqueia cliques
      setAttempts((prev) => prev + 1); // Incrementa tentativas [cite: 11]
      const [firstCardId, secondCardId] = flippedCards;
      const firstCard = cards.find((c) => c.id === firstCardId);
      const secondCard = cards.find((c) => c.id === secondCardId);

      if (firstCard.content === secondCard.content) {
        // Par encontrado
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstCardId || card.id === secondCardId
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatchedPairs((prev) => prev + 1);
        setFlippedCards([]);
        setIsChecking(false); // Libera cliques
      } else {
        // Pares diferentes, desvira após um tempo
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstCardId || card.id === secondCardId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setIsChecking(false); // Libera cliques
        }, 1000); // Tempo para visualizar as cartas erradas
      }
    }
  }, [flippedCards, cards]);

  // Lógica de conclusão do nível [cite: 14]
  useEffect(() => {
    const totalPairs = cards.length / 2;
    if (totalPairs > 0 && matchedPairs === totalPairs) {
      stopTimer(); // Para o timer
      // TODO: Exibir animação de vitória
      Alert.alert(
        "Parabéns!",
        `Nível ${level} completo em ${attempts} tentativas!`,
        [
          {
            text: "Próximo Nível",
            onPress: async () => {
              await saveHighScore(level, attempts); // Salva recorde antes de avançar
              const nextLevel = level + 1;
              try {
                await AsyncStorage.setItem(LEVEL_KEY, String(nextLevel)); // Salva progresso [cite: 11]
              } catch (e) {
                console.error("Failed to save level.", e);
              }
              setLevel(nextLevel);
              setupLevel(nextLevel); // Configura o próximo nível
            },
          },
        ]
      );
    }
  }, [matchedPairs, cards.length, level, attempts]);

  // Função chamada quando uma carta é pressionada
  const handleCardPress = (cardId) => {
    if (flippedCards.length < 2 && !isChecking) {
      // Vira a carta
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, isFlipped: true } : card
        )
      );
      // Adiciona ao array de cartas viradas
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
      <GameBoard
        cards={cards}
        onCardPress={handleCardPress}
        isDisabled={isChecking || flippedCards.length === 2}
        level={level}
      />
      <Button title="Voltar Menu" onPress={() => setCurrentScreen("Menu")} />
      {/* Botão de teste para completar nível pode ser removido */}
      {/* <Button title="Completar Nível (Mock)" onPress={handleGameComplete} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start", // Alinha ao topo para header
    paddingTop: 50, // Espaço no topo
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
});

export default GameScreen;

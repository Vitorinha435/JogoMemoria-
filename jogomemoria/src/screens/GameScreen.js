// src/screens/GameScreen.js
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native"; // Mantemos Alert caso precisemos dele para outras coisas
import AsyncStorage from "@react-native-async-storage/async-storage";
import GameBoard from "../components/GameBoard";
import { generateCards, getTimeLimit } from "../utils/gameLogic";

// Constantes para AsyncStorage
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
  const [isLevelComplete, setIsLevelComplete] = useState(false); // <<< Novo estado para mostrar o botão

  const timerIntervalRef = useRef(null);

  // Função para iniciar/reiniciar um nível
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
    setIsLevelComplete(false); // <<< Reseta o estado de nível completo
    await loadHighScore(currentLevel);
    startTimer();
  };

  // Carregar progresso ao iniciar
  useEffect(() => {
    const loadProgress = async () => {
      let currentLevel = 1;
      if (startLevel === 1) {
        // Se for um novo jogo, reseta o nível salvo
        await AsyncStorage.setItem(LEVEL_KEY, '1');
      } else {
        // Tenta carregar o nível salvo para continuar
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

  // Iniciar timer
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

  // Parar timer
  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Lidar com o fim do tempo
  const handleTimeOut = () => {
    setIsTimeUp(true);
    Alert.alert("Tempo Esgotado!", "Tente novamente.", [
      // Mantemos o Alert aqui, mas você pode mudar se quiser
      { text: "OK", onPress: () => setupLevel(level) },
    ]);
  };

  // Carregar recorde para o nível
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

  // Salvar recorde para o nível
  const saveHighScore = async (currentLevel, currentAttempts) => {
    try {
      const scoreData = await AsyncStorage.getItem(
        `${HIGHSCORE_KEY_PREFIX}${currentLevel}`
      );
      const currentHighScore = scoreData ? JSON.parse(scoreData).score : null;

      if (currentHighScore === null || currentAttempts < currentHighScore) {
        const newScore = {
          score: currentAttempts,
          player: playerName,
        };
        await AsyncStorage.setItem(
          `${HIGHSCORE_KEY_PREFIX}${currentLevel}`,
          JSON.stringify(newScore)
        );
        setHighScore(currentAttempts);
        console.log(
          `Novo recorde para Nível ${currentLevel}: ${currentAttempts} tentativas por ${playerName}.`
        );
      }
    } catch (e) {
      console.error("Failed to save high score.", e);
    }
  };

  // Lógica de verificação de pares (sem alterações aqui)
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

  // Lógica de conclusão do nível - <<< MODIFICADA <<<
  useEffect(() => {
    const totalPairs = cards.length / 2;
    console.log(
      `Verificando conclusão do nível: Pares encontrados=${matchedPairs}, Total de pares=${totalPairs}`
    );
    if (totalPairs > 0 && matchedPairs === totalPairs) {
      stopTimer();
      console.log(`Nível ${level} completo em ${attempts} tentativas!`); // Log para indicar conclusão
      setIsLevelComplete(true); // <<< Seta o estado para mostrar o botão
      // <<< O Alert foi removido daqui <<<
    }
    // As dependências originais são mantidas, mas a lógica dentro mudou.
  }, [matchedPairs, cards.length, level, attempts]);

  // <<< Nova função para o clique do botão "Próximo Nível" <<<
  const handleNextLevelClick = async () => {
    await saveHighScore(level, attempts);
    const nextLevel = level + 1;
    try {
      await AsyncStorage.setItem(LEVEL_KEY, String(nextLevel));
    } catch (e) {
      console.error("Failed to save level.", e);
    }
    setLevel(nextLevel);
    setupLevel(nextLevel); // Configura e inicia o próximo nível
  };

  // Função chamada quando uma carta é pressionada
  const handleCardPress = (cardId) => {
    // Só permite virar se o nível não estiver completo E o tempo não tiver acabado
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

      {/* Mensagem de Conclusão e Botão Próximo Nível (condicional) */}
      {isLevelComplete && (
        <View style={styles.completionContainer}>
          <Text style={styles.completionText}>
            Parabéns! Nível {level} completo em {attempts} tentativas!
          </Text>
          <Button title="Próximo Nível" onPress={handleNextLevelClick} />
        </View>
      )}

      {/* O Tabuleiro do Jogo só é mostrado se o nível NÃO estiver completo */}
      {!isLevelComplete && (
        <GameBoard
          cards={cards}
          onCardPress={handleCardPress}
          // Desabilitado durante checagem, se 2 cartas viradas, se tempo acabou OU se nível completo
          isDisabled={
            isChecking ||
            flippedCards.length === 2 ||
            isTimeUp ||
            isLevelComplete
          }
          level={level}
        />
      )}

      {/* Botão Voltar Menu - pode ser mostrado sempre ou condicionalmente */}
      {/* {!isLevelComplete && ( // Exemplo: Esconder quando nível completo */}
      <View style={styles.bottomButton}>
        <Button title="Voltar Menu" onPress={() => setCurrentScreen("Menu")} />
      </View>
      {/* )} */}
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
  // <<< Estilos para a mensagem e botão de próximo nível <<<
  completionContainer: {
    alignItems: "center",
    marginVertical: 20,
    padding: 15,
    backgroundColor: "#e0ffe0", // Um fundo verde claro
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
  // <<< Estilo para posicionar o botão Voltar Menu (opcional) <<<
  bottomButton: {
    marginTop: 20, // Ajuste conforme necessário
    width: "60%",
  },
});

export default GameScreen;

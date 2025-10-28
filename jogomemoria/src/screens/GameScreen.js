// src/screens/GameScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
// import AsyncStorage from '@react-native-async-storage/async-storage'; // [cite: 11, 32]
// import GameBoard from '../components/GameBoard'; // Você precisará criar este

// Mock GameBoard
const GameBoard = ({ level }) => (
  <View>
    <Text>Tabuleiro Nível {level} (Mock)</Text>
  </View>
);
// --- Fim Mock ---

const GameScreen = ({ setCurrentScreen }) => {
  const [level, setLevel] = useState(1); // Começa no nível 1
  const [timeLeft, setTimeLeft] = useState(60); // Exemplo de tempo [cite: 12]
  const [attempts, setAttempts] = useState(0);
  // Adicione estados para as cartas, pares encontrados, etc. [cite: 31]

  // Efeito para carregar o nível salvo ao montar a tela [cite: 11, 21]
  useEffect(() => {
    const loadProgress = async () => {
      // try {
      //   const savedLevel = await AsyncStorage.getItem('currentLevel');
      //   if (savedLevel !== null) {
      //     setLevel(parseInt(savedLevel, 10));
      //   }
      // } catch (e) {
      //   console.error("Failed to load level.", e);
      // }
      console.log("Carregando progresso (mock)... Nível atual:", level); // Mock
    };
    loadProgress();
  }, []);

  // Efeito para o temporizador [cite: 12, 34]
  useEffect(() => {
    if (timeLeft <= 0) {
      // Lógica de fim de jogo por tempo (recomeçar nível) [cite: 12]
      console.log("Tempo esgotado! Reiniciando nível (mock)...");
      // resetLevel(); // Função para reiniciar
      setTimeLeft(60); // Reinicia timer (exemplo)
      return;
    }

    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Limpa o intervalo quando o componente desmonta ou o tempo acaba
    return () => clearInterval(timerInterval);
  }, [timeLeft]);

  const handleGameComplete = () => {
    console.log("Nível Completo! Indo para o próximo (mock)...");
    // Lógica de vitória [cite: 14]
    // Salvar progresso
    // try {
    //   await AsyncStorage.setItem('currentLevel', String(level + 1));
    // } catch (e) {
    //   console.error("Failed to save level.", e);
    // }
    setLevel((prevLevel) => prevLevel + 1); // Avança para o próximo nível
    setTimeLeft(60); // Reinicia o timer para o próximo nível (exemplo)
    setAttempts(0); // Reinicia tentativas
  };

  // Lógica para virar cartas, verificar pares, incrementar tentativas...

  return (
    <View style={styles.container}>
      <Text>Nível: {level}</Text>
      <Text>Tempo: {timeLeft}</Text>
      <Text>Tentativas: {attempts}</Text>
      <GameBoard
        level={level} /* Passe props necessárias: cartas, onCardPress, etc. */
      />
      {/* Botões temporários para teste */}
      <Button title="Completar Nível (Mock)" onPress={handleGameComplete} />
      <Button title="Voltar Menu" onPress={() => setCurrentScreen("Menu")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});

export default GameScreen; // Não esqueça de exportar

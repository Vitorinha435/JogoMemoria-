// App.js
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native"; // Mantenha Text se precisar dele em algum lugar

// Importe as telas reais que você criou
import MenuScreen from "./src/screens/MenuScreen";
import GameScreen from "./src/screens/GameScreen";
import ScoreScreen from "./src/screens/ScoreScreen";

// Remova os Mocks
// const MenuScreen = ...
// const GameScreen = ...
// const ScoreScreen = ...

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("Menu");
  const [playerName, setPlayerName] = useState("");
  const [gameKey, setGameKey] = useState(0); // Para forçar a remontagem do GameScreen
  const [startLevel, setStartLevel] = useState(null); // null para continuar, 1 para novo jogo

  const handleStartGame = (level) => {
    setStartLevel(level);
    setCurrentScreen("Game");
    setGameKey(prevKey => prevKey + 1); // Muda a chave para remontar o GameScreen
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "Game":
        return (
          <GameScreen
            key={gameKey}
            setCurrentScreen={setCurrentScreen}
            playerName={playerName}
            startLevel={startLevel}
          />
        );
      case "Score":
        return <ScoreScreen setCurrentScreen={setCurrentScreen} />;
      case "Menu":
      default:
        return (
          <MenuScreen
            setCurrentScreen={setCurrentScreen}
            setPlayerName={setPlayerName}
            playerName={playerName}
            onStartGame={handleStartGame}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems e justifyContent podem ser removidos daqui se cada tela controlar seu layout
  },
});

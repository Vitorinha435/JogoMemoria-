import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";

import MenuScreen from "./src/screens/MenuScreen";
import GameScreen from "./src/screens/GameScreen";
import ScoreScreen from "./src/screens/ScoreScreen";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("Menu");
  const [playerName, setPlayerName] = useState("");
  const [gameKey, setGameKey] = useState(0);
  const [startLevel, setStartLevel] = useState(null);

  const handleStartGame = (level) => {
    setStartLevel(level);
    setCurrentScreen("Game");
    setGameKey(prevKey => prevKey + 1);
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
  },
});

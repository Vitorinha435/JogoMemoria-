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
  const [currentScreen, setCurrentScreen] = useState("Menu"); // Estado para controlar a tela atual ('Menu', 'Game', 'Score')

  const renderScreen = () => {
    switch (currentScreen) {
      case "Game":
        // Passa a função para poder voltar ao menu
        return <GameScreen setCurrentScreen={setCurrentScreen} />;
      case "Score":
        // Passa a função para poder voltar ao menu
        return <ScoreScreen setCurrentScreen={setCurrentScreen} />;
      case "Menu":
      default:
        // Passa a função para navegar para outras telas
        return <MenuScreen setCurrentScreen={setCurrentScreen} />;
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

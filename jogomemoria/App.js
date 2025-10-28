// App.js
import React, 'useState'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

// Importe as telas que você criará
// import MenuScreen from './src/screens/MenuScreen';
// import GameScreen from './src/screens/GameScreen';
// import ScoreScreen from './src/screens/ScoreScreen';

// Mock Screens (substitua pelos imports reais quando criá-los)
const MenuScreen = ({ setCurrentScreen }) => <View style={styles.container}><Text onPress={() => setCurrentScreen('Game')}>Ir para Jogo (Mock)</Text></View>;
const GameScreen = ({ setCurrentScreen }) => <View style={styles.container}><Text onPress={() => setCurrentScreen('Menu')}>Ir para Menu (Mock)</Text></View>;
const ScoreScreen = ({ setCurrentScreen }) => <View style={styles.container}><Text onPress={() => setCurrentScreen('Menu')}>Ir para Menu (Mock)</Text></View>;
// --- Fim Mocks ---

import { Text } from 'react-native'; // Adicionado para os mocks

export default function App() {
  // Estado para controlar a tela atual ('Menu', 'Game', 'Score') [cite: 16]
  const [currentScreen, setCurrentScreen] = useState('Menu');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Game':
        return <GameScreen setCurrentScreen={setCurrentScreen} />;
      case 'Score':
        return <ScoreScreen setCurrentScreen={setCurrentScreen} />;
      case 'Menu':
      default:
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
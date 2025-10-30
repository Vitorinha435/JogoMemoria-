// src/screens/MenuScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert } from 'react-native';

const MenuScreen = ({ setCurrentScreen, setPlayerName, playerName }) => {
  const handleStartGame = () => {
    if (playerName.trim() === '') {
      Alert.alert('Nome Inválido', 'Por favor, digite um nome para iniciar.');
      return;
    }
    setCurrentScreen('Game');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogo da Memória</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={playerName}
        onChangeText={setPlayerName}
      />

      <View style={styles.buttonContainer}>
        <Button title="Iniciar Jogo" onPress={handleStartGame} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Ver Recordes" onPress={() => setCurrentScreen('Score')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '80%',
    marginBottom: 20,
    borderRadius: 5,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '60%',
  },
});

export default MenuScreen;
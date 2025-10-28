// src/screens/MenuScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const MenuScreen = ({ setCurrentScreen }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogo da Memória</Text>
      <View style={styles.buttonContainer}>
        <Button title="Iniciar Jogo" onPress={() => setCurrentScreen('Game')} />
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
  buttonContainer: {
    marginVertical: 10,
    width: '60%',
  },
});

export default MenuScreen;
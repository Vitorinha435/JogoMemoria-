// src/screens/ScoreScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HIGHSCORE_KEY_PREFIX = 'highscore_level_';

const ScoreScreen = ({ setCurrentScreen }) => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadScores = async () => {
            setLoading(true);
            const loadedScores = [];
            try {
                const keys = await AsyncStorage.getAllKeys();
                const scoreKeys = keys.filter(key => key.startsWith(HIGHSCORE_KEY_PREFIX));
                const scorePairs = await AsyncStorage.multiGet(scoreKeys);

                scorePairs.forEach(([key, value]) => {
                    if (value !== null) {
                        const level = key.replace(HIGHSCORE_KEY_PREFIX, '');
                        try {
                            const { score, player } = JSON.parse(value);
                            loadedScores.push({ level: parseInt(level, 10), score, player });
                        } catch (e) {
                            loadedScores.push({ level: parseInt(level, 10), score: parseInt(value, 10), player: 'Anônimo' });
                        }
                    }
                });

                // Ordena por nível
                loadedScores.sort((a, b) => a.level - b.level);
                setScores(loadedScores);

            } catch (error) {
                console.error("Erro ao carregar recordes:", error);
                Alert.alert("Erro", "Não foi possível carregar os recordes.");
            } finally {
                setLoading(false);
            }
        };

        loadScores();
    }, []);

    const renderScoreItem = ({ item }) => (
        <View style={styles.scoreItem}>
            <Text style={styles.levelText}>Nível {item.level}:</Text>
            <Text style={styles.playerText}>{item.player}</Text>
            <Text style={styles.scoreText}>{item.score} tentativas</Text>
        </View>
    );

    const handleClearScores = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const scoreKeys = keys.filter(key => key.startsWith(HIGHSCORE_KEY_PREFIX));
            await AsyncStorage.multiRemove(scoreKeys);
            setScores([]); // Limpa a lista na tela
            Alert.alert("Recordes Limpos", "Todos os recordes foram removidos.");
        } catch (error) {
            console.error("Erro ao limpar recordes:", error);
            Alert.alert("Erro", "Não foi possível limpar os recordes.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recordes</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : scores.length > 0 ? (
                <FlatList
                    data={scores}
                    renderItem={renderScoreItem}
                    keyExtractor={(item) => item.level.toString()}
                    style={styles.list}
                />
            ) : (
                <Text>Nenhum recorde salvo ainda.</Text>
            )}

            <View style={styles.buttonContainer}>
                <Button title="Limpar Recordes" onPress={handleClearScores} color="#ff6347" />
            </View>
            <View style={styles.buttonContainer}>
               <Button title="Voltar ao Menu" onPress={() => setCurrentScreen('Menu')} />
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
        paddingTop: 60,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    list: {
        width: '100%',
    },
    scoreItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderColor: '#eee',
        width: '90%',
        alignSelf: 'center',
    },
    levelText: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    playerText: {
        fontSize: 18,
        flex: 2,
        textAlign: 'center',
    },
    scoreText: {
        fontSize: 18,
        flex: 1,
        textAlign: 'right',
    },
    buttonContainer: {
        marginTop: 30,
        width: '60%',
    }
});

export default ScoreScreen;
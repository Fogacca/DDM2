import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function Index() {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [dados, setDados] = useState({
    logradouro: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  const buscarCEP = async () => {
    const cepFormatado = cep.replace(/\D/g, '');

    if (cepFormatado.length !== 8) {
      Alert.alert('Erro', 'Digite 8 números.');
      return;
    }

    setLoading(true);
    Keyboard.dismiss();

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepFormatado}/json/`);
      const data = await response.json();

      if (data.erro) {
        Alert.alert('Aviso', 'CEP não encontrado.');
      } else {
        setDados({
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf
        });
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao buscar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Consultar CEP</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o CEP..."
        placeholderTextColor="#888"
        value={cep}
        onChangeText={setCep}
        keyboardType="numeric"
        maxLength={8}
      />

      <TouchableOpacity style={styles.button} onPress={buscarCEP}>
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>BUSCAR</Text>
        )}
      </TouchableOpacity>

      <View style={styles.results}>
        <Text style={styles.resultText}>Rua: {dados.logradouro}</Text>
        <Text style={styles.resultText}>Bairro: {dados.bairro}</Text>
        <Text style={styles.resultText}>Cidade: {dados.cidade}</Text>
        <Text style={styles.resultText}>Estado: {dados.estado}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Cinza escuro básico
    padding: 20,
    paddingTop: 60,
  },
  header: {
    color: '#FFF',
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFF',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  results: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 20,
  },
  resultText: {
    color: '#BBB',
    fontSize: 16,
    marginBottom: 10,
  },
});
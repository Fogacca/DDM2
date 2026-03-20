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
  View,
} from 'react-native';

const ESTADOS_BR = [
  { sigla: 'AC', nome: 'Acre' }, { sigla: 'AL', nome: 'Alagoas' }, { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' }, { sigla: 'BA', nome: 'Bahia' }, { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' }, { sigla: 'ES', nome: 'Espírito Santo' }, { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' }, { sigla: 'MT', nome: 'Mato Grosso' }, { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' }, { sigla: 'PA', nome: 'Pará' }, { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' }, { sigla: 'PE', nome: 'Pernambuco' }, { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' }, { sigla: 'RN', nome: 'Rio Grande do Norte' }, { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' }, { sigla: 'RR', nome: 'Roraima' }, { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' }, { sigla: 'SE', nome: 'Sergipe' }, { sigla: 'TO', nome: 'Tocantins' }
];

export default function Index() {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
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
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || ''
        });
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao buscar.');
    } finally {
      setLoading(false);
    }
  };

  const selecionarEstado = (sigla) => {
    setDados({ ...dados, estado: sigla });
    setShowDropdown(false);
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
        <Text style={styles.resultLabel}>Rua:</Text>
        <TextInput
          style={styles.inputEdit}
          value={dados.logradouro}
          onChangeText={(t) => setDados({ ...dados, logradouro: t })}
          placeholderTextColor="#888"
        />

        <Text style={styles.resultLabel}>Bairro:</Text>
        <TextInput
          style={styles.inputEdit}
          value={dados.bairro}
          onChangeText={(t) => setDados({ ...dados, bairro: t })}
          placeholderTextColor="#888"
        />

        <Text style={styles.resultLabel}>Cidade:</Text>
        <TextInput
          style={styles.inputEdit}
          value={dados.cidade}
          onChangeText={(t) => setDados({ ...dados, cidade: t })}
          placeholderTextColor="#888"
        />

        <Text style={styles.resultLabel}>Estado:</Text>
        <TouchableOpacity 
          style={styles.dropdownSelector} 
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={{ color: dados.estado ? '#FFF' : '#888' }}>
            {dados.estado ? dados.estado : "Selecione o estado"}
          </Text>
          <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{showDropdown ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showDropdown && (
          <View style={styles.dropdownList}>
            <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
              {ESTADOS_BR.map((item) => (
                <TouchableOpacity 
                  key={item.sigla} 
                  style={styles.dropdownItem} 
                  onPress={() => selecionarEstado(item.sigla)}
                >
                  <Text style={styles.dropdownText}>{item.nome} ({item.sigla})</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, 
    backgroundColor: '#121212', 
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
    paddingBottom: 40,
  },
  resultLabel: {
    color: '#BBB',
    fontSize: 14,
    marginBottom: 5,
  },
  inputEdit: {
    backgroundColor: '#1E1E1E',
    color: '#FFF',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 15,
  },
  dropdownSelector: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropdownList: {
    backgroundColor: '#1E1E1E',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333',
    marginTop: -5,
    marginBottom: 15,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  dropdownText: {
    color: '#FFF',
    fontSize: 14,
  },
});
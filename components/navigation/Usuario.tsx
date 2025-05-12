// components/Usuario.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface UsuarioProps {
  nombre: string;
}

const Usuario: React.FC<UsuarioProps> = ({ nombre }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Usuario: {nombre}</Text>
    </View>
  );
};

export default Usuario;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#28a745',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

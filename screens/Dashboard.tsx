import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/navigation/Header'; // Asegúrate que la ruta sea correcta

const DashboardScreen: React.FC = () => {
  const navigation: any = useNavigation();

  return (
    <View style={styles.screen}>
      <Header />

      
      <View style={styles.content}>
        <Text style={styles.title}>Panel de Inicio</Text>

        <View style={styles.cardContainer}>
          <Card
            title="Escanear productos"
            text="Escanea productos para vender o resgitrar al inventario."
            onPress={() => navigation.navigate('Escáner')}
          />
          <Card
            title="Inventario"
            text="Consulta y gestiona el stock de productos."
            onPress={() => navigation.navigate('Inventario')}
          />
          <Card
            title="Empleados"
            text="Consulta y gestiona los empleados."
            onPress={() => navigation.navigate('Empleados')}
          />
        </View>
      </View>
    </View>
  );
};

const Card = ({
  title,
  text,
  onPress,
}: {
  title: string;
  text: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardText}>{text}</Text>
    <Text style={styles.cardButton}>Ir a {title}</Text>
  </TouchableOpacity>
);

export default DashboardScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#212529',
  },
  cardContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#212529',
  },
  cardText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#495057',
  },
  cardButton: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: 'bold',
  },
});

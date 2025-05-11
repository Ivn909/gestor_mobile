import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header'; // Asegúrate que la ruta sea correcta

const DashboardScreen: React.FC = () => {
  const navigation: any = useNavigation();

  return (
    <View style={styles.screen}>
      {/* Encabezado personalizado con menú lateral */}
      <Header />

      {/* Contenido principal */}
      <View style={styles.content}>
        <Text style={styles.title}>Panel de Inicio</Text>

        <View style={styles.cardContainer}>
          <Card
            title="Ventas"
            text="Accede al punto de venta y realiza transacciones."
            onPress={() => navigation.navigate('POS')}
          />
          <Card
            title="Inventario"
            text="Consulta y gestiona el stock de productos."
            onPress={() => navigation.navigate('Inventory')}
          />
          <Card
            title="Reportes"
            text="Visualiza y crea informes de ventas y actividad."
            onPress={() => navigation.navigate('Reports')}
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

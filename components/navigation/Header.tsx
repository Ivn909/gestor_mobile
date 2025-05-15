import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;

const Header: React.FC = () => {
  const navigation: any = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.innerContent}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Gestor de Inventario</Text>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#28a745',
    height: screenHeight * 0.12, // 12% de la altura de pantalla
    width: '100%',
    justifyContent: 'flex-end', // contenido al fondo del header
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  innerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
});

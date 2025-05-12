import React, { useEffect, useState } from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { StyleSheet, View } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Usuario from './Usuario';

// Navegador raíz del stack
type RootStackParamList = {
  Login: undefined;
  MainDrawer: {
    screen: 'Inicio' | 'Inventario' | 'Escáner';
  };
};

const MenuLateral = (props: any) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState<string>('');

  const obtenerUsuario = async () => {
    const almacenado = await AsyncStorage.getItem('usuario');
    if (almacenado) setUsername(almacenado);
  };

  useEffect(() => {
    obtenerUsuario();
  }, []);

  const handleLogout = () => {
    AsyncStorage.removeItem('usuario');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>
      <Usuario nombre={username} />
      <View style={styles.menu}>
        <DrawerItem
          label="Inicio"
          onPress={() => navigation.navigate('MainDrawer', { screen: 'Inicio' })}
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          label="Inventario"
          onPress={() => navigation.navigate('MainDrawer', { screen: 'Inventario' })}
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          label="Escáner"
          onPress={() => navigation.navigate('MainDrawer', { screen: 'Escáner' })}
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          label="Cerrar sesión"
          onPress={handleLogout}
          labelStyle={styles.drawerLabel}
        />
      </View>
    </DrawerContentScrollView>
  );
};

export default MenuLateral;

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },
  menu: {
    marginTop: 15,
  },
  drawerLabel: {
    fontSize: 16,
    color: '#28a745',
  },
});

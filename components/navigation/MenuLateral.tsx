import React, { useEffect, useState } from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { StyleSheet, View, Image } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Usuario from './Usuario';

type RootStackParamList = {
  Login: undefined;
  MainDrawer: {
    screen: 'Inicio' | 'Inventario' | 'Escáner' | 'Empleados';
  };
};

const MenuLateral = (props: any) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState<string>('');

  const obtenerUsuario = async () => {
    const almacenado = await AsyncStorage.getItem('usuario');
    if (almacenado) {
      const usuario = JSON.parse(almacenado);
      setUsername(usuario.username);
    }
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
      <View style={styles.content}>
        <Usuario nombre={username} />
        <View style={styles.menu}>
          <DrawerItem
            label="Inicio"
            onPress={() => navigation.navigate('MainDrawer', { screen: 'Inicio' })}
            labelStyle={styles.drawerLabel}
          />
          <DrawerItem
            label="Escáner"
            onPress={() => navigation.navigate('MainDrawer', { screen: 'Escáner' })}
            labelStyle={styles.drawerLabel}
          />
          <DrawerItem
            label="Inventario"
            onPress={() => navigation.navigate('MainDrawer', { screen: 'Inventario' })}
            labelStyle={styles.drawerLabel}
          />
          <DrawerItem
            label="Empleados"
            onPress={() => navigation.navigate('MainDrawer', { screen: 'Empleados' })}
            labelStyle={styles.drawerLabel}
          />
          <DrawerItem
            label="Cerrar sesión"
            onPress={handleLogout}
            labelStyle={styles.drawerLabel}
          />
        </View>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/LOGO.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

export default MenuLateral;

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  menu: {
    marginTop: 10,
  },
  drawerLabel: {
    fontSize: 16,
    color: '#28a745',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: -10,
  },
  logo: {
    width: 320,
    height: 320,
  },
});

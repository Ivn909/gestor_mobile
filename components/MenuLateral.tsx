import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { StyleSheet } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

// Navegador raíz del stack
type RootStackParamList = {
  Login: undefined;
  MainDrawer: {
    screen: 'Dashboard' | 'Inventario' | 'Escánear';
  };
};

const MenuLateral = (props: any) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogout = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Dashboard"
        onPress={() => navigation.navigate('MainDrawer', { screen: 'Dashboard' })}
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
    </DrawerContentScrollView>
  );
};

export default MenuLateral;

const styles = StyleSheet.create({
  drawerLabel: {
    fontSize: 16,
    color: '#28a745',
  },
});

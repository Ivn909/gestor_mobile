// components/MenuLateral.tsx
import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { View, StyleSheet } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';

const MenuLateral = (props: any) => {
  const navigation = useNavigation();

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
      {/* Opciones del menú lateral */}
      <DrawerItem
        label="Inicio"
        onPress={() => navigation.navigate('Dashboard')}
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

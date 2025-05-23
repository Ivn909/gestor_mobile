import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { CommonActions, useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
  Login: undefined;
  MainDrawer: {
    screen: "Inicio" | "Inventario" | "Escáner" | "Empleados";
  };
};

const MenuLateral = (props: any) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const obtenerUsuario = async () => {
      const almacenado = await AsyncStorage.getItem("usuario");
      if (almacenado) {
        const usuario = JSON.parse(almacenado);
        setUsername(usuario.username || "");
      }
    };
    obtenerUsuario();
  }, []);

  const navegarA = (
    pantalla: "Inicio" | "Escáner" | "Inventario" | "Empleados"
  ) => {
    navigation.navigate("MainDrawer", { screen: pantalla });
  };

  const cerrarSesion = () => {
    Alert.alert("Cerrar sesión", "¿Seguro que deseas salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, salir",
        style: "destructive",
        onPress: () => {
          AsyncStorage.removeItem("usuario");
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Login" }],
            })
          );
        },
      },
    ]);
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <Image
          source={require("../../assets/LOGOH.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.username}>Usuario: {username}</Text>

      <View style={styles.menu}>
        <MenuItem
          label="Inicio"
          icon="home-outline"
          onPress={() => navegarA("Inicio")}
        />
        <MenuItem
          label="Escáner"
          icon="barcode-outline"
          onPress={() => navegarA("Escáner")}
        />
        <MenuItem
          label="Inventario"
          icon="cube-outline"
          onPress={() => navegarA("Inventario")}
        />
        <MenuItem
          label="Empleados"
          icon="people-outline"
          onPress={() => navegarA("Empleados")}
        />
      </View>

      <View style={styles.footer}>
        <MenuItem
          label="Cerrar sesión"
          icon="exit-outline"
          color="#dc3545"
          onPress={cerrarSesion}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const MenuItem = ({
  label,
  icon,
  onPress,
  color = "#333",
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
}) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Ionicons name={icon} size={22} color={color} style={styles.itemIcon} />
    <Text style={[styles.itemText, { color }]}>{label}</Text>
  </TouchableOpacity>
);

export default MenuLateral;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    marginBottom: 10, // ajusta si necesitas más compacto
  },
  logo: {
    width: 210,
    height: 120,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#28a745",
    paddingHorizontal: 20,
    marginTop: 0, // antes tenía 10
    marginBottom: 10,
  },
  menu: {
    marginTop: 0, // antes 20
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  itemIcon: {
    marginRight: 16,
  },
  itemText: {
    fontSize: 16,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: "#eee",
    marginTop: 370,
    paddingHorizontal: 20,
  },
});

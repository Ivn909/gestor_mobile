import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { SERVER_URL } from "../ServerConfig";
import { CommonActions, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      // 1. Iniciar sesión
      const res = await fetch(`${SERVER_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // importante para mantener la cookie de sesión
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // 2. Obtener los datos de sesión
        const sessionRes = await fetch(`${SERVER_URL}/api/auth/check-session`, {
          method: "GET",
          credentials: "include", // necesario para acceder a la cookie de sesión
        });

        const sessionData = await sessionRes.json();

        if (sessionRes.ok && sessionData.user) {
          const user = sessionData.user;
          const userRole = user.role;

          console.log("Rol del usuario:", userRole);

          // Guardamos al usuario en AsyncStorage para acceder en otras pantallas
          await AsyncStorage.setItem("usuario", JSON.stringify(user));

          Alert.alert("Inicio de sesión exitoso");
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "MainDrawer" }],
            })
          );
        } else {
          Alert.alert("Error", "No se pudo obtener la sesión del usuario");
        }
      } else {
        Alert.alert("Error", data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <TextInput
          placeholder="Ingrese su usuario"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Ingrese su contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <Button title="Entrar" onPress={handleLogin} color="#28a745" />
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#f8f9fa",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
});

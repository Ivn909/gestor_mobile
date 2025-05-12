import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native"; 

import Carrito from "../components/scanner/Carrito";
import Header from "../components/navigation/Header";

const Scanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused(); // 👈 Detecta si la pantalla está activa

  const [scannedData, setScannedData] = useState("");
  const [carrito, setCarrito] = useState<any[]>([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  // ✅ Solicitar permiso cada vez que la pantalla vuelve a estar enfocada
  useEffect(() => {
    if (isFocused && !permission?.granted) {
      requestPermission();
    }
  }, [isFocused]);

  const agregarAlCarrito = (producto: any) => {
    setCarrito((prev) => {
      const existente = prev.find((p) => p.id === producto.id);
      if (existente) {
        return prev.map((p) =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const onBarcodeScanned = async (result: any) => {
    if (scannedData || !isFocused) return;
    const codigo = result.data.trim();
    setScannedData(codigo);

    try {
      const res = await fetch(`http://66.179.92.207:3000/api/pos`); // Usa el mismo endpoint que el POS web
      const productos = await res.json();
      const producto = productos.find((p: any) => p.id === codigo);

      if (!producto) throw new Error("Producto no encontrado");

      agregarAlCarrito(producto);
      Alert.alert("Producto escaneado", producto.name, [
        { text: "OK", onPress: () => setScannedData("") },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        "No se encontró el producto o hubo un error",
        [{ text: "OK", onPress: () => setScannedData("") }]
      );
    }
  };

  return (
    <View style={styles.screen}>
      <Header />
      <View style={styles.container}>
        {permission?.granted && isFocused ? (
          <CameraView
            style={styles.camera}
            barcodeScannerSettings={{
              barcodeTypes: ["ean13", "code128", "ean8"],
            }}
            onBarcodeScanned={onBarcodeScanned}
          />
        ) : (
          <Text style={styles.noCameraText}>Cámara no disponible</Text>
        )}

        <TouchableOpacity
          style={styles.carritoBtn}
          onPress={() => setMostrarCarrito(true)}
        >
          <Ionicons name="cart-outline" size={32} color="white" />
        </TouchableOpacity>

        <Modal visible={mostrarCarrito} animationType="slide">
          <Carrito
            productos={carrito}
            setProductos={setCarrito}
            onClose={() => setMostrarCarrito(false)}
          />
        </Modal>
      </View>
    </View>
  );
};

export default Scanner;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  noCameraText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 100,
    fontSize: 16,
  },
  carritoBtn: {
    position: "absolute",
    bottom: 60,
    right: 20,
    backgroundColor: "#28a745",
    padding: 16,
    borderRadius: 50,
    elevation: 5,
  },
});

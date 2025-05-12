import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import Carrito from "../components/Carrito";
import Header from "../components/Header";

const Scanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState("");
  const [carrito, setCarrito] = useState<any[]>([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const agregarAlCarrito = (producto: any) => {
    setCarrito((prev) => {
      const existente = prev.find((p) => p.id === producto.id);
      if (existente) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const onBarcodeScanned = async (result: any) => {
  if (scannedData) return;
  const codigo = result.data.trim();
  setScannedData(codigo);

  try {
    const res = await fetch(`http://66.179.92.207:3000/api/pos`); // <-- como en POS.tsx
    const productos = await res.json();

    const producto = productos.find((p: any) => p.id === codigo);

    if (!producto) throw new Error("Producto no encontrado");

    agregarAlCarrito(producto);
    Alert.alert("Producto escaneado", producto.name, [
      { text: "OK", onPress: () => setScannedData("") },
    ]);
  } catch (error) {
    Alert.alert("Error", "No se encontró el producto o hubo un error", [
      { text: "OK", onPress: () => setScannedData("") },
    ]);
  }
};

  return (
    <View style={styles.screen}>
      <Header />
      <View style={styles.container}>
        {permission?.granted ? (
          <CameraView
            style={styles.camera}
            barcodeScannerSettings={{ barcodeTypes: ["ean13", "code128", "ean8"] }}
            onBarcodeScanned={onBarcodeScanned}
          />
        ) : (
          <Text>Permiso de cámara no concedido</Text>
        )}

        <TouchableOpacity style={styles.carritoBtn} onPress={() => setMostrarCarrito(true)}>
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
  carritoBtn: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#28a745",
    padding: 16,
    borderRadius: 50,
    elevation: 5,
  },
});

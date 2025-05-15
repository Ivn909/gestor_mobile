import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Vibration,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

import Carrito from "../components/scanner/Carrito";
import Header from "../components/navigation/Header";
import NewProductAlert from "../components/scanner/NewProductAlert";
import AddProductForm from "../components/scanner/AddProductForm";

const Scanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();

  const [scannedData, setScannedData] = useState("");
  const [carrito, setCarrito] = useState<any[]>([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarNuevoProducto, setMostrarNuevoProducto] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const puedeEscanearRef = useRef(true);

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
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const onBarcodeScanned = async (result: any) => {
    if (!puedeEscanearRef.current || !isFocused) return;
    puedeEscanearRef.current = false;

    const codigo = result.data.trim();
    setScannedData(codigo);

    try {
      const res = await fetch(`http://66.179.92.207:3000/api/pos`);
      const productos = await res.json();

      const producto = productos.find(
        (p: any) => String(p.id).trim() === codigo
      );

      if (!producto) {
        setMostrarNuevoProducto(true);
        return;
      }

      const productoConID = {
        ...producto,
        productID: producto.productID || producto.id,
      };

      agregarAlCarrito(productoConID);

      // ✅ Vibración breve
      Vibration.vibrate(100);

      Alert.alert("Producto escaneado", producto.name, [
        {
          text: "OK",
          onPress: () => {
            setScannedData("");
            puedeEscanearRef.current = true;
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "No se pudo escanear el producto");
      puedeEscanearRef.current = true;
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      {isFocused && permission?.granted && !mostrarFormulario && (
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8", "code39", "code128"],
          }}
          onBarcodeScanned={onBarcodeScanned}
        />
      )}

      <TouchableOpacity
        style={styles.carritoBtn}
        onPress={() => setMostrarCarrito(true)}
      >
        <Ionicons name="cart" size={28} color="white" />
      </TouchableOpacity>

      <Modal visible={mostrarCarrito} animationType="slide">
        <Carrito
          productos={carrito}
          setProductos={setCarrito}
          onClose={() => setMostrarCarrito(false)}
        />
      </Modal>

      <NewProductAlert
        visible={mostrarNuevoProducto}
        onCancel={() => {
          setMostrarNuevoProducto(false);
          setScannedData("");
          puedeEscanearRef.current = true;
        }}
        onRegister={() => {
          setMostrarNuevoProducto(false);
          setMostrarFormulario(true);
        }}
      />

      <AddProductForm
        visible={mostrarFormulario}
        onClose={() => {
          setMostrarFormulario(false);
          setScannedData("");
          puedeEscanearRef.current = true;
        }}
        barcode={scannedData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  carritoBtn: {
    position: "absolute",
    bottom: 60,
    right: 20,
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 30,
  },
});

export default Scanner;

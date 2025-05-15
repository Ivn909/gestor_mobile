import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

type Props = {
  visible: boolean;
  barcode: string;
  onClose: () => void;
};

const AddProductForm = ({ visible, barcode, onClose }: Props) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [codigo, setCodigo] = useState("");

  useEffect(() => {
    setCodigo(barcode); // ✅ precarga el código al abrir
  }, [barcode]);

  const handleSubmit = async () => {
    if (!name || !price || !codigo) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const res = await fetch("http://66.179.92.207:3000/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          barcode: codigo,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Producto agregado correctamente");
        onClose();
      } else {
        alert("Error al guardar producto");
      }
    } catch {
      alert("Error de conexión");
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Nuevo Producto</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre del producto"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Precio"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Código de barras"
          value={codigo}
          onChangeText={setCodigo}
          editable={false} // 👈 si quieres que lo puedan editar, cambia a true
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text style={styles.btnText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.save} onPress={handleSubmit}>
            <Text style={styles.btnText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddProductForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancel: {
    backgroundColor: "#6c757d",
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
  },
  save: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 6,
    flex: 1,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

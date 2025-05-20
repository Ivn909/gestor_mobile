import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const { height, width } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
  barcode: string;
};

type Category = {
  id: number;
  name: string;
};

const AddProductForm = ({ visible, onClose, barcode }: Props) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (visible) {
      setName("");
      setPrice("");
      setStock("");
      setCategory("");
      setDescription("");
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      fetch("http://66.179.92.207:3000/api/inventory/categories")
        .then((res) => res.json())
        .then((data: Category[]) => setCategories(data))
        .catch((err) => {
          console.error("Error al obtener categorías:", err);
          Alert.alert("Error", "No se pudieron cargar las categorías.");
        });
    }
  }, [visible]);

  const registrarProducto = async () => {
    try {
      const res = await fetch("http://66.179.92.207:3000/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Producto: name,
          CodigoBarras: barcode,
          Categoria: parseInt(category),
          Descripcion: description,
          Stock: parseInt(stock),
          Precio: parseFloat(price),
        }),
      });
      const data = await res.json();

      if (data.success) {
        Alert.alert("Éxito", "Producto registrado correctamente");
        onClose();
      } else {
        throw new Error(data.error || "Error desconocido");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <Text style={styles.title}>Registrar nuevo producto</Text>
        <ScrollView>
          <Text style={styles.label}>Código de Barras</Text>
          <TextInput style={styles.input} value={barcode.replace(/\s/g, "")} editable={false} />

          <Text style={styles.label}>Nombre</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.label}>Categoría</Text>
          <Picker
            selectedValue={category}
            onValueChange={(value) => setCategory(value)}
            style={styles.picker}
            itemStyle={styles.pickerItem} // 👈 Añadido
          >
            <Picker.Item label="Selecciona una categoría" value="" />
            {categories.map((cat) => (
              <Picker.Item
                key={cat.id}
                label={cat.name}
                value={String(cat.id)}
                color="#000" // 👈 Forzamos el color negro por si itemStyle no aplica en iOS
              />
            ))}
          </Picker>


          <Text style={styles.label}>Precio</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Stock</Text>
          <TextInput
            style={styles.input}
            value={stock}
            onChangeText={setStock}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
          />

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.saveButton} onPress={registrarProducto}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default AddProductForm;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: width,
    height: height * 0.8,
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 8,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 4,
  },
  buttonGroup: {
    marginTop: 30,
    gap: 12,
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  pickerItem: {
    color: "#000", // texto negro
    fontSize: 16,
  },

});

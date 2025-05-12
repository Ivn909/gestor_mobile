import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const { height, width } = Dimensions.get("window");

interface Product {
  ID: number;
  Name: string;
  Category: string;
  Stock: number | "";
  Price: number | "";
  Barcode?: string;
  Description?: string;
}

interface Category {
  id: number;
  name: string;
}

interface Props {
  product: Product;
  onChange: (product: Product) => void;
  onSubmit: () => void;
  onCancel: () => void;
  categories: Category[];
  mode: "edit" | "add";
}

const ProductForm: React.FC<Props> = ({
  product,
  onChange,
  onSubmit,
  onCancel,
  categories,
  mode,
}) => {
  const handleSubmit = () => {
    const message =
      mode === "add"
        ? "¿Estás seguro de agregar este producto?"
        : "¿Deseas guardar los cambios del producto?";
    Alert.alert("Confirmar", message, [
      { text: "Cancelar", style: "cancel" },
      { text: "Aceptar", onPress: onSubmit },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {mode === "add" ? "Agregar Producto" : "Editar Producto"}
      </Text>

      <ScrollView>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={product.Name}
          onChangeText={(text) => onChange({ ...product, Name: text })}
        />

        <Text style={styles.label}>Categoría</Text>
        <Picker
          selectedValue={product.Category}
          onValueChange={(value) => onChange({ ...product, Category: value })}
          style={styles.picker}
        >
          <Picker.Item label="Selecciona una categoría" value="" />
          {categories.map((cat) => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
          ))}
        </Picker>

        <Text style={styles.label}>Stock</Text>
        <TextInput
          style={styles.input}
          value={product.Stock.toString()}
          keyboardType="numeric"
          onChangeText={(text) =>
            onChange({
              ...product,
              Stock: text === "" ? "" : Number(text),
            })
          }
        />

        <Text style={styles.label}>Precio</Text>
        <TextInput
          style={styles.input}
          value={product.Price.toString()}
          keyboardType="decimal-pad"
          onChangeText={(text) =>
            onChange({
              ...product,
              Price: text === "" ? "" : Number(text),
            })
          }
        />

        {mode === "add" && (
          <>
            <Text style={styles.label}>Código de Barras</Text>
            <TextInput
              style={styles.input}
              value={product.Barcode || ""}
              onChangeText={(text) =>
                onChange({ ...product, Barcode: text })
              }
            />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              multiline
              numberOfLines={4}
              value={product.Description || ""}
              onChangeText={(text) =>
                onChange({ ...product, Description: text })
              }
            />
          </>
        )}

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

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
});

export default ProductForm;

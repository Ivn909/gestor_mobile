import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";

const Carrito = ({ productos, setProductos, onClose }: any) => {
  const total = productos.reduce((sum: number, p: any) => sum + p.cantidad * (p.price || 0), 0);

  const registrarVenta = async () => {
    try {
      const res = await fetch("http://66.179.92.207:3000/api/pos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionID: 1, // venta
          actionContextID: 1,
          employeeID: 1,
          date: new Date().toISOString(),
          products: productos.map((p: any) => ({
            barcode: p.id,
            quantity: p.cantidad,
          })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert("Éxito", "Venta registrada correctamente");
        setProductos([]);
        onClose();
      } else {
        Alert.alert("Error", data.error || "Ocurrió un error");
      }
    } catch {
      Alert.alert("Error", "No se pudo registrar la venta");
    }
  };

  const agregarStock = async () => {
    try {
      const res = await fetch("http://66.179.92.207:3000/api/pos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionID: 2, // agregar stock
          actionContextID: 1,
          employeeID: 1,
          date: new Date().toISOString(),
          products: productos.map((p: any) => ({
            barcode: p.id,
            quantity: p.cantidad,
          })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert("Éxito", "Inventario actualizado");
        setProductos([]);
        onClose();
      } else {
        Alert.alert("Error", data.error || "Ocurrió un error");
      }
    } catch {
      Alert.alert("Error", "No se pudo actualizar el inventario");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrito</Text>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Cant: {item.cantidad} · ${item.price}</Text>
          </View>
        )}
      />
      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnVenta} onPress={registrarVenta}>
          <Text style={styles.btnText}>Registrar venta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnAgregar} onPress={agregarStock}>
          <Text style={styles.btnText}>Agregar a inventario</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose}>
          <Text style={{ textAlign: "center", marginTop: 10, color: "#999" }}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Carrito;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 8,
  },
  name: {
    fontWeight: "bold",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
  },
  actions: {
    gap: 10,
  },
  btnVenta: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  btnAgregar: {
    backgroundColor: "#17a2b8",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

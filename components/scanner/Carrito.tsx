import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ButtonCar from "./button/ButtonCar";

const Carrito = ({ productos, setProductos, onClose }: any) => {
  const [userID, setUserID] = useState<number | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const userString = await AsyncStorage.getItem("usuario");
      if (userString) {
        const user = JSON.parse(userString);
        setUserID(user.id || user.employeeID); // ajustar según cómo lo guardes
      }
    };

    loadUser();
  }, []);

  const total = productos.reduce(
    (sum: number, p: any) => sum + p.cantidad * (p.price || 0),
    0
  );

  const registrarVenta = async () => {
    try {
      const res = await fetch("http://66.179.92.207:3000/api/pos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          actionID: 1,
          actionContextID: 1,
          employeeID: userID ?? 1,
          date: new Date().toISOString().slice(0, 10),
          products: productos.map((p: any) => ({
            productID: p.productID,
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


  // fetch para agregar stock al inventario.
  const agregarStock = async () => {
    try {
      for (const producto of productos) {
        if (!producto.productID) {
          console.warn("Falta productID en:", producto);
          continue;
        }

        const productID = producto.productID;

        const res = await fetch(
          `http://66.179.92.207:3000/api/inventory/stock/${productID}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              productID: productID,
              quantity: producto.cantidad,
            }),
          }
        );

        if (!res.ok) {
          const errorText = await res.text(); // <-- captura HTML o mensaje de error
          console.error(
            `Error HTTP al actualizar ${producto.name}:`,
            errorText
          );
          Alert.alert(
            "Error",
            `No se pudo actualizar el stock de ${producto.name}`
          );
          return;
        }

        const data = await res.json();
        if (!data.success) {
          Alert.alert(
            "Error",
            `No se pudo actualizar el stock de ${producto.name}: ${data.error}`
          );
          return;
        }
      }

      Alert.alert("Éxito", "Stock actualizado correctamente");
      setProductos([]);
      onClose();
    } catch (error) {
      console.error("Error de conexión:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  const aumentarCantidad = (id: string) => {
    setProductos((prev: any[]) =>
      prev.map((p) => (p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p))
    );
  };

  const reducirCantidad = (id: string) => {
    setProductos((prev: any[]) =>
      prev.map((p) =>
        p.id === id && p.cantidad > 1 ? { ...p, cantidad: p.cantidad - 1 } : p
      )
    );
  };

  const eliminarProducto = (id: string) => {
    setProductos((prev: any[]) => prev.filter((p) => p.id !== id));
  };

  const descartarCarrito = () => {
    Alert.alert(
      "Descartar carrito",
      "¿Estás seguro que quieres vaciar el carrito?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí", onPress: () => setProductos([]), style: "destructive" },
      ]
    );
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>
        {item.name} x{item.cantidad}
      </Text>
      <View style={styles.buttonsRow}>
        <ButtonCar
          color="#28a745"
          text="Aumentar producto"
          onPress={() => aumentarCantidad(item.id)}
        />
        <ButtonCar
          color="#ffc107"
          text="Reducir producto"
          onPress={() => reducirCantidad(item.id)}
        />
        <ButtonCar
          color="#dc3545"
          text="Eliminar"
          onPress={() => eliminarProducto(item.id)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrito</Text>

      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={registrarVenta}
          style={[styles.actionButton, { backgroundColor: "#28a745" }]}
        >
          <Text style={styles.buttonText}>Registrar venta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={agregarStock}
          style={[styles.actionButton, { backgroundColor: "#17a2b8" }]}
        >
          <Text style={styles.buttonText}>Agregar stock</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={descartarCarrito}
          style={[styles.actionButton, { backgroundColor: "#dc3545" }]}
        >
          <Text style={styles.buttonText}>Descartar carrito</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onClose}
          style={[styles.actionButton, { backgroundColor: "#6c757d" }]}
        >
          <Text style={styles.buttonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  itemContainer: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
    marginBottom: 6,
  },
  buttonsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  actionButtons: {
    marginTop: 16,
  },
  actionButton: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  total: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
  },
});

export default Carrito;

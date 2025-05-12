import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import InventoryTable from "../components/inventory/InventoryTable";
import ProductForm from "../components/inventory/ProductForm";
import Header from "../components//navigation/Header";

interface Product {
  ID: number;
  Name: string;
  Category?: string;
  Stock?: number;
  Price: number;
  Barcode?: string;
}

interface Category {
  id: number;
  name: string;
}

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://66.179.92.207:3000/api/inventory";

  const fetchInventory = async () => {
    try {
      const [invRes, posRes] = await Promise.all([
        fetch(API_BASE),
        fetch("http://66.179.92.207:3000/api/pos"),
      ]);
      const invData = await invRes.json();
      const posData = await posRes.json();

      const combined = invData.map((inv: any) => {
        const pos = posData.find((p: any) => p.productID === inv.ID);
        return {
          ...inv,
          Barcode: pos?.barcode || "N/A",
        };
      });

      setProducts(combined);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchCategories();

    const interval = setInterval(() => {
      fetchInventory();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getCategoryIDByName = (name: string): number | undefined =>
    categories.find((c) => c.name === name)?.id;

  const handleDelete = async (id: number) => {
    Alert.alert("Confirmar", "¿Deseas eliminar este producto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) fetchInventory();
            else Alert.alert("Error", data.error || "Error desconocido");
          } catch {
            Alert.alert("Error", "No se pudo conectar al servidor");
          }
        },
      },
    ]);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleEditSubmit = async () => {
    if (!editingProduct) return;
    const { ID, Name, Category, Price, Stock } = editingProduct;
    const CategoryID = getCategoryIDByName(Category || "");

    if (!CategoryID) {
      Alert.alert("Error", "Categoría inválida");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/${ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          Producto: Name,
          Categoria: CategoryID.toString(),
          Precio: Price.toString(),
          Stock: Stock?.toString() || "0",
        }).toString(),
      });
      const data = await res.json();
      if (data.success) {
        setEditingProduct(null);
        fetchInventory();
      } else {
        Alert.alert("Error", data.error || "Error desconocido");
      }
    } catch (err) {
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

  return (
    <View style={styles.screen}>
      <Header />

      <View style={styles.container}>
        <Text style={styles.title}>Inventario</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <InventoryTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {editingProduct && (
          <ProductForm
            product={editingProduct}
            onChange={setEditingProduct}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingProduct(null)}
            categories={categories}
            mode="edit"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    padding: 20,
    paddingBottom: 50,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default Inventory;

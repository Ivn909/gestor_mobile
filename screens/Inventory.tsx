import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import InventoryTable from "../components/inventory/InventoryTable";
import ProductForm from "../components/inventory/ProductForm";
import Header from "../components/navigation/Header";
import FilterInventory from "../components/inventory/FilterInventory";

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

  const [filters, setFilters] = useState({
    name: "",
    id: "",
    barcode: "",
    category: "",
    priceMin: "",
    priceMax: "",
  });

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

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredProducts = products.filter((product) => {
    const matchName =
      filters.name === "" ||
      product.Name.toLowerCase().includes(filters.name.toLowerCase());
    const matchID =
      filters.id === "" || product.ID.toString().includes(filters.id);
    const matchBarcode =
      filters.barcode === "" ||
      product.Barcode?.toLowerCase().includes(filters.barcode.toLowerCase());
    const matchCategory =
      filters.category === "" ||
      product.Category?.toLowerCase() === filters.category.toLowerCase();
    const matchPriceMin =
      filters.priceMin === "" ||
      product.Price >= parseFloat(filters.priceMin);
    const matchPriceMax =
      filters.priceMax === "" ||
      product.Price <= parseFloat(filters.priceMax);
    return (
      matchName &&
      matchID &&
      matchBarcode &&
      matchCategory &&
      matchPriceMin &&
      matchPriceMax
    );
  });

  return (
    <View style={styles.container}>
      <Header title="Inventario" />

      <FilterInventory
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={categories}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <InventoryTable
          products={filteredProducts}
          onEdit={setEditingProduct}
          onDelete={handleDelete}
        />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={fetchInventory}
          categories={categories}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default Inventory;

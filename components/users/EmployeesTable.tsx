import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Employee {
  ID: number;
  Name: string;
  Role: number;
  Phone: string;
  User: string;
  Status: number;
  Hired: string;
}

interface Props {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
}

const EmployeesTable: React.FC<Props> = ({ employees, onEdit, onDelete }) => {
  const [userRole, setUserRole] = useState<number | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const stored = await AsyncStorage.getItem("usuario");
        if (stored) {
          const user = JSON.parse(stored);
          setUserRole(user.role);
        }
      } catch (error) {
        console.error("Error al obtener el rol:", error);
      } finally {
        setLoadingRole(false);
      }
    };

    loadUserRole();
  }, []);

  const getRoleName = (role: number) => {
    return role === 1 ? "Gerente" : role === 2 ? "Cajero" : "Desconocido";
  };

  const getStatusLabel = (status: number) => {
    return status === 1 ? "Activo" : "Inactivo";
  };

  const handleDelete = (id: number) => {
    Alert.alert("Confirmar eliminación", "¿Seguro que deseas eliminar este empleado?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => onDelete(id) },
    ]);
  };

  if (loadingRole) {
    return <ActivityIndicator size="large" color="#28a745" style={{ marginTop: 30 }} />;
  }

  const renderItem = ({ item }: { item: Employee }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.Name}</Text>
      <Text style={styles.detail}>ID: {item.ID}</Text>
      <Text style={styles.detail}>Rol: {getRoleName(item.Role)}</Text>
      <Text style={styles.detail}>Teléfono: {item.Phone}</Text>
      <Text style={styles.detail}>Usuario: {item.User}</Text>
      <Text style={styles.detail}>Estado: {getStatusLabel(item.Status)}</Text>
      <Text style={styles.detail}>Contratación: {item.Hired.slice(0, 10)}</Text>

      {userRole === 1 && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editButton} onPress={() => onEdit(item)}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.ID)}>
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <FlatList
      data={employees}
      renderItem={renderItem}
      keyExtractor={(item) => item.ID.toString()}
      contentContainerStyle={styles.list}
    />
  );
};

export default EmployeesTable;

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  editButton: {
    backgroundColor: "#ffc107",
    padding: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 4,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 8,
    borderRadius: 6,
    flex: 1,
    marginLeft: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

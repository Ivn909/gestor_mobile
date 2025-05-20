import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmployeesTable from "../components/users/EmployeesTable";
import Header from "../components/navigation/Header";
import UserForm from "../components/users/UserForm";
import { SERVER_URL } from "../ServerConfig";

interface Employee {
  ID: number;
  Name: string;
  Role: number;
  Phone: string;
  User: string;
  Status: number;
  Hired: string;
  Password?: string;
}

const createEmptyUser = (): Employee => ({
  ID: 0,
  Name: "",
  Role: 1,
  Phone: "",
  User: "",
  Status: 1,
  Hired: new Date().toISOString().slice(0, 10),
  Password: "",
});

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${SERVER_URL}/api/employees`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error al obtener los empleados:", error);
        Alert.alert("Error", "No se pudo cargar la lista de empleados");
      } finally {
        setLoading(false);
      }
    };

    const getUserRole = async () => {
      const stored = await AsyncStorage.getItem("usuario");
      if (stored) {
        const user = JSON.parse(stored);
        setUserRole(user.role);
      }
    };

    getUserRole();
    fetchEmployees();
  }, []);

  const handleDelete = (id: number) => {
    Alert.alert("Confirmación", "¿Seguro que deseas eliminar este empleado?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        onPress: async () => {
          try {
            const res = await fetch(`${SERVER_URL}/api/employees/${id}`, {
              method: "DELETE",
              credentials: "include",
            });
            const data = await res.json();
            if (data.success) {
              setEmployees((prev) => prev.filter((e) => e.ID !== id));
            } else {
              Alert.alert("Error", data.error || "No se pudo eliminar");
            }
          } catch (err) {
            Alert.alert("Error", "No se pudo conectar con el servidor");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const handleAdd = () => {
    setEditingUser(createEmptyUser());
  };

  const handleEdit = (employee: Employee) => {
    setEditingUser(employee);
  };

  const handleChange = (updatedUser: Employee) => {
    setEditingUser(updatedUser);
  };

  const handleSubmit = async () => {
    if (!editingUser) return;
    const isAdd = editingUser.ID === 0;

    const payload: any = {
      employeeID: editingUser.ID,
      name: editingUser.Name,
      phone: editingUser.Phone,
      role: editingUser.Role,
      hiringDate: editingUser.Hired.slice(0, 10), // <-- clave aquí
      username: editingUser.User,
      status: editingUser.Status,
    };

    if (isAdd && editingUser.Password) {
      payload.password = editingUser.Password;
    }

    try {
      const res = await fetch(`${SERVER_URL}/api/employees`, {
        method: isAdd ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setEditingUser(null);
        const updatedRes = await fetch(`${SERVER_URL}/api/employees`, {
          credentials: "include",
        });
        const updatedData = await updatedRes.json();
        setEmployees(updatedData);
      } else {
        Alert.alert("Error", data.error || "Ocurrió un error");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  if (loading || userRole === null) {
    return (
      <ActivityIndicator size="large" color="#28a745" style={{ marginTop: 30 }} />
    );
  }

  return (
    <View style={styles.screen}>
      <Header />
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Empleados</Text>
          {userRole === 1 && (
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addButtonText}>Agregar Usuario</Text>
            </TouchableOpacity>
          )}
        </View>


        <EmployeesTable
          employees={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {editingUser && (
          <UserForm
            user={editingUser}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            mode={editingUser.ID === 0 ? "add" : "edit"}
          />
        )}
      </View>
    </View>
  );
};

export default Employees;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 50,
  },
  titleBlock: {
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    marginTop: 10,
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: 145,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});

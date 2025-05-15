import React, { useState, useEffect } from "react";
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

const { height, width } = Dimensions.get("window");

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

interface Props {
  user: Employee;
  onChange: (user: Employee) => void;
  onSubmit: () => void;
  onCancel: () => void;
  mode: "edit" | "add";
}

const UserForm: React.FC<Props> = ({
  user,
  onChange,
  onSubmit,
  onCancel,
  mode,
}) => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  useEffect(() => {
    const shouldValidate =
      mode === "add" || (mode === "edit" && (user.Password || "").length > 0);

    if (shouldValidate) {
      setPasswordMismatch(user.Password !== confirmPassword);
    } else {
      setPasswordMismatch(false);
    }
  }, [user.Password, confirmPassword, mode]);

  const handleSubmit = () => {
    if (passwordMismatch) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    const message =
      mode === "add"
        ? "¿Estás seguro de agregar este usuario?"
        : "¿Deseas guardar los cambios del usuario?";

    Alert.alert("Confirmar", message, [
      { text: "Cancelar", style: "cancel" },
      { text: "Aceptar", onPress: onSubmit },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {mode === "add" ? "Agregar Usuario" : "Editar Usuario"}
      </Text>

      <ScrollView>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={user.Name}
          onChangeText={(text) => onChange({ ...user, Name: text })}
        />

        <Text style={styles.label}>Rol</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={user.Role.toString()}
          onChangeText={(text) => onChange({ ...user, Role: parseInt(text) })}
          placeholder="1 = Gerente, 2 = Cajero"
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={user.Phone}
          keyboardType="phone-pad"
          onChangeText={(text) => onChange({ ...user, Phone: text })}
        />

        <Text style={styles.label}>Usuario</Text>
        <TextInput
          style={styles.input}
          value={user.User}
          onChangeText={(text) => onChange({ ...user, User: text })}
        />

        {/* Campo de contraseña siempre visible pero opcional en edición */}
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={user.Password || ""}
          onChangeText={(text) => onChange({ ...user, Password: text })}
          placeholder={
            mode === "edit"
              ? "Déjalo en blanco para no modificar"
              : "Ingresa la contraseña"
          }
        />

        <Text style={styles.label}>Confirmar Contraseña</Text>
        <TextInput
          style={[styles.input, passwordMismatch && { borderColor: "red" }]}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {passwordMismatch && (
          <Text style={styles.error}>Las contraseñas no coinciden.</Text>
        )}

        <Text style={styles.label}>Estado</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={user.Status.toString()}
          onChangeText={(text) => onChange({ ...user, Status: parseInt(text) })}
          placeholder="1 = Activo, 0 = Inactivo"
        />

        <Text style={styles.label}>Fecha de Contratación</Text>
        <TextInput
          style={styles.input}
          value={user.Hired.slice(0, 10)} // <- Asegura el formato compatible con MySQL
          onChangeText={(text) => {
            // Validar entrada tipo fecha YYYY-MM-DD simple
            const isValid = /^\d{4}-\d{2}-\d{2}$/.test(text);
            if (isValid || text === "") {
              onChange({ ...user, Hired: text });
            }
          }}
          placeholder="YYYY-MM-DD"
        />

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit}
            disabled={passwordMismatch}
          >
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

export default UserForm;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: width,
    height: height * 0.95,
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
  error: {
    color: "red",
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

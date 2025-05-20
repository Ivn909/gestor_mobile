import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";

type Props = {
  visible: boolean;
  onCancel: () => void;
  onRegister: () => void;
};

const NewProductAlert = ({ visible, onCancel, onRegister }: Props) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Producto no encontrado</Text>
          <Text style={styles.message}>
            Se ha escaneado un producto que no se encuentra en el inventario.
            ¿Qué quieres hacer con él?
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.okBtn} onPress={onRegister}>
              <Text style={styles.btnText}>Registrar en inventario</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NewProductAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 15,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "column", //  Botones uno debajo del otro
    gap: 10,
  },
  okBtn: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelText: {
    color: "#333",
    fontWeight: "bold",
  },
});

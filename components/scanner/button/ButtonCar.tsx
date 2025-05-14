import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface ButtonCarProps {
  color: string;
  onPress: () => void;
  text: string;
}

const ButtonCar: React.FC<ButtonCarProps> = ({ color, onPress, text }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: color }]}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 6,
    borderRadius: 5,
    marginHorizontal: 2,
    marginVertical: 2,
  },
  text: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
});

export default ButtonCar;

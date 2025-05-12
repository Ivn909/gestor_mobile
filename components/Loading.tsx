// screens/Loading.tsx
import React from "react";
import { View, Image, StyleSheet } from "react-native";

const Loading: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/LOGO.png")} // Asegúrate de que esté en /assets
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 320,
    height: 320,
  },
});

export default Loading;

import React, { useEffect, useRef, useState } from "react";
import { BackHandler, Alert, Animated, StyleSheet, View } from "react-native";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import LoginScreen from "./screens/LogIn";
import DashboardScreen from "./screens/Dashboard";
import InventoryScreen from "./screens/Inventory";
import ScannerScreen from "./screens/Scanner";
import LoadingScreen from "./components/Loading";
import Employees from "./screens/Employees";
import MenuLateral from "./components/navigation/MenuLateral";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const SERVER_URL = "http://66.179.92.207:3000/"; // <--- cámbialo si usas una IP diferente

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <MenuLateral {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Drawer.Screen name="Inicio" component={DashboardScreen} />
    <Drawer.Screen name="Escáner" component={ScannerScreen} />
    <Drawer.Screen name="Inventario" component={InventoryScreen} />
    <Drawer.Screen name="Empleados" component={Employees} />
  </Drawer.Navigator>
);

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showLoading, setShowLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        if (isMounted) setShowLoading(false);
      });
    }, 3000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/auth/check-session`, {
          credentials: "include",
        });
        const data = await res.json();
        setIsLoggedIn(data.loggedIn);
      } catch (error) {
        console.error("Error verificando sesión:", error);
        setIsLoggedIn(false);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (navigationRef.isReady()) {
        const currentRoute = navigationRef.getCurrentRoute()?.name;
        if (currentRoute && currentRoute !== "Login") {
          Alert.alert(
            "Confirmación",
            "¿Deseas cerrar la aplicación?",
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Salir",
                onPress: () => BackHandler.exitApp(),
                style: "destructive",
              },
            ],
            { cancelable: true }
          );
          return true;
        }
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [navigationRef]);

  if (showLoading || isLoggedIn === null) {
    return (
      <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
        <LoadingScreen />
      </Animated.View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? "MainDrawer" : "Login"}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

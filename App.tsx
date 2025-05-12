import React, { useEffect, useRef, useState } from "react"; // 👈 useState agregado
import { BackHandler, Alert } from "react-native";
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
import MenuLateral from "./components/navigation/MenuLateral";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <MenuLateral {...props} />}
    screenOptions={{
      header: () => null,
    }}
  >
    <Drawer.Screen name="Inicio" component={DashboardScreen} />
    <Drawer.Screen name="Inventario" component={InventoryScreen} />
    <Drawer.Screen name="Escáner" component={ScannerScreen} />
  </Drawer.Navigator>
);

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const backPressedOnce = useRef(false);
  const [showLoading, setShowLoading] = useState(true); // 👈 Controlador para loading

  useEffect(() => {
    const timer = setTimeout(() => setShowLoading(false), 5000); // ⏱️ Mostrar por 5 segundos
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const backAction = () => {
      const currentRoute = navigationRef.getCurrentRoute()?.name;

      if (navigationRef.isReady() && currentRoute !== "Login") {
        if (backPressedOnce.current) {
          BackHandler.exitApp();
        } else {
          backPressedOnce.current = true;

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

          setTimeout(() => {
            backPressedOnce.current = false;
          }, 2000);

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
  }, []);

  if (showLoading) return <LoadingScreen />; // 👈 Mostrar pantalla de carga

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

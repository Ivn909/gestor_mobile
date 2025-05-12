import React, { useEffect, useRef } from "react";
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
import MenuLateral from "./components/MenuLateral";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <MenuLateral {...props} />}
    screenOptions={{
      header: () => null,
    }}
  >
    <Drawer.Screen name="Dashboard" component={DashboardScreen} />
    <Drawer.Screen name="Inventario" component={InventoryScreen} />
    <Drawer.Screen name="Escáner" component={ScannerScreen} /> 
  </Drawer.Navigator>
);

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const backPressedOnce = useRef(false);

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

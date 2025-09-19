import * as React from "react";
import { NavigationContainer, ThemeProvider } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "./src/Authentication/SignIn";
import SingUp from "./src/Authentication/SingUp";
import "./i18n";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "./i18n";
import { AuthProvider } from "./src/Secure/AuthProvider";
import ProfileScreen from "./src/screens/Profile/ProfileScreen";
import HomeScreen from "./src/screens/Home/HomeScreen";
import AddResort from "./src/screens/Profile/AddResort";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import CustomToast from "./src/components/Hooks/customToast";

const Stack = createNativeStackNavigator();

export default function App() {
  const { t } = useTranslation();
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                  name="SignIn"
                  component={SignIn}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="SignUp"
                  component={SingUp}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Profile"
                  component={ProfileScreen}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="AddResort"
                  component={AddResort}
                  options={{
                    title: t("app.addNewResortTitle"),
                    headerTitleAlign: "center",
                    headerBackTitleVisible: false,
                    headerTitleStyle: {
                      fontSize: 16,
                    },
                    headerShadowVisible: false,
                  }}
                />
              </Stack.Navigator>
              <Toast config={{ custom: CustomToast }} />
            </NavigationContainer>
          </AuthProvider>
        </I18nextProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import "./i18n";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { AuthProvider } from "./src/Secure/AuthProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import CustomToast from "./src/components/Hooks/customToast";
import AppNavigator from "./src/Secure/AppNavigator";
import ThemeProvider from "./src/Theme/themeContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <NavigationContainer>
              <AppNavigator />
              <Toast config={{ custom: CustomToast }} />
            </NavigationContainer>
          </AuthProvider>
        </I18nextProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

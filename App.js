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
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ResortProvider } from "./src/components/Hooks/useEditResort";

export default function App() {
  return (
    <SafeAreaProvider>
      <ResortProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <ThemeProvider>
              <I18nextProvider i18n={i18n}>
                <AuthProvider>
                  <AppNavigator />
                </AuthProvider>
              </I18nextProvider>
            </ThemeProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
        <Toast config={{ custom: CustomToast }} />
      </ResortProvider>
    </SafeAreaProvider>
  );
}

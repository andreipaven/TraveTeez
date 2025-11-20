import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { useTranslation } from "react-i18next";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "../Authentication/SignIn";
import SingUp from "../Authentication/SingUp";
import Loading from "../components/Loading/Loading";
import { useTheme } from "../Theme/themeContext";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "../components/Bars/TabNavigator";
import { Icon } from "react-native-elements";
import Auth from "../Authentication/Auth";

const AppNavigator = () => {
  const Stack = createNativeStackNavigator();
  const { loading } = useContext(AuthContext);

  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={() => ({
          headerTitleStyle: { fontSize: 16, color: theme.colors.textPrimary },
          headerStyle: {
            backgroundColor: theme.colors.backgroundPrimary,
            shadowColor: "transparent",
          },
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
          headerShadowVisible: false,
          headerTintColor: theme.colors.textPrimary,
        })}
      >
        {loading && (
          <Stack.Screen
            name="Loading"
            component={Loading}
            options={{ headerShown: false }}
          />
        )}

        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="SignIn"
          component={Auth}
          options={{
            headerShown: true,
            presentation: "modal",
            title: "Sign in or Sign up",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { useTranslation } from "react-i18next";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "../Authentication/SignIn";
import SingUp from "../Authentication/SingUp";
import BottomNavBar from "../components/Bars/BottomNavBar";
import Loading from "../components/Loading/Loading";
import { useTheme } from "../Theme/themeContext";
import { NavigationContainer } from "@react-navigation/native";

const AppNavigator = () => {
  const Stack = createNativeStackNavigator();
  const { user, loading } = useContext(AuthContext);
  const { t } = useTranslation();
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
        {loading ? (
          <Stack.Screen
            name="Loading"
            component={Loading}
            options={{ headerShown: false }}
          />
        ) : !user ? (
          <Stack.Group>
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
          </Stack.Group>
        ) : (
          <Stack.Screen
            name="MainTabs"
            component={BottomNavBar}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

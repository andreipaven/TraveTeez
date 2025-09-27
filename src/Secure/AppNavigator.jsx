import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { useTranslation } from "react-i18next";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "../Authentication/SignIn";
import SingUp from "../Authentication/SingUp";
import BottomNavBar from "../components/Bars/BottomNavBar";
import AddResort from "../screens/Profile/AddResort";
import EditResort from "../screens/Profile/EditResort";
import Loading from "../components/Loading/Loading";
import { useTheme } from "../Theme/themeContext";
import SearchScreen from "../screens/Search/SearchScreen";
import ResortScreen from "../screens/Resort/ResortScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import HomeScreen from "../screens/Home/HomeScreen";

const AppNavigator = () => {
  const Stack = createNativeStackNavigator();
  const { user, loading } = useContext(AuthContext);
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
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
        <>
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
        </>
      ) : (
        <>
          <Stack.Screen
            name="MainTabs"
            component={BottomNavBar}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddResort"
            component={AddResort}
            options={{
              title: t("app.addNewResortTitle"),
              headerTitleAlign: "center",
              headerBackTitleVisible: false,
              headerTitleStyle: { fontSize: 16 },
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="EditResort"
            component={EditResort}
            options={{
              title: t("app.editResortTitle"),
            }}
          />
          <Stack.Screen
            name="Search"
            component={SearchScreen}
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
            name={"ResortProfile"}
            component={ResortScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;

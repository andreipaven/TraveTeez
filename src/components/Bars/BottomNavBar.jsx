import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../../screens/Home/HomeScreen";
import ProfileScreen from "../../screens/Profile/ProfileScreen";
import CustomTabBar from "./CustomTabBar";
import SearchScreen from "../../screens/Search/SearchScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ResortScreen from "../../screens/Resort/ResortScreen";
import EditResort from "../../screens/Profile/EditResort";
import AddResort from "../../screens/Profile/AddResort";
import { useTranslation } from "react-i18next";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { useTheme } from "../../Theme/themeContext";

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();

// Home stack
function HomeStackScreen() {
  const { t } = useTranslation();
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen
        name={"ResortProfile"}
        component={ResortScreen}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

// Profile stack
function ProfileStackScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name={"Profile"}
        options={{
          tabBarLabel: "Profile",
          tabBarIconActive: "account",
          tabBarIconInactive: "account-outline",
          headerShown: false,
        }}
        component={ProfileScreen}
      />
      <ProfileStack.Screen
        name="AddResort"
        component={AddResort}
        options={{
          title: t("app.addNewResortTitle"),
          headerTitleAlign: "center",
          headerBackTitleVisible: true,
          headerTitleStyle: { fontSize: 16, color: theme.colors.textPrimary },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.colors.backgroundPrimary,
          },
          headerTintColor: theme.colors.textPrimary,
        }}
      />
      <ProfileStack.Screen
        name="EditResort"
        component={EditResort}
        options={{
          title: t("app.editResortTitle"),
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
          headerTitleStyle: { fontSize: 16 },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.colors.backgroundPrimary,
          },
          headerTintColor: theme.colors.textPrimary,
        }}
      />
    </ProfileStack.Navigator>
  );
}

// Search stack (optional, in case later you want deeper navigation)
function SearchStackScreen() {
  const { t } = useTranslation();
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="Search" component={SearchScreen} />
    </SearchStack.Navigator>
  );
}

const BottomNavBar = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeStackScreen}
        options={({ route }) => ({
          tabBarLabel: "Home",
          tabBarIconActive: "home",
          tabBarIconInactive: "home-outline",
          tabBarStyle: { display: getRouteNameHome(route) },
        })}
      />
      <Tab.Screen
        name="SearchScreen"
        component={SearchStackScreen}
        options={{
          tabBarLabel: "Search",
          tabBarIconActive: "magnify",
          tabBarIconInactive: "magnify",
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        options={({ route }) => ({
          tabBarLabel: "Profile",
          tabBarIconActive: "account",
          tabBarIconInactive: "account-outline",
          tabBarStyle: { display: getRouteNameProfile(route) },
        })}
        component={ProfileStackScreen}
      />
    </Tab.Navigator>
  );
};

const getRouteNameProfile = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route);

  if (routeName?.includes("AddResort") || routeName?.includes("EditResort")) {
    return "none";
  }
  return "flex";
};
const getRouteNameHome = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route);

  if (routeName?.includes("ResortProfile")) {
    return "none";
  }
  return "flex";
};

export default BottomNavBar;

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

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();

// Home stack
function HomeStackScreen() {
  const { t } = useTranslation();
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
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
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name={"ProfileScreen"}
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
          headerBackTitleVisible: false,
          headerTitleStyle: { fontSize: 16 },
          headerShadowVisible: false,
          tabBarShowLabel: false,
        }}
      />
      <ProfileStack.Screen
        name="EditResort"
        component={EditResort}
        options={{
          title: t("app.editResortTitle"),
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
      <SearchStack.Screen name="SearchScreen" component={SearchScreen} />
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
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIconActive: "home",
          tabBarIconInactive: "home-outline",
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStackScreen}
        options={{
          tabBarLabel: "Search",
          tabBarIconActive: "magnify",
          tabBarIconInactive: "magnify",
        }}
      />
      <Tab.Screen
        name={"Profile"}
        options={{
          tabBarLabel: "Profile",
          tabBarIconActive: "account",
          tabBarIconInactive: "account-outline",
        }}
        component={ProfileStackScreen}
      />
    </Tab.Navigator>
  );
};

export default BottomNavBar;

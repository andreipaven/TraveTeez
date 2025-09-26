import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../../screens/Home/HomeScreen";
import ProfileScreen from "../../screens/Profile/ProfileScreen";
import CustomTabBar from "./CustomTabBar";
import SearchScreen from "../../screens/Search/SearchScreen";

const Tab = createBottomTabNavigator();

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
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIconActive: "home",
          tabBarIconInactive: "home-outline",
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
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
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default BottomNavBar;

import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../../screens/Home/HomeScreen";
import ProfileScreen from "../../screens/Profile/ProfileScreen";
import CustomTabBar from "./CustomTabBar";

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
        options={{ tabBarLabel: "Home", tabBarIconName: "home" }}
      />
      <Tab.Screen
        name={"Profile"}
        options={{ tabBarLabel: "Profile", tabBarIconName: "account" }}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default BottomNavBar;

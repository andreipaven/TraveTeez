import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const BottomNavBar = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        position: "absolute",
        marginBottom: "auto",
        backgroundColor: "white",
        width: "100%",
        flexDirection: "row",
      }}
    >
      <Button
        title={"Home"}
        onPress={() => {
          navigation.navigate("Home");
        }}
      />
      <Button
        title={"Profile"}
        onPress={() => {
          navigation.navigate("Profile");
        }}
      />
    </View>
  );
};
export default BottomNavBar;

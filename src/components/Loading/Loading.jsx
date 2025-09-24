import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

export default function Loading() {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LottieView
        style={{ width: "30%", height: "30%" }}
        source={require("../../../assets/defaultLoading.json")}
        autoPlay
        loop
        resizeMode={"cover"}
      />
    </View>
  );
}

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { useTheme } from "../../Theme/themeContext";

function MapFetchLoading({ top, left, right, bottom }) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        width: 64,
        height: 64,
        position: "absolute",
        top,
        left,
        right,
        bottom,
        backgroundColor: theme.colors.backgroundPrimary,
        alignSelf: "center",
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LottieView
        source={require("../../../assets/Trail loading.json")}
        autoPlay
        loop
        style={{ width: 68, height: 68 }}
        resizeMode={"cover"}
        colorFilters={[
          {
            keypath: "*",
            color: theme.colors.primary,
          },
        ]}
      />
    </View>
  );
}

export default MapFetchLoading;

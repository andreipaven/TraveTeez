// ThemeSwitch.js
import React, { useRef, useEffect } from "react";
import { Animated, Pressable, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../Theme/themeContext";

const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme.mode === "dark";

  const translateX = useRef(new Animated.Value(isDarkMode ? 34 : 4)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isDarkMode ? 34 : 4,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDarkMode]);

  return (
    <Pressable onPress={toggleTheme}>
      <View
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? "#333" : "#eee" },
        ]}
      >
        <Animated.View
          style={[
            styles.circle,
            {
              backgroundColor: isDarkMode ? "#009cff" : "#00ccff",
              transform: [{ translateX }],
            },
          ]}
        >
          {isDarkMode ? (
            <MaterialIcons name="dark-mode" size={18} color="#000" />
          ) : (
            <MaterialIcons name="light-mode" size={18} color="#fff" />
          )}
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 36,
    borderRadius: 34,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  circle: {
    position: "absolute",
    top: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default ThemeSwitch;

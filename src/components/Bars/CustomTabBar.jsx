import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Animated,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "../../Theme/themeContext";
import { useFocusEffect, useRoute } from "@react-navigation/native";

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { theme } = useTheme();
  const [opacity] = useState(new Animated.Value(1));
  const [translateY] = useState(new Animated.Value(0));

  useFocusEffect(
    React.useCallback(() => {
      const activeRoute = state.routes[state.index];

      if (
        activeRoute.name === "MapScreen" &&
        activeRoute.params?.bottomSheetOpen
      ) {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 50,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, [state]),
  );

  return (
    <Animated.View
      style={{
        width: "100%",
        height: "auto",
        backgroundColor: "transparent",
        zIndex: 999,
        position: "absolute",
        bottom: 0,
        opacity,
        transform: [{ translateY }],
      }}
    >
      <View
        style={[
          styles.tabContainer,
          {
            backgroundColor: theme.colors.backgroundPrimary,
            shadowColor: theme.colors.shadowPrimary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 6,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              activeOpacity={1}
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={[
                styles.tabItem,
                isFocused && { backgroundColor: theme.colors.primary },
              ]}
            >
              <Icon
                name={
                  isFocused
                    ? options.tabBarIconActive
                    : options.tabBarIconInactive
                }
                size={24}
                color={
                  isFocused
                    ? theme.colors.primaryContrast
                    : theme.colors.textPrimary
                }
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused
                      ? theme.colors.primaryContrast
                      : theme.colors.textPrimary,
                  },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 40,
    marginBottom: 42,
    borderRadius: 100,
    padding: 8,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  tabLabel: {
    fontSize: 10,
    textAlign: "center",
  },
});

export default CustomTabBar;

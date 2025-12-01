import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
} from "react-native";
import { useTheme } from "../../Theme/themeContext";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { Icon } from "react-native-elements";

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
            backgroundColor: "transparent",
            shadowColor: theme.colors.shadowPrimary,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 6,
          },
        ]}
      >
        <BlurView
          style={{
            flexDirection: "row",
            backgroundColor:
              Platform.OS === "ios"
                ? theme.colors.backgroundPrimary + "88"
                : theme.colors.backgroundPrimary,
            justifyContent: "space-around",
            alignItems: "center",
            flex: 1,
            padding: 4,
            width: "100%",
            overflow: "hidden",
            borderRadius: 100,
            opacity: 0.99,
          }}
          intensity={20}
          experimentalBlurMethod={"none"}
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
                  // isFocused && { backgroundColor: theme.colors.primary },
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
                    isFocused ? theme.colors.primary : theme.colors.textPrimary
                  }
                  type={"material-community"}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isFocused
                        ? theme.colors.primary
                        : theme.colors.textPrimary,
                    },
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </BlurView>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    marginHorizontal: 40,
    marginBottom: 42,
    borderRadius: 100,
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

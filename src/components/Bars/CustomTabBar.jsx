import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "../../Theme/themeContext";

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        width: "100%",
        height: "auto",
        backgroundColor: theme.colors.backgroundPrimary,
      }}
    >
      <View
        style={[
          styles.tabContainer,
          {
            backgroundColor: theme.colors.backgroundPrimary,
            shadowColor: theme.colors.shadowPrimary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.12,
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
            <TouchableOpacity
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
                    ? options.tabBarIconName
                    : options.tabBarIconName + "-outline"
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
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 40,
    marginBottom: 50,
    borderRadius: 50,
    padding: 12,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 100,
  },
  tabLabel: {
    fontSize: 12,

    textAlign: "center",
  },
});

export default CustomTabBar;

// components/Select.js
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
import { Dropdown, SelectCountry } from "react-native-element-dropdown";
import { useTheme } from "../../Theme/themeContext";

const CustomDropdown = ({
  label,
  options = [],
  selectedValue,
  onValueChange,
  name,
  borderWidth = 1,
  borderColor,
  borderRadius = 8,
  backgroundColor,
  error,
  search,
  focusBorderColor,
  textColor,
}) => {
  const { theme } = useTheme();

  const [isFocused, setIsFocused] = useState(false);

  const animatedLabel = useRef(
    new Animated.Value(selectedValue ? 1 : 0),
  ).current;
  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || selectedValue ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [isFocused, selectedValue]);

  const labelStyle = {
    position: "absolute",
    left: 14,

    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -8],
    }),
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.colors.textSecondary, theme.colors.textPrimary],
    }),
    backgroundColor: backgroundColor || theme.colors.backgroundDefault,
    paddingHorizontal: 4,
    width: "auto",
    borderRadius: 100,
  };

  const handleChange = (item) => {
    if (onValueChange) onValueChange(name, item.value, item.label);
  };

  const renderItem = (item) => {
    return (
      <View
        style={[
          styles.item,
          { backgroundColor: theme.colors.backgroundPrimary },
        ]}
      >
        <Text
          style={[
            styles.selectedTextStyle,
            { color: theme.colors.textPrimary },
          ]}
        >
          {item.label}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          borderWidth,
          borderColor: error
            ? theme.colors.error
            : isFocused
              ? focusBorderColor || borderColor
              : borderColor + "88",
          borderRadius,
          backgroundColor,
        },
      ]}
    >
      {label && <Animated.Text style={labelStyle}>{label}</Animated.Text>}
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={[
          styles.placeholderStyle,
          { color: theme.colors.textPrimary },
        ]}
        selectedTextStyle={{ color: theme.colors.textPrimary }}
        data={options}
        inputSearchStyle={{
          color: theme.colors.textPrimary,
          borderColor: theme.colors.primary,
          borderRadius: 100,
          paddingHorizontal: 8,
        }}
        labelField="label"
        valueField="value"
        placeholder={""}
        value={selectedValue}
        onChange={handleChange}
        renderItem={renderItem}
        search={search}
        searchPlaceholder={"Search"}
        containerStyle={{
          backgroundColor: theme.colors.backgroundPrimary,
          borderWidth: 0,
          shadowColor: theme.colors.shadowPrimary,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 3.84,
          elevation: 3,
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    paddingHorizontal: 10,
    marginBottom: 12,
    width: "100%",
  },
  label: {
    fontSize: 16,
    minWidth: 60,
    paddingRight: 4,
  },
  dropdown: {
    flex: 1,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "red",
  },
});

export default CustomDropdown;

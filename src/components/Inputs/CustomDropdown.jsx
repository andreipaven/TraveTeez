// components/Select.js
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useTheme } from "../../Theme/themeContext";

const CustomDropdown = ({
  label,
  options = [],
  selectedValue,
  onValueChange,
  name,
  borderWidth = 1,
  borderColor = "#ccc",
  borderRadius = 8,
  placeholder = "",
  backgroundColor,
  error,
}) => {
  const theme = useTheme();

  const handleChange = (item) => {
    if (onValueChange) onValueChange(name, item.value);
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          borderWidth,
          borderColor: error ? "red" : borderColor,
          borderRadius,
          backgroundColor,
        },
      ]}
    >
      {label && (
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          {label}
        </Text>
      )}
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={options}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={selectedValue}
        onChange={handleChange}
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
    fontWeight: "600",
    minWidth: 60,
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
});

export default CustomDropdown;

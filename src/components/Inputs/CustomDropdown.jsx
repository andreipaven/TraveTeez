// components/Select.js
import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
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
}) => {
  const { theme } = useTheme();

  const handleChange = (item) => {
    if (onValueChange) onValueChange(name, item.value);
  };

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </View>
    );
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
      {label && selectedValue && (
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          {label}
        </Text>
      )}
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={[
          styles.placeholderStyle,
          { color: theme.colors.textSecondary },
        ]}
        selectedTextStyle={styles.selectedTextStyle}
        data={options}
        labelField="label"
        valueField="value"
        placeholder={label}
        value={selectedValue}
        onChange={handleChange}
        renderItem={renderItem}
        search={search}
        searchPlaceholder={"Search"}
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
  },
});

export default CustomDropdown;

// components/Select.js
import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
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
}) => {
  const { theme } = useTheme();

  const handleChange = (item) => {
    if (onValueChange) onValueChange(name, item.value);
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
        selectedTextStyle={[
          styles.selectedTextStyle,
          { color: theme.colors.textPrimary },
        ]}
        data={options}
        labelField="label"
        valueField="value"
        placeholder={label}
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

import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import { useTheme } from "../../Theme/themeContext";
import { Icon } from "react-native-elements";

const MultiSelectComponent = ({
  options,
  label,
  borderWidth,
  borderColor,
  error,
  borderRadius,
  backgroundColor,
  onValueChange,
  marginTop,
  selectedValue,
  search,
}) => {
  const [selected, setSelected] = useState(selectedValue);
  const { theme } = useTheme();

  const handleChange = (items) => {
    setSelected(items);
    if (onValueChange) onValueChange(items);
  };

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { marginTop }]}>
      <MultiSelect
        style={[
          styles.dropdown,
          {
            borderWidth,
            borderColor: error ? "red" : borderColor,
            borderRadius,
            backgroundColor,
          },
        ]}
        placeholderStyle={[
          styles.placeholderStyle,
          { color: theme.colors.textSecondary },
        ]}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={options}
        labelField="label"
        valueField="value"
        search={search}
        searchPlaceholder={"Search..."}
        placeholder={label}
        value={selected}
        onChange={handleChange}
        renderItem={renderItem}
        renderSelectedItem={(item, unSelect) => (
          <View
            style={[
              styles.selectedStyle,
              {
                backgroundColor: theme.colors.backgroundPrimary,
                flexDirection: "row",
                width: "auto",
                marginHorizontal: 8,
              },
            ]}
          >
            <Text
              style={[
                styles.textSelectedStyle,
                {
                  shadowColor: theme.colors.shadowPrimary,
                  flexShrink: 1,
                  color: theme.colors.textPrimary,
                },
              ]}
            >
              {item.label}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => unSelect && unSelect(item)}
            >
              <Icon
                type={"material-community"}
                color={theme.colors.textPrimary}
                name="delete"
                size={12}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default MultiSelectComponent;

const styles = StyleSheet.create({
  container: { width: "100%", marginBottom: 12 },
  dropdown: {
    height: 50,
    borderRadius: 12,
    padding: 12,

    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedStyle: {
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 1,
    },

    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,

    marginVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 6,
  },
  textSelectedStyle: {
    marginRight: 4,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    minWidth: 60,
    paddingRight: 4,
  },
});

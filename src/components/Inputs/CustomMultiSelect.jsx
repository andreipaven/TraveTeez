import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Animated,
  Platform,
} from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import { useTheme } from "../../Theme/themeContext";
import { Icon } from "react-native-elements";
import * as Haptics from "expo-haptics";

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
  focusBorderColor,
  search,
  containerStylePosition,
  containerStyleMarginBottom,
}) => {
  const [selected, setSelected] = useState(selectedValue);
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = async (items) => {
    setSelected(items);
    if (onValueChange) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      onValueChange(items);
    }
  };

  const renderItem = (item) => {
    const isSelected = selected.includes(item.value);
    return (
      <View
        style={[
          styles.item,
          {
            backgroundColor: isSelected
              ? theme.colors.primary
              : theme.colors.backgroundPrimary,
          },
        ]}
      >
        <Text
          style={[
            styles.selectedTextStyle,
            {
              color: theme.colors.textPrimary,
            },
          ]}
        >
          {item.label}
        </Text>
      </View>
    );
  };

  const animatedLabel = useRef(
    new Animated.Value(selected.length ? 1 : 0),
  ).current;

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || selected.length ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [isFocused, selected]);

  const labelStyle = {
    position: "absolute",
    left: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 12],
    }),
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
    backgroundColor: backgroundColor || theme.colors.backgroundPrimary,
    paddingHorizontal: 4,
    zIndex: 10,
    borderRadius: 100,
  };

  useEffect(() => {
    setSelected(selectedValue || []);
  }, [selectedValue]);

  return (
    <View style={[styles.container, { marginTop }]}>
      {label && <Animated.Text style={labelStyle}>{label}</Animated.Text>}
      <MultiSelect
        style={[
          styles.dropdown,
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
        placeholderStyle={{
          left: 14,
          color: theme.colors.textPrimary,
          marginRight: 14,
        }}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={[
          styles.inputSearchStyle,
          {
            color: theme.colors.textPrimary,
            borderColor: theme.colors.primary,
            borderRadius: 100,
            paddingHorizontal: 8,
          },
        ]}
        iconStyle={styles.iconStyle}
        data={options}
        labelField="label"
        valueField="value"
        search={search}
        searchPlaceholder={"Search..."}
        placeholder={
          selected.length
            ? selected
                .slice()
                .reverse()
                .map((val) => {
                  const option = options.find((o) => o.value === val);
                  return option ? option.label : val;
                })
                .join(", ")
            : "..."
        }
        value={selected}
        onChange={handleChange}
        renderItem={renderItem}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        renderSelectedItem={(item, unSelect) => (
          <View
            style={[
              styles.selectedStyle,
              {
                shadowColor: theme.colors.shadowPrimary,
                backgroundColor: theme.colors.backgroundPrimary,
                flexDirection: "row",
                marginHorizontal: 8,
                alignSelf: "center",
                paddingVertical: 8,
              },
            ]}
          >
            <Text
              style={{
                flexShrink: 1,
                color: theme.colors.textPrimary,
                marginHorizontal: 4,
              }}
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
                size={16}
              />
            </TouchableOpacity>
          </View>
        )}
        containerStyle={{
          backgroundColor: theme.colors.backgroundPrimary,
          borderWidth: 0,
          shadowColor: theme.colors.shadowPrimary,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.5,
          shadowRadius: 3.84,
          elevation: 3,
          position: containerStylePosition,
          bottom: containerStyleMarginBottom,
          borderRadius: Platform.OS === "ios" ? 0 : 16,
          overflow: Platform.OS === "ios" ? "default" : "hidden",
        }}
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
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 2,

    marginVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 6,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    minWidth: 60,
    paddingRight: 4,
  },
});

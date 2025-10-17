import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { useTheme } from "../../Theme/themeContext";
import { Ionicons } from "@expo/vector-icons";

export default function CustomTextInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  borderColor,
  focusBorderColor,
  backgroundColor,
  textColor,
  name,
  iconLeft,
  iconRight,
  error,
  borderWidth,
  borderRadius,
  multiLine,
  minHeight,
  maxLength,
}) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(secureTextEntry || false);
  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleChange = (text) => {
    if (onChangeText) onChangeText(name, text);
  };

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: "absolute",
    left: iconLeft
      ? animatedLabel.interpolate({
          inputRange: [0, 1],
          outputRange: [32, 20],
        })
      : animatedLabel.interpolate({
          inputRange: [0, 1],
          outputRange: [14, 10],
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
    backgroundColor: backgroundColor || theme.colors.backgroundDefault,
    paddingHorizontal: 4,
    width: "auto",
    borderRadius: 100,
  };

  return (
    <View style={{ marginVertical: 8, width: "100%" }}>
      <View
        style={{
          position: "relative",
          flexDirection: "row",
          alignItems: "center",
          borderWidth: borderWidth || 2,
          borderColor: error
            ? theme.colors.error
            : isFocused
              ? focusBorderColor || borderColor
              : borderColor + "88",
          borderRadius: borderRadius || 16,
          backgroundColor: backgroundColor,
          paddingVertical: 8,
        }}
      >
        {label && <Animated.Text style={labelStyle}>{label}</Animated.Text>}

        {/* Icon stânga */}
        {iconLeft && (
          <View style={{ paddingLeft: 12, paddingRight: 4 }}>{iconLeft}</View>
        )}

        {/* TextInput */}
        <TextInput
          style={{
            flex: 1,
            paddingVertical: 6,
            paddingHorizontal: iconLeft ? 8 : 16,
            fontSize: 16,
            color: textColor || theme.colors.textPrimary,
            minHeight: minHeight || 0,
          }}
          textAlignVertical={"top"}
          multiline={multiLine || false}
          value={value}
          onChangeText={handleChange}
          secureTextEntry={hidePassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength || 250}
        />

        {multiLine && maxLength && (
          <Text
            style={{
              alignSelf: "flex-end",
              paddingRight: 8,
              paddingTop: 4,
              color: theme.colors.textSecondary,
              fontSize: 12,
            }}
          >
            {value ? value.length : 0}/{maxLength}
          </Text>
        )}

        {/* Icon dreapta sau buton pentru parolă */}
        {secureTextEntry ? (
          <TouchableOpacity
            onPress={() => setHidePassword(!hidePassword)}
            style={{ paddingHorizontal: 12 }}
          >
            <Ionicons
              name={hidePassword ? "eye-off" : "eye"}
              size={22}
              color={color || theme.colors.textSecondary}
            />
          </TouchableOpacity>
        ) : (
          iconRight && <View style={{ paddingRight: 12 }}>{iconRight}</View>
        )}
      </View>

      {error && error !== "z" && (
        <Text
          style={{ color: "red", fontSize: 14, paddingTop: 2, paddingLeft: 8 }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

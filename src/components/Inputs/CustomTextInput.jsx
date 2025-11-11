import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Pressable,
} from "react-native";
import { useTheme } from "../../Theme/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { Icon } from "react-native-elements";

export default function CustomTextInput({
  label,
  width,
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
  style,
  placeholder,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  buttonRight,
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
          outputRange: [36, 20],
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
    <View style={[{ marginVertical: 8, width: width || "100%" }, style]}>
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

        {/* Icon left */}
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
          placeholderTextColor={textColor}
          textAlignVertical={"top"}
          multiline={multiLine || false}
          value={value}
          onChangeText={handleChange}
          secureTextEntry={hidePassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength || 250}
          placeholder={placeholder}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
        />

        {multiLine && maxLength && (
          <Text
            style={{
              position: "absolute",
              alignSelf: "flex-end",
              paddingRight: 4,
              paddingTop: 4,
              right: 0,
              color: theme.colors.textSecondary,
              fontSize: 12,
            }}
          >
            {value ? value.length : 0}/{maxLength}
          </Text>
        )}

        {/* Icon right or button for password */}
        {secureTextEntry ? (
          <TouchableOpacity
            onPress={() => setHidePassword(!hidePassword)}
            style={{ paddingHorizontal: 12 }}
          >
            <Ionicons
              name={hidePassword ? "eye-off" : "eye"}
              size={22}
              color={textColor || theme.colors.textSecondary}
            />
          </TouchableOpacity>
        ) : (
          iconRight && <View style={{ paddingRight: 12 }}>{iconRight}</View>
        )}

        {buttonRight && <View style={{ paddingRight: 12 }}>{buttonRight}</View>}
      </View>

      {error && error !== "z" && (
        <Text
          style={{
            color: theme.colors.error,
            fontSize: 14,
            paddingTop: 2,
            paddingLeft: 8,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

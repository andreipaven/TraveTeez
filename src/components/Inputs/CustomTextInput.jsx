import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
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
  color,
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

  const handleChange = (text) => {
    if (onChangeText) onChangeText(name, text);
  };

  return (
    <View style={{ marginBottom: 12, width: "100%" }}>
      {/* Input Wrapper */}

      <View
        style={{
          flexDirection: "row",
          alignItems: multiLine ? "start" : "center",
          borderWidth: borderWidth || 2,
          borderColor: error
            ? "red"
            : isFocused
              ? focusBorderColor
              : borderColor,
          borderRadius: borderRadius || 16,
          backgroundColor: backgroundColor,
        }}
      >
        {/*Label*/}
        {label && (
          <Text
            style={{
              fontSize: 16,
              marginLeft: 4,
              color: theme.colors.textSecondary,
              minWidth: 60,
              paddingTop: multiLine && 8,
            }}
          >
            {label}
          </Text>
        )}
        {/* Icon Left */}
        {iconLeft && <View style={{ paddingLeft: 12 }}>{iconLeft}</View>}

        {/* Input Field */}
        <TextInput
          style={{
            flex: 1,
            paddingVertical: 8,
            paddingHorizontal: 8,
            fontSize: 16,
            color: color,
            borderStyle: "solid",
            outlineWidth: 0,
            minHeight: minHeight || 0,
          }}
          textAlignVertical={"top"}
          multiline={multiLine || false}
          placeholder={placeholder}
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

        {secureTextEntry ? (
          <TouchableOpacity
            onPress={() => setHidePassword(!hidePassword)}
            style={{ paddingRight: 12 }}
          >
            <Ionicons
              name={hidePassword ? "eye-off" : "eye"}
              size={24}
              color={color || theme.colors.textSecondary}
            />
          </TouchableOpacity>
        ) : (
          iconRight && <View style={{ paddingRight: 12 }}>{iconRight}</View>
        )}
      </View>

      {error && error !== "z" && (
        <Text
          style={{ color: "red", fontSize: 16, paddingTop: 2, paddingLeft: 8 }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

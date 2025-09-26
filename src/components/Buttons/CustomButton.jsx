import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function CustomButton({
  title,
  onPress,
  backgroundColor,
  textColor,
  borderColor,
  borderRadius = 8,
  paddingVertical = 0,
  paddingHorizontal = 0,
  marginHorizontal,
  fontSize = 16,
  fontWeight = "bold",
  iconLeft,
  iconRight,
  style,
  width,
  iconCenter,
  borderWidth,
  flexDirection,
  alignItems,
  maxHeight,
  activeOpacity,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={activeOpacity || 0.8}
      style={[
        {
          flexDirection: flexDirection || "row",
          alignItems: alignItems || "center",
          justifyContent: "center",
          backgroundColor,
          borderRadius,
          paddingVertical,
          paddingHorizontal,
          marginHorizontal,
          width: width || "100%",
          borderColor,
          borderWidth,
          maxHeight: maxHeight,
        },
        style,
      ]}
    >
      {iconLeft && <View style={{ marginRight: 0 }}>{iconLeft}</View>}
      {iconCenter && <View>{iconCenter}</View>}
      {title && (
        <Text style={{ color: textColor, fontSize, fontWeight }}>{title}</Text>
      )}
      {iconRight && <View style={{ marginLeft: 0 }}>{iconRight}</View>}
    </TouchableOpacity>
  );
}

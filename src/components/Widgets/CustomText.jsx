import React from "react";
import { Text } from "react-native";

function CustomText({ children, style }) {
  return (
    <Text style={[{ fontWeight: "400", fontSize: 16 }, style]}>{children}</Text>
  );
}

export default CustomText;

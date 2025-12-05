import React from "react";
import { Text } from "react-native";

function CustomText({ children, style, numberOfLines }) {
  return (
    <Text
      style={[{ fontWeight: "400", fontSize: 16 }, style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
}

export default CustomText;

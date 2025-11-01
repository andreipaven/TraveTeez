import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CustomDivider({ text, lineColor, textColor, style }) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.line, { backgroundColor: lineColor }]} />
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
      <View style={[styles.line, { backgroundColor: lineColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    width: "100%",
    justifyContent: "center",
  },
  line: {
    height: 1,
    flex: 1,
  },
  text: {
    marginHorizontal: 8,
    fontSize: 16,
  },
});

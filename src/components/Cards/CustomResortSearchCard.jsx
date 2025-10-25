import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { Icon } from "react-native-elements";

const CustomResortSearchCard = React.memo(({ item, theme, navigation }) => {
  return (
    <View
      style={{
        width: "100%",
        height: 100,
        flexDirection: "row",
        borderRadius: 16,
        marginVertical: 6,
        gap: 4,
      }}
    >
      <ImageBackground
        source={{ uri: item.mainImage.image_url || "" }}
        style={{
          width: 120,
          height: 100,
          borderRadius: 16,
          overflow: "hidden",
        }}
        resizeMode={"cover"}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "600", fontSize: 16 }}>{item.name}</Text>
        <View style={{ flexDirection: "row" }}>
          <Icon
            name={"map-marker"}
            type={"material-community"}
            size={16}
            color={theme.colors.textSecondary}
            style={{ marginLeft: -2 }}
          />
          <Text style={{ fontSize: 14 }}>
            {item.state}, {item.country}
          </Text>
        </View>
      </View>
    </View>
  );
});

export default CustomResortSearchCard;

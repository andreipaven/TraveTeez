import React from "react";
import { View, Text, ImageBackground, Pressable } from "react-native";
import { useTheme } from "../../Theme/themeContext";
import { useNavigation } from "@react-navigation/native";

const CustomResortSearchCard = React.memo(({ item }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  return (
    <View
      style={{
        width: "100%",
        height: 100,
        flexDirection: "row",
        borderRadius: 16,
        marginVertical: 8,
        gap: 4,
      }}
    >
      <Pressable
        style={{
          position: "absolute",
          width: "100%",
          height: 100,
          backgroundColor: "transparent",
          left: 0,
          top: 0,
          zIndex: 6,
        }}
        onPress={() =>
          navigation.navigate("ResortProfile", {
            state: { resortId: item.resort_id },
          })
        }
      />
      <ImageBackground
        source={{ uri: item.mainImage.image_url || "" }}
        style={{
          width: 120,
          height: 100,
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          overflow: "hidden",
          zIndex: 1,
        }}
        resizeMode={"cover"}
      />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          marginLeft: -20,
          zIndex: 5,
          backgroundColor: theme.colors.backgroundPrimary,
          borderRadius: 16,
          paddingLeft: 10,
        }}
      >
        <Text
          style={{
            fontWeight: "600",
            fontSize: 20,
            color: theme.colors.textPrimary,
          }}
        >
          {item.name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, color: theme.colors.textSecondary }}>
            {item.city && item.city + ","} {item.state}, {item.country}
          </Text>
        </View>
      </View>
    </View>
  );
});

export default CustomResortSearchCard;

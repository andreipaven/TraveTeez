import React from "react";
import { ImageBackground, Pressable, Text, View } from "react-native";
import RatingOneStar from "../Ratings/RatingOneStar";
import Favorite from "../Favorite/Favorite";
import { Icon } from "react-native-elements";
import { TapGestureHandler } from "react-native-gesture-handler";
import { useTheme } from "../../Theme/themeContext";
import { useNavigation } from "@react-navigation/native";

const CustomResortCard = React.memo(({ item }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  if (item.resort_id === 2240) {
    console.log(item);
  }
  return (
    <View
      style={{
        marginHorizontal: 8,
        borderRadius: 8,
        shadowColor: theme.colors.shadowPrimary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 2.5,
        elevation: 2,
        width: 160,
        height: "auto",
      }}
    >
      <TapGestureHandler
        onActivated={() =>
          navigation.navigate("ResortProfile", {
            state: { resortId: item.resort_id },
          })
        }
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
            backgroundColor: "transparent",
          }}
        />
      </TapGestureHandler>
      <ImageBackground
        source={{ uri: item.mainImage.image_url || "" }}
        style={{
          width: 160,
          height: 140,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          overflow: "hidden",
          backgroundColor: theme.colors.backgroundPrimary,
        }}
        resizeMode="cover"
      />
      <View
        style={{
          backgroundColor: theme.colors.backgroundPrimary,
          borderBottomRightRadius: 8,
          borderBottomLeftRadius: 8,
          paddingHorizontal: 6,
          paddingVertical: 4,
          flex: 1,
          justifyContent: "flex-start",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          height: 80,
          marginTop: -16,
        }}
      >
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontWeight: 500,
            fontSize: 14,
          }}
        >
          {item.name.length > 36 ? item.name.slice(0, 33) + "..." : item.name}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Icon
            name={"map-marker"}
            type={"material-community"}
            size={16}
            color={theme.colors.textSecondary}
            style={{ marginLeft: -2 }}
          />
          <Text
            style={{
              color: theme.colors.textSecondary,
              flexShrink: 1,
              flexWrap: "wrap",
            }}
          >
            {item.country}, {item.state}
            {item.city && ", " + item.city}
          </Text>
        </View>
        <RatingOneStar
          resortId={item.resort_id}
          right={8}
          bottom={6}
          textSize={14}
          size={12}
          fontWeight={"normal"}
          textColor={theme.colors.textSecondary}
        />
      </View>
      <Favorite
        resortId={item.resort_id}
        size={24}
        top={4}
        right={4}
        style={{ zIndex: 2, padding: 4 }}
      />
    </View>
  );
});

export default CustomResortCard;

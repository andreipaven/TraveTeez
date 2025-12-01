import React from "react";
import { ImageBackground, Pressable, Text, View } from "react-native";
import RatingOneStar from "../Ratings/RatingOneStar";
import Favorite from "../Favorite/Favorite";
import { Icon } from "react-native-elements";
import { TapGestureHandler } from "react-native-gesture-handler";
import { useTheme } from "../../Theme/themeContext";
import { useNavigation } from "@react-navigation/native";

const CustomResortCard = React.memo(
  ({ item, marginHorizontal = 8, refreshing }) => {
    const { theme } = useTheme();
    const navigation = useNavigation();

    return (
      <View
        style={{
          marginHorizontal: marginHorizontal,
          borderRadius: 32,
          width: 170,
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
            width: 170,
            height: 150,
            borderRadius: 24,
            overflow: "hidden",
            backgroundColor: theme.colors.backgroundPrimary,
          }}
          resizeMode="cover"
        />
        <View
          style={{
            backgroundColor: theme.colors.backgroundPrimary,
            paddingHorizontal: 6,
            paddingVertical: 4,
            flex: 1,
            justifyContent: "flex-start",
            height: 80,
          }}
        >
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {item.name}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Icon
              name={"map-marker"}
              type={"material-community"}
              size={12}
              color={theme.colors.textSecondary}
              style={{ marginLeft: -2, marginTop: 1 }}
            />
            <Text
              style={{ fontSize: 12, color: theme.colors.textSecondary }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.city && `${item.city}, `}
              {item.state}, {item.country}
            </Text>
          </View>
        </View>
        <Favorite
          resortId={item.resort_id}
          size={24}
          top={4}
          right={4}
          style={{ zIndex: 2, padding: 4 }}
          refreshing={refreshing}
        />
        <RatingOneStar
          resortId={item.resort_id}
          textSize={12}
          size={12}
          fontWeight={"normal"}
          textColor={theme.colors.textPrimary}
          top={120}
          right={8}
          style={{
            backgroundColor: theme.colors.backgroundPrimary,
            borderRadius: 100,
            paddingVertical: 2,
            paddingHorizontal: 8,
          }}
        />
      </View>
    );
  },
);

export default CustomResortCard;

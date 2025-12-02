import React, { useEffect, useState } from "react";
import { ImageBackground, Pressable, Text, View } from "react-native";
import RatingOneStar from "../Ratings/RatingOneStar";
import Favorite from "../Favorite/Favorite";
import { Icon } from "react-native-elements";
import { TapGestureHandler } from "react-native-gesture-handler";
import { useTheme } from "../../Theme/themeContext";
import { useNavigation } from "@react-navigation/native";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";

const CustomResortCard = React.memo(
  ({ item, marginHorizontal = 8, refreshing, width }) => {
    const { theme } = useTheme();
    const navigation = useNavigation();

    const height = useSharedValue(40);

    const animatedStyle = useAnimatedStyle(() => ({
      height: height.value,
      overflow: "hidden",
    }));

    return (
      <View
        style={{
          marginHorizontal: marginHorizontal,
          borderRadius: 24,
          width: width || 170,
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
            width: width || 170,
            height: 150,
            borderRadius: 24,
            overflow: "hidden",
            backgroundColor: theme.colors.backgroundPrimary,
          }}
          resizeMode="cover"
        />
        {/*  invisible measurer*/}
        <View
          style={{
            backgroundColor: theme.colors.backgroundPrimary,
            paddingHorizontal: 6,
            paddingVertical: 4,
            justifyContent: "flex-start",
            position: "absolute",
            opacity: 0,
            zIndex: -1,
          }}
          onLayout={(event) => {
            const h = event.nativeEvent.layout.height;
            height.value = withTiming(h, { duration: 300 });
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
        <Animated.View style={[animatedStyle]}>
          <View
            style={{
              paddingHorizontal: 6,
              paddingVertical: 4,
              justifyContent: "flex-start",
            }}
          >
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: theme.colors.textPrimary,
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
        </Animated.View>
        <Favorite
          resortId={item.resort_id}
          size={24}
          top={4}
          right={4}
          secondRight={4}
          secondTop={4}
          style={{ zIndex: 2, padding: 4 }}
          refreshing={refreshing}
          borderColor={theme.colors.textDark}
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

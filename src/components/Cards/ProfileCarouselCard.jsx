import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  Pressable,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { interpolateColor } from "react-native-reanimated/src";
import { useTheme } from "../../Theme/themeContext";
import { useNavigation } from "@react-navigation/native";

export default function ProfileCarouselCard({
  item,
  images,
  id,
  total,
  scrollX,
}) {
  const navigation = useNavigation();
  const { width } = Dimensions.get("screen");
  const { theme } = useTheme();
  const inputRange = [
    (id - 1) * (width * 0.42),
    id * (width * 0.42),
    (id + 1) * (width * 0.42),
  ];
  const translateStyle = useAnimatedStyle(() => {
    const translate = interpolate(
      scrollX.value,
      inputRange,
      [0.89, 0.97, 0.89],
      Extrapolation.CLAMP,
    );

    const borderColor = interpolateColor(scrollX.value, inputRange, [
      "transparent",
      theme.colors.primary,
      "transparent",
    ]);

    return {
      transform: [{ scale: translate }],
      borderWidth: 2,
      borderColor,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: width * 0.5,
          height: 220,
          overflow: "hidden",
          borderRadius: 12,
          marginRight: id === total - 1 ? width * 0.42 : undefined,
        },
        translateStyle,
      ]}
    >
      <Carousel
        data={images}
        vertical={false}
        width={width * 0.5}
        height={220}
        loop
        autoPlay
        autoPlayInterval={700}
        scrollAnimationDuration={2000}
        renderItem={({ item }) => (
          <View style={{ width: "100%", height: "100%" }}>
            <ImageBackground
              source={{ uri: item.image_url }}
              resizeMode="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        )}
      />
      <Text
        style={{
          position: "absolute",
          top: 4,
          left: 4,
          fontWeight: "bold",
          width: "70%",
          flexShrink: 1,
        }}
      >
        {item.name}
      </Text>
      <Pressable
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        onPress={() => {
          navigation.navigate("EditResort", {
            state: { resortId: item.resort_id },
          });
        }}
      />
    </Animated.View>
  );
}

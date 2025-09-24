import React from "react";
import { Text, ImageBackground, Dimensions } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const ITEM_WIDTH = Dimensions.get("screen").width - 64;
const ITEM_HEIGHT = 200;
const CustomCarouselCard = ({ item, id, scrollX }) => {
  const inputRange = [
    (id - 1) * ITEM_WIDTH,
    id * ITEM_WIDTH,
    (id + 1) * ITEM_WIDTH,
  ];
  const translateStyle = useAnimatedStyle(() => {
    const translate = interpolate(
      scrollX.value,
      inputRange,
      [0.92, 1, 0.92],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ scale: translate }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: ITEM_WIDTH,
          height: ITEM_HEIGHT,
          marginLeft: id === 0 ? 32 : undefined,
        },
        translateStyle,
      ]}
    >
      <ImageBackground
        source={{ uri: item.mainImage.image_url || "" }}
        resizeMode={"cover"}
        style={{
          overflow: "hidden",
          borderRadius: 16,
          width: "100%",
          height: "100%",
        }}
      ></ImageBackground>
    </Animated.View>
  );
};

export default CustomCarouselCard;

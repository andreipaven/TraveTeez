import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import CustomCarouselCard from "../Cards/CustomCarouselCard";
import Animated, { useSharedValue } from "react-native-reanimated";

const ITEM_WIDTH = Dimensions.get("screen").width - 64;
const ITEM_HEIGHT = 200;

export default function CustomCarousel({ dates }) {
  const scrollX = useSharedValue(0);

  return (
    <View
      style={{
        width: "100%",
        height: "auto",
        paddingVertical: 16,
      }}
    >
      <Animated.ScrollView
        horizontal
        decelerationRate={"fast"}
        snapToInterval={ITEM_WIDTH}
        bounces={false}
        disableIntervalMomentum
        scrollEventThrottle={12}
        onScroll={(event) =>
          (scrollX.value = event.nativeEvent.contentOffset.x)
        }
      >
        {dates.map((resort, index) => (
          <CustomCarouselCard
            item={resort}
            key={index}
            id={index}
            scrollX={scrollX}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

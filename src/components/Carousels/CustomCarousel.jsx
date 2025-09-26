import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import CustomCarouselCard from "../Cards/CustomCarouselCard";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

const width = Dimensions.get("window").width;

export default function CustomCarousel({ dates }) {
  const ref = useRef(null);
  const progress = useSharedValue(0);

  return (
    <View
      style={{
        width: "100%",
        height: "auto",
        paddingVertical: 0,
      }}
    >
      <Carousel
        vertical={false}
        ref={ref}
        loop={false}
        width={width}
        height={220}
        data={dates}
        onProgressChange={progress}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.93,
          parallaxScrollingOffset: 60,
        }}
        renderItem={({ index, item }) => (
          <CustomCarouselCard item={item} key={index} />
        )}
      />
    </View>
  );
}

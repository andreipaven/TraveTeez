import React, { useRef, useState } from "react";
import { Dimensions, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProfileCarouselCard from "../Cards/ProfileCarouselCard";
import Animated, { useSharedValue } from "react-native-reanimated";

const ProfileCarousel = ({ resorts, resortImages }) => {
  const { width } = Dimensions.get("screen") * 0.42;
  const scrollX = useSharedValue(0);
  return (
    <Animated.ScrollView
      horizontal
      decelerationRate={"fast"}
      snapToInterval={width}
      style={{ padding: 4, marginLeft: -4 }}
      disableIntervalMomentum
      bounces={false}
      scrollEventThrottle={12}
      onScroll={(event) => {
        scrollX.value = event.nativeEvent.contentOffset.x;
      }}
    >
      {resorts.map((item, index) => (
        <ProfileCarouselCard
          key={index}
          item={item}
          images={resortImages[index]}
          scrollX={scrollX}
          total={resorts.length}
          id={index}
        />
      ))}
    </Animated.ScrollView>
  );
};

export default ProfileCarousel;

import React, { useRef, useState } from "react";
import { Dimensions, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProfileCarouselCard from "../Cards/ProfileCarouselCard";
import Animated, { useSharedValue } from "react-native-reanimated";
import CustomCarouselCard from "../Cards/CustomCarouselCard";
import Carousel from "react-native-reanimated-carousel";

const width = Dimensions.get("window").width;

//main function
const ProfileCarousel = ({ resorts }) => {
  const ref = useRef(null);
  const progress = useSharedValue(0);
  return (
    <Carousel
      vertical={false}
      ref={ref}
      width={width}
      loop={false}
      height={220}
      data={resorts}
      onProgressChange={progress}
      mode="parallax"
      modeConfig={{
        parallaxScrollingScale: 0.96,
        parallaxScrollingOffset: 120,
      }}
      renderItem={({ index, item }) => (
        <ProfileCarouselCard
          item={item}
          key={index}
          resortId={item.resort_id}
        />
      )}
    />
  );
};

export default ProfileCarousel;

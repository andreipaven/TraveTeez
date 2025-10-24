import React, { useRef } from "react";
import { Dimensions } from "react-native";

import ProfileCarouselCard from "../Cards/ProfileCarouselCard";
import { useSharedValue } from "react-native-reanimated";
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
        parallaxScrollingScale: 0.92,
        parallaxScrollingOffset: 140,
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

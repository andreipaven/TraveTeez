import React, { useRef } from "react";
import { View, ImageBackground } from "react-native";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import {
  Extrapolation,
  interpolate,
  useSharedValue,
} from "react-native-reanimated";

import { useTheme } from "../../Theme/themeContext";

import RatingAllStars from "../Ratings/RatingAllStars";

//main function
const ResortProfileCarousel = ({ resortId, images, width, height }) => {
  const { theme } = useTheme();
  const ref = useRef(null);
  const progress = useSharedValue(0);
  const onPressPagination = (index) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View style={{ width, height }}>
      <Carousel
        autoPlay={true}
        autoPlayInterval={2000}
        scrollAnimationDuration={1000}
        vertical={false}
        ref={ref}
        width={width}
        height={height}
        data={images}
        onProgressChange={progress}
        onConfigurePanGesture={(gesture) =>
          gesture.activeOffsetX([-5, 5]).failOffsetY([-5, 5])
        }
        renderItem={({ item }) => (
          <ImageBackground
            source={{ uri: item?.image_url }}
            resizeMode="cover"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        )}
      />
      <Pagination.Custom
        progress={progress}
        data={images.map((color) => ({ color }))}
        size={8}
        dotStyle={{
          borderRadius: 16,
          backgroundColor: theme.colors.shadowPrimary,
        }}
        activeDotStyle={{
          borderRadius: 8,
          width: 16,
          height: 6,
          overflow: "hidden",
          backgroundColor: theme.colors.primary,
        }}
        containerStyle={{
          gap: 5,
          alignItems: "center",
          bottom: 20,
        }}
        horizontal
        onPress={onPressPagination}
        customReanimatedStyle={(progress, index, length) => {
          let val = Math.abs(progress - index);
          if (index === 0 && progress > length - 1) {
            val = Math.abs(progress - length);
          }

          return {
            transform: [
              {
                translateY: interpolate(
                  val,
                  [0, 1],
                  [0, 0],
                  Extrapolation.CLAMP,
                ),
              },
            ],
          };
        }}
      />

      <RatingAllStars
        position={"absolute"}
        left={10}
        bottom={30}
        resortId={resortId}
      />
    </View>
  );
};

export default ResortProfileCarousel;

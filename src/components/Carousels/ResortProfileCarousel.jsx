import React, { useRef, useState } from "react";
import { View, ImageBackground, Text } from "react-native";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import {
  Extrapolation,
  interpolate,
  useSharedValue,
} from "react-native-reanimated";

import { useTheme } from "../../Theme/themeContext";

import RatingAllStars from "../Ratings/RatingAllStars";
import PaginationDot from "react-native-animated-pagination-dot";
import { BlurView } from "expo-blur";

//main function
const ResortProfileCarousel = ({ resortId, images, width, height }) => {
  const { theme } = useTheme();
  const ref = useRef(null);

  const [curPage, setCurPage] = useState(0);
  return (
    <View style={{ width, height }}>
      <Carousel
        autoPlay={true}
        autoPlayInterval={1500}
        scrollAnimationDuration={300}
        vertical={false}
        loop={false}
        ref={ref}
        width={width}
        height={height}
        data={images}
        onProgressChange={(offsetProgress, absoluteProgress) => {
          setCurPage(Math.round(absoluteProgress));
        }}
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

      <View
        style={{
          position: "absolute",
          bottom: 10,
          alignSelf: "center",
          borderRadius: 20,
        }}
      >
        <PaginationDot
          activeDotColor={theme.colors.primary}
          curPage={curPage}
          maxPage={images.length}
          sizeRatio={1}
        />
      </View>
      <BlurView
        style={{
          position: "absolute",
          bottom: 8,
          right: 16,
          alignSelf: "flex-end",
          backgroundColor:
            theme.mode === "light"
              ? theme.colors.backgroundPrimary + "88"
              : theme.colors.backgroundPrimary,
          padding: 4,
          borderRadius: 100,
          width: 50,
          alignItems: "center",
          overflow: "hidden",
        }}
        intensity={theme.mode === "light" ? 50 : 10}
      >
        <Text style={{ fontWeight: "500", color: theme.colors.textPrimary }}>
          {curPage + 1}/{images.length}
        </Text>
      </BlurView>

      <RatingAllStars
        position={"absolute"}
        left={16}
        bottom={8}
        resortId={resortId}
      />
    </View>
  );
};

export default ResortProfileCarousel;

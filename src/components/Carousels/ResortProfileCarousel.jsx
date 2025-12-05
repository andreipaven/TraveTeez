import React, { useRef, useState } from "react";
import { View, ImageBackground, Text } from "react-native";
import Carousel from "react-native-reanimated-carousel";

import { useTheme } from "../../Theme/themeContext";

import PaginationDot from "react-native-animated-pagination-dot";

//main function
const ResortProfileCarousel = ({
  images,
  width,
  height,
  setCarouselIndex,
  autoPlay = true,
}) => {
  const { theme } = useTheme();
  const ref = useRef(null);

  const [curPage, setCurPage] = useState(0);
  return (
    <View style={{ width, height }}>
      <Carousel
        autoPlay={autoPlay}
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
          setCarouselIndex(Math.round(absoluteProgress));
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
    </View>
  );
};

export default ResortProfileCarousel;

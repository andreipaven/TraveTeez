import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  Pressable,
  Platform,
} from "react-native";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import {
  Extrapolation,
  interpolate,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import Loading from "../Loading/Loading";
import { useTheme } from "../../Theme/themeContext";
import Favorite from "../Favorite/Favorite";
import CustomButton from "../Buttons/CustomButton";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import RatingAllStars from "../Ratings/RatingAllStars";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

//main function
const ResortProfileCarousel = ({ resortId, images, isFavorite }) => {
  const { theme } = useTheme();
  const ref = useRef(null);
  const progress = useSharedValue(0);
  const navigation = useNavigation();

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
    <View style={styles.container}>
      <Carousel
        autoPlay={true}
        autoPlayInterval={2000}
        scrollAnimationDuration={1000}
        vertical={false}
        ref={ref}
        width={width}
        height={height / 2.5}
        data={images}
        onProgressChange={progress}
        renderItem={({ index, item }) => (
          <ImageBackground
            source={{ uri: item.image_url }}
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
      <Favorite
        favorite={isFavorite}
        resortId={resortId}
        size={36}
        top={20}
        right={20}
      />
      <CustomButton
        title={
          <Ionicons
            name={Platform.OS === "ios" ? "chevron-back" : "arrow-back"}
            size={20}
            color={theme.colors.textPrimary}
          />
        }
        backgroundColor={theme.colors.textDark}
        width={42}
        height={42}
        borderRadius={100}
        activeOpacity={0.5}
        style={{
          opacity: 0.7,
          position: "absolute",
          left: 10,
          top: 10,
        }}
        onPress={() => navigation.goBack()}
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

const styles = StyleSheet.create({
  container: { width: "100%" },
});
export default ResortProfileCarousel;

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  Pressable,
} from "react-native";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import {
  Extrapolation,
  interpolate,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import Loading from "../Loading/Loading";
import { useTheme } from "../../Theme/themeContext";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

//main function
const ResortProfileCarousel = ({
  resortId,
  isFavoriteX,
  fetchLoadingImages,
  images,
}) => {
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

  const [isFavorite, setIsFavorite] = useState(isFavoriteX);

  const onToggleFavorite = async () => {
    const newValue = isFavorite;

    setIsFavorite((prev) => !prev);
    try {
      if (newValue) {
        await APIService.post(config.endpoints.legacy.favorite.deleteFavorite, {
          resortId: resortId,
        });
      } else {
        await APIService.post(config.endpoints.legacy.favorite.addFavorite, {
          resortId: resortId,
        });
      }
    } catch (err) {
      console.log("Error updating favorite", err);
      setIsFavorite((prev) => !prev);
    }
  };

  useEffect(() => {
    setIsFavorite(isFavoriteX);
  }, [isFavoriteX]);

  return fetchLoadingImages ? (
    <Loading />
  ) : (
    <View style={styles.container}>
      <Carousel
        autoPlay={true}
        autoPlayInterval={2000}
        scrollAnimationDuration={2000}
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
      <Pressable
        onPress={onToggleFavorite}
        style={{
          position: "absolute",
          right: 20,
          top: 20,
        }}
      >
        <Icon
          name={isFavorite ? "heart" : "heart-outline"}
          size={32}
          color={isFavorite ? theme.colors.primary : theme.colors.textDark}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%" },
});
export default ResortProfileCarousel;

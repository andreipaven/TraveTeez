import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  ImageBackground,
  Pressable,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";

import { useTheme } from "../../Theme/themeContext";
import { useNavigation } from "@react-navigation/native";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import Loading from "../Loading/Loading";
const width = Dimensions.get("window").width;
export default function ProfileCarouselCard({ item, resortId }) {
  const navigation = useNavigation();

  const { theme } = useTheme();
  const ref = useRef(null);
  const progress = useSharedValue(0);
  const [images, setImages] = useState([]);
  const [fetchLoading, setFetchLoading] = useState({ images: false });
  useEffect(() => {
    setFetchLoading((prev) => ({
      ...prev,
      images: true,
    }));
    APIService.post(config.endpoints.legacy.resort.getImagesByResort, {
      resortId,
    })
      .then((response) => {
        if (response?.data.error) {
          console.log("Something wrong happened " + response.data.error);
        } else {
          setImages(response.data);
        }
      })
      .catch((err) => {
        console.log("An error occurred " + err);
      })
      .finally(() => {
        setFetchLoading((prev) => ({
          ...prev,
          images: false,
        }));
      });
  }, [resortId]);

  return (
    <View
      style={{
        width: width / 1.5,
        height: 220,
        overflow: "hidden",
        borderRadius: 12,
      }}
    >
      {fetchLoading.images ? (
        <Loading />
      ) : (
        <Carousel
          vertical={false}
          autoPlay={true}
          autoPlayInterval={1000}
          scrollAnimationDuration={2000}
          ref={ref}
          loop={true}
          width={width / 1.5}
          style={{ pointerEvents: "none" }}
          height={220}
          data={images}
          onProgressChange={progress}
          renderItem={({ item: img }) => (
            <ImageBackground
              source={{ uri: img?.image_url }}
              resizeMode={"cover"}
              style={{ width: "100%", height: "100%" }}
            />
          )}
        />
      )}
      <Text
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          fontWeight: "bold",
          maxWidth: "70%",
          flexShrink: 1,
          backgroundColor: theme.colors.backgroundPrimary + "cc",
          padding: 4,
          borderTopRightRadius: 8,
        }}
      >
        {item.name}
      </Text>
      <Pressable
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        onPress={() => {
          navigation.navigate("EditResort", {
            state: { resortId: item.resort_id },
          });
        }}
      />
    </View>
  );
}

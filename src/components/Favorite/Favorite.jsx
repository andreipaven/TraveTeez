import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "../../Theme/themeContext";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

const Favorite = ({
  resortId,
  top,
  right,
  style,
  size,
  position,
  left,
  bottom,
  backgroundColor,
  padding,
  borderRadius,
  refreshing,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { theme } = useTheme();
  const isFocused = useIsFocused();
  const [fetchLoading, setFetchLoading] = useState(false);
  const navigation = useNavigation();

  const onToggleFavorite = async () => {
    const newValue = isFavorite;
    setIsFavorite((prev) => !prev);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
      navigation.navigate("SignIn");
      console.log("Error updating favorite", err);
      setIsFavorite((prev) => !prev);
    }
  };

  const fetchFavorites = () => {
    if (fetchLoading) return;
    setFetchLoading(true);
    APIService.post(config.endpoints.legacy.favorite.verifyFavorite, {
      resortId: resortId,
    })
      .then((response) => {
        if (response?.data.error) {
          console.log("Something wrong happened " + response.data.error);
        } else {
          setIsFavorite(response.data);
        }
      })
      .catch((err) => {
        console.log("An error occurred " + err);
      })
      .finally(() => {
        setFetchLoading(false);
      });
  };

  useEffect(() => {
    fetchFavorites();
  }, [isFocused]);

  useEffect(() => {
    if (!refreshing) return;
    fetchFavorites();
  }, [refreshing]);

  return fetchLoading ? (
    <></>
  ) : (
    <Pressable
      onPress={() => {
        onToggleFavorite();
      }}
      style={[
        {
          position: position || "absolute",
          top,
          right,
          left,
          bottom,
          backgroundColor,
          padding,
          borderRadius,
        },
        style,
      ]}
    >
      <Icon
        name={isFavorite ? "heart" : "heart-outline"}
        size={size || 28}
        color={isFavorite ? theme.colors.primary : theme.colors.textPrimary}
        style={{ opacity: 1 }}
      />
    </Pressable>
  );
};
export default Favorite;

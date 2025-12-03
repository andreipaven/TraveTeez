import React, { useContext, useEffect } from "react";
import { Pressable, View } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "../../Theme/themeContext";
import { useDispatch, useSelector } from "react-redux";
import { setFavorite, toggleFavorite } from "../../Redux/Slices/favoriteSlice";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../Secure/AuthProvider";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

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
  secondTop,
  secondLeft,
  secondBottom,
  secondRight,
  borderColor,
}) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const isFavorite = useSelector(
    (state) => state.favorites.favorites[resortId],
  );

  useEffect(() => {
    if (!user) return;

    APIService.post(config.endpoints.legacy.favorite.verifyFavorite, {
      resortId,
    })
      .then((res) => {
        if (!res?.data?.error) {
          dispatch(setFavorite({ resortId, value: res.data }));
        }
      })
      .catch(() => {});
  }, [dispatch, resortId, user]);

  const onToggleFavorite = async () => {
    try {
      if (!user) {
        navigation.navigate("SignIn");
        return;
      }
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (isFavorite) {
        const res = await APIService.post(
          config.endpoints.legacy.favorite.deleteFavorite,
          { resortId },
        );
        if (res?.data.error) {
          console.log("Something wrong happened " + res.data.error);
        } else {
          dispatch(setFavorite({ resortId, value: false }));
        }
      } else {
        const res = await APIService.post(
          config.endpoints.legacy.favorite.addFavorite,
          { resortId },
        );
        if (res?.status === 200) {
          dispatch(setFavorite({ resortId, value: true }));
          scale.value = withTiming(1.2, { duration: 200 });
          translateY.value = withTiming(-5, { duration: 200 });
          setTimeout(() => {
            scale.value = withTiming(1, { duration: 200 });
            translateY.value = withTiming(0, { duration: 200 });
          }, 200);
        } else {
          console.log("Something wrong happened " + res?.data.error);
        }
      }
    } catch (err) {
      console.log("Error updating favorite", err);
    }
  };
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <Pressable
      onPress={onToggleFavorite}
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
      {!isFavorite && (
        <Icon
          name="heart"
          size={size || 28}
          color={theme.colors.primary + "44"}
          style={{
            position: "absolute",
            top: secondTop,
            bottom: secondBottom,
            left: secondLeft,
            right: secondRight,
          }}
        />
      )}
      <Animated.View
        style={[
          animatedStyle,
          {
            shadowColor: theme.colors.shadowPrimary,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.3,
            shadowRadius: 2.65,
            elevation: 7,
          },
        ]}
      >
        <Icon
          name={isFavorite ? "heart" : "heart-outline"}
          type="material-community"
          size={size}
          color={isFavorite ? theme.colors.primary : borderColor}
        />
      </Animated.View>
    </Pressable>
  );
};

export default Favorite;

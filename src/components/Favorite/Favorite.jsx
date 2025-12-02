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
      dispatch(toggleFavorite(resortId));

      if (isFavorite) {
        await APIService.post(config.endpoints.legacy.favorite.deleteFavorite, {
          resortId,
        });
      } else {
        scale.value = withTiming(1.2, { duration: 300 });
        setTimeout(() => {
          scale.value = withTiming(1, { duration: 300 });
        }, 300);
        await APIService.post(config.endpoints.legacy.favorite.addFavorite, {
          resortId,
        });
      }
    } catch (err) {
      console.log("Error updating favorite", err);
      dispatch(toggleFavorite(resortId));
      navigation.navigate("SignIn");
    }
  };
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
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

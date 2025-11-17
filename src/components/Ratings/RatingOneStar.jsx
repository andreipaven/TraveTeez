import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { useTheme } from "../../Theme/themeContext";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import { useIsFocused } from "@react-navigation/native";

const RatingOneStar = ({
  top,
  left,
  bottom,
  right,
  resortId,
  position,
  size = 16,
  textSize,
  zIndex,
  fontWeight,
  textColor,
}) => {
  const [rating, setRating] = useState({});
  const { theme } = useTheme();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchRatings = async () => {
      APIService.post(config.endpoints.legacy.feedback.getRating, {
        resortId,
      })
        .then((response) => {
          if (response?.data.error) {
            console.log("Something wrong happened " + response.data.error);
          } else {
            setRating(response.data);
          }
        })
        .catch((err) => {
          console.log("An error occurred " + err);
        })
        .finally(() => {});
    };
    // fetchRatings();
  }, [resortId, isFocused]);

  return (
    rating?.avg_rating_value && (
      <View
        style={{
          top,
          left,
          bottom,
          right,
          zIndex,
          position: position || "absolute",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Icon size={size} type={"font-awesome"} name={"star"} color={"gold"} />
        <Text
          style={{
            fontWeight: fontWeight || "600",
            fontSize: textSize,
            color: textColor || theme.colors.textPrimary,
            paddingLeft: 1,
          }}
        >
          {rating.avg_rating_value || "0"}
        </Text>
      </View>
    )
  );
};

export default RatingOneStar;

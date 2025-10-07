import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { useTheme } from "../../Theme/themeContext";
import APIService from "../../services/APIService";
import { config } from "../../services/config";

const RatingOneStar = ({
  top,
  left,
  bottom,
  right,
  resortId,
  position,
  size = 16,
  textSize,
}) => {
  const [rating, setRating] = useState({});
  const { theme } = useTheme();

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
    fetchRatings();
  }, [resortId]);
  return (
    <View
      style={{
        top,
        left,
        bottom,
        right,
        position: position || "absolute",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Icon size={size} type={"font-awesome"} name={"star"} color={"gold"} />
      <Text
        style={{
          fontWeight: "bold",
          fontSize: textSize,
          color: theme.colors.textPrimary,
          paddingLeft: 1,
        }}
      >
        {rating.avg_rating_value === null ? "0" : rating.avg_rating_value}
      </Text>
    </View>
  );
};

export default RatingOneStar;

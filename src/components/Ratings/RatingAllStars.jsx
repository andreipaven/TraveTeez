import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import { useTheme } from "../../Theme/themeContext";
import CustomStarRatings from "./CustomStarsRating";

const RatingAllStars = ({
  top,
  left,
  position,
  bottom,
  resortId,
  size = 20,
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
        position,
        top,
        left,
        bottom,
        flexDirection: "row",
        alignItems: "center",
        width: "fit-content",
      }}
    >
      <CustomStarRatings size={size} rating={rating.avg_rating_value} />

      {/*<Text style={{ paddingLeft: 2, color: theme.colors.textPrimary }}>*/}
      {/*  {rating.total_ratings}*/}
      {/*</Text>*/}
    </View>
  );
};

export default RatingAllStars;

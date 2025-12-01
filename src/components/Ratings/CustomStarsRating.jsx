import React from "react";
import { View } from "react-native";
import Svg, { Rect, Polygon, ClipPath, Defs } from "react-native-svg";
import { useTheme } from "../../Theme/themeContext";

const Star = ({ size = 30, fillPercent = 1 }) => {
  const { theme } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <ClipPath id="starClip">
          <Polygon points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10" />
        </ClipPath>
      </Defs>

      <Polygon
        points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10"
        fill={"rgba(204,204,204,0.70)"}
      />

      <Rect
        x="0"
        y="0"
        width={`${fillPercent * 24}`} // fraction of star
        height="24"
        fill={theme.colors.primary}
        clipPath="url(#starClip)"
      />
    </Svg>
  );
};

const CustomStarsRating = ({ rating, maxStars = 5, size = 20 }) => {
  const stars = [];
  for (let i = 0; i < maxStars; i++) {
    let fill = 0;
    if (rating >= i + 1) fill = 1;
    else if (rating > i) fill = rating - i;
    stars.push(<Star key={i} size={size} fillPercent={fill} />);
  }
  return <View style={{ flexDirection: "row" }}>{stars}</View>;
};

export default CustomStarsRating;

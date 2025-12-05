import React from "react";
import { Dimensions, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Icon } from "react-native-elements";
import { useTheme } from "../../Theme/themeContext";

const { width } = Dimensions.get("window");

const ResortProfileDivider = () => {
  const waveHeight = 8;
  const waveCount = 10;
  const waveLength = width / waveCount;
  const { theme } = useTheme();

  let path = `M0 ${waveHeight / 2}`;

  for (let i = 0; i < waveCount; i++) {
    const startX = i * waveLength;
    const midX = startX + waveLength / 2;
    const endX = startX + waveLength;

    path += ` Q${startX + waveLength / 4} 0, ${midX} ${waveHeight / 2}`;
    path += ` Q${midX + waveLength / 4} ${waveHeight}, ${endX} ${waveHeight / 2}`;
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
      }}
    >
      <Icon
        name={"palm-tree"}
        type={"material-community"}
        size={24}
        style={{ transform: [{ scaleX: -1 }] }}
        color={theme.colors.divider}
      />
      <Svg
        width={width - 48}
        height={waveHeight}
        viewBox={`0 0 ${width} ${waveHeight}`}
        style={{ paddingVertical: 16, backgroundColor: "transparent" }}
      >
        <Path
          d={path}
          fill="transparent"
          stroke={theme.colors.divider}
          strokeWidth={1.2}
        />
      </Svg>
      <Icon
        name={"palm-tree"}
        type={"material-community"}
        size={24}
        color={theme.colors.divider}
      />
    </View>
  );
};

export default ResortProfileDivider;

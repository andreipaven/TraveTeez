import React from "react";
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  Keyboard,
  Platform,
} from "react-native";
import { useTheme } from "../../Theme/themeContext";
import { useNavigation } from "@react-navigation/native";
import RatingOneStar from "../Ratings/RatingOneStar";
import { Icon } from "react-native-elements";

const CustomResortSearchCard = React.memo(({ item }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  return (
    <View
      style={{
        width: "100%",
        height: 100,
        flexDirection: "row",
        borderRadius: 16,
        marginVertical: 8,
        gap: 4,
      }}
    >
      <Pressable
        style={{
          position: "absolute",
          width: "100%",
          height: 100,
          backgroundColor: "transparent",
          left: 0,
          top: 0,
          zIndex: 6,
        }}
        onPress={() => {
          navigation.navigate("ResortProfile", {
            state: { resortId: item.resort_id },
          });
          Keyboard.dismiss();
        }}
      />
      <ImageBackground
        source={{ uri: item.mainImage.image_url || "" }}
        style={{
          width: 120,
          height: 100,
          borderRadius: 24,
          overflow: "hidden",
          zIndex: 1,
        }}
        resizeMode={"cover"}
      />

      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          zIndex: 5,
          backgroundColor: theme.colors.backgroundPrimary,
          borderRadius: 16,
          paddingLeft: 4,
        }}
      >
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          {item.name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <Icon
            name="map-marker"
            type="material-community"
            size={14}
            color={theme.colors.textSecondary}
            style={{ marginTop: Platform.OS === "ios" ? 0 : 2 }}
          />
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.textSecondary,
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.city && `${item.city}, `}
            {item.state}, {item.country}
          </Text>
        </View>
        <RatingOneStar
          resortId={item.resort_id}
          position={"relative"}
          size={14}
          textSize={14}
        />
      </View>
    </View>
  );
});

export default CustomResortSearchCard;

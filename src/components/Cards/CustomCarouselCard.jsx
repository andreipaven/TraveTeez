import React, { useEffect, useState } from "react";
import {
  Text,
  ImageBackground,
  Pressable,
  View,
  Dimensions,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "../../Theme/themeContext";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import { useNavigation } from "@react-navigation/native";

const CustomCarouselCard = ({ item }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(item.isFavorite);

  const onToggleFavorite = async () => {
    const newValue = isFavorite;
    setIsFavorite((prev) => !prev);
    try {
      if (newValue) {
        await APIService.post(config.endpoints.legacy.favorite.deleteFavorite, {
          resortId: item.resort_id,
        });
      } else {
        await APIService.post(config.endpoints.legacy.favorite.addFavorite, {
          resortId: item.resort_id,
        });
      }
    } catch (err) {
      console.log("Error updating favorite", err);
      setIsFavorite((prev) => !prev);
    }
  };

  useEffect(() => {
    setIsFavorite(item.isFavorite);
  }, [item.isFavorite]);

  return (
    <View
      style={[
        {
          width: "auto",
          height: 220,
          borderRadius: 12,
          overflow: "hidden",
          flexDirection: "column",
          backgroundColor: theme.colors.backgroundPrimary,
          shadowColor: theme.colors.shadowPrimary,
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 4,
          shadowOpacity: 0.5,
          elevation: 2,
          marginHorizontal: 16,
        },
      ]}
    >
      <Pressable
        onPress={() =>
          navigation.navigate("ResortProfile", {
            state: { resortId: item.resort_id, isFavoriteX: isFavorite },
          })
        }
      >
        <ImageBackground
          source={{ uri: item.mainImage.image_url || "" }}
          resizeMode={"cover"}
          style={{
            width: "100%",
            height: 164,
          }}
        />
      </Pressable>
      <Pressable
        onPress={() => onToggleFavorite()}
        style={{
          position: "absolute",
          right: 10,
          top: 10,
        }}
      >
        <Icon
          name={isFavorite ? "heart" : "heart-outline"}
          size={28}
          color={isFavorite ? theme.colors.primary : theme.colors.textDark}
        />
      </Pressable>

      <View style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
        <Text
          style={{
            fontWeight: "bold",
            color: theme.colors.textPrimary,
            fontSize: 13,
          }}
        >
          {item.name}
        </Text>
        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: 12,
          }}
        >
          {item.city}, {item.country}
        </Text>
      </View>
    </View>
  );
};

export default CustomCarouselCard;

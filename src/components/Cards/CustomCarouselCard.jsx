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
import Favorite from "../Favorite/Favorite";

const CustomCarouselCard = ({ item }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

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
            state: { resortId: item.resort_id, isFavorite: item.isFavorite },
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
      <Favorite
        resortId={item.resort_id}
        favorite={item.isFavorite}
        top={12}
        right={12}
        size={28}
      />
    </View>
  );
};

export default CustomCarouselCard;

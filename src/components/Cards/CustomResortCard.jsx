import React from "react";
import { ImageBackground, Pressable, Text, View } from "react-native";
import RatingOneStar from "../Ratings/RatingOneStar";
import Favorite from "../Favorite/Favorite";

const CustomResortCard = React.memo(({ item, navigation, theme }) => {
  return (
    <View
      style={{
        marginHorizontal: 6,
        borderRadius: 8,
        shadowColor: theme.colors.shadowPrimary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 2.5,
        elevation: 2,
        width: 148,
        height: "auto",
      }}
    >
      <Pressable
        style={{
          width: "100%",
          backgroundColor: "transparent",
          height: 180,
          position: "absolute",
          zIndex: 1,
          top: 0,
          left: 0,
        }}
        onPress={() =>
          navigation.navigate("ResortProfile", {
            state: { resortId: item.resort_id, isFavorite: item.isFavorite },
          })
        }
      />
      <ImageBackground
        source={{ uri: item.mainImage.image_url || "" }}
        style={{
          width: 148,
          height: 180,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          overflow: "hidden",
          backgroundColor: theme.colors.backgroundPrimary,
        }}
        resizeMode="cover"
      />
      <View
        style={{
          backgroundColor: theme.colors.backgroundPrimary,
          borderBottomRightRadius: 8,
          borderBottomLeftRadius: 8,
          paddingHorizontal: 4,
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <Text style={{ color: theme.colors.textPrimary, fontWeight: 500 }}>
          {item.name.length > 18 ? item.name.slice(0, 15) + "..." : item.name}
        </Text>
        <Text style={{ color: theme.colors.textSecondary }}>
          {item.country}
        </Text>
        <RatingOneStar
          resortId={item.resort_id}
          right={8}
          bottom={0}
          textSize={14}
          size={16}
        />
      </View>
      <Favorite
        resortId={item.resort_id}
        size={20}
        top={4}
        right={4}
        style={{ zIndex: 2, padding: 4 }}
      />
    </View>
  );
});

export default CustomResortCard;

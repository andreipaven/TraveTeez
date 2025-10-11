import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import CustomButton from "../Buttons/CustomButton";
import { Icon } from "react-native-elements";
import { useTheme } from "../../Theme/themeContext";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import Favorite from "../Favorite/Favorite";
import RatingOneStar from "../Ratings/RatingOneStar";
import { useNavigation } from "@react-navigation/native";

const TypeResortsBar = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(
    async (pageToFetch) => {
      if (loading || !hasMore) return;

      setLoading(true);
      try {
        const response = await APIService.post(
          config.endpoints.legacy.resort.getLimitedResortsByCategory,
          { page: pageToFetch },
        );

        if (response?.data.length === 0) {
          setHasMore(false);
        } else {
          setData((prev) => [...prev, ...response.data]);
          setPage((prev) => prev + 1);
        }
      } catch (err) {
        console.log("An error occurred " + err);
      } finally {
        setLoading(false);
      }
    },
    [hasMore],
  );

  useEffect(() => {
    fetchData(page);
  }, [fetchData]);

  const renderItem = ({ item, index }) => (
    <View
      key={index}
      style={{
        marginHorizontal: 6,
        borderRadius: 8,
        shadowColor: theme.colors.shadowPrimary,
        shadowOffset: {
          width: 0,
          height: 0,
        },
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
        resizeMode={"cover"}
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
        <Text style={{ color: theme.colors.textPrimary }}>
          {item.name.length > 18 ? item.name.slice(0, 15) + "..." : item.name}
        </Text>
        <Text style={{ color: theme.colors.textSecondary }}>
          {item.city}, {item.country}
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

  const renderFooter = () => (loading ? <ActivityIndicator /> : null);

  const handleScroll = (event) => {
    const contentWidth = event.nativeEvent.contentSize.width;
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const layoutWidth = event.nativeEvent.layoutMeasurement.width;

    if (contentWidth - contentOffsetX <= layoutWidth + 5) {
      fetchData(page);
    }
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
      >
        <CustomButton
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: theme.colors.backgroundPrimary,
            alignItems: "center",
            justifyContent: "center",

            // shadow iOS
            shadowColor: theme.colors.shadowPrimary,
            shadowOffset: { width: 1, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 3.84,

            // shadow Android
            elevation: theme.mode === "light" ? 2 : 21,
          }}
          iconCenter={
            <Icon
              raised
              name="image-filter-hdr"
              type="material-community"
              color={theme.colors.backgroundPrimary}
              reverse
              reverseColor="brown"
              size={30}
              onPress={() => console.log("hello")}
            />
          }
        />
        <CustomButton
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: theme.colors.backgroundPrimary,
            alignItems: "center",
            justifyContent: "center",

            // shadow iOS
            shadowColor: theme.colors.shadowPrimary,
            shadowOffset: { width: 1, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 3.84,

            // shadow Android
            elevation: theme.mode === "light" ? 2 : 21,
          }}
          iconCenter={
            <Icon
              raised
              name="surfing"
              type="material"
              color={theme.colors.backgroundPrimary}
              reverse
              reverseColor="gold"
              size={30}
              onPress={() => console.log("hello")}
            />
          }
        />
        <CustomButton
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: theme.colors.backgroundPrimary,
            alignItems: "center",
            justifyContent: "center",

            // shadow iOS
            shadowColor: theme.colors.shadowPrimary,
            shadowOffset: { width: 1, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 3.84,

            // shadow Android
            elevation: theme.mode === "light" ? 2 : 21,
          }}
          iconCenter={
            <Icon
              raised
              name="city"
              type="material-community"
              color={theme.colors.backgroundPrimary}
              reverse
              reverseColor={theme.colors.textPrimary}
              size={30}
              onPress={() => console.log("hello")}
            />
          }
        />
        <CustomButton
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: theme.colors.backgroundPrimary,
            alignItems: "center",
            justifyContent: "center",

            // shadow iOS
            shadowColor: theme.colors.shadowPrimary,
            shadowOffset: { width: 1, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 3.84,

            // shadow Android
            elevation: theme.mode === "light" ? 2 : 21,
          }}
          iconCenter={
            <Icon
              raised
              name="shimmer"
              type="material-community"
              color={theme.colors.backgroundPrimary}
              reverse
              reverseColor={theme.colors.primary}
              size={30}
              onPress={() => console.log("hello")}
            />
          }
        />
      </View>

      <FlatList
        horizontal
        data={data}
        keyExtractor={(item, index) => index.toString()}
        onScroll={handleScroll}
        ListFooterComponent={renderFooter}
        scrollEventThrottle={400}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingVertical: 8,
          paddingHorizontal: 8,
        }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default TypeResortsBar;

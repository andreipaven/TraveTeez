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
import { useNavigation } from "@react-navigation/native";
import CustomResortCard from "../Cards/CustomResortCard";
import Loading from "../Loading/Loading";

const CategoryResortsBar = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("nature");
  const [categoryTitle, setCategoryTitle] = useState("nature");
  const [fetchLoading, setFetchLoading] = useState(false);

  const listRef = useRef(null);

  const fetchData = (category) => {
    setFetchLoading(true);
    APIService.post(
      config.endpoints.legacy.resort.getLimitedResortsByCategory,
      {
        category: category,
      },
    )
      .then((response) => {
        if (response?.data?.error) {
          console.log("Something wrong happened " + response.data.error);
        } else {
          setData(response.data);
          setCategoryTitle(selectedCategory);
        }
      })
      .finally(() => {
        setFetchLoading(false);
      });
  };

  useEffect(() => {
    fetchData(selectedCategory);
    if (listRef.current) {
      listRef.current.scrollToOffset({ offset: 1, animated: true });
    }
  }, [selectedCategory]);
  const renderItem = useCallback(
    ({ item }) => (
      <CustomResortCard item={item} navigation={navigation} theme={theme} />
    ),
    [],
  );

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
        {[
          { key: "nature", icon: "image-filter-hdr", color: "brown" },
          { key: "relax", icon: "surfing", color: "gold" },
          { key: "urban", icon: "city", color: theme.colors.textPrimary },
          { key: "special", icon: "shimmer", color: theme.colors.primary },
        ].map((cat) => (
          <CustomButton
            key={cat.key}
            iconCenter={
              <Icon
                raised
                name={cat.icon}
                type="material-community"
                color={theme.colors.backgroundPrimary}
                reverse
                reverseColor={cat.color}
                size={30}
              />
            }
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: theme.colors.backgroundPrimary,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: theme.colors.shadowPrimary,
              shadowOffset: { width: 1, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 3.84,
              elevation: theme.mode === "light" ? 2 : 21,
            }}
            onPress={() => setSelectedCategory(cat.key)}
          />
        ))}
      </View>
      {fetchLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          {data ? (
            <Text
              style={{ fontWeight: 600, fontSize: 16, paddingHorizontal: 16 }}
            >
              {categoryTitle.charAt(0).toUpperCase() + categoryTitle.slice(1)}{" "}
              resorts
            </Text>
          ) : (
            <Text>Not resorts yet</Text>
          )}

          <FlatList
            horizontal
            data={data}
            keyboardShouldPersistTaps={"always"}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 8 }}
            showsHorizontalScrollIndicator={false}
            initialNumToRender={4}
            maxToRenderPerBatch={4}
            windowSize={5}
            removeClippedSubviews={true}
            updateCellsBatchingPeriod={50}
          />
        </View>
      )}
    </View>
  );
};

export default CategoryResortsBar;

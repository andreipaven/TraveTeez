import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Platform,
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
import {
  NativeViewGestureHandler,
  TapGestureHandler,
} from "react-native-gesture-handler";

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
        if (response?.data.error) {
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

  const PlatformFlatListWrapper = ({ children }) => {
    if (Platform.OS === "ios") {
      return <NativeViewGestureHandler>{children}</NativeViewGestureHandler>;
    }
    return <View>{children}</View>;
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
        {[
          { key: "nature", icon: "image-filter-hdr", color: "brown" },
          { key: "relax", icon: "surfing", color: "gold" },
          { key: "urban", icon: "city", color: theme.colors.textPrimary },
          { key: "special", icon: "shimmer", color: theme.colors.primary },
        ].map((cat) => (
          <TapGestureHandler
            key={cat.key}
            onActivated={() => setSelectedCategory(cat.key)}
          >
            <View
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
            >
              <Icon
                raised
                name={cat.icon}
                type="material-community"
                color={theme.colors.backgroundPrimary}
                reverse
                reverseColor={cat.color}
                size={30}
              />
            </View>
          </TapGestureHandler>
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
          <PlatformFlatListWrapper>
            <FlatList
              horizontal
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{
                paddingVertical: 8,
                paddingHorizontal: 8,
              }}
              showsHorizontalScrollIndicator={false}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={21}
              removeClippedSubviews={true}
              updateCellsBatchingPeriod={50}
            />
          </PlatformFlatListWrapper>
        </View>
      )}
    </View>
  );
};

export default CategoryResortsBar;

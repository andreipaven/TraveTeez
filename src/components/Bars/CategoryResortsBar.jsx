import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Text,
  View,
} from "react-native";

import { Icon } from "react-native-elements";
import { useTheme } from "../../Theme/themeContext";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import CustomResortCard from "../Cards/CustomResortCard";
import {
  NativeViewGestureHandler,
  TapGestureHandler,
} from "react-native-gesture-handler";

const CategoryResortsBar = ({ refreshing }) => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("nature");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [state, setState] = useState({
    resorts: [],
    offset: 0,
    limit: 3,
  });

  const fetchData = (category, reset = false) => {
    if (fetchLoading) return;
    setFetchLoading(true);
    APIService.post(
      config.endpoints.legacy.resort.getLimitedResortsByCategory,
      {
        category: category,
        offset: reset ? 0 : state.offset,
        limit: state.limit,
      },
    )
      .then((response) => {
        if (response?.data.error) {
          console.log("Something wrong happened " + response.data.error);
        } else {
          setState((prev) => ({
            ...prev,
            resorts: reset
              ? response.data
              : [...prev.resorts, ...response.data],
            offset: reset ? response.data.length : prev.offset + prev.limit,
          }));
          if (response.data.length < state.limit) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        }
      })
      .catch((err) => {
        console.log("An error occurred " + err);
      })
      .finally(() => {
        setFetchLoading(false);
      });
  };

  useEffect(() => {
    if (refreshing) {
      fetchData(selectedCategory, true);
    }
  }, [refreshing]);

  useEffect(() => {
    fetchData(selectedCategory, true);
  }, [selectedCategory]);
  const renderItem = useCallback(
    ({ item }) => <CustomResortCard item={item} />,
    [],
  );

  const onEndReachedHandler = () => {
    if (!fetchLoading && hasMore) {
      fetchData(selectedCategory);
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

      <View>
        <Text style={{ fontWeight: 600, fontSize: 16, paddingHorizontal: 16 }}>
          {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}{" "}
          resorts
        </Text>

        <View>
          <FlatList
            horizontal
            data={state.resorts}
            keyExtractor={(item) => item.resort_id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingVertical: 8,
              paddingHorizontal: 8,
            }}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListFooterComponent={fetchLoading ? <ActivityIndicator /> : null}
            onEndReachedThreshold={0.5}
            onEndReached={onEndReachedHandler}
          />
        </View>
      </View>
    </View>
  );
};

export default CategoryResortsBar;

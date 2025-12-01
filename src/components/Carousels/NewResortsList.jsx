import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, FlatList, ActivityIndicator, Text } from "react-native";
import CustomResortCard from "../Cards/CustomResortCard";

import APIService from "../../services/APIService";
import { config } from "../../services/config";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../Theme/themeContext";

export default function NewResortsList({ refreshing }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [state, setState] = useState({
    resorts: [],
    offset: 0,
    limit: 10,
  });
  const newResortsListRef = useRef(null);
  const renderItem = useCallback(
    ({ item }) => <CustomResortCard item={item} refreshing={refreshing} />,
    [refreshing],
  );

  const fetchNewResorts = (reset = false) => {
    if (fetchLoading) return;
    setFetchLoading(true);
    APIService.post(config.endpoints.legacy.resort.getNewResorts, {
      offset: reset ? 0 : state.offset,
      limit: state.limit,
    })
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
      newResortsListRef.current?.scrollToOffset({
        offset: 0,
        animated: false,
      });
      fetchNewResorts(true);
    }
  }, [refreshing]);
  useEffect(() => {
    fetchNewResorts(true);
  }, []);

  const onEndReachedHandler = () => {
    if (!fetchLoading && hasMore && !refreshing && state.resorts.length > 0) {
      fetchNewResorts();
    }
  };

  return (
    <View
      style={{
        width: "100%",
        height: "auto",
        paddingVertical: 0,
      }}
    >
      {state.resorts.length > 0 && (
        <Text
          style={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 2,
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.textPrimary,
          }}
        >
          {t("home.newResortsTitle")}
        </Text>
      )}

      <FlatList
        ref={newResortsListRef}
        refreshing={fetchLoading}
        horizontal
        data={state.resorts}
        keyExtractor={(item) => item.resort_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingVertical: 8,
          paddingHorizontal: 8,
        }}
        ListFooterComponent={fetchLoading ? <ActivityIndicator /> : null}
        onEndReachedThreshold={0.3}
        onEndReached={onEndReachedHandler}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

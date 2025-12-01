import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../Secure/AuthProvider";
import CustomResortCard from "../../components/Cards/CustomResortCard";
import { useTheme } from "../../Theme/themeContext";
import { useTranslation } from "react-i18next";
import ContainerGuestProfile from "../../components/Containers/ContainerGuestProfile";
import ContainerGuestFavorite from "../../components/Containers/ContainerGuestFavorite";

const FavoriteScreen = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const [state, setState] = useState({
    resorts: [],
    offset: 0,
    limit: 10,
  });
  const navigation = useNavigation();
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchResorts = (reset = false) => {
    if (isLoading) return;
    setIsLoading(true);
    APIService.post(config.endpoints.legacy.resort.getFavoriteResortsByUser, {
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
        setIsLoading(false);
      });
  };
  const renderItem = useCallback(
    ({ item }) => <CustomResortCard item={item} marginHorizontal={0} />,
    [],
  );

  const onEndReachedHandler = () => {
    if (!isLoading && hasMore) {
      fetchResorts();
    }
  };

  useEffect(() => {
    if (user) {
      fetchResorts(true);
    }
  }, []);

  return !user ? (
    <ContainerGuestFavorite />
  ) : (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: theme.colors.backgroundPrimary,
      }}
      edges={["top", "left", "right"]}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        {t("favoriteScreen.title")}
      </Text>

      <FlatList
        key={2}
        data={state.resorts}
        keyExtractor={(item) => item.resort_id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 50,
          gap: 8,
        }}
        ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
        onEndReachedThreshold={0.2}
        onEndReached={onEndReachedHandler}
        scrollEventThrottle={16}
        numColumns={2}
        showsHorizontalScrollIndicator={false}
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        onRefresh={() => {
          setRefreshing(true);
          fetchResorts(true);
          setTimeout(() => {
            setRefreshing(false);
          }, 500);
        }}
        refreshing={refreshing}
      />
    </SafeAreaView>
  );
};

export default FavoriteScreen;

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Keyboard,
  FlatList,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomTextInput from "../../components/Inputs/CustomTextInput";
import { useTheme } from "../../Theme/themeContext";
import { useTranslation } from "react-i18next";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import CustomResortSearchCard from "../../components/Cards/CustomResortSearchCard";
import CustomButton from "../../components/Buttons/CustomButton";
import FiltersModal from "../../components/Modals/FiltersModal";

const SearchScreen = () => {
  const { theme } = useTheme();
  const [searchValue, setSearchValue] = useState("");
  const { t } = useTranslation();
  const [state, setState] = useState({
    resorts: [],
    offset: 0,
    limit: 5,
  });
  const firstRender = useRef(true);
  const navigation = useNavigation();
  const inputRef = useRef(null);
  const [filters, setFilters] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const bottomSheetModalRefFilters = useRef(null);

  //modal functions
  const handlePresentPressFilters = () =>
    bottomSheetModalRefFilters.current.present();

  //fetch the searched resorts
  const fetchResorts = (value, reset = false) => {
    if (isLoading) return;
    setIsLoading(true);
    APIService.post(config.endpoints.legacy.resort.getSearchedResorts, {
      value,
      filters: cleanFilters(filters),
      offset: reset ? 0 : state.offset,
      limit: state.limit,
    })
      .then((response) => {
        if (response?.data.error) {
          console.log("Something wrong happened " + response.data.errors);
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

  const handleChange = (name, value) => {
    setSearchValue(value);
    fetchResorts(value, true);
  };

  const renderItem = useCallback(
    ({ item }) => <CustomResortSearchCard item={item} />,
    [],
  );

  const cleanFilters = (filters) => {
    const cleaned = {};

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (typeof value === "string" && value.trim() === "") {
        return;
      }
      if (Array.isArray(value) && value.length === 0) {
        return;
      }
      cleaned[key] = value;
    });

    return cleaned;
  };

  const handleScroll = (event) => {
    Keyboard.dismiss();
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const paddingToBottom = Platform.OS === "ios" ? 40 : 0;

    if (
      contentOffset.y + layoutMeasurement.height >=
      contentSize.height + paddingToBottom
    ) {
      if (!isLoading && hasMore) {
        fetchResorts(searchValue);
      }
    }
  };

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      fetchResorts(searchValue, true);
    }
  }, [filters]);

  const onEndReachedHandler = () => {
    if (!isLoading && hasMore) {
      fetchResorts(searchValue);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.backgroundPrimary }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              gap: 8,
            }}
          >
            <CustomTextInput
              ref={inputRef}
              name={"name"}
              placeholder={"Search"}
              value={searchValue}
              onChangeText={handleChange}
              borderColor={theme.colors.primary}
              focusBorderColor={theme.colors.primary}
              backgroundColor={theme.colors.backgroundPrimary}
              textColor={theme.colors.textSecondary}
              borderRadius={100}
              borderWidth={1.5}
              paddingVertical={4}
              iconLeft={
                <Icon
                  type={"material"}
                  name={"search"}
                  color={theme.colors.textSecondary}
                />
              }
              style={{ flex: 1 }}
              buttonRight={
                <Icon
                  type={"material-community"}
                  size={12}
                  name={"window-close"}
                  color={theme.colors.textSecondary}
                  onPress={() => {
                    setSearchValue("");
                    inputRef.current?.focus();
                    fetchResorts("", true);
                  }}
                  containerStyle={{
                    padding: 7,
                    position: "relative",
                    width: 40,
                    display: searchValue ? "flex" : "none",
                  }}
                />
              }
            />
            <CustomButton
              iconCenter={
                <Icon
                  type={"font-awesome"}
                  name={"sliders"}
                  color={theme.colors.primaryContrast}
                  size={20}
                />
              }
              backgroundColor={theme.colors.primary}
              height={40}
              width={40}
              paddingHorizontal={8}
              paddingVertical={8}
              borderRadius={100}
              style={{ alignSelf: "center" }}
              onPress={() => {
                Keyboard.dismiss();
                handlePresentPressFilters();
              }}
            />
          </View>

          <View>
            <FlatList
              data={state.resorts}
              keyExtractor={(item) => item.resort_id.toString()}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              onScroll={Keyboard.dismiss}
              contentContainerStyle={{
                paddingBottom: 150,
              }}
              ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
              onEndReachedThreshold={0.4}
              onEndReached={onEndReachedHandler}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <FiltersModal
        ref={bottomSheetModalRefFilters}
        setParentFilters={setFilters}
      />
    </SafeAreaView>
  );
};

export default SearchScreen;

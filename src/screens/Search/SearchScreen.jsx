import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Keyboard,
  FlatList,
  TouchableWithoutFeedback,
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
import FeedbackModal from "../../components/Modals/FeedbackModal";
import FiltersModal from "../../components/Modals/FiltersModal";

const SearchScreen = () => {
  const { theme } = useTheme();
  const [searchValue, setSearchValue] = useState("");
  const { t } = useTranslation();
  const [resorts, setResorts] = useState([]);
  const navigation = useNavigation();
  const inputRef = useRef(null);

  const bottomSheetModalRefFilters = useRef(null);

  //modal functions
  const handlePresentPressFilters = () =>
    bottomSheetModalRefFilters.current.present();

  //fetch the searched resorts
  const fetchResorts = (value) => {
    APIService.post(config.endpoints.legacy.resort.getSearchedResorts, {
      value,
    })
      .then((response) => {
        if (response?.data.error) {
          console.log("Something wrong happened " + response.data.errors);
        } else {
          setResorts(response.data);
        }
      })
      .catch((err) => {
        console.log("An error occurred " + err);
      })
      .finally(() => {});
  };

  const handleChange = (name, value) => {
    setSearchValue(value);
    fetchResorts(value);
  };

  const renderItem = useCallback(
    ({ item }) => <CustomResortSearchCard item={item} />,
    [],
  );
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.backgroundPrimary }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            marginHorizontal: 16,
          }}
        >
          <View style={{ flexDirection: "row", width: "100%", gap: 8 }}>
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
                  size={16}
                  name={"window-close"}
                  color={theme.colors.textSecondary}
                  onPress={(e) => {
                    setSearchValue("");
                    inputRef.current?.focus();
                    fetchResorts("");
                  }}
                  containerStyle={{
                    padding: 8,
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
              height={44}
              width={44}
              paddingHorizontal={8}
              paddingVertical={8}
              borderRadius={100}
              style={{ alignSelf: "center" }}
              onPress={handlePresentPressFilters}
            />
          </View>
          <View>
            <FlatList
              data={resorts}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              onScroll={() => Keyboard.dismiss()}
              contentContainerStyle={{ paddingBottom: 150 }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <FiltersModal ref={bottomSheetModalRefFilters} />
    </SafeAreaView>
  );
};

export default SearchScreen;

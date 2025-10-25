import React, { useCallback, useState } from "react";
import { View, Keyboard, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomTextInput from "../../components/Inputs/CustomTextInput";
import { useTheme } from "../../Theme/themeContext";
import { useTranslation } from "react-i18next";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import CustomResortSearchCard from "../../components/Cards/CustomResortSearchCard";
import { TapGestureHandler } from "react-native-gesture-handler";

const SearchScreen = () => {
  const { theme } = useTheme();
  const [searchValue, setSearchValue] = useState("");
  const { t } = useTranslation();
  const [resorts, setResorts] = useState([]);
  const navigation = useNavigation();

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
    ({ item }) => (
      <CustomResortSearchCard
        item={item}
        navigation={navigation}
        theme={theme}
      />
    ),
    [],
  );
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.backgroundPrimary }}
    >
      <TapGestureHandler onActivated={Keyboard.dismiss}>
        <View style={{ flex: 1, marginHorizontal: 16 }}>
          <CustomTextInput
            name={"name"}
            placeholder={"Search"}
            value={searchValue}
            onChangeText={handleChange}
            borderColor={theme.colors.primary}
            focusBorderColor={theme.colors.primary}
            backgroundColor={theme.colors.backgroundPrimary}
            textColor={theme.colors.textPrimary}
            borderRadius={100}
            borderWidth={1.5}
            iconLeft={
              <Icon
                type={"material"}
                name={"search"}
                color={theme.colors.textSecondary}
              />
            }
          />
          <View>
            <FlatList
              data={resorts}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              onScroll={() => Keyboard.dismiss()}
            />
          </View>
        </View>
      </TapGestureHandler>
    </SafeAreaView>
  );
};

export default SearchScreen;

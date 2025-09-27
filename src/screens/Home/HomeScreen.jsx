import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";

import { AuthContext } from "../../Secure/AuthProvider";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomCarousel from "../../components/Carousels/CustomCarousel";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import CustomButton from "../../components/Buttons/CustomButton";
import { useTheme } from "../../Theme/themeContext";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";

export default function HomeScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user, loading } = useContext(AuthContext);
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation();
  const [newResorts, setNewResorts] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!(!loading && !user)) {
      return;
    }
    navigation.replace("SignIn");
  }, [user, loading]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const fetchNewResorts = () => {
      APIService.post(config.endpoints.legacy.resort.getNewResorts, {})
        .then((response) => {
          if (response?.data.error) {
            console.log("Something wrong happened " + response.data.error);
          } else {
            setNewResorts(response.data);
          }
        })
        .catch((err) => {
          console.log("An error occurred " + err);
        })
        .finally(() => {});
    };
    fetchNewResorts();
  }, [isFocused]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.backgroundPrimary },
      ]}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ paddingHorizontal: 16, paddingTop: 4 }}>
          <CustomButton
            activeOpacity={1}
            backgroundColor={theme.colors.backgroundPrimary}
            title={
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Icon
                    size={24}
                    name={"magnify"}
                    color={theme.colors.textSecondary}
                  />
                  <Text style={{ color: theme.colors.textSecondary }}>
                    {t("home.searchButtonInput")}
                  </Text>
                </View>
                <Icon
                  size={24}
                  name={"beach"}
                  color={theme.colors.textSecondary}
                />
              </View>
            }
            borderColor={theme.colors.textSecondary}
            paddingVertical={8}
            paddingHorizontal={8}
            textColor={theme.colors.textSecondary}
            width={"auto"}
            borderRadius={100}
            alignItems={"center"}
            style={{
              shadowColor: theme.colors.shadowPrimary,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.2,
              shadowRadius: 10,
              elevation: 4,
              justifyContent: "space-between",
            }}
            onPress={() => navigation.navigate("Search")}
          />
        </View>
        <View>
          <Text
            style={{
              paddingHorizontal: 16,
              paddingTop: 8,
              paddingBottom: 2,
              fontSize: 16,
              fontWeight: "bold",
              color: theme.colors.textPrimary,
            }}
          >
            {t("home.newResortsTitle")}
          </Text>
          <CustomCarousel dates={newResorts} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 12,
  },
});

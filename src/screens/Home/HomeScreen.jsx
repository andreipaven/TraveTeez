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
import TypeResortsBar from "../../components/Bars/TypeResortsBar";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user, loading } = useContext(AuthContext);
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation();
  const [newResorts, setNewResorts] = useState([]);

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
      navigation.navigate("HomeScreen");
    }, 1000);
  }, []);

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

  useEffect(() => {
    fetchNewResorts();
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.backgroundPrimary },
      ]}
      edges={["top", "left", "right"]}
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
              shadowOpacity: 0.3,
              shadowRadius: 2,
              elevation: 4,
              justifyContent: "space-between",
            }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
              navigation.navigate("SearchScreen");
            }}
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
          <TypeResortsBar />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 12,
  },
});

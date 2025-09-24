import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { AuthContext } from "../../Secure/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomCarousel from "../../components/Carousels/CustomCarousel";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import CustomButton from "../../components/Buttons/CustomButton";
import { useTheme } from "../../Theme/themeContext";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";

export default function () {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user, loading } = useContext(AuthContext);
  const navigation = useNavigation();
  const [newResorts, setNewResorts] = useState([]);

  const [fetchLoading, setFetchLoading] = useState({
    newResorts: false,
  });

  useEffect(() => {
    if (!(!loading && !user)) {
      return;
    }
    navigation.replace("SignIn");
  }, [user, loading]);

  useEffect(() => {
    setFetchLoading((prev) => ({
      ...prev,
      newResorts: true,
    }));

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
        .finally(() => {
          setFetchLoading((prev) => ({
            ...prev,
            newResorts: false,
          }));
        });
    };
    fetchNewResorts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{ paddingHorizontal: 16, paddingTop: 4 }}>
          <CustomButton
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
          />
        </View>

        <CustomCarousel dates={newResorts} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 12,
  },
});

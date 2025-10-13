import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { AuthContext } from "../../Secure/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import profileAvatar from "../../../assets/profileAvatar.png";
import { useTranslation } from "react-i18next";
import CustomButton from "../../components/Buttons/CustomButton";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import { getAccessToken } from "../../Secure/secureHub";

import ProfileCarousel from "../../components/Carousels/ProfileCarousel";
import Loading from "../../components/Loading/Loading";
import Toast from "react-native-toast-message";
import { useTheme } from "../../Theme/themeContext";
import ThemeSwitch from "../../components/Buttons/ThemeSwitch";

const ProfileScreen = () => {
  const [fetchLoading, setFetchLoading] = useState(true);
  const isFocused = useIsFocused();

  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [resorts, setResorts] = useState([]);

  useEffect(() => {
    async function getResorts() {
      try {
        const token = await getAccessToken();
        const response = await APIService.post(
          config.endpoints.legacy.resort.getResortsByUser,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.data?.error) {
          console.log("Something wrong happened: " + response.data.error);
        } else {
          setResorts(response.data);
        }
      } catch (err) {
        console.error("An error occurred! " + err);
        Toast.show({
          type: "custom",
          text1: t("error.catchError"),
          position: "bottom",
        });
      } finally {
        setFetchLoading(false);
      }
    }
    getResorts();
  }, [isFocused]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.backgroundPrimary,
        flex: 1,
        justifyContent: "start",
        alignItems: "start",

        gap: 16, // or not
      }}
    >
      {fetchLoading ? (
        <Loading />
      ) : (
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "start",
              width: "100%",
              gap: 16,
              padding: 16,
            }}
          >
            <Image
              source={profileAvatar}
              borderRadius={64}
              style={{ width: 64, height: 64 }}
            />
            <Text style={{ fontSize: 24, color: theme.colors.textPrimary }}>
              {user.first_name} {user.last_name}
            </Text>
          </View>
          <View
            style={{
              alignItems: "start",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                paddingHorizontal: 16,
              }}
            >
              {t(`profileScreen.myResorts`)}
            </Text>

            <ProfileCarousel resorts={resorts} />
          </View>
          <CustomButton
            title={t("profileScreen.addResortButton")}
            backgroundColor={theme.colors.primary}
            textColor={theme.colors.primaryContrast}
            fontSize={14}
            paddingVertical={8}
            paddingHorizontal={16}
            marginHorizontal={16}
            width={"50%"}
            borderRadius={100}
            iconLeft={
              <Icon
                name={"plus"}
                size={24}
                color={theme.colors.primaryContrast}
              />
            }
            style={{ marginTop: 8 }}
            onPress={() => navigation.navigate("AddResort")}
          />
          <ThemeSwitch />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

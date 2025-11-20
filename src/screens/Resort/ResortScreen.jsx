import React, { useEffect, useRef, useState } from "react";
import { View, Text, Platform, Dimensions, Animated } from "react-native";
import ResortProfileCarousel from "../../components/Carousels/ResortProfileCarousel";
import { SafeAreaView } from "react-native-safe-area-context";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import { useTheme } from "../../Theme/themeContext";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import Loading from "../../components/Loading/Loading";
import FeedbackModal from "../../components/Modals/FeedbackModal";
import CustomButton from "../../components/Buttons/CustomButton";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Favorite from "../../components/Favorite/Favorite";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const ResortScreen = ({ route }) => {
  const { state } = route.params;
  const { resortId } = state;
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [fetchLoading, setFetchLoading] = useState({ resort: false });
  const [images, setImages] = useState([]);
  const [resortDetails, setResortDetails] = useState({});

  //modals
  const bottomSheetModalRefFeedback = useRef(null);

  //modal functions
  const handlePresentPressFeedback = () =>
    bottomSheetModalRefFeedback.current.present();

  useEffect(() => {
    const fetchResort = () => {
      setFetchLoading((prev) => ({
        ...prev,
        resort: true,
      }));
      APIService.post(config.endpoints.legacy.resort.getResortById, {
        resort_id: resortId,
      })
        .then((response) => {
          if (response?.data.error) {
            console.log("Something wrong happened " + response.data.error);
          } else {
            setImages(response.data.images);
            setResortDetails(response.data);
          }
        })
        .catch((err) => {
          console.log("An error occurred " + err);
        })
        .finally(() => {
          setFetchLoading((prev) => ({
            ...prev,
            resort: false,
          }));
        });
    };
    fetchResort();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: theme.colors.backgroundPrimary,
      }}
      edges={["bottom", "left", "right"]}
    >
      {fetchLoading.resort ? (
        <Loading />
      ) : (
        <View style={{ flex: 1 }}>
          <CustomButton
            iconCenter={
              <Ionicons
                name={Platform.OS === "ios" ? "chevron-back" : "arrow-back"}
                size={24}
                color={theme.colors.textPrimary}
                style={{ left: -1 }}
              />
            }
            backgroundColor={theme.colors.backgroundPrimary}
            width={42}
            height={42}
            borderRadius={100}
            activeOpacity={0.5}
            style={{
              opacity: 0.7,
              position: "absolute",
              left: 16,
              top: 60,
              zIndex: 3,
            }}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.goBack();
            }}
          />
          <Favorite
            resortId={resortId}
            size={24}
            top={60}
            right={16}
            position={"absolute"}
            backgroundColor={theme.colors.backgroundPrimary + "b5"}
            padding={8}
            borderRadius={100}
            style={{
              width: 42,
              height: 42,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 3,
            }}
          />
          <View>
            <ResortProfileCarousel
              resortId={resortId}
              images={images}
              width={width}
              height={height / 2.5}
            />
          </View>
          <View
            style={{
              paddingHorizontal: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                  color: theme.colors.textPrimary,
                }}
              >
                {resortDetails?.name}
              </Text>
              <View style={{ paddingTop: 8 }}>
                <Text
                  style={{
                    color: theme.colors.textSecondary,
                    marginLeft: -2,
                  }}
                >
                  <Icon name={"map-marker"} size={16} />
                  {resortDetails?.city}, {resortDetails?.state},{" "}
                  {resortDetails?.country}
                </Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: "flex-start",
                alignItems: "flex-end",
              }}
            >
              <CustomButton
                title={"Feedback"}
                borderWidth={1}
                width={"fit-content"}
                paddingHorizontal={16}
                paddingVertical={8}
                backgroundColor={theme.colors.primary}
                textColor={theme.colors.primaryContrast}
                borderColor={"transparent"}
                borderRadius={100}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                  handlePresentPressFeedback();
                }}
              />
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 8,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                color: theme.colors.textPrimary,
                paddingBottom: 4,
              }}
            >
              {t("resortScreen.about")}
            </Text>
            {resortDetails.description ? (
              <Text
                style={{ marginTop: -4, color: theme.colors.textSecondary }}
              >
                {resortDetails.description}
              </Text>
            ) : (
              <Text
                style={{ marginTop: -4, color: theme.colors.textSecondary }}
              >
                {t("resortScreen.noDescription")}
              </Text>
            )}
          </View>

          <FeedbackModal
            ref={bottomSheetModalRefFeedback}
            resortId={resortId}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ResortScreen;

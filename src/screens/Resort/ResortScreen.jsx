import React, { useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
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

const ResortScreen = ({ route }) => {
  const { state } = route.params;
  const { resortId, isFavorite } = state;
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
          <ResortProfileCarousel resortId={resortId} images={images} />
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
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
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

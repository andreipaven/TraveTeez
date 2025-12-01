import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Platform,
  Dimensions,
  Animated,
  Share,
} from "react-native";
import ResortProfileCarousel from "../../components/Carousels/ResortProfileCarousel";
import { SafeAreaView } from "react-native-safe-area-context";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import { useTheme } from "../../Theme/themeContext";
import Loading from "../../components/Loading/Loading";
import FeedbackModal from "../../components/Modals/FeedbackModal";
import CustomButton from "../../components/Buttons/CustomButton";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import { useNavigation, useRoute } from "@react-navigation/native";
import Favorite from "../../components/Favorite/Favorite";

import { Divider, Icon } from "react-native-elements";
import blurViewWeb from "expo-blur/src/BlurView.web";
import { BlurView } from "expo-blur";

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

  //share
  const onShare = async () => {
    // const link = Linking.createURL(`resort/${resortId}`);
    const link = `traveteez://resort/${resortId}`;
    try {
      const result = await Share.share({
        message: link,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("shared with " + result.activityType);
        } else {
          console.log("shared");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("dismissed");
      }
    } catch (err) {
      console.log("An error occurred " + err);
    }
  };

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
          <BlurView
            intensity={50}
            style={{
              backgroundColor: theme.colors.backgroundPrimary + "88",
              width: 38,
              height: 38,
              position: "absolute",
              left: 16,
              top: 60,
              zIndex: 3,
              borderRadius: 100,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CustomButton
              iconCenter={
                <Icon
                  name={Platform.OS === "ios" ? "chevron-back" : "arrow-back"}
                  size={20}
                  color={theme.colors.textPrimary}
                  style={{ left: -1 }}
                  type={"ionicon"}
                />
              }
              backgroundColor={"transparent"}
              width={38}
              height={38}
              borderRadius={100}
              activeOpacity={0.8}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                navigation.goBack();
              }}
              isBlur={true}
            />
          </BlurView>
          <BlurView
            intensity={50}
            style={{
              backgroundColor: theme.colors.backgroundPrimary + "88",
              width: 38,
              height: 38,
              position: "absolute",
              top: 60,
              right: 62,
              zIndex: 3,
              borderRadius: 100,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CustomButton
              iconCenter={
                <Icon
                  name={"share-variant"}
                  type={"material-community"}
                  size={20}
                  color={theme.colors.textPrimary}
                  style={{ left: -1 }}
                />
              }
              backgroundColor={"transparent"}
              width={38}
              height={38}
              borderRadius={100}
              activeOpacity={0.8}
              onPress={onShare}
            />
          </BlurView>
          <BlurView
            intensity={50}
            style={{
              backgroundColor: theme.colors.backgroundPrimary + "88",
              width: 38,
              height: 38,
              position: "absolute",
              top: 60,
              right: 16,
              zIndex: 3,
              borderRadius: 100,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Favorite
              resortId={resortId}
              size={20}
              position={"absolute"}
              backgroundColor={"transparent"}
              padding={8}
              borderRadius={100}
            />
          </BlurView>
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
              paddingTop: 8,
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
              <View
                style={{
                  paddingTop: 4,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Icon
                  name={"map-marker"}
                  size={16}
                  type={"material-community"}
                  color={theme.colors.textSecondary}
                  style={{ marginBottom: 1, marginLeft: -2 }}
                />
                <Text
                  style={{
                    color: theme.colors.textSecondary,
                    marginLeft: -2,
                  }}
                >
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
          <Divider style={{ marginHorizontal: 16, marginVertical: 4 }} />
          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 4,
            }}
          >
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

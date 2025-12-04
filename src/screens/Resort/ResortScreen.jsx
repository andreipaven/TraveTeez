import React, { useEffect, useRef, useState } from "react";
import { View, Platform, Dimensions, Share, ScrollView } from "react-native";
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

import { BlurView } from "expo-blur";
import CustomText from "../../components/Widgets/CustomText";

import ResortFacilitiesSheet from "../../components/Sheets/ResortFacilitiesSheet";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

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

  const facilitiesBottomShetRef = useRef(null);

  //modals
  const bottomSheetModalRefFeedback = useRef(null);

  //modal functions
  const handlePresentPressFeedback = () =>
    bottomSheetModalRefFeedback.current.present();

  //animations
  const shake = useSharedValue(0);

  //facilities
  const facilityOptions = [
    { label: t("facilities.sportsActivities"), value: 1, icon: "run" },
    { label: t("facilities.thermalPools"), value: 2, icon: "hot-tub" },
    { label: t("facilities.bar"), value: 3, icon: "glass-cocktail" },
    { label: t("facilities.medicalOffices"), value: 4, icon: "hospital" },
    { label: t("facilities.cabins"), value: 5, icon: "home" },
    { label: t("facilities.accommodation"), value: 6, icon: "bed" },
    { label: t("facilities.cafeteria"), value: 7, icon: "coffee" },
    { label: t("facilities.jacuzzi"), value: 8, icon: "hot-tub" },
    { label: t("facilities.physiotherapy"), value: 9, icon: "heart-pulse" },
    { label: t("facilities.childrenPlayground"), value: 10, icon: "baby" },
    { label: t("facilities.shops"), value: 11, icon: "store" },
    {
      label: t("facilities.snowGroomingMachine"),
      value: 12,
      icon: "snowflake",
    },
    { label: t("facilities.nightSkiing"), value: 13, icon: "weather-night" },
    { label: t("facilities.culturalSites"), value: 14, icon: "bank" },
    { label: t("facilities.parking"), value: 15, icon: "parking" },
    { label: t("facilities.privateParking"), value: 16, icon: "lock" },
    { label: t("facilities.adventureParks"), value: 17, icon: "map" },
    { label: t("facilities.pools"), value: 18, icon: "pool" },
    { label: t("facilities.indoorPool"), value: 19, icon: "pool" },
    { label: t("facilities.outdoorPool"), value: 20, icon: "pool" },
    { label: t("facilities.firstAid"), value: 21, icon: "medical-bag" },
    { label: t("facilities.reception"), value: 22, icon: "desk" },
    {
      label: t("facilities.restaurant"),
      value: 23,
      icon: "silverware-fork-knife",
    },
    {
      label: t("facilities.sunbedsUmbrellas"),
      value: 24,
      icon: "umbrella-beach",
    },
    { label: t("facilities.schoolInstructors"), value: 25, icon: "school" },
    {
      label: t("facilities.conferenceRooms"),
      value: 26,
      icon: "account-group",
    },
    { label: t("facilities.massageRooms"), value: 27, icon: "spa" },
    { label: t("facilities.sauna"), value: 28, icon: "thermometer-water" },
    { label: t("facilities.transportServices"), value: 29, icon: "bus" },
    { label: t("facilities.equipmentServices"), value: 30, icon: "toolbox" },
    { label: t("facilities.streetFood"), value: 31, icon: "food" },
    { label: t("facilities.snowCannons"), value: 32, icon: "weather-snowy" },
    { label: t("facilities.hikingTrails"), value: 33, icon: "hiking" },
    { label: t("facilities.relaxZones"), value: 34, icon: "sofa" },
    { label: t("facilities.museums"), value: 35, icon: "bank" },
    { label: t("facilities.guidedTours"), value: 36, icon: "map-marker-path" },
    { label: t("facilities.snowpark"), value: 37, icon: "snowboard" },
    { label: t("facilities.chairlift"), value: 38, icon: "ski-water" },
    { label: t("facilities.skiLift"), value: 39, icon: "seat-recline-extra" },
    { label: t("facilities.gondola"), value: 40, icon: "gondola" },
    { label: t("facilities.equipmentRental"), value: 41, icon: "basket" },
    { label: t("facilities.skiSlopes"), value: 42, icon: "ski" },
    { label: t("facilities.bodyTreatments"), value: 43, icon: "spa" },
  ];

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

  //animations
  const shakeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${shake.value}deg` }],
  }));

  //fetch data
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
  //animations

  useEffect(() => {
    shake.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 2000 }),
        withTiming(-10, { duration: 2000 }),
        withTiming(10, { duration: 1500 }),
        withTiming(0, { duration: 1500 }),
      ),
      -1,
      true,
    );
  }, []);

  const [topResortMessage, setTopResortMessage] = useState("");
  useEffect(() => {
    if (resortDetails.rank === 1) {
      const message = t("resortScreen.firstResort").replace(
        "{count}",
        resortDetails.favorites_count?.[0].count,
      );
      setTopResortMessage(message);
    } else if (resortDetails.rank === 2 || resortDetails.rank === 3) {
      const message = t("resortScreen.mostAppreciatedResort").replace(
        "{count}",
        resortDetails.favorites_count?.[0].count,
      );
      console.log(message);
      setTopResortMessage(message);
    } else if (resortDetails.rank > 3) {
      const message = t("resortScreen.mostAppreciatedResort").replace(
        "{count}",
        resortDetails.favorites_count?.[0].count,
      );

      setTopResortMessage(message);
    }
  }, [resortDetails.rank]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: theme.colors.backgroundPrimary,
      }}
      edges={["left", "right"]}
    >
      {fetchLoading.resort ? (
        <Loading />
      ) : (
        <ScrollView style={{ flex: 1 }}>
          <BlurView
            intensity={theme.mode === "light" ? 50 : 10}
            style={{
              backgroundColor:
                theme.mode === "light"
                  ? theme.colors.backgroundPrimary + "88"
                  : theme.colors.backgroundPrimary,
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
            intensity={theme.mode === "light" ? 50 : 10}
            style={{
              backgroundColor:
                theme.mode === "light"
                  ? theme.colors.backgroundPrimary + "88"
                  : theme.colors.backgroundPrimary,
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
            intensity={theme.mode === "light" ? 50 : 10}
            style={{
              backgroundColor:
                theme.mode === "light"
                  ? theme.colors.backgroundPrimary + "88"
                  : theme.colors.backgroundPrimary,
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
              size={22}
              position={"absolute"}
              backgroundColor={"transparent"}
              padding={8}
              secondTop={8}
              secondRight={8}
              borderRadius={100}
              style={{ alignSelf: "center" }}
              borderColor={theme.colors.textPrimary}
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
              <CustomText
                style={{
                  fontWeight: "bold",
                  fontSize: 24,
                  color: theme.colors.textPrimary,
                }}
              >
                {resortDetails?.name}
              </CustomText>
              <View
                style={{
                  paddingTop: 4,
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                <Icon
                  name={"map-marker"}
                  size={16}
                  type={"material-community"}
                  color={theme.colors.textSecondary}
                  style={{ marginTop: 1, marginLeft: -2 }}
                />
                <CustomText
                  style={{
                    color: theme.colors.textSecondary,
                    marginLeft: -2,
                    fontSize: 16,
                  }}
                >
                  {resortDetails?.city}, {resortDetails?.state},{" "}
                  {resortDetails?.country}
                </CustomText>
              </View>
            </View>
          </View>
          <Divider style={{ marginHorizontal: 16, marginVertical: 16 }} />
          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 4,
            }}
          >
            {resortDetails.description ? (
              <CustomText
                style={{
                  marginTop: -4,
                  color: theme.colors.textSecondary,
                  fontSize: 16,
                  textAlign: "justify",
                }}
              >
                {resortDetails.description}
              </CustomText>
            ) : (
              <CustomText
                style={{ marginTop: -4, color: theme.colors.textSecondary }}
              >
                {t("resortScreen.noDescription")}
              </CustomText>
            )}
          </View>
          <Divider style={{ marginHorizontal: 16, marginVertical: 16 }} />
          <View style={{ paddingHorizontal: 16 }}>
            <CustomText
              style={{ fontSize: 20, fontWeight: "600", paddingBottom: 8 }}
            >
              {t("resortScreen.facilitiesTitle")}
            </CustomText>
            {resortDetails.facilities?.slice(1, 6).map((item) => {
              const facility = facilityOptions.find((f) => f.value === item);
              if (facility) {
                return (
                  <View
                    key={facility.value}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 8,
                    }}
                  >
                    <Icon
                      name={facility.icon}
                      size={20}
                      type={"material-community"}
                      color={theme.colors.textSecondary}
                    />
                    <CustomText
                      style={{
                        marginLeft: 4,
                        color: theme.colors.textSecondary,
                      }}
                    >
                      {facility.label}
                    </CustomText>
                  </View>
                );
              }
            })}
            <CustomButton
              title={t("resortScreen.showMoreFacilitiesButton")}
              backgroundColor={theme.colors.primary}
              height={46}
              borderRadius={100}
              textColor={theme.colors.primaryContrast}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                facilitiesBottomShetRef.current?.snapToIndex(0);
              }}
            />
          </View>

          <Divider style={{ marginHorizontal: 16, marginVertical: 16 }} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 1,
              paddingHorizontal: 16,
            }}
          >
            <View style={{ flex: 1 / 3 }}>
              <Animated.View style={shakeAnimatedStyle}>
                <Icon
                  name={"leaf"}
                  type="material-community"
                  size={72}
                  style={{ alignSelf: "flex-end" }}
                />
              </Animated.View>
            </View>
            <View style={{ flex: 1 / 3 }}>
              <CustomText
                style={{
                  alignSelf: "center",
                  fontSize: 56,
                  fontWeight: "bold",
                  textShadowColor: theme.colors.shadowPrimary + "69",
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4,

                  color: theme.colors.textPrimary,
                }}
              >
                {resortDetails.rank}
              </CustomText>
            </View>
            <View style={{ flex: 1 / 3, transform: [{ scaleX: -1 }] }}>
              <Animated.View style={shakeAnimatedStyle}>
                <Icon
                  name={"leaf"}
                  type="material-community"
                  size={72}
                  style={{ alignSelf: "flex-end" }}
                />
              </Animated.View>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <CustomText
              style={{
                alignSelf: "center",
                paddingHorizontal: 32,
                textAlign: "center",
              }}
            >
              {topResortMessage}
            </CustomText>
          </View>
        </ScrollView>
      )}
      <ResortFacilitiesSheet
        ref={facilitiesBottomShetRef}
        facilities={resortDetails.facilities}
      />
      <FeedbackModal ref={bottomSheetModalRefFeedback} resortId={resortId} />
    </SafeAreaView>
  );
};
// {resortDetails?.favorites_count?.[0]?.count}
export default ResortScreen;

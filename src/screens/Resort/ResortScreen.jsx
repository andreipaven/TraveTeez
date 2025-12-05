import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Platform,
  Dimensions,
  Share,
  Text,
  StyleSheet,
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
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Favorite from "../../components/Favorite/Favorite";

import { Icon } from "react-native-elements";

import { BlurView } from "expo-blur";
import CustomText from "../../components/Widgets/CustomText";

import ResortFacilitiesSheet from "../../components/Sheets/ResortFacilitiesSheet";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import ResortDescriptionSheet from "../../components/Sheets/ResortDescriptionSheet";
import ResortProfileDivider from "../../components/Divider/ResortProfileDivider";
import { Stack } from "expo-router";
import RatingAllStars from "../../components/Ratings/RatingAllStars";
import { useSelector } from "react-redux";

const width = Dimensions.get("window").width;
const PARALLAX_HEIGHT = 360;

const ResortScreen = ({ route }) => {
  const { state } = route.params;
  const { resortId } = state;
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [fetchLoading, setFetchLoading] = useState({ resort: false });
  const [images, setImages] = useState([]);
  const [resortDetails, setResortDetails] = useState({});
  const [descriptionTextLong, setDescriptionTextLong] = useState(false);
  const [topResortMessage, setTopResortMessage] = useState("");
  const [carouselIndex, setCarouselIndex] = useState(1);

  //refs
  const facilitiesBottomShetRef = useRef(null);
  const descriptionBottomShetRef = useRef(null);
  const bottomSheetModalRefFeedback = useRef(null);

  //parallax animation
  const scrollRef = useAnimatedRef();
  const scrollOffset = useScrollViewOffset(scrollRef);

  //redux
  const bottomSheetsOpen = useSelector((state) => state.ui.bottomSheetsOpen);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollOffset.value,
        [PARALLAX_HEIGHT * 0.4, PARALLAX_HEIGHT * 0.73],
        [0, 1],
      ),
    };
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-PARALLAX_HEIGHT, 0, PARALLAX_HEIGHT],
            [-PARALLAX_HEIGHT / 2, 0, PARALLAX_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-PARALLAX_HEIGHT, 0, PARALLAX_HEIGHT],
            [2, 1, 1],
          ),
        },
      ],
    };
  });

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
        backgroundColor: theme.colors.backgroundPrimary,
      }}
      edges={["left", "right"]}
    >
      <Stack.Screen
        options={{
          headerShown: !bottomSheetsOpen,
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTitle: () => <></>,
          headerLeft: () => (
            <BlurView
              intensity={theme.mode === "light" ? 50 : 10}
              style={{
                backgroundColor:
                  theme.mode === "light"
                    ? theme.colors.backgroundPrimary + "88"
                    : theme.colors.backgroundPrimary,
                width: 38,
                height: 38,
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
          ),

          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 8 }}>
              <BlurView
                intensity={theme.mode === "light" ? 50 : 10}
                style={{
                  backgroundColor:
                    theme.mode === "light"
                      ? theme.colors.backgroundPrimary + "88"
                      : theme.colors.backgroundPrimary,
                  width: 38,
                  height: 38,
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
            </View>
          ),
          headerBackground: () => (
            <Animated.View
              style={[
                headerAnimatedStyle,
                {
                  backgroundColor: theme.colors.backgroundPrimary,
                  height: 100,
                },
              ]}
            />
          ),
        }}
      />
      {fetchLoading.resort ? (
        <Loading />
      ) : (
        <Animated.ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              {
                width: width,
                height: PARALLAX_HEIGHT,
              },
              imageAnimatedStyle,
            ]}
          >
            <ResortProfileCarousel
              resortId={resortId}
              images={images}
              width={width}
              height={PARALLAX_HEIGHT}
              setCarouselIndex={setCarouselIndex}
            />
          </Animated.View>
          <View
            style={{
              paddingHorizontal: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              paddingTop: 8,
              backgroundColor: theme.colors.backgroundPrimary,
            }}
          >
            <RatingAllStars
              position={"absolute"}
              left={16}
              top={-30}
              resortId={resortId}
            />
            <BlurView
              style={{
                position: "absolute",
                top: -30,
                right: 16,
                alignSelf: "flex-end",
                backgroundColor:
                  theme.mode === "light"
                    ? theme.colors.backgroundPrimary + "88"
                    : theme.colors.backgroundPrimary,
                padding: 4,
                borderRadius: 100,
                width: 50,
                alignItems: "center",
                overflow: "hidden",
              }}
              intensity={theme.mode === "light" ? 50 : 10}
            >
              <Text
                style={{ fontWeight: "500", color: theme.colors.textPrimary }}
              >
                {carouselIndex + 1}/{images.length}
              </Text>
            </BlurView>
            <View
              style={{
                flex: 1,
                backgroundColor: theme.colors.backgroundPrimary,
              }}
            >
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
          {/*<Divider style={{ marginHorizontal: 16, marginVertical: 16 }} />*/}
          <View style={{ backgroundColor: theme.colors.backgroundPrimary }}>
            <ResortProfileDivider />
          </View>

          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 4,
              backgroundColor: theme.colors.backgroundPrimary,
            }}
          >
            {resortDetails.description && (
              <View>
                <Text
                  style={{
                    marginTop: -4,
                    color: theme.colors.textSecondary,
                    fontSize: 16,
                    textAlign: "justify",
                  }}
                  numberOfLines={descriptionTextLong ? 10 : undefined}
                  onTextLayout={(event) => {
                    if (
                      event.nativeEvent.lines.length > 10 &&
                      !descriptionTextLong
                    ) {
                      setDescriptionTextLong(true);
                    }
                  }}
                >
                  {resortDetails.description}
                </Text>
                <CustomButton
                  title={t("resortScreen.readMoreButton")}
                  fontWeight={400}
                  textColor={theme.colors.textPrimary}
                  style={{
                    alignSelf: "flex-end",
                    display: descriptionTextLong ? "flex" : "none",
                  }}
                  onPress={() =>
                    descriptionBottomShetRef.current.snapToIndex(0)
                  }
                />
              </View>
            )}
          </View>
          <View style={{ backgroundColor: theme.colors.backgroundPrimary }}>
            <ResortProfileDivider />
          </View>
          <View
            style={{
              paddingHorizontal: 16,
              backgroundColor: theme.colors.backgroundPrimary,
            }}
          >
            <CustomText
              style={{ fontSize: 20, fontWeight: "600", paddingBottom: 8 }}
            >
              {t("resortScreen.facilitiesTitle")}
            </CustomText>
            {resortDetails.facilities?.slice(0, 5).map((item) => {
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
              style={{
                display:
                  resortDetails.facilities?.length - 1 > 5 ? "flex" : "none",
              }}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                facilitiesBottomShetRef.current?.snapToIndex(0);
              }}
            />
          </View>

          <View style={{ backgroundColor: theme.colors.backgroundPrimary }}>
            <ResortProfileDivider />
          </View>
          <View
            style={{
              shadowColor: theme.colors.shadowPrimary,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              marginHorizontal: 16,
              backgroundColor: theme.colors.backgroundPrimary,
              borderRadius: 24,
              padding: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <View style={{ flex: 1 / 3 }}>
                <Animated.View style={shakeAnimatedStyle}>
                  <Icon
                    name={"leaf"}
                    type="material-community"
                    size={72}
                    style={{ alignSelf: "flex-end" }}
                    color={theme.colors.textPrimary}
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
                    color={theme.colors.textPrimary}
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
                  color: theme.colors.textSecondary,
                }}
              >
                {topResortMessage}
              </CustomText>
            </View>
          </View>
        </Animated.ScrollView>
      )}
      <ResortFacilitiesSheet
        ref={facilitiesBottomShetRef}
        facilities={resortDetails.facilities}
      />
      <ResortDescriptionSheet
        ref={descriptionBottomShetRef}
        description={resortDetails.description}
      />
      <FeedbackModal ref={bottomSheetModalRefFeedback} resortId={resortId} />
    </SafeAreaView>
  );
};
export default ResortScreen;

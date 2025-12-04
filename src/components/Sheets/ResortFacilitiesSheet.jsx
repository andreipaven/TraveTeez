import React, { useCallback, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetDraggableView,
  BottomSheetScrollView,
  BottomSheetView,
  useBottomSheetTimingConfigs,
} from "@gorhom/bottom-sheet";
import { useTheme } from "../../Theme/themeContext";
import { Icon } from "react-native-elements";
import CustomText from "../Widgets/CustomText";
import { useTranslation } from "react-i18next";

const ResortFacilitiesSheet = ({ facilities, ref }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

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

  const snapPoints = useMemo(() => ["40%", "90%"], []);

  const backDrop = useCallback((props) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
  ));

  const handleComponent = () => (
    <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
      <View
        style={{
          width: 28,
          height: 3.6,
          backgroundColor: theme.colors.textPrimary,
          borderRadius: 100,
          alignSelf: "center",
          marginBottom: 8,
        }}
      />
      <View
        style={{ flexDirection: "row", alignItems: "center", paddingBottom: 8 }}
      >
        <CustomText
          style={{
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          {t("resortScreen.facilitiesTitle")}
        </CustomText>
        <Icon name={"playlist-check"} type={"material-community"} size={20} />
      </View>
    </View>
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: theme.colors.backgroundPrimary }}
      handleComponent={handleComponent}
      enableContentPanningGesture={true}
      enablePanDownToClose={true}
      enableDynamicSizing={false}
      backgroundComponent={({ style }) => (
        <View
          style={[
            style,
            {
              backgroundColor: theme.colors.backgroundPrimary,
              borderRadius: 24,
            },
          ]}
        />
      )}
      backdropComponent={backDrop}
    >
      <BottomSheetScrollView
        style={{
          backgroundColor: theme.colors.backgroundPrimary,
          padding: 16,
          paddingTop: 0,
        }}
      >
        {facilities?.map((item, index) => {
          const facility = facilityOptions.find((f) => f.value === item);
          if (facility) {
            return (
              <View
                key={facility.value}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 8,
                  paddingBottom: index === facilities.length - 1 ? 16 : 0,
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
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default ResortFacilitiesSheet;

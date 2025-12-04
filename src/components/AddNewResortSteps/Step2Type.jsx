import React, { useImperativeHandle, useState } from "react";
import { View, Text, ScrollView } from "react-native";

import { useTheme } from "../../Theme/themeContext";
import { useTranslation } from "react-i18next";
import CustomDropdown from "../Inputs/CustomDropdown";

import CustomMultiSelect from "../Inputs/CustomMultiSelect";

const Step2Type = ({ ref, resort, setResort, errors, setErrors }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const categoryOptions = [
    { label: t("typeCategory.nature"), value: "nature" },
    { label: t("typeCategory.relax"), value: "relax" },
    { label: t("typeCategory.urban"), value: "urban" },
    { label: t("typeCategory.special"), value: "special" },
  ];

  // Type mapping for each category
  const categoryMapping = {
    nature: ["ski", "mountain", "adventure", "eco"],
    relax: ["beach", "spa", "balneary", "lake", "island"],
    urban: ["city", "cultural", "luxury", "allInclusive", "theme", "family"],
    special: ["safari", "retreat"],
  };

  const selectedCategoryOptions = resort?.category
    ? categoryMapping[resort.category].map((typeKey) => ({
        label: t(`typeResort.${typeKey}`),
        value: typeKey,
      }))
    : [];

  //facilities options
  const facilityOptions = [
    { label: t("facilities.sportsActivities"), value: 1 },
    { label: t("facilities.thermalPools"), value: 2 },
    { label: t("facilities.bar"), value: 3 },
    { label: t("facilities.medicalOffices"), value: 4 },
    { label: t("facilities.cabins"), value: 5 },
    { label: t("facilities.accommodation"), value: 6 },
    { label: t("facilities.cafeteria"), value: 7 },
    { label: t("facilities.jacuzzi"), value: 8 },
    { label: t("facilities.physiotherapy"), value: 9 },
    { label: t("facilities.childrenPlayground"), value: 10 },
    { label: t("facilities.shops"), value: 11 },
    { label: t("facilities.snowGroomingMachine"), value: 12 },
    { label: t("facilities.nightSkiing"), value: 13 },
    { label: t("facilities.culturalSites"), value: 14 },
    { label: t("facilities.parking"), value: 15 },
    { label: t("facilities.privateParking"), value: 16 },
    { label: t("facilities.adventureParks"), value: 17 },
    { label: t("facilities.pools"), value: 18 },
    { label: t("facilities.indoorPool"), value: 19 },
    { label: t("facilities.outdoorPool"), value: 20 },
    { label: t("facilities.firstAid"), value: 21 },
    { label: t("facilities.reception"), value: 22 },
    { label: t("facilities.restaurant"), value: 23 },
    { label: t("facilities.sunbedsUmbrellas"), value: 24 },
    { label: t("facilities.schoolInstructors"), value: 25 },
    { label: t("facilities.conferenceRooms"), value: 26 },
    { label: t("facilities.massageRooms"), value: 27 },
    { label: t("facilities.sauna"), value: 28 },
    { label: t("facilities.transportServices"), value: 29 },
    { label: t("facilities.equipmentServices"), value: 30 },
    { label: t("facilities.streetFood"), value: 31 },
    { label: t("facilities.snowCannons"), value: 32 },
    { label: t("facilities.hikingTrails"), value: 33 },
    { label: t("facilities.relaxZones"), value: 34 },
    { label: t("facilities.museums"), value: 35 },
    { label: t("facilities.guidedTours"), value: 36 },
    { label: t("facilities.snowpark"), value: 37 },
    { label: t("facilities.chairlift"), value: 38 },
    { label: t("facilities.skiLift"), value: 39 },
    { label: t("facilities.gondola"), value: 40 },
    { label: t("facilities.equipmentRental"), value: 41 },
    { label: t("facilities.skiSlopes"), value: 42 },
    { label: t("facilities.bodyTreatments"), value: 43 },
  ];

  useImperativeHandle(ref, () => ({
    validateAll: () => validate(),
  }));

  //validate form
  const validate = (fieldValues) => {
    let newErrors = { ...errors };

    const valuesToValidate = fieldValues || resort;

    if (!valuesToValidate || typeof valuesToValidate !== "object") {
      return false;
    }

    if ("category" in valuesToValidate) {
      newErrors.category = valuesToValidate.category?.trim() ? "" : "z";
    }
    if ("type" in valuesToValidate) {
      newErrors.type = valuesToValidate.type.length === 0 ? "z" : "";
    }
    if ("facilities" in valuesToValidate) {
      newErrors.facilities =
        valuesToValidate.facilities.length === 0 ? "z" : "";
    }

    setErrors(newErrors);

    if (!fieldValues) {
      return Object.values(newErrors).every((x) => x === "");
    }
    return !Object.values(newErrors).some((err) => err !== "");
  };

  //change input
  const handleChange = async (name, value) => {
    await setResort((prev) => ({ ...prev, [name]: value }));

    validate({ [name]: value });
  };

  const handleMultiSelectChange = async (name, value) => {
    await setResort((prev) => ({ ...prev, [name]: value }));

    validate({ [name]: value });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        backgroundColor: theme.colors.backgroundPrimary,
        padding: 16,
        paddingTop: 0,
      }}
    >
      <View>
        <Text
          style={{
            fontSize: 32,
            fontWeight: "600",
            color: theme.colors.textPrimary,
            marginBottom: 8,
            width: "80%",
          }}
        >
          {t("step2Type.title")}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: theme.colors.textSecondary,
            marginBottom: 8,
          }}
        >
          {t("step2Type.subtitle")}
        </Text>

        <CustomDropdown
          name={"category"}
          borderColor={theme.colors.primary}
          focusBorderColor={theme.colors.primary}
          backgroundColor={theme.colors.backgroundPrimary}
          borderWidth={1.5}
          borderRadius={100}
          label={t("step2Type.categoryLabel")}
          options={categoryOptions}
          error={errors?.category}
          selectedValue={resort?.category}
          onValueChange={handleChange}
        />
        <CustomMultiSelect
          name={"type"}
          label={t("step2Type.typeLabel")}
          options={selectedCategoryOptions}
          focusBorderColor={theme.colors.primary}
          borderWidth={1.5}
          borderRadius={100}
          error={errors?.type}
          borderColor={theme.colors.primary}
          backgroundColor={theme.colors.backgroundPrimary}
          onValueChange={(selectedItems) =>
            handleMultiSelectChange("type", selectedItems)
          }
          selectedValue={resort?.type}
        />

        <Text
          style={{
            fontSize: 16,
            color: theme.colors.textSecondary,
            marginBottom: 8,
          }}
        >
          {t("step2Type.facilitiesHint")}
        </Text>
        <CustomMultiSelect
          name={"facilities"}
          label={t("step2Type.facilitiesLabel")}
          options={facilityOptions}
          borderWidth={1.5}
          borderRadius={100}
          focusBorderColor={theme.colors.primary}
          error={errors?.facilities}
          borderColor={theme.colors.primary}
          backgroundColor={theme.colors.backgroundPrimary}
          onValueChange={(selectedItems) =>
            handleMultiSelectChange("facilities", selectedItems)
          }
          selectedValue={resort?.facilities}
          search={true}
        />
      </View>
      {(errors.category || errors.type || errors.facilities) && (
        <Text style={{ color: theme.colors.error, fontWeight: "500" }}>
          {t("step1Info.errorsField")}
        </Text>
      )}
    </ScrollView>
  );
};

export default Step2Type;

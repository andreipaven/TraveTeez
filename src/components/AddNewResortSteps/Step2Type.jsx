import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import CustomButton from "../Buttons/CustomButton";
import { useTheme } from "../../Theme/themeContext";
import { useTranslation } from "react-i18next";
import CustomDropdown from "../Inputs/CustomDropdown";

import CustomMultiSelect from "../Inputs/CustomMultiSelect";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useResort } from "../Hooks/CustomResortContext";
import AddResortProgressBar from "../Bars/Progress/AddResortProgressBar";

const Step2Type = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});
  const { resort, setResort } = useResort();
  const navigation = useNavigation();

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
    { label: t("facilities.beachLakeAccess"), value: 1 },
    { label: t("facilities.outdoorPool"), value: 2 },
    { label: t("facilities.spaWellness"), value: 3 },
    { label: t("facilities.guidedTours"), value: 4 },
    { label: t("facilities.sportsFields"), value: 5 },
    { label: t("facilities.kidsActivities"), value: 6 },
    { label: t("facilities.babysitting"), value: 7 },
    { label: t("facilities.waterSports"), value: 8 },
    { label: t("facilities.hiking"), value: 9 },
    { label: t("facilities.picnicBBQ"), value: 10 },
    { label: t("facilities.wildlifeObservation"), value: 11 },
    { label: t("facilities.relaxZones"), value: 12 },
    { label: t("facilities.themedRestaurants"), value: 13 },
    { label: t("facilities.eventZones"), value: 14 },
    { label: t("facilities.culturalTours"), value: 15 },
    { label: t("facilities.sportSchool"), value: 16 },
    { label: t("facilities.equipmentRental"), value: 17 },
    { label: t("facilities.internalTransport"), value: 18 },
    { label: t("facilities.safariExperience"), value: 19 },
    { label: t("facilities.adventureActivities"), value: 20 },
  ];

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
  const handleChange = (name, value) => {
    setResort((prev) => ({
      ...prev,
      [name]: value,
    }));

    validate({ [name]: value });
  };

  const handleMultiSelectChange = (name, value) => {
    setResort((prev) => ({
      ...prev,
      [name]: value,
    }));

    validate({ [name]: value });
  };

  const nextStep = () => {
    if (validate()) navigation.navigate("Step3");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: theme.colors.backgroundPrimary,
      }}
      edges={["bottom", "left", "right"]}
    >
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: "space-between",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <AddResortProgressBar progress={2 / 4} />
          <Text
            style={{
              fontSize: 32,
              fontWeight: "600",
              color: theme.colors.textPrimary,
              marginVertical: 8,
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
            backgroundColor={theme.colors.backgroundPaper}
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
            borderWidth={1.5}
            borderRadius={100}
            error={errors?.type}
            borderColor={theme.colors.primary}
            backgroundColor={theme.colors.backgroundPaper}
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
            error={errors?.facilities}
            borderColor={theme.colors.primary}
            backgroundColor={theme.colors.backgroundPaper}
            onValueChange={(selectedItems) =>
              handleMultiSelectChange("facilities", selectedItems)
            }
            selectedValue={resort?.facilities}
            search={true}
          />
        </View>

        <CustomButton
          title={t("step1Info.nextButton")}
          backgroundColor={theme.colors.primary}
          textColor={theme.colors.primaryContrast}
          flex={1}
          maxHeight={56}
          minHeight={56}
          paddingVertical={12}
          borderRadius={100}
          paddingHorizontal={8}
          onPress={nextStep}
          fontSize={20}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Step2Type;

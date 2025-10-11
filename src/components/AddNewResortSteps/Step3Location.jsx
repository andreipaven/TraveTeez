import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../Theme/themeContext";
import CustomButton from "../Buttons/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import CustomDropdown from "../Inputs/CustomDropdown";

const Step3Location = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const nextStep = () => {
    navigation.navigate("Step4");
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
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text>Step3Location</Text>
          <CustomDropdown
            search={true}
            label={"Select country"}
            borderColor={theme.colors.primary}
            backgroundColor={theme.colors.backgroundPaper}
            borderRadius={100}
          />
          <CustomDropdown
            search={true}
            label={"Select state"}
            borderColor={theme.colors.primary}
            backgroundColor={theme.colors.backgroundPaper}
            borderRadius={100}
          />
          <CustomDropdown
            search={true}
            label={"Select city"}
            borderColor={theme.colors.primary}
            backgroundColor={theme.colors.backgroundPaper}
            borderRadius={100}
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
      </View>
    </SafeAreaView>
  );
};

export default Step3Location;

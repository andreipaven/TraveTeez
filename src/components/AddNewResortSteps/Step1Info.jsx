import React, { useState } from "react";
import { View, Text, TouchableWithoutFeedback, Keyboard } from "react-native";
import CustomTextInput from "../Inputs/CustomTextInput";
import { useTheme } from "../../Theme/themeContext";
import { useTranslation } from "react-i18next";
import CustomButton from "../Buttons/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResort } from "../Hooks/CustomResortContext";

const Step1Info = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [errors, setErrors] = useState({});

  const { resort, setResort } = useResort();

  const validate = (fieldValues) => {
    let newErrors = { ...errors };

    const valuesToValidate = fieldValues || resort;

    if (!valuesToValidate || typeof valuesToValidate !== "object") {
      return false;
    }

    if ("name" in valuesToValidate) {
      newErrors.name = valuesToValidate.name?.trim() ? "" : "z";
    }

    setErrors(newErrors);

    if (!fieldValues) {
      return Object.values(newErrors).every((x) => x === "");
    }
    return !Object.values(newErrors).some((err) => err !== "");
  };

  const handleChange = (name, value) => {
    setResort((prev) => ({
      ...prev,
      [name]: value,
    }));
    validate({ [name]: value });
  };

  const nextStep = () => {
    if (validate()) {
      navigation.navigate("Step2");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "space-between",
          padding: 16,
          backgroundColor: theme.colors.backgroundPrimary,
        }}
        edges={["bottom", "left", "right"]}
      >
        <View style={{ width: "100%" }}>
          <CustomTextInput
            label={t("step1Info.nameLabel")}
            name={"name"}
            value={resort.name}
            onChangeText={handleChange}
            borderColor={theme.colors.primary}
            focusBorderColor={theme.colors.primary}
            backgroundColor={theme.colors.backgroundPaper}
            color={theme.colors.textPrimary}
            borderRadius={100}
            error={errors.name}
            borderWidth={1}
          />
          <CustomTextInput
            label={t("step1Info.descriptionLabel")}
            name={"description"}
            value={resort.description}
            onChangeText={handleChange}
            borderColor={theme.colors.primary}
            focusBorderColor={theme.colors.primary}
            backgroundColor={theme.colors.backgroundPaper}
            color={theme.colors.textPrimary}
            borderRadius={8}
            multiLine={true}
            minHeight={64}
            maxLength={250}
            borderWidth={1}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
          }}
        >
          <CustomButton
            title={t("step1Info.nextButton")}
            backgroundColor={theme.colors.primary}
            textColor={theme.colors.primaryContrast}
            flex={1}
            paddingVertical={16}
            borderRadius={100}
            paddingHorizontal={8}
            onPress={nextStep}
            fontSize={20}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Step1Info;

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import CustomTextInput from "../Inputs/CustomTextInput";
import { useTheme } from "../../Theme/themeContext";
import { useTranslation } from "react-i18next";
import CustomButton from "../Buttons/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResort } from "../Hooks/CustomResortContext";
import LottieView from "lottie-react-native";
import AddResortProgressBar from "../Bars/Progress/AddResortProgressBar";

const Step1Info = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [errors, setErrors] = useState({});

  const { resort, setResort } = useResort();

  //validations
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

  //change inputs
  const handleChange = (name, value) => {
    setResort((prev) => ({
      ...prev,
      [name]: value,
    }));
    validate({ [name]: value });
  };

  //buttons
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
            <AddResortProgressBar progress={1 / 4} />
            <View style={{ marginBottom: 8 }}>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "600",
                  color: theme.colors.textPrimary,
                  marginVertical: 8,

                  width: "80%",
                }}
              >
                {t("step1Info.title")}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: theme.colors.textSecondary,
                }}
              >
                {t("step1Info.subtitle")}
              </Text>
            </View>
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
              borderWidth={1.5}
            />
            <Text
              style={{
                fontSize: 16,
                color: theme.colors.textSecondary,
                marginBottom: 8,
              }}
            >
              {t("step1Info.descriptionHint")}
            </Text>
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
              maxLength={1000}
              borderWidth={1.5}
            />
            {errors.name && (
              <Text style={{ color: theme.colors.error, fontWeight: "500" }}>
                {t("step1Info.errorsField")}
              </Text>
            )}
          </View>
          <LottieView
            source={{
              uri: "https://lottie.host/061c80e0-61ee-4256-80ad-9a8df6ad604a/q9KflvCkuF.lottie",
            }}
            autoPlay
            loop
            style={{
              width: 320,
              height: 320,
              alignSelf: "center",
            }}
          />
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
    </TouchableWithoutFeedback>
  );
};

export default Step1Info;

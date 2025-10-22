import React, { useImperativeHandle, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import CustomTextInput from "../Inputs/CustomTextInput";
import { useTheme } from "../../Theme/themeContext";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";
import Loading from "../Loading/Loading";

const Step1Info = ({ ref, resort, setResort }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});

  useImperativeHandle(ref, () => ({
    validateAll: () => validate(),
  }));

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
  const handleChange = async (name, value) => {
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
        <CustomTextInput
          label={t("step1Info.nameLabel")}
          name={"name"}
          value={resort.name}
          onChangeText={handleChange}
          borderColor={theme.colors.primary}
          focusBorderColor={theme.colors.primary}
          backgroundColor={theme.colors.backgroundPrimary}
          color={theme.colors.textPrimary}
          borderRadius={100}
          error={errors.name}
          borderWidth={1.5}
        />
        <Text
          style={{
            fontSize: 16,
            color: theme.colors.textSecondary,
            marginVertical: 4,
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
          backgroundColor={theme.colors.backgroundPrimary}
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
    </ScrollView>
  );
};

export default Step1Info;

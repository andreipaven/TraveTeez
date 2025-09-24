import React, { useState } from "react";
import {
  Image,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useTheme } from "../Theme/themeContext";
import { Ionicons } from "@expo/vector-icons";
import CustomTextInput from "../components/Inputs/CustomTextInput";
import CustomDivider from "../components/Divider/CustomDivider";
import CustomButton from "../components/Buttons/CustomButton";
import Facebook from "../../assets/facebook.png";
import Google from "../../assets/google.png";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import APIService from "../services/APIService";
import { config } from "../services/config";
import { saveAccessToken, saveRefreshToken } from "../Secure/secureHub";

const SingUp = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    verifyPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    verifyPassword: false,
  });

  const validate = (fieldValues) => {
    let newErrors = { ...errors };

    const valuesToValidate = fieldValues || user;

    if (!valuesToValidate || typeof valuesToValidate !== "object") {
      return false;
    }

    // First Name
    if ("firstName" in valuesToValidate) {
      newErrors.firstName = valuesToValidate.firstName?.trim()
        ? ""
        : t("signUp.errorRequired");
    }

    // Last Name
    if ("lastName" in valuesToValidate) {
      newErrors.lastName = valuesToValidate.lastName?.trim()
        ? ""
        : t("signUp.errorRequired");
    }

    // Email
    if ("email" in valuesToValidate) {
      newErrors.email = /^\S+@\S+\.\S+$/.test(valuesToValidate.email || "")
        ? ""
        : t("signUp.errorInvalidEmail");
    }

    // Password
    if ("password" in valuesToValidate) {
      newErrors.password =
        (valuesToValidate.password || "").length >= 6
          ? ""
          : t("signUp.errorWeakPassword");
    }

    // Verify Password
    if ("verifyPassword" in valuesToValidate) {
      newErrors.verifyPassword =
        (valuesToValidate.verifyPassword || "") ===
        (valuesToValidate.password ?? user.password)
          ? ""
          : t("signUp.errorPasswordMismatch");
    }

    setErrors(newErrors);

    if (!fieldValues) {
      return Object.values(newErrors).every((x) => x === "");
    }

    return !Object.values(newErrors).some((err) => err !== "");
  };

  const handleChange = (name, value) => {
    const updatedUser = {
      ...user,
      [name]: value,
    };

    setUser(updatedUser);

    validate({ [name]: value });
  };

  const submitSignUp = async () => {
    if (validate()) {
      APIService.post(config.endpoints.legacy.auth.signUp, {
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        password: user.password,
      })
        .then((response) => {
          if (response?.error) {
            console.log("Something wrong happened." + response.error);
          } else {
            const { accessToken, refreshToken } = response.data;
            saveAccessToken(accessToken);
            saveRefreshToken(refreshToken);
          }
        })
        .catch((err) => {
          console.log("An error occurred!" + err);
        })
        .finally(() => {});
    } else {
      console.log("Form invalid", errors);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          backgroundColor: theme.colors.backgroundPrimary,
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 16,
          paddingLeft: 16,
          paddingRight: 16,
          gap: 8,
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            color: theme.colors.textPrimary,
            textAlign: "center",
            paddingBottom: 16,
          }}
        >
          {t("signUp.title")}
        </Text>

        <CustomTextInput
          name={"lastName"}
          placeholder={t("signUp.lastName")}
          value={user.lastName}
          onChangeText={handleChange}
          borderColor={"transparent"}
          focusBorderColor={theme.colors.primary}
          backgroundColor={theme.colors.backgroundPaper}
          iconLeft={
            <Ionicons
              name={"person"}
              size={16}
              color={theme.colors.textSecondary}
            />
          }
          color={theme.colors.textSecondary}
          error={errors.lastName}
        />
        <CustomTextInput
          name={"firstName"}
          placeholder={t("signUp.firstName")}
          value={user.firstName}
          onChangeText={handleChange}
          borderColor={"transparent"}
          focusBorderColor={theme.colors.primary}
          backgroundColor={theme.colors.backgroundPaper}
          iconLeft={
            <Ionicons
              name={"person"}
              size={16}
              color={theme.colors.textSecondary}
            />
          }
          color={theme.colors.textSecondary}
          error={errors.firstName}
        />
        <CustomTextInput
          name={"email"}
          placeholder={t("signUp.email")}
          value={user.email}
          onChangeText={handleChange}
          borderColor={"transparent"}
          focusBorderColor={theme.colors.primary}
          backgroundColor={theme.colors.backgroundPaper}
          iconLeft={
            <Ionicons
              name={"mail"}
              size={16}
              color={theme.colors.textSecondary}
            />
          }
          color={theme.colors.textSecondary}
          error={errors.email}
        />
        <CustomTextInput
          name={"password"}
          placeholder={t("signUp.password")}
          value={user.password}
          onChangeText={handleChange}
          borderColor={"transparent"}
          focusBorderColor={theme.colors.primary}
          backgroundColor={theme.colors.backgroundPaper}
          iconLeft={
            <Ionicons
              name={"lock-closed"}
              size={16}
              color={theme.colors.textSecondary}
            />
          }
          color={theme.colors.textSecondary}
          error={errors.password}
          secureTextEntry={true}
        />
        <CustomTextInput
          name={"verifyPassword"}
          placeholder={t("signUp.verifyPassword")}
          value={user.verifyPassword}
          onChangeText={handleChange}
          borderColor={"transparent"}
          focusBorderColor={theme.colors.primary}
          backgroundColor={theme.colors.backgroundPaper}
          iconLeft={
            <Ionicons
              name={"lock-closed"}
              size={16}
              color={theme.colors.textSecondary}
            />
          }
          color={theme.colors.textSecondary}
          error={errors.verifyPassword}
          secureTextEntry={true}
        />
        <CustomButton
          title={t("signUp.button")}
          onPress={submitSignUp}
          backgroundColor={theme.colors.primary}
          textColor="#fff"
          borderRadius={12}
          paddingVertical={14}
          paddingHorizontal={30}
        />
        <CustomDivider
          text={t("signUp.divider")}
          lineColor={theme.colors.textSecondary}
        />
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <CustomButton
            backgroundColor={theme.colors.backgroundPaper}
            iconCenter={
              <Image source={Facebook} style={{ height: 24, width: 24 }} />
            }
            paddingVertical={12}
            paddingHorizontal={12}
            borderRadius={50}
            width={"fit-content"}
          />
          <CustomButton
            backgroundColor={theme.colors.backgroundPaper}
            iconCenter={
              <Image source={Google} style={{ height: 24, width: 24 }} />
            }
            paddingVertical={12}
            paddingHorizontal={12}
            borderRadius={50}
            width={"fit-content"}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",

            justifyContent: "center",
          }}
        >
          <Text
            style={{
              width: "auto",
              paddingRight: 8,
              fontSize: 16,
            }}
          >
            {t("signUp.alreadyHaveAccount")}
          </Text>
          <CustomButton
            width={"auto"}
            title={t("signUp.alreadyHaveAccountButton")}
            textColor={theme.colors.primary}
            onPress={() => navigation.navigate("SignIn")}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default SingUp;

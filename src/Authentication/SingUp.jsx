import React, { useContext, useLayoutEffect, useState } from "react";
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
import { AuthContext } from "../Secure/AuthProvider";
import { Icon } from "react-native-elements";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import LottieView from "lottie-react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

import { supabase } from "./utils/supabase";

const SingUp = ({ isOpen, setIsOpen }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { setUser } = useContext(AuthContext);

  const [state, setState] = useState({
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
  const [firstVerify, setFirstVerify] = useState(true);
  const [signUpError, setSignUpError] = useState(false);

  const [signUpLoading, setSignUpLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <CustomButton
          iconLeft={
            <Icon
              color={theme.colors.textPrimary}
              size={24}
              type={"material-community"}
              name={"close"}
            />
          }
          style={{ paddingRight: 8 }}
          paddingVertical={8}
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            navigation.goBack();
          }}
        />
      ),
    });
  }, []);

  const validate = (fieldValues) => {
    let newErrors = { ...errors };

    const valuesToValidate = fieldValues || state;

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
      setSignUpError(false);
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
      newErrors.verifyPassword =
        (valuesToValidate.password || "") ===
        (valuesToValidate.verifyPassword ?? state.verifyPassword)
          ? ""
          : t("signUp.errorPasswordMismatch");
    }

    // Verify Password
    console.log(valuesToValidate);
    if ("verifyPassword" in valuesToValidate) {
      newErrors.verifyPassword =
        (valuesToValidate.verifyPassword || "") ===
        (valuesToValidate.password ?? state.password)
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
      ...state,
      [name]: value,
    };

    setState(updatedUser);
    if (!firstVerify) {
      validate({ [name]: value });
    }
  };

  const signUpWithGoogle = async () => {
    try {
      const redirectUrl = Linking.createURL("/auth");
      console.log("1: " + redirectUrl);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectUrl },
      });
      console.log("2: " + error);
      if (error) {
        console.log("Supabase OAuth error:", error.message);
        return;
      }

      if (data.url) {
        console.log("3: " + redirectUrl);
        await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
      }
    } catch (err) {
      console.log("Unexpected error during Google sign-in:", err);
    }
  };

  const submitSignUp = async () => {
    setFirstVerify(false);
    if (validate()) {
      setSignUpLoading(true);
      APIService.post(config.endpoints.legacy.auth.signUp, {
        first_name: state.firstName,
        last_name: state.lastName,
        email: state.email,
        password: state.password,
      })
        .then((response) => {
          if (response?.error) {
            console.log("Something wrong happened." + response.error);
          } else {
            const { accessToken, refreshToken, user } = response.data;
            saveAccessToken(accessToken);
            saveRefreshToken(refreshToken);
            setUser(user);
            setSignUpError(false);
            navigation.goBack();
          }
        })
        .catch((err) => {
          setSignUpError(true);
          console.log("An error occurred!" + err);
        })
        .finally(() => {
          setSignUpLoading(false);
        });
    } else {
      console.log("Form invalid", errors);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.backgroundPrimary,
        display: isOpen ? "flex" : "none",
      }}
      edges={["bottom", "left", "right"]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <KeyboardAwareScrollView bottomOffset={60} style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: theme.colors.backgroundPrimary,
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 16,
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: theme.colors.textPrimary,
                textAlign: "center",
                paddingBottom: 8,
              }}
            >
              {t("signUp.title")}
            </Text>

            <CustomTextInput
              name={"lastName"}
              label={t("signUp.lastName")}
              value={state.lastName}
              onChangeText={handleChange}
              borderColor={theme.colors.primary}
              backgroundColor={theme.colors.backgroundPrimary}
              iconLeft={
                <Ionicons
                  name={"person"}
                  size={16}
                  color={theme.colors.textSecondary}
                />
              }
              textColor={theme.colors.textSecondary}
              error={errors.lastName}
              borderWidth={1.5}
              borderRadius={100}
            />
            <CustomTextInput
              name={"firstName"}
              label={t("signUp.firstName")}
              value={state.firstName}
              onChangeText={handleChange}
              borderColor={theme.colors.primary}
              focusBorderColor={theme.colors.primary}
              backgroundColor={theme.colors.backgroundPrimary}
              borderWidth={1.5}
              iconLeft={
                <Ionicons
                  name={"person"}
                  size={16}
                  color={theme.colors.textSecondary}
                />
              }
              textColor={theme.colors.textSecondary}
              error={errors.firstName}
              borderRadius={100}
            />
            <CustomTextInput
              name={"email"}
              label={t("signUp.email")}
              value={state.email}
              onChangeText={handleChange}
              borderColor={theme.colors.primary}
              focusBorderColor={theme.colors.primary}
              backgroundColor={theme.colors.backgroundPrimary}
              borderWidth={1.5}
              borderRadius={100}
              iconLeft={
                <Ionicons
                  name={"mail"}
                  size={16}
                  color={theme.colors.textSecondary}
                />
              }
              textColor={theme.colors.textSecondary}
              error={errors.email}
              keyboardType={"email-address"}
              autoCapitalize={"none"}
              autoCorrect={false}
            />
            <CustomTextInput
              name={"password"}
              label={t("signUp.password")}
              value={state.password}
              onChangeText={handleChange}
              borderColor={theme.colors.primary}
              focusBorderColor={theme.colors.primary}
              backgroundColor={theme.colors.backgroundPrimary}
              borderWidth={1.5}
              borderRadius={100}
              iconLeft={
                <Ionicons
                  name={"lock-closed"}
                  size={16}
                  color={theme.colors.textSecondary}
                />
              }
              textColor={theme.colors.textSecondary}
              error={errors.password}
              secureTextEntry={true}
            />
            <CustomTextInput
              name={"verifyPassword"}
              label={t("signUp.verifyPassword")}
              value={state.verifyPassword}
              onChangeText={handleChange}
              borderColor={theme.colors.primary}
              focusBorderColor={theme.colors.primary}
              backgroundColor={theme.colors.backgroundPrimary}
              borderWidth={1.5}
              borderRadius={100}
              iconLeft={
                <Ionicons
                  name={"lock-closed"}
                  size={16}
                  color={theme.colors.textSecondary}
                />
              }
              textColor={theme.colors.textSecondary}
              error={errors.verifyPassword}
              secureTextEntry={true}
            />
            {signUpError && (
              <Text style={{ color: "red" }}>
                {t("signUp.errorEmailAlreadyUsed")}
              </Text>
            )}
            <CustomButton
              title={signUpLoading ? "" : t("signUp.button")}
              onPress={submitSignUp}
              backgroundColor={theme.colors.primary}
              textColor="#fff"
              borderRadius={100}
              width={"100%"}
              paddingVertical={14}
              paddingHorizontal={30}
              height={48}
              maxHeight={48}
              iconCenter={
                signUpLoading && (
                  <LottieView
                    source={require("../../assets/Trail loading.json")}
                    autoPlay
                    loop
                    style={{ width: 54, height: 54, position: "relative" }}
                    resizeMode={"cover"}
                    colorFilters={[
                      {
                        keypath: "*",
                        color: "#ffffff",
                      },
                    ]}
                  />
                )
              }
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
                onPress={signUpWithGoogle}
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
                onPress={setIsOpen}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};
export default SingUp;

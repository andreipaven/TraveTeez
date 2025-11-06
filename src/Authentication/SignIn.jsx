import React, { useContext, useLayoutEffect, useState } from "react";
import {
  Image,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import CustomTextInput from "../components/Inputs/CustomTextInput";
import { useTheme } from "../Theme/themeContext";
import CustomButton from "../components/Buttons/CustomButton";
import CustomDivider from "../components/Divider/CustomDivider";
import Facebook from "../../assets/facebook.png";
import Google from "../../assets/google.png";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import APIService from "../services/APIService";
import { config } from "../services/config";
import { saveAccessToken, saveRefreshToken } from "../Secure/secureHub";
import { AuthContext } from "../Secure/AuthProvider";
import { Icon } from "react-native-elements";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import loadingButton from "../components/Loading/LoadingButton";
import LottieView from "lottie-react-native";

export default function SignIn({ isOpen, setIsOpen }) {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { setUser } = useContext(AuthContext);

  const { t } = useTranslation();
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({ email: "", password: "" });
  const [signInError, setSignInError] = useState(false);

  const [signInLoading, setSignInLoading] = useState(false);

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

  const handleChange = (name, value) => {
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = (fieldValues) => {
    let newErrors = { ...errors };

    const valuesToValidate = fieldValues || state;

    if (!valuesToValidate || typeof valuesToValidate !== "object") {
      return false;
    }

    if ("email" in valuesToValidate) {
      newErrors.email = valuesToValidate.email?.trim()
        ? ""
        : t("signIn.errorRequired");
    }

    if ("password" in valuesToValidate) {
      newErrors.password = valuesToValidate.password?.trim()
        ? ""
        : t("signIn.errorRequired");
    }

    setErrors(newErrors);
    if (!fieldValues) {
      return Object.values(newErrors).every((x) => x === "");
    }
    return !Object.values(newErrors).some((err) => err !== "");
  };

  const submitSignIn = () => {
    if (validate()) {
      setSignInLoading(true);
      APIService.post(config.endpoints.legacy.auth.signIn, {
        email: state.email,
        password: state.password,
      })
        .then(async (response) => {
          if (response.data?.error) {
            console.log("Something wrong happened: " + response.data.error);
          } else {
            console.log("Login success");
            const { accessToken, refreshToken, user } = response.data;
            await saveAccessToken(accessToken);
            await saveRefreshToken(refreshToken);
            setUser(user);
            setSignInError(false);
            navigation.goBack();
          }
        })
        .catch((err) => {
          const errorMessage = err.response?.data?.error || "Unexpected error";
          console.log("An error occurred! " + errorMessage);
          setSignInError(true);
          setErrors({
            email: "z",
            password: "z",
          });
        })
        .finally(() => {
          setSignInLoading(false);
        });
    } else {
      console.log("Error to signIn");
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.backgroundPrimary,
        display: isOpen ? "flex" : "none",
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: theme.colors.backgroundPrimary,
            flex: 1,
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
            padding: 16,
            gap: 8, // or not
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
            {t("signIn.title")}
          </Text>
          <CustomTextInput
            name={"email"}
            value={state.email}
            onChangeText={handleChange}
            borderColor={theme.colors.primary}
            label={t("signIn.email")}
            focusBorderColor={theme.colors.primary}
            backgroundColor={theme.colors.backgroundPrimary}
            iconLeft={
              <Ionicons
                name={"person"}
                size={16}
                color={theme.colors.textSecondary}
              />
            }
            textColor={theme.colors.textSecondary}
            error={errors.email}
            borderWidth={1.5}
            borderRadius={100}
          />
          <CustomTextInput
            name={"password"}
            label={t("signIn.password")}
            value={state.password}
            onChangeText={handleChange}
            borderColor={theme.colors.primary}
            focusBorderColor={theme.colors.primary}
            backgroundColor={theme.colors.backgroundPrimary}
            textColor={theme.colors.textSecondary}
            error={errors.password}
            secureTextEntry={true}
            iconLeft={
              <Ionicons
                name={"lock-closed"}
                size={16}
                color={theme.colors.textSecondary}
              />
            }
            borderWidth={1.5}
            borderRadius={100}
          />
          {signInError && (
            <Text style={{ color: "red" }}>{t("signIn.errorInvalid")}</Text>
          )}
          <CustomButton
            title={!signInLoading ? t("signIn.button") : ""}
            onPress={submitSignIn}
            backgroundColor={theme.colors.primary}
            textColor="#fff"
            borderRadius={100}
            paddingVertical={14}
            paddingHorizontal={30}
            maxHeight={48}
            height={48}
            width={"100%"}
            iconCenter={
              signInLoading && (
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
            text={t("signIn.divider")}
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
            <Text style={{ width: "auto", paddingRight: 8, fontSize: 16 }}>
              {t("signIn.noAccount")}
            </Text>
            <CustomButton
              width={"auto"}
              title={t("signIn.noAccountButton")}
              textColor={theme.colors.primary}
              onPress={setIsOpen}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

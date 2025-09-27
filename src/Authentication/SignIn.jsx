import React, { useContext, useState } from "react";
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

export default function SignIn() {
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
            navigation.navigate("MainTabs", { screen: "Home" });
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
        .finally(() => {});
    } else {
      console.log("Error to signIn");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: theme.colors.backgroundPrimary,
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
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
          placeholder={t("signIn.email")}
          value={state.email}
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
          error={errors.email}
        />
        <CustomTextInput
          name={"password"}
          placeholder={t("signIn.password")}
          value={state.password}
          onChangeText={handleChange}
          borderColor={"transparent"}
          focusBorderColor={theme.colors.primary}
          backgroundColor={theme.colors.backgroundPaper}
          color={theme.colors.textSecondary}
          error={errors.password}
          secureTextEntry={true}
          iconLeft={
            <Ionicons
              name={"lock-closed"}
              size={16}
              color={theme.colors.textSecondary}
            />
          }
        />
        {signInError && (
          <Text style={{ color: "red" }}>{t("signIn.errorInvalid")}</Text>
        )}
        <CustomButton
          title={t("signIn.button")}
          onPress={submitSignIn}
          backgroundColor={theme.colors.primary}
          textColor="#fff"
          borderRadius={12}
          paddingVertical={14}
          paddingHorizontal={30}
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
            onPress={() => navigation.navigate("SignUp")}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

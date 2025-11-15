import React, { useState, useRef, useLayoutEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddResortProgressBar from "../../components/Bars/Progress/AddResortProgressBar";
import Step1Info from "../../components/AddNewResortSteps/Step1Info";
import Step2Type from "../../components/AddNewResortSteps/Step2Type";
import Step3Location from "../../components/AddNewResortSteps/Step3Location";
import Step4Gallery from "../../components/AddNewResortSteps/Step4Gallery";
import CustomButton from "../../components/Buttons/CustomButton";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../Theme/themeContext";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import useResortStorage from "../../components/Hooks/useResortStorage";
import { Icon } from "react-native-elements";
import * as Haptics from "expo-haptics";

const AddResort = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [step, setStep] = useState(1);
  const navigation = useNavigation();
  const [errors, setErrors] = useState({});
  const stepRefs = {
    1: useRef(),
    2: useRef(),
    3: useRef(),
    4: useRef(),
  };

  const [loadingSubmitResort, setLoadingSubmitResort] = useState(false);

  const { resort, setResort, resetResort } = useResortStorage();

  //header settings
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
  }, [navigation, theme, resort]);

  const nextStep = async () => {
    const currentRef = stepRefs[step]?.current;
    if (!currentRef || typeof currentRef.validateAll !== "function") return;

    const result = await currentRef.validateAll();

    if (typeof result === "boolean") {
      if (!result) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      if (step < 4) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setStep(step + 1);
      }
      return;
    }

    if (
      step === 4 &&
      result === undefined &&
      Object.values(errors).every((x) => x === "")
    ) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const prevStep = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.backgroundPrimary }}
      edges={["left", "right", "bottom"]}
    >
      <AddResortProgressBar progress={step / 4} marginBottom={8} />
      <View style={{ flex: 1 }}>
        {step === 1 && (
          <Step1Info
            ref={stepRefs[1]}
            resort={resort}
            setResort={setResort}
            errors={errors}
            setErrors={setErrors}
          />
        )}
        {step === 2 && (
          <Step2Type
            ref={stepRefs[2]}
            resort={resort}
            setResort={setResort}
            errors={errors}
            setErrors={setErrors}
          />
        )}
        {step === 3 && (
          <Step3Location
            ref={stepRefs[3]}
            resort={resort}
            setResort={setResort}
            errors={errors}
            setErrors={setErrors}
          />
        )}
        {step === 4 && (
          <Step4Gallery
            ref={stepRefs[4]}
            startLoadingSubmit={() => setLoadingSubmitResort(true)}
            endLoadingSubmit={() => setLoadingSubmitResort(false)}
            resort={resort}
            setResort={setResort}
            resetResort={resetResort}
            errors={errors}
            setErrors={setErrors}
          />
        )}
      </View>

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          gap: 16,
          paddingHorizontal: 16,
          paddingTop: 8,
        }}
      >
        <CustomButton
          title={t("step1Info.backButton")}
          backgroundColor={theme.colors.textSecondary}
          textColor={theme.colors.primaryContrast}
          flex={1 / 3}
          maxHeight={46}
          minHeight={46}
          paddingVertical={0}
          borderRadius={100}
          paddingHorizontal={8}
          onPress={prevStep}
          fontSize={16}
        />
        <CustomButton
          title={
            loadingSubmitResort ? (
              <LottieView
                source={require("../../../assets/Trail loading.json")}
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
            ) : step === 4 ? (
              "Add Resort"
            ) : (
              t("step1Info.nextButton")
            )
          }
          backgroundColor={theme.colors.primary}
          textColor={theme.colors.primaryContrast}
          flex={1}
          maxHeight={46}
          minHeight={46}
          paddingVertical={0}
          borderRadius={100}
          paddingHorizontal={8}
          onPress={nextStep}
          fontSize={16}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddResort;

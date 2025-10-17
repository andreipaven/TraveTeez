import React, { useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
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

const AddResort = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [step, setStep] = useState(1);
  const navigation = useNavigation();
  const stepRefs = {
    1: useRef(),
    2: useRef(),
    3: useRef(),
    4: useRef(),
  };

  const [loadingSubmitResort, setLoadingSubmitResort] = useState(false);

  const nextStep = async () => {
    const currentRef = stepRefs[step].current;

    if (currentRef && typeof currentRef.validateAll() === "boolean") {
      const valid = await currentRef.validateAll();

      if (!valid || step >= 4) return;
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
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
        {step === 1 && <Step1Info ref={stepRefs[1]} />}
        {step === 2 && <Step2Type ref={stepRefs[2]} />}
        {step === 3 && <Step3Location ref={stepRefs[3]} />}
        {step === 4 && (
          <Step4Gallery
            ref={stepRefs[4]}
            startLoadingSubmit={() => setLoadingSubmitResort(true)}
            endLoadingSubmit={() => setLoadingSubmitResort(false)}
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
          maxHeight={56}
          minHeight={56}
          paddingVertical={12}
          borderRadius={100}
          paddingHorizontal={8}
          onPress={prevStep}
          fontSize={20}
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
            ) : (
              t("step1Info.nextButton")
            )
          }
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

export default AddResort;

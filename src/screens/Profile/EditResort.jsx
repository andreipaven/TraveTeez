import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddResortProgressBar from "../../components/Bars/Progress/AddResortProgressBar";
import Step1Info from "../../components/AddNewResortSteps/Step1Info";
import Step2Type from "../../components/AddNewResortSteps/Step2Type";
import Step3Location from "../../components/AddNewResortSteps/Step3Location";
import CustomButton from "../../components/Buttons/CustomButton";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../Theme/themeContext";
import LottieView from "lottie-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import Toast from "react-native-toast-message";
import Loading from "../../components/Loading/Loading";
import EditStep4Gallery from "../../components/EditResortSteps/EditStep4Gallery";
import { useEditResort } from "../../components/Hooks/useEditResort";
import { Icon } from "react-native-elements";

const EditResort = () => {
  const route = useRoute();
  const { state } = route.params;
  const { resortId } = state;
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [step, setStep] = useState(1);
  const navigation = useNavigation();
  const [fetchLoading, setFetchLoading] = useState(true);
  const stepRefs = {
    1: useRef(),
    2: useRef(),
    3: useRef(),
    4: useRef(),
  };

  const [loadingSubmitResort, setLoadingSubmitResort] = useState(false);

  const { resort, setResort, resetResort } = useEditResort();

  //header settings
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={updateResort}
          title="Save"
          color={theme.colors.primary}
        />
      ),
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
          onPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation, theme, resort]);

  //update resort
  const updateResort = () => {};

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

  //get resort from db
  const fetchResort = () => {
    APIService.post(config.endpoints.legacy.resort.getResortById, {
      resort_id: resortId,
    })
      .then((response) => {
        if (response.data?.error) {
          console.log("Something wrong happened:" + response.data.error);
        } else {
          const resultResort = response.data;
          setResort((prev) => ({
            ...prev,
            images: resultResort.images.slice(1),
            mainImage: resultResort.images[0],
            name: resultResort.name,
            description: resultResort.description,
            category: resultResort.category,
            facilities: resultResort.facilities,
            country: resultResort.country,
            countryValue: resultResort.country_value,
            state: resultResort.state,
            stateValue: resultResort.state_value,
            city: resultResort.city,
            cityValue: resultResort.city_value,
            latitude: resultResort.latitude,
            longitude: resultResort.longitude,
            type: resultResort.types,
          }));
        }
      })
      .catch((err) => {
        console.log("An error occurred: " + err);
        Toast.show({
          type: "custom",
          text1: t("error.catchError"),
          position: "bottom",
        });
      })
      .finally(() => {
        setFetchLoading(false);
      });
  };

  useEffect(() => {
    fetchResort();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.backgroundPrimary }}
      edges={["left", "right", "bottom"]}
    >
      {fetchLoading ? (
        <Loading />
      ) : (
        <View style={{ flex: 1 }}>
          <AddResortProgressBar progress={step / 4} marginBottom={8} />
          <View style={{ flex: 1 }}>
            {step === 1 && (
              <Step1Info
                ref={stepRefs[1]}
                resort={resort}
                setResort={setResort}
              />
            )}
            {step === 2 && (
              <Step2Type
                ref={stepRefs[2]}
                resort={resort}
                setResort={setResort}
              />
            )}
            {step === 3 && (
              <Step3Location
                ref={stepRefs[3]}
                resort={resort}
                setResort={setResort}
              />
            )}
            {step === 4 && (
              <EditStep4Gallery
                ref={stepRefs[4]}
                startLoadingSubmit={() => setLoadingSubmitResort(true)}
                endLoadingSubmit={() => setLoadingSubmitResort(false)}
                resort={resort}
                setResort={setResort}
                resetResort={resetResort}
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
        </View>
      )}
    </SafeAreaView>
  );
};

export default EditResort;

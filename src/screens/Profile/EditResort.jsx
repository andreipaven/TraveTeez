import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { View } from "react-native";
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
import DeleteResortModalConfirmation from "../../components/Modals/DeleteResortModalConfirmation";
import * as Haptics from "expo-haptics";

const EditResort = () => {
  const route = useRoute();
  const { state } = route.params;
  const { resortId } = state;
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [step, setStep] = useState(1);
  const navigation = useNavigation();
  const [errors, setErrors] = useState({});
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deletedImages, setDeletedImages] = useState([]);
  const stepRefs = {
    1: useRef(),
    2: useRef(),
    3: useRef(),
    4: useRef(),
  };

  const [loadingSubmitResort, setLoadingSubmitResort] = useState(false);
  const [loadingButton, setLoadingButton] = useState({
    delete: false,
    update: false,
  });

  const [modalVisible, setModalVisible] = useState({ deleteResort: false });

  const { resort, setResort, resetResort } = useEditResort();

  //header settings
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", gap: 8 }}>
          <CustomButton
            onPress={() => {
              setModalVisible((prev) => ({ ...prev, deleteResort: true }));
            }}
            iconCenter={
              loadingButton.delete ? (
                <LottieView
                  source={require("../../../assets/Trail loading.json")}
                  autoPlay
                  loop
                  style={{ width: 32, height: 32, position: "relative" }}
                  resizeMode={"cover"}
                  colorFilters={[
                    {
                      keypath: "*",
                      color: "#ffffff",
                    },
                  ]}
                />
              ) : (
                <Icon
                  type={"font-awesome"}
                  name={"trash"}
                  size={16}
                  color={theme.colors.primaryContrast}
                />
              )
            }
            height={34}
            width={34}
            backgroundColor={theme.colors.primaryDelete}
            paddingVertical={6}
            borderRadius={100}
            textColor={theme.colors.primaryContrast}
          />

          <CustomButton
            onPress={updateResort}
            height={34}
            title={
              loadingButton.update ? (
                <LottieView
                  source={require("../../../assets/Trail loading.json")}
                  autoPlay
                  loop
                  style={{ width: 32, height: 32, position: "relative" }}
                  resizeMode={"cover"}
                  colorFilters={[
                    {
                      keypath: "*",
                      color: "#ffffff",
                    },
                  ]}
                />
              ) : (
                "Save"
              )
            }
            backgroundColor={theme.colors.primary}
            paddingHorizontal={10}
            paddingVertical={6}
            borderRadius={100}
            textColor={theme.colors.primaryContrast}
            width={60}
          />
        </View>
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
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            navigation.goBack();
          }}
        />
      ),
    });
  }, [navigation, theme, resort, loadingButton]);

  const deleteResort = () => {
    setModalVisible((prev) => ({ ...prev, deleteResort: false }));
    setLoadingButton((prev) => ({
      ...prev,
      delete: true,
    }));

    APIService.post(config.endpoints.legacy.resort.deleteResort, {
      resortId: resortId,
    })
      .then((response) => {
        if (response?.data.error) {
          console.log("Something wrong happened" + response.data.error);
        } else {
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success,
          ).then(() => {
            Toast.show({
              type: "custom",
              text1: t("editResort.successDeleteSubmitNotify"),
              position: "bottom",
            });
            navigation.goBack();
          });
        }
      })
      .catch((err) => {
        console.log("An error occurred:" + err);
        Toast.show({
          type: "custom",
          text1: t("error.catchError"),
          position: "bottom",
        });
      })
      .finally(() => {
        setLoadingButton((prev) => ({
          ...prev,
          delete: false,
        }));
      });
  };

  //update resort
  const updateResort = () => {
    if (Object.values(errors).every((x) => x === "")) {
      setLoadingButton((prev) => ({
        ...prev,
        update: true,
      }));

      APIService.post(config.endpoints.legacy.resort.updateResort, {
        body: {
          name: resort.name,
          country: resort.country,
          state: resort.state,
          city: resort.city,
          facilities: resort.facilities,
          description: resort.description,
          category: resort.category,
        },
        types: resort.type,
        resortId: resortId,
        images: [resort.mainImage, resort.images],
        deletedImages: deletedImages,
      })
        .then((response) => {
          if (response.data?.error) {
            console.log("Something wrong happened: " + response.data.error);
          } else {
            Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success,
            ).then(() => {
              Toast.show({
                type: "custom",
                text1: t("editResort.successSubmitNotify"),
                position: "bottom",
              });
            });
          }
        })
        .catch((err) => {
          console.log("An error occurred! " + err);
        })
        .finally(() => {
          setLoadingButton((prev) => ({
            ...prev,
            update: false,
          }));
        });
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

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

    if (step === 4 && result) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const prevStep = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
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
              <EditStep4Gallery
                ref={stepRefs[4]}
                resort={resort}
                setResort={setResort}
                errors={errors}
                setErrors={setErrors}
                setDeletedImages={setDeletedImages}
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
              flex={step === 4 ? 1 : 1 / 3}
              maxHeight={56}
              minHeight={56}
              paddingVertical={12}
              borderRadius={100}
              paddingHorizontal={8}
              onPress={prevStep}
              fontSize={20}
            />
            {step !== 4 && (
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
            )}
          </View>
          <DeleteResortModalConfirmation
            visible={modalVisible.deleteResort}
            title="Delete Resort"
            message="Are you sure you want to delete this resort?"
            onConfirm={deleteResort}
            onCancel={() =>
              setModalVisible((prev) => ({ ...prev, deleteResort: false }))
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default EditResort;

import React, { useImperativeHandle, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useTheme } from "../../Theme/themeContext";
import { useTranslation } from "react-i18next";

import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "../Buttons/CustomButton";
import { Icon } from "react-native-elements";
import AddImageModal from "../Modals/AddImageModal";
import Loading from "../Loading/Loading";
import LottieView from "lottie-react-native";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

const screenWidth = Dimensions.get("window").width;

const Step4Gallery = ({
  ref,
  startLoadingSubmit,
  endLoadingSubmit,
  resort,
  setResort,
  resetResort,
  errors,
  setErrors,
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [loadingImages, setLoadingImages] = useState({
    mainImage: false,
    galleryImages: false,
  });

  const [isFirstImage, setIsFirstImage] = useState(false);

  useImperativeHandle(ref, () => ({
    validateAll: () => submitAddResort(),
  }));

  const bottomSheetModalRefImages = useRef(null);

  //modal functions
  const handlePresentPressFeedback = () =>
    bottomSheetModalRefImages.current.present();

  const compressImage = async (uri, compress = 0.6, maxWidth = 1080) => {
    try {
      return await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: maxWidth } }],
        {
          compress: compress,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        },
      );
    } catch (error) {
      console.error("compressImage error:", error);
      throw error;
    }
  };

  const validateImage = (validationImage) => {
    let newErrors = { mainImage: "", images: "" };

    if (validationImage === undefined) {
      newErrors.mainImage =
        resort.mainImage?.uri !== undefined
          ? ""
          : t("step4Gallery.errorMainImage");
      setErrors((prev) => ({
        ...prev,
        mainImage: newErrors.mainImage,
      }));
    }

    const verifyImage = validationImage || resort.images;

    if (Array.isArray(verifyImage)) {
      newErrors.images =
        verifyImage && verifyImage.length > 0
          ? ""
          : t("step4Gallery.errorImage");

      setErrors((prev) => ({
        ...prev,
        images: newErrors.images,
      }));
    } else {
      newErrors.mainImage =
        verifyImage?.uri !== undefined ? "" : t("step4Gallery.errorMainImage");
      setErrors((prev) => ({
        ...prev,
        mainImage: newErrors.mainImage,
      }));
    }

    isFirstImage
      ? setLoadingImages((prev) => ({ ...prev, mainImage: false }))
      : setLoadingImages((prev) => ({ ...prev, galleryImages: false }));

    return Object.values(newErrors).every((val) => val === "");
  };

  const removeImage = async (uri) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setResort((prev) => ({
      ...prev,
      images: resort.images.filter((img) => img.uri !== uri),
    }));

    if (resort.mainImage?.uri === uri) {
      await setResort((prev) => ({ ...prev, mainImage: null }));
      validateImage({});
    } else {
      validateImage(resort.images.filter((img) => img.uri !== uri));
    }
  };

  //Function for open camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Camera access denied",
        "You need to allow camera access in settings to take photos.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }
    isFirstImage
      ? setLoadingImages((prev) => ({ ...prev, mainImage: true }))
      : setLoadingImages((prev) => ({ ...prev, galleryImages: true }));

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newImage = result.assets ? result.assets[0] : result;
      const extension = newImage.uri.split(".").pop().toLowerCase();
      if (
        extension === "jpg" ||
        extension === "jpeg" ||
        extension === "png" ||
        extension === "heic"
      ) {
        const compressed = await compressImage(newImage.uri, 0.6, 1080);

        const imageToAdd = {
          ...newImage,
          uri: compressed.uri,
          base64: compressed.base64,
          width: compressed.width,
          height: compressed.height,
        };

        const updatedImages = [...resort.images, imageToAdd];

        if (isFirstImage) {
          await setResort((prev) => ({ ...prev, mainImage: imageToAdd }));
          setIsFirstImage(false);
          validateImage(imageToAdd);
        } else {
          await setResort((prev) => ({ ...prev, images: updatedImages }));
          validateImage(updatedImages);
        }
      } else {
        Alert.alert(
          "Invalid file format",
          `Only JPG,  PNG, HEIC images are allowed. "${newImage.fileName}" was skipped.`,
        );
      }
    } else {
      isFirstImage
        ? setLoadingImages((prev) => ({ ...prev, mainImage: false }))
        : setLoadingImages((prev) => ({ ...prev, galleryImages: false }));
    }
  };

  //Function for open gallery
  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Gallery access denied",
        "You need to allow gallery access in settings to select images.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ],
      );

      return;
    }

    isFirstImage
      ? setLoadingImages((prev) => ({ ...prev, mainImage: true }))
      : setLoadingImages((prev) => ({ ...prev, galleryImages: true }));

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: !isFirstImage,
      base64: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      const selectedImages = result.assets || [result];
      const validImages = [];

      for (let img of selectedImages) {
        const ext = img.uri?.split(".").pop().toLowerCase();

        if (
          ext === "jpg" ||
          ext === "jpeg" ||
          ext === "png" ||
          ext === "heic"
        ) {
          validImages.push(img);
        } else {
          Alert.alert(
            "Invalid file format",
            `Only JPG, PNG and HEIC images are allowed. "${img.fileName}" was skipped.`,
          );
          isFirstImage
            ? setLoadingImages((prev) => ({ ...prev, mainImage: false }))
            : setLoadingImages((prev) => ({ ...prev, galleryImages: false }));
        }
      }

      const compressedImages = [];
      if (validImages.length > 0) {
        for (let img of validImages) {
          const compressed = await compressImage(img.uri);
          compressedImages.push({
            ...img,
            uri: compressed.uri,
            base64: compressed.base64,
            width: compressed.width,
            height: compressed.height,
          });
        }

        const updatedImages = [...resort.images, ...compressedImages];

        if (isFirstImage) {
          await setResort((prev) => ({
            ...prev,
            mainImage: compressedImages[0],
          }));
          setIsFirstImage(false);
          validateImage(compressedImages[0]);
        } else {
          await setResort((prev) => ({
            ...prev,
            images: updatedImages,
          }));
          validateImage(updatedImages);
        }
      }
    } else {
      isFirstImage
        ? setLoadingImages((prev) => ({ ...prev, mainImage: false }))
        : setLoadingImages((prev) => ({ ...prev, galleryImages: false }));
    }
  };

  const submitAddResort = () => {
    if (validateImage()) {
      startLoadingSubmit();
      APIService.post(config.endpoints.legacy.resort.addResort, {
        resort: resort,
      })
        .then((response) => {
          if (response?.data.error) {
            console.log("Something wrong happened " + response.data.error);
          } else {
            Toast.show({
              type: "custom",
              text1: t("step4Gallery.successSubmitNotify"),
              position: "bottom",
              visibilityTime: 1000,
            });

            setTimeout(async () => {
              // await resetResort();
              // navigation.goBack();
            }, 1500);
          }
        })
        .catch((err) => {
          console.log("An error occurred " + err);
        })
        .finally(() => {
          endLoadingSubmit();
        });
    }
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
      <Text
        style={{
          fontSize: 32,
          fontWeight: "600",
          color: theme.colors.textPrimary,
          marginBottom: 8,
          width: "80%",
        }}
      >
        {t("step4Gallery.title")}
      </Text>
      <Pressable
        style={{
          width: "80%",
          height: 180,
          borderWidth: 2,
          borderColor: errors.mainImage
            ? theme.colors.error
            : theme.colors.primary,
          borderRadius: 16,
          justifyContent: "center",
          overflow: "hidden",
          alignSelf: "center",
        }}
        onPress={() => {
          handlePresentPressFeedback();
          setIsFirstImage(true);
        }}
      >
        {loadingImages.mainImage ? (
          <Loading />
        ) : !resort.mainImage?.uri ? (
          <View style={{ alignItems: "center" }}>
            <Icon
              type={"font-awesome"}
              name={"image"}
              size={32}
              color={
                errors.mainImage ? theme.colors.error : theme.colors.primary
              }
            />
            {errors.mainImage ? (
              <Text style={{ color: theme.colors.error }}>
                {errors.mainImage}
              </Text>
            ) : (
              <Text>{t("step4Gallery.choseMainPhoto")}</Text>
            )}
          </View>
        ) : (
          <View>
            <ImageBackground
              source={{ uri: resort.mainImage?.uri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode={"cover"}
            />
            <CustomButton
              onPress={() => {
                removeImage(resort.mainImage?.uri);
              }}
              style={{
                position: "absolute",
                bottom: 8,
                right: 8,
                borderRadius: 12,
              }}
              width={"fit-content"}
              iconCenter={
                <Icon
                  name="delete"
                  size={28}
                  color="red"
                  containerStyle={{ padding: 4 }}
                />
              }
            />
          </View>
        )}
      </Pressable>

      <CustomButton
        title={
          loadingImages.galleryImages ? (
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
            t("step4Gallery.addGalleryImagesButton")
          )
        }
        width={"100%"}
        maxHeight={48}
        backgroundColor={theme.colors.primary}
        paddingVertical={12}
        paddingHorizontal={8}
        flex={1}
        textColor={theme.colors.primaryContrast}
        borderRadius={100}
        iconLeft={
          !loadingImages.galleryImages && (
            <Icon
              type={"material-community"}
              name={"checkbox-marked-circle-auto-outline"}
              size={24}
              color={theme.colors.primaryContrast}
            />
          )
        }
        onPress={() => {
          handlePresentPressFeedback();
          setIsFirstImage(false);
        }}
        style={{ marginVertical: 16 }}
      />
      {errors.images && (
        <Text style={{ color: theme.colors.error, alignSelf: "center" }}>
          {errors.images}
        </Text>
      )}

      <FlatList
        data={resort.images}
        keyExtractor={(item) => item.uri}
        numColumns={2}
        renderItem={({ item }) => (
          <View
            style={{
              width: screenWidth / 2 - 20,
              height: 200,
              borderRadius: 10,
              margin: 2,
            }}
          >
            <Image
              source={{ uri: item.uri }}
              style={{ width: "100%", height: "100%", borderRadius: 10 }}
              resizeMode="cover"
            />
            <CustomButton
              onPress={() => removeImage(item.uri)}
              style={{
                position: "absolute",
                bottom: 4,
                right: 4,
                borderRadius: 12,
              }}
              width={"fit-content"}
              iconCenter={<Icon name="delete" size={24} color="red" />}
            />
          </View>
        )}
        contentContainerStyle={{
          alignSelf: "center",
        }}
        scrollEnabled={false}
      />
      <AddImageModal
        ref={bottomSheetModalRefImages}
        message={t("step4Gallery.choseOptionForUploadPhoto")}
        onCamera={takePhoto}
        onGallery={pickImages}
      />
    </ScrollView>
  );
};
export default Step4Gallery;

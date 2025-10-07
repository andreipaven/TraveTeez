import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Linking,
  Pressable,
  ImageBackground,
  Button,
} from "react-native";
import { useTheme } from "../../Theme/themeContext";
import { useTranslation } from "react-i18next";
import { useResort } from "../Hooks/CustomResortContext";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../Buttons/CustomButton";
import { Icon } from "react-native-elements";
import AddImageModal from "../Modals/AddImageModal";
import Loading from "../Loading/Loading";
import LottieView from "lottie-react-native";

const Step4Gallery = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { resort, setResort } = useResort();
  const [loadingImages, setLoadingImages] = useState({
    mainImage: false,
    galleryImages: false,
  });
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [isFirstImage, setIsFirstImage] = useState(false);

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
    let newErrors = "";
    const verifyImage = validationImage || resort.images;

    newErrors =
      verifyImage && verifyImage.length > 0 ? "" : t("addResort.errorImage");

    newErrors = mainImage === null ? t("addResort.errorImage") : "";

    setErrors((prev) => ({
      ...prev,
      image: newErrors,
    }));

    isFirstImage
      ? setLoadingImages((prev) => ({ ...prev, mainImage: false }))
      : setLoadingImages((prev) => ({ ...prev, galleryImages: false }));

    return newErrors === "";
  };

  const removeImage = (uri) => {
    setResort((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.uri !== uri),
    }));

    if (mainImage?.uri === uri) {
      setMainImage(null);
    }

    validateImage(resort.images.filter((img) => img.uri !== uri));
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
          setMainImage(imageToAdd);
          setIsFirstImage(false);
        } else {
          setResort({ ...resort, images: updatedImages });
        }
        validateImage(updatedImages);
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
          setMainImage(compressedImages[0]);
          setIsFirstImage(false);
        } else {
          setResort({ ...resort, images: updatedImages });
        }
        validateImage(updatedImages);
      }
    } else {
      isFirstImage
        ? setLoadingImages((prev) => ({ ...prev, mainImage: false }))
        : setLoadingImages((prev) => ({ ...prev, galleryImages: false }));
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.backgroundPrimary }}
      edges={["bottom", "left", "right"]}
    >
      <View
        style={{
          flex: 1,
          padding: 16,

          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
          Chose photos
        </Text>

        <Pressable
          style={{
            width: "60%",
            height: 180,
            borderWidth: 2,
            borderColor: theme.colors.primary,
            borderRadius: 16,
            justifyContent: "center",
            overflow: "hidden",
          }}
          onPress={() => {
            setModalVisible(true);
            setIsFirstImage(true);
          }}
        >
          {loadingImages.mainImage ? (
            <Loading />
          ) : !mainImage ? (
            <Icon type={"font-awesome"} name={"image"} size={64} />
          ) : (
            <View>
              <ImageBackground
                source={{ uri: mainImage?.uri }}
                style={{ width: "100%", height: "100%" }}
              />
              <CustomButton
                onPress={() => removeImage(mainImage.uri)}
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
              t("addResort.addGalleryImagesButton")
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
            setModalVisible(true);
            setIsFirstImage(false);
          }}
          style={{ marginTop: 16 }}
        />
      </View>

      <AddImageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message={"Chose the option for upload the image"}
        onCamera={takePhoto}
        onGallery={pickImages}
      />
    </SafeAreaView>
  );
};
export default Step4Gallery;

import React, { useContext, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  Linking,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomTextInput from "../../components/Inputs/CustomTextInput";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../Theme/themeContext";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "../../components/Buttons/CustomButton";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import CustomDropdown from "../../components/Inputs/CustomDropdown";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import { AuthContext } from "../../Secure/AuthProvider";
import { getAccessToken } from "../../Secure/secureHub";
import * as ImageManipulator from "expo-image-manipulator";
import Toast from "react-native-toast-message";
import LottieView from "lottie-react-native";

export default function AddResort() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useContext(AuthContext);

  const [loadingButton, setLoadingButton] = useState(false);

  const [resort, setResort] = useState({
    name: "",
    description: "",
    country: "",
    county: "",
    city: "",
    type: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    type: "",
    country: "",
    county: "",
    city: "",
    image: "",
  });
  const [images, setImages] = useState([]);

  const typeOptions = [
    { label: "Ski", value: "Ski" },
    { label: "Beach", value: "Beach" },
    { label: "Spa", value: "Spa" },
    { label: "Mountain", value: "Mountain" },
    { label: "City", value: "City" },
    { label: "Adventure", value: "Adventure" },
  ];

  const handleChange = (name, value) => {
    setResort((prev) => ({
      ...prev,
      [name]: value,
    }));
    validate({ [name]: value });
  };
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
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newImage = result.assets ? result.assets[0] : result;

      const compressed = await compressImage(newImage.uri, 0.6, 1080);

      const imageToAdd = {
        ...newImage,
        uri: compressed.uri,
        base64: compressed.base64,
        width: compressed.width,
        height: compressed.height,
      };

      const updatedImages = [...images, imageToAdd];
      setImages(updatedImages);

      validateImage(updatedImages);
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

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const selectedImages = result.assets || [result];
      const validImages = [];

      for (let img of selectedImages) {
        const ext = img.fileName?.split(".").pop().toLowerCase();
        if (ext === "jpg" || ext === "jpeg" || ext === "png") {
          validImages.push(img);
        } else {
          Alert.alert(
            "Invalid file format",
            `Only JPG and PNG images are allowed. "${img.fileName}" was skipped.`,
          );
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

        const updatedImages = [...images, ...compressedImages];
        setImages(updatedImages);
        validateImage(updatedImages);
      }
    }
  };

  const validateImage = (validationImage) => {
    let newErrors = "";
    const verifyImage = validationImage || images;

    newErrors =
      verifyImage && verifyImage.length > 0 ? "" : t("addResort.errorImage");

    setErrors((prev) => ({
      ...prev,
      image: newErrors,
    }));
    return newErrors === "";
  };

  const removeImage = (uri) => {
    const updatedImages = images.filter((img) => img.uri !== uri);
    setImages(updatedImages);
    validateImage(updatedImages);
  };
  const renderImage = ({ item }) => (
    <View style={{ position: "relative", marginRight: 8 }}>
      <Image
        source={{ uri: item.uri }}
        style={{ width: 128, height: 128, borderRadius: 8 }}
      />
      <CustomButton
        onPress={() => removeImage(item.uri)}
        style={{
          position: "absolute",
          top: 4,
          right: 4,
          borderRadius: 12,
          padding: 4,
        }}
        width={"fit-content"}
        iconCenter={<Icon name="delete" size={20} color="red" />}
      />
    </View>
  );

  const validate = (fieldValues) => {
    let newErrors = { ...errors };

    const valuesToValidate = fieldValues || resort;

    if (!valuesToValidate || typeof valuesToValidate !== "object") {
      return false;
    }

    if ("name" in valuesToValidate) {
      newErrors.name = valuesToValidate.name?.trim() ? "" : "z";
    }
    if ("type" in valuesToValidate) {
      newErrors.type = valuesToValidate.type !== "" ? "" : "z";
    }
    if ("country" in valuesToValidate) {
      newErrors.country = valuesToValidate.country?.trim() ? "" : "z";
    }
    if ("county" in valuesToValidate) {
      newErrors.county = valuesToValidate.county?.trim() ? "" : "z";
    }
    if ("city" in valuesToValidate) {
      newErrors.city = valuesToValidate.city?.trim() ? "" : "z";
    }

    if (!fieldValues) {
      if (!images || images.length === 0) {
        newErrors.image = t("addResort.errorImage");
      } else {
        newErrors.image = "";
      }
    }

    setErrors(newErrors);

    if (!fieldValues) {
      return Object.values(newErrors).every((x) => x === "");
    }
    return !Object.values(newErrors).some((err) => err !== "");
  };

  const submitCancel = () => {
    setResort({
      name: "",
      description: "",
      country: "",
      county: "",
      city: "",
      type: "",
    });
    setErrors({
      name: "",
      type: "",
      country: "",
      county: "",
      city: "",
      image: "",
    });
    setImages([]);
  };

  const submitResort = async () => {
    if (validate()) {
      const token = await getAccessToken();
      setLoadingButton(true);

      APIService.post(
        config.endpoints.legacy.resort.addResort,
        {
          name: resort.name,
          country: resort.country,
          county: resort.county,
          city: resort.city,
          type: resort.type,
          description: resort.description,
          images: images,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
        .then((response) => {
          if (response.data?.error) {
            console.log("Something wrong happened: " + response.data.error);
          } else {
            Toast.show({
              type: "custom",
              text1: t("addResort.successSubmitNotify"),
              position: "bottom",
            });
            setLoadingButton(false);
          }
        })
        .catch((err) => {
          console.log("An error occurred! " + err);
        })
        .finally(() => {});
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "start",
        alignItems: "center",
        padding: 16,
        paddingTop: 2,
        backgroundColor: theme.colors.backgroundPrimary,
      }}
      edges={["bottom", "left", "right"]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <ScrollView
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          overScrollMode={"never"}
        >
          <CustomTextInput
            label={t("addResort.nameLabel")}
            name={"name"}
            value={resort.name}
            onChangeText={handleChange}
            borderColor={theme.colors.primary}
            focusBorderColor={theme.colors.primary}
            backgroundColor={theme.colors.backgroundPaper}
            color={theme.colors.textPrimary}
            borderRadius={100}
            error={errors.name}
          />

          <CustomTextInput
            label={t("addResort.countryLabel")}
            name={"country"}
            value={resort.country}
            onChangeText={handleChange}
            borderColor={theme.colors.primary}
            focusBorderColor={theme.colors.primary}
            backgroundColor={theme.colors.backgroundPaper}
            color={theme.colors.textPrimary}
            borderRadius={100}
            error={errors.country}
          />
          <CustomTextInput
            label={t("addResort.countyLabel")}
            name={"county"}
            value={resort.county}
            onChangeText={handleChange}
            borderColor={theme.colors.primary}
            focusBorderColor={theme.colors.primary}
            backgroundColor={theme.colors.backgroundPaper}
            color={theme.colors.textPrimary}
            borderRadius={100}
            error={errors.county}
          />
          <CustomTextInput
            label={t("addResort.cityLabel")}
            name={"city"}
            value={resort.city}
            onChangeText={handleChange}
            borderColor={theme.colors.primary}
            focusBorderColor={theme.colors.primary}
            backgroundColor={theme.colors.backgroundPaper}
            color={theme.colors.textPrimary}
            borderRadius={100}
            error={errors.city}
          />
          <CustomDropdown
            name={"type"}
            borderColor={theme.colors.primary}
            backgroundColor={theme.colors.backgroundPaper}
            borderWidth={2}
            borderRadius={100}
            label={t("addResort.typeLabel")}
            options={typeOptions}
            error={errors.type}
            selectedValue={resort.type}
            onValueChange={handleChange}
          />
          {errors &&
            Object.keys(errors)
              .filter((key) => key !== "image")
              .some((key) => errors[key] !== "") && (
              <Text
                style={{
                  color: "red",
                  width: "100%",
                  fontWeight: "bold",
                  textAlign: "center",
                  padding: 4,
                }}
              >
                <Icon name={"alert"} /> {t("addResort.fieldsError")}{" "}
                <Icon name={"alert"} />
              </Text>
            )}
          <CustomTextInput
            label={t("addResort.descriptionLabel")}
            name={"description"}
            value={resort.description}
            onChangeText={handleChange}
            borderColor={theme.colors.primary}
            focusBorderColor={theme.colors.primary}
            backgroundColor={theme.colors.backgroundPaper}
            color={theme.colors.textPrimary}
            borderRadius={8}
            multiLine={true}
            minHeight={64}
            maxLength={250}
          />
          <View
            style={{
              width: "100%",
              borderWidth: 2,
              borderColor: errors.image ? "red" : theme.colors.primary,
              height: "auto",
              borderRadius: 8,
              padding: 8,
            }}
          >
            <View style={{ width: "100%", flexDirection: "row" }}>
              <CustomButton
                width={"fit-content"}
                iconCenter={
                  <Icon
                    size={24}
                    name={"camera-plus-outline"}
                    color={theme.colors.primaryContrast}
                  />
                }
                borderWidth={0}
                paddingVertical={16}
                paddingHorizontal={16}
                backgroundColor={theme.colors.primary}
                onPress={takePhoto}
              />

              <CustomButton
                title={t("addResort.addImageButton")}
                alignItems={"start"}
                paddingVertical={0}
                paddingHorizontal={0}
                width={"fit-content"}
                flexDirection={"column-reverse"}
                iconLeft={
                  <Icon
                    style={{ marginLeft: -4 }}
                    name={"plus"}
                    size={24}
                    color={theme.colors.primary}
                  />
                }
                onPress={pickImages}
                style={{ marginLeft: 16 }}
                textColor={theme.colors.primary}
              />
            </View>

            {images.length > 0 && (
              <FlatList
                data={[...images].reverse()}
                renderItem={renderImage}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 16 }}
              />
            )}
          </View>
          {errors.image && <Text style={{ color: "red" }}>{errors.image}</Text>}
          <View style={{ width: "100%", marginTop: 16, gap: 16 }}>
            <CustomButton
              title={
                loadingButton ? (
                  <LottieView
                    source={require("../../../assets/Trail loading.json")}
                    autoPlay
                    loop
                    style={{ width: 54, height: 54 }}
                    resizeMode={"cover"}
                  />
                ) : (
                  t("addResort.submitButton")
                )
              }
              maxHeight={48}
              backgroundColor={theme.colors.primary}
              paddingVertical={12}
              paddingHorizontal={8}
              textColor={theme.colors.primaryContrast}
              borderRadius={100}
              iconLeft={
                !loadingButton && (
                  <Icon
                    name={"checkbox-marked-circle-auto-outline"}
                    size={24}
                    color={theme.colors.primaryContrast}
                  />
                )
              }
              onPress={submitResort}
            />
            <View style={{ width: "100%", alignItems: "center" }}>
              <CustomButton
                title={t("addResort.cancelButton")}
                backgroundColor={theme.colors.textSecondary}
                paddingVertical={12}
                paddingHorizontal={8}
                textColor={theme.colors.primaryContrast}
                borderRadius={100}
                iconLeft={
                  <Icon
                    name={"cancel"}
                    size={24}
                    color={theme.colors.primaryContrast}
                  />
                }
                onPress={submitCancel}
                width={"50%"}
                style={{ opacity: 0.8, marginBottom: 16 }}
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

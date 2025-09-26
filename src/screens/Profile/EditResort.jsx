import React, { useState, useEffect } from "react";
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
import * as ImageManipulator from "expo-image-manipulator";

import Toast from "react-native-toast-message";
import LottieView from "lottie-react-native";
import Loading from "../../components/Loading/Loading";
import CustomModal from "../../components/Modals/CustomModal";
import { useNavigation } from "@react-navigation/native";
import LoadingButton from "../../components/Loading/LoadingButton";

export default function EditResort({ route }) {
  const { state } = route.params;
  const { resortId } = state;
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const { theme } = useTheme();
  const [loadingButton, setLoadingButton] = useState({
    edit: false,
    delete: false,
    images: false,
  });
  const [fetchLoading, setFetchLoading] = useState(true);
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
  const [deletedImages, setDeletedImages] = useState([]);

  const typeOptions = [
    { label: t("typeResort.ski"), value: "ski" },
    { label: t("typeResort.beach"), value: "beach" },
    { label: t("typeResort.mountain"), value: "mountain" },
    { label: t("typeResort.spa"), value: "spa" },
    { label: t("typeResort.balneary"), value: "balneary" },
    { label: t("typeResort.city"), value: "city" },
    { label: t("typeResort.adventure"), value: "adventure" },
    { label: t("typeResort.cultural"), value: "cultural" },
    { label: t("typeResort.luxury"), value: "luxury" },
    { label: t("typeResort.allInclusive"), value: "allInclusive" },
    { label: t("typeResort.eco"), value: "eco" },
    { label: t("typeResort.safari"), value: "safari" },
    { label: t("typeResort.lake"), value: "lake" },
    { label: t("typeResort.island"), value: "island" },
    { label: t("typeResort.family"), value: "family" },
    { label: t("typeResort.adultsOnly"), value: "adultsOnly" },
    { label: t("typeResort.theme"), value: "theme" },
    { label: t("typeResort.retreat"), value: "retreat" },
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
      setLoadingButton((prev) => ({
        ...prev,
        images: true,
      }));
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
      setLoadingButton((prev) => ({
        ...prev,
        images: true,
      }));
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
    setLoadingButton((prev) => ({
      ...prev,
      images: false,
    }));
    return newErrors === "";
  };

  const removeImage = (uri) => {
    const removedImage = images.find(
      (img) => (img.uri ?? img.image_url) === uri,
    );

    const updatedImages = images.filter(
      (img) => (img.uri ?? img.image_url) !== uri,
    );

    if (removedImage?.image_url) {
      setDeletedImages((prev) => [...prev, removedImage]);
    }

    setImages(updatedImages);
    validateImage(updatedImages);
  };

  const renderImage = ({ item }) => (
    <View style={{ position: "relative", marginRight: 8 }}>
      <Image
        source={{ uri: item.image_url || item.uri }}
        style={{ width: 128, height: 128, borderRadius: 8 }}
      />
      <CustomButton
        onPress={() => removeImage(item.image_url || item.uri)}
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

  const submitReset = () => {
    setFetchLoading(true);
    fetchResorts();
    setErrors({
      name: "",
      type: "",
      country: "",
      county: "",
      city: "",
      image: "",
    });
    setImages([]);
    setDeletedImages([]);
  };

  const updateResort = () => {
    if (validate()) {
      setLoadingButton((prev) => ({
        ...prev,
        edit: true,
      }));
      APIService.post(config.endpoints.legacy.resort.updateResort, {
        body: {
          name: resort.name,
          country: resort.country,
          county: resort.county,
          city: resort.city,
          type: resort.type,
          description: resort.description,
        },
        resortId: resortId,
        images: images,
        deletedImages: deletedImages,
      })
        .then((response) => {
          if (response.data?.error) {
            console.log("Something wrong happened: " + response.data.error);
          } else {
            Toast.show({
              type: "custom",
              text1: t("editResort.successSubmitNotify"),
              position: "bottom",
            });
          }
        })
        .catch((err) => {
          console.log("An error occurred! " + err);
        })
        .finally(() => {
          setLoadingButton((prev) => ({
            ...prev,
            edit: false,
          }));
        });
    }
  };

  const deleteResort = () => {
    setModalVisible(false);
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
          Toast.show({
            type: "custom",
            text1: t("editResort.successDeleteSubmitNotify"),
            position: "bottom",
          });
          navigation.navigate("MainTabs", { screen: "Profile" });
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

  const fetchResorts = () => {
    APIService.post(config.endpoints.legacy.resort.getResortsById, {
      resort_id: resortId,
    })
      .then((response) => {
        if (response.data?.error) {
          console.log("Something wrong happened:" + response.data.error);
        } else {
          const resultResort = response.data.resort;
          setImages(response.data.images);
          setResort({
            name: resultResort.name,
            description: resultResort.description,
            country: resultResort.country,
            county: resultResort.county,
            city: resultResort.city,
            type: resultResort.type,
          });
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
    fetchResorts();
  }, []);

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
      {fetchLoading ? (
        <Loading />
      ) : (
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          style={{ flex: 1 }}
        >
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
                {loadingButton.images && <LoadingButton />}
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
            {errors.image && (
              <Text style={{ color: "red" }}>{errors.image}</Text>
            )}
            <View style={{ width: "100%", marginTop: 16, gap: 16 }}>
              <CustomButton
                title={
                  loadingButton.edit ? (
                    <LottieView
                      source={require("../../../assets/Trail loading.json")}
                      autoPlay
                      loop
                      style={{ width: 54, height: 54 }}
                      resizeMode={"cover"}
                    />
                  ) : (
                    t("editResort.submitButton")
                  )
                }
                maxHeight={48}
                backgroundColor={theme.colors.primary}
                paddingVertical={12}
                paddingHorizontal={8}
                textColor={theme.colors.primaryContrast}
                borderRadius={100}
                iconLeft={
                  !loadingButton.edit && (
                    <Icon
                      name={"checkbox-marked-circle-auto-outline"}
                      size={24}
                      color={theme.colors.primaryContrast}
                    />
                  )
                }
                onPress={updateResort}
              />
              <CustomButton
                title={
                  loadingButton.delete ? (
                    <LottieView
                      source={require("../../../assets/Trail loading.json")}
                      autoPlay
                      loop
                      style={{ width: 54, height: 54 }}
                      resizeMode={"cover"}
                    />
                  ) : (
                    t("editResort.deleteButton")
                  )
                }
                maxHeight={48}
                backgroundColor={theme.colors.primaryDelete}
                paddingVertical={12}
                paddingHorizontal={8}
                textColor={theme.colors.primaryContrast}
                borderRadius={100}
                iconLeft={
                  !loadingButton.delete && (
                    <Icon
                      name={"delete-forever-outline"}
                      size={24}
                      color={theme.colors.primaryContrast}
                    />
                  )
                }
                onPress={() => {
                  setModalVisible(true);
                }}
              />
              <View style={{ width: "100%", alignItems: "center" }}>
                <CustomButton
                  title={t("editResort.resetButton")}
                  backgroundColor={theme.colors.textSecondary}
                  paddingVertical={12}
                  paddingHorizontal={8}
                  textColor={theme.colors.primaryContrast}
                  borderRadius={100}
                  iconLeft={
                    <Icon
                      name={"backup-restore"}
                      size={24}
                      color={theme.colors.primaryContrast}
                    />
                  }
                  onPress={submitReset}
                  width={"50%"}
                  style={{ opacity: 0.8, marginBottom: 16 }}
                />
              </View>
            </View>
            <CustomModal
              visible={modalVisible}
              title="Delete Resort"
              message="Are you sure you want to delete this resort?"
              onConfirm={deleteResort}
              onCancel={() => setModalVisible(false)}
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
}

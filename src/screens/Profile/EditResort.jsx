import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ImageBackground,
  FlatList,
  Image,
  Alert,
  Linking,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../Theme/themeContext";
import CustomTextInput from "../../components/Inputs/CustomTextInput";
import { useTranslation } from "react-i18next";
import CustomDropdown from "../../components/Inputs/CustomDropdown";
import CustomMultiSelect from "../../components/Inputs/CustomMultiSelect";
import Loading from "../../components/Loading/Loading";
import { Icon } from "react-native-elements";
import CustomButton from "../../components/Buttons/CustomButton";
import LottieView from "lottie-react-native";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import AddImageModal from "../../components/Modals/AddImageModal";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import Toast from "react-native-toast-message";
import DeleteResortModalConfirmation from "../../components/Modals/DeleteResortModalConfirmation";

const screenWidth = Dimensions.get("window").width;

const EditResort = () => {
  const route = useRoute();
  const { state } = route.params;
  const { resortId } = state;
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState({
    deleteResort: false,
    addImages: false,
  });
  const [isFirstImage, setIsFirstImage] = useState(false);
  const [loadingImages, setLoadingImages] = useState({
    mainImage: false,
    galleryImages: false,
  });
  const [loadingButton, setLoadingButton] = useState({
    edit: false,
    delete: false,
  });
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deletedImages, setDeletedImages] = useState([]);
  const [resort, setResort] = useState({
    name: "",
    description: "",
    country: "",
    state: "",
    city: "",
    category: "",
    type: [],
    facilities: [],
    images: [],
    mainImage: null,
  });

  const categoryOptions = [
    { label: t("typeCategory.nature"), value: "nature" },
    { label: t("typeCategory.relax"), value: "relax" },
    { label: t("typeCategory.urban"), value: "urban" },
    { label: t("typeCategory.special"), value: "special" },
  ];

  // Type mapping for each category
  const categoryMapping = {
    nature: ["ski", "mountain", "adventure", "eco"],
    relax: ["beach", "spa", "balneary", "lake", "island"],
    urban: ["city", "cultural", "luxury", "allInclusive", "theme", "family"],
    special: ["safari", "retreat"],
  };

  const selectedCategoryOptions = resort?.category
    ? categoryMapping[resort.category].map((typeKey) => ({
        label: t(`typeResort.${typeKey}`),
        value: typeKey,
      }))
    : [];

  //facilities options
  const facilityOptions = [
    { label: t("facilities.beachLakeAccess"), value: 1 },
    { label: t("facilities.outdoorPool"), value: 2 },
    { label: t("facilities.spaWellness"), value: 3 },
    { label: t("facilities.guidedTours"), value: 4 },
    { label: t("facilities.sportsFields"), value: 5 },
    { label: t("facilities.kidsActivities"), value: 6 },
    { label: t("facilities.babysitting"), value: 7 },
    { label: t("facilities.waterSports"), value: 8 },
    { label: t("facilities.hiking"), value: 9 },
    { label: t("facilities.picnicBBQ"), value: 10 },
    { label: t("facilities.wildlifeObservation"), value: 11 },
    { label: t("facilities.relaxZones"), value: 12 },
    { label: t("facilities.themedRestaurants"), value: 13 },
    { label: t("facilities.eventZones"), value: 14 },
    { label: t("facilities.culturalTours"), value: 15 },
    { label: t("facilities.sportSchool"), value: 16 },
    { label: t("facilities.equipmentRental"), value: 17 },
    { label: t("facilities.internalTransport"), value: 18 },
    { label: t("facilities.safariExperience"), value: 19 },
    { label: t("facilities.adventureActivities"), value: 20 },
  ];

  //validations
  const validate = (fieldValues) => {
    let newErrors = { ...errors };

    const valuesToValidate = fieldValues || resort;

    if (!valuesToValidate || typeof valuesToValidate !== "object") {
      return false;
    }

    //info zone
    if ("name" in valuesToValidate) {
      newErrors.name = valuesToValidate.name?.trim() ? "" : "z";
    }

    //type and facilities zone
    if ("category" in valuesToValidate) {
      newErrors.category = valuesToValidate.category?.trim() ? "" : "z";
    }
    if ("type" in valuesToValidate) {
      newErrors.type = valuesToValidate.type.length === 0 ? "z" : "";
    }
    if ("facilities" in valuesToValidate) {
      newErrors.facilities =
        valuesToValidate.facilities.length === 0 ? "z" : "";
    }
    //location zone

    setErrors(newErrors);

    if (!fieldValues) {
      return Object.values(newErrors).every((x) => x === "");
    }
    return !Object.values(newErrors).some((err) => err !== "");
  };

  //step4Gallery
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

      console.log(newErrors.images);
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

  const removeImage = (uri) => {
    const removedImage = resort.images.find(
      (img) => (img.uri ?? img.image_url) === uri,
    );

    if (removedImage?.image_url) {
      setDeletedImages((prev) => [...prev, removedImage]);
    }

    if (resort.mainImage?.uri === uri || resort.mainImage?.image_url === uri) {
      setResort({ ...resort, mainImage: null });
      validateImage({});
    } else {
      setResort((prev) => ({
        ...prev,
        images: prev.images.filter(
          (img) => img.uri !== uri && img.image_url !== uri,
        ),
      }));
      validateImage(
        resort.images.filter((img) => img.uri !== uri && img.image_url !== uri),
      );
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
          setResort({ ...resort, mainImage: imageToAdd });
          setIsFirstImage(false);
          validateImage(imageToAdd);
        } else {
          setResort({ ...resort, images: updatedImages });
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
          setResort({ ...resort, mainImage: compressedImages[0] });
          setIsFirstImage(false);
          validateImage(compressedImages[0]);
        } else {
          setResort({ ...resort, images: updatedImages });
          validateImage(updatedImages);
        }
      }
    } else {
      isFirstImage
        ? setLoadingImages((prev) => ({ ...prev, mainImage: false }))
        : setLoadingImages((prev) => ({ ...prev, galleryImages: false }));
    }
  };

  //change inputs
  const handleChange = (name, value) => {
    setResort((prev) => ({
      ...prev,
      [name]: value,
    }));

    validate({ [name]: value });
  };

  const handleMultiSelectChange = (name, value) => {
    setResort((prev) => ({
      ...prev,
      [name]: value,
    }));

    validate({ [name]: value });
  };

  //update resort
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

  //reset resort
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
    setDeletedImages([]);
  };

  //delete resort
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

  //get resort from db
  const fetchResorts = () => {
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
            county: resultResort.county,
            city: resultResort.city,
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
    fetchResorts();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.backgroundPrimary }}
      edges={["bottom", "left", "right"]}
    >
      {fetchLoading ? (
        <Loading />
      ) : (
        <ScrollView
          contentContainerStyle={{
            padding: 16,
            gap: 32,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/*step1*/}
          <View
            style={[
              styles.card,
              { backgroundColor: theme.colors.backgroundPrimary },
            ]}
          >
            <Text>Info step</Text>
            <CustomTextInput
              label={t("step1Info.nameLabel")}
              name={"name"}
              value={resort.name}
              onChangeText={handleChange}
              borderColor={theme.colors.primary}
              focusBorderColor={theme.colors.primary}
              backgroundColor={theme.colors.backgroundPaper}
              color={theme.colors.textPrimary}
              borderRadius={100}
              error={errors.name}
              borderWidth={1}
            />
            <CustomTextInput
              label={t("step1Info.descriptionLabel")}
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
              borderWidth={1}
            />
          </View>
          {/*step2*/}
          <View
            style={[
              styles.card,
              { backgroundColor: theme.colors.backgroundPrimary },
            ]}
          >
            <Text>Type and facilities step</Text>
            <CustomDropdown
              name={"category"}
              borderColor={theme.colors.primary}
              backgroundColor={theme.colors.backgroundPaper}
              borderWidth={1}
              borderRadius={100}
              label={t("step2Type.categoryLabel")}
              options={categoryOptions}
              error={errors?.category}
              selectedValue={resort?.category}
              onValueChange={handleChange}
            />
            <CustomMultiSelect
              name={"type"}
              label={t("step2Type.typeLabel")}
              options={selectedCategoryOptions}
              borderWidth={1}
              borderRadius={100}
              error={errors?.type}
              borderColor={theme.colors.primary}
              backgroundColor={theme.colors.backgroundPaper}
              onValueChange={(selectedItems) =>
                handleMultiSelectChange("type", selectedItems)
              }
              selectedValue={resort?.type}
            />
            <CustomMultiSelect
              name={"facilities"}
              label={t("step2Type.facilitiesLabel")}
              options={facilityOptions}
              borderWidth={1}
              borderRadius={100}
              error={errors?.facilities}
              borderColor={theme.colors.primary}
              backgroundColor={theme.colors.backgroundPaper}
              onValueChange={(selectedItems) =>
                handleMultiSelectChange("facilities", selectedItems)
              }
              selectedValue={resort?.facilities}
              search={true}
            />
          </View>
          {/*step3*/}
          <View
            style={[
              styles.card,
              { backgroundColor: theme.colors.backgroundPrimary },
            ]}
          >
            <Text>Step3Location</Text>
            <CustomDropdown
              search={true}
              label={"Select country"}
              borderColor={theme.colors.primary}
              backgroundColor={theme.colors.backgroundPaper}
              borderRadius={100}
            />
            <CustomDropdown
              search={true}
              label={"Select state"}
              borderColor={theme.colors.primary}
              backgroundColor={theme.colors.backgroundPaper}
              borderRadius={100}
            />
            <CustomDropdown
              search={true}
              label={"Select city"}
              borderColor={theme.colors.primary}
              backgroundColor={theme.colors.backgroundPaper}
              borderRadius={100}
            />
          </View>

          {/*step4*/}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.backgroundPrimary,
                padding: 0,
                gap: 16,
              },
            ]}
          >
            <View
              style={{
                flex: 1,
                padding: 16,
                width: "100%",
                gap: 16,
              }}
            >
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
                  setModalVisible((prev) => ({ ...prev, addImages: true }));
                  setIsFirstImage(true);
                }}
              >
                {loadingImages.mainImage ? (
                  <Loading />
                ) : !(resort.mainImage?.uri || resort.mainImage?.image_url) ? (
                  <View style={{ alignItems: "center" }}>
                    <Icon
                      type={"font-awesome"}
                      name={"image"}
                      size={24}
                      color={
                        errors.mainImage
                          ? theme.colors.error
                          : theme.colors.primary
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
                      source={{
                        uri:
                          resort.mainImage?.image_url || resort.mainImage?.uri,
                      }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode={"cover"}
                    />
                    <CustomButton
                      onPress={() =>
                        removeImage(
                          resort.mainImage?.uri || resort.mainImage?.image_url,
                        )
                      }
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
                width={"auto"}
                maxHeight={48}
                paddingVertical={12}
                backgroundColor={theme.colors.primary}
                paddingHorizontal={32}
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
                  setModalVisible((prev) => ({ ...prev, addImages: true }));
                  setIsFirstImage(false);
                }}
              />
              {errors.images && (
                <Text
                  style={{ color: theme.colors.error, alignSelf: "center" }}
                >
                  {errors.images}
                </Text>
              )}
            </View>

            <View
              style={{
                flex: 1,
                overflow: "hidden",
                borderRadius: 12,
                width: "100%",
                alignItems: "center",
              }}
            >
              <FlatList
                horizontal
                data={resort.images}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index}
                style={{
                  width: "100%",
                  alignSelf: "center",
                  paddingLeft: resort.images.length === 1 ? "13%" : 0,
                  paddingBottom: 16,
                }}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      width: screenWidth / 1.5,
                      height: 200,
                      borderRadius: 10,
                      marginRight: index === resort.images.length - 1 ? 0 : 8,
                    }}
                    key={index}
                  >
                    <Image
                      source={{ uri: item.image_url || item.uri }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 12,
                      }}
                      resizeMode="cover"
                    />
                    <CustomButton
                      onPress={() => removeImage(item.image_url || item.uri)}
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
              />
            </View>
          </View>
          <View style={{ width: "100%", marginTop: 16, gap: 16 }}>
            <CustomButton
              title={
                loadingButton.edit ? (
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
                  t("editResort.submitButton")
                )
              }
              maxHeight={48}
              backgroundColor={theme.colors.primary}
              paddingVertical={12}
              paddingHorizontal={8}
              textColor={theme.colors.primaryContrast}
              borderRadius={100}
              flex={1}
              iconLeft={
                !loadingButton.edit && (
                  <Icon
                    type={"material-community"}
                    name={"checkbox-marked-circle-auto-outline"}
                    size={24}
                    color={theme.colors.primaryContrast}
                  />
                )
              }
              onPress={updateResort}
            />

            <View
              style={{
                width: "100%",
                gap: 16,
                flexDirection: "row",
                marginBottom: 16,
              }}
            >
              <CustomButton
                title={t("editResort.resetButton")}
                backgroundColor={theme.colors.textSecondary}
                paddingVertical={12}
                paddingHorizontal={8}
                textColor={theme.colors.primaryContrast}
                borderRadius={100}
                flex={1}
                iconLeft={
                  <Icon
                    type={"material-community"}
                    name={"backup-restore"}
                    size={24}
                    color={theme.colors.primaryContrast}
                  />
                }
                onPress={submitReset}
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
                      colorFilters={[
                        {
                          keypath: "*",
                          color: "#ffffff",
                        },
                      ]}
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
                flex={1}
                iconLeft={
                  !loadingButton.delete && (
                    <Icon
                      type={"material-community"}
                      name={"delete-forever-outline"}
                      size={24}
                      color={theme.colors.primaryContrast}
                    />
                  )
                }
                onPress={() => {
                  setModalVisible((prev) => ({ ...prev, deleteResort: true }));
                }}
              />
            </View>
          </View>
        </ScrollView>
      )}

      <AddImageModal
        visible={modalVisible.addImages}
        onClose={() =>
          setModalVisible((prev) => ({ ...prev, addImages: false }))
        }
        message={t("step4Gallery.choseOptionForUploadPhoto")}
        onCamera={takePhoto}
        onGallery={pickImages}
      />
      <DeleteResortModalConfirmation
        visible={modalVisible.deleteResort}
        title="Delete Resort"
        message="Are you sure you want to delete this resort?"
        onConfirm={deleteResort}
        onCancel={() =>
          setModalVisible((prev) => ({ ...prev, deleteResort: false }))
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

    elevation: 16,
    width: "100%",
    height: "auto",
    alignItems: "center",
  },
});

export default EditResort;

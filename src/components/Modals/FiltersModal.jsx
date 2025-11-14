import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useTheme } from "../../Theme/themeContext";
import CustomButton from "../Buttons/CustomButton";
import CustomTextInput from "../Inputs/CustomTextInput";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomMultiSelect from "../Inputs/CustomMultiSelect";
import * as Haptics from "expo-haptics";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const FiltersModal = ({ ref, setParentFilters }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [filters, setFilters] = useState({
    country: "",
    state: "",
    city: "",
    types: [],
  });

  const handleSheetChanges = useCallback(async (index) => {}, []);
  const snapPoints = useMemo(() => ["60%"], []);

  const backDrop = useCallback((props) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
  ));

  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const submitOnClose = () => {
    if (ref?.current) {
      ref.current.close();
    }
  };

  const submitFilters = async () => {
    setParentFilters(filters);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    submitOnClose();
  };

  const resetFilters = () => {
    setFilters({ city: "", country: "", state: "", types: [] });
    setParentFilters({
      city: "",
      country: "",
      state: "",
      types: [],
    });
  };

  const handleMultiSelectChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const typesResort = t("typeResort", { returnObjects: true }) || {};
  const typeResortList = Object.entries(typesResort)
    .slice(0, -4)
    .map(([key, value], index) => ({
      label: value,
      value: index + 1,
    }));
  const handleComponent = () => {
    return (
      <View style={{ padding: 16, paddingTop: 8 }}>
        <View
          style={{
            width: 28,
            height: 3.6,
            backgroundColor: theme.colors.textPrimary,
            borderRadius: 100,
            alignSelf: "center",
            marginBottom: 8,
          }}
        />
        <View style={{ flexDirection: "row", gap: 16 }}>
          <CustomButton
            title={t("filters.resetButton")}
            backgroundColor={theme.colors.textSecondary}
            maxHeight={46}
            minHeight={46}
            paddingVertical={12}
            borderRadius={100}
            paddingHorizontal={8}
            flex={1}
            textColor={theme.colors.primaryContrast}
            onPress={resetFilters}
          />
          <CustomButton
            title={t("filters.submitButton")}
            backgroundColor={theme.colors.primary}
            maxHeight={46}
            minHeight={46}
            paddingVertical={12}
            borderRadius={100}
            paddingHorizontal={8}
            flex={1}
            textColor={theme.colors.primaryContrast}
            onPress={submitFilters}
          />
        </View>
      </View>
    );
  };

  return (
    <BottomSheetModal
      ref={ref}
      onChange={handleSheetChanges}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      backdropComponent={backDrop}
      enablePanDownToClose={true}
      enableContentPanningGesture={true}
      style={{
        shadowColor: theme.colors.shadowPrimary,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.textPrimary,
      }}
      handleComponent={handleComponent}
    >
      <BottomSheetView style={{ flex: 1, height: "100%" }}>
        <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView
              bottomOffset={60}
              style={{ flex: 1 }}
              keyboardShouldPersistTaps={"handled"}
            >
              <View style={styles.contentContainer}>
                <View style={{ width: "100%" }}>
                  <Text
                    style={{
                      fontSize: 24,
                      alignSelf: "flex-start",
                      fontWeight: 500,
                      marginBottom: 8,
                    }}
                  >
                    {t("filters.title")}
                  </Text>
                  <CustomTextInput
                    label={t("filters.countryLabel")}
                    name={"country"}
                    value={filters.country}
                    onChangeText={handleChange}
                    borderColor={theme.colors.primary}
                    focusBorderColor={theme.colors.primary}
                    backgroundColor={theme.colors.backgroundPrimary}
                    textColor={theme.colors.textPrimary}
                    borderRadius={100}
                    borderWidth={1.5}
                  />
                  <CustomTextInput
                    label={t("filters.stateLabel")}
                    name={"state"}
                    value={filters.state}
                    onChangeText={handleChange}
                    borderColor={theme.colors.primary}
                    focusBorderColor={theme.colors.primary}
                    backgroundColor={theme.colors.backgroundPrimary}
                    textColor={theme.colors.textPrimary}
                    borderRadius={100}
                    borderWidth={1.5}
                    setParentIsFocus={(isFocused) =>
                      console.log("focuseed: " + isFocused)
                    }
                  />
                  <CustomTextInput
                    label={t("filters.cityLabel")}
                    name={"city"}
                    value={filters.city}
                    onChangeText={handleChange}
                    borderColor={theme.colors.primary}
                    focusBorderColor={theme.colors.primary}
                    backgroundColor={theme.colors.backgroundPrimary}
                    textColor={theme.colors.textPrimary}
                    borderRadius={100}
                    borderWidth={1.5}
                  />
                  <CustomMultiSelect
                    name={"type"}
                    label={t("step2Type.typeLabel")}
                    options={typeResortList}
                    focusBorderColor={theme.colors.primary}
                    borderWidth={1.5}
                    borderRadius={100}
                    borderColor={theme.colors.primary}
                    backgroundColor={theme.colors.backgroundPrimary}
                    onValueChange={(selectedItems) =>
                      handleMultiSelectChange("types", selectedItems)
                    }
                    selectedValue={filters?.types}
                  />
                </View>
              </View>
            </KeyboardAwareScrollView>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 16,
  },
});

export default FiltersModal;

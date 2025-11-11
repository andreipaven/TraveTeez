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
import { Icon } from "react-native-elements";
import * as Haptics from "expo-haptics";
import CustomTextInput from "../Inputs/CustomTextInput";
import { useTranslation } from "react-i18next";

function FiltersModal({ ref }) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [filters, setFilters] = useState({
    country: "",
    state: "",
    city: "",
    category: "",
    types: "",
  });

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
    setIsOpen(index === 0);
  }, []);
  const snapPoints = useMemo(() => ["70%"], []);

  const backDrop = useCallback((props) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
  ));

  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <BottomSheetModal
      ref={ref}
      onChange={handleSheetChanges}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      backdropComponent={backDrop}
      enablePanDownToClose={true}
      enableContentPanningGesture={false}
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
    >
      <BottomSheetView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.contentContainer}>
            <Text style={{ fontSize: 24, alignSelf: "flex-start" }}>
              {t("filters.title")}
            </Text>
            <CustomTextInput
              label={t("step1Info.nameLabel")}
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
              label={t("step1Info.nameLabel")}
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
              label={t("step1Info.nameLabel")}
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
              label={t("step1Info.nameLabel")}
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
          </View>
        </TouchableWithoutFeedback>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
});

export default FiltersModal;

import React, { useCallback, useMemo } from "react";
import { View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useTheme } from "../../Theme/themeContext";
import { Icon } from "react-native-elements";
import CustomText from "../Widgets/CustomText";
import { useTranslation } from "react-i18next";
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";
import {
  setBottomSheetOpen,
  setBottomSheetsOpen,
} from "../../Redux/Slices/bottomSheetsSlice";
import { useDispatch } from "react-redux";

const ResortDescriptionSheet = ({ description, ref }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const snapPoints = useMemo(() => ["40%", "90%"], []);

  const backDrop = useCallback((props) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
  ));
  const dispatch = useDispatch();
  const animatedIndex = useSharedValue(0);

  const reduxBottomSheetUpdate = (isOpen) => {
    dispatch(setBottomSheetOpen({ sheet: "description", isOpen }));
  };

  useAnimatedReaction(
    () => animatedIndex.value,
    (index) => {
      if (index < -0.7) {
        runOnJS(reduxBottomSheetUpdate)(false);
      } else {
        runOnJS(reduxBottomSheetUpdate)(true);
      }
    },
  );

  const handleComponent = () => (
    <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
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
      <View
        style={{ flexDirection: "row", alignItems: "center", paddingBottom: 8 }}
      >
        <CustomText
          style={{
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          {t("resortScreen.descriptionTitle")}
        </CustomText>
        <Icon
          name={"information-outline"}
          type={"material-community"}
          size={20}
        />
      </View>
    </View>
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: theme.colors.backgroundPrimary }}
      handleComponent={handleComponent}
      enableContentPanningGesture={true}
      enablePanDownToClose={true}
      enableDynamicSizing={false}
      animatedIndex={animatedIndex}
      backgroundComponent={({ style }) => (
        <View
          style={[
            style,
            {
              backgroundColor: theme.colors.backgroundPrimary,
              borderRadius: 24,
            },
          ]}
        />
      )}
      backdropComponent={backDrop}
    >
      <BottomSheetScrollView
        style={{
          backgroundColor: theme.colors.backgroundPrimary,
          padding: 16,
          paddingTop: 0,
        }}
      >
        <CustomText>{description}</CustomText>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default ResortDescriptionSheet;

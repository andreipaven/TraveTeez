import React, { useCallback, useMemo, useState } from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { Icon } from "react-native-elements";
import { useTheme } from "../../Theme/themeContext";
import CustomButton from "../Buttons/CustomButton";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

const AddImageModal = ({ ref, message, onCamera, onGallery }) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
    setIsOpen(index === 0);
  }, []);
  const snapPoints = useMemo(() => ["100%"], []);

  const backDrop = useCallback((props) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
  ));

  const submitOnClose = () => {
    if (ref?.current) {
      ref.current.close();
    }
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
      backgroundStyle={{ backgroundColor: "transparent" }}
      handleIndicatorStyle={{ display: "none" }}
    >
      <TouchableWithoutFeedback onPress={submitOnClose}>
        <BottomSheetView
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.backgroundPrimary,
              padding: 20,
              borderRadius: 8,
              width: "80%",
              shadowColor: theme.colors.shadowPrimary,
              shadowOpacity: 0.35,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 6,
              elevation: 10,
              alignItems: "center",
              alignSelf: "center",
              gap: 16,
              marginTop: 64,
            }}
          >
            <Text style={{ color: theme.colors.textPrimary }}>{message}</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <CustomButton
                iconLeft={
                  <Icon
                    type={"material-community"}
                    name={"image-multiple-outline"}
                    size={24}
                    color={theme.colors.textPrimary}
                  />
                }
                title={"Gallery"}
                textColor={theme.colors.textPrimary}
                flexDirection={"column"}
                onPress={() => {
                  onGallery();
                  submitOnClose();
                }}
              />
              <CustomButton
                iconLeft={
                  <Icon
                    type={"material-community"}
                    name={"camera-outline"}
                    size={24}
                    color={theme.colors.textPrimary}
                  />
                }
                title={"Camera"}
                flexDirection={"column"}
                textColor={theme.colors.textPrimary}
                onPress={() => {
                  onCamera();
                  submitOnClose();
                }}
              />
            </View>
          </View>
        </BottomSheetView>
      </TouchableWithoutFeedback>
    </BottomSheetModal>
  );
};

export default AddImageModal;

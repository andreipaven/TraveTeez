import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Button, SafeAreaViewBase } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useTheme } from "../../Theme/themeContext";

const FeedbackModal = ({ ref }) => {
  const { theme } = useTheme();
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);
  const snapPoints = useMemo(() => ["40%", "70%"], []);

  const backDrop = useCallback((props) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
  ));

  return (
    <BottomSheetModal
      ref={ref}
      onChange={handleSheetChanges}
      snapPoints={snapPoints}
      index={2}
      backdropComponent={backDrop}
      enablePanDownToClose={true}
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
      <BottomSheetView style={styles.contentContainer}>
        <Text>Awesome 🎉</Text>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "rgba(253,2,2,0)",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});

export default FeedbackModal;

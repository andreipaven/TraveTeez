import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useTheme } from "../../Theme/themeContext";
import { useTranslation } from "react-i18next";
import APIService from "../../services/APIService";
import { config } from "../../services/config";

const MapResortModal = ({ resortId, ref }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [resort, setResort] = useState(null);

  const handleSheetChanges = useCallback(async (index) => {}, []);
  const snapPoints = useMemo(() => ["60%"], []);

  const backDrop = useCallback((props) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
  ));

  useEffect(() => {
    if (resortId) {
      APIService.post(config.endpoints.legacy.resort.getResortById, {
        resort_id: resortId,
      })
        .then((response) => {
          if (!response?.data.error) {
            console.log(response.data);
            setResort(response.data);
          }
        })
        .catch((err) => {
          console.log("An error occurred " + err);
        })
        .finally(() => {});
    }
  }, [resortId]);
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
      <BottomSheetView
        style={{
          flex: 1,
          height: "100%",
          backgroundColor: theme.colors.backgroundPrimary,
        }}
      >
        <View style={{ flex: 1, padding: 16 }}>
          <Text>{resort?.name}</Text>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default MapResortModal;

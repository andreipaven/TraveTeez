import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Dimensions, Pressable, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import { useTheme } from "../../Theme/themeContext";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import ResortProfileCarousel from "../Carousels/ResortProfileCarousel";

import {
  PanGestureHandler,
  TapGestureHandler,
} from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

const MapResortSheet = ({ resortId, ref }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [resort, setResort] = useState(null);
  const tapRef = useRef(null);
  const panRef = useRef(null);
  // Snap points
  const snapPoints = useMemo(() => ["30%"], []);

  // Fetch resort details
  useEffect(() => {
    if (resortId) {
      APIService.post(config.endpoints.legacy.resort.getResortById, {
        resort_id: resortId,
      })
        .then((response) => {
          if (!response?.data.error) {
            setResort(response.data);
          }
        })
        .catch((err) => console.log("An error occurred " + err));
    }
  }, [resortId]);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: theme.colors.backgroundPrimary }}
      detached={true}
      bottomInset={120}
      enablePanDownToClose={true}
      handleComponent={() => null}
      enableContentPanningGesture={false}
      style={[
        styles.sheetContainer,
        { shadowColor: theme.colors.shadowPrimary },
      ]}
    >
      <BottomSheetView style={{ paddingBottom: 16 }}>
        <PanGestureHandler
          ref={panRef}
          simultaneousHandlers={tapRef}
          onGestureEvent={({ nativeEvent }) => {
            if (nativeEvent.translationY > 20) {
              ref.current?.close();
            } else if (
              nativeEvent.translationY < -50 &&
              nativeEvent.translationX < 10 &&
              nativeEvent.translationX > -10
            ) {
              navigation.navigate("ResortProfile", {
                state: { resortId: resort?.resort_id },
              });
            }
          }}
        >
          <TapGestureHandler
            ref={tapRef}
            simultaneousHandlers={panRef}
            onHandlerStateChange={({ nativeEvent }) => {
              if (nativeEvent.state === 5) {
                navigation.navigate("ResortProfile", {
                  state: { resortId: resort?.resort_id },
                });
              }
            }}
            maxDeltaX={3}
            maxDeltaY={3}
            maxDist={6}
          >
            <View style={{ flex: 1, gap: 12 }}>
              <View
                style={{
                  borderTopRightRadius: 16,
                  borderTopLeftRadius: 16,
                  overflow: "hidden",
                }}
              >
                <ResortProfileCarousel
                  resortId={resort?.resort_id}
                  images={resort?.images || []}
                  width={width - 32}
                  height={height / 4}
                />
              </View>

              <View style={{ paddingHorizontal: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: 600 }}>
                  {resort?.name}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                    name="map-marker"
                    type="material-community"
                    size={16}
                    color={theme.colors.textSecondary}
                    style={{ marginLeft: -2 }}
                  />
                  <Text style={{ color: theme.colors.textSecondary }}>
                    {resort?.city}, {resort?.state}, {resort?.country}
                  </Text>
                </View>
              </View>
              <View style={{ paddingHorizontal: 16 }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    color: theme.colors.textPrimary,
                    paddingBottom: 4,
                  }}
                >
                  {t("resortScreen.about")}
                </Text>
                {resort?.description ? (
                  <Text
                    style={{
                      marginTop: -4,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {resort?.description}
                  </Text>
                ) : (
                  <Text
                    style={{
                      marginTop: -4,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {t("resortScreen.noDescription")}
                  </Text>
                )}
              </View>
            </View>
          </TapGestureHandler>
        </PanGestureHandler>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default MapResortSheet;

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  Dimensions,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  useBottomSheetTimingConfigs,
} from "@gorhom/bottom-sheet";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import { useTheme } from "../../Theme/themeContext";
import { useTranslation } from "react-i18next";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import ResortProfileCarousel from "../Carousels/ResortProfileCarousel";

import {
  PanGestureHandler,
  TapGestureHandler,
} from "react-native-gesture-handler";
import CustomButton from "../Buttons/CustomButton";
import * as Haptics from "expo-haptics";
import Favorite from "../Favorite/Favorite";
import { Easing } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import RatingAllStars from "../Ratings/RatingAllStars";

const { width, height } = Dimensions.get("window");

const MapResortSheet = ({ resortId, ref }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [resort, setResort] = useState(null);
  const tapRef = useRef(null);
  const panRef = useRef(null);
  const [carouselIndex, setCarouselIndex] = useState(1);

  const [opacity] = useState(new Animated.Value(0));
  const closeBottomSheet = useRef(false);
  // Snap points
  const snapPoints = useMemo(() => ["30%"], []);

  const backDrop = useCallback((props) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      style={{ backgroundColor: "transparent" }}
    />
  ));

  const onClose = () => {
    if (!closeBottomSheet.current) {
      closeBottomSheet.current = true;
      navigation.setParams({ bottomSheetOpen: false });
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        ref.current?.close();
        closeBottomSheet.current = false;
      }, 300);
    }
  };

  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 200,
    easing: Easing.in,
  });

  const handleSheetChange = (index) => {
    if (index >= 0) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

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
      bottomInset={40}
      handleComponent={() => null}
      enableContentPanningGesture={false}
      style={[
        styles.sheetContainer,
        { shadowColor: theme.colors.shadowPrimary },
      ]}
      animationConfigs={animationConfigs}
      onChange={handleSheetChange}
      backgroundComponent={({ style }) => (
        <View style={[style, { backgroundColor: "transparent" }]} />
      )}
      backdropComponent={backDrop}
    >
      <BottomSheetView style={{ backgroundColor: "transparent" }}>
        <Animated.View
          style={{
            opacity,
            backgroundColor: theme.colors.backgroundPrimary,
            borderRadius: 24,
          }}
        >
          <BlurView
            intensity={50}
            style={{
              backgroundColor: theme.colors.backgroundPrimary + "88",
              position: "absolute",
              left: 8,
              top: 8,
              zIndex: 3,
              borderRadius: 100,
              overflow: "hidden",
            }}
          >
            <CustomButton
              iconCenter={
                <Icon
                  name={"window-close"}
                  type={"material-community"}
                  size={20}
                  color={theme.colors.textPrimary}
                  style={{ alignSelf: "center" }}
                />
              }
              backgroundColor={"transparent"}
              width={32}
              height={32}
              borderRadius={100}
              activeOpacity={0.5}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                onClose();
              }}
            />
          </BlurView>
          <BlurView
            intensity={50}
            style={{
              backgroundColor: theme.colors.backgroundPrimary + "88",
              zIndex: 3,
              height: 32,
              width: 32,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 100,
              overflow: "hidden",
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <Favorite
              resortId={resortId}
              secondTop={6}
              secondRight={6}
              backgroundColor={"transparent"}
              padding={6}
              size={20}
            />
          </BlurView>
          <PanGestureHandler
            ref={panRef}
            simultaneousHandlers={tapRef}
            onGestureEvent={({ nativeEvent }) => {
              if (nativeEvent.translationY > 20) {
                onClose();
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
              <View style={{ flex: 1, gap: 8 }}>
                <View
                  style={{
                    borderTopRightRadius: 24,
                    borderTopLeftRadius: 24,
                    overflow: "hidden",
                  }}
                >
                  <ResortProfileCarousel
                    resortId={resort?.resort_id}
                    images={resort?.images || []}
                    width={width - 32}
                    height={height / 4}
                    setCarouselIndex={setCarouselIndex}
                    autoPlay={false}
                  />
                </View>
                <View style={{ paddingHorizontal: 16 }}>
                  <RatingAllStars
                    position={"absolute"}
                    left={8}
                    top={-38}
                    resortId={resortId}
                    size={22}
                  />
                  <BlurView
                    style={{
                      position: "absolute",
                      top: -40,
                      right: 8,
                      alignSelf: "flex-end",
                      backgroundColor:
                        theme.mode === "light"
                          ? theme.colors.backgroundPrimary + "88"
                          : theme.colors.backgroundPrimary,
                      padding: 4,
                      borderRadius: 100,
                      width: 50,
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                    intensity={theme.mode === "light" ? 50 : 10}
                  >
                    <Text
                      style={{
                        fontWeight: "500",
                        color: theme.colors.textPrimary,
                      }}
                    >
                      {carouselIndex + 1}/{resort?.images.length}
                    </Text>
                  </BlurView>
                  <Text style={{ fontSize: 16, fontWeight: "600" }}>
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
              </View>
            </TapGestureHandler>
          </PanGestureHandler>
        </Animated.View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    marginHorizontal: 16,

    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
});

export default MapResortSheet;

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Text, StyleSheet } from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useTheme } from "../../Theme/themeContext";
import { useTranslation } from "react-i18next";
import { Rating } from "react-native-ratings";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import CustomButton from "../Buttons/CustomButton";

import Toast from "react-native-toast-message";
import LottieView from "lottie-react-native";
import StarRating from "react-native-star-rating-widget";
import { useNavigation } from "@react-navigation/native";

const FeedbackModal = ({ ref, resortId }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [ratingValue, setRatingValue] = useState(3);
  const [isOpen, setIsOpen] = useState(false);
  const [screenLoadin, setScreenLoading] = useState({
    fetchFeedbacks: false,
    submitAddFeedback: false,
  });

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
    setIsOpen(index === 0);
  }, []);
  const snapPoints = useMemo(() => ["40%"], []);

  const backDrop = useCallback((props) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
  ));

  const ratingCompleted = (rating) => {
    if (rating < 1) {
      setRatingValue(1);
    } else {
      setRatingValue(rating);
    }
  };

  const submitCancel = () => {
    if (ref?.current) {
      ref.current.close();
    }
  };

  const submitAddFeedback = () => {
    setScreenLoading((prev) => ({ ...prev, submitAddFeedback: true }));
    console.log(ratingValue);
    APIService.post(config.endpoints.legacy.feedback.addFeedback, {
      resortId,
      ratingValue,
    })
      .then((response) => {
        if (response?.data.error) {
          console.log("Something wrong happened " + response.data.error);
        } else {
          Toast.show({
            type: "custom",
            text1: t("feedback.notifySuccess"),
            position: "bottom",
          });
        }
      })
      .catch((err) => {
        navigation.navigate("SignIn");
        console.log("An error occurred " + err);
      })
      .finally(() => {
        setScreenLoading((prev) => ({ ...prev, submitAddFeedback: false }));
      });
  };

  useEffect(() => {
    const fetchFeedbacks = () => {
      APIService.post(config.endpoints.legacy.feedback.verifyFeedbackByUser, {
        resortId,
      })
        .then((response) => {
          if (response?.data.error) {
            console.log("Something wrong happened " + response.data.error);
          } else if (response.data !== false) {
            setRatingValue(response.data.data.rating_value);
          } else {
            setRatingValue(3);
          }
        })
        .catch((err) => {
          console.log("An error occurred " + err);
        })
        .finally(() => {});
    };
    fetchFeedbacks();
  }, [isOpen]);

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
      <BottomSheetView style={styles.contentContainer}>
        <Text style={{ fontWeight: "bold", fontSize: 20, paddingVertical: 16 }}>
          {t("feedback.title")}
        </Text>

        <StarRating
          rating={ratingValue}
          onChange={ratingCompleted}
          enableHalfStar={false}
          starSize={42}
          maxStars={5}
        />
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 16,
            paddingTop: 24,
            width: "100%",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <CustomButton
            title={t("feedback.cancelButton")}
            backgroundColor={theme.colors.textSecondary}
            paddingVertical={12}
            textColor={theme.colors.primaryContrast}
            flex={1}
            maxHeight={45}
            onPress={submitCancel}
            borderRadius={100}
          />
          <CustomButton
            title={
              screenLoadin.submitAddFeedback ? (
                <LottieView
                  source={require("../../../assets/Trail loading.json")}
                  autoPlay
                  loop
                  style={{ width: 54, height: 54 }}
                  resizeMode={"cover"}
                />
              ) : (
                t("feedback.saveButton")
              )
            }
            backgroundColor={theme.colors.primary}
            paddingVertical={12}
            textColor={theme.colors.primaryContrast}
            flex={1}
            maxHeight={45}
            onPress={submitAddFeedback}
            borderRadius={100}
          />
        </View>
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

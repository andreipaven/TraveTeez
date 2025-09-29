import React, { useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import ResortProfileCarousel from "../../components/Carousels/ResortProfileCarousel";
import { SafeAreaView } from "react-native-safe-area-context";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import { useTheme } from "../../Theme/themeContext";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import Loading from "../../components/Loading/Loading";
import FeedbackModal from "../../components/Modals/FeedbackModal";
import CustomButton from "../../components/Buttons/CustomButton";

const ResortScreen = ({ route }) => {
  const { state } = route.params;
  const { resortId, isFavorite } = state;
  const { theme } = useTheme();
  const [fetchLoading, setFetchLoading] = useState({ resort: false });
  const [images, setImages] = useState([]);
  const [resortDetails, setResortDetails] = useState(null);

  //modals
  const bottomSheetModalRefFeedback = useRef(null);

  //modal functions
  const handlePresentPressFeedback = () =>
    bottomSheetModalRefFeedback.current.present();

  useEffect(() => {
    const fetchResort = () => {
      setFetchLoading((prev) => ({
        ...prev,
        resort: true,
      }));
      APIService.post(config.endpoints.legacy.resort.getResortsById, {
        resort_id: resortId,
      })
        .then((response) => {
          if (response?.data.error) {
            console.log("Something wrong happened " + response.data.error);
          } else {
            setImages(response.data.images);
            setResortDetails(response.data.resort);
          }
        })
        .catch((err) => {
          console.log("An error occurred " + err);
        })
        .finally(() => {
          setFetchLoading((prev) => ({
            ...prev,
            resort: false,
          }));
        });
    };
    fetchResort();
  }, []);

  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: "100%",
        flexDirection: "column",
        backgroundColor: theme.colors.backgroundPrimary,
      }}
    >
      {fetchLoading.resort ? (
        <Loading />
      ) : (
        <View style={{ flex: 1 }}>
          <ResortProfileCarousel
            resortId={resortId}
            isFavorite={isFavorite}
            images={images}
          />
          <View
            style={{
              paddingHorizontal: 16,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                  color: theme.colors.textPrimary,
                  paddingBottom: 4,
                }}
              >
                {resortDetails?.name}
              </Text>
              <View>
                <Text style={{ color: theme.colors.textPrimary }}>
                  <Icon name={"map-marker"} size={16} />
                  {resortDetails?.city}, {resortDetails?.country}
                </Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <CustomButton
                title={"Feedback"}
                borderWidth={1}
                width={"fit-content"}
                paddingHorizontal={16}
                paddingVertical={8}
                backgroundColor={theme.colors.primary}
                textColor={theme.colors.primaryContrast}
                borderColor={"transparent"}
                borderRadius={100}
                onPress={() => handlePresentPressFeedback()}
              />
            </View>
          </View>

          <FeedbackModal
            ref={bottomSheetModalRefFeedback}
            resortId={resortId}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ResortScreen;

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import ResortProfileCarousel from "../../components/Carousels/ResortProfileCarousel";
import { SafeAreaView } from "react-native-safe-area-context";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import { useTheme } from "../../Theme/themeContext";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

const ResortScreen = ({ route }) => {
  const { state } = route.params;
  const { resortId, isFavoriteX } = state;
  const { theme } = useTheme();
  const [fetchLoading, setFetchLoading] = useState({ resort: false });
  const [images, setImages] = useState([]);
  const [resortDetails, setResortDetails] = useState(null);
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
      <ResortProfileCarousel
        resortId={resortId}
        isFavoriteX={isFavoriteX}
        fetchLoadingImages={fetchLoading.resort}
        images={images}
      />
      <View
        style={{
          width: "100%",
          paddingHorizontal: 16,
        }}
      >
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
    </SafeAreaView>
  );
};

export default ResortScreen;

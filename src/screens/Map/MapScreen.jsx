import React, { useEffect, useState, useRef, useMemo } from "react";
import { View, Text, Linking, Alert, Platform } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewCluster from "react-native-map-clustering";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import { useTheme } from "../../Theme/themeContext";
import * as Location from "expo-location";

import MapFetchLoading from "../../components/Loading/MapFetchLoading";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import MapResortSheet from "../../components/Sheets/MapResortSheet";

const MapScreen = () => {
  const navigation = useNavigation();
  const [markers, setMarkers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const { theme } = useTheme();
  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);
  const [fetchLoading, setFetchLoading] = useState(false);

  const debounceRef = useRef(null);
  const [resortIdSelected, setResortIdSelected] = useState(null);

  const [sheetIndex, setSheetIndex] = useState(-1);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Location Permission",
          "Please enable location in Settings to use this feature",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ],
        );
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setUserLocation(loc);
    }

    getCurrentLocation();
  }, []);

  const ResortMarker = ({ item }) => {
    const icons = {
      nature: "ski",
      relax: "surfing",
      urban: "city",
      special: "creation",
    };

    const icon = icons[item.category] || "";

    const displayName =
      item.name.length > 8 ? item.name.slice(0, 8) + "…" : item.name;

    return (
      <View
        style={{
          backgroundColor: theme.colors.primary,
          paddingVertical: 6,
          paddingHorizontal: 10,
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Icon
          type={"material-community"}
          name={icon}
          color={theme.colors.primaryContrast}
          size={16}
        />
        <Text style={{ color: "white", fontWeight: "600", fontSize: 12 }}>
          {displayName}
        </Text>
      </View>
    );
  };

  const fetchMarkers = async (region) => {
    const minLat = region.latitude - region.latitudeDelta / 2;
    const maxLat = region.latitude + region.latitudeDelta / 2;
    const minLng = region.longitude - region.longitudeDelta / 2;
    const maxLng = region.longitude + region.longitudeDelta / 2;

    setFetchLoading(true);
    APIService.post(config.endpoints.legacy.resort.getMapResorts, {
      minLat,
      maxLat,
      minLng,
      maxLng,
    })
      .then((response) => {
        if (!response.data.error) {
          setMarkers(response.data);
        }
      })
      .catch((err) => {
        console.log("An error occurred " + err);
      })
      .finally(() => {
        setFetchLoading(false);
      });
  };

  const handleRegionChange = (region) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchMarkers(region);
    }, 400);
  };
  const openMapResortModal = (markerId) => {
    setResortIdSelected(markerId);
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });
    bottomSheetRef.current?.expand();
  };

  //animate to user location
  useEffect(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000,
      );

      fetchMarkers({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });
    }
  }, [userLocation]);

  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);

  return (
    <View style={{ flex: 1 }}>
      <MapViewCluster
        ref={mapRef}
        style={{ flex: 1 }}
        region={{
          latitude: userLocation ? userLocation.coords.latitude : 0.0,
          longitude: userLocation ? userLocation.coords.longitude : 0.0,
          latitudeDelta: userLocation ? 0.05 : 5,
          longitudeDelta: userLocation ? 0.05 : 5,
        }}
        showsUserLocation={!!userLocation}
        rotateEnabled={false}
        zoomControlEnabled={false}
        showsMyLocationButton={false}
        animationEnabled={false}
        tracksViewChanges={true}
        clusterColor={theme.colors.primary}
        tintColor={theme.colors.primary}
        clusterTextColor={theme.colors.primaryContrast}
        onRegionChangeComplete={handleRegionChange}
      >
        {markers.map((marker, index) => (
          <Marker
            stopPropagation
            zIndex={1000 + index}
            key={marker.resort_id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => openMapResortModal(marker.resort_id)}
          >
            {Platform.OS === "ios" && <ResortMarker item={marker} />}
          </Marker>
        ))}
      </MapViewCluster>
      <MapResortSheet resortId={resortIdSelected} ref={bottomSheetRef} />
      {/*<MapResortModal resortId={resortIdSelected} ref={bottomSheetRef} />*/}
      {fetchLoading && <MapFetchLoading top={60} />}
    </View>
  );
};

export default MapScreen;

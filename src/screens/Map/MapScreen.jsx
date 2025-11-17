import React, { useEffect, useState, useRef } from "react";
import { View, Text, Linking, Alert } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewCluster from "react-native-map-clustering";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import { useTheme } from "../../Theme/themeContext";
import * as Location from "expo-location";
import MapResortModal from "../../components/Modals/MapResortModal";
import Loading from "../../components/Loading/Loading";
import MapFetchLoading from "../../components/Loading/MapFetchLoading";
import { Icon } from "react-native-elements";

const MapScreen = () => {
  const [markers, setMarkers] = useState([]);
  const [location, setLocation] = useState(null);
  const { theme } = useTheme();

  const mapRef = useRef(null);
  const [fetchLoading, setFetchLoading] = useState(false);

  const debounceRef = useRef(null);
  const [resortIdSelected, setResortIdSelected] = useState(null);

  const bottomSheetModalRefResort = useRef(null);

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
      setLocation(loc);
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
    bottomSheetModalRefResort.current.present();
  };

  //animate to user location
  useEffect(() => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000,
      );

      fetchMarkers({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });
    }
  }, [location]);

  return (
    <>
      <MapViewCluster
        ref={mapRef}
        style={{ flex: 1 }}
        region={{
          latitude: location ? location.coords.latitude : 0.0,
          longitude: location ? location.coords.longitude : 0.0,
          latitudeDelta: location ? 0.05 : 5,
          longitudeDelta: location ? 0.05 : 5,
        }}
        showsUserLocation={!!location}
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
            <ResortMarker item={marker} />
          </Marker>
        ))}
      </MapViewCluster>
      <MapResortModal
        ref={bottomSheetModalRefResort}
        resortId={resortIdSelected}
      />
      {fetchLoading && <MapFetchLoading top={60} />}
    </>
  );
};

export default MapScreen;

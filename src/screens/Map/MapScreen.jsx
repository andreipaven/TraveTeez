import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";

const MapScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 44.43,
          longitude: 26.1,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        customMapStyle={[
          {
            featureType: "poi",
            elementType: "all",
            stylers: [{ visibility: "off" }],
          },
        ]}
      />
    </View>
  );
};

export default MapScreen;

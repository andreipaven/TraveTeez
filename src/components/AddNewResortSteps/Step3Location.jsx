import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../Theme/themeContext";
import CustomButton from "../Buttons/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import CustomDropdown from "../Inputs/CustomDropdown";
import { API_KEY_LOCATION } from "@env";
import { useResort } from "../Hooks/CustomResortContext";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Icon } from "react-native-elements";
import Toast from "react-native-toast-message";

const Step3Location = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { resort, setResort } = useResort();
  const mapRef = useRef();

  const [location, setLocation] = useState({
    countries: [],
    states: [],
    cities: [],
  });
  const [pinLocation, setPinLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const nextStep = () => {
    navigation.navigate("Step4");
  };

  //change inputs
  const handleChange = (name, value, label) => {
    if (name === "country") {
      getStatesByCountry(value);
      setLocation((prev) => ({ ...prev, cities: [] }));
      geocode("", "", label);
    } else if (name === "state") {
      getCitiesByState(resort.countryValue, value);
      geocode("", label, resort.country);
    } else if (name === "city") {
      geocode(label, resort.state, resort.country);
    }

    setResort((prev) => ({
      ...prev,
      [name]: label,
      [`${name}Value`]: value,
    }));
  };

  //map methods and things
  const getPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Please grant location");
      return false;
    } else {
      return true;
    }
  };

  const focusMap = (lat, long, zoom) => {
    const initialLocation = {
      latitude: lat,
      longitude: long,
      latitudeDelta: zoom,
      longitudeDelta: zoom,
    };

    mapRef.current?.animateToRegion(initialLocation, 1500);
  };

  const onChangeRegion = (region) => {
    setPinLocation({
      latitude: region.latitude,
      longitude: region.longitude,
    });
  };

  const geocode = async (currentCity, currentState, currentCountry) => {
    if (await getPermissions()) {
      let zoom = 0;
      if (currentCountry && !currentCity && !currentState) {
        zoom = 8;
      } else if (currentCountry && currentState && !currentCity) {
        zoom = 1;
      } else {
        zoom = 0.1;
      }

      const address = `${currentCity} ${currentState} ${currentCountry}`;

      const geocodeLocation = await Location.geocodeAsync(address);

      focusMap(geocodeLocation[0].latitude, geocodeLocation[0].longitude, zoom);
    }
  };

  //get cities by states
  const getCitiesByState = async (countryCode, stateCode) => {
    const response = await fetch(
      `https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}/cities`,
      {
        headers: { "X-CSCAPI-KEY": API_KEY_LOCATION },
      },
    );

    if (response.ok) {
      const cities = await response.json();
      let citiesList = [];

      for (let i = 0; i < cities.length; i++) {
        citiesList.push({
          label: cities[i].name,
          value: cities[i].id,
        });
      }
      citiesList.sort((a, b) => a.label.localeCompare(b.label));
      setLocation((prev) => ({ ...prev, cities: citiesList }));
    } else {
      console.error("State not found or no cities available");
      return [];
    }
  };

  //get states by country
  const getStatesByCountry = async (countryCode) => {
    const response = await fetch(
      `https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
      {
        headers: { "X-CSCAPI-KEY": API_KEY_LOCATION },
      },
    );

    if (response.ok) {
      const states = await response.json();
      let statesList = [];

      for (let i = 0; i < states.length; i++) {
        statesList.push({
          label: states[i].name,
          value: states[i].iso2,
        });
      }
      statesList.sort((a, b) => a.label.localeCompare(b.label));
      setLocation((prev) => ({ ...prev, states: statesList }));
    } else {
      console.error("Country not found or no states available");
    }
  };

  // get all countries
  useEffect(() => {
    const getCountries = async () => {
      const response = await fetch(
        "https://api.countrystatecity.in/v1/countries",
        {
          headers: {
            "X-CSCAPI-KEY": API_KEY_LOCATION,
          },
        },
      );

      const countries = await response.json();
      let countriesList = [];

      for (let i = 0; i < countries.length; i++) {
        countriesList.push({
          label: countries[i].name,
          value: countries[i].iso2,
        });
      }

      setLocation((prev) => ({ ...prev, countries: countriesList }));
    };

    getCountries();
    if (resort.countryValue) {
      getStatesByCountry(resort.countryValue);
    }
    if (resort.stateValue) {
      getCitiesByState(resort.countryValue, resort.stateValue);
    }

    geocode(resort.city, resort.state, resort.country);
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        backgroundColor: theme.colors.backgroundPrimary,
        padding: 16,
        paddingTop: 0,
      }}
    >
      <View>
        <Text>Step3Location</Text>
        <CustomDropdown
          search={true}
          label={"Country"}
          borderColor={theme.colors.primary}
          backgroundColor={theme.colors.backgroundPaper}
          borderRadius={100}
          name={"country"}
          selectedValue={resort.countryValue}
          options={location.countries}
          onValueChange={handleChange}
        />
        <CustomDropdown
          search={true}
          label={"State"}
          borderColor={theme.colors.primary}
          backgroundColor={theme.colors.backgroundPaper}
          borderRadius={100}
          name={"state"}
          selectedValue={resort.stateValue}
          options={location.states}
          onValueChange={handleChange}
        />
        <CustomDropdown
          search={true}
          label={"City"}
          borderColor={theme.colors.primary}
          backgroundColor={theme.colors.backgroundPaper}
          borderRadius={100}
          name={"city"}
          selectedValue={resort.cityValue}
          options={location.cities}
          onValueChange={handleChange}
        />
        <View
          style={{
            height: 220,
            zIndex: -1,
            borderRadius: 12,
            borderWidth: 0,
            borderColor: "transparent",
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MapView
            style={{
              flex: 1,
              height: "100%",
              width: "100%",
              borderRadius: 12,
            }}
            ref={mapRef}
            rotateEnabled={true}
            loadingEnabled={true}
            onRegionChange={onChangeRegion}
          >
            <Marker coordinate={pinLocation} />
          </MapView>
          <CustomButton
            style={{
              position: "absolute",
              right: 10,
              bottom: 10,
            }}
            paddingVertical={10}
            paddingHorizontal={10}
            borderRadius={100}
            backgroundColor={theme.colors.backgroundPrimary}
            iconCenter={
              <Icon
                type={"font-awesome"}
                name={"check"}
                size={32}
                color={theme.colors.textPrimary}
              />
            }
            onPress={() =>
              Toast.show({
                type: "custom",
                text1: t("step3Location.mapLocationSavedNotify"),
                position: "bottom",
              })
            }
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Step3Location;

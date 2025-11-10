import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../Theme/themeContext";
import CustomButton from "../Buttons/CustomButton";
import { useTranslation } from "react-i18next";
import CustomDropdown from "../Inputs/CustomDropdown";
import { API_KEY_LOCATION } from "@env";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Icon } from "react-native-elements";
import Toast from "react-native-toast-message";

const Step3Location = ({ ref, resort, setResort, errors, setErrors }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const mapRef = useRef();

  const [mapButtonIsVisible, setMapButtonIsVisible] = useState(false);

  const [location, setLocation] = useState({
    countries: [],
    states: [],
    cities: [],
  });
  const [pinLocation, setPinLocation] = useState({
    latitude: resort?.latitude || 0,
    longitude: resort?.longitude || 0,
  });

  useImperativeHandle(ref, () => ({
    validateAll: () => validate(),
  }));

  const validate = (fieldValues) => {
    let newErrors = { ...errors };

    const valuesToValidate = fieldValues || resort;
    if (!valuesToValidate || typeof valuesToValidate !== "object") {
      return false;
    }
    if ("country" in valuesToValidate) {
      newErrors.country = valuesToValidate.country?.trim() ? "" : "z";
    }
    if ("state" in valuesToValidate) {
      newErrors.state = valuesToValidate.state?.trim() ? "" : "z";
    }
    if ("latitude" in valuesToValidate) {
      const value = valuesToValidate.latitude;
      newErrors.latitude =
        value !== undefined && value !== null && !isNaN(value)
          ? ""
          : t("step3Location.pinLocationError");
    }

    setErrors(newErrors);

    if (!fieldValues) {
      return Object.values(newErrors).every((x) => x === "");
    }
    return !Object.values(newErrors).some((err) => err !== "");
  };

  //change inputs
  const handleChange = async (name, value, label) => {
    await setResort((prev) => ({ ...prev, latitude: null, longitude: null }));
    setMapButtonIsVisible(false);
    if (name === "country") {
      getStatesByCountry(value);
      setLocation((prev) => ({ ...prev, cities: [] }));
      await setResort((prev) => ({
        ...prev,
        state: "",
        stateValue: null,
        city: "",
        cityValue: null,
      }));
      geocode("", "", label);
    } else if (name === "state") {
      getCitiesByState(resort.countryValue, value);
      geocode("", label, resort.country);

      await setResort((prev) => ({
        ...prev,
        city: "",
        cityValue: null,
      }));
    } else if (name === "city") {
      geocode(label, resort.state, resort.country);
    }

    validate({ [name]: value });

    await setResort((prev) => ({
      ...prev,
      [name]: label,
      [`${name}Value`]: value,
      pinVerified: false,
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
      latitude: resort.pinVerified && resort.latitude ? resort.latitude : lat,
      longitude:
        resort.pinVerified && resort.longitude ? resort.longitude : long,
      latitudeDelta: resort.pinVerified && resort.latitude ? 0.002 : zoom,
      longitudeDelta: resort.pinVerified && resort.longitude ? 0.002 : zoom,
    };

    mapRef.current?.animateToRegion(initialLocation, 1500);
  };

  const onChangeRegion = async (region, gesture) => {
    setPinLocation({
      latitude: region.latitude,
      longitude: region.longitude,
    });

    if (gesture?.isGesture) {
      if (resort.pinVerified) {
        const newResort = { ...resort, latitude: null, longitude: null };
        await setResort((prev) => ({
          ...prev,
          latitude: null,
          longitude: null,
        }));
      }
      setMapButtonIsVisible(true);
    } else {
      setMapButtonIsVisible(false);
    }
  };

  const geocode = async (currentCity, currentState, currentCountry) => {
    if (await getPermissions()) {
      let zoom = 1;
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
  // useEffect(() => {
  //   console.log(resort.stateValue);
  //   console.log(resort.cityValue);
  // }, [resort]);
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
        <Text
          style={{
            fontSize: 32,
            fontWeight: "600",
            color: theme.colors.textPrimary,
            marginBottom: 8,
            width: "80%",
          }}
        >
          {t("step3Location.title")}
        </Text>
        <CustomDropdown
          search={true}
          label={"Country"}
          borderColor={theme.colors.primary}
          focusBorderColor={theme.colors.primary}
          backgroundColor={theme.colors.backgroundPrimary}
          borderRadius={100}
          name={"country"}
          selectedValue={resort.countryValue}
          options={location.countries}
          onValueChange={handleChange}
          error={errors.country}
          borderWidth={1.5}
        />
        <CustomDropdown
          search={true}
          label={"State"}
          borderColor={theme.colors.primary}
          focusBorderColor={theme.colors.primary}
          backgroundColor={theme.colors.backgroundPrimary}
          borderWidth={1.5}
          borderRadius={100}
          name={"state"}
          selectedValue={resort.stateValue}
          options={location.states}
          onValueChange={handleChange}
          error={errors.state}
        />
        <CustomDropdown
          search={true}
          label={"City"}
          borderColor={theme.colors.primary}
          focusBorderColor={theme.colors.primary}
          backgroundColor={theme.colors.backgroundPrimary}
          borderWidth={1.5}
          borderRadius={100}
          name={"city"}
          selectedValue={parseInt(resort.cityValue, 10)}
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
          <View style={{ height: "100%", width: "100%", borderRadius: 12 }}>
            <MapView
              style={{ flex: 1 }}
              ref={mapRef}
              rotateEnabled={true}
              loadingEnabled={true}
              onRegionChange={onChangeRegion}
              provider={PROVIDER_GOOGLE}
              mapType={"standard"}
            >
              {!resort.latitude && <Marker coordinate={pinLocation} />}
              {resort.latitude && (
                <Marker
                  coordinate={{
                    latitude: resort.latitude,
                    longitude: resort.longitude,
                  }}
                />
              )}
            </MapView>
          </View>
          <CustomButton
            style={{
              position: "absolute",
              right: 10,
              top: 10,
              display: mapButtonIsVisible ? "flex" : "none",
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
            onPress={async () => {
              Toast.show({
                type: "custom",
                text1: t("step3Location.mapLocationSavedNotify"),
                position: "bottom",
              });
              setMapButtonIsVisible(false);

              await setResort((prev) => ({
                ...prev,
                latitude: pinLocation.latitude,
                longitude: pinLocation.longitude,
                pinVerified: true,
              }));
              setErrors((prev) => ({ ...prev, latitude: "" }));
            }}
          />
        </View>
        {errors.latitude && (
          <Text style={{ fontSize: 16, color: theme.colors.error }}>
            {errors.latitude}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default Step3Location;

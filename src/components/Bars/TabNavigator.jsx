import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../../screens/Home/HomeScreen";
import ProfileScreen from "../../screens/Profile/ProfileScreen";
import CustomTabBar from "./CustomTabBar";
import SearchScreen from "../../screens/Search/SearchScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ResortScreen from "../../screens/Resort/ResortScreen";
import EditResort from "../../screens/Profile/EditResort";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../Theme/themeContext";
import Step2Type from "../AddNewResortSteps/Step2Type";
import Step1Info from "../AddNewResortSteps/Step1Info";
import Step3Location from "../AddNewResortSteps/Step3Location";
import { Button, Platform } from "react-native";
import { Icon } from "react-native-elements";
import MapScreen from "../../screens/Map/MapScreen";
import Step4Gallery from "../AddNewResortSteps/Step4Gallery";
import AddResort from "../../screens/Profile/AddResort";
import FavoriteScreen from "../../screens/Favorite/FavoriteScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Main stack
function MainStackGroup() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
        headerTitleStyle: { color: theme.colors.textPrimary },
      }}
    >
      {/*  Home Stack Group*/}
      <Stack.Screen
        name="TabGroup"
        component={TabGroup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={"ResortProfile"}
        component={ResortScreen}
        options={{
          presentation: "card",
          headerShown: false,
          animation: "fade",
        }}
      />

      <Stack.Screen
        name="AddResort"
        component={AddResort}
        options={{
          headerShown: true,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="EditResort"
        component={EditResort}
        options={{
          headerShown: true,
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

function TabGroup() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
      initialRouteName={"HomeScreen"}
    >
      <Tab.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          tabBarLabel: "Map",
          tabBarIconActive: "map-marker",
          tabBarIconInactive: "map-marker-outline",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="FavoriteScreen"
        component={FavoriteScreen}
        options={{
          tabBarLabel: "Favorite",
          tabBarIconActive: "heart",
          tabBarIconInactive: "heart-outline",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIconActive: "home",
          tabBarIconInactive: "home-outline",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          tabBarLabel: "Search",
          tabBarIconActive: "magnify",
          tabBarIconInactive: "magnify",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        options={({ route }) => ({
          tabBarLabel: "Profile",
          tabBarIconActive: "account",
          tabBarIconInactive: "account-outline",
          headerShown: false,
        })}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}

const TabNavigator = () => {
  return <MainStackGroup />;
};

export default TabNavigator;

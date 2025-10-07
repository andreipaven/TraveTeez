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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AddResortStack = createNativeStackNavigator();

function AddResortFlow() {
  const { t } = useTranslation();
  return (
    <AddResortStack.Navigator>
      <AddResortStack.Screen
        name={"Step1"}
        component={Step1Info}
        options={({ navigation }) => ({
          title: t("addResort.addNewResortTitle"),
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerLeft: () => (
            <Icon
              type={"ionicon"}
              name={
                Platform.OS === "ios" ? "chevron-back" : "arrow-back-outline"
              }
              size={28}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
      <AddResortStack.Screen
        name={"Step2"}
        component={Step2Type}
        options={({ navigation }) => ({
          title: t("addResort.addNewResortTitle"),
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerLeft: () => (
            <Icon
              type={"ionicon"}
              name={
                Platform.OS === "ios" ? "chevron-back" : "arrow-back-outline"
              }
              size={28}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
      <AddResortStack.Screen
        name={"Step3"}
        component={Step3Location}
        options={({ navigation }) => ({
          title: t("addResort.addNewResortTitle"),
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerLeft: () => (
            <Icon
              type={"ionicon"}
              name={
                Platform.OS === "ios" ? "chevron-back" : "arrow-back-outline"
              }
              size={28}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
      <AddResortStack.Screen
        name={"Step4"}
        component={Step4Gallery}
        options={({ navigation }) => ({
          title: t("addResort.addNewResortTitle"),
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerLeft: () => (
            <Icon
              type={"ionicon"}
              name={
                Platform.OS === "ios" ? "chevron-back" : "arrow-back-outline"
              }
              size={28}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
    </AddResortStack.Navigator>
  );
}

// Main stack
function MainStackGroup() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  return (
    <Stack.Navigator>
      {/*  Home Stack Group*/}
      <Stack.Screen
        name="TabGroup"
        component={TabGroup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={"ResortProfile"}
        component={ResortScreen}
        options={{ presentation: "card", headerShown: false }}
      />

      <Stack.Screen
        name="AddResortFlow"
        component={AddResortFlow}
        options={{
          presentation: "card",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditResort"
        component={EditResort}
        options={{
          title: t("app.editResortTitle"),
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
          headerTitleStyle: { fontSize: 16 },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.colors.backgroundPrimary,
          },
          headerTintColor: theme.colors.textPrimary,
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
        options={({ route }) => ({
          tabBarLabel: "Map",
          tabBarIconActive: "map",
          tabBarIconInactive: "map-outline",
          headerShown: false,
        })}
      />
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={({ route }) => ({
          tabBarLabel: "Home",
          tabBarIconActive: "home",
          tabBarIconInactive: "home-outline",
          headerShown: false,
        })}
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

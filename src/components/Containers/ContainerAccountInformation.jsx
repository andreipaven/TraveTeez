import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import ThemeSwitch from "../Buttons/ThemeSwitch";
import { useTheme } from "../../Theme/themeContext";
import { useTranslation } from "react-i18next";
import CustomButton from "../Buttons/CustomButton";
import { Icon } from "react-native-elements";
import {
  deleteAccessToken,
  deleteRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from "../../Secure/secureHub";
import { supabase } from "../../Authentication/utils/supabase";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../Secure/AuthProvider";

const ContainerAccountInformation = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setUser } = useContext(AuthContext);

  const handleAccountSettings = () => {
    console.log("Navigate to Account Settings");
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();

      await deleteRefreshToken(null);
      await deleteAccessToken(null);
      setUser(null);
      navigation.navigate("SignIn");
      console.log("Signed out successfully");
    } catch (error) {
      console.log("Error sign out:", error);
    }
  };

  const handleLegal = async () => {};

  const informationOptions = [
    {
      icon: "cog-outline",
      name: "Account settings",
      onPress: handleAccountSettings,
    },
    {
      icon: "file-document-multiple-outline",
      name: "Legal",
      onPress: handleLegal,
    },
    {
      icon: "logout",
      name: "Sign out",
      onPress: handleSignOut,
    },
  ];

  return (
    <View
      style={{
        padding: 16,
        margin: 16,
        borderRadius: 24,
        backgroundColor: theme.colors.backgroundPrimary,
        shadowColor: theme.colors.shadowPrimary,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
      }}
    >
      {informationOptions.map((item, index) => (
        <CustomButton
          key={index}
          title={item.name}
          iconLeft={
            <Icon type={"material-community"} name={item.icon} size={24} />
          }
          alignItems={"center"}
          style={{ justifyContent: "flex-start", gap: 4 }}
          paddingVertical={16}
          onPress={item.onPress}
        />
      ))}
    </View>
  );
};

export default ContainerAccountInformation;

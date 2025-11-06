import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignIn from "./SignIn";
import SingUp from "./SingUp";
import { useTheme } from "../Theme/themeContext";

const Auth = () => {
  const { theme } = useTheme();
  const [isOpenSignIn, setIsOpenSignIn] = useState(true);
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.backgroundPrimary }}
    >
      <SignIn
        isOpen={isOpenSignIn}
        setIsOpen={() => setIsOpenSignIn(!isOpenSignIn)}
      />
      <SingUp
        isOpen={!isOpenSignIn}
        setIsOpen={() => setIsOpenSignIn(!isOpenSignIn)}
      />
    </SafeAreaView>
  );
};

export default Auth;

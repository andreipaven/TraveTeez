import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../Theme/themeContext";
import CustomButton from "../Buttons/CustomButton";
import { useNavigation } from "@react-navigation/native";

const Step3Location = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const nextStep = () => {
    navigation.navigate("Step4");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: theme.colors.backgroundPrimary,
      }}
      edges={["bottom", "left", "right"]}
    >
      <View
        style={{
          flex: 1,

          justifyContent: "space-between",
        }}
      >
        <Text>Step3Location</Text>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            gap: 24,
            paddingBottom: 24,
          }}
        >
          <CustomButton
            title={"Next"}
            backgroundColor={theme.colors.primary}
            textColor={theme.colors.primaryContrast}
            flex={1}
            paddingVertical={12}
            borderRadius={100}
            paddingHorizontal={8}
            onPress={nextStep}
            fontSize={20}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Step3Location;

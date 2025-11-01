import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../Theme/themeContext";
import CustomButton from "../Buttons/CustomButton";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";

const ContainerGuestProfile = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.backgroundPrimary }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "flex-start",
          padding: 16,
          gap: 16,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 24 }}>
          {t("containerGuestProfile.title")}
        </Text>

        <CustomButton
          title={t("containerGuestProfile.mainButton")}
          backgroundColor={theme.colors.primary}
          textColor={theme.colors.primaryContrast}
          paddingVertical={14}
          paddingHorizontal={16}
          borderRadius={100}
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
            navigation.navigate("SignIn");
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ContainerGuestProfile;

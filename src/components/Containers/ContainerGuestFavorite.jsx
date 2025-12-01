import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../Theme/themeContext";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../Buttons/CustomButton";
import * as Haptics from "expo-haptics";

function ContainerGuestFavorite() {
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
          {t("containerGuestFavorite.title")}
        </Text>
        <Text style={{ fontSize: 16, color: theme.colors.textSecondary }}>
          {t("containerGuestFavorite.message")}
        </Text>
        <CustomButton
          title={t("containerGuestFavorite.mainButton")}
          backgroundColor={theme.colors.primary}
          textColor={theme.colors.primaryContrast}
          maxHeight={46}
          minHeight={46}
          paddingHorizontal={32}
          borderRadius={100}
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
            navigation.navigate("SignIn");
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export default ContainerGuestFavorite;

import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";

import { AuthContext } from "../../Secure/AuthProvider";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import NewResortsList from "../../components/Carousels/NewResortsList";
import APIService from "../../services/APIService";
import { config } from "../../services/config";
import CustomButton from "../../components/Buttons/CustomButton";
import { useTheme } from "../../Theme/themeContext";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";
import CategoryResortsBar from "../../components/Bars/CategoryResortsBar";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation();
  const [newResorts, setNewResorts] = useState([]);
  const { user, loading } = useContext(AuthContext);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (!user && !loading) {
      navigation.navigate("SignIn");
    }
  }, [user, loading]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.backgroundPrimary },
      ]}
      edges={["top", "left", "right"]}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        nestedScrollEnabled={true}
      >
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 4,
          }}
        >
          <CustomButton
            activeOpacity={1}
            backgroundColor={theme.colors.backgroundPrimary}
            iconCenter={
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Icon
                    size={24}
                    name={"magnify"}
                    color={theme.colors.textSecondary}
                  />
                  <Text style={{ color: theme.colors.textSecondary }}>
                    {t("home.searchButtonInput")}
                  </Text>
                </View>
                <Icon
                  size={24}
                  name={"beach"}
                  color={theme.colors.textSecondary}
                />
              </View>
            }
            borderColor={theme.colors.textSecondary}
            paddingVertical={8}
            paddingHorizontal={8}
            textColor={theme.colors.textSecondary}
            width={"auto"}
            borderRadius={100}
            alignItems={"center"}
            style={{
              shadowColor: theme.colors.shadowPrimary,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
              elevation: 4,
              justifyContent: "space-between",
            }}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
              navigation.navigate("SearchScreen");
            }}
          />
        </View>
        <View>
          <NewResortsList refreshing={refreshing} />
          <CategoryResortsBar refreshing={refreshing} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

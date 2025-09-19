import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomNavBar from "../../components/Bars/BottomNavBar";
import { AuthContext } from "../../Secure/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function () {
  const { user, loading } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (!loading && !user) {
      navigation.navigate("SignIn");
    }
  }, [user, loading]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>Home hia cna</Text>
      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});

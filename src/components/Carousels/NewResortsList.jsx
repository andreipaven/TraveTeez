import React, { useCallback, useRef } from "react";
import { View, FlatList } from "react-native";

import { useTheme } from "../../Theme/themeContext";
import CustomResortCard from "../Cards/CustomResortCard";
import { useNavigation } from "@react-navigation/native";

export default function NewResortsList({ dates }) {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const renderItem = useCallback(
    ({ item }) => (
      <CustomResortCard item={item} navigation={navigation} theme={theme} />
    ),
    [],
  );

  return (
    <View
      style={{
        width: "100%",
        height: "auto",
        paddingVertical: 0,
      }}
    >
      <FlatList
        horizontal
        data={dates}
        keyboardShouldPersistTaps={"always"}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 8 }}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
      />
    </View>
  );
}

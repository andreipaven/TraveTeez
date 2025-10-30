import React, { useCallback, useRef } from "react";
import { View, FlatList, Platform } from "react-native";
import CustomResortCard from "../Cards/CustomResortCard";
import { NativeViewGestureHandler } from "react-native-gesture-handler";

export default function NewResortsList({ dates }) {
  const renderItem = useCallback(
    ({ item }) => <CustomResortCard item={item} />,
    [],
  );

  const PlatformFlatListWrapper = ({ children }) => {
    if (Platform.OS === "ios") {
      return <NativeViewGestureHandler>{children}</NativeViewGestureHandler>;
    }
    return <View>{children}</View>;
  };

  return (
    <View
      style={{
        width: "100%",
        height: "auto",
        paddingVertical: 0,
      }}
    >
      <PlatformFlatListWrapper>
        <FlatList
          horizontal
          data={dates}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 8 }}
          showsHorizontalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={21}
          removeClippedSubviews={true}
          updateCellsBatchingPeriod={50}
        />
      </PlatformFlatListWrapper>
    </View>
  );
}

import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  Image,
  Pressable,
  Text,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const ProfileCarousel = ({ resorts, resortImages, theme }) => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef();

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
  const loopData = resorts.length > 0 ? [...resorts, resorts[0]] : [];
  return (
    <FlatList
      ref={flatListRef}
      style={{ padding: 4, marginLeft: -4 }}
      data={loopData}
      snapToInterval={width * 0.42 + 8}
      decelerationRate="fast"
      horizontal
      snapToAlignment="start"
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, idx) => item.id?.toString() || idx.toString()}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewConfigRef.current}
      renderItem={({ item, index }) => {
        const isActive = index === activeIndex;
        const itemWidth = width * 0.42;
        const scale = isActive ? 1 : 0.98;
        const itemHeight = 220;

        return (
          <View
            style={{
              transform: [{ scale }],
              width: itemWidth,
              height: itemHeight,
              borderRadius: 12,
              overflow: "hidden",
              marginRight: 8,
              borderWidth: 1.5,
              borderColor: isActive ? theme.colors.primary : "transparent",
              boxShadow: isActive
                ? `0 0 4px 1px ${theme.colors.shadowPrimary}`
                : "none",
            }}
          >
            <Carousel
              width={itemWidth}
              height={itemHeight}
              data={resortImages[index] || []}
              autoPlay={true}
              autoPlayInterval={4000}
              scrollAnimationDuration={1500}
              loop={true}
              vertical={false}
              panGestureHandlerProps={{ enabled: false }}
              mode="vertical-stack"
              modeConfig={{
                snapDirection: "left",
                stackInterval: 40,
                scaleInterval: 0.05,
              }}
              renderItem={({ item: imageItem }) => (
                <View style={{ width: "100%", height: "100%" }}>
                  <Pressable
                    onPress={
                      () =>
                        navigation.navigate("Home", {
                          resortId: item.resort_id,
                        }) //switch to prifile resortx
                    }
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Image
                      source={{ uri: imageItem.image_url }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  </Pressable>

                  <Pressable
                    onPress={() => alert("Favorite!")}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: "rgba(255,255,255,0.8)",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 10,
                    }}
                  >
                    <Text>❤</Text>
                  </Pressable>

                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={2}
                    style={{
                      position: "absolute",
                      top: 4,
                      left: 4,
                      fontWeight: "bold",
                      color: theme.colors.textPrimary,
                      maxWidth: "70%",
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
              )}
            />
          </View>
        );
      }}
    />
  );
};

export default ProfileCarousel;

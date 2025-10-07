import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Icon } from "react-native-elements";
import { useTheme } from "../../Theme/themeContext";
import CustomButton from "../Buttons/CustomButton";

const AddImageModal = ({ visible, onClose, message, onCamera, onGallery }) => {
  const { theme } = useTheme();

  return (
    visible && (
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.1)",
        }}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View
            style={{
              flex: 1,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  backgroundColor: theme.colors.backgroundDefault,
                  padding: 20,
                  borderRadius: 8,
                  width: "80%",
                  shadowColor: theme.colors.shadowPrimary,
                  shadowOpacity: 1,
                  shadowOffset: { width: 0, height: -2 },
                  shadowRadius: 6,
                  elevation: 10,
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <Text>{message}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    width: "100%",
                  }}
                >
                  <CustomButton
                    iconLeft={
                      <Icon
                        type={"material-community"}
                        name={"image-multiple-outline"}
                        size={24}
                      />
                    }
                    title={"Gallery"}
                    flexDirection={"column"}
                    onPress={() => {
                      onClose();
                      onGallery();
                    }}
                  />
                  <CustomButton
                    iconLeft={
                      <Icon
                        type={"material-community"}
                        name={"camera-outline"}
                        size={24}
                      />
                    }
                    title={"Camera"}
                    flexDirection={"column"}
                    onPress={() => {
                      onClose();
                      onCamera();
                    }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  );
};

export default AddImageModal;

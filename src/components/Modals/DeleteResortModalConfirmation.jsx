import React from "react";
import {
  Modal,
  View,
  Text,
  Button,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "../../Theme/themeContext";
import CustomButton from "../Buttons/CustomButton";

const DeleteResortModalConfirmation = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  const { theme } = useTheme();
  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onCancel}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.shadowPrimary + "88",
          }}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
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
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
              >
                {title}
              </Text>
              <Text style={{ marginBottom: 20 }}>{message}</Text>
              <View
                style={{ flexDirection: "row", justifyContent: "flex-end" }}
              >
                <CustomButton
                  title="Cancel"
                  onPress={onCancel}
                  textColor={theme.colors.primaryContrast}
                  backgroundColor={theme.colors.primary}
                  paddingHorizontal={10}
                  paddingVertical={8}
                  borderRadius={100}
                />
                <View style={{ width: 10 }} />
                <CustomButton
                  title="Confirm"
                  onPress={onConfirm}
                  textColor={theme.colors.primaryContrast}
                  backgroundColor={theme.colors.primaryDelete}
                  paddingHorizontal={10}
                  paddingVertical={8}
                  borderRadius={100}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default DeleteResortModalConfirmation;

import React from "react";
import { Modal, View, Text, Button } from "react-native";
import { useTheme } from "../../Theme/themeContext";

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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            backgroundColor: theme.colors.backgroundDefault,
            padding: 20,
            borderRadius: 8,
            width: "80%",
            // Shadow iOS
            shadowColor: theme.colors.shadowPrimary,
            shadowOpacity: 1,
            shadowOffset: { width: 0, height: -2 },
            shadowRadius: 6,
            // Shadow Android
            elevation: 10,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
            {title}
          </Text>
          <Text style={{ marginBottom: 20 }}>{message}</Text>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Button
              title="Cancel"
              onPress={onCancel}
              color={theme.colors.primary}
            />
            <View style={{ width: 10 }} />
            <Button title="Confirm" onPress={onConfirm} color="red" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteResortModalConfirmation;

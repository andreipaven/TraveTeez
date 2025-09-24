import { BaseToast } from "react-native-toast-message";
import { useTheme } from "../../Theme/themeContext";

const CustomToast = (props) => {
  const { theme } = useTheme();
  return (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "transparent",
        backgroundColor: theme.colors.backgroundPrimary,
        borderRadius: 20,
        height: 72,
        opacity: 0.9,
        marginHorizontal: 16,
        width: "auto",
      }}
      contentContainerStyle={{ paddingHorizontal: 8 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: theme.colors.textPrimary,
      }}
      text2Style={{ fontSize: 14, color: theme.colors.textSecondary }}
    />
  );
};

export default CustomToast;

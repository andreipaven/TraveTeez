import { useTheme } from "../../../Theme/themeContext";
import * as Progress from "react-native-progress";

const AddResortProgressBar = ({ progress, marginBottom }) => {
  const { theme } = useTheme();

  return (
    <Progress.Bar
      progress={progress}
      width={180}
      color={theme.colors.primary}
      borderRadius={12}
      unfilledColor={theme.colors.shadowPrimary + "11"}
      borderWidth={0}
      style={{
        alignSelf: "center",
        margin: 0,
        zIndex: 2,
        marginBottom,
      }}
    />
  );
};
export default AddResortProgressBar;

import React from "react";

import LottieView from "lottie-react-native";

const LoadingButton = () => {
  return (
    <LottieView
      source={require("../../../assets/Trail loading.json")}
      autoPlay
      loop
      style={{ width: 54, height: 54 }}
      resizeMode={"cover"}
      colorFilters={[
        {
          keypath: "*",
          color: "#00d3e6",
        },
      ]}
    />
  );
};
export default LoadingButton;

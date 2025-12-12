// import React, { useEffect } from "react";
// import { View, Text, StyleSheet, Alert, Pressable } from "react-native";
//
// import { supabase } from "./utils/supabase";
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";
// import { useNavigation } from "@react-navigation/native";
//
// const GoogleSignInComponent = () => {
//   const navigation = useNavigation();
//   useEffect(() => {
//     GoogleSignin.configure({
//       webClientId:
//         "859051326541-1rngajte4s22rhi29ftn7dvc6kjsck6n.apps.googleusercontent.com",
//       offlineAccess: true,
//       forceCodeForRefreshToken: true,
//     });
//   }, []);
//
//   const signInWithGoogle = async () => {
//     try {
//       await GoogleSignin.signOut();
//       await GoogleSignin.hasPlayServices();
//       const userInfo = await GoogleSignin.signIn();
//       console.log(userInfo);
//
//       if (userInfo?.data?.idToken) {
//         const { data, error } = await supabase.auth.signInWithIdToken({
//           provider: "google",
//           token: userInfo.data.idToken,
//         });
//
//         console.log(data);
//
//         if (error) {
//           Alert.alert("Error", error.message);
//         } else {
//           console.log("Connection successfully");
//           navigation.goBack();
//         }
//       }
//     } catch (error) {
//       if (error.code === statusCodes.IN_PROGRESS) {
//         // operation (e.g. sign in) is in progress already
//         Alert.alert("Sign in progress");
//       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         // play services not available or outdated
//         Alert.alert("Play service error");
//       } else if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//         Alert.alert("Sign in canceled");
//       } else {
//         // some other error happened
//         Alert.alert("Error", error.message);
//       }
//     }
//   };
//   return (
//     <View>
//       <Pressable onPress={signInWithGoogle}>
//         <Text>Sign in google</Text>
//       </Pressable>
//     </View>
//   );
// };
// export default GoogleSignInComponent;

// GoogleLogin.js;
import React, { useEffect } from "react";
import { Button, Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { supabase } from "./utils/supabase";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "859051326541-2i6bjcgvkfdp350gp31u2rvu01s1hv7n.apps.googleusercontent.com",
    iosClientId:
      "859051326541-raalcompclvrl7hrppts4g90nto9j4dh.apps.googleusercontent.com",
    androidClientId:
      "859051326541-8oe5ch4ihd3j46ruf8nteqv4ltfqiuov.apps.googleusercontent.com",
  });
  const signInWithGoogle = async () => {
    console.log(response);
  };

  useEffect(() => {
    signInWithGoogle();
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Login with Google"
      onPress={() => promptAsync()}
    />
  );
}

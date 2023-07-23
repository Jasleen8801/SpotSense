import { StyleSheet, Text, View, SafeAreaView, Pressable } from "react-native";
import React, { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import { CLIENT_ID, REDIRECT_URL } from "@env";
import { Entypo, MaterialIcons, AntDesign } from "@expo/vector-icons";

const LoginScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkTokenValidity = async () => {
      const accessToken = await AsyncStorage.getItem("token");
      const expirationDate = await AsyncStorage.getItem("expirationDate");
      console.log("access token: ", accessToken);
      console.log("expiration date: ", expirationDate);

      if (accessToken && expirationDate) {
        const currentTime = Date.now();
        if (currentTime < parseInt(expirationDate)) {
          // token is valid
          navigation.replace("Main");
        } else {
          // token expired
          AsyncStorage.removeItem("token");
          AsyncStorage.removeItem("expirationDate");
        }
      }
    };
    checkTokenValidity();
  }, []);

  // async function handleAuth() {
  //   const config = {
  //     issuer: "https://accounts.spotify.com",
  //     clientId: CLIENT_ID,
  //     scopes: [
  //       "user-read-email",
  //       "user-library-read",
  //       "user-top-read",
  //       "user-read-recently-played",
  //       "playlist-read-private",
  //       "playlist-read-collaborative",
  //       "playlist-modify-public",
  //       // "playlist-modify-private",
  //     ],
  //     redirectUrl: REDIRECT_URL
  //   };

  //   const result = await AppAuth.authAsync(config);
  //   console.log(result);

  //   if(result.accessToken){
  //     const expirationDate = new Date(result.accessTokenExpirationDate).getTime();
  //     AsyncStorage.setItem("token", result.accessToken);
  //     AsyncStorage.setItem("expirationDate", expirationDate.toString());
  //     navigation.navigate("Main")
  //   }
  // }

  async function handleAuth() {
    const discovery = await AuthSession.fetchDiscoveryAsync(
      "https://accounts.spotify.com"
    );

    const authUrl = `${discovery.authorizationEndpoint}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=token&scope=user-read-email%20user-library-read%20user-top-read%20user-read-recently-played%20playlist-read-private%20playlist-read-collaborative%20playlist-modify-public`;

    const result = await AuthSession.startAsync({ authUrl });

    console.log(result);

    if (result.type === "success" && result.params.access_token) {
      const expirationDate = new Date(
        Date.now() + result.params.expires_in * 1000
      ).getTime();
      AsyncStorage.setItem("token", result.params.access_token);
      AsyncStorage.setItem("expirationDate", expirationDate.toString());
      navigation.navigate("Main");
    }
  }

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={{ height: 80 }} />
        <Entypo
          style={{ textAlign: "center" }}
          name="spotify"
          size={80}
          color="white"
        />
        <Text
          style={{
            color: "white",
            fontSize: 40,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 40,
          }}
        >
          Millions of Songs Free on Spotify
        </Text>

        <View style={{ height: 80 }} />
        <Pressable
          onPress={handleAuth}
          style={{
            backgroundColor: "#1DB954",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            width: 300,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>Sign In with Spotify</Text>
        </Pressable>

        <Pressable
          style={{
            backgroundColor: "#131624",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            width: 300,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            marginVertical: 10,
            borderColor: "#C0C0C0",
            borderWidth: 0.8,
          }}
        >
          <MaterialIcons name="phone-android" size={24} color="white" />
          <Text
            style={{
              fontWeight: "500",
              color: "white",
              textAlign: "center",
              flex: 1,
            }}
          >
            Continue with phone number
          </Text>
        </Pressable>

        <Pressable
          style={{
            backgroundColor: "#131624",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            width: 300,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            marginVertical: 10,
            borderColor: "#C0C0C0",
            borderWidth: 0.8,
          }}
        >
          <AntDesign name="google" size={24} color="red" />
          <Text
            style={{
              fontWeight: "500",
              color: "white",
              textAlign: "center",
              flex: 1,
            }}
          >
            Continue with Google
          </Text>
        </Pressable>

        <Pressable
          style={{
            backgroundColor: "#131624",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            width: 300,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            marginVertical: 10,
            borderColor: "#C0C0C0",
            borderWidth: 0.8,
          }}
        >
          <Entypo name="facebook" size={24} color="blue" />
          <Text
            style={{
              fontWeight: "500",
              color: "white",
              textAlign: "center",
              flex: 1,
            }}
          >
            Continue with Facebook
          </Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});

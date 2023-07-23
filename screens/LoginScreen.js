import { StyleSheet, Text, View, SafeAreaView, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import { useAuthRequest } from "expo-auth-session";
import axios from "axios";
import base64 from "base-64";

import { CLIENT_ID, REDIRECT_URL, CLIENT_SECRET } from "@env";
import { Entypo, MaterialIcons, AntDesign } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

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

      // navigation.replace("Main");
    };
    checkTokenValidity();
  }, []);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: [
        "user-read-email",
        "user-library-read",
        "user-top-read",
        "user-read-recently-played",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-public",
        // "playlist-modify-private",
      ],
      usePKCE: false,
      redirectUri: REDIRECT_URL,
      clientSecret: CLIENT_SECRET,
    },
    discovery
  );

  const handleAuth = async () => {
    if (promptAsync) {
      const result = await promptAsync();
      // console.log(result);
  
      if (result) {
        // console.log("checkkk");
        const { code } = result.params;
  
        // try {
        //   const authOptions = {
        //     url: "https://accounts.spotify.com/api/token",
        //     headers: {
        //       Authorization:
        //         "Basic " + base64.encode(CLIENT_ID + ":" + CLIENT_SECRET),
        //       "Content-Type": "application/x-www-form-urlencoded",
        //     },
        //     form: {
        //       grant_type: "client_credentials",
        //     },
        //     json: true,
        //     data: `grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URL}`,
        //   };
        //   const res = await axios.post(authOptions);
        //   console.log("chala ", res);
        // } catch (error) {
        //   console.log(error);
        // }
  
        // const expirationDate = Date.now() + parseInt(expires_in) * 1000;
        const expirationDate = Date.now() + 3600;
  
        if (code && expirationDate) {
          AsyncStorage.setItem("token", code);
          AsyncStorage.setItem("expirationDate", expirationDate.toString());
          navigation.navigate("Main");
        } else {
          console.error("Invalid access token or expiration date.");
        }
      } else {
        console.error("Authentication error:", result.error);
      }
    }
  };

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

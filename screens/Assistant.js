import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Assistant = () => {
  const [userProfile, setUserProfile] = useState(null);
  const getProfile = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 50 }}>
        <View style={{ padding: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                resizeMode: "cover",
              }}
              source={{ uri: userProfile?.images[0].url }}
            />
            <View>
              <Text
                style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
              >
                {userProfile?.display_name}
              </Text>
              <Text style={{ color: "gray", fontSize: 16, fontWeight: "bold" }}>
                {userProfile?.email}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.voiceButton}
        >
          <Text style={{ color: "white", fontSize: 16 }}>
            Coming Soon
          </Text>
        </TouchableOpacity>

        <View style={styles.recognizedTextContainer}>
          <Text style={styles.recognizedText}>{recognizedText}</Text>
        </View> 
      </ScrollView>
    </LinearGradient>
  );
};

export default Assistant;

const styles = StyleSheet.create({
  voiceButton: {
    backgroundColor: "#1DB954",
    padding: 10,
    borderRadius: 25,
    alignSelf: "center",
    marginTop: 20,
  },
  recognizedTextContainer: {
    backgroundColor: "#202020",
    padding: 12,
    margin: 20,
    borderRadius: 8,
  },
  recognizedText: {
    color: "white",
    fontSize: 16,
  },
});

import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const [userProfile, setUserProfile] = useState([]);
  const getProfile = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    console.log(accessToken);
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + accessToken,
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
  console.log(userProfile);
  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 50 }}>
        <Text>HomeScreen</Text>
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});

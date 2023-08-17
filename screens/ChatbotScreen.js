import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const ChatbotScreen = () => {
  const navigation = useNavigation();
  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 50, flex: 1 }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginHorizontal: 20 }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
};

export default ChatbotScreen;

const styles = StyleSheet.create({});

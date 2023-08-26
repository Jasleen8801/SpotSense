import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import RNKommunicateChat from 'react-native-kommunicate-chat';
import { KOMMUNICATE_APP_ID } from "@env";

const ChatbotScreen = () => {
  const navigation = useNavigation();
  
  useEffect(() => {
    let conversationObject = {
      'appId': KOMMUNICATE_APP_ID
    };  
    RNKommunicateChat.buildConversation(conversationObject, (response, responseMessage) => {
      if(response === "Success"){
        console.log("Conversation builder success : " + responseMessage);
      }
    })
  }, []);

  
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

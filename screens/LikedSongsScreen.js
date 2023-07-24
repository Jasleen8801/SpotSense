import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import { Ionicons } from "@expo/vector-icons";

const LikedSongsScreen = () => {
  const navigation = useNavigation();
  const [input, setInput] = useState("");
  return (
    <LinearGradient colors={["#030842", "#17202A"]} style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, marginTop: 50 }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginHorizontal: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>

        <Pressable
          style={{
            marginHorizontal: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 9,
          }}
        >
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              backgroundColor: "#390256",
              padding: 9,
              flex: 1,
              borderRadius: 3,
              height: 38,
            }}
          >
            <Ionicons name="search" size={24} color="white" />
            <TextInput
              numberOfLines={1}
              value={input}
              onChangeText={(text) => setInput(text)}
              placeholder="In Liked Songs?"
              placeholderTextColor={"white"}
              style={{ fontWeight: "500" }}
            />
          </Pressable>
          <Pressable
            style={{
              marginHorizontal: 10,
              backgroundColor: "#390256",
              padding: 10,
              borderRadius: 3,
              height: 38,
            }}
          >
            <Text style={{ color: "white" }}>Sort</Text>
          </Pressable>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
};

export default LikedSongsScreen;

const styles = StyleSheet.create({});

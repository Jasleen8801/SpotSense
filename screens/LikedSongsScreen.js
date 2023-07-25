import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import SongItem from "../components/SongItem";
import { Player } from "../PlayerContext";

const LikedSongsScreen = () => {
  const navigation = useNavigation();
  const [input, setInput] = useState("");
  const [savedTracks, setSavedTracks] = useState([]);
  const { currentTrack, setCurrentTrack } = useContext(Player);

  useEffect(() => {
    getSavedTracks();
  }, []);

  async function getSavedTracks() {
    const accessToken = await AsyncStorage.getItem("token");
    const response = await fetch(
      "https://api.spotify.com/v1/me/tracks?offset=0&limit=50",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          limit: 50,
        },
      }
    );
    if (!response.ok) {
      throw new Error("failed to fetch the tracks");
    }
    const data = await response.json();
    setSavedTracks(data.items);
  }
  // console.log(savedTracks);

  const playTrack = async () => {
    if (savedTracks.length > 0) {
      setCurrentTrack(savedTracks[0]);
    }
  };

  return (
    <LinearGradient colors={["#030842", "#17202A"]} style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, marginTop: 50 }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginHorizontal: 20 }}
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

        <View style={{ height: 50 }} />
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
            Liked Songs
          </Text>
          <Text style={{ color: "white", fontSize: 13, marginTop: 5 }}>
            {savedTracks.length} Songs
          </Text>
        </View>

        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 20,
          }}
        >
          <Pressable
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: "#1DB954",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AntDesign name="arrowdown" size={20} color="white" />
          </Pressable>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <MaterialCommunityIcons
              name="cross-bolnisi"
              size={24}
              color="#1DB954"
            />
            <Pressable
              onPress={playTrack}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#1DB954",
              }}
            >
              <Entypo name="controller-play" size={24} color="white" />
            </Pressable>
          </View>
        </Pressable>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={savedTracks}
          renderItem={({ item }) => <SongItem item={item} />}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default LikedSongsScreen;

const styles = StyleSheet.create({});

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  Pressable,
  FlatList,
  Animated
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

import {
  MaterialCommunityIcons,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import ArtistCard from "../components/ArtistCard";
import RecentlyPlayedCard from "../components/RecentlyPlayedCard";

const CurrentlyPlaying = ({ song }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Add animation effect when the song changes
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [song]);

  if (!song) {
    return null; // If no song is playing, don't render anything
  }

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          backgroundColor: "#282828",
          borderRadius: 8,
          margin: 10,
        }}
      >
        <Image
          source={{ uri: song.item.album.images[0].url }}
          style={{ width: 50, height: 50, borderRadius: 8 }}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            {song.item.name}
          </Text>
          <Text style={{ color: "gray" }}>
            {song.item.artists[0].name} - {song.item.album.name}
          </Text>
          {/* You can add progress bar or other song information here */}
        </View>
      </View>
    </Animated.View>
  );
};

const HomeScreen = () => {
  const [userProfile, setUserProfile] = useState();
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [topArtists, setTopArtists] = useState();
  const [currentSong, setCurrentSong] = useState();

  const navigation = useNavigation();
  useEffect(() => {
    getProfile();
    getRecentlyPlayedSongs();
    getTopArtists();
    getCurrentSong();

    // if (response.data.is_playing) {
    //   setCurrentSong(response.data);
    // } else {
    //   setCurrentSong(null);
    // }
  }, []);
  // console.log(userProfile);

  const greetingMessage = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return "Good Morning";
    } else if (currentTime < 16) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };
  const message = greetingMessage();

  const getProfile = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    // console.log(accessToken);
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

  const getRecentlyPlayedSongs = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const response = await axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me/player/recently-played?limit=4",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log(response);
      const tracks = response.data.items;
      setRecentlyPlayed(tracks);
    } catch (error) {
      console.log(error);
    }
  };

  const renderTracks = ({ item }) => {
    return (
      <Pressable
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
          marginVertical: 8,
          backgroundColor: "#282828",
          borderRadius: 4,
          elevation: 3,
        }}
      >
        <Image
          style={{
            width: 55,
            height: 55,
          }}
          source={{ uri: item.track.album.images[0].url }}
        />
        <View
          style={{ flex: 1, marginHorizontal: 8, justifyContent: "center" }}
        >
          <Text
            numberOfLines={2}
            style={{ color: "white", fontSize: 13, fontWeight: "bold" }}
          >
            {item.track.name}
          </Text>
        </View>
      </Pressable>
    );
  };

  const getTopArtists = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const type = "artists";
      const response = await axios({
        method: "GET",
        url: `https://api.spotify.com/v1/me/top/${type}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log(response);
      setTopArtists(response.data.items);
      // console.log(topArtists[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentSong = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const response = axios.get(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response)
      // if (response.data.is_playing) {
      //   setCurrentSong(response.data);
      // } else {
      //   setCurrentSong(null);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 50 }}>
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: userProfile?.images[0].url }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                resizeMode: "cover",
              }}
            />
            <Text
              style={{
                marginLeft: 10,
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
              }}
            >
              {message}
            </Text>
          </View>
          <Pressable onPress={() => navigation.navigate("ChatBot")}>
            <Ionicons name="chatbubbles-outline" size={24} color="white" />
          </Pressable>
        </View>

        <View
          style={{
            marginHorizontal: 12,
            marginVertical: 5,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Pressable
            style={{
              backgroundColor: "#282828",
              padding: 10,
              borderRadius: 30,
            }}
          >
            <Text style={{ fontSize: 15, color: "white" }}>Music</Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: "#282828",
              padding: 10,
              borderRadius: 30,
            }}
          >
            <Text style={{ fontSize: 15, color: "white" }}>
              Podcasts & Shows
            </Text>
          </Pressable>
        </View>

        <View style={{ height: 10 }} />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            style={{
              marginBottom: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              flex: 1,
              marginHorizontal: 10,
              marginVertical: 8,
              backgroundColor: "#202020",
              borderRadius: 4,
              elevation: 3,
            }}
          >
            <LinearGradient colors={["#33006F", "#FFFFFF"]}>
              <Pressable
                onPress={() => navigation.navigate("Liked")}
                style={{
                  width: 55,
                  height: 55,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AntDesign name="heart" size={24} color="white" />
              </Pressable>
            </LinearGradient>
            <Text
              style={{
                color: "white",
                fontSize: 13,
                fontWeight: "bold",
              }}
            >
              Liked Songs
            </Text>
          </Pressable>

          <View
            style={{
              marginBottom: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              flex: 1,
              marginHorizontal: 10,
              marginVertical: 8,
              backgroundColor: "#202020",
              borderRadius: 4,
              elevation: 3,
            }}
          >
            <Image
              style={{
                width: 55,
                height: 55,
              }}
              source={{ uri: "https://i.pravatar.cc/100" }}
            />
            <View style={styles.randomArtist}>
              <Text
                style={{ color: "white", fontSize: 13, fontWeight: "bold" }}
              >
                Hiphop Tamhiza
              </Text>
            </View>
          </View>
        </View>

        <FlatList
          data={recentlyPlayed}
          renderItem={renderTracks}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ flexGrow: 1 }}
        />

        <Text
          style={{
            color: "white",
            fontSize: 19,
            fontWeight: "bold",
            marginHorizontal: 10,
            marginTop: 10,
          }}
        >
          Your Top Artists
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {topArtists?.map((item, index) => (
            <ArtistCard item={item} key={index} />
          ))}
        </ScrollView>

        <View style={{ height: 10 }} />

        <Text
          style={{
            color: "white",
            fontSize: 19,
            fontWeight: "bold",
            marginHorizontal: 10,
            marginTop: 10,
          }}
        >
          Recently Played
        </Text>

        <FlatList
          data={recentlyPlayed}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <RecentlyPlayedCard item={item} key={index} />
          )}
          contentContainerStyle={{ flexGrow: 1 }}
        />

        <CurrentlyPlaying song={currentSong} />
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});

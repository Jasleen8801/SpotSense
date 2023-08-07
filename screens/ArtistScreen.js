import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const ArtistScreen = () => {
  const [albums, setAlbums] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const artist = route?.params.item;
  const artistId = route?.params.item?.id;

  const getArtistsAlbums = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/artists/${artistId}/albums`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // console.log(response.data);
      setAlbums(response.data.items);
    } catch (error) {
      console.log(error);
    }
  };

  const getTopTracks = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=ES`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // console.log(response.data);
      setTopTracks(response.data.tracks);
    } catch (error) {
      console.log(error);
    }
  };

  const getRelatedArtists = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // console.log(response.data);
      setRelatedArtists(response.data.artists);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getArtistsAlbums();
    getTopTracks();
    getRelatedArtists();
  }, []);

  function formatDuration(durationMs) {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = ((durationMs % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 40 }}>
        <View>
          <Image
            style={{
              width: "100%",
              height: 220,
              position: "relative",
            }}
            source={{ uri: artist?.images[0].url }}
          />
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              justifyContent: "flex-end",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                color: "#ccc",
                fontSize: 50,
                fontWeight: "600",
                marginLeft: 10,
              }}
            >
              {artist?.name}
            </Text>
            <Pressable
              onPress={() => navigation.goBack()}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                margin: 20,
              }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>
          </View>
        </View>

        <View
          style={{
            width: "100%",
            height: 10,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <View
            style={{
              width: `${artist?.popularity}%`,
              height: "100%",
              backgroundColor: "#FF6B6B",
            }}
          />
        </View>

        <View style={{ height: 20 }} />

        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "500",
            marginHorizontal: 12,
          }}
        >
          Top Tracks
        </Text>

        <View style={{ paddingHorizontal: 12, marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {topTracks.map((item, index) => (
              <View
                key={index}
                style={{
                  width: "48%",
                  marginBottom: 20,
                }}
              >
                <Image
                  source={{
                    uri:
                      item?.album?.images[0]?.url ||
                      "https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=800",
                  }}
                  style={{ width: "100%", height: 200, borderRadius: 8 }}
                  resizeMode="cover"
                />
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "500",
                    marginTop: 10,
                  }}
                  numberOfLines={1}
                >
                  {item?.name}
                </Text>
                <Text
                  style={{
                    color: "gray",
                    fontSize: 14,
                    marginTop: 5,
                  }}
                  numberOfLines={1}
                >
                  {item?.album?.name}
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 14,
                    marginTop: 5,
                  }}
                >
                  {formatDuration(item?.duration_ms)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />

        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "500",
            marginHorizontal: 12,
          }}
        >
          Top Albums
        </Text>

        <ScrollView horizontal style={{ paddingHorizontal: 12, marginTop: 10 }}>
          {albums.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => console.log("Album pressed:", item.name)}
              style={{
                marginRight: 10,
                width: 150,
              }}
            >
              <Image
                source={{ uri: item?.images[0]?.url }}
                style={{
                  width: "100%",
                  height: 150,
                  borderRadius: 8,
                }}
                resizeMode="cover"
              />
              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: "500",
                  marginTop: 5,
                }}
                numberOfLines={1}
              >
                {item?.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={{ height: 20 }} />

        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "500",
            marginHorizontal: 12,
          }}
        >
          Related Artists
        </Text>

        <ScrollView horizontal style={{ paddingHorizontal: 12, marginTop: 10 }}>
          {relatedArtists.map((item, index) => (
            <Pressable
              key={index}
              onPress={() =>
                navigation.navigate("Artist", {
                  item: item,
                })
              }   
              style={{
                marginRight: 20,
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: item?.images[0]?.url }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                }}
                resizeMode="cover"
              />
              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: "500",
                  marginTop: 5,
                  textAlign: "center",
                  maxWidth: 100,
                }}
                numberOfLines={2}
              >
                {item?.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </ScrollView>
    </LinearGradient>
  );
};

export default ArtistScreen;

const styles = StyleSheet.create({});

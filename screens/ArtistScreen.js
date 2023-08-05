import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

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
      //   console.log(response.data);
      setAlbums(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getTopTracks = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    console.log(accessToken)
    try {
        console.log("working");
      const response = await axios.get(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(response.data);
      setTopTracks(response.data);
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
      //   console.log(response.data);
      setRelatedArtists(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getArtistsAlbums();
    getTopTracks();
    getRelatedArtists();
  }, []);

  return (
    <View>
      <Text>ArtistScreen</Text>
    </View>
  );
};

export default ArtistScreen;

const styles = StyleSheet.create({});

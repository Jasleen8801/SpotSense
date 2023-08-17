import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Player } from "../PlayerContext";
import { BottomModal, ModalContent } from "react-native-modals";
import { Audio } from "expo-av";
import { debounce } from "lodash";

import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
  FontAwesome,
  Feather,
} from "@expo/vector-icons";
import SongItem from "../components/SongItem";

const LikedSongsScreen = () => {
  const navigation = useNavigation();
  const value = useRef(0);
  const [input, setInput] = useState("");
  const [savedTracks, setSavedTracks] = useState([]);
  const { currentTrack, setCurrentTrack } = useContext(Player);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchedTracks, setSearchedTracks] = useState([]);

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
    await play(savedTracks[0]);
  };

  const play = async (nextTrack) => {
    // console.log(nextTrack);
    const preview_url = nextTrack?.track?.preview_url;
    try {
      if (currentSound) {
        await currentSound.stopAsync();
      }
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
      });
      const { sound, status } = await Audio.Sound.createAsync(
        {
          uri: preview_url,
        },
        {
          shouldPlay: true,
          isLooping: false,
        },
        onPlaybackStatusUpdate
      );
      // console.log("sound", status);
      onPlaybackStatusUpdate(status);
      setCurrentSound(sound);
      setIsPlaying(status.isLoaded);
      await sound.playAsync();
    } catch (error) {
      console.log(error);
    }
  };

  const onPlaybackStatusUpdate = async (status) => {
    // console.log(status);
    if (status.isLoaded && status.isPlaying) {
      const progress = status.positionMillis / status.durationMillis;
      // console.log(progress);
      setProgress(progress);
      setCurrentTime(status.positionMillis);
      setTotalDuration(status.durationMillis);
    }
    if (status.didJustFinish === true) {
      setCurrentSound(null);
      playNextTrack();
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handlePlayPause = async () => {
    if (currentSound) {
      if (isPlaying) {
        await currentSound.pauseAsync();
      } else {
        await currentSound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNextTrack = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      setCurrentSound(null);
    }
    value.current += 1;
    if (value.current < savedTracks.length) {
      const nextTrack = savedTracks[value.current];
      setCurrentTrack(nextTrack);
      // extractColors();
      await play(nextTrack);
    } else {
      console.log("end of playlist");
    }
  };

  const playPreviousTrack = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      setCurrentSound(null);
    }
    value.current -= 1;
    if (value.current < savedTracks.length) {
      const nextTrack = savedTracks[value.current];
      setCurrentTrack(nextTrack);

      await play(nextTrack);
    } else {
      console.log("end of playlist");
    }
  };

  const debouncedSearch = debounce(handleSearch, 800);
  function handleSearch(text) {
    const filteredTracks = savedTracks.filter((item) =>
      item.track.name.toLowerCase().includes(text.toLowerCase())
    );
    setSearchedTracks(filteredTracks);
  }

  const handleInputChange = (text) => {
    setInput(text);
    debouncedSearch(text);
  };

  useEffect(() => {
    if (savedTracks.length > 0) {
      handleSearch(input);
    }
  }, [savedTracks]);

  return (
    <>
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
                onChangeText={(text) => handleInputChange(text)}
                placeholder="In Liked Songs?"
                placeholderTextColor={"white"}
                style={{ fontWeight: "500", color: "white" }}
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

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
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

          {searchedTracks.length === 0 ? (
            <ActivityIndicator size="large" color="gray" /> // Show a loading indicator while data is being fetched
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={searchedTracks}
              renderItem={({ item }) => (
                <SongItem
                  item={item}
                  onPress={play}
                  isPlaying={item === currentTrack}
                />
              )}
            />
          )}
        </ScrollView>
      </LinearGradient>

      {currentTrack && (
        <Pressable
          onPress={() => setModalVisible(!modalVisible)}
          style={{
            backgroundColor: "#390256",
            width: "90%",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: 15,
            position: "absolute",
            borderRadius: 6,
            left: 20,
            bottom: 10,
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image
              style={{ width: 40, height: 40 }}
              source={{ uri: currentTrack?.track?.album?.images[0].url }}
            />
            <Text
              numberOfLines={1}
              style={{
                fontSize: 13,
                width: 220,
                color: "white",
                fontWeight: "bold",
              }}
            >
              {currentTrack?.track?.name} •{" "}
              {currentTrack?.track?.artists[0].name}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            {/* <MaterialIcons name="devices-other" size={24} color="white" /> */}
            <AntDesign name="heart" size={24} color="#1DB954" />
            <Pressable>
              <AntDesign name="pause" size={24} color="white" />
            </Pressable>
          </View>
        </Pressable>
      )}

      <BottomModal
        visible={modalVisible}
        onHardwareBackPress={() => setModalVisible(false)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
      >
        <ModalContent
          style={{ height: "100%", width: "100%", backgroundColor: "#390256" }}
        >
          <View style={{ height: "100%", width: "100%", marginTop: 40 }}>
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <AntDesign
                name="down"
                size={24}
                color="white"
                onPress={() => setModalVisible(!modalVisible)}
              />
              <Text
                style={{ fontSize: 14, fontWeight: "bold", color: "white" }}
              >
                {currentTrack?.track?.name}
              </Text>
              <Entypo name="dots-three-vertical" size={24} color="white" />
            </Pressable>

            <View style={{ height: 80 }} />

            <View style={{ padding: 10 }}>
              <Image
                style={{ width: "100%", height: 330, borderRadius: 4 }}
                source={{ uri: currentTrack?.track?.album?.images[0].url }}
              />
              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text
                    style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
                  >
                    {currentTrack?.track?.name}
                  </Text>
                  <Text style={{ color: "#D3D3D3", marginTop: 4 }}>
                    {currentTrack?.track?.artists[0].name}
                  </Text>
                </View>
                <AntDesign name="heart" size={24} color="#1DB954" />
              </View>

              <View style={{ marginTop: 10 }}>
                <View
                  style={{
                    width: "100%",
                    marginTop: 10,
                    height: 3,
                    backgroundColor: "gray",
                    borderRadius: 5,
                  }}
                >
                  <View
                    style={[
                      styles.progressbar,
                      { width: `${progress * 100}%` },
                    ]}
                  />
                  <View
                    style={[
                      {
                        position: "absolute",
                        top: -5,
                        width: 12,
                        height: 12,
                        borderRadius: 12 / 2,
                        backgroundColor: "white",
                      },
                      {
                        left: `${progress * 100}%`,
                        marginLeft: -12 / 2,
                      },
                    ]}
                  />
                </View>

                <View
                  style={{
                    marginTop: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 15, color: "#D3D3D3" }}
                  >
                    {formatTime(currentTime)}
                  </Text>
                  <Text
                    style={{ color: "white", fontSize: 15, color: "#D3D3D3" }}
                  >
                    {formatTime(totalDuration)}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 17,
                }}
              >
                <Pressable>
                  <FontAwesome name="arrows" size={30} color="#03C03C" />
                </Pressable>
                <Pressable onPress={playPreviousTrack}>
                  <Ionicons name="play-skip-back" size={30} color="white" />
                </Pressable>
                <Pressable onPress={handlePlayPause}>
                  {isPlaying ? (
                    <AntDesign name="pausecircle" size={60} color="white" />
                  ) : (
                    <Pressable
                      onPress={handlePlayPause}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: "white",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Entypo name="controller-play" size={26} color="black" />
                    </Pressable>
                  )}
                </Pressable>
                <Pressable onPress={playNextTrack}>
                  <Ionicons name="play-skip-forward" size={30} color="white" />
                </Pressable>
                <Pressable>
                  <Feather name="repeat" size={30} color="#03C03C" />
                </Pressable>
              </View>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default LikedSongsScreen;

const styles = StyleSheet.create({
  progressbar: {
    height: "100%",
    backgroundColor: "white",
  },
});

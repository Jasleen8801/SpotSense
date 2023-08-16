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
import { Audio } from "expo-av";
import axios from "axios";
import { NGROK_URL } from "@env";

const Assistant = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [currentDeviceId, setCurrentDeviceId] = useState("");
  const [isShuffleOn, setIsShuffleOn] = useState(false);

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
    // console.log(NGROK_URL);
    getProfile();
    getCurrentDeviceID();
  }, []);

  const startRecording = async () => {
    const status = await Audio.requestPermissionsAsync();
    if (status.status != "granted") return;

    setIsRecording(true);
    const recording = new Audio.Recording();
    try {
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
    } catch (error) {
      console.log(error);
    }
    setRecording(recording);
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
    } catch (error) {
      console.log(error);
    }
    setIsRecording(false);
    setRecording(null);

    const uri = await recording.getURI();
    let uriParts = uri.split(".");
    let fileType = uriParts[uriParts.length - 1];
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: `recording.${fileType}`,
      type: `audio/x-${fileType}`,
    });

    try {
      console.log(`${NGROK_URL}/transcribe`);
      const response = await fetch(`${NGROK_URL}/transcribe`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const json = await response.json();
      setTranscription(json.data);
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }
  };

  // const testApi = async () => {
  //   const dataToSend = { key: "value" };

  //   try {
  //     console.log(`${NGROK_URL}/test`);
  //     const response = await axios.post(`${NGROK_URL}/test`, dataToSend, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     console.log(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getCurrentDeviceID = async () => {
    // not really needed :(
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/player?market=ES",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // console.log(response.data.device);
      if (response.data.is_playing) {
        setCurrentDeviceId(response.data.device.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResumePlayback = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const response = await axios.put(
        "https://api.spotify.com/v1/me/player/play",
        null,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        console.log("Response Status:", error.response.status);
        console.log("Response Data:", error.response.data);
      } else {
        console.log("Error:", error.message);
      }
    }
  };

  const handlePausePlayback = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    // console.log(accessToken);
    try {
      const response = await axios.put(
        "https://api.spotify.com/v1/me/player/pause",
        null,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // console.log(response.data);
    } catch (error) {
      if (error.response) {
        console.log("Response Status:", error.response.status);
        console.log("Response Data:", error.response.data);
      } else {
        console.log("Error:", error.message);
      }
    }
  };

  const handleNextTrack = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    // console.log(accessToken);
    try {
      const response = await axios.post(
        "https://api.spotify.com/v1/me/player/next",
        null,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      if (error.response) {
        console.log("Response Status:", error.response.status);
        console.log("Response Data:", error.response.data);
      } else {
        console.log("Error:", error.message);
      }
    }
  };

  const handlePreviousTrack = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    // console.log(accessToken);
    try {
      const response = await axios.post(
        "https://api.spotify.com/v1/me/player/previous",
        null,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      if (error.response) {
        console.log("Response Status:", error.response.status);
        console.log("Response Data:", error.response.data);
      } else {
        console.log("Error:", error.message);
      }
    }
  };

  const handleSetRepeat = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const response = await axios.put(
        "https://api.spotify.com/v1/me/player/repeat?state=context",
        null,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      if (error.response) {
        console.log("Response Status:", error.response.status);
        console.log("Response Data:", error.response.data);
      } else {
        console.log("Error:", error.message);
      }
    }
  };

  const handleToggleShuffle = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const response = await axios.put(
        `https://api.spotify.com/v1/me/player/shuffle?state=${isShuffleOn}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setIsShuffleOn(!isShuffleOn);
    } catch (error) {
      if (error.response) {
        console.log("Response Status:", error.response.status);
        console.log("Response Data:", error.response.data);
      } else {
        console.log("Error:", error.message);
      }
    }
  };

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
          onPressIn={startRecording}
          onPressOut={stopRecording}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Hold to Record</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.voiceButton}
          onPress={handleResumePlayback}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Play</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.voiceButton}
          onPress={handlePausePlayback}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Pause</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.voiceButton} onPress={handleNextTrack}>
          <Text style={{ color: "white", fontSize: 16 }}>Next Track</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.voiceButton}
          onPress={handlePreviousTrack}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Previous Track</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.voiceButton} onPress={handleSetRepeat}>
          <Text style={{ color: "white", fontSize: 16 }}>Repeat Mode</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleToggleShuffle}
          style={styles.voiceButton}
        >
          <Text style={{ color: "white", fontSize: 16 }}>
            Toggle Playback Shuffle: {isShuffleOn ? "On" : "Off"}
          </Text>
        </TouchableOpacity>

        <View style={styles.recognizedTextContainer}>
          <Text style={styles.recognizedText}>{transcription}</Text>
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

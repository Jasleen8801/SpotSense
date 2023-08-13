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
    getProfile();
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

    // const formData = new FormData();
    // formData.append("audioUri", {
    //   audioUri: recording.getURI(),
    //   name: "audio.3gp",
    //   type: "audio/3gp",
    // });
    // console.log(formData);

    const audioUri = recording.getURI();
    // const httpAudioUri = `http://${audioUri.replace("file://", "")}`;
    const dataToSend = { key: audioUri };

    try {
      console.log(`${NGROK_URL}/transcribe`);
      const response = await axios.post(`${NGROK_URL}/transcribe`, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // setTranscription(response.data.transcription);
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    // const dataToSend = { key: "value" };

    // try {
    //   console.log(`${NGROK_URL}/test`);
    //   const response = await axios.post(`${NGROK_URL}/test`, dataToSend, {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });
    //   console.log(response.data);
    // } catch (error) {
    //   console.log(error);
    // }
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

        <TouchableOpacity style={styles.voiceButton} onPress={startRecording}>
          <Text style={{ color: "white", fontSize: 16 }}>Start Recording</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.voiceButton} onPress={stopRecording}>
          <Text style={{ color: "white", fontSize: 16 }}>Stop Recording</Text>
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

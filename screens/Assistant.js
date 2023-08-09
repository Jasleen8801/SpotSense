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
import * as Permissions from "expo-permissions";
import { Audio } from "expo-av";
import { SpeechClient } from "@google-cloud/speech";
import path from "path";
import { getTranscription } from "../utils/getTranscription";

const recordingOptions = {
  android: {
    extension: ".m4a",
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: ".wav",
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};

const Assistant = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isRecording, setIsRecording] = useState(null);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [recognizedText, setRecognizedText] = useState("");

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

  const startRecording = async () => {
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    if (status !== "granted") return;

    setIsRecording(true);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: true,
    });

    const recording = new Audio.Recording();
    try {
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
    } catch (error) {
      console.log(error);
      stopRecording();
    }
    setRecording(recording);
    recording.setOnRecordingStatusUpdate((status) => {
      if (!status.isRecording) {
        setAudioUri(status.uri);
      }
    });
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
    if (audioUri) {
      const transcription = await getTranscription(audioUri);
      setRecognizedText(transcription);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

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

        <TouchableOpacity
          style={styles.voiceButton}
          onPress={stopRecording}
          disabled={!isRecording}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Stop Recording</Text>
        </TouchableOpacity>

        <View style={styles.recognizedTextContainer}>
          <Text style={styles.recognizedText}>{recognizedText}</Text>
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

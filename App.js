import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Navigation from "./StackNavigator";
import { PlayerContext } from "./PlayerContext";

export default function App() {
  return (
    <>
      <PlayerContext>
        <Navigation />
      </PlayerContext>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

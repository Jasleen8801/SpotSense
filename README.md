# SpotifyVoiceAssistantApp

SpotifyVoiceAssistantApp is a React Native Expo app that integrates with Spotify, allowing users to use a voice assistant to control their Spotify account.

## Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

### Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (https://nodejs.org/)
- npm (Node Package Manager, comes with Node.js)
- Expo CLI (https://docs.expo.dev/get-started/installation/)

### Installing

1. Clone the repository:

```bash
git clone https://github.com/Jasleen8801/SpotSense.git
cd SpotifyVoiceAssistantApp
```

2. Install project dependencies

```bash
npm install
```

3. Create a Spotify Developer Account

    - Go to the Spotify Developer Dashboard `https://developer.spotify.com/dashboard/applications`

    - Create a new Spotify App to obtain the following credentials:
        - Client ID
        - Redirect URI

4. Set up environment variables

    - Create a file named `.env` in the root directory of the project

    - Add the following environment variables to the `.env` file:
        - `SPOTIFY_CLIENT_ID=<your-client-id>`
        - `SPOTIFY_REDIRECT_URI=<your-redirect-uri>`
        - `SPOTIFY_CLIENT_SECRET=<your-client-secret>`


## Running the App

Start the Expo Development server:

```bash
expo start
```

In case of Windows Operating System, be sure to connect both your pc and mobile device on same internet connection.

In case of Linux distributions, use the following command and configure your system accordingly-

```bash
expo start --tunnel
```

You can run the app on your physical device using the Expo Go app or use an emulator/simulator.

### Built With

- React Native
- Expo
- expo-av 
- expo-web-browser
- expo-auth-session
- react-native-dotenv
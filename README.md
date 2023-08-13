# SpotSense

SpotSense is a React Native Expo app that integrates with Spotify, allowing users to use a voice assistant to control their Spotify account.

## Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

### Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (https://nodejs.org/)
- npm (Node Package Manager, comes with Node.js)
- Expo CLI (https://docs.expo.dev/get-started/installation/)
- ngrok (for exposing your local server to the internet)

### Setting Up the Project

1. Clone the repository:

    ```bash
    git clone https://github.com/Jasleen8801/SpotSense.git
    cd SpotSense
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

    - Create a file named `.env` in the root directory of the project and add the following environment variables to the `.env` file:
        ```bash
        SPOTIFY_CLIENT_ID=<your-client-id>
        SPOTIFY_REDIRECT_URI=<your-redirect-uri>
        SPOTIFY_CLIENT_SECRET=<your-client-secret>
        NGROK_URL=<your-ngrok-url>
        ```

    - Also create a `.env` file inside the `speech-api` directory and add the following environment variables to the `.env` file
        ```bash
        PROJECT_ID=<your-project-id>
        BUCKET_NAME=<your-bucket-name>
        ```

5. Set up Google Cloud Speech API

    - Create a Google Cloud Project and enable the Speech-to-Text API
    - Generate API credentials and download the JSON key file
    - Save the JSON key file as `google-cloud-credentials.json` in the `speech-api` directory of the project

6. To run the google speech-api, use `ngrok` using the following command, and copy the url to the .env file in root directory.

    ```bash
    ngrok http 3000
    ```

7. Run the speech-api by entering the following commands in the terminal:

    ```bash
    cd speech-api
    npm install
    npm start
    ```

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

Please note that you need to replace `<your-client-id>`, `<your-redirect-uri>`, and `<your-client-secret>` with your actual Spotify credentials. Also, make sure you follow the Google Cloud Speech API setup instructions and place the `google-cloud-credentials.json` file in the speech-api directory.
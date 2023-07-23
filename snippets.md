1. useAuthRequest

```javascript
const [request, response, promptAsync] = useAuthRequest(
  {
    clientId: CLIENT_ID,
    scopes: [
      "user-read-email",
      "user-library-read",
      "user-top-read",
      "user-read-recently-played",
      "playlist-read-private",
      "playlist-read-collaborative",
      "playlist-modify-public",
      // "playlist-modify-private",
    ],
    usePKCE: false,
    redirectUri: REDIRECT_URL,
    clientSecret: CLIENT_SECRET,
  },
  discovery
);
```

2. handleAuth function

```javascript
const handleAuth = async () => {
  if (promptAsync) {
    const result = await promptAsync();
    console.log(result);

    if (result) {
      console.log("checkkk");
      const { code } = result.params;

      try {
        const authOptions = {
          url: "https://accounts.spotify.com/api/token",
          headers: {
            Authorization:
              "Basic " + base64.encode(CLIENT_ID + ":" + CLIENT_SECRET),
            "Content-Type": "application/x-www-form-urlencoded",
          },
          form: {
            grant_type: "client_credentials",
          },
          json: true,
          data: `grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URL}`,
        };
        const res = await axios.post(authOptions);
        console.log("chala ", res);
      } catch (error) {
        console.log(error);
      }

      const expirationDate = Date.now() + parseInt(expires_in) * 1000;

      if (code && expirationDate) {
        AsyncStorage.setItem("token", code);
        AsyncStorage.setItem("expirationDate", expirationDate.toString());
        navigation.navigate("Main");
      } else {
        console.error("Invalid access token or expiration date.");
      }
    } else {
      console.error("Authentication error:", result.error);
    }
  }
};
```

3. discovery

```javascript
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};
```

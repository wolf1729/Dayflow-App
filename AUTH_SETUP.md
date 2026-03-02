# Authentication Setup Guide (Firebase & Google Sign-In)

This document outlines the steps taken to configure Firebase Authentication and Google Sign-In in the Dayflow App.

## 1. Firebase Project Setup

1. Created a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Enabled the **Authentication** service and activated:
   - **Email/Password** provider
   - **Google** provider

## 2. React Native Firebase Configuration

1. Installed the core Firebase app module and Auth module:
   ```bash
   npm install @react-native-firebase/app @react-native-firebase/auth
   ```
2. Downloaded the `google-services.json` file from Firebase (Project Settings -> General -> Your Apps).
3. Placed `google-services.json` inside the `android/app/` directory of the React Native project.

## 3. Google Sign-In Configuration

1. Installed the `@react-native-google-signin/google-signin` package.
2. Retrieved the debug SHA-1 and SHA-256 fingerprints by running:
   ```bash
   cd android && ./gradlew signingReport
   ```
3. Added the SHA-1 and SHA-256 fingerprints to the Firebase Console under **Project settings -> Your apps -> SHA certificate fingerprints**.
4. **Crucial Step:** Downloaded a _new_ `google-services.json` file after adding the SHA fingerprints. This is required to ensure the `oauth_client` array is populated and correct authorization is granted.
5. Replaced the old one in `android/app/`.
6. Rebuilt the Android app for the configuration changes to take effect:
   ```bash
   npx react-native run-android
   # or npx expo run:android
   ```

## 4. Code Implementation Details

- Configured Google Sign-In `webClientId` inside the app component mounts before calling `GoogleSignin.signIn()`.
- The `webClientId` is the client ID ending in `apps.googleusercontent.com` paired with `client_type: 3` (Web client) found inside the downloaded `google-services.json` file or Firebase Authentication -> Sign-in method -> Google settings.

Example:

```javascript
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: "YOUR_WEB_CLIENT_ID_HERE",
  scopes: ["profile", "email"],
});
```

## Troubleshooting

- **DEVELOPER_ERROR during Google Sign-In:** This typically means the SHA-1 fingerprint is missing from the Firebase Console, or the `google-services.json` file lacks the updated `oauth_client` array configuration. Update fingerprints in Firebase, download the _new_ JSON file, and rebuild the app.

## 5. Logout Implementation Details

- To fully clear user sessions, you must sign out of both Firebase and Google Sign-In (if the user is signed in via Google).
- Example implementation:

```javascript
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const handleLogout = async () => {
  try {
    await auth().signOut(); // Firebase signout
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      await GoogleSignin.signOut(); // Google signout
    }
    // Navigate user back to Login screen
  } catch (error) {
    console.error("Logout error", error);
  }
};
```

## 6. Delete Account Implementation Details

- Users can permanently delete their accounts from the Profile Modal.
- Deletion requires a recent login. If `auth().currentUser.delete()` throws an `auth/requires-recent-login` error, the app prompts the user to log out and log back in to verify their identity.
- On successful deletion, the Google session is also signed out, and the user is redirected to the Login screen.

```javascript
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const executeDeleteAccount = async () => {
  try {
    const user = auth().currentUser;
    if (!user) return;

    await user.delete(); // Delete Firebase user

    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      await GoogleSignin.signOut(); // Google signout
    }
    // Navigate user back to Login screen
  } catch (error) {
    if (error.code === "auth/requires-recent-login") {
      // Prompt user to log out and re-authenticate
    }
  }
};
```

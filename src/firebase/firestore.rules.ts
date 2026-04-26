// Firestore Security Rules for Door Monitoring System
// Add these rules to your Firebase Console -> Firestore -> Rules

/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Door Events collection
    match /doorEvents/{eventId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Penalties collection
    match /penalties/{penaltyId} {
      // Users can read their own penalties
      allow read: if request.auth != null && 
                   request.auth.uid == resource.data.userId;
      // Only authenticated users can write
      allow write: if request.auth != null;
    }
    
    // Stations collection
    match /stations/{stationId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Users collection (if exists)
    match /users/{userId} {
      allow read: if request.auth != null;
      // Users can update their own profile
      allow write: if request.auth != null && 
                   request.auth.uid == userId;
    }
  }
}
*/

// Alternative: JSON format for Firebase CLI
export const firestoreRules = {
  rules: {
    ".read": "auth != null",
    ".write": "auth != null",
    doorEvents: {
      "$eventId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    },
    penalties: {
      "$penaltyId": {
        ".read": "auth != null && auth.uid == data.userId",
        ".write": "auth != null"
      }
    },
    stations: {
      "$stationId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}

// Deployment command:
// firebase deploy --only firestore:rules
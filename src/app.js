const express = require('express');
const path = require('path');
const admin = require('firebase-admin');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // For unique ID generation

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes to allow cross-origin requests
app.use(cors());

// Initialize Firebase Admin SDK with the service account key
const serviceAccount = require(path.join(__dirname, './keys/whack-e6a56-firebase-adminsdk-a4npq-1291a6e0d1.json'));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// API route to fetch "name" and "question" fields from Firestore
app.get('/api/questions', async (req, res) => {
    try {
        const questionsSnapshot = await db.collection('questions').get();
        const questions = questionsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        res.json(questions);
    } catch (error) {
        console.error('Error fetching data from Firestore:', error);
        res.status(500).json({ error: 'Error fetching data from Firestore' });
    }
});

// API route to generate a unique userId and save it in Firestore
app.get('/api/generateUserId', async (req, res) => {
    try {
        const userId = uuidv4(); // Generate a unique user ID

        // Save the new user document with a timestamp in Firestore
        await db.collection('users').doc(userId).set({
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.json({ userId });
    } catch (error) {
        console.error('Error creating user document:', error);
        res.status(500).json({ error: 'Error creating user document' });
    }
});

// Serve index.html for any other route to support client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

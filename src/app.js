const express = require('express');
const path = require('path');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin SDK with the service account key
const serviceAccount = require(path.join(__dirname, './keys/whack-e6a56-firebase-adminsdk-a4npq-1291a6e0d1.json'));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// API route to fetch "name" and "question" fields from Firestore
app.get('/api/questions', async (req, res) => {
    try {
        const questionsSnapshot = await db.collection('questions').get();
        const questions = [];
        questionsSnapshot.forEach(doc => {
            const data = doc.data();
            questions.push({ id: doc.id, question: data.question, text: data.text, name: data.name, });
        });
        res.json(questions);
    } catch (error) {
        console.error('Error fetching data from Firestore:', error);
        res.status(500).send('Error fetching data from Firestore');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

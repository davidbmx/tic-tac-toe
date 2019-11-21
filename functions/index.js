/* eslint-disable no-eq-null */
const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp();
const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.validateGames = functions.firestore.document('games/{gameId}').onUpdate((change, context) => {
    const changeData = change.after.data();
    // eslint-disable-next-line eqeqeq
    if (changeData.winner == 'null') {
        return change.after;
    }
    const ref = db.collection('scores').doc(changeData.winner.uid);
    return ref.get().then(snap => {
            if (snap.exists) {
                const data = snap.data();
                return snap.ref.update({
                    score: data.score + 1
                });
            }

            return ref.set({
                user: changeData.winner,
                score: 1,
                create: Date.now(),
                update: Date.now()
            });
        });
});
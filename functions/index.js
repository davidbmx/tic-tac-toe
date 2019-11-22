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
    const ref = db.collection('scores');
    return Promise.all([
        ref.doc(changeData.userX.uid).get(),
        ref.doc(changeData.userO.uid).get()
    ]).then(querys => {
        const promises = [];
        querys.forEach((item, index) => {
            if (item.exists) {
                const data = item.data();
                if (data.user.uid === changeData.winner.uid) {
                    promises.push(
                        item.ref.update({
                            socre: data.score + 1,
                            winner: data.winner + 1,
                            games: data.games + 1
                        })
                    );
                } else {
                    promises.push(
                        item.ref.update({
                            games: data.games + 1,
                            lost: data.lost + 1
                        })
                    );
                }
            } else {
                const user = index === 0 ? changeData.userX : changeData.userO;
                promises.push(
                    ref.doc(user.uid).set({
                        user: user,
                        score: user.uid === changeData.winner.uid ? 1 : 0,
                        winner: user.uid === changeData.winner.uid ? 1 : 0,
                        lost: user.uid === changeData.winner.uid ? 0 : 1,
                        games: 1,
                        create: Date.now(),
                        update: Date.now()
                    })
                );
            }
        });
        return Promise.all(promises);
    });
    
});
const firebase = require('../db');

const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        res.send(userCredential.user);
    } catch(error) {
        res.status(500).send(error.message);
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        res.send(userCredential.user);
    } catch(error) {
        res.status(500).send(error.message);
    }
}

const forgotpassword = async (req, res, next) => {
    try {
        const { email } = "sadmanahmed0@gmail.com";
        console.log("sadmanahmed0@gmail.com")
        await firebase.auth().sendPasswordResetEmail(email);
        res.status(200).send('sent');
    } catch(error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    register,
    login,
    forgotpassword
}
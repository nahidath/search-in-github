import express from "express";
import {MongoClient as MongoClient} from 'mongodb';
//require('dotenv').config();
const fetch = require("node-fetch");
const Users = require('./models/users');
const mongoose = require('mongoose');
const url = "mongodb+srv://iam:tototata@cluster0.lsevu.mongodb.net/usersGit?retryWrites=true&w=majority";
const dbName = 'usersGit';
let db = null;

MongoClient.connect(url, function(err, client) {
    console.log("Connecté à MongoDB");
    db = client.db(dbName);
});

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("connecté à Mongoose")
});

export function launch(port) {
    const application = express();

    application.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    application.get("/api/user/:username", async (req, res) => {
        //Step 0 - Check si le user exist dans la bdd
            //if true -> on recup de la bdd
            //if false ->Request Github API https://api.github.com/users/$USERNAME
            //          -> stocker en bdd puis l'envoyer en response

        const username = req.params.username;
        const users = await Users.findOne({username});
        try {
            if(!users){
                try{
                    const gitUrl = await fetch(`https://api.github.com/users/${username}`);
                    const resultFetch = await gitUrl.json();
                    res.send(resultFetch);
                }catch (e) {
                    console.log('Looks like there was a problem: ', e);
                }
            }else{
                res.json({users});
            }
        } catch (error) {
            res.status(500).send(error);
        }

    });


    application.listen(port, () => {
        console.log(`server started at http://localhost:${port}`);
    })
}

module.exports = {launch};
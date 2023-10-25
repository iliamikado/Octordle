import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { GameInfo, sequelize } from './db.js';
import cors from 'cors';
import https from 'https';
import fs from 'fs';

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
    res.send('I am alive');
})

app.post('/post_game', (req, res) => {
    console.log(req.body);
    const gameInfo = req.body;
    GameInfo.create(gameInfo);
});

const start = async () => {
    console.log(process.env);
    // let privateKey;
    // let certificate;

    // try {
    //     privateKey = fs.readFileSync('./privkey.pem', 'utf8');
    //     certificate = fs.readFileSync('./cert.pem', 'utf8');
    //     console.log(privateKey);
    //     console.log(certificate);
    // } catch (error) {
    //     console.log(error);
    // }

    try {
        await sequelize.authenticate();
        await sequelize.sync();
        // if (privateKey && certificate) {
        //     console.log('Start with certificate');
        //     https.createServer({
        //         key: privateKey,
        //         cert: certificate
        //     }, app).listen(PORT, () => {
        //         console.log(`Server started on port ${PORT}`);
        //     });
        // } else {
        //     console.log('Start without certificate');
        //     app.listen(PORT, () => {
        //         console.log(`Server started on port ${PORT}`);
        //     });
        // }
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (error) {
        console.log(error)
    }
}

start();
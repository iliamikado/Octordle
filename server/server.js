import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { GameInfo, sequelize } from './db.js';
import cors from 'cors';
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
    let privateKey;
    let certificate;
    try {
        privateKey = fs.readFileSync('/etc/letsencrypt/live/octordle-server.ru/privkey.pem');
        certificate = fs.readFileSync('/etc/letsencrypt/live/octordle-server.ru/cert.pem');
    } catch (e) {
        console.log(e);
    }

    try {
        await sequelize.authenticate();
        await sequelize.sync();
        if (privateKey && certificate) {
            console.log('Start with certificate');
            https.createServer({
                key: privateKey,
                cert: certificate
            }, app).listen(PORT, () => {
                console.log(`Server started on port ${PORT}`);
            });
        } else {
            console.log('Start without certificate');
            app.listen(PORT, () => {
                console.log(`Server started on port ${PORT}`);
            });
        }
    } catch (error) {
        console.log(error)
    }
}

start();
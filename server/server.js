import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { GameInfo, sequelize } from './db.js';
import cors from 'cors';

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
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (error) {
        console.log(error)
    }
}

start();
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { GameInfo, sequelize } from './db.js';
import { statistics } from './statistic.js';
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
    statistics.addTodaysGame(gameInfo);
    res.json(statistics.getStatForGame(gameInfo));
});

app.get('/get_game_stat', (req, res) => {
    res.json(statistics.getStatForGame(JSON.parse(req.query.game)));
})

const start = async () => {
    console.log(process.env);

    try {
        await sequelize.authenticate();
        await sequelize.sync();
        await statistics.setValues();

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (error) {
        console.log(error)
    }
}

start();
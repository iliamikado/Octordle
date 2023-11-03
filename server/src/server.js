import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { sequelize } from './db.js';
import { statistics } from './statistic.js';
import cors from 'cors';

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
    res.send('I am alive');
})

app.post('/post_game', async (req, res) => {
    const gameInfo = req.body;
    await statistics.addTodaysGame(gameInfo);
    res.json(await statistics.getStatForGame(gameInfo));
});

app.post('/post_start', async (req, res) => {
    console.log(req.body);
    const gameStart = req.body;
    await statistics.addStartedGame(gameStart);
    res.json({status: 200});
})

app.get('/get_game_stat', async (req, res) => {
    res.json(await statistics.getStatForGame(JSON.parse(req.query.game)));
})

app.get('/get_full_stat', async (req, res) => {
    console.log(req.query);
    res.json(await statistics.getFullStat(req.query.uuid));
})


const start = async () => {
    console.log(process.env);

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
import dotenv from 'dotenv';
dotenv.config({
    path: '../.env'
});
import express from 'express';
import { sequelize } from './db.js';
import { statistics } from './statistic.js';
import cors from 'cors';

const PORT = process.env.PORT || 5000;

const app = express();
const allowedOrigins = ['http://localhost:3000', 'https://iliamikado.github.io'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            return callback(new Error('CORS does not allow to access'), false);
        }
        return callback(null, true);
    }
}));
app.use(express.json());

app.get('/api/ping', (req, res) => {
    res.send('I am alive');
})

app.post('/api/post_game', async (req, res) => {
    const gameInfo = req.body;
    await statistics.addTodaysGame(gameInfo);
    res.json(await statistics.getStatForGame(gameInfo));
});

app.post('/api/post_start', async (req, res) => {
    console.log(req.body);
    const gameStart = req.body;
    await statistics.addStartedGame(gameStart);
    res.json({status: 200});
})

app.get('/api/get_game_stat', async (req, res) => {
    res.json(await statistics.getStatForGame(JSON.parse(req.query.game)));
})

app.get('/api/get_full_stat', async (req, res) => {
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
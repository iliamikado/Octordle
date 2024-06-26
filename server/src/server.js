import dotenv from 'dotenv';
dotenv.config({
    path: '../.env'
});
import express from 'express';
import { NewsWatch, sequelize } from './db.js';
import { statistics } from './statistic.js';
import { User, Device, News } from './db.js';
import cors from 'cors';
import { Op } from 'sequelize';

const PORT = process.env.PORT || 5000;

const app = express();
const allowedOrigins = ['http://localhost:3000', 'https://iliamikado.github.io', 'https://octordle.ru'];
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

app.post('/api/post_watched_news', async (req, res) => {
    const {uuid} = req.query
    NewsWatch.create({
        uuid
    })
})

app.get('/api/get_day_news', async (req, res) => {
    const day = new Date().toISOString().split('T')[0];
    const newsNumber = req.query.news_number ?? 0
    let allNews = await News.findAll({
        order: [['date', 'DESC']],
        where: {
            date: {
                [Op.lte]: day
            }
        }
    })
    console.log(allNews)
    const ans = {
        haveNext: false,
        news: null
    }
    if (allNews[0].dataValues.date === day) {
        ans.news = allNews[newsNumber].dataValues
        ans.haveNext = newsNumber < allNews.length - 1
    } else {
        if (newsNumber > 0) {
            ans.news = allNews[newsNumber - 1].dataValues
        }
        ans.haveNext = newsNumber < allNews.length
    }
    res.json(ans)
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
    res.json(await statistics.getFullStat(req.query.uuid, req.query.email));
})

app.post('/api/login', async (req, res) => {
    const {uuid, email, name} = req.query;

    const user = await User.findOne({ where: { email: email } });
    if (user) {
        user.name = name; 
        await user.save()
    }

    const exist = await Device.findAll({
        include: [{
            model: User,
            required: true,
            where: {
                email: email
            }
        }],
        where: {
            uuid: uuid
        }
    });
    if (exist.length > 0) {
        res.json({message: 'already linked'});
        return;
    }
    let id;
    if (user) {
        id = user.dataValues.id;
    } else {
        id = (await User.create({
            email: email,
            name: name
        })).dataValues.id
    }
    await Device.create({
        userId: id,
        uuid: uuid
    });
    console.log(id);
    res.json({message: 'link created'});
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
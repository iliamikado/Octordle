import { Device, GameInfo, StartedGame, User } from './db.js';

const START_DAY = 19612;

class Statistic {

    async addTodaysGame(game) {
        await GameInfo.create(game);
    }

    async addStartedGame(game) {
        await StartedGame.create(game);
    }

    async getStatForGame(game) {
        const day = Math.floor(Date.now() / 1000 / 60 / 60 / 24) - START_DAY;
        const games = (await GameInfo.findAll({where: {day}})).filter(({score}) => (score < 124));
        const startedGames = (await StartedGame.findAll({where: {day}}));
        let losers = startedGames.length;
        games.forEach(({score}) => {
            if (score > game.score) {
                losers--;
            }
        })
        const resp = {
            betterThan: Math.floor(losers * 100 / startedGames.length)
        }
        return resp;
    }

    async getFullStat(uuid, email) {
        const day = Math.floor(Date.now() / 1000 / 60 / 60 / 24) - START_DAY;
        return {
            today: await this.getFullStatForDay(uuid, day, email),
            yesterday: await this.getFullStatForDay(uuid, day - 1, email),
            personal: await this.getPersonalStat(uuid, email)
        }
    }

    async getPersonalStat(uuid, email) {
        const resp = {};
        let games = [];
        if (!email) {
            games = await GameInfo.findAll({
                where: {uuid}
            });
        } else {
            games = await this.getAllGamesForEmail(email);
        }
        games = games.map(x => (x.dataValues));
        console.log(games);
        resp.played = games.length;
        resp.scores = games.map(({day, score}) => ([day, score]));
        resp.average = Math.floor(games.reduce((x, {score}) => (x + score), 0) / games.length);
        return resp;
    }

    async getFullStatForDay(uuid, day, email) {
        const resp = {};
        const games = (await GameInfo.findAll({where: {day}})).map(x => (x.dataValues)).filter(({score}) => (score < 124));
        const startedGames = (await StartedGame.findAll({where: {day}}));
        resp.starts = startedGames.length;
        resp.finish = games.length;
        resp.average = Math.floor(games.reduce((sum, {score}) => (sum + score), 0) / games.length);
        resp.max = 0;
        resp.min = 10000;
        games.forEach(({score}) => {
            resp.max = Math.max(resp.max, score);
            resp.min = Math.min(resp.min, score);
        });
        games.sort((g1, g2) => (g1.score - g2.score));
        resp.median = games[Math.floor(games.length / 2)]?.score;

        const userGame = games.find(({uuid: id}) => (id === uuid));
        if (!userGame) {
            return resp;
        }
        resp.score = userGame.score;
        resp.place = [1, 0];
        let losers = startedGames.length;
        resp.timePlace = 1;
        games.forEach(({score, createdAt}) => {
            if (score > userGame.score) {
                resp.place[0]++;
                resp.place[1]++;
                losers--;
            } else if (score === userGame.score) {
                resp.place[1]++;
            }

            if (createdAt < userGame.createdAt) {
                resp.timePlace++;
            }

        });
        resp.betterThan = Math.floor(losers * 100 / startedGames.length);
        return resp;
    }

    async getAllGamesForEmail(email) {
        const games = [];
        console.log(email);
        const user = (await User.findAll({where: {email: email}}))[0];
        console.log(user);
        const devices = await Device.findAll({where: {userId: user.dataValues.id}});
        for (let {uuid} of devices) {
            console.log(uuid);
            games.push(...(await GameInfo.findAll({where: {uuid: uuid}})));
        }
        return games;
    }
}

export const statistics = new Statistic();
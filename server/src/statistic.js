import { GameInfo, StartedGame } from './db.js';

const START_DAY = 19612;

class Statistic {

    async addTodaysGame(game) {
        await GameInfo.create(game);
    }

    async addStartedGame(game) {
        await StartedGame.create(game);
    }

    async getStatForGame(game) {
        let losers = 0;
        const day = Math.floor(Date.now() / 1000 / 60 / 60 / 24) - START_DAY;
        const todayGames = await GameInfo.findAll({where: {day}});
        const uuidsSet = new Set(todayGames.map(({uuid}) => (uuid)));
        const startedGames = (await StartedGame.findAll({where: {day}})).filter(({uuid}) => (!uuidsSet.has(uuid))).filter(({score}) => (score < 124));

        todayGames.forEach(({score}) => {
            if (game.score >= score) {
                losers += 1;
            }
        });
        losers += startedGames.length;
        const resp = {};
        const n = todayGames.length + startedGames.length;
        if (n <= 1) {
            resp.betterThan = 100;
        } else {
            resp.betterThan = Math.floor(losers * 100 / n);
        }
        return resp;
    }

    async getFullStat(uuid) {
        const day = Math.floor(Date.now() / 1000 / 60 / 60 / 24) - START_DAY;
        const resp = {};
        return {
            today: await this.getFullStatForDay(uuid, day),
            yesterday: await this.getFullStatForDay(uuid, day - 1),
            personal: await this.getPersonalStat(uuid)
        }
    }

    async getPersonalStat(uuid) {
        const resp = {};
        const games = (await GameInfo.findAll({where: {uuid}})).map(x => (x.dataValues));
        console.log(games);
        resp.played = games.length;
        resp.scores = games.map(({day, score}) => ([day, score]));
        resp.average = Math.floor(games.reduce((x, {score}) => (x + score), 0) / games.length);
        resp.longestPeriod = 0;
        return resp;
    }

    async getFullStatForDay(uuid, day) {
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
        console.log(games);
        resp.median = games[Math.floor(games.length / 2)]?.score;

        const userGame = games.find(({uuid: id}) => (id === uuid));
        console.log(userGame);
        if (!userGame) {
            return resp;
        }
        resp.score = userGame.score;
        resp.place = [1, 0];
        let losers = startedGames.length;
        resp.timePlace = 1;
        console.log(userGame.createdAt);
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
}

export const statistics = new Statistic();
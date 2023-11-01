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
        const startedGames = (await StartedGame.findAll({where: {day}})).filter(({uuid}) => (!uuidsSet.has(uuid)));
        console.log(startedGames);
        

        todayGames.forEach(({score}) => {
            if (game.score >= score) {
                losers += 1;
            }
        });
        const resp = {};
        const n = todayGames.length;
        if (n <= 1) {
            resp.betterThan = 100;
        } else {
            resp.betterThan = Math.floor(losers * 100 / n);
        }
        return resp;
    }
}

export const statistics = new Statistic();
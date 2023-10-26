import { GameInfo, sequelize } from './db.js';

const START_DAY = 19612;

class Statistic {
    games = [];
    todayGames = [];
    today = Math.floor(Date.now() / 1000 / 60 / 60 / 24) - START_DAY;

    constructor() {
        setInterval(() => {
            const newDay = Math.floor(Date.now() / 1000 / 60 / 60 / 24) - START_DAY;
            if (newDay !== this.today) {
                this.today = newDay;
                this.setValues();
            }
        }, 10000);
    }

    async setValues() {
        this.games = (await GameInfo.findAll()).map(({dataValues: game}) => (game));
        this.todayGames = this.games.filter(game => (game.day === this.today));
        console.log(this.todayGames);
    }

    addTodaysGame(game) {
        this.games.push(game);
        this.todayGames.push(game);
    }

    getStatForGame(game) {
        let losers = 0;
        this.todayGames.forEach(({score}) => {
            if (game.score > score) {
                losers += 1;
            }
        });
        const resp = {};
        const n = this.todayGames.length;
        if (n <= 1) {
            resp.betterThan = 100;
        } else {
            resp.betterThan = Math.floor(losers * 100 / (n - 1));
        }
        return resp;
    }
}

export const statistics = new Statistic();
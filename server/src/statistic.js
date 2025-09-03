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
            personal: await this.getPersonalStat(uuid, email),
            leaderBoard: await this.getLeaderBoard(day, email)
        }
    }

    async getPersonalStat(uuid, email) {
        const today = Math.floor(Date.now() / 1000 / 60 / 60 / 24) - START_DAY;
        let games = [];
        if (!email) {
            games = await GameInfo.findAll({
                where: {uuid}
            });
        } else {
            games = await this.getAllGamesForEmail(email);
        }
        games = games.map(x => (x.dataValues));
        games = games.sort((a, b) => (a.day - b.day));
        const normGames = games.filter(({mode}) => (!mode));
        const sograGames = games.filter(({mode}) => (mode === 'sogra'));
        const resp = {
            standart: {
                count: normGames.length,
                average: Math.floor(normGames.reduce((x, {score}) => (x + score), 0) * 100 / (normGames.length ?? 1)) / 100,
                scores: normGames.map(({day, score, mode, createdAt}) => ({day, score, mode, createdAt})).filter(({day}) => (day >= today - 60)),
            },
            sogra: {
                count: sograGames.length,
                average: Math.floor(sograGames.reduce((x, {score}) => (x + score), 0) * 100 / (sograGames.length ?? 1)) / 100,
                scores: sograGames.map(({day, score, mode, createdAt}) => ({day, score, mode, createdAt})).filter(({day}) => (day >= today - 60)),
            }
        }
        // resp.played = games.length;
        // resp.average = Math.floor(games.reduce((x, {score}) => (x + score), 0) * 100 / games.length) / 100;
        // resp.scores = games.map(({day, score, mode, createdAt}) => ({day, score, mode, createdAt}));
        return resp;
    }

    async getFullStatForDay(uuid, day, email) {
        const resp = {};
        const games = (await GameInfo.findAll({where: {day}})).map(x => (x.dataValues)).filter(({score}) => (score < 124));
        const startedGames = (await StartedGame.findAll({where: {day}}));
        resp.starts = startedGames.length;
        resp.finish = games.length;
        resp.average = Math.floor(games.reduce((sum, {score}) => (sum + score), 0) * 100 / games.length) / 100;
        resp.max = 0;
        resp.min = 10000;
        games.forEach(({score}) => {
            resp.max = Math.max(resp.max, score);
            resp.min = Math.min(resp.min, score);
        });
        games.sort((g1, g2) => (g1.score - g2.score));
        resp.median = games[Math.floor(games.length / 2)]?.score;

        let userGame = games.find(({uuid: id, mode}) => (id === uuid && (mode == '' || mode == null)));
        if (userGame) {
            resp.standart = {}
            resp.standart.score = userGame.score;
            resp.standart.place = 1;
            let losers = startedGames.length;
            resp.standart.timePlace = 1;
            games.filter(({mode}) => (mode == '' || mode == null)).forEach(({score, createdAt}) => {
                if (score > userGame.score) {
                    resp.standart.place++;
                    losers--;
                } else if (score === userGame.score && createdAt < userGame.createdAt) {
                    resp.standart.place++;
                }

                if (createdAt < userGame.createdAt) {
                    resp.standart.timePlace++;
                }

            });
            resp.standart.betterThan = Math.floor(losers * 100 / startedGames.length);
        }

        userGame = games.find(({uuid: id, mode}) => (id === uuid && mode == 'sogra'));
        if (userGame) {
            resp.sogra = {}
            resp.sogra.score = userGame.score;
            resp.sogra.place = 1;
            let losers = startedGames.length;
            resp.sogra.timePlace = 1;
            games.filter(({mode}) => mode == 'sogra').forEach(({score, createdAt}) => {
                if (score > userGame.score) {
                    resp.sogra.place++;
                    losers--;
                } else if (score === userGame.score && createdAt < userGame.createdAt) {
                    resp.sogra.place++;
                }

                if (createdAt < userGame.createdAt) {
                    resp.sogra.timePlace++;
                }

            });
            resp.sogra.betterThan = Math.floor(losers * 100 / startedGames.length);
        }
        return resp;
    }

    async getAllGamesForEmail(email) {
        const games = [];
        const user = (await User.findAll({where: {email: email}}))[0];
        const devices = await Device.findAll({where: {userId: user.dataValues.id}});
        for (let {uuid} of devices) {
            console.log(uuid);
            games.push(...(await GameInfo.findAll({where: {uuid: uuid}})));
        }
        const repeatedGames = new Map();
        const ans = [];
        for (let i = 0; i < games.length; ++i) {
            const {day, score, mode} = games[i];
            if (repeatedGames.has(day + mode)) {
                if (score < ans[repeatedGames.get(day + mode)].dataValues.score) {
                    ans[repeatedGames.get(day + mode)] = games[i];
                }
            } else {
                repeatedGames.set(day + mode, ans.length);
                ans.push(games[i]);
            }
        }
        return ans;
    }

    async getLeaderBoard(day, userEmail) {
        const games = (await GameInfo.findAll({where: {day}, order: ["createdAt"]})).filter(({score}) => (score < 124));
        const users = (await User.findAll());
        const idToUser = new Map();
        for (let {id, name, email} of users) {
            idToUser.set(id, {name, email});
        }
        const devices = (await Device.findAll());
        const uuidToName = new Map();
        for (let {uuid, userId} of devices) {
            uuidToName.set(uuid, idToUser.get(userId));
        }
        const ans = [];
        const repeatedGames = new Map();
        for (let {score, uuid, tries, mode} of games) {
            mode = mode ?? '';
            if (uuidToName.has(uuid)) {
                if (repeatedGames.has(uuidToName.get(uuid).email + mode)) {
                    const gameId = repeatedGames.get(uuidToName.get(uuid).email + mode);
                    ans[gameId].score = Math.min(ans[gameId].score, score);
                } else {
                    repeatedGames.set(uuidToName.get(uuid).email + mode, ans.length);
                    ans.push({
                        name: uuidToName.get(uuid).name,
                        score,
                        users: uuidToName.get(uuid).email === userEmail,
                        allWords: tries.split(' ').indexOf('0') === -1,
                        tries,
                        mode
                    });
                }
            }
        }
        ans.sort((a, b) => (b.score - a.score));
        return ans;
    }
}

export const statistics = new Statistic();

import { Sequelize, DataTypes } from "sequelize";
import dotenv from 'dotenv';
dotenv.config({
    path: '../.env'
});

export const sequelize = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.POSTGRES_DOMAIN,
        port: process.env.POSTGRES_PORT
    }
);

export const GameInfo = sequelize.define('game_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    day: {type: DataTypes.INTEGER},
    words: {type: DataTypes.TEXT},
    tries: {type: DataTypes.TEXT},
    score: {type: DataTypes.INTEGER},
    uuid: {type: DataTypes.TEXT}
});

export const StartedGame = sequelize.define('started_game', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    day: {type: DataTypes.INTEGER},
    word: {type: DataTypes.TEXT},
    uuid: {type: DataTypes.TEXT}
});

export const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.TEXT},
    name: {type: DataTypes.TEXT}
});

export const Device = sequelize.define('device', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: {type: DataTypes.INTEGER},
    uuid: {type: DataTypes.TEXT}
});

User.hasMany(Device, {foreignKey: 'userId'})
Device.belongsTo(User, {foreignKey: 'userId'})

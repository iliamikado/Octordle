const url = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

export function postGameResult(result: {day: number, words: string, tries: string, score: number, uuid: string}) {
    return fetch(`${url}/post_game`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(result)
    }).then(data => (data.json()));
}

export function postStart(result: {day: number, word: string, uuid: string}) {
    return fetch(`${url}/post_start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(result)
    }).then(data => (data.json()));
}

export function getGameStat(result: {day: number, words: string, tries: string, score: number, uuid: string}) {
    return fetch(`${url}/get_game_stat?game=${JSON.stringify(result)}`).then(data => (data.json()));
}
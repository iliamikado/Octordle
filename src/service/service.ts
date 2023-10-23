const url = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
console.log(process.env.NEXT_PUBLIC_SERVER_URL);

export function postGameResult(result: {day: number, words: string, tries: string, score: number}) {
    console.log(process.env.NEXT_PUBLIC_SERVER_URL);
    fetch(`${url}/post_game`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(result)
    })
}
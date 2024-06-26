const url = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000') + '/api';

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

export function getFullStat(uuid: string, email?: string) {
    if (email) {
        return fetch(`${url}/get_full_stat?uuid=${uuid}&email=${email}`).then(data => data.json());
    }
    return fetch(`${url}/get_full_stat?uuid=${uuid}`).then(data => data.json());
}

export function getNews(lastNews: number) {
    return fetch(`${url}/get_news?lastNews=${lastNews}`).then(data => data.json());
}

export function getDayNews(newsNumber: number = 0) {
    return fetch(`${url}/get_day_news?news_number=${newsNumber}`).then(data => data.json());
}

export function sendWatchedNews(uuid: string) {
    fetch(`${url}/post_watched_news?uuid=${uuid}`, {
        method: 'POST',
    }).catch(e => {})
}

export function googleAuth() {
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    const form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);

    const redirect_uri = location.origin + location.pathname;

    const params: any = {
        'client_id': process.env.NEXT_PUBLIC_GOOGLE_ID,
        'redirect_uri': redirect_uri,
        'response_type': 'token',
        'scope': 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        'include_granted_scopes': 'true',
        'prompt': 'select_account'
    };
  
    for (const p in params) {
      const input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }
  
    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
}

export function getUserInfo(token: string) {
    return fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`).then(data => (data.json()));
}

export function linkEmailAndDevice(email: string, uuid: string, name: string) {
    return fetch(`${url}/login?uuid=${uuid}&email=${email}&name=${name}`, {
        method: 'POST'
    });
}
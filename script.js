const app = {};

app.activityURL = 'http://www.boredapi.com/api/activity/';
app.imageApiKey = `StpMdwFhlOwrb4d-Ed7owQCq6bx4QCDQv_8wgN4x3tc`;
app.gifApiKey = 'WZ5Osv7W0JPH1duyxCbrQWP789FKAXs3';
app.imageURL = `https://api.unsplash.com/search/photos`;
app.gifURL = 'https://api.giphy.com/v1/gifs/search';

let participants = 1;

async function getActivity() {
    // Bored API activity data
    const url = new URL(app.activityURL);
    url.search = new URLSearchParams({
        participants: `${participants}`
        })
    const activityDataObject = await fetch(url);
    const activity = await activityDataObject.json();
    console.log(activity)
    const activityString = activity.activity.split(' ');

    const longWord = activityString.filter(word => (word.length >= 3 && !word.includes(`'`)));
    const imageSearch = longWord.join(',');
    const gifSearch = longWord.join(' ');

    // Unsplash API image data, based on activity data returned
    const imageURL = new URL(app.imageURL);
    imageURL.search = new URLSearchParams({
        client_id: app.imageApiKey,
        query: imageSearch,
        per_page: 1,
        orientation: 'portrait'
        })
    const imageDataObject = await fetch(imageURL);
    const image = await imageDataObject.json();
    const imageSrc = await image.results[0].urls.full;
    const altDescription = await image.results[0].alt_description;
    console.log(imageSrc)

    // Giphy API data, based on activity data returned
    const gifURL = new URL(app.gifURL);
    gifURL.search = new URLSearchParams({
        api_key: app.gifApiKey,
        q: gifSearch,
        limit: 1,
        rating: 'pg',
        lang: 'en'
        })
    const gifDataObject = await fetch(gifURL);
    const gif = await gifDataObject.json();
    const gifSrc = await gif.data[0].embed_url;
    console.log(gifSrc)

//   return activity;
}

app.init = () => {
    getActivity();
}

app.init();
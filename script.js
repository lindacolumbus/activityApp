const app = {};

app.activityURL = 'http://www.boredapi.com/api/activity/';
app.imageApiKey = `StpMdwFhlOwrb4d-Ed7owQCq6bx4QCDQv_8wgN4x3tc`;
app.gifApiKey = 'WZ5Osv7W0JPH1duyxCbrQWP789FKAXs3';
app.imageURL = `https://api.unsplash.com/search/photos`;
app.gifURL = 'https://api.giphy.com/v1/gifs/search';

// user's radio input selection
app.radio = document.getElementsByName('numParticipants');
app.radioChoice = document.querySelector('.radioInput button');

app.startEventListener = () => {
    app.radioChoice.addEventListener('click', e => {
        // loop through the radio input values
        for (i = 0; i < app.radio.length; i++) {
            // once a radio input is selected, call the APIs
            if (app.radio[i].checked) {
                participants = app.radio[i].value;

                async function getActivity() {
                    // Bored API activity data
                    const url = new URL(app.activityURL);
                    url.search = new URLSearchParams({
                        participants: `${participants}`
                    })
                    const activityDataObject = await fetch(url);

                    // activity recommendation data
                    const activity = await activityDataObject.json();
                    console.log(activity)
                    // h2 activity recommendation string
                    const results = document.querySelector('.activityRecommendation');
                    results.innerText = activity.activity;
                
                    // format activity recommendation to use for the two API calls
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
                }
                getActivity()
            }
        }
    })
}

app.init = () => {
    app.startEventListener();
}

app.init();
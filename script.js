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
                    const longerWord = activityString.filter(word => (word.length >= 4 && !word.includes(`'`)));
                    const longestWord = activityString.filter(word => (word.length >= 5 && !word.includes(`'`)));

                    // only use the most relevant words for the image search API parameter
                    if (longestWord) {
                        imageSearch = longestWord.join(',');
                        gifSearch = longestWord.join(',');
                    } else if (longerWord) {
                        imageSearch = longerWord.join(',');
                        gifSearch = longerWord.join(',');
                    } else if (longWord) {
                        imageSearch = longWord.join(',');
                        gifSearch = longWord.join(',');
                    }
                
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
                    console.log(imageSearch)

                    // image changes based on activity recommendation and API data
                    const featureImage = document.querySelector('.image img')
                    featureImage.src = imageSrc;
                    featureImage.alt = altDescription;
                
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
                    const gifSrc = await gif.data[0].images.original.url;
                    const gifAlt = gif.data[0].title;

                    // gif changes based on activity recommendation and API data
                    const gifDiv = document.querySelector('.gif img');
                    gifDiv.src = gifSrc;
                    gifDiv.alt = gifAlt;
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
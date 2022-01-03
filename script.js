const app = {};

app.activityURL = 'http://www.boredapi.com/api/activity/';
app.imageApiKey = `StpMdwFhlOwrb4d-Ed7owQCq6bx4QCDQv_8wgN4x3tc`;
app.gifApiKey = 'WZ5Osv7W0JPH1duyxCbrQWP789FKAXs3';
app.results = document.querySelector('.activityRecommendation');
app.featureImageDiv = document.querySelector('.image');
app.featureImage = document.querySelector('.image img');
app.gifDiv = document.querySelector('.gif');
app.imageURL = `https://api.unsplash.com/search/photos`;
app.gifURL = 'https://api.giphy.com/v1/gifs/search';

// user's radio input selection
app.radio = document.getElementsByName('numParticipants');
app.radioChoice = document.querySelector('.radioInput button');
app.reset = document.querySelector('.reset');

app.startEventListener = () => {
    app.radioChoice.addEventListener('click', e => {
        // loop through the radio input values
        for (i = 0; i < app.radio.length; i++) {
            // once a radio input is selected, call the APIs
            if (app.radio[i].checked) {
                participants = app.radio[i].value;

                async function getActivity() {
                    const loader = `<div class="loading"><i class="fas fa-spinner fa-spin"></i></div>`;
                    app.results.innerHTML = loader;
                    app.featureImageDiv.innerHTML = loader;
                    app.gifDiv.innerHTML = loader;
                    // Bored API activity data
                    const url = new URL(app.activityURL);
                    url.search = new URLSearchParams({
                        participants: `${participants}`
                    })
                    const activityDataObject = await fetch(url);

                    // activity recommendation data
                    const activity = await activityDataObject.json();
                    // h2 activity recommendation string
                    app.results.innerText = activity.activity;

                    // format activity recommendation to use for the Unsplash API call
                    const activityData = activity.activity.split(' ');
                    const activityDataCopy = [...activityData];
                    const firstPropertyRemoved = activityData.splice(1, activityData.length);
                    const searchValue = firstPropertyRemoved.filter(word => (!word.includes(`'`) && !word.includes(`-`) && !word.includes('watch')));
                    const gifSearchValue = activityDataCopy.filter(word => (!word.includes(`Learn`)));
                    console.log(gifSearchValue)
                    const longWord = searchValue.filter(word => (word.length >= 3));
                    const longerWord = searchValue.filter(word => (word.length >= 4));

                    // only use the most relevant words for the Unsplash API parameter
                    if (searchValue.includes('living' && 'will')) {
                        imageSearch = 'legal, document';
                        gifSearch = 'legal document'
                    }
                    else if (searchValue.includes('local' && 'blood' && 'center')) {
                        imageSearch = 'donate, blood'
                    }
                    else if (longerWord) {
                        imageSearch = longerWord.join(',');
                    } else if (longWord) {
                        imageSearch = longWord.join(',');
                    } else {
                        imageSearch = activityDataCopy.join(',');
                        gifSearch = gifSearchValue.join(' ')
                    }

                    if (imageSearch === '') {
                        imageSearch = activity.activity;
                    }

                    if (activityDataCopy.length > 7) {
                        gifSearch = activityDataCopy.slice(0, 7).join(' ');
                    } else {
                        gifSearch = activity.activity;
                    }

                    console.log(imageSearch)
                    console.log(gifSearch)
               
                    // Unsplash API image data, based on activity data returned

                    // change feature image orientation based on screen size
                    let imageOrientation = 'portrait';
                    if (window.innerWidth <= 1250) {
                        imageOrientation = 'landscape'
                    } 

                    const imageURL = new URL(app.imageURL);
                    imageURL.search = new URLSearchParams({
                        client_id: app.imageApiKey,
                        query: imageSearch,
                        per_page: 1,
                        orientation: imageOrientation
                        })
                    const imageDataObject = await fetch(imageURL);
                    const image = await imageDataObject.json();
                    let imageSrc = await image.results[0].urls.full;
                    let altDescription = await image.results[0].alt_description;

                    if (image.results[0] === undefined) {
                        imageSrc = 'learn';
                        altDescription = 'learn'
                    }

                    // image changes based on activity recommendation and API data
                    app.featureImageDiv.innerHTML = `<img src="${imageSrc}" alt="${altDescription}">`
                
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
                    app.gifDiv.innerHTML = `<img src="${gifSrc}" alt="${gifAlt}">`
                }
                getActivity();
                app.reset.classList.toggle('hidden');
            }
        }
    })

    app.reset.addEventListener('click', e => {
        app.featureImage.src = 'https://images.unsplash.com/photo-1551818567-d49550a81408?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80';
        app.featureImage.alt = 'Woman lying on ground with a book covering her face';
        app.gifDiv.src = '';
        app.gifDiv.alt = '';
        app.results.innerText = '';
        app.reset.classList.toggle('hidden')
    })
}

app.init = () => {
    app.startEventListener();
}

app.init();
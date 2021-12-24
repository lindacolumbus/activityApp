const app = {};

app.activityURL = 'http://www.boredapi.com/api/activity/';
app.apiKey = `StpMdwFhlOwrb4d-Ed7owQCq6bx4QCDQv_8wgN4x3tc`;
app.imageURL = `https://api.unsplash.com/search/photos`;

let participants = 1;

// app.getActivity = (activity) => {
//     const url = new URL('http://www.boredapi.com/api/activity/');
//     url.search = new URLSearchParams({
//         participants: `${participants}`
//     })
//     fetch(url)
//         .then((response) => {
//             if (response.ok) {
//                 return response.json();
//             } else { 
//                 throw new Error(response.statusText)
//             }
//         })
//         .then((jsonResponse) => {
//             console.log(jsonResponse)
//             // weatherApp.displayTodaysData(jsonResponse);
//         })
//         .catch((error) => {
//             // Modal error display
//             if (error.message === `Not Found` || `Bad Request`) {
//                 weatherApp.modalErrorHandling();
//             }
//         })
// }

async function getActivity() {
    // Bored API activity data
    const url = new URL(app.activityURL);
    url.search = new URLSearchParams({
        participants: `${participants}`
        })
    const activityDataObject = await fetch(url);
    const activity = await activityDataObject.json();
    console.log(activity)
    // const activityString = activity.activity.split(' ');

    // const longWord = activityString.filter(word => (word.length >= 5 && !word.includes(`'`)));

    // const imageSearch = longWord.join(',');
    // console.log(imageSearch)

    const imageSearch = activity.activity.split(' ').join(',');
    console.log(imageSearch)



    // Unsplash API image data, based on activity data returned
    const imageURL = new URL(app.imageURL);
    imageURL.search = new URLSearchParams({
        client_id: app.apiKey,
        query: imageSearch,
        per_page: 1
        })
    const imageDataObject = await fetch(imageURL);
    const image = await imageDataObject.json();
    console.log(image.results[0].urls.full)

  return activity;
}


// async function getActivity(activity) {
//   const response = await fetch(`http://www.boredapi.com/api/activity/?participants=1/`)
//   const data = await response.json();
//   console.log(data)
//   return data;
// }

app.init = () => {
    getActivity();
}

app.init();
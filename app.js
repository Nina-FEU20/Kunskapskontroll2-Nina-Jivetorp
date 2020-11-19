// getting form, input & button 
const form = document.querySelector('form'); 
const input = document.querySelector('input')
const button = document.querySelector('.btn'); 

const apiKey = '63914e6a8dba041f35834506c757975b'

// creating eventlistener with submit event
form.addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    //Putting the users input into a variable that I can use in the URL. 
    let inputValue = input.value; 

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${inputValue}&units=metric&appid=${apiKey}`
     console.log(url); 

    // fetching the information from the API, returning a promise 
    fetch(url)
    .then((response) => {
          
        // errorhandling 
        if (response.status >= 200 && response.status < 300){
            return response.json()
        } 
        else if (response.status === 404) {
            throw 'City could not be found, try again!'
        } 
        else if (response.status === 401) {
            throw response.statusText; 
        } 

    })
    .then((data) => {
        
        // creating variables and assigning them the values that I want to display to the user
        let des = data.weather[0].description; 
        let iconCode = data.weather[0].icon; 
        let temp = data.main.temp; 
        let wind = data.wind.speed; 
        let hum = data.main.humidity; 

        // Calling the function that puts all information on the website, with above variables as arguments
        insertContent(inputValue, des, iconCode, temp, wind, hum);

        // function to change background img depending on temperature 
        changeBackground(temp);
         

        // function to be able to compare with another city
        compare(inputValue, des, temp, wind, hum); 

    })
    // Handling error if someone enters a city that doesnt exist. 
    .catch((err) => {
        handleError(err); 
        
        // resetting backgroundImage to original 
        let temp = 'error'
        changeBackground(temp); 

    })

    // Emptying the input so that we can enter a new city
    input.value = '';  
 })


function insertContent(c, d, i, t, w, h){
    // hämtar elementen dit jag vill få in all information
    let city = document.querySelector('.city'); 
    const description = document.querySelector('.description-text') 
    const icon = document.querySelector('.icon-img')
    const temperature = document.querySelector('.temp-text')
    const windspeed = document.querySelector('.wind-text')
    const humidity = document.querySelector('.humidity-text')
    
    // getting temperatur, wind and humidity titles
    let dataTitles = document.querySelectorAll('.data'); 
   
    // Making them all display block so they show on the side! 
    for(let i = 0; i < dataTitles.length; i++) {
        dataTitles[i].style.display = 'block'; 
    }
     // giving everything its text with the help of the parameters! 
     city.innerText = c; 
     description.innerText = d; 
     icon.src = `http://openweathermap.org/img/wn/${i}@2x.png`
     temperature.innerText = t + '°C'; 
     windspeed.innerText = w + ' m/s'; 
     humidity.innerText = h + '%'; 

     
     async function scale(){
        await animation(temperature, 1.5, 0);
        await animation(temperature, 1, 1000); 
    }
    
    scale(); 
}


// function to handle errors
function handleError(err){
    // Showing the user a message if they type a city that does not exist! 
    // let city = document.querySelector('.city'); 
    //     city.innerText = 'There is no city with this name, try again!'
        
        let city = document.querySelector('.city'); 
        city.innerText = err;

        // getting temp, wind and humidity again, so they dont show as the same time as the error message
        let dataTitles = document.querySelectorAll('.data'); 
        
        for(let i = 0; i < dataTitles.length; i++) {
            dataTitles[i].style.display = 'none'; 
        }

        // changing the icon img to sad earthglobe :( 
        const icon = document.querySelector('.icon-img')
        icon.src = "img/sad-earth.png"
        icon.style.marginTop = '1rem'; 
        
        // resetting description text
        const description = document.querySelector('.description-text')
        description.innerText = ''; 

        let compareContainer = document.querySelector('.compare-container');
        compareContainer.style.display = 'none'; 

        let compareText = document.querySelector('.compare-results');
        compareText.innerText = ''; 
}



// changing background depending on temperature
function changeBackground(temp){

    let background = document.querySelector('.container')

    if (temp < 0) {
        background.style.backgroundImage = 'url(img/snow.jpg)'; 
    }
    if (temp > 0 && temp < 10) {
        background.style.backgroundImage = 'url(/img/clouds.jpg)'; 
    } 
    else if (temp > 10 && temp < 20) {
        background.style.backgroundImage = 'url(/img/sunset.jpg)'; 
    } 
    else if (temp > 20) {
        background.style.backgroundImage = 'url(/img/sunsky.jpg)'; 
    }
    else if (temp === 'error') {
        background.style.backgroundImage = 'url(/img/sky.jpg)'; 
    }

}



// compare function 
function compare(c, d, t, w, h){

    // Shows a second input, where you can enter the city you would like to compare  
    let compareContainer = document.querySelector('.compare-container');
        compareContainer.style.display = 'block';

        async function scale(){
            await animation(compareContainer, 2, 2000);
            await animation(compareContainer, 1, 2000); 
        }
        
        scale(); 

    // reset the text everytime the user search for a new city(first one)
    let compareText = document.querySelector('.compare-results');
        compareText.innerText = ''; 

    let secondForm = document.querySelector('.second-form');
    let compareInput = document.querySelector('.compareInput')
    
    // adding eventlistener to second form
    secondForm.addEventListener('submit', function(e){
        e.preventDefault();

        // url with the user input, the city they want to compare
        let secondInput = compareInput.value; 

        let url = `http://api.openweathermap.org/data/2.5/weather?q=${secondInput}&units=metric&appid=${apiKey}`


    fetch(url)
        .then((response) => {
            if (response.status >= 200 && response.status < 300){
                return response.json()
            } 
            else if (response.status === 404) {
                throw 'City could not be found, try again!'
            } 
            else if (response.status === 401) {
                throw response.statusText; 
            } 
        })
        .then((data) => {

        // assigning the values to new variables
        let desCompare = data.weather[0].description;  
        let tempCompare = data.main.temp; 
        let windCompare = data.wind.speed; 
        let humCompare = data.main.humidity;
        
        // Compare temperature
        let tempResult; 
        if (tempCompare > t) {
            tempResult = `The temperature is ${(tempCompare - t).toFixed(2)}°C warmer in ${secondInput}`; 
        } 
        else if (tempCompare < t) {
            tempResult = `The temperature is ${(t - tempCompare).toFixed(2)}°C warmer in ${c}`
        }
        else if (tempCompare === t) {
            tempResult = `The temperature is the same in both cities!`
        }


        // Compare Humitidy 
        let humResult; 
        if (humCompare > h) {
            humResult = `The humidity is ${humCompare - h}% higher in ${secondInput}`; 
        } 
        else if (humCompare < h) {
            humResult = `The humidity is ${h - humCompare}% higher in ${c}`
        } 
        else if (humCompare === h) {
            humResult = `The humidity is the same in both cities!`
        }


        // putting togther the comparision text to show the user
        let compareString = `In ${secondInput} the description is "${desCompare}"\n while in ${c} it is "${d}". \n${tempResult}. \n The windspeed in ${secondInput} is ${windCompare}m/s, whilst in ${c} it is ${w}m/s. \n ${humResult}.`

        // adding the text to the DOM
        let compareText = document.querySelector('.compare-results');
        compareText.innerText = compareString; 

        // emptying input
        compareInput.value = ''; 

        })
        .catch((err) => {
            // If there is no city with entered name, show this message
            let compareText = document.querySelector('.compare-results');
            compareText.innerText = err; 
        }) 

    })

}


// Animation testing

const animation = (element, num, delay) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            element.style.transform = `scale(${num})`; 
            element.style.transition = `1s ease`;
            resolve();
        }, delay)
    })
}




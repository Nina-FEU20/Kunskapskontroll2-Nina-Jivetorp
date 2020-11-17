// hämtar form, input & button 
const form = document.querySelector('form'); 
const input = document.querySelector('input')
const button = document.querySelector('.btn'); 

const apiKey = '63914e6a8dba041f35834506c757975b'

// skapar eventlistener med submit 
form.addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    // Lägger användaren inputen i en variabel för att sedan använda i URL'en
    let inputValue = input.value; 

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${inputValue}&units=metric&appid=${apiKey}`

    // använder mig av fetch för att returnera ett promise, 
    // sedan json() för att göra om informationen till ett javascript-objekt. 
    fetch(url)
    .then((response) => response.json())
    .then((data) => {
        
        // tilldelar all information jag vill ha varsin variabel
        let des = data.weather[0].description; 
        let iconCode = data.weather[0].icon; 
        let temp = data.main.temp; 
        let wind = data.wind.speed; 
        let hum = data.main.humidity; 

        // Anropar funktion med argumenten jag vill få fram på sidan
        insertContent(inputValue, des, iconCode, temp, wind, hum);

        // function to change background img depending om temperature 
        changeBackground(temp); 

        // compare with another city
        compare(inputValue, des, temp, wind, hum); 

        // Shows the input  the compare city! 
        let compareContainer = document.querySelector('.compare-container');
        compareContainer.style.display = 'block'; 

    })
    // Handling error if someone enters a city that doesnt exist. 
    .catch((err) => {
        handleError(); 
        
        // resetting backgroundImage to original 
        let temp = 'error'
        changeBackground(temp); 

        let compareContainer = document.querySelector('.compare-container');
        compareContainer.style.display = 'none'; 

        let compareText = document.querySelector('.compare-results');
        compareText.innerText = ''; 

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
}


// function to handle errors
function handleError(){
    // Showing the user a message if they type a city that does not exist! 
    let city = document.querySelector('.city'); 
        city.innerText = 'There is no city with this name, try again!'
        
        // getting temp, wind and humidity again, so they dont show as the same time as the error message
        let dataTitles = document.querySelectorAll('.data'); 
        console.log(dataTitles); 
        
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

        let url = `http://api.openweathermap.org/data/2.5/weather?q=${secondInput}&units=metric&appid=63914e6a8dba041f35834506c757975b`


    fetch(url)
        .then((response) => response.json())
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
            compareText.innerText = 'There is no city with this name! Try again'; 
        }) 

    })

    
}
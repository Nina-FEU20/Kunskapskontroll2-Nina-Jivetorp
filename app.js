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

    })
    // Handling error if someone enters a city that doesnt exist. 
    .catch((err) => {
        handleError(); 
        
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
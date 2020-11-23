// getting form, input & button 
const form = document.querySelector('form');
const input = document.querySelector('input')
const button = document.querySelector('.btn');

const apiKey = '63914e6a8dba041f35834506c757975b'

// creating eventlistener with submit event
form.addEventListener('submit', function (e) {
    e.preventDefault();

    //Putting the users input into a variable that I can use in the URL. 
    let inputValue = input.value;
    
    let dl = document.querySelector('dl'); 
    if (dl) {
        dl.remove(); 
    }  

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${inputValue}&units=metric&appid=${apiKey}`

    // fetching the information from the API, returning a promise 
    fetch(url)
        .then((response) => {

            // errorhandling 
            if (response.status >= 200 && response.status < 300) {
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

                // taking the latitude and longitude from current city
                let lat = data.coord.lat;
                let lon = data.coord.lon; 
                
                // This is what I wanted to do, Make it optional if you wanted to see a seven day forecast or not.  B
                // But got a bug I could'nt figure out how to solve. Want to keep it here so I can come back to it in the future. 
                /* let clickMeText = document.querySelector('.seven-day-text'); 
                clickMeText.style.display = 'block'; 
                // selecting the HTML element I want to use for my eventlistener
                let clickMe = document.querySelector('.click');
                clickMe.addEventListener('click', function (e) {
                e.preventDefault();    */

                // declaring a variable to use so that my dl can only show once
                let onlyOnce = true; 
                
                // sending the above values to my sevenDays function 
                if (onlyOnce) {
                        sevenDays(lat, lon); 
                        onlyOnce = false;
                } 
            })
        // })
        // Handling error
        .catch((err) => {
            handleError(err);

            // resetting backgroundImage to original 
            let temp = 'error'
            changeBackground(temp);

        })

    // Emptying the input 
    input.value = '';
})




function insertContent(c, d, i, t, w, h) {
    // getting all HTML elements that I want to put the information in 
    let city = document.querySelector('.city');
    const description = document.querySelector('.description-text')
    const icon = document.querySelector('.icon-img')
    const temperature = document.querySelector('.temp-text')
    const windspeed = document.querySelector('.wind-text')
    const humidity = document.querySelector('.humidity-text')

    // getting temperature, wind and humidity titles
    let dataTitles = document.querySelectorAll('.data');

    icon.style.width = "150px"; 
    icon.style.margin = '0'; 

    // Making them all display block so they show on the side! 
    for (let i = 0; i < dataTitles.length; i++) {
        dataTitles[i].style.display = 'block';
    }
    // giving everything its text with the help of the parameters! 
    city.innerText = c;
    description.innerText = d;
    icon.src = `http://openweathermap.org/img/wn/${i}@2x.png`
    temperature.innerText = t + '°C';
    windspeed.innerText = w + ' m/s';
    humidity.innerText = h + '%';

    // calling my scale function on the temperature to make it go bigger, then smaller
    scale(temperature, 0, 1000);
}


// function to handle errors
function handleError(err) {

    let city = document.querySelector('.city');
    city.innerText = err;

    // getting temp, wind and humidity again, so they dont show as the same time as the error message
    let dataTitles = document.querySelectorAll('.data');

    for (let i = 0; i < dataTitles.length; i++) {
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

    let clickMeText = document.querySelector('.seven-day-text'); 
    clickMeText.style.display = 'none'; 
}



// changing background depending on temperature
function changeBackground(temp) {

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
function compare(c, d, t, w, h) {

    // Shows a second input, where you can enter the city you would like to compare  
    let compareContainer = document.querySelector('.compare-container');
    compareContainer.style.display = 'block';

    scale(compareContainer, 2000, 2000);

    // reset the text everytime the user search for a new city(first one)
    let compareText = document.querySelector('.compare-results');
    compareText.innerText = '';

    let secondForm = document.querySelector('.second-form');
    let compareInput = document.querySelector('.compareInput')

    // adding eventlistener to second form
    secondForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // url with the user input, the city they want to compare
        let secondInput = compareInput.value;

        let url = `http://api.openweathermap.org/data/2.5/weather?q=${secondInput}&units=metric&appid=${apiKey}`


        fetch(url)
            .then((response) => {

                if (response.status >= 200 && response.status < 300) {
                    return response.json()
                }
                // handling possible errors
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

                // Compare description
                let desResult; 
                if (desCompare === d) {
                    desResult = `The description is ${desCompare} in both cities!`; 
                } else {
                    desResult = `In ${secondInput} the description is "${desCompare}"\n while in ${c} it is "${d}".`; 
                }

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

                //Compare Wind
                let winResult; 
                if(windCompare > w) {
                    winResult = `The wind is ${windCompare - w}m/s faster in ${secondInput}`; 
                }
                else if (windCompare < w){
                    winResult = `The wind is ${w - windCompare}m/s faster in ${secondInput}`
                }
                else if (windCompare === w) {
                    winResult = `The windspeed is the same in both cities!`
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
                let compareString = `${desResult} \n${tempResult}. \n ${winResult} \n ${humResult}.`
                

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


// Animation to make element go bigger and then smaller again!
const animation = (element, num, delay) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            element.style.transform = `scale(${num})`;
            element.style.transition = `1s ease`;
            resolve();
        }, delay)
    })
}

// now using the animation function together with an async function! So I can call the animation function several times inside, and it happens in order thanks to the await keyword
async function scale(element, delayOne, delayTwo) {
    await animation(element, 2, delayOne);
    await animation(element, 1, delayTwo);
}


// my seven day forecast function! 
function sevenDays(lat, lon) {

        // this url uses latitude and longitude instead of cityname, so thats why I've taken those values from the already searched citys
        let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=63914e6a8dba041f35834506c757975b`


        fetch(url)
            .then(response => response.json())
            .then(data => { 
                    
                    // creating list and giving it a title
                    let dl = document.createElement('dl');
                    let titledt = document.createElement('dt')
                    titledt.innerText = 'Weather for the next \n seven days: ';
                    // selecting HTML element that I want to append the list to
                    let listBox = document.querySelector('.list-box') 
                    listBox.appendChild(dl); 
                    dl.appendChild(titledt); 
                    titledt.classList.add('first-dt')




                for (let i = 1; i < data.daily.length; i++) {
                    // creating all element that I need to show my message
                    let newDt = document.createElement('dt');
                    let newDd = document.createElement('dd');
                    let image = document.createElement('img');

                    // getting the "code" for the icon, and putting them in to the url for the image
                    let icon = data.daily[i].weather[0].icon;
                    image.src = `http://openweathermap.org/img/wn/${icon}@2x.png`
                    // giving it a class so I can style it in css
                    image.classList.add('daily-icon')

                    // giving the elements their innerTexts that shows to the user
                    newDt.innerText = `Day ${i}`;
                    newDd.innerText = `Temp day: ${data.daily[i].temp.day}°C, \n Temp night: ${data.daily[i].temp.night}°C \n Humidity: ${data.daily[i].humidity}% \n Windspeed: ${data.daily[i].wind_speed}m/s \n ${data.daily[i].weather[0].description}`
                    
                    // appending all elements
                    dl.appendChild(newDt);
                    newDt.appendChild(newDd);
                    newDd.appendChild(image)


                }
                //}
            })
   // })
}
async function showPosition(position) {
    const myLat = position.coords.latitude;
    const myLong = position.coords.longitude;
    console.log(myLat + " " + myLong);
    const fetchData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLong}&appid=0e7cad248cf0624ca5c6a4c0209368f1`);
    error_msg(fetchData);

}
async function fetchApi(loc) {
    const fetchData = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=0e7cad248cf0624ca5c6a4c0209368f1`);
    error_msg(fetchData);
}

async function error_msg(fetchData) {
    if (fetchData.statusText != 'OK') {
        document.getElementById('loading').style.display = 'none';
        let count = 0;
        const time_interval = setInterval(() => {
            document.getElementById('error-msg').style.display = 'block';
            count++;
            if (count == 6) {
                document.getElementById('error-msg').style.display = 'none';
                clearInterval(time_interval);
            }
        }, 1000);
        return true;
    } else {
        const jsonData = await fetchData.json();
        document.getElementById('loading').style.display = 'none';
        console.log(jsonData);
        console.log(jsonData.main.temp + " " + " " + jsonData.name + " " + jsonData.sys.country + " " + jsonData.weather[0].icon + " " + jsonData.weather[0].main);
        if (jsonData.weather[0].main == "Clear") {
            document.getElementById('img').src = "src/sun.gif";
        }
        else if (jsonData.weather[0].main == "Rain") {
            document.getElementById('img').src = 'src/rain.gif';
        } else if (jsonData.weather[0].main == "Clouds") {
            document.getElementById('img').src = 'src/clouds.gif';
        }
        document.getElementById('temp').textContent = (jsonData.main.temp - 273.15).toPrecision(3) + "°C";
        document.getElementById('mode').textContent = jsonData.weather[0].main;
        document.getElementById('loc').textContent = jsonData.name;
        document.getElementById('country').textContent = jsonData.sys.country;
        document.getElementById('output-window').classList.remove('opacity-0');
        document.getElementById('output-window').classList.add('opacity-1');
    }
}

async function error(err) {
    document.getElementById('return-info').style.display = 'none';
    switch (err.code) {
        case err.PERMISSION_DENIED:
            console.log('PERMISSION_DENIED');
            break;
        case err.UNKNOWN_ERROR:
            console.log('UNKNOWN_ERROR');
            break;
    }
}
window.onload = () => {
    console.log(navigator.geolocation.getCurrentPosition(showPosition, error));
    document.getElementById('return-info').style.display = 'block';
}


document.getElementById('know-location').addEventListener('click', () => {
    console.log(navigator.geolocation.getCurrentPosition(showPosition, error));
    document.getElementById('return-info').style.display = 'block';
})


document.getElementById('search-loc').addEventListener('click', () => {
    const loc = document.getElementById('get-location').value;
    document.getElementById('return-info').style.display = 'block';
    fetchApi(loc);
})


function on_focus() {
    document.getElementById('label').classList.remove('label');
    document.getElementById('label').classList.add('label_after');
}


const input_field = document.getElementById('get-location');
input_field.addEventListener('focusout', () => {
    const regex = new RegExp(/\s/);
    if (regex.test(input_field.value) || input_field.value == '') {
        input_field.value = '';
        document.getElementById('label').classList.remove('label_after');
        document.getElementById('label').classList.add('label');
    }
})


document.getElementById('close').addEventListener('click', () => {
    document.getElementById('output-window').classList.remove('opacity-1');
    document.getElementById('output-window').classList.add('opacity-0');
})

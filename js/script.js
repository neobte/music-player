"use strict";

const d = document;

// const songList = [
//     { id: 1, artist: "Eddie Santiago", title: "Antidoto y veneno", src: "audio/salsa/Eddie Santiago - Antidoto y veneno.m4a", duration: 318.453333 },
//     { id: 2, artist: "La inmensidad", title: "Ay que amor", src: "audio/salsa/La inmensidad - Ay que amor.mp3", duration: 234.053333 },
//     { id: 3, artist: "La Misma Gente", title: "Llego el final", src: "audio/salsa/La Misma Gente - Llego el final.m4a", duration: 343.562448 },
//     { id: 4, artist: "Los Hermanos Moreno", title: "Por alguien como tu", src: "audio/salsa/Los Hermanos Moreno - Por alguien como tu.m4a", duration: 215.073174 },
//     { id: 5, artist: "Nino Segarra", title: "Como amigos si, como amantes no", src: "audio/salsa/Nino Segarra - Como amigos si, como amantes no.mp3", duration: 286.30204 },
//     { id: 6, artist: "Nino Segarra", title: "Entre la espada y la pared", src: "audio/salsa/Nino Segarra - Entre la espada y la pared.mp3", duration: 344.166167 },
//     { id: 7, artist: "Nino Segarra", title: "Porque te amo", src: "audio/salsa/Nino Segarra - Porque te amo.m4a", duration: 306.96 },
//     { id: 8, artist: "Paquito Guzman", title: "Que voy a hacer sin ti", src: "audio/salsa/Paquito Guzman - Que voy a hacer sin ti.m4a", duration: 332.644331 },
//     { id: 9, artist: "Pedro Arroyo", title: "Todo me huele a ti", src: "audio/salsa/Pedro Arroyo - Todo me huele a ti.mp3", duration: 322.08399 },
//     { id: 10, artist: "The New York Band", title: "Nadie como tu", src: "audio/salsa/The New York Band - Nadie como tu.m4a", duration: 287.370158 },
//     { id: 11, artist: "Willie Gonzalez", title: "Hazme olvidarla", src: "audio/salsa/Willie Gonzalez - Hazme olvidarla.mp3", duration: 336.133333 },
//     { id: 12, artist: "Johnny Rojas", title: "Adicto a ti", src: "audio/salsa/Johnny Rojas - Adicto a ti.m4a", duration: 326.008117 },
//     { id: 13, artist: "Lalo Rodriguez", title: "Ven devorame otra vez", src: "audio/salsa/Lalo Rodriguez - Ven devorame otra vez.m4a", duration: 307.617959 },
//     { id: 14, artist: "Frankie Ruiz", title: "Tu con el", src: "audio/salsa/Frankie Ruiz - Tu con el.m4a", duration: 303.508027 },
//     { id: 15, artist: "David Pabon", title: "Aquel viejo motel", src: "audio/salsa/David Pabon - Aquel viejo motel.m4a", duration: 308.866666 },
//     { id: 16, artist: "La Misma Gente", title: "Tu y yo", src: "audio/salsa/La Misma Gente - Tu y yo.m4a", duration: 282.331428 },
//     { id: 17, artist: "La Misma Gente", title: "Llegaste tu", src: "audio/salsa/La Misma Gente - Llegaste tu.m4a", duration: 266.631836 },
//     { id: 18, artist: "El Gran Combo", title: "Amame", src: "audio/salsa/El Gran Combo - Amame.mp3", duration: 324.7607 },
//     { id: 19, artist: "Hector Lavoe", title: "Siento", src: "audio/salsa/Hector Lavoe - Siento.mp3", duration: 395.420833 },
//     { id: 20, artist: "3-2 Get Funky", title: "Si ya no estas", src: "audio/salsa/3-2 Get Funky - Si ya no estas.m4a", duration: 268.608435 },
// ];

// const totalSongs = songList.length;
// Ordenamos el listado de canciones por artista
// songList.sort((a, b) => a.artist > b.artist ? 1 : a.artist < b.artist ? -1 : 0);

// let songListCopy = [...songList];

let URL = `https://neobte.github.io/music-app/audio/salsa/playlist.json`;

let songList, songListCopy, totalSongs;

const audioPlayer = new Audio();

// Variables
let index = 0;

const songTitle = d.getElementById("song-title");
const parentElementOffsetWidth = songTitle.parentElement.offsetWidth;

const playPauseBtn = d.getElementById("play-pause-btn");
const [playIcon, pauseIcon] = [playPauseBtn.querySelector("#play"), playPauseBtn.querySelector("#pause")];

const forwardBtn = d.getElementById("forward-btn");

const backwardBtn = d.getElementById("backward-btn");
let timeoutID, isFirstClick = true;

const shuffleBtn = d.getElementById("shuffle-btn");
let isShuffle = false;

const repeatBtn = d.getElementById("repeat-btn");
const [repeatIcon, repeat1Icon] = [repeatBtn.querySelector("#repeat"), repeatBtn.querySelector("#repeat-1")];

const dataTable = d.getElementById("data-table");

const audioCurrentTimeSlider = d.getElementById("audio-current-time-slider");
const durationTime = d.getElementById("duration-time");
const currentTime = d.getElementById("current-time");

const volumeBtn = d.getElementById("volume-btn");
const [volumeHighIcon, volumeXmarkIcon] = [volumeBtn.querySelector("#volume-high"), volumeBtn.querySelector("#volume-xmark")];
const volumeSlider = d.getElementById("volume-slider");
const volumeDisplay = d.getElementById("volume-display");
let currentVolume = 1; // Volume 100 %

d.addEventListener("DOMContentLoaded", () => {
    init();
});

const init = () => {

    sendHttpRequest("GET", URL, null, handleResponse);

    // 3. Reseteamos los valores
    volumeSlider.value = 100;
    audioCurrentTimeSlider.value = 0;
    dataTable.parentElement.scrollTop = 0;
}

const handleResponse = response => {

    songList = JSON.parse(response);

    songListCopy = [...songList];

    totalSongs = songListCopy.length;

    if (index < totalSongs) {
        // 1. Cargamos el indice cero
        loadSong(songListCopy[index]);
    }
    // 2. Mostramos la lista de canciones
    displayRows(songListCopy);
}

const loadSong = song => {
    audioPlayer.src = `https://neobte.github.io/music-app/audio/salsa/${song.name}`;
    audioPlayer.dataset.songId = song.id;
    audioPlayer.load();

    const [artist, title] = song.name.slice(0, song.name.lastIndexOf('.')).split(" - ");
    songTitle.textContent = `🎵 ${artist} - ${title} 🎵`;

    if (songTitle.scrollWidth > parentElementOffsetWidth) {
        songTitle.style.animation = "slideIn 16s linear infinite";
    } else {
        songTitle.style.animation = "none";
    }

    // background: linear-gradient(to right, #6f0000, #200122);
    // https://uigradients.com
    d.body.style.background = `linear-gradient(to right, ${getRandomHexColor(32)}, ${getRandomHexColor(32)})`;
}

playPauseBtn.addEventListener("click", () => {
    if (audioPlayer.src === "") return;
    if (audioPlayer.paused) {
        audioPlayer.play();
        playIcon.style.display = "none";
        pauseIcon.style.display = "inline";
        playPauseBtn.title = "Pausar";
    } else {
        audioPlayer.pause();
        playIcon.style.display = "inline";
        pauseIcon.style.display = "none";
        playPauseBtn.title = "Reproducir";
    }
});

forwardBtn.addEventListener("click", () => {
    index = (index + 1) % totalSongs;
    if (!audioPlayer.paused) {
        loadSong(songListCopy[index]);
        audioPlayer.play();
    } else {
        loadSong(songListCopy[index]);
    }
    removeCssClass("playing");
    addCssClass("playing");
});

backwardBtn.addEventListener("click", () => {
    clearTimeout(timeoutID);
    if (audioPlayer.currentTime > 0 && isFirstClick) {
        audioPlayer.currentTime = 0;
        isFirstClick = false;
        timeoutID = setTimeout(() => {
            isFirstClick = true;
        }, 1000);
    }
    else if (!isFirstClick || audioPlayer.currentTime === 0) {
        index = (index - 1 + totalSongs) % totalSongs;
        if (!audioPlayer.paused) {
            loadSong(songListCopy[index]);
            audioPlayer.play();
        } else {
            loadSong(songListCopy[index]);
        }
        isFirstClick = true;
    }
    removeCssClass("playing");
    addCssClass("playing");
});

shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;
    // Cambiamos el color al elemento span, no al SVG
    shuffleBtn.style.color = isShuffle ? "#ff9800" : "currentColor";
    if (isShuffle) {
        // Encuentra el elemento pero no lo elimina del arreglo
        // const element = songListCopy .find(song => song.id == audioPlayer.dataset["songId"]);
        // Encuentra el elemento y lo extrae del arreglo
        const currentlyPlayingSong = songListCopy.splice(songListCopy.findIndex(song => song.id == audioPlayer.dataset['songId']), 1)[0];
        // Barajamos el arreglo sin la cancion actualmente en reproduccion
        songListCopy = shuffle(songListCopy);
        // Enviamos al principio la canción que esta actualmente en reproducción despues de la mezcla
        songListCopy.unshift(currentlyPlayingSong);
        // Seteamos el indice a cero correspondiente a la canción actualmente en reproduccion
        index = 0;

        shuffleBtn.title = "Desactivar orden aleatorio";
    } else {
        // Buscamos el índice en el array original
        index = songList.findIndex(song => song.id == audioPlayer.dataset['songId']);
        // Devolvemos el orden del array original
        songListCopy = [...songList];

        shuffleBtn.title = "Activar orden aleatorio";
    }

    if (index > -1) {
        removeCssClass("playing");
        addCssClass("playing");
    }
});

repeatBtn.addEventListener("click", () => {
    audioPlayer.loop = !audioPlayer.loop;
    if (audioPlayer.loop) {
        repeatIcon.style.display = "none";
        repeat1Icon.style.display = "inline";
        repeat1Icon.style.color = "#ff9800";
        repeatBtn.title = "Desactivar repetición indefinida";
    } else {
        repeatIcon.style.display = "inline";
        repeat1Icon.style.display = "none";
        repeat1Icon.style.color = "currentColor";
        repeatBtn.title = "Activar repetición indefinida";
    }
});

audioPlayer.addEventListener('ended', () => {
    if (index >= totalSongs - 1) {
        playIcon.style.display = "inline";
        pauseIcon.style.display = "none";
        return;
    }
    index++;
    loadSong(songListCopy[index]);
    audioPlayer.play();

    removeCssClass("playing");
    addCssClass("playing");
});

const displayRows = (rows) => {
    dataTable.textContent = "";
    const fragment = d.createDocumentFragment();
    rows.forEach((song, idx) => {
        const tr = d.createElement('tr');
        tr.dataset.id = song.id;
        // Create table cells (td) for each song property
        tr.innerHTML = `
                    <td>${idx + 1}.</td>
                    <td>${removeExtension(song.name)}</td>
                    <td>${formatTime(song.duration)}</td>`;

        if (idx === index && audioPlayer.src !== "") {
            tr.classList.add("playing");
        }

        tr.addEventListener('click', () => {
            removeCssClass("selected");
            tr.classList.add("selected");
        });

        tr.addEventListener("dblclick", () => {
            if (!isShuffle) index = idx;
            loadSong(song);
            audioPlayer.play();

            removeCssClass("playing");
            tr.classList.add("playing");

            playIcon.style.display = "none";
            pauseIcon.style.display = "inline";

            playPauseBtn.title = "Pausar";
        });

        fragment.appendChild(tr);
    });
    dataTable.appendChild(fragment);
}

audioPlayer.addEventListener("loadedmetadata", () => {
    currentTime.textContent = formatTime(audioPlayer.currentTime);
    durationTime.textContent = formatTime(audioPlayer.duration);
    audioCurrentTimeSlider.value = audioPlayer.currentTime;
    audioCurrentTimeSlider.max = audioPlayer.duration; // Ajustar el máximo de la barra de progreso
});

audioPlayer.addEventListener("timeupdate", () => {
    // Current time in seconds: example => 7.897868
    currentTime.textContent = formatTime(audioPlayer.currentTime);
    audioCurrentTimeSlider.value = audioPlayer.currentTime;
});

audioCurrentTimeSlider.addEventListener("input", () => {
    audioPlayer.currentTime = audioCurrentTimeSlider.value;
});

volumeSlider.addEventListener("input", () => {
    volumeDisplay.textContent = volumeSlider.value;
    audioPlayer.volume = volumeSlider.value / 100;
    if (volumeSlider.value === "0") {
        volumeHighIcon.style.display = "none";
        volumeXmarkIcon.style.display = "inline";
        audioPlayer.muted = true;
        currentVolume = .5; // 50 %
    } else {
        volumeXmarkIcon.style.display = "none";
        volumeHighIcon.style.display = "inline";
        audioPlayer.muted = false;
        currentVolume = volumeSlider.value / 100; //  Values are between 0 y 100
    }
});

volumeBtn.addEventListener("click", () => {
    audioPlayer.muted = !audioPlayer.muted;
    if (audioPlayer.muted) {
        audioPlayer.volume = 0;
        volumeSlider.value = 0;
        volumeHighIcon.style.display = "none";
        volumeXmarkIcon.style.display = "inline";
    } else {
        audioPlayer.volume = currentVolume; // Values are  between 0.1 and 1, where 1 = 100 %
        volumeSlider.value = currentVolume * 100; // Values are between 0 and 100
        volumeXmarkIcon.style.display = "none";
        volumeHighIcon.style.display = "inline";
    }
    volumeDisplay.textContent = volumeSlider.value;
});

const removeCssClass = (cssClass) => {
    const elt = dataTable.querySelector(`tr.${cssClass}`);
    if (elt) elt.classList.remove(cssClass);
}

const container = d.getElementById("play-list");
const addCssClass = (cssClass) => {
    const elt = dataTable.querySelector(`tr[data-id="${songListCopy[index].id}"]`);
    if (elt) {
        elt.classList.add(cssClass);
        container.scrollTop = elt.offsetTop - (container.clientHeight / 2) + (elt.offsetHeight / 2);
    }
}

// https://introcs.cs.princeton.edu/java/14array/Deck.java.html
const shuffle = arr => {
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        const r = i + parseInt(Math.random() * (len - i));
        [arr[i], arr[r]] = [arr[r], arr[i]];
    }
    return arr;
}

// Format time in hh:mm:ss or mm:ss
const formatTime = (seconds) => {
    seconds = Math.round(seconds); // 287.370158
    const hours = (seconds / 3600) | 0;  // Hours calculation
    const minutes = ((seconds % 3600) / 60) | 0;  // Minutes calculation
    const remainingSeconds = (seconds % 60);  // Whole seconds

    return hours > 0
        // Show hours:minutes:seconds format
        ? `${hours}:${/*minutes < 10 ? '0' + minutes : */minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`
        // Show minutes:seconds format
        : `${/*minutes < 10 ? '0' + minutes :*/ minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
}

const getRandomHexColor = (max = 256) => {
    if (0 > max || max > 256) return;
    return '#' +
        ((Math.random() * max) | 0).toString(16).padStart(2, '0') +
        ((Math.random() * max) | 0).toString(16).padStart(2, '0') +
        ((Math.random() * max) | 0).toString(16).padStart(2, '0');
}

// Send request
function sendHttpRequest(method, url, data, callback) {
    const xhr = getXhr();
    xhr.onreadystatechange = processRequest;
    function getXhr() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        } else {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    function processRequest() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200 && xhr.response != null) {
                if (callback) callback(xhr.response);
            } else {
                console.log("There was a problem retrieving the data: " + xhr.statusText);
            }
        }
    }
    xhr.open(method, url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime());
    xhr.onloadstart = function (e) { /*openLoader();*/ }
    xhr.onloadend = function (e) { /*closeLoader();*/ }
    if (data && !(data instanceof FormData)) xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
    xhr.onerror = function (e) { console.log("Error: " + e + " Could not load url."); }
}

const removeExtension = name => {
    // return name.slice(0, name.lastIndexOf("."));
    return name.split(".")[0];
}
console.log("lets write javascript");
let currFolder;
let currentSong = new Audio();
let songs;

async function getsongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
  songUL.innerHTML = ""; // Clear the current song list

  for (const song of songs) {
    songUL.innerHTML += `
      <li>
        <img class="invert" src="musicicon.svg" width="28px" alt="musicicon">
        <div class="info">
          <div>${song.replaceAll("%20", "")}</div>
        </div>
        <div class="playnow">
          <span>Play now</span>
          <img class="invert" src="play.svg" alt="play">
        </div>
      </li>`;
  }

  console.log(songs);

  // Reattach event listeners after updating the song list
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  return songs; // Return the fetched songs
}

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors= div.getElementsByTagName("a");
    let cardcontainer= document.querySelector(".cardcontainer");
    let array=Array.from(anchors)
    for(let index=0; index<array.length;index++){
        const e= array[index];
    
        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response);
            cardcontainer.innerHTML=cardcontainer.innerHTML+`<div data-folder="${folder}" class="card">
              <div class="play">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  shape-rendering="geometricPrecision"
                  text-rendering="geometricPrecision"
                  image-rendering="optimizeQuality"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  viewBox="0 0 512 512"
                  width="40px"
                  height="40px"
                >
                  <circle fill="#01A437" cx="256" cy="256" r="256" />
                  <path
                    fill="#42C76E"
                    d="M256 9.28c136.12 0 246.46 110.35 246.46 246.46 0 3.22-.08 6.42-.21 9.62C497.2 133.7 388.89 28.51 256 28.51S14.8 133.7 9.75 265.36c-.13-3.2-.21-6.4-.21-9.62C9.54 119.63 119.88 9.28 256 9.28z"
                  />
                  <path
                    fill="#000000"
                    d="M351.74 275.46c17.09-11.03 17.04-23.32 0-33.09l-133.52-97.7c-13.92-8.73-28.44-3.6-28.05 14.57l.54 191.94c1.2 19.71 12.44 25.12 29.04 16l131.99-91.72z"
                  />
                </svg>
              </div>
              <img src="/songs/${folder}/cover.jpg"  alt=""
              />
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>`
         }
     }  // Load playlist whenever a card is clicked
     Array.from(document.getElementsByClassName("card")).forEach((e) => {
       e.addEventListener("click", async (item) => {
         console.log("Fetching Songs");
         await getsongs(`songs/${item.currentTarget.dataset.folder}`);
         playMusic(songs[0]); // Automatically play the first song from the new playlist
       });
     });
    }



async function main() {
  await getsongs("songs/HeartHealing");
  playMusic(songs[0], true);

   //display all the albums on the page
   displayAlbums()

  // Attach event listeners for controls like play, next, previous...
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });
 // listen for time update event
 currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });
  //ADD an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
  //add event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  //add event listener for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });
  //add event listener for previous song
  previous.addEventListener("click", () => {
    console.log("previous song is clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  //add event listener for next song
  next.addEventListener("click", () => {
    console.log("next song is clicked");
    // currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });
  //add an event listener for volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
      console.log("Setting volume to", e.target.value, "/ 100");
      currentSong.volume = parseInt(e.target.value) / 100;
    });
   //add event listener to mute the track
   document.querySelector(".volume>img").addEventListener("click",e=>{
    console.log(e.target)
    if(e.target.src.includes("volume.svg")){
        e.target.src= e.target.src.replace("volume.svg","mute.svg")
        currentSong.volume=0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src= e.target.src.replace("mute.svg","volume.svg")
        currentSong.volume=0.5;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 30;
    }
   })
 
}

main();

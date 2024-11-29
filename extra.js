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
    songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =songUL.innerHTML +
      `<li>
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
  //  let audio= new Audio("/songs/"+track);
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main() {
  await getsongs("songs/HeartHealing");
  playMusic(songs[0], true);
  
  //display all the albums on the page


  //attach an eventlistener to each song
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  //attach an eventlistener to play, previous, next song
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
  //load playist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      console.log(e);
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
      // playMusic(songs[1])
    });
  });
}

main();

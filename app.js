const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const prev = document.querySelector("#prev");
const play = document.querySelector("#play");
const playPause = play.querySelector("i");
const next = document.querySelector("#next");
const audio = document.querySelector("#audio");
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const musicLister = document.querySelector("#musicLister");

const player = new MusicPlayer(musicList);

window.addEventListener("load", () => {
  let music = player.getMusic();
  displayMusic(music);
  displayMusicList(player.musicList);
  isPlayingNow();
  updateProgressFill();
  updateVolumeFill();
});

function displayMusic(music) {
  title.innerText = music.getName();
  singer.innerText = music.singer;
  image.src = "img/" + music.img;
  audio.src = "music/" + music.file;
}

play.addEventListener("click", () => {
  const isMusicPlay = container.classList.contains("playing");
  isMusicPlay ? pauseMusic() : playMusic();
});

function pauseMusic() {
  playPause.classList.replace("fa-pause", "fa-play");
  container.classList.remove("playing");
  audio.pause();
}

function playMusic() {
  playPause.classList.replace("fa-play", "fa-pause");
  container.classList.add("playing");
  audio.play();
}

prev.addEventListener("click", () => {
  prevMusic();
  isPlayingNow();
});

next.addEventListener("click", () => {
  nextMusic();
  isPlayingNow();
});

function prevMusic() {
  player.prev();
  let music = player.getMusic();
  displayMusic(music);
  playMusic();
}

function nextMusic() {
  player.next();
  let music = player.getMusic();
  displayMusic(music);
  playMusic();
}

const calculateTime = (seconds) => {
  const minute = Math.floor(seconds / 60);
  const second = Math.floor(seconds % 60);
  const updatedSecond = second < 10 ? `0${second}` : second;
  const result = `${minute}:${updatedSecond}`;
  return result;
};

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = calculateTime(audio.duration);
  progressBar.max = Math.floor(audio.duration);
});

audio.addEventListener("ended", function () {
  playPause.classList.replace("fa-pause", "fa-play");
  container.classList.remove("playing");
  console.log("ended");
});

audio.addEventListener("timeupdate", () => {
  currentTime.textContent = calculateTime(audio.currentTime);
  progressBar.value = Math.floor(audio.currentTime);
  updateProgressFill();
});

progressBar.addEventListener("input", () => {
  audio.currentTime = progressBar.value;
  currentTime.textContent = calculateTime(audio.currentTime);
  updateProgressFill();
});

progressBar.addEventListener("mousedown", () => {
  audio.muted = true;
});

progressBar.addEventListener("mouseup", () => {
  audio.muted = false;
});

let muteState = "unmuted";
volume.addEventListener("click", () => {
  if (muteState === "muted") {
    volume.classList.replace("fa-volume-mute", "fa-volume-high");
    volume.classList.remove("muted");
    audio.muted = false;
    volumeBar.value = Math.floor(audio.volume * 100);
    muteState = "unmuted";
  } else {
    volume.classList.replace("fa-volume-high", "fa-volume-mute");
    volume.classList.add("muted");
    audio.muted = true;
    volumeBar.value = 0;
    muteState = "muted";
  }
});

volumeBar.addEventListener("input", () => {
  audio.volume = volumeBar.value / 100;
  if (audio.volume === 0) {
    volume.classList.replace("fa-volume-high", "fa-volume-mute");
    muteState = "muted";
  } else {
    volume.classList.replace("fa-volume-mute", "fa-volume-high");
    muteState = "unmuted";
  }
  updateVolumeFill();
});

const displayMusicList = (list) => {
  for (let i = 0; i < musicList.length; i++) {
    let liTag = `
    <li li-index="${i}" onclick="selectedMusic(this)" class="list-group-item d-flex justify-content-between align-items-center">
      <span>${list[i].getName()}</span>
      <span id="music-${i}" class="badge bg-primary rounded-pill"></span>
      <audio class="music-${i}" src="music/${list[i].file}"></audio>
    </li>
    `;

    musicLister.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = musicLister.querySelector(`#music-${i}`);
    let liAudioTag = musicLister.querySelector(`.music-${i}`);

    liAudioTag.addEventListener("loadeddata", () => {
      liAudioDuration.innerText = calculateTime(liAudioTag.duration);
    });
  }
};

const selectedMusic = (li) => {
  player.index = li.getAttribute("li-index");
  displayMusic(player.getMusic());
  playMusic();
  isPlayingNow();
};

const isPlayingNow = () => {
  for (let li of musicLister.querySelectorAll("li")) {
    if (li.classList.contains("playing")) {
      li.classList.remove("playing");
    }

    if (li.getAttribute("li-index") == player.index) {
      li.classList.add("playing");
    }
  }
};

function updateProgressFill() {
  const min = parseFloat(progressBar.min) || 0;
  const max = parseFloat(progressBar.max) || 100;
  const val = parseFloat(progressBar.value) || 0;

  const percent = ((val - min) / (max - min)) * 100;

  if (!isNaN(percent)) {
    progressBar.style.setProperty("--progress", `${percent}%`);
  } else {
    progressBar.style.setProperty("--progress", `0%`);
  }
}

function updateVolumeFill() {
  const min = parseFloat(volumeBar.min) || 0;
  const max = parseFloat(volumeBar.max) || 100;
  const val = parseFloat(volumeBar.value) || 0;

  const percent = ((val - min) / (max - min)) * 100;

  if (!isNaN(percent)) {
    volumeBar.style.setProperty("--volume", `${percent}%`);
  } else {
    volumeBar.style.setProperty("--volume", `0%`);
  }
}

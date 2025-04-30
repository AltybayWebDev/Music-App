class Music {
  constructor(title, singer, img, file) {
    this.title = title;
    this.singer = singer;
    this.img = img;
    this.file = file;
  }

  getName() {
    return this.title + " - " + this.singer;
  }
}

const musicList = [
    new Music("Wanda Nara", "Kefo", "kefo-wanda-nara.jpg", "kefo-wanda-nara.mp3"),
    new Music("Ellere Düş", "Sedat Sayan", "ellere-dus.jpg", "ellere-dus.mp3"),
    new Music("Vidrado Em Voce", "DJ Guuga", "vidrado-em-voce.jpg", "vidrado-em-voce.mp3"),
    new Music("Malamine", "Nafta", "malamine.jpg", "malamine.mp3"),
];

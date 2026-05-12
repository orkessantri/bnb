let currentSize = 24;

const chords = [
  "C","C#","D","D#","E",
  "F","F#","G","G#","A","A#","B"
];

/* LOAD SONG */
const params =
  new URLSearchParams(
    window.location.search
  );

const songId =
  params.get("id");

async function loadSong(){

  const params =
    new URLSearchParams(window.location.search);

  const id = params.get('id');

  const res =
    await fetch("assets/songs.json");

  const songs =
    await res.json();

  const song =
    songs.find(s => s.id == id);
    songs.find(s => s.id == songId);

  console.log(songId);
console.log(song);

  if(!song){

    document.getElementById('song-content')
      .innerHTML = 'Song not found';

    return;
  }

  document.getElementById('song-title')
    .innerText = song.title;

  renderSong(song.content);

}

/* RENDER */
function renderSong(text){

  if(!text) return;

  const lines = text.split('\n');

  let html = '';

  lines.forEach(line => {

    line = line.trim();

    // kosong
    if(line === ''){
      return;
    }

    // SECTION
    if(
      line.startsWith('[') &&
      line.endsWith(']')
    ){

      html += `
        <div class="section">
          ${line}
        </div>
      `;

      return;
    }

    // DETEKSI CHORD
const chordPattern =
  /^([A-G][#bmM7susdimaug0-9\/\- ]*)$/;

    if(chordPattern.test(line)){

      html += `
        <div class="chord">
          ${line}
        </div>
      `;

    }else{

      html += `
        <div class="lyric">
          ${line}
        </div>
      `;

    }

  });

  document.getElementById('song-content')
    .innerHTML = html;

}

/* ZOOM */
let chordSize = 24;

function zoomIn(){

  chordSize += 2;

  document.querySelectorAll('.chord')
    .forEach(el => {

      el.style.fontSize =
        chordSize + 'px';

    });

}

function zoomOut(){

  chordSize -= 2;

  if(chordSize < 12){
    chordSize = 12;
  }

  document.querySelectorAll('.chord')
    .forEach(el => {

      el.style.fontSize =
        chordSize + 'px';

    });

}

/* TRANSPOSE */
function transpose(step){

  const notes = [
    "C","C#","D","D#","E",
    "F","F#","G","G#","A","A#","B"
  ];

  document.querySelectorAll('.chord')
    .forEach(el => {

      let chords =
        el.innerText.split(/\s+/);

      let result = chords.map(chord => {

let match =
  chord.match(/^([A-G](#|b)?)(.*)$/);

        if(!match){
          return chord;
        }

        let root = match[1];
        let suffix = match[2];

        let index =
          notes.indexOf(root);

        if(index === -1){
          return chord;
        }

        let newIndex =
          (index + step + 12) % 12;

        return notes[newIndex] + suffix;

      });

      el.innerText =
        result.join(' ');

    });

}

loadSong();

function toggleTheme(){

  document.body.classList.toggle('dark-mode');
}

function toggleFullscreen(){

  const elem = document.documentElement;

  // masuk fullscreen
  if(
    !document.fullscreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement
  ){

    if(elem.requestFullscreen){

      elem.requestFullscreen();

    }else if(elem.webkitRequestFullscreen){

      elem.webkitRequestFullscreen();

    }else if(elem.msRequestFullscreen){

      elem.msRequestFullscreen();
    }
  }

  // keluar fullscreen
  else{

    if(document.exitFullscreen){

      document.exitFullscreen();

    }else if(document.webkitExitFullscreen){

      document.webkitExitFullscreen();

    }else if(document.msExitFullscreen){

      document.msExitFullscreen();
    }
  }
}

let currentSize = 24;

const chords = [
  "C","C#","D","D#","E",
  "F","F#","G","G#","A","A#","B"
];

/* LOAD SONG */
async function loadSong(){

  const params =
    new URLSearchParams(window.location.search);

  const id = params.get('id');

  const res =
    await fetch('songs.json');

  const songs =
    await res.json();

  const song =
    songs.find(s => s.id == id);

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

  if(!text){
    return;
  }

  const lines = text.split('\n');

  let html = '';

  lines.forEach(line => {

    if(!line){
      return;
    }

    line = line.trim();

    // skip kosong
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

    // CHORD LINE
    const chordRegex =
      /^([A-G][#bm0-9\s\/\-]*)$/;

    const isChord =
      chordRegex.test(line);

    if(isChord){

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

      let words =
        el.innerText.split(' ');

      words = words.map(chord => {

        let match =
          chord.match(/^([A-G]#?)(m?)/);

        if(!match){
          return chord;
        }

        let root = match[1];
        let minor = match[2];

        let index =
          notes.indexOf(root);

        if(index === -1){
          return chord;
        }

        let newIndex =
          (index + step + 12) % 12;

        return notes[newIndex] + minor;

      });

      el.innerText =
        words.join(' ');

    });

}

loadSong();

function toggleTheme(){

  document.body.classList.toggle('dark-mode');

}

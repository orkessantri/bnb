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

lines.forEach(line => {

  line = line.trim();

  // SKIP EMPTY LINE
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
      /^([A-G][#bm]*)/;

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
        <div>
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

  document.querySelectorAll('.chord')
    .forEach(el => {

      el.style.fontSize =
        chordSize + 'px';

    });

}

/* TRANSPOSE */
function transpose(step){

  const map = {
    "C":"C#",
    "C#":"D",
    "D":"D#",
    "D#":"E",
    "E":"F",
    "F":"F#",
    "F#":"G",
    "G":"G#",
    "G#":"A",
    "A":"A#",
    "A#":"B",
    "B":"C"
  };

  const reverse = {};

  Object.keys(map).forEach(key => {
    reverse[map[key]] = key;
  });

  document.querySelectorAll('.chord')
    .forEach(el => {

      let text = el.innerText;

      let regex =
        /\b[A-G]#?m?\b/g;

      text = text.replace(regex, chord => {

        let result = chord;

        for(let i=0;i<Math.abs(step);i++){

          if(step > 0){
            result =
              map[result] || result;
          }else{
            result =
              reverse[result] || result;
          }

        }

        return result;

      });

      el.innerText = text;

    });

}

loadSong();

function toggleTheme(){

  document.body.classList.toggle('dark-mode');

}

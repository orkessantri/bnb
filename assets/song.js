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

  const lines = text.split('\\n');

  let html = '';

  lines.forEach(line => {

    line = line.trim();

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
function zoomIn(){

  currentSize += 2;

  document.getElementById('song-content')
    .style.fontSize =
      currentSize + 'px';

}

function zoomOut(){

  currentSize -= 2;

  document.getElementById('song-content')
    .style.fontSize =
      currentSize + 'px';

}

/* TRANSPOSE */
function transpose(step){

  document.querySelectorAll('.chord')
    .forEach(el => {

      let text = el.innerText;

      chords.forEach((chord, i) => {

        const next =
          chords[(i + step + 12) % 12];

        const regex =
          new RegExp(`\\b${chord}\\b`, 'g');

        text =
          text.replace(regex, next);

      });

      el.innerText = text;

    });

}

loadSong();

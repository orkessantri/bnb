const nashvilleMap = {
  0: "1",
  1: "#1",
  2: "2",
  3: "b3",
  4: "3",
  5: "4",
  6: "#4",
  7: "5",
  8: "b6",
  9: "6",
  10: "b7",
  11: "7"
};

let displayMode = "nashville";

let originalKey = "C";

let currentKey = "C";

let transposeValue = 0;

let currentSong = null;

let songsData = [];

let chordSize = 24;

/* NOTES */
const notes = [
  "C","C#","D","D#","E",
  "F","F#","G","G#","A","A#","B"
];

/* URL PARAM */
const params =
  new URLSearchParams(
    window.location.search
  );

const songId =
  params.get("id");

/* INIT */
async function init(){

  const res =
    await fetch("assets/songs.json");

  songsData =
    await res.json();

  loadSong();

}

/* LOAD SONG */
async function loadSong(){

const song =
  songsData.find(
    s => s.id == songId
  );
  
  currentSong = song;

  console.log(songId);
  console.log(song);

  if(!song){

    document.getElementById(
      'song-content'
    ).innerHTML = 'Song not found';

    return;
  }

  document.getElementById(
    'song-title'
  ).innerText = song.title;

  document.getElementById(
  'song-artist'
).innerText =
  song.artist || "";

  renderCurrentSong();

}

/* RENDER SONG */
function renderSong(text){

  if(!text) return;

  const lines =
    text.split('\n');

  let html = '';

  lines.forEach(line => {

    line = line.trim();

    // EMPTY
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

// DETECT CHORD LINE
const firstToken =
  line.split(' ')[0];

const chordPattern =
  /^[A-G](#|b)?(maj7|m7|m|7|sus|sus4|dim|aug|add9)?$/;

if(chordPattern.test(firstToken)){

html += `
  <div class="chord">
    ${
      displayMode === "nashville"
        ? line
            .split(' ')
            .map(convertToNashville)
            .join(' ')
        : line
    }
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

  document.getElementById(
    'song-content'
  ).innerHTML = html;

}

function convertToNashville(chord){

  const flats = {
    "Bb":"A#",
    "Db":"C#",
    "Eb":"D#",
    "Gb":"F#",
    "Ab":"G#"
  };

  let match =
    chord.match(
      /^([A-G](#|b)?)(.*)$/
    );

  if(!match){
    return chord;
  }

  let root =
    match[1];

  let suffix =
    match[3];

  if(flats[root]){
    root = flats[root];
  }

  let chordIndex =
    notes.indexOf(root);

  let normalizedKey =
  currentKey;

if(flats[normalizedKey]){
  normalizedKey =
    flats[normalizedKey];
}
  
let keyIndex =
  notes.indexOf(normalizedKey);

  if(
    chordIndex === -1 ||
    keyIndex === -1
  ){
    return chord;
  }

  let interval =
    (chordIndex - keyIndex + 12) % 12;

  let number =
    nashvilleMap[interval];

  return number + suffix;

}

/* ZOOM IN */
function zoomIn(){

  chordSize += 2;

  document.querySelectorAll(
    '.chord'
  ).forEach(el => {

    el.style.fontSize =
      chordSize + 'px';

  });

}

function renderCurrentSong(){

  if(!currentSong) return;

  originalKey =
    currentSong.key || "C";

  const flats = {
    "Bb":"A#",
    "Db":"C#",
    "Eb":"D#",
    "Gb":"F#",
    "Ab":"G#"
  };

  let normalizedOriginalKey =
    originalKey;

  if(flats[normalizedOriginalKey]){
    normalizedOriginalKey =
      flats[normalizedOriginalKey];
  }

  let originalIndex =
    notes.indexOf(normalizedOriginalKey);

  let currentIndex =
    (originalIndex + transposeValue + 12) % 12;

  currentKey =
    notes[currentIndex];

  document.getElementById(
  'song-key'
).innerText =
  `DO = ${currentKey}`;
  
  if(currentKey === "A#"){
    currentKey = "Bb";
  }

  let renderedContent =
    currentSong.content;

  for(
    let i = 0;
    i < Math.abs(transposeValue);
    i++
  ){

    renderedContent =
      transposeText(
        renderedContent,
        transposeValue > 0 ? 1 : -1
      );

  }

  renderSong(renderedContent);

}

/* ZOOM OUT */
function zoomOut(){

  chordSize -= 2;

  if(chordSize < 12){
    chordSize = 12;
  }

  document.querySelectorAll(
    '.chord'
  ).forEach(el => {

    el.style.fontSize =
      chordSize + 'px';

  });

}

/* TRANSPOSE */
function transpose(step){

  transposeValue += step;

  renderCurrentSong();

}

function transposeText(text, step){

  const flats = {
    "Bb":"A#",
    "Db":"C#",
    "Eb":"D#",
    "Gb":"F#",
    "Ab":"G#"
  };

  const chordRegex =
    /^([A-G][#b]?)(maj7|m7|m|7|sus|dim|aug|add9|sus4)?$/;

  return text
    .split('\n')
    .map(line => {

      // SECTION JANGAN DIUBAH
      if(
        line.startsWith('[') &&
        line.endsWith(']')
      ){
        return line;
      }

      return line
        .split(' ')
        .map(token => {

          let match =
            token.match(chordRegex);

          if(!match){
            return token;
          }

          let root =
            match[1];

          let suffix =
            match[2] || "";

          if(flats[root]){
            root = flats[root];
          }

          let index =
            notes.indexOf(root);

          if(index === -1){
            return token;
          }

          let newIndex =
            (index + step + 12) % 12;

          let finalChord =
            notes[newIndex];

          if(finalChord === "A#"){
            finalChord = "Bb";
          }

          return finalChord + suffix;

        })
        .join(' ');

    })
    .join('\n');

}

/* DARK MODE */
function toggleTheme(){

  document.body.classList.toggle(
    'dark-mode'
  );

}

/* NASHVILLE MODE */
function toggleNashville(){

  if(displayMode === "chord"){
    displayMode = "nashville";
  }else{
    displayMode = "chord";
  }

  renderCurrentSong();

}

/* FULLSCREEN */
function toggleFullscreen(){

  const elem =
    document.documentElement;

  // ENTER
  if(
    !document.fullscreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement
  ){

    if(elem.requestFullscreen){

      elem.requestFullscreen();

    }else if(
      elem.webkitRequestFullscreen
    ){

      elem.webkitRequestFullscreen();

    }else if(
      elem.msRequestFullscreen
    ){

      elem.msRequestFullscreen();

    }

  }

  // EXIT
  else{

    if(document.exitFullscreen){

      document.exitFullscreen();

    }else if(
      document.webkitExitFullscreen
    ){

      document.webkitExitFullscreen();

    }else if(
      document.msExitFullscreen
    ){

      document.msExitFullscreen();

    }

  }

}


/* INIT */
init();


function toggleMenu(){

  document
    .getElementById('floatingTools')
    .classList.toggle('show');
}

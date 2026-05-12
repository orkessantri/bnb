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

let displayMode = "chord";

let originalKey = "C";

let currentKey = "C";

let transposeValue = 0;

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

/* LOAD SONG */
async function loadSong(){

  const res =
    await fetch("assets/songs.json");

  const songs =
    await res.json();

  const song =
    songs.find(
      s => s.id == songId
    );

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

  originalKey = song.key || "C";

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

if(currentKey === "A#"){
  currentKey = "Bb";
}

  let renderedContent =
  song.content;

for(let i = 0; i < Math.abs(transposeValue); i++){

  renderedContent =
    transposeText(
      renderedContent,
      transposeValue > 0 ? 1 : -1
    );

}
  
renderSong(renderedContent);

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
  /^[A-G](#|b)?(m|maj7|7|sus|dim|aug)?$/;

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

  loadSong();

}

function transposeText(text, step){

  return text.replace(
    /\b([A-G][#b]?)(maj7|m7|m|7|sus|dim|aug|add9|sus4)?\b/g,
    (match, root, suffix = "") => {

      const flats = {
        "Bb":"A#",
        "Db":"C#",
        "Eb":"D#",
        "Gb":"F#",
        "Ab":"G#"
      };

      let chordRoot = root;

      if(flats[chordRoot]){
        chordRoot = flats[chordRoot];
      }

      let index =
        notes.indexOf(chordRoot);

      if(index === -1){
        return match;
      }

      let newIndex =
        (index + step + 12) % 12;

      let finalChord =
        notes[newIndex];

      if(finalChord === "A#"){
        finalChord = "Bb";
      }

      return finalChord + suffix;

    }
  );

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

  loadSong();

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
loadSong();

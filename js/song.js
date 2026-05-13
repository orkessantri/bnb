const nashvilleMap = {
  0: "1",
  1: "1#",
  2: "2",
  3: "3b",
  4: "3",
  5: "4",
  6: "4#",
  7: "5",
  8: "6b",
  9: "6",
  10: "7b",
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
if(isChordLine(line)){

html += `
  <div class="chord">
    ${
      displayMode === "nashville"
        ? convertChordLineToNashville(line)
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

  document.getElementById(
  'song-key'
).innerText =
  `DO = ${currentKey}`;
  
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

/* =========================
   TRANSPOSE TEXT
========================= */

function transposeText(text, step){

  const flats = {
    "Bb":"A#",
    "Db":"C#",
    "Eb":"D#",
    "Gb":"F#",
    "Ab":"G#"
  };

  const lines =
    text.split('\n');

 return lines.map(line => {

  // ONLY TRANSPOSE CHORD LINE
  if(!isChordLine(line)){
    return line;
  }

    // SKIP SECTION
    if(
      line.startsWith('[') &&
      line.endsWith(']')
    ){
      return line;
    }

    let result = "";

    let insideBracket = false;

    for(let i = 0; i < line.length; i++){

      let char = line[i];

      // BRACKET MODE
      if(char === "("){
        insideBracket = true;
        result += char;
        continue;
      }

      if(char === ")"){
        insideBracket = false;
        result += char;
        continue;
      }

      // SKIP TEXT INSIDE ()
      if(insideBracket){
        result += char;
        continue;
      }

      // DETECT ROOT
      if(/[A-G]/.test(char)){

        let root = char;

        let next =
          line[i + 1];

        // SHARP / FLAT
        if(next === "#" || next === "b"){
          root += next;
          i++;
        }

        let chordRoot = root;

        if(flats[chordRoot]){
          chordRoot =
            flats[chordRoot];
        }

        let index =
          notes.indexOf(chordRoot);

        // VALID CHORD
        if(index !== -1){

          let newIndex =
            (index + step + 12) % 12;

          let finalChord =
            notes[newIndex];

          // A# -> Bb
          if(finalChord === "A#"){
            finalChord = "Bb";
          }

          result += finalChord;
          continue;
        }

      }

      // DEFAULT CHAR
      result += char;

    }

    return result;

  }).join('\n');

}

/* =========================
   RENDER CURRENT SONG
========================= */

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
    notes.indexOf(
      normalizedOriginalKey
    );

  let currentIndex =
    (originalIndex + transposeValue + 12) % 12;

  currentKey =
    notes[currentIndex];

  if(currentKey === "A#"){
    currentKey = "Bb";
  }

  document.getElementById(
  'song-key'
).innerText =
  `DO = ${currentKey}`;
  
  let renderedContent =
    currentSong.content;

  // APPLY TRANSPOSE
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

/* =========================
   TRANSPOSE
========================= */

function transpose(step){

  transposeValue += step;

  renderCurrentSong();

}

/* =========================
   IS CHORDLINE
========================= */
function isChordLine(line){

  // SECTION
  if(
    line.startsWith('[') &&
    line.endsWith(']')
  ){
    return false;
  }

  // REMOVE TEXT INSIDE ()
  let clean =
    line.replace(/\(.*?\)/g, '');

  // SPLIT TOKENS
  const tokens =
    clean.split(/\s+/);

  let chordCount = 0;

  tokens.forEach(token => {

    // REMOVE DOTS / DASH
    let t =
      token.replace(/[.\-\/]/g,'');

    // MATCH CHORD STYLE
    if(
      /^([A-G][#b]?)+$/.test(t)
    ){
      chordCount++;
    }

  });

  // chord dominan
  return chordCount >=
    Math.ceil(tokens.length * 0.6);

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

function convertChordLineToNashville(line){

  return line.replace(
    /([A-G](#|b)?)/g,
    match => convertToNashville(match)
  );
}

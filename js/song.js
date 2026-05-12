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

  renderSong(song.content);

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
  /^[A-G](#|b)?(m|maj7|7|sus|dim|aug)?/;

if(chordPattern.test(firstToken)){

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

  document.getElementById(
    'song-content'
  ).innerHTML = html;

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

  document.querySelectorAll('.chord')
    .forEach(el => {

      let chordList =
        el.innerText.split(/\s+/);

      let result =
        chordList.map(token => {

          // SKIP SIMBOL
          if(
            token === '/' ||
            token === '-' ||
            token.includes('2x') ||
            token.includes('1x')
          ){
            return token;
          }

          // MATCH CHORD
          let match =
            token.match(
              /^([A-G](#|b)?)(.*)$/
            );

          // BUKAN CHORD
          if(!match){
            return token;
          }

          let root =
            match[1];

          let suffix =
            match[3];

          // FLAT SUPPORT
          const flats = {
            "Bb":"A#",
            "Db":"C#",
            "Eb":"D#",
            "Gb":"F#",
            "Ab":"G#"
          };

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

          return notes[newIndex] + suffix;

        });

      el.innerText =
        result.join(' ');

    });

}

/* DARK MODE */
function toggleTheme(){

  document.body.classList.toggle(
    'dark-mode'
  );

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

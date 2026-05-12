let songs = [];

let editingID = null;

document.addEventListener(
  "DOMContentLoaded",
  function(){

    fetch("assets/songs.json")
      .then(res => res.json())
      .then(data => {

        songs = data;

        renderSongList();

        let maxId = 0;

        data.forEach(song => {

          if(song.id > maxId){
            maxId = song.id;
          }

        });

        document.getElementById('song-id').value =
          "Song ID - " + (maxId + 1);

        // TAMBAHAN BARU
        document.getElementById(
          "song-select"
        ).addEventListener(
          "change",
          function(){

            if(this.value){

              editSong(this.value);

            }

          }
        );

      });

  }
);

function renderSongList(){

  const select =
    document.getElementById(
      "song-select"
    );

  if(!select) return;

  let html = `

    <option value="">
      Pilih Lagu
    </option>

  `;

  songs.forEach(song => {

    html += `

      <option value="${song.id}">

        ${song.id}. ${song.title}

      </option>

    `;

  });

  select.innerHTML = html;

}

function editSong(id){

  const song =
    songs.find(
      s => s.id == id
    );

  if(!song) return;

  editingID = id;

  document.getElementById(
    'song-id'
  ).value =
    "Song ID - " + song.id;

  document.getElementById(
    'song-title'
  ).value =
    song.title;

  document.getElementById(
    'song-category'
  ).value =
    song.category;

  document.getElementById(
    'song-content'
  ).value =
    song.content;

}

/* GENERATE JSON */
function generateJSON(){

const id =
  editingID ||

  document.getElementById('song-id')
    .value
    .replace("Song ID - ","");

  const title =
    document.getElementById('song-title')
      .value;

  const category =
    document.getElementById('song-category')
      .value;

    const key =
  document.getElementById('song-key')
    .value;
  
  const content =
    document.getElementById('song-content')
      .value
      .replace(/\n/g, '\\n');

const result =
`{
  "id": ${id},
  "title": "${title}",
  "category": "${category}",
  "key": "${key}",
  "content": "${content}"
},`;
  
  document.getElementById('output')
    .innerText = result;

}

/* COPY JSON */
function copyJSON(){

  const text =
    document.getElementById('output')
      .innerText;

  navigator.clipboard.writeText(text);

  alert("JSON copied 🔥");

}

/* CLEAR JSON */
function clearForm(){

  document.getElementById(
    'song-title'
  ).value = '';

  document.getElementById(
    'song-category'
  ).value = '';

  document.getElementById(
    'song-content'
  ).value =
`[Intro]

[Verse]

[Pre Chorus]

[Chorus]

[Interlude]

[Outro]`;

  document.getElementById(
    'output'
  ).innerText = '';

}

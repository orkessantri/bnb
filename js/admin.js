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

      });

  }
);

function renderSongList(){

  const container =
    document.getElementById(
      "song-list"
    );

  if(!container) return;

  let html = "";

  songs.forEach(song => {

    html += `

      <div
        class="song-item-admin"
        onclick="editSong(${song.id})"
      >

        ${song.id}. ${song.title}

      </div>

    `;

  });

  container.innerHTML = html;

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

  const content =
    document.getElementById('song-content')
      .value
      .replace(/\n/g, '\\n');

  const result =
`{
  "id": ${id},
  "title": "${title}",
  "category": "${category}",
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

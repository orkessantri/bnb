let setlist =
  JSON.parse(
    localStorage.getItem("setlist")
  ) || [];

function saveSetlist(){

  localStorage.setItem(
    "setlist",
    JSON.stringify(setlist)
  );

}

function openSong(id){

  window.location.href =
    `song.html?id=${id}`;

}

function removeSong(id){

  setlist =
    setlist.filter(
      song => song.id != id
    );

  saveSetlist();

  renderSetlist();

}

function moveUp(index){

  if(index <= 0) return;

  [
    setlist[index],
    setlist[index - 1]
  ] = [
    setlist[index - 1],
    setlist[index]
  ];

  saveSetlist();

  renderSetlist();

}

function moveDown(index){

  if(index >= setlist.length - 1)
    return;

  [
    setlist[index],
    setlist[index + 1]
  ] = [
    setlist[index + 1],
    setlist[index]
  ];

  saveSetlist();

  renderSetlist();

}

function renderSetlist(){

  const container =
    document.getElementById(
      "setlist-container"
    );

  if(!container) return;

  let html = "";

  setlist.forEach((song,index)=>{

    html += `

      <div class="setlist-item">

        <div
          class="song-info"
          onclick="openSong(${song.id})"
        >

          <span class="song-number">
            ${index + 1}.
          </span>

          <span class="song-title">
            ${song.title}
          </span>

        </div>

        <div class="song-actions">

          <button
            onclick="moveUp(${index})"
          >
            ↑
          </button>

          <button
            onclick="moveDown(${index})"
          >
            ↓
          </button>

          <button
            onclick="removeSong(${song.id})"
          >
            ×
          </button>

        </div>

      </div>

    `;

  });

  container.innerHTML = html;

}

renderSetlist();

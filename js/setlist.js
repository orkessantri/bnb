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

function renderSetlist(){

  const container =
    document.getElementById(
      "setlist-container"
    );

  if(!container) return;

  if(setlist.length === 0){

    container.innerHTML = `
      <div style="
        text-align:center;
        opacity:.7;
        padding:40px;
      ">
        Setlist masih kosong
      </div>
    `;

    return;
  }

  let html = "";

  setlist.forEach((song,index)=>{

    html += `
      <div class="setlist-item">

        <div class="song-name">
          ${index + 1}. ${song.title}
        </div>

        <div class="song-actions">

          <button
            class="song-btn"
            onclick="moveUp(${index})"
          >
            ↑
          </button>

          <button
            class="song-btn"
            onclick="moveDown(${index})"
          >
            ↓
          </button>

          <button
            class="song-btn"
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

function moveUp(index){

  if(index === 0) return;

  [
    setlist[index - 1],
    setlist[index]
  ] = [
    setlist[index],
    setlist[index - 1]
  ];

  saveSetlist();
  renderSetlist();

}

function moveDown(index){

  if(index >= setlist.length - 1)
    return;

  [
    setlist[index + 1],
    setlist[index]
  ] = [
    setlist[index],
    setlist[index + 1]
  ];

  saveSetlist();
  renderSetlist();

}

function removeSong(id){

  setlist =
    setlist.filter(
      song => song.id != id
    );

  saveSetlist();
  renderSetlist();

}

renderSetlist();

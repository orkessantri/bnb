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
      ">
        Setlist kosong
      </div>
    `;

    return;
  }

  let html = "";

  setlist.forEach((song,index)=>{

    html += `
    
      <div class="setlist-item">

        <div class="song-title">
          ${index+1}. ${song.title}
        </div>

        <div class="setlist-actions">

          <button
            class="action-btn"
            onclick="moveUp(${index})"
          >
            ↑
          </button>

          <button
            class="action-btn"
            onclick="moveDown(${index})"
          >
            ↓
          </button>

          <button
            class="action-btn"
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

function removeSong(id){

  setlist =
    setlist.filter(
      song => song.id != id
    );

  saveSetlist();
  renderSetlist();

}

function moveUp(index){

  if(index === 0) return;

  [
    setlist[index-1],
    setlist[index]
  ] = [
    setlist[index],
    setlist[index-1]
  ];

  saveSetlist();
  renderSetlist();

}

function moveDown(index){

  if(index === setlist.length-1)
    return;

  [
    setlist[index+1],
    setlist[index]
  ] = [
    setlist[index],
    setlist[index+1]
  ];

  saveSetlist();
  renderSetlist();

}

renderSetlist();

function clearSetlist(){

  setlist = [];

  saveSetlist();

  renderSetlist();

}

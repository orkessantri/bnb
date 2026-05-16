let sortable = null;

let setlist =
  JSON.parse(
    localStorage.getItem("setlist")
  ) || [];

function saveSetlist(){

  localStorage.setItem(
    "setlist",
    JSON.stringify(setlist)
  );

  window.dispatchEvent(
    new Event("setlistUpdated")
  );

}

function renderSetlist(){

  const container =
    document.getElementById(
      "setlist-container"
    );

  if(!container) return;

  let html = "";

  if(setlist.length === 0){

    container.innerHTML = `

      <div class="empty-setlist">
        Umak gorong nggae Setlist!
      </div>

    `;

    return;
  }

  setlist.forEach((song,i)=>{

    html += `

<div class="setlist-item draggable-item">

        <div
          class="song-title"
          onclick="openSong(${song.id})"
        >
          ${i + 1}. ${song.title}
        </div>

        <div class="setlist-actions">

          <button
            class="action-btn remove-btn"
            onclick="removeSong(${song.id})"
          >
            ×
          </button>

          <button
            class="drag-handle"
            type="button"
          >
            ☰
          </button>

        </div>

      </div>

    `;

  });

  container.innerHTML = html;

  initSortable();

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

function initSortable(){

  if(sortable){
    sortable.destroy();
  }

  sortable = new Sortable(

  document.getElementById(
    "setlist-container"
  ),

  {
    animation:150,

    draggable:'.draggable-item',

    handle:'.drag-handle',

    forceFallback:true,

    delay: 100,
    
    delayOnTouchOnly: true,

    onEnd:function(evt){

      const movedItem =
        setlist.splice(
          evt.oldIndex,
          1
        )[0];

      setlist.splice(
        evt.newIndex,
        0,
        movedItem
      );

      saveSetlist();

      renderSetlist();

    }
  }
);
}


function clearSetlist(){

  setlist = [];

  saveSetlist();

  renderSetlist();
}

function openSong(id){

  window.location.href =
    `song.html?id=${id}`;
}

function toggleMenu(){

  document
    .getElementById(
      'floatingTools'
    )
    .classList.toggle('show');
}

function goExport(){
  window.location.href =
    "export.html";
}

function saveSetlistFile(){
  alert("Coming Soon 🔥");
}

let savedSetlists =

  JSON.parse(

    localStorage.getItem(
      "savedSetlists"
    )

  ) || [];

function renderSaved(){

  const container =

    document.getElementById(
      "saved-container"
    );

  if(savedSetlists.length === 0){

    container.innerHTML = `

      <div class="empty-setlist">
        Umak Gorong Save Setlist!
      </div>

    `;

    return;
  }

  let html = "";

  savedSetlists.forEach(setlist => {

    html += `

      <div class="saved-item">

        <div class="saved-info">

          <div class="saved-name">
            ${setlist.name}
          </div>

          <div class="saved-date">
            ${
              new Date(
                setlist.createdAt
              ).toLocaleString()
            }
          </div>

        </div>

        <div class="saved-actions">

          <button
            class="saved-btn"
            onclick="loadSetlist(${setlist.id})"
          >
            ↺
          </button>

          <button
            class="saved-btn"
            onclick="renameSetlist(${setlist.id})"
          >
            ✎
          </button>

          <button
            class="saved-btn"
            onclick="duplicateSetlist(${setlist.id})"
          >
            ⧉
          </button>

          <button
            class="saved-btn"
            onclick="deleteSetlist(${setlist.id})"
          >
            ✕
          </button>

        </div>

      </div>

    `;

  });

  container.innerHTML = html;

}

function loadSetlist(id){

  const selected =

    savedSetlists.find(
      s => s.id === id
    );

  if(!selected) return;

  localStorage.setItem(

    "setlist",

    JSON.stringify(
      selected.songs
    )

  );

  alert(
    "Setlist loaded 🔥"
  );

  window.location.href =
    "setlist.html";

}

function deleteSetlist(id){

  const confirmDelete =

    confirm(
      "Remove Setlist?"
    );

  if(!confirmDelete) return;

  savedSetlists =

    savedSetlists.filter(
      s => s.id !== id
    );

  localStorage.setItem(

    "savedSetlists",

    JSON.stringify(
      savedSetlists
    )
  );
  renderSaved();
}

function renameSetlist(id){

  const selected =

    savedSetlists.find(
      s => s.id === id
    );

  if(!selected) return;

  const newName = prompt(
    "Rename Setlist",
    selected.name
  );

  if(!newName) return;

  selected.name = newName;

  localStorage.setItem(

    "savedSetlists",

    JSON.stringify(
      savedSetlists
    )
  );
  renderSaved();
}

function duplicateSetlist(id){

  const selected =

    savedSetlists.find(
      s => s.id === id
    );

  if(!selected) return;

  const duplicated = {

    ...selected,

    id: Date.now(),

    name:
      selected.name +
      " COPY",

    createdAt:
      new Date().toISOString()

  };

  savedSetlists.push(
    duplicated
  );

  localStorage.setItem(

    "savedSetlists",

    JSON.stringify(
      savedSetlists
    )
  );
  renderSaved();
}

renderSaved();

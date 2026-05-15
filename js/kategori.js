let songs = [];

let activeKategori = null;

let setlist =
  JSON.parse(
    localStorage.getItem("setlist")
  ) || [];

async function loadSongs(){

  const res =
    await fetch("assets/songs.json");

  songs = await res.json();

}

function saveSetlist(){

  localStorage.setItem(
    "setlist",
    JSON.stringify(setlist)
  );

}

function addSetlist(title,id){

  const exists =
    setlist.some(s => s.id == id);

  if(exists) return;

  setlist.push({
    title,
    id
  });

  saveSetlist();

  renderPreviewSetlist();

  // 🔥 UPDATE BUTTON REALTIME
  renderKategori();

}

function removeSetlist(id){

  setlist =
    setlist.filter(
      song => song.id != id
    );

  saveSetlist();

  renderPreviewSetlist();

  // 🔥 UPDATE BUTTON REALTIME
  renderKategori();

}

function renderKategori(){

  const container =
    document.getElementById(
      "kategori-container"
    );

  if(!container) return;

  container.innerHTML = "";

  const kategoriList =
    [...new Set(
      songs.map(song => song.category)
    )];

  kategoriList.forEach(kategori => {

    const laguKategori =
      songs.filter(
        song => song.category === kategori
      );

    const box =
      document.createElement("div");

    box.className =
      "kategori-box";

    box.innerHTML = `

      <div class="kategori-header">

        <span>
          ${kategori}
        </span>

        <span class="arrow">
          ▼
        </span>

      </div>

      <div class="kategori-list">

        ${laguKategori.map(song => `

          <div class="song-item">

          <span
            class="song-title"
            onclick="openSong(${song.id})"
          >
          
            <span class="song-main">
              ${song.title}
            </span>
          
            <span class="song-artist">
              - ${song.artist}
            </span>
          
          </span>

<button
  class="
    add-btn
    ${
      isSongAdded(song.id)
        ? 'added'
        : ''
    }
  "
  onclick="addSetlist(
    '${song.title}',
    ${song.id}
  )"
>
  ${
    isSongAdded(song.id)
      ? '✓'
      : '+'
  }
</button>

          </div>

        `).join("")}

      </div>

    `;

    const header =
      box.querySelector(
        ".kategori-header"
      );

    const list =
      box.querySelector(
        ".kategori-list"
      );

    // restore active category
    if(
      activeKategori &&
      activeKategori === kategori
    ){

      list.classList.add(
        "active"
      );

    }

    header.onclick = () => {

      const isActive =
        list.classList.contains(
          "active"
        );

      document
        .querySelectorAll(
          ".kategori-list"
        )
        .forEach(el => {

          el.classList.remove(
            "active"
          );

        });

      if(!isActive){

        list.classList.add(
          "active"
        );

        activeKategori =
          kategori;

      }else{

        activeKategori = null;

      }

    };

    container.appendChild(box);

  });

}

function openSong(id){

  window.location.href =
    `song.html?id=${id}`;

}

function isSongAdded(id){

  const setlist =
    JSON.parse(
      localStorage.getItem('setlist')
    ) || [];

  return setlist.some(
    song => song.id == id
  );

}

function renderPreviewSetlist(){

  const container =
    document.getElementById(
      "preview-setlist"
    );

  if(!container) return;

  const half =
    Math.ceil(setlist.length / 2);

  const left =
    setlist.slice(0, half);

  const right =
    setlist.slice(half);

  let html = `

    <div class="preview-column">
  `;

  left.forEach((song,i)=>{

    html += `
<div class="preview-song">

  <span>
    ${i+1}. ${song.title}
  </span>

  <button
    class="remove-btn"
    onclick="removeSetlist(${song.id})"
  >
    −
  </button>

</div>
    `;

  });

  html += `
    </div>

    <div class="preview-column">
  `;

  right.forEach((song,i)=>{

    html += `
<div class="preview-song">

  <span>
    ${i+1+half}. ${song.title}
  </span>

  <button
    class="remove-btn"
    onclick="removeSetlist(${song.id})"
  >
    −
  </button>

</div>
    `;

  });

  html += `
    </div>
  `;

  container.innerHTML = html;
}

async function initKategori(){

  await loadSongs();

  renderKategori();

  renderPreviewSetlist();

}

initKategori();

function goToSetlist(){

  window.location.href =
    "setlist.html";

}

window.addEventListener(
  "setlistUpdated",
  () => {

    renderPreviewSetlist();

    renderKategori();

  }
);

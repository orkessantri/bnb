let songs = [];

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

  renderKategori();
  renderPreviewSetlist();

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
              ${song.title}
            </span>

            <button
              class="add-btn"
              onclick="addSetlist(
                '${song.title}',
                ${song.id}
              )"
            >
              +
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

    header.onclick = () => {

      document
        .querySelectorAll(".kategori-list")
        .forEach(el => {

          if(el !== list){

            el.classList.remove(
              "active"
            );

          }

        });

      list.classList.toggle(
        "active"
      );

    };

    container.appendChild(box);

  });

}

function openSong(id){

  window.location.href =
    `song.html?id=${id}`;

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
      <div>
        ${i+1}. ${song.title}
      </div>
    `;

  });

  html += `
    </div>

    <div class="preview-column">
  `;

  right.forEach((song,i)=>{

    html += `
      <div>
        ${i+1+half}. ${song.title}
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

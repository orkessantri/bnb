let songs = [];

let activeCategory = "ALL";

async function loadSongs(){

  const res =
    await fetch(
      "assets/songs.json"
    );

  songs = await res.json();

}

function renderFilter(){

  const container =
    document.getElementById(
      "kategori-filter"
    );

  const kategori =
    [
      "ALL",
      ...new Set(
        songs.map(
          s => s.category
        )
      )
    ];

  let html = "";

  kategori.forEach(cat => {

    html += `
      <button
        class="
          filter-btn
          ${activeCategory === cat ? "active" : ""}
        "

        onclick="
          setCategory('${cat}')
        "
      >
        ${cat}
      </button>
    `;

  });

  container.innerHTML = html;

}

function setCategory(cat){

  activeCategory = cat;

  renderFilter();

  renderSongs();

}

function renderSongs(){

  const container =
    document.getElementById(
      "daftar-container"
    );

  const keyword =
    document
      .getElementById("search-input")
      .value
      .toLowerCase();

  let filtered = songs;

  // FILTER CATEGORY
  if(activeCategory !== "ALL"){

    filtered =
      filtered.filter(
        s =>
          s.category === activeCategory
      );

  }

  // SEARCH
  filtered =
    filtered.filter(
      s =>
        s.title
          .toLowerCase()
          .includes(keyword)
    );

  let html = "";

  filtered.forEach((song,i)=>{

    html += `
      <div
        class="song-item"

        onclick="
          openSong(${song.id})
        "
      >

        <div>

          <div class="song-name">
            ${i+1}. ${song.title}
          </div>

          <div class="song-category">
            ${song.category}
          </div>

        </div>

      </div>
    `;

  });

  container.innerHTML = html;

}

function openSong(id){

  window.location.href =
    `song.html?id=${id}`;

}

async function initDaftar(){

  await loadSongs();

  renderFilter();

  renderSongs();

  document
    .getElementById("search-input")
    .addEventListener(
      "input",
      renderSongs
    );

}

initDaftar();

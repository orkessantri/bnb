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

  if(!container) return;

  let filtered = songs;

  // FILTER SEARCH
  const keyword =
    document
      .getElementById("search-input")
      .value
      .toLowerCase();

  if(keyword){

    filtered =
      filtered.filter(song =>
        song.title
          .toLowerCase()
          .includes(keyword)
      );

  }

  // FILTER CATEGORY
  if(activeCategory !== "ALL"){

    filtered =
      filtered.filter(
        song =>
          song.category === activeCategory
      );

  }

  // COLOR CATEGORY
 const autoColors = [
  "#22c55e",
  "#f97316",
  "#3b82f6",
  "#eab308",
  "#ec4899",
  "#a855f7",
  "#14b8a6",
  "#ef4444"
];

const kategoriIndex =
  [...new Set(
    songs.map(s => s.category)
  )].indexOf(song.category);

const color =
  autoColors[
    kategoriIndex % autoColors.length
  ];

  let html = "";

  filtered.forEach((song,index)=>{

    const color =
      colors[song.category] || "#ffffff";

    html += `

      <div
        class="song-item"
        onclick="openSong(${song.id})"
      >

        <div
          class="song-strip"
          style="
            background:${color};
          "
        ></div>

        <div class="song-name">
          ${index + 1}. ${song.title}
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

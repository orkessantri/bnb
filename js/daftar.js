let songs = [];

let shuffledSongs = [];

let activeCategory = "ALL";

async function loadSongs(){

  const res =
    await fetch("assets/songs.json");

  songs = await res.json();

  shuffledSongs =
  [...songs].sort(
    () => Math.random() - 0.5
  );
  
}

/* OPEN SONG */
function openSong(id){

  window.location.href =
    `song.html?id=${id}`;

}

/* RENDER FILTER */
function renderFilter(){

  const container =
    document.getElementById(
      "kategori-filter"
    );

  if(!container) return;

  const kategori =
    [
      "ALL",
      ...new Set(
        songs.map(s => s.category)
      )
    ];

  let html = "";

  kategori.forEach(kat => {

    html += `

      <button
        class="
          filter-btn
          ${activeCategory === kat ? "active" : ""}
        "
        onclick="
          setCategory('${kat}')
        "
      >
        ${kat}
      </button>

    `;

  });

  container.innerHTML = html;

}

/* CHANGE CATEGORY */
function setCategory(kategori){

  activeCategory = kategori;

  renderFilter();

  renderSongs();

}

/* RENDER SONGS */
function renderSongs(){

  const container =
    document.getElementById(
      "daftar-container"
    );

  if(!container) return;

let filtered =
  activeCategory === "ALL"
    ? shuffledSongs
    : [...songs];
  
  /* SEARCH */
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

  /* FILTER CATEGORY */
if(activeCategory !== "ALL"){

  filtered =
    filtered
      .filter(
        song =>
          song.category === activeCategory
      )
      .sort(
        (a,b)=>
          a.title.localeCompare(b.title)
      );

}

  /* AUTO COLORS */
  const autoColors = [
    "#03dbfc",
    "#fffc30",
    "#ff6a00",
    "#ff0385",
    "#5b29ff",
    "#c457ff",
    "#e60505"
  ];

  let html = "";

  filtered.forEach((song,index)=>{

    const kategoriIndex =
      [...new Set(
        songs.map(s => s.category)
      )].indexOf(song.category);

    const color =
      autoColors[
        kategoriIndex % autoColors.length
      ];

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
          ${index + 1}.
          ${song.title}
          - 
          ${song.artist || "-"}
        </div>

      </div>

    `;

  });

  container.innerHTML = html;

}

/* INIT */
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


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

        <span>${kategori}</span>

        <span>▼</span>

      </div>

      <div class="kategori-list">

        ${laguKategori.map(song => {

          const isAdded =
            setlist.some(
              s => s.id == song.id
            );

          return `

            <div class="song-item">

              <span>
                ${song.title}
              </span>

              <button
                class="add-btn"
                onclick="addSetlist(
                  '${song.title}',
                  '${song.id}'
                )"

                ${isAdded ? "disabled" : ""}

              >

                ${isAdded ? "✓" : "+"}

              </button>

            </div>

          `;

        }).join("")}

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

        el.classList.remove("active");

      }

    });

  list.classList.toggle("active");

};

    container.appendChild(box);

  });

}

function renderPreviewSetlist(){

  const el =
    document.getElementById(
      "preview-setlist"
    );

  if(!el) return;

  if(setlist.length === 0){

    el.innerHTML =
      "<p>Belum ada lagu</p>";

    return;

  }

  let html = "";

  setlist.forEach((song,i)=>{

    html += `
  <div>
    ${i+1}. ${song.title}
  </div>
`;

  });

  el.innerHTML = html;

}

async function initKategori(){

  await loadSongs();

  renderKategori();

  renderPreviewSetlist();

}

initKategori();

function renderKategori(){

  const container =
    document.getElementById(
      "kategori-container"
    );

  if(!container) return;

  container.innerHTML = "";

  // kategori unik
  const categories = [

    ...new Set(
      songs.map(
        song => song.category
      )
    )

  ];

  categories.forEach(category => {

    const laguKategori =
      songs.filter(
        song =>
          song.category === category
      );

    const box =
      document.createElement("div");

    box.className =
      "kategori-box";

    box.innerHTML = `

      <div class="kategori-header">

        <span>${category}</span>

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

                onclick="
                  addSetlist(
                    '${song.title}',
                    '${song.id}'
                  )
                "

                ${isAdded ? "disabled" : ""}

              >

                ${isAdded ? "✓" : "+"}

              </button>

            </div>

          `;

        }).join("")}

      </div>

    `;

    // accordion
    const header =
      box.querySelector(
        ".kategori-header"
      );

    const list =
      box.querySelector(
        ".kategori-list"
      );

    header.onclick = () => {

      list.classList.toggle(
        "active"
      );

    };

    container.appendChild(box);

  });

}

function renderPreviewSetlist(){

  const preview =
    document.getElementById(
      "preview-list"
    );

  if(!preview) return;

  preview.innerHTML = "";

  setlist.forEach(song => {

    preview.innerHTML += `

      <div class="preview-item">

        ${song.title}

      </div>

    `;

  });

}

async function initKategori(){

  await loadSongs();

  renderKategori();

  renderPreviewSetlist();

}

initKategori();

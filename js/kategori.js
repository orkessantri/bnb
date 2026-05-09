async function loadKategori(){

  const res = await fetch('data/songs.json');

  const songs = await res.json();

  const wrap =
    document.getElementById('kategori-list');

  wrap.innerHTML = '';

  const kategoriMap = {};

  songs.forEach(song=>{

    if(!kategoriMap[song.category]){
      kategoriMap[song.category] = [];
    }

    kategoriMap[song.category].push(song);
  });

  Object.keys(kategoriMap).forEach(cat=>{

    const box = document.createElement('div');

    box.className = 'kategori-box';

    let html = `
      <div class="kategori-title">
        ${cat}
      </div>
    `;

    kategoriMap[cat].forEach(song=>{

      html += `
        <div class="song-item">

          <a
            class="song-link"
            href="song.html?id=${song.id}">
            ${song.title}
          </a>

          <button
            class="add-btn"
            onclick="addSetlist(${song.id})">
            +
          </button>

        </div>
      `;
    });

    box.innerHTML = html;

    wrap.appendChild(box);
  });
}

loadKategori();

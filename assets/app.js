let size = 22;

function zoomIn(){
  size += 2;
  document.querySelector(".song").style.fontSize = size + "px";
}

function zoomOut(){
  size -= 2;
  document.querySelector(".song").style.fontSize = size + "px";
}

const chords = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

function transpose(step){
  document.querySelectorAll(".chord").forEach(el=>{
    let c = el.innerText;
    let m = c.match(/^([A-G](#|b)?)(.*)$/);
    if(!m)return;

    let root=m[1];
    let suf=m[3];

    const map={Db:"C#",Eb:"D#",Gb:"F#",Ab:"G#",Bb:"A#"};
    if(map[root]) root=map[root];

    let i=chords.indexOf(root);
    if(i==-1)return;

    el.innerText=chords[(i+step+12)%12]+suf;
  });
}

function toggleDark(){
  document.body.classList.toggle("dark");
}

window.onload = function(){
  let el = document.querySelector(".song");
  if(!el)return;

  el.innerHTML = el.innerHTML.replace(
    /\b([A-G](#|b)?m?)\b/g,
    '<span class="chord">$1</span>'
  );
};

function toggleLive(){
  document.body.classList.toggle("live");
}

let activeCategory = null;

function renderKategori(){

  const container =
    document.getElementById(
      "kategori-container"
    );

  if(!container) return;

  container.innerHTML = "";

  // ambil semua kategori unik
  const kategoriList =
    [...new Set(
      songs.map(song => song.category)
    )];

  kategoriList.forEach(kategori => {

    // lagu per kategori
    const laguKategori =
      songs.filter(
        song => song.category === kategori
      );

    const box =
      document.createElement("div");

    box.className = "kategori-box";

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

      document.getElementById('kategori-list')
        .innerHTML = html;

      // event add button
      document.querySelectorAll('.btn-add')
        .forEach(btn => {

          btn.addEventListener(
            'click',
            function(){

              addSetlist(
                this.dataset.title,
                this.dataset.id
              );

            }
          );

        });

    });

}

function toggleCategory(el){

  // tutup semua kategori lain
  document
    .querySelectorAll('.category-content')
    .forEach(content => {

      if(content !== el.nextElementSibling){
        content.classList.remove('open');
      }

    });

  // toggle current
  el.nextElementSibling
    .classList.toggle('open');

}

function renderPreviewSetlist(){
  const el = document.getElementById("preview-setlist");
  if(!el) return;

  if(setlist.length === 0){
    el.innerHTML = "<p style='text-align:center;'>Belum ada lagu</p>";
    return;
  }

  let html = '';

  setlist.forEach((song, i) => {
    html += `<div class="preview-item">${i+1}. ${song.title}</div>`;
  });

  el.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", function(){

  if(document.getElementById('kategori-list')){
    renderKategori();
  }

  if(document.getElementById('preview-setlist')){
    renderPreviewSetlist();
  }

});

function renderSetlist(){
  const el = document.getElementById("setlist");
  if(!el) return;

  if(setlist.length === 0){
    el.innerHTML = "<p style='text-align:center;'>Belum ada lagu</p>";
    return;
  }

  let html = '';

  setlist.forEach((song, i) => {
    html += `
      <div class="song-item">
        <a href="song.html?id=${song.id}">${i+1}. ${song.title}</a>
        <button class="btn-remove" data-index="${i}">−</button>
      </div>
    `;
  });

  el.innerHTML = html;

  // tombol remove
  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', function(){
      removeSetlist(parseInt(this.dataset.index));
    });
  });
}

let setlist = JSON.parse(localStorage.getItem("setlist")) || [];


function addSetlist(title, id){

  const exists =
    setlist.some(song => song.id == id);

  if(exists) return;

  setlist.push({title, id});

  localStorage.setItem(
    "setlist",
    JSON.stringify(setlist)
  );

  renderKategori();
  renderPreviewSetlist();

}

  // kalau ada halaman setlist
  if(document.getElementById('setlist')){
    renderSetlist();
  }

function removeSetlist(i){
  setlist.splice(i, 1);
  localStorage.setItem("setlist", JSON.stringify(setlist));
  renderSetlist();
}

function loadSetlist(){
  setlist = JSON.parse(localStorage.getItem("setlist")) || [];
  renderSetlist();
}

document.addEventListener("DOMContentLoaded", function(){

  if(document.getElementById('setlist')){
    loadSetlist();
  }

  if(document.getElementById('kategori-list')){
    renderKategori();
  }

});

function init(){
  if(document.getElementById('setlist')){
    loadSetlist();
  }

  if(document.getElementById('kategori-list')){
    renderKategori();
  }

  if(document.getElementById('preview-setlist')){
    renderPreviewSetlist();
  }

  if(document.getElementById('song-content')){
  loadSong();
}
}

init();

function removeSetlist(i){

  let setlist =
    JSON.parse(localStorage.getItem("setlist")) || [];

  setlist.splice(i,1);

  localStorage.setItem(
    "setlist",
    JSON.stringify(setlist)
  );

  renderSetlist();
}

function clearSetlist(){

  localStorage.removeItem("setlist");

  renderSetlist();
}

document.addEventListener("DOMContentLoaded", function(){

  if(document.getElementById('setlist')){
    renderSetlist();
  }

});

function loadSong(){

  const params =
    new URLSearchParams(window.location.search);

  const id = params.get('id');

  if(!id) return;

  fetch('songs.json')
    .then(res => res.json())
    .then(data => {

      const song =
        data.find(s => s.id == id);

      if(!song) return;

      document.getElementById('song-title')
        .innerText = song.title;

      renderSong(song.content);

    });

}

function renderSong(content){

  const container =
    document.getElementById('song-content');

  const lines =
    content.split('\n');

  let html = '';

  lines.forEach(line => {

    line = line.trim();

    // kosong
    if(line === ''){
      html += `<div style="height:12px"></div>`;
      return;
    }

    // SECTION
    if(line.startsWith('[') && line.endsWith(']')){

      html += `
        <div class="section-title">
          ${line}
        </div>
      `;

      return;
    }

    // CHORD LINE
    const chordPattern =
      /^([A-G][#bmM7susdimaug0-9\/ -]*)$/;

    if(chordPattern.test(line)){

      const chords = line.split(' ');

      let chordHTML = '';

      chords.forEach(ch => {

        chordHTML += `
          <span class="chord">
            ${ch}
          </span>
        `;
      });

      html += `
        <div class="chord-line">
          ${chordHTML}
        </div>
      `;

      return;
    }

    // LYRIC
    html += `
      <div class="lyric-line">
        ${line}
      </div>
    `;

  });

  container.innerHTML = html;

}

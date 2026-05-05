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
  fetch('songs.json')
    .then(res => res.json())
    .then(data => {

    let grouped = {};

data.forEach(song => {
  let catName = song.category || "Lainnya";

  if(!grouped[catName]){
    grouped[catName] = [];
  }

  grouped[catName].push(song);
});

      let html = '';

      for(let cat in grouped){
        html += `
          <div class="category">
            <div class="category-title" onclick="toggleCategory(this)">
              ${cat}
            </div>

            <div class="category-content">
        `;

      grouped[cat].forEach(song => {

  let isAdded = setlist.some(s => s.file === song.file);

  html += `
    <div class="song-item ${isAdded ? 'added' : ''}">
      <a href="songs/${song.file}">${song.title}</a>
      <button class="btn-add"
        data-title="${song.title}"
        data-file="${song.file}"
        ${isAdded ? 'disabled' : ''}>
        ${isAdded ? '✓' : '+'}
      </button>
    </div>
  `;
});

        html += `
            </div>
          </div>
        `;
      }

      document.getElementById('kategori-list').innerHTML = html;

      // buka kembali kategori aktif setelah render ulang
if(activeCategory){
  document.querySelectorAll(".category-title").forEach(title => {
    if(title.innerText === activeCategory){
      title.nextElementSibling.classList.add("open");
    }
  });
}
      
      // tombol tambah
      document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', function(){
          addSetlist(this.dataset.title, this.dataset.file);
        });
      });
    });
}

let activeCategory = null;

function toggleCategory(el){
  const content = el.nextElementSibling;
  const catName = el.innerText;

  // klik kategori yang sama → toggle
  if(activeCategory === catName){
    content.classList.toggle("open");
    activeCategory = content.classList.contains("open") ? catName : null;
    return;
  }

  // tutup semua dulu
  document.querySelectorAll(".category-content").forEach(c => {
    c.classList.remove("open");
  });

  // buka yang dipilih
  content.classList.add("open");
  activeCategory = catName;
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
        <a href="songs/${song.file}">${i+1}. ${song.title}</a>
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

function addSetlist(title, file){
  setlist.push({title, file});
  localStorage.setItem("setlist", JSON.stringify(setlist));

  renderKategori();         // 🔥 update coret
  renderPreviewSetlist();   // 🔥 update preview
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
}

init();

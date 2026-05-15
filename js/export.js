let sortable = null;

let setlist =
  JSON.parse(
    localStorage.getItem(
      "setlist"
    )
  ) || [];

const exportTable =
  document.getElementById(
    "export-table"
  );

if(exportTable){
  renderTable();
}

function renderTable(){

  const container =
    document.getElementById(
      "export-table"
    );

  let html = `

    <div
      class="
        export-row
        export-header
      "
    >

<div>NO</div>
<div>SONG</div>
<div>SINGER</div>
<div>KEY</div>
<div></div>

    </div>

  `;

  setlist.forEach((song,index)=>{

    html += `

      <div class="export-row">

        <div>
          ${index + 1}
        </div>

  <div class="song-cell">

  <div class="song-name">
    ${song.title}
  </div>

  <div class="song-artist">
    ${song.artist || ''}
  </div>

</div>

        <div>
          <input
            class="singer-input"
            type="text"
            placeholder="Singer"
            value="${
              song.singer || ''
            }"

            onchange="
              updateSinger(
                ${song.id},
                this.value
              )
            "
          >
        </div>

<div>
<input
  class="key-input"
  type="text"
  placeholder="Key"

  value="${
    song.key || ''
  }"

  onchange="
    updateKey(
      ${song.id},
      this.value
    )
  "
>
</div>

<div class="drag-handle">
  ☰
</div>

</div>

    `;

  });

  container.innerHTML = html;
  
  initSortable();

}

function updateSinger(id,value){

  const song =
    setlist.find(
      s => s.id == id
    );

  if(!song) return;

  song.singer = value;

  saveSetlist();

}

function updateKey(id,value){

  const song =
    setlist.find(
      s => s.id == id
    );

  if(!song) return;

  song.key = value;

  saveSetlist();

}

document
  .getElementById(
    "logoInput"
  )
  .addEventListener(
    "change",
    function(e){

      const file =
        e.target.files[0];

      if(!file) return;

      const reader =
        new FileReader();

      reader.onload =
        function(event){

          const preview =
            document.getElementById(
              "logoPreview"
            );

          preview.src =
            event.target.result;

          preview.style.display =
            "block";

        };

      reader.readAsDataURL(file);

    }
  );

function initSortable(){

  if(sortable){
    sortable.destroy();
  }

  sortable = new Sortable(

    document.getElementById(
      "export-table"
    ),

   {
  animation:150,

  handle:'.drag-handle',

  filter:'.export-header',

  onEnd:function(evt){

        if(evt.oldIndex === 0)
          return;

        const movedItem =
          setlist.splice(
            evt.oldIndex - 1,
            1
          )[0];

        setlist.splice(
          evt.newIndex - 1,
          0,
          movedItem
        );

        saveSetlist();
        
        renderTable();

      }

    }

  );

}

function saveSetlist(){

  localStorage.setItem(
    "setlist",
    JSON.stringify(setlist)
  );

}

async function exportPDF(){

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  let y = 20;

  // BAND
  const band =
    document.getElementById(
      "band-name"
    ).value;

  const event =
    document.getElementById(
      "event-name"
    ).value;

  const date =
    document.getElementById(
      "event-date"
    ).value;

  doc.setFontSize(18);
  doc.text(band, 20, y);

  y += 10;

  doc.setFontSize(12);
  doc.text(event, 20, y);

  y += 8;

  doc.text(date, 20, y);

  y += 14;

  // TABLE HEADER
  doc.setFontSize(11);

  doc.text("NO",20,y);
  doc.text("SONG",35,y);
  doc.text("SINGER",120,y);
  doc.text("KEY",170,y);

  y += 8;

  setlist.forEach((song,index)=>{

    doc.text(
      String(index+1),
      20,
      y
    );

    doc.text(
      song.title,
      35,
      y
    );

    doc.text(
      song.singer || '',
      120,
      y
    );

    doc.text(
      song.key || '',
      170,
      y
    );

    y += 8;

    // AUTO PAGE
    if(y > 270){

      doc.addPage();

      y = 20;

    }

  });

  doc.save("setlist.pdf");

}

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

  const logo =
    document.getElementById(
      "logoPreview"
    );

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

  const location =
    document.getElementById(
      "event-location"
    ).value;

  let y = 20;

  // =====================
  // LOGO
  // =====================

  if(
    logo &&
    logo.src &&
    logo.src.startsWith("data:image")
  ){

    doc.addImage(
      logo.src,
      'PNG',
      20,
      15,
      24,
      24
    );

  }

  // =====================
  // HEADER
  // =====================

  doc.setFontSize(20);
  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    band || "BAND NAME",
    52,
    24
  );

  doc.setFontSize(12);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    event || "Nama Acara",
    52,
    32
  );

  doc.text(
    date || "Tanggal",
    52,
    39
  );

  doc.text(
    location || "Lokasi",
    52,
    46
  );

  y = 62;

  // =====================
  // SONG LIST
  // =====================

  setlist.forEach((song,index)=>{

    // AUTO PAGE
    if(y > 250){

      doc.addPage();

      y = 20;

    }

    // CARD BG
    doc.setFillColor(
      index % 2 === 0
        ? 245
        : 235
    );

    doc.roundedRect(
      15,
      y,
      180,
      24,
      4,
      4,
      'F'
    );

    // NUMBER
    doc.setFontSize(12);

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      `${index + 1}.`,
      22,
      y + 9
    );

    // TITLE
    doc.setFontSize(13);

    doc.text(
      song.title || '',
      34,
      y + 9
    );

    // ARTIST
    doc.setFontSize(9);

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      song.artist || '',
      34,
      y + 15
    );

    // SINGER
    doc.setFontSize(10);

    doc.text(
      `Singer : ${
        song.singer || '-'
      }`,
      120,
      y + 9
    );

    // KEY
    doc.text(
      `Key : ${
        song.key || '-'
      }`,
      120,
      y + 15
    );

    y += 30;

  });

  doc.save("setlist.pdf");

}

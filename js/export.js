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
    "logo-select"
  )
  .addEventListener(
    "change",
    function(){

      document
        .getElementById(
          "logoPreview"
        )
        .src = this.value;

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
  logo.src &&
  !logo.src.endsWith('/')
){

  const img = new Image();

  img.src = logo.src;

  await new Promise(resolve => {

    img.onload = resolve;

  });

  doc.addImage(
    img,
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

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(22);

  doc.text(
    band || "BAND NAME",
    50,
    24
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(15);

  doc.text(
    event || "Nama Acara",
    50,
    32
  );

  doc.text(
  `${date}  •  ${location}`,
  20,
  y
);

y += 14;

  // =====================
  // TABLE HEADER
  // =====================

  doc.setFillColor(20,20,20);

  doc.roundedRect(
    15,
    y,
    180,
    10,
    3,
    3,
    'F'
  );

  doc.setTextColor(255);

  doc.setFontSize(14);

  doc.text("NO",22,y+6);
  doc.text("SONG",38,y+6);
  doc.text("SINGER",135,y+6);
  doc.text("KEY",175,y+6);

  y += 16;

  // RESET TEXT COLOR
  doc.setTextColor(0);

  // =====================
  // SONGS
  // =====================

  setlist.forEach((song,index)=>{

    // AUTO PAGE
    if(y > 270){

      doc.addPage();

      y = 20;

    }

    // BG COLOR
    if(index % 2 === 0){

      doc.setFillColor(
        245,
        245,
        245
      );

    }else{

      doc.setFillColor(
        235,
        235,
        235
      );

    }

    // ROW
    doc.roundedRect(
      15,
      y,
      180,
      12,
      3,
      3,
      'F'
    );

    // NUMBER
    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(12);

    doc.text(
      String(index + 1),
      22,
      y + 8
    );

    // SONG + ARTIST
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      `${song.title} - ${
        song.artist || ''
      }`,
      38,
      y + 8
    );

    // SINGER
    doc.text(
      song.singer || '-',
      135,
      y + 8
    );

    // KEY
    doc.text(
      song.key || '-',
      175,
      y + 8
    );

    y += 16;

  });

  doc.save("setlist.pdf");

}

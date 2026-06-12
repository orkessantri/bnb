let exportItems = [];

let sortable = null;

let setlist =
  JSON.parse(
    localStorage.getItem(
      "setlist"
    )
  ) || [];

const savedExportItems =
  JSON.parse(
    localStorage.getItem(
      "exportItems"
    )
  );

if(savedExportItems){

  exportItems =
    savedExportItems.map(item => {

      if(item.type === "song"){

        const freshSong =
          setlist.find(
            s => s.id === item.data.id
          );

        return {
          type:"song",
          data:freshSong || item.data
        };

      }

      return item;

    });

}else{

  exportItems = [

    ...setlist.map(song => ({
      type:"song",
      data:song
    }))

  ];

}

syncExportItems();

function syncExportItems(){

  const songItems =

    exportItems.filter(
      item => item.type === "song"
    );

  const songIds =

    songItems.map(
      item => item.data.id
    );

  // tambah lagu baru

  setlist.forEach(song => {

    if(
      !songIds.includes(song.id)
    ){

      exportItems.push({

        type:"song",

        data:song

      });

    }

  });

  // hapus lagu yang sudah tidak ada

  exportItems =

    exportItems.filter(item => {

      if(
        item.type !== "song"
      ){
        return true;
      }

      return setlist.some(

        song =>

          song.id === item.data.id

      );

    });

  saveExportItems();

}

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
let songNumber = 1;
  exportItems.forEach((item,index)=>{

    // =====================
    // INSERT ITEM
    // =====================

if(item.type === "insert"){

html += `

<div class="insert-row">

  <div class="insert-bullet">
    •
  </div>

  <input
    type="text"
    class="insert-input"

    value="${
      item.text || ''
    }"

    onchange="
      updateInsert(
        ${index},
        this.value
      )
    "

    placeholder="Insert Text"
  >

  <button
    class="remove-insert"
    onclick="removeInsert(${index})"
  >
    ✕
  </button>

  <div class="drag-handle">
    ☰
  </div>

</div>

`;

  return;
}

    // =====================
    // SONG ITEM
    // =====================

    const song = item.data;

    html += `

    <div class="export-row">

      <div>
        ${songNumber++}
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
saveExportDraft();
    }
  );

function addInsert(){

  exportItems.push({

    type:"insert",

    text:"Talk"

  });
saveExportItems();
  renderTable();

}

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

    exportItems.splice(
      evt.oldIndex - 1,
      1
    )[0];

  exportItems.splice(
    evt.newIndex - 1,
    0,
    movedItem
  );

    saveExportItems();
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
saveExportItems();
}

function saveExportItems(){

  localStorage.setItem(

    "exportItems",

    JSON.stringify(exportItems)

  );

}

// =====================
// AUTO SAVE FORM DRAFT
// =====================
function saveExportDraft(){

  const draft = {

    band:
      document.getElementById(
        "band-name"
      ).value,

    event:
      document.getElementById(
        "event-name"
      ).value,

    date:
      document.getElementById(
        "event-date"
      ).value,

    location:
      document.getElementById(
        "event-location"
      ).value,

    logo:
      document.getElementById(
        "logoPreview"
      ).src

  };

  localStorage.setItem(

    "exportDraft",

    JSON.stringify(draft)
  );
}

// =====================
// LOAD DRAFT
// =====================
function loadExportDraft(){

  const draft =

    JSON.parse(

      localStorage.getItem(
        "exportDraft"
      )

    );

  if(!draft) return;

  document.getElementById(
    "band-name"
  ).value =
    draft.band || '';

  document.getElementById(
    "event-name"
  ).value =
    draft.event || '';

  document.getElementById(
    "event-date"
  ).value =
    draft.date || '';

  document.getElementById(
    "event-location"
  ).value =
    draft.location || '';

  if(draft.logo){

    document.getElementById(
      "logoPreview"
    ).src =
      draft.logo;
  }
}

[
  "band-name",
  "event-name",
  "event-date",
  "event-location"
]

.forEach(id => {

  document
    .getElementById(id)

    .addEventListener(

      "input",

      saveExportDraft
    );
});

function updateInsert(
  index,
  value
){

  exportItems[index].text =
    value;
saveExportItems();
}

function removeInsert(index){

  exportItems.splice(index,1);

  saveExportItems();

  renderTable();

}

// =====================
// LAYOUT PDF
// =====================
async function buildPDF(){

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

  let y = 55;
  
  // =====================
  // LOGO
  // =====================

  if(
    logo.src &&
    !logo.src.endsWith('/')
  ){

    const img = new Image();

    img.src = logo.src;

    await new Promise(resolve=>{
      img.onload = resolve;
    });

    doc.addImage(
      img,
      'PNG',
      15,
      12,
      30,
      30
    );
  }

  // =====================
  // HEADER
  // =====================

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(26);

  doc.text(
    band || "BAND NAME",
    50,
    24
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(19);

  doc.text(
    event || "Nama Acara",
    50,
    32
  );

  doc.setFontSize(14);

  doc.text(
    `${date} • ${location}`,
    50,
    39
  );

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

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(14);

  doc.text(
    "NO",
    22,
    y + 6.5,
    {align:"center"}
  );

  doc.text(
    "SONG",
    32,
    y + 6.5
  );

  doc.text(
    "SINGER",
    135,
    y + 6.5
  );

  doc.text(
    "KEY",
    182,
    y + 6.5,
    {align:"center"}
  );

  y += 13;

  doc.setTextColor(0);

  // =====================
  // ITEMS
  // =====================

  let songNumber = 1;
  
  exportItems.forEach((item,index)=>{

    // PAGE BREAK
    if(y > 270){

      doc.addPage();

      y = 20;
    }

    // =====================
    // INSERT ITEM
    // =====================

    if(item.type === "insert"){

      doc.setFillColor(
        255,
        240,
        200
      );

      doc.roundedRect(
        15,
        y,
        180,
        10,
        3,
        3,
        'F'
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(12);

      doc.text(
        item.text || "INSERT",
        20,
        y + 6.5
      );

      y += 11;

      return;
    }

    // =====================
    // SONG ITEM
    // =====================

    const song = item.data;

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

    doc.roundedRect(
      15,
      y,
      180,
      10,
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
      String(songNumber++),
      22,
      y + 6.5,
      {
        align:"center"
      }
    );

    // SONG
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      `${song.title} - ${song.artist || ''}`,
      32,
      y + 6.5
    );

    // SINGER
    doc.text(
      song.singer || '-',
      135,
      y + 6.5
    );

    // KEY
    doc.text(
      song.key || '-',
      182,
      y + 6.5,
      {
        align:"center"
      }
    );

    y += 11;

  });

  return doc;
}

  // =====================
  // EXPORT PDF
  // ====================
async function exportPDF(){

  const doc =
    await buildPDF();

  const pdfBlob =
    doc.output('blob');

  const url =
    URL.createObjectURL(pdfBlob);

  window.open(url);

}

function findContentHeight(canvas){

  const ctx =
    canvas.getContext("2d");

  const data =
    ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    ).data;

  for(
    let y = canvas.height - 1;
    y >= 0;
    y--
  ){

    for(
      let x = 0;
      x < canvas.width;
      x++
    ){

      const index =
        (y * canvas.width + x) * 4;

      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];

      if(
        r < 250 ||
        g < 250 ||
        b < 250
      ){

        return y + 20;
      }
    }
  }

  return canvas.height;
}

  // =====================
  // EXPORT JPG
  // ====================
async function exportJPG(){

  const fileName = prompt(

    "Nama file JPG",

    "Setlist"

  );

  if(!fileName) return;

  const doc =
    await buildPDF();

  const pdfBlob =
    doc.output("blob");

  const pdfUrl =
    URL.createObjectURL(
      pdfBlob
    );

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

  const pdf =
    await pdfjsLib
      .getDocument(pdfUrl)
      .promise;

  const pages = [];

  let totalHeight = 0;

  let maxWidth = 0;

  for(
    let i = 1;
    i <= pdf.numPages;
    i++
  ){

    const page =
      await pdf.getPage(i);

    const viewport =
      page.getViewport({
        scale:3
      });

    const canvas =
      document.createElement(
        "canvas"
      );

    const ctx =
      canvas.getContext(
        "2d"
      );

    canvas.width =
      viewport.width;

    canvas.height =
      viewport.height;

    await page.render({

      canvasContext:ctx,

      viewport

    }).promise;

const croppedHeight =
  findContentHeight(canvas);

pages.push({

  canvas,
  height: croppedHeight

});

totalHeight +=
  croppedHeight;

maxWidth =
  Math.max(
    maxWidth,
    canvas.width
  );

  }

  const finalCanvas =
    document.createElement(
      "canvas"
    );

  const finalCtx =
    finalCanvas.getContext(
      "2d"
    );

  finalCanvas.width =
    maxWidth;

  finalCanvas.height =
    totalHeight;

  finalCtx.fillStyle =
    "#ffffff";

  finalCtx.fillRect(
    0,
    0,
    maxWidth,
    totalHeight
  );

  let currentY = 0;

  pages.forEach(page=>{

  finalCtx.drawImage(

    page.canvas,

    0,
    0,

    page.canvas.width,
    page.height,

    0,
    currentY,

    page.canvas.width,
    page.height

  );

  currentY +=
    page.height;

});

  finalCanvas.toBlob(blob=>{

    const url =
      URL.createObjectURL(
        blob
      );

    const a =
      document.createElement(
        "a"
      );

    a.href = url;

    a.download =
      `${fileName}.jpg`;

    document.body.appendChild(
      a
    );

    a.click();

    document.body.removeChild(
      a
    );

    URL.revokeObjectURL(
      url
    );

  },

  "image/jpeg",

  0.98);

}
  loadExportDraft();

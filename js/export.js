let setlist =
  JSON.parse(
    localStorage.getItem(
      "setlist"
    )
  ) || [];

renderTable();

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

      <div>No</div>

      <div>Lagu</div>

      <div>Singer</div>

      <div>Action</div>

    </div>

  `;

  setlist.forEach((song,index)=>{

    html += `

      <div class="export-row">

        <div>
          ${index + 1}
        </div>

        <div>
          ${song.title}
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

        <div class="table-actions">

          <button
            class="table-btn"
            onclick="moveUp(${index})"
          >
            ↑
          </button>

          <button
            class="table-btn"
            onclick="moveDown(${index})"
          >
            ↓
          </button>

        </div>

      </div>

    `;

  });

  container.innerHTML = html;

}

function updateSinger(id,value){

  const song =
    setlist.find(
      s => s.id == id
    );

  if(!song) return;

  song.singer = value;

}

function moveUp(index){

  if(index === 0) return;

  [
    setlist[index-1],
    setlist[index]
  ] = [
    setlist[index],
    setlist[index-1]
  ];

  renderTable();

}

function moveDown(index){

  if(
    index ===
    setlist.length - 1
  ) return;

  [
    setlist[index+1],
    setlist[index]
  ] = [
    setlist[index],
    setlist[index+1]
  ];

  renderTable();

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

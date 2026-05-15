const setlist =
  JSON.parse(
    localStorage.getItem(
      "setlist"
    )
  ) || [];

renderExportTable();

function renderExportTable(){

  const container =
    document.getElementById(
      "export-table"
    );

  if(!container) return;

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
          >

        </div>

      </div>

    `;

  });

  container.innerHTML = html;

}

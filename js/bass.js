const notes = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B'
]

const tuning = ['G', 'D', 'A', 'E']

const fretboard =
  document.getElementById('fretboard')

const rootSelect =
  document.getElementById('root-select')

const scaleSelect =
  document.getElementById('scale-select')

let scalesData = []

/* =========================
   LOAD JSON
========================= */

async function loadScales(){

  const response =
    await fetch(
      'data/scales.json'
    )

  scalesData =
    await response.json()

  populateScaleSelector()

  renderFretboard()
}

/* =========================
   POPULATE SELECT
========================= */

function populateScaleSelector(){

  scaleSelect.innerHTML = ''

  scalesData.forEach(scale => {

    const option =
      document.createElement('option')

    option.value = scale.id

    option.textContent =
      scale.name

    scaleSelect.appendChild(option)

  })
}

/* =========================
   GET NOTE
========================= */

function getNextNote(note, step){

  const index =
    notes.indexOf(note)

  return notes[
    (index + step) % 12
  ]
}

/* =========================
   BUILD SCALE
========================= */

function buildScale(root, scaleType){

  const rootIndex =
    notes.indexOf(root)

  const scale =
    scalesData.find(
      s => s.id === scaleType
    )

  return scale.intervals.map(interval => {

    return notes[
      (rootIndex + interval) % 12
    ]

  })
}

/* =========================
   RENDER
========================= */

function renderFretboard(){

  const root =
    rootSelect.value

  const scaleType =
    scaleSelect.value

  const scale =
    scalesData.find(
      s => s.id === scaleType
    )

  if(!scale) return

  const scaleNotes =
    buildScale(
      root,
      scaleType
    )

  /* SCALE INFO */
 document.getElementById(
  'scale-notes'
).innerHTML =
  `<span class="scale-label">
    Notes:
  </span>
  ${scaleNotes.join(' - ')}`

document.getElementById(
  'scale-formula'
).innerHTML =
  `<span class="scale-label">
    Formula:
  </span>
  ${scale.formula.join(' - ')}`

  document.getElementById(
  'scale-intervals'
).innerHTML =
  `<span class="scale-label">
    Intervals:
  </span>
  ${scale.intervals.join(' - ')}`


  fretboard.innerHTML = ''

  tuning.forEach(stringNote => {

    const row =
      document.createElement('div')

    row.className =
      'string-row'

    /* LABEL */
    const label =
      document.createElement('div')

    label.className =
      'string-label'

    label.textContent =
      stringNote

    row.appendChild(label)

    /* FRETS */
    for(let fret = 0; fret <= 12; fret++){

      const note =
        getNextNote(
          stringNote,
          fret
        )

      const fretDiv =
        document.createElement('div')

      fretDiv.className =
        'fret'

      /* ACTIVE NOTE */
      if(scaleNotes.includes(note)){

        fretDiv.classList.add(
          'active-note'
        )
      }

      /* ROOT NOTE */
      if(note === root){

        fretDiv.classList.add(
          'root-note'
        )
      }

      fretDiv.textContent =
        note

      row.appendChild(fretDiv)
    }

    fretboard.appendChild(row)

  })
}

/* =========================
   EVENTS
========================= */

rootSelect.addEventListener(
  'change',
  renderFretboard
)

scaleSelect.addEventListener(
  'change',
  renderFretboard
)

/* INIT */
loadScales()

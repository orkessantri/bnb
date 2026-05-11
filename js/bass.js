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

/* =========================
   SCALE FORMULAS
========================= */

const scales = {

  major: [0,2,4,5,7,9,11],

  minor: [0,2,3,5,7,8,10],

  pentatonic: [0,3,5,7,10]

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

function buildScale(root, formula){

  const rootIndex =
    notes.indexOf(root)

  return formula.map(interval => {

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

  const scaleNotes =
    buildScale(
      root,
      scales[scaleType]
    )

  fretboard.innerHTML = ''

  tuning.forEach(stringNote => {

    const row =
      document.createElement('div')

    row.className = 'string-row'

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

      /* ACTIVE SCALE NOTE */
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
renderFretboard()


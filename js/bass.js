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
let chordsData = []

let activeChordNotes = []
let activeChordRoot = null
let activeChordName = null
let harmonyMode = 'sevenths'

/* =========================
   LOAD JSON
========================= */

async function loadScales(){

  /* LOAD SCALES */

  const scaleResponse =
    await fetch(
      'data/scales.json'
    )

  scalesData =
    await scaleResponse.json()

  /* LOAD CHORDS */

  const chordResponse =
    await fetch(
      'data/chords.json'
    )

  chordsData =
    await chordResponse.json()

populateScaleSelector()

validateScaleHarmony()

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

function buildScaleChords(
  scaleNotes,
  harmonyTypes
){

  return scaleNotes
    .map((note,index) => {

      const type =
        harmonyTypes[index]

      if(!type) return null

      return {

        root:note,

        type:type,

        name:note + type

      }

    })
    .filter(Boolean)
}

function buildChord(root, intervals){

  const rootIndex =
    notes.indexOf(root)

  return intervals.map(interval => {

    return notes[
      (rootIndex + interval) % 12
    ]

  })
}

/* =========================
   VALIDATION
========================= */
function validateScaleHarmony(){

  scalesData.forEach(scale => {

    const allHarmony = [

      ...scale.triads,

      ...scale.sevenths,

      ...scale.extended

    ]

    allHarmony.forEach(chordId => {

      const exists =
        chordsData.find(
          chord => chord.id === chordId
        )

      if(!exists){

        console.warn(
          `Missing chord: ${chordId}`
        )

      }

    })

  })

}

/* =========================
   RESET
========================= */
function resetActiveChord(){

  activeChordName = null

  activeChordRoot = null

  activeChordNotes = []

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

/* BUILD CHORDS */
let harmonyData = []

if(harmonyMode === 'triads'){
  harmonyData =
    scale.triads
}

else if(
  harmonyMode === 'sevenths'
){
  harmonyData =
    scale.sevenths
}

else if(
  harmonyMode === 'extended'
){
  harmonyData =
    scale.extended
}

const chords =
  buildScaleChords(
    scaleNotes,
    harmonyData
  )

/* RENDER CHORDS */
const chordsContainer =
  document.getElementById(
    'scale-chords'
  )

chordsContainer.innerHTML = ''

chords.forEach(chord => {

  const chip =
    document.createElement('button')

  chip.className =
    'chord-chip'

  if(
  chord.name === activeChordName
){

  chip.classList.add(
    'active-chord-chip'
  )
}

  chip.textContent =
    chord.name

  chip.addEventListener(
    'click',

    () => {

  const chordType =
    chordsData.find(
      c => c.id === chord.type
    )

if(!chordType) return
      
  const chordRoot =
    chord.root

/* TOGGLE OFF */

if(
  activeChordName === chord.name
){

  activeChordName = null

  activeChordRoot = null

  activeChordNotes = []

}

/* TOGGLE ON */

else{

  activeChordName =
    chord.name

  activeChordRoot =
    chordRoot

  activeChordNotes =
    buildChord(
      chordRoot,
      chordType.intervals
    )
}

renderFretboard()
    }
  )

  chordsContainer.appendChild(
    chip
  )

})

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
  'scale-character'
).innerHTML = `

  <span class="scale-label">
    Character :
  </span>

  ${scale.character.join(' - ')}
`
  
  fretboard.innerHTML = ''

  tuning.forEach(stringNote => {

    const row =
      document.createElement('div')

    row.className =
      'string-row'

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

/* =========================
   NOTE COLORS PRIORITY
========================= */

/* SCALE ROOT */

if(
  note === root
){

  fretDiv.classList.add(
    'root-note'
  )

}

/* CHORD ROOT */

else if(
  note === activeChordRoot
){

  fretDiv.classList.add(
    'chord-selected-root'
  )

}

/* CHORD NOTES */

else if(
  activeChordNotes.includes(note)
){

  fretDiv.classList.add(
    'chord-active'
  )

}

/* SCALE NOTES */

else if(
  scaleNotes.includes(note)
){

  fretDiv.classList.add(
    'active-note'
  )

}

      fretDiv.textContent =
        note

      row.appendChild(fretDiv)
    }

    fretboard.appendChild(row)
  })

  /* FRET NUMBERS */

const numberRow =
  document.createElement('div')

numberRow.className =
  'fret-number-row'

for(let fret = 0; fret <= 12; fret++){

  const fretNumber =
    document.createElement('div')

  fretNumber.className =
    'fret-number'

  fretNumber.textContent =
    fret

if(fret === 0 || fret === 12){

  fretNumber.classList.add(
    'special'
  )
}

  numberRow.appendChild(
    fretNumber
  )
}

fretboard.appendChild(
  numberRow
)
}

/* =========================
   EVENTS
========================= */

rootSelect.addEventListener(
  'change',
  () => {

    resetActiveChord()

    renderFretboard()
  }
)

scaleSelect.addEventListener(
  'change',
  () => {

    resetActiveChord()

    renderFretboard()
  }
)

/* INIT */
loadScales()

document
  .querySelectorAll(
    '.harmony-btn'
  )
  .forEach(btn => {

    btn.addEventListener(
      'click',
      () => {

        harmonyMode =
          btn.dataset.mode

        document
          .querySelectorAll(
            '.harmony-btn'
          )
          .forEach(b => {

            b.classList.remove(
              'active'
            )

          })

        btn.classList.add(
          'active'
        )

        activeChordName = null
        activeChordNotes = []
        activeChordRoot = null

        renderFretboard()
      }
    )

  })

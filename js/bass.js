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

function buildMajor7Chords(scaleNotes){
  return [
    {
      name:`${scaleNotes[0]}maj7`
    },
    {
      name:`${scaleNotes[1]}m7`
    },
    {
      name:`${scaleNotes[2]}m7`
    },
    {
      name:`${scaleNotes[3]}maj7`
    },
    {
      name:`${scaleNotes[4]}7`
    },
    {
      name:`${scaleNotes[5]}m7`
    },
    {
      name:`${scaleNotes[6]}m7b5`
    }
  ]
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
const chords =
  buildMajor7Chords(
    scaleNotes
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

      let chordType = null

      if(chord.name.includes('m7b5')){

        chordType =
          chordsData.find(
            c => c.id === 'm7b5'
          )

      }else if(
        chord.name.includes('maj7')
      ){

        chordType =
          chordsData.find(
            c => c.id === 'maj7'
          )

      }else if(
        chord.name.includes('m7')
      ){

        chordType =
          chordsData.find(
            c => c.id === 'm7'
          )

      }else{

        chordType =
          chordsData.find(
            c => c.id === '7'
          )
      }

      const chordRoot =
        chord.name.replace(
          /maj7|m7b5|m7|7/g,
          ''
        )

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
  renderFretboard
)

scaleSelect.addEventListener(
  'change',
  renderFretboard
)

/* INIT */
loadScales()

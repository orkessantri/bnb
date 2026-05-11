```js
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

function getNextNote(note, step){

  const index =
    notes.indexOf(note)

  return notes[
    (index + step) % 12
  ]
}

function renderFretboard(){

  fretboard.innerHTML = ''

  tuning.forEach(stringNote => {

    const row =
      document.createElement('div')

    row.className = 'string-row'

    const label =
      document.createElement('div')

    label.className = 'string-label'

    label.textContent = stringNote

    row.appendChild(label)

    for(let fret = 0; fret <= 12; fret++){

      const note =
        getNextNote(stringNote, fret)

      const fretDiv =
        document.createElement('div')

      fretDiv.className = 'fret'

      if(fret === 0){
        fretDiv.classList.add('open')
      }

      fretDiv.textContent = note

      row.appendChild(fretDiv)
    }

    fretboard.appendChild(row)

  })
}

renderFretboard()
```

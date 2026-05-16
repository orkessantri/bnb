const kategoriConfig = [
  { name:"KASIDAH" },
  { name:"GAMBUZ" },
  { name:"DUNGDAT" },
  { name:"POPINDO" }
  { name:"POPMANCA" }
];

const validKeys = [

  "C",
  "C#",
  "Db",

  "D",
  "D#",
  "Eb",

  "E",

  "F",
  "F#",
  "Gb",

  "G",
  "G#",
  "Ab",

  "A",
  "A#",
  "Bb",

  "B"

];

function validateSongsData(songs){

  const ids = [];

  const validCategories =

    kategoriConfig.map(
      k => k.name
    );

  songs.forEach(song => {

    // =====================
    // DUPLICATE ID
    // =====================

    if(ids.includes(song.id)){

      console.warn(

`DUPLICATE ID

Song:
${song.title}

ID:
${song.id}`

      );

    }

    ids.push(song.id);

    // =====================
    // EMPTY TITLE
    // =====================

    if(
      !song.title ||
      song.title.trim() === ''
    ){

      console.warn(

`EMPTY TITLE

ID:
${song.id}`

      );

    }

    // =====================
    // INVALID CATEGORY
    // =====================

    if(
      !validCategories.includes(
        song.category
      )
    ){

      console.warn(

`INVALID CATEGORY

Song:
${song.title}

Category:
${song.category}`

      );

    }

    // =====================
    // INVALID KEY
    // =====================

    if(
      song.key &&
      !validKeys.includes(song.key)
    ){

      console.warn(

`INVALID KEY

Song:
${song.title}

Key:
${song.key}`

      );

    }

    // =====================
    // EMPTY CONTENT
    // =====================

    if(
      !song.content ||
      song.content.trim() === ''
    ){

      console.warn(

`EMPTY CONTENT

Song:
${song.title}`

      );

    }

  });

}

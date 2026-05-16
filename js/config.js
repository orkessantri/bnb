const kategoriConfig = [
  { name:"KASIDAH" },
  { name:"GAMBUZ" },
  { name:"DUNGDAT" },
  { name:"POPINDO" }
  { name:"POPMANCA" }
];

function validateSongsCategories(songs){

  const validCategories =

    kategoriConfig.map(
      k => k.name
    );

  songs.forEach(song => {

    if(
      !validCategories.includes(
        song.category
      )
    ){

      console.warn(

        `
UNKNOWN CATEGORY

Song:
${song.title}

Category:
${song.category}
        `
      );
    }
  });
}

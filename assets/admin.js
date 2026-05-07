<script>

document.addEventListener("DOMContentLoaded", function(){

  fetch('songs.json')
    .then(res => res.json())
    .then(data => {

      let maxId = 0;

      data.forEach(song => {

        if(song.id > maxId){
          maxId = song.id;
        }

      });

document.getElementById('song-id').value =
  "Song ID - " + (maxId + 1);

    });

});

/* GENERATE JSON */
function generateJSON(){

const id =
  document.getElementById('song-id')
    .value
    .replace("Song ID - ","");

  const title =
    document.getElementById('song-title').value;

  const category =
    document.getElementById('song-category').value;

  const content =
    document.getElementById('song-content')
      .value
      .replace(/\n/g, '\\n');

  const result =
`{
  "id": ${id},
  "title": "${title}",
  "category": "${category}",
  "content": "${content}"
},`;

  document.getElementById('output')
    .innerText = result;

}
 
/* COPY */
function copyJSON(){

  const text =
    document.getElementById('output')
      .innerText;

  navigator.clipboard.writeText(text);

  alert("JSON copied 🔥");
}

</script>

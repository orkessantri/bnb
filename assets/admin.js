let nextID = 1;

fetch('../songs.json')
  .then(res => res.json())
  .then(data => {

    if(data.length > 0){
      nextID = data[data.length - 1].id + 1;
    }

    document.getElementById('song-id').value =
      `Song ID - ${nextID}`;

  })
  .catch(() => {

    document.getElementById('song-id').value =
      'Song ID - 1';

  });

function generateJSON(){

  const title =
    document.getElementById('song-title').value;

  const category =
    document.getElementById('song-category').value;

  const content =
    document.getElementById('song-content').value;

  const song = {
    id: nextID,
    title,
    category,
    content
  };

  document.getElementById('json-output').value =
    JSON.stringify(song, null, 2) + ',';

}

function copyJSON(){

  const output =
    document.getElementById('json-output');

  output.select();

  document.execCommand('copy');

  alert('JSON copied');

}

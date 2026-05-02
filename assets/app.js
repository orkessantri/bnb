let size = 22;

function zoomIn(){
  size += 2;
  document.querySelector(".song").style.fontSize = size + "px";
}

function zoomOut(){
  size -= 2;
  document.querySelector(".song").style.fontSize = size + "px";
}

const chords = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

function transpose(step){
  document.querySelectorAll(".chord").forEach(el=>{
    let c = el.innerText;
    let m = c.match(/^([A-G](#|b)?)(.*)$/);
    if(!m)return;

    let root=m[1];
    let suf=m[3];

    const map={Db:"C#",Eb:"D#",Gb:"F#",Ab:"G#",Bb:"A#"};
    if(map[root]) root=map[root];

    let i=chords.indexOf(root);
    if(i==-1)return;

    el.innerText=chords[(i+step+12)%12]+suf;
  });
}

function toggleDark(){
  document.body.classList.toggle("dark");
}

window.onload = function(){
  let el = document.querySelector(".song");
  if(!el)return;

  el.innerHTML = el.innerHTML.replace(
    /\b([A-G](#|b)?m?)\b/g,
    '<span class="chord">$1</span>'
  );
};

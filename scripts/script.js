const form = document.querySelector("form"),
fileInput = document.querySelector(".file-input"),
progressArea = document.querySelector(".progress-area"),
uploadedArea = document.querySelector(".uploaded-area");
ul = document.getElementById("temporary");
const uploadfile = document.getElementById("upload-files");
let fullFileName = new Array(1);
let amount = 0;
form.addEventListener("click", () =>{
  fileInput.click();
});
fileInput.onchange = ({target})=>{
  let file = target.files[0];
  if(file){
    fullFileName.unshift(file.name);
    let fileName = file.name;
    if(fileName.length >= 12){
      let splitName = fileName.split('.');
      fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
    }
    uploadFile(fileName);
  }
}

function uploadFile(name){
  console.log(fullFileName);
  amount++;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "php/upload.php");
  xhr.upload.addEventListener("progress", ({loaded, total}) =>{
    let fileLoaded = Math.floor((loaded / total) * 100);
    let fileTotal = Math.floor(total / 1000);
    let fileSize;
    (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024*1024)).toFixed(2) + " MB";
    let progressHTML = `<li class="row">
                          <i class="fas fa-file-alt"></i>
                          <div class="content">
                            <div class="details">
                              <span class="name">${name} • Uploading</span>
                              <span class="percent">${fileLoaded}%</span>
                            </div>
                            <div class="progress-bar">
                              <div class="progress" style="width: ${fileLoaded}%"></div>
                            </div>
                          </div>
                        </li>`;
    uploadedArea.classList.add("onprogress");
    progressArea.innerHTML = progressHTML;

    if(loaded == total){
      
      progressArea.innerHTML = "";
      let uploadedHTML = `<li class="row" name="uploadStatus">
                            <div class="content upload">
                              <i class="fas fa-file-alt"></i>
                              <div class="details">
                                <span class="name">${name} • Uploaded</span>
                                <span class="size">${fileSize}</span>
                              </div>
                            </div>
                            <i class="fas fa-check" name="state" onmouseover="deleteUpload()" onmouseout="keepUpload()"></i>
                          </li>`;
      uploadedArea.classList.remove("onprogress");
      ul.insertAdjacentHTML("afterbegin", uploadedHTML);
    }
  });
  let data = new FormData(form);
  xhr.send(data);
};

function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement; 
}

let index;
function deleteUpload(){
  stat = document.getElementsByName("state");
  upStat = document.getElementsByName("uploadStatus");
  stat[index].classList.remove("fa-check");
  stat[index].classList.add("fa-minus-circle");
  console.log(fullFileName[index], index)
  stat[index].addEventListener("click",()=>{
    var request = new XMLHttpRequest();
    request.open('POST', `http://localhost:3000/deleteTempFile?filename=${fullFileName[index]}`)
    request.send();
    upStat[index].style.display="none";

  });
};
function keepUpload(){
  stat = document.getElementsByName("state");
  stat[index].classList.add("fa-check");
  stat[index].classList.remove("fa-minus-circle");
};

function getEventTarget(e) {
  e = e || window.event;
  return e.target || e.srcElement; 
}

ul.onmouseover = function(event) {
  let target = getEventTarget(event);
  let li = target.closest('li'); // get reference
  let nodes = Array.from( li.closest('ul').children ); // get array
  index = nodes.indexOf( li ); 
};

uploadfile.addEventListener("click",()=>{
  console.log(amount);
  var request = new XMLHttpRequest();
    request.open('POST', `http://localhost:3000/sendAll`)
    request.send();
    uploadedArea.style.display="none";
});


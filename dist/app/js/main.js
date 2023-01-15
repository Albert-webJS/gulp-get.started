console.log("file main.js includs logger.js")

let index = 0;
let speed = 100;
let text = "build gulp!";

function typeWrite() {
  if (index < text.length) {
    document.querySelector(".text").innerHTML += text.charAt(index);
    index++;
    setTimeout(typeWrite, speed);
  }
}


typeWrite();
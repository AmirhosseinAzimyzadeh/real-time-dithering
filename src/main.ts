import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <div>
    <video style="display: none" autoplay></video>
  </div>
  <div>
    <canvas></canvas>
  </div>
  <button>Capture</button>
`

function init() {
  const video = document.querySelector('video');
  const canvas = document.querySelector('canvas');
  const button = document.querySelector('button');
  if (!video || !canvas || !button) return;
  canvas.width = 480;
  canvas.height = 360;

  button.onclick = function() {
    /* set the canvas to the dimensions of the video feed */
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    /* make the snapshot */
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
  };


  navigator.mediaDevices.getUserMedia( {audio: false, video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch(error => console.error(error));

  const draw = () => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    requestAnimationFrame(draw);
  }
  window.requestAnimationFrame(draw);
}

init();




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


  let stream: MediaStream | null = null;
  navigator.mediaDevices.getUserMedia( {audio: false, video: true })
  .then((s) => {
    stream = s;
    video.srcObject = s;
  })
  .catch(error => console.error(error));

  const draw = async () => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    if (stream) {
      const frameData = ctx.createImageData(canvas.width, canvas.height);
      console.log(frameData.data.length)      
    }
    requestAnimationFrame(draw);
  }
  window.requestAnimationFrame(draw);
}

init();




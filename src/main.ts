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

function getColorIndicesForCoord(x: number, y: number, width: number) {
  const red = y * (width * 4) + x * 4;
  return [red, red + 1, red + 2, red + 3];
}

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
      const frameData = ctx.getImageData(0,0,100,100);
      
      const xCoord = 20;
      const yCoord = 20;
      const canvasWidth = canvas.width;
      const colorIndices = getColorIndicesForCoord(xCoord, yCoord, canvasWidth);
      const [redIndex, greenIndex, blueIndex, alphaIndex] = colorIndices;
      console.log({
        r: frameData.data[redIndex],
        g: frameData.data[greenIndex],
        b: frameData.data[blueIndex],
        a: frameData.data[alphaIndex],
      })
    }
    requestAnimationFrame(draw);
  }
  window.requestAnimationFrame(draw);
}

init();




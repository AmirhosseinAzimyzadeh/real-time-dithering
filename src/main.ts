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
      const frameData = ctx.getImageData(0,0,canvas.width, canvas.height);
      
      for (let row = 0; row < canvas.height; row++) {
        for (let column = 0; column < canvas.width; column++) {
          const colorIndices = getColorIndicesForCoord(column, row, canvas.width);
          const [redIndex, greenIndex, blueIndex, alphaIndex] = colorIndices;
          const [r, g, b, a] = [frameData.data[redIndex], frameData.data[greenIndex], frameData.data[blueIndex], frameData.data[alphaIndex]];
          let avg = (r + g + b) / 3;
          avg = avg > 255/2 ? 255 : 0;
          const [newR, newG, newB] = [
            avg,
            avg,
            avg,
          ];
          frameData.data[redIndex] = newR;
          frameData.data[greenIndex] = newG;
          frameData.data[blueIndex] = newB;
          frameData.data[alphaIndex] = a;
        }
      }
      ctx.putImageData(frameData, 0, 0);
    }


    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(draw);
  }
  window.requestAnimationFrame(draw);
}

init();




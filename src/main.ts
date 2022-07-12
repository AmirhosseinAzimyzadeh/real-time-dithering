import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <div>
    <video style="display: none" autoplay></video>
  </div>
  <div>
    <canvas></canvas>

    <input type="range" id="volume" name="volume"
    min="1" max="255" step="1" value="255">
  </div>
`

let FACTOR = 255;

function getColorIndicesForCoord(x: number, y: number, width: number) {
  const red = y * (width * 4) + x * 4;
  return [red, red + 1, red + 2, red + 3];
}

function getColorValues(x: number, y: number, width: number, frameData: ImageData) {
  const colorIndices = getColorIndicesForCoord(x, y, width);
  const [redIndex, greenIndex, blueIndex, alphaIndex] = colorIndices;
  return [
    frameData.data[redIndex],
    frameData.data[greenIndex],
    frameData.data[blueIndex],
    frameData.data[alphaIndex]
  ];
}

function init() {
  const video = document.querySelector('video');
  const canvas = document.querySelector('canvas');
  const input = document.querySelector('input') as HTMLInputElement;
  if (!video || !canvas || !input) return;
  canvas.width = 480;
  canvas.height = 360;

  input.addEventListener('change', (e) => {
    FACTOR = Number(e.target?.value);
  })


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
          const [r, g, b, a] = getColorValues(column, row, canvas.width, frameData);
          
          let avg = (r + g + b) / 3;
          const currentColor = avg < 128 ? 0 : 255;
          const error = avg - currentColor;

          // neighbor pixels
          const factor = 1/FACTOR;
          const correctionValue = Math.round(error * factor);


          frameData.data[redIndex] = currentColor;
          frameData.data[greenIndex] = currentColor;
          frameData.data[blueIndex] = currentColor;
          frameData.data[alphaIndex] = 255;

          // bottom right
          if (column === canvas.width - 1 && row === canvas.height - 1) {
            // next pixel
            continue;
            // top left
          } else if (column === 0 && row === 0) {

            continue;
            // top right
          } else if (column === canvas.width - 1 && row === 0) {

            continue;
            // bottom left
          } else if (column === 0 && row === canvas.height - 1) {

            continue;
          }


          const colorIndices1 = getColorIndicesForCoord(column + 1, row, canvas.width);
          const [redIndex1, greenIndex1, blueIndex1, alphaIndex1] = colorIndices1;
          const [r1, g1, b1] = getColorValues(column + 1, row, canvas.width, frameData);
          const b1Color = ((r1 + g1 + b1) / 3) + correctionValue;
          frameData.data[redIndex1] = b1Color;
          frameData.data[greenIndex1] = b1Color;
          frameData.data[blueIndex1] = b1Color;
          frameData.data[alphaIndex1] = 255;


          const colorIndices2 = getColorIndicesForCoord(column + 1, row + 1, canvas.width);
          const [redIndex2, greenIndex2, blueIndex2, alphaIndex2] = colorIndices2;
          const [r2, g2, b2] = getColorValues(column + 1, row + 1, canvas.width, frameData);
          const b2Color = ((r2 + g2 + b2) / 3) + correctionValue;
          frameData.data[redIndex2] = b2Color;
          frameData.data[greenIndex2] = b2Color;
          frameData.data[blueIndex2] = b2Color;
          frameData.data[alphaIndex2] = 255;


          const colorIndices3 = getColorIndicesForCoord(column, row + 1, canvas.width);
          const [redIndex3, greenIndex3, blueIndex3, alphaIndex3] = colorIndices3;
          const [r3, g3, b3] = getColorValues(column, row + 1, canvas.width, frameData);
          const b3Color = ((r3 + g3 + b3) / 3) + correctionValue;
          frameData.data[redIndex3] = b3Color;
          frameData.data[greenIndex3] = b3Color;
          frameData.data[blueIndex3] = b3Color;
          frameData.data[alphaIndex3] = 255;

          const colorIndices4 = getColorIndicesForCoord(column - 1, row + 1, canvas.width);
          const [redIndex4, greenIndex4, blueIndex4, alphaIndex4] = colorIndices4;
          const [r4, g4, b4] = getColorValues(column, row + 1, canvas.width, frameData);
          const b4Color = ((r4 + g4 + b4) / 3) + correctionValue;
          frameData.data[redIndex4] = b4Color;
          frameData.data[greenIndex4] = b4Color;
          frameData.data[blueIndex4] = b4Color;
          frameData.data[alphaIndex4] = 255;
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




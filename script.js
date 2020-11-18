const video = document.getElementById('video');
const status = document.getElementById('status');
var isTrackVisible = false;

function toggleTrackingVisibility() {
  if (isTrackVisible) {
    document.body.querySelector("#canvas").style = "display: none";

    document.body.querySelector("#trackingToggle").innerHTML = "Тракинг асаах";

    status.innerHTML += "Tracking untarsan<br>";
    
  }
  else {
    document.body.querySelector("#canvas").style = "";

    document.body.querySelector("#trackingToggle").innerHTML = "Тракинг унтраах";

    status.innerHTML += "Tracking assan<br>";
  }
  
  isTrackVisible ^= true;
}

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )

  status.innerHTML += "Video assan<br>";
  
  isCameraVisible = true;
}

function loadModels() {
  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
  ]).then( () => {
    status.innerHTML += "Model unshsan<br>";
    document.body.querySelector(".loader").remove();
    startVideo();
    
  });
}

function startTracking() {
  video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    canvas.id = "canvas";
    document.body.querySelector("#video_player").append(canvas);
    status.innerHTML += "Tracking ehelsen<br>";
    isTrackVisible = true;
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }, 100);
  })
}

function start() {
  loadModels();
  startTracking();
}

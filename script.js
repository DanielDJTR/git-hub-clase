let isOpencvReady = false;
let faceCascade;

function onOpenCvReady() {
    isOpencvReady = true;
    document.getElementById("fileInput").disabled = false;

    // Cargar el clasificador para detección de rostros
    faceCascade = new cv.CascadeClassifier();
    faceCascade.load('haarcascade_frontalface_default.xml');
}

document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        const img = new Image();
        img.src = reader.result;
        img.onload = function () {
            if (isOpencvReady) {
                detectFaces(img);
            } else {
                alert("OpenCV.js no está listo aún.");
            }
        };
    };

    if (file) {
        reader.readAsDataURL(file);
    }
});

function detectFaces(img) {
    const src = cv.imread(img);
    const gray = new cv.Mat();
    const faces = new cv.RectVector();
    const scaleFactor = 1.1;
    const minNeighbors = 3;
    const faceSize = new cv.Size(30, 30);

    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    faceCascade.detectMultiScale(gray, faces, scaleFactor, minNeighbors, 0, faceSize);

    for (let i = 0; i < faces.size(); ++i) {
        const face = faces.get(i);
        const point1 = new cv.Point(face.x, face.y);
        const point2 = new cv.Point(face.x + face.width, face.y + face.height);
        cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
    }

    cv.imshow("uploadedImage", src);
    src.delete();
    gray.delete();
    faces.delete();
}

// Generated by CoffeeScript 1.10.0
(function() {
  var camera, cv, intervalId, namedWindow;

  var cv = require('opencv');

  console.log("Started Training");
  var trainingData = [];
  for (var i = 0; i< 1; i++){
    for (var j = 0; j<243; j++){
      trainingData.push([i,"ModelsFaceDetections/" + i + "/" + j + ".jpg"]);
      //trainingData.push([i,"/Users/peterbraden/Downloads/orl_faces/s" + i + "/" + j + ".pgm" ])
    }
  }
  
  var facerec = cv.FaceRecognizer.createEigenFaceRecognizer();
  facerec.trainSync(trainingData);
  console.log("Done Training")

  console.log("Recognizing...")
  face_cascade = new cv.CascadeClassifier('haarcascade_frontalface_alt.xml')

  camera = new cv.VideoCapture(0);
  
  namedWindow = new cv.NamedWindow('Video', 0);

  intervalId = setInterval(function() {
    return camera.read(function(err, im) {
      var res;
      if (err) {
        console.log("The err ==>" + err);
      }
      if (im.width() > 0 && im.height() > 0) {
        namedWindow.show(im);
        img_gray = im.copy();
        img_gray.convertGrayscale();
        face_cascade.detectMultiScale(img_gray,
            function(err, faces) {
                for (var i = 0; i < faces.length; i++){
                  var face = faces[i];
                  img_crop = img_gray.crop(face.x,face.y,face.width,face.height)
                  img_crop.resize(60,60, 1);
                  //img_crop.save( + x + '.jpg');
                  facerec.predict(img_crop, (result) => { console.log(result)});
                  //console.log(result);
                  //im.ellipse(face.x + face.width / 2, face.y + face.height / 2, face.width / 2, face.height / 2);
                  //namedWindow.show(im);
            }});
      
      }
      res = namedWindow.blockingWaitKey(0, 20);
      //console.log("KEYPRESSED => " + res + " ");
      if (res >= 0) {
        return clearInterval(intervalId);
      }
    });
  }, 50);

}).call(this);

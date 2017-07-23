var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var multer = require('multer');
var upload = multer({dest: '/home/jorge/projects/fileuploadmulter/public/uploads'});
var mongoose = require('mongoose');
Photo = require('./models/photo.js');
mongoose.connect('mongodb://localhost/multer');
var db = mongoose.connection;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 3000);

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  Photo.getPhotos((err, photos) => {
    if (err) {
      console.log(err);
    }
    res.render('index', {photos: photos});
  });
});

app.post('/profile', upload.single('avatar'), (req, res, next) => {
  var newPhoto = {
    filePath: req.file.path,
    fileSize: req.file.size,
    mimeType: req.file.mimetype,
    fileName: req.file.filename
  };
  Photo.addPhoto(newPhoto, (err, photo) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
});

app.listen(app.get('port'), () => {
  console.log('app running on port ' + app.get('port').toString());
});

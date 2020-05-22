const express=  require('express');
const path = require('path');
// initialize APP
const app = express();
// View Engine Setup
app.set('view engine', 'ejs');
// Body Parser
app.use(express.urlencoded({extended: true}));
// Public Directory
app.use(express.static(__dirname + '/public'));
// Multer Require
const multer  = require('multer');

// Storage Setup
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './public/uploads');
  },
  filename: function(req, file, cb){
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check Extention Name
const checkFileRequirement = (req, file, cb) => {
  const extn = path.extname(file.originalname);
  const type = /jpg|png|jpeg/;
  if(!type.test(extn)){
    cb(new Error('Only Images can be Uploaded'));
  }else{
    cb(null, file);
  }
};

// Upload Setup
const upload = multer({
  storage: storage,
  limits: {fileSize: 100000},
  fileFilter: checkFileRequirement
}).single('image');

// index Route
app.get('/', (req, res) => {
    res.render('index');
});

//  Post Route 
app.post('/upload', (req, res) => {
  upload(req, res, (err)=>{
    if(err){
      res.render('index', {error: err.message});
    }else{
      if(typeof req.file === 'undefined'){
        res.render('index', {error: 'No File Selected'});
      }else{
        res.render('index', {image: req.file.filename});
      }
    }
  });
});

// PORT Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, process.env.IP,() => {
    console.log(`Server started on port ${PORT}`);
});
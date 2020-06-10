const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const Student = require('./models/Student');
const csv = require('csvtojson');
const fs = require('fs');

// Connect to DB
const connectDB = async () => {
    try{
        await mongoose.connect('mongodb://localhost/CSV_DATA', {
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log('MongoDB Connected....');
    }catch(e){
        console.log(e);
    }
};
connectDB();

// View Engine Setup
app.set('view engine', 'ejs');
// Body Parser Setup
app.use(express.urlencoded({extended: true}));
// Public Directory
app.use(express.static(__dirname + '/public'));

// File Filter Setup
const fileFilter = (req, file, cb) => {
    const extn = path.extname(file.originalname);
    const type = /csv/;
    if(!type.test(extn)){
        cb(new Error('Only CSV files can be uploaded'));
    }else{
        cb(null, file);
    }
};
// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, done) => {
        done(null, './public/csv-uploads');
    },
    filename: (req, file, done) => {
        done(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
// Upload Options
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
}).single('csv');

// Index Route
app.get('/', (req, res) => {
    res.render('index');
});

// Upload Route
app.post('/upload',  async (req, res) => {
    let filePath;
    upload(req, res, async (err) => {
      if (err) {
        res.render('index', {error: err});
      }else if(typeof req.file === 'undefined'){
            res.render('index', {error: 'No file Selected'});
        }else{
            filePath = `${req.file.destination}/${req.file.filename}`; 
            const jsonArray = await csv().fromFile(filePath);
            jsonArray.forEach(async student => {
                let s = new Student(student);
                await s.save();
            });
            fs.unlink(filePath, (err)=> {
                if(err){
                    res.render('index', {error: 'Server Error'});
                }else{
                    res.render('index', {error: 'File Uploaded'});
                }
            });
        }
    });
   
  });

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

 

const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const Student = require('./models/Student');
const csv = require('csvtojson');
const fs = require('fs');
const { Parser } = require('json2csv');

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
app.get('/', async(req, res) => {
    const students = await Student.find();
    const fields = ['marks__s1','marks__s2','marks__s3','marks__s4','marks__s5','createdAt','_id','name','school_id','class','email','__v'];
    const opts = { fields };
    try {
        const parser = new Parser(opts);
        const csv = parser.parse(students);
        fs.writeFileSync('./public/exports/export.csv', csv);
        res.render('index');
    } catch (err) {
        console.error(err);
    }
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
            fs.unlink(filePath, async (err)=> {
                if(err){
                    res.render('index', {error: 'Server Error'});
                }else{
                    const students = await Student.find();
                    res.render('index', {error: 'File Uploaded', students});
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

 

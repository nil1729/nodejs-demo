const express = require('express');
const app = express();
const { default: Axios } = require('axios');

app.set('view engine', 'ejs');

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.get('/', (req, res)=> {
    res.render('index');
})

app.post('/', async (req, res)=> {
    const location = req.body.location;
    try{
        const response = await Axios.get(`http://api.weatherstack.com/current?access_key=45f9c330b048017ed311ef4aa3242ac9&query=${location}`);
        const data = response.data;
        res.render('index', {data: data});
    }catch(e){
        console.log('Cant get data');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
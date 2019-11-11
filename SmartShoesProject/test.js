var express = require('express'); 
var bodyParser = require('body-parser'); 
var app = express(); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({extended : false})); 
app.use(bodyParser.json());
app.set('view engine', 'ejs');//ejs 템플릿 엔진  연동 
var fs = require('fs');
const PythonShell = require('python-shell');

var resultList_ = [];
var userName = "";
var userSize = 0;


function fsrHeatmapSaver(){
    var savefigpyshell = new PythonShell('savefigs.py');
    savefigpyshell.on('message', (msg) => {
        if(msg=="sfc")
        {
            console.log("yes sfc");
        }
        else{
            console.log('no sfc');
        }
    });
    
    savefigpyshell.end((err) => {
        if(err){throw err;};
    
        console.log('save figures finished');
    });
}

function analysisMaker(){
    const pyshell2 = new PythonShell('analysis.py');
    
    pyshell2.end((err) => {
    if (err){
        throw err;
    };
    const fs = require('fs');
    let rawdata = fs.readFileSync('./public/texts/result.txt').toString(); 

    console.log(rawdata);
    console.log('finished');
    });
}

// route setting - 라우팅(routing) 
app.get('/', (req, res) => { 
   //res.send('Hello World!'); 
   var data = req.body;
   res.render('index', {name: data});//views디렉토리안에 있는 index.ejs 파일 
});

app.post('/', (req, res) => { 

    userName = req.body.name;
    userSize = req.body.size;
    console.log(userName + userSize);
    var getDatapyshell = new PythonShell('test.py');

    getDatapyshell.send(JSON.stringify([userName ,userSize]));

    getDatapyshell.on('message', (message) => {
        // received a message sent from the Python script (a simple "print" statement)
        console.log(message);
        // end the input stream and allow the process to exit
    });
    
    getDatapyshell.end((err) => {
        if (err){
            throw err;
        };
        console.log('get Data finished');
        fsrHeatmapSaver();
        analysisMaker();
    });
   
    
});


app.get('/analysis', (req,res) => {
    fs.readFile('./public/texts/result.txt', 'utf8', (err, data) => {
        resultList_= data.split('*');
        if(resultList_[6] == 0){
            resultList_.push("빌 게이츠", "크리스틴 스튜어트");
        }else if(resultList_[6] == 1){
            resultList_.push("비욘세","마이클 잭슨");
        }else if(resultList_[6] == 2){
            resultList_.push("마돈나","스티브 잡스");
        }else{
            resultList_.push("오프라 윈프리","로버트 다우니 주니어");
        }
        res.render('analysis', {resultList: resultList_});
    });
});


app.listen(3000, () => { 
    console.log('App Listening on port 3000'); 
});

// pyshell.send(JSON.stringify([1,2,3,4,5]));
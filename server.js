var express = require('express');
const crawler = require('./string-interceptor.js');//개발기간 init 필요에 의한 별도처리

// const cors = require('cors');
// const getFollower = require('./crawling-count');


// crawler.startCronJob();

var app = express();
// const corsOptions = {
//     origin: ['http://*.shop-ing.co.kr','http://dev.shop-ing.co.kr','http://qa.shop-ing.co.kr','http://localhost:81','http://localhost'],
//     credentials: true,
// };

// app.use(cors(corsOptions)); 

// app.get('/crawling', async function(req, res){
//     getFollower(req.query.type,req.query.id).then(data=>{
//         res.json(data);
//     });
// });

app.post('/query', async function (req, res) {
    console.log(req.body);
    console.log(req.body.url);
    crawler.init(req.body.url)
});

var server = app.listen(3000, function () {
    console.log("Express server has started on port 3000")
})
const express = require('express');
const http = require('http');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const bodyparser = require('body-parser');

let app = express();

app.set('port', 12000);
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.render('main', { msg: 'Welcome To Express4' });
});

app.get('/poplist', function (req, res) {

    request("https://music.naver.com/listen/top100.nhn?domain=OVERSEA_V2", function (err, response, body) {
        let list = [];
        $ = cheerio.load(body);

        let poplist = $("._tracklist_move  .name .ellipsis");

        for (let i = 0; i < poplist.length; i++) {
            let msg = $(poplist[i]).text();
            list.push(msg);
        }

        res.render('poplist', { msg: '해외 TOP 100', list: list });
    });
});

app.get('/search', function (req, res) {
    res.render('search', {});
});

app.post('/search', function (req, res) {
    let word = req.body.word;
    let url = "https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=" + word;
    request(url, function (err, response, body) {
        let list = [];
        $ = cheerio.load(body);

        let result = $(".music_type .type01 > li dt > a:first-child");

        for (let i = 0; i < result.length; i++) {
            let msg = $(result[i]).text();
            list.push(msg);
        }

        res.render('search', { msg: '팝송 검색 결과', list: list });
    });
});


let server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log(`Express 엔진이 ${app.get('port')}에서 실행중`);
});
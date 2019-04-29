const express = require('express');
const http = require('http');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const bodyparser = require('body-parser');
const qs = require('querystring');

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

        let poplist = $("._tracklist_move > .name");

        for (let i = 1; i < poplist.length; i++) {
            let msg = $(poplist[i]).text();
            list.push(msg);
        }

        res.render('poplist', { msg: '국내 팝송 TOP 100', list: list });
    });
});

app.get('/indielist', function (req, res) {

    request("https://www.melon.com/chart/style/index.htm?styleCd=GN0502#params%5Bidx%5D=1&params%5BstartDay%5D=20190422&params%5BendDay%5D=20190428&params%5BisFirstDate%5D=false&params%5BisLastDate%5D=true", function (err, response, body) {
        let list = [];
        $ = cheerio.load(body);

        let indielist = $("#frm table > tbody > tr");

        for (let i = 0; i < indielist.length; i++) {
            let data = {};
            data.rank = $(indielist[i]).find("td:nth-child(2) .rank").text();
            data.src = $(indielist[i]).find("td:nth-child(4) img").attr("src");
            data.title = $(indielist[i]).find("td:nth-child(6) .rank01").text();
            data.artist = $(indielist[i]).find("td:nth-child(6) .rank02").text();
            data.album = $(indielist[i]).find("td:nth-child(7) .rank03 a").text();
            
            list.push(data);
            
        }

        res.render('indielist', { msg: '국내 인디 TOP 100', list: list });
    });
});

app.get('/search', function (req, res) {
    res.render('search', {});
});

app.post('/search', function (req, res) {
    let word = req.body.word;
    word = qs.escape(word);
    let url = "https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=" + word;
    
    request(url, function (err, response, body) {
        let list = [];
        $ = cheerio.load(body);

        let result = $(".music_type .type01 > li  .music_lst");

        for (let i = 0; i < result.length; i++) {
            let msg = $(result[i]).text();
            list.push(msg);
        }

        res.render('search', { msg: '음악 검색 결과', list: list });
    });
});


let server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log(`Express 엔진이 ${app.get('port')}에서 실행중`);
});
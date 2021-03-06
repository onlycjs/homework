const express = require('express');
const http = require('http');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const bodyparser = require('body-parser');
const qs = require('querystring');
const iconv = require('iconv-lite');  //인코딩 변환도구
const charset = require('charset');  //캐릭터셋 체크 도구
const mysql = require('mysql');

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

const conn = mysql.createConnection({
    user: "yy_30218",
    password: "1234",
    host: "gondr.asuscomm.com"
});

conn.query("USE yy_30218"); //yy_30218 데이터베이스 사용

app.get('/poplist', function (req, res) {

    request("https://www.melon.com/chart/day/index.htm?classCd=AB0000", function (err, response, body) {
        let list = [];
        $ = cheerio.load(body);

        let poplist = $("#frm table > tbody > tr");

        for (let i = 0; i < poplist.length; i++) {
            let data = {};
            data.rank = $(poplist[i]).find("td:nth-child(2) .rank").text();
            data.src = $(poplist[i]).find("td:nth-child(4) img").attr("src");
            data.title = $(poplist[i]).find("td:nth-child(6) .rank01").text();
            data.artist = $(poplist[i]).find("td:nth-child(6) .rank02").text();
            data.album = $(poplist[i]).find("td:nth-child(7) .rank03 a").text();

            list.push(data);

        }

        res.render('poplist', { msg: '국내 팝송 TOP 100', list: list });
    });
});

app.get('/indielist', function (req, res) {

    request("https://www.melon.com/chart/day/index.htm?classCd=GN0500", function (err, response, body) {
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

app.get('/hiplist', function (req, res) {

    request("https://www.melon.com/chart/day/index.htm?classCd=GN1200", function (err, response, body) {
        let list = [];
        $ = cheerio.load(body);

        let hiplist = $("#frm table > tbody > tr");

        for (let i = 0; i < hiplist.length; i++) {
            let data = {};
            data.rank = $(hiplist[i]).find("td:nth-child(2) .rank").text();
            data.src = $(hiplist[i]).find("td:nth-child(4) img").attr("src");
            data.title = $(hiplist[i]).find("td:nth-child(6) .rank01").text();
            data.artist = $(hiplist[i]).find("td:nth-child(6) .rank02").text();
            data.album = $(hiplist[i]).find("td:nth-child(7) .rank03 a").text();

            list.push(data);

        }

        res.render('indielist', { msg: '국내 힙합 TOP 100', list: list });
    });
});

app.get('/balladlist', function (req, res) {

    request("https://www.melon.com/chart/day/index.htm?classCd=GN0100", function (err, response, body) {
        let list = [];
        $ = cheerio.load(body);

        let balladlist = $("#frm table > tbody > tr");

        for (let i = 0; i < balladlist.length; i++) {
            let data = {};
            data.rank = $(balladlist[i]).find("td:nth-child(2) .rank").text();
            data.src = $(balladlist[i]).find("td:nth-child(4) img").attr("src");
            data.title = $(balladlist[i]).find("td:nth-child(6) .rank01").text();
            data.artist = $(balladlist[i]).find("td:nth-child(6) .rank02").text();
            data.album = $(balladlist[i]).find("td:nth-child(7) .rank03 a").text();

            list.push(data);

        }

        res.render('indielist', { msg: '국내 발라드 TOP 100', list: list });
    });
});

app.get('/dancelist', function (req, res) {

    request("https://www.melon.com/chart/day/index.htm?classCd=GN0200", function (err, response, body) {
        let list = [];
        $ = cheerio.load(body);

        let dancelist = $("#frm table > tbody > tr");

        for (let i = 0; i < dancelist.length; i++) {
            let data = {};
            data.rank = $(dancelist[i]).find("td:nth-child(2) .rank").text();
            data.src = $(dancelist[i]).find("td:nth-child(4) img").attr("src");
            data.title = $(dancelist[i]).find("td:nth-child(6) .rank01").text();
            data.artist = $(dancelist[i]).find("td:nth-child(6) .rank02").text();
            data.album = $(dancelist[i]).find("td:nth-child(7) .rank03 a").text();

            list.push(data);

        }

        res.render('indielist', { msg: '국내 댄스 TOP 100', list: list });
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

app.get('/melonlist', function (req, res) {

    let url = "https://www.melon.com/chart/";

    request(url, function (err, response, body) {

        let sql = "INSERT INTO melonlist (rank, image, mTitle, sName, Date, Time) VALUE(?, ?, ?, ?, curdate(), curtime())";

        let listC = [];
        $ = cheerio.load(body);

        for (let i = 1; i <= 100; i++) {
            let rank = $(".service_list_song > table > tbody tr:nth-child(" + i + ") .t_center .rank").text();
            let image = $(".service_list_song > table > tbody tr:nth-child(" + i + ") td:nth-child(4) a img").attr("src");
            let title = $(".service_list_song > table > tbody tr:nth-child(" + i + ") td:nth-child(6) .wrap .wrap_song_info .rank01 a").text();
            let singer = $(".service_list_song > table > tbody tr:nth-child(" + i + ") td:nth-child(6) .wrap .wrap_song_info .rank02 > a").text();

            let listA = [rank, image, title, singer];

            conn.query(sql, listA, function (err, result) { });

            let listB = [rank, title, singer];

            listC[i - 1] = listB;

        }

        res.render('melonlist', { res: listC, msg: "멜론 실시간 top100" });

    });
});

app.get('/status', function(req, res){
    res.render('status', {});
});

app.post('/status', function(req, res){

    let key = req.body.word + "%";
    console.log(key);

    let selectData = "SELECT * FROM melonlist WHERE mTitle LIKE ? ORDER BY rank, sName, Date, Time";

    let updateData = "UPDATE melonlist SET rank=rank,Date=curdate(),Time=curtime()";
    
    let deleteData = "DELETE FROM melonlist WHERE melonlist.id > 100";

    conn.query(deleteData, [key], function(err, result){
        
    });

    conn.query(updateData, [key], function(err, result){

    });

    conn.query(selectData, [key], function (err, result){

        res.render('status', {list : result, msg:"실시간 음악 순위"});

    });

});

app.get('/graph', function(req, res){
    res.render('graph', {});
});

app.post('/graph', function (req, res) {

    let key = req.body.word;
    console.log(key);

    let sql = "SELECT * FROM melonlist WHERE mtitle LIKE ? ORDER BY Time";

    let mTitle = req.body.mTitle;
    mTitle = qs.escape(mTitle);
    mTitle = "%" + req.body.mTitle + "%";
    let sName = req.body.sName;
    sName = qs.escape(sName);
    conn.query(sql, [mTitle,sName], function(err, result){
        res.render('graph', { msg: '검색 결과',list:result});
    });
});



let server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log(`Express 엔진이 ${app.get('port')}에서 실행중`);
});
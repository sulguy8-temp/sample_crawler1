let Crawler = require("crawler");
let dao = require('../config/dao-service.js');

/****************** Init Section ******************/
let shiName = '옹아리닷컴'
let shiNum = 1;
init();

async function init() {
    console.log(shiName + ' Crawler Start : ' + new Date());
    let shi = await dao.selectCSP(shiNum);
    crawlSHI(shi);
}

/***************** Custom Section *****************/
let selectorList = [
    'ul.nav > li > a'
]

let patternList = [

]

async function crawlSHI(shi) {
    category_que.queueSize = 1;
    let param = {
        shiNum: shi.SHI_NUM,
        url: 'http://' + shi.SHI_URL,
        selector: selectorList,
        pattern: patternList,
        que: goods_que,
    }
    category_que.queue(param);
}

let category_que = new Crawler({
    maxConnections: 1,
    callback: async function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            let $ = res.$;
            let menuList = $(res.options.selector[0]);
            for (let i = 0; i < menuList.length; i++) {
                let menu = $(menuList[i]);
                let category = menu.text().trim();
                let url = menu.attr('href');
                if (!category || !url.includes('http')) continue;
                console.log(i + ':' + category + ':' + url);

                /********** Insert Logic **********/
                let shiNum = res.options['shiNum'];
                let crcCategoryName = category;
                let crcCategoryUrl = url;
                let crcSelector = res.options.selector[0];
                let crcPattern = res.options.pattern[0] ? res.options.pattern[0] : null;

                let params = [shiNum, crcCategoryName, crcCategoryUrl, crcSelector, crcPattern];
                await dao.insertCRC(params);
                /**********************************/

                res.options.que.queue({
                    url: url,
                    category: category,
                    shiNum: shiNum
                });
            }
        }
        done();
    }
});

let goods_que = new Crawler({
    maxConnections: 100,
    callback: async function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            let $ = res.$;
            let rowList = $('div.list-wrap>div.item-row');
            for (let i = 0; i < rowList.length; i++) {
                let row = $(rowList[i]);
                let items = row.find('div.item-name>a').contents();

                /********** Insert Logic **********/
                let shiNum = res.options['shiNum'];
                let crgName = items[0].data.trim();
                let crgPrice = row.find('div.item-price').contents()[row.find('div.item-price').contents().length - 1].data.trim();
                let crgDisprice = row.find('div.item-price').contents()[row.find('div.item-price').contents().length - 1].data.trim();
                let crgSImg = row.find('div.img-item>img[src]').attr('src');
                let crgMImg = row.find('div.img-item>img[src]').attr('src');

                let params = [shiNum, crgName, crgPrice, crgDisprice, crgSImg, crgMImg];
                await dao.insertCRG(params);
                /**********************************/
            }
        }
        done();
    }
});



module.exports = {
    init: init
};
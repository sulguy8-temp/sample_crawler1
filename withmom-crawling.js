let Crawler = require("crawler");
let dao = require('./withmom-dao.js');
var cron = require('node-cron');

let count = -1;

let c = new Crawler({
    maxConnections : 1,
    callback : async function (error, res, done) {
        let list = [];
        if(error){
            console.log(error);
        }else{
            let $ = res.$;
            
            let menuList = $('ul.nav>li>a');
            console.log(menuList.length);
            for(let i=0;i<menuList.length;i++){
                let menu = $(menuList[i]);
                let category = menu.text().trim();
                let url = menu.attr('href');
                if(!category || !url.includes('http')) continue;
                console.log(i + ':' + category + ':' + url);
                res.options.que.queue({url:url,category:category});
            }
        }
        done();
    }
});
let ongari = new Crawler({
    maxConnections : 100,
    callback : async function (error, res, done) {
        let list = [];
        if(error){
            console.log(error);
        }else{
            let $ = res.$;
            console.log(res.options.category)
            let rowList = $('div.list-wrap>div.item-row');
            for(let i=0;i<rowList.length;i++){
                let row = $(rowList[i]);
                let itemImgSrc = row.find('div.img-item>img[src]').attr('src');
                let itemContents = row.find('div.item-name>a').contents();
                let itemTitle = itemContents[0].data.trim();
                let itemDesc = row.find('div.item-name>a>div.item-text').text().trim();
                let itemCost = row.find('div.item-price>strike').text().trim();
                let itemPrice = row.find('div.item-price').contents()[row.find('div.item-price').contents().length-1].data.trim();
                let itemPoint = row.find('div.item-details>span.green').text().trim();
                let itemDisPriceRate = row.find('div.item-details>span.orangered').text().trim();
                let itemReviewCnt = row.find('div.item-details>span.gray').text().trim();
                console.log(itemImgSrc);
                console.log(itemTitle);
                console.log(itemDesc);
                console.log(itemCost);
                console.log(itemPrice);
                console.log(itemPoint);
                console.log(itemDisPriceRate);
                console.log(itemReviewCnt);
            }
        }
        done();
    }
});
let crawlingList = [
    {
        url : `http://www.ongari.com/`,
        que:ongari
    }
]
async function blogCrawling(){
    c.queueSize=1;
    for(let item of crawlingList){
        item.url = encodeURI(item.url);
        c.queue(item);
    }
}

blogCrawling();
async function init(){
    console.log('start : ' + new Date());
    count = 0;
    let siList = await dao.selectShopInfo();
    siList.forEach(async (item)=>{
        blogCrawling(item.SHI_CRAWLING_WORD,item.SHI_NUM);
    });
    // await dao.deleteCrawlingInfo();
}

function startCronJob(){
    cron.schedule('0 5 2 * * *', () => {// 0 0 0 * * 7 -> 매주 일요일
        console.log('running every sunday 00:01:00');
        init();
    });
}
 
module.exports = {//개발기간 init 필요에 의한 별도처리
    startCronJob: startCronJob,
    init: init
};
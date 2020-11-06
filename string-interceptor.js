let Crawler = require("crawler");
let dao = require('./withmom-dao.js');

let hrefCrawler = new Crawler({
    maxConnections : 1,
    callback : async function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            let $ = res.$;
            let types = ['seller','goods','price','img']//클래스로 가능하지 않을까 고민중
            let resultObj = {};
            for(let type of types){
                let typePattern = res.options[type];
                let typePatternOpt = res.options[type+'Opt'];
                let typePatternOptJson = JSON.parse(typePatternOpt);
                let typeEle = $(typePattern);

                var result = strInit(typeEle);
                for(let order of typePatternOptJson){ 
                    result[order.order].call(null,order.value)
                }
                resultObj[type] = result.build();
            }
            console.log(resultObj);
        }
        done();
    }
});

async function hrefCrawling(obj){
    hrefCrawler.queueSize=1;
    let param = {
        // URL은 디비에 있는것을 바로쓰는게 아니  라 사용자가 입력하여서 요청할경우
        // URL을 포함하고 있을때 해당 경로를 승인하는 방법으로 동작됨
        // 개발중엔 디비의 경로를 바로 사용하는것으로 세팅하고
        // 추후 개발 URL은 검증용 URL로 재정의 필요함.
        url:encodeURI(obj['CHP_SHOP_URL']),
        seller:obj['CHP_SELLER_PATTERN'],
        sellerOpt:obj['CHP_SELLER_PATTERN_OPTION'],
        goods:obj['CHP_GOODS_PATTERN'],
        goodsOpt:obj['CHP_GOODS_PATTERN_OPTION'],
        price:obj['CHP_PRICE_PATTERN'],
        priceOpt:obj['CHP_PRICE_PATTERN_OPTION'],
        img:obj['CHP_IMG_PATTERN'],
        imgOpt:obj['CHP_IMG_PATTERN_OPTION'],
    }      
    hrefCrawler.queue(param);
}

function strInit(text) {
    var str = text;    
    return {
        src: function() {
            str = (str[0]['attribs']['src']);
            return this;
        },
        text: function() {
            let result = '';
            function getChildrenData(obj){
                if(obj['children']){
                    for(let childObj of obj['children']){
                        getChildrenData(childObj)
                    }
                }else{
                    result += obj['data'];
                }
                result = result.trim()
                return result;
            }                    
            str = getChildrenData(str[0]);
            return this;
        },
        subStrPrefix: function(num) {
            let tmp = str.substring(0,num);            
            str = str.replace(tmp,'');
            return this;
        },
        subStrSuffix: function(num) {    
            let tmp = str.substring(str.length - num,str.length);
            str = str.replace(tmp,'');
            return this;
        },
        build: function() {
            return str;
        }
    }
};

async function init(){
    console.log('start : ' + new Date());
    count = 0;
    let list = await dao.selectCHPList();
    list.forEach(async (item)=>{
        hrefCrawling(item);
    });
    // await dao.deleteCrawlingInfo();
}

var si = {
    strInit:strInit
}

init();

module.exports = si;
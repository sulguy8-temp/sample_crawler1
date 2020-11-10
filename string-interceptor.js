let Crawler = require("crawler");
let dao = require('./withmom-dao.js');

let hrefCrawler = new Crawler({
    maxConnections : 1,
    callback : async function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            let $ = res.$;
            let types = [
                'seller',   // CHP_SELLER_PATTERN, CHP_SELLER_PATTERN_OPTION
                'goods',    // CHP_GOODS_PATTERN, CHP_GOODS_PATTERN_OPTION
                'price',    // CHP_PRICE_PATTERN, CHP_PRICE_PATTERN_OPTION
                'img'       // CHP_IMG_PATTERN, CHP_IMG_PATTERN_OPTION
            ]               // 클래스로 가능하지 않을까 고민중
            let resultObj = {};

            for(let type of types){
                // Type
                let typePattern = res.options[type];    
                let typeEle = $(typePattern);

                // 우리가 정의한 strInit()으로 Custom하게 데이터 정제가능
                var result = strInit(typeEle);

                // Type Pattern
                let typePatternOpt = res.options[type+'Opt'];
                let typePatternOptJson = JSON.parse(typePatternOpt); 

                // 패턴을 정제하는 과정
                for(let order of typePatternOptJson){ 
                    result[order.order].call(null,order.value)
                }

                // JSON구조의 Result
                resultObj[type] = result.build();
            }
            console.log(resultObj);
        }
        done();
    }
});


// # DAO를 거친 데이터 리스트(obj) 를 받는 Function
async function hrefCrawling(obj){
    hrefCrawler.queueSize=1;
    let param = {
        // URL은 디비에 있는것을 바로쓰는게 아니라 사용자가 입력하여서 요청할경우
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

// DB에 저장되어있는 Option들을 파라미터(text)로 받아 데이터를 정제하는 함수
function strInit(text) {
    var str = text;    
    return {
        /****** 필수값 ******/
        // CHP_IMG_PATTERN_OPTION
        src: function() {
            str = (str[0]['attribs']['src']);      
        },

        // CHP_SELLER_PATTERN_OPTION, CHP_GOODS_PATTERN_OPTION, CHP_PRICE_PATTERN_OPTION
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
            console.log(str)
        },

        /****** 문자열 편집 ******/
        // 앞에서부터 자르기
        subStrPrefix: function(num) {
            let tmp = str.substring(0,num);            
            str = str.replace(tmp,'');
        },

        // 뒤에서부터 자르기
        subStrSuffix: function(num) {    
            let tmp = str.substring(str.length - num,str.length);
            str = str.replace(tmp,'');
        },

        /****** 결과, hrefCrawler()에서 객체로 사용하기 위해 추가됨 ******/
        build: function() {
            return str;
        },
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
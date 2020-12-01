const CrawlerPatterns = require("./CrawlerPatterns");
class HotdealCrawler {
    constructor() {
        // # Status
        this.status;
        this.counter;

        // # Que
        this.category_que;
        this.goods_que;

        let CrawlerPattern = new CrawlerPatterns();
        // # Patterns
        this.cspShopPagingPattern = JSON.parse(JSON.stringify(CrawlerPattern.paging));
        // Category
        this.cspCateSelector = JSON.parse(JSON.stringify(CrawlerPattern.selector));
        this.cspCateKeyOption = JSON.parse(JSON.stringify(CrawlerPattern.key));
        this.cspCateUriOption = JSON.parse(JSON.stringify(CrawlerPattern.contents));
        this.cspCateNameOption = JSON.parse(JSON.stringify(CrawlerPattern.contents));
        // Category Sub
        // this.cspCateSubSelector = Object.assign(this.cspCateSubSelector, CrawlerPattern.selector;
        // this.cspCateSubKeyOption = Object.assign(this.cspCateSubKeyOption, CrawlerPattern.key;
        // this.cspCateSubUriOption = Object.assign(this.cspCateSubUriOption, CrawlerPattern.contents;
        // this.cspCateSubNameOption = Object.assign(this.cspCateSubNameOption, CrawlerPattern.contents;
        // Goods
        // this.cspGoodsSelector = Object.assign(CrawlerPattern.selector;
        // this.cspGoodsKeyOption = Object.assign(CrawlerPattern.key;
        // this.cspGoodsUriOption = Object.assign(CrawlerPattern.contents;
        // this.cspGoodsDescOption = Object.assign(CrawlerPattern.contents;
        // this.cspGoodsNameOption = Object.assign(CrawlerPattern.contents;
        // this.cspGoodsPriceOption = Object.assign(CrawlerPattern.contents;
        // this.cspGoodsDispriceOption = Object.assign(CrawlerPattern.contents;
        // this.cspGoodsSimgOption = Object.assign(CrawlerPattern.contents;
        // this.cspGoodsMimgOption = Object.assign(CrawlerPattern.contents;
    }
}

let parser = new CrawlerPatterns();
HotdealCrawler.prototype.cheerioParser = (cheerio, options) => {
    return parser.cheerioParser(cheerio, options);
}

module.exports = HotdealCrawler;


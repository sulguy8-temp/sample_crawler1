const HotdealCrawler = require('../common/lib/HotdealCrawler.js');
const CrawlerJS = require("crawler");

class Enuri extends HotdealCrawler {
    constructor() {
        super();
        // Category
        this.category_queParam = {
            url: 'http://prod.danawa.com/list/?cate=16281&15main_16_02',
            crawlerObj: this
        };
        Object.assign(this.cspCateSelector, {
            "selector": ["div.cat_list_box > ul > li > a"], "value": null
        })
        Object.assign(this.cspCateUriOption, {
            "find": null, "content": [{ "order": "href", "value": "http://prod.danawa.com" }], "editor": null, "judge": null
        })
        Object.assign(this.cspCateNameOption, {
            "find": null, "content": [{ "order": "text", "value": "first" }], "editor": null, "judge": null
        })   
    }

    category_que = new CrawlerJS({
        maxConnections: 1,
        callback: async function (error, res, done) {
            if (error) {   
                console.log(error)
            } else {
                let $ = res.$;
                let crawlerObject = res.options.crawlerObj;
                let cspCateSelectorList = crawlerObject.cspCateSelector;
                if (cspCateSelectorList['value']) {
                    let cateSelectorStr = cspCateSelectorList['selector'][0];
                    for (let i = 0; i < cspCateSelectorList['value'].length; i++) {
                        if (i == 0) {
                            cspCateSelectorList['selector'] = [];
                        }
                        cspCateSelectorList['selector'].push(cateSelectorStr.replace('@value', cspCateSelectorList['value'][i]));
                    }
                }

                for (let cspCateSelector of cspCateSelectorList['selector']) {
                    let categoryList$ = $(cspCateSelector);
                    for (let i = 0; i < categoryList$.length; i++) {
                        let category$ = $(categoryList$[i]);
                        let cspCateUri_this = crawlerObject.cheerioParser(category$, crawlerObject.cspCateUriOption);
                        let cspCateName_this = crawlerObject.cheerioParser(category$, crawlerObject.cspCateNameOption);
                        console.log(cspCateUri_this)
                        console.log(cspCateName_this)
                        
                    }
                }
            }
            done();
        }
    });

    goods_que = new CrawlerJS({
        maxConnections: 100,
        callback: async function (error, res, done) {

            done();
        }
    });

    // # For Observer
    notify(command) {
        switch (command) {
            case 'Start':
                this.category_que.queue(this.category_queParam);
                break;
            case 'CheckStatus':
                console.log(this.category_queParam)
            case 'Stop':
                break;
        }
    };
}

module.exports = Enuri;
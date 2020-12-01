const HotdealCrawler = require('../common/lib/HotdealCrawler.js');
const CrawlerJS = require("crawler");

class Danawa extends HotdealCrawler {
    constructor() {
        super();
    }
    
    category_queParam = {
        url: 'http://www.danawa.com/',
        // csp: csps[num],
        // lastCateDepth: false,
    }

    category_que = new CrawlerJS({
        maxConnections: 1,
        callback: async function (error, res, done) {
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

module.exports = Danawa;
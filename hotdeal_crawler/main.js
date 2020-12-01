const Observable = require('./common/lib/Observer.js');
const Enuri = require('./crawler/Enuri.js');
const danawa_crawler = require('./crawler/danawa.js');

let status;

function init() { 
    console.log('start : ' + new Date());

    // # 크롤러 상태관리용 옵저버
    status = new Observable();

    let crawlerList = [
        new Enuri(), 
        // new danawa_crawler()
    ] 

    for(let crawler of crawlerList){
        status.registerObserver(crawler);
    }

    status.notifyObservers('Start');
    // status.notifyObservers('StatusCheck');
    // status.notifyObservers('Stop');
}

// function finish() {
//     status = null;
// }

init();
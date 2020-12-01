function Observable() {
    this.observers = [];
}

Observable.prototype.registerObserver = function (observer) {
    if (this.observers.indexOf(observer) === -1) {
        this.observers.push(observer);
    }
};
Observable.prototype.unregisterObserver = function (observer) {
    var index = this.observers.indexOf(observer);
    if (index > -1) {
        this.observers.splice(index, 1);
    }
};
Observable.prototype.notifyObservers = function (command) {
    this.observers.forEach(function (observer) {
        observer.notify(command);
    });
};

module.exports = Observable;
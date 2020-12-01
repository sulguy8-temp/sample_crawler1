class CrawlerPatterns {
    constructor() {
        // # Shop
        this.paging = {
            'key': null,
            'value': null
        }

        // # Contents
        this.selector = {
            'selector': null,
            'value': null
        }
        this.key = {
            'order': null,
            'value': null
        }
        this.contents = {
            'find': null,
            'content': null,
            'editor': null
        }
    }
}

CrawlerPatterns.prototype.parseAdapter = function (cheerio) {
    let target = cheerio;
    let text = '';
    let flag = true;
    return [
        // 0 : [find], cheerio에서 selector를 이용하여 특정 Class를 찾는 함수
        {
            find: function (val) {
                target = target.find(val);
            }
        },
        // 1 : [contents], cheerio에서 Text를 뽑아내는 함수들
        {
            text: function (val) {
                switch (val) {
                    case 'first':
                        text = target.contents().first().text().trim();
                        break
                    case 'end':
                        text = target.contents().end().text().trim();
                        break
                }
            },
            src: function (val) {
                text = val + target.attr('src');
            },
            href: function (val) {
                text = val + target.attr('href');
            },
            alt: function () {
                text = target.attr('alt');
            }
        },
        // 2 : [editor], contents에서 String을 편집하는 함수들
        {
            subStrPrefix: function (num) {
                text = text.substring(0, num).trim();
            },
            subStrSuffix: function (num) {
                text = text.substring(text.length - num, text.length).trim();
            },
            replace: function (val) {
                text = text.replace(val.before, val.after).trim();
            }
        },
        // 3 : [judge], 특정 요소 및, 문자열을 찾아서 Insert 여부를 판단하는 함수들
        {
            judge: function (val) {
                flag = text == val ? true : false;
            }
        },
        // 4 : 결과값을 리턴하는 함수
        {
            result: function () {
                let result = !flag ? flag : text;
                return result;
            }
        }
    ]
};

CrawlerPatterns.prototype.cheerioParser = function (cheerio, options) {
    // Closure 생성
    let adapter = this.parseAdapter(cheerio);

    let find = options.find ? options.find : null;
    find ? adapter[0]['find'].call(null, options.find.order) : null;

    let contentList = options.content ? options.content : null;
    if (contentList != null) {
        for (let option of options['content']) {
            adapter[1][option.order].call(null, option.value);
        }
    }

    let editorList = options.editor ? options.editor : null;
    if (editorList) {
        for (let option of options['editor']) {
            adapter[2][option.order].call(null, option.value);
        }
    }
    let result = adapter[4].result();

    // Closure 제거
    adapter = null;
    return result;
}

module.exports = CrawlerPatterns;
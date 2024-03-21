// ==UserScript==
// @name         demo
// @description  demo
// @version      0.1
// @match        https://www.baidu.com/sugrec?*
// @require      https://cdn.jsdelivr.net/npm/hls.js
// @require      https://cdn.jsdelivr.net/npm/lozad/dist/lozad.min.js
// @connect      github.io
// @connect      github.com
// @connect      obs-helf.cucloud.cn
// @connect      17cxxx.com
// @connect      88a2544.cc
// @connect      mm307.vip
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

var g_hls = null;
var g_video = null;
var g_domain = [];
var g_addr = [];
var g_pos;
var g_num;

function play_m3u8() {
    if (g_video == this) {
        return;
    } else if (g_video != null) {
        g_hls.destroy();
        g_video.controls = false;
        g_video.style.cursor = "pointer";
    }

    g_video = this;
    g_video.controls = true;
    g_video.style.cursor = "default";

    g_hls = new Hls({ id : this.id });
    g_hls.attachMedia(this);
    g_hls.loadSource(this.id);

    g_hls.on(Hls.Events.MANIFEST_PARSED, function() {
        g_video.play();
    });
}

function run_lozad_observer() {
    const observer = lozad('.lozad',{ load: function load(element) {
        function decode_xor(data, key = 0x88) {
            let binary = '';
            let bytes = new Uint8Array(data);
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i] ^ key);
            }
            return 'data:image/jpeg;base64,' + window.btoa(binary);
        }

        function decode_sub(data, key = 17) {
            let binary = '';
            let bytes = new Uint8Array(data);
            for (let i = key; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return 'data:image/jpeg;base64,' + window.btoa(binary);
        }

        function get_img_decode(addr, attr, decode) {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', addr, true);
            xhr.responseType = 'arraybuffer';
            xhr.setRequestHeader('Accept', 'no-cache');
            xhr.onload = function () {
                if(xhr.status === 200) {
                    element.setAttribute(attr, decode(xhr.response));
                }
            }
            xhr.send();
        }

        let poster = element.getAttribute("data-poster");

        if (poster) {
            element.poster = poster;
        }

        poster = element.getAttribute("data-poster-xor");

        if (poster) {
            get_img_decode(poster, 'poster', decode_xor);
        }

        poster = element.getAttribute("data-poster-sub");

        if (poster) {
            get_img_decode(poster, 'poster', decode_sub);
        }
     }});

    observer.observe();
}

function get_unicode(str) {
    let pos = 0;
    let out = '';

    for (let reg = /&#([\d\w]+);/g, ret; (ret = reg.exec(str)) !== null; ) {
        if (ret.index > pos) {
            out += str.substring(pos, ret.index);
            pos = ret.index;
        }

        out += String.fromCharCode(ret[1]);
        pos += ret[0].length;
    }

    if (pos < str.length) {
        out += str.substring(pos, str.length);
    }

    return out;
}

function get_data(url, callback, param, timeout_cb) {
    //console.log('url: ' + url);

    GM_xmlhttpRequest({
        url : url,
        timeout : 5000,
        headers : {
            'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
        },
        onload(xhr) {
            callback(url, xhr, param);
        },
        onerror(xhr) {
            timeout_cb ? timeout_cb(url, xhr, param) : console.log('url: ' + url + ' error:' + xhr.error);
        },
        ontimeout(xhr) {
            timeout_cb ? timeout_cb(url, xhr, param) : console.log('url: ' + url + 'timeout');
        },
    });
}

function domain_timeout(url, xhr, param) {
    let responseText = xhr.responseText;
    let finalUrl = xhr.finalUrl;
    let id = param.id;
    let domain = param.domain;
    let addr = param.addr;
    let date = param.date;
    let callback = param.callback;
    let times = param.times;

    console.log('timeout url:' + url + ' times:' + param.times + ' error:', xhr);

    if (param.times++ > 10) { return; }

    get_data(url, domain_callback, param, domain_timeout);
}

function domain_callback(url, xhr, param) {
    let responseText = xhr.responseText;
    let finalUrl = xhr.finalUrl;
    let id = param.id;
    let domain = param.domain;
    let addr = param.addr;
    let date = param.date;
    let callback = param.callback;
    let times = param.times;

    g_domain[id] = (times == 0) ? domain : callback(responseText);

    let value = { date : date, domain : g_domain[id] };
    GM_setValue(id, value);

    console.log('set domain[' + id + ']: ', value);
}

function get_last_domain(id, addr, callback) {
    let now = new Date().toLocaleDateString();
    let value = GM_getValue(id);

    if (value == undefined) {
        console.log('get new domain[' + id + '], addr:' + addr);
        get_data(addr, domain_callback, { id : id, domain : null, addr : addr, date : now, callback : callback, times : 1 }, domain_timeout);
    } else if (value.date != now) {
        console.log('test old domain[' + id + ']:' + value.domain);
        get_data(value.domain, domain_callback, { id : id, domain : value.domain, addr : addr, date : now, callback : callback, times : 0 }, domain_timeout);
    } else {
        console.log('use old domain[' + id + ']:' + value.domain);
        g_domain[id] = value.domain;
    }
}

function get_addr_pos_num() {
    let ret;

    if ((ret = /\?([^\/]+)\/(.*?)([0-9\-]*)$/.exec(location.href)) !== null) {
        g_addr[0] = ret[1];
        g_addr[1] = ret[2] + ret[3];
        g_pos = ret.index + ret[1].length + ret[2].length + 2;
        g_num = parseInt(ret[3]);
        console.log('addr: ' + g_addr[1]);
        console.log('page: ' + g_addr[0]);
        console.log('pos:  ' + g_pos);
        console.log('num:  ' + g_num);
    }
}

function new_link(name, addr) {
    let a = document.createElement('a');
    a.style='margin-left:10';
    a.href= document.location.origin + document.location.pathname + addr;
    a.innerText = name;
    document.body.appendChild(a);
}

function add_link() {
    document.body = document.createElement('body');

    new_link('m', '?m3/');
    document.body.appendChild(document.createTextNode(' '));

    new_link('7', '?17/');
    new_link('S', '?17/search/4.html?keyword=ca&page=1');
    new_link(get_unicode('&#22269;&#20135;'), '?17/category/4.html?category_id=1&page=1');
    new_link(get_unicode('&#26085;&#38889;'), '?17/category/4.html?category_id=3&page=1');
    document.body.appendChild(document.createTextNode(' '));

    new_link('8', '?88/');
    new_link('S', '?88/search/ca/1');
    new_link('9', '?88/categories/91/1');
    new_link('L', '?88/video/latest/1');
    new_link('J', '?88/jav/1');
    new_link('E', '?88/oumei/1');
    document.body.appendChild(document.createTextNode(' '));

    new_link('M', '?mm/');
    let title = get_unicode('&#22269;&#20135;')
    new_link(title, '?mm/tags/' + title + '/1');

    title = get_unicode('&#20013;&#25991;&#23383;&#24149;');
    new_link(title, '?mm/tags/' + title + '/1');

    title = get_unicode('&#39640;&#28165;&#26080;&#30721;');
    new_link(title, '?mm/tags/' + title + '/1');

    document.body.appendChild(document.createTextNode(' '));
}

function add_video(txt, img, url, xor) {
    let div;
    let video;

    for (let i = 0; i < txt.length; i++) {
        div = document.createElement("div");
        div.innerText = txt[i];
        document.body.appendChild(div);

        video = document.createElement('video');
        video.id = url[i];
        video.onclick = play_m3u8;
        video.style = 'cursor:pointer;max-width:100%;max-height:100%';
        video.setAttribute('class', 'lozad');
        video.setAttribute('data-poster' + xor, img[i]);
        document.body.appendChild(video);
    }

    run_lozad_observer();
}

function add_pre_next_button(responseText, reg) {
    let ret = reg.exec(responseText);

    if (ret !== null) {
        let a = document.createElement("a");
        a.innerText = '<';
        a.href = location.href.substring(0, g_pos) + (g_num - 1);
        document.body.appendChild(a);

        a = document.createElement("a");
        a.innerText = ret[1];
        document.body.appendChild(a);

        a = document.createElement("a");
        a.innerText = '>';
        a.href = location.href.substring(0, g_pos) + (g_num + 1);
        document.body.appendChild(a);
    }
}

function callback_17_page(url, xhr, param) {
    let responseText = xhr.responseText;
    let reg;
    let ret;
    let txt = [];
    let img = [];
    let m3u = [];

    add_pre_next_button(responseText, /"last_page_p">([0-9/]+)/);

    for (let i = 0, reg = /[0-9]+"\s+data-sl="([^"]+)"[\s\S]+?"rank-title">([^<]+)/g; (ret = reg.exec(responseText)) !== null; i++) {
        m3u[i] = get_unicode(ret[1]);
        txt[i] = get_unicode(ret[2]);
        img[i] = m3u[i].replace('index.m3u8', 'vod_en.jpg');
    }

    console.log('txt count:' + txt.length);
    console.log('img count:' + img.length);
    console.log('m3u count:' + m3u.length);

    add_video(txt, img, m3u, '-xor');

    add_pre_next_button(responseText, /"last_page_p">([0-9/]+)/);
}

function callback_88_page(url, xhr, param) {
    let responseText = xhr.responseText;
    let reg;
    let ret;
    let txt = [];
    let img = [];
    let m3u = [];

    add_pre_next_button(responseText, /data-total-page="([0-9]+)"/);

    for (let i = 0, reg = /<img alt="([^"]+)"[\s\S]+?(https:\/\/[^\/]+\/videos\/([^\/]+)\/cover\/5_505_259)/g; (ret = reg.exec(responseText)) !== null; i++) {
        txt[i] = ret[1];
        img[i] = ret[2];
        m3u[i] = 'https://dgtnsy.com/videos/' + ret[3] + '/g.m3u8?h=d11925605f2a1ef';
    }

    console.log('txt: ' + txt.length);
    console.log('img: ' + img.length);
    console.log('m3u: ' + m3u.length);

    add_video(txt, img, m3u, '');

    add_pre_next_button(responseText, /data-total-page="([0-9]+)"/);
}

function callback_mm_page(url, xhr, param) {
    let responseText = xhr.responseText;
    let reg;
    let ret;
    let txt = [];
    let img = [];
    let m3u = [];

    if (ret = /"refresh"[\s\S]+(https:\/\/mm[0-9]+.vip)/.exec(responseText)) {
        console.log(ret);
        let value = GM_getValue('mm');
        value.domain = ret[1];
        GM_setValue('mm', value);
        return;
    }

    add_pre_next_button(responseText, />(\d+)<\/a>\s+<[^>]+>&#19979;&#19968;&#39029;/);

    for (let i = 0, reg = /data-original="(https:\/\/[^\/]+\/+(\w+\/\w+\/\w+\/[0-9a-z]+)\/cover\/cover_encry\.pip)[\s\S]*?<h3>([^<]+)/g; (ret = reg.exec(responseText)) !== null; i++) {
        img[i] = ret[1];
        txt[i] = get_unicode(ret[3]);
        m3u[i] = 'https://zl-365play.as8k.live:8090//' + ret[2] + '/m3u8/maomi365.m3u8';
    }

    console.log('txt count:' + txt.length);
    console.log('img count:' + img.length);
    console.log('m3u count:' + m3u.length);

    add_video(txt, img, m3u, '-sub');

    add_pre_next_button(responseText, />(\d+)<\/a>\s+<[^>]+>&#19979;&#19968;&#39029;/);
}

function get_page() {
    switch (g_addr[0])
    {
        case 'm3':
        {
            add_video([''], [''], [g_addr[1]], ['']);
            break;
        }
        case '17':
        {
            get_data(g_domain['17'] + '/' + g_addr[1], callback_17_page);
            break;
        }
        case '88':
        {
            get_data(g_domain['88'] + '/' + g_addr[1], callback_88_page);
            break;
        }
        case 'mm':
        {
            get_data(g_domain['mm'] + '/' + g_addr[1] + '.html', callback_mm_page);
            break;
        }
        default:
        {
            console.log(g_addr);
            break;
        }
    }
}

function main() {
    //GM_deleteValue('mm');
    //GM_setValue('mm', { date : '2024/3/21', domain : 'https://mm307.vip/' });
    //console.log(GM_listValues());

    add_link();
    get_addr_pos_num();

    get_last_domain('17', 'https://fabu1.obs-helf.cucloud.cn/index.html', function(html){ let ret = /color="red">([^<]+)</.exec(html); return ret[1];});
    get_last_domain('88', 'https://v88avnetwork.github.io/88av.html', function(html){ let ret = /target="_blank">([^<]+)<\/a>/.exec(html); return ret[1];});
    get_last_domain('mm', 'https://github.com/maomimaomiav/maomi/blob/main/README.md', function(html){ console.log(html);let ret = /最新地址[\s：]+(mm\d+\.vip)"/.exec(html); return 'https://' + ret[1];});

    get_page();
}

main();

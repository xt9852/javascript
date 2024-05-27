// ==UserScript==
// @name         demo
// @description  demo
// @version      0.1
// @match        https://hm.baidu.com/hm.js?*
// @require      https://cdn.jsdelivr.net/npm/hls.js
// @require      https://cdn.jsdelivr.net/npm/lozad/dist/lozad.min.js
// @connect      obs-helf.cucloud.cn
// @connect      github.com
// @connect      github.io
// @connect      17caai.com
// @connect      88a6.cc
// @connect      mm261.vip
// @connect      mm144.cc
// @connect      kkht10.vip
// @connect      cucloud.cn
// @connect      ht96az.vip
// @connect      ht7ac.vip
// @connect      htn6c.vip
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

var g_hls = null;
var g_video = null;
var g_id = 'm3';
var g_uri = '';
var g_page_id = 0;
var g_page_cnt = 0;
var g_param = {
    '17' : {
        addr : { url : 'https://fabu1.obs-helf.cucloud.cn/index.html',
                 reg : [ /color="red">([^<]+)<\/font>/ ],
                 res : '' },
        menu : { url : '',
                 reg :  /<a href="([^"]+)">\s+<div class="v-s-li-nav-link-vs_[^"]+">\s*([^<\s]+)\s*<\/div>/g,
                 add : '',
                 fnd : '/search/0.html?keyword={INPUT}' },
        page : { url : '{ADDR}{URI}&page={PAGE}',
                 img : '-xor',
                 cnt : /"last_page_p">[0-9]+\/([0-9]+)/,
                 reg : /[0-9]+"\s+data-sl="([^"]+)"[\s\S]+?"rank-title">([^<]+)/g,
                 fnt : (ret, txt, img, m3u, i)=>{ m3u[i] = get_string(ret[1]); txt[i] = get_string(ret[2]); img[i] = m3u[i].replace('index.m3u8', 'vod_en.jpg'); }
               }
    },
    '88' : {
        addr : { url : 'https://v88avnetwork.github.io/88av.html',
                 reg : [ /target="_blank">([^<]+)/ ],
                 res : '' },
        menu : { url : '',
                 reg :  /class="?nav-item"?><a\s+href="?([^">]+)"?>([^<\s]+)/g,
                 add : '',
                 fnd : '/search/{INPUT}' },
        page : { url : '{ADDR}{URI}/{PAGE}',
                 img : '-webp',
                 cnt : /data-total-page="([0-9]+)"/,
                 reg : /<img alt="([^"]+)"[\s\S]+?(https:\/\/[^\/]+\/videos\/([^\/]+)\/cover\/5_505_259[^"]+)/g,
                 fnt : (ret, txt, img, m3u, i)=>{ txt[i] = ret[1]; img[i] = ret[2]; m3u[i] = 'https://dgtnsy.com/videos/' + ret[3] + '/g.m3u8?h=d11925605f2a1ef'; }
               }
    },
    'mm' : {
        addr : { url : 'https://github.com/maomimaomiav/maomi/blob/main/README.md',
                 reg : [ /最新地址[\s：]+(mm\d+\.vip)"/, /<meta http-equiv="refresh"[\s\S]+(https:\/\/[^\/]+)/ ],
                 res : '' },
        menu : { url : '/home.html',
                 reg :  /data-href="(\/tags\/[^/]+)\/index.html" data-id="\d+"  data-onsite-or-offsite=""\s+>([^<]+)/g,
                 add : '',
                 fnd : '/search/{INPUT}' },
        page : { url : '{ADDR}{URI}/{PAGE}.html',
                 img : '-sub',
                 cnt : />(\d+)<\/a>\s+<[^>]+>(&#19979;&#19968;&#39029;|下一页)/,
                 reg : /data-original="(https:\/\/[^\/]+\/+(\w+\/\w+\/\w+\/[0-9a-z]+)\/cover\/cover_encry\.pip)[\s\S]*?<h3>([^<]+)/g,
                 fnt : (ret, txt, img, m3u, i)=>{ img[i] = ret[1]; txt[i] = get_string(ret[3]); m3u[i] = 'https://zl-365play.as8k.live:8090//' + ret[2] + '/m3u8/maomi365.m3u8'; }
               }
    },
    'mt' : {
        addr : { url : 'https://github.com/htapp/htapp',
                 reg : [ /https:\/\/<\/p>\s+<p dir="auto">([^<]+)/,
                         /targetSites = \[\s+'([^']+)/,
                         (html)=>{return /<a href="([^"]+)/.exec(html)[1] + '/ht/index.html'},
                         /targetUrls = \[\s+"[^"]+",\s+"([^"]+)"/ ],
                 res : '' },
        menu : { url : '',
                 reg :  /<a href="(\/type\/[^"]+)" class="menu-link">([^<]+)/g,
                 add : '---',
                 fnd : '/search/{INPUT}/' },
        page : { url : '{ADDR}{URI}{PAGE}',
                 img : '-xor',
                 cnt : /\[page\]', (\d+), event/,
                 reg : /<img data-original="([^"]+)[\s\S]*?<div data-original="\/\/[^/]+(\/video\/m3u8\/\d+\/\d+\/[\da-z]+)[\s\S]*?"vod-title">([^<]+)/g,
                 fnt : (ret, txt, img, m3u, i)=>{ img[i] = ret[1]; txt[i] = ret[3]; m3u[i] = 'https://111.zhounengkun1.cn' + ret[2] + '/CDN/index.m3u8'; }
               }
    }
};

function play_m3u8() {
    if (g_video == this) {
        return;
    } else if (g_video != null) {
        g_hls.destroy();
        delete g_hls;
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

function run_lozad() {
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

    function get_img(addr, element, fnt) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', addr, true);
        xhr.responseType = 'arraybuffer';
        xhr.setRequestHeader('Accept', 'no-cache');
        xhr.send();
        xhr.onload = function () {
            element.setAttribute('poster', fnt(xhr.response));
        }
    }

    const observer = lozad('.lozad',{ load: (element)=>{
        let url = element.getAttribute("img-xor");

        if (url) {
            get_img(url, element, decode_xor);
            element.removeAttribute("img-xor");
        }

        url = element.getAttribute("img-sub");

        if (url) {
            get_img(url, element, decode_sub);
            element.removeAttribute("img-sub");
        }

        url = element.getAttribute("img-webp");

        if (url) {
            element.poster = url.replace('?', '.webp?');
            element.removeAttribute("img-webp");
        }
    }});

    observer.observe();
}

function get_string(str) {
    let pos = 0;
    let out = '';

    for (let reg = /&#(x)?([\da-fA-F]+);/g, ret; ret = reg.exec(str); ) {
        if (ret.index > pos) {
            out += str.substring(pos, ret.index);
            pos = ret.index;
        }

        out += String.fromCharCode((ret[1] == 'x') ? parseInt(ret[2], 16) : ret[2]);
        pos += ret[0].length;
    }

    if (pos < str.length) {
        out += str.substring(pos, str.length);
    }

    return out;
}

function req_data(url, cb_load, arg, cb_timeout) {
    //console.log('req', url);

    GM_xmlhttpRequest({
        url : url,
        timeout : 5000,
        headers : {
            'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
        },
        onload(xhr) {
            cb_load(url, xhr, arg);
        },
        onerror(xhr) {
            cb_timeout ? cb_timeout(url, xhr, arg) : console.log('error:' + url, xhr);
        },
        ontimeout(xhr) {
            cb_timeout ? cb_timeout(url, xhr, arg) : console.log('timeout:' + url, xhr);
        },
    });
}

function add_menu(id, data) {
    let select = document.getElementById('menu');

    let optgroup = document.createElement('optgroup');
    optgroup.id = id;
    optgroup.label = id;
    select.appendChild(optgroup);

    for (let i = 0, option; i < data.length; i++) {
        option = document.createElement('option');
        option.value = data[i].uri;
        option.innerText = data[i].title;
        optgroup.appendChild(option);
    }
}

function add_video(txt, img, url, flag) {
    let content = document.getElementById('content');

    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    let div;
    let video;

    for (let i in txt) {
        div = document.createElement("div");
        div.innerText = txt[i];
        content.appendChild(div);

        video = document.createElement('video');
        video.id = url[i];
        video.onclick = play_m3u8;
        video.style = 'cursor:pointer;background:black;';
        video.setAttribute('class', 'lozad');
        video.setAttribute('img' + flag, img[i]);
        content.appendChild(video);
    }

    run_lozad();

    window.scrollTo(0, 0);
}

function cb_addr_timeout(url, xhr, arg) {
    let id = arg.id;
    let timeout = ++arg.times[1];
    let param = g_param[id];
    let addr = param.addr;
    let old = addr.res != '';

    console.log('timeout', id, timeout, 'old', old, url, xhr);

    if (timeout < 3) {
        req_data(url, cb_addr_new, arg, cb_addr_timeout);
        return;
    }

    if (old) {
        arg.times = [ 0, 0 ];
        req_data(addr.url, cb_addr_new, arg, cb_addr_timeout);
        console.log('get', id, addr.url);
    }
}

function cb_addr_new(url, xhr, arg) {
    let id = arg.id;
    let date = arg.date;
    let times = arg.times[0]++;
    let param = g_param[id];
    let addr = param.addr;
    let reg = addr.reg[times++];
    let html = xhr.responseText;
    let data;

    console.log('new', id, times, url);

    data = (typeof(reg) == 'function') ? reg(html) : reg.exec(html);

    if (data == null) {
        console.log('error', reg, html);
        return;
    }

    if (typeof(reg) != 'function') {
        data = (data[1].substring(0, 8) != 'https://') ? ('https://' + data[1]) : data[1];
    }

    if (times < addr.reg.length) {
        req_data(data, cb_addr_new, arg);
    } else {
        g_param[id].addr.res = data;
        GM_setValue(id, { date : date, addr : data });
        console.log('new', GM_getValue(id));
    }
}

function cb_addr_old(url, xhr, arg) {
    let id = arg.id;
    let date = arg.date;
    let param = g_param[id];
    let addr = param.addr;
    let menu = param.menu;
    let reg = menu.reg;
    let add = menu.add;
    let fnd = menu.fnd;
    let html = xhr.responseText;
    let ret;

    if ((ret = /"refresh"[\s\S]+(https:\/\/[^\/]+)/.exec(html)) || (ret = /targetSites = \[\s+'([^']+)/.exec(html))) {
        GM_setValue(id, { date : date, addr : ret[1] });
        console.log('ref', id, GM_getValue(id));
        return;
    }


    let data = [ { uri : fnd, title : '查找' } ];

    for (let i = 1; (ret = reg.exec(html)) !== null; i++) {
        data[i] = { uri : get_string(ret[1]) + add, title : get_string(ret[2]) };
    }

    if (data.length == 1) {
        console.log(id, html);
        return;
    }

    add_menu(id, data);

    GM_setValue(id, { date : date, addr : addr.res, menu : data });

    console.log('set', id, GM_getValue(id));
}

function get_addr(id) {
    let param = g_param[id];
    let addr = param.addr;
    let menu = param.menu;
    let old = GM_getValue(id);
    let now = new Date().toLocaleDateString();
    let arg = { id : id, date : now, times : [0, 0] };

    if (old == undefined) {
        req_data(addr.url, cb_addr_new, arg, cb_addr_timeout);
        console.log('get', id, addr.url);
    } else if (old.date != now || null == old.menu) {
        addr.res = old.addr;
        req_data(old.addr + menu.url, cb_addr_old, arg, cb_addr_timeout);
        console.log('try', id, old.addr);
    } else {
        addr.res = old.addr;
        add_menu(id, old.menu);
        console.log('use', id, old.addr);
    }
}

function cb_page(url, xhr, arg) {
    let id = arg.id;
    let is_cnt = arg.is_cnt;
    let param = g_param[id];
    let page = param.page;
    let reg = page.reg;
    let cnt = page.cnt;
    let opt = page.opt;
    let html = xhr.responseText;
    let txt = [];
    let img = [];
    let m3u = [];
    let ret;

    if (is_cnt) {
        ret = cnt.exec(html);
        g_page_cnt = (ret == null) ? 0 : ret[1];
    }

    document.getElementById('page_num').innerText = g_page_id + '/' + g_page_cnt;

    for (let i = 0; ret = reg.exec(html); i++) {
        page.fnt(ret, txt, img, m3u, i);
    }

    add_video(txt, img, m3u, page.img);
}

function get_page(is_cnt) {
    let param = g_param[g_id];
    let addr = param.addr;
    let page = param.page;
    let res = addr.res;
    let url = page.url;
    url = url.replace('{URI}', g_uri);
    url = url.replace('{ADDR}', res);
    url = url.replace('{PAGE}', g_page_id + 1);
    req_data(url, cb_page, { id: g_id, is_cnt :is_cnt });
}

function on_change(keydown) {
    let menu = document.getElementById('menu');
    let input = document.getElementById('input');
    let option = menu.options[menu.selectedIndex];
    let title = option.innerText;
    let is_cnt = true;
    let is_num = (keydown == true && /^\d+$/.exec(input.value));

    g_id = option.parentNode.id;

    if (title == '播放') {
        add_video([input.value], [''], [input.value], ['']);
        input.value = '';
        return;
    }

    if (is_num) {
        g_page_id = Number(input.value);
        is_cnt = false;
    } else {
        g_uri = menu.value.replace('{INPUT}', input.value);
        g_page_id = 0;
    }

    input.value = '';

    get_page(is_cnt);

    console.log(g_id, g_uri, g_page_id);
}

function on_button_page_pre() {
    g_page_id = ((g_page_id == 0) ? g_page_cnt : g_page_id) - 1;

    document.getElementById('page_num').innerText = g_page_id + '/' + g_page_cnt;

    get_page(false);
}

function on_button_page_next() {
    g_page_id = (g_page_id == g_page_cnt - 1) ? 0 : (g_page_id + 1);

    document.getElementById('page_num').innerText = g_page_id + '/' + g_page_cnt;

    get_page(false);
}

function main() {
    //GM_deleteValue('17');
    //GM_deleteValue('88');
    //GM_deleteValue('mm');
    //GM_deleteValue('mt');

    let value = GM_listValues();

    if (value) {
        value.sort((a, b)=>a.localeCompare(b, 'zh'));
    }

    for (let i in value) {
        console.log(value[i], GM_getValue(value[i]));
    }

    let body = document.createElement('body');
    body.style = 'margin:0;';
    document.body = body;

    let select = document.createElement('select');
    select.id = 'menu';
    select.style = 'position:fixed; right:0px; margin:3px;';
    select.onchange = on_change;
    document.body.appendChild(select);

    let input = document.createElement('input');
    input.id = 'input';
    input.style = 'position:fixed; right:100px; margin-top:2px;';
    input.onkeydown = () => { if (event.keyCode == 13) on_change(true); };
    document.body.appendChild(input);

    let div = document.createElement('div');
    div.style = 'position:fixed; right:285px;';
    document.body.appendChild(div);

    let a = document.createElement('a');
    a.innerText = '<';
    a.href = 'javascript:void(0);';
    a.onclick = on_button_page_pre;
    div.appendChild(a);

    a = document.createElement('a');
    a.id = 'page_num';
    a.innerText = '0/0';
    div.appendChild(a);

    a = document.createElement('a');
    a.innerText = '>';
    a.href = 'javascript:void(0);';
    a.onclick = on_button_page_next;
    div.appendChild(a);

    div = document.createElement('div');
    div.id = 'content';
    document.body.appendChild(div);

    add_menu('m3', [{ title : '播放', uri : '{INPUT}' }]);

    for (let id in g_param) {
        get_addr(id);
    }
}

main();

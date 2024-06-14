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
// @connect      17caao.com
// @connect      88a6.cc
// @connect      mm179.cc
// @connect      mm205.cc
// @connect      kkht25.vip
// @connect      ht9fi.vip
// @connect      htz4x.vip
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

var g_hls = null;
var g_video = null;
var g_id = '';
var g_uri = '';
var g_page_id = 0;
var g_page_cnt = 0;
var g_param = {
    '17' : {
        addr : { beg : 'https://fabu1.obs-helf.cucloud.cn/index.html',
                 reg : [ /color="red">([^<]+)\/<\/font><\/p>/ ] },
        menu : { uri : '',
                 reg :  /<a href="(\/category[^"]+)">\s+<div class="v-s-li-nav-link-vs_[^"]+">\s*([^<\s]+)\s*<\/div>/g,
                 fnd : '/search/0.html?keyword={INPUT}',
                 add : '' },
        page : { url : '{URI}&page={PAGE}',
                 img : '-xor',
                 cnt : /"last_page_p">[0-9]+\/([0-9]+)/,
                 reg : /[0-9]+"\s+data-sl="([^"]+)"[\s\S]+?"rank-title">([^<]+)/g,
                 fnt : (ret, txt, img, m3u, i)=>{ m3u[i] = get_string(ret[1]); txt[i] = get_string(ret[2]); img[i] = m3u[i].replace('index.m3u8', 'vod_en.jpg'); }
               }
    },
    '88' : {
        addr : { beg : 'https://v88avnetwork.github.io/88av.html',
                 reg : [ /target="_blank">([^<]+)/ ] },
        menu : { uri : '',
                 reg :  /class="?nav-item"?><a\s+href="?([^">]+)"?>([^<\s]+)/g,
                 fnd : '/search/{INPUT}',
                 add : '' },
        page : { url : '{URI}/{PAGE}',
                 img : '-webp',
                 cnt : /data-total-page="([0-9]+)"/,
                 reg : /<img alt="([^"]+)"[\s\S]+?(https:\/\/[^\/]+\/videos\/([^\/]+)\/cover\/5_505_259[^"]+)/g,
                 fnt : (ret, txt, img, m3u, i)=>{ txt[i] = ret[1]; img[i] = ret[2]; m3u[i] = 'https://dgtnsy.com/videos/' + ret[3] + '/g.m3u8?h=d11925605f2a1ef'; }
               }
    },
    'mm' : {
        addr : { beg : 'https://github.com/maomimaomiav/maomi/blob/main/README.md',
                 reg : [ /\[(mm.*?)\]/, /<meta http-equiv="refresh"[\s\S]+(https:\/\/[^\/]+)/ ] },
        menu : { uri : '/home.html',
                 reg :  /data-href="(\/tags\/[^/]+)\/index.html" data-id="\d+"  data-onsite-or-offsite=""\s+>([^<]+)/g,
                 fnd : '/search/{INPUT}',
                 add : '' },
        page : { url : '{URI}/{PAGE}.html',
                 img : '-sub',
                 cnt : />(\d+)<\/a>\s+<[^>]+>&#19979;&#19968;&#39029;/,
                 reg : /data-original="(https:\/\/[^\/]+\/+(\w+\/\w+\/\w+\/[0-9a-z]+)\/cover\/cover_encry\.pip)[\s\S]*?<h3>([^<]+)/g,
                 fnt : (ret, txt, img, m3u, i)=>{ img[i] = ret[1]; txt[i] = get_string(ret[3]); m3u[i] = 'https://365play.dd99rr.live/' + ret[2] + '/m3u8/maomi365.m3u8'; }
               }
    },
    'mt' : {
        addr : { beg : 'https://github.com/htapp/htapp',
                 reg : [ /https:\/\/<\/p>\s+<p dir="auto">([^<]+)/,
                         (html)=>{ let url = '', uu = /uu = '(\d+)/.exec(html)[1];
                                   for (let j = 0; j < uu.length; j += 4) { url += (String.fromCharCode(parseInt(uu.substr(j, 4)) - 1000)); }
                                   return url + '/ht/index.html'; },
                         /targetUrls = \[\s+"([^"]+)/ ] },
        menu : { uri : '',
                 reg :  /<a href="(\/type\/[^"]+)" class="menu-link">([^<]+)/g,
                 fnd : '/search/{INPUT}/',
                 add : '---' },
        page : { url : '{URI}{PAGE}',
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
    optgroup.id = select.options.length;
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

function cb_addr_get_timeout(url, xhr, arg) {
    let id = arg.id;
    let times = arg.times[0];
    let timeout = ++arg.times[2];

    console.log('get', id, url, times, timeout, xhr.error ? xhr.error : 'timeout');

    if (timeout >= 3) { return; }

    req_data(url, cb_addr_get, arg, cb_addr_get_timeout);
}

function cb_addr_try_timeout(url, xhr, arg) {
    let id = arg.id;
    let times = arg.times[0];
    let timeout = ++arg.times[2];
    let param = g_param[id];
    let addr = param.addr;

    console.log('try', id, url, times, timeout, xhr.error ? xhr.error : 'timeout');

    if (/'Refused to connect to "[^"]+": This domain is not a part of the @connect list'/.exec(xhr.error)) {
        return;
    }

    if (timeout >= 3) {
        if (times < 1) {
            arg.times = [ times + 1, 0, 0 ];
            req_data(addr.beg, cb_addr_get, arg, cb_addr_get_timeout);
            console.log('get', id, addr.beg);
        }
        return;
    }

    req_data(url, cb_addr_try, arg, cb_addr_try_timeout);
}

function cb_addr_get(url, xhr, arg) {
    let id = arg.id;
    let date = arg.date;
    let times = arg.times[0];
    let step = arg.times[1];
    let param = g_param[id];
    let menu = param.menu;
    let addr = param.addr;
    let reg = addr.reg[step++];
    let html = xhr.responseText;
    let data;

    if (typeof(reg) == 'function') {
        data = reg(html);
    } else {
        data = reg.exec(html);

        if (data == null) {
            console.log('error', reg, html);
            return;
        }

        data = (data[1][0] != 'h' || data[1][1] != 't' || data[1][2] != 't' || data[1][3] != 'p' || data[1][4] != 's') ? 'https://' + data[1] : data[1];
    }

    console.log('get', id, url, times, step, data);

    if (step < addr.reg.length) {
        arg.times = [ times, step, 0 ];
        req_data(data, cb_addr_get, arg, cb_addr_get_timeout);
    } else {
        g_param[id].addr.url = data;
        req_data(data + menu.uri, cb_addr_try, arg, cb_addr_try_timeout);
    }
}

function cb_addr_try(url, xhr, arg) {
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
        console.log('ref', id, ret[1] + menu.uri);
        g_param[id].addr.url = ret[1];
        req_data(ret[1] + menu.uri, cb_addr_try, arg, cb_addr_try_timeout);
        return;
    }

    let data = [ { uri : fnd, title : 'find' } ];

    for (let i = 1; (ret = reg.exec(html)) !== null; i++) {
        data[i] = { uri : get_string(ret[1]) + add, title : get_string(ret[2]) };
    }

    if (data.length == 1) {
        console.log('menu', id, html);
        return;
    }

    add_menu(id, data);

    GM_setValue(id, { date : date, addr : addr.url, menu : data });

    console.log('set', id, GM_getValue(id));
}

function get_addr(id) {
    let param = g_param[id];
    let addr = param.addr;
    let menu = param.menu;
    let page = param.page;
    let old = GM_getValue(id);
    let now = new Date().toLocaleDateString();
    let arg = { id : id, date : now, times : [0, 0, 0] };

    if (!old) {
        req_data(addr.beg, cb_addr_get, arg, cb_addr_get_timeout);
        console.log('get', id, addr.beg);
    } else if (old.date != now || null == old.menu) {
        g_param[id].addr.url = old.addr;
        req_data(old.addr + menu.uri, cb_addr_try, arg, cb_addr_try_timeout);
        console.log('try', id, old.addr + menu.uri);
    } else {
        page.url = old.addr + page.url;
        add_menu(id, old.menu);
        console.log('use', id, old.addr);
    }
}

function cb_page(url, xhr, arg) {
    let id = arg.id;
    let page_id = arg.page_id;
    let get_cnt = arg.get_cnt;
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

    if (get_cnt) {
        ret = cnt.exec(html);
        g_page_cnt = (ret == null) ? 0 : ret[1];
    }

    for (let i = 0; ret = reg.exec(html); i++) {
        page.fnt(ret, txt, img, m3u, i);
    }

    add_video(txt, img, m3u, page.img);

    document.getElementById('page_num').innerText = page_id + '/' + g_page_cnt;

    g_page_id = page_id;
}

function get_page(page_id, get_cnt) {
    let param = g_param[g_id];
    let page = param.page;
    let url = page.url;
    url = url.replace('{URI}', g_uri);
    url = url.replace('{PAGE}', page_id + 1);
    req_data(url, cb_page, { id: g_id, page_id : page_id, get_cnt :get_cnt });
}

function on_change(keydown) {
    let menu = document.getElementById('menu');
    let input = document.getElementById('input');
    let option = menu.options[menu.selectedIndex];
    let title = option.innerText;
    let parent = option.parentNode;
    let find_id = parent.id;
    let page_id;
    let get_cnt;

    g_id = parent.label;

    if (title == 'play') {
        add_video([input.value], [''], [input.value], ['']);
        input.value = '';
        return;
    }

    if (keydown) {
        if (/^\d+$/.exec(input.value)) {
            page_id = Number(input.value);
            get_cnt = false;
        } else {
            page_id = 0;
            get_cnt = true;
            g_uri = menu.options[find_id].value.replace('{INPUT}', input.value);
            menu.selectedIndex = find_id;
        }
    } else {
        if (title == 'find') {
            page_id = 0;
            get_cnt = true;
            g_uri = menu.value.replace('{INPUT}', input.value);
        } else {
            page_id = 0;
            get_cnt = true;
            g_uri = menu.value;
        }
    }

    console.log(g_id, g_uri, page_id);

    get_page(page_id, get_cnt);
}

function on_button_page_pre() {
    get_page(((g_page_id == 0) ? g_page_cnt : g_page_id) - 1, false);
}

function on_button_page_next() {
    get_page((g_page_id == g_page_cnt - 1) ? 0 : (g_page_id + 1), false);
}

function main() {
    //GM_deleteValue('17');
    //GM_deleteValue('88');
    //GM_deleteValue('mm');
    //GM_deleteValue('mt');

    document.body = document.createElement('body');

    let div = document.createElement('div');
    div.style = 'position:fixed; right:0px;';
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

    let input = document.createElement('input');
    input.id = 'input';
    input.onkeydown = ()=>{ if (event.keyCode == 13) on_change(true); }
    div.appendChild(input);

    let select = document.createElement('select');
    select.id = 'menu';
    select.onchange = ()=>{ on_change(false); }
    div.appendChild(select);

    div = document.createElement('div');
    div.id = 'content';
    document.body.appendChild(div);

    add_menu('m3', [{ title : 'play', uri : '{INPUT}' }]);

    for (let id in g_param) { get_addr(id); }
}

main();

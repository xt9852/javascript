// ==UserScript==
// @name         a
// @description  a
// @version      0
// @match        https://hm.baidu.com/hm.js?*
// @require      https://cdn.jsdelivr.net/npm/hls.js
// @require      https://cdn.jsdelivr.net/npm/lozad/dist/lozad.min.js
// @connect      obs-helf.cucloud.cn
// @connect      17caaq.com
// @connect      github.io
// @connect      88a6.cc
// @connect      github.com
// @connect      mm179.cc
// @connect      mm253.cc
// @connect      kkht31.vip
// @connect      htivr.vip
// @connect      htoju.vip
// @connect      134.122.173.8
// @connect      dxj5566.com
// @connect      ccdata.7wzx9.com
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
    17 : { addr : { beg : 'https://fabu1.obs-helf.cucloud.cn/index.html',
                    reg : [ /color="red">([^<]+)\/<\/font><\/p>/ ] },
           menu : { uri : '',
                    reg :  /href="(\/category.+?)">\s+<div class="v-s-li-nav-link-vs_.+?">\s*([^<\s]+)\s*<\/div>/g,
                    fnd : '/search/0.html?keyword={INPUT}' },
           page : { url : '{URI}&page={PAGE}',
                    img : '-xor',
                    cnt : /"last_page_p">[0-9]+\/([0-9]+)/,
                    reg : /data-src=".{45}.+?(?=&#47;)(&#47;&#118;.+?)"[\s\S]+?"rank-title">(.+?)</g,
                    fnt : (ret, data)=>{ let img = 'https://mcealpr.xn--viq4cv52gw2nsuk.com' + get_str(ret[1]); data.push(get_str(ret[2]), img, img.replace('vod_en.jpg', 'index.m3u8')); }}},
    88 : { addr : { beg : 'https://v88avnetwork.github.io/88av.html',
                    reg : [ /target="_blank">([^<]+)/ ] },
           menu : { uri : '',
                    reg :  /class="?nav-item"?><a\s+href="?([^">]+)"?>([^<\s]+)/g,
                    fnd : '/search/{INPUT}' },
           page : { url : '{URI}/{PAGE}',
                    img : '-webp',
                    cnt : /data-total-page="([0-9]+)"/,
                    reg : /<img alt="([^"]+)"[\s\S]+?(https:\/\/[^\/]+\/videos\/([^\/]+)\/cover\/5_505_259[^"]+)/g,
                      fnt : (ret, data)=>{ data.push(ret[1], ret[2], 'https://zgtscy.com/videos/' + ret[3] + '/g.m3u8?h=eafeb8148cf1a15'); }}},
    mm : { addr : { beg : 'https://github.com/maomimaomiav/maomi/blob/main/README.md',
                    reg : [ (html)=>{ return 'https://' + /\[(mm.+?)\]/.exec(html)[1]; }, /http-equiv="refresh"[\s\S]+(https:\/\/.+?)"/ ] },
           menu : { uri : '/home.html',
                    reg :  /data-href="(\/tags\/.+?)\/index.html".+?data-onsite-or-offsite=""\s+>(.+?)</g,
                    fnd : '/search/{INPUT}' },
           page : { url : '{URI}/{PAGE}.html',
                    img : '-sub',
                    cnt : />(\d+)<\/a>\s+<[^>]+>&#19979;&#19968;&#39029;/,
                    reg : /data-original="(https:\/\/[^\/]+\/+(\w+\/\w+\/\w+\/[0-9a-z]+)\/cover\/cover_encry\.pip)[\s\S]*?<h3>([^<]+)/g,
                    fnt : (ret, data)=>{ data.push(get_str(ret[3]), ret[1], 'https://365play.dd99rr.live/' + ret[2] + '/m3u8/maomi365.m3u8'); }}},
    mt : { addr : { beg : 'https://github.com/htapp/htapp',
                    reg : [ (html)=>{ return 'https://' + /https:\/\/<\/p>\s+<p dir="auto">([^<]+)/.exec(html)[1]; },
                            (html)=>{ let url = '', uu = /uu = '(\d+)/.exec(html)[1]; for (let j = 0; j < uu.length; j += 4) { url += (String.fromCharCode(parseInt(uu.substr(j, 4)) - 1000)); } return url + '/ht/index.html'; },
                            /targetUrls = \[\s+"([^"]+)/ ] },
           menu : { uri : '',
                    reg : (html)=>{ let menu = [], ret; while(ret = /href="(\/type\/[^"]+)" class="menu-link">([^<]+)/g.exec(html)) { menu.push({ uri : get_str(ret[1]) + '---', title : get_str(ret[2]) }); } return menu; },
                    fnd : '/search/{INPUT}/' },
           page : { url : '{URI}{PAGE}',
                    img : '-xor',
                    cnt : /\[page\]', (\d+), event/,
                    reg : /<img data-original="([^"]+)[\s\S]*?<div data-original="\/\/[^/]+(\/video\/m3u8\/\d+\/\d+\/[\da-z]+)[\s\S]*?"vod-title">([^<]+)/g,
                    fnt : (ret, data)=>{ data.push(ret[3], ret[1], 'https://ww.huangke10.cn' + ret[2] + '/CDN/index.m3u8'); }}},
    xj : { addr : { beg : 'https://134.122.173.8:8083/dxjgg/abs.js',
                    reg : [ (html)=>{ return 'https://www.' + /domainNames = \[".+?","(.+?)"/.exec(html)[1] + '/js/base41.js'; }, /"(https:\/\/.+?)\/forward"/ ] },
           menu : { uri : '/getDataInit',
                    pst : JSON.stringify({name: "John", age: 31, city: "New York"}),
                    reg : (html)=>{ let ret = [], res = JSON.parse(html); g_param.xj.vod = res.data.macVodLinkMap; for (let i = 0; i < 3; i++) { for (let j in res.data.menu0ListMap[i].menu2List) { let menu = res.data.menu0ListMap[i].menu2List[j]; ret.push({uri : '{"typeId":'+menu.typeId2+',"content":""}', title : menu.typeName2 }); }} return ret; },
                    fnd : '{"typeId":0,"content":"{INPUT}"}' },
           page : { url : '/forward',
                    img : '',
                    cnt : /"pageAllNumber":(\d+)/,
                    reg : /vod_pic":"https:\/\/.+?(\/video\/m3u8\/\d+\/\d+\/[0-9a-f]+\/).*?vod_name":"(.+?)".*?"vod_server_id":(\d+)/g,
                    fnt : (ret, data)=>{ let vod = g_param.xj.vod[ret[3]]; data.push(ret[2], vod.PIC_LINK_1 + ret[1] + '1.jpg', vod.LINK_1 + ret[1] + 'playlist.m3u8'); }}},
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
    function decode(data, beg, xor) {
        let binary = '';
        let bytes = new Uint8Array(data);
        for (let i = beg; i < bytes.byteLength; i++) { binary += String.fromCharCode(xor ? bytes[i] ^ xor : bytes[i]); }
        return 'data:image/jpeg;base64,' + window.btoa(binary);
    }

    function get_img(addr, element, fnt, beg, xor) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', addr, true);
        xhr.responseType = 'arraybuffer';
        xhr.send();
        xhr.onload = ()=>{ element.setAttribute('poster', fnt(xhr.response, beg, xor)); }
    }

    const observer = lozad('.lozad',{ load: (element)=>{
        let url = element.getAttribute("img");

        if (url) get_img(url, element, decode, 0, null);

        url = element.getAttribute("img-sub");

        if (url) get_img(url, element, decode, 17, null);

        url = element.getAttribute("img-xor");

        if (url) get_img(url, element, decode, 0, 0x88);

        url = element.getAttribute("img-webp");

        if (url) element.poster = url.replace('?', '.webp?');
     }});

    observer.observe();
}

function get_str(str) {
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

function get_data(url, cb_load, arg, cb_timeout) {
    //console.log('req', url);

    GM_xmlhttpRequest({
        url : url,
        timeout : 5000,
        headers : {
            'User-Agent' : 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
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

function pst_data(url, data, cb_load, arg, cb_timeout) {
    //console.log('pst', url, data);

    GM_xmlhttpRequest({
        url : url,
        method : 'POST',
        timeout : 5000,
        headers : {
            'User-Agent' : 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
            'Content-type' : 'application/json'
        },
        data : data,
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

function add_video(data, flag) {
    let div;
    let video;
    let content = document.getElementById('content');

    while (content.firstChild) { content.removeChild(content.firstChild); }

    for (let i = 0; i < data.length; i += 3) {
        div = document.createElement("div");
        div.innerText = data[i];
        content.appendChild(div);

        video = document.createElement('video');
        video.id = data[i + 2];
        video.onclick = play_m3u8;
        video.style = 'cursor:pointer;background:black;max-width:100%;max-height:500px';
        video.setAttribute('class', 'lozad');
        video.setAttribute('img' + flag, data[i + 1]);
        content.appendChild(video);
    }

    run_lozad();

    window.scrollTo(0, 0);
}

function set_page_id() {
    document.getElementById('page_num').innerText = g_page_id + '/' + g_page_cnt;
}

function cb_addr_get_timeout(url, xhr, arg) {
    let id = arg.id;
    let times = arg.times[0];
    let timeout = ++arg.times[2];

    console.log('get', id, url, times, timeout, xhr.error ? xhr.error : 'timeout');

    if (timeout >= 3) { return; }

    get_data(url, cb_addr_get, arg, cb_addr_get_timeout);
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
            get_data(addr.beg, cb_addr_get, arg, cb_addr_get_timeout);
            console.log('get', id, addr.beg);
        }
        return;
    }

    get_data(url, cb_addr_try, arg, cb_addr_try_timeout);
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

    let data = (typeof(reg) == 'function') ? reg(html) : reg.exec(html)[1];

    console.log('get', id, url, times, step, data);

    if (step < addr.reg.length) {
        arg.times = [ times, step, 0 ];
        get_data(data, cb_addr_get, arg, cb_addr_get_timeout);
    } else if (menu.pst != null) {
        g_param[id].addr.url = data;
        pst_data(data + menu.uri, menu.pst, cb_addr_try, arg, cb_addr_try_timeout);
    } else {
        g_param[id].addr.url = data;
        get_data(data + menu.uri, cb_addr_try, arg, cb_addr_try_timeout);
    }
}

function cb_addr_try(url, xhr, arg) {
    let id = arg.id;
    let date = arg.date;
    let param = g_param[id];
    let addr = param.addr;
    let page = param.page;
    let menu = param.menu;
    let reg = menu.reg;
    let fnd = menu.fnd;
    let html = xhr.responseText;
    let ret;

    if ((ret = /"refresh"[\s\S]+(https:\/\/[^"\/]+)/.exec(html)) || (ret = /targetSites = \[\s+'([^']+)/.exec(html))) {
        console.log('ref', id, ret[1] + menu.uri, html);
        g_param[id].addr.url = ret[1];
        get_data(ret[1] + menu.uri, cb_addr_try, arg, cb_addr_try_timeout);
        return;
    }

    let data = [ { uri : fnd, title : 'find' } ];

    if (typeof(reg) == 'function') {
        data = data.concat(reg(html));
    } else {
        for (let i = 1; (ret = reg.exec(html)) !== null; i++) {
            data[i] = { uri : get_str(ret[1]), title : get_str(ret[2]) };
        }
    }

    if (data.length == 1) {
        console.log('menu', id, url, html);
        return;
    }

    page.url = addr.url + page.url;

    add_menu(id, data);

    GM_setValue(id, { date : date, addr : addr.url, menu : data, vod : param.vod });

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
        get_data(addr.beg, cb_addr_get, arg, cb_addr_get_timeout);
        console.log('get', id, addr.beg);
    } else if (old.date == now) {
        page.url = old.addr + page.url;
        param.vod = old.vod;
        add_menu(id, old.menu);
        console.log('use', id, old.addr);
    } else if (menu.pst != null) {
        addr.url = old.addr;
        pst_data(old.addr + menu.uri, menu.pst, cb_addr_try, arg, cb_addr_try_timeout);
        console.log('try', id, old.addr + menu.uri);
    } else {
        addr.url = old.addr;
        get_data(old.addr + menu.uri, cb_addr_try, arg, cb_addr_try_timeout);
        console.log('try', id, old.addr + menu.uri);
    }
}

function cb_page(url, xhr, arg) {
    let id = arg.id;
    let param = g_param[id];
    let page = param.page;
    let reg = page.reg;
    let cnt = page.cnt;
    let fnt = page.fnt;
    let html = xhr.responseText;
    let data = [];
    let ret;

    g_page_id = arg.page_id;

    if (g_page_id == 0) {
        g_page_cnt = (typeof(cnt) == 'function') ? cnt(html) : cnt.exec(html)[1];
    }

    for (let i = 0; ret = reg.exec(html); i++) {
        fnt(ret, data);
    }

    if (data.length == 0) {
        console.log('page fnt error', html);
    }

    add_video(data, page.img);

    set_page_id();
}

function get_page(id, uri, page_id) {
    let param = g_param[id];
    let page = param.page;
    let menu = param.menu;
    let url = page.url;

    if (menu.pst != null) {
        let res = JSON.parse(uri);
        let data = {command:"WEB_GET_INFO", pageNumber:page_id + 1, RecordsPage:20, typeId:res.typeId, typeMid:1, type:1, languageType:"CN", content:res.content};
        pst_data(url, JSON.stringify(data), cb_page, { id: id, page_id : page_id });
    } else {
        url = url.replace('{URI}', uri).replace('{PAGE}', page_id + 1);
        get_data(url, cb_page, { id: id, page_id : page_id });
    }
}

function on_change(keydown) {
    let menu = document.getElementById('menu');
    let input = document.getElementById('input');
    let option = menu.options[menu.selectedIndex];
    let title = option.innerText;
    let parent = option.parentNode;
    let find_id = parent.id;
    let page_id;

    g_id = parent.label;

    if (title == 'play') {
        add_video([input.value], [''], [input.value], ['']);
        input.value = '';
        return;
    }

    if (!keydown) {
        page_id = 0;
        g_uri = (title == 'find') ? menu.value.replace('{INPUT}', input.value) : menu.value;
    } else if (/^\d+$/.exec(input.value)) {
        page_id = Number(input.value);
    } else {
        page_id = 0;
        g_uri = menu.options[find_id].value.replace('{INPUT}', input.value);
        menu.selectedIndex = find_id;
    }

    console.log(g_id, g_uri, page_id);

    get_page(g_id, g_uri, page_id);
}

function main() {
    //GM_deleteValue('17');
    //GM_deleteValue('88');
    //GM_deleteValue('mm');
    //GM_deleteValue('mt');
    //GM_deleteValue('xj');

    document.body = document.createElement('body');

    let div = document.createElement('div');
    div.style = 'position:fixed; right:0px;';
    document.body.appendChild(div);

    let a = document.createElement('a');
    a.innerText = '<';
    a.href = 'javascript:void(0);';
    a.onclick = ()=>{ get_page(g_id, g_uri, ((g_page_id == 0) ? g_page_cnt : g_page_id) - 1); }
    div.appendChild(a);

    a = document.createElement('a');
    a.id = 'page_num';
    a.innerText = '0/0';
    div.appendChild(a);

    a = document.createElement('a');
    a.innerText = '>';
    a.href = 'javascript:void(0);';
    a.onclick = ()=>{ get_page(g_id, g_uri, (g_page_id == g_page_cnt - 1) ? 0 : (g_page_id + 1)); }
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

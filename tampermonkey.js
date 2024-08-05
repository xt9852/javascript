// ==UserScript==
// @name         a
// @description  a
// @version      0
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @match        https://hm.baidu.com/hm.js?*
// @require      https://cdn.jsdelivr.net/npm/hls.js
// @require      https://cdn.jsdelivr.net/npm/lozad/dist/lozad.min.js
// @require      https://cdn.jsdelivr.net/npm/crypto-js/crypto-js.min.js
// @require      https://sm-static.trafficmanager.net/lib/fernetBrowser.min.js

// @connect      github.io
// @connect      88a1882.cc

// @connect      trafficmanager.net
// @connect      cucloud.cn
// @connect      bcebos.com
// @connect      aliyuncs.com
// @connect      mm324.cc

// @connect      hls5.ai
// @connect      521057.com
// @connect      032546.com
// @connect      yangknn.com
// @connect      xianggelilajc.com

// @connect      github.com
// @connect      kkht38.vip
// @connect      ht29o.vip
// @connect      ht30j.vip

// @connect      134.122.173.8
// @connect      dxj5566.com
// @connect      7wzx9.com
// ==/UserScript==

var g_hls = null;
var g_video = null;
var g_id = '';
var g_uri = '';
var g_page_id = 0;
var g_page_cnt = 0;
var g_param = {
88 : {
 data : {},
 addr : {
  beg : 'https://v88avnetwork.github.io/88av.html',
  reg : [ / href="(.+?)" target="_blank"/ ]},
 menu : {
  beg : '',
  reg :  /"?nav-item"?><a\s+href="?\/([^">]+)"?>([^<\s]+)/g,
  uri : '/{1}/{PAGE}',
  fnd : '/search/{INPUT}/{PAGE}' },
 page : {
  cnt : /data-total-page="(\d+)"/,
  reg : /<img alt="(.+?)"[\s\S]+?(https:\/\/.+?\/videos(\/.+?\/)cover\/5_505_259)/g,
  fnt : (ret)=>{ return [ret[1], ret[2] + '.webp', 'https://yrxya.xyz/videos' + ret[3] + 'g.m3u8?h=949691b4955da2c']; }}},
er : {
 data : {},
 addr : {
  beg : 'https://fabu.trafficmanager.net/index.html',
  reg : [ /href="(.+?)"/,
          (html)=>{ return atob(/"url": "(.+?)"},\s];/.exec(html)[1]); },
          (html)=>{ let e = /window.CONFIG ="(.+?)";/.exec(html)[1];
                    let j = JSON.parse(fer(e));
                    g_param.er.data.img = 'https://' + j.video_img_url;
                    g_param.er.data.vod = 'https://' + j.video_play_url_list[0].url[0];
                    return 'https://' + j.api_url; } ]},
 menu : {
  beg : '/api/vod/tag_group?count=true&page=1&per_page=20',
  ini : (html)=>{ return fer(JSON.parse(html)['x-data']); },
  reg : /"id":(\d+),"name":"(.+?)"/g,
  uri : '/api/vod/video?page={PAGE}&per_page=20&tag={1}',
  fnd : '/search/?page={PAGE}&per_page=20&search={INPUT}' },
 page : {
  ini : (html)=>{ return fer(JSON.parse(html)['x-data']); },
  cnt : (html)=>{ return Math.ceil(/"total":(\d+)/.exec(html)[1] / 20); },
  reg : /"id":(\d+),"name":"(.+?)"/g,
  fnt : (ret)=>{ return [ret[2], ret[1], ret[1]]; },
  img : (e)=>{ get(g_param.er.data.addr + '/api/vod/video/' + e.id, g_param.er.page.im1, {'xml':true, e:e, img:g_param.er.data.img, vod:g_param.er.data.img}); },
  im1 : (url, html, arg)=>{ let j = fer(JSON.parse(html)['x-data']);
                                arg.e.id = arg.vod + /"play_url":"(.+?)"/.exec(j)[1];
                                get(arg.img + /"pic":"(.+?)"/.exec(j)[1], g_param.er.page.im2, arg); },
  im2 : (url, html, arg)=>{ const e = html.split("@@@"); arg.e.poster = fer(e[0]) + e[1]; }}},
hl : {
 data : {},
 addr : {
  beg : 'https://hls5.ai',
  reg : [ (html)=>{ g_param.hl.data.json = /CDN = "(.+?)"/.exec(html)[1]; return g_param.hl.data.json + 'json/diversion.js'; },
          (html)=>{ g_param.hl.data.html = /"jumpDomain":"(.+?)"/.exec(html)[1]; return g_param.hl.data.json + 'json/config.js'; },
          (html)=>{ console.log(html);let ret = /"fileDomain":"(.+?)","videoDomain":".+?\\n(.+?)\\.+?",.+?"jsonCDN":"(.+?)\/"/.exec(html);
                    let data = g_param.hl.data; data.img = ret[1]; data.vod = ret[2]; data.json = ret[3]; return ret[3]; }]},
 menu : {
  beg : '/json/zone_0.json',//'/json/label_all.json',//
  ini : (html)=>{ return aes(html); },
  reg : /"repositoryZoneId":"(\d+)","repositoryZoneName":"(.+?)"/g,///"labelId":"(\d+)","labelName":"(.+?)"/g },//
  uri : '/json/rz_{1}_{PAGE}.json' },//'{ADDR}/json/rl_{URI}_{PAGE}.json',//
 page : {
  ini : (html)=>{ return aes(html); },
  cnt : (html)=>{ return Math.ceil(/"totalCount":(\d+)/.exec(html)[1] / 100); },
  reg : /"repositoryId":"(\d+)","publisher".+?"repositoryName":"(.+?)".+?"repositoryCoverUrl":"(.+?)"/g,///"repositoryCoverUrl":"(.+?)",.+?,"repositoryName":"(.+?)",.+?,"shardingFileUrl":"(.+?)"/g,//
  fnt : (ret)=>{ return [ret[2], g_param.hl.data.img + ret[3], ret[1] ]; }, // g_param.hl.data.html + '/json/' + ret[1] + '.html?t=s0'
  img : (e)=>{ get(g_param.hl.data.html + '/json/' + e.id + '.html?t=s0', g_param.hl.page.im1, e); },
  im1  : (url, html, arg)=>{ arg.id = g_param.hl.data.vod + /"shardingFileUrl":"(.+?)"/.exec(html)[1]; },
  }},
ht : {
 data : {},
 addr : {
  beg : 'https://github.com/htapp/htapp',
  reg : [ (html)=>{ return 'https://' + /https:\/\/<\/p>\s+<p dir="auto">([^<]+)/.exec(html)[1]; },
          (html)=>{ let u = /'(\d+)/.exec(html)[1], url = '', j = 0; for (; j < u.length; j += 4) url += String.fromCharCode(u.substr(j, 4) - 1000); return url + '/ht/index.html'; },
          /targetUrls = \[\s+"([^"]+)/ ]},
 menu : {
  beg : '',
  reg : /(type\/(?!game)(?!chigua)(?!nvyou).+?)" class="menu-link">(.+?)</g,
  uri : '/{1}---{PAGE}',
  fnd : '/search/{INPUT}/{PAGE}' },
 page : {
  cnt : /(\d+), event/,
  reg : /data-original="(https:\/\/[^/]+\/upload\/vod\/\d+-\d+\/[0-9a-f]+_xfile.jpg)".+?(\/video\/m3u8\/\d+\/\d+\/[0-9a-f]+\/).+?vod-title">(.+?)</g,
  fnt : (ret)=>{ return [str(ret[3]), ret[1], 'https://ww.huangke10.cn' + ret[2] + 'CDN/index.m3u8']; },
  img : (e)=>{ get(e.poster, g_param.ht.page.im1, {'xml':true, bin:true, e:e}); },
  im1 : (url, html, arg)=>{ let bin = [], data = new Uint8Array(html); for (let i = 0; i < data.byteLength; i++) bin += String.fromCharCode(data[i] ^ 0x88);
                            arg.e.poster = 'data:image/jpeg;base64,' + window.btoa(bin); }}},
mm : {
 data : {},
 addr : {
  beg : 'https://fabu.trafficmanager.net/index.html',
  reg : [ /href="(.+?)"/, (html)=>{ return atob(/猫咪看片", "url": "(.+?)"/.exec(html)[1]).replace('\n', ''); } ]},
 menu : {
  beg : '/home.html',
  reg :  /(tags\/.+?)\/index.html.+?data-onsite-or-offsite=""\s+>(.+?)</g,
  uri : '/{1}/{PAGE}.html',
  fnd : '/search/{INPUT}/{PAGE}.html' },
 page : {
  cnt : />(\d+)<\/a>\s+<.+?>&#19979;&#19968;&#39029;/,
  reg : /data-original="(https:\/\/.+?(\/.+?\/)cover\/cover_encry\.pip)[\s\S]*?<h3>([^<]+)/g,
  fnt : (ret)=>{ return [str(ret[3]), ret[1], 'https://365play.dd99rr.live' + ret[2] + 'm3u8/maomi365.m3u8']; },
  img : (e)=>{ get(e.poster, g_param.mm.page.im1, {xml:true,bin:true,e:e}); },
  im1 : (url, html, arg)=>{ let bin = [], data = new Uint8Array(html); for (let i = 17; i < data.byteLength; i++) bin += String.fromCharCode(data[i]);
                            arg.e.poster = 'data:image/jpeg;base64,' + window.btoa(bin); }}},
xj : {
 data : {},
 addr : {
  beg : 'https://134.122.173.8:8083/dxjgg/abs.js',
  reg : [ (html)=>{ return 'https://www.' + /domainNames = \[".+?","(.+?)"/.exec(html)[1] + '/js/base41.js'; }, /"(https:\/\/.+?)\/forward"/ ]},
 menu : {
  beg : '/getDataInit',
  pst : JSON.stringify({name: "John", age: 31, city: "New York"}),
  ini : (html)=>{ let res = JSON.parse(html); g_param.xj.data.group = res.data.macVodLinkMap; return res; },
  reg : (html)=>{ let ret = []; for (let i = 0; i < 3; i++) for (let j in html.data.menu0ListMap[i].menu2List) {
                  let m = html.data.menu0ListMap[i].menu2List[j];
                  ret.push({uri : '{"typeId":'+m.typeId2+',"content":""}', title : m.typeName2}); } return ret; },
  uri : '/forward',
  fnd : '{"typeId":0,"content":"{INPUT}"}' },
 page : {
  cnt : /"pageAllNumber":(\d+)/,
  reg : /(\/video\/m3u8\/\d+\/\d+\/[0-9a-f]+\/).+?vod_name":"(.+?)".+?vod_server_id":(\d+)/g,
  fnt : (ret)=>{ let data = g_param.xj.data.group[ret[3]]; return [ret[2], data.PIC_LINK_1 + ret[1] + '1.jpg', data.LINK_1 + ret[1] + 'playlist.m3u8']; }}}};

function aes(i) {
    return CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(i, CryptoJS.enc.Utf8.parse("6E31ECDEF3EEC0E6"), { mode: CryptoJS.mode.ECB }));
}

function fer(i) {
    let secret = new fernet.Secret("NyGRG56A8i5J2JMqh7da83r2MMfgbM7Ppw1aCF8YnAY=");
    let token = new fernet.Token({secret: secret, token: i, ttl: 0});
    return token.decode();
}

function img() {
    const observer = lozad('.lozad',{ load : (element)=>{
        let param = g_param[element.getAttribute('img')];
        if (param == null) return;
        param.page.img(element);
     }});

    observer.observe();
}

function str(str) {
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

function get(url, cb_load, arg, cb_timeout) {
    if (arg.xml != null) {
        //console.log('xml', url);

        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = arg.bin ? 'arraybuffer' : '';
        xhr.send();
        xhr.onload = ()=>{ cb_load(url, xhr.response, arg); }
        xhr.onerror = ()=>{ cb_timeout ? cb_timeout(url, xhr, arg) : console.log('error:' + url, xhr); }
        xhr.ontimeout = ()=>{ cb_timeout ? cb_timeout(url, xhr, arg) : console.log('timeout:' + url, xhr); }
    } else {
        let param = {
            url : url,
            method : arg.post ? 'POST' : 'GET',
            timeout : 5000,
            headers : { 'User-Agent' : 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
                        'Content-type' : 'application/json' },
            data : arg.post ? arg.data : null,
            onload(xhr) { if (xhr.status == 200) cb_load(url, xhr.responseText, arg); else console.log(url, xhr); },
            onerror(xhr) { cb_timeout ? cb_timeout(url, xhr, arg) : console.log('error:' + url, xhr); },
            ontimeout(xhr) { cb_timeout ? cb_timeout(url, xhr, arg) : console.log('timeout:' + url, xhr); },
        };

        //console.log(param);

        GM_xmlhttpRequest(param);
    }
}

function on_play() {
    if (g_video == this) {
        return;
    } else if (g_video != null) {
        g_hls.destroy();
        delete g_hls;
        g_video.controls = false;
        g_video.style.cursor = 'pointer';
    }

    g_video = this;
    g_video.controls = true;
    g_video.style.cursor = 'default';

    g_hls = new Hls({ id : this.id });
    g_hls.attachMedia(this);
    g_hls.loadSource(this.id);
    g_hls.on(Hls.Events.MANIFEST_PARSED, function(){ g_video.play(); });
}

function video(data, id) {
    let param = g_param[id];

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
        video.onclick = on_play;
        video.style = 'cursor:pointer;max-height:500px';
        video.setAttribute('class', 'lozad');
        video.setAttribute('poster', data[i + 1]);
        if (param != null && param.page != null && param.page.img != null) video.setAttribute('img', id);
        content.appendChild(video);
    }

    img();

    window.scrollTo(0, 0);
}

function select(id, data) {
    let select = document.getElementById('menu');

    let optgroup = document.createElement('optgroup');
    optgroup.label = id;
    optgroup.id = select.options.length;

    select.appendChild(optgroup);

    for (let i = 0, option; i < data.length; i++) {
        option = document.createElement('option');
        option.value = data[i].uri;
        option.innerText = data[i].title;
        optgroup.appendChild(option);
    }
}

function cb_addr_get_timeout(url, xhr, arg) {
    let id = arg.id;
    let times = arg.times[0];
    let timeout = ++arg.times[2];
    let ret;

    console.log(id, 'get', url, times, timeout, xhr.error ? xhr.error : 'timeout');

    if (/Refused to connect to ".+?"/.exec(xhr.error)) { return; }

    if (timeout >= 3) { return; }

    get(url, cb_addr_get, arg, cb_addr_get_timeout);
}

function cb_addr_try_timeout(url, xhr, arg) {
    let id = arg.id;
    let times = arg.times[0];
    let timeout = ++arg.times[2];
    let param = g_param[id];
    let addr = param.addr;

    console.log(id, 'try', url, times, timeout, xhr.error ? xhr.error : 'timeout');

    if (/Refused to connect to ".+?"/.exec(xhr.error)) { return; }

    if (timeout >= 3) {
        if (times < 1) {
            arg.times = [ times + 1, 0, 0 ];
            get(addr.beg, cb_addr_get, arg, cb_addr_get_timeout);
            console.log(id, 'get', addr.beg);
        }
        return;
    }

    get(url, cb_addr_try, arg, cb_addr_try_timeout);
}

function cb_addr_get(url, html, arg) {
    let id = arg.id;
    let date = arg.date;
    let times = arg.times[0];
    let step = arg.times[1];
    let param = g_param[id];
    let menu = param.menu;
    let addr = param.addr;
    let data = param.data;
    let reg = addr.reg[step++];

    let tmp = (typeof(reg) == 'function') ? reg(html) : reg.exec(html)[1];

    console.log(id, 'get', url, times, step, tmp);

    if (step < addr.reg.length) {
        arg.times = [ times, step, 0 ];
        get(tmp, cb_addr_get, arg, cb_addr_get_timeout);
        return;
    }

    data.addr = tmp;

    if (menu.pst != null) {
        arg.post = true;
        arg.data = menu.pst;
    }

    get(tmp + menu.beg, cb_addr_try, arg, cb_addr_try_timeout);
}

function cb_addr_try(url, html, arg) {
    let id = arg.id;
    let date = arg.date;
    let param = g_param[id];
    let addr = param.addr;
    let page = param.page;
    let menu = param.menu;
    let data = param.data;
    let ini = menu.ini;
    let reg = menu.reg;
    let uri = menu.uri;
    let fnd = menu.fnd;
    let item = [];
    let ret;

    if ((ret = /"refresh"[\s\S]+(https?:\/\/[^"\/]+)/.exec(html)) || (ret = /targetSites = \[\s+'([^']+)/.exec(html))) {
        console.log(id, 'ref', ret[1] + menu.uri);
        data.addr = ret[1];
        get(ret[1] + menu.uri, cb_addr_try, arg, cb_addr_try_timeout);
        return;
    }

    if (ini) {
        html = ini(html);
    }

    if (fnd) {
        item.push({uri : fnd, title : 'find'});
    }

    if (typeof(reg) == 'function') {
        item.push(...reg(html));
    } else {
        while (ret = reg.exec(html)) { item.push({uri : uri.replace('{1}', str(ret[1])), title : str(ret[2])}); }
    }

    if (item.length <= 1) {
        console.log(id, 'menu reg error', url, html);
        return;
    }

    select(id, item);

    GM_setValue(id, {date : date, menu : item, data : data});

    console.log(id, 'set', GM_getValue(id));
}

function addr(id) {
    let param = g_param[id];
    let addr = param.addr;
    let menu = param.menu;
    let page = param.page;
    let old = GM_getValue(id);
    let now = new Date().toLocaleDateString();
    let arg = {id : id, date : now, times : [0, 0, 0]};

    if (old == null) {
        get(addr.beg, cb_addr_get, arg, cb_addr_get_timeout);
        console.log(id, 'get', addr.beg);
        return;
    }

    param.data = old.data;

    if (old.date == now) {
        select(id, old.menu);
        console.log(id, 'use', param.data.addr);
        return;
    }

    if (menu.pst != null) {
        arg.post = true;
        arg.data = menu.pst;
    }

    get(param.data.addr + menu.uri, cb_addr_try, arg, cb_addr_try_timeout);

    console.log(id, 'try', param.data.addr + menu.uri);
}

function cb_page(url, html, arg) {
    let id = arg.id;
    let param = g_param[id];
    let page = param.page;
    let ini = page.ini;
    let reg = page.reg;
    let cnt = page.cnt;
    let fnt = page.fnt;
    let data = [];
    let ret;

    g_page_id = arg.page_id;

    if (ini) {
        html = ini(html);
    }

    if (g_page_id == 0) {
        if (typeof(cnt) == 'function') {
            g_page_cnt = cnt(html);
        } else if (ret = cnt.exec(html)) {
            g_page_cnt = Number(ret[1]);
        }
    }

    for (let ret; ret = reg.exec(html);) {
        data.push(...fnt(ret));
    }

    if (data.length == 0) {
        console.log(id, 'page fnt error', html);
    }

    video(data, id);

    document.getElementById('page_num').innerText = g_page_id + '/' + g_page_cnt;
}

function page(id, uri, page_id) {
    let param = g_param[id];
    let addr = param.addr;
    let page = param.page;
    let menu = param.menu;
    let data = param.data;
    let url = data.addr + uri;

    if (menu.pst == null) {
        get(url.replace('{URI}', uri).replace('{PAGE}', page_id + 1), cb_page, {id : id, page_id : page_id});
    } else {
        let res = JSON.parse(uri);
        let dat = {command:"WEB_GET_INFO", pageNumber:page_id + 1, RecordsPage:20, typeId:res.typeId, typeMid:1, type:1, languageType:"CN", content:res.content};
        get(data.addr + menu.uri, cb_page, {post : true, data : JSON.stringify(dat), id : id, page_id : page_id});
    }
}

function on_change(keydown) {
    let menu = document.getElementById('menu');
    let input = document.getElementById('input');
    let option = menu.options[menu.selectedIndex];
    let title = option.innerText;
    let parent = option.parentNode;
    let find_id = parent.id;
    let page_id = 0;

    g_id = parent.label;

    if (g_id == 'm3') {
        video([input.value, '', input.value], '');
        input.value = '';
        return;
    }

    if (!keydown) {
        g_uri = (title == 'find') ? menu.value.replace('{INPUT}', input.value) : menu.value;
    } else if (/^\d+$/.exec(input.value)) {
        page_id = Number(input.value);
    } else {
        g_uri = menu.options[find_id].value.replace('{INPUT}', input.value);
        menu.selectedIndex = find_id;
    }

    console.log(g_id, g_uri, page_id);

    page(g_id, g_uri, page_id);
}

function main() {
    //GM_deleteValue('88');
    //GM_deleteValue('er');
    //GM_deleteValue('hl');
    //GM_deleteValue('ht');
    //GM_deleteValue('mm');
    //GM_deleteValue('xj');

    document.body = document.createElement('body');

    let div = document.createElement('div');
    div.style = 'position:fixed; right:0px;';
    document.body.appendChild(div);

    let a = document.createElement('a');
    a.innerText = '<';
    a.href = 'javascript:void(0);';
    a.onclick = ()=>{ page(g_id, g_uri, ((g_page_id == 0) ? g_page_cnt : g_page_id) - 1); }
    div.appendChild(a);

    a = document.createElement('a');
    a.id = 'page_num';
    a.innerText = '0/0';
    div.appendChild(a);

    a = document.createElement('a');
    a.innerText = '>';
    a.href = 'javascript:void(0);';
    a.onclick = ()=>{ page(g_id, g_uri, (g_page_id == g_page_cnt - 1) ? 0 : (g_page_id + 1)); }
    div.appendChild(a);

    let input = document.createElement('input');
    input.id = 'input';
    input.onkeydown = ()=>{ if (event.keyCode == 13) on_change(true); }
    div.appendChild(input);

    let menu = document.createElement('select');
    menu.id = 'menu';
    menu.onchange = ()=>{ on_change(false); }
    div.appendChild(menu);

    div = document.createElement('div');
    div.id = 'content';
    document.body.appendChild(div);

    select('m3', [{title : 'play', uri : '{INPUT}'}]);

    for (let id in g_param) { addr(id); }
}

main();

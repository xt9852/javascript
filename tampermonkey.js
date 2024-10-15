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

// @connect      88av88av4187.xyz
// @connect      88av4252.xyz

// @connect      trafficmanager.net
// @connect      cucloud.cn
// @connect      bcebos.com
// @connect      415383.com
// @connect      kaitingmart.com

// @connect      ggsp4.cc
// @connect      kbuu58.cc
// @connect      a13.houduana1.cc

// @connect      373450.com
// @connect      808947.com
// @connect      bssydt.com

// @connect      github.com
// @connect      kht75.vip
// @connect      htsyzz5.vip
// @connect      ht485op.vip

// @connect      dxj5577.com
// @connect      7wzx9.com
// ==/UserScript==

var g_hls = null;
var g_video = null;
var g_id = '';
var g_url = '';
var g_post = '';
var g_page_id = 0;
var g_page_cnt = 0;
var g_site = {
av : {
 data : {},
 addr : {
  beg : 'https://88av88av4187.xyz',//https://v88avnetwork.github.io/88av.html',
  reg : [ (html)=>{ g_site.av.data.addr = /6<\/h2>[\s\S]+?href="(.+?)" target="_blank">http/.exec(html)[1];
                    return g_site.av.data.addr + '/watch/65f401843720aeb8214b7a7f' },
          (html)=>{ g_site.av.data.vod = /\["cncdn", ".+?", "(.+?)"\]/.exec(html)[1];
                    return g_site.av.data.addr; } ]},
 menu : {
  beg : '{ADDR}',
  reg :  /"?nav-item"?><a\s+href="?\/([^">]+)"?>([^<\s]+)/g,
  fnd : '{ADDR}/search/{INPUT}/{PAGE}',
  url : '{ADDR}/{1}/{PAGE}' },
 page : {
  cnt : /data-total-page="(\d+)"/,
  reg : /<img alt="(.+?)"[\s\S]+?(https:\/\/.+?\/videos(\/.+?\/)cover\/5_505_259)/g,
  fnt : (ret)=>{ return [ret[1], ret[2] + '.webp', 'https://' + g_site.av.data.vod + '/videos' + ret[3] + 'g.m3u8?h=3121efe8979c635']; }}},
dd : {
 data : {},
 addr : {
  beg : 'https://fbkp.trafficmanager.net:9527/index.html',
  reg : [ /href="(.+?)"/,
         (html)=>{ let m = atob(/"url": "(.+?)"/.exec(html)[1]); return m;},
         (html)=>{ let e = /decode\("(.+?)"\)/.exec(html)[1];
                   let d = decodeURIComponent(escape(atob(e))).split("|");
                   return d[0]; },
         (html)=>{ let e = /window.CONFIG = "(.+?)";/.exec(html)[1];
                   let j = JSON.parse(fer(e));
                   g_site.dd.data.img = 'https://' + j.video_img_url;
                   g_site.dd.data.vod = 'https://' + j.video_play_url_list[0].url[0];
                   return 'https://' + j.api_url; } ]},
 menu : {
  beg : '{ADDR}/api/vod/tag_group?page=1&per_page=1000&site_id=6&channel_id=523',
  ini : (html)=>{ let d = fer(JSON.parse(html)['x-data']); return d;},
  reg : (html)=>{ let m = [{title : 'find', url : g_site.dd.menu.fnd}];
                  let d = JSON.parse(html);
                  for (let i of [14, 18, 25]) {
                      for (let j = 0; j < d.data.items[i].tag.length;j++) {
                          if (d.data.items[i].tag[j].target == '' && d.data.items[i].tag[j].name.length > 2) {
                              m.push({title : d.data.items[i].tag[j].name, url : '{ADDR}/api/vod/video?page={PAGE}&per_page=30&tag=' + d.data.items[i].tag[j].id});
                          }
                      }
                  }
                  return m; },
  fnd : '{ADDR}/search/?page={PAGE}&per_page=30&search={INPUT}',
  url : '{ADDR}/api/vod/video?page={PAGE}&per_page=30&tag={1}' },
 page : {
  ini : (html)=>{ let d = fer(JSON.parse(html)['x-data']); return d; },
  cnt : (html)=>{ return Math.ceil(/"total":(\d+)/.exec(html)[1] / 30); },
  reg : /"id":(\d+),"name":"([^"]+)","product/g,
  fnt : (ret)=>{ return [ret[2], ret[1], ret[1]]; },
  lz0 : (e)=>{ get(g_site.dd.data.addr + '/api/vod/video/' + e.id, g_site.dd.page.lz1, {'xml':true, e:e, img:g_site.dd.data.img, vod:g_site.dd.data.img}); },
  lz1 : (url, html, arg)=>{ let j = fer(JSON.parse(html)['x-data']);
                            arg.e.id = arg.vod + /"play_url":"(.+?)"/.exec(j)[1];
                            get(arg.img + /"pic":"(.+?)"/.exec(j)[1], g_site.dd.page.lz2, arg); },
  lz2 : (url, html, arg)=>{ let e = html.split("@@@");
                            arg.e.poster = fer(e[0]) + e[1]; }}},
gg : {
 data : {},
 addr : {
  beg : 'http://ggsp4.cc',
  reg : [ (html)=>{ let a = /href="\.(.+?)" class="enter-button"/.exec(html)[1];
                    return 'http://ggsp4.cc' + a;
                  },
          (html)=>{ g_site.gg.data.addr = /urlMap = \[\s*"(https:\/\/.+?)\//.exec(html)[1];
                    return g_site.gg.data.addr + '/js/base.js';
                  },
          (html)=>{ g_site.gg.data.api = /domain = "(https:\/\/.+?)\//.exec(html)[1];
                    g_site.gg.data.key = /my = "(.+?)"/.exec(html)[1];
                    return g_site.gg.data.addr;
                  }]},
 menu : {
  beg : '{ADDR}/js/api.js',
  reg : /"id": ((?!1)\d+),\s+"name": "(.+?)",/g,
  fnd : '{API}/api.php/index/getShiPinList?currentPage={PAGE}&wd={INPUT}',
  url : '{API}/api.php/index/getShiPinList?currentPage={PAGE}&id={1}' },
 page : {
  ini : (html)=>{ let key = CryptoJS.enc.Utf8.parse(g_site.gg.data.key);
                  let iv = CryptoJS.enc.Utf8.parse(g_site.gg.data.key);
                  let txt = html.split('"').join('').split('\\').join('');
                  return CryptoJS.AES.decrypt(txt, key, { iv: iv, padding: CryptoJS.pad.Pkcs7 }).toString(CryptoJS.enc.Utf8); },
  cnt : (html)=>{ return Math.ceil(/"count":(\d+)/.exec(html)[1] / 30); },
  reg : /"vod_id":(\d+),"vod_pic":"(.+?)","vod_blurb":"(.+?)"/g,
  fnt : (ret)=>{ return [uni(ret[3]), ret[2].split('\\').join(''), ret[1]]; },
  lz0 : (e)=>{ get(g_site.gg.data.api + '/api.php/index/getDetail?id=' + e.id, g_site.gg.page.lz1, {'xml':true, e:e}); },
  lz1 : (url, html, arg)=>{ let t = g_site.gg.page.ini(html);
                            arg.e.id = /"vod_play_url":"(.+?)"/.exec(t)[1].split('\\').join(''); }}},
hl : {
 data : {},
 addr : {
  beg : 'https://373450.com/config.js', //https://300507.com/api/media-site/h5/externalLink/get/home/url, https://cgua4.tv
  reg : [ /jumpUrl: '(.+?)'/,
          (html)=>{ let a = /href="https:\/\/\w+\.(.+?)\//.exec(html);
                    g_site.hl.data.vod = /2",2,"(.+?)"/.exec(html)[1];
                    console.log(g_site.hl.data.vod);
                    return 'https://jsonxz.' + a[1]; }]},
 menu : {
  beg : '{ADDR}/pages/1/8/home/home.json',
  ini : (html)=>{ let j = JSON.parse(html); j = JSON.parse(aes(j.json_data)); return JSON.stringify(j.tabs[2].channelList); },
  reg : /"id":"(\d+)","name":"(.+?)"/g,
  url : '{ADDR}/pages/1/8/water/{1}/{PAGE}.json' },
 page : {
  ini : (html)=>{ let j = JSON.parse(html); return aes(j.json_data); },
  cnt : (html)=>{ get(rep('{ADDR}/pages/1/8/water/1838847758462455810/index.json', g_site.hl.data), g_site.hl.page.cn1, 0);
                  return 0; },
  cn1 : (url, html, arg)=>{ g_page_cnt = /(\d+),$/.exec(html)[1];
                            document.getElementById('page_num').innerText = g_page_id + '/' + g_page_cnt; },
  reg : /"id":"(\d+)","mainImgUrl":"(.+?)".+?"title":"(.+?)"/g,
  fnt : (ret)=>{ return [ret[3], g_site.hl.data.vod + '/' + ret[2], ret[1] ]; },
  lz0 : (e)=>{ get(g_site.hl.data.addr + '/pages/detail/' + e.id + '.json', g_site.hl.page.lz1, e); },
  lz1  : (url, html, arg)=>{ let j = JSON.parse(html);
                             j = JSON.parse(aes(j.json_data));
                             arg.id = g_site.hl.data.vod + '/' + j.videoUrlList[0].videoUrl; },
  }},
ht : {
 data : {},
 addr : {
  beg : 'https://github.com/htapp/htapp',
  reg : [ (html)=>{ return 'https://' + /https:\/\/<\/p>\s+<p dir="auto">([^<]+)/.exec(html)[1]; },
          (html)=>{ return /targetSites = \[\s+'(.+?)'/.exec(html)[1] + '/ht/index.html' },
          /targetUrls = \[\s+"(.+?)"/ ]},
 menu : {
  beg : '{ADDR}',
  reg : /(type\/(?!game)(?!chigua)(?!nvyou).+?)" vclass="menu-link">(.+?)</g,
  fnd : '{ADDR}/search/{INPUT}/{PAGE}',
  url : '{ADDR}/{1}---{PAGE}' },
 page : {
  cnt : /, (\d+), event/,
  reg : /data-original="(https:\/\/.+?\/upload\/vod\/\d+-\d+\/[0-9a-f]+_xfile.jpg)".+?(\/video\/m3u8\/\d+\/\d+\/[0-9a-f]+\/).+?"v-title">(.+?)</g,
  fnt : (ret)=>{ return [str(decodeURIComponent(ret[3])), decodeURIComponent(ret[1]), 'https://ts.xnmbhi.cn' + decodeURIComponent(ret[2]) + 'index.m3u8']; },
  lz0 : (e)=>{ get(e.poster, g_site.ht.page.lz1, {'xml':true, bin:true, e:e}); },
  lz1 : (url, html, arg)=>{ console.log(url);let bin = [], data = new Uint8Array(html);
                            for (let i = 0; i < data.byteLength; i++) bin += String.fromCharCode(data[i] ^ 0x88);
                            arg.e.poster = 'data:image/jpeg;base64,' + window.btoa(bin); }}},
xj : {
 data : {},
 addr : {
  beg : 'https://dxj5577.com/js/base41.js', //https://134.122.173.8:8083/dxjgg/abs.js
  reg : [ //(html)=>{ return 'https://www.' + /domainNames = \[".+?",".+?","(.+?)"/.exec(html)[1] + '/js/base41.js'; },
          /"(https:\/\/.+?)\/forward"/ ]},
 menu : {
  beg : '{ADDR}/getDataInit',
  ini : (html)=>{ let j = JSON.parse(html);
                  g_site.xj.data.group = j.data.macVodLinkMap;
                  return j; },
  reg : (html)=>{ let o = [];
                  for (let i = 0; i < 3; i++) {
                      for (let j in html.data.menu0ListMap[i].menu2List) {
                          let m = html.data.menu0ListMap[i].menu2List[j];
                          o.push({title:m.typeName2,
                                  url:'{ADDR}/forward',
                                  post:'{"command":"WEB_GET_INFO","pageNumber":{PAGE},"RecordsPage":20,"typeId":'+m.typeId2+',"typeMid":1,"languageType":"CN","content":""}'});
                      }
                  }
                  o.sort((a, b)=>a.title.localeCompare(b.title));
                  o.unshift({title:'find',
                             url:'{ADDR}/forward',
                             post:'{"command":"WEB_GET_INFO","pageNumber":{PAGE},"RecordsPage":20,"typeId":0,"typeMid":1,"type":1,"languageType":"CN","content":"{INPUT}"}'});
                  return o; },
  pst : '{"name":"John","age":31,"city":"New York"}' },
 page : {
  cnt : /"pageAllNumber":(\d+)/,
  reg : /(\/video\/m3u8\/\d+\/\d+\/[0-9a-f]+\/).+?vod_name":"(.+?)".+?vod_server_id":(\d+)/g,
  fnt : (ret)=>{ let data = g_site.xj.data.group[ret[3]];
                return [ret[2], data.PIC_LINK_1 + ret[1] + '1.jpg', data.LINK_1 + ret[1] + 'playlist.m3u8']; }}}};

function main() {
    //GM_deleteValue('av');
    //GM_deleteValue('dd');
    //GM_deleteValue('gg');
    //GM_deleteValue('hl');
    //GM_deleteValue('ht');
    //GM_deleteValue('xj');
    let d = GM_listValues();
    d.sort((a, b)=>a.localeCompare(b));
    for (let i of d) console.log(i, GM_getValue(i));

    document.onkeydown = on_keydown;

    document.body = document.createElement('body');

    let div = document.createElement('div');
    div.style = 'position:fixed;right:0px;';
    document.body.appendChild(div);

    let a = document.createElement('a');
    a.innerText = '<';
    a.href = 'javascript:void(0);';
    a.onclick = on_pre;
    div.appendChild(a);

    a = document.createElement('a');
    a.id = 'page_num';
    a.innerText = '0/0';
    div.appendChild(a);

    a = document.createElement('a');
    a.innerText = '>';
    a.href = 'javascript:void(0);';
    a.onclick = on_next;
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

    select('m3', [{title : 'play', url : '{INPUT}', data : ''}]);

    for (let id in g_site) { addr(id); }
}

function aes(i) {
    let k = CryptoJS.enc.Utf8.parse("zH3JDuCRXVGa3na7xbOqpx1bw6DAkbTP");
    let d = CryptoJS.AES.decrypt(i, k, { iv : k, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return CryptoJS.enc.Utf8.stringify(d);
}

function fer(i) {
    let secret = new fernet.Secret("NyGRG56A8i5J2JMqh7da83r2MMfgbM7Ppw1aCF8YnAY=");
    let token = new fernet.Token({secret: secret, token: i, ttl: 0});
    return token.decode();
}

function lzd() {
    const observer = lozad('.lozad',{ load : (element)=>{
        let param = g_site[element.getAttribute('lz0')];
        if (param == null) return;
        param.page.lz0(element);
     }});

    observer.observe();
}

function str(i) {
    let pos = 0;
    let out = '';

    for (let reg = /&#(x)?([0-9a-fA-F]+);/g, ret; ret = reg.exec(i); ) {
        if (ret.index > pos) {
            out += i.substring(pos, ret.index);
            pos = ret.index;
        }

        out += String.fromCharCode((ret[1] == 'x') ? parseInt(ret[2], 16) : ret[2]);
        pos += ret[0].length;
    }

    if (pos < i.length) {
        out += i.substring(pos, i.length);
    }

    return out;
}

function uni(i) {
    let pos = 0;
    let out = '';

    for (let reg = /\\u([0-9a-f]{4})/g, ret; ret = reg.exec(i); ) {
        if (ret.index > pos) {
            out += i.substring(pos, ret.index);
            pos = ret.index;
        }

        out += String.fromCodePoint(parseInt(ret[1], 16));
        pos += ret[0].length;
    }

    if (pos < i.length) {
        out += i.substring(pos, i.length);
    }

    return out;
}

function rep(i, map) {
    for (let key in map) { i = i.replace('{' + key.toUpperCase() + '}', map[key]); }
    return i;
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
            onload(xhr) { if (xhr.status != 404 && xhr.responseText.length > 0) cb_load(url, xhr.responseText, arg); else console.log(url, xhr); },
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
    let site = g_site[id];

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
        if (site != null && site.page != null && site.page.lz0 != null) video.setAttribute('lz0', id);
        content.appendChild(video);
    }

    lzd();

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
        option.innerText = data[i].title;
        if (data[i].url) option.setAttribute('url', data[i].url);
        if (data[i].post) option.setAttribute('post', data[i].post);
        optgroup.appendChild(option);
    }
}

function cb_addr_timeout(url, xhr, arg) {
    let id = arg.id;
    let step = arg.step;
    let timeout = ++arg.timeout;
    let ret;

    console.log(id, 'get', step, timeout, url, xhr.error ? xhr.error : 'timeout');

    if (/Refused to connect to ".+?"/.exec(xhr.error)) { return; }

    if (timeout >= 3) { return; }

    get(url, cb_addr, arg, cb_addr_timeout);
}

function cb_menu_timeout(url, xhr, arg) {
    let id = arg.id;
    let timeout = ++arg.timeout;
    let site = g_site[id];
    let addr = site.addr;

    console.log(id, 'try', timeout, url, xhr.error ? xhr.error : 'timeout');

    if (/Refused to connect to ".+?"/.exec(xhr.error)) { return; }

    if (timeout >= 3) {
        arg.step = 0;
        arg.timeout = 0;
        get(addr.beg, cb_addr, arg, cb_addr_timeout);
        console.log(id, 'get', addr.beg);
        return;
    }

    get(url, cb_addr, arg, cb_addr_timeout);
}

function cb_addr(url, html, arg) {
    let id = arg.id;
    let date = arg.date;
    let step = arg.step;
    let site = g_site[id];
    let menu = site.menu;
    let addr = site.addr;
    let data = site.data;
    let reg = addr.reg[step];

    let tmp = (typeof(reg) == 'function') ? reg(html) : reg.exec(html)[1];

    console.log(id, step, url.padEnd(50), tmp);

    if (step < (addr.reg.length - 1)) {
        arg.step = step + 1;
        arg.timeout = 0;
        get(tmp, cb_addr, arg, cb_addr_timeout);
        return;
    }

    if (menu.pst) {
        arg.post = true;
        arg.data = menu.pst;
    }

    data.addr = tmp;

    get(rep(menu.beg, data), cb_menu, arg, cb_menu_timeout);
}

function cb_menu(url, html, arg) {
    let id = arg.id;
    let date = arg.date;
    let site = g_site[id];
    let addr = site.addr;
    let page = site.page;
    let menu = site.menu;
    let data = site.data;
    let ini = menu.ini;
    let reg = menu.reg;
    let end = menu.end;
    let fnd = menu.fnd;
    let item = [];
    let ret;

    if ((ret = /"refresh"[\s\S]+(https?:\/\/[^"\/]+)/.exec(html)) || (ret = /targetSites = \[\s+'([^']+)/.exec(html))) {
        data.addr = ret[1];
        get(menu.beg.replace('{ADDR}', ret[1]), cb_addr, arg, cb_addr_timeout);
        return;
    }

    if (ini) {
        html = ini(html);
    }

    if (typeof(reg) == 'function') {
        item.push(...reg(html));
    } else {
        if (fnd) { item.push({title:'find', url:fnd}); }
        while (ret = reg.exec(html)) { item.push({title:str(decodeURIComponent(ret[2])), url:menu.url.replace('{1}', str(ret[1]))}); }
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
    let site = g_site[id];
    let addr = site.addr;
    let menu = site.menu;
    let page = site.page;
    let old = GM_getValue(id);
    let now = new Date().toLocaleDateString();
    let arg = {id : id, date : now, step : 0, timeout : 0};

    if (old && old.date == now) {
        site.data = old.data;
        select(id, old.menu);
        return;
    }

    if (menu.pst) {
        arg.post = true;
        arg.data = menu.pst;
    }

    get(addr.beg, cb_addr, arg, cb_addr_timeout);
}

function cb_page(url, html, arg) {
    let id = arg.id;
    let site = g_site[id];
    let page = site.page;
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

function page(id, url, post, page_id) {
    let site = g_site[id];
    let addr = site.addr;
    let page = site.page;
    let menu = site.menu;
    let data = site.data;

    url = rep(url, site.data);
    url = url.replace('{PAGE}', page_id + 1);
    if (post) post = post.replace('{PAGE}', page_id + 1);

    console.log('url:', url, post);

    get(url, cb_page, post ? {post : true, data : post, id : id, page_id : page_id} : {id : id, page_id : page_id});
}

function on_change(keydown) {
    let menu = document.getElementById('menu');
    let input = document.getElementById('input');
    let option = menu.options[menu.selectedIndex];
    let title = option.innerText;
    let parent = option.parentNode;
    let find_id = parent.id;
    let find = menu.options[find_id];
    let page_id = 0;

    g_id = parent.label;
    g_post = '';

    if (g_id == 'm3') {
        g_page_id = 0;
        g_page_cnt = 0;
        video([input.value, '', input.value], '');
        input.value = '';
        return;
    }

    if (keydown && /^\d+$/.exec(input.value)) {
        page_id = Number(input.value);
    } else {
        if (keydown || title == 'find') {
            menu.selectedIndex = find_id;
            g_url = find.getAttribute('url');
            g_post = find.getAttribute('post');
        } else {
            g_url = option.getAttribute('url');
            g_post = option.getAttribute('post');
        }

        g_url = g_url.replace('{INPUT}', input.value);
        if (g_post) g_post = g_post.replace('{INPUT}', input.value);
    }

    page(g_id, g_url, g_post, page_id);
}

function on_pre() {
    page(g_id, g_url, g_post, ((g_page_id == 0) ? g_page_cnt : g_page_id) - 1);
}

function on_next() {
    page(g_id, g_url, g_post, (g_page_id == g_page_cnt - 1) ? 0 : (g_page_id + 1));
}

function on_keydown(evt) {
    evt = (evt) ? evt : window.event;
    if (evt.keyCode == 37) on_pre();
    if (evt.keyCode == 39) on_next();
}

main();

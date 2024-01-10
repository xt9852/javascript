// ==UserScript==
// @name         demo
// @description  demo
// @version      0.1
// @match        https://v88avnetwork.github.io/88av.html*
// @require      https://cdn.jsdelivr.net/npm/hls.js
// @require      https://cdn.jsdelivr.net/npm/lozad/dist/lozad.min.js
// @connect      88a2277.cc
// @connect      tai99.net
// @connect      t90319.xyz
// @connect      t90639.com
// @connect      t90976.xyz
// @connect      oss.tstdjoiajojkla.com
// @connect      imp.ooimz.com
// @connect      1jubt.top
// @connect      rou.pub/dizhi
// @grant        GM_getValue
// @grant        GM_setValue
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

    g_hls = new Hls({ id : this.id, startPosition: 100 });
    g_hls.attachMedia(this);
    g_hls.loadSource(this.id);

    g_hls.on(Hls.Events.MANIFEST_PARSED, function() {
        g_video.play();
    });
}

function get_data(url, callback, param) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload(xhr) {
          if (200 != xhr.status) {
              let div = document.createElement("div");
              div.innerText = 'get_data: ' + url + ' status:' + xhr.status;
              document.body.appendChild(div);
              return;
          }

          console.log('get_data: ' + url + ' status:' + xhr.status + ' finalUrl: ' + xhr.finalUrl);

          callback(xhr.responseText, param, (xhr.finalUrl != url) ? xhr.finalUrl : null);
      }
    });
}

function get_domain1_callback(responseText, param, finalUrl) {
    let id = param[0];
    let now = param[1];

    if (finalUrl) {
        console.log(finalUrl.substring(0, finalUrl.lastIndexOf('?')));

        g_domain[id] = finalUrl;
    } else {
        let reg = /href="([^"]+)"/g;
        let addr = reg.exec(responseText);
        g_domain[id] = addr[1];
    }

    GM_setValue('date' + id, now);
    GM_setValue('domain' + id, g_domain[id]);

    console.log('set g_domain[' + id + ']: ' + g_domain[id]);
}

function get_domain1(id, now) {
    get_data('http://tai99.net/', get_domain1_callback, [ id, now ])
}

function get_domain0(id, now) {
    g_domain[id] = document.getElementsByTagName('a')[2].href;

    GM_setValue('date' + id, now);
    GM_setValue('domain' + id, g_domain[id]);

    console.log('set g_domain[' + id + ']: ' + g_domain[id]);
}

function get_last_domain(id, get_domain) {
    let now = new Date().toLocaleDateString();
    let date = GM_getValue('date' + id, '');
    console.log('now:' + now + ' id:' + id + ' date:' + date);

    if (date == now) {
        g_domain[id] = GM_getValue('domain' + id, '');
        console.log('g_domain[' + id + ']: ' + g_domain[id]);
    } else {
        get_domain(id, now);
    }
}

function new_link(name, addr) {
    let a = document.createElement("a");
    a.style='margin-left:10';
    a.href= document.location.origin + document.location.pathname + addr;
    a.innerText = name;
    document.body.appendChild(a);
}

function add_link() {
    document.body = document.createElement('body');

    new_link('播放', '?m3u8/');

    new_link('/', '?88/');
    new_link('91', '?88/categories/91/1');
    new_link('最新', '?88/video/latest/1');
    new_link('日本', '?88/jav/1');
    new_link('欧美', '?88/oumei/1');
    new_link('查找', '?88/search/ca/1');

    new_link('/', '?th/');
    new_link('吃瓜', '?th/category/?category_id=101&page=1');
    new_link('国产', '?th/category/?category_id=1&page=1');
    new_link('日韩', '?th/category/?category_id=4&page=1');
    new_link('欧美', '?th/category/?category_id=25&page=1');
    new_link('动漫', '?th/category/?category_id=145&page=1');
    new_link('乱伦', '?th/category/?category_id=69&page=1');
    new_link('偷拍', '?th/category/?category_id=56&page=1');
    new_link('爱奴', '?th/category/?category_id=71&page=1');
    new_link('萝莉', '?th/category/?category_id=70&page=1');
    new_link('明星', '?th/category/?category_id=108&page=1');
    new_link('主播', '?th/category/?category_id=40&page=1');
    new_link('美乳', '?th/category/?category_id=67&page=1');
    new_link('口爆', '?th/category/?category_id=68&page=1');
    new_link('解说', '?th/category/?category_id=105&page=1');
    new_link('COS', '?th/category/?category_id=72&page=1');
}

function delete_head_body() {
    document.body = document.createElement('body');
    var head = document.querySelector('head');
    head.parentNode.removeChild(head);
}

function lozad_observer() {
    const observer = lozad('.lozad',{ load: function load(element) {
        function decode(data, key = '0x88') {
            let binary = '';
            let bytes = new Uint8Array(data);
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i] ^ key);
            }
            return 'data:image/jpeg;base64,' + window.btoa(binary);
        }

        // 请求解码图片数据
        function get_img_xor(addr, attr) {
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
            get_img_xor(poster, 'poster');
        }
     }});

    observer.observe();
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

    lozad_observer();
}

function add_pre_next(responseText, reg) {
    let ret;

    let a = document.createElement("a");
    a.innerText = '<';
    a.href = location.href.substring(0, g_pos) + (g_num - 1);
    document.body.appendChild(a);

    if ((ret = reg.exec(responseText)) !== null) {
        a = document.createElement("a");
        a.innerText = ret[1];
        document.body.appendChild(a);
    }

    a = document.createElement("a");
    a.innerText = '>';
    a.href = location.href.substring(0, g_pos) + (g_num + 1);
    document.body.appendChild(a);
}

function add_m3u8_page(addr) {
    // https://v88avnetwork.github.io/88av.html?m3u8/https://al1.fwlay.com/20231208/KlewcWeF/2000kb/hls/index.m3u8
    let video = document.createElement('video');
    video.id = addr;
    video.onclick = play_m3u8;
    video.style = 'cursor:pointer;max-width:100%;max-height:100%';
    document.body.appendChild(video);
}

function callback_88_page(responseText, param, finalUrl) {
    let reg;
    let ret;
    let txt = [];
    let img = [];
    let url = [];

    if (finalUrl)
    {
        get_domain1_callback(null, [ 0, new Date().toLocaleDateString() ], finalUrl);
        return;
    }

    add_pre_next(responseText, /data-total-page=\"([0-9]+)\"/);

    for (let i = 0, reg = /<img alt="([^"]+)"[\s\S]+?\/\/([^\/]+)\/videos\/([^\/]+)\//g; (ret = reg.exec(responseText)) !== null; i++) {
        txt[i] = ret[1];
        img[i] = 'https://' + ret[2] + '/videos/' + ret[3] + '/cover/5_505_259.webp';
        url[i] = 'https://7.bbdata.cc/videos/' + ret[3] + '/g.m3u8?h=f750032c47747d8';
    }

    console.log('url count:' + url.length);
    console.log('txt count:' + txt.length);
    console.log('img count:' + img.length);

    add_video(txt, img, url, '');

    add_pre_next(responseText, /data-total-page=\"([0-9]+)\"/);
}

function callback_th_page(responseText, param, finalUrl) {
    let reg;
    let ret;
    let txt = [];
    let img = [];
    let url = [];

    if (finalUrl)
    {
        get_domain1_callback(null, [ 1, new Date().toLocaleDateString() ], finalUrl);
        return;
    }

    add_pre_next(responseText, /"last_page_p">([0-9\/]+)/);

    for (let i = 0, reg = /data-sl="https?:\/\/[^\/]+\/([^\/]+)\/([^"]+)".*?data-src="([^"]+)".*?"rank-title">([^<]+)</g; (ret = reg.exec(responseText)) !== null; i++) {
        url[i] = ((parseInt(ret[1]) >= 20231108) ? 'https://al1.fwlay.com/' : 'https://yp1.fwlay.com/') + ret[1] + '/' + ret[2];
        img[i] = ret[3];
        txt[i] = ret[4];
    }

    console.log('url count:' + url.length);
    console.log('txt count:' + txt.length);
    console.log('img count:' + img.length);

    add_video(txt, img, url, '-xor');

    add_pre_next(responseText, /"last_page_p">([0-9\/]+)/);
}

function get_addr_pos_num()
{
    let ret;

    if ((ret = /\?([^\/]+)\/(.*)/.exec(location.href)) !== null) {
        g_addr[0] = ret[1];
        g_addr[1] = ret[2];
        console.log('addr:' + g_addr);
    }

    if ((ret = /([0-9]+)$/.exec(location.href)) !== null) {
        g_pos = ret.index;
        g_num = parseInt(ret[1]);
        console.log('pos:' + g_pos + ' num:' + g_num);
    }
}

function main() {
    get_addr_pos_num();
    get_last_domain(0, get_domain0);
    get_last_domain(1, get_domain1);
    delete_head_body();
    add_link();

    switch (g_addr[0])
    {
        case 'm3u8':
        {
            add_m3u8_page(g_addr[1]);
            break;
        }
        case '88':
        {
            get_data(g_domain[0] + g_addr[1], callback_88_page, g_num);
            break;
        }
        case 'th':
        {
            get_data(g_domain[1] + g_addr[1], callback_th_page, g_num);
            break;
        }
        default:
        {
            console.log(g_addr);
            break;
        }
    }
}

main();

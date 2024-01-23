// ==UserScript==
// @name         demo
// @description  demo
// @version      0.1
// @match        https://v88avnetwork.github.io/88av.html*
// @require      https://cdn.jsdelivr.net/npm/hls.js
// @require      https://cdn.jsdelivr.net/npm/lozad/dist/lozad.min.js
// @connect      88a2290.cc
// @connect      tai99.net
// @connect      t90639.com
// @connect      t90560.xyz
// @connect      t90957.xyz
// @connect      mm231.vip
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

    g_hls = new Hls({ id : this.id });
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
      headers: {
          'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
      },
      timeout: 5000,
      ontimeout(xhr) {
          console.log('timeout: ' + url);
      },
      onload(xhr) {
          if (200 != xhr.status) {
              let div = document.createElement("div");
              div.innerText = 'get_data: ' + url + ' status:' + xhr.status;
              document.body.appendChild(div);
              return;
          }

          callback(xhr.responseText, param, (xhr.finalUrl != url) ? xhr.finalUrl : null);
      }
    });
    console.log(url);
}

function get_domain0(id, now) {
    g_domain[id] = document.getElementsByTagName('a')[3].href;
    GM_setValue('date' + id, now);
    GM_setValue('domain' + id, g_domain[id]);
    console.log('set g_domain[' + id + ']: ' + g_domain[id]);
}

function get_domain1(id, now) {
    get_data('http://tai99.net/', get_domain1_callback, [ id, now ])
}

function get_domain1_callback(responseText, param, finalUrl) {
    let id = param[0];
    let now = param[1];

    if (finalUrl) {
        let pos = finalUrl.lastIndexOf('?');
        g_domain[id] = (pos < 0) ? finalUrl : finalUrl.substring(0, pos);
    } else {
        let reg = /href="([^"]+)"/g;
        let addr = reg.exec(responseText);
        g_domain[id] = addr[1];

        get_data(addr[1], get_domain1_callback, param)
    }

    GM_setValue('date' + id, now);
    GM_setValue('domain' + id, g_domain[id]);
    console.log('set g_domain[' + id + ']: ' + g_domain[id]);
}

function get_domain2(id, now) {
    g_domain[id] = 'https://mm231.vip/';
    GM_setValue('date' + id, now);
    GM_setValue('domain' + id, g_domain[id]);
    console.log('set g_domain[' + id + ']: ' + g_domain[id]);
}

function get_last_domain(id, get_domain) {
    let now = new Date().toLocaleDateString();
    let date = GM_getValue('date' + id, '');

    if (date == now) {
        g_domain[id] = GM_getValue('domain' + id, '');
        console.log('g_domain[' + id + ']: ' + g_domain[id]);
    } else {
        get_domain(id, now);
    }
}

function get_addr_pos_num() {
    let ret;

    if ((ret = /\?([^\/]+)\/(.*?)([0-9]*)$/.exec(location.href)) !== null) {
        g_addr[0] = ret[1];
        g_addr[1] = ret[2] + ret[3];
        g_pos = ret.index + ret[1].length + ret[2].length + 2;
        g_num = parseInt(ret[3]);
        console.log('addr:' + g_addr + ' pos:' + g_pos + ' num:' + g_num);
    }
}

function new_link(name, addr) {
    let a = document.createElement('a');
    a.style='margin-left:10';
    a.href= document.location.origin + document.location.pathname + addr;
    a.innerText = name;
    document.body.appendChild(a);
}

function add_th_link(name, id) {
    let title = '';

    for (var j = 0, code = name.match(/&#(\d+);/g); j < code.length; j++) {
        title += String.fromCharCode(code[j].replace(/[&#;]/g, ''));
    }

    new_link(title, '?th/category/?category_id=' + id + '&page=1');
}

function add_mm_link(name) {
    let title = '';

    for (var j = 0, code = name.match(/&#(\d+);/g); j < code.length; j++) {
        title += String.fromCharCode(code[j].replace(/[&#;]/g, ''));
    }

    new_link(title, '?mm/tags/' + title + '/1');
}

function add_link() {
    document.body = document.createElement('body');

    new_link('m3u8', '?m3u8/');

    document.body.appendChild(document.createElement('br'));

    new_link('/', '?88/');
    new_link('S', '?88/search/ca/1');
    new_link('9', '?88/categories/91/1');
    new_link('L', '?88/video/latest/1');
    new_link('J', '?88/jav/1');
    new_link('E', '?88/oumei/1');

    document.body.appendChild(document.createElement('br'));

    new_link('/', '?th/');
    new_link('S', '?th/index/search/?keyword=ol&page=1');
    add_th_link('&#21507;&#29916;', 101);
    add_th_link('&#22269;&#20135;', 1);
    add_th_link('&#26085;&#38889;', 4);
    add_th_link('&#27431;&#32654;', 25);
    add_th_link('&#21160;&#28459;', 145);
    add_th_link('&#20081;&#20262;', 69);
    add_th_link('&#33258;&#25293;', 56);
    add_th_link('&#35843;&#25945;', 71);
    add_th_link('&#33821;&#33673;', 70);
    add_th_link('&#25442;&#33080;', 108);
    add_th_link('&#20027;&#25773;', 40);
    add_th_link('&#32654;&#20083;', 67);
    add_th_link('&#21475;&#29190;', 68);
    add_th_link('&#35299;&#35828;', 105);
    add_th_link('&#67;&#79;&#83;', 72);

    document.body.appendChild(document.createElement('br'));

    new_link('/', '?mm/');
    add_mm_link('&#22269;&#20135;');
    add_mm_link('&#20013;&#25991;&#23383;&#24149;');
    add_mm_link('&#39640;&#28165;&#26080;&#30721;');
    add_mm_link('&#26368;&#26032;&#40657;&#26009;');
    add_mm_link('&#33258;&#25293;&#35270;&#39057;');
    add_mm_link('&#31934;&#21697;&#20998;&#20139;');
    add_mm_link('&#22825;&#32654;&#20256;&#23186;');
    add_mm_link('&#21046;&#26381;&#35825;&#24785;');
    add_mm_link('&#24378;&#22904;&#36855;&#22904;');
    add_mm_link('&#32463;&#20856;&#19977;&#32423;');
    add_mm_link('&#24320;&#25918;&#38738;&#24180;');
    add_mm_link('&#23478;&#24237;&#20081;&#20262;');
    add_mm_link('&#26497;&#21697;&#22899;&#31070;');
    add_mm_link('&#22269;&#20135;&#31934;&#36873;');
    add_mm_link('&#35843;&#25945;&#34384;&#24453;');
    add_mm_link('&#21475;&#20132;&#28145;&#21897;');
    add_mm_link('&#24773;&#36259;&#19997;&#34972;');
    add_mm_link('&#33258;&#25293;&#20599;&#25293;');
    add_mm_link('&#21160;&#28459;&#21345;&#36890;');
    add_mm_link('&#39640;&#28165;&#26080;&#30721;');
    add_mm_link('&#29087;&#22899;&#20154;&#22971;');
    add_mm_link('&#32654;&#39068;&#24040;&#20083;');
    add_mm_link('&#19997;&#34972;&#21046;&#26381;');
    add_mm_link('&#20013;&#25991;&#26377;&#30721;');
    add_mm_link('&#27431;&#32654;&#31995;&#21015;');
    add_mm_link('&#00083;&#00077;&#31995;&#21015;');
    add_mm_link('&#00065;&#00073;&#25442;&#33080;');

    document.body.appendChild(document.createElement('br'));
}

function delete_head_body() {
    document.body = document.createElement('body');
    var head = document.querySelector('head');
    head.parentNode.removeChild(head);
}

function lozad_observer() {
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

function add_pre_next(responseText, reg, pre=location.href.substring(0, g_pos) + (g_num - 1), next=location.href.substring(0, g_pos) + (g_num + 1)) {
    let ret;

    let a = document.createElement("a");
    a.innerText = '<';
    a.href = pre;
    document.body.appendChild(a);

    if ((ret = reg.exec(responseText)) !== null) {
        a = document.createElement("a");
        a.innerText = ret[1];
        document.body.appendChild(a);
    }

    a = document.createElement("a");
    a.innerText = '>';
    a.href = next;
    document.body.appendChild(a);
}

function add_m3u8_page(addr) {
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

    add_pre_next(responseText, /"last_page":([0-9]+)/);

    for (let i = 0, reg = /data-sl="https?:\/\/[^\/]+\/([^\/]+)\/([^"]+)".*?data-src="([^"]+)".*?"rank-title">([^<]+)</g; (ret = reg.exec(responseText)) !== null; i++) {
        url[i] = ((parseInt(ret[1]) >= 20231108) ? 'https://al1.zabveq.com/' : 'https://yp1.zabveq.com/') + ret[1] + '/' + ret[2];
        img[i] = ret[3];
        txt[i] = ret[4];
    }

    console.log('url count:' + url.length);
    console.log('txt count:' + txt.length);
    console.log('img count:' + img.length);

    add_video(txt, img, url, '-xor');

    add_pre_next(responseText, /"last_page":([0-9]+)/);
}

function callback_mm_page(responseText, param, finalUrl) {
    let reg;
    let ret;
    let txt = [];
    let img = [];
    let url = [];

    add_pre_next(responseText, />(\d+)<\/a>\s+<[^>]+>&#19979;&#19968;&#39029;/);

    for (let i = 0, reg = /data-original="(https:\/\/[^\/]+\/+(\w+)\/(\w+)\/(\w+)\/([0-9a-z]+))\/cover\/cover_encry\.pip[\s\S]*?<h3>([^<]+)</g; (ret = reg.exec(responseText)) !== null; i++) {
        img[i] = ret[1] + '/cover/cover_encry.pip';
        url[i] = 'https://zl-365play.as8k.live:8090//' + ret[2] + '/' + ret[3] + '/' + ret[4] + '/' + ret[5] + '/m3u8/maomi365.m3u8';

        for (var j = 0, code = ret[6].match(/&#(\d+);/g); j < code.length; j++) {
          txt[i] += String.fromCharCode(code[j].replace(/[&#;]/g, ''));
        }
    }

    console.log('url count:' + url.length);
    console.log('txt count:' + txt.length);
    console.log('img count:' + img.length);

    add_video(txt, img, url, '-sub');

    add_pre_next(responseText, />(\d+)<\/a>\s+<[^>]+>&#19979;&#19968;&#39029;/);
}

function main() {
    //GM_deleteValue('date0');
    //GM_deleteValue('date1');
    //GM_deleteValue('date2');
    get_addr_pos_num();
    get_last_domain(0, get_domain0);
    get_last_domain(1, get_domain1);
    get_last_domain(2, get_domain2);
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
        case 'mm':
        {
            get_data(g_domain[2] + g_addr[1] + '.html', callback_mm_page, g_num);
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

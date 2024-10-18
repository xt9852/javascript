// ==UserScript==
// @name         a
// @description  a
// @version      0
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @match        https://hm.baidu.com/hm.js?m3
// @require      https://cdn.jsdelivr.net/npm/hls.js
// @require      https://cdn.jsdelivr.net/npm/lozad/dist/lozad.min.js
// @require      https://cdn.jsdelivr.net/npm/fernet/fernetBrowser.min.js
// @require      https://cdn.jsdelivr.net/npm/crypto-js/crypto-js.min.js
// @connect      --av--
// @connect      88av88av4187.xyz
// @connect      88av4274.xyz
// @connect      --dd--
// @connect      trafficmanager.net
// @connect      cucloud.cn
// @connect      bcebos.com
// @connect      416978.com
// @connect      kaitingmart.com
// @connect      --gg--
// @connect      ggsp4.cc
// @connect      kbuu72.cc
// @connect      a16.houduana1.cc
// @connect      --hl--
// @connect      300507.com
// @connect      cgua4.tv
// @connect      373450.com
// @connect      283647.com
// @connect      bssydt.com
// @connect      584095.com
// @connect      --ht--
// @connect      github.com
// @connect      kht75.vip
// @connect      htsyzz5.vip
// @connect      ht485op.vip
// @connect      ht489op.vip
// @connect      --xj--
// @connect      134.122.173.8
// @connect      dxj5588.com
// @connect      7wzx9.com
// ==/UserScript==

var g_hls = null;
var g_video = null;
var g_i = '';
var g_url = '';
var g_post = '';
var g_page_id = 0;
var g_page_cnt = 0;
var g_web = [
{
    id : 'av',
    data : {},
    addr : {
        beg : 'https://88av88av4187.xyz',
        fun : [ (url, html, arg, xhr)=>{ g_web[0].data.addr = /6<\/h2>[\s\S]+?href="(.+?)" target="_blank">http/.exec(html)[1];
                                         return g_web[0].data.addr + '/watch/65f401843720aeb8214b7a7f'
                                       },
                (url, html, arg, xhr)=>{ g_web[0].data.vod = /\["cncdn", ".+?", "(.+?)"\]/.exec(html)[1];
                                         return g_web[0].data.addr;
                                       }
              ]
    },
    menu : {
        fnd : '{ADDR}/search/{INPUT}/{PAGE}',
        url : '{ADDR}/{1}/{PAGE}',
        beg : '{ADDR}',
        dec : (html)=>{ return html
                      },
        fun :  [ /"?nav-item"?><a\s+href="?\/([^">]+)"?>([^<\s]+)/g
               ]
    },
    page : {
        dec : (html)=>{ return html
                      },
        cnt : (html)=>{ return /data-total-page="(\d+)"/.exec(html)[1];
                      },
        reg : /<img alt="(.+?)"[\s\S]+?(https:\/\/.+?\/videos(\/.+?\/)cover\/5_505_259)/g ,
        fun : (ret)=>{ return [ret[1], ret[2] + '.webp', 'https://' + g_web[0].data.vod + '/videos' + ret[3] + 'g.m3u8?h=3121efe8979c635'];
                     },
        lzd : []
    }
},
{
    id : 'dd',
    data : {},
    addr : {
        beg : 'https://fbkp.trafficmanager.net:9527/index.html',
        fun : [ (url, html, arg, xhr)=>{ return /href="(.+?)"/.exec(html)[1]
                                       },
                (url, html, arg, xhr)=>{ let m = atob(/"url": "(.+?)"/.exec(html)[1]); return m;
                                       },
                (url, html, arg, xhr)=>{ let e = /decode\("(.+?)"\)/.exec(html)[1];
                                         return decodeURIComponent(escape(atob(e))).split("|")[0];
                                       },
                (url, html, arg, xhr)=>{ g_web[1].data.enc = /window.CONFIG = "(.+?)";/.exec(html)[1];
                                         return 'https://' + /defer="defer" src="(.+?)"/.exec(html)[1];
                                       },
                (url, html, arg, xhr)=>{ g_web[1].data.key = /a="([^"]{40,})"/.exec(html)[1];
                                         let j = JSON.parse(fer(g_web[1].data.enc, g_web[1].data.key));
                                         g_web[1].data.img = 'https://' + j.video_img_url;
                                         g_web[1].data.vod = 'https://' + j.video_play_url_list[0].url[0];
                                         delete g_web[1].data.enc;
                                         return 'https://' + j.api_url;
                                       }
              ]
    },
    menu : {
        fnd : '{ADDR}/search/?page={PAGE}&per_page=30&search={INPUT}',
        url : '{ADDR}/api/vod/video?page={PAGE}&per_page=30&tag={1}',
        beg : '{ADDR}/api/vod/tag_group?page=1&per_page=1000&site_id=6&channel_id=523',
        dec : (html)=>{ let d = fer(JSON.parse(html)['x-data'], g_web[1].data.key); return d;
                      },
        fun : [ (html)=>{ let m = [{title : 'find', url : g_web[1].menu.fnd}];
                          let d = JSON.parse(html);
                          for (let i of [14, 18, 25]) {
                              for (let j = 0; j < d.data.items[i].tag.length;j++) {
                                  if (d.data.items[i].tag[j].target == '' && d.data.items[i].tag[j].name.length > 2) {
                                      m.push({title : d.data.items[i].tag[j].name, url : '{ADDR}/api/vod/video?page={PAGE}&per_page=30&tag=' + d.data.items[i].tag[j].id});
                                  }
                              }
                          }
                          return m;
                        }
               ]
    },
    page : {
        dec : (html)=>{ return fer(JSON.parse(html)['x-data'], g_web[1].data.key);
                      },
        cnt : (html)=>{ return Math.ceil(/"total":(\d+)/.exec(html)[1] / 30);
                      },
        reg : /"id":(\d+),"name":"([^"]+)","product/g,
        fun : (ret)=>{ return [ret[2], ret[1], ret[1]];
                     },
        lzd : [ (e)=>{ get(g_web[1].data.addr + '/api/vod/video/' + e.id, g_web[1].page.lzd[1], {'xml':true, e:e, img:g_web[1].data.img, vod:g_web[1].data.img});
                     },
                (url, html, arg, xhr)=>{ let j = fer(JSON.parse(html)['x-data'], g_web[1].data.key);
                                         arg.e.id = arg.vod + /"play_url":"(.+?)"/.exec(j)[1];
                                         get(arg.img + /"pic":"(.+?)"/.exec(j)[1], g_web[1].page.lzd[2], arg);
                                       },
                (url, html, arg, xhr)=>{ let e = html.split("@@@");
                                         arg.e.poster = fer(e[0], g_web[1].data.key) + e[1];
                                       }
        ]
    }
},
{
    id : 'gg',
    data : {},
    addr : {
        beg : 'http://ggsp4.cc',
        fun : [ (url, html, arg, xhr)=>{ return 'http://ggsp4.cc' + /href="\.(.+?)" class="enter-button"/.exec(html)[1];
                                       },
                (url, html, arg, xhr)=>{ g_web[2].data.addr = /urlMap = \[\s*"(https:\/\/.+?)\//.exec(html)[1];
                                         return g_web[2].data.addr + '/js/base.js';
                                       },
                (url, html, arg, xhr)=>{ g_web[2].data.api = /domain = "(https:\/\/.+?)\//.exec(html)[1];
                                         g_web[2].data.key = CryptoJS.enc.Utf8.parse(/my = "(.+?)"/.exec(html)[1]);
                                         return g_web[2].data.api;
                                       },
                (url, html, arg, xhr)=>{ return g_web[2].data.addr;
                                       }
              ]
    },
    menu : {
        fnd : '{API}/api.php/index/getShiPinList?currentPage={PAGE}&wd={INPUT}',
        url : '{API}/api.php/index/getShiPinList?currentPage={PAGE}&id={1}',
        beg : '{ADDR}/js/api.js',
        dec : (html)=>{ return html
                      },
        fun : [ /"id": ((?!1)\d+),\s+"name": "(.+?)",/g
              ]
     },
    page : {
        dec : (html)=>{ let txt = html.split('"').join('').split('\\').join('');
                        return aes(txt, g_web[2].data.key); },
        cnt : (html)=>{ return Math.ceil(/"count":(\d+)/.exec(html)[1] / 30);
                      },
        reg : /"vod_id":(\d+),"vod_pic":"(.+?)","vod_blurb":"(.+?)"/g,
        fun : (ret)=>{ return [str(ret[3], true), ret[2].split('\\').join(''), ret[1]];
                     },
        lzd : [ (e)=>{ get(g_web[2].data.api + '/api.php/index/getDetail?id=' + e.id, g_web[2].page.lzd[1], {'xml':true, e:e});
                     },
                (url, html, arg, xhr)=>{ let t = g_web[2].page.dec(html);
                                         arg.e.id = /"vod_play_url":"(.+?)"/.exec(t)[1].split('\\').join('');
                                       }
              ]
    }
},
{
    id : 'hl',
    data : {},
    addr : {
        beg : 'https://300507.com/api/media-site/h5/externalLink/get/home/url',//https://373450.com/config.js',//
        fun : [ (url, html, arg, xhr)=>{ return /"data":"(.+?)"/.exec(html)[1];
                                       },
                (url, html, arg, xhr)=>{ return xhr.finalUrl + /script src="(.+?)"/.exec(html)[1];
                                       },
                (url, html, arg, xhr)=>{ return /jumpUrl: '(.+?)'/.exec(html)[1];
                                       },
                (url, html, arg, xhr)=>{ g_web[3].data.vod = /2",2,"(.+?)"/.exec(html)[1];
                                         let a = /href="https:\/\/\w+\.(.+?)\//.exec(html)[1];
                                         g_web[3].data.add = 'https://jsonxz.' + a;
                                         return /crossorigin href="(.+?)"/.exec(html)[1];
                                       },
                (url, html, arg, xhr)=>{ let k = /defaultSecretKey:"(.+?)"/.exec(html)[1];
                                         g_web[3].data.key = CryptoJS.enc.Utf8.parse(k);
                                         return g_web[3].data.add;
                                       }
              ]
    },
    menu : {
        fnd : 'https://search.584095.com/search?text={INPUT}',
        url : '{ADDR}/pages/1/8/water/{1}/{PAGE}.json',
        beg : '{ADDR}/pages/1/8/home/home.json',
        dec : (html)=>{ let d = JSON.parse(html);
                        let j = JSON.parse(aes(d.json_data, g_web[3].data.key));
                        return JSON.stringify(j.tabs[2].channelList);
                      },
        fun : [ (html)=>{ let ret, reg = /"id":"(\d+)","name":"(.+?)"/g, m = [{title : 'find', url : g_web[3].menu.fnd, page_cnt:1}];
                          while (ret = reg.exec(html)) {
                              get('https://jsonxz.bssydt.com/pages/1/8/water/' + ret[1] + '/index.json', g_web[3].menu.fun[1], {xml:true, sync:true, id:ret[1]});
                              m.push({title:str(decodeURIComponent(ret[2])), url:g_web[3].menu.url.replace('{1}', ret[1]), page_cnt:g_web[3].data[ret[1]]});
                          }
                          return m;
                        },
                (url, html, arg, xhr)=>{ g_web[3].data[arg.id] = /(\d+),$/.exec(html)[1];
                                       }
              ],
    },
    page : {
        dec : (html, find)=>{ if (find) {
                                  let o = '', ret, reg = /"id":"(\d+)","title":"(.+?)","mainImgUrl":"(.+?)"/g;
                                  while (ret = reg.exec(html)) {
                                      o += '"id":"' + ret[1] + '","mainImgUrl":"' + ret[3] + '","title":"' + ret[2] + '"\n';
                                  }
                                  return o;
                              } else {
                                  return aes(JSON.parse(html).json_data, g_web[3].data.key);
                              }
                            },
        cnt : (html)=>{},
        reg : /"id":"(\d+)","mainImgUrl":"(.+?)".+?"title":"(.+?)"/g,
        fun : (ret)=>{ return [ret[3], g_web[3].data.vod + '/' + ret[2], ret[1] ];
                     },
        lzd : [ (e)=>{ get(g_web[3].data.addr + '/pages/detail/' + e.id + '.json', g_web[3].page.lzd[1], e);
                     },
                (url, html, arg, xhr)=>{ let j = JSON.parse(html);
                                         j = JSON.parse(aes(j.json_data, g_web[3].data.key));
                                         arg.id = g_web[3].data.vod + '/' + j.videoUrlList[0].videoUrl;
                                       }
               ]
  }
},
{
    id : 'ht',
    data : {},
    addr : {
        beg : 'https://github.com/htapp/htapp',
        fun : [ (url, html, arg, xhr)=>{ return 'https://' + /https:\/\/<\/p>\s+<p dir="auto">([^<]+)/.exec(html)[1];
                                       },
                (url, html, arg, xhr)=>{ return /targetSites = \[\s+'(.+?)'/.exec(html)[1] + '/ht/index.html';
                                       },
                (url, html, arg, xhr)=>{ return /targetUrls = \[\s+"(.+?)"/.exec(html)[1];
                                       }
              ]
    },
    menu : {
        fnd : '{ADDR}/search/{INPUT}/{PAGE}',
        url : '{ADDR}/{1}---{PAGE}',
        beg : '{ADDR}',
        dec : (html)=>{ return html
                      },
        fun : [ /(type\/(?!game)(?!chigua)(?!nvyou).+?)" vclass="menu-link">(.+?)</g
              ]
    },
    page : {
        dec : (html)=>{ return html;
                      },
        cnt : (html)=>{ return /, (\d+), event/.exec(html)[1];
                      },
        reg : /data-original="(https:\/\/.+?\/upload\/vod\/\d+-\d+\/[0-9a-f]+_xfile.jpg)".+?(\/video\/m3u8\/\d+\/\d+\/[0-9a-f]+\/).+?"v-title">(.+?)</g,
        fun : (ret)=>{ return [str(decodeURIComponent(ret[3])), decodeURIComponent(ret[1]), 'https://ts.xnmbhi.cn' + decodeURIComponent(ret[2]) + 'index.m3u8'];
                     },
        lzd : [ (e)=>{ get(e.poster, g_web[4].page.lzd[1], {'xml':true, bin:true, e:e});
                     },
                (url, html, arg, xhr)=>{ let bin = [], data = new Uint8Array(html);
                                         for (let i = 0; i < data.byteLength; i++) bin += String.fromCharCode(data[i] ^ 0x88);
                                         arg.e.poster = 'data:image/jpeg;base64,' + window.btoa(bin);
                                       }
              ]
    }
},
{
    id : 'xj',
    data : {},
    addr : {
        beg : 'https://dxj5588.com/js/base41.js', //https://134.122.173.8:8083/dxjgg/abs.js
        fun : [ (url, html, arg, xhr)=>{ return /"(https:\/\/.+?)\/forward"/.exec(html)[1];
                                       }
        ]
    },
    menu : {
        beg : '{ADDR}/getDataInit',
        pst : '{"name":"John","age":31,"city":"New York"}',
        dec : (html)=>{ let j = JSON.parse(html);
                        g_web[5].data.group = j.data.macVodLinkMap;
                        return j;
                      },
        fun : [ (html)=>{ let m = [{title:'find',
                                    url:'{ADDR}/forward',
                                    post:'{"command":"WEB_GET_INFO","pageNumber":{PAGE},"RecordsPage":20,"typeId":0,"typeMid":1,"type":1,"languageType":"CN","content":"{INPUT}"}'}];
                          for (let i = 0; i < 3; i++) {
                             for (let j in html.data.menu0ListMap[i].menu2List) {
                                 let l = html.data.menu0ListMap[i].menu2List[j];
                                 m.push({title:l.typeName2,
                                         url:'{ADDR}/forward',
                                         post:'{"command":"WEB_GET_INFO","pageNumber":{PAGE},"RecordsPage":20,"typeId":'+l.typeId2+',"typeMid":1,"languageType":"CN","content":""}'});
                             }
                          }
                          return m;
                        }
               ]
    },
    page : {
        dec : (html)=>{ return html;
                      },
        cnt : (html)=>{ return /"pageAllNumber":(\d+)/.exec(html)[1];
                      },
        reg : /(\/video\/m3u8\/\d+\/\d+\/[0-9a-f]+\/).+?vod_name":"(.+?)".+?vod_server_id":(\d+)/g,
        fun : (ret)=>{ let data = g_web[5].data.group[ret[3]];
                       return [ret[2], data.PIC_LINK_1 + ret[1] + '1.jpg', data.LINK_1 + ret[1] + 'playlist.m3u8'];
                     },
        lzd : []
    }
}
];

function main() {
    //GM_deleteValue('av');
    //GM_deleteValue('dd');
    //GM_deleteValue('gg');
    //GM_deleteValue('hl');
    //GM_deleteValue('ht');
    //GM_deleteValue('xj');

    for (let i of GM_listValues()) console.log(i, GM_getValue(i));

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

    select('m3', 'm3', [{title : 'play', url : '{INPUT}', data : ''}]);

    addr(0);
}

function aes(i, k) {
    let d = CryptoJS.AES.decrypt(i, k, { iv : k, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return CryptoJS.enc.Utf8.stringify(d);
}

function fer(i, k) {
    let key = new fernet.Secret(k);
    let token = new fernet.Token({secret: key, token: i, ttl: 0});
    return token.decode();
}

function lzd() {
    const observer = lozad('.lozad',{ load : (element)=>{
        let web = g_web[element.getAttribute('lzd')];
        if (web == null) return;
        web.page.lzd[0](element);
     }});

    observer.observe();
}

function str(i, u) {
    let pos = 0;
    let out = '';
    let reg = (u == true) ? /\\u([0-9a-f]{4})/g : /&#(x)?([0-9a-fA-F]+);/g;

    for (let ret; ret = reg.exec(i); ) {
        if (ret.index > pos) {
            out += i.substring(pos, ret.index);
            pos = ret.index;
        }

        out += (u == true) ? String.fromCodePoint(parseInt(ret[1], 16)) : String.fromCharCode((ret[1] == 'x') ? parseInt(ret[2], 16) : ret[2]);
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
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, arg.sync ? false : true);
        if (arg.bin) xhr.responseType = 'arraybuffer';
        xhr.onload = ()=>{ cb_load(url, xhr.response, arg, xhr); }
        xhr.onerror = ()=>{ cb_timeout ? cb_timeout(url, xhr, arg) : console.log('error:' + url, xhr); }
        xhr.ontimeout = ()=>{ cb_timeout ? cb_timeout(url, xhr, arg) : console.log('timeout:' + url, xhr); }
        xhr.send();
    } else {
        let param = {
            url : url,
            method : arg.data ? 'POST' : 'GET',
            timeout : 5000,
            headers : { 'User-Agent' : 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
                        'Content-type' : 'application/json' },
            data : arg.data,
            onload(xhr) { if (xhr.status != 404) cb_load(url, xhr.responseText, arg, xhr); else console.log(url, xhr); },
            onerror(xhr) { cb_timeout ? cb_timeout(url, xhr, arg) : console.log('error:' + url, xhr); },
            ontimeout(xhr) { cb_timeout ? cb_timeout(url, xhr, arg) : console.log('timeout:' + url, xhr); },
        };

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

function video(data, i) {
    let web = g_web[i];

    let div;
    let video;
    let content = document.getElementById('content');

    while (content.firstChild) { content.removeChild(content.firstChild); }

    for (let j = 0; j < data.length; j += 3) {
        div = document.createElement("div");
        div.innerText = data[j];
        content.appendChild(div);

        video = document.createElement('video');
        video.id = data[j + 2];
        video.onclick = on_play;
        video.style = 'cursor:pointer;max-height:500px';
        video.setAttribute('class', 'lozad');
        video.setAttribute('poster', data[j + 1]);
        if (web.page.lzd.length > 0) video.setAttribute('lzd', i);
        content.appendChild(video);
    }

    lzd();

    window.scrollTo(0, 0);
}

function select(i, id, data) {
    let select = document.getElementById('menu');

    let optgroup = document.createElement('optgroup');
    optgroup.label = id;
    optgroup.id = select.options.length;
    optgroup.setAttribute('i', i);

    select.appendChild(optgroup);

    for (let i = 0, option; i < data.length; i++) {
        option = document.createElement('option');
        option.innerText = data[i].title;
        if (data[i].url) option.setAttribute('url', data[i].url);
        if (data[i].post) option.setAttribute('post', data[i].post);
        if (data[i].page_cnt) option.setAttribute('page_cnt', data[i].page_cnt);
        optgroup.appendChild(option);
    }
}

function cb_addr_timeout(url, xhr, arg) {
    let i = arg.i;
    let step = arg.step;
    let timeout = ++arg.timeout;

    console.log(g_web[i].id, step, timeout, url, xhr.error ? xhr.error : 'timeout');

    if (/Refused to connect to ".+?"/.exec(xhr.error)) return;

    if (timeout >= 3) { return; }

    get(url, cb_addr, arg, cb_addr_timeout);
}

function cb_menu_timeout(url, xhr, arg) {
    let i = arg.i;
    let timeout = ++arg.timeout;
    let web = g_web[i];
    let id = web.id;
    let addr = web.addr;

    console.log(id, timeout, url, xhr.error ? xhr.error : 'timeout');

    if (/Refused to connect to ".+?"/.exec(xhr.error)) return;

    if (timeout >= 3) {
        arg.step = 0;
        arg.timeout = 0;
        get(addr.beg, cb_addr, arg, cb_addr_timeout);
        console.log(id, 'get', addr.beg);
        return;
    }

    get(url, cb_addr, arg, cb_addr_timeout);
}

function cb_addr(url, html, arg, xhr) {
    let i = arg.i;
    let step = arg.step;
    let web = g_web[i];
    let menu = web.menu;
    let addr = web.addr;
    let data = web.data;
    let fun = addr.fun;

    let tmp = fun[step](url, html, arg, xhr);

    console.log(web.id, step, url + '\t', tmp);

    if (step < (fun.length - 1)) {
        arg.step++;
        arg.timeout = 0;
        get(tmp, cb_addr, arg, cb_addr_timeout);
        return;
    }

    if (menu.pst) {
        arg.data = menu.pst;
    }

    data.addr = tmp;

    get(rep(menu.beg, data), cb_menu, arg, cb_menu_timeout);
}

function cb_menu(url, html, arg, xhr) {
    let i = arg.i;
    let step = arg.step;
    let now = new Date().toLocaleDateString();
    let web = g_web[i];
    let id = web.id;
    let page = web.page;
    let menu = web.menu;
    let data = web.data;
    let beg = menu.beg;
    let dec = menu.dec;
    let fun = menu.fun;
    let fnd = menu.fnd;
    let item = [];
    let ret;

    if ((ret = /"refresh"[\s\S]+(https?:\/\/[^"\/]+)/.exec(html)) || (ret = /targetSites = \[\s+'([^']+)/.exec(html))) {
        data.addr = ret[1];
        get(beg.replace('{ADDR}', ret[1]), cb_addr, arg, cb_addr_timeout);
        console.log(url, 'cb_menu refresh', ret);
        return;
    }

    html = dec(html);

    if (typeof(fun[0]) == 'function') {
        item.push(...fun[0](html));
    } else {
        item.push({title:'find', url:fnd});
        while (ret = fun[0].exec(html)) { item.push({title:str(decodeURIComponent(ret[2])), url:menu.url.replace('{1}', str(ret[1]))}); }
    }

    if (item.length <= 1) {
        console.log(id, 'menu number error', url, html);
        return;
    }

    select(i, id, item);

    GM_setValue(id, {date : now, menu : item, data : data});

    console.log(id, 'set', GM_getValue(id));

    if (i < g_web.length - 1) addr(i + 1);
}

function addr(i) {
    let web = g_web[i];
    let id = web.id
    let menu = web.menu;
    let old = GM_getValue(id);
    let now = new Date().toLocaleDateString();
    let arg = {i : i, step : 0, timeout : 0};

    if (old && old.date == now) {
        web.data = old.data;
        select(i, id, old.menu);
        if (i < g_web.length - 1) addr(i + 1);
        return;
    }

    if (menu.pst) arg.data = menu.pst;

    get(web.addr.beg, cb_addr, arg, cb_addr_timeout);
}

function cb_page(url, html, arg) {
    let i = arg.i;
    let find = arg.find;
    let web = g_web[i];
    let id = web.id;
    let page = web.page;
    let dec = page.dec;
    let reg = page.reg;
    let cnt = page.cnt;
    let fun = page.fun;
    let data = [];
    let ret;

    g_page_id = arg.page_id;

    html = dec(html, find);

    if (g_page_id == 0) {
        g_page_cnt = arg.page_cnt ? Number(arg.page_cnt) : cnt(html);
    }

    for (let ret; ret = reg.exec(html);) {
        data.push(...fun(ret));
    }

    if (data.length == 0) {
        console.log(id, 'page fun error', html);
    }

    video(data, i);

    document.getElementById('page_num').innerText = g_page_id + '/' + g_page_cnt;
}

function page(i, url, post, page_id, page_cnt, find) {
    let web = g_web[i];
    let addr = web.addr;
    let page = web.page;
    let menu = web.menu;
    let data = web.data;
    let param = {i : i, page_id : page_id, page_cnt : page_cnt, find : find};

    url = rep(url, data);
    url = url.replace('{PAGE}', page_id + 1);
    if (post) post = post.replace('{PAGE}', page_id + 1);

    console.log('url:', url);

    if (post) {
        param.post = true;
        param.data = post;
        console.log('post:', post);
    }

    get(url, cb_page, param);
}

function on_change(keydown) {
    let menu = document.getElementById('menu');
    let input = document.getElementById('input');
    let option = menu.options[menu.selectedIndex];
    let title = option.innerText;
    let parent = option.parentNode;
    let find_id = parent.id;
    let find_options = menu.options[find_id];
    let page_id = 0;
    let find = false;

    g_i = parent.getAttribute('i');
    g_post = '';

    if (g_i == 'm3') {
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
            option = find_options;
            find = true;
        }

        g_post = option.getAttribute('post');
        g_url = option.getAttribute('url').replace('{INPUT}', input.value);
        if (g_post) g_post = g_post.replace('{INPUT}', input.value);
    }

    page(g_i, g_url, g_post, page_id, option.getAttribute('page_cnt'), find);
}

function on_pre() {
    page(g_i, g_url, g_post, ((g_page_id == 0) ? g_page_cnt : g_page_id) - 1, g_page_cnt);
}

function on_next() {
    page(g_i, g_url, g_post, (g_page_id == g_page_cnt - 1) ? 0 : (g_page_id + 1), g_page_cnt);
}

function on_keydown(evt) {
    evt = (evt) ? evt : window.event;
    if (evt.keyCode == 37) on_pre();
    if (evt.keyCode == 39) on_next();
}

main();

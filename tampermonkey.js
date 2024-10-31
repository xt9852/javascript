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
// @connect      88av4261.xyz
// @connect      --dd--
// @connect      trafficmanager.net
// @connect      cucloud.cn
// @connect      bcebos.com
// @connect      411840.com
// @connect      kaitingmart.com
// @connect      xuezhumall.com
// @connect      --gg--
// @connect      ggsp4.cc
// @connect      kbuu142.cc
// @connect      a30.houduana1.cc
// @connect      --hd--
// @connect      cw101.org
// @connect      --hl--
// @connect      300507.com
// @connect      hei4.tv
// @connect      786022.com
// @connect      fkrdl.com
// @connect      567790.com
// @connect      nbqygl.com
// @connect      584095.com
// @connect      --ht--
// @connect      github.com
// @connect      kht76.vip
// @connect      htsyzz5.vip
// @connect      ht519op.vip
// @connect      --xj--
// @connect      134.122.173.8
// @connect      dxj5588.com
// @connect      7wzx9.com
// ==/UserScript==

var g_hls = null;
var g_video = null;
var g_id = '';
var g_url = '';
var g_post = '';
var g_page_id = 0;
var g_page_cnt = 0;
var g_key = ['av', 'dd', 'gg', 'hd', 'hl', 'xj', 'ht' ];
var g_web = {
    av : {
        data : {},
        addr : {
            beg : 'https://88av88av4187.xyz',
            fun : [ (url, html, arg, xhr)=>{ g_web.av.data.addr = /7<\/h2>[\s\S]+?href="(.+?)"/.exec(html)[1];
                                             return g_web.av.data.addr;
                                           },
                    (url, html, arg, xhr)=>{ return g_web.av.data.addr + /href=(\/watch\/.+?) /.exec(html)[1];
                                           },
                    (url, html, arg, xhr)=>{ g_web.av.data.vod = /\["cncdn", ".+?", "(.+?)"\]/.exec(html)[1];
                                             return g_web.av.data.addr;
                                           }
                  ]
        },
        menu : {
            fnd : '{ADDR}/search/{INPUT}/{PAGE}',
            url : '{ADDR}/{1}/{PAGE}',
            beg : '{ADDR}',
            dec : (html, ar)=>{ return html
                              },
            fun :  [ /"?nav-item"?><a\s+href="?\/([^">]+)"?>([^<\s]+)/g
                   ]
        },
        page : {
            dec : (html, arg)=>{ return html;
                               },
            cnt : (html, arg)=>{ let ret = /data-total-page="(\d+)"/.exec(html); return ret ? ret[1] : 0;
                               },
            reg : /<img alt="(.+?)"[\s\S]+?(https:\/\/.+?\/videos(\/.+?\/)cover\/5_505_259)/g ,
            fun : (ret)=>{ return [ret[1], ret[2] + '.webp', 'https://' + g_web.av.data.vod + '/videos' + ret[3] + 'g.m3u8?h=3121efe8979c635'];
                         },
            lzd : []
        }
    },
    dd : {
        data : {},
        addr : {
            beg : 'https://fbkp.trafficmanager.net:9527/index.html',
            fun : [ /*(url, html, arg, xhr)=>{ return /href="(.+?)"/.exec(html)[1];
                                           },*/
                    (url, html, arg, xhr)=>{ return atob(/"url": "(.+?)"/.exec(html)[1]) + '1234';
                                           },
                    (url, html, arg, xhr)=>{ let a = /decode\("(.+?)"\)/.exec(html)[1];
                                             return decodeURIComponent(escape(atob(a))).split("|")[0];
                                           },
                    (url, html, arg, xhr)=>{ g_web.dd.data.enc = /window.CONFIG = "(.+?)";/.exec(html)[1];
                                             return 'https://' + /defer="defer" src="(.+?)"/.exec(html)[1];
                                           },
                    (url, html, arg, xhr)=>{ g_web.dd.data.key = /a="([^"]{40,})"/.exec(html)[1];
                                             let j = JSON.parse(fer(g_web.dd.data.enc, g_web.dd.data.key));
                                             g_web.dd.data.img = 'https://' + j.video_img_url;
                                             g_web.dd.data.vod = 'https://' + j.video_play_url_list[0].url[0];
                                             delete g_web.dd.data.enc;
                                             return 'https://' + j.api_url;
                                           }
                  ]
        },
        menu : {
            fnd : '{ADDR}/search/?page={PAGE}&per_page=30&search={INPUT}',
            url : '{ADDR}/api/vod/video?page={PAGE}&per_page=30&tag={1}',
            beg : '{ADDR}/api/vod/tag_group?page=1&per_page=1000&site_id=6&channel_id=523',
            dec : (html, arg)=>{ let d = fer(JSON.parse(html)['x-data'], g_web.dd.data.key); return d;
                               },
            fun : [ (html, arg)=>{ let m = [{title : 'find', url : g_web.dd.menu.fnd}];
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
            dec : (html, arg)=>{ return fer(JSON.parse(html)['x-data'], g_web.dd.data.key);
                               },
            cnt : (html, arg)=>{ let ret = /"total":(\d+)/.exec(html); return ret ? Math.ceil(ret[1] / 30) : 0;
                               },
            reg : /"id":(\d+),"name":"([^"]+)","product/g,
            fun : (ret)=>{ return [ret[2], ret[1], ret[1]];
                         },
            lzd : [ (e)=>{ get(g_web.dd.data.addr + '/api/vod/video/' + e.id, g_web.dd.page.lzd[1], {'xml':true, e:e, img:g_web.dd.data.img, vod:g_web.dd.data.img});
                         },
                    (url, html, arg, xhr)=>{ let j = fer(JSON.parse(html)['x-data'], g_web.dd.data.key);
                                             arg.e.id = arg.vod + /"play_url":"(.+?)"/.exec(j)[1];
                                             get(arg.img + /"pic":"(.+?)"/.exec(j)[1], g_web.dd.page.lzd[2], arg);
                                           },
                    (url, html, arg, xhr)=>{ let e = html.split("@@@");
                                             arg.e.poster = fer(e[0], g_web.dd.data.key) + e[1];
                                           }
            ]
        }
    },
    gg : {
        data : {},
        addr : {
            beg : 'http://ggsp4.cc',
            fun : [ (url, html, arg, xhr)=>{ return 'http://ggsp4.cc' + /href="\.(.+?)" class="enter-button"/.exec(html)[1];
                                           },
                    (url, html, arg, xhr)=>{ g_web.gg.data.addr = /urlMap = \[\s*"(https:\/\/.+?)\//.exec(html)[1];
                                             return g_web.gg.data.addr + '/js/base.js';
                                           },
                    (url, html, arg, xhr)=>{ g_web.gg.data.api = /domain = "(https:\/\/.+?)\//.exec(html)[1];
                                             g_web.gg.data.key = /my = "(.+?)"/.exec(html)[1];
                                             return g_web.gg.data.api;
                                           },
                    (url, html, arg, xhr)=>{ return g_web.gg.data.addr;
                                           }
                  ]
        },
        menu : {
            fnd : '{API}/api.php/index/getShiPinList?currentPage={PAGE}&wd={INPUT}',
            url : '{API}/api.php/index/getShiPinList?currentPage={PAGE}&id={1}',
            beg : '{ADDR}/js/api.js',
            dec : (html, arg)=>{ return html
                               },
            fun : [ /"id": ((?!1)\d+),\s+"name": "(.+?)",/g
                  ]
         },
        page : {
            dec : (html, arg)=>{ let txt = html.split('"').join('').split('\\').join('');
                                 return aes(txt, g_web.gg.data.key);
                               },
            cnt : (html, arg)=>{ let ret = /"count":(\d+)/.exec(html); return ret ? Math.ceil(ret[1] / 30) : 0;
                               },
            reg : /"vod_id":(\d+),"vod_pic":"(.+?)","vod_blurb":"(.+?)"/g,
            fun : (ret)=>{ return [str(ret[3], true), ret[2].split('\\').join(''), ret[1]];
                         },
            lzd : [ (e)=>{ get(g_web.gg.data.api + '/api.php/index/getDetail?id=' + e.id, g_web.gg.page.lzd[1], {'xml':true, e:e});
                         },
                    (url, html, arg, xhr)=>{ let t = g_web.gg.page.dec(html);
                                             arg.e.id = /"vod_play_url":"(.+?)"/.exec(t)[1].split('\\').join('');
                                           }
                  ]
        }
    },
    hd : {
        data : {},
        addr : {
            beg : 'https://cn688.cw101.org/?&time=1',//url@avhd101.email
            fun : [ (url, html, arg, xhr)=>{ return 'https://cn688.cw101.org';
                                           }
            ]
        },
        menu : {
            fnd : '{ADDR}/search?q={INPUT}&p={PAGE}',
            url : '{ADDR}/{1}?page={PAGE}',
            beg : '{ADDR}/?&time=1',
            dec : (html, arg)=>{ return atob(/ec='(.+?)'/.exec(html)[1]);
                               },
            fun : [ (html, arg)=>{ let url, title, reg = /itemprop="url" href="\/(?!category)([^"]+)">([^<>]+)</g;
                                   let cnt = [0, 3108, 1746, 210], page;
                                   let value = GM_getValue('hd');
                                   let m = [{title : 'find', url : g_web.hd.menu.fnd, page:true}];
                                   for (let i = 1, ret; ret = reg.exec(html); i++) {
                                       title = utf(ret[2]);
                                       page = (value && value.data[title]) ? (value.data[title] + 1) : cnt[i];
                                       m.push({title:title, url:g_web.hd.menu.url.replace('{1}', ret[1]), page:true});
                                       if (i == 4) {
                                           g_web.hd.data[title] = 5;
                                           break;
                                       }
                                       url = g_web.hd.menu.url.replace('{ADDR}', g_web.hd.data.addr);
                                       url = url.replace('{1}', ret[1]);
                                       url = url.replace('{PAGE}', page);
                                       get(url, g_web.hd.menu.fun[1], {title:title, page:page});
                                   }
                                   g_web.hd.data.find = 1;
                                   return m;
                                 },
                     (url, html, arg, xhr)=>{ html = utf(atob(/ec='(.+?)'/.exec(html)[1]));
                                              console.log(url, arg);
                                              if (/R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==/.exec(html)) {
                                                  arg.page++;
                                                  get(url.replace(/\d+$/, arg.page), g_web.hd.menu.fun[1], arg);
                                              } else {
                                                  let value = GM_getValue('hd');
                                                  value.data[arg.title] = arg.page - 1;
                                                  g_web.hd.data[arg.title] = arg.page - 1;
                                                  GM_setValue('hd', value);
                                                  console.log(GM_getValue('hd'));
                                              }
                                            }
                   ]
        },
        page : {
            dec : (html, arg)=>{ return utf(atob(/ec='(.+?)'/.exec(html)[1]));
                               },
            cnt : (html, arg)=>{ if (arg.find) {
                                     let ret = /class="pagenum">[^(]+\([^\d]+(\d+)/.exec(html);
                                     return ret ? Math.ceil(ret[1] / 60) : 0
                                 } else {
                                     return arg.page_cnt;
                                 }
                               },
            reg : /(https:\/\/[^/]+\/[^/]+\/images\/[^'"]+)[\s\S]+?<a href="\/watch\?v=(.+?)" itemprop="url">(\s+<span itemprop="name">)?([^<]+)</g,
            fun : (ret)=>{ return [ret[4], ret[1], ret[2]];
                         },
            lzd : [ (e)=>{ e.id = g_web.hd.data.addr + '/pv/' + e.id + '.m3u8?px=' +
                                  btoa(e.id.substring(2, 6) + 'prefix=/' + e.id + '/preview&server=tc&id=' + e.id +
                                       '&ip=240e:343:1c6d:f000:448e:854:f938:e05e&expire=' + (Math.round(Date.now() / 1000) + 600));
                           get(e.poster, g_web.hd.page.lzd[1], {'xml':true, e:e});
                         },
                    (url, html, arg, xhr)=>{ arg.e.poster = 'data:image/jpeg;base64,' + html.substring(6, html.length - 2);
                                           }
                  ]
        }
    },
    hl : {
        data : {},
        addr : {
            beg : 'https://300507.com/api/media-site/h5/externalLink/get/home/url?domain=https://300507.com',
            fun : [ (url, html, arg, xhr)=>{ return 'https://hei4.tv';
                                           },
                    (url, html, arg, xhr)=>{ g_web.hl.data.jmp = /https:\/\/(.+)/.exec(xhr.finalUrl)[1]; return xhr.finalUrl + /script src="(.+?)"/.exec(html)[1];
                                           },
                    (url, html, arg, xhr)=>{ g_web.hl.data.addr = /, "(.+?)",/.exec(html)[1]; return g_web.hl.data.addr + '/pages/nav/' + g_web.hl.data.jmp + 'result.json';
                                           },
                    (url, html, arg, xhr)=>{ html = aes(/"json_data":"(.+?)"/.exec(html)[1], 'zH3JDuCRXVGa3na7xbOqpx1bw6DAkbTP');
                                             return /"jumpDomain":"(.+?)"/.exec(html)[1];
                                           },
                    (url, html, arg, xhr)=>{ return /crossorigin href="(.+?)"/.exec(html)[1];
                                           },
                    (url, html, arg, xhr)=>{ g_web.hl.data.key = /defaultSecretKey:"(.+?)"/.exec(html)[1];
                                             return url.replace(/\/[^\/]+$/, /path:"\/search",meta:p_\|\|\{\},component:\(\)=>de\(\(\)=>import\("\.(.+?)"\)/.exec(html)[1]);
                                           },
                    (url, html, arg, xhr)=>{ g_web.hl.data.search = /k="(.+?)";\(window.location.hostname==="localhost"/.exec(html)[1];
                                             return g_web.hl.data.addr;
                                           }
                  ]
        },
        menu : {
            fnd : '{SEARCH}/search?text={INPUT}',
            url : '{ADDR}/pages/1/8/water/{1}/{PAGE}.json',
            beg : '{ADDR}/pages/1/8/home/home.json',
            dec : (html, arg)=>{ let d = JSON.parse(html);
                                 let j = JSON.parse(aes(d.json_data, g_web.hl.data.key));
                                 return JSON.stringify(j.tabs[2].channelList);
                               },
            fun : [ (html, arg)=>{ let title, reg = /"id":"(\d+)","name":"(.+?)"/g;
                                   let m = [{title : 'find', url : g_web.hl.menu.fnd.replace('{SEARCH}', g_web.hl.data.search), page:true}];
                                   for (let ret; ret = reg.exec(html);) {
                                       title = str(decodeURIComponent(ret[2]));
                                       get(g_web.hl.data.addr + '/pages/1/8/water/' + ret[1] + '/index.json', g_web.hl.menu.fun[1], {title:title});
                                       m.push({title:title, url:g_web.hl.menu.url.replace('{1}', ret[1]), page:true});
                                   }
                                   g_web.hl.data.find = 1;
                                   return m;
                                 },
                    (url, html, arg, xhr)=>{ let page = /(\d+),$/.exec(html)[1];
                                             let value = GM_getValue('hl');
                                             value.data[arg.title] = page;
                                             g_web.hl.data[arg.title] = page;
                                             GM_setValue('hl', value);
                                             console.log(GM_getValue('hl'));
                                           }
                  ],
        },
        page : {
            dec : (html, arg)=>{ if (arg.find) {
                                      let o = '', ret, reg = /"id":"(\d+)","title":"(.+?)","mainImgUrl":"(.+?)"/g;
                                      while (ret = reg.exec(html)) { o += '"id":"' + ret[1] + '","mainImgUrl":"' + ret[3] + '","title":"' + ret[2] + '"\n'; }
                                      return o;
                                  } else {
                                      return aes(JSON.parse(html).json_data, g_web.hl.data.key);
                                  }
                                },
            cnt : (html, arg)=>{ return arg.page_cnt;
                               },
            reg : /"id":"(\d+)","mainImgUrl":"(.+?)".+?"title":"(.+?)"/g,
            fun : (ret)=>{ return [ret[3], g_web.hl.data.addr + '/' + ret[2], ret[1] ];
                         },
            lzd : [ (e)=>{ get(g_web.hl.data.addr + '/pages/detail/' + e.id + '.json', g_web.hl.page.lzd[1], e);
                         },
                    (url, html, arg, xhr)=>{ let j = JSON.parse(html);
                                             j = JSON.parse(aes(j.json_data, g_web.hl.data.key));
                                             arg.id = g_web.hl.data.addr + '/' + j.videoUrlList[0].videoUrl.replace('700kb', '1200kb');
                                           }
                   ]
      }
    },
    ht : {
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
            dec : (html, arg)=>{ return str(html);
                               },
            fun : [ /(type\/(?!game)(?!chigua)(?!nvyou).+?)" vclass="menu-link">(.+?)</g
                  ]
        },
        page : {
            dec : (html, arg)=>{ return str(html);
                               },
            cnt : (html, arg)=>{ let ret = /(\d+), event/.exec(html); return ret ? ret[1] : 0;
                               },
            reg : /data-original="(https:\/\/.+?\/upload\/vod\/\d+-\d+\/[0-9a-f]+_xfile.jpg)".+?(\/video\/m3u8\/\d+\/\d+\/[0-9a-f]+\/).+?"v-title">(.+?)</g,
            fun : (ret)=>{ return [ret[3], ret[1], 'https://ts.xnmbhi.cn' + ret[2] + 'index.m3u8'];
                         },
            lzd : [ (e)=>{ get(e.poster, g_web.ht.page.lzd[1], {'xml':true, bin:true, e:e});
                         },
                    (url, html, arg, xhr)=>{ let bin = [], data = new Uint8Array(html);
                                             for (let i = 0; i < data.byteLength; i++) bin += String.fromCharCode(data[i] ^ 0x88);
                                             arg.e.poster = 'data:image/jpeg;base64,' + btoa(bin);
                                           }
                  ]
        }
    },
    xj : {
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
            dec : (html, arg)=>{ let j = JSON.parse(html);
                                 g_web.xj.data.group = j.data.macVodLinkMap;
                                 return j;
                               },
            fun : [ (html, arg)=>{ let m = [{title:'find',
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
            dec : (html, arg)=>{ return html;
                               },
            cnt : (html, arg)=>{ let ret = /"pageAllNumber":(\d+)/.exec(html); return ret ? ret[1] : 0;
                               },
            reg : /(\/video\/m3u8\/\d+\/\d+\/[0-9a-f]+\/).+?vod_name":"(.+?)".+?vod_server_id":(\d+)/g,
            fun : (ret)=>{ let data = g_web.xj.data.group[ret[3]];
                           return [ret[2], data.PIC_LINK_1 + ret[1] + '1.jpg', data.LINK_1 + ret[1] + 'playlist.m3u8'];
                         },
            lzd : []
        }
    }
};

function main() {
    //GM_deleteValue('av');
    //GM_deleteValue('dd');
    //GM_deleteValue('gg');
    //GM_deleteValue('hd');
    //GM_deleteValue('hl');
    //GM_deleteValue('ht');
    //GM_deleteValue('xj');

    function set(i) {
        console.log(i);
        let v = GM_getValue(i);
        console.log('old', v);
        v.date = '2024/10/23';
        GM_setValue(i, v);
        v = GM_getValue(i);
        console.log('new', v);
    }

    //set('av');
    //set('dd');
    //set('gg');
    //set('hd');
    //set('hl');
    //set('ht');
    //set('xj');

    for (let i of GM_listValues()) console.table(i, GM_getValue(i));

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

    addr(0);
}

function aes(e, k) {
    let i = CryptoJS.enc.Utf8.parse(k);
    let d = CryptoJS.AES.decrypt(e, i, { iv : i, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return CryptoJS.enc.Utf8.stringify(d);
}

function fer(e, k) {
    let key = new fernet.Secret(k);
    let token = new fernet.Token({secret: key, token: e, ttl: 0});
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

function utf(t) {
    let a = new Uint8Array(t.length);
    for (let i = 0; i < t.length; i++) { a[i] = t.charCodeAt(i); }
    let utf_dec = new TextDecoder('utf-8');
    return utf_dec.decode(a);
}

function str(t, u) {
    let pos = 0;
    let out = '';
    let reg = u ? /\\u([0-9a-f]{4})/g : /&#(x)?([0-9a-fA-F]+);/g;

    for (let ret; ret = reg.exec(t); ) {
        if (ret.index > pos) {
            out += t.substring(pos, ret.index);
            pos = ret.index;
        }

        out += u ? String.fromCodePoint(parseInt(ret[1], 16)) : String.fromCharCode((ret[1] == 'x') ? parseInt(ret[2], 16) : ret[2]);
        pos += ret[0].length;
    }

    if (pos < t.length) {
        out += t.substring(pos, t.length);
    }

    return out;
}

function rep(t, map) {
    for (let key in map) { t = t.replace('{' + key.toUpperCase() + '}', map[key]); }
    return t;
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

function video(id, data) {
    let web = g_web[id];

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
        if (web && web.page.lzd.length > 0) video.setAttribute('lzd', id);
        content.appendChild(video);
    }

    lzd();

    window.scrollTo(0, 0);
}

function select(id, data) {
    let select = document.getElementById('menu');

    let group = document.createElement('optgroup');
    group.label = id;
    group.id = select.options.length;

    select.appendChild(group);

    for (let i = 0, option; i < data.length; i++) {
        option = document.createElement('option');
        option.innerText = data[i].title;
        if (data[i].url) option.setAttribute('url', data[i].url);
        if (data[i].post) option.setAttribute('post', data[i].post);
        if (data[i].page) option.setAttribute('page', data[i].page);
        group.appendChild(option);
    }
}

function cb_timeout(url, xhr, arg) {
    let id = arg.id;
    let step = arg.step;
    let timeout = ++arg.timeout;
    let web = g_web[id];
    let addr = web.addr;

    console.log(id, step, timeout, url, xhr.error ? xhr.error : xhr);

    if (/Refused to connect to ".+?"/.exec(xhr.error)) return;

    if (timeout >= 3) {
        if (arg.menu) {
            arg.step = 0;
            arg.timeout = 0;
            delete arg.menu;
            get(addr.beg, cb_addr, arg, cb_timeout);
            console.log(id, 'get', addr.beg);
        }
        return;
    }

    get(url, cb_addr, arg, cb_timeout);
}

function cb_addr(url, html, arg, xhr) {
    let id = arg.id;
    let step = arg.step;
    let web = g_web[id];
    let menu = web.menu;
    let addr = web.addr;
    let data = web.data;
    let fun = addr.fun;

    let tmp = fun[step](url, html, arg, xhr);

    console.log(id, step, url, tmp);

    if (step < (fun.length - 1)) {
        arg.step++;
        arg.timeout = 0;
        get(tmp, cb_addr, arg, cb_timeout);
        return;
    }

    if (menu.pst) {
        arg.data = menu.pst;
    }

    arg.menu = true;
    data.addr = tmp;

    get(rep(menu.beg, data), cb_menu, arg, cb_timeout);
}

function cb_menu(url, html, arg, xhr) {
    let i = arg.i;
    let id = arg.id;
    let step = arg.step;
    let web = g_web[id];
    let page = web.page;
    let menu = web.menu;
    let data = web.data;
    let beg = menu.beg;
    let dec = menu.dec;
    let fun = menu.fun;
    let fnd = menu.fnd;
    let date = new Date().toLocaleDateString();
    let item = [];
    let ret;

    html = dec(html, arg);

    if (typeof(fun[0]) == 'function') {
        item.push(...fun[0](html, arg));
    } else {
        item.push({title:'find', url:fnd});
        while (ret = fun[0].exec(html)) {
            item.push({title:ret[2], url:rep(menu.url, ret)});
        }
    }

    if (item.length <= 1) {
        console.log(id, 'menu number error', url, html);
        return;
    }

    select(id, item);

    GM_setValue(id, {date : date, menu : item, data : data});

    console.log(id, 'set', GM_getValue(id));

    if (i < g_key.length - 1) addr(i + 1);
}

function addr(i) {
    let id = g_key[i]
    let web = g_web[id];
    let menu = web.menu;
    let date = new Date().toLocaleDateString();
    let data = GM_getValue(id);
    let beg = web.addr.beg;
    let arg = {i : i, id : id, step : 0, timeout : 0};

    if (data && data.date == date) {
        web.data = data.data;
        select(id, data.menu);
        if (i < g_key.length - 1) addr(i + 1);
        return;
    }

    if (menu.pst) arg.data = menu.pst;

    get(beg, cb_addr, arg, cb_timeout);
}

function cb_page(url, html, arg, xhr) {
    let id = arg.id;
    let web = g_web[id];
    let page = web.page;
    let dec = page.dec;
    let reg = page.reg;
    let cnt = page.cnt;
    let fun = page.fun;
    let data = [];
    let ret;

    html = dec(html, arg);

    g_page_id = arg.page_id;

    if (g_page_id == 0) {
        g_page_cnt = cnt(html, arg);
    }

    for (let ret; ret = reg.exec(html);) {
        data.push(...fun(ret));
    }

    if (data.length == 0) {
        console.log(id, 'page fun error', html);
    }

    video(id, data);

    document.getElementById('page_num').innerText = g_page_id + '/' + g_page_cnt;
}

function page(id, url, post, page_id, page_cnt, find) {
    let web = g_web[id];
    let addr = web.addr;
    let page = web.page;
    let menu = web.menu;
    let data = web.data;
    let arg = {id : id, page_id : page_id, page_cnt : page_cnt, find : find};

    url = rep(url, data);
    url = url.replace('{PAGE}', page_id + 1);
    if (post) post = post.replace('{PAGE}', page_id + 1);

    console.log('url:', url);

    if (post) {
        arg.post = true;
        arg.data = post;
        console.log('post:', post);
    }

    get(url, cb_page, arg);
}

function on_change(keydown) {
    let menu = document.getElementById('menu');
    let input = document.getElementById('input');
    let option = menu.options[menu.selectedIndex];
    let title = option.innerText;
    let group = option.parentNode;
    let find_id = group.id;
    let find_option = menu.options[find_id];
    let page_id = 0;
    let find = false;

    g_id = group.label;
    g_post = '';

    if (g_id == 'm3') {
        g_page_id = 0;
        g_page_cnt = 0;
        video(g_id, [input.value, '', input.value], '');
        input.value = '';
        return;
    }

    if (keydown && /^\d+$/.exec(input.value)) {
        page_id = Number(input.value);
    } else {
        if (keydown || title == 'find') {
            menu.selectedIndex = find_id;
            option = find_option;
            title = 'find';
            find = true;
        }

        g_post = option.getAttribute('post');
        g_url = option.getAttribute('url').replace('{INPUT}', input.value);
        if (g_post) g_post = g_post.replace('{INPUT}', input.value);
    }

    page(g_id, g_url, g_post, page_id, (option.getAttribute('page') == 'true') ? g_web[g_id].data[title] : 0, find);
}

function on_pre() {
    page(g_id, g_url, g_post, ((g_page_id == 0) ? g_page_cnt : g_page_id) - 1, g_page_cnt);
}

function on_next() {
    page(g_id, g_url, g_post, (g_page_id == g_page_cnt - 1) ? 0 : (g_page_id + 1), g_page_cnt);
}

function on_keydown(evt) {
    evt = (evt) ? evt : window.event;
    if (evt.keyCode == 33) on_pre();
    if (evt.keyCode == 34) on_next();
}

main();

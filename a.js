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
// @connect      88av4689.cc
// @connect      --bb--
// @connect      1jubt.vip
// @connect      jubt5.one
// @connect      wu5mz.com
// @connect      jghpiz2ux8.shop
// @connect      bhd5z7.com
// @connect      gafrikdu.wiki
// @connect      c24192b5.top
// @connect      05hao.top
// @connect      gayzyhh.com
// @connect      vv.xunboe.cn
// @connect      --dd--
// @connect      trafficmanager.net
// @connect      413640.xyz
// @connect      xuezhumall.com
// @connect      --hl--
// @connect      300507.com
// @connect      jslswlkj.com
// @connect      6hei.tv
// @connect      340286.lol
// @connect      bysshxd.com
// @connect      xaycanu.com
// @connect      860189.com
// @connect      bzbyzk.com
// @connect      483898.lol
// @connect      --hs--
// @connect      xhsdc70.vip
// @connect      --ht--
// @connect      github.com
// @connect      kht81.vip
// @connect      htsyzz14.vip
// @connect      htkt82.vip
// @connect      htkt78.vip
// @connect      cvcwj.cn
// @connect      --jj--
// @connect      jtv8868.pro
// @connect      js020sp.pro
// @connect      js02dp4.pro
// @connect      xiaohongshu.com
// @connect      --jk--
// @connect      jksp543.top
// @connect      ggghou9.top
// @connect      --os--
// @connect      aosikazy.com
// @connect      --th--
// @connect      avtaohua-0122.com
// @connect      avtaohua-f0154.cc
// @connect      avtaohua-l1002.vip
// @connect      sinw.net
// @connect      --xj--
// @connect      xj999.tv
// @connect      sm83ed.com
// @connect      dxj5577.com
// @connect      7wzx9.com
// @connect      --xx--
// @connect      31xx11347s.cc
// @connect      31xx11633s.cc
// @connect      --yk--
// @connect      yyk88.com
// @connect      qajcqkhwsj7.xyz
// @connect      bcebos.com
// @connect      --zd--
// @connect      ip.sb
// @connect      in101.org
// @connect      cw101.app
// @connect      --zp--
// @connect      tk029.click
// @connect      a163.app
// @connect      heraax.com
// @connect      hexingtapes.cn
// @connect      --zq--
// @connect      94itv.app
// @connect      iqqtv.tv
// @connect      --zx--
// @connect      aplhz.com
// @connect      xuxe3.com
// @connect      fi11dd5.com
// @connect      hasls.com
// @connect      deyigx.com
// @connect      cfk1314.com
// ==/UserScript==

(function() {
'use strict';

var g_hls = null;
var g_video = null;
var g_task = [];
var g_data = {
    id : '',
    url : '',
    page_id : 0,
    page_min : 0
}
var g_web = {
    av : {
        data : {},
        addr : {
            url : 'https://88av88av4187.xyz/', // dz.88av@mailauto.org
            beg : (data)=>{
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    g_web.av.data.addr = /2<\/h2>[\s\S]+?href="(.+?)"/.exec(html)[1];
                    return g_web.av.data.addr;
                },
                (url, html, arg, xhr)=>{
                    return g_web.av.data.addr + /href=(\/watch\/.+?) /.exec(html)[1];
                },
                (url, html, arg, xhr)=>{
                    g_web.av.data.vod = 'https://' + /\["cncdn", ".+?", "(.+?)"\]/.exec(html)[1];
                    return g_web.av.data.addr;
                }
            ]
        },
        menu : {
            url : [
                '{ADDR}',
                '{ADDR}/search/{INPUT}/{PAGE}',
                '{ADDR}/{1}/{PAGE}'
            ],
            beg : (data)=>{
                data.url = g_web.av.menu.url[0];
                data.menu = true;
                return data;
            },
            fun :  [
                (url, html, arg, xhr)=>{
                    let menu = [{ name : 'find', url : rep(g_web.av.menu.url[1], g_web.av.data) }];
                    for (let ret, reg = /"?nav-item"?><a\s+href="?\/([^">]+)"?>([^<\s]+)/g; ret = reg.exec(html);) {
                        menu.push({ name : ret[2], url : rep(rep(g_web.av.menu.url[2], g_web.av.data), ret) });
                    }
                    return menu;
                }
            ]
        },
        page : {
            beg : (data)=>{
                g_web.av.data.page = data.page_id;
                g_web.av.data.input = data.input;
                return data;
            },
            dec : (html, arg)=>{
                return html;
            },
            cnt : (html, arg)=>{
                if (arg.title == 'find') {
                    if (/"ui red message"/.exec(html)) {
                        arg.page_id = 0;
                        return 0;
                    }
                    return 1;
                } else {
                    return /data-total-page="(\d+)"/.exec(html)[1];
                }
            },
            fun : (html, arg)=>{
                let vod = [];
                for (let ret, reg = /<img alt="(.+?)"[\s\S]+?(https:\/\/.+?\/videos(\/.+?\/)cover\/5_505_259)/g; ret = reg.exec(html);) {
                    vod.push({ name : ret[1], img : ret[2] + '.webp', src : g_web.av.data.vod + '/videos' + ret[3] + 'g.m3u8?h=3121efe8979c635' });
                }
                return vod;
            },
            lzd : []
        }
    },
    bb : {
        data : {},
        addr : {
            url : 'https://1jubt.vip',
            beg : (data)=>{
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    return 'https://' + />([^<]+)<\/a><\/td>/.exec(html)[1] + '/cn/index.html';
                },
                (url, html, arg, xhr)=>{
                    return 'https://' + />555[^a-zA-Z]+(.+?)</.exec(html)[1];
                },
                (url, html, arg, xhr)=>{
                    let data = atob(/data-info="(.+?)"/.exec(html)[1]);
                    let addr = JSON.parse(data);
                    return 'https://' + addr.site_1 + '/index/home.html';
                },
                (url, html, arg, xhr)=>{
                    return /"(https:\/\/.+?\/\?utm_source=WZ-555.+?)"/.exec(html)[1];
                },
                (url, html, arg, xhr)=>{
                    let key = /const key = "(.+?)";/.exec(html)[1];
                    let encrypted = /encryptedContent =\s+"(.+?)"/.exec(html)[1];
                    let decoded = atob(encrypted);
                    let result = '';
                    for (let i = 0; i < decoded.length; i++) {
                        result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
                    }
                    g_web.bb.data.addr = 'https://' + /\["(.+?)"/.exec(result)[1];
                    return g_web.bb.data.addr;
                },
                (url, html, arg, xhr)=>{
                    return g_web.bb.data.addr + /src="(\/template\/beabox-maccms-template\/js\/global\.js\?ver=\d+)/.exec(html)[1];
                },
                (url, html, arg, xhr)=>{
                    let code = atob(/\('(.+?)'\)/.exec(html)[1]);
                    g_web.bb.data.search = /Beabox\.Global\.api_base_url="(.+?)"/.exec(code)[1];
                    return g_web.bb.data.search;
                },
                (url, html, arg, xhr)=>{
                    return g_web.bb.data.addr;
                }
            ]
        },
        menu : {
            url : [
                '{ADDR}',
                '{SEARCH}/V1/search?q={INPUT}&t=1&tag_search=0&page={PAGE}&pageSize=24',
                '{ADDR}/vod/ajax_type.html?id={2}&page={PAGE}'
            ],
            beg : (data)=>{
                data.url = g_web.bb.menu.url[0];
                data.menu = true;
                return data;
            },
            fun :  [
                (url, html, arg, xhr)=>{
                    g_web.bb.task = [];
                    g_web.bb.data.task = true;
                    let page, cnt = { 40 : 16542, 41 : 6673, 42 : 6262, 43 : 480, 44 : 159, 63 : 333, 66 : 838, 68 :47, 70 : 119, 71 : 0 };
                    let menu = [{ name : 'find', url : rep(g_web.bb.menu.url[1], g_web.bb.data) }];
                    for (let ret, reg = /text-xl">([^<]+)<\/h2><a href="\/vodtype\/(\d+).html"/g; ret = reg.exec(html);) {
                        url = rep(rep(g_web.bb.menu.url[2], g_web.bb.data), ret);
                        menu.push({ name : ret[1], url : url });
                        page = (g_web.bb.data[ret[1]]) ? g_web.bb.data[ret[1]] : cnt[ret[2]];
                        if (page == undefined) { console.log(ret[1]); continue; }
                        arg = 'get("' + url.replace('{PAGE}', ++page) + '", g_web.bb.menu.fun[1], { id:' + ret[2] + ',name:"' + ret[1] + '",url:"' + url + '",page:' + page + ' });';
                        g_task.push(arg);
                        g_web.bb.task.push(arg);
                    }
                    return menu;
                },
                (url, html, arg, xhr)=>{
                    if (html) {
                        console.log('bb', arg.id, arg.name, arg.page + 1, 'try');
                        get(url.replace(/\d+$/, ++arg.page), g_web.bb.menu.fun[1], arg);
                    } else {
                        g_web.bb.data[arg.name] = --arg.page;
                        let value = GM_getValue('bb');
                        value.data.task = false;
                        value.data[arg.name] = arg.page;
                        GM_setValue('bb', value);
                        console.log('bb', arg.id, arg.name, arg.page);
                        task();
                    }
                }
            ]
        },
        page : {
            beg : (data)=>{
                g_web.bb.data.page = data.page_id;
                g_web.bb.data.input = data.input;
                return data;
            },
            dec : (html, arg)=>{
                return arg.title == 'find' ? JSON.parse(html) : html;
            },
            cnt : (html, arg)=>{
                if (arg.title == 'find') {
                    let ret = html.data.totalPages;
                    if (ret == 0) arg.page_id = 0;
                    return ret;
                } else {
                    return g_web.bb.data[arg.title];
                }
            },
            fun : (html, arg)=>{
                let vod = [];
                if (arg.title == 'find') {
                    for (let item of html.data.hits) {
                        vod.push({ name : item.vod_name, img : item.vod_pic, src : g_web.bb.data.addr + item.detail_url });
                    }
                } else {
                    for (let ret, reg = /"video-item" title="(.+?)".+?href="(.+?)".+?data-src="(.+?)"/g; ret = reg.exec(html);) {
                        vod.push({ name : ret[1], img : ret[3], src : g_web.bb.data.addr + ret[2] });
                    }
                }
                return vod;
            },
            lzd : [
                (dom)=>{
                    get(dom.id, g_web.bb.page.lzd[1], dom);
                },
                (url, html, arg, xhr)=>{
                    arg.id = /"url":"(.+?)"/.exec(html)[1].replace(/\\\//g, '/');
                    if (arg.id.substring(0, 5) != 'https') {
                        get(g_web.bb.data.search + '/player?data=' + g_web.bb.xorEncryptDecrypt(JSON.stringify(arg.id), 'bPcsZZ08x63mOU4Jz42Nj9nZJHi30Lr1'), g_web.bb.page.lzd[2], arg);
                    }
                },
                (url, html, arg, xhr)=>{
                    arg.id = g_web.bb.rc4EncryptDecrypt('bPcsZZ08x63mOU4Jz42Nj9nZJHi30Lr1', JSON.parse(html).data.result);
                }
            ]
        },
        xorEncryptDecrypt : (input, key)=>{
            let output = '';
            for (let i = 0; i < input.length; i++) {
                let charCode = input.charCodeAt(i) ^ key.charCodeAt(i % key.length);
                output += String.fromCharCode(charCode);
            }
            return window.btoa(output).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        },
        rc4EncryptDecrypt : (key, data)=>{
            const keyWordArray = CryptoJS.enc.Utf8.parse(key);
            const dataWordArray = CryptoJS.enc.Hex.parse(data);
            const decrypted = CryptoJS.RC4.decrypt({ciphertext: dataWordArray}, keyWordArray);
            return decrypted.toString(CryptoJS.enc.Utf8);
        }
    },
    dd : {
        data : {},
        addr : {
            url : 'https://zok01.trafficmanager.net:857/?nb=fb&bm=41&ml=kp', // 5151dh2020@gmail.com
            beg : (data)=>{
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    let t = decodeURIComponent(escape(atob(/decode\("(.+?)"\)/.exec(html)[1]))).split("|");
                    return t[0] + 'home?channel=fb-41';
                },
                (url, html, arg, xhr)=>{
                    g_web.dd.data.enc = /window.CONFIG = '(.+?)';/.exec(html)[1];
                    return 'https:' + /defer="defer" src="(\/\/[^/]+\/static\/js\/main\.[0-9a-z]+\.js)"/.exec(html)[1];
                },
                (url, html, arg, xhr)=>{
                    g_web.dd.data.key = /="([\w=]{40,})"/.exec(html)[1];
                    let j = JSON.parse(g_web.dd.fer(g_web.dd.data.enc, g_web.dd.data.key));
                    g_web.dd.data.img = 'https://' + j.video_img_url;
                    g_web.dd.data.vod = 'https://' + j.video_play_url_list[0].url[0];
                    delete g_web.dd.data.enc;
                    return 'https://' + j.api_url;
                }
            ]
        },
        menu : {
            url : [
                '{ADDR}/api/vod/tag_group?page=1&per_page=1000&site_id=6',
                '{ADDR}/search/vod/?page={PAGE}&per_page=30&search={INPUT}',
                '{ADDR}/api/vod/video?page={PAGE}&per_page=30&tag={1}'
            ],
            beg : (data)=>{
                data.url = g_web.dd.menu.url[0];
                data.menu = true;
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    html = g_web.dd.page.dec(html);
                    html = JSON.parse(html).data.items;
                    let menu = [{ name : 'find', url : rep(g_web.dd.menu.url[1], g_web.dd.data) }];
                    for (let i of [16, 17, 24, 34]) {
                        for (let j of html[i].tag) {
                            if (j.target == '' && j.id < 1000) {
                                menu.push({ name : html[i].name + '-' + j.name, url : g_web.dd.data.addr + '/api/vod/video?page={PAGE}&per_page=30&tag=' + j.id});
                            }
                        }
                    }
                    return menu;
                }
            ]
        },
        page : {
            beg : (data)=>{
                g_web.dd.data.page = data.page_id;
                g_web.dd.data.input = data.input;
                return data;
            },
            dec : (html, arg)=>{
                return g_web.dd.fer(JSON.parse(html)['x-data'], g_web.dd.data.key);
            },
            cnt : (html, arg)=>{
                let ret = /"total":(\d+)/.exec(html);
                ret = ret ? Math.ceil(ret[1] / 30) : 0;
                if (ret == 0) arg.page_id = 0;
                return ret;
            },
            fun : (html, arg)=>{
                html = JSON.parse(html).data.items;
                let vod = [];
                for (let i of html) {
                    vod.push({ name : i.name, img : g_web.dd.data.img + i.pic, src : g_web.dd.data.vod + i.preview_play_url.replace('preview', 'index') });
                }
                return vod;
            },
            lzd : [
                (dom)=>{
                    get(dom.poster, g_web.dd.page.lzd[1], { xml : true, dom : dom });
                },
                (url, html, arg, xhr)=>{
                    let img = html.split("@@@");
                    arg.dom.poster = g_web.dd.fer(img[0], g_web.dd.data.key) + img[1];
                }
            ]
        },
        fer : (e, k)=>{
            let key = new fernet.Secret(k);
            let token = new fernet.Token({secret: key, token: e, ttl: 0});
            return token.decode();
        }

    },
    hl : {
        data : {},
        addr : {
            url : 'https://300507.com/config.js',
            beg : (data)=>{
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    return /'(.+?)'/.exec(html)[1] + '/pages/go/300507.com/home.json';
                },
                (url, html, arg, xhr)=>{
                    return g_web.hl.aes(/"json_data":"(.+?)"/.exec(html)[1], 'zH3JDuCRXVGa3na7xbOqpx1bw6DAkbTP');
                },
                (url, html, arg, xhr)=>{
                    return xhr.finalUrl + /script src="(.+?)"/.exec(html)[1];
                },
                (url, html, arg, xhr)=>{
                    g_web.hl.data.tenantId = /tenantId: (\d+)/.exec(html)[1];
                    g_web.hl.data.webSiteId = /webSiteId: (\d+)/.exec(html)[1];
                    g_web.hl.data.templateId = /templateId: (\d+)/.exec(html)[1];
                    return /, "(.+?)",/.exec(html)[1] + '/pages/nav/' + g_web.hl.data.tenantId + '/' + g_web.hl.data.webSiteId + '/' + g_web.hl.data.templateId + '/result.json';
                },
                (url, html, arg, xhr)=>{
                    html = g_web.hl.aes(/"json_data":"(.+?)"/.exec(html)[1], 'zH3JDuCRXVGa3na7xbOqpx1bw6DAkbTP');
                    return /"jumpDomain":"(.+?)"/.exec(html)[1];
                },
                (url, html, arg, xhr)=>{
                    g_web.hl.data.vod = /61},1838993989679550500,"(https:\/\/.+?)"/.exec(html)[1];
                    g_web.hl.data.addr = /"(https:\/\/[^"]+)",\[/.exec(html)[1];
                    return /crossorigin href="(.+?)"/.exec(html)[1];
                },
                (url, html, arg, xhr)=>{
                    g_web.hl.data.key = /defaultSecretKey:"(.+?)"/.exec(html)[1];
                    return url.replace(/\/[^\/]+$/, /"\/search",.+?import\("\.(.+?)"\)/.exec(html)[1]);
                },
                (url, html, arg, xhr)=>{
                    g_web.hl.data.search = /="(.+?)";window.location.hostname==="localhost"/.exec(html)[1];
                    return g_web.hl.data.search + '/search?text=ol';
                },
                (url, html, arg, xhr)=>{
                    return g_web.hl.data.addr;
                }
            ]
        },
        menu : {
            url : [
                '{ADDR}/pages/{TENANTID}/{WEBSITEID}/home/home.json',
                '{SEARCH}/search',
                '{ADDR}/pages/{TENANTID}/{WEBSITEID}/water/{1}/{PAGE}.json'
            ],
            beg : (data)=>{
                data.url = g_web.hl.menu.url[0];
                data.menu = true;
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    g_web.hl.task = [];
                    g_web.hl.data.task = true;
                    let d = JSON.parse(html);
                    let j = JSON.parse(g_web.hl.aes(d.json_data, g_web.hl.data.key));
                    let data = j.tabs[2].channelList;
                    let page, cnt = {
                        '1836636258456862722' : 135,'1836638166510841858' : 57,'1836638321423286274' : 16,'1838893473370796033' : 28,
                        '1836636931053441026' : 126,'1836638635517935617' : 34,'1836639219297931266' : 20,'1838847758462455810' : 79,
                        '1836637230514163713' : 78, '1836638914518831106' : 22,'1836639025110056962' : 54,'1838892794984185858' : 91,
                        '1836637472047345665' : 76, '1836638717539549185' : 17,'1836638524979052546' : 17,'1838844081720967170' : 33,
                        '1838057717840576513' : 10, '1836637878462820353' : 28,'1838837573832511489' : 81,'1838847148595933186' : 36,
                        '1836637986105458690' : 69, '1836638857375633410' : 8, '1838893403489615874' : 32,'1838844944606740482' : 48,
                        '1838881547295191042' : 57,
                        '1838837712016031746' : 26
                    };
                    let menu = [ { name : 'find', url : rep(g_web.hl.menu.url[1], g_web.hl.data) } ];
                    for (let i of j.tabs[2].channelList) {
                        url = rep(g_web.hl.menu.url[2], g_web.hl.data).replace('{1}', i.id);
                        menu.push({ name : i.name, url : url });
                        page = (g_web.hl.data[i.name]) ? g_web.hl.data[i.name] : cnt[i.id];
                        if (page == undefined) { console.log(arg.id, i.id, i.name, 'no data'); continue; }
                        arg = 'get("' + url.replace('{PAGE}', ++page) + '", g_web.hl.menu.fun[1], { id:"'+i.id +'",name:"'+i.name+'",url:"'+url+'",page:'+page+'}, g_web.hl.menu.fun[2])';
                        g_task.push(arg);
                        g_web.hl.task.push(arg);
                    }
                    return menu;
                },
                (url, html, arg, xhr)=>{
                    if (xhr.status == 200) {
                        console.log('hl', arg.id, arg.name, arg.page + 1, 'try');
                        get(arg.url.replace('{PAGE}', ++arg.page), g_web.hl.menu.fun[1], arg);
                    } else {
                        g_web.hl.data[arg.name] = --arg.page;
                        let value = GM_getValue('hl');
                        value.data.task = false;
                        value.data[arg.name] = arg.page;
                        GM_setValue('hl', value);
                        console.log('hl', arg.id, arg.name, arg.page);
                        task();
                    }
                },
                (url, arg, xhr)=>{
                    task();
                }
            ],
        },
        page : {
            beg : (data)=>{
                if (data.title == 'find') {
                    let k = CryptoJS.enc.Utf8.parse(g_web.hl.data.key);
                    let t = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data.input), k, { iv: k, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).toString();
                    data.post = '{"text":"' + t + '"}';
                    data.type = 'application/json';
                } else {
                    g_web.hl.data.page = data.page_id - 1;
                }
                return data;
            },
            dec : (html, arg)=>{
                html = JSON.parse(html).json_data;
                html = g_web.hl.aes(html, g_web.hl.data.key);
                return JSON.parse(html);
            },
            cnt : (html, arg)=>{
                console.log(arg)
                if (arg.title == 'find') {
                    let ret = html.length > 0 ? 1 : 0;
                    if (ret == 0) arg.page_id = 0;
                    return ret;
                } else {
                    return g_web.hl.data[arg.title];
                }
            },
            fun : (html, arg)=>{
                let vod = [];
                for (let i of html) {
                    vod.push({ name : i.title, img : g_web.hl.data.addr + '/' + i.mainImgUrl, src : g_web.hl.data.vod + '/' + i.mainImgUrl.substring(0, 22) + '/1200kb/index.m3u8' });
                }
                return vod;
            },
            lzd : []
        },
        aes : (e, k)=>{
            let i = CryptoJS.enc.Utf8.parse(k);
            let d = CryptoJS.AES.decrypt(e, i, { iv : i, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
            return CryptoJS.enc.Utf8.stringify(d);
        }
    },
    hs : {
        data : {},
        addr : {
            url : 'https://www.xhsdc70.vip:2024', // kxiaohuangshu@gmail.com
            beg : (data)=>{
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    return url;
                }
            ]
        },
        menu : {
            url : [
                '{ADDR}',
                '{ADDR}/so/video/{INPUT}/{PAGE}',
                '{ADDR}{JUMPURL}---{PAGE}'
            ],
            beg : (data)=>{
                data.url = g_web.hs.menu.url[0];
                data.menu = true;
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    html = g_web.hs.dec(/APP.data = '(.+?)'/.exec(html)[1])
                    g_web.hs.data.img = html.site.img_domain;
                    g_web.hs.data.vod = html.site.img_domain.replace('tu', 'ts1');
                    let menu = [{ name : 'find', url : rep(g_web.hs.menu.url[1], g_web.hs.data) }];
                    for (let i of html.type) {
                        menu.push({ name : i.name, url : rep(rep(g_web.hs.menu.url[2],g_web.hs.data), i) });
                    }
                    return menu;
                }
            ]
        },
        page : {
            beg : (data)=>{
                g_web.hs.data.page = data.page_id;
                g_web.hs.data.input = data.input;
                return data;
            },
            dec : (html, arg)=>{
                return g_web.hs.dec(/APP.data = '(.+?)'/.exec(html)[1])
            },
            cnt : (html, arg)=>{
                return Math.ceil(html.total / 9);
            },
            fun : (html, arg)=>{
                let vod = [];
                for (let i of html.list) {
                    vod.push({ name : i.vod_name, img : g_web.hs.data.img + i.vod_pic, src : g_web.hs.data.vod + /(video\/m3u8\/\d+\/\d+\/\w+)/.exec(i.vod_thumbnails)[1] + '/index.m3u8' });
                }
                if (vod.length == 0) console.log(html);
                return vod;
            },
            lzd : []
        },
        dec : (d)=>{
            let t1 = CryptoJS.enc.Base64.parse(d);
            let aa = t1.words.slice(0, 8);
            let bb = t1.words.slice(8, 12);
            let cc = t1.words.slice(12);
            let dd = aa.concat(cc);
            let ee = CryptoJS.lib.WordArray.create(dd, dd.length * 4);
            let iv = CryptoJS.lib.WordArray.create(bb, 16);
            let key = CryptoJS.enc.Utf8.parse('WB0nMZHXlxNndORe');
            let dat = CryptoJS.AES.decrypt({ ciphertext : ee }, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7}).toString(CryptoJS.enc.Utf8);
            return JSON.parse(dat);
        }
    },
    ht : {
        data : {},
        addr : {
            url : 'https://github.com/htapp/htapp', // hongtaoav2@gmail.com
            beg : (data)=>{
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    return 'https://' + /https:\/\/<\/p>\s+<p dir="auto">([^<]+)/.exec(html)[1];
                },
                (url, html, arg, xhr)=>{
                    g_web.ht.data.addr = /targetSites = \[\s+'(.+?)'/.exec(html)[1];
                    return g_web.ht.data.addr + '/ht/index.html';
                },
                (url, html, arg, xhr)=>{
                    g_web.ht.data.addr = /targetUrls = \[\s+"(.+?)"/.exec(html)[1];
                    return g_web.ht.data.addr;
                },
                (url, html, arg, xhr)=>{
                    g_web.ht.data.addr = /targetSites = \[\s+'(.+?)'/.exec(html)[1];
                    return g_web.ht.data.addr;
                },
                (url, html, arg, xhr)=>{
                    return /(https:\/\/[^/]+\/static\/js\/app.darkblue.min.js)/.exec(html)[1];
                },
                (url, html, arg, xhr)=>{
                    let t = /var e=\[(.+?)\];/.exec(html)[1];
                    let a = t.split(',')
                    g_web.ht.data.key = a[29].substring(1, 17);
                    return g_web.ht.data.addr;
                }
            ]
        },
        menu : {
            url : [
                '{ADDR}',
                '{ADDR}/search/{INPUT}/{PAGE}',
                '{ADDR}/{1}---{PAGE}'
            ],
            beg : (data)=>{
                data.url = g_web.ht.menu.url[0];
                data.menu = true;
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    let menu = [{ name : 'find', url : rep(g_web.ht.menu.url[1], g_web.ht.data) }];
                    for (let ret, reg = /(type\/(?!game)(?!chigua)(?!nvyou)(?!cy)(?!tongchengjiaoyou).+?\/)" vclass="menu-link">(.+?)</g; ret = reg.exec(html);) {
                        menu.push({ name : str(ret[2]), url : rep(rep(g_web.ht.menu.url[2],g_web.ht.data), ret) });
                    }
                    return menu;
                }
            ]
        },
        page : {
            beg : (data)=>{
                g_web.ht.data.page = data.page_id;
                g_web.ht.data.input = data.input;
                return data;
            },
            dec : (html, arg)=>{
                return str(html);
            },
            cnt : (html, arg)=>{
                let ret = /(\d+), event/.exec(html);
                if (ret) return ret[1];
                ret = /empty-result-title/.exec(html);
                ret = ret ? 0 : 1;
                if (ret == 0) arg.page_id = 0;
                return ret;
            },
            fun : (html, arg)=>{
                let vod = [];
                for (let ret, reg = /original="(https:\/\/.+?\/upload\/vod\/\d+-\d+\/\w+.+?)".+?\/vod\/details\/(\d+).+?"v-title">(.+?)</g; ret = reg.exec(html);) {
                    vod.push({ name : ret[3], img : ret[1], src : ret[2] });
                }
                if (vod.length == 0) console.log(html);
                return vod;
            },
            lzd : [
                (dom)=>{
                    let post = 'data=' + g_web.ht.enc({ id: dom.id, site: 5, token: null, timestamp: Math.ceil(new Date().getTime() / 1000) });
                    get(g_web.ht.data.addr + '/v2/api/vodData', g_web.ht.page.lzd[2], { post : post, type : 'application/x-www-form-urlencoded', dom : dom });
                    get(dom.poster, g_web.ht.page.lzd[1], { 'xml' : true, bin : true, dom : dom });
                },
                (url, html, arg, xhr)=>{
                    let bin = [], data = new Uint8Array(html);
                    for (let i = 0; i < data.byteLength; i++) bin += String.fromCharCode(data[i] ^ 0x88);
                    arg.dom.poster = 'data:image/jpeg;base64,' + btoa(bin);
                },
                (url, html, arg, xhr)=>{
                    html = JSON.parse(html);
                    html = g_web.ht.dec(html.data);
                    html = JSON.parse(html);
                    arg.dom.id = html.vod_play_url[0].list[0].h264;
                }
            ]
        },
        enc : (d)=>{
            let key = CryptoJS.enc.Utf8.parse(g_web.ht.data.key);
            let ivv = CryptoJS.lib.WordArray.random(941931 ^ 941947);
            let dat = CryptoJS.enc.Utf8.parse(typeof(d) === 'string' ? d : JSON.stringify(d));
            let enc = CryptoJS.AES.encrypt(dat, key, {iv: ivv, mode: CryptoJS.mode.CFB, padding: CryptoJS.pad.NoPadding}).ciphertext.toString(CryptoJS.enc.Hex);
            return enc.substring(0, 16) + CryptoJS.enc.Hex.stringify(ivv) + enc.substring(16);
        },
        dec : (d)=>{
            let key = CryptoJS.enc.Utf8.parse(g_web.ht.data.key);
            let ivv = CryptoJS.enc.Hex.parse(d.substring(16, 16 + 32));
            let dat = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(d.substring(0, 16) + d.substring(16 + 32)));
            return CryptoJS.AES.decrypt(dat, key, {iv: ivv, mode: CryptoJS.mode.CFB, padding: CryptoJS.pad.NoPadding}).toString(CryptoJS.enc.Utf8);
        }
    },
    jk : {
        data : {},
        addr : {
            url : 'https://j7.jksp543.top/js/base.js', // ggtv12789@gmail.com
            beg : (data)=>{
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    g_web.jk.data.key = CryptoJS.enc.Utf8.parse(/my = "(.+?)"/.exec(html)[1]);
                    g_web.jk.data.domain = /domain = "(.+?)"/.exec(html)[1];
                    return 'https://j7.jksp543.top';
                }
            ]
        },
        menu : {
            url : [
                '{ADDR}/js/api.js',
                '{DOMAIN}/api.php/api/getShiPinList?currentPage={PAGE}&wd={INPUT}',
                '{DOMAIN}/api.php/api/getShiPinList?currentPage={PAGE}&id={ID}'
            ],
            beg : (data)=>{
                data.url = g_web.jk.menu.url[0];
                data.menu = true;
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    html = /(\[[^;]+)/.exec(html)[1].replace(/(maiyao)|(wenzi1url)|(wenziurl)/g, '""');
                    html = JSON.parse(html);
                    let menu = [{ name : 'find', url : rep(g_web.jk.menu.url[1], g_web.jk.data) }];
                    for (let item of html) {
                        for (let i of item.subclass) {
                            if (i.id != 1) {
                                menu.push({ name : item.name + '-' + i.name, url : rep(rep(g_web.jk.menu.url[2],g_web.jk.data), i) });
                            }
                        }
                    }
                    return menu;
                }
            ]
        },
        page : {
            beg : (data)=>{
                data.host = true;
                data.mobile = true;
                g_web.jk.data.page = data.page_id;
                g_web.jk.data.input = data.input;
                return data;
            },
            dec : (html, arg)=>{
                html = html.replace(/"|\\/g, '');
                html = CryptoJS.AES.decrypt(html, g_web.jk.data.key, { iv: g_web.jk.data.key, padding: CryptoJS.pad.Pkcs7 }).toString(CryptoJS.enc.Utf8);
	            html = JSON.parse(html);
                return html
            },
            cnt : (html, arg)=>{
                return Math.ceil(html.count / 30);
            },
            fun : (html, arg)=>{
                let vod = [];
                for (let i of html.list) {
                    vod.push({ name : i.vod_blurb, img : i.vod_pic, src : g_web.jk.data.domain + '/api.php/api/getDetail?id=' + i.vod_id });
                }
                return vod;
            },
            lzd : [
                (dom)=>{
                    get(dom.id, g_web.jk.page.lzd[1], dom);
                },
                (url, html, arg, xhr)=>{
                    html = g_web.jk.page.dec(html);
                    arg.id = html.detail.vod_play_url;
                }
            ]
        }
    },
    jj : {
        data : {},
        addr : {
            url : 'https://6eaf.js020sp.pro:5268',//https://jtv8868.pro/jm/index.html', // niubiav@gmail.com
            beg : (data)=>{
                data.mobile = true;
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    return /(https:\/\/.+?)\//.exec(xhr.finalUrl)[1];
                }
            ]
        },
        menu : {
            url : [
                '{ADDR}/v2/home/index/a.jsn',
                '{ADDR}/v2/home/search?keyword={INPUT}&page={PAGE}&limit=20',
                '{ADDR}/v2/category?category_child_id=&category_id={1}&limit=20&page={PAGE}'
            ],
            beg : (data)=>{
                data.url = g_web.jj.menu.url[0];
                data.menu = true;
                return data;
            },
            fun :  [
                (url, html, arg, xhr)=>{
                    let j = JSON.parse(html);
                    let menu = [{ name : 'find', url : rep(g_web.jj.menu.url[1], g_web.jj.data) }];
                    for (let item of j.category) {
                        g_web.jj.data['1'] = item.cid;
                        menu.push({ name : item.name, url : rep(g_web.jj.menu.url[2], g_web.jj.data) });
                    }
                    return menu;
                }
            ]
        },
        page : {
            beg : (data)=>{
                g_web.jj.data.page = data.page_id;
                g_web.jj.data.input = data.input;
                return data;
            },
            dec : (html, arg)=>{
                html = JSON.parse(html);
                return arg.title == 'find' ? html : html.data;
            },
            cnt : (html, arg)=>{
                return html.last_page;
            },
            fun : (html, arg)=>{
                let vod = [];
                for (let item of html.data) {
                    vod.push({ name : item.title, img : item.encryptUrl, src : item.id });
                }
                return vod;
            },
            lzd : [
                (dom)=>{
                    g_web.jj.data.id = dom.id;
                    get(rep('{ADDR}/v2/videoplay?vid={ID}', g_web.jj.data), g_web.jj.page.lzd[1], dom);
                    get(dom.poster, g_web.jj.page.lzd[2], { xml : true, bin : true, dom : dom });
                },
                (url, html, arg, xhr)=>{
                    arg.id = JSON.parse(html).video.sl;
                },
                (url, html, arg, xhr)=>{
                    let bin = [], data = new Uint8Array(html);
                    for (let i = 0; i < data.byteLength; i++) bin += String.fromCharCode(data[i] ^ 0x88);
                    arg.dom.poster = 'data:image/jpeg;base64,' + btoa(bin);
                }
            ]
        }
    },
    os : {
        data : {},
        addr : {
            url : 'https://aosikazy.com',
            beg : (data)=>{
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    return url;
                }
            ]
        },
        menu : {
            url : [
                '{ADDR}',
                '{ADDR}/index.php/vod/search/page/{PAGE}/wd/{INPUT}.html',
                '{ADDR}/index.php/vod/type/id/{1}/page/{PAGE}.html'
            ],
            beg : (data)=>{
                data.url = g_web.os.menu.url[0];
                data.menu = true;
                return data;
            },
            fun :  [
                (url, html, arg, xhr)=>{
                    let menu = [{ name : 'find', url : rep(g_web.os.menu.url[1], g_web.os.data) }];
                    for (let ret, reg = /href="\/index.php\/vod\/type\/id\/(\d+).html".+?><.+?>(.+?)</g; ret = reg.exec(html);) {
                        menu.push({ name : ret[2], url : rep(rep(g_web.os.menu.url[2], g_web.os.data), ret) });
                    }
                    return menu;
                }
            ]
        },
        page : {
            beg : (data)=>{
                g_web.os.data.page = data.page_id;
                g_web.os.data.input = data.input;
                return data;
            },
            dec : (html, arg)=>{
                return html;
            },
            cnt : (html, arg)=>{
                let sel = arg.title == 'find' ? 'search\\/page\\/(\\d+)[^"]+' : 'type\\/id\\/\\d+\\/page\\/(\\d+).html';
                let reg = new RegExp('"\\/index\\.php\\/vod\\/' + sel + '" title=".+?">.+?<\\/a>\\s+<\\/div>');
                return reg.exec(html)[1];
            },
            fun : (html, arg)=>{
                let vod = [];
                for (let ret, reg = /<a href="(\/index\.php\/vod\/detail\/id\/\d+\.html)"[\s\S]+?"text-align:left">(.+?)</g; ret = reg.exec(html);) {
                    vod.push({ name : ret[2], img : '', src : g_web.os.data.addr + ret[1] });
                }
                return vod;
            },
            lzd : [
                (dom)=>{
                    get(dom.id, g_web.os.page.lzd[1], dom);
                },
                (url, html, arg, xhr)=>{
                    let ret = /detail-img" src="(.+?)"[\s\S]+?type="text" value=".+?\$(.+?m3u8)"/.exec(html);
                    arg.id = ret[2];
                    arg.poster = ret[1];
                }
            ]
        }
    },
    qq : {
        data : {},
        addr : {
            url : 'https://94itv.app/',
            beg : (data)=>{
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    return /<a href="(https:.+?)" title=/.exec(html)[1];
                }
            ]
        },
        menu : {
            url : [
                '{ADDR}',
                '{ADDR}/search.php?kw_type=key&kw={INPUT}&num={PAGE}',
                '{ADDR}/{1}&num={PAGE}'
            ],
            beg : (data)=>{
                data.url = g_web.qq.menu.url[0];
                data.menu = true;
                return data;
            },
            fun :  [
                (url, html, arg, xhr)=>{
                    let menu = [{ name : 'find', url : rep(g_web.qq.menu.url[1], g_web.qq.data) }];
                    for (let ret, reg = /"btn  item">\s+<a href="\/(\??cat.+?)" title="(.+?)"/g; ret = reg.exec(html);) {
                        menu.push({ name : ret[2], url : rep(rep(g_web.qq.menu.url[2], g_web.qq.data), ret) });
                    }
                    return menu;
                }
            ]
        },
        page : {
            beg : (data)=>{
                g_web.qq.data.page = data.page_id;
                g_web.qq.data.input = data.input;
                return data;
            },
            dec : (html, arg)=>{
                return html;
            },
            cnt : (html, arg)=>{
                return Math.ceil(/<li class="ml-2">.+?(\d+).+?</.exec(html)[1] / 48);
            },
            fun : (html, arg)=>{
                let vod = [];
                for (let ret, reg = /data-videourl="(.+?)"\s*>\s*<img alt='(.+?)'[\s\S]+?src="(.+?)"/g; ret = reg.exec(html);) {
                    vod.push({ name : ret[2] + '\n' + ret[1], img : ret[3], src : '' });
                }
                return vod;
            },
            lzd : []
        }
    },
    th : {
        data : {},
        addr : {
            url : 'https://www.avtaohua-0122.com', // shipinyingtao@gmail.com
            beg : (data)=>{
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    html = decodeURIComponent(/"(.+?)"/.exec(html)[1]);
                    return /href="(.+?)" class="weui-btn/.exec(html)[1];
                },
                (url, html, arg, xhr)=>{
                    html = decodeURIComponent(/"(.+?)"/.exec(html)[1]);
                    console.log('th', /active" href="(.+?)"/.exec(html)[1]);
                    g_web.th.data.addr = 'https://hrtgf.avtaohua-l1002.vip';
                    return g_web.th.data.addr;
                },
                (url, html, arg, xhr)=>{
                    html = decodeURIComponent(/\("(.+?)"\)/.exec(html)[1]);
                    return /"(https:\/\/[^/]+\/avtaohua\/static\/app.js\?v=\d+)"/.exec(html)[1];
                },
                (url, html, arg, xhr)=>{
                    let ret = /l="(\w+)",c="(\w+)"/.exec(html);
                    g_web.th.data.iv = CryptoJS.enc.Utf8.parse(ret[2]);
                    g_web.th.data.key = CryptoJS.enc.Utf8.parse(ret[1]);
                    return g_web.th.data.addr;
                }
            ]
        },
        menu : {
            url : [
                '{ADDR}/app/common/getCategoryTree',
                '{ADDR}/app/movie/getListV2',
                '{ADDR}/app/movie/getListV2',
            ],
            beg : (data)=>{
                data.url = g_web.th.menu.url[0];
                data.menu = true;
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    html = JSON.parse(g_web.th.dec(html));
                    let data = '{"page":{PAGE},"pageSize":20,"sort":1,"cid":"{PID}","tag":"{NAME}"}';
                    let menu = [{ name : 'find', url : rep(g_web.th.menu.url[1], g_web.th.data), data : '{"page":{PAGE},"pageSize":24,"keyword":"{INPUT}"}' }];
                    for (let item of html.data) {
                        if (item.children) {
                            for (let i of item.children) {
                                menu.push({ name : item.name + '-' + i.name, url : rep(g_web.th.menu.url[2], g_web.th.data), data : rep(data, i) });
                            }
                        }
                    }
                    return menu;
                }
            ]
        },
        page : {
            beg : (data)=>{
                g_web.th.data.page = data.page_id;
                g_web.th.data.input = data.input;
                data.type = 'application/json';
                data.post = g_web.th.enc(rep(data.data, g_web.th.data));
                return data;
            },
            dec : (html, arg)=>{
                return JSON.parse(g_web.th.dec(html));
            },
            cnt : (html, arg)=>{
                return html.pageCount;
            },
            fun : (html, arg)=>{
                let vod = [];
                for (let item of html.records) {
                    vod.push({ name : item.title, img : 'https://' + item.imgDomain + '/' + item.poster, src : g_web.th.data.addr + '/app/movie/getDetail?viewKey=' + item.viewKey });
                }
                if (vod.length == 0) console.log(html);
                return vod;
            },
            lzd : [
                (dom)=>{
                    get(dom.id, g_web.th.page.lzd[2], dom);
                    if (dom.poster.indexOf('/upload/') > 0) {
                        get(dom.poster, g_web.th.page.lzd[1], { 'xml' : true, bin : true, dom : dom });
                    }
                },
                (url, html, arg, xhr)=>{
                    let bin = [];
                    let t1 = new Uint8Array(html, 3);
                    let t2 = CryptoJS.lib.WordArray.create(t1).toString(CryptoJS.enc.Base64);
                    let t3 = CryptoJS.AES.decrypt(t2, g_web.th.data.key, {iv: g_web.th.data.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
                    for (let t = t3.words, n = t3.sigBytes, r = new Uint8Array(n), i = 0; i < n; i++) {
                        bin += String.fromCharCode(t[i >>> 2] >>> 24 - i % 4 * 8 & 255);
                    }
                    arg.dom.poster = 'data:image/webp;base64,' + btoa(bin);
                },
                (url, html, arg, xhr)=>{
                    html = JSON.parse(g_web.th.dec(html));
                    arg.id = 'https://' + html.data.sourceInfoVO.playDomain + '/' + html.data.playUrl;
                }
            ]
        },
        enc : (d)=>{
            let dat = CryptoJS.enc.Utf8.parse(typeof(d) === 'string' ? d : JSON.stringify(d));
            return CryptoJS.AES.encrypt(dat, g_web.th.data.key, {iv: g_web.th.data.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7}).toString();
        },
        dec : (d)=>{
            return CryptoJS.AES.decrypt(d, g_web.th.data.key, {iv: g_web.th.data.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7}).toString(CryptoJS.enc.Utf8).toString();
        }
    },
    xj : {
        data : {},
        addr : {
            url : 'https://xj999.tv', // dxj999tv@gmail.com
            beg : (data)=>{
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    return atob(/'(.+?)'/.exec(html)[1]);
                },
                (url, html, arg, xhr)=>{
                    g_web.xj.data.addr = /href="(https:\/\/www.+?)"/.exec(html)[1];
                    return g_web.xj.data.addr + '/js/base41.js';
                },
                (url, html, arg, xhr)=>{
                    g_web.xj.data.api = /init\(\){[\s\S]+"(.+?)\/getDataInit"/.exec(html)[1]
                    return g_web.xj.data.addr;
                }
            ]
        },
        menu : {
            url : [
                '{API}/getDataInit',
                '{API}/forward',
                '{API}/forward'
            ],
            beg : (data)=>{
                data.url = g_web.xj.menu.url[0];
                data.headers = { 'origin' : g_web.xj.data.addr, 'referer' : g_web.xj.data.addr + '/', 'Content-type' : 'application/json' };
                data.post = '{"name":"John","age":31,"city":"New York"}';
                data.host = true;
                data.menu = true;
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    let j = JSON.parse(html);
                    let data = [ j.data.menu0ListMap[0], j.data.menu0ListMap[1], j.data.menu0ListMap[2] ];
                    g_web.xj.data.group = j.data.macVodLinkMap;
                    let menu = [
                        {
                            name : 'find', url : rep(g_web.xj.menu.url[1], g_web.xj.data),
                            data : '{"command":"WEB_GET_INFO","pageNumber":{PAGE},"RecordsPage":20,"typeId":0,"typeMid":1,"type":1,"languageType":"CN","content":"{INPUT}"}'
                        }
                    ];
                    for (let i of data) {
                        for (let j of i.menu2List) {
                            menu.push({
                                name : i.typeName + '-' + j.typeName2, url : rep(g_web.xj.menu.url[2], g_web.xj.data),
                                data : '{"command":"WEB_GET_INFO","pageNumber":{PAGE},"RecordsPage":20,"typeId":' + j.typeId2 + ',"typeMid":1,"languageType":"CN","content":""}'
                            });
                        }
                    }
                    return menu;
                }
            ]
        },
        page : {
            beg : (data)=>{
                g_web.xj.data.page = data.page_id;
                g_web.xj.data.input = data.input;
                data.headers = { 'origin' : 'https://www.dxj5577.com', 'referer' : 'https://www.dxj5577.com/', 'Content-type' : 'application/json' };
                data.post = rep(data.data, g_web.xj.data);
                data.host = true;
                return data;
            },
            dec : (html, arg)=>{
                return html;
            },
            cnt : (html, arg)=>{
                let ret = /"count":"(\d+)"/.exec(html);
                ret = ret ? Math.ceil(ret[1] / 20) : 0;
                if (ret == 0) arg.page_id = 0;
                return ret;
            },
            fun : (html, arg)=>{
                let vod = [];
                for (let tmp, ret, reg = /(\/video\/m3u8\/\d+\/\d+\/[0-9a-f]+\/).+?vod_name":"(.+?)".+?vod_server_id":(\d+)/g; ret = reg.exec(html);) {
                    tmp = g_web.xj.data.group[ret[3]];
                    vod.push({ name : ret[2], img : tmp.PIC_LINK_1 + ret[1] + '1.jpg', src : tmp.LINK_1 + ret[1] + 'playlist.m3u8' });
                }
                return vod;
            },
            lzd : []
        }
    },
    xx : {
        data : {},
        addr : {
            url : 'https://2.31xx11347s.cc', // 31xxcom@gmail.com
            beg : (data)=>{
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    html = decodeURIComponent(/"(.+?)"/.exec(html)[1]);
                    return /1：<a href="(.+?)\/"/.exec(html)[1];
                }
            ]
        },
        menu : {
            url : [
                '{ADDR}',
                '{ADDR}/search/{INPUT}/{PAGE}',
                '{ADDR}/{1}/{PAGE}'
            ],
            beg : (data)=>{
                data.url = g_web.xx.menu.url[0];
                data.menu = true;
                return data;
            },
            fun :  [
                (url, html, arg, xhr)=>{
                    html = g_web.xx.page.dec(html);
                    let menu = [{ name : 'find', url : rep(g_web.xx.menu.url[1], g_web.xx.data) }];
                    for (let ret, reg = /href="\/(type\/(?!28)(?!29)\d+)">([^&].+?)</g; ret = reg.exec(html);) {
                        menu.push({ name : ret[2], url : rep(rep(g_web.xx.menu.url[2],g_web.xx.data), ret) });
                    }
                    return menu;
                }
            ]
        },
        page : {
            beg : (data)=>{
                g_web.xx.data.page = data.page_id;
                g_web.xx.data.input = data.input;
                return data;
            },
            dec : (html, arg)=>{
                return decodeURIComponent(/"(.+?)"/.exec(html)[1]);
            },
            cnt : (html, arg)=>{
                let ret = /total = parseInt\((\d+)\)/.exec(html);
                ret = ret ? ret[1] : 0;
                if (ret == 0) arg.page_id = 0;
                return ret;
            },
            fun : (html, arg)=>{
                let vod = [];
                for (let ret, reg = /"(\/play\/\w+)"[\s\S]+?data-original="(.+?)"[\s\S]+?"rank-title">(.+?)</g; ret = reg.exec(html);) {
                    vod.push({ name : str(ret[3]), img : ret[2], src : g_web.xx.data.addr + ret[1] });
                }
                return vod;
            },
            lzd : [
                (dom)=>{
                    get(dom.id, g_web.xx.page.lzd[1], dom);
                },
                (url, html, arg, xhr)=>{
                    html = decodeURIComponent(/"(.+?)"/.exec(html)[1]);
                    arg.id = /url: "(.+?)"/.exec(html)[1];
                }
            ]
        }
    },
    yk : {
        data : {},
        addr : {
            url : 'http://yyk88.com', // youyiku88@gmail.com
            beg : (data)=>{
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    let a = decodeURIComponent(escape(atob(/data-caption=".{10}(.+?)"/.exec(html)[1]))).split(',');
                    g_web.yk.data.addr = 'https://' + a[1];
                    return g_web.yk.data.addr + '/ui/comics/main';
                },
                (url, html, arg, xhr)=>{
                    let ret = /src=".+?\/ui\/js\/config-([0-9a-z]+).js"/.exec(html);
                    g_web.yk.data.config = ret[1];
                    arg.xml = true;
                    arg.type = 'application/x-www-form-urlencoded';
                    arg.post = 'data=' + encodeURIComponent(g_web.yk.reqData('/api/dance/loadSysConfig', {}, 2)) +
                               '&key=' + encodeURIComponent(g_web.yk.randomString(10) + btoa(g_web.yk.randomString(10) + new Date().getTime() + Math.ceil(Math.random() * 100)))
                    return g_web.yk.data.addr + '/ui/open_api/data';
                },
                (url, html, arg, xhr)=>{
                    delete arg.xml;
                    delete arg.type;
                    delete arg.post;
                    let j = JSON.parse(g_web.yk.page.dec(html));
                    for (let i of j.data) {
                        if (i.key == 'video_base_url') {
                            g_web.yk.data.vod = i.val;
                            let value = GM_getValue('yk');
                            if (value && value.data) {
                                value.data.vod = i.val;
                            } else {
                                value = { data : { vod : i.val } };
                            }
                            GM_setValue('yk', value);
                        }
                    }
                    return g_web.yk.data.addr;
                }
            ]
        },
        menu : {
            url : [
                '{ADDR}/ui/js/config-{CONFIG}.js',
                '{ADDR}/ui/open_api/data',
                '{ADDR}/ui/open_api/data_{CHECK}.js?data={DATA}'
            ],
            beg : (data)=>{
                data.url = g_web.yk.menu.url[0];
                data.menu = true;
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    g_web.yk.task = [];
                    g_web.yk.data.task = true;
                    let menu = [ { name : 'find', url : rep(g_web.yk.menu.url[1], g_web.yk.data) } ];
                    let cnt = {//    15          26           37         47         56         67          78         88            101         119       132
                        1006 : 1680, 2001 : 3,   10000 : 1,   7001 : 43, 3011 : 56, 6001 : 46, 4001 : 82,  5006 : 58, 11001 : 1,    8000 : 334, 9000 : 9, 13013 : 187,
                        1000 : 100,  2010 : 3,   10001 : 212, 7012 : 38, 3001 : 56, 6002 : 2,  4002 : 7,   5012 : 1,  11002 : 2,    8001 : 6,   9001 : 2, 13001 : 187,
                        1001 : 82,   2002 : 45,  10002 : 110, 7011 : 35, 3002 : 2,  6012 : 46, 4003 : 5,   5001 : 1,  36 :    187,  8002 : 10,  9002 : 1, 13002 : 41,
                        1010 : 5,    2012 : 5,   10003 : 26,  7002 : 16, 3003 : 1,  6003 : 1,  4004 : 10,  5008 : 58, 33 :    200,  8003 : 2,   9003 : 5, 13003 : 74,
                        1016 : 200,  2003 : 21,  10004 : 5,   7005 : 5,  3006 : 1,  6004 : 2,  4005 : 4,   5002 : 1,  32 :    1680, 8004 : 4,   9004 : 5, 13012 : 6,
                        1012 : 30,   2007 : 56,  10005 : 4,   7006 : 1,  3004 : 6,  6005 : 2,  4006 : 26,  5009 : 11, 34 :    1680, 8018 : 13,  9005 : 2, 13006 : 2,
                        1004 : 12,   2009 : 1,   10008 : 2,   7007 : 2,  3005 : 2,  6006 : 1,  4007 : 3,   5003 : 3,  22 :    1680, 8005 : 4,   9008 : 1, 13004 : 3,
                        1014 : 26,   2014 : 2,   10009 : 2,   7008 : 2,  3007 : 2,  6007 : 1,  4008 : 2,   5010 : 5,  21 :    1680, 8008 : 5,   9009 : 1, 13005 : 3,
                        1003 : 184,  2013 : 2,   10010 : 24,  7009 : 1,  3008 : 1,  6008 : 1,  4009 : 3,   5007 : 6,  20 :    1680, 8009 : 3,   9010 : 2, 13011 : 1,
                        1013 : 43,   2004 : 9,   10011 : 2,   7010 : 2,             6009 : 46, 4010 : 3,   5005 : 1,  24 :    1680, 8010 : 2,   9011 : 2, 13007 : 1,
                        1002 : 19,   2008 : 100, 10006 : 209,                       6010 : 1,  4011 : 82,             23 :    1680, 8011 : 2,   9013 : 3, 13008 : 2,
                        1005 : 50,                                                  6011 : 1,                         37 :    43,   8006 : 5,   9006 : 1,
                        1009 : 9,                                                                                     35 :    187,  8012 : 1,   9012 : 1,
                        1008 : 1680,                                                                                                8013 : 1,
                                                                                                                                    8014 : 3,
                                                                                                                                    8015 : 3,
                                                                                                                                    8016 : 6,
                                                                                                                                    8017 : 334,
                    };
                    for (let t, j, ret, reg = /sessionStorage.setItem\("dance_mh_resource_view_2_\d+_\d+","(.+?)"/g; ret = reg.exec(html);) {
                        t = ret[1].split("").reverse().join("");
                        t = decodeURIComponent(atob(t));
                        j = JSON.parse(t);
                        for (let i of j) {
                            menu.push( { name : i.name, url : rep(g_web.yk.menu.url[2], g_web.yk.data), data : JSON.stringify({ id : i.id, mode : i.dataSourceMode }) });
                            let page = (g_web.yk.data[i.name]) ? g_web.yk.data[i.name] : cnt[i.id];
                            if (page == undefined) { console.log(i.id, i.name); continue; }
                            let data = g_web.yk.getData(i.id, i.dataSourceMode, ++page);
                            let check = g_web.yk.getCheck(data);
                            let url = g_web.yk.menu.url[2].replace('{ADDR}', g_web.yk.data.addr);
                            url = url.replace('{DATA}', data);
                            url = url.replace('{CHECK}', check);
                            arg = 'get("' + url + '", g_web.yk.menu.fun[1], { id : '+i.id+', name : "'+i.name+'", mode : "'+i.dataSourceMode+'", page : '+page+'});';
                            g_task.push(arg);
                            g_web.yk.task.push(arg);
                        }
                    }
                    return menu;
                },
                (url, html, arg, xhr)=>{
                    html = g_web.yk.page.dec(html);
                    let j;
                    try {
                        j = JSON.parse(html);
                    } catch (e) {
                        console.log('===============catch erro==============');

                        let data = g_web.yk.getData(arg.id, arg.mode, ++arg.page);
                        let check = g_web.yk.getCheck(data);
                        url = g_web.yk.menu.url[2].replace('{ADDR}', g_web.yk.data.addr);
                        url = url.replace('{DATA}', data);
                        url = url.replace('{CHECK}', check);
                        console.log('yk', arg.name, arg.page, 'try');
                        get(url, g_web.yk.menu.fun[1], arg);
                    }
                    if (j.data == undefined) return;
                    if (j.data.length != 0) {
                        let data = g_web.yk.getData(arg.id, arg.mode, ++arg.page);
                        let check = g_web.yk.getCheck(data);
                        url = g_web.yk.menu.url[2].replace('{ADDR}', g_web.yk.data.addr);
                        url = url.replace('{DATA}', data);
                        url = url.replace('{CHECK}', check);
                        console.log('yk', arg.id, arg.name, arg.page, 'try');
                        get(url, g_web.yk.menu.fun[1], arg);
                    } else {
                        g_web.yk.data[arg.name] = --arg.page;
                        let value = GM_getValue('yk');
                        value.data.task = false;
                        value.data[arg.name] = arg.page;
                        GM_setValue('yk', value);
                        console.log('yk', arg.id, arg.name, arg.page);
                        task();
                    }
                }
            ]
        },
        page : {
            beg : (data)=>{
                if (data.title == 'find') {
                    data.xml = true;
                    data.type = 'application/x-www-form-urlencoded';
                    data.post = 'data=' + encodeURIComponent(g_web.yk.getSearch(data.input, data.page_id)) +
                                '&key=' + encodeURIComponent(g_web.yk.randomString(10) + btoa(g_web.yk.randomString(10) + new Date().getTime() + Math.ceil(Math.random() * 100)))
                } else {
                    let j = JSON.parse(data.data);
                    g_web.yk.data.data = g_web.yk.getData(j.id, j.mode, data.page_id);
                    g_web.yk.data.check = g_web.yk.getCheck(g_web.yk.data.data);
                    g_web.yk.data.page = data.page_id;
                    g_web.yk.data.input = data.input;
                }
                return data;
            },
            dec : (html, arg)=>{
                let a = html;
                let f = [];
                let e = a.length - 10;
                let g = Math.floor(e / 10);
                let h = 0;
                for (let c = 0; c < 10; c++) {
                    let b = c * g + 1 + c;
                    let d = a.substring(b, b + g);
                    d = d.split("");
                    d = d.reverse().join("");
                    f.push(d);
                    h = b + g;
                }
                f.push(a.substring(h + 1).split("").reverse().join(""));
                f = f.join("");
                return decodeURIComponent(atob(f));
            },
            cnt : (html, arg)=>{
                let data = JSON.parse(html).data;
                if (arg.title == 'find' && data.length == 0) arg.page_id = 0;
                return g_web.yk.data[arg.title];
            },
            fun : (html, arg)=>{
                let vod = [], j = JSON.parse(html), data = (arg.title == 'find') ? j.data.data : j.data;
                for (let i of data) {
                    vod.push({ name : i.title, img : g_web.yk.data.vod + i.verticalCover, src : g_web.yk.data.vod + i.url });
                }
                return vod;
            },
            lzd : [
                (dom)=>{
                    if (/dat$/.exec(dom.poster)) get(dom.poster, g_web.yk.page.lzd[1], dom);
                },
                (url, html, arg, xhr)=>{
                    arg.poster = html;
                }
            ]
        },
        randomString : (f)=>{
            f = f || 32;
            var d = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz", b = d.length, g = "";
            for (var c = 0; c < f; c++) {
                g += d.charAt(Math.floor(Math.random() * b))
            }
            return g
        },
        getStringFingerprint : (b)=>{
            var e = 0;
            for (var c = 0; c < b.length; c++) {
                e = ((e << 5) - e) + b.charCodeAt(c);
                e &= e
            }
            var a = e.toString(16);
            var d = a.replace(/[^\da-f]/gi, "");
            return d
        },
        reqData : (a, n, k)=>{
            n.url = a;
            var d = new Date();
            if (k == 1) {
                var l = d.getFullYear();
                var j = d.getMonth() + 1;
                var m = d.getDate();
                var o = d.getHours();
                n.time = "" + l + j + m + o
            } else {
                n.time = d.getTime();
            }

            var r = btoa(encodeURIComponent(JSON.stringify(n)));
            var c = r.length;
            var g = Math.floor(c / 10);
            var q = [];
            var e = 0;
            for (var f = 0; f <= 10; f++) {
                var h = f * g;
                var b = k == 1 ? "A" : g_web.yk.randomString(1);
                var p = r.substring(e, h);
                q.push(p);
                q.push(b);
                e = h
            }
            q.push(r.substring(e));
            r = q.join("");
            return r
        },
        getData : (id, mode, page)=>{
            let i = {
                'categoryId' : '',
                'dataSourceMode' : mode,
                'id' : id,
                'navigationType' : 2,
                'pageIndex' : page,
                'pageSize' : 30,
                'sort': '',
                'tagId': ''
            };
            return g_web.yk.reqData('/api/navigation/getResourceViewData', i, 1);
        },
        getSearch : (input, page)=>{
            var i = {
                navigationType: '2',
                title: input,
                pageIndex: page,
                pageSize: 30
            };
            return g_web.yk.reqData('/api/dance/search', i, 2);
        },
        getCheck : (data)=>{
            let n = new Date();
            let y = n.getFullYear();
            let m = n.getMonth() + 1;
            let d = n.getDate();
            let h = n.getHours();
            let f = g_web.yk.getStringFingerprint(data);
            return '' + y + m + d + h + "_" + f;
        }
    },
    zd : {
        data : {},
        addr : {
            url : 'https://api.ip.sb/geoip', // url@avhd101.email
            beg : (data)=>{
                data.host = true;
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    g_web.zd.data.ip = /"ip":"(.+?)"/.exec(html)[1];
                    return 'https://in101.org/r/p1?&time=1';
                },
                (url, html, arg, xhr)=>{
                    let ret = /ree\('(.+?)', (\d+)\)/.exec(html);
                    let text = ret[1];
                    let shift = 26 - ret[2];
                    let result = '';
                    for (let i = 0; i < text.length; i++) {
                        let char = text.charAt(i);
                        if (char.match(/[a-z]/i)) {
                            let code = text.charCodeAt(i);

                            if (code >= 65 && code <= 90) {
                                char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
                            } else if (code >= 97 && code <= 122) {
                                char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
                            }
                        }
                        result += char;
                    }
                    console.log('zd addr  ', result);
                    return 'https://cn920.cw101.app';
                }
            ]
        },
        menu : {
            url : [
                '{ADDR}',
                '{ADDR}/search?q={INPUT}&p={PAGE}',
                '{ADDR}/{1}?page={PAGE}'
            ],
            beg : (data)=>{
                data.url = g_web.zd.menu.url[0];
                data.menu = true;
                data.host = true;
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    html = g_web.zd.page.dec(html);
                    g_web.zd.task = [];
                    g_web.zd.data.task = true;
                    let page, cnt = { 'hd' : 3346, 'chinese' : 1857, 'uncensored' : 216, 'rank/today' : 5 };
                    let menu = [ { name : 'find', url : rep(g_web.zd.menu.url[1], g_web.zd.data) } ];
                    for (let ret, reg = /<a itemprop="url" href="\/(?!category)([^"]+)">([^<>]+)</g; ret = reg.exec(html);) {
                        url = rep(rep(g_web.zd.menu.url[2], g_web.zd.data), ret);
                        menu.push({ name : ret[2], url : url });
                        page = (g_web.zd.data[ret[2]]) ? g_web.zd.data[ret[2]] : cnt[ret[1]];
                        if (page == undefined) { console.log(ret[1]); continue; }
                        arg = 'get("' + url.replace('{PAGE}', ++page) + '", g_web.zd.menu.fun[1], { id : "' + ret[1] + '", name : "' + ret[2] + '", page : ' + page + '});';
                        g_task.push(arg);
                        g_web.zd.task.push(arg);
                    }
                    return menu;
                },
                (url, html, arg, xhr)=>{
                    html = g_web.zd.page.dec(html);
                    if (/R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==/.exec(html)) {
                        console.log('zd', arg.id, arg.name, arg.page + 1, 'try');
                        get(url.replace(/\d+$/, ++arg.page), g_web.zd.menu.fun[1], arg);
                    } else {
                        g_web.zd.data[arg.name] = --arg.page;
                        let value = GM_getValue('zd');
                        value.data.task = false;
                        value.data[arg.name] = arg.page;
                        GM_setValue('zd', value);
                        console.log('zd', arg.id, arg.name, arg.page);
                        task();
                    }
                }
            ]
        },
        page : {
            beg : (data)=>{
                g_web.zd.data.page = data.page_id;
                g_web.zd.data.input = data.input;
                return data;
            },
            dec : (html, arg)=>{
                let t = atob(/ec='(.+?)'/.exec(html)[1]);
                let a = new Uint8Array(t.length);
                for (let i = 0; i < t.length; i++) { a[i] = t.charCodeAt(i); }
                let utf_dec = new TextDecoder('utf-8');
                return utf_dec.decode(a);
            },
            cnt : (html, arg)=>{
                if (arg.title == 'find') {
                    let ret = /class="pagenum">[^(]+\([^\d]+(\d+)/.exec(html);
                    ret = ret ? Math.ceil(ret[1] / 60) : 0;
                    if (ret == 0) arg.page_id = 0;
                    return ret;
                } else {
                    return g_web.zd.data[arg.title];
                }
            },
            fun : (html, arg)=>{
                let vod = [];
                for (let ret, reg = /(https:\/\/[^/]+\/([^/]+)\/images\/[^'"]+)[\s\S]+?itemprop="url">( <span itemprop="name"> )?(.+?)</g; ret = reg.exec(html);) {
                    vod.push({ name : ret[4], img : ret[1], src : ret[2] });
                }
                return vod;
            },
            lzd : [
                (dom)=>{
                    dom.id = g_web.zd.data.addr + '/pv/' + dom.id + '.m3u8?px=' +
                             btoa(dom.id.substring(2,6) + 'prefix=/'+dom.id+'/preview&server=tc&id='+dom.id + '&ip='+g_web.zd.data.ip + '&expire='+(Math.round(Date.now()/1000)+600));
                    get(dom.poster, g_web.zd.page.lzd[1], { 'xml' : true, dom : dom });
                },
                (url, html, arg, xhr)=>{
                    arg.dom.poster = 'data:image/jpeg;base64,' + html.substring(6, html.length - 2);
                }
            ]
        }
    },
    zp : {
        data : {},
        addr : {
            url : 'http://1237.tk029.click:89/ads.html',
            beg : (data)=>{
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    return /'(.+?)'/.exec(html)[1];
                },
                (url, html, arg, xhr)=>{
                    let ret = /"(https:\/\/[^/]+)\/([^/]+)\/([^?]+)\?([^=]+)=(.+?)"/.exec(html);
                    if (ret) {
                        g_web.zp.data.cookie = '_' + ret[2] + '=' + ret[3] + '; ' + ret[4] + '=' + ret[5];
                        return ret[1];
                    }
                    throw new Error();
                }
            ]
        },
        menu : {
            url : [
                '{ADDR}',
                '{ADDR}/search.jsp?eck={INPUT}&inpk=',
                '{ADDR}/{1}&p={PAGE}'
            ],
            beg : (data)=>{
                data.headers = { 'cookie' : g_web.zp.data.cookie };
                data.url = g_web.zp.menu.url[0];
                data.menu = true;
                return data;
            },
            fun :  [
                (url, html, arg, xhr)=>{
                    let menu = [];
                    for (let ret, reg = /href="\/(tag\.jsp\?t=\w+)#\d+"><script>document.write\(I\("(.+?)"\)\)/g; ret = reg.exec(html); ) {
                        menu.push({ name : g_web.zp.I(ret[2]), url : rep(rep(g_web.zp.menu.url[2], g_web.zp.data), ret) });
                    }
                    return menu;
                }
            ]
        },
        page : {
            beg : (data)=>{
                g_web.zp.data.page = data.page_id;
                g_web.zp.data.input = g_web.zp.I(data.input);
                return data;
            },
            dec : (html, arg)=>{
                return html;
            },
            cnt : (html, arg)=>{
                let tag = /t=(\w+)&/.exec(arg.url)[1];
                let reg = new RegExp(tag + '#(\\d+)');
                let ret = reg.exec(html);
                return Math.ceil(ret[1] / 12);
            },
            fun : (html, arg)=>{
                let vod = [];
                for (let ret, reg = /href="(\/watch\.jsp\?v=\w+)"[\s\S]+?I\("([^"]+)"\)[\s\S]+?I\("([^"]+)"\)/g; ret = reg.exec(html);) {
                    vod.push({ name : g_web.zp.I(ret[3]), img : /"(.+?)"/.exec(g_web.zp.I(ret[2]))[1], src : ret[1] });
                }
                return vod;
            },
            lzd : [
                (dom)=>{
                    get(dom.poster, g_web.zp.page.lzd[1], dom);
                },
                (url, html, arg, xhr)=>{
                    arg.poster = 'data:image/jpeg;base64,' + html;
                }
            ]
        },
        I : (r)=>{
            let n = '';
            for (let i = 0; r && i < r.length; ++i) {
                n += String.fromCharCode(128 ^ r.charCodeAt(i));
            }
            return n
        }
    },
    zx : {
        data : {},
        addr : {
            url : 'https://www.aplhz.com',
            beg : (data)=>{
                return data;
            },
            fun : [
                (url, html, arg, xhr)=>{
                    return /data-clipboard-text="(.+?)"/.exec(html)[1];
                },
                (url, html, arg, xhr)=>{
                    return /src="(https:\/\/[^/]+\/pc\/assets\/index.\w+.js)"/.exec(html)[1];
                },
                (url, html, arg, xhr)=>{
                    g_web.zx.data.img = /VITE_APP_IMGKEY:"(.+?)"/.exec(html)[1];
                    g_web.zx.data.key = /VITE_APP_AES_KEY:"(.+?)"/.exec(html)[1];
                    g_web.zx.data.addr = /VITE_APP_SERVER_ADDRESS:'\[{"url":"(.+?)"/.exec(html)[1];
                    g_web.zx.data.timeStamp = 0;
                    arg.post = '{"endata":"' + g_web.zx.endata(JSON.stringify({})) + '","ents":"' + g_web.zx.ents() + '"}';
                    return g_web.zx.data.addr + '/base/getTimeStamp';
                },
                (url, html, arg, xhr)=>{
                    let s = new Date;
                    g_web.zx.data.timeStamp = JSON.parse(html).data.timeStamp - (parseInt(s.getTime() / 1e3) + s.getTimezoneOffset() * 60);
                    return g_web.zx.data.addr;
                }
            ]
        },
        menu : {
            url : [
                '{ADDR}/panel/list',
                '{ADDR}/base/globalSearch',
                '{ADDR}/videos/getList',
                '{ADDR}/panel/get',
            ],
            beg : (data)=>{
                data.type = 'application/json';
                data.post = '{"endata":"' + g_web.zx.endata('{"channel":"pc"}') + '","ents":"' + g_web.zx.ents() + '"}';
                data.url = g_web.zx.menu.url[0];
                data.menu = true;
                return data;
            },
            fun :  [
                (url, html, arg, xhr)=>{
                    g_web.zx.task = [];
                    g_web.zx.data.task = true;
                    arg = '{"page":{PAGE},"length":12,"type":1,"key":"{INPUT}","orderType":1,"orderMode":null}';
                    let menu = [{ name : 'find', url : rep(g_web.zx.menu.url[1], g_web.zx.data), data : arg }];
                    for (let item of JSON.parse(html).data.list) {
                        if (item.panelId == 209 || item.panelId == 173 || item.panelId == 182 || item.panelId == 172 || item.panelId == 180) continue;
                        if (item.panelId == 171) {
                            arg = '{"panelId":' + item.panelId + '}';
                            menu.push({ name : item.panelName, url : rep(g_web.zx.menu.url[3], g_web.zx.data), data : arg });
                        } else {
                            arg = '{"orderType":7,"tags":[],"length":11,"page":{PAGE},"offset":{OFFSET},"typeIds":[{' + item.panelName + '}],"payType":[3,4]}';
                            menu.push({ name : item.panelName, url : rep(g_web.zx.menu.url[2], g_web.zx.data), data : arg });

                            arg = '{"endata":"' + g_web.zx.endata(JSON.stringify({ panelId : item.panelId })) + '","ents":"' + g_web.zx.ents() + '"}';
                            arg = '{ type : "application/json", post : \'' + arg + '\', name : "' + item.panelName + '" }';
                            arg = 'get("' + g_web.zx.data.addr + '/panel/get", g_web.zx.menu.fun[1], ' + arg + ');';
                            g_task.push(arg);
                            g_web.zx.task.push(arg);
                        }
                    }
                    return menu;
                },
                (url, html, arg, xhr)=>{
                    let ret = /\\"classs\\":\[(\d+)\].+?\\"payType\\":\[([\d,]+)\]/.exec(html);
                    if (ret) {
                        g_web.zx.data[arg.name] = ret[1];
                        let value = GM_getValue('zx');
                        value.data.task = false;
                        value.data[arg.name] = ret[1];
                        GM_setValue('zx', value);
                        console.log('zx', arg.name, ret[1]);
                    }
                    task();
                }
            ]
        },
        page : {
            beg : (data)=>{
                g_web.zx.data.page = data.page_id;
                g_web.zx.data.input = data.input;
                g_web.zx.data.offset = 11 * (data.page_id - 1);
                data.type = 'application/json';
                data.post = '{"endata":"' + g_web.zx.endata(rep(data.data, g_web.zx.data)) + '","ents":"' + g_web.zx.ents() + '"}';
                return data;
            },
            dec : (html, arg)=>{
                return JSON.parse(html);
            },
            cnt : (html, arg)=>{
                return html.data.info ? 1 : Math.ceil(html.data.count / 12);
            },
            fun : (html, arg)=>{
                let vod = [];
                if (html.data.info) {
                    for (let i of html.data.info.Layouts) {
                        if (i.layoutId == 361) {
                            let layout = JSON.parse(i.layoutContent);
                            for (let j of layout.right.list) {
                                vod.push({ name : '', img : '', src : j });
                            }
                        }
                    }
                } else {
                    let dat = arg.title == 'find' ? html.data.infos : html.data.list;
                    for (let item of dat) {
                        vod.push({ name : item.name, img : item.coverImgUrl, src : item.id });
                    }
                }
                return vod;
            },
            lzd : [
                (dom)=>{
                    if (dom.poster == 'https://hm.baidu.com/hm.js?m3') {
                        let post = '{"endata":"' + g_web.zx.endata('{"videoId":' + dom.id + '}') + '","ents":"' + g_web.zx.ents() + '"}';
                        get(g_web.zx.data.addr + '/videos/getInfo', g_web.zx.page.lzd[1], { type : 'application/json', post : post, dom : dom });
                        get(g_web.zx.data.addr + '/videos/v2/getUrl', g_web.zx.page.lzd[3], { type : 'application/json', post : post, dom : dom });
                    } else {
                        get(dom.poster, g_web.zx.page.lzd[2], dom);
                    }
                },
                (url, html, arg, xhr)=>{
                    html = JSON.parse(html);
                    arg.dom.previousElementSibling.innerText = html.data.info.name;
                    get(html.data.info.coverImgUrl, g_web.zx.page.lzd[2], arg.dom);
                },
                (url, html, arg, xhr)=>{
                    let d = CryptoJS.AES.decrypt(html, CryptoJS.enc.Utf8.parse(g_web.zx.data.img), { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
                    arg.poster = CryptoJS.enc.Utf8.stringify(d).toString();
                },
                (url, html, arg, xhr)=>{
                    arg.dom.id = JSON.parse(html).data.url;
                }
            ]
        },
        endata : (d)=>{
            let e = CryptoJS.enc.Utf8.parse(d);
            let k = CryptoJS.enc.Utf8.parse(g_web.zx.data.key);
            let s = CryptoJS.AES.encrypt(e, k, { iv: k, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
            return CryptoJS.enc.Base64.stringify(s.ciphertext);
        },
        ents : ()=>{
            const e = new Date;
            return g_web.zx.endata(parseInt(e.getTime() / 1e3) + e.getTimezoneOffset() * 60 + g_web.zx.data.timeStamp)
        }
    }
};

function main() {
    //GM_deleteValue('zd');

    let p = GM_getValue('aa');
    let x = p ? p.x : 100;
    let y = p ? p.y : 100;

    document.body = document.createElement('body');

    let div = document.createElement('div');
    div.draggable = true;
    div.style = 'z-index:999;display:flex;position:fixed;left:' + x + 'px;top:' + y + 'px;background-color:#777;border:1px solid black;border-radius:6px;padding:5px;cursor:move;';
    div.ondragstart = (e)=>{
        g_data.mx = window.innerWidth;
        g_data.my = window.innerHeight;
        g_data.cx = e.target.offsetWidth;
        g_data.cy = e.target.offsetHeight;
        g_data.ox = e.clientX - e.target.offsetLeft;
        g_data.oy = e.clientY - e.target.offsetTop;
    };
    div.ondragend = (e)=>{
        x = e.x - g_data.ox;
        y = e.y - g_data.oy;
        x < 0 ? x = 0 : (x + g_data.cx) > g_data.mx ? x = g_data.mx - g_data.cx : x;
        y < 0 ? y = 0 : (y + g_data.cy) > g_data.my ? y = g_data.my - g_data.cy : y;
        div.style.left = x + 'px';
        div.style.top = y + 'px';
        GM_setValue('aa', { x : x, y : y });
        console.log('aa', GM_getValue('aa'));
    };
    document.body.appendChild(div);

    let select = document.createElement('select');
    select.id = 'menu';
    select.onchange = ()=>{ on_change(false); }
    div.appendChild(select);

    let a = document.createElement('a');
    a.innerText = '<';
    a.href = 'javascript:void(0);';
    a.onclick = ()=>{ g_data.first = false; g_data.page_id = (g_data.page_id == 1) ? g_data.page_cnt : (g_data.page_id - 1); page(g_data); }
    div.appendChild(a);

    let input = document.createElement('input');
    input.id = 'input';
    input.style = 'width:30px;text-align:center';
    input.onkeydown = ()=>{ if (event.keyCode == 13) on_change(true); }
    div.appendChild(input);

    a = document.createElement('a');
    a.innerText = '>';
    a.href = 'javascript:void(0);';
    a.onclick = ()=>{ g_data.first = false; g_data.page_id = (g_data.page_id == g_data.page_cnt) ? 1 : (g_data.page_id + 1); page(g_data); }
    div.appendChild(a);

    let content = document.createElement('div');
    content.id = 'content';
    document.body.appendChild(content);

    menu('m3', [{ name : 'play', url : '{INPUT}' }]);

    for (let id of GM_listValues()) {
        console.log(id, GM_getValue(id));
    }

    for (let id in g_web) {
        g_task.push('addr("' + id + '");');
    }

    task();
}

function task() {
    let code = g_task.splice(0, 1)[0];
    //console.log(code);
    eval('setTimeout(()=>{' + code + '}, 0);');
}

function lzd() {
    const observer = lozad('.lozad',{ load : (element)=>{
        let web = g_web[element.getAttribute('lzd')];
        if (web == null) return;
        web.page.lzd[0](element);
     }});

    observer.observe();
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
    if (!t) return t;
    for (let key in map) {
        t = t.replace('{' + key.toUpperCase() + '}', map[key]);
    }
    return t;
}

function get(url, cb_load, arg, cb_timeout) {
    if (arg.xml) {
        let xhr = new XMLHttpRequest();
        xhr.open(arg.post ? 'POST' : 'GET', url);
        if (arg.bin) xhr.responseType = 'arraybuffer';
        if (arg.type) xhr.setRequestHeader('Content-Type', arg.type);
        if (arg.host) xhr.setRequestHeader('Host', /https:\/\/([^/]+)/.exec(url)[1]);
        xhr.onload = ()=>{ cb_load(url, xhr.response, arg, xhr); }
        xhr.onerror = ()=>{ cb_timeout ? cb_timeout(url, arg, xhr) : console.log('error:' + url, xhr); }
        xhr.ontimeout = ()=>{ cb_timeout ? cb_timeout(url, arg, xhr) : console.log('timeout:' + url, xhr); }
        if (arg.post) {
            xhr.send(arg.post);
        } else {
            xhr.send();
        }
    } else {
        let param = {
            url : url,
            timeout : 5000,
            headers : {},
            onload(xhr) { cb_load(url, xhr.responseText, arg, xhr); },
            onerror(xhr) { cb_timeout ? cb_timeout(url, arg, xhr) : console.log('error:' + url, xhr); },
            ontimeout(xhr) { cb_timeout ? cb_timeout(url, arg, xhr) : console.log('timeout:' + url, xhr); },
        };

        if (arg.mobile) {
            param.headers['user-agent'] = 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1';
        }

        if (arg.host) {
            param.headers.Host = /https:\/\/([^/]+)/.exec(url)[1];
        }

        if (arg.type) {
            param.headers['Content-type'] = arg.type;
        }

        if (arg.headers) {
            param.headers = param.headers ? Object.assign(param.headers, arg.headers) : arg.headers;
        }

        if (arg.post) {
            param.method = 'POST';
            param.data = arg.post;
        }

        //console.log(param);

        GM_xmlhttpRequest(param);
    }
}

function on_play() {
    if (g_video == this) {
        return;
    } else if (g_video != null) {
        g_hls.destroy();
        //delete g_hls;

        g_video.pause();
        g_video.controls = false;
        g_video.style.cursor = 'pointer';
    }

    g_video = this;
    g_video.controls = true;
    g_video.style.cursor = 'default';

    g_hls = new Hls({ id : this.id });
/*
    // 自定义请求头
    const customHeaders = {
        //'Access-Control-Allow-Origin' : '*',
        'Host': 'vdo-avtaohua.sinw.net',
        'Referer': 'https://7w85.avtaohua-t0876.vip/'
    };

    // 设置xhrSetup来添加请求头
    g_hls.config.xhrSetup = (xhr, url) => {
        console.log(url, xhr)
        for (const [key, value] of Object.entries(customHeaders)) {
            xhr.setRequestHeader(key, value);
        }
    };
*/
    g_hls.attachMedia(this);
    g_hls.loadSource(this.id);
    g_hls.on(Hls.Events.MANIFEST_PARSED, function(){ g_video.play(); });
}

function video(id, vod, page) {
    document.getElementById('input').value = page;

    let div;
    let video;
    let content = document.getElementById('content');

    while (content.firstChild) { content.removeChild(content.firstChild); }

    for (let item of vod) {
        div = document.createElement("div");
        div.innerText = item.name;
        content.appendChild(div);

        video = document.createElement('video');
        video.id = item.src;
        video.onclick = on_play;
        video.style = 'cursor:pointer;max-height:500px';
        video.setAttribute('class', 'lozad');
        video.setAttribute('poster', item.img);
        if (g_web[id] && g_web[id].page.lzd.length > 0) video.setAttribute('lzd', id);
        content.appendChild(video);
    }

    lzd();

    window.scrollTo(0, 0);
}

function menu(id, data) {
    let option, select = document.getElementById('menu');

    let group = document.createElement('optgroup');
    group.label = id;
    select.appendChild(group);

    for (let item of data) {
        option = document.createElement('option');
        option.innerText = item.name;
        if (item.url) option.setAttribute('url', item.url);
        if (item.data) option.setAttribute('data', item.data);
        group.appendChild(option);
    }
}

function cb_timeout(url, arg, xhr) {
    let id = arg.id;
    let step = arg.step;
    let timeout = ++arg.timeout;
    let addr = url;
    let err = xhr.error ? xhr.error : xhr;

    let ret = /Refused to connect to "(.+?)": (.+)/.exec(xhr.error);

    if (ret) {
        err = ret[2];
        if (ret[2] == 'Request was redirected to a not whitelisted URL') {
            addr = ret[1];
            err += '\t' + ret[1];
        } else {
            timeout = 3;
        }
    }

    console.log(id, arg.menu ? 'menu' : 'addr ' + step, url, err);

    if (timeout >= 3) return;

    get(addr, cb_addr, arg, cb_timeout);
}

function cb_menu(url, html, arg, xhr) {
    let id = arg.id;
    let web = g_web[id];
    let data = web.menu.fun[0](url, html, arg, xhr);

    if (data.length <= 1) {
        console.log(id, 'menu.length <= 1', url, html);
        throw new Error();
    }

    menu(id, data);

    web.data.date = new Date().toLocaleDateString();

    GM_setValue(id, { data : web.data, menu : data, task : web.task });

    console.log(id, GM_getValue(id));

    task();
}

function cb_addr(url, html, arg, xhr) {
    let id = arg.id;
    let web = g_web[id];
    let step = arg.step;

    let next = web.addr.fun[step](url, html, arg, xhr);

    console.log(id, 'addr', step, next);

    if (step < (web.addr.fun.length - 1)) {
        arg.step++;
        arg.timeout = 0;
        get(next, cb_addr, arg, cb_timeout);
        return;
    }

    web.data.addr = next;

    arg = web.menu.beg(arg);

    get(rep(arg.url, web.data), cb_menu, arg, cb_timeout);
}

function addr(id) {
    let web = g_web[id];
    let date = new Date().toLocaleDateString();
    let value = GM_getValue(id);

    if (value) {
        web.data = value.data;

        if (value.data.task) {
            for (let task of value.task) {
                g_task.push(task);
            }
        }

        if (value.data.date == date) {
            menu(id, value.menu);
            task();
            return;
        }
    }

    let arg = web.addr.beg({ id : id, step : 0, timeout : 0 });

    get(web.addr.url, cb_addr, arg, cb_timeout);
}

function cb_page(url, html, arg, xhr) {
    let id = arg.id;
    let web = g_web[id];
    let tmp = web.page.dec(html, arg);
    let cnt = web.page.cnt(tmp, arg);
    let vod = web.page.fun(tmp, arg);

    video(id, vod, g_data.first ? cnt : arg.page_id);

    g_data.page_cnt = cnt;
}

function page(data) {
    let web = g_web[data.id];

    data = web.page.beg(data);

    let url = rep(data.url, web.data);

    //console.log('url:', url);

    get(url, cb_page, data);
}

function on_change(keydown) {
    let menu = document.getElementById('menu');
    let input = document.getElementById('input');
    let menu_item = menu.options[menu.selectedIndex];
    let menu_group = menu_item.parentNode;
    let menu_find = menu_group.childNodes[0];
    let web = g_web[menu_group.label];

    if (menu_group.label == 'm3') {
        video('m3', [{ name : input.value, img : '', src : input.value }], 0, 0);
        return;
    }

    g_data.id = menu_group.label;
    g_data.title = menu_item.innerText;
    g_data.page_id = 1;
    delete g_data.data;
    delete g_data.post;

    if (keydown && /^\d+$/.exec(input.value)) {
        g_data.page_id = Number(input.value);
    } else {
        if (keydown || g_data.title == 'find') {
            g_data.title = 'find';
            menu_item = menu_find;
            menu.selectedIndex = menu_find.index;
        }

        if (/\D+/.exec(input.value)) {
            g_data.input = input.value;
        }

        g_data.first = true;
        g_data.url = menu_item.getAttribute('url');
    }

    let tmp = menu_item.getAttribute('data');

    if (tmp) {
        g_data.data = tmp;
    }

    page(g_data);
}

main();

})();

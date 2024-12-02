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
// @connect      88av88av4325.cc
// @connect      88av4490.cc
// @connect      --dd--
// @connect      trafficmanager.net
// @connect      cucloud.cn
// @connect      bcebos.com
// @connect      410735.com
// @connect      kaitingmart.com
// @connect      xuezhumall.com
// @connect      --gg--
// @connect      ggsp4.cc
// @connect      kbuu061.top
// @connect      houduana.top
// @connect      --hd--
// @connect      ip.sb
// @connect      in101.org
// @connect      cu101.art
// @connect      cu101.bid
// @connect      cu101.city
// @connect      cu101.click
// @connect      cu101.fans
// @connect      cv101.quest
// @connect      cv101.tel
// @connect      cv101.vip
// @connect      cv101.work
// @connect      cv101.xyz
// @connect      cw101.art
// @connect      cw101.app
// @connect      cw101.beauty
// @connect      cw101.best
// @connect      cw101.biz
// @connect      cw101.bond
// @connect      cw101.casa
// @connect      cw101.cam
// @connect      cw101.cfd
// @connect      cw101.club
// @connect      cw101.rodeo
// @connect      cw101.sbs
// @connect      cw101.website
// @connect      cy101.asia
// @connect      cy101.bet
// @connect      cy101.biz
// @connect      cy101.blog
// @connect      cy101.casa
// @connect      cy101.cc
// @connect      cy101.center
// @connect      cy101.cfd
// @connect      cy101.click
// @connect      cy101.cloud
// @connect      cy101.dance
// @connect      cy101.gdn
// @connect      cy101.wtf
// @connect      cy101.hair
// @connect      cy101.lat
// @connect      cy101.link
// @connect      cy101.live
// @connect      cy101.love
// @connect      cy101.makeup
// @connect      cy101.monster
// @connect      cy101.one
// @connect      cy101.onl
// @connect      cy101.org
// @connect      cy101.run
// @connect      cy101.shop
// @connect      cy101.site
// @connect      cy101.skin
// @connect      cy101.store
// @connect      cy101.tel
// @connect      cy101.today
// @connect      cy101.uno
// @connect      --hl--
// @connect      300507.com
// @connect      cdjwfd.com
// @connect      6hei.tv
// @connect      944683.com
// @connect      fkrdl.com
// @connect      974601.com
// @connect      nbqygl.com
// @connect      584095.com
// @connect      --ht--
// @connect      github.com
// @connect      ht573op.vip
// @connect      ht581op.vip
// @connect      --xj--
// @connect      134.122.173.8
// @connect      dxj5577.com
// @connect      7wzx9.com
// @connect      --xx--
// @connect      31xx4587a.cc
// @connect      31xx4990a.cc
// @connect      --uy--
// @connect      vfzugbeoxg1.xyz
// @connect      coff.98vm.com
// ==/UserScript==

var g_hls = null;
var g_video = null;
var g_list = [];
var g_data = {
    id : '',
    url : '',
    page_id : 0,
    page_min : 0
}
var g_web = {
    av : {
        data : {
            min : 1
        },
        addr : {
            beg : 'https://88av88av4325.cc', // dz.88av@mailauto.org
            fun : [
                (url, html, arg, xhr)=>{
                    g_web.av.data.addr = /6<\/h2>[\s\S]+?href="(.+?)"/.exec(html)[1];
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
                (html, arg)=>{
                    let url, menu = [{ name : 'find', url : rep(g_web.av.menu.url[1], g_web.av.data) }];
                    for (let ret, reg = /"?nav-item"?><a\s+href="?\/([^">]+)"?>([^<\s]+)/g; ret = reg.exec(html);) {
                        url = rep(g_web.av.menu.url[2],g_web.av.data);
                        menu.push({ name : ret[2], url : rep(url, ret) });
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
                let ret = /data-total-page="(\d+)"/.exec(html);
                return ret ? ret[1] : 1;
            },
            fun : (html, arg)=>{
                let vod = [];
                for (let ret, reg = /<img alt="(.+?)"[\s\S]+?(https:\/\/.+?\/videos(\/.+?\/)cover\/5_505_259)/g; ret = reg.exec(html);) {
                    vod.push({ name : ret[1], img : ret[2] + '.webp', m3u8 : g_web.av.data.vod + '/videos' + ret[3] + 'g.m3u8?h=3121efe8979c635' });
                }
                return vod;
            },
            lzd : []
        }
    },
    dd : {
        data : {
            min : 1
        },
        addr : {
            beg : 'https://fbkp.trafficmanager.net:9527/index.html',
            fun : [
                (url, html, arg, xhr)=>{
                    return atob(/"url": "(.+?)"/.exec(html)[1]) + '1234';
                },
                (url, html, arg, xhr)=>{
                    g_web.dd.data.enc = /window.CONFIG = "(.+?)";/.exec(html)[1];
                    return 'https://' + /defer="defer" src="(.+?)"/.exec(html)[1];
                },
                (url, html, arg, xhr)=>{
                    g_web.dd.data.key = /a="([^"]{40,})"/.exec(html)[1];
                    let j = JSON.parse(fer(g_web.dd.data.enc, g_web.dd.data.key));
                    g_web.dd.data.img = 'https://' + j.video_img_url;
                    g_web.dd.data.vod = 'https://' + j.video_play_url_list[0].url[0];
                    delete g_web.dd.data.enc;
                    return 'https://' + j.api_url;
                }
            ]
        },
        menu : {
            url : [
                '{ADDR}/api/vod/tag_group?page=1&per_page=1000&site_id=6&channel_id=523',
                '{ADDR}/search/?page={PAGE}&per_page=30&search={INPUT}',
                '{ADDR}/api/vod/video?page={PAGE}&per_page=30&tag={1}'
            ],
            beg : (data)=>{
                data.url = g_web.dd.menu.url[0];
                data.menu = true;
                return data;
            },
            fun : [
                (html, arg)=>{
                    html = g_web.dd.page.dec(html);
                    let data = JSON.parse(html).data;
                    let menu = [{ name : 'find', url : rep(g_web.dd.menu.url[1], g_web.dd.data) }];
                    for (let i of [14, 18, 25]) {
                        for (let j = 0; j < data.items[i].tag.length;j++) {
                            if (data.items[i].tag[j].target == '' && data.items[i].tag[j].name.length > 2) {
                                menu.push({ name : data.items[i].tag[j].name, url : g_web.dd.data.addr + '/api/vod/video?page={PAGE}&per_page=30&tag=' + data.items[i].tag[j].id});
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
                return fer(JSON.parse(html)['x-data'], g_web.dd.data.key);
            },
            cnt : (html, arg)=>{
                let ret = /"total":(\d+)/.exec(html);
                return ret ? Math.ceil(ret[1] / 30) : 0;
            },
            fun : (html, arg)=>{
                let vod = [];
                for (let ret, reg = /"id":(\d+),"name":"([^"]+)","product/g; ret = reg.exec(html);) {
                    vod.push({ name : ret[2], img : ret[1], m3u8 : ret[1] });
                }
                return vod;
            },
            lzd : [
                (dom)=>{
                    get(g_web.dd.data.addr + '/api/vod/video/' + dom.id, g_web.dd.page.lzd[1], { 'xml' : true, dom : dom, img : g_web.dd.data.img, vod : g_web.dd.data.img });
                },
                (url, html, arg, xhr)=>{
                    html = g_web.dd.page.dec(html);
                    arg.dom.id = arg.vod + /"play_url":"(.+?)"/.exec(html)[1];
                    get(arg.img + /"pic":"(.+?)"/.exec(html)[1], g_web.dd.page.lzd[2], arg);
                },
                (url, html, arg, xhr)=>{
                    let img = html.split("@@@");
                    arg.dom.poster = fer(img[0], g_web.dd.data.key) + img[1];
                }
            ]
        }
    },
    gg : {
        data : {
            min : 1
        },
        addr : {
            beg : 'http://ggsp4.cc/jkmh/gg.html',
            fun : [
                (url, html, arg, xhr)=>{
                    g_web.gg.data.addr = /urlMap = \[\s*"(https:\/\/.+?)\//.exec(html)[1];
                    return g_web.gg.data.addr + '/js/base.js';
                },
                (url, html, arg, xhr)=>{
                    g_web.gg.data.api = /domain = "(https:\/\/.+?)\//.exec(html)[1];
                    g_web.gg.data.key = /my = "(.+?)"/.exec(html)[1];
                    return g_web.gg.data.api;
                },
                (url, html, arg, xhr)=>{
                    return g_web.gg.data.addr;
                }
            ]
        },
        menu : {
            url : [
                '{ADDR}/js/api.js',
                '{API}/api.php/index/getShiPinList?currentPage={PAGE}&wd={INPUT}',
                '{API}/api.php/index/getShiPinList?currentPage={PAGE}&id={1}'
            ],
            beg : (data)=>{
                data.url = g_web.gg.menu.url[0];
                data.menu = true;
                return data;
            },
            fun : [
                (html, arg)=>{
                    let url, menu = [{ name : 'find', url : rep(g_web.gg.menu.url[1], g_web.gg.data) }];
                    for (let ret, reg = /"id": ((?!1)\d+),\s+"name": "(.+?)",/g; ret = reg.exec(html);) {
                        url = rep(g_web.gg.menu.url[2],g_web.av.data);
                        menu.push({ name : ret[2], url : rep(url, ret) });
                    }
                    return menu;
                }
            ]
         },
        page : {
            beg : (data)=>{
                g_web.gg.data.page = data.page_id;
                g_web.gg.data.input = data.input;
                return data;
            },
            dec : (html, arg)=>{
                let txt = html.split('"').join('').split('\\').join('');
                return aes(txt, g_web.gg.data.key);
            },
            cnt : (html, arg)=>{
                let ret = /"count":(\d+)/.exec(html); return ret ? Math.ceil(ret[1] / 30) : 0;
            },
            fun : (html, arg)=>{
                let vod = [];
                for (let ret, reg = /"vod_id":(\d+),"vod_pic":"(.+?)","vod_blurb":"(.+?)"/g; ret = reg.exec(html);) {
                    vod.push({ name : str(ret[3], true), img : ret[2].split('\\').join(''), m3u8 : ret[1] });
                }
                return vod;
            },
            lzd : [
                (e)=>{
                    get(g_web.gg.data.api + '/api.php/index/getDetail?id=' + e.id, g_web.gg.page.lzd[1], {'xml':true, e:e});
                },
                (url, html, arg, xhr)=>{
                    let t = g_web.gg.page.dec(html);
                    arg.e.id = /"vod_play_url":"(.+?)"/.exec(t)[1].split('\\').join('');
                }
            ]
        }
    },
    hd : {
        data : {
            min : 1
        },
        addr : {
            beg : 'https://api.ip.sb/geoip',//url@avhd101.email
            fun : [
                (url, html, arg, xhr)=>{
                    g_web.hd.data.ip = /"ip":"(.+?)"/.exec(html)[1];
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
                    return result;
                }
            ]
        },
        menu : {
            url : [
                '{ADDR}/?&time=1',
                '{ADDR}/search?q={INPUT}&p={PAGE}',
                '{ADDR}/{1}?page={PAGE}'
            ],
            beg : (data)=>{
                data.url = g_web.hd.menu.url[0];
                data.menu = true;
                return data;
            },
            fun : [
                (html, arg)=>{
                    html = g_web.hd.page.dec(html);
                    let page, url;
                    let value = GM_getValue('hd');
                    let cnt = { 'hd' : 3161, 'chinese' : 1770, 'uncensored' : 214, 'rank/today' : 5 };
                    let menu = [ { name : 'find', url : rep(g_web.hd.menu.url[1], g_web.hd.data) } ];
                    for (let ret, reg = /itemprop="url" href="\/(?!category)([^"]+)">([^<>]+)</g; ret = reg.exec(html);) {
                        page = (value && value.data && value.data[ret[2]]) ? value.data[ret[2]] : cnt[ret[1]];
                        if (page == undefined) continue;
                        url = rep(g_web.hd.menu.url[2], g_web.hd.data);
                        url = rep(url, ret);
                        menu.push({ name : ret[2], url : url });
                        g_list.push({ url : url.replace('{PAGE}', ++page), fun : g_web.hd.menu.fun[1], arg : { name : ret[2], page : page } });
                    }
                    return menu;
                },
                (url, html, arg, xhr)=>{
                    html = g_web.hd.page.dec(html);
                    if (/R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==/.exec(html)) {
                        get(url.replace(/\d+$/, ++arg.page), g_web.hd.menu.fun[1], arg);
                    } else {
                        g_web.hd.data[arg.name] = --arg.page;
                        let value = GM_getValue('hd');
                        value.data[arg.name] = arg.page;
                        GM_setValue('hd', value);
                        console.log('hd', arg.name, arg.page);
                    }
                }
            ]
        },
        page : {
            beg : (data)=>{
                g_web.hd.data.page = data.page_id;
                g_web.hd.data.input = data.input;
                return data;
            },
            dec : (html, arg)=>{
                return utf(atob(/ec='(.+?)'/.exec(html)[1]));
            },
            cnt : (html, arg)=>{
                if (arg.title == 'find') {
                    let ret = /class="pagenum">[^(]+\([^\d]+(\d+)/.exec(html);
                    return ret ? Math.ceil(ret[1] / 60) : 0;
                } else {
                    return g_web.hd.data[arg.title];
                }
            },
            fun : (html, arget)=>{
                let vod = [];
                for (let ret, reg = /(https:\/\/[^/]+\/[^/]+\/images\/[^'"]+)[\s\S]+?<a href="\/watch\?v=(.+?)" itemprop="url">(\s+<span itemprop="name">)?([^<]+)</g;
                     ret = reg.exec(html);) {
                    vod.push({ name : ret[4], img : ret[1], m3u8 : ret[2] });
                }
                return vod;
            },
            lzd : [
                (dom)=>{
                    dom.id = g_web.hd.data.addr + '/pv/' + dom.id + '.m3u8?px=' +
                             btoa(dom.id.substring(2,6) + 'prefix=/'+dom.id + '/preview&server=tc&&id='+dom.id + '&ip='+g_web.hd.data.ip + '&expire='+(Math.round(Date.now()/1000)+600));
                    get(dom.poster, g_web.hd.page.lzd[1], { 'xml' : true, dom : dom });
                },
                (url, html, arg, xhr)=>{
                    arg.dom.poster = 'data:image/jpeg;base64,' + html.substring(6, html.length - 2);
                }
            ]
        }
    },
    hl : {
        data : {
            min : 0,
            find : 0
        },
        addr : {
            beg : 'https://300507.com/config.js',
            fun : [
                (url, html, arg, xhr)=>{
                    return /'(.+?)'/.exec(html)[1] + '/pages/go/300507.com/home.json';
                },
                (url, html, arg, xhr)=>{
                    return aes(/"json_data":"(.+?)"/.exec(html)[1], 'zH3JDuCRXVGa3na7xbOqpx1bw6DAkbTP');
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
                    html = aes(/"json_data":"(.+?)"/.exec(html)[1], 'zH3JDuCRXVGa3na7xbOqpx1bw6DAkbTP');
                    return /"jumpDomain":"(.+?)"/.exec(html)[1];
                },
                (url, html, arg, xhr)=>{
                    g_web.hl.data.vod = /2",2,"(https:\/\/.+?)"/.exec(html)[1];
                    g_web.hl.data.addr = /"(https:\/\/[^"]+)",\[/.exec(html)[1];
                    return /crossorigin href="(.+?)"/.exec(html)[1];
                },
                (url, html, arg, xhr)=>{
                    g_web.hl.data.key = /defaultSecretKey:"(.+?)"/.exec(html)[1];
                    return url.replace(/\/[^\/]+$/, /"\/search",.+?import\("\.(.+?)"\)/.exec(html)[1]);
                },
                (url, html, arg, xhr)=>{
                    g_web.hl.data.search = /k="(.+?)";\(window.location.hostname==="localhost"/.exec(html)[1];
                    return g_web.hl.data.addr;
                }
            ]
        },
        menu : {
            url : [
                '{ADDR}/pages/{TENANTID}/{WEBSITEID}/home/home.json',
                '{SEARCH}/search?text={INPUT}',
                '{ADDR}/pages/{TENANTID}/{WEBSITEID}/water/{1}/{PAGE}.json'
            ],
            beg : (data)=>{
                data.url = g_web.hl.menu.url[0];
                data.menu = true;
                return data;
            },
            fun : [
                (html, arg)=>{
                    let d = JSON.parse(html);
                    let j = JSON.parse(aes(d.json_data, g_web.hl.data.key));
                    let data = j.tabs[2].channelList;
                    let tmp, url, page;
                    let value = GM_getValue('hl');
                    let cnt = {
                        '1836636258456862722' : 135,'1836638166510841858' : 57,'1836638321423286274' : 16,'1838893473370796033' : 28,
                        '1836636931053441026' : 126,'1836638635517935617' : 34,'1836639219297931266' : 20,'1838847758462455810' : 79,
                        '1836637230514163713' : 78, '1836638914518831106' : 22,'1836639025110056962' : 54,'1838892794984185858' : 91,
                        '1836637472047345665' : 76, '1836638717539549185' : 17,'1836638524979052546' : 17,'1838844081720967170' : 33,
                        '1838057717840576513' : 10, '1836637878462820353' : 28,'1838837573832511489' : 79,'1838847148595933186' : 36,
                        '1836637986105458690' : 69, '1836638857375633410' : 7, '1838893403489615874' : 32,'1838844944606740482' : 48,
                        '1838881547295191042' : 57,
                        '1838837712016031746' : 26
                    };
                    let menu = [ { name : 'find', url : rep(g_web.hl.menu.url[1], g_web.hl.data) } ];
                    for (let item of j.tabs[2].channelList) {
                        page = (value && value.data && value.data[item.name]) ? value.data[item.name] : cnt[item.id];
                        if (page == undefined) continue;
                        tmp = rep(g_web.hl.menu.url[2], g_web.hl.data);
                        url = tmp.replace('{1}', item.id);
                        menu.push({ name : item.name, url : url });
                        g_list.push({ url : url.replace('{PAGE}', ++page), fun : g_web.hl.menu.fun[1], arg : { name : item.name, url : tmp, page : page } });
                    }
                    return menu;
                },
                (url, html, arg, xhr)=>{
                    if (xhr.status == 200) {
                        get(arg.url.replace('{PAGE}', ++arg.page), g_web.hl.menu.fun[1], arg);
                    } else {
                        g_web.hl.data[arg.name] = --arg.page;
                        let value = GM_getValue('hl');
                        value.data[arg.name] = arg.page;
                        GM_setValue('hl', value);
                        console.log('hl', arg.name, arg.page);
                    }
                }
            ],
        },
        page : {
            beg : (data)=>{
                g_web.hl.data.page = data.page_id;
                g_web.hl.data.input = data.input;
                return data;
            },
            dec : (html, arg)=>{
                if (arg.title == 'find') {
                    let data = '';
                    for (let ret, reg = /"id":"(\d+)","title":"(.+?)","mainImgUrl":"(.+?)"/g; ret = reg.exec(html);) {
                        data += '"id":"' + ret[1] + '","mainImgUrl":"' + ret[3] + '","title":"' + ret[2] + '"';
                    }
                    return data;
                } else {
                    return aes(JSON.parse(html).json_data, g_web.hl.data.key);
                }
            },
            cnt : (html, arg)=>{
                return g_web.hl.data[arg.title];
            },
            fun : (html, arg)=>{
                let vod = [];
                for (let ret, reg = /"id":"(\d+)","mainImgUrl":"(.+?)".+?"title":"(.+?)"/g; ret = reg.exec(html);) {
                    vod.push({ name : ret[3], img : g_web.hl.data.addr + '/' + ret[2], m3u8 : ret[1] });
                }
                return vod;
            },
            lzd : [
                (dom)=>{
                    get(g_web.hl.data.addr + '/pages/detail/' + dom.id + '.json', g_web.hl.page.lzd[1], dom);
                },
                (url, html, arg, xhr)=>{
                    let j = JSON.parse(html);
                    j = JSON.parse(aes(j.json_data, g_web.hl.data.key));
                    arg.id = g_web.hl.data.vod + '/' + j.videoUrlList[0].videoUrl.replace('700kb', '1200kb');
                }
            ]
        }
    },
    ht : {
        data : {
            min : 1
        },
        addr : {
            beg : 'https://github.com/htapp/htapp',// hongtaoav2@gmail.com
            fun : [
                (url, html, arg, xhr)=>{
                    return 'https://www.ht573op.vip:9527';//'https://' + /https:\/\/<\/p>\s+<p dir="auto">([^<]+)/.exec(html)[1];
                },
                (url, html, arg, xhr)=>{
                    return /targetSites = \[\s+'(.+?)'/.exec(html)[1];// + '/ht/index.html';
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
                (html, arg)=>{
                    let url, menu = [{ name : 'find', url : rep(g_web.ht.menu.url[1], g_web.ht.data) }];
                    for (let ret, reg = /(type\/(?!game)(?!chigua)(?!nvyou)(?!cy)(?!tongchengjiaoyou).+?)" class="menu-link">(.+?)</g; ret = reg.exec(html);) {
                        url = rep(g_web.ht.menu.url[2],g_web.ht.data);
                        menu.push({ name : str(ret[2]), url : rep(url, ret) });
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
                return ret ? 0 : 1;
            },
            fun : (html, arg)=>{
                let vod = [];
                for (let ret, reg = /data-original="((https:\/\/.+?)\/upload\/vod\/\d+-\d+\/[0-9a-f]+_xfile.jpg)".+?(\/video\/m3u8\/\d+\/\d+\/[0-9a-f]+\/).+?"vod-title">(.+?)</g;
                     ret = reg.exec(html);) {
                    vod.push({ name : ret[4], img : ret[1], m3u8 : ret[2].replace('tp.', 'ts.') + ret[3] + 'index.m3u8' });
                }
                return vod;
            },
            lzd : [
                (dom)=>{
                    get(dom.poster, g_web.ht.page.lzd[1], { 'xml' : true, bin : true, dom : dom });
                },
                (url, html, arg, xhr)=>{
                    let bin = [], data = new Uint8Array(html);
                    for (let i = 0; i < data.byteLength; i++) bin += String.fromCharCode(data[i] ^ 0x88);
                    arg.dom.poster = 'data:image/jpeg;base64,' + btoa(bin);
                }
            ]
        }
    },
    xj : {
        data : {
            min : 1
        },
        addr : {
            beg : 'https://dxj5577.com/js/base41.js', //https://134.122.173.8:8083/dxjgg/abs.js
            fun : [
                (url, html, arg, xhr)=>{
                    return /"(https:\/\/.+?)\/forward"/.exec(html)[1];
                }
            ]
        },
        menu : {
            url : [
                '{ADDR}/getDataInit',
                '{ADDR}/forward',
                '{ADDR}/forward'
            ],
            beg : (data)=>{
                data.url = g_web.xj.menu.url[0];
                data.post = '{"name":"John","age":31,"city":"New York"}';
                data.menu = true;
                return data;
            },
            fun : [
                (html, arg)=>{
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
                                name : j.typeName2, url : rep(g_web.xj.menu.url[2], g_web.xj.data),
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
                data.post = rep(data.data, g_web.xj.data);
                return data;
            },
            dec : (html, arg)=>{
                return html;
            },
            cnt : (html, arg)=>{
                let ret = /"count":"(\d+)"/.exec(html);
                return ret ? Math.ceil(ret[1] / 20) : 0;
            },
            fun : (html, arg)=>{
                let vod = [];
                for (let tmp, ret, reg = /(\/video\/m3u8\/\d+\/\d+\/[0-9a-f]+\/).+?vod_name":"(.+?)".+?vod_server_id":(\d+)/g; ret = reg.exec(html);) {
                    tmp = g_web.xj.data.group[ret[3]];
                    vod.push({ name : ret[2], img : tmp.PIC_LINK_1 + ret[1] + '1.jpg', m3u8 : tmp.LINK_1 + ret[1] + 'playlist.m3u8' });
                }
                return vod;
            },
            lzd : []
        }
    },
    xx : {
        data : {
            min : 1
        },
        addr : {
            beg : 'https://2.31xx4587a.cc', //31xxcom@gmail.com
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
                (html, arg)=>{
                    html = g_web.xx.page.dec(html);
                    let url, menu = [{ name : 'find', url : rep(g_web.xx.menu.url[1], g_web.xx.data) }];
                    for (let ret, reg = /href="\/(type\/(?!28)(?!29)\d+)">([^&].+?)</g; ret = reg.exec(html);) {
                        url = rep(g_web.xx.menu.url[2],g_web.xx.data);
                        menu.push({ name : ret[2], url : rep(url, ret) });
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
                return ret ? ret[1] : 0;
            },
            fun : (html, arg)=>{
                let vod = [];
                for (let ret, reg = /"(\/play\/[0-9a-z]+)"[\s\S]+?data-original="(.+?)"[\s\S]+?"rank-title">(.+?)</g; ret = reg.exec(html);) {
                    vod.push({ name : str(ret[3]), img : ret[2], m3u8 : g_web.xx.data.addr + ret[1] });
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
        data : {
            min : 1,
            find : 0
        },
        addr : {
            beg : 'https://vfzugbeoxg1.xyz/ui/movie/main',
            fun : [
                (url, html, arg, xhr)=>{
                    let ret = /src="(https:\/\/[^\/]+)\/ui\/js\/config-([0-9a-z]+).js"/.exec(html);
                    g_web.yk.data.addr = ret[1]
                    g_web.yk.data.config = ret[2];
                    g_web.yk.data.search = 'https://vfzugbeoxg1.xyz';
                    arg.xml = true;
                    arg.post = 'data=' + encodeURIComponent(g_web.yk.reqData('/api/dance/loadSysConfig', {}, 2)) +
                               '&key=' + encodeURIComponent(g_web.yk.randomString(10) + btoa(g_web.yk.randomString(10) + new Date().getTime() + Math.ceil(Math.random() * 100)))
                    return g_web.yk.data.search + '/ui/open_api/data';
                },
                (url, html, arg, xhr)=>{
                    delete arg.xml;
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
                '{SEARCH}/ui/open_api/data',
                '{ADDR}/ui/open_api/data_{CHECK}.js?data={DATA}'
            ],
            beg : (data)=>{
                data.url = g_web.yk.menu.url[0];
                data.menu = true;
                return data;
            },
            fun : [
                (html, arg)=>{
                    let menu = [ { name : 'find', url : rep(g_web.yk.menu.url[1], g_web.yk.data) } ];
                    let cnt = {//    15         26           37         47         56         67         78         88         101         119       132
                        1006 : 1400, 2001 : 2,  10000 : 1,   7001 : 38, 3011 : 49, 6001 : 43, 4001 : 61, 5006 : 54, 11001 : 1, 8000 : 201, 9000 : 8, 13013 : 174,
                        1000 : 85,   2010 : 3,  10001 : 202, 7012 : 35, 3001 : 49, 6002 : 2,  4002 : 7,  5012 : 1,  11002 : 2, 8001 : 3,   9001 : 1, 13001 : 174,
                        1001 : 61,   2002 : 38, 10002 : 105, 7011 : 35, 3002 : 2,  6012 : 43, 4003 : 2,  5001 : 1,  36 : 180,  8002 : 6,   9002 : 1, 13002 : 39,
                        1010 : 3,    2012 : 4,  10003 : 21,  7002 : 15, 3003 : 1,  6003 : 1,  4004 : 8,  5008 : 54, 33 : 192,  8003 : 2,   9003 : 5, 13003 : 71,
                        1016 : 192,  2003 : 16, 10004 : 4,   7005 : 3,  3006 : 1,  6004 : 2,  4005 : 3,  5002 : 1,  32 : 1400, 8004 : 2,   9004 : 5, 13004 : 71,
                        1012 : 26,   2007 : 49, 10005 : 2,   7006 : 1,  3004 : 5,  6005 : 2,  4006 : 17, 5009 : 11, 34 : 1400, 8018 : 7,   9005 : 2, 13012 : 5,
                        1004 : 7,    2009 : 1,  10008 : 2,   7007 : 2,  3005 : 2,  6006 : 1,  4007 : 1,  5003 : 2,  22 : 1400, 8005 : 2,   9008 : 1, 13006 : 2,
                        1014 : 19,   2014 : 2,  10009 : 2,   7008 : 1,  3007 : 1,  6007 : 1,  4008 : 1,  5010 : 4,  21 : 1400, 8008 : 4,   9009 : 1, 13004 : 3,
                        1003 : 174,  2013 : 1,  10010 : 13,  7009 : 1,  3008 : 1,  6009 : 43, 4009 : 2,  5007 : 3,  20 : 1400, 8009 : 2,   9010 : 2, 13005 : 2,
                        1013 : 42,   2004 : 7,  10011 : 2,   7010 : 2,             6010 : 1,  4010 : 1,  5005 : 1,  24 : 1400, 8010 : 2,   9011 : 2, 13011 : 1,
                        1002 : 15,   2008 : 85, 10006 : 198,                       6011 : 1,  4011 : 61,            23 : 1400, 8011 : 2,   9013 : 2, 13007 : 1,
                        1005 : 44,                                                                                  37 : 42,   8006 : 5,   9006 : 1, 13008 : 2,
                        1009 : 9,                                                                                   35 : 179,  8012 : 1,   9012 : 1,
                        1008 : 1400,                                                                                           8013 : 1,
                                                                                                                               8014 : 2,
                                                                                                                               8015 : 1,
                                                                                                                               8016 : 5,
                                                                                                                               8017 : 205,
                    };
                    let value = GM_getValue('hl');
                    for (let t, j, ret, reg = /"([^"]+)";sessionStorage.setItem\("dance_mh_resource_view_2_\d+_\d+"/g; ret = reg.exec(html);) {
                        t = ret[1].split("").reverse().join("");
                        t = decodeURIComponent(atob(t));
                        j = JSON.parse(t);
                        for (let i of j) {
                            menu.push( { name : i.name, url : rep(g_web.yk.menu.url[2], g_web.yk.data), data : JSON.stringify({ id : i.id, mode : i.dataSourceMode }) });
                            let page = (value && value.data && value.data[i.name]) ? value.data[i.name] : cnt[i.id];
                            if (page == undefined) continue;
                            let data = g_web.yk.getData(i.id, i.dataSourceMode, ++page);
                            let check = g_web.yk.getCheck(data);
                            let url = g_web.yk.menu.url[2].replace('{ADDR}', g_web.yk.data.addr);
                            url = url.replace('{DATA}', data);
                            url = url.replace('{CHECK}', check);
                            g_list.push({ url : url, fun : g_web.yk.menu.fun[1], arg : { id : i.id, name : i.name, mode : i.dataSourceMode, page : page } });
                        }
                    }
                    return menu;
                },
                (url, html, arg, xhr)=>{
                    html = g_web.yk.page.dec(html);
                    let j = JSON.parse(html);
                    if (j.data == undefined) return;
                    if (j.data.length != 0) {
                        console.log(url, arg, j);
                        let data = g_web.yk.getData(arg.id, arg.mode, ++arg.page);
                        let check = g_web.yk.getCheck(data);
                        url = g_web.yk.menu.url[2].replace('{ADDR}', g_web.yk.data.addr);
                        url = url.replace('{DATA}', data);
                        url = url.replace('{CHECK}', check);
                        get(url, g_web.yk.menu.fun[1], arg);
                    } else {
                        g_web.yk.data[arg.name] = --arg.page;
                        let value = GM_getValue('yk');
                        value.data[arg.name] = arg.page;
                        GM_setValue('yk', value);
                        console.log('yk', arg.name, arg.page);
                    }
                }
            ]
        },
        page : {
            beg : (data)=>{
                console.log(data);
                if (data.title == 'find') {
                    data.xml = true;
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
                  var f = [];
                  var e = a.length - 10;
                  var g = Math.floor(e / 10);
                  var h = 0;
                  for (var c = 0; c < 10; c++) {
                      var b = c * g + 1 + c;
                      var d = a.substring(b, b + g);
                      d = d.split("");
                      d = d.reverse().join("");
                      f.push(d);
                      h = b + g;
                  }
                  f.push(a.substring(h + 1).split("").reverse().join(""));
                  f = f.join("");
                  a = decodeURIComponent(atob(f));
                  a = a.replace(/[\r\n\s+]/g, " ");
                  return a;
            },
            cnt : (html, arg)=>{
                return g_web.yk.data[arg.title];
            },
            fun : (html, arg)=>{
                let vod = [];
                for (let ret, reg = /"title":"(.+?)".+?"url":"(.+?)".+?"verticalCover":"(.+?)"/g; ret = reg.exec(html);) {
                    vod.push({ name : ret[1], img : g_web.yk.data.vod + ret[3], m3u8 : g_web.yk.data.vod + ret[2] });
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
    }
};

function init() {
    //set('av');
    //set('dd');
    //set('gg');
    //set('hd');
    //set('hl');
    //set('ht');
    //set('xj');
    //set('xx');
    //set('yk');

    //GM_deleteValue('av');
    //GM_deleteValue('dd');
    //GM_deleteValue('gg');
    //GM_deleteValue('hd');
    //GM_deleteValue('hl');
    //GM_deleteValue('ht');
    //GM_deleteValue('xj');
    //GM_deleteValue('xx');
    //GM_deleteValue('yk');

    g_web.key = key(g_web);
    console.log(g_web.key);

    function set(k) {
        let v = GM_getValue(k);
        v.date = '2024/10/23';
        delete v.data;
        GM_setValue(k, v);
    }

    function key(o) {
        return Object.entries(o).map(([key, value]) => (key));
    }
}

function main() {
    for (let i of GM_listValues()) console.table(i, GM_getValue(i));

    document.onkeydown = on_keydown;

    document.body = document.createElement('body');

    let div = document.createElement('div');
    div.style = 'position:fixed;right:0px;padding:1px 4px 4px;background:#CCFFFF';
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

    select('m3', [{ name : 'play', url : '{INPUT}' }]);

    addr(0);

    let timer = setInterval(()=>{
        if (g_list.length == 0) return;
        get(g_list[0].url, g_list[0].fun, g_list[0].arg);
        g_list.splice(0, 1);
    }, 20);

    setTimeout(()=>{ clearInterval(timer) }, 10000);
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
        xhr.open(arg.post ? 'POST' : 'GET', url);
        if (arg.bin) xhr.responseType = 'arraybuffer';
        if (arg.post) xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = ()=>{ cb_load(url, xhr.response, arg, xhr); }
        xhr.onerror = ()=>{ cb_timeout ? cb_timeout(url, xhr, arg) : console.log('error:' + url, xhr); }
        xhr.ontimeout = ()=>{ cb_timeout ? cb_timeout(url, xhr, arg) : console.log('timeout:' + url, xhr); }
        if (arg.post) {
            xhr.send(arg.post);
        } else {
            xhr.send();
        }
    } else {
        let param = {
            url : url,
            timeout : 5000,
            headers : { 'Content-type' : 'application/json' },
            onload(xhr) { cb_load(url, xhr.responseText, arg, xhr); },
            onerror(xhr) { cb_timeout ? cb_timeout(url, xhr, arg) : console.log('error:' + url, xhr); },
            ontimeout(xhr) { cb_timeout ? cb_timeout(url, xhr, arg) : console.log('timeout:' + url, xhr); },
        };

        if (arg.post) {
            param.method = 'POST';
            param.data = arg.post;
            console.log(arg.post);
        }

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

function video(id, vod, page_id, page_cnt) {
    document.getElementById('page_num').innerText = page_id + '/' + page_cnt;

    let div;
    let video;
    let content = document.getElementById('content');

    while (content.firstChild) { content.removeChild(content.firstChild); }

    for (let item of vod) {
        div = document.createElement("div");
        div.innerText = item.name;
        content.appendChild(div);

        video = document.createElement('video');
        video.id = item.m3u8;
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

function select(id, menu) {
    let option, select = document.getElementById('menu');

    let group = document.createElement('optgroup');
    group.label = id;
    select.appendChild(group);

    for (let item of menu) {
        option = document.createElement('option');
        option.innerText = item.name;
        if (item.url) option.setAttribute('url', item.url);
        if (item.data) option.setAttribute('data', item.data);
        group.appendChild(option);
    }
}

function cb_timeout(url, xhr, arg) {
    let id = arg.id;
    let step = arg.step;
    let timeout = ++arg.timeout;
    let web = g_web[id];
    let addr = web.addr;

    console.log(id, arg.menu ? 'menu' : step, timeout, url, xhr.error ? xhr.error : xhr);

    if (/Refused to connect to ".+?"/.exec(xhr.error)) return;

    if (timeout >= 3) return;

    get(url, cb_addr, arg, cb_timeout);
}

function cb_menu(url, html, arg, xhr) {
    let i = arg.i;
    let id = arg.id;
    let web = g_web[id];
    let date = new Date().toLocaleDateString();

    let menu = web.menu.fun[0](html, arg);

    if (menu.length <= 1) {
        console.log(id, 'menu.length <= 1', url, html);
        return;
    }

    select(id, menu);

    GM_setValue(id, {date : date, menu : menu, data : web.data});

    console.log(id, 'set', GM_getValue(id));

    if (i < g_web.key.length - 1) addr(i + 1);
}

function cb_addr(url, html, arg, xhr) {
    let id = arg.id;
    let web = g_web[id];
    let step = arg.step;

    let next = web.addr.fun[step](url, html, arg, xhr);

    console.log(id, step, url, next);

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

function addr(i) {
    if (i >= g_web.key.length) return;

    let id = g_web.key[i]
    let web = g_web[id];
    let date = new Date().toLocaleDateString();
    let value = GM_getValue(id);

    if (value && value.date == date) {
        web.data = value.data;
        select(id, value.menu);
        addr(i + 1);
        return;
    }

    get(web.addr.beg, cb_addr, {i : i, id : id, step : 0, timeout : 0}, cb_timeout);
}

function cb_page(url, html, arg, xhr) {
    let id = arg.id;
    let web = g_web[arg.id];
    let htm = web.page.dec(html, arg);
    let cnt = web.page.cnt(htm, arg);
    let vod = web.page.fun(htm, arg);

    video(id, vod, arg.page_id, cnt);

    g_data.page_cnt = cnt;
}

function page(data) {
    let web = g_web[data.id];

    data = web.page.beg(data);

    let url = rep(data.url, web.data);

    console.log('url:', url);

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
        video('m3', [{ name : input.value, img : '', m3u8 : input.value }], 0, 0);
        return;
    }

    g_data.id = menu_group.label;
    g_data.title = menu_item.innerText;
    g_data.page_id = web.data.min;
    g_data.page_min = g_data.page_id;
    delete g_data.data;
    delete g_data.post;

    let tmp = menu_item.getAttribute('data');

    if (tmp) {
        g_data.data = tmp;
    }

    if (keydown && /^\d+$/.exec(input.value)) {
        g_data.page_id = Number(input.value);
    } else {
        if (keydown || g_data.title == 'find') {
            g_data.title = 'find';
            menu_item = menu_find;
            menu.selectedIndex = menu_find.index;
        }

        g_data.input = input.value;
        g_data.url = menu_item.getAttribute('url');
    }

    page(g_data);
}

function on_pre() {
    g_data.page_id = (g_data.page_id == g_data.page_min) ? g_data.page_cnt : (g_data.page_id - 1);
    page(g_data);
}

function on_next() {
    g_data.page_id = (g_data.page_id == g_data.page_cnt) ? g_data.page_min : (g_data.page_id + 1);
    page(g_data);
}

function on_keydown(evt) {
    evt = evt ? evt : window.event;
    if (evt.keyCode == 33) on_pre();
    if (evt.keyCode == 34) on_next();
}

init();
main();

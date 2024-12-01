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
// @connect      410732.com
// @connect      kaitingmart.com
// @connect      xuezhumall.com
// @connect      --gg--
// @connect      ggsp4.cc
// @connect      kbuu056.top
// @connect      houduana.top
// @connect      --hd--
// @connect      ip.sb
// @connect      in101.org
// @connect      cu101.art
// @connect      cu101.bid
// @connect      cu101.city
// @connect      cu101.fans
// @connect      cv101.quest
// @connect      cv101.tel
// @connect      cv101.vip
// @connect      cv101.xyz
// @connect      cw101.app
// @connect      cw101.beauty
// @connect      cw101.best
// @connect      cw101.biz
// @connect      cw101.bond
// @connect      cw101.casa
// @connect      cw101.cfd
// @connect      cw101.club
// @connect      cw101.rodeo
// @connect      cw101.sbs
// @connect      cw101.website
// @connect      cy101.bet
// @connect      cy101.biz
// @connect      cy101.blog
// @connect      cy101.casa
// @connect      cy101.cc
// @connect      cy101.cfd
// @connect      cy101.click
// @connect      cy101.cloud
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
// @connect      688441.com
// @connect      fkrdl.com
// @connect      010069.com
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
// @connect      31xx4901a.cc
// @connect      --uy--
// @connect      vfzugbeoxg1.xyz
// @connect      coff.98vm.com
// ==/UserScript==

var g_hls = null;
var g_video = null;
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
                    g_web.av.data.vod = /\["cncdn", ".+?", "(.+?)"\]/.exec(html)[1];
                    return g_web.av.data.addr;
                }
            ]
        },
        menu : {
            fnd : '{ADDR}/search/{INPUT}/{PAGE}',
            url : '{ADDR}/{1}/{PAGE}',
            beg : '{ADDR}',
            dec : (html, ar)=>{
                return html;
            },
            fun :  [
                /"?nav-item"?><a\s+href="?\/([^">]+)"?>([^<\s]+)/g
            ]
        },
        page : {
            dec : (html, arg)=>{
                return html;
            },
            cnt : (html, arg)=>{
                let ret = /data-total-page="(\d+)"/.exec(html); return ret ? ret[1] : 1;
            },
            reg : /<img alt="(.+?)"[\s\S]+?(https:\/\/.+?\/videos(\/.+?\/)cover\/5_505_259)/g ,
            fun : (ret)=>{
                return [ret[1], ret[2] + '.webp', 'https://' + g_web.av.data.vod + '/videos' + ret[3] + 'g.m3u8?h=3121efe8979c635'];
            },
            lzd : []
        }
    },
    dd : {
        data : {},
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
            fnd : '{ADDR}/search/?page={PAGE}&per_page=30&search={INPUT}',
            url : '{ADDR}/api/vod/video?page={PAGE}&per_page=30&tag={1}',
            beg : '{ADDR}/api/vod/tag_group?page=1&per_page=1000&site_id=6&channel_id=523',
            dec : (html, arg)=>{
                let d = fer(JSON.parse(html)['x-data'], g_web.dd.data.key);
                return d;
            },
            fun : [
                (html, arg)=>{
                    let m = [{name : 'find', url : rep(g_web.dd.menu.fnd, g_web.dd.data)}];
                    let d = JSON.parse(html);
                    for (let i of [14, 18, 25]) {
                        for (let j = 0; j < d.data.items[i].tag.length;j++) {
                            if (d.data.items[i].tag[j].target == '' && d.data.items[i].tag[j].name.length > 2) {
                                m.push({name : d.data.items[i].tag[j].name, url : g_web.dd.data.addr + '/api/vod/video?page={PAGE}&per_page=30&tag=' + d.data.items[i].tag[j].id});
                            }
                        }
                    }
                    return m;
                }
            ]
        },
        page : {
            dec : (html, arg)=>{
                return fer(JSON.parse(html)['x-data'], g_web.dd.data.key);
            },
            cnt : (html, arg)=>{
                let ret = /"total":(\d+)/.exec(html); return ret ? Math.ceil(ret[1] / 30) : 0;
            },
            reg : /"id":(\d+),"name":"([^"]+)","product/g,
            fun : (ret)=>{
                return [ret[2], ret[1], ret[1]];
            },
            lzd : [
                (e)=>{
                    get(g_web.dd.data.addr + '/api/vod/video/' + e.id, g_web.dd.page.lzd[1], {'xml':true, e:e, img:g_web.dd.data.img, vod:g_web.dd.data.img});
                },
                (url, html, arg, xhr)=>{
                    let j = fer(JSON.parse(html)['x-data'], g_web.dd.data.key);
                    arg.e.id = arg.vod + /"play_url":"(.+?)"/.exec(j)[1];
                    get(arg.img + /"pic":"(.+?)"/.exec(j)[1], g_web.dd.page.lzd[2], arg);
                },
                (url, html, arg, xhr)=>{
                    let e = html.split("@@@");
                    arg.e.poster = fer(e[0], g_web.dd.data.key) + e[1];
                }
            ]
        }
    },
    gg : {
        data : {},
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
            fnd : '{API}/api.php/index/getShiPinList?currentPage={PAGE}&wd={INPUT}',
            url : '{API}/api.php/index/getShiPinList?currentPage={PAGE}&id={1}',
            beg : '{ADDR}/js/api.js',
            dec : (html, arg)=>{
                return html;
            },
            fun : [
                /"id": ((?!1)\d+),\s+"name": "(.+?)",/g
            ]
         },
        page : {
            dec : (html, arg)=>{
                let txt = html.split('"').join('').split('\\').join('');
                return aes(txt, g_web.gg.data.key);
            },
            cnt : (html, arg)=>{
                let ret = /"count":(\d+)/.exec(html); return ret ? Math.ceil(ret[1] / 30) : 0;
            },
            reg : /"vod_id":(\d+),"vod_pic":"(.+?)","vod_blurb":"(.+?)"/g,
            fun : (ret)=>{
                return [str(ret[3], true), ret[2].split('\\').join(''), ret[1]];
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
        data : {},
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
            fnd : '{ADDR}/search?q={INPUT}&p={PAGE}',
            url : '{ADDR}/{1}?page={PAGE}',
            beg : '{ADDR}/?&time=1',
            dec : (html, arg)=>{
                return atob(/ec='(.+?)'/.exec(html)[1]);
            },
            fun : [
                (html, arg)=>{
                    let url = rep(g_web.hd.menu.url, g_web.hd.data), tmp, name, reg = /itemprop="url" href="\/(?!category)([^"]+)">([^<>]+)</g;
                    let page, cnt = [3133, 1757, 213];
                    let value = GM_getValue('hd');
                    let menu = [{name : 'find', url : rep(g_web.hd.menu.fnd, g_web.hd.data), page:true}];
                    for (let i = 0, ret; (ret = reg.exec(html)) && i < cnt.length; i++) {
                        name = utf(ret[2]);
                        tmp = rep(url, ret);
                        menu.push({name : name, url : tmp, page : true});
                        page = (value && value.data[name]) ? (value.data[name] + 1) : cnt[i];
                        get(tmp.replace('{PAGE}', page), g_web.hd.menu.fun[1], {name : name, page : page});
                    }
                    g_web.hd.data.find = 0;
                    return menu;
                },
                (url, html, arg, xhr)=>{
                    html = utf(atob(/ec='(.+?)'/.exec(html)[1]));
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
            reg : /(https:\/\/[^/]+\/[^/]+\/images\/[^'"]+)[\s\S]+?<a href="\/watch\?v=(.+?)" itemprop="url">(\s+<span itemprop="name">)?([^<]+)</g,
            fun : (ret)=>{
                return [ ret[4], ret[1], ret[2] ];
            },
            lzd : [
                (e)=>{
                    e.id = g_web.hd.data.addr + '/pv/' + e.id + '.m3u8?px=' + btoa(e.id.substring(2, 6) + 'prefix=/' + e.id + '/preview' +
                                                                                   '&server=tc&id=' + e.id +
                                                                                   '&ip=' + g_web.hd.data.ip +
                                                                                   '&expire=' + (Math.round(Date.now() / 1000) + 600));
                    get(e.poster, g_web.hd.page.lzd[1], {'xml':true, e:e});
                },
                (url, html, arg, xhr)=>{
                    arg.e.poster = 'data:image/jpeg;base64,' + html.substring(6, html.length - 2);
                }
            ]
        }
    },
    hl : {
        data : {},
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
            fnd : '{SEARCH}/search?text={INPUT}',
            url : '{ADDR}/pages/{TENANTID}/{WEBSITEID}/water/{1}/{PAGE}.json',
            beg : '{ADDR}/pages/{TENANTID}/{WEBSITEID}/home/home.json',
            dec : (html, arg)=>{
                let d = JSON.parse(html);
                let j = JSON.parse(aes(d.json_data, g_web.hl.data.key));
                return j.tabs[2].channelList;
            },
            fun : [
                (html, arg)=>{
                    let url = rep(g_web.hl.menu.url, g_web.hl.data), tmp, item;
                    let page, cnt = {'1836636258456862722' : 135,
                                     '1836636931053441026' : 126,
                                     '1836637230514163713' : 78,
                                     '1836637472047345665' : 76,
                                     '1838057717840576513' : 10,
                                     '1836637986105458690' : 69,
                                     '1836638166510841858' : 57,
                                     '1836638635517935617' : 34,
                                     '1836638914518831106' : 22,
                                     '1836638717539549185' : 17,
                                     '1836637878462820353' : 28,
                                     '1836638857375633410' : 7,
                                     '1836638321423286274' : 16,
                                     '1836639219297931266' : 20,
                                     '1836639025110056962' : 54,
                                     '1836638524979052546' : 17,
                                     '1838837573832511489' : 79,
                                     '1838893403489615874' : 32,
                                     '1838893473370796033' : 28,
                                     '1838847758462455810' : 79,
                                     '1838892794984185858' : 91,
                                     '1838844081720967170' : 33,
                                     '1838847148595933186' : 36,
                                     '1838844944606740482' : 48,
                                     '1838881547295191042' : 57,
                                     '1838837712016031746' : 26};
                    let value = GM_getValue('hl');
                    let menu = [{name : 'find', url : rep(g_web.hl.menu.fnd, g_web.hl.data), page:true}];
                    for (let i = 0; i < html.length; i++) {
                        item = html[i];
                        tmp = url.replace('{1}', item.id);
                        menu.push({name : item.name, url:tmp, page:true});
                        page = (value && value.data && value.data[item.name]) ? value.data[item.name] : cnt[item.id];
                        get(tmp.replace('{PAGE}', page), g_web.hl.menu.fun[1], {name : item.name, url:tmp, page:page});
                    }
                    g_web.hl.data.find = 0;
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
            pid : 0,
            dec : (html, arg)=>{
                if (arg.title == 'find') {
                    let o = '', ret, reg = /"id":"(\d+)","title":"(.+?)","mainImgUrl":"(.+?)"/g;
                    while (ret = reg.exec(html)) { o += '"id":"' + ret[1] + '","mainImgUrl":"' + ret[3] + '","title":"' + ret[2] + '"\n'; }
                    return o;
                } else {
                    return aes(JSON.parse(html).json_data, g_web.hl.data.key);
                }
            },
            cnt : (html, arg)=>{
                return g_web.hl.data[arg.title];
            },
            reg : /"id":"(\d+)","mainImgUrl":"(.+?)".+?"title":"(.+?)"/g,
            fun : (ret)=>{
                return [ret[3], g_web.hl.data.addr + '/' + ret[2], ret[1] ];
            },
            lzd : [
                (e)=>{
                    get(g_web.hl.data.addr + '/pages/detail/' + e.id + '.json', g_web.hl.page.lzd[1], e);
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
        data : {},
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
            fnd : '{ADDR}/search/{INPUT}/{PAGE}',
            url : '{ADDR}/{1}---{PAGE}',
            beg : '{ADDR}',
            dec : (html, arg)=>{
                return str(html);
            },
            fun : [
                /(type\/(?!game)(?!chigua)(?!nvyou)(?!cy)(?!tongchengjiaoyou).+?)" class="menu-link">(.+?)</g
            ]
        },
        page : {
            dec : (html, arg)=>{
                return str(html);
            },
            cnt : (html, arg)=>{
                let ret = /(\d+), event/.exec(html);
                if (ret) return ret[1];
                ret = /empty-result-title/.exec(html);
                return ret ? 0 : 1;
            },
            reg : /data-original="((https:\/\/.+?)\/upload\/vod\/\d+-\d+\/[0-9a-f]+_xfile.jpg)".+?(\/video\/m3u8\/\d+\/\d+\/[0-9a-f]+\/).+?"vod-title">(.+?)</g,
            fun : (ret)=>{
                return [ ret[4], ret[1], ret[2].replace('tp.', 'ts.') + ret[3] + 'index.m3u8' ];
            },
            lzd : [
                (e)=>{
                    get(e.poster, g_web.ht.page.lzd[1], {'xml':true, bin:true, e:e});
                },
                (url, html, arg, xhr)=>{
                    let bin = [], data = new Uint8Array(html);
                    for (let i = 0; i < data.byteLength; i++) bin += String.fromCharCode(data[i] ^ 0x88);
                    arg.e.poster = 'data:image/jpeg;base64,' + btoa(bin);
                }
            ]
        }
    },
    xj : {
        data : {},
        addr : {
            beg : 'https://dxj5577.com/js/base41.js', //https://134.122.173.8:8083/dxjgg/abs.js
            fun : [
                (url, html, arg, xhr)=>{
                    return /"(https:\/\/.+?)\/forward"/.exec(html)[1];
                }
            ]
        },
        menu : {
            fnd : '{ADDR}/forward',
            url : '{ADDR}/forward',
            beg : '{ADDR}/getDataInit',
            pst : '{"name":"John","age":31,"city":"New York"}',
            dec : (html, arg)=>{
                let j = JSON.parse(html);
                g_web.xj.data.group = j.data.macVodLinkMap;
                return j;
            },
            fun : [
                (html, arg)=>{
                    let m = [
                        {
                            name : 'find',
                            url : rep(g_web.xj.menu.fnd, g_web.xj.data),
                            data : '{"command":"WEB_GET_INFO","pageNumber":{PAGE},"RecordsPage":20,"typeId":0,"typeMid":1,"type":1,"languageType":"CN","content":"{INPUT}"}'
                        }
                    ];
                    for (let i = 0; i < 3; i++) {
                        for (let j in html.data.menu0ListMap[i].menu2List) {
                            let l = html.data.menu0ListMap[i].menu2List[j];
                            m.push({
                                name : l.typeName2,
                                url : rep(g_web.xj.menu.url, g_web.xj.data),
                                data : '{"command":"WEB_GET_INFO","pageNumber":{PAGE},"RecordsPage":20,"typeId":'+l.typeId2+',"typeMid":1,"languageType":"CN","content":""}'
                            });
                        }
                    }
                    return m;
                }
            ]
        },
        page : {
            beg : (data)=>{
                data.post = data.data.replace('{PAGE}', data.page_id);
                return data;
            },
            dec : (html, arg)=>{
                return html;
            },
            cnt : (html, arg)=>{
                let ret = /"count":"(\d+)"/.exec(html); return ret ? Math.ceil(ret[1] / 20) : 0;
            },
            reg : /(\/video\/m3u8\/\d+\/\d+\/[0-9a-f]+\/).+?vod_name":"(.+?)".+?vod_server_id":(\d+)/g,
            fun : (ret)=>{
                let data = g_web.xj.data.group[ret[3]];
                return [ ret[2], data.PIC_LINK_1 + ret[1] + '1.jpg', data.LINK_1 + ret[1] + 'playlist.m3u8' ];
            },
            lzd : []
        }
    },
    xx : {
        data : {},
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
            fnd : '{ADDR}/search/{INPUT}/{PAGE}',
            url : '{ADDR}/{1}/{PAGE}',
            beg : '{ADDR}',
            dec : (html, arg)=>{
                return decodeURIComponent(/"(.+?)"/.exec(html)[1]);
            },
            fun : [
                /href="\/(type\/(?!28)(?!29)\d+)">([^&].+?)</g
            ]
        },
        page : {
            dec : (html, arg)=>{
                return decodeURIComponent(/"(.+?)"/.exec(html)[1]);
            },
            cnt : (html, arg)=>{
                let ret = /total = parseInt\((\d+)\)/.exec(html); return ret ? ret[1] : 0;
            },
            reg : /"(\/play\/[0-9a-z]+)"[\s\S]+?data-original="(.+?)"[\s\S]+?"rank-title">(.+?)</g,
            fun : (ret)=>{
                return [ str(ret[3]), ret[2], g_web.xx.data.addr + ret[1] ];
            },
            lzd : [
                (e)=>{
                    get(e.id, g_web.xx.page.lzd[1], e);
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
            beg : 'https://vfzugbeoxg1.xyz/ui/movie/main',
            fun : [
                (url, html, arg, xhr)=>{
                    let ret = /src="(https:\/\/[^\/]+)\/ui\/js\/config-([0-9a-z]+).js"/.exec(html);
                    g_web.yk.data.config = ret[2];
                    let data = 'data=' + encodeURIComponent(g_web.yk.reqData('/api/dance/loadSysConfig', {}, 2)) +
                               '&key=' + encodeURIComponent(g_web.yk.randomString(10) + btoa(g_web.yk.randomString(10) + new Date().getTime() + Math.ceil(Math.random() * 100)))
                    let req = new XMLHttpRequest();
                    req.open('POST', /^(https:\/\/.+?)\//.exec(xhr.finalUrl)[1] + '/ui/open_api/data');
                    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    req.onload = g_web.yk.vod;
                    req.send(data);
                    return ret[1];
                }
            ]
        },
        menu : {
            fnd : '{ADDR}/search/{INPUT}/{PAGE}',
            url : '{ADDR}/ui/open_api/data_{CHECK}.js?data={DATA}',
            beg : '{ADDR}/ui/js/config-{CONFIG}.js',
            dec : (html, arg)=>{
                return html;
            },
            fun : [
                (html, arg)=>{
                    let menu = [];
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
                            menu.push({ name : i.name, url : rep(g_web.yk.menu.url, g_web.yk.data), data : JSON.stringify({id : i.id, mode : i.dataSourceMode}), page:true });
                            let page = (value && value.data && value.data[i.name]) ? value.data[i.name] : cnt[i.id];
                            if (page == undefined) continue;
                            let data = g_web.yk.getData(i.id, i.dataSourceMode, ++page);
                            let check = g_web.yk.getCheck(data);
                            let url = g_web.yk.menu.url.replace('{ADDR}', g_web.yk.data.addr);
                            url = url.replace('{DATA}', data);
                            url = url.replace('{CHECK}', check);
                            get(url, g_web.yk.menu.fun[1], {id : i.id, name : i.name, mode : i.dataSourceMode, page : page});
                        }
                    }
                    return menu;
                },
                (url, html, arg, xhr)=>{
                    html = g_web.yk.page.dec(html);
                    let j = JSON.parse(html);
                    if (j.data == undefined) return;
                    if (j.data.length != 0) {
                        console.log(url, arg);
                        let data = g_web.yk.getData(arg.id, arg.mode, ++arg.page);
                        let check = g_web.yk.getCheck(data);
                        url = g_web.yk.menu.url.replace('{ADDR}', g_web.yk.data.addr);
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
                let j = JSON.parse(data.data);
                g_web.yk.data.data = g_web.yk.getData(j.id, j.mode, data.page_id);
                g_web.yk.data.check = g_web.yk.getCheck(g_web.yk.data.data);
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
            reg : /"title":"(.+?)".+?"url":"(.+?)".+?"verticalCover":"(.+?)"/g,
            fun : (ret)=>{
                return [ret[1], g_web.yk.data.vod + ret[3], g_web.yk.data.vod + ret[2]];
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
        vod : (xhr)=>{
            let html = g_web.yk.page.dec(xhr.target.responseText);
            let j = JSON.parse(html);
            for (let i of j.data) {
                if (i.key == 'video_base_url') {
                    g_web.yk.data.vod = i.val;
                    let value = GM_getValue('yk');
                    value.data.vod = i.val;
                    GM_setValue('yk', value);
                    console.log('yk vod', i.val);
                }
            }
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

    g_web.key = key(g_web);
    console.log(g_web.key);

    function set(k) {
        let v = GM_getValue(k);
        v.date = '2024/10/23';
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
    div.style = 'position:fixed;right:0px;background:#CCFFFF';
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

    select('m3', [{name : 'play', url : '{INPUT}', data : ''}]);

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
        xhr.open('GET', url);
        if (arg.bin) xhr.responseType = 'arraybuffer';
        xhr.onload = ()=>{ cb_load(url, xhr.response, arg, xhr); }
        xhr.onerror = ()=>{ cb_timeout ? cb_timeout(url, xhr, arg) : console.log('error:' + url, xhr); }
        xhr.ontimeout = ()=>{ cb_timeout ? cb_timeout(url, xhr, arg) : console.log('timeout:' + url, xhr); }
        xhr.send();
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

function video(id, data) {
    let web = g_web[id];

    let div;
    let video;
    let content = document.getElementById('content');

    while (content.firstChild) { content.removeChild(content.firstChild); }

    for (let i = 0; i < data.length; i += 3) {
        div = document.createElement("div");
        div.innerText = (i / 3 + 1) + '. ' + data[i];
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
    select.appendChild(group);

    for (let i = 0, option; i < data.length; i++) {
        option = document.createElement('option');
        option.innerText = data[i].name;
        if (data[i].url) option.setAttribute('url', data[i].url);
        if (data[i].data) option.setAttribute('data', data[i].data);
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
        arg.post = menu.pst;
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
        item.push({name : 'find', url : rep(fnd, data)});
        while (ret = fun[0].exec(html)) {
            url = rep(menu.url, data);
            url = rep(url, ret);
            item.push({name : ret[2], url : url});
        }
    }

    if (item.length <= 1) {
        console.log(id, 'menu number error', url, html);
        return;
    }

    select(id, item);

    GM_setValue(id, {date : date, menu : item, data : data});

    console.log(id, 'set', GM_getValue(id));

    if (i < g_web.key.length - 1) addr(i + 1);
}

function addr(i) {
    let id = g_web.key[i]
    let web = g_web[id];
    let menu = web.menu;
    let date = new Date().toLocaleDateString();
    let data = GM_getValue(id);
    let beg = web.addr.beg;
    let arg = {i : i, id : id, step : 0, timeout : 0};

    if (data && data.date == date) {
        web.data = data.data;
        select(id, data.menu);
        if (i < g_web.key.length - 1) addr(i + 1);
        return;
    }

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
    let vod = [];
    let ret;

    html = dec(html, arg);

    g_data.page_id = arg.page_id;
    g_data.page_cnt = cnt(html, arg);

    for (let ret; ret = reg.exec(html);) {
        vod.push(...fun(ret));
    }

    if (vod.length == 0) {
        console.log(id, 'vod len == 0', html);
    }

    video(id, vod);

    document.getElementById('page_num').innerText = (g_data.page_cnt == 0 ? 0 : g_data.page_id) + '/' + g_data.page_cnt;
}

function page(data) {
    let web = g_web[data.id];
    let beg = web.page.beg;

    if (beg) {
        data = beg(data);
    }

    let url = rep(data.url, web.data);
    url = url.replace('{PAGE}', data.page_id);

    console.log('url:', url, data);

    get(url, cb_page, data);
}

function on_change(keydown) {
    let menu = document.getElementById('menu');
    let input = document.getElementById('input');
    let menu_item = menu.options[menu.selectedIndex];
    let menu_group = menu_item.parentNode;
    let menu_find = menu_group.childNodes[0];

    g_data.id = menu_group.label;
    g_data.title = menu_item.innerText;

    delete g_data.data;
    delete g_data.post;

    if (g_data.id == 'm3') {
        video(g_data.id, [input.value, '', input.value], '');
        input.value = '';
        return;
    }

    g_data.page_id = (g_web[g_data.id].page.pid != undefined) ? g_web[g_data.id].page.pid : 1;
    g_data.page_min = g_data.page_id;

    let tmp = menu_item.getAttribute('data');

    if (tmp) {
        g_data.data = tmp
    }

    if (keydown && /^\d+$/.exec(input.value)) {
        g_data.page_id = Number(input.value);
    } else {
        if (keydown || g_data.title == 'find') {
            g_data.title = 'find';
            menu_item = menu_find;
            menu.selectedIndex = menu_find.index;
        }

        g_data.url = menu_item.getAttribute('url').replace('{INPUT}', input.value);

        if (g_data.data) {
            g_data.data = g_data.data.replace('{INPUT}', input.value);
        }
    }

    page(g_data);
}

function on_pre() {
    g_data.page_id = (g_data.page_id == g_data.page_min) ? g_data.page_cnt : (g_data.page_id - 1);
    page(g_data, false);
}

function on_next() {
    g_data.page_id = (g_data.page_id == g_data.page_cnt) ? g_data.page_min : (g_data.page_id + 1);
    page(g_data, false);
}

function on_keydown(evt) {
    evt = evt ? evt : window.event;
    if (evt.keyCode == 33) on_pre();
    if (evt.keyCode == 34) on_next();
}

init();
main();

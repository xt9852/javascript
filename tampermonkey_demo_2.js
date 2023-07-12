// ==UserScript==
// @name         Demo
// @namespace    https://github.com/xt9852/tampermonkey_demo
// @version      0.1
// @description  demo
// @author       xt
// @match        https://v88avnetwork.github.io/88av.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.jsdelivr.net/npm/hls.js@latest
// @connect      88av1424.cc
// @connect      jubt.top
// @connect      rm01.xyz
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

var dns = '';
var uri = '';
var num = '';
var hls = null;
var video = null;

function get_url() {
    console.log("--查找地址开始--");

    //GM_deleteValue('domain');

    dns = GM_getValue('domain', '');

    if ('' == dns) {
        dns = document.getElementsByTagName('a')[0].href;
        GM_setValue('domain', dns);
        console.log('set dns:' + dns);
    }

    let ret;
    let reg = /\?(.+)(\d+)$/g;

    if ((ret = reg.exec(window.location.search)) !== null) {
        uri = ret[1] + ret[2];
        num = parseInt(ret[2]);
    }

    console.log('dns:' + dns);
    console.log('uri:' + uri);
    console.log('num:' + num);

    console.log("--查找地址结束--\n\n\n");
}

function new_link(name, addr) {
    let a = document.createElement("a");
    a.href= document.location.origin + document.location.pathname + addr;
    a.innerText = name;
    document.body.appendChild(a);

    a = document.createTextNode("\xa0\xa0\xa0\xa0");
    document.body.appendChild(a);

    console.log(name + '\t' + addr);
}

function add_link() {
    console.log("--添加连接开始--");

    document.body = document.createElement("body");

    new_link('91', '?categories/91/1');
    new_link('jav', '?jav/1');
    new_link('usa', '?oumei/1');
    new_link('search', '?search/ca/1');

    console.log("--添加连接结束--\n\n\n");
}

function get_m3u8() {

    if (video != null && video != this) {
        hls.destroy();
        video.controls = false;
        video.style.cursor = "pointer";
    }

    video = this;
    video.controls = true;
    video.style.cursor = "default";

    hls = new Hls({ id : this.id });
    hls.attachMedia(this);
    hls.loadSource(dns + '/video/m3u8/' + this.id + '.m3u8?video_server=cncdn');

    hls.on(Hls.Events.MANIFEST_PARSED, function() {
        video.play();
    });

    hls.on(Hls.Events.ERROR, function (event, data) {
        console.log('ERROR');

        let url = 'https://7.bbdata.cc/videos/' + hls.config.id + '/g.m3u8';

        hls.destroy();
        hls = new Hls();
        hls.attachMedia(video);
        hls.loadSource(url);

        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
        });
    });
}

function add_page(html) {
    console.log("--处理页面开始--");

    let div;
    let img;
    let ret;
    let txt = 'over';
    let reg = /<img alt="([^"]+)"[\s\S]+?\/\/([^\/]+)\/videos\/([^\/]+)\//g;

    for (var i = 1; (ret = reg.exec(html)) !== null; i++) {
        div = document.createElement("div");
        div.innerText = i + ': ' +ret[1];
        document.body.appendChild(div);

        img = document.createElement('video');
        img.id = ret[3];
        img.poster = 'https://' + ret[2] + '/videos/' + ret[3] + '/cover/5_505_259';
        img.onclick = get_m3u8;
        img.style = 'cursor:pointer;max-width:100%;max-height:100%';
        document.body.appendChild(img);

        console.log(img.id);
    }

    reg = /data-total-page=\"([0-9]+)\"/;
    if ((ret = reg.exec(html)) !== null) { txt = 'total=' + ret[1]; }

    div = document.createElement("a");
    div.href = location.href.substring(0, location.href.lastIndexOf('/') + 1) + (num + 1);
    div.innerText = txt;
    div.style = 'float:right; bottom:0';
    document.body.appendChild(div);

    console.log("--处理页面结束--\n\n\n");
}

function get_data() {
    console.log("--请求页面开始--");

    console.log(dns + uri);

    GM_xmlhttpRequest({
      method: 'GET',
      url: dns + uri,
      onload(xhr) { add_page(xhr.responseText) }
    });

    console.log("--请求页面结束--\n\n\n");
}

function main() {
    get_url();

    add_link();

    get_data();
}

main();

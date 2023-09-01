// ==UserScript==
// @name         Demo
// @namespace    https://github.com/xt9852/tampermonkey_demo
// @version      0.1
// @description  demo
// @author       xt
// @match        https://v88avnetwork.github.io/88av.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.jsdelivr.net/npm/hls.js@latest
// @connect      88a1716.cc
// @connect      https://1jubt.top
// @connect      https://rou.pub/dizhi
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
    var d1 = new Date().toLocaleDateString();

    console.log('d1:' + d1);

    var d2 = GM_getValue('date', '');

    console.log('d2:' + d2);

    if (d1 == d2) {
        dns = GM_getValue('domain', '');
    } else {
        dns = document.getElementsByTagName('a')[0].href;
        GM_setValue('domain', dns);
        GM_setValue('date', d1);
        console.log('set dns:' + dns);
    }

    let ret;
    let reg = /\?(.+)\/(\d+)$/g;

    if ((ret = reg.exec(window.location.search)) !== null) {
        uri = ret[1] + '/' + ret[2];
        num = parseInt(ret[2]);
    }

    console.log('dns:' + dns);
    console.log('uri:' + uri);
    console.log('num:' + num);
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
    document.body = document.createElement("body");

    new_link('91', '?categories/91/1');
    new_link('jav', '?jav/1');
    new_link('usa', '?oumei/1');
    new_link('search', '?search/ca/1');
}

function get_m3u8() {
    if (video == this) {
        return;
    } else if (video != null) {
        hls.destroy();
        video.controls = false;
        video.style.cursor = "pointer";
    }

    video = this;
    video.controls = true;
    video.style.cursor = "default";

    hls = new Hls({ id : this.id, startPosition: 100 });
    hls.attachMedia(this);
    hls.loadSource('https://7.bbdata.cc/videos/' + hls.config.id + '/g.m3u8');

    hls.on(Hls.Events.MANIFEST_PARSED, function() {
        video.play();
    });
}

function add_page(html) {
    let div;
    let vdo;
    let ret;
    let txt = 'over';
    let reg = /<img alt="([^"]+)"[\s\S]+?\/\/([^\/]+)\/videos\/([^\/]+)\//g;

    for (var i = 1; (ret = reg.exec(html)) !== null; i++) {
        div = document.createElement("div");
        div.innerText = i + ': ' +ret[1];
        document.body.appendChild(div);

        vdo = document.createElement('video');
        vdo.id = ret[3];
        vdo.poster = 'https://' + ret[2] + '/videos/' + ret[3] + '/cover/5_505_259';
        vdo.onclick = get_m3u8;
        vdo.style = 'cursor:pointer;max-width:100%;max-height:100%';
        document.body.appendChild(vdo);

        console.log(vdo.id);
    }

    reg = /data-total-page=\"([0-9]+)\"/;
    if ((ret = reg.exec(html)) !== null) { txt = ret[1]; }

    div = document.createElement("a");
    div.href = location.href.substring(0, location.href.lastIndexOf('/') + 1) + (num + 1);
    div.innerText = txt;
    document.body.appendChild(div);
}

function get_data() {
    console.log(dns + uri);

    GM_xmlhttpRequest({
      method: 'GET',
      url: dns + uri,
      onload(xhr) { add_page(xhr.responseText) }
    });
}

function main() {
    get_url();

    add_link();

    get_data();
}

main();

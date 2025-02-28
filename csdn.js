// ==UserScript==
// @name         csdn
// @description  csdn
// @version      0.1
// @match        https://blog.csdn.net/*
// ==/UserScript==

function del_by_id(id) {
    let dom = document.getElementById(id);

    if (!dom) return false;

    dom.parentNode.removeChild(dom);
    console.log('del', id);
    return true;
}

function del_by_class(id) {
    let dom = document.getElementsByClassName(id);

    if (dom.length <= 0) return false;

    dom[0].parentNode.removeChild(dom[0]);
    console.log('del', id);
    return true;
}

function del_by_class_delay(id) {
    let count = 600;
    let timer = setInterval(()=>{ if (del_by_class(id) || count-- <= 0) clearInterval(timer); }, 100);
}

del_by_id('toolbarBox'); // 页面顶部工具栏
del_by_id('toolBarBox'); // 文章底部工具栏
del_by_id('footerRightAds'); // 左侧下广告
del_by_id('asideWriteGuide'); // 左侧上广告

del_by_class_delay('box-shadow mb8'); // 左侧中广告
del_by_class_delay('blog_extension_box'); // 左侧微信名片
del_by_class_delay('sidetool-writeguide-box'); // 右侧小人
del_by_class_delay('btn-side-chatdoc-contentbox'); // 右侧小人
del_by_class_delay('passport-login-tip-container false'); // 右侧下提示登陆
del_by_class_delay('passport-login-container'); // 全屏登陆

// 设置文字可选
let style = document.querySelectorAll('style');
style[0].innerHTML = '#content_views pre code{user-select:text!important}';

// 删除选取文字后的tips
document.addEventListener('mouseup', e=>{
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
        setTimeout(()=>del_by_id('articleSearchTip'), 1000);
    }
});

// 鼠标右键复制
document.addEventListener('copy', e=>{
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText(window.getSelection().toString());
  },
  true
);

// 代码块复制按钮
document.querySelectorAll('.hljs-button').forEach(e=>{
  e.setAttribute('data-title', '复制全部');
  e.removeAttribute('onclick');
  e.addEventListener('click', ()=>{ navigator.clipboard.writeText(e.parentNode.innerText); });
});

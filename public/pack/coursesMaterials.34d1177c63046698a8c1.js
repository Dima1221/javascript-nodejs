var coursesMaterials = webpackJsonp_name_([ 16 ], {
0: function(e, t, n) {
"use strict";
function a() {
i(), s(), r();
}
function r() {
function e(e) {
var t = o({
method: "DELETE",
url: e.action,
body: {
filename: e.elements.filename.value
}
});
t.addEventListener("success", function(t) {
new c.Success("Файл удалён."), e.closest("tr").remove();
});
}
document.addEventListener("submit", function(t) {
t.target.hasAttribute("data-action-delete") && (t.preventDefault(), confirm("Удалить файл " + t.target.elements.filename.value + "?") && e(t.target));
});
}
function s() {
var e = document.querySelector("[data-teacher-form]");
e && (e.addEventListener("change", function() {
for (var t = e.querySelectorAll('[name="materials"]'), n = 0; n < t.length; n++) {
var a = t[n];
a.value && a.parentElement.classList.remove("courses-materials-add__line_empty");
}
null == e.querySelector(".courses-materials-add__line_empty") && e.querySelector("[data-materials-fields]").insertAdjacentHTML("beforeEnd", '<div class="courses-materials-add__line courses-materials-add__line_empty">\n          <input type="button" value="x" data-materials-remove class="courses-materials-add__remove"><input name="materials" type="file" multiple>\n        </div>');
}), e.addEventListener("click", function(e) {
e.target.hasAttribute("data-materials-remove") && e.target.parentElement.remove();
}));
}
function i() {
var e = document.querySelector("[data-should-notify-materials]");
if (e) {
var t = e.closest("form");
e.onchange = function() {
var e = o({
method: "PATCH",
url: t.action,
body: {
id: t.elements.id.value,
shouldNotifyMaterials: t.elements.shouldNotifyMaterials.checked
}
});
e.addEventListener("success", function(e) {
new c.Success("Настройка сохранена.");
});
};
}
}
var o = n(638), c = n(630);
a();
},
638: function(e, t, n) {
"use strict";
function a(e) {
function t(e, t) {
var n = new CustomEvent(e);
return n.originalEvent = t, n;
}
function n(e, n) {
var a = t("fail", n);
a.reason = e, r.dispatchEvent(a);
}
function a(e, n) {
var a = t("success", n);
a.result = e, r.dispatchEvent(a);
}
var r = new XMLHttpRequest(), i = e.method || "GET", o = e.body, c = e.url;
r.open(i, c, !e.sync), r.method = i;
var u = s();
u && !e.skipCsrf && r.setRequestHeader("X-XSRF-TOKEN", u), "[object Object]" == {}.toString.call(o) && (r.setRequestHeader("Content-Type", "application/json;charset=UTF-8"), 
o = JSON.stringify(o)), e.noDocumentEvents || (r.addEventListener("loadstart", function(e) {
r.timeStart = Date.now();
var n = t("xhrstart", e);
document.dispatchEvent(n);
}), r.addEventListener("loadend", function(e) {
var n = t("xhrend", e);
document.dispatchEvent(n);
}), r.addEventListener("success", function(e) {
var n = t("xhrsuccess", e);
n.result = e.result, document.dispatchEvent(n);
}), r.addEventListener("fail", function(e) {
var n = t("xhrfail", e);
n.reason = e.reason, document.dispatchEvent(n);
})), e.raw || r.setRequestHeader("Accept", "application/json"), r.setRequestHeader("X-Requested-With", "XMLHttpRequest");
var d = e.normalStatuses || [ 200 ];
return r.addEventListener("error", function(e) {
n("Ошибка связи с сервером.", e);
}), r.addEventListener("timeout", function(e) {
n("Превышено максимально допустимое время ожидания ответа от сервера.", e);
}), r.addEventListener("abort", function(e) {
n("Запрос был прерван.", e);
}), r.addEventListener("load", function(t) {
if (!r.status) return void n("Не получен ответ от сервера.", t);
if (-1 == d.indexOf(r.status)) return void n("Ошибка на стороне сервера (код " + r.status + "), попытайтесь позднее.", t);
var s = r.responseText, i = r.getResponseHeader("Content-Type");
if (i.match(/^application\/json/) || e.json) try {
s = JSON.parse(s);
} catch (t) {
return void n("Некорректный формат ответа от сервера.", t);
}
a(s, t);
}), setTimeout(function() {
r.send(o);
}, 0), r;
}
var r = n(630), s = n(639);
document.addEventListener("xhrfail", function(e) {
new r.Error(e.reason);
}), e.exports = a;
},
639: function(e, t) {
"use strict";
e.exports = function() {
var e = document.cookie.match(/XSRF-TOKEN=([\w-]+)/);
return e ? e[1] : null;
};
}
});
//# sourceMappingURL=coursesMaterials.34d1177c63046698a8c1.js.map
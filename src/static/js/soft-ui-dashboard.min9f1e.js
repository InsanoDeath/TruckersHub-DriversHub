"use strict";
! function() {
    var e, t; - 1 < navigator.platform.indexOf("Win") && (document.getElementsByClassName("main-content")[0] && (e = document.querySelector(".main-content"), new PerfectScrollbar(e)), document.getElementsByClassName("sidenav")[0] && (e = document.querySelector(".sidenav"), new PerfectScrollbar(e)), document.getElementsByClassName("navbar-collapse")[0] && (t = document.querySelector(".navbar:not(.navbar-expand-lg) .navbar-collapse"), new PerfectScrollbar(t)), document.getElementsByClassName("fixed-plugin")[0] && (t = document.querySelector(".fixed-plugin"), new PerfectScrollbar(t)))
}(), document.getElementById("navbarBlur") && navbarBlurOnScroll("navbarBlur");
var calendarEl, today, mYear, weekday, mDay, m, d, calendar, allInputs, fixedPlugin, fixedPluginButton, fixedPluginButtonNav, fixedPluginCard, fixedPluginCloseButton, navbar, buttonNavbarFixed, popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]')),
    popoverList = popoverTriggerList.map((function(e) {
        return new bootstrap.Popover(e)
    })),
    tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')),
    tooltipList = tooltipTriggerList.map((function(e) {
        return new bootstrap.Tooltip(e)
    }));

function focused(e) {
    e.parentElement.classList.contains("input-group") && e.parentElement.classList.add("focused")
}

function defocused(e) {
    e.parentElement.classList.contains("input-group") && e.parentElement.classList.remove("focused")
}

function setAttributes(e, t) {
    Object.keys(t).forEach((function(a) {
        e.setAttribute(a, t[a])
    }))
}

function dropDown(e) {
    if (!document.querySelector(".dropdown-hover")) {
        event.stopPropagation(), event.preventDefault();
        for (var t = e.parentElement.parentElement.children, a = 0; a < t.length; a++) t[a].lastElementChild != e.parentElement.lastElementChild && t[a].lastElementChild.classList.remove("show");
        e.nextElementSibling.classList.contains("show") ? e.nextElementSibling.classList.remove("show") : e.nextElementSibling.classList.add("show")
    }
}

function sidebarColor(e) {
    for (var t, a = e.parentElement.children, n = e.getAttribute("data-color"), i = 0; i < a.length; i++) a[i].classList.remove("active");
    e.classList.contains("active") ? e.classList.remove("active") : e.classList.add("active"), document.querySelector(".sidenav").setAttribute("data-color", n), document.querySelector("#sidenavCard") && (e = ["card", "card-background", "shadow-none", "card-background-mask-" + n], (t = document.querySelector("#sidenavCard")).className = "", t.classList.add(e), t = ["ni", "ni-diamond", "text-gradient", "text-lg", "top-0", "text-" + n], (e = document.querySelector("#sidenavCardIcon")).className = "", e.classList.add(t))
}

function sidebarType(e) {
    for (var t = e.parentElement.children, a = e.getAttribute("data-class"), n = document.querySelector("body:not(.dark-version)"), i = body.classList.contains("dark-version"), l = [], s = 0; s < t.length; s++) t[s].classList.remove("active"), l.push(t[s].getAttribute("data-class"));
    e.classList.contains("active") ? e.classList.remove("active") : e.classList.add("active");
    var o, r, c, d = document.querySelector(".sidenav");
    for (s = 0; s < l.length; s++) d.classList.remove(l[s]);
    if (d.classList.add(a), "bg-white" == a) {
        var u = document.querySelectorAll(".sidenav .text-white");
        for (let e = 0; e < u.length; e++) u[e].classList.remove("text-white"), u[e].classList.add("text-dark")
    } else {
        var g = document.querySelectorAll(".sidenav .text-dark");
        for (let e = 0; e < g.length; e++) g[e].classList.add("text-white"), g[e].classList.remove("text-dark")
    }
    if ("bg-default" == a && i) {
        g = document.querySelectorAll(".navbar-brand .text-dark");
        for (let e = 0; e < g.length; e++) g[e].classList.add("text-white"), g[e].classList.remove("text-dark")
    }
    "bg-white" == a && n ? (r = (o = document.querySelector(".navbar-brand-img")).src).includes("logo-ct.png") && (c = r.replace("logo-ct", "logo-ct-dark"), o.src = c) : (r = (o = document.querySelector(".navbar-brand-img")).src).includes("logo-ct-dark.png") && (c = r.replace("logo-ct-dark", "logo-ct"), o.src = c), "bg-white" == a && i && (r = (o = document.querySelector(".navbar-brand-img")).src).includes("logo-ct.png") && (c = r.replace("logo-ct", "logo-ct-dark"), o.src = c)
}

function navbarFixed(e) {
    var t = ["position-sticky", "blur", "shadow-blur", "mt-4", "left-auto", "top-1", "z-index-sticky"];
    const a = document.getElementById("navbarBlur");
    e.getAttribute("checked") ? (toggleNavLinksColor("transparent"), a.classList.remove(t), a.setAttribute("data-scroll", "false"), navbarBlurOnScroll("navbarBlur"), e.removeAttribute("checked")) : (toggleNavLinksColor("blur"), a.classList.add(t), a.setAttribute("data-scroll", "true"), navbarBlurOnScroll("navbarBlur"), e.setAttribute("checked", "true"))
}

function navbarMinimize(e) {
    var t = document.getElementsByClassName("g-sidenav-show")[0];
    e.getAttribute("checked") ? (t.classList.remove("g-sidenav-hidden"), t.classList.add("g-sidenav-pinned"), e.removeAttribute("checked")) : (t.classList.remove("g-sidenav-pinned"), t.classList.add("g-sidenav-hidden"), e.setAttribute("checked", "true"))
}

function toggleNavLinksColor(e) {
    let t = document.querySelectorAll(".navbar-main .nav-link"),
        a = document.querySelectorAll(".navbar-main .sidenav-toggler-line");
    "blur" === e ? (t.forEach((e => {
        e.classList.remove("text-body")
    })), a.forEach((e => {
        e.classList.add("bg-dark")
    }))) : "transparent" === e && (t.forEach((e => {
        e.classList.add("text-body")
    })), a.forEach((e => {
        e.classList.remove("bg-dark")
    })))
}

function navbarBlurOnScroll(e) {
    const t = document.getElementById(e);
    var a;
    e = !!t && t.getAttribute("data-scroll");
    let n = ["blur", "shadow-blur", "left-auto"],
        i = ["shadow-none"];

    function l() {
        t.classList.add(n), t.classList.remove(i), toggleNavLinksColor("blur")
    }

    function s() {
        t.classList.remove(n), t.classList.add(i), toggleNavLinksColor("transparent")
    }(5 < window.scrollY ? l : s)(), window.onscroll = debounce("true" == e ? function() {
        (5 < window.scrollY ? l : s)()
    } : function() {
        s()
    }, 10), -1 < navigator.platform.indexOf("Win") && (a = document.querySelector(".main-content"), "true" == e ? a.addEventListener("ps-scroll-y", debounce((function() {
        (5 < a.scrollTop ? l : s)()
    }), 10)) : a.addEventListener("ps-scroll-y", debounce((function() {
        s()
    }), 10)))
}

function debounce(e, t, a) {
    var n;
    return function() {
        var i = this,
            l = arguments,
            s = a && !n;
        clearTimeout(n), n = setTimeout((function() {
            n = null, a || e.apply(i, l)
        }), t), s && e.apply(i, l)
    }
}
document.addEventListener("DOMContentLoaded", (function() {
    [].slice.call(document.querySelectorAll(".toast")).map((function(e) {
        return new bootstrap.Toast(e)
    })), [].slice.call(document.querySelectorAll(".toast-btn")).map((function(e) {
        e.addEventListener("click", (function() {
            var t = document.getElementById(e.dataset.target);
            t && bootstrap.Toast.getInstance(t).show()
        }))
    }))
})), document.querySelector('[data-toggle="widget-calendar"]') && (calendarEl = document.querySelector('[data-toggle="widget-calendar"]'), mYear = (today = new Date).getFullYear(), mDay = (weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])[today.getDay()], m = today.getMonth(), d = today.getDate(), document.getElementsByClassName("widget-calendar-year")[0].innerHTML = mYear, document.getElementsByClassName("widget-calendar-day")[0].innerHTML = mDay, (calendar = new FullCalendar.Calendar(calendarEl, {
    contentHeight: "auto",
    initialView: "dayGridMonth",
    selectable: !0,
    initialDate: "2020-12-01",
    editable: !0,
    headerToolbar: !1,
    events: [{
        title: "Call with Dave",
        start: "2020-11-18",
        end: "2020-11-18",
        className: "bg-gradient-danger"
    }, {
        title: "Lunch meeting",
        start: "2020-11-21",
        end: "2020-11-22",
        className: "bg-gradient-warning"
    }, {
        title: "All day conference",
        start: "2020-11-29",
        end: "2020-11-29",
        className: "bg-gradient-success"
    }, {
        title: "Meeting with Mary",
        start: "2020-12-01",
        end: "2020-12-01",
        className: "bg-gradient-info"
    }, {
        title: "Winter Hackaton",
        start: "2020-12-03",
        end: "2020-12-03",
        className: "bg-gradient-danger"
    }, {
        title: "Digital event",
        start: "2020-12-07",
        end: "2020-12-09",
        className: "bg-gradient-warning"
    }, {
        title: "Marketing event",
        start: "2020-12-10",
        end: "2020-12-10",
        className: "bg-gradient-primary"
    }, {
        title: "Dinner with Family",
        start: "2020-12-19",
        end: "2020-12-19",
        className: "bg-gradient-danger"
    }, {
        title: "Black Friday",
        start: "2020-12-23",
        end: "2020-12-23",
        className: "bg-gradient-info"
    }, {
        title: "Cyber Week",
        start: "2020-12-02",
        end: "2020-12-02",
        className: "bg-gradient-warning"
    }]
})).render()), 0 != document.querySelectorAll(".input-group").length && (allInputs = document.querySelectorAll("input.form-control")).forEach((e => setAttributes(e, {
    onfocus: "focused(this)",
    onfocusout: "defocused(this)"
}))), document.querySelector(".fixed-plugin") && (fixedPlugin = document.querySelector(".fixed-plugin"), fixedPluginButton = document.querySelector(".fixed-plugin-button"), fixedPluginButtonNav = document.querySelector(".fixed-plugin-button-nav"), fixedPluginCard = document.querySelector(".fixed-plugin .card"), fixedPluginCloseButton = document.querySelectorAll(".fixed-plugin-close-button"), navbar = document.getElementById("navbarBlur"), buttonNavbarFixed = document.getElementById("navbarFixed"), fixedPluginButton && (fixedPluginButton.onclick = function() {
    fixedPlugin.classList.contains("show") ? fixedPlugin.classList.remove("show") : fixedPlugin.classList.add("show")
}), fixedPluginButtonNav && (fixedPluginButtonNav.onclick = function() {
    fixedPlugin.classList.contains("show") ? fixedPlugin.classList.remove("show") : fixedPlugin.classList.add("show")
}), fixedPluginCloseButton.forEach((function(e) {
    e.onclick = function() {
        fixedPlugin.classList.remove("show")
    }
})), document.querySelector("body").onclick = function(e) {
    e.target != fixedPluginButton && e.target != fixedPluginButtonNav && e.target.closest(".fixed-plugin .card") != fixedPluginCard && fixedPlugin.classList.remove("show")
}, navbar && "true" == navbar.getAttribute("data-scroll") && buttonNavbarFixed && buttonNavbarFixed.setAttribute("checked", "true"));
var sidenavToggler, sidenavShow, toggleNavbarMinimize, total = document.querySelectorAll(".nav-pills");

function initNavs() {
    total.forEach((function(e, t) {
        var a = document.createElement("div"),
            n = e.querySelector("li:first-child .nav-link").cloneNode();
        n.innerHTML = "-", a.classList.add("moving-tab", "position-absolute", "nav-link"), a.appendChild(n), e.appendChild(a), e.getElementsByTagName("li").length, a.style.padding = "0px", a.style.width = e.querySelector("li:nth-child(1)").offsetWidth + "px", a.style.transform = "translate3d(0px, 0px, 0px)", a.style.transition = ".5s ease", e.onmouseover = function(t) {
            let n = getEventTarget(t).closest("li");
            if (n) {
                let t = Array.from(n.closest("ul").children),
                    i = t.indexOf(n) + 1;
                e.querySelector("li:nth-child(" + i + ") .nav-link").onclick = function() {
                    a = e.querySelector(".moving-tab");
                    let l = 0;
                    if (e.classList.contains("flex-column")) {
                        for (var s = 1; s <= t.indexOf(n); s++) l += e.querySelector("li:nth-child(" + s + ")").offsetHeight;
                        a.style.transform = "translate3d(0px," + l + "px, 0px)", a.style.height = e.querySelector("li:nth-child(" + s + ")").offsetHeight
                    } else {
                        for (s = 1; s <= t.indexOf(n); s++) l += e.querySelector("li:nth-child(" + s + ")").offsetWidth;
                        a.style.transform = "translate3d(" + l + "px, 0px, 0px)", a.style.width = e.querySelector("li:nth-child(" + i + ")").offsetWidth + "px"
                    }
                }
            }
        }, window.innerWidth < 991 && total.forEach((function(e, t) {
            if (!e.classList.contains("flex-column")) {
                e.classList.remove("flex-row"), e.classList.add("flex-column", "on-resize");
                let t = e.querySelector(".nav-link.active").parentElement,
                    i = Array.from(t.closest("ul").children);
                i.indexOf(t);
                let l = 0;
                for (var a = 1; a <= i.indexOf(t); a++) l += e.querySelector("li:nth-child(" + a + ")").offsetHeight;
                var n = document.querySelector(".moving-tab");
                n.style.width = e.querySelector("li:nth-child(1)").offsetWidth + "px", n.style.transform = "translate3d(0px," + l + "px, 0px)"
            }
        }))
    }))
}

function getEventTarget(e) {
    return (e = e || window.event).target || e.srcElement
}
setTimeout((function() {
    initNavs()
}), 100), window.addEventListener("resize", (function(e) {
    total.forEach((function(e, t) {
        e.querySelector(".moving-tab").remove();
        var a = document.createElement("div"),
            n = e.querySelector(".nav-link.active").cloneNode();
        n.innerHTML = "-", a.classList.add("moving-tab", "position-absolute", "nav-link"), a.appendChild(n), e.appendChild(a), a.style.padding = "0px", a.style.transition = ".5s ease";
        let i = e.querySelector(".nav-link.active").parentElement;
        if (i) {
            let t = Array.from(i.closest("ul").children);
            n = t.indexOf(i) + 1;
            let s = 0;
            if (e.classList.contains("flex-column")) {
                for (var l = 1; l <= t.indexOf(i); l++) s += e.querySelector("li:nth-child(" + l + ")").offsetHeight;
                a.style.transform = "translate3d(0px," + s + "px, 0px)", a.style.width = e.querySelector("li:nth-child(" + n + ")").offsetWidth + "px", a.style.height = e.querySelector("li:nth-child(" + l + ")").offsetHeight
            } else {
                for (l = 1; l <= t.indexOf(i); l++) s += e.querySelector("li:nth-child(" + l + ")").offsetWidth;
                a.style.transform = "translate3d(" + s + "px, 0px, 0px)", a.style.width = e.querySelector("li:nth-child(" + n + ")").offsetWidth + "px"
            }
        }
    })), window.innerWidth < 991 ? total.forEach((function(e, t) {
        if (!e.classList.contains("flex-column")) {
            e.classList.remove("flex-row"), e.classList.add("flex-column", "on-resize");
            let t = e.querySelector(".nav-link.active").parentElement,
                i = Array.from(t.closest("ul").children);
            i.indexOf(t);
            let l = 0;
            for (var a = 1; a <= i.indexOf(t); a++) l += e.querySelector("li:nth-child(" + a + ")").offsetHeight;
            var n = document.querySelector(".moving-tab");
            n.style.width = e.querySelector("li:nth-child(1)").offsetWidth + "px", n.style.transform = "translate3d(0px," + l + "px, 0px)"
        }
    })) : total.forEach((function(e, t) {
        if (e.classList.contains("on-resize")) {
            e.classList.remove("flex-column", "on-resize"), e.classList.add("flex-row");
            let t = e.querySelector(".nav-link.active").parentElement,
                l = Array.from(t.closest("ul").children);
            var a = l.indexOf(t) + 1;
            let s = 0;
            for (var n = 1; n <= l.indexOf(t); n++) s += e.querySelector("li:nth-child(" + n + ")").offsetWidth;
            var i = document.querySelector(".moving-tab");
            i.style.transform = "translate3d(" + s + "px, 0px, 0px)", i.style.width = e.querySelector("li:nth-child(" + a + ")").offsetWidth + "px"
        }
    }))
})), window.innerWidth < 991 && total.forEach((function(e, t) {
    e.classList.contains("flex-row") && (e.classList.remove("flex-row"), e.classList.add("flex-column", "on-resize"))
})), document.querySelector(".sidenav-toggler") && (sidenavToggler = document.getElementsByClassName("sidenav-toggler")[0], sidenavShow = document.getElementsByClassName("g-sidenav-show")[0], toggleNavbarMinimize = document.getElementById("navbarMinimize"), sidenavShow && (sidenavToggler.onclick = function() {
    sidenavShow.classList.contains("g-sidenav-hidden") ? (sidenavShow.classList.remove("g-sidenav-hidden"), sidenavShow.classList.add("g-sidenav-pinned"), toggleNavbarMinimize && (toggleNavbarMinimize.click(), toggleNavbarMinimize.removeAttribute("checked"))) : (sidenavShow.classList.remove("g-sidenav-pinned"), sidenavShow.classList.add("g-sidenav-hidden"), toggleNavbarMinimize && (toggleNavbarMinimize.click(), toggleNavbarMinimize.setAttribute("checked", "true")))
}));
const iconNavbarSidenav = document.getElementById("iconNavbarSidenav"),
    iconSidenav = document.getElementById("iconSidenav"),
    sidenav = document.getElementById("sidenav-main");
let body = document.getElementsByTagName("body")[0],
    className = "g-sidenav-pinned";

function toggleSidenav() {
    body.classList.contains(className) ? body.classList.remove(className) : (body.classList.add(className), iconSidenav.classList.remove("d-none"))
}
iconNavbarSidenav && iconNavbarSidenav.addEventListener("click", toggleSidenav), iconSidenav && iconSidenav.addEventListener("click", toggleSidenav);
let referenceButtons = document.querySelector("[data-class]");

function navbarColorOnResize() {
    sidenav && (1200 < window.innerWidth ? referenceButtons?.classList?.contains("active") && "bg-transparent" === referenceButtons.getAttribute("data-class") ? sidenav.classList.remove("bg-white") : sidenav.classList.add("bg-white") : (sidenav.classList.add("bg-white"), sidenav.classList.remove("bg-transparent")))
}

function sidenavTypeOnResize() {
    let e = document.querySelectorAll('[onclick="sidebarType(this)"]');
    window.innerWidth < 1200 ? e.forEach((function(e) {
        e.classList.add("disabled")
    })) : e.forEach((function(e) {
        e.classList.remove("disabled")
    }))
}

function notify(e) {
    var t = document.querySelector("body"),
        a = document.createElement("div");
    a.classList.add("alert", "position-absolute", "top-0", "border-0", "text-white", "w-50", "end-0", "start-0", "mt-2", "mx-auto", "py-2"), a.classList.add("alert-" + e.getAttribute("data-type")), a.style.transform = "translate3d(0px, 0px, 0px)", a.style.opacity = "0", a.style.transition = ".35s ease", setTimeout((function() {
        a.style.transform = "translate3d(0px, 20px, 0px)", a.style.setProperty("opacity", "1", "important")
    }), 100), a.innerHTML = '<div class="d-flex mb-1"><div class="alert-icon me-1"><i class="' + e.getAttribute("data-icon") + ' mt-1"></i></div><span class="alert-text"><strong>' + e.getAttribute("data-title") + '</strong></span></div><span class="text-sm">' + e.getAttribute("data-content") + "</span>", t.appendChild(a), setTimeout((function() {
        a.style.transform = "translate3d(0px, 0px, 0px)", a.style.setProperty("opacity", "0", "important")
    }), 4e3), setTimeout((function() {
        e.parentElement.querySelector(".alert").remove()
    }), 4500)
}

function darkMode(e) {
    localStorage.setItem("darkMode", e.checked);
    const t = document.getElementsByTagName("body")[0],
        a = document.querySelectorAll("div:not(.sidenav) > hr"),
        n = document.querySelector(".sidenav"),
        i = document.querySelectorAll(".sidenav.bg-white"),
        l = document.querySelectorAll("div:not(.bg-gradient-dark) hr"),
        s = document.querySelectorAll("button:not(.btn) > .text-dark"),
        o = document.querySelectorAll("span.text-dark, .breadcrumb .text-dark"),
        r = document.querySelectorAll("span.text-white, .breadcrumb .text-white"),
        c = document.querySelectorAll("strong.text-dark"),
        d = document.querySelectorAll("strong.text-white"),
        u = document.querySelectorAll("a.nav-link.text-dark"),
        g = document.querySelectorAll(".text-secondary"),
        m = document.querySelectorAll(".text-white"),
        f = document.querySelectorAll(".bg-gray-100"),
        v = document.querySelectorAll(".bg-gray-600"),
        h = document.querySelectorAll(".btn.btn-link.text-dark, .btn .ni.text-dark"),
        b = document.querySelectorAll(".btn.btn-link.text-white, .btn .ni.text-white"),
        y = document.querySelectorAll(".card.border"),
        p = document.querySelectorAll(".card.border.border-dark"),
        x = document.querySelectorAll(".navbar g"),
        w = document.querySelector(".navbar-brand-img"),
        L = w.src,
        S = document.querySelectorAll(".navbar-main .nav-link, .navbar-main .breadcrumb-item, .navbar-main .breadcrumb-item a"),
        k = document.querySelectorAll(".card .nav .nav-link i"),
        q = document.querySelectorAll(".card .nav .nav-link span"),
        A = document.querySelectorAll(".fixed-plugin > .card"),
        C = document.querySelectorAll(".main-content .container-fluid .card");
    if (e.getAttribute("checked")) {
        for (t.classList.remove("dark-version"), n.classList.add("bg-white"), L.includes("logo-ct.png") && (B = L.replace("logo-ct", "logo-ct-dark"), w.src = B), E = 0; E < S.length; E++) S[E].classList.contains("text-dark") && (S[E].classList.add("text-white"), S[E].classList.remove("text-dark"));
        for (E = 0; E < k.length; E++) k[E].classList.contains("text-white") && (k[E].classList.remove("text-white"), k[E].classList.add("text-dark"));
        for (E = 0; E < q.length; E++) q[E].classList.contains("text-white") && q[E].classList.remove("text-white");
        for (E = 0; E < C.length; E++) C[E].classList.add("blur", "shadow-blur");
        for (E = 0; E < A.length; E++) A[E].classList.add("blur");
        for (E = 0; E < a.length; E++) a[E].classList.contains("light") && (a[E].classList.add("dark"), a[E].classList.remove("light"));
        for (E = 0; E < l.length; E++) l[E].classList.contains("light") && (l[E].classList.add("dark"), l[E].classList.remove("light"));
        for (E = 0; E < s.length; E++) s[E].classList.contains("text-white") && (s[E].classList.remove("text-white"), s[E].classList.add("text-dark"));
        for (E = 0; E < r.length; E++) !r[E].classList.contains("text-white") || r[E].closest(".sidenav") || r[E].closest(".card.bg-gradient-dark") || (r[E].classList.remove("text-white"), r[E].classList.add("text-dark"));
        for (E = 0; E < d.length; E++) d[E].classList.contains("text-white") && (d[E].classList.remove("text-white"), d[E].classList.add("text-dark"));
        for (E = 0; E < m.length; E++) m[E].classList.contains("text-white") && (m[E].classList.remove("text-white"), m[E].classList.remove("opacity-8"), m[E].classList.add("text-secondary"));
        for (E = 0; E < v.length; E++) v[E].classList.contains("bg-gray-600") && (v[E].classList.remove("bg-gray-600"), v[E].classList.add("bg-gray-100"));
        for (E = 0; E < x.length; E++) x[E].hasAttribute("fill") && x[E].setAttribute("fill", "#6c757d");
        for (E = 0; E < b.length; E++) b[E].closest(".card.bg-gradient-dark") || (b[E].classList.remove("text-white"), b[E].classList.add("text-dark"));
        for (E = 0; E < p.length; E++) p[E].classList.remove("border-dark");
        e.removeAttribute("checked")
    } else {
        var B;
        t.classList.add("dark-version"), L.includes("logo-ct-dark.png") && (B = L.replace("logo-ct-dark", "logo-ct"), w.src = B);
        for (var E = 0; E < C.length; E++) C[E].classList.contains("blur") && C[E].classList.remove("blur", "shadow-blur");
        for (E = 0; E < S.length; E++) S[E].classList.contains("text-white") && S[E].classList.remove("text-white");
        for (E = 0; E < A.length; E++) A[E].classList.contains("blur") && A[E].classList.remove("blur");
        for (E = 0; E < k.length; E++) k[E].classList.contains("text-dark") && (k[E].classList.remove("text-dark"), k[E].classList.add("text-white"));
        for (E = 0; E < q.length; E++) q[E].classList.contains("text-sm") && q[E].classList.add("text-white");
        for (E = 0; E < a.length; E++) a[E].classList.contains("dark") && (a[E].classList.remove("dark"), a[E].classList.add("light"));
        for (E = 0; E < l.length; E++) l[E].classList.contains("dark") && (l[E].classList.remove("dark"), l[E].classList.add("light"));
        for (E = 0; E < s.length; E++) s[E].classList.contains("text-dark") && (s[E].classList.remove("text-dark"), s[E].classList.add("text-white"));
        for (E = 0; E < o.length; E++) o[E].classList.contains("text-dark") && (o[E].classList.remove("text-dark"), o[E].classList.add("text-white"));
        for (E = 0; E < c.length; E++) c[E].classList.contains("text-dark") && (c[E].classList.remove("text-dark"), c[E].classList.add("text-white"));
        for (E = 0; E < u.length; E++) u[E].classList.contains("text-dark") && (u[E].classList.remove("text-dark"), u[E].classList.add("text-white"));
        for (E = 0; E < g.length; E++) g[E].classList.contains("text-secondary") && (g[E].classList.remove("text-secondary"), g[E].classList.add("text-white"), g[E].classList.add("opacity-8"));
        for (E = 0; E < f.length; E++) f[E].classList.contains("bg-gray-100") && (f[E].classList.remove("bg-gray-100"), f[E].classList.add("bg-gray-600"));
        for (E = 0; E < h.length; E++) h[E].classList.remove("text-dark"), h[E].classList.add("text-white");
        for (E = 0; E < i.length; E++) i[E].classList.remove("bg-white");
        for (E = 0; E < x.length; E++) x[E].hasAttribute("fill") && x[E].setAttribute("fill", "#fff");
        for (E = 0; E < y.length; E++) y[E].classList.add("border-dark");
        e.setAttribute("checked", "true")
    }
}
window.addEventListener("resize", navbarColorOnResize), window.addEventListener("resize", sidenavTypeOnResize), window.addEventListener("load", sidenavTypeOnResize);
var soft = {
    initFullCalendar: function() {
        document.addEventListener("DOMContentLoaded", (function() {
            var e = document.getElementById("fullCalendar"),
                t = (n = new Date).getFullYear(),
                a = n.getMonth(),
                n = n.getDate(),
                i = new FullCalendar.Calendar(e, {
                    initialView: "dayGridMonth",
                    selectable: !0,
                    headerToolbar: {
                        left: "title",
                        center: "dayGridMonth,timeGridWeek,timeGridDay",
                        right: "prev,next today"
                    },
                    select: function(e) {
                        Swal.fire({
                            title: "Create an Event",
                            html: '<div class="form-group"><input class="form-control text-default" placeholder="Event Title" id="input-field"></div>',
                            showCancelButton: !0,
                            customClass: {
                                confirmButton: "btn btn-primary",
                                cancelButton: "btn btn-danger"
                            },
                            buttonsStyling: !1
                        }).then((function(t) {
                            var a = document.getElementById("input-field").value;
                            a && (a = {
                                title: a,
                                start: e.startStr,
                                end: e.endStr
                            }, i.addEvent(a))
                        }))
                    },
                    editable: !0,
                    events: [{
                        title: "All Day Event",
                        start: new Date(t, a, 1),
                        className: "event-default"
                    }, {
                        id: 999,
                        title: "Repeating Event",
                        start: new Date(t, a, n - 4, 6, 0),
                        allDay: !1,
                        className: "event-rose"
                    }, {
                        id: 999,
                        title: "Repeating Event",
                        start: new Date(t, a, n + 3, 6, 0),
                        allDay: !1,
                        className: "event-rose"
                    }, {
                        title: "Meeting",
                        start: new Date(t, a, n - 1, 10, 30),
                        allDay: !1,
                        className: "event-green"
                    }, {
                        title: "Lunch",
                        start: new Date(t, a, n + 7, 12, 0),
                        end: new Date(t, a, n + 7, 14, 0),
                        allDay: !1,
                        className: "event-red"
                    }, {
                        title: "Md-pro Launch",
                        start: new Date(t, a, n - 2, 12, 0),
                        allDay: !0,
                        className: "event-azure"
                    }, {
                        title: "Birthday Party",
                        start: new Date(t, a, n + 1, 19, 0),
                        end: new Date(t, a, n + 1, 22, 30),
                        allDay: !1,
                        className: "event-azure"
                    }, {
                        title: "Click for Creative Tim",
                        start: new Date(t, a, 21),
                        end: new Date(t, a, 22),
                        url: "http://www.creative-tim.com/",
                        className: "event-orange"
                    }, {
                        title: "Click for Google",
                        start: new Date(t, a, 23),
                        end: new Date(t, a, 23),
                        url: "http://www.creative-tim.com/",
                        className: "event-orange"
                    }]
                });
            i.render()
        }))
    },
    datatableSimple: function() {
        var e = {
            columnDefs: [{
                field: "athlete",
                minWidth: 150,
                sortable: !0,
                filter: !0
            }, {
                field: "age",
                maxWidth: 90,
                sortable: !0,
                filter: !0
            }, {
                field: "country",
                minWidth: 150,
                sortable: !0,
                filter: !0
            }, {
                field: "year",
                maxWidth: 90,
                sortable: !0,
                filter: !0
            }, {
                field: "date",
                minWidth: 150,
                sortable: !0,
                filter: !0
            }, {
                field: "sport",
                minWidth: 150,
                sortable: !0,
                filter: !0
            }, {
                field: "gold"
            }, {
                field: "silver"
            }, {
                field: "bronze"
            }, {
                field: "total"
            }],
            rowSelection: "multiple",
            rowMultiSelectWithClick: !0,
            rowData: [{
                athlete: "Ronald Valencia",
                age: 23,
                country: "United States",
                year: 2008,
                date: "24/08/2008",
                sport: "Swimming",
                gold: 8,
                silver: 0,
                bronze: 0,
                total: 8
            }, {
                athlete: "Lorand Frentz",
                age: 19,
                country: "United States",
                year: 2004,
                date: "29/08/2004",
                sport: "Swimming",
                gold: 6,
                silver: 0,
                bronze: 2,
                total: 8
            }, {
                athlete: "Michael Phelps",
                age: 27,
                country: "United States",
                year: 2012,
                date: "12/08/2012",
                sport: "Swimming",
                gold: 4,
                silver: 2,
                bronze: 0,
                total: 6
            }, {
                athlete: "Natalie Coughlin",
                age: 25,
                country: "United States",
                year: 2008,
                date: "24/08/2008",
                sport: "Swimming",
                gold: 1,
                silver: 2,
                bronze: 3,
                total: 6
            }, {
                athlete: "Aleksey Nemov",
                age: 24,
                country: "Russia",
                year: 2e3,
                date: "01/10/2000",
                sport: "Gymnastics",
                gold: 2,
                silver: 1,
                bronze: 3,
                total: 6
            }, {
                athlete: "Alicia Coutts",
                age: 24,
                country: "Australia",
                year: 2012,
                date: "12/08/2012",
                sport: "Swimming",
                gold: 1,
                silver: 3,
                bronze: 1,
                total: 5
            }, {
                athlete: "Missy Franklin",
                age: 17,
                country: "United States",
                year: 2012,
                date: "12/08/2012",
                sport: "Swimming",
                gold: 4,
                silver: 0,
                bronze: 1,
                total: 5
            }, {
                athlete: "Ryan Lochte",
                age: 27,
                country: "United States",
                year: 2012,
                date: "12/08/2012",
                sport: "Swimming",
                gold: 2,
                silver: 2,
                bronze: 1,
                total: 5
            }, {
                athlete: "Allison Schmitt",
                age: 22,
                country: "United States",
                year: 2012,
                date: "12/08/2012",
                sport: "Swimming",
                gold: 3,
                silver: 1,
                bronze: 1,
                total: 5
            }, {
                athlete: "Natalie Coughlin",
                age: 21,
                country: "United States",
                year: 2004,
                date: "29/08/2004",
                sport: "Swimming",
                gold: 2,
                silver: 2,
                bronze: 1,
                total: 5
            }, {
                athlete: "Ian Thorpe",
                age: 17,
                country: "Australia",
                year: 2e3,
                date: "01/10/2000",
                sport: "Swimming",
                gold: 3,
                silver: 2,
                bronze: 0,
                total: 5
            }, {
                athlete: "Dara Torres",
                age: 33,
                country: "United States",
                year: 2e3,
                date: "01/10/2000",
                sport: "Swimming",
                gold: 2,
                silver: 0,
                bronze: 3,
                total: 5
            }, {
                athlete: "Cindy Klassen",
                age: 26,
                country: "Canada",
                year: 2006,
                date: "26/02/2006",
                sport: "Speed Skating",
                gold: 1,
                silver: 2,
                bronze: 2,
                total: 5
            }, {
                athlete: "Nastia Liukin",
                age: 18,
                country: "United States",
                year: 2008,
                date: "24/08/2008",
                sport: "Gymnastics",
                gold: 1,
                silver: 3,
                bronze: 1,
                total: 5
            }, {
                athlete: "Marit Bjørgen",
                age: 29,
                country: "Norway",
                year: 2010,
                date: "28/02/2010",
                sport: "Cross Country Skiing",
                gold: 3,
                silver: 1,
                bronze: 1,
                total: 5
            }, {
                athlete: "Sun Yang",
                age: 20,
                country: "China",
                year: 2012,
                date: "12/08/2012",
                sport: "Swimming",
                gold: 2,
                silver: 1,
                bronze: 1,
                total: 4
            }]
        };
        document.addEventListener("DOMContentLoaded", (function() {
            var t = document.querySelector("#datatableSimple");
            new agGrid.Grid(t, e)
        }))
    },
    initVectorMap: function() {
        am4core.ready((function() {
            am4core.useTheme(am4themes_animated);
            var e, t = am4core.create("chartdiv", am4maps.MapChart);
            (e = ((e = (t.geodata = am4geodata_worldLow, t.projection = new am4maps.projections.Miller, t.series.push(new am4maps.MapPolygonSeries))).exclude = ["AQ"], e.useGeodata = !0, e.mapPolygons.template)).tooltipText = "{name}", e.polygon.fillOpacity = .6, e.states.create("hover").properties.fill = t.colors.getIndex(0), (e = t.series.push(new am4maps.MapImageSeries)).mapImages.template.propertyFields.longitude = "longitude", e.mapImages.template.propertyFields.latitude = "latitude", e.mapImages.template.tooltipText = "{title}", e.mapImages.template.propertyFields.url = "url", (t = e.mapImages.template.createChild(am4core.Circle)).radius = 3, t.propertyFields.fill = "color", (t = e.mapImages.template.createChild(am4core.Circle)).radius = 3, t.propertyFields.fill = "color", t.events.on("inited", (function(e) {
                ! function e(t) {
                    (t = t.animate([{
                        property: "scale",
                        from: 1,
                        to: 5
                    }, {
                        property: "opacity",
                        from: 1,
                        to: 0
                    }], 1e3, am4core.ease.circleOut)).events.on("animationended", (function(t) {
                        e(t.target.object)
                    }))
                }(e.target)
            })), t = new am4core.ColorSet, e.data = [{
                title: "Brussels",
                latitude: 50.8371,
                longitude: 4.3676,
                color: t.next()
            }, {
                title: "Copenhagen",
                latitude: 55.6763,
                longitude: 12.5681,
                color: t.next()
            }, {
                title: "Paris",
                latitude: 48.8567,
                longitude: 2.351,
                color: t.next()
            }, {
                title: "Reykjavik",
                latitude: 64.1353,
                longitude: -21.8952,
                color: t.next()
            }, {
                title: "Moscow",
                latitude: 55.7558,
                longitude: 37.6176,
                color: t.next()
            }, {
                title: "Madrid",
                latitude: 40.4167,
                longitude: -3.7033,
                color: t.next()
            }, {
                title: "London",
                latitude: 51.5002,
                longitude: -.1262,
                url: "http://www.google.co.uk",
                color: t.next()
            }, {
                title: "Peking",
                latitude: 39.9056,
                longitude: 116.3958,
                color: t.next()
            }, {
                title: "New Delhi",
                latitude: 28.6353,
                longitude: 77.225,
                color: t.next()
            }, {
                title: "Tokyo",
                latitude: 35.6785,
                longitude: 139.6823,
                url: "http://www.google.co.jp",
                color: t.next()
            }, {
                title: "Ankara",
                latitude: 39.9439,
                longitude: 32.856,
                color: t.next()
            }, {
                title: "Buenos Aires",
                latitude: -34.6118,
                longitude: -58.4173,
                color: t.next()
            }, {
                title: "Brasilia",
                latitude: -15.7801,
                longitude: -47.9292,
                color: t.next()
            }, {
                title: "Ottawa",
                latitude: 45.4235,
                longitude: -75.6979,
                color: t.next()
            }, {
                title: "Washington",
                latitude: 38.8921,
                longitude: -77.0241,
                color: t.next()
            }, {
                title: "Kinshasa",
                latitude: -4.3369,
                longitude: 15.3271,
                color: t.next()
            }, {
                title: "Cairo",
                latitude: 30.0571,
                longitude: 31.2272,
                color: t.next()
            }, {
                title: "Pretoria",
                latitude: -25.7463,
                longitude: 28.1876,
                color: t.next()
            }]
        }))
    },
    showSwal: function(e) {
        if ("basic" == e) Swal.fire("Any fool can use a computer");
        else if ("title-and-text" == e) {
            Swal.mixin({
                customClass: {
                    confirmButton: "btn bg-gradient-success",
                    cancelButton: "btn bg-gradient-danger"
                }
            }).fire({
                title: "Sweet!",
                text: "Modal with a custom image.",
                imageUrl: "https://unsplash.it/400/200",
                imageWidth: 400,
                imageAlt: "Custom image"
            })
        } else if ("success-message" == e) Swal.fire("Good job!", "You clicked the button!", "success");
        else if ("warning-message-and-confirmation" == e) {
            const e = Swal.mixin({
                customClass: {
                    confirmButton: "btn bg-gradient-success",
                    cancelButton: "btn bg-gradient-danger"
                },
                buttonsStyling: !1
            });
            e.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                type: "warning",
                showCancelButton: !0,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: !0
            }).then((t => {
                t.value ? e.fire("Deleted!", "Your file has been deleted.", "success") : t.dismiss === Swal.DismissReason.cancel && e.fire("Cancelled", "Your imaginary file is safe :)", "error")
            }))
        } else if ("warning-message-and-cancel" == e) {
            Swal.mixin({
                customClass: {
                    confirmButton: "btn bg-gradient-success",
                    cancelButton: "btn bg-gradient-danger"
                },
                buttonsStyling: !1
            }).fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: !0,
                confirmButtonText: "Yes, delete it!"
            }).then((e => {
                e.isConfirmed && Swal.fire("Deleted!", "Your file has been deleted.", "success")
            }))
        } else if ("custom-html" == e) {
            Swal.mixin({
                customClass: {
                    confirmButton: "btn bg-gradient-success",
                    cancelButton: "btn bg-gradient-danger"
                },
                buttonsStyling: !1
            }).fire({
                title: "<strong>HTML <u>example</u></strong>",
                icon: "info",
                html: 'You can use <b>bold text</b>, <a href="//sweetalert2.github.io">links</a> and other HTML tags',
                showCloseButton: !0,
                showCancelButton: !0,
                focusConfirm: !1,
                confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',
                confirmButtonAriaLabel: "Thumbs up, great!",
                cancelButtonText: '<i class="fa fa-thumbs-down"></i>',
                cancelButtonAriaLabel: "Thumbs down"
            })
        } else if ("rtl-language" == e) {
            Swal.mixin({
                customClass: {
                    confirmButton: "btn bg-gradient-success",
                    cancelButton: "btn bg-gradient-danger"
                },
                buttonsStyling: !1
            }).fire({
                title: "هل تريد الاستمرار؟",
                icon: "question",
                iconHtml: "؟",
                confirmButtonText: "نعم",
                cancelButtonText: "لا",
                showCancelButton: !0,
                showCloseButton: !0
            })
        } else if ("auto-close" == e) {
            let e;
            Swal.fire({
                title: "Auto close alert!",
                html: "I will close in <b></b> milliseconds.",
                timer: 2e3,
                timerProgressBar: !0,
                didOpen: () => {
                    Swal.showLoading(), e = setInterval((() => {
                        const e = Swal.getHtmlContainer();
                        if (e) {
                            const t = e.querySelector("b");
                            t && (t.textContent = Swal.getTimerLeft())
                        }
                    }), 100)
                },
                willClose: () => {
                    clearInterval(e)
                }
            }).then((e => {
                e.dismiss, Swal.DismissReason.timer
            }))
        } else if ("input-field" == e) {
            Swal.mixin({
                customClass: {
                    confirmButton: "btn bg-gradient-success",
                    cancelButton: "btn bg-gradient-danger"
                },
                buttonsStyling: !1
            }).fire({
                title: "Submit your Github username",
                input: "text",
                inputAttributes: {
                    autocapitalize: "off"
                },
                showCancelButton: !0,
                confirmButtonText: "Look up",
                showLoaderOnConfirm: !0,
                preConfirm: e => fetch("//api.github.com/users/" + e).then((e => {
                    if (e.ok) return e.json();
                    throw new Error(e.statusText)
                })).catch((e => {
                    Swal.showValidationMessage("Request failed: " + e)
                })),
                allowOutsideClick: () => !Swal.isLoading()
            }).then((e => {
                e.isConfirmed && Swal.fire({
                    title: e.value.login + "'s avatar",
                    imageUrl: e.value.avatar_url
                })
            }))
        }
    }
};
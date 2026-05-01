(async function () {
    const body = await fetch(`/jobs/${jobID}/route`).catch((err) => { console.log(err) });
    const json = await body?.json?.() || false;

    var e = 8;
    var temp;

    path = json?.data | [];

    var url = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
    var wanttofollow = [!1, "", 0, !0];
    var o = L.layerGroup();
    let n = L.layerGroup();
    var l = "";
    var map = L.map("mapts", {
        crs: L.CRS.Simple
    });

    // BOUNDS
    var i = L.latLngBounds(map.unproject([0, 131072], e), map.unproject([131072, 0], e));

    L.tileLayer("https://map.truckershub.in/ats/tiles/{z}/{x}/{y}.png", {
        maxZoom: e,
        minZoom: 0,
        minNativeZoom: 0,
        maxNativeZoom: e,
        tileSize: 512,
        reuseTiles: !0,
        bounds: i
    }).addTo(map);

    map.setView([312, 312], 0);


    // WATERMARK
    L.Control.Watermark = L.Control.extend({
        onAdd: function (map) {
            var img = L.DomUtil.create("img")
            img.src = "https://map.truckershub.in/images/brand.png"
            img.style.width = "200px"
            return img
        },
        onRemove: function (map) { }
    });

    L.Control.watermark = function (opts) {
        return new L.Control.Watermark(opts)
    }

    L.Control.watermark({ position: "bottomleft" }).addTo(map)

    map.zoomControl.setPosition("bottomright");
    o.addTo(map);
    n.addTo(map);
    map.setMaxBounds(i);

    var greenIcon = L.icon({
        iconUrl: '/map/images/green-flag.png',
        // shadowUrl: '/map/images/marker-shadow.png',
        iconAnchor: [5, 70]
    });
    var redIcon = L.icon({
        iconUrl: '/map/images/red-flag.png',
        // shadowUrl: '/map/images/marker-shadow.png',
        iconAnchor: [5, 70]
    });

    const pathCoords = [];
    path.forEach(p => {
        pathCoords.push(map.unproject(game_coord_to_image(p.position.X, p.position.Z), e))
    })
    const startMark = L.marker(pathCoords[0], { icon: greenIcon });
    const endMark = L.marker(pathCoords[pathCoords.length - 1], { icon: redIcon });
    var polyline = L.polyline(pathCoords, { color: 'red' });

    startMark.addTo(map);
    endMark.addTo(map);
    polyline.addTo(map);

    function game_coord_to_image(x, y) {
        return convertXY(x, y)
    }

    var p = 0;

    const speed = document.getElementById("speed");

    const play = document.getElementById("play");
    const playi = document.getElementById("playi");
    if (play) {
        play.addEventListener("click", () => {
            if (playi.classList.contains("fa-play")) {
                initRoute();

            } else {
                endRoute();
            }
        })
    }

    function initRoute() {
        playi.classList.remove("fa-play");
        playi.classList.add("fa-pause");

        p = 0;
        route()

        map.removeControl(startMark);
        map.removeControl(endMark);
        map.removeControl(polyline);

        map.setView(map.unproject(game_coord_to_image(path[p]?.position?.X, path[p]?.position?.Z), 8), 7);
    }

    function endRoute() {
        playi.classList.add("fa-play");
        playi.classList.remove("fa-pause");
        speed.innerHTML = 0 + " km/h";

        p = path.length;
        n.clearLayers();

        startMark.addTo(map);
        endMark.addTo(map);
        polyline.addTo(map);

        map.setView([312, 312], 0);
    }

    function route() {
        if (path[p]?.position?.X && path[p]?.position?.Z) {
            speed.innerHTML = path[p]?.speed?.mph + " m/h";
            n.clearLayers();
            try {
                coordtruck = game_coord_to_image(path[p]?.position?.X, path[p]?.position?.Z);
                map.setView(map.unproject(game_coord_to_image(path[p]?.position?.X, path[p]?.position?.Z), 8), map.getZoom());
                temp = new L.Marker(map.unproject(coordtruck, e), { icon: new L.DivIcon({ className: 'player', html: `<div class='triangle' style='rotate: ${parseInt(((0 - path[p].orientation.heading) * 360))}deg;'></div>` }) });
            } catch (error) {
                console.log(error)
            }
            n.addLayer(temp);
        }

        setTimeout(function () {
            if (p < path.length) {
                route();
                p++
            } else {
                endRoute();
            }
        }, 100);
    }
})()
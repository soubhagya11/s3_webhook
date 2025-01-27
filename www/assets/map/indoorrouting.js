/*
$.getJSON("assets/sampledata/hmt_path.geojson",function(json){
        var start   =   [78.5495170758,17.4198831673];
        var end     =   [78.54961795190573,17.419847278635093];
        routeJson   =   findRoute(json,start,end); 
        geojson     =   L.geoJSON(routeJson);
        map.addLayer(geojson);
 });
  */    

var xhr = new XMLHttpRequest();
xhr.addEventListener('progress', function(oEvent) {
    if (oEvent.lengthComputable) {
       // gauge.progress(oEvent.loaded, oEvent.total);
    }
});
xhr.onload = function() {
    //gauge.stop();
    if (xhr.status === 200) {
        //gauge.progress(100, 100);
        setTimeout(function() {
            initialize(JSON.parse(xhr.responseText));
        });
    }
    else {
        alert('Could not load routing network :( HTTP ' + xhr.status);
    }
};
//sreenadh
//xhr.open('GET', 'assets/sampledata/networksample.json');
xhr.open('GET', 'assets/sampledata/hmt_path.geojson');
fromtoWaypoint=[[57.7107,11.9894412],[57.68,11.90]];//networksample.json
xhr.send();

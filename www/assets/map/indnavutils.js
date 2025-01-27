"use strict";
function createIcon(iconName, iconColor, pin, fleetType, markerIcon) {
 if (pin){
   return L.divIcon({
      // specify a class name that we can refer to in styles, as we
      // do above.
      className: 'fa-icon',
      // html here defines what goes in the div created for each marker
      html:
        //'<span class="fa-stack">' +
        // '<i class="fa fa-circle fa-stack-1x " style="color:black;padding-left:0px;padding-top:20px;" ></i>' +
        // '<i class="icon asset-icon-a ' + iconName + ' fa-stack-1x" style="color:' + iconColor + ';padding-left:0px;padding-top:0px;" ></i>' +
        '<span class="fa-stack"><i class="icon ' + markerIcon + ' bgcolor fa-stack-2x "   style="color:' + iconColor + '" ></i> <i class="icon ' + iconName +' fa-stack-1x"   style="color:' + iconColor + '" ></i></span>',
      //   '</span>',
      // and the marker width and height
     // iconAnchor: [10, 5],
        iconAnchor: [10, 30],// 180405 changed
      // textColor: 'red'
      iconSize: [20, 30],
      borderColor: '#c32'
    })
  } else if(iconName === ''){
    return L.divIcon({
      className: 'fa-icon',
       iconSize: [20, 20],
      // html here defines what goes in the div created for each marker
      html:
      '<span class="fa-stack"><i class="icon fa-stack-2x"   style="color:' + iconColor + '" ></i> <i class="icon ' + iconName + ' fa-stack-1x" style="color: '+ iconColor +'" ></i></span>',
       iconAnchor: [10, 20] // 180405 changed
    })
  } else {
    return L.divIcon({
      // specify a class name that we can refer to in styles, as we
      // do above.
      className: 'fa-icon',
       iconSize: [20, 20],
      // html here defines what goes in the div created for each marker
      html:
        // '<span class="fa-stack">' +
        '<span class="fa-stack"><i class="icon ' + markerIcon + ' fa-stack-2x"   style="color:' + iconColor + '"></i> <i class="icon ' + iconName + ' fa-stack-1x white-icon" style="color: '+ iconColor +'" ></i></span>',
      // + '<i class="fa fa-' + iconName + ' fa-stack-1x" style="color:' + iconColor + ';padding-left:0px;padding-top:20px;" ></i>' +
      //       '<i class="fa fa-map-pin fa-stack-2x" style="color:'+pin+';padding-left:0px;padding-top:0px;" ></i>' +
      // '</span>',
      // and the marker width and height
     // iconAnchor: [15, 5] 
       iconAnchor: [10, 20] // 180405 changed
      // textColor: 'red'
      // iconSize: [10, 20]
    })
  }

}

function createFAIcon(iconName, iconColor) {
  var options = {
    icon: iconName,
    prefix: 'fa',
    //extraClasses: 'fa-3x',
    iconShape: 'marker',
    iconSize: [30, 30],
    //innerIconAnchor: [-5,-5],
    borderColor: 'grey',
    //borderWidth: 1,
    textColor: 'black',
    backgroundColor: iconColor,
    innerIconStyle: 'font-size:12px'
  };
  return L.BeautifyIcon.icon(options);
  //var myIcon = L.AwesomeMarkers.icon({icon: iconName, prefix: 'fa', markerColor: iconColor, iconColor: 'white' });
  //return myIcon;
}

function createDivIcon(iconColor) {
  var myIcon = new L.divIcon({
    //iconSize: new L.Point(10,10),
    //html: '<i class="fa fa-'+fleettype+'"></i>'
    html: '<svg height="13" width="13"><circle cx="5" cy="5" r="5" stroke="black" stroke-width="1" fill="' + iconColor + '"/></svg>',
    //html:'<svg><rect width="10" height="10" fill="'+fleetstatus+'"/></svg>',
  });
  //fleetIcon = L.AwesomeMarkers.icon({icon: fleettype,  prefix: 'fa', markerColor: fleetstatus, iconColor: 'white' });
  return myIcon;
}

function getAllUrlParams(url) {
 if ( url === undefined){
    url = localStorage.getItem('mapURL');
  } else {
    url = url;
  }
  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  // we'll store the parameters here
  var obj = {};
  // if query string exists
  if (queryString) {
    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];
    // split our query string into its component parts
    var arr = queryString.split('&');
    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');
      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function (v) {
        paramNum = v.slice(1, -1);
        return '';
      });
      // set parameter value (use 'true' if empty)
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      paramValue = paramValue.toLowerCase();
      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }
  return obj;
}

function centerLeafletMapOnMarker(map, marker) {
  var latLngs = [marker.getLatLng()];
  var markerBounds = L.latLngBounds(latLngs);
  map.fitBounds(markerBounds);
}
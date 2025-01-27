/******** MAP INITIALIZATION***** *******************************/
var map;
var postSearchZoom = 18;
var responsedata;
var parentchild;
result = '';
var fleetTypeAttr = [];
var displaybounds = [];
var boundaries = [];
var feature;
var displaypropertieslc;
var nontransactable;
var isSpecialstatus;
var listOfFleetStatus;
var reload = '';
var floorIds = new Array();
var allfloorIds = [];
var currentUtc;
var entrycordinates = []; // changed 180702
var floorsinsequence = []; // changed 180702
var infopopup;
var promotion;
var description;
var storeinfo;
var currentFloor;
var rotationAngleOpacity;
var langcode;
var nearFleets;
var zoomfinal;
var theMarker = {};
var instrData = [];
var instructionsData = [];
var instrValue;
var instrNumber;
var coordinatesData = [];
var instrMarker;
var nextIndex = 0;
var kioskMap;
var checkiskiosk;
var instrLat;
var instrLng;
var eventFromLatLng;
var eventFromLatLon
var navAnimationPolylines;
var navAnimationStartMarker;
var navAnimationPolylinesarry = [];
var groupAnimationpathMove;
var navAnimationPolylinesColour;
var polylineColor;
var bookMarkEnable;
var nearSpecialPath = false;
var visitorfloorid;
var heat = [];
var heatmapfloorid = '';
var heatFlag = false;
var todaydate = new Date();
var details;
var avgRating;
var assetLatLng;
var mapsettingsblock = JSON.parse(localStorage.getItem('DefaultUiSettingsData'));
var appColor = mapsettingsblock.theme_settings.button_primary_bg_color;
var Button_txt = mapsettingsblock.theme_settings.button_primary_text_color;
var buttonPrimaryBgHighlightColor = mapsettingsblock.theme_settings.button_primary_active_bg_color;
var buttonPrimaryHighlightTextColor = mapsettingsblock.theme_settings.button_primary_active_text_color;
var locateCoolOfPeriod = mapsettingsblock.map_settings.locate_cool_off_period;
var roleJsonData = JSON.parse(localStorage.getItem('rolebypageJson'));
var pageObj = roleJsonData['MAPS'] ? roleJsonData['MAPS'] : {};
var pageSettingsObj = pageObj.page_settings ? pageObj.page_settings['actions'] : {};
var heatMapEnabled = pageSettingsObj.setting_fields && pageSettingsObj.setting_fields.heat_map ? pageSettingsObj.setting_fields.heat_map : false;
var enabledinfopopup = pageSettingsObj.setting_fields && pageSettingsObj.setting_fields.display_reservations_on_map ? pageSettingsObj.setting_fields.display_reservations_on_map : false;
var bookmarksEnabled = pageSettingsObj.setting_fields && pageSettingsObj.setting_fields.bookmarks ? pageSettingsObj.setting_fields.bookmarks : false;
var specialFacilityTypesList = pageSettingsObj.setting_fields && pageSettingsObj.setting_fields.facility_icon ? pageSettingsObj.setting_fields.facility_icon : false;
var isMapLocationEnable = pageSettingsObj.setting_fields && pageSettingsObj.setting_fields.locate ? pageSettingsObj.setting_fields.locate : false;
var selectedFleetMarker;
// Variables defined for Custom Locate control - 210603
var locateMarker;
var locateCircle;
var currentPos;
var mapNamesObj = JSON.parse(window.localStorage.getItem('mapNameObj'))
var bookmarkDataObj = JSON.parse(window.localStorage.getItem('selectedBookmarkData'));

var LDomUtilApplyClassesMethod = function (method, element, classNames) {
  classNames = classNames.split(' ');
  classNames.forEach(function (className) {
    L.DomUtil[method].call(this, element, className);
  });
};
var addClasses = function (el, names) { LDomUtilApplyClassesMethod('addClass', el, names); };
var removeClasses = function (el, names) { LDomUtilApplyClassesMethod('removeClass', el, names); };
// Reload button code start
var customControl = L.Control.extend({
  options: {
    position: 'topleft'
  },
  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-control-locate leaflet-bar leaflet-control');
    container.icon = '';
    container.innerHTML = '<a class="leaflet-bar-part leaflet-bar-part-single"><span class="fa fa-refresh"></span></a>';
    container.style.backgroundColor = 'white';
    container.onclick = function () {
      check();
    }
    return container;
  }
});
/*** To Show Panorama Thumbnail ****/
var panoramaControl = L.Control.extend({
  options: {
    position: 'bottomleft'
  },
  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-control-locate leaflet-bar leaflet-control');
    container.icon = '';
    if (localStorage.getItem('degreeThumbnailPath') !== 'undefined') {
      var thumbnail = localStorage.getItem('apiendpoint') + '/' + localStorage.getItem('degreeThumbnailPath');
      // container.innerHTML = '<a class="leaflet-bar-part leaflet-bar-part-single"><img src="' + thumbnail + '" width="20" height="20"></img></a>';
      //  container.style.backgroundColor = 'white';
      container.onclick = function () {
        window.localStorage.setItem('panorama', 'panorama');
        parent.window.dispatchEvent(new Event('custom-event'));
      }
    }
    return container;
  }
});
function setBounds(path, wps, wpe) {
  var bounds = [];
  var from = [];
  var to = [];
  // if(navAnimationPolylinesColour) {
  //   polylineColor ='#FF0000';
  // } else{
  //   polylineColor ='#5c9ed1'
  // }
  if (path.path !== undefined) {
    for (var i = 0; i < path.path.length; i++) {
      var start = new L.LatLng(path.path[i][1], path.path[i][0]);
      var end = new L.LatLng(path.path[i][1], path.path[i][0]);
      from[i] = new L.LatLng(path.path[i][1], path.path[i][0]);
      to[i] = new L.LatLng(path.path[i][1], path.path[i][0]);
      bounds[i] = new L.LatLngBounds(start, end);
    }
    // var route = L.layerGroup([
    //   L.marker(wps),
    //   L.polyline([from, to]),
    //   L.marker(wpe)
    // ], {
    //   snakingSpeed: 2000
    // });
    // route.addTo(map).snakeIn();
    /* navpath animation start*/
    // var route = L.layerGroup([
    //   navAnimationStartMarker = L.marker(wps),
    //   navAnimationPolylines = L.polyline([from, to]),  // , {color: polylineColor}
    // ], { snakingPause: 200 });
    // route.addTo(map).snakeIn();
    // navAnimationPolylinesarry.push(navAnimationPolylines);
    // map.removeLayer(navAnimationStartMarker);
    /* navpath animation end*/
    map.fitBounds(bounds);
    var zoom = map.getBoundsZoom(bounds);
    map.setZoom(zoom - 1);
  }
}
/** clear polylines  **/
function clearPolylines() {
  polylineColor = '';
  for (i in navAnimationPolylinesarry) {
    if (navAnimationPolylinesarry[i] != undefined) {
      try {
        map.removeLayer(navAnimationPolylinesarry[i]);
      }
      catch (e) {
      }
    }
  }
  // Added if condition because got error when searching fleet map screen as home screen 
  if (navAnimationPolylines) {
    map.removeLayer(navAnimationPolylines);
    map.removeLayer(navAnimationStartMarker);
  }
}
/** Live navigation code changes starts - Ramohan - 181106 */
/** Following control is used to enable live navigation button in map */
/** live navigation commenting on 190103 */
/* var liveNavigationControl = L.Control.extend({
  options: {
    position: 'bottomleft'
    // position: 'bottomleft'
  },
  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-control-locate leaflet-bar leaflet-control');
    container.icon = '';
    container.innerHTML = '<a class="navigate-btn"><i class="icon asset-icon-map" ></i></a>';
    container.style.backgroundColor = 'white';
    container.onclick = function () {
      livenavpath('start');
    }
    return container;
  }
}); */
/** This function openNavPath calls live navigation path */
/** google icon commenting on 190103 */
/* var googleNavigationControl = L.Control.extend({
  options: {
    position: 'bottomright'
  },
  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-routing-container leaflet-bar leaflet-routing-container-hide leaflet-routing-collapsible leaflet-control googlemap-control');
    container.icon = '';
    container.innerHTML = '<a class="googlemap-img"><img src="../dist/images/google_maps.png"></a>';
   // container.style.backgroundColor = 'white';
    container.onclick = function () {
      openNavpathOnGoogle();
    }
    return container;
  }
}); */
/**
 * Start of code - Locate Custom control - 210603
 */
/**
 * Add control to map. Returns the container for the control.
 */

var locateControl = L.Control.extend({
  options: {
    position: 'bottomright',
    markerStyle: {
      color: '#136AEC',
      fillColor: '#2A93EE',
      fillOpacity: 0.7,
      weight: 2,
      opacity: 0.9,
      radius: 5
    },
  },
  onAdd: function (map) {
    // var isMapLocationEnable = JSON.parse(localStorage.getItem('rolebypageJson'));
    if (isMapLocationEnable) { // enable to condition for location based on role right
      var container = L.DomUtil.create('div', 'leaflet-control-facilities leaflet-control-locate leaflet-bar leaflet-control');
      container.icon = '';
      container.innerHTML = '<span class="facilities-btn" style="cursor: pointer;"><span class="icon-bg btn-loading"><i class="icon asset-icon-current-position current-position" aria-hidden="true" id="LocateBtn"></i></span><span class="fac-text">' + mapNamesObj.locate + '</span>  </span>';
      container.style.backgroundColor = 'white';
      const toAssetDetails = localStorage.getItem('toasset') ? true : false;
      const selectedFleetDetails = localStorage.getItem('selectedFleet') ? true : false;
      const detectLiveLocation = (toAssetDetails && selectedFleetDetails) ? false : (!toAssetDetails && selectedFleetDetails) ? false : (!selectedFleetDetails && toAssetDetails) ? false : true;
      if (detectLiveLocation && mapsettingsblock?.map_settings?.automatic_live_location_detection) {
        if (navigator.permissions) {
          // Check the permission status
          navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
            if (result.state === 'granted') {
              // Permission already granted
              activateLocationBasedFeatures();
            } else if (result.state === 'prompt') {
              // Request location permission for the first time
              requestLocationPermission();
            } else if (result.state === 'denied') {
              // Permission denied, inform the user
              alert(mapNamesObj.locationPermissionDeniedMsg);
            }
          });
        } else {
          // Fallback for browsers without Permissions API support
          requestLocationPermission();
        }
      }
      container.onclick = function () {
        if (navigator.permissions) {
          // Check the permission status
          navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
            if (result.state === 'granted') {
              // Permission already granted
              activateLocationBasedFeatures();
            } else if (result.state === 'prompt') {
              // Request location permission for the first time
              requestLocationPermission();
            } else if (result.state === 'denied') {
              // Permission denied, inform the user
              alert(mapNamesObj.locationPermissionDeniedMsg);
            }
          });
        } else {
          // Fallback for browsers without Permissions API support
          requestLocationPermission();
        }
      }
      var newDateObj = moment(new Date()).format('HH:mm:ss');
      var storagedMapLocatetimeout = localStorage.getItem('mapLocatetimeout') ? JSON.parse(localStorage.getItem('mapLocatetimeout')) : ''
      if (storagedMapLocatetimeout <= newDateObj) {
        locateAlert(); // Added to show popup 
      }
      return container;
    }
  }
});
function requestLocationPermission() {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      // Permission granted
      var curposcoordinates = {
        longitude: position.coords.longitude.toFixed(6),
        latitude: position.coords.latitude.toFixed(6),
        accuracy: position.coords.accuracy
      };
      // Added to set accurate coordinates in storage
      var mapCurPosCoordinates = {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
        accuracy: position.coords.accuracy
      };
      localStorage.setItem('currentGeoLocation', JSON.stringify(curposcoordinates));
      localStorage.setItem('mapCurrentGeoLocation', JSON.stringify(mapCurPosCoordinates));
      activateLocationBasedFeatures();
    },
    function (error) {
      // Handle error during permission request
      if (error.code === error.PERMISSION_DENIED) {
        alert(mapNamesObj.locationPermissionDeniedMsg);
      } else {
        alert(mapNamesObj.unableToAccessLocationMsg);
      }
    }
  );
}
function activateLocationBasedFeatures() {
  activeLocateButton();
  primaryTripMapButton();
  primaryHeatMapButton();
  primaryFacilitiesButton();
  onLocateClick();
}

/**
 * 240902 - Button to access the selected trip plan
 */
var tripPlanControl = L.Control.extend({
  options: {
    position: 'bottomright'
  },
  onAdd: function (map) {
    if (localStorage.getItem('DisplayTripPlanButtonOnMap')) {
      var container = L.DomUtil.create('div', 'leaflet-control-facilities leaflet-control-locate leaflet-bar leaflet-control');
      container.icon = '';
      container.innerHTML = '<span class="facilities-btn" style="cursor: pointer;"><span class="icon-bg btn-loading"><i class="icon fas fa-map-marked-alt fa-2x" aria-hidden="true" id="TripPlanBtn"></i></span><span class="fac-text">' + 'Trip Plan' + '</span>  </span>';
      container.style.backgroundColor = 'white';
      container.onclick = function () {
        onTripPlanClick();
        activeTripMapButton();
        primaryFacilitiesButton();
        primaryHeatMapButton();
        primaryLocateButton();

      }
      return container;
    }
  }
});

function onTripPlanClick() {
  window.localStorage.removeItem('assetDetails');
  window.localStorage.setItem('page_name', 'tripPlanner');
  parent.window.dispatchEvent(new Event('custom-event'));
}

// Common function to change button colors
function changeButtonColors(buttonId, bgColor, textColor) {
  var button = document.getElementById(buttonId);
  if (button) {
    button.style.backgroundColor = bgColor;
    button.style.color = textColor;
  }
}

function activeTripMapButton() {
  changeButtonColors("TripPlanBtn", buttonPrimaryHighlightTextColor, buttonPrimaryBgHighlightColor);
}

function primaryTripMapButton() {
  changeButtonColors("TripPlanBtn", buttonPrimaryHighlightTextColor, appColor);
}
// HeatMap button functions
function activeHeatMapButton() {
  changeButtonColors("myBtn", buttonPrimaryHighlightTextColor, buttonPrimaryBgHighlightColor);
}

function primaryHeatMapButton() {
  changeButtonColors("myBtn", buttonPrimaryHighlightTextColor, appColor);
}

// Locate button functions
function activeLocateButton() {
  changeButtonColors("LocateBtn", buttonPrimaryHighlightTextColor, buttonPrimaryBgHighlightColor);
}

function primaryLocateButton() {
  changeButtonColors("LocateBtn", buttonPrimaryHighlightTextColor, appColor);
}

// Facilities button functions
function activeFacilitiesButton() {
  changeButtonColors("facilities-btn", buttonPrimaryHighlightTextColor, buttonPrimaryBgHighlightColor);
}

function primaryFacilitiesButton() {
  changeButtonColors("facilities-btn", buttonPrimaryHighlightTextColor, appColor);
}

// SRINIVAS - 210823 Apply Cool of Period for locate popup
function locateAlert() {
  var locatePopup = $("#current-location-popup");
  locatePopup.find(".location-popup-message").text(mapNamesObj.click_on_locate_button);
  locatePopup.show();
  var mapLocatetimeout = moment(new Date()).add(locateCoolOfPeriod, 'm').format('HH:mm:ss')
  localStorage.setItem('mapLocatetimeout', JSON.stringify(mapLocatetimeout))
  setTimeout(function () {
    locatePopup.hide();
  }, 10000);
}
/**
 * This method is called when the user clicks on the control.
 */
function onLocateClick() {
  // Added to hide popup 
  var locatePopup = $("#current-location-popup");
  locatePopup.hide();
  if (this._interval !== undefined) {
    clearLocate();
    cleanClasses();
    return;
  }
  var locateIcon = document.getElementById("LocateBtn");
  removeClasses(locateIcon, 'icon asset-icon-current-position current-position');
  addClasses(locateIcon, 'loader');
  this._interval = setInterval(() => {
    if (localStorage.getItem('mapScreen')) {
      getLocation();
    }
  }, 5000)
}
/**
 * - Clears the Interval
 * - removes the marker
 */
function clearLocate() {
  clearInterval(this._interval);
  this._interval = undefined;
  if (locateMarker !== undefined) {
    map.removeLayer(locateMarker);
    locateMarker = undefined;
  }
  if (locateCircle !== undefined) {
    map.removeLayer(locateCircle);
    locateCircle = undefined;
  }
  currentPos = undefined;
}
function cleanClasses() {
  var locateIcon = document.getElementById("LocateBtn");
  removeClasses(locateIcon, 'loader');
  addClasses(locateIcon, 'icon asset-icon-current-position current-position');
}
function locationLiveClasses() {
  var locateIcon = document.getElementById("LocateBtn");
  removeClasses(locateIcon, 'loader');
  removeClasses(locateIcon, 'icon asset-icon-current-position current-position');
  addClasses(locateIcon, 'fa fa-2x fa-dot-circle');
}
function getLocation() {
  var currentLocation = JSON.parse(localStorage.getItem('mapCurrentGeoLocation'));
  // no need to do anything if the location has not changed
  if (currentPos &&
    (currentPos.lat === currentLocation.lat &&
      currentPos.lng === currentLocation.lng &&
      currentPos.accuracy === currentLocation.accuracy)) {
    return;
  }
  currentPos = currentLocation;
  if (currentLocation.accuracy === undefined) {
    currentLocation.accuracy = 0;
  }
  var radius = currentLocation.accuracy;
  if (!locateCircle) {
    locateCircle = L.circle([currentLocation.latitude, currentLocation.longitude], radius, {
      color: '#136AEC',
      fillColor: '#136AEC',
      fillOpacity: 0.15,
      weight: 2,
      opacity: 0.5
    }).addTo(map);
  } else {
    locateCircle.setLatLng([currentLocation.latitude, currentLocation.longitude]).setRadius(radius).setStyle({
      color: '#136AEC',
      fillColor: '#136AEC',
      fillOpacity: 0.15,
      weight: 2,
      opacity: 0.5
    });
  }
  if (!locateMarker) {
    locateMarker = L.circleMarker([currentLocation.latitude, currentLocation.longitude], {
      color: '#136AEC',
      fillColor: '#2A93EE',
      fillOpacity: 1,
      weight: 2,
      opacity: 0.9,
      radius: 5
    }).addTo(map);
  } else {
    locateMarker.setLatLng([currentLocation.latitude, currentLocation.longitude]);
  }
  cleanClasses();
  locationLiveClasses();
  map.panTo.bind(map)([currentLocation.latitude, currentLocation.longitude]);
}
/**
 * End of code - Locate Custom control - 210603
 */
var facilitiesControl = L.Control.extend({
  options: {
    position: 'bottomright'
  },
  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-control-facilities leaflet-control-locate leaflet-bar leaflet-control');
    container.icon = '';
    // Disbled facility on map for FossilRim 210528 by Sunil
    // SRINIVAS - 210823 Display Facility Type Icon Based on Enterprise
    if (specialFacilityTypesList) {
      container.innerHTML = '<span class="facilities-btn" style="cursor: pointer;"><span class="icon-bg"><i id="facilities-btn"class="icon asset-icon-facilities current-position" aria-hidden="true" id="myBtn"></i></span><span class="fac-text" onclick="facilitiesIconclick()">' + JSON.parse(window.localStorage.getItem('mapNameObj')).mapfacilities + '</span></span>';
    } else {
      container.innerHTML = '';
    }
    container.style.backgroundColor = 'white';
    container.onclick = function () {
      activeFacilitiesButton();
      primaryTripMapButton()
      primaryLocateButton();
      primaryHeatMapButton()
      functionAlert();
      var flShow = thisGeoArea.floorToShow;
      // initializeRouter(thisGeoArea.map, thisGeoArea.gaFloorPathUrls[flShow]);
    }
    return container;
  }
});
// add refresh button
var refreshControl = L.Control.extend({
  options: {
    position: 'topright'
  },
  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-control-facilities leaflet-bar leaflet-control');
    container.icon = '';
    // Disbled facility on map for FossilRim 210528 by Sunil
    // SRINIVAS - 210823 Display Facility Type Icon Based on Enterprise   
    container.innerHTML = '<span class="facilities-btn"><span class="icon-bg"><i class="icon fas fa-sync-alt refresh-btn" aria-hidden="true" id="refreshbtn"></i></span><span class="fac-text">' + mapNamesObj.refresh + '</span></span>';
    container.style.backgroundColor = 'transparent';
    container.onclick = function () {
      thisGeoArea.updateMap()
    }
    return container;
  }
});
var exploreControl = L.Control.extend({
  options: {
    position: 'bottomright'
  },
  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-control-facilities leaflet-control-locate leaflet-bar leaflet-control');
    container.icon = '';
    container.innerHTML = '<a class="explore-btn"><i class="icon fa fa-etsy block" " aria-hidden="true"></i><span class="fac-text"> ' + mapNamesObj.explore + ' </span></a>';
    container.style.backgroundColor = 'white';
    container.onclick = function () {
      openEnterpriseDetailsPage();
    }
    return container;
  }
});
if (heatMapEnabled) {
  var heatMapControl = L.Control.extend({
    options: {
      position: 'bottomright'
    },
    onAdd: function (map) {
      var container = L.DomUtil.create('div', 'leaflet-control-facilities leaflet-control-locate leaflet-bar leaflet-control');
      container.icon = '';
      container.innerHTML = '<span class="facilities-btn" style="cursor: pointer;"><span class="icon-bg"><i class="icon asset-icon-heat-map current-position" aria-hidden="true" id="myBtn"></i></span><span class="fac-text"> ' + mapNamesObj.heatmap + ' </span></span>';
      container.style.backgroundColor = 'white';
      container.onclick = function () {
        var flagValue = true;
        activeHeatMapButton();
        primaryTripMapButton();
        primaryLocateButton();
        primaryFacilitiesButton()
        getCurrDate();
        visitorHeatMap(parseInt(thisGeoArea.gaFloorIds[thisGeoArea.floorToShow]), flagValue);
      }
      return container;
    }
  });
}
function facilitiesIconclick() {
  //RameshK 
  var element = document.getElementById('facilities-myBtn');

  // Now you can do something with the element
  console.log(element);
  console.log('facilitiesIconclick')
  localStorage.setItem('clickLocate', "clickLocate");
  functionAlert();
  var flShow = thisGeoArea.floorToShow;
  initializeRouter(thisGeoArea.map, thisGeoArea.gaFloorPathUrls[flShow]);
}
function getCurrDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  todaydate = yyyy + '-' + mm + '-' + dd;
}
function instructionData(text, distance, coordinate, icon, totaldistance, totaltime) {
  instrData.push(text + ' ' + distance);
  instructionsData.push(icon + '$' + text + '$' + distance);
  thisGeoArea.totaldistance = totaldistance;
  thisGeoArea.totaltime = totaltime;
  coordinatesData.push(coordinate);
  if (instrNumber == instrData.length) {
    instrValue = false;
  }
}
function instruction(action) {
  if (instrMarker) {
    instrMarker.remove(map);
  }
  if (instrLat && instrLng) {
    instrLat = '';
    instrLng = '';
  }
  var resultData = [];
  if (instrData.length > 0) {
    if (action == 'previous') {
      if (nextIndex > 0) {
        nextIndex = nextIndex - 1;
        instructionPopup(resultData);
      }
    } else if (action == 'next') {
      if (instrData.length - 1 > nextIndex) {
        if (nextIndex === 0) {
          instructionPopup(resultData);
          nextIndex++
        } else {
          nextIndex++;
          instructionPopup(resultData);
        }
      } else {
        if (multiFloorNav.fromFloorId === thisGeoArea.floorToShow && multiFloorNav.toFloorId !== thisGeoArea.floorToShow) {
          thisGeoArea.changeFloorTo(multiFloorNav.toFloorId);
          var instrBox = $("#instruction");
          resultData.push(mapNamesObj.you_reached + ' ' + thisGeoArea.floorToShow)
          instrBox.find(".instrdata").text(resultData);
          instrBox.show();
        } else {
          var instrBox = $("#instruction");
          instrBox.find(".instrdata").text(instrData[instrData.length - 1]);
          instrBox.show();
        }
      }
    }
  } else {
    var instrBox = $("#instruction");
    instrBox.hide();
  }
}
function instructionPopup(resultData) {
  for (var i = 0; i < instrData.length; i++) {
    if (i === nextIndex) {
      resultData.push(instrData[i]);
      instrLat = coordinatesData[i].lat;
      instrLng = coordinatesData[i].lng
      instrMarker = L.circleMarker([coordinatesData[i].lat, coordinatesData[i].lng], {
        color: '#3364FF',
        radius: 6,
        opacity: 1,
        weight: 1,
        fillOpacity: 1
      }).addTo(map);
      map.panTo(new L.LatLng(coordinatesData[i].lat, coordinatesData[i].lng));
    }
  }
  var instrBox = $("#instruction");
  instrBox.find(".instrdata").text(resultData);
  instrBox.show();
  var floorName = document.getElementById('floor');
  floorName.innerHTML = thisGeoArea.floorToShow;
}
function functionAlert(msg, myYes) {
  var confirmBox = $("#confirm");
  confirmBox.find(".message").text(msg);
  confirmBox.find(".yes").unbind().click(function () {
    confirmBox.hide();
    primaryFacilitiesButton();
  });
  confirmBox.find(".yes").click(myYes);
  confirmBox.show();
  activeFacilitiesButton();
}
function openEnterpriseDetailsPage() {
  window.localStorage.setItem('enterpriseDetailsPage', 'enterpriseDetailsPage');
  parent.window.dispatchEvent(new Event('custom-event'));
}
function openNavpathOnGoogle() {
  window.localStorage.setItem('openGoogleNavpath', 'openGoogleNavpath')
  parent.window.dispatchEvent(new Event('custom-event'));
}

function visitorHeatMapDemo(cuflid, flagValue) {
  if (heatMapEnabled) {
    var addressPoints = [];
    var url = localStorage.getItem('s3bucket_url') + 'assets/enterprises/' + localStorage.getItem('selected_enterprise') + '/heatmap/heatmap.json';
    $.ajax({
      url: url,
      type: 'GET',
      headers: {
        "token": window.localStorage.getItem('token')
      },
      error: function (err) {
        alert(mapNamesObj.heatmap_not_available);
      },
      success: function (data) {
        var heatmapData = data.facilities;
        for (var i = 0; heatmapData && i < heatmapData.length; i++) {
          var item = [heatmapData[i].lat, heatmapData[i].lang, heatmapData[i].heatvalue];
          addressPoints.push(item);
          if (i == (heatmapData.length - 1)) {
            map.flyTo([heatmapData[i].lat, heatmapData[i].lang], 18, {
              duration: 0.1,
              animate: true
            });
            if (heat) {
              map.removeLayer(heat);
              heat = null;
            }
            setTimeout(function () {
              heat = L.heatLayer(addressPoints, { radius: 55, minOpacity: 0.0, blur: 15, gradient: { 0.4: 'lime', 0.75: 'yellow', 1.0: 'brown' } }).addTo(map);
            }, 1000);
          }
        }
      }
    });
  }
}
function visitorHeatMap(cuflid, flagValue) {
  if (flagValue === true) {
    visitorHeatMapDemo(cuflid, flagValue);
    return;
  }
  if (heatFlag === false && flagValue === true) {
    visitorfloorid = cuflid;
    var url;
    var analyticstartdate = '2019-01-23';
    url = localStorage.getItem('apiendpoint') + '/api/v1/analytics/dashboard/facilities/users/' + window.localStorage.getItem('enterpriseName') + '/' + analyticstartdate + '/' + todaydate;
    $.ajax({
      url: url,
      type: 'GET',
      error: function (err) {
        // if(err.status === 0) {
        //   alert('Internet not availabale');
        // }
      },
      success: function (data) {
        var fleetCodearr = [];
        var intensity = 0
        var count = 0;
        for (var j = 0; j < data.result.length; j++) {
          count = count + parseInt(data.result[j].usersCount);
        }
        for (var i = 0; i < data.result.length; i++) {
          if (parseInt(data.result[i].usersCount) === 1) {
            var intensityval = ((data.result[i].usersCount) / count);
            intensity = intensityval + 0.19999;
          } else if (parseInt(data.result[i].usersCount) === 2) {
            var intensityval = ((data.result[i].usersCount) / count);
            intensity = intensityval + 0.16666;
          } else {
            intensity = ((data.result[i].usersCount) / count);
          }
          intensity = intensity;
          if (visitorfloorid === data.result[i].floorPlanFleetObj) {
            heatFlag = true;
            heat.push(L.heatLayer([
              [data.result[i].geoCoordinates[0], data.result[i].geoCoordinates[1],
                intensity
              ]
            ], {
              radius: 15,
              maxZoom: 20,
            }).addTo(map));
          }
        }
      }
    });
  } else {
    heatFlag = false;
    if (heat) {
      for (let k = 0; k < heat.length; k++) {
        map.removeLayer(heat[k]);
      }
      heat = [];
    }
  }
}
/** This function repeatedly calls live navigation path */
// var timer = '';
// function livenavpath(action) {
//   if (action == 'start') {
//       instrData = [];
//       coordinatesData = [];
//       instrNumber = 0;
//       instrValue = true;
//     timer = setInterval(livepath, 1000);
//   } else {
//     clearInterval(timer);
//   }
// }
/** This method generates live navigation path */
function livepath() {
  if (nextIndex == 0) {
    instruction('next');
    // nextIndex = 1;
  }
  try {
    var toLat = parseFloat(ordinates.lat);
    var toLon = parseFloat(ordinates.lng);
  } catch (err) {
    var toLat = parseFloat(localStorage.getItem('lat'));
    var toLon = parseFloat(localStorage.getItem('lon'));
  }
  if (localStorage.getItem('currentpostion')) {
    var currentpostion = JSON.parse(localStorage.getItem('currentpostion'));
    var startLat = currentpostion.latitude;
    var startLon = currentpostion.longitude;
    window.localStorage.setItem('navigate', 'true');
    showSpinner();
    if (thisGeoArea.specialPOIs['L60-SelectedAssets'] && thisGeoArea.specialPOIs['L60-SelectedAssets'].length > 0) {
      var specialfleets = thisGeoArea.specialPOIs['L60-SelectedAssets'];
    } else {
      var specialfleets = thisGeoArea.specialPOIs['L70-Staircase'];
    }
    if (nearFleets === false) {
      showIndoorRoute(startLat, startLon, toLat, toLon, false, thisGeoArea.gaShowFloorPathNetwork);
    } else {
      showIndoorShortestMultiplePOIRoute(startLat, startLon, specialfleets, false, thisGeoArea.gaShowFloorPathNetwork);
    }
    function setIFromLatLon() {
      multiFloorNav.fromBuildingName = thisGeoArea.gaName;
      multiFloorNav.fromFloorId = thisGeoArea.floorToShow;
      multiFloorNav.fromLatLng = [startLat, startLon];
      if (nearFleets === false) {
        if (multiFloorNav.toBuildingName === null) {
          showIndoorRoute(multiFloorNav.fromLatLng[0], multiFloorNav.fromLatLng[1], null, null, false, thisGeoArea.gaShowFloorPathNetwork);
        } else if (multiFloorNav.fromBuildingName === multiFloorNav.toBuildingName) {
          if (multiFloorNav.fromFloorId === multiFloorNav.toFloorId) {
            showIndoorRoute(multiFloorNav.fromLatLng[0], multiFloorNav.fromLatLng[1], multiFloorNav.toLatLng[0], multiFloorNav.toLatLng[1], false, thisGeoArea.gaShowFloorPathNetwork);
          } else {
            doMultiFloorNavigation(thisGeoArea);
          }
        }
      } else {
        showIndoorShortestMultiplePOIRoute(startLat, startLon, specialfleets, false, thisGeoArea.gaShowFloorPathNetwork);
      }
    }
    setIFromLatLon();
  }
}
/** Live navigation code ends - Ramohan - 181106 */
function getMultifloorStairCases() {
  var AssertFleet = JSON.parse(localStorage.getItem(getAllUrlParams().sr));
  var AssertFleetInfo = AssertFleet['floorsData'];
  var listofStairs = {};
  // var floorLevelStairs = {};
  //var stairsobj = [];
  for (var i = 0; i < AssertFleetInfo.length; i++) {
    //  stairsobj = [];
    for (var x = 0; x < AssertFleetInfo[i]['features'].length; x++) {
      var fleettype = AssertFleetInfo[i]['features'][x].properties.facilityType;
      if (fleettype.split('-')[1] === 'Staircase') {
        listofStairs[AssertFleetInfo[i]['features'][x].properties.facilityName] = AssertFleetInfo[i]['features'][x].address.geo_coordinates;
        //    obj.push(AssertFleetInfo[i]['features'][x].address.geoCoordinates);
      }
    }
    //   floorLevelStairs[fleetInfo['floorsData'][i]['features'][0].properties.level] = obj;
  }
  return listofStairs;
}
function getFloorlevelStairCases() {
  var AssertFleet = JSON.parse(localStorage.getItem(getAllUrlParams().sr));
  var AssertFleetInfo = AssertFleet['floorsData'];
  var floorLevelStairs = {};
  var stairsobj = [];
  for (var i = 0; i < AssertFleetInfo.length; i++) {
    stairsobj = [];
    for (var x = 0; x < AssertFleetInfo[i]['features'].length; x++) {
      var facilityType = AssertFleetInfo[i]['features'][x].properties.facilityType;
      if (facilityType.split('-')[1] === 'Staircase') {
        stairsobj.push(AssertFleetInfo[i]['features'][x].address.geoCoordinates);
      }
    }
    if (AssertFleetInfo[i]['features'].length > 0) {
      floorLevelStairs[AssertFleetInfo[i]['features'][0].properties.level] = stairsobj;
    }
  }
  return floorLevelStairs;
}
function getdisplaymapsettings(feature, popupLocation, displayproperties, displayColumns, page_name) {
  var boundaries = [];
  //return window.localStorage.getItem(getAllUrlParams().ms);
  var feature;
  var d2m_name;
  if (page_name === 'facilityreservations') {
    d2m_name = "facility_reservations";
  } else {
    d2m_name = page_name;
  }
  if (getAllUrlParams().ut == 'locate' && getAllUrlParams().api != 'local') {
    var fleetstatus;
    if (feature.feature.fleetReservationId && feature.feature.multiReservationCount <= 1) {
      fleetstatus = false;
    } else {
      if (getAllUrlParams().pn == 'publicevents' && feature.feature.is_transactable == true) {
        fleetstatus = false;
      } else {
        fleetstatus = true;
        if (feature.feature.multiReservationCount > 1) {
          feature.feature.multiReservationText = mapNamesObj.multiple;
        }
      }
    }
    if (getAllUrlParams().pn === 'cartaddedassets') {
      var pName = 'facilities'
    } else {
      pName = getAllUrlParams().pn
    }
    var url = localStorage.getItem('s3bucket_url') + 'assets/enterprises/' + feature.properties.enterpriseId + '/displaytomapsettings/display_to_map_settings.json';
    // url = url + '/' + feature.properties.enterpriseId + '/' + pName + '/' + fleetstatus;
    $.ajax({
      url: url,
      type: 'GET',
      headers: {
        "token": window.localStorage.getItem('token')
      },
      error: function (err) {
        popupFeatureProperties(feature, popupLocation, displayproperties, displayColumns);
      },
      success: function (data) {
        displaypropertieslc = JSON.parse(data);
        localStorage.setItem('d2MSettingsData', JSON.stringify(displaypropertieslc));
        if (displaypropertieslc && displaypropertieslc.length > 0) {
          for (i = 0; i < displaypropertieslc.length; i++) {
            if (displaypropertieslc[i].base_table === d2m_name) {
              for (k = 0; k < displaypropertieslc[i].settings.length; k++) {
                displayproperties.push(displaypropertieslc[i].settings[k].base_table_column_name);
                displayColumns.push(displaypropertieslc[i].settings[k].label_to_show_in_map);
              }
            }
          }
        }
        popupFeatureProperties(feature, popupLocation, displayproperties, displayColumns)
      }
    });
  } else {
    if (getAllUrlParams().pn === 'publicevents' && window.localStorage.getItem('publiceventsinfo')) {
      if (feature.feature.facilityId === undefined) {
        feature.feature.facilityId = feature.feature.fleetObj._id;
        feature.feature.properties.enterpriseId = feature.feature.properties.enterpriseId;
      }
      if (parseInt(window.localStorage.getItem('publiceventsfleetId')) === feature.feature.facilityId) {
        feature.feature = JSON.parse(window.localStorage.getItem('publiceventsinfo'));
        if (feature.feature.length > 1) {
          feature.feature.multiReservationCount = feature.feature.length;
          feature.feature = feature.feature[0];
          displayproperties = JSON.parse(localStorage.getItem('displayproperties'));
          displayColumns = JSON.parse(localStorage.getItem('displayColumns'));
        } else {
          feature.feature = feature.feature[0];
          feature.feature.imagePath = feature.feature.fleetObj.imagePath;
          feature.feature.imageName = feature.feature.fleetObj.imageName
          displayproperties = JSON.parse(localStorage.getItem('pubiceventsdisplayproperties'));
          displayColumns = JSON.parse(localStorage.getItem('publiceventsdisplayColumns'));
        }
      } else {
        displayproperties = JSON.parse(localStorage.getItem('displayproperties'));
        displayColumns = JSON.parse(localStorage.getItem('displayColumns'));
      }
    } else {
      displayproperties = JSON.parse(localStorage.getItem('displayproperties'));
      displayColumns = JSON.parse(localStorage.getItem('displayColumns'));
    }
    popupFeatureProperties(feature, popupLocation, displayproperties, displayColumns);
    // 	var url = 'assets/enterprises/' + getAllUrlParams().eid + '/maplocate-' + getAllUrlParams().eid + '-fleets-true.json';
    // 	url = url; //+ '/' + feature.properties.enterpriseId + '/' + this.getAllUrlParams().pn + '/' + fleetstatus;
    // 	$.ajax({
    // 	  url: url,
    // 	  type: 'GET',
    // 	  headers: {
    // 		"token": window.localStorage.getItem('token')
    // 	  },
    // 	  error: function (err) {
    // 	var fleetstatus;
    // 	if(feature.feature.fleetReservationId){
    // 	  fleetstatus = false;
    // 	} else {
    // 	  fleetstatus = true;
    // 	}
    // 	var url = localStorage.getItem('apiendpoint') + '/api/v1/displaytomapsetting/maplocate';
    // 	url = url + '/' + feature.properties.enterpriseId + '/' + getAllUrlParams().pn + '/' + fleetstatus;
    // 	$.ajax({
    // 	  url: url,
    // 	  type: 'GET',
    // 	  headers: {
    // 		"token": window.localStorage.getItem('token')
    // 	  },
    // 	  error: function (err) {
    // 	   popupFeatureProperties(feature, popupLocation, displayproperties, displayColumns);
    // 	  },
    // 	  success: function (data) {
    // 		displaypropertieslc = data;
    // 		if (displaypropertieslc && displaypropertieslc.result.length > 0) {
    // 		  for (i = 0; i < displaypropertieslc.result.length; i++) {
    // 			displayproperties.push(displaypropertieslc.result[i].baseTableColumnName);
    // 			displayColumns.push(displaypropertieslc.result[i].labelToShowInMap);
    // 		  }
    // 		}
    // 		popupFeatureProperties(feature, popupLocation, displayproperties, displayColumns)
    //  }
    // });
    // 	  // popupFeatureProperties(feature, popupLocation, displayproperties, displayColumns);
    // 	  },
    // 	  success: function (data) {
    // 		displaypropertieslc = data;
    // 		if (displaypropertieslc && displaypropertieslc.result.length > 0) {
    // 		  for (i = 0; i < displaypropertieslc.result.length; i++) {
    // 			displayproperties.push(displaypropertieslc.result[i].baseTableColumnName);
    // 			displayColumns.push(displaypropertieslc.result[i].labelToShowInMap);
    // 		  }
    // 		}
    // 		popupFeatureProperties(feature, popupLocation, displayproperties, displayColumns)
    //  }
    // });
  }
}
// function gaPopupCallback(e) {
//   // if (e.target.options.opacity === 1) {
//   //     var facilityIconFileName = e.target.feature.properties.facilityIconFileName;
//   //   var iconColor = e.target.feature.properties.iconcolor;
//   // if (theMarker != undefined) {
//   //     map.removeLayer(theMarker);
//   //   };
//   //   theMarker = L.marker(e.latlng, {
//   //   icon: L.divIcon({ className: 'fa-icon',
//   //   html:
//   //   '<span class="fa-stack"><i class="icon asset-icon-marker-with-circle bgcolor fa-stack-2x"   style="color:' + iconColor + '" ></i> <i class="icon ' + facilityIconFileName +' fa-stack-1x"   style="color:' + iconColor + '" ></i></span>',
//   // iconAnchor: [10, 22],
//   // iconSize: [20, 30],
//   // borderColor: '#c32'
//   // })}).addTo(map);
//   // }
//   currentFloor = e.target.feature.properties.level;
//   if (e.target) {
//     var kisokdetails = e.target.feature;
//     window.localStorage.setItem('fleetDetails', JSON.stringify(kisokdetails));
//   }
//   var checkiskiosk = window.localStorage.getItem('devicetypecheck');
//   if (checkiskiosk === 'true' && e.target.options.opacity === 1) {
//     parent.window.dispatchEvent(new Event('custom-event-kiosk'));
//     var facilityIconFileName = e.target.feature.properties.facilityIconFileName;
//     var iconColor = e.target.feature.properties.iconcolor;
//     if (theMarker != undefined) {
//       map.removeLayer(theMarker);
//     };
//     theMarker = L.marker(e.latlng, {
//       icon: L.divIcon({
//         className: 'fa-icon',
//         html:
//           '<span class="fa-stack"><i class="icon asset-icon-marker-with-circle bgcolor fa-stack-2x"   style="color:' + iconColor + '" ></i> <i class="icon ' + facilityIconFileName + ' fa-stack-1x"   style="color:' + iconColor + '" ></i></span>',
//         iconAnchor: [10, 22],
//         iconSize: [20, 30],
//         borderColor: '#c32'
//       })
//     }).addTo(map);
//   } else if (e.target.options.opacity === 1) {
//     // Added code to redirect the asset details page when click on asset - 190103
//     window.localStorage.setItem('assetDetails', 'assetDetails');
//     parent.window.dispatchEvent(new Event('custom-event'));
//     // displayMapPopup(e.target, e.latlng);
//   }
//   if (e.target.options.opacity === 1) {
//     parent.window.dispatchEvent(new Event('custom-event-kiosk'));
//   }
// }
/*Added code for botttom sheet on map */
function gaPopupCallback(e) {
  if (enabledinfopopup) {
    displayMapPopup(e.target, e.latlng);
  } else {
    if (e.target.options.opacity === 1) {
      var temp = document.getElementById('assetDetails');
      var button = document.getElementById('navButton');
      var viewButton = document.getElementById('viewButton');
      temp.innerHTML = '';
      button.innerHTML = '';
      viewButton.innerHTML = '';
      var listContent = '';
      var buttonContent = '';
      var viewButtonContent = '';
      var assetImg = document.getElementById('assetImg');
      var assetDesc = document.getElementById('assetDesc');
      assetImg.innerHTML = '';
      assetDesc.innerHTML = '';
      var imgContent = '';
      var descContent = '';
      assetDetails = e.target.feature;
      details = e.target;
      assetLatLng = e.latlng;
      var facilityIconFileName = details.feature.properties.iconName;
      var iconColor = details.feature.properties.iconcolor;
      var markerIcon = mapsettingsblock?.map_settings?.icon?.icon_class_name ? mapsettingsblock.map_settings.icon.icon_class_name : 'asset-icon-marker-with-circle';
      if (!assetDetails.properties.levelDisplay) {
        var peopleIconName = localStorage.getItem('apiendpoint') + '/' + assetDetails.imagePath + '/' + assetDetails.imageName;
        if (assetDetails.callTo) {
          var peopleAddress = assetDetails.callTo.userId.enterpriseResourceObj.address.city + ', ' +
            assetDetails.callTo.userId.enterpriseResourceObj.address.state + ', ' + ', ' + assetDetails.callTo.userId.enterpriseResourceObj.address.country
        } else if (assetDetails.messageTo) {
          var peopleAddress = assetDetails.messageTo.userId.enterpriseResourceObj.address.city + ', ' +
            assetDetails.messageTo.userId.enterpriseResourceObj.address.state + ', ' + assetDetails.messageTo.userId.enterpriseResourceObj.address.country;
        } else {
          var peopleAddress = assetDetails.address.city + ', ' +
            assetDetails.address.state + ', ' + assetDetails.address.country
        }
      }
      if (theMarker != undefined) {
        map.removeLayer(theMarker);
      };
      if (selectedFleetMarker != undefined) {
        map.removeLayer(selectedFleetMarker);
      }
      theMarker = L.marker(assetLatLng, {
        icon: L.divIcon({
          className: 'fa-icon',
          html:
            '<span class="fa-stack"><i class="icon ' + markerIcon + ' bgcolor fa-stack-2x"   style="color:' + iconColor + '" ></i> <i class="icon ' + facilityIconFileName + ' fa-stack-1x"   style="color:' + iconColor + '" ></i></span>',
          iconAnchor: [10, 22],
          iconSize: [20, 30],
          borderColor: '#c32'
        })
      }).addTo(map);
      getReviews(assetDetails);
      var navigate = mapNamesObj.navigatebutton;
      if (assetDetails.properties.levelDisplay) {
        if (assetDetails.properties.facilityImageFilePath && assetDetails.properties.facilityImageFileName) {
          if (assetDetails.imageUrlAfterTransformation) {
            const netWorkStatus = localStorage.getItem('networkStatus');
            const isNetworkAvailable = (netWorkStatus === 'Online') ? true : false;
            const urlSplitArray = assetDetails.imageUrlAfterTransformation.split('http://');
            const imageUrlAfterTransformation = (!isNetworkAvailable && urlSplitArray.length === 1) ? '../../../' + assetDetails.imageUrlAfterTransformation : assetDetails.imageUrlAfterTransformation;
            imgContent += '<img onclick="getAssetDetails();" onerror="this.onerror=null;this.src=\'' + localStorage.getItem('enterpriseImage') +
              '\'" src="' + imageUrlAfterTransformation + '" height="60"  style="display: inline-block"/>';
          } else {
            imgContent += '<img onclick="getAssetDetails();" onerror="this.onerror=null;this.src=\'' + localStorage.getItem('enterpriseImage') +
              '\'" src="' + localStorage.getItem('s3bucket_url') + assetDetails.properties.facilityImageFilePath + '/' + assetDetails.properties.facilityImageFileName + '" height="60"  style="display: inline-block"/>';
          }
        } else {
          imgContent += '<span onclick="getAssetDetails();" class= "' + assetDetails.properties.iconName + '" style="height:60px;font-size: 3.5em;background: ' + assetDetails.properties.FacilityTypeBackgroundColor + ';position: relative;display:flex;align-items:center;justify-content:center;padding:0px;"></span>'
        }
      } else {
        imgContent += '<img onclick="getAssetDetails();" onerror="this.onerror=null;this.src=\'' + localStorage.getItem('enterpriseImage') +
          '\'" src="' + peopleIconName + '" height="60"  style="display: inline-block"/>';
      }
      descContent += '<p onclick="getAssetDetails();" style="font-size: 13px;cursor:pointer;font-weight:700;color:#134021;overflow: hidden !important;text-overflow: ellipsis !important;display: -webkit-box !important;-webkit-box-orient: vertical !important;-webkit-line-clamp: 2 !important;white-space: normal;line-height: 1.3;margin-bottom: 0px !important;max-height: 3.75rem;color:' + appColor + ';">' + assetDetails.properties.facilityName + '</p>';
      /** Added Condition for Fossil Rim Client Requirement : Do not display the asset rating and level - 210603 */
      // SRINIVAS - 210823 commented code for rating
      //   listContent += '<div style="padding-left: 5px;text-align: left;">'
      //   if (assetDetails.properties.levelDisplay) {
      //   for (var i = 1; i <= 5; i++) {
      //     if (i <= avgRating) {
      //       listContent += '<span onclick="getAssetDetails();" class="fa fa-star checked" style="display: inline-block"></span>'
      //     } else {
      //       listContent += '<span onclick="getAssetDetails();" class="fa fa-star" style="display: inline-block"></span>'
      //     }     
      //   }
      // } 
      // listContent += '</div>'
      // if (assetDetails.properties.levelDisplay) {
      //   listContent += '<p onclick="getAssetDetails();" class="mapfleetdetails" style="padding-left: 5px;vertical-align: top;font-size: 10px;text-align: left;">' + assetDetails.properties.levelDisplay + '</p>';
      // } else {
      //   if(assetDetails.properties.level) {
      //     listContent += '<p onclick="getAssetDetails();" class="mapfleetdetails" style="padding-left: 5px;vertical-align: top;font-size: 10px;text-align: left;">' + assetDetails.properties.level + '</p>';
      //   } else {
      //     listContent += '<p onclick="getAssetDetails();" class="mapfleetdetails" style="padding-left: 5px;vertical-align: top;font-size: 10px;text-align: left;">' + peopleAddress + '</p>';
      //   }
      //  // listContent += '<p onclick="getAssetDetails();" style="padding-left: 5px;vertical-align: top;font-size: 10px;text-align: left;">' + assetDetails.properties.level + '</p>';
      // }
      if (assetDetails.properties.level) {
        // SRINIVAS - 210823- Apply map configuration to Show View or Direction button
        if (mapsettingsblock.map_settings.is_directions_enabled === true) {
          buttonContent += '<button id="directionsBtn" class="btn map-btn" style="cursor:pointer;display: flex;align-items: center;justify-content: center;font-size: 14.7px;font-weight: 500;background-color:' + appColor + ';color:' + Button_txt + ';" type="button" onclick="navigation(assetDetails);">' + mapNamesObj.directions + '</button>'
        } // else { 
        viewButtonContent += '<button id="viewBtn" class="btn map-btn" style="cursor:pointer;display: flex;align-items: center;justify-content: center;font-size: 14.7px;font-weight: 500;background-color:' + appColor + ';color:' + Button_txt + ';" type="button" onclick="getAssetDetails();">' + mapNamesObj.view + '</button>'
        // }
      }
      temp.innerHTML = listContent;
      assetImg.innerHTML = imgContent;
      assetDesc.innerHTML = descContent;
      button.innerHTML = buttonContent;
      viewButton.innerHTML = viewButtonContent;
      var bottomBox = $("#bottomSheet");
      if (!enabledinfopopup) {
        bottomBox.show();
        addlocationclasses();
        /* Added to show location popup */
        // document.getElementById('mapid').style.height = '91vh';
        // Added to map dynamic height when bottom sheet show and hide conditions
        // document.getElementById('mapid').classList.add("mapheight");
        if (isMobile()) {
          document.getElementById('bottomSheet').classList.add('p' + mapsettingsblock.map_settings.view_popup_position_mobile.toLowerCase());
        } else if (isTablet()) {
          document.getElementById('bottomSheet').classList.add('p' + mapsettingsblock.map_settings.view_popup_position_web.toLowerCase());
        } else if (isDesktop()) {
          document.getElementById('bottomSheet').classList.add('p' + mapsettingsblock.map_settings.view_popup_position_web.toLowerCase());
        }
      }
      thisGeoArea.clearSearch();
    }
  }
}
function bottomboxcloseicon() {
  document.getElementById('bottomSheet').style.display = 'none';
  // document.getElementById('mapid').classList.remove("mapheight");
  // document.getElementById('mapid').style.height = '100% !important';
  // document.getElementsByClassName('leaflet-routing-alternatives-container').classList.add('bottom-0');
  var showhidebottomsheet = document.querySelector('.leaflet-routing-alternatives-container');
  if (showhidebottomsheet) {
    showhidebottomsheet.classList.add("bottom-0", "animate__animated");
  }
}
/* Added to show location popup */
function addlocationclasses() {
  var locateIcon = document.getElementById("mapid");
  addClasses(locateIcon, 'bottomSheetadded');
}
function getReviews(assetDetails) {
  var userId = localStorage.getItem('userId');
  if (localStorage.getItem('userId') === null || localStorage.getItem('userId') === '') {
    userId = '';
  }
  var url = localStorage.getItem('apiendpoint') + 'api/v1/fleet/avgrating/' + assetDetails.facilityId + '/' + userId;
  $.ajax({
    url: url,
    type: 'GET',
    headers: {
      "token": window.localStorage.getItem('token')
    },
    error: function (err) { },
    success: function (data) {
      avgRating = data.result[0].avgRating;
    }
  });
}
function navigation(assetDetails) {
  instrData = [];
  instructionsData = [];
  coordinatesData = [];
  instrNumber = 0;
  instrValue = true;
  window.localStorage.setItem('toasset', JSON.stringify(assetDetails));
  window.localStorage.removeItem('fromasset');
  this.navpath();
  setTimeout(function () {
    this.getDirections();
  }, 2000);
}
function toggledirections() {

  // console.log('clicked Indor directions header');
  if (!document.getElementById("direction-icon")) {
    var newcontainer = document.createElement('div');
    newcontainer.classList.add("leaflet-top", "leaflet-right");
    newcontainer.setAttribute("id", "direction-icon");
    newcontainer.innerHTML = '<div id="directionicon-child" class="leaflet-control-facilities leaflet-control-locate leaflet-bar leaflet-control" onclick="showhideicon();" style="cursor: pointer;"><span class="facilities-btn"><span class="icon-bg"><i class="fas fa-map-signs current-position asset-icon-direction-icon" aria-hidden="true"></i></span></span></div>';
    // newcontainer.style.backgroundColor = 'white';
    document.body.appendChild(newcontainer);
  }
  instructions();
}
function showhideicon() {
  // console.log('in show hide icon function');
  var showhidediv = document.getElementById('direction-icon');
  if (showhidediv.classList.contains("d-none")) {
    showhidediv.classList.add("d-block", "animate__animated", "animate__fadeInRight");
    // console.log('in show hide icon function if');
  }
  else {
    // showhidediv.classList.add('d-none');
    // console.log('in show hide icon function else');
  }
  instructions()
}
function instructions() {

  // console.log('inside directions function');
  var showhide = document.querySelector('.leaflet-routing-alternatives-container');
  var showhide2 = document.getElementById('direction-icon');
  if (!showhide.classList.contains("d-none")) {
    showhide.classList.remove("d-block", "animate__animated", "animate__fadeInRight");
    showhide2.classList.remove("d-none", "animate__animated", "animate__fadeOutRight");
    showhide.classList.add("d-none", "animate__animated", "animate__fadeOutRight");
    showhide2.classList.add("d-block", "animate__animated", "animate__fadeInRight");
    // console.log('inside directions function if');
  } else {
    // showhide.addClasses('d-none');
    showhide.classList.remove("d-none", "animate__animated", "animate__fadeOutRight");
    showhide2.classList.remove("d-block", "animate__animated", "animate__fadeInRight");
    showhide.classList.add("d-block", "animate__animated", "animate__fadeInRight");
    showhide2.classList.add("d-none", "animate__animated", "nimate__fadeOutRight");
    // console.log('inside directions function else');
  }
}
function hideSteps() {
  var ele = document.getElementById('instructionDetails');
  ele.classList.remove('is-visible');
  this.getDirections();
}
function getDirections() {
  let mapNamesObj = JSON.parse(window.localStorage.getItem('mapNameObj'))
  var temp = document.getElementById('assetDetails');
  var assetImg = document.getElementById('assetImg');
  var assetDesc = document.getElementById('assetDesc');
  var button = document.getElementById('navButton');
  var viewButton = document.getElementById('viewButton');
  temp.innerHTML = '';
  assetImg.innerHTML = '';
  assetDesc.innerHTML = '';
  button.innerHTML = '';
  viewButton.innerHTML = '';
  var listContent = '';
  var imgContent = '';
  var descContent = '';
  var buttonContent = '';
  var viewButtonContent = '';
  listContent += '<span class="fleet-duration">' + thisGeoArea.totaltime + '</span><span class="fleet-distance">(' + thisGeoArea.totaldistance + ')</span>'
  buttonContent += '<button id="stepsMoreBtn" class="btn map-btn" type="button" style="background-color:' + appColor + ';color:' + Button_txt + ';cursor:pointer;display: flex;align-items: center;justify-content: center;font-size: 14.7px;font-weight: 500;" onclick="instructions();">' + mapNamesObj.stepsandmore + '</button>'
  viewButtonContent += '<button id="stepsMoreBtn" class="btn map-btn" type="button" style="background-color:' + appColor + ';color:' + Button_txt + ';cursor:pointer;display: flex;align-items: center;justify-content: center;font-size: 14.7px;font-weight: 500;" onclick="instructions();">' + mapNamesObj.stepsandmore + '</button>'
  temp.innerHTML = listContent;
  assetImg.innerHTML = imgContent;
  assetDesc.innerHTML = descContent;
  button.innerHTML = buttonContent;
  viewButtonContent.innerHTML = viewButtonContent;
  var bottomBox = $("#bottomSheet");
  if (!enabledinfopopup) {
    bottomBox.show();
    addlocationclasses();
    // Added to map dynamic height when bottom sheet show and hide conditions previously added style height as 91vh
    // document.getElementById('mapid').classList.add("mapheight");
    document.getElementById('bottomSheet').classList.add(mapNamesObj.view_popup_class);
  }
}
function getAssetDetails() {
  currentFloor = details.feature.properties.level;
  details.feature.facilityName = details.feature.properties.facilityName;
  if (details) {
    var kisokdetails = details.feature;
    window.localStorage.setItem('fleetDetails', JSON.stringify(kisokdetails));
    window.parent.postMessage({ goto: "assetDetails" }, '*');
  }
  var checkiskiosk = window.localStorage.getItem('devicetypecheck');
  if (checkiskiosk === 'true' && details.options.opacity === 1) {
    parent.window.dispatchEvent(new Event('custom-event-kiosk'));
    var facilityIconFileName = details.feature.properties.iconName;
    var iconColor = details.feature.properties.FacilityTypeBackgroundColor;
    var markerIcon = mapsettingsblock?.map_settings?.icon?.icon_class_name ? mapsettingsblock.map_settings.icon.icon_class_name : 'asset-icon-marker-with-circle';
    if (theMarker != undefined) {
      map.removeLayer(theMarker);
    };
    theMarker = L.marker(assetLatLng, {
      icon: L.divIcon({
        className: 'fa-icon',
        html:
          '<span class="fa-stack"><i class="icon ' + markerIcon + ' bgcolor fa-stack-2x"   style="color:' + iconColor + '" ></i> <i class="icon ' + facilityIconFileName + ' fa-stack-1x"   style="color:' + iconColor + '" ></i></span>',
        iconAnchor: [10, 22],
        iconSize: [20, 30],
        borderColor: '#c32'
      })
    }).addTo(map);
  } else if (details.options.opacity === 1) {
    // Added code to redirect the asset details page when click on asset - 190103
    if (kisokdetails.properties.levelDisplay) {
      window.localStorage.setItem('assetDetails', 'assetDetails');
      parent.window.dispatchEvent(new Event('custom-event'));
    } else if (kisokdetails.messageTo) {
      window.localStorage.setItem('messgeviewpage', 'messgeviewpage');
      parent.window.dispatchEvent(new Event('custom-event'));
    } else if (kisokdetails.callTo) {
      window.localStorage.setItem('callhistoryspage', 'callhistoryspage');
      parent.window.dispatchEvent(new Event('custom-event'));
    }
    else {
      window.localStorage.setItem('peopleDetails', 'peopleDetails');
      parent.window.dispatchEvent(new Event('custom-event'));
    }
    // displayMapPopup(e.target, e.latlng);
  }
  if (details.options.opacity === 1) {
    parent.window.dispatchEvent(new Event('custom-event-kiosk'));
  }
}
/* End of code for bottom sheet on map */
function displayMapPopup(feature, popupLocation) {
  if (feature.options.opacity == 1)  // Show the fleet where the fleet opacity = 1
  {
    parentchild = feature.feature.parentchild;
    var url = localStorage.getItem('apiendpoint') + 'api/v1';
    var floorPlan = getAllUrlParams().fp;
    var recordname = '';
    var recordid = '';
    var displayproperties = [];
    var displayColumns = [];
    if (floorPlan === 'true') {
      if (feature.feature.fleetReservationId && feature.feature.multiReservationCount <= 1) {
        recordname = 'facilityreservations';
        recordid = feature.feature.fleetReservationId;
      } else {
        if (getAllUrlParams().pn == 'publicevents' && feature.feature.is_transactable == true) {
          if (getAllUrlParams().cstdate && getAllUrlParams().ceddate) {
            recordname = 'publicevents';
            recordid = feature.feature.fleetId;
          } else {
            recordname = 'publicevents';
            recordid = feature.feature.fleetId;
          }
        } else {
          recordname = 'facilities';
          if (feature.feature.fleetReservationId == undefined) {
            recordid = feature.feature.facilityId;
            parentchild = false;
          } else {
            recordid = feature.feature.facilityId;
          }
        }
      }
      if (getAllUrlParams().pn == 'publicevents' && feature.feature.is_transactable == true) {
        if (getAllUrlParams().cstdate && getAllUrlParams().ceddate) {
          url = localStorage.getItem('apiendpoint') + 'api/v1/' + getAllUrlParams().pn + '/' + getAllUrlParams().cstdate + '/' + getAllUrlParams().ceddate + '/' + recordid;
        } else {
          url = url + '/' + recordname + '/' + recordid + '?maplocate=true';
        }
      } else {
        url = url + '/' + recordname + '/' + recordid + '?maplocate=true';
      }
      // var url = localStorage.getItem('apiendpoint') + '/api/v1/maplocate/viewpopup/fleets/fleet/27';
      $.ajax({
        url: url,
        type: 'GET',
        headers: {
          "token": window.localStorage.getItem('token')
        },
        error: function (err) {
          // popupFeatureProperties(feature, popupLocation, displayproperties, displayColumns);
          getdisplaymapsettings(feature, popupLocation, displayproperties, displayColumns, recordname); // to get display map settings data
        },
        success: function (data) {
          fleetTypeAttr = [];
          var resp = data;
          responsedata = resp;
          if (recordname == 'facilities' && responsedata) {
            responsedata.address_line1 = responsedata.address ? responsedata.address.address_line1 : '';
            responsedata.address_line2 = responsedata.address ? responsedata.address.address_line2 : '';
            responsedata.city = responsedata.address ? responsedata.address.city : '';
            responsedata.state = responsedata.address ? responsedata.address.state.state_name : '';
            responsedata.is_transactable = responsedata.settings ? responsedata.settings.is_transactable : '';
            responsedata.ZIP = responsedata.address ? responsedata.address.ZIP : '';
            responsedata.country = responsedata.address ? responsedata.address.country.lookup_name : '';
            responsedata.geometry = {
              'coordinates': [responsedata.address ? responsedata.address.geo_coordinates[1] : '', responsedata.address ? responsedata.address.geo_coordinates[0] : '']
            }
            responsedata.reservation_status = {
              lookup_name: ''
            }
            responsedata.facility_type_name = responsedata.facility_type ? responsedata.facility_type.facility_type_name.split('-')[1] : '';

            delete responsedata.contact_details;
            delete responsedata.facility_name;
            delete responsedata.facility_image_file_name;
            delete responsedata.address;
            delete responsedata.floor_plan_facility_Obj;
            delete responsedata.facility_type;
          } else if (recordname == 'facilityreservations') {
            responsedata.address_line1 = responsedata.address ? responsedata.address.address_line1 : '';
            responsedata.address_line2 = responsedata.address ? responsedata.address.address_line2 : '';
            responsedata.city = responsedata.address ? responsedata.address.city : '';
            responsedata.state = responsedata.address ? responsedata.address.state.state_name : '';
            responsedata.ZIP = responsedata.address ? responsedata.address.ZIP : '';
            responsedata.country = responsedata.address ? responsedata.address.country.lookup_name : '';
            responsedata.is_transactable = responsedata.facilityInfo ? responsedata.facilityInfo.settings.is_transactable : '';
            responsedata.fname = responsedata.reserved_by ? responsedata.reserved_by.f_name : '';
            responsedata.lname = responsedata.reserved_by ? responsedata.reserved_by.l_name : '';
            responsedata.phone = responsedata.contactsDetails ? responsedata.contactsDetails.phone : '';
            responsedata.phone_country_code = responsedata.contactsDetails ? responsedata.contactsDetails.phone_country_code.lookup_name : '';
            responsedata.facility_type_name = responsedata.facility_type ? responsedata.facility_type.facility_type_name.split('-')[1] : '';
            responsedata.geometry = {
              'coordinates': [responsedata.facilityInfo.address.geo_coordinates[1], responsedata.facilityInfo.address.geo_coordinates[0]]
            }
            delete responsedata.contactsDetails;
            delete responsedata.facility_name;
            delete responsedata.facility_image_file_name;
            delete responsedata.address;
            delete responsedata.updated_by;
            delete responsedata.facility.facility_name;
            delete responsedata.facility_type
            if (responsedata.event.event_id == '') {
              delete responsedata.event.event_name;
            }
            if (responsedata.eventsData) {
              delete responsedata.eventsData.contact_details;
              delete responsedata.eventsData.address;
            }
            //  delete responsedata.reserved_by;
            delete responsedata.facilityInfo;
          }
          // feature.feature = resp;
          //popupFeatureProperties(feature, popupLocation, displayproperties, displayColumns)
          getdisplaymapsettings(feature, popupLocation, displayproperties, displayColumns, recordname) // // to get display map settings data
        }
      });
    } else {
      // popupFeatureProperties(feature, popupLocation, displayproperties, displayColumns)
      getdisplaymapsettings(feature, popupLocation, displayproperties, displayColumns, recordname) // to get display map settings data
    }
  }
}
// to show popup information
function popupFeatureProperties(feature, popupLocation, displayproperties, displayColumns) {
  var popupContent = "";
  var markerIcon = mapsettingsblock?.map_settings?.icon?.icon_class_name ? mapsettingsblock.map_settings.icon.icon_class_name : 'asset-icon-marker-with-circle';
  feature.otherproperties = {};
  if (getAllUrlParams().fp == 'true') {
    updateOtherProperties(responsedata, displayproperties, feature.otherproperties, displayColumns);
  } else {
    updateOtherProperties(feature.feature, displayproperties, feature.otherproperties, displayColumns);
  }
  if ((feature.properties) && !(feature.otherproperties)) { // && feature.properties.fleetid) {
    if (feature.properties.facilityName)
      popupContent += "<p align='center'><B>" + feature.properties.facilityName + "</B>test</p>";
    $.each(feature.properties, function (index, value) {
    });
  } else {
    //   popupContent = "<p>No Fleet Name</p>";
  }
  if (getAllUrlParams().fp == 'true') {
    this.feature = responsedata; // feature.feature;
    nontransactable = this.feature ? this.feature.is_transactable : '';
    isSpecialstatus = this.feature ? this.feature.is_special : '';
  } else {
    this.feature = feature.feature; // feature.feature;
    nontransactable = this.feature.is_transactable;
    isSpecialstatus = this.feature.is_special;
  }
  var element = document.getElementById('actionicons');
  if (element !== null) {
    element.outerHTML = "";
  }
  /** popup action buttons and fleet information  html view code */
  popupContent += '<table class="mappopup-title"><tr>';
  if (feature.feature.imagePath && feature.feature.imageName) {
    popupContent += '<td><img onerror="this.onerror=null;this.src=\'' + localStorage.getItem('apiendpoint') + '/' + localStorage.getItem('EnterpriseImage') +
      '\'" style="border-radius: 50%; margin-right:5px" src="' +
      localStorage.getItem('apiendpoint') + '/' +
      feature.feature.imagePath + '/' + feature.feature.imageName + '" height="35" width="35"></img></td>';
  } else if ((feature.feature.enterpriseResourcesImageFilePath && feature.feature.enterpriseResourcesImageFileName) && ((getAllUrlParams().pn == 'users' || getAllUrlParams().pn == 'messagehistory' || getAllUrlParams().pn == 'people' || getAllUrlParams().pn == 'callhistory'))) {
    popupContent += '<td><img onerror="this.onerror=null;this.src=\'' + localStorage.getItem('enterpriseImage') +
      '\'" style="border-radius: 50%; margin-right:5px" src="' +
      localStorage.getItem('apiendpoint') + '/' +
      feature.feature.enterpriseResourcesImageFilePath + '/' + feature.feature.enterpriseResourcesImageFileName + '" height="35" width="35"></img></td>';
  } else {
    popupContent += "<td class='mappopup-title-icon' style='font-weight: bold;font-size: 15px;float:left; padding-right:5px'>" + '<span class="fa-stack"><i class="icon ' + markerIcon + ' fa-stack-2x" style="color:' + feature.properties.FacilityTypeBackgroundColor + '"></i><i class="fa-stack-1x ' + feature.properties.iconName + '"></i>' + "</span></td>";
  }
  if ((getAllUrlParams().pn == 'users' || getAllUrlParams().pn == 'messagehistory' || getAllUrlParams().pn == 'people' || getAllUrlParams().pn == 'callhistory')) {
    if (this.feature.firstName) {
      var userName = this.feature.firstName + ' ' + this.feature.lastName;
      popupContent += "<td style='font-weight: bold;font-size: 15px; line-height:13px'>" + userName + "</td>";
    } else {
      if (feature.properties.facilityName) {
        popupContent += "<td style='font-weight: bold;font-size: 15px; line-height:13px'>" + feature.properties.facilityName + "</td>";
      }
    }
  } else {
    if (feature.properties.facilityName) {
      popupContent += "<td style='font-weight: bold;font-size: 15px; line-height:13px'>" + feature.properties.facilityName + "</td>";
    }
  }
  if (this.feature && this.feature._id) {
    var resourceid = this.feature._id;
  } else {
    var resourceid = this.feature ? this.feature.reserved_by.user_profile_id : '';
  }
  popupContent += '</tr></table>';
  popupContent += "<div class='col-md-12 p0 text-right' id='actionicons'><div id='reservefleet'><span class='icon fa-15x asset-icon-plus'  onclick='reserveFleet(\"" + this.feature + "\",\"" + this.getAllUrlParams().pn + "\")'></span></div><div id='updatereservation'><span class='icon fa-15x fas fa-edit'  onclick='updateReservation(\"" + this.feature + "\",\"" + this.getAllUrlParams().pn + "\")'></span></div><div id='message'><span class ='icon fa-15x asset-icon-envelope notification-unread'  title='" + mapNamesObj.message + "' onclick='message(\"" + resourceid + "\",\"" + this.getAllUrlParams().pn + "\")'></span></div><div id='call' ><span title='" + mapNamesObj.call + "' class='icon fa-15x asset-icon-phone call-history' onclick='call(\"" + resourceid + "\",\"" + this.getAllUrlParams().pn + "\")'></span></div><div id='invite'  ><span class ='icon fa-14x fa fa-user-plus inviteicon txt-success' title='" + mapNamesObj.invite_members + "' onclick='invitemembers(\"" + this.feature + "\",\"" + this.getAllUrlParams().pn + "\")'></span></div><div id='sendreq'  ><span class ='icon fa-14x fas fa-file-export' title='" + mapNamesObj.send_request + "' onclick='sendreq(\"" + this.feature + "\",\"" + this.getAllUrlParams().pn + "\")'></span></div><div id='checkin'  ><span class ='icon fa-15x asset-icon-sign-in checkin' title='" + mapNamesObj.check_in + "' onclick='checkedin(\"" + this.feature + "\",\"" + this.getAllUrlParams().pn + "\")'></span></div><div id='checkout' > <span class ='icon fa-15x asset-icon-sign-out checkout' title='" + mapNamesObj.check_out + "' onclick='checkedout(\"" + this.feature + "\",\"" + this.getAllUrlParams().pn + "\")'></span></div><div id='extend' title='" + mapNamesObj.extend + "'><span style='cursor:pointer' class ='icon fa-15x asset-icon-extend' onclick='extendevent(\"" + this.feature + "\",\"" + this.getAllUrlParams().pn + "\")'></span></div><div id='cancel' ><span class ='icon fa-15x asset-icon-cancel cancle-action' title='" + mapNamesObj.cancel + "' onclick='cancel(\"" + this.feature + "\",\"" + this.getAllUrlParams().pn + "\")'></span></div><div id='locatebutton' ><span class ='icon fa-14x fa fa-location-arrow' title='" + mapNamesObj.locate + "' onclick='locate(\"" + this.feature + "\",\"" + this.getAllUrlParams().pn + "\")'></span></div></div>";
  popupContent += "<div class='table-scroll'> <div class='table-responsie'><table class='table table-condensed table-hover table-bordered'>";
  if (feature.otherproperties) {
    if (feature.otherproperties['Start Date Time']) {
      feature.otherproperties['Start Datetime'] = feature.otherproperties['Start Date Time'];
      delete feature.otherproperties['Start Date Time'];
    }
    if (feature.otherproperties['End Date Time']) {
      feature.otherproperties['End Datetime'] = feature.otherproperties['End Date Time'];
      delete feature.otherproperties['End Date Time'];
    }
    feature.otherproperties = updateOrder(feature.otherproperties, displayColumns);
    var nameIndex = '';
    var addressIndex = '';
    $.each(feature.otherproperties, function (index, value) {
      if (value !== undefined && index !== '') {
        if (getAllUrlParams().ut !== 'locate') {
          popupContent += "<p class='col-md-12'><h5 class='bg-primary text-capitalize text-center'>" + index + "</h5></p>";
        }
        if (typeof (value) == 'string') {
          if (index === 'First Name' || index === 'Last Name') {
            nameIndex = nameIndex + ' ' + value;
            if (index !== 'First Name') {
              popupContent += "<tr><td class='minw100'>" + "<b>" + mapNamesObj.name + ": " + "</b></td><td>" + nameIndex + "</td></tr>";
            }
          } else if (index === 'Work Number' && value !== 'null' && value !== '' && value !== undefined) {
            popupContent += "<tr><td class='minw100'>" + "<b>" + mapNamesObj.work_number + ": " + "</b></td><td>" + value + "</td></tr>";
          } else if (index === 'Mobile Number' && value !== 'null' && value !== '' && value !== undefined) {
            popupContent += "<tr><td class='minw100'>" + "<b>" + mapNamesObj.mobile_number + ": " + "</b></td><td>" + value + "</td></tr>";
          } else if (index === 'Enterprise Name' && value !== 'null' && value !== '' && value !== undefined) {
            popupContent += "<tr><td class='minw100'>" + "<b>" + mapNamesObj.enterprise + ": " + "</b></td><td>" + value + "</td></tr>";
          } else {
            if (index === 'Reserve Start Date Time' || index === 'Reserve End Date Time' ||
              index === 'Start Date Time' || index === 'End Date Time' ||
              index === 'Start Datetime' || index === 'End Datetime' ||
              index === 'Reserve StartDatetime' || index === 'Reserve EndDatetime' ||
              index === 'Check In Date Time' || index === 'Check Out Date Time' ||
              index === 'Event Registration Close Date' || index === 'Message Date' ||
              index === 'Credit Card Expiry Date' || index === 'Call Start Date' ||
              index === 'Call End Date' || index === 'Reservation Start Date' || index === 'Reservation End Date') {
              value = loginUserDateConversion(value);
            }
            if (index == 'Mobile #' || index == 'Work #') {
              if (value.substring(0, 1) != '+') {
                if (value.substring(0, 1) == '%') {
                  value = value.replace(/\%2B/g, "+");
                } else {
                  value = value.replace(/\%2B/g, "+");
                  var test = value.split('-+');
                  value = '+' + test[1] + '-' + test[0];
                }
              }
            }
            popupContent += "<tr><td class='minw100'>" + "<b>" + index + ": " + "</b></td><td class='minw150'><span>" + value + "</span></td></tr>";
          }
          // popupContent += "<tr><td class='minw100 col-md-12'>" + "<b>" + index + "</b></td><td>" + ": " + value + "</td></tr>";
        } else {
          $.each(value, function (index2, value2) {
            if (typeof (value2) === 'object' && value2 !== null && value2 !== undefined) {
              value2 = JSON.stringify(value2);
            }
            popupContent += "<tr><td class='minw100 col-md-12'>" + "<b>" + index + "</b></td><td>" + ": " + value2 + "</td></tr>";
          });
        }
      }
      //     popupContent += "</div>";
    });
    if (getAllUrlParams().pn == 'publicevents' && responsedata.multiReservations > 1) {
      popupContent += "<tr><td class='minw100'>" + "<b>" + mapNamesObj.events + ": " + "</b></td><td>" + mapNamesObj.multiple_events + "</td></tr>";
    }
    if (feature.feature.multiReservationCount > 1) {
      popupContent += "<tr><td class='minw100'>" + "<b>" + mapNamesObj.reservations + ": " + "</b></td><td>" + feature.feature.multiReservationText + "</td></tr>";
    }
  }
  popupContent += "</table>";
  var img = '';
  // var image = 'assets/enterprises/' + localStorage.getItem('enterpriseId') + '/cincinnati-zoo-logo.jpg';
  if (getAllUrlParams().fp == 'true') {
    if (responsedata && responsedata.visuals) {
      for (i = 0; i < responsedata.visuals.length; i++) {
        img += "<img onerror='this.onerror=null;this.src=\"" + localStorage.getItem('apiendpoint') + "/" + responsedata.enterpriseIcon + "\"' class='va-popupimg img-responsive col-xs-3 col-sm-3 col-md-3' src= \"" + localStorage.getItem('apiendpoint') + '/' + responsedata.visuals[i].thumbnailPath + "\" class='thumbnail' id='thumb2' onclick='viewfile(\"" + responsedata.visuals[i].visualFilePath + "\",\"" + responsedata.visuals[i].visualFileName + "\")'/>";
      }
      popupContent += "<tr><td class='minw150'><span>" + img + "</span></td></tr>";
    }
    if (responsedata && responsedata.visuals) {
      if (responsedata.visuals.length > 0) {
        popupContent += "<div id='filePopupId'><a href='javascript:void(0)' onclick='document.getElementById('filePopupId').style.display='none';'></a><img id='fileImageId'width='100%' /><audio 'display:none' id='fileAudioId' src=''></audio><video style='display:none' id='fileVideoId' src=''></video></div>";
      }
    } else {
      //	popupContent += "<div id='filePopupId'><a href='javascript:void(0)' onclick='document.getElementById('filePopupId').style.display='none';'></a><img id='fileImageId' src='' onError='this.onerror=null;this.src='assets/img/logo.png';'' width='100%' /><audio 'display:none' id='fileAudioId' src=''></audio><video style='display:none' id='fileVideoId' src=''></video></div>";
    }
  }
  popupContent += "</div></div>";
  var popup = L.popup({
    maxHeight: 290,
    maxWidth: 290,
    offset: L.point(0, -4), // to raise the popup above the marker
    autoPan: false, // to adjust the popup to top left corner
  });
  infopopup = popup.setLatLng(popupLocation).setContent(popupContent);
  var markerGroup = L.featureGroup([infopopup]).addTo(map);
  markerGroup.eachLayer(function (layer) {
    layer.openPopup();
  });
  var px = map.project(popupLocation);
  if (window.innerHeight / 2 > popup.options.maxHeight) {
    px.y -= 0;
  } else {
    px.y -= popup.options.maxHeight - window.innerHeight / 2;
  }
  px.x -= 0;
  map.panTo(map.unproject(px), {
    animate: true
  });
  $('.leaflet-popup-close-button').click(function () {
    map.panTo(new L.LatLng(popupLocation.lat, popupLocation.lng))
  });
  L.Map = L.Map.extend({
    openPopup: function (popup) {
      this._popup = popup;
      return this.addLayer(popup).fire('popupopen', {
        popup: this._popup
      });
    }
  });
  /* start of code related to button actions on page level*/
  document.getElementById('checkin').style.display = 'none';
  document.getElementById('checkout').style.display = 'none';
  document.getElementById('extend').style.display = 'none';
  document.getElementById('message').style.display = 'none';
  document.getElementById('call').style.display = 'none';
  document.getElementById('cancel').style.display = 'none';
  document.getElementById('reservefleet').style.display = 'none';
  document.getElementById('updatereservation').style.display = 'none';
  document.getElementById("sendreq").style.display = 'none';
  document.getElementById("invite").style.display = 'none';
  var loggedinjson = window.localStorage.getItem('loggedindata');
  var pagename = this.getAllUrlParams().pn;
  url = localStorage.getItem('apiendpoint') + '/api/v1/utc';
  // $.ajax({
  //   url: url,
  //   type: 'GET',
  //   headers: {
  //     "token": window.localStorage.getItem('token')
  //   },
  //   error: function (err) {},
  //   success: function (data) {
  //     var utc = data.result
  //     currentUtc = utc;
  //   }
  // });

  if (!enabledinfopopup) {
    document.getElementById('checkin').style.display = 'none';
    document.getElementById('checkout').style.display = 'none';
    document.getElementById('extend').style.display = 'none';
    document.getElementById('message').style.display = 'none';
    document.getElementById('call').style.display = 'none';
    document.getElementById('cancel').style.display = 'none';
    document.getElementById('reservefleet').style.display = 'none';
    document.getElementById('updatereservation').style.display = 'none';
    document.getElementById("sendreq").style.display = 'none';
    document.getElementById("invite").style.display = 'none';
    document.getElementById("locatebutton").style.display = 'none';
  } else {
    document.getElementById("locatebutton").style.display = 'inline-block';
    if (pagename === 'events' || pagename === 'facilityreservations' || pagename == 'facilities') {
      if (getAllUrlParams().fp === 'true' && nontransactable == true) {
        if (feature.feature.multiReservationCount > 1) {
          document.getElementById('updatereservation').style.display = 'inline-block';
          document.getElementById('checkin').style.display = 'inline-block';
          document.getElementById('checkout').style.display = 'inline-block';
          document.getElementById('extend').style.display = 'inline-block';
          document.getElementById('cancel').style.display = 'inline-block';
          document.getElementById("sendreq").style.display = 'inline-block';
          document.getElementById("invite").style.display = 'inline-block';
          var editdisableIcon = document.getElementById("updatereservation");
          addClasses(editdisableIcon, 'disabled');
          var checkindisableIcon = document.getElementById("checkin");
          addClasses(checkindisableIcon, 'disabled');
          var canceldisableIcon = document.getElementById("cancel");
          addClasses(canceldisableIcon, 'disabled');
          var extenddisableIcon = document.getElementById("extend");
          addClasses(extenddisableIcon, 'disabled');
          var checkoutdisableIcon = document.getElementById("checkout");
          addClasses(checkoutdisableIcon, 'disabled');
          var invitedisableIcon = document.getElementById("invite");
          addClasses(invitedisableIcon, 'disabled');
          var sendreqdisableIcon = document.getElementById("sendreq");
          addClasses(sendreqdisableIcon, 'disabled');
        } else {
          document.getElementById('updatereservation').style.display = 'inline-block';
          document.getElementById('checkin').style.display = 'inline-block';
          document.getElementById('checkout').style.display = 'inline-block';
          document.getElementById('extend').style.display = 'inline-block';
          document.getElementById('cancel').style.display = 'inline-block';
          document.getElementById('reservefleet').style.display = 'inline-block';
          document.getElementById("sendreq").style.display = 'inline-block';
          document.getElementById("invite").style.display = 'inline-block';
          if (this.feature.reservation_status.lookup_name === 'RESERVED') {
            if (this.feature.event.event_id) {
              if ((this.feature.eventsData.organizer.user_profile_id.toString() === localStorage.getItem('user_id')) || window.localStorage.getItem('login_user_role') === 'SUPER_ADMIN' ||
                window.localStorage.getItem('login_user_role') === 'ENTERPRISE_ADMIN') {
                document.getElementById("updatereservation").style.pointerEvents = 'auto';
                document.getElementById("checkin").style.pointerEvents = 'auto';
                document.getElementById("cancel").style.pointerEvents = 'auto';
                if (this.feature.eventsData.privacy_type.lookup_name == "PUBLIC") {
                  var sendreqdisableIcon = document.getElementById("sendreq");
                  addClasses(sendreqdisableIcon, 'disabled');
                  var invitedisableIcon = document.getElementById("invite");
                  addClasses(invitedisableIcon, 'disabled');
                } else if (this.feature.eventsData.privacy_type.lookup_name == "PRIVATE") {
                  var sendreqdisableIcon = document.getElementById("sendreq");
                  addClasses(sendreqdisableIcon, 'disabled');
                  document.getElementById("invite").style.pointerEvents = 'auto';
                }
              } else {
                if (this.feature.eventsData.organizer.user_profile_id.toString() !== localStorage.getItem('user_id') || window.localStorage.getItem('login_user_role') === 'SUPER_ADMIN' ||
                  window.localStorage.getItem('login_user_role') === 'ENTERPRISE_ADMIN') {
                  const result = this.feature.eventRegistrationsData.filter((result) => {
                    return result.user_profile.user_profile_id == localStorage.getItem('user_id');
                  })
                  if (this.feature.eventsData.privacy_type.lookup_name == "PUBLIC" && result.length == 0) {
                    document.getElementById("sendreq").style.pointerEvents = 'auto';
                    document.getElementById("updatereservation").style.pointerEvents = 'auto';
                    var invitedisableIcon = document.getElementById("invite");
                    addClasses(invitedisableIcon, 'disabled');
                  } else if (this.feature.eventsData.privacy_type.lookup_name == "PUBLIC" && result.length > 0) {
                    var sendreqdisableIcon = document.getElementById("sendreq");
                    addClasses(sendreqdisableIcon, 'disabled');
                    var invitedisableIcon = document.getElementById("invite");
                    addClasses(invitedisableIcon, 'disabled');
                  } else if (this.feature.eventsData.privacy_type.lookup_name == "PRIVATE") {
                    var sendreqdisableIcon = document.getElementById("sendreq");
                    addClasses(sendreqdisableIcon, 'disabled');
                    var invitedisableIcon = document.getElementById("invite");
                    addClasses(invitedisableIcon, 'disabled');
                  }
                }
                var checkindisableIcon = document.getElementById("checkin");
                addClasses(checkindisableIcon, 'disabled');
                var canceldisableIcon = document.getElementById("cancel");
                addClasses(canceldisableIcon, 'disabled');
              }
              var reservefleetdisableIcon = document.getElementById("reservefleet");
              addClasses(reservefleetdisableIcon, 'disabled');
              var checkoutdisableIcon = document.getElementById("checkout");
              addClasses(checkoutdisableIcon, 'disabled');
              var extenddisableIcon = document.getElementById("extend");
              addClasses(extenddisableIcon, 'disabled');
            } else {
              // conditions for fleet reservations when event id null
              if (this.feature.reserved_by.user_profile_id.toString() === localStorage.getItem('user_id') || window.localStorage.getItem('login_user_role') === 'SUPER_ADMIN' ||
                window.localStorage.getItem('login_user_role') === 'ENTERPRISE_ADMIN') {
                document.getElementById("updatereservation").style.pointerEvents = 'auto';
                document.getElementById("checkin").style.pointerEvents = 'auto';
                document.getElementById("cancel").style.pointerEvents = 'auto';
              } else {
                var checkindisableIcon = document.getElementById("checkin");
                addClasses(checkindisableIcon, 'disabled');
                var canceldisableIcon = document.getElementById("cancel");
                addClasses(canceldisableIcon, 'disabled');
              }
              var checkoutdisableIcon = document.getElementById("checkout");
              addClasses(checkoutdisableIcon, 'disabled');
              var extenddisableIcon = document.getElementById("extend");
              addClasses(extenddisableIcon, 'disabled');
              var reservefleetdisableIcon = document.getElementById("reservefleet");
              addClasses(reservefleetdisableIcon, 'disabled');

              document.getElementById("sendreq").style.display = 'none';
              document.getElementById("invite").style.display = 'none';
            }
          } else if (this.feature.reservation_status.lookup_name === '' || this.feature.reservation_status.lookup_name === undefined) {
            //   if (parentchild == false) {
            if (parentchild == true) {
              var reservefleetdisableIcon = document.getElementById("reservefleet");
              addClasses(reservefleetdisableIcon, 'disabled');
              var reservefleetdisableIcon = document.getElementById("updatereservation");
              addClasses(reservefleetdisableIcon, 'disabled');
              var checkindisableIcon = document.getElementById("checkin");
              addClasses(checkindisableIcon, 'disabled');
              var checkoutdisableIcon = document.getElementById("checkout");
              addClasses(checkoutdisableIcon, 'disabled');
              var canceldisableIcon = document.getElementById("cancel");
              addClasses(canceldisableIcon, 'disabled');
              var extenddisableIcon = document.getElementById("extend");
              addClasses(extenddisableIcon, 'disabled');
              document.getElementById("sendreq").style.display = 'none';
              document.getElementById("invite").style.display = 'none';
            } else {
              document.getElementById('reservefleet').style.display = 'inline-block';
              document.getElementById("reservefleet").style.pointerEvents = 'auto';
              var reservefleetdisableIcon = document.getElementById("updatereservation");
              addClasses(reservefleetdisableIcon, 'disabled');
              var checkindisableIcon = document.getElementById("checkin");
              addClasses(checkindisableIcon, 'disabled');
              var checkoutdisableIcon = document.getElementById("checkout");
              addClasses(checkoutdisableIcon, 'disabled')
              var canceldisableIcon = document.getElementById("cancel");
              addClasses(canceldisableIcon, 'disabled');
              var extenddisableIcon = document.getElementById("extend");
              addClasses(extenddisableIcon, 'disabled');
              document.getElementById("sendreq").style.display = 'none';
              document.getElementById("invite").style.display = 'none';
            }
          } else if (this.feature.reservation_status.lookup_name === 'CHECKED_IN') {
            if (this.feature.event.event_id) {
              if (this.feature.eventsData.organizer.user_profile_id.toString() !== localStorage.getItem('user_id')) {
                document.getElementById("checkout").style.pointerEvents = 'none';
                const result = this.feature.eventRegistrationsData.filter((result) => {
                  return result.user_profile.user_profile_id == localStorage.getItem('user_id');
                })
                if (this.feature.eventsData.privacy_type.lookup_name == "PUBLIC" && result.length == 0) {
                  document.getElementById("sendreq").style.pointerEvents = 'auto';
                  var reservefleetdisableIcon = document.getElementById("updatereservation");
                  addClasses(reservefleetdisableIcon, 'disabled');
                  var invitedisableIcon = document.getElementById("invite");
                  addClasses(invitedisableIcon, 'disabled');
                } else if (this.feature.eventsData.privacy_type.lookup_name == "PUBLIC" && result.length > 0) {
                  var sendreqdisableIcon = document.getElementById("sendreq");
                  addClasses(sendreqdisableIcon, 'disabled');
                  var invitedisableIcon = document.getElementById("invite");
                  addClasses(invitedisableIcon, 'disabled');
                } else if (this.feature.eventsData.privacy_type.lookup_name == "PRIVATE") {
                  var sendreqdisableIcon = document.getElementById("sendreq");
                  addClasses(sendreqdisableIcon, 'disabled');
                  var invitedisableIcon = document.getElementById("invite");
                  addClasses(invitedisableIcon, 'disabled');
                }
              } else if (this.feature.eventsData.organizer.user_profile_id.toString() === localStorage.getItem('user_id')) {
                var reservefleetdisableIcon = document.getElementById("updatereservation");
                addClasses(reservefleetdisableIcon, 'disabled');
                document.getElementById("checkout").style.pointerEvents = 'auto';
                document.getElementById("extend").style.pointerEvents = 'auto';
                document.getElementById("reservefleet").style.display = 'none';
                if (this.feature.eventsData.privacy_type.lookup_name == "PUBLIC") {
                  var sendreqdisableIcon = document.getElementById("sendreq");
                  addClasses(sendreqdisableIcon, 'disabled');
                  var invitedisableIcon = document.getElementById("invite");
                  addClasses(invitedisableIcon, 'disabled');
                } else if (this.feature.eventsData.privacy_type.lookup_name == "PRIVATE") {
                  var sendreqdisableIcon = document.getElementById("sendreq");
                  addClasses(sendreqdisableIcon, 'disabled');
                  document.getElementById("invite").style.pointerEvents = 'auto';
                }
              }
              var checkindisableIcon = document.getElementById("checkin");
              addClasses(checkindisableIcon, 'disabled');
              var canceldisableIcon = document.getElementById("cancel");
              addClasses(canceldisableIcon, 'disabled');
              document.getElementById("reservefleet").style.display = 'none';
            } else {
              // conditions for fleet reservations when event id null
              if (this.feature.reserved_by.user_profile_id.toString() === localStorage.getItem('user_id') || window.localStorage.getItem('login_user_role') === 'SUPER_ADMIN' ||
                window.localStorage.getItem('login_user_role') === 'ENTERPRISE_ADMIN') {
                document.getElementById("checkout").style.pointerEvents = 'auto';
                document.getElementById("extend").style.pointerEvents = 'auto';
                var reservefleetdisableIcon = document.getElementById("reservefleet");
                addClasses(reservefleetdisableIcon, 'disabled');
                var reservefleetdisableIcon = document.getElementById("updatereservation");
                addClasses(reservefleetdisableIcon, 'disabled');
              } else {
                var checkoutdisableIcon = document.getElementById("checkout");
                addClasses(checkoutdisableIcon, 'disabled');
                var extenddisableIcon = document.getElementById("extend");
                addClasses(extenddisableIcon, 'disabled');
                var reservefleetdisableIcon = document.getElementById("reservefleet");
                addClasses(reservefleetdisableIcon, 'disabled');
              }
              var checkindisableIcon = document.getElementById("checkin");
              addClasses(checkindisableIcon, 'disabled');
              var canceldisableIcon = document.getElementById("cancel");
              addClasses(canceldisableIcon, 'disabled');
              var reservefleetdisableIcon = document.getElementById("reservefleet");
              addClasses(reservefleetdisableIcon, 'disabled');
              var reservefleetdisableIcon = document.getElementById("updatereservation");
              addClasses(reservefleetdisableIcon, 'disabled');
              document.getElementById("sendreq").style.display = 'none';
              document.getElementById("invite").style.display = 'none';
            }
          }
        }
      }
    } else {
      switch (pagename) {
        case 'users':
          if (this.feature.reserved_by.user_profile_id !== localStorage.getItem('user_id') ||
            window.localStorage.getItem('login_user_role') === 'SUPER_ADMIN' || window.localStorage.getItem('login_user_role') === 'ENTERPRISE_ADMIN') {
            if (getAllUrlParams().fp === 'true' && nontransactable == true) {
              if (this.feature.reservation_status.lookup_name !== '' && this.feature.reservation_status.lookup_name !== undefined) {
                document.getElementById('message').style.display = 'inline-block';
                document.getElementById('call').style.display = 'inline-block';
              } else {
                document.getElementById("reservefleet").style.display = 'inline-block';
              }
            } else if (getAllUrlParams().fp === 'false') {
              document.getElementById('message').style.display = 'inline-block';
              document.getElementById('call').style.display = 'inline-block';
            }
          }
          break;
        case 'messagehistory':
          if (this.feature.reserved_by.user_profile_id !== localStorage.getItem('user_id') ||
            window.localStorage.getItem('login_user_role') === 'SUPER_ADMIN' || window.localStorage.getItem('login_user_role') === 'ENTERPRISE_ADMIN') {
            if (getAllUrlParams().fp === 'true' && nontransactable == true) {
              if (this.feature.reservation_status.lookup_name !== '' && this.feature.reservation_status.lookup_name !== undefined) {
                document.getElementById('message').style.display = 'inline-block';
                document.getElementById('call').style.display = 'inline-block';
              } else {
                document.getElementById("reservefleet").style.display = 'inline-block';
              }
            } else if (getAllUrlParams().fp === 'false') {
              document.getElementById('message').style.display = 'inline-block';
              document.getElementById('call').style.display = 'inline-block';
            }
          }
          break;
        case 'callhistory':
          if (this.feature.reserved_by.user_profile_id !== localStorage.getItem('user_id') ||
            window.localStorage.getItem('login_user_role') === 'SUPER_ADMIN' || window.localStorage.getItem('login_user_role') === 'ENTERPRISE_ADMIN') {
            if (getAllUrlParams().fp === 'true' && nontransactable == true) {
              if (this.feature.reservation_status.lookup_name !== '' && this.feature.reservation_status.lookup_name !== undefined) {
                document.getElementById('message').style.display = 'inline-block';
                document.getElementById('call').style.display = 'inline-block';
              } else {
                document.getElementById("reservefleet").style.display = 'inline-block';
              }
            } else if (getAllUrlParams().fp === 'false') {
              document.getElementById('message').style.display = 'inline-block';
              document.getElementById('call').style.display = 'inline-block';
            }
          }
          break;
      }
    }
    /* end of code related to button actions on page level*/
  }
  // }
};
var onloadInit = function () {
  mapDynamicTheme();
  if (enabledinfopopup) {
    document.getElementById("bottomSheet").style.display = 'none';
  }
  if (window.localStorage.getItem('enableScreensaver') !== undefined && window.localStorage.getItem('enableScreensaver') !== 'false') {
    // setup();
  }
  window.localStorage.setItem('testload', 'test');
  window.localStorage.removeItem('fromNavPath');
  langcode = window.localStorage.getItem('loginUserLanguage');
  window.localStorage.removeItem('showallFleets');
  nearFleets = false;
  bookMarkEnable = false;
  nearSpecialPath = false;
  document.getElementById('mapspinnerId').style.display = 'none';
  document.getElementById('mapspinnerbackgroundId').style.display = 'none';
  var uagent = navigator.userAgent.toLowerCase();
  if (uagent.search("iphone") > -1 || uagent.search("ipad") > -1 || uagent.search("android") > -1 || uagent.search("tablet") > -1 || uagent.search("phablet") > -1) {
    window.localStorage.setItem('device', 'false');
  }
  else {
    window.localStorage.setItem('device', 'true');
  }
  // // displaybounds = boundaries1();
  $.ajaxSetup({
    headers: {
      'token': window.localStorage.getItem('token')
    },
    async: false
  });
  urlType = getAllUrlParams().ut;
  if (urlType && urlType === 'locate') {
    // lat = getAllUrlParams().x;
    // lon = getAllUrlParams().y;
    floorslist = [];
    floorslistDisplayNames = [];
    showFloorMaps = "1"; // getAllUrlParams().fm === false; //"1" ? true : false;
    if ((getAllUrlParams().sr) !== undefined) {
      var fleetinfo = JSON.parse(localStorage.getItem(getAllUrlParams().sr));
      if (fleetinfo['floorsData']) {
        if (mapsettingsblock?.map_settings?.automatic_live_location_detection) {
          const userCurrentLocation = JSON.parse(localStorage.getItem('mapCurrentGeoLocation'));
          lat = userCurrentLocation.latitude;
          lon = userCurrentLocation.longitude;
        } else {
          lat = fleetinfo['floorsData'][0].geometry.coordinates[1]; //localStorage.getItem('lat'); //getAllUrlParams().clat;
          lon = fleetinfo['floorsData'][0].geometry.coordinates[0]; //localStorage.getItem('lon'); // getAllUrlParams().clon;
        }
        if (fleetinfo['floorsData'][0].features !== undefined && fleetinfo['floorsData'][0].features.length > 0) {
          floorToShow = localStorage.getItem(getAllUrlParams().cfn); //fleetinfo[0].features[0].properties.level;
        }
      } else {
        if (getAllUrlParams().pn === 'pickticket') { // to get pick list data
          lat = fleetinfo.geometry.coordinates[1];
          lon = fleetinfo.geometry.coordinates[0];
          floorToShow = fleetinfo.features[0].properties.level;
        } else {
          lat = fleetinfo.geometry.coordinates[1];
          lon = fleetinfo.geometry.coordinates[0];
          floorToShow = "0";
        }
      }
    } else {
      floorToShow = "0";
    }
    gaToShow = false; // getAllUrlParams().sga; //-1 implies show all geo areas
    displayControls = "1"; // getAllUrlParams().dc;
    if (getAllUrlParams().fp == 'true' && getAllUrlParams().pn != 'pickticket') {
      zoominit = fleetinfo['floorsData'][0].floor_plan_details.start_zoom; //getAllUrlParams().zi;
      zoomfinal = fleetinfo['floorsData'][0].floor_plan_details.final_zoom;
      // zoomfinal = fleetinfo[0].floorPlanDetails.finalZoom; //20; //getAllUrlParams().zf;
      // if (getAllUrlParams().eid == '4' || getAllUrlParams().eid == '3' ||
      //   getAllUrlParams().eid == '14' || getAllUrlParams().eid == '15' ||
      //   getAllUrlParams().eid == '16' || getAllUrlParams().eid == '17' || getAllUrlParams().eid == '18' ||
      //   getAllUrlParams().eid == '19' || getAllUrlParams().eid == '20' || getAllUrlParams().eid == '21') {
      //   zoomfinal = 16;
      // } else if (getAllUrlParams().eid == '5') {
      //   zoomfinal = 15;
      // } else if (getAllUrlParams().eid == '6') {
      //   zoomfinal = 17;
      // } else if (getAllUrlParams().eid == '7') {
      //   zoomfinal = 18;
      // } else if (getAllUrlParams().eid == '8') {
      //   zoomfinal = 18;
      // } else if (getAllUrlParams().eid == '9') {
      //   zoomfinal = 17;
      // } else if (getAllUrlParams().eid == '10') {
      //   zoomfinal = 16;
      // } else if (getAllUrlParams().eid == '11') {
      //   zoomfinal = 17;
      // } else if (getAllUrlParams().eid == '12') {
      //   zoomfinal = 15;
      // } else if (getAllUrlParams().eid == '13') {
      //   zoomfinal = 18;
      // } else {
      //   zoomfinal = 20;
      // }
    } else {
      if (getAllUrlParams().fp == 'true' && getAllUrlParams().pn == 'pickticket') {
        zoominit = 3;
        zoomfinal = 21;
      }
    }
    startLat = lat; //getAllUrlParams().sla;
    startLon = lon; //getAllUrlParams().slo;
    // startLat = 17.422772840374673;
    // startLon = 78.54498188953586;
    // endLat = null; // getAllUrlParams().ela;
    // endLon = null; // getAllUrlParams().elo;
    // endLat = 17.4199630821275;
    // endLon = 78.54949649423361;
    endLat = lat;
    endLon = lon;
    configurl = getAllUrlParams().cu;
    /**GeoArea 1**/
    if (getAllUrlParams().fp === undefined) {
      floormapCoords = {
        floorToShow: null
      };
      geojsonUrl = configurl;
      floormapUrls = {
        floorToShow: null
      };
      floorPathsUrls = {
        floorToShow: null
      };
      floorPathsBounds = null;
    } else if (getAllUrlParams().api == 'local' && getAllUrlParams().fp == 'true') {
      floormapUrls = [];
      floorPathsUrls = [];
      floormapCoords = [];
      var metaDataUrl;
      var rotationAngle;
      var pathBoundariesUrl;
      var navPathUrl;
      if (localStorage.getItem('selected_enterprise')) {
        rotationAngle = localStorage.getItem('rotationAngle');
      } else {
        rotationAngle = localStorage.getItem('parentRotationAngle');
      }
      for (i = 0; i < fleetinfo['floorsData'].length; i++) {
        kioskMap = window.localStorage.getItem('kioskMapOrientation');
        checkiskiosk = window.localStorage.getItem('checkiskiosk');
        if (rotationAngle && kioskMap === 'true' && checkiskiosk === 'true') {
          rotationAngleOpacity = 0;
          var floormetaDataFileName = localStorage.getItem('s3bucket_url') + fleetinfo['floorsData'][i].floor_plan_details.floor_meta_data_json.split('.json');
          var pathBoundariesFileName = localStorage.getItem('s3bucket_url') + fleetinfo['floorsData'][i].floor_plan_details.path_boundaries_json.split('.json');
          metaDataUrl = localStorage.getItem('s3bucket_url') + 'assets/enterprises/' + getAllUrlParams().eid + '/facilities/' + getAllUrlParams().cufloorid + '/' + floormetaDataFileName[0] + '_' + rotationAngle + '.json';
          pathBoundariesUrl = localStorage.getItem('s3bucket_url') + 'assets/enterprises/' + getAllUrlParams().eid + '/facilities/' + getAllUrlParams().cufloorid + '/' + pathBoundariesFileName[0] + '_' + rotationAngle + '.json';
        } else {
          rotationAngleOpacity = 0.8;
          metaDataUrl = localStorage.getItem('s3bucket_url') + fleetinfo['floorsData'][i].floor_plan_details.floor_meta_data_json;
          pathBoundariesUrl = localStorage.getItem('s3bucket_url') + fleetinfo['floorsData'][i].floor_plan_details.path_boundaries_json;
        }
        $.getJSON(metaDataUrl, function (floorcoordinatesdata) {
          $.getJSON(pathBoundariesUrl, function (floorplanboundaries) {
            fleetinfo = JSON.parse(localStorage.getItem(getAllUrlParams().sr));
            fleetinfo['floorsData'][0].floor_plan_details.coordinates = floorcoordinatesdata;
            floorPathsBounds = floorplanboundaries.pathboundaries;
            if (getAllUrlParams().pn !== 'pickticket') {
              for (i = 0; i < fleetinfo['floorsData'].length; i++) {
                try {
                  var floorName = fleetinfo['floorsData'][i].features[0].properties.level;
                  var floorDisplayName = fleetinfo['floorsData'][i].features[0].properties.levelDisplay;
                } catch (err) {
                  var floorName = fleetinfo['floorsData'][i].facility_name;
                  var floorDisplayName = fleetinfo['floorsData'][i].facility_display_name;
                }
                floorIds[floorName] = fleetinfo['floorsData'][i]._id;
                floorslist.push(floorName);
                floorslistDisplayNames.push(floorDisplayName);
                floorsinsequence.push(floorName); // changed 180702
                var floorcoorinates = fleetinfo['floorsData'][0].floor_plan_details.coordinates;
                for (j = 0; j < floorcoorinates.length; j++) {
                  floor0mapCoords = [
                    [floorcoorinates[j].floorNorthWestCoordinates[0], floorcoorinates[j].floorNorthWestCoordinates[1]],
                    [floorcoorinates[j].floorNorthEastCoordinates[0], floorcoorinates[j].floorNorthEastCoordinates[1]],
                    [floorcoorinates[j].floorSouthWestCoordinates[0], floorcoorinates[j].floorSouthWestCoordinates[1]]
                  ];
                  floormapCoords[floorName] = floor0mapCoords;
                }
                entrycordinates[floorName] = floorcoorinates[0]?.floorEntryCoordinates;
                if (rotationAngle && rotationAngle > 0) {
                  var navPathFileName = fleetinfo['floorsData'][i].floor_plan_details.nav_path_json.split('.json');
                  navPathUrl = localStorage.getItem('s3bucket_url') + 'assets/enterprises/' + getAllUrlParams().eid + '/facilities/' + fleetinfo['floorsData'][i]._id + '/' + navPathFileName[0] + '_' + rotationAngle + '.json';
                } else {
                  navPathUrl = localStorage.getItem('s3bucket_url') + fleetinfo['floorsData'][i].floor_plan_details.nav_path_json;
                }
                floormapUrls[floorName] = localStorage.getItem('s3bucket_url') + fleetinfo['floorsData'][i].floor_plan_details.floor_plan_image_file_name;
                floorPathsUrls[floorName] = navPathUrl;
                if (i === fleetinfo['floorsData'].length - 1) {
                  floormapCoords[0] = floor0mapCoords;
                  floormapUrls[0] = localStorage.getItem('apiendpoint') + '/' + fleetinfo.facility_image_file_path + '/' + fleetinfo.facility_image_file_name;
                }
              }
              eventFromLatLng = fleetinfo['floorsData'][0].floor_plan_details.coordinates[0].floorEntryCoordinates[0];
              eventFromLatLon = fleetinfo['floorsData'][0].floor_plan_details.coordinates[0].floorEntryCoordinates[1];
              startLat = fleetinfo['floorsData'][0].floor_plan_details.coordinates[0].floorEntryCoordinates[0];
              startLon = fleetinfo['floorsData'][0].floor_plan_details.coordinates[0].floorEntryCoordinates[1];
              geojsonUrl = getAllUrlParams().sr;
              floorPathsBounds = floorPathsBounds;
            }
          });
        });
      }
    } else if (getAllUrlParams().fp === 'true' && getAllUrlParams().pn !== 'pickticket') {
      floormapUrls = [];
      floorPathsUrls = [];
      floormapCoords = [];
      var metaDataUrl;
      var rotationAngle;
      var pathBoundariesUrl;
      var navPathUrl;
      if (localStorage.getItem('selected_enterprise')) {
        rotationAngle = localStorage.getItem('rotationAngle');
      } else {
        rotationAngle = localStorage.getItem('parentRotationAngle');
      }
      for (i = 0; i < fleetinfo['floorsData'].length; i++) {
        kioskMap = window.localStorage.getItem('kioskMapOrientation');
        checkiskiosk = window.localStorage.getItem('kioskexit');
        if (rotationAngle && kioskMap === 'true' && checkiskiosk === 'true') {
          rotationAngleOpacity = 0;
          var floormetaDataFileName = localStorage.getItem('s3bucket_url') + fleetinfo['floorsData'][i].floor_plan_details.floorMetaDataJSON.split('.json');
          var pathBoundariesFileName = localStorage.getItem('s3bucket_url') + fleetinfo['floorsData'][i].floor_plan_details.pathBoundariesJSON.split('.json') + '_' + rotationAngle
          metaDataUrl = localStorage.getItem('s3bucket_url') + 'assets/enterprises/' + getAllUrlParams().eid + '/facilities/' + getAllUrlParams().cufloorid + '/' + floormetaDataFileName[0] + '_' + rotationAngle + '.json';
          pathBoundariesUrl = localStorage.getItem('s3bucket_url') + 'assets/enterprises/' + getAllUrlParams().eid + '/facilities/' + getAllUrlParams().cufloorid + '/' + pathBoundariesFileName[0] + '_' + rotationAngle + '.json';
        } else {
          rotationAngleOpacity = 0.8;
          metaDataUrl = localStorage.getItem('s3bucket_url') + fleetinfo['floorsData'][i].floor_plan_details.floor_meta_data_json;
          //  'assets/enterprises/' + getAllUrlParams().eid + '/facilities/' + getAllUrlParams().cufloorid + '/' + fleetinfo['floorsData'][i].floorPlanDetails.floorMetaDataJSON;
          pathBoundariesUrl = localStorage.getItem('s3bucket_url') + fleetinfo['floorsData'][i].floor_plan_details.path_boundaries_json;
          //  'assets/enterprises/' + getAllUrlParams().eid + '/facilities/' + getAllUrlParams().cufloorid + '/' + fleetinfo['floorsData'][i].floorPlanDetails.pathBoundariesJSON;
        }
        $.getJSON(metaDataUrl, function (floorcoordinatesdata) {
          $.getJSON(pathBoundariesUrl, function (floorplanboundaries) {
            fleetinfo = JSON.parse(localStorage.getItem(getAllUrlParams().sr));
            fleetinfo['floorsData'][0].floor_plan_details.coordinates = floorcoordinatesdata;
            floorPathsBounds = floorplanboundaries.pathboundaries;
            if (getAllUrlParams().pn !== 'pickticket') {
              for (i = 0; i < fleetinfo['floorsData'].length; i++) {
                try {
                  var floorName = fleetinfo['floorsData'][i].features[0].properties.level;
                  var floorDisplayName = fleetinfo['floorsData'][i].features[0].properties.levelDisplay;
                } catch (err) {
                  var floorName = fleetinfo['floorsData'][i].facility_name;
                  var floorDisplayName = fleetinfo['floorsData'][i].facility_display_name;
                }
                floorIds[floorName] = fleetinfo['floorsData'][i]._id;
                floorslist.push(floorName);
                floorslistDisplayNames.push(floorDisplayName);
                floorsinsequence.push(floorName); // changed 180702
                var floorcoorinates = fleetinfo['floorsData'][0].floor_plan_details.coordinates;
                for (j = 0; j < floorcoorinates.length; j++) {
                  floor0mapCoords = [
                    [floorcoorinates[j].floorNorthWestCoordinates[0], floorcoorinates[j].floorNorthWestCoordinates[1]],
                    [floorcoorinates[j].floorNorthEastCoordinates[0], floorcoorinates[j].floorNorthEastCoordinates[1]],
                    [floorcoorinates[j].floorSouthWestCoordinates[0], floorcoorinates[j].floorSouthWestCoordinates[1]]
                  ];
                  floormapCoords[floorName] = floor0mapCoords;
                }
                entrycordinates[floorName] = floorcoorinates[0]?.floorEntryCoordinates;
                if (rotationAngle) {
                  navPathUrl = localStorage.getItem('s3bucket_url') + 'assets/enterprises/' + getAllUrlParams().eid + '/fleets/' + fleetinfo['floorsData'][i]._id + '/' + fleetinfo['floorsData'][i].floor_plan_details.nav_path_json + '_' + rotationAngle;
                } else {
                  navPathUrl = localStorage.getItem('s3bucket_url') + fleetinfo['floorsData'][i].floor_plan_details.nav_path_json;
                }
                floormapUrls[floorName] = localStorage.getItem('s3bucket_url') + fleetinfo['floorsData'][i].floor_plan_details.floor_plan_image_file_name;
                floorPathsUrls[floorName] = navPathUrl;
                if (i === fleetinfo['floorsData'].length - 1) {
                  floormapCoords[0] = floor0mapCoords;
                  floormapUrls[0] = localStorage.getItem('apiendpoint') + '/' + fleetinfo.fleetImageFilePath + '/' + fleetinfo.fleetImageFileName;
                }
              }
              eventFromLatLng = fleetinfo['floorsData'][0].floor_plan_details.coordinates[0].floorEntryCoordinates[0];
              eventFromLatLon = fleetinfo['floorsData'][0].floor_plan_details.coordinates[0].floorEntryCoordinates[1];
              startLat = fleetinfo['floorsData'][0].floor_plan_details.coordinates[0].floorEntryCoordinates[0];
              startLon = fleetinfo['floorsData'][0].floor_plan_details.coordinates[0].floorEntryCoordinates[1];
              geojsonUrl = getAllUrlParams().sr;
              floorPathsBounds = floorPathsBounds;
            }
          });
        });
      }
      /*
         $.getJSON(localStorage.getItem('apiendpoint') + '/' + fleetinfo['floorsData'][0].fleetImageFilePath + '/' + fleetinfo['floorsData'][0].floorPlanDetails.pathBoundariesJSON, function (floorplanboundaries) {
           fleetinfo = JSON.parse(localStorage.getItem(getAllUrlParams().sr));
           fleetinfo['floorsData'][0].floorPlanDetails.coordinates = floorcoordinatesdata;
           floorPathsBounds = floorplanboundaries.pathboundaries;
           if (getAllUrlParams().pn !== 'pickticket') {
             for (i = 0; i < fleetinfo['floorsData'].length; i++) {
               var floorName = fleetinfo['floorsData'][i].features[0].properties.level;
               floorIds[floorName] = fleetinfo['floorsData'][i]._id;
               floorslist.push(floorName);
               var floorcoorinates = fleetinfo['floorsData'][0].floorPlanDetails.coordinates;
               for (j = 0; j < floorcoorinates.length; j++) {
                 floor0mapCoords = [
                   [floorcoorinates[i].floorNorthWestCoordinates[0], floorcoorinates[i].floorNorthWestCoordinates[1]],
                   [floorcoorinates[i].floorNorthEastCoordinates[0], floorcoorinates[i].floorNorthEastCoordinates[1]],
                   [floorcoorinates[i].floorSouthWestCoordinates[0], floorcoorinates[i].floorSouthWestCoordinates[1]]
                 ];
                 floormapCoords[floorName] = floor0mapCoords;
               }
               entrycordinates[floorName] = floorcoorinates[i].floorEntryCoordinates // changed 180702 To get entry coordinates.
               floormapUrls[floorName] = localStorage.getItem('apiendpoint') + '/' + fleetinfo['floorsData'][i].fleetImageFilePath + '/' + fleetinfo['floorsData'][i].floorPlanDetails.floorPlanImageFileName;
               floorPathsUrls[floorName] = localStorage.getItem('apiendpoint') + '/' + fleetinfo['floorsData'][i].fleetImageFilePath + '/' + fleetinfo['floorsData'][i].floorPlanDetails.navPathJSON;
               if (i === fleetinfo['floorsData'].length - 1) {
                 floormapCoords[0] = floor0mapCoords;
                 floormapUrls[0] = localStorage.getItem('apiendpoint') + '/' + fleetinfo.fleetImageFilePath + '/' + fleetinfo.fleetImageFileName;
               }
             }
             startLat = fleetinfo['floorsData'][0].floorPlanDetails.coordinates[0].floorEntryCoordinates[0];
             startLon = fleetinfo['floorsData'][0].floorPlanDetails.coordinates[0].floorEntryCoordinates[1];
             geojsonUrl = getAllUrlParams().sr;
             floorPathsBounds = floorPathsBounds;
           }
         });
       }); */
    } else if (getAllUrlParams().fp === 'true' && getAllUrlParams().pn === 'pickticket') { // check floor plan is Available or not
      var fleetinfo = JSON.parse(localStorage.getItem(getAllUrlParams().sr));
      startLat = fleetinfo.floorPlanDetails.floorEntryCoordinates[0];
      startLon = fleetinfo.floorPlanDetails.floorEntryCoordinates[1];
      floor0mapCoords = [
        [fleetinfo.floorPlanDetails.floorNorthWestCoordinates[0], fleetinfo.floorPlanDetails.floorNorthWestCoordinates[1]],
        [fleetinfo.floorPlanDetails.floorSouthWestCoordinates[0], fleetinfo.floorPlanDetails.floorSouthWestCoordinates[1]],
        [fleetinfo.floorPlanDetails.floorNorthEastCoordinates[0], fleetinfo.floorPlanDetails.floorNorthEastCoordinates[1]]
      ];
      floormapCoords = [];
      floormapCoords[floorToShow] = floor0mapCoords;
      geojsonUrl = getAllUrlParams().sr;
      floormapUrls = [];
      floormapUrls[floorToShow] = 'https://test.pigeon.pigeon-tech.com/assets/fleets/6/vedic-snehapuri-warehouse.png'; //localStorage.getItem('apiendpoint') + '/' +  fleetinfo.fleetImageFilePath + '/' + fleetinfo.floorPlanDetails.floorPlanImageFileName;
      floorPathsUrls = [];
      floorPathsUrls[floorToShow] = 'https://test.pigeon.pigeon-tech.com/assets/fleets/6/vedicsnehapurif0paths.json'; //localStorage.getItem('apiendpoint') + '/' + fleetinfo.fleetImageFilePath + '/' + fleetinfo.floorPlanDetails.floorPlanJSONFileName;
      // floorPathsUrls[floorToShow] = null;
      floorPathsBounds = [
        // [17.422846229518246, 78.54490752797574],
        // [17.422730547814403, 78.54502613190562],
        // [17.422602390155404, 78.5449013253674],
        // [17.422716379179878, 78.54478434195276]
        [17.42284646943844, 78.54490748606624],
        [17.422825089882295, 78.54488463138297],
        [17.422819011895527, 78.54488924142971],
        [17.42271629924568, 78.54478379717095],
        [17.422601990206836, 78.54490145117973],
        [17.42268740207903, 78.54498988017441],
        [17.4226917206517, 78.54498703032733],
        [17.422730401222868, 78.54502703991784]
      ];
      // floorPathsBounds = L.geoJSON(fleetinfo).getBounds();
      // floorPathsBounds = [
      // 	[fleetinfo.floorPlanDetails.floorSouthWestCoordinates[0], fleetinfo.floorPlanDetails.floorNorthWestCoordinates[1]],
      // 	[fleetinfo.floorPlanDetails.floorNorthEastCoordinates[0], fleetinfo.floorPlanDetails.floorNorthWestCoordinates[1]],
      // ];
    } else if (getAllUrlParams().fp === 'false') {
      zoominit = 4; //getAllUrlParams().zi;
      zoomfinal = 18; //getAllUrlParams().zf;
      var fleetinfo = JSON.parse(localStorage.getItem(getAllUrlParams().sr));
      floormapCoords = {
        floorToShow: null
      };
      geojsonUrl = getAllUrlParams().sr;
      floormapUrls = {
        floorToShow: null
      };
      // floorPathsUrls = {
      // 	floorToShow: null
      // };
      floorPathsUrls = [];
      // floorPathsUrls[floorToShow] = "vedicsnehapurif0paths.json";
      floorPathsBounds = null;
      floorslist = [floorToShow];
    }
    var buildiingName = getAllUrlParams().cbn;
    if (buildiingName) {
      name = buildiingName.replace(/%20/g, " ");
    } else {
      name = "Vedic";
    }
    // To display only floorplan in kiosk screen
    if (window.localStorage.getItem('kisokScreen') === 'true') {
      rotationAngleOpacity = 0;
    }
    /**Construct Input Data for Mapping**/
    floormapcoords = [floormapCoords];
    geojsonurls = [geojsonUrl];
    floormapurls = [floormapUrls];
    floorpathurls = [floorPathsUrls];
    allfloorIds = [floorIds];
    floorpathbounds = [floorPathsBounds];
    floors = [floorslist];
    floorDisplayNames = [floorslistDisplayNames];
    disableClusterAtZoom = [mapsettingsblock.map_settings.cluster_level_zoom];
    if (disableClusterAtZoom) {
      disableClusterAtZoom = disableClusterAtZoom;
    } else {
      disableClusterAtZoom = [18];
    }
    // disableClusterAtZoom = [17];
    // if (getAllUrlParams().eid == '4' || getAllUrlParams().eid == '3' ||
    //   getAllUrlParams().eid == '14' || getAllUrlParams().eid == '15' ||
    //   getAllUrlParams().eid == '16' || getAllUrlParams().eid == '17' || getAllUrlParams().eid == '18' || getAllUrlParams().eid == '19') {
    //   disableClusterAtZoom = [15];
    // } else if (getAllUrlParams().eid == '5') {
    //   disableClusterAtZoom = [15];
    // } else if (getAllUrlParams().eid == '6') {
    //   disableClusterAtZoom = [17];
    // } else if (getAllUrlParams().eid == '7') {
    //   disableClusterAtZoom = [17];
    // } else if (getAllUrlParams().eid == '8') {
    //   disableClusterAtZoom = [18];
    // } else if (getAllUrlParams().eid == '9') {
    //   disableClusterAtZoom = [17];
    // } else if (getAllUrlParams().eid == '10') {
    //   disableClusterAtZoom = [16];
    // } else if (getAllUrlParams().eid == '11') {
    //   disableClusterAtZoom = [18];
    // } else if (getAllUrlParams().eid == '12') {
    //   disableClusterAtZoom = [15];
    // } else if (getAllUrlParams().eid == '13') {
    //   disableClusterAtZoom = [17];
    // } else {
    //   disableClusterAtZoom = [18];
    // }
    names = [name];
  } else {
    lat = getAllUrlParams().x;
    lon = getAllUrlParams().y;
    showFloorMaps = getAllUrlParams().fm === "1" ? true : false;
    floorToShow = getAllUrlParams().fl;
    gaToShow = getAllUrlParams().sga; //-1 implies show all geo areas
    displayControls = getAllUrlParams().dc;
    zoominit = getAllUrlParams().zi;
    zoomfinal = getAllUrlParams().zf;
    startLat = getAllUrlParams().sla;
    startLon = getAllUrlParams().slo;
    endLat = getAllUrlParams().ela;
    endLon = getAllUrlParams().elo;
    //configurl = getAllUrlParams().cu;
    //Overriding parameters for demos
    //Vedic Office
    //	lat=17.419932691739724;lon=78.54950973764063;
    //Church
    // lat=-41.1821;lon=174.96009;
    lon = -84.3944140000000;
    lat = 39.3578180000000;
    //Cincinatti zoo
    //lat=39.14487485818;lon=-84.50819045573;
    //currentFloor = "1";
    showFloorMaps = "0";
    if (!floorToShow) floorToShow = "0";
    gaToShow = false; //"2";//false;
    displayControls = "1";
    zoominit = 4;
    zoomfinal = 2;
    /********* MAP VARIABLES TO BE INITIALIZED FROM CONFIG URL ******/
    /**Define GeoAreas(Plots)*****/
    /**GeoArea 1**/
    floor0mapChurchCoords = [
      [-41.18181, 174.95945],
      [-41.18181, 174.96093],
      [-41.18231, 174.95945]
    ];
    floormapChurchCoords = {
      "0": floor0mapChurchCoords
    };
    geojsonChurchUrl = "samplejsondatachurch.json";
    floormapChurchUrls = {
      "0": "sampleplanchurch.png"
    };
    floorPathsChurchUrls = {
      "0": "networkchurch.json"
    };
    floorPathsChurchBounds = [
      [-41.18181, 174.95945],
      [-41.18230182811538, 174.96083199977878]
    ];
    //floormapChurchUrlurls = {"0": null};
    floorsChurch = ["0"];
    nameChurch = "pigeon-tech";
    /**Construct Input Data for Mapping**/
    floormapcoords = [floormapChurchCoords];
    geojsonurls = [geojsonChurchUrl];
    floormapurls = [floormapChurchUrls];
    floorpathurls = [floorPathsChurchUrls];
    floorpathbounds = [floorPathsChurchBounds];
    floors = [floorsChurch];
    // disableClusterAtZoom = [-1];
    disableClusterAtZoom = [19];
    names = [nameChurch];
  }
  var showFloorResizeMarkers = false;
  var showFloorPathNetwork = false;
  /********* Initialize Map *************************************/
  var MAXZOOM = 25; //For intialization of the map layers
  var ZOOMTHRESHOLD = 25; //Controls after what zoom level bing changes to mapbox
  var overlayMapsLayers = {};
  var baseMapsLayers = initBaseMapLayers(MAXZOOM);
  map = initMap(lat, lon, ZOOMTHRESHOLD, baseMapsLayers, "Bing", "Mapbox");
  //markLocation(map, lat, lon, fleetname);
  flyToLocationAfterDelay(lat, lon, zoomfinal, 0);
  setClickEventsToGetMapLatLon(map);
  /********* Update Map with Input Data *************************************/
  var numGeoAreas = geojsonurls.length;
  var searchDataLayer = L.layerGroup();
  geoArea = 0;
  if (gaToShow) { //Modify loop parameters to show only the gaToShow or all layers
    geoArea = parseInt(gaToShow);
    if (geoArea >= 0 && geoArea < numGeoAreas)
      numGeoAreas = geoArea + 1;
  }
  for (; geoArea < numGeoAreas; ++geoArea) {
    gaName = names[geoArea];
    overlayMapsLayers[gaName] = L.layerGroup.GeoArea();
    overlayMapsLayers[gaName].addGeoAreaDetails({
      gaName: gaName,
      gaGeojsonurl: geojsonurls[geoArea],
      gaFloorMapsUrls: floormapurls[geoArea],
      gaFloormapcoords: floormapcoords[geoArea],
      gaFloorPathUrls: floorpathurls[geoArea],
      gaFloorPathBounds: floorpathbounds[geoArea],
      gaFloors: floors[geoArea],
      gaFloorIds: floorIds,
      gaShowFloorMaps: showFloorMaps,
      gaShowFloorPathNetwork: showFloorPathNetwork,
      showFloorResizeMarkers: showFloorResizeMarkers,
      floorToShow: floorToShow,
      disableClusterAtZoom: disableClusterAtZoom[geoArea],
      map: map,
      hideSingleBase: true,
      facilityDisplayName: fleetinfo?.facility_display_name,
      floorDisplayNames: floorDisplayNames[geoArea],
      gaPopupCallback: gaPopupCallback,
    });
    searchDataLayer.addLayer(overlayMapsLayers[gaName]);
    overlayMapsLayers[gaName].addTo(map);
  }
  // Added to highlight fleet and show at center of the map while coming from fleet details page
  if (localStorage.getItem('selectedFleet')) {
    // console.log("highlighting fleet", selectedFleet);
    var selectedFleet = JSON.parse(localStorage.getItem('selectedFleet'));
    // if (selectedFleet.facilityId === undefined) {
    //   selectedFleet.facilityId = selectedFleet.facilityId;
    // }
    overlayMapsLayers[gaName].eachLayer(function (layer) {
      try {
        layer.getLayers().forEach(function (e) {
          if (e.feature && e.feature.facilityId === selectedFleet.facilityId) {
            selectedFleetMarker = L.circleMarker([selectedFleet.geometry.coordinates[1], selectedFleet.geometry.coordinates[0]], {
              stroke: true,
              fill: true,
              radius: 30,
              color: '#FFFF00',
              weight: 5,
            }).addTo(map);
            var waypoints = [
              L.latLng(selectedFleet.geometry.coordinates[1], selectedFleet.geometry.coordinates[0]),
              L.latLng(selectedFleet.geometry.coordinates[1], selectedFleet.geometry.coordinates[0])
            ];
            map.fitBounds(L.latLngBounds(waypoints));
            map.setZoom(zoomfinal);
            displayBottomSheet(e);
          }
        });
      } catch (err) {
      }
    });
  }
  if (displayControls && parseInt(displayControls) === 1) {
    // reload = new customControl();
    /** Live navigation code changes starts - Ramohan - 181106 */
    // liveNavigationControl = new liveNavigationControl();
    /** Live navigation code changes ends - Ramohan - 181106 */
    locateControl = new locateControl();
    facilitiesControl = new facilitiesControl();
    refreshControl = new refreshControl();
    exploreControl = new exploreControl();
    tripPlanControl = new tripPlanControl();
    if (heatMapEnabled) {
      heatMapControl = new heatMapControl();
      map.addControl(heatMapControl);
    }
    // googleNavigationControl = new googleNavigationControl();
    // Added below control to enable custom locate control - 210603
    if (localStorage.getItem('360AngleImage') != 'undefined') {
      reload = new panoramaControl();
    }
    layerControl = L.control.layers(baseMapsLayers, overlayMapsLayers, {
      position: 'topleft'
    })
    // Disabled map layer icon - 190103
    // map.addControl(layerControl);
    zoomControl = new L.Control.Zoom({
      position: 'topleft'
    });
    // Commented below code to disable leaflet locate control - 210603
    // lc = L.control.locate({
    //   strings: {
    //     title: "Show me where I am, yo!",
    //   },
    //   position: 'bottomright'
    // })
    // map.addControl(lc);
    createSearchControl(searchDataLayer);
    // window.localStorage.setItem('curfloorname', localStorage.getItem(getAllUrlParams().cfn));
    // window.localStorage.setItem('bookmarkEnterpriseId', fleetinfo['floorsData'][0].enterprise.enterprise_id);
    // window.localStorage.setItem('bookmarkEnterpriseName', fleetinfo['floorsData'][0].enterprise.enterprise_name);
    window.localStorage.setItem('bookmarkUserId', localStorage.getItem('login_user_id'));
    var url = localStorage.getItem('apiendpoint') + 'api/v1/pigeonbookmarks';
    var userId = localStorage.getItem('login_user_id');
    if (localStorage.getItem('login_user_id') === null || localStorage.getItem('login_user_id') === '') {
      userId = null
    }
    if (localStorage.getItem('login_user_id') != null || localStorage.getItem('bookmarkDeviceId') != null) {
      createBookmarkControl();
      // url = url + '?enterprise.enterprise_id=' + fleetinfo['floorsData'][0].enterprise.enterprise_id + '&floor_name=' + localStorage.getItem('fcurrentfloorname') + '&user_profile.user_profile_id=' + userId + '&deviceId=' + localStorage.getItem('bookmarkDeviceId');
      // controlBookmark = new L.Control.Bookmarks({
      //   position: 'topleft'
      // });
      /* $.ajax({
        url: url,
        type: 'GET',
        headers: {
          "token": window.localStorage.getItem('token')
        },
        dataType: 'json',
        error: function (error) {
          var status = JSON.parse(error['status']);
          switch (status) {
            case 0:
              controlBookmark = new L.Control.Bookmarks({
                position: 'topright'
              });
              break;
            case 400:
              try {
                if (JSON.parse(error['responseText']).statusCode === '9997') {
                  createBookmarkControl();
                }
              } catch (e) {
                controlBookmark = new L.Control.Bookmarks({
                  position: 'topright'
                });
              }
              break;
            default:
              controlBookmark = new L.Control.Bookmarks({
                position: 'topright'
              });
          }
        },
        success: function (data) {
          createBookmarkControl();
        }
      }); */
    } else {
      showToast(mapNamesObj.bookmark_access_denied_message); // RameshK 240412 
    }
  }
  if (startLat && startLon && endLat && endLon && getAllUrlParams().fp === 'true') {
    thisGeoArea = overlayMapsLayers[gaName];
    flShow = thisGeoArea.floorToShow;
    initializeRouter(thisGeoArea.map, thisGeoArea.gaFloorPathUrls[flShow]);
    if (getAllUrlParams().pn === 'pickticket') {
      showIndoorRoute(thisGeoArea.map, thisGeoArea.gaFloorPathUrls[flShow], thisGeoArea.gaShowFloorPathNetwork, null, null, null, null, false);
      // setTimeout(function () {
      // showRoute(startLat, startLon, endLat, endLon);
      showIndoorShortestMultiplePOIRoute(
        thisGeoArea.map,
        thisGeoArea.gaFloorPathUrls[thisGeoArea.floorToShow],
        thisGeoArea.gaShowFloorPathNetwork,
        // startLat, startLon,
        17.42273, 78.54501,
        thisGeoArea.specialPOIs['Fireexit'],
        true
      );
      showIndoorRoute(thisGeoArea.map, thisGeoArea.gaFloorPathUrls[flShow], thisGeoArea.gaShowFloorPathNetwork, startLat, startLon, endLat, endLon, false);
      // }, 3000)
    } else if (getAllUrlParams().pn === 'cartaddedassets') {
      // initializeRouter(thisGeoArea.map, thisGeoArea.gaFloorPathUrls[flShow]);
      nearFleets = true;
      nearSpecialPath = false;
      window.localStorage.setItem('updatemap', 'false');
      setTimeout(function () {
        var selectedassetsfloorarr = JSON.parse(window.localStorage.getItem('multifloorselectedAssets'));
        var SelectedAssets = JSON.parse(window.localStorage.getItem('lcsinglefleet'));
        SelectedAssets = SelectedAssets['floorsData'];
        var floorEntryCoordinates = entrycordinates[selectedassetsfloorarr[0]];
        if (localStorage.getItem('currentpostion')) {
          var currentpostion = JSON.parse(localStorage.getItem('currentpostion'));
          var floorEntryCoordinates = [currentpostion.latitude, currentpostion.longitude];
        }
        if (thisGeoArea.specialPOIs['L60-SelectedAssets'] && thisGeoArea.specialPOIs['L60-SelectedAssets'].length > 0) {
          var specialfleets = thisGeoArea.specialPOIs['L60-SelectedAssets'];
        } else {
          var specialfleets = thisGeoArea.specialPOIs['L70-Staircase'];
        }
        // alert('group');
        groupAnimationpathMove = true;
        showIndoorShortestMultiplePOIRoute(
          floorEntryCoordinates[0], floorEntryCoordinates[1],
          specialfleets,
          // thisGeoArea.specialPOIs['L60-SelectedAssets'], changed 180712
          false,
          thisGeoArea.gaShowFloorPathNetwork
        );
        // if (typeof liveNavigationControl !== 'undefined') map.addControl(liveNavigationControl);
        var endpointds = JSON.parse(window.localStorage.getItem("pathendingpoints"));
        if (selectedassetsfloorarr.length > 1) {
          if (localStorage.getItem('currentpostion') && localStorage.getItem('fromfloor')) {
            multiFloorNav.fromBuildingName = thisGeoArea.gaName;
            multiFloorNav.fromFloorId = localStorage.getItem('fromfloor');
            multiFloorNav.fromLatLng = endpointds;
            var tofloorindex = selectedassetsfloorarr.indexOf(localStorage.getItem('fromfloor'))
            selectedassetsfloorarr.splice(tofloorindex, 1);
            multiFloorNav.toBuildingName = thisGeoArea.gaName;
            multiFloorNav.toFloorId = selectedassetsfloorarr[0];
            multiFloorNav.toLatLng = SelectedAssets[0].features[0].geometry.coordinates;
            var currentpostion = JSON.parse(localStorage.getItem('currentpostion'));
            var floorEntryCoordinates = [currentpostion.latitude, currentpostion.longitude];
            groupLocateMultifloorNavigation(floorEntryCoordinates, specialfleets);
          } else {
            multiFloorNav.fromBuildingName = thisGeoArea.gaName;
            multiFloorNav.fromFloorId = selectedassetsfloorarr[0];
            multiFloorNav.fromLatLng = endpointds;
            multiFloorNav.toBuildingName = thisGeoArea.gaName;
            multiFloorNav.toFloorId = selectedassetsfloorarr[1];
            multiFloorNav.toLatLng = SelectedAssets[1].features[0].geometry.coordinates;
            groupLocateMultifloorNavigation(floorEntryCoordinates, specialfleets);
          }
        }
      }, 1900);
    } else if (getAllUrlParams().pn === 'predefinedaddedassets') {
      // initializeRouter(thisGeoArea.map, thisGeoArea.gaFloorPathUrls[flShow]);
      nearFleets = true;
      nearSpecialPath = false;
      window.localStorage.setItem('updatemap', 'false');
      setTimeout(function () {
        var selectedassetsfloorarr = JSON.parse(window.localStorage.getItem('multifloorselectedAssets'));
        var SelectedAssets = JSON.parse(window.localStorage.getItem('lcsinglefleet'));
        SelectedAssets = SelectedAssets['floorsData'];
        var floorEntryCoordinates = entrycordinates[selectedassetsfloorarr[0]];
        if (localStorage.getItem('currentpostion')) {
          var currentpostion = JSON.parse(localStorage.getItem('currentpostion'));
          var floorEntryCoordinates = [currentpostion.latitude, currentpostion.longitude];
        }
        if (thisGeoArea.specialPOIs[localStorage.getItem('routeNames')] && thisGeoArea.specialPOIs[localStorage.getItem('routeNames')].length > 0) {
          var specialfleets = thisGeoArea.specialPOIs[localStorage.getItem('routeNames')];
        } else {
          var specialfleets = thisGeoArea.specialPOIs['L70-Staircase'];
        }
        // alert('group');
        groupAnimationpathMove = true;
        showIndoorShortestMultiplePOIRoute(
          floorEntryCoordinates[0], floorEntryCoordinates[1],
          specialfleets,
          // thisGeoArea.specialPOIs['L60-SelectedAssets'], changed 180712
          false,
          thisGeoArea.gaShowFloorPathNetwork
        );
        // if (typeof liveNavigationControl !== 'undefined') map.addControl(liveNavigationControl);
        var endpointds = JSON.parse(window.localStorage.getItem("pathendingpoints"));
        if (selectedassetsfloorarr.length > 1) {
          if (localStorage.getItem('currentpostion') && localStorage.getItem('fromfloor')) {
            multiFloorNav.fromBuildingName = thisGeoArea.gaName;
            multiFloorNav.fromFloorId = localStorage.getItem('fromfloor');
            multiFloorNav.fromLatLng = endpointds;
            var tofloorindex = selectedassetsfloorarr.indexOf(localStorage.getItem('fromfloor'))
            selectedassetsfloorarr.splice(tofloorindex, 1);
            multiFloorNav.toBuildingName = thisGeoArea.gaName;
            multiFloorNav.toFloorId = selectedassetsfloorarr[0];
            multiFloorNav.toLatLng = SelectedAssets[0].features[0].geometry.coordinates;
            var currentpostion = JSON.parse(localStorage.getItem('currentpostion'));
            var floorEntryCoordinates = [currentpostion.latitude, currentpostion.longitude];
            groupLocateMultifloorNavigation(floorEntryCoordinates, specialfleets);
          } else {
            multiFloorNav.fromBuildingName = thisGeoArea.gaName;
            multiFloorNav.fromFloorId = selectedassetsfloorarr[0];
            multiFloorNav.fromLatLng = endpointds;
            multiFloorNav.toBuildingName = thisGeoArea.gaName;
            multiFloorNav.toFloorId = selectedassetsfloorarr[1];
            multiFloorNav.toLatLng = SelectedAssets[1].features[0].geometry.coordinates;
            groupLocateMultifloorNavigation(floorEntryCoordinates, specialfleets);
          }
        }
        //  window.localStorage.removeItem('routeNames');
      }, 1900);
    } else if (getAllUrlParams().pn === 'kioskhomescreen') {
      // initializeRouter(thisGeoArea.map, thisGeoArea.gaFloorPathUrls[flShow]);
      var floorEntryCoordinates = entrycordinates[localStorage.getItem('fcurrentfloorname')];
      window.localStorage.removeItem('fromNavPath');
      window.localStorage.setItem('showallFleets', 'showallFleets');
      setOpactiyOnMap(thisGeoArea);
      thisGeoArea.enabledspecial = localStorage.getItem('kioskmenuFleettype');
      setTimeout(function () {
        if (thisGeoArea.specialPOIs[localStorage.getItem('kioskmenuFleettype')]) {
          showIndoorShortestMultiplePOIRoute(
            floorEntryCoordinates[0], floorEntryCoordinates[1],
            thisGeoArea.specialPOIs[localStorage.getItem('kioskmenuFleettype')],
            true,
            thisGeoArea.gaShowFloorPathNetwork
          );
        } else {
          alert(mapNamesObj.please_select_faclities);
        }
        window.localStorage.removeItem('kioskmenuFleettype');
        window.localStorage.removeItem('mapURL')
      }, 3000);
    } else if (getAllUrlParams().pn === 'home' || getAllUrlParams().pn === 'facilities') {
      window.localStorage.removeItem('toasset');
      window.localStorage.removeItem('fromasset')
    } else {
      groupAnimationpathMove = false;
      instrData = [];
      instructionsData = [];
      coordinatesData = [];
      instrNumber = 0;
      instrValue = true;
      navpath();
      setTimeout(function () {
        this.getDirections();
      }, 2000);
    }
  }
  if (bookmarkDataObj && (typeof controlBookmark !== 'undefined')) {
    map.addControl(controlBookmark);
    map.fire('bookmark:show', {
      data: bookmarkDataObj
    })
    window.localStorage.removeItem('selectedBookmarkData')
  }
  // if(getAllUrlParams().fp == 'false'){
  // if (urlType && urlType === 'locate') {
  //   setTimeout(function () {
  //     map.flyToBounds(overlayMapsLayers[names[0]].getBounds(), {
  //       maxZoom: zoomfinal
  //     });
  //   }, 1900)
  // }
  // } 
  if (window.localStorage.getItem('kisokScreen') !== 'true') {
    // Added below code to enable custom locate control - 210603
    if (typeof facilitiesControl !== 'undefined') {
      map.addControl(facilitiesControl);
    }
    if (typeof locateControl !== 'undefined') {
      map.addControl(locateControl);
    }
    if (typeof tripPlanControl !== 'undefined') {
      map.addControl(tripPlanControl);
    }
    if (enabledinfopopup) {
      map.addControl(refreshControl);
    }
    // Disabled explore icon - 190103
    // if (typeof exploreControl !== 'undefined') map.addControl(exploreControl);
  }
  window.localStorage.removeItem('kioskFromToAssets')
  if (window.localStorage.getItem('kioskHomeToloaction') === 'true') {
    kioskFromToAssets();
  }
}
// Function to show toast message // RameshK 240412
function showToast(message) {
  var toast = L.DomUtil.create('div');
  toast.style.position = 'fixed';
  toast.style.top = '10px';
  toast.style.right = '5%';
  // toast.style.transform = 'translateX(-50%)';
  toast.style.background = '#333';
  toast.style.color = '#fff';
  toast.style.padding = '10px';
  toast.style.borderRadius = '5px';
  toast.style.zIndex = '10000';
  toast.style.textAlign = 'center';
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(function () {
    document.body.removeChild(toast);
  }, 3000);
}
/****** To show bookmark control ******/
function createBookmarkControl() {
  controlBookmark = new L.Control.Bookmarks({
    position: 'topright',
    storage: {
      setItem: function (id, value, callback) {
        let bookmarksDataArray = window.localStorage.getItem('bookmarksData') ? JSON.parse(window.localStorage.getItem('bookmarksData')) : [];
        bookmarksDataArray.push(value);
        var name = 'leaflet-bookmarks' + id;
        window.localStorage.setItem(name, JSON.stringify(value));
        window.localStorage.setItem('bookmarksData', JSON.stringify(bookmarksDataArray));
        /* var url = localStorage.getItem('apiendpoint') + 'api/v1/pigeonbookmarks';
        $.ajax({
          url: url,
          type: 'POST',
          data: value,
          headers: {
            "token": window.localStorage.getItem('token')
          },
          dataType: 'json',
          success: callback,
          error: function (error) { }
        }); */
      },
      updateItem: function (id, value, callback) {
        let bookmarksDataArray = window.localStorage.getItem('bookmarksData') ? JSON.parse(window.localStorage.getItem('bookmarksData')) : [];
        bookmarksDataArray = bookmarksDataArray.filter(bookmarkObj => bookmarkObj.id !== id);
        bookmarksDataArray.push(value);
        var name = 'leaflet-bookmarks' + id;
        window.localStorage.setItem(name, JSON.stringify(value));
        window.localStorage.setItem('bookmarksData', JSON.stringify(bookmarksDataArray));
        /* var url = localStorage.getItem('apiendpoint') + 'api/v1/pigeonbookmarks';
        url = url + '/' + value._id;
        $.ajax({
          url: url,
          type: 'PUT',
          data: value,
          headers: {
            "token": window.localStorage.getItem('token')
          },
          dataType: 'json',
          success: callback,
          error: function (error) { }
        }); */
      },
      removeItem: function (id, value, callback) {
        let bookmarksDataArray = window.localStorage.getItem('bookmarksData') ? JSON.parse(window.localStorage.getItem('bookmarksData')) : [];
        bookmarksDataArray = bookmarksDataArray.filter(bookmarkObj => bookmarkObj.id !== id);
        window.localStorage.setItem('bookmarksData', JSON.stringify(bookmarksDataArray));
        var name = 'leaflet-bookmarks' + id;
        window.localStorage.removeItem(name);
        if (typeof callback === 'function') {
          callback();
        }
        /* var url = localStorage.getItem('apiendpoint') + 'api/v1/pigeonbookmarks';
        url = url + '/' + value._id;
        $.ajax({
          url: url,
          type: 'DELETE',
          headers: {
            "token": window.localStorage.getItem('token')
          },
          dataType: 'json',
          success: callback,
          error: function (error) { }
        }); */
      },
      getAllItems: function (callback) {
        // var url = localStorage.getItem('apiendpoint') + 'api/v1/pigeonbookmarks';
        const selectedUserTypeObj = localStorage.getItem('selectedUserTypeObj') ? JSON.parse(localStorage.getItem('selectedUserTypeObj')) : {};
        var userId = parseInt(localStorage.getItem('login_user_id'), 10);
        if (localStorage.getItem('login_user_id') === null || localStorage.getItem('login_user_id') === '') {
          userId = null
        }
        const bookmarksData = window.localStorage.getItem('bookmarksData') ? JSON.parse(window.localStorage.getItem('bookmarksData')) : [];
        const enterpriseId = parseInt(localStorage.getItem('selected_enterprise'), 10);
        const floorName = localStorage.getItem('fcurrentfloorname');
        const deviceId = localStorage.getItem('bookmarkDeviceId');
        let filteredBookmarks = [];
        if (selectedUserTypeObj?.user_type_name === 'GUEST_USER') {
          filteredBookmarks = bookmarksData.filter(bookmark =>
            bookmark.enterprise.enterprise_id === enterpriseId &&
            bookmark.floor_name === floorName &&
            bookmark.user_profile.user_profile_id === userId &&
            bookmark.device_id === deviceId
          );
        } else {
          filteredBookmarks = bookmarksData.filter(bookmark =>
            bookmark.enterprise.enterprise_id === enterpriseId &&
            bookmark.floor_name === floorName &&
            bookmark.user_profile.user_profile_id === userId
          );
        }
        if (typeof callback === 'function') {
          callback(filteredBookmarks);
        }
        return filteredBookmarks;
        /* url = url + '?enterprise.enterprise_id=' + localStorage.getItem('selected_enterprise') + '&floor_name=' + localStorage.getItem('fcurrentfloorname') + '&user_profile.user_profile_id=' + userId + '&deviceId=' + localStorage.getItem('bookmarkDeviceId');
        $.ajax({
          url: url,
          type: 'GET',
          headers: {
            "token": window.localStorage.getItem('token')
          },
          dataType: 'json',
          success: callback,
          error: function (error) {
            var status = JSON.parse(error['status']);
            switch (status) {
              case 0:
                map.removeControl(controlBookmark);
                controlBookmark = new L.Control.Bookmarks({
                  position: 'topright'
                });
                break;
            }
          }
        }); */
      }
    }
  });
}
function showControls() {
  // Disable map layer icon - 180103
  // if (typeof layerControl !== 'undefined') map.addControl(layerControl);
  bookMarkEnable = true;
  if (typeof searchControl !== 'undefined') map.addControl(searchControl);
  if (typeof controlBookmark !== 'undefined' && bookmarksEnabled === true) map.addControl(controlBookmark);
  if (typeof zoomControl !== 'undefined') map.addControl(zoomControl);
  if (typeof fullscreenControl !== 'undefined') map.addControl(fullscreenControl);
  // if (typeof lc !== 'undefined') map.addControl(lc);
  if (localStorage.getItem('360AngleImage') != 'undefined') {
    if (typeof panoramaControl !== 'undefined') map.addControl(reload);
  }
  // if (typeof customControl !== 'undefined') map.addControl(reload);
  // $("div.leaflet-bar.leaflet-control").attr("display","block");
}
function hideControls() {
  // $("div.leaflet-bar.leaflet-control").attr("display","none");
  // if (typeof layerControl !== 'undefined') map.removeControl(layerControl);
  if (typeof searchControl !== 'undefined') map.removeControl(searchControl);
  if (typeof zoomControl !== 'undefined') map.removeControl(zoomControl);
  if (typeof fullscreenControl !== 'undefined') map.removeControl(fullscreenControl);
  // if (typeof lc !== 'undefined') map.removeControl(lc);
  // if (typeof customControl !== 'undefined') map.removeControl(reload);
  // if (typeof panoramaControl !== 'undefined') map.removeControl(reload);
}
function initMap(lat, lon, zoomthreshold, baseMapsLayers, initialMapLayer) {
  var map = L.map('mapid', {
    fullscreenControl: false,
    controlSearch: false,
    controlBookmark: false,
    zoomControl: false,
    heatMapControl: false,
    zoomAnimation: false, //needed during zooming
    contextmenu: true,
    contextmenuWidth: 160,
    contextmenuItems: [ // SRINIVAS - 210823 Context Menu Display
      {
        text: 'Show coordinates',
        callback: showCoordinates
      },
      {
        text: mapNamesObj.centermaphere, // 'Center map here',
        callback: centerMap
      },
      '-', {
        text: mapNamesObj.zoomin, // 'Zoom in',
        icon: '../dist/images/zoom-in.png',
        index: 0,
        callback: zoomIn
      }, {
        text: mapNamesObj.zoomout, // 'Zoom out',
        icon: '../dist/images/zoom-out.png',
        index: 1,
        callback: zoomOut
      },
      // '-',
      // {
      //   text: mapNamesObj.outdoors, // 'Outdoors',
      //   disabled: true
      // }, {
      //   text: mapNamesObj.directionsfrom, // 'Directions from',
      //   icon: '../dist/images/play.png',
      //   callback: setOFromLatLon
      // }, {
      //   text: mapNamesObj.directionsto, // 'Directions to',
      //   icon: '../dist/images/pause.png',
      //   callback: setOToLatLon
      // }, 
      // {
      //   text: mapNamesObj.clear, // 'Clear',
      //   icon: '../dist/images/layers.png',
      //   callback: clearOPath
      // }, 
      '-'
    ],
    /**
     * Added below 4 lines of code for zoom-in-zoom-out to increase/decrease gradually to improve the user experience - 241205
     */
    center: [45.2403, -123.8512],
    zoom: 12,
    fadeAnimation: true,
    zoomAnimation: true
  }).setView([lat, lon], zoominit);
  L.control.scale({
    imperial: false
  }).addTo(map);
  initialMapLayer = window.localStorage.getItem('mapViewLayer');
  baseMapsLayers[initialMapLayer].addTo(map);
  /**
   * Added map.setView code for zoom-in-zoom-out to increase/decrease gradually to improve the user experience - 241205
   */
  map.setView([lat, lon], zoominit, { // The zoom level was set to 14, but due to an issue with locating, it was increased to 16.
    pan: {
      animate: true,
      duration: 1.5
    },
    zoom: {
      animate: true
    }
  });
  map.on('zoomend', function () {
    var confirmBox = $("#confirm");
    confirmBox.hide();
    if (localStorage.getItem('fromNavPath') != 'fromNavPath') {
      if (map.getZoom() > zoomthreshold) {
        //  if (viewLayer != null && viewLayer != undefined) {
        // Code: To show the map layer in Bing/OSM/Mapbox as a default: 181105
        if (map.hasLayer(baseMapsLayers.Bing)) map.removeLayer(baseMapsLayers.Bing);
        baseMapsLayers.Bing.addTo(map);
        // switch (viewLayer) {
        //   case 'Bing':
        //     baseMapsLayers.Bing.addTo(map);
        //     break;
        //   case 'OSM':
        //   //   if (map.hasLayer(baseMapsLayers.OSM)) { map.removeLayer(baseMapsLayers.OSM) };
        //     baseMapsLayers.OSM.addTo(map);
        //     break;
        //   case 'Mapbox':
        //    //  if (map.hasLayer(baseMapsLayers.Mapbox)) { map.removeLayer(baseMapsLayers.Mapbox) };
        //     baseMapsLayers.Mapbox.addTo(map);
        //     break;
        //   default:
        //   // if (map.hasLayer(baseMapsLayers.Bing)) { map.removeLayer(baseMapsLayers.Bing) };
        //     baseMapsLayers.Bing.addTo(map);
        //     break;
        // }
      }
      // } else {
      //   // if (map.hasLayer(baseMapsLayers.Mapbox)) { map.removeLayer(baseMapsLayers.Mapbox) };
      //   baseMapsLayers.Bing.addTo(map);
      // }
    }
  });
  return map;
}
function showCoordinates(e) {
  // alert(e.latlng);
  console.log('=====', e.latlng);
}
function centerMap(e) {
  map.panTo(e.latlng);
}
function zoomIn(e) {
  map.zoomIn();
}
function zoomOut(e) {
  map.zoomOut();
}
function setOFromLatLon(e) {
  showRoute(e.latlng.lat, e.latlng.lng, null, null);
}
function setOToLatLon(e) {
  showRoute(null, null, e.latlng.lat, e.latlng.lng);
}
function clearOPath(e) {
  removeOutdoorRoute();
}
//*******************START MAP PROVIDERS ********************************//
function initBaseMapLayers(mZoom) {
  mapboxMapLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: mZoom,
    attribution: '<i class="icon asset-icon-pigeon-tech" style="position:relative"></i> © <a href="http://pigeon-tech.com">pigeon tech</a>',
    id: 'mapbox.streets',
    opacity: rotationAngleOpacity,
    zIndex: -1,
    unloadInvisibleTiles: true,
    updateWhenIdle: true,
    reuseTiles: true
  });
  osmMapLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: mZoom,
    attribution: '<i class="icon asset-icon-pigeon-tech" style="position:relative"></i> © <a href="http://pigeon-tech.com">pigeon tech</a>',
    opacity: rotationAngleOpacity,
    zIndex: -1,
    unloadInvisibleTiles: true,
    updateWhenIdle: true,
    reuseTiles: true
  });
  var BING_KEY = 'AuhiCJHlGzhg93IqUH_oCpl_-ZUrIE6SPftlyGYUvr9Amx5nzA-WqGcPquyFZl4L';
  var bingOptions = {
    bingMapsKey: BING_KEY,
    imagerySet: 'AerialWithLabels',
    maxZoom: mZoom,
    attribution: '<i class="icon asset-icon-pigeon-tech" style="position:relative"></i> © <a href="http://pigeon-tech.com">pigeon tech</a>',
    opacity: rotationAngleOpacity,
    zIndex: -1,
    unloadInvisibleTiles: true,
    updateWhenIdle: true,
    reuseTiles: true
  };
  bingMapLayer = L.tileLayer.bing(bingOptions);
  return {
    "Mapbox": mapboxMapLayer,
    "OSM": osmMapLayer,
    "Bing": bingMapLayer
  };
}
//*********************END MAP PROVIDERS ********************************//
/****** START GEOJSON LOADING **************************/
function createSearchControl(geojson) {
  if (window.localStorage.getItem('searchwith')) {
    var searchFleetVal = window.localStorage.getItem('searchwith');
  } else
    searchFleetVal = 'facilityName'
  controlSearch = new L.Control.Search({
    buildTip: function (text, val) {
      var fleetid = val.layer.feature.properties.facilityId;
      var mImg = val.layer.feature.properties.image;
      var facilityIconFileName = val.layer.feature.properties.iconName;
      if (mImg) {
        return '<a><img src="' + mImg + '"></img>' + text + '</a>';
      }
      else {
        return '<a><span><i class= "' + facilityIconFileName + '"></i></span>' + text + '</a>';
      }
    },
    position: 'topleft',
    propertyName: searchFleetVal,
    layer: geojson,
    initial: false,
    moveToLocation: function (latlng, title, map) {
      clearPolylines(); // animation path clear 190116
      navAnimationPolylinesColour = false;
      // showIndoorRoute(startLat, startLon, latlng.lat, latlng.lng, false, thisGeoArea.gaShowFloorPathNetwork); // seach fleet nav path enable
      thisGeoArea.enabledspecial = title;
      map.flyTo(latlng, postSearchZoom, {
        duration: 5,
        animate: true
      });
      map.setZoom(postSearchZoom); // set Map as center
      initializeRouter(thisGeoArea.map, thisGeoArea.gaFloorPathUrls[flShow]);
      if (searchFleetVal == 'facilityName') {
        window.localStorage.removeItem('showallFleets');
        localStorage.setItem('fromNavPath', 'fromNavPath')
        setTimeout(function () {
          // disabled current position by search 190212
          // if (localStorage.getItem('currentpostion')) {
          //   var currentpostion = JSON.parse(localStorage.getItem('currentpostion'));
          //   var startLat = currentpostion.latitude;
          //   var startLon = currentpostion.longitude;
          //   showIndoorRoute(startLat, startLon, latlng.lat, latlng.lng, false, thisGeoArea.gaShowFloorPathNetwork);
          // } else {
          var currentFloorName = window.localStorage.getItem('fcurrentfloorname');
          var startLat = entrycordinates[currentFloorName][0];
          var startLon = entrycordinates[currentFloorName][1];
          setOpactiyOnMap(thisGeoArea);
          var waypoints = [
            L.latLng(latlng.lat, latlng.lng),
            L.latLng(latlng.lat, latlng.lng)
          ];
          map.fitBounds(L.latLngBounds(waypoints));
          map.setZoom(zoomfinal);
          // showIndoorRoute(startLat, startLon, latlng.lat, latlng.lng, false, thisGeoArea.gaShowFloorPathNetwork);
          // }
        }, 1000);
      } else {
        nearSpecialPath = true;
        setTimeout(function () {
          thisGeoArea.enabledspecial = title;
          nearFleets = true;
          setOpactiyOnMap(thisGeoArea);
          window.localStorage.removeItem('showallFleets');
          // removed fromnavpath to enable the special fleets on search when search with fleet type
          localStorage.removeItem('fromNavPath');
          showIndoorShortestMultiplePOIRoute(
            startLat, startLon,
            thisGeoArea.specialPOIs[title],
            true,
            thisGeoArea.gaShowFloorPathNetwork
          );
        }, 3000);
      }
    },
    marker: {
      icon: null,
      circle: {
        radius: 20,
        color: '#ffcc33'
      }
    }
  });
  controlSearch.on('search:locationfound', function (e) {
    window.localStorage.setItem('searchedId', e.layer.feature.facilityId);
    map.setZoom(zoomfinal);
    var focussedMarker = e.layer;
    visitorHeatMap(parseInt(thisGeoArea.gaFloorIds[thisGeoArea.floorToShow]), false);
    //	popupFeatureProperties(focussedMarker, e.latlng);
    e.layer.openPopup();
    /* Added code for bottom sheet on map */
    if (searchFleetVal == 'facilityName') {
      window.localStorage.removeItem('fromNavPath');
      window.localStorage.setItem('showallFleets', 'showallFleets');
      nearFleets = false;
      clearMultiFloorNavData();
      window.removeIndoorRoute();
      window.removePrevIndoorCoords();
      thisGeoArea.enabledspecial = false;
      setOpactiyOnMap(thisGeoArea);
      if (theMarker != undefined) {
        map.removeLayer(theMarker);
      };
      var temp = document.getElementById('assetDetails');
      var assetImg = document.getElementById('assetImg');
      var assetDesc = document.getElementById('assetDesc');
      var button = document.getElementById('navButton');
      var viewButton = document.getElementById('viewButton');
      temp.innerHTML = '';
      assetImg.innerHTML = '';
      assetDesc.innerHTML = '';
      button.innerHTML = '';
      viewButton.innerHTML = '';
      var listContent = '';
      var imgContent = '';
      var descContent = '';
      var buttonContent = '';
      var viewButtonContent = '';
      assetDetails = e.layer.feature;
      details = e.layer;
      assetLatLng = e.latlng;
      getReviews(assetDetails);
      var navigate = mapNamesObj.navigatebutton;
      var listContent = '';
      if (assetDetails.properties.facilityImageFilePath && assetDetails.properties.facilityImageFileName) {
        const netWorkStatus = localStorage.getItem('networkStatus');
        const isNetworkAvailable = (netWorkStatus === 'Online') ? true : false;
        const urlSplitArray = assetDetails.imageUrlAfterTransformation.split('http://');
        const imageUrlAfterTransformation = (!isNetworkAvailable && urlSplitArray.length === 1) ? '../../../' + assetDetails.imageUrlAfterTransformation : assetDetails.imageUrlAfterTransformation;
        imgContent += '<img onclick="getAssetDetails();" onerror="this.onerror=null;this.src=\'' + localStorage.getItem('enterpriseImage') +
          '\'" src="' + imageUrlAfterTransformation + '" height="60"  style="display: inline-block"/>';
        // listContent += '<img onclick="getAssetDetails();" onerror="this.onerror=null;this.src=\'' + localStorage.getItem('enterpriseImage') +
        //   '\'" src="' + localStorage.getItem('s3bucket_url') + assetDetails.properties.facilityImageFilePath + '/' + assetDetails.properties.facilityImageFileName + '" height="60"  style="display: inline-block"></img>';
      } else {
        imgContent = '<span onclick="getAssetDetails();" class= "' + assetDetails.properties.iconName + '" style="height:60px;font-size: 3.5em;background: ' + assetDetails.properties.FacilityTypeBackgroundColor + ';position: relative;display:flex;align-items:center;justify-content:center;padding:0px;"></span>'
      }
      descContent += '<p onclick="getAssetDetails();" style="font-size: 13px;cursor:pointer;font-weight:700;color:#134021;overflow: hidden !important;text-overflow: ellipsis !important;display: -webkit-box !important;-webkit-box-orient: vertical !important;-webkit-line-clamp: 2 !important;white-space: normal;line-height: 1.3;margin-bottom: 0px !important;max-height: 3.75rem;color:' + appColor + ';">' + assetDetails.properties.facilityName + '</p>';
      /* Added Condition for Fossil Rim Client Requirement : Do not display the asset rating and level - 210603 */
      // SRINIVAS - 210823 Commented code for assets rating 
      // listContent += '<div style="padding-left: 5px;text-align: left;">'
      // for (var i = 1; i <= 5; i++) {
      //   if (i <= avgRating) {
      //     listContent += '<span onclick="getAssetDetails();" class="fa fa-star checked" style="display: inline-block"></span>'
      //   } else {
      //     listContent += '<span onclick="getAssetDetails();" class="fa fa-star" style="display: inline-block"></span>'
      //   }     
      // }
      // listContent += '</div>'
      // if (assetDetails.properties.levelDisplay) {
      //   listContent += '<p onclick="getAssetDetails();" class="mapfleetdetails" style="padding-left: 5px;vertical-align: top;font-size: 13px;text-align: left;">' + assetDetails.properties.levelDisplay + '</p>';
      // } else {
      //   listContent += '<p onclick="getAssetDetails();" class="mapfleetdetails" style="padding-left: 5px;vertical-align: top;font-size: 13px;text-align: left;">' + assetDetails.properties.level + '</p>';
      // }
      // SRINIVAS - 210823- Apply map configuration to Show View or Direction button
      if (mapsettingsblock.map_settings.is_directions_enabled === true) {
        buttonContent += '<button id="directionsBtn" class="btn map-btn" style="background-color:' + appColor + ';color:' + Button_txt + ';cursor:pointer;display: flex;align-items: center;justify-content: center;font-size: 14.7px;font-weight: 500;" type="button" onclick="navigation(assetDetails);">' + mapNamesObj.directions + '</button>'
      } /* else { */
      viewButtonContent += '<button id="viewBtn" class="btn map-btn" style="cursor:pointer;display: flex;align-items: center;justify-content: center;font-size: 14.7px;font-weight: 500;background-color:' + appColor + ';color:' + Button_txt + ';" type="button" onclick="getAssetDetails();">' + mapNamesObj.view + '</button>'
      // }
      temp.innerHTML = listContent;
      assetImg.innerHTML = imgContent;
      assetDesc.innerHTML = descContent;
      button.innerHTML = buttonContent;
      viewButton.innerHTML = viewButtonContent;
      var bottomBox = $("#bottomSheet");
      if (!enabledinfopopup) {
        bottomBox.show();
        /* Added to show location popup */
        addlocationclasses();
        // Added to map dynamic height when bottom sheet show and hide conditions previously added style as height 91vh
        // document.getElementById('mapid').classList.add("mapheight");
        document.getElementById('bottomSheet').classList.add(mapNamesObj.view_popup_class);
      }
    }
  });
  controlSearch.on('search:collapsed', function (e) {
    //e.layer.closePopup();
  });
  controlSearch.on('search:cleared', function (e) {
    localStorage.removeItem('fromNavPath');
    window.localStorage.setItem('showallFleets', 'showallFleets');
    clearPolylines();
    navAnimationPolylinesColour = false;
    visitorHeatMap(parseInt(thisGeoArea.gaFloorIds[thisGeoArea.floorToShow]), false);
    window.localStorage.removeItem('searchedId');
    clearMultiFloorNavData();
    window.removeIndoorRoute();
    window.removePrevIndoorCoords();
    thisGeoArea.enabledspecial = false;
    setOpactiyOnMap(thisGeoArea);
    map.setZoom(zoomfinal);
  });
  map.addControl(controlSearch);
  //		map.removeLayer(geojson);
  return controlSearch;
}
/************************** END GEOJSON LOADING **************************/
var selectedMarker = null;
function markLocation(map, mlat, mlon, mfleetname) {
  if (selectedMarker != null) map.removeLayer(selectedMarker);
  selectedMarker = L.marker([mlat, mlon], {
    icon: redIcon
  });
  selectedMarker.addTo(map).on('click', displayFleetInfo2).facilityName = mfleetname;
}
function animateToLocationAfterDelay(mlat, mlon, zfinal, delay) {
  var ilat = -41.1821,
    ilon = 174.96056;
  showRoute(ilat, ilon, mlat, mlon);
  if (localStorage.getItem('fromNavPath') != 'fromNavPath') {
    // setTimeout(function () {
    map.flyTo([(ilat + 3 * mlat) / 4, (ilon + 3 * mlon) / 4], zfinal - 0.5);
    map.on('zoomend', mf = function () {
      map.off('zoomend', mf);
      map.setZoom(zfinal);
    });
    // }, delay);
  }
}
function flyToLocationAfterDelay(mlat, mlon, zfinal, delay) {
  if (localStorage.getItem('fromNavPath') != 'fromNavPath') {
    // setTimeout(function () {
    map.flyTo([mlat, mlon], zfinal, {
      animate: true
    });
    map.on('zoomend', mf = function () {
      //Sreenadh: Needed for the manual zoom to work after flyto
      map.off('zoomend', mf);
      map.setZoom(zfinal);
    });
    // }, delay);
  }
}
function setClickEventsToGetMapLatLon(map) {
  map.on('click', function (e) {
    parent.window.dispatchEvent(new Event('slideclose'));
    if (theMarker != undefined) {
      map.removeLayer(theMarker);
    };
    try {
      if (e.originalEvent.toElement.id != 'myBtn' && e.originalEvent.toElement.innerText != 'Facilities') {
        var confirmBox = $("#confirm");
        confirmBox.hide();
      }
      if (document.getElementById('stepsMoreBtn') === null || e.originalEvent.toElement.id === 'stepsMoreBtn') {
        var bottomBox = $("#bottomSheet");
        if (e.originalEvent.toElement.id !== 'mapid' || assetDetailsVal) {
          /*
            Date - 231018
            bottomBox.hide() commented for 'While click on the 'Steps & More' button in info popup then popup is closing, it should open the  'Steps & More' details popup (Verify in Safari Browser)
          */
          // bottomBox.hide();
          /* Added to show location popup */
          var locateIcon = document.getElementById("mapid");
          removeClasses(locateIcon, 'bottomSheetadded');
        }
        document.getElementById('mapid').style.height = '100vh';
      }
    } catch (e) {
    }
    var popup = L.popup();
    var rlayer;
    var latlng = map.mouseEventToLatLng(e.originalEvent);
    showControls();
    if (typeof controltimeout !== 'undefined')
      clearTimeout(controltimeout);
    controltimeout = setTimeout(function () {
      hideControls();
    }, 5000);
  })
}
var routingControl = null;
var fromLatLon = null,
  toLatLon = null;
function removeOutdoorRoute() {
  map.removeControl(routingControl);
  routingControl = null;
  fromLatLon = null;
  toLatLon = null;
}
function showRoute(startLat, startLon, endLat, endLon) {
  if (startLat) {
    fromLatLon = L.latLng(startLat, startLon);
  }
  if (endLat) {
    toLatLon = L.latLng(endLat, endLon);
  }
  if (fromLatLon && toLatLon) {
    startLat = fromLatLon.lat;
    startLon = fromLatLon.lng;
    endLat = toLatLon.lat;
    endLon = toLatLon.lng;
  } else if (fromLatLon) {
    startLat = fromLatLon.lat;
    startLon = fromLatLon.lng;
  } else
    return;
  if (routingControl != null) {
    // Remove previous routes
    routingControl.setWaypoints([
      L.latLng(startLat, startLon),
      L.latLng(endLat, endLon)
    ]);
  } else {
    routingControl = L.Routing.control({
      createMarker: function (i, wp) {
        return L.marker(wp.latLng, {
          icon: L.icon.glyph({
            prefix: '',
            glyph: i + 1
          }),
          draggable: true
        })
      },
      routeWhileDragging: true,
      waypoints: [
        L.latLng(startLat, startLon),
        L.latLng(endLat, endLon)
      ],
      //router: L.Routing.mapbox('sk.eyJ1Ijoic3JlZW5hZGgiLCJhIjoiY2o2dWh3YWtzMTVqOTMycW9oOGUzdXdndiJ9.pjOFFeVBwcjTmk71vxEomA'),

      router: L.Routing.graphHopper('d2533d0f-6091-486f-be24-cd267a5181d9', {
        urlParameters: {
          vehicle: 'foot',
        }
      }),
      //router: L.Routing.graphHopper(undefined, {serviceUrl: 'http://localhost:8989/route',urlParameters: {vehicle: 'foot'}}),
      routeDragTimeout: 250,
      // waypointMode: 'snap',
      collapsible: true,
      summaryTemplate: '<h2>' + mapNamesObj.outdirections + ' {name}</h2><h3>' + mapNamesObj.distance + ': {distance}, ' + mapNamesObj.duration + ': {time}</h3>',
      // showAlternatives: true,
      altLineOptions: {
        styles: [{
          color: 'black',
          opacity: 0.15,
          weight: 9
        },
        {
          color: 'white',
          opacity: 0.8,
          weight: 6
        },
        {
          color: 'blue',
          opacity: 0.5,
          weight: 2
        }
        ]
      },
      lineOptions: {
        styles: [{
          color: 'white',
          opacity: 1,
          weight: 4
        },
        {
          color: '#3479C3',
          opacity: 0.9,
          weight: 4,
          dashArray: '7,12'
        },
        {
          color: 'black',
          opacity: 0.15,
          weight: 7
        }
        ]
      }
    });
    routingControl.addTo(map);
    routingControl.on('routingerror', function (e) {
      try {
        map.getCenter();
      } catch (e) {
        map.fitBounds(L.latLngBounds(waypoints));
      }
      handleError(e);
    });
    //  L.Routing.errorControl(routingControl).addTo(map); 180926 // this is for direction desing issue
  }
}
// function updateOtherProperties(dataObj, displayproperties, otherproperties, displayColumns) {
// 	$.each(dataObj, function (index, value) {
// 		if (displayproperties.indexOf(index) > -1) {
// 			otherproperties[displayColumns[displayproperties.indexOf(index)]] = value;
// 		} else if (typeof (value) == 'object' && value != null && displayproperties.indexOf(index) <= -1) {
// 			updateOtherProperties(value, displayproperties, otherproperties, displayColumns);
// 		}
// 	});
// }
// function updateOtherProperties(dataObj, displayproperties, otherproperties, displayColumns) {
//   $.each(dataObj, function (index, value) {
//     if (displayproperties.indexOf(index) > -1) {
//       // if (displayColumns[displayproperties.indexOf(index)] !== "") {
//       var concatOp = '';
//       var oldValue = otherproperties[displayColumns[displayproperties.indexOf(index)]];
//       var indexValue = displayColumns[displayproperties.indexOf(index)];
//       if (indexValue == getLanguageCode('Fleet Address') || indexValue == getLanguageCode('Resource Address') || indexValue == getLanguageCode('Address')) {
//         concatOp = ', ';
//       } else if (indexValue == getLanguageCode('Resource Name') || indexValue == getLanguageCode('User Name')) {
//         concatOp = ' ';
//         // } else if (indexValue == getLanguageCode('Work #') || indexValue == 'వర్క్ నంబర్' ||
//         //   indexValue == 'वर्क नम्बर्' || indexValue == 'Trabajo #' && getAllUrlParams().fp == 'true') {
//       } else if (indexValue == getLanguageCode('Work #') && getAllUrlParams().fp == 'true') {
//         var valuearr = value.split('-');
//         if (valuearr.length == 2) {
//           value = valuearr[0].trim();
//         }
//         var concatOp = '-';
//         // } else if (indexValue == getLanguageCode('Mobile #') || indexValue == 'వర్క్ నంబర్' ||
//         //   indexValue == 'वर्क नम्बर्' || indexValue == 'móvil #') {
//       } else if (indexValue == getLanguageCode('Mobile #')) {
//         var valuearr = value.split('-');
//         if (valuearr.length == 2) {
//           value = valuearr[0].trim();
//         }
//         var concatOp = '-';
//       }
//       if (!oldValue) {
//         otherproperties[displayColumns[displayproperties.indexOf(index)]] = value;
//       } else if (oldValue && value && value != 'null' && concatOp) {
//         otherproperties[displayColumns[displayproperties.indexOf(index)]] = otherproperties[displayColumns[displayproperties.indexOf(index)]] + concatOp + value;
//       }
//       // }
//     } else if (typeof (value) == 'object' && value != null && displayproperties.indexOf(index) <= -1) {
//       updateOtherProperties(value, displayproperties, otherproperties, displayColumns);
//     }
//   });
// }
// function navpath(thisGeoArea) {
//   initializeRouter(thisGeoArea.map, thisGeoArea.gaFloorPathUrls[flShow]);
//   try {
//     var startLat = ordinates.lat;
//     var startLon = ordinates.lng;
//   } catch (err) {
//     var startLat = localStorage.getItem('lat');
//     var startLon = localStorage.getItem('lon');
//   }
//   if (localStorage.getItem('currentpostion')) {
//     var currentpostion = JSON.parse(localStorage.getItem('currentpostion'));
//     var gpsLat = currentpostion.latitude;
//     var gpsLon = currentpostion.longitude;
//     var currentFloorName = window.localStorage.getItem('fcurrentfloorname');
//     map.closePopup(infopopup);
//     setTimeout(function () {
//       showIndoorRoute(gpsLat, gpsLon, startLat,
//         startLon, false, thisGeoArea.gaShowFloorPathNetwork);
//     }, 3000);
//   } else {
//     var currentFloorName = window.localStorage.getItem('fcurrentfloorname');
//     var floorEntryCoordinates = entrycordinates[currentFloorName];
//     map.closePopup(infopopup);
//     setTimeout(function () {
//       showIndoorRoute(floorEntryCoordinates[0], floorEntryCoordinates[1], startLat,
//         startLon, false, thisGeoArea.gaShowFloorPathNetwork);
//     }, 3000);
//   }
// }
// check in action for fleets, fleetsreservations, events, eventsregistrations
function checkedin(id, page) {
  if (this.feature.reservation_status.lookup_name === 'RESERVED' && this.feature.event.event_id == '') {
    window.localStorage.setItem('facilityreservationid', this.feature._id);
    window.localStorage.setItem('page_name', 'facilityreservationcheckin');
  } else {
    window.localStorage.setItem('eventreservationid', this.feature.event.event_id);
    window.localStorage.setItem('page_name', 'eventscheckin');
  }
  showSpinner();
}
function sendreq(id, page) {
  window.localStorage.setItem('eventreservationid', this.feature.event.event_id);
  window.localStorage.setItem('page_name', 'send_request');
  showSpinner();
}
function locate(id, page) {
  window.localStorage.setItem('toasset', JSON.stringify(this.feature));
  this.navpath()
}
function invitemembers(id, page) {
  window.localStorage.setItem('eventreservationid', this.feature.event.event_id);
  window.localStorage.setItem('page_name', 'event_invite_members');
  showSpinner();
}
// To click on checkedout button
function checkedout(id, page) {
  if (this.feature.reservation_status.lookup_name === 'CHECKED_IN' && this.feature.event.event_id == '') {
    window.localStorage.setItem('page_name', 'facilityreservationcheckout');
    window.localStorage.setItem('facilityreservationid', this.feature._id);
  } else {
    window.localStorage.setItem('page_name', 'eventcheckout');
    window.localStorage.setItem('eventreservationid', this.feature.event.event_id);
  }
  showSpinner();
}
// extend acton for both events and fleet reservation
function extendevent(id, page) {
  if (this.feature.reservation_status.lookup_name === 'CHECKED_IN' && this.feature.event.event_id == '') {
    window.localStorage.setItem('page_name', 'facilityreservationextend');
    window.localStorage.setItem('fleetreservationid', this.feature._id);
  } else {
    window.localStorage.setItem('page_name', 'eventextend');
    window.localStorage.setItem('eventreservationid', this.feature.event.event_id);
  }
  showSpinner();
}
// To click on message button
function message(id, page) {
  window.localStorage.setItem('page_name', 'messages');
  window.localStorage.setItem('userInfo', JSON.stringify(this.feature.reserved_by));
  showSpinner();
}
function call(id, page) {
  window.localStorage.setItem('page_name', 'call');
  window.localStorage.setItem('userInfo', JSON.stringify(this.feature.reserved_by));
  showSpinner();
}
// To click on cancel button
function cancel(id, page) {
  if (this.feature.reservation_status.lookup_name === 'RESERVED' && this.feature.event.event_id == '') {
    window.localStorage.setItem('page_name', 'facilityreservationcancel');
    window.localStorage.setItem('facilityreservationid', this.feature._id);
  } else {
    window.localStorage.setItem('page_name', 'eventcancel');
    window.localStorage.setItem('eventreservationid', this.feature.event.event_id);
  }
  showSpinner();
}
function updateReservation(id, page) {
  if (this.feature.reservation_status.lookup_name === 'RESERVED' && this.feature.event.event_id == '') {
    window.localStorage.setItem('page_name', 'facilityreservationupdate');
    window.localStorage.setItem('facilityreservationid', this.feature._id);
    window.localStorage.setItem('facilityinfo', JSON.stringify(this.feature));
  } else {
    var eventvalue = 'eventsCreate';
    window.localStorage.setItem('page_name', 'eventupdate');
    window.localStorage.setItem('facilityreservationid', this.feature._id);
    window.localStorage.setItem('facilityinfo', JSON.stringify(this.feature));
  }
  showSpinner();
}
// To click on reservefleet button
function reserveFleet(id, page) {
  if (this.feature.settings.is_events_enabled === false) {
    window.localStorage.setItem('page_name', 'facilityreservationcreate');
    window.localStorage.setItem('facilityreservationid', this.feature._id);
    window.localStorage.setItem('facilityinfo', JSON.stringify(this.feature));
  } else {
    var eventvalue = 'eventsCreate';
    window.localStorage.setItem('page_name', 'eventcreate');
    window.localStorage.setItem('facilityreservationid', this.feature._id);
    window.localStorage.setItem('facilityinfo', JSON.stringify(this.feature));
  }
  showSpinner();
}
function updateToken(callBack) {
  $.ajax({
    url: localStorage.getItem('apiendpoint') + '/api/v1/mobile/tokenupdate',
    type: 'GET',
    headers: {
      "token": window.localStorage.getItem('token')
    },
    error: function (err) { },
    success: function (data) {
      callBack(data);
    }
  });
}
function loginUserDateConversion(dateTime) {
  if (dateTime && dateTime != '') {
    // const loginUserTimezoneObj = JSON.parse(localStorage.getItem('loginUsertimeZoneObj'));
    // this.defaultTimeZone = loginUserTimezoneObj.lookup_name;
    // const defaulttimezoneCode = loginUserTimezoneObj.description;
    // const timezonevalue = defaulttimezoneCode.split('(UTC');
    // const utcval = timezonevalue[1].split(')');
    // this.utcTimeZoneString = utcval[0].toString();
    // const loginUserDateFormatObj = JSON.parse(localStorage.getItem('loginUserDateFormateObj'));
    // this.loginUserDateFormat = loginUserDateFormatObj.lookup_name + ' ' + 'HH:mm:ss';
    var loginUsersTimezone = JSON.parse(localStorage.getItem('loginUsertimeZoneObj'));
    const loginUserDateFormatObj = JSON.parse(localStorage.getItem('loginUserDateFormateObj'));
    this.loginUserDateFormat = loginUserDateFormatObj.lookup_name + ' ' + 'HH:mm:ss';
    var timezonevalue = loginUsersTimezone.description.split('(UTC');
    // var utcformat = timezonevalue[0].split('-');
    // var timezoneCodes = utcformat[0].trim();
    var utcval = timezonevalue[1].split(')');
    var utctimezone = utcval[0];
    var utctimezonestring = utcval[0].toString();
    if (utctimezonestring.charAt(0) === '+') {
      var utctime = utctimezone.split('+');
      var utctimesplit = utctime[1].split(':');
      dateTime = moment(dateTime).utc().add(utctimesplit[0], 'hours');
      dateTime = moment(dateTime).add(utctimesplit[1], 'minutes');
    } else {
      var utctime = utctimezone.split('-');
      var utctimesplit = utctime[1].split(':');
      dateTime = moment(dateTime).utc().subtract(utctimesplit[0], 'hours');
      dateTime = moment(dateTime).subtract(utctimesplit[1], 'minutes');
    }
    dateTime = moment(dateTime).format(loginUserDateFormat);
    return dateTime;
  } else {
    return '';
  }
}
function updateOrder(JSONObject, dispColOdr) {
  var page = getAllUrlParams().pn;
  var floorPlan = getAllUrlParams().fp;
  var returnJSON = {};
  $.each(dispColOdr, function (index, value) {
    if (!returnJSON[value]) {
      returnJSON[value] = JSONObject[value];
      delete JSONObject[value];
    }
  });
  $.each(JSONObject, function (index, value) {
    returnJSON[index] = value;
  });
  return returnJSON;
}
function showSpinner() {
  parent.window.dispatchEvent(new Event('custom-event'));
  document.getElementById('mapid').style.display = 'block';
  document.getElementById('mapspinnerbackgroundId').style.display = 'block';
  document.getElementById('mapspinnerId').style.display = 'block';
  setTimeout(function () {
    document.getElementById('mapspinnerbackgroundId').style.display = 'none';
    document.getElementById('mapspinnerId').style.display = 'none';
  }, 1000);
}
function navpath() {
  initializeRouter(thisGeoArea.map, thisGeoArea.gaFloorPathUrls[flShow]);
  showSpinner();
  /** Live navigation code changes starts - Ramohan - 181106 */
  // if (typeof liveNavigationControl !== 'undefined') map.addControl(liveNavigationControl);
  /** Live navigation code changes ends - Ramohan - 181106 */
  map.closePopup(infopopup);
  clearMultiFloorPopups();
  thisGeoArea.enabledspecial = false;
  var toasset = JSON.parse(localStorage.getItem('toasset'));
  try {
    var toLat = toasset.geometry ? toasset.geometry.coordinates[1] : '';
    var toLon = toasset.geometry ? toasset.geometry.coordinates[0] : '';
  } catch (err) {
    var toLat = toasset ? toasset.geometry.coordinates[1] : '';
    var toLon = toasset ? toasset.geometry.coordinates[0] : '';
  }
  if (localStorage.getItem('currentpostion')) {
    var currentpostion = JSON.parse(localStorage.getItem('currentpostion'));
    var startLat = currentpostion.latitude;
    var startLon = currentpostion.longitude;
    window.localStorage.setItem('navigate', 'true');
    var timestamp = Date.now();
    var fromasset = JSON.parse(localStorage.getItem('fromasset'));
    var toasset = JSON.parse(localStorage.getItem('toasset'));
    /** Changes on 190114  */
    if (localStorage.getItem('fromasset') != undefined) {
      if (getAllUrlParams().pn == 'publicevents') {
        multiFloorNav.toFloorId = localStorage.getItem('fcurrentfloorname');
        var currentFloorName = window.localStorage.getItem('fcurrentfloorname');
        multiFloorNav.fromFloorId = currentFloorName;
        if (localStorage.getItem('fromasset') != undefined) {
          var fromasset = JSON.parse(localStorage.getItem('fromasset'));
          var startLat = fromasset.geometry.coordinates[1];
          var startLon = fromasset.geometry.coordinates[0];
        } else {
          var startLat = eventFromLatLng;
          var startLon = eventFromLatLon;
        }
        setTimeout(function () {
          showIndoorRoute(startLat, startLon, toLat, toLon, false, thisGeoArea.gaShowFloorPathNetwork);
        }, 2000);
      } else if (fromasset.properties.level === toasset.properties.level) {
        setTimeout(function () {
          showIndoorRoute(fromasset.geometry.coordinates[1], fromasset.geometry.coordinates[0], toasset.geometry.coordinates[1], toasset.geometry.coordinates[0], false, thisGeoArea.gaShowFloorPathNetwork)
        }, 2000);
      } else {
        multiFloorNav.fromLatLng = [fromasset.geometry.coordinates[1], fromasset.geometry.coordinates[0]];
        multiFloorNav.fromBuildingName = thisGeoArea.gaName;
        multiFloorNav.toBuildingName = thisGeoArea.gaName;
        multiFloorNav.fromFloorId = fromasset.properties.level;
        multiFloorNav.toFloorId = toasset.properties.level;
        multiFloorNav.toLatLng = [toasset.geometry.coordinates[1], toasset.geometry.coordinates[0]];
        setTimeout(function () {
          doMultiFloorNavigation(thisGeoArea);
        }, 2000);
      }
      // timeoutFunction(timestamp, startLat, startLon, toLat, toLon); 190110
    } else {
      multiFloorNav.toFloorId = localStorage.getItem('fcurrentfloorname');
      var currentFloorName = window.localStorage.getItem('fcurrentfloorname');
      multiFloorNav.fromFloorId = currentFloorName;
      if (localStorage.getItem('fromasset') != undefined) {
        var fromasset = JSON.parse(localStorage.getItem('fromasset'));
        var startLat = fromasset.geometry.coordinates[1];
        var startLon = fromasset.geometry.coordinates[0];
      } else {
        // var startLat = eventFromLatLng;
        // var startLon = eventFromLatLon;
        var currentFloorName = window.localStorage.getItem('fcurrentfloorname');
        var startLat = startLat ? startLat : entrycordinates[currentFloorName][0];
        var startLon = startLon ? startLon : entrycordinates[currentFloorName][1];
        localStorage.removeItem('currentpostion');
        localStorage.removeItem('toasset');
      }
      setTimeout(function () {
        showIndoorRoute(startLat, startLon, toLat, toLon, false, thisGeoArea.gaShowFloorPathNetwork);
      }, 2000);
    }
  } else {
    var fromasset = JSON.parse(localStorage.getItem('fromasset'));
    var toasset = JSON.parse(localStorage.getItem('toasset'));
    /** Changes on 190114  */
    if (getAllUrlParams().pn == 'publicevents') {
      multiFloorNav.toFloorId = localStorage.getItem('fcurrentfloorname');
      var currentFloorName = window.localStorage.getItem('fcurrentfloorname');
      multiFloorNav.fromFloorId = currentFloorName;
      if (localStorage.getItem('fromasset') != undefined) {
        var fromasset = JSON.parse(localStorage.getItem('fromasset'));
        var startLat = fromasset.geometry.coordinates[1];
        var startLon = fromasset.geometry.coordinates[0];
      } else {
        var startLat = eventFromLatLng;
        var startLon = eventFromLatLon;
      }
      setTimeout(function () {
        showIndoorRoute(startLat, startLon, toLat, toLon, false, thisGeoArea.gaShowFloorPathNetwork);
      }, 2000);
    } else if (localStorage.getItem('fromasset') != undefined) {
      if (fromasset?.properties?.level === toasset?.properties?.level) { // startLat, 
        setTimeout(function () {
          showIndoorRoute(fromasset.geometry.coordinates[1], fromasset.geometry.coordinates[0], toasset.geometry.coordinates[1], toasset.geometry.coordinates[0], false, thisGeoArea.gaShowFloorPathNetwork)
        }, 2000);
      } else if (fromasset?.bookmark_name) {
        setTimeout(function () {
          showIndoorRoute(toasset.geometry.coordinates[1], toasset.geometry.coordinates[0], fromasset.geometry.coordinates[1], fromasset.geometry.coordinates[0], false, thisGeoArea.gaShowFloorPathNetwork)
        }, 2000);
      } else {
        multiFloorNav.fromLatLng = [fromasset.geometry.coordinates[1], fromasset.geometry.coordinates[0]];
        multiFloorNav.fromBuildingName = thisGeoArea.gaName;
        multiFloorNav.toBuildingName = thisGeoArea.gaName;
        multiFloorNav.fromFloorId = fromasset.properties.level;
        multiFloorNav.toFloorId = toasset?.properties?.level;
        multiFloorNav.toLatLng = [toasset?.geometry?.coordinates[1], toasset?.geometry?.coordinates[0]];
        setTimeout(function () {
          doMultiFloorNavigation(thisGeoArea);
        }, 2000);
      }
    } else {
      multiFloorNav.toFloorId = localStorage.getItem('fcurrentfloorname');
      var currentFloorName = window.localStorage.getItem('fcurrentfloorname');
      multiFloorNav.fromFloorId = currentFloorName;
      if (localStorage.getItem('fromasset') != undefined) {
        var fromasset = JSON.parse(localStorage.getItem('fromasset'));
        var startLat = fromasset.geometry.coordinates[1];
        var startLon = fromasset.geometry.coordinates[0];
      } else {
        // var startLat = eventFromLatLng;
        // var startLon = eventFromLatLon;
        var currentFloorName = window.localStorage.getItem('fcurrentfloorname');
        var startLat = entrycordinates[currentFloorName][0];
        var startLon = entrycordinates[currentFloorName][1];
      }
      setTimeout(function () {
        showIndoorRoute(startLat, startLon, toLat, toLon, false, thisGeoArea.gaShowFloorPathNetwork);
      }, 2000);
    }
  }
  nearestFleets(toLat, toLon);
  /** Changes on 190114  */
}
// enable nearest fleets navigation
function nearestFleets(startLat, startLon) {
  if (localStorage.getItem('currentpostion')) {
    var currentpostion = JSON.parse(localStorage.getItem('currentpostion'));
    var entryLan = currentpostion.latitude;
    var entryLon = currentpostion.longitude;
  } else {
    var fromasset = JSON.parse(localStorage.getItem('fromasset'));
    if (localStorage.getItem('fromasset') != undefined) {
      var entryLan = fromasset.geometry.coordinates[1];
      var entryLon = fromasset.geometry.coordinates[0];
    } else {
      var entryLan = eventFromLatLng;
      var entryLon = eventFromLatLon;
    }
  }
  localStorage.setItem('pathCoordinateslat', startLat); // 181024 to get current latlang
  localStorage.setItem('pathCoordinateslng', startLon); // 181024 to get current latlang
  var radiusMeters = localStorage.getItem('radiusMeters')
  var showFleets = localStorage.getItem('showFleets');
  var resObj = [];
  var resultObj = [];
  // var bounds = L.latLng(startLat, startLon).toBounds(radiusMeters);
  if (startLat !== null && startLon !== null && startLat !== 'null' && startLon !== 'null') {
    var bounds = L.latLng(startLat, startLon).toBounds(radiusMeters);
  }
  var liveBounds = L.latLng(entryLan, entryLon).toBounds(radiusMeters);
  thisGeoArea.eachLayer(function (layer) {
    try {
      layer.getLayers().forEach(function (mk) {
        mk.setOpacity(0);
        if (bounds.contains(mk._latlng) == true) {
          var distance = getDistanceFromLatLonInKm(startLat, startLon, mk._latlng.lat, mk._latlng.lng);
          mk._distancekm = distance;
          resObj.push(mk);
          resObj.sort(function (x, y) {
            if (x._distancekm === y._distancekm) {
              return 0;
            }
            if (x._distancekm > y._distancekm) {
              return 1;
            }
            return -1;
          });
        }
        if (liveBounds.contains(mk._latlng) == true) {
          var distance = getDistanceFromLatLonInKm(entryLan, entryLon, mk._latlng.lat, mk._latlng.lng);
          mk._distancekm1 = distance;
          resultObj.push(mk);
          resultObj.sort(function (x, y) {
            if (x._distancekm1 === y._distancekm1) {
              return 0;
            }
            if (x._distancekm1 > y._distancekm1) {
              return 1;
            }
            return -1;
          });
        }
      })
    } catch (err) {
    }
  });
  resObj = resObj.slice(0, showFleets)
  for (var i = 0; i < resObj.length; i++) {
    localStorage.setItem('fromNavPath', 'fromNavPath');
    resObj[i].setOpacity(1);
  }
  resultObj = resultObj.slice(0, showFleets)
  for (var j = 0; j < resultObj.length; j++) {
    localStorage.setItem('fromNavPath', 'fromNavPath');
    resultObj[j].setOpacity(1);
  }
}
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var radius = localStorage.getItem('radiusMeters')
  var R = radius / 1000;; // Radius circle in km
  var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
  var dLon = this.deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  var dis = d * 1000;
  // document.getElementById("demo").innerHTML=dis;
  return dis;
}
function deg2rad(deg) {
  return deg * (Math.PI / 180)
}
function timeoutFunction(timestamp, startLat, startLon, toLat, toLon) {
  multiFloorNav.toFloorId = localStorage.getItem('fcurrentfloorname');
  if (localStorage.getItem('fromfloor')) {
    if (currentFloor) {
      multiFloorNav.toFloorId = currentFloor;
    }
    multiFloorNav.fromFloorId = localStorage.getItem('fromfloor');
    var currentpostion = JSON.parse(localStorage.getItem('currentpostion'));
    startLat = currentpostion.latitude;
    startLon = currentpostion.longitude;
    if (multiFloorNav.fromFloorId === multiFloorNav.toFloorId) {
      showIndoorRoute(startLat, startLon, toLat, toLon, false, thisGeoArea.gaShowFloorPathNetwork);
    } else {
      multiFloorNav.fromLatLng = [startLat, startLon];
      multiFloorNav.fromBuildingName = thisGeoArea.gaName;
      multiFloorNav.toBuildingName = thisGeoArea.gaName;
      multiFloorNav.toLatLng = [toLat, toLon];
      doMultiFloorNavigation(thisGeoArea);
    }
    localStorage.removeItem('fromfloor');
  } else if (timestamp + 4000 > Date.now()) {
    setTimeout(function () {
      timeoutFunction(timestamp, startLat, startLon, toLat, toLon);
    }, 500);
  } else {
    var uagent = navigator.userAgent.toLowerCase();
    // alert(uagent); tablet, phablet
    if (uagent.search("iphone") > -1 || uagent.search("ipad") > -1 || uagent.search("android") > -1 || uagent.search("tablet") > -1 || uagent.search("phablet") > -1) {
      //alert('true');
      // if (typeof googleNavigationControl !== 'undefined') map.addControl(googleNavigationControl);
    }
    if (localStorage.getItem('fromlocation') == 'true') {
      var fromasset = JSON.parse(localStorage.getItem('fromasset'));
      var toasset = JSON.parse(localStorage.getItem('toasset'));
      if (fromasset.properties.level === toasset.properties.level) { // startLat, startLon, toLat, toLon
        // if (localStorage.getItem('currentpostion')) {
        //   showIndoorRoute(startLat, startLon, toasset.geometry.coordinates[1], toasset.geometry.coordinates[0], false, thisGeoArea.gaShowFloorPathNetwork);
        // } else {
        showIndoorRoute(fromasset.geometry.coordinates[1], fromasset.geometry.coordinates[0], toasset.geometry.coordinates[1], toasset.geometry.coordinates[0], false, thisGeoArea.gaShowFloorPathNetwork);
        // }
      } else {
        multiFloorNav.fromLatLng = [fromasset.geometry.coordinates[1], fromasset.geometry.coordinates[0]];
        multiFloorNav.fromBuildingName = thisGeoArea.gaName;
        multiFloorNav.toBuildingName = thisGeoArea.gaName;
        multiFloorNav.fromFloorId = fromasset.properties.level;
        multiFloorNav.toFloorId = toasset.properties.level;
        multiFloorNav.toLatLng = [toasset.geometry.coordinates[1], toasset.geometry.coordinates[0]];
        doMultiFloorNavigation(thisGeoArea);
      }
      localStorage.removeItem('fromlocation');
      localStorage.removeItem('toasset');
      localStorage.removeItem('fromasset');
    } else {
      var currentFloorName = window.localStorage.getItem('fcurrentfloorname');
      multiFloorNav.fromFloorId = currentFloorName;
      if (localStorage.getItem('currentpostion')) {
        showIndoorRoute(startLat, startLon, toLat, toLon, false, thisGeoArea.gaShowFloorPathNetwork);
      } else {
        var startLat = entrycordinates[currentFloorName][0];
        var startLon = entrycordinates[currentFloorName][1];
        showIndoorRoute(startLat, startLon, toLat, toLon, false, thisGeoArea.gaShowFloorPathNetwork);
      }
    }
    localStorage.removeItem('fromfloor');
    //  outDoordrawLineOnMap(startLat, startLon);
  }
}
function kioskFromToAssets() {
  window.localStorage.setItem('kioskFromToAssets', 'kioskFromToAssets')
  initializeRouter(thisGeoArea.map, thisGeoArea.gaFloorPathUrls[flShow]);
  var currentFloorName = window.localStorage.getItem('fcurrentfloorname');
  multiFloorNav.fromFloorId = currentFloorName;
  multiFloorNav.toFloorId = localStorage.getItem('fcurrentfloorname');
  // if (localStorage.getItem('fromlocation') == 'true') {
  var fromasset = JSON.parse(localStorage.getItem('fromasset'));
  var toasset = JSON.parse(localStorage.getItem('toasset'));
  if (fromasset.properties.level === toasset.properties.level) { // startLat, startLon, toLat, toLon
    setTimeout(function () {
      showIndoorRoute(fromasset.geometry.coordinates[1], fromasset.geometry.coordinates[0], toasset.geometry.coordinates[1], toasset.geometry.coordinates[0], false, thisGeoArea.gaShowFloorPathNetwork)
    }
      , 2000);
  } else {
    multiFloorNav.fromLatLng = [fromasset.geometry.coordinates[1], fromasset.geometry.coordinates[0]];
    multiFloorNav.fromBuildingName = thisGeoArea.gaName;
    multiFloorNav.toBuildingName = thisGeoArea.gaName;
    multiFloorNav.fromFloorId = fromasset.properties.level;
    multiFloorNav.toFloorId = toasset.properties.level;
    multiFloorNav.toLatLng = [toasset.geometry.coordinates[1], toasset.geometry.coordinates[0]];
    setTimeout(function () {
      doMultiFloorNavigation(thisGeoArea)
    }
      , 2000);
  }
  localStorage.removeItem('fromlocation');
  localStorage.removeItem('toasset');
  localStorage.removeItem('fromasset');
  // }
}
function outDoordrawLineOnMap(endLat, endLon) {
  var currentpostion = JSON.parse(localStorage.getItem('currentpostion'));
  var startLat1 = currentpostion.latitude;
  var startLon1 = currentpostion.longitude;
  L.Routing.control({
    waypoints: [
      L.latLng(startLat1, startLon1),
      L.latLng(endLat, endLon)
    ],
    routeWhileDragging: true,
    show: true,
    autoRoute: true,
  }).addTo(map);
}
function viewfile(fileSrc, filename, location, content) {
  feature = ordinates;
  var src = fileSrc;
  var visualFilename = filename;
  var value1 = visualFilename.split('.');
  visualFilename = value1[0];
  if (getAllUrlParams().api != 'local') {
    var fileSrc = localStorage.getItem('apiendpoint') + '/' + fileSrc;
  }
  $.ajax({
    url: fileSrc,
    type: 'HEAD',
    headers: {
      "token": window.localStorage.getItem('token')
    },
    error: function () {
      fileSrc = localStorage.getItem('apiendpoint') + '/' + fileSrc;
    },
    success: function () { }
  });
  //  var fileSrc = localStorage.getItem('apiendpoint') + '/' + fileSrc;
  var imgRex = new RegExp('(.*?)\.(jpg|bmp|jpeg|png)$');
  var audioRex = new RegExp('(.*?)\.(flac|wav|mp3)$');
  var videoRex = new RegExp('(.*?)\.(webm|mp4|ogg)$');
  var urlRegex = /^https?\:\/\/(www\.)?google\.[a-z]+\/maps\b/;
  if (imgRex.test(fileSrc)) {
    // window.open();
    document.getElementById('fileImageId').style.display = 'block';
    document.getElementById('fileImageId').src = fileSrc;
    document.getElementById('fileAudioId').style.display = 'none';
    document.getElementById('fileVideoId').style.display = 'none';
    document.getElementById('fileOtherId').style.display = 'none';
  } else if (audioRex.test(fileSrc)) {
    document.getElementById('fileImageId').style.display = 'none';
    document.getElementById('fileAudioId').style.display = 'block';
    document.getElementById('fileAudioId').src = fileSrc;
    document.getElementById('fileVideoId').style.display = 'none';
    // document.getElementById('fileOtherId').style.display = 'none';
  } else if (videoRex.test(fileSrc)) {
    document.getElementById('fileImageId').style.display = 'none';
    document.getElementById('fileAudioId').style.display = 'none';
    document.getElementById('fileVideoId').style.display = 'none';
    document.getElementById('fileVideoId').src = fileSrc;
  } else if (urlRegex.test(src)) {
    document.getElementById('fileImageId').style.display = 'none';
    document.getElementById('fileAudioId').style.display = 'none';
    document.getElementById('fileVideoId').style.display = 'none';
    window.localStorage.setItem('fleetLocate', 'fleetLocate');
    window.localStorage.setItem('fleet360AngleImage', src);
    var container = L.DomUtil.create('div', 'leaflet-control-locate leaflet-bar leaflet-control');
    container.icon = '';
    container.style.backgroundColor = 'white';
    window.localStorage.setItem('panorama', 'panorama');
    parent.window.dispatchEvent(new Event('custom-event'));
    return container;
  } else {
    document.getElementById('fileImageId').style.display = 'none';
    document.getElementById('fileAudioId').style.display = 'none';
    document.getElementById('fileVideoId').style.display = 'none';
    // document.getElementById('fileOtherId').style.display = 'block';
  }
  popupLocation = ordinates;
  var Content = '<iframe width="290" height="215" src= "' + fileSrc + '" frameborder="0" allowfullscreen></iframe>';
  var popup = L.popup({
    maxHeight: 100,
    maxWidth: 100
  });
  var videopopup = popup.setLatLng(popupLocation).setContent(Content);
  var markerGroup = L.featureGroup([videopopup]).addTo(map);
  markerGroup.eachLayer(function (layer) {
    layer.openPopup();
  });
  L.Map = L.Map.extend({
    openPopup: function (popup) {
      this._popup = popup;
      return this.addLayer(popup).fire('popupopen', {
        popup: this._popup
      });
    }
  });
  document.getElementById('filePopupId').style.display = 'block';
}
function groupLocateMultifloorNavigation(floorEntryCoordinates, specialfleets) {
  doMultiFloorNavigation(thisGeoArea);
  var arrCommonStairs1 = findCommonStairsBetweenFloors(thisGeoArea, multiFloorNav.fromFloorId, multiFloorNav.toFloorId)
  if (arrCommonStairs1.length > 0) {
    var neareststairs = window.getNearestPOI(multiFloorNav.fromLatLng, arrCommonStairs1);
    window.localStorage.setItem('neareststairs', JSON.stringify(neareststairs));
  }
  showIndoorShortestMultiplePOIRoute(
    floorEntryCoordinates[0], floorEntryCoordinates[1],
    specialfleets,
    false,
    thisGeoArea.gaShowFloorPathNetwork
  );
}
function getLanguageCode(displayName) {
  var d2MSettingsData = JSON.parse(localStorage.getItem('d2MSettingsData'));
  var index = '';
  if (d2MSettingsData && d2MSettingsData.length > 0) {
    for (var i = 0; i < d2MSettingsData.length; i++) {
      if (langcode === 'en') {
        index = displayName;
      } else {
        if (d2MSettingsData[i].labelToShowInMap === displayName) {
          if (!d2MSettingsData[i].name || d2MSettingsData[i].name[langcode] === undefined ||
            d2MSettingsData[i].name[langcode] === null ||
            d2MSettingsData[i].name[langcode] === '') {
            index = d2MSettingsData[i].labelToShowInMap;
          } else {
            index = d2MSettingsData[i].name[langcode];
            break;
          }
        }
      }
    }
  }
  return index;
}
function displayBottomSheet(e) {
  assetDetails = e.feature;
  details = e;
  assetLatLng = e.latlng;
  var temp = document.getElementById('assetDetails');
  var assetImg = document.getElementById('assetImg');
  var assetDesc = document.getElementById('assetDesc');
  var button = document.getElementById('navButton');
  var viewButton = document.getElementById('viewButton');
  temp.innerHTML = '';
  assetImg.innerHTML = '';
  assetDesc.innerHTML = '';
  button.innerHTML = '';
  viewButton.innerHTML = '';
  var listContent = '';
  var buttonContent = '';
  var viewButtonContent = '';
  var imgContent = '';
  var descContent = '';
  if (assetDetails.properties.levelDisplay) {
    if (assetDetails.properties.facilityImageFilePath && assetDetails.properties.facilityImageFileName) {
      if (assetDetails.imageUrlAfterTransformation) {
        const netWorkStatus = localStorage.getItem('networkStatus');
        const isNetworkAvailable = (netWorkStatus === 'Online') ? true : false;
        const urlSplitArray = assetDetails.imageUrlAfterTransformation.split('http://');
        const imageUrlAfterTransformation = (!isNetworkAvailable && urlSplitArray.length === 1) ? '../../../' + assetDetails.imageUrlAfterTransformation : assetDetails.imageUrlAfterTransformation;
        imgContent += '<img onclick="getAssetDetails();" onerror="this.onerror=null;this.src=\'' + localStorage.getItem('enterpriseImage') +
          '\'" src="' + imageUrlAfterTransformation + '" height="60"  style="display: inline-block"/>';
      } else {
        imgContent += '<img onclick="getAssetDetails();" onerror="this.onerror=null;this.src=\'' + localStorage.getItem('enterpriseImage') +
          '\'" src="' + localStorage.getItem('s3bucket_url') + assetDetails.properties.facilityImageFilePath + '/' + assetDetails.properties.facilityImageFileName + '" height="60"  style="display: inline-block"/>';
      }
    } else {
      imgContent += '<span onclick="getAssetDetails();" class= "' + assetDetails.properties.iconName + '" style="height:60px;font-size: 3.5em;background: ' + assetDetails.properties.FacilityTypeBackgroundColor + ';position: relative;display:flex;align-items:center;justify-content:center;padding:0px"></span>'
    }
  } else {
    imgContent += '<img onclick="getAssetDetails();" onerror="this.onerror=null;this.src=\'' + localStorage.getItem('enterpriseImage') +
      '\'" src="' + peopleIconName + '" height="60"  style="display: inline-block"/>';
  }
  descContent += '<p onclick="getAssetDetails();" style="font-size: 13px;cursor:pointer;font-weight:700;color:#134021;overflow: hidden !important;text-overflow: ellipsis !important;display: -webkit-box !important;-webkit-box-orient: vertical !important;-webkit-line-clamp: 2 !important;white-space: normal;line-height: 1.3;margin-bottom: 0px !important;max-height: 3.75rem;color:' + appColor + ';">' + assetDetails.properties.facilityName + '</p>';
  /* Added Condition for Fossil Rim Client Requirement : Do not display the asset rating and level - 210603 */
  // SRINIVAS  - 210823  Commented rating code
  // listContent += '<div style="padding-left: 5px;text-align: left;">'
  // for (var i = 1; i <= 5; i++) {
  //   if (i <= avgRating) {
  //     listContent += '<span onclick="getAssetDetails();" class="fa fa-star checked" style="display: inline-block"></span>'
  //   } else {
  //     listContent += '<span onclick="getAssetDetails();" class="fa fa-star" style="display: inline-block"></span>'
  //   }     
  // }
  // listContent += '</div>'
  // if (assetDetails.properties.levelDisplay) {
  //   listContent += '<p onclick="getAssetDetails();" class="mapfleetdetails" style="padding-left: 5px;vertical-align: top;font-size: 13px;text-align: left;">' + assetDetails.properties.levelDisplay + '</p>';
  // } else {
  //   listContent += '<p onclick="getAssetDetails();" class="mapfleetdetails" style="padding-left: 5px;vertical-align: top;font-size: 13px;text-align: left;">' + assetDetails.properties.level + '</p>';
  // }
  if (assetDetails.properties.level) {
    viewButtonContent += '<button class="btn map-btn"  id="viewBtn" style="cursor:pointer;display: flex;align-items: center;justify-content: center;font-size: 14.7px;font-weight: 500;background-color:' + appColor + ';color:' + Button_txt + ';" type="button" onclick="getAssetDetails();">' + mapNamesObj.view + '</button>'
  }
  temp.innerHTML = listContent;
  assetImg.innerHTML = imgContent;
  assetDesc.innerHTML = descContent;
  button.innerHTML = buttonContent;
  viewButton.innerHTML = viewButtonContent;
  var bottomBox = $("#bottomSheet");
  if (!enabledinfopopup) {
    bottomBox.show();
    /* Added to show location popup */
    addlocationclasses();
    // document.getElementById('mapid').style.height = '91vh';
    // Added to map dynamic height when bottom sheet show and hide conditions
    // document.getElementById('mapid').classList.add("mapheight");
    document.getElementById('bottomSheet').classList.add(mapNamesObj.view_popup_class);
  }
}
/*
function updateOrder(JSONObject) {
  var page = getAllUrlParams().pn;
  var floorPlan = getAllUrlParams().fp;
  var returnJSON = {};
  dispColOdr = [];
  B1 = ['Designation', 'Department', 'Mobile #', 'Email', 'Permanent Address'];
  B2 = ['Fleet Address', 'Fleet Type'];
  B3 = ['Event Name', 'Event Owner', 'Start Datetime', 'End Datetime', 'Duration', 'Event Status'];
  if (page === 'fleets') {
    if(this.feature.fleetReservationId){
      dispColOdr = B2.concat(fleetTypeAttr).concat(B3).concat(B1);
    } else{
    //	dispColOdr = B2;
    }
  } else if (page === 'fleetreservations' || page === 'eventregistrations' || page === 'events') {
    dispColOdr = B1.concat(B2).concat(fleetTypeAttr).concat(B3);
  } else if (page === 'people' || page === 'callhistory' || page === 'messagehistory') {
    if (floorPlan === 'false') {
      dispColOdr = B1;
    } else {
      dispColOdr = B1.concat(B2).concat(fleetTypeAttr).concat(B3);
    }
  }
  $.each(dispColOdr, function (index, value) {
    returnJSON[value] = JSONObject[value];
    delete JSONObject[value];
  });
  $.each(JSONObject, function (index, value) {
    returnJSON[index] = value;
  });
  return returnJSON;
}*/
// el = document.querySelector('#direction-icon');
// mapdiv = document.getElementById("mapid")

// mapdiv.ondragover = function (e) {
//   e.preventDefault()
//   e.dataTransfer.dropEffect = "move"
// }

// mapdiv.ondrop = function (e) {
//   e.preventDefault()
//   imagePath = e.dataTransfer.getData("text/plain")
//   coordinates = map.containerPointToLatLng(L.point([e.clientX, e.clientY]))
//   L.marker(coordinates, {
//     icon: L.icon({ iconUrl: imagePath }),
//     draggable: true
//   })
//     .addTo(map)
// }
function mapDynamicTheme() {
  let styles2 = 'body {--button-primary-bg-highlight-color: ' + buttonPrimaryBgHighlightColor + ';' +
    '--button-primary-highlight-text-color: ' + buttonPrimaryHighlightTextColor + ';' +
    '--button-primary-bg-color: ' + appColor + ';' +
    '--button-primary-text-color: ' + Button_txt + ';}';
  let css2;
  css2 = document.getElementById('mapthemeadded') ? document.getElementById('mapthemeadded') : '';
  if (css2) {
    css2.innerHTML = styles2;
    css2.id = 'mapthemeadded';
  } else {
    css2 = document.createElement('style');
    css2.innerHTML = styles2;
    css2.id = 'mapthemeadded';
  }
  document.getElementsByTagName('head')[0].appendChild(css2);
}
function isMobile() {
  const mobileMaxWidth = 767; // Maximum width for mobile devices
  return window.innerWidth <= mobileMaxWidth;
}
function isTablet() {
  const tabletMinWidth = 768; // Minimum width for tablets
  const tabletMaxWidth = 1024; // Maximum width for tablets
  return window.innerWidth >= tabletMinWidth && window.innerWidth <= tabletMaxWidth;
}
function isDesktop() {
  const desktopMinWidth = 1025; // Minimum width for desktops
  return window.innerWidth >= desktopMinWidth;
}
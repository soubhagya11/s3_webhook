"use strict";
var lrObj = '';
var entrycordinates = [];
var curValue = false;
// For across building, floor navigation
var languagecode = window.localStorage.getItem('loginUserLanguage');
var facilitiesObj = [];
var multiFloorNav = {
  //Global variables to capture multifloor navigation details
  fromBuildingName: null,
  fromFloorId: null,
  fromLatLng: null,
  fromExit: null,
  toBuildingName: null,
  toFloorId: null,
  toLatLng: null,
  toEntry: null,
  transferBuildingName: null,
  transferFloorId: null,
  floorStartTooltip: null,
  floorEndTooltip: null,
};
var mapNamesObj = JSON.parse(window.localStorage.getItem('mapNameObj'));
var mapsettingsblock = JSON.parse(localStorage.getItem('DefaultUiSettingsData'));
function clearMultiFloorPopups() {
  if (multiFloorNav.floorStartTooltip != null) multiFloorNav.floorStartTooltip.remove(); //thisGeoArea.removeLayer(multiFloorNav.floorStartTooltip);
  if (multiFloorNav.floorEndTooltip != null) multiFloorNav.floorEndTooltip.remove(); // thisGeoArea.removeLayer(multiFloorNav.floorEndTooltip);
}

function clearMultiFloorNavData() {
  multiFloorNav.fromBuildingName = null;
  multiFloorNav.fromFloorId = null;
  multiFloorNav.fromLatLng = null;
  multiFloorNav.fromExit = null;

  multiFloorNav.toBuildingName = null;
  multiFloorNav.toFloorId = null;
  multiFloorNav.toLatLng = null;
  multiFloorNav.toEntry = null;

  multiFloorNav.transferBuildingName = null;
  multiFloorNav.transferFloorId = null;
  clearMultiFloorPopups();
  //if (multiFloorNav.floorStartTooltip!=null) thisGeoArea.removeLayer(multiFloorNav.floorStartTooltip);
  //if (multiFloorNav.floorEndTooltip!=null) thisGeoArea.removeLayer(multiFloorNav.floorEndTooltip);
}

function restorePrevMultifloorNavPaths(thisGeoArea) {
  if ((multiFloorNav.fromBuildingName === thisGeoArea.gaName && multiFloorNav.fromFloorId === thisGeoArea.floorToShow) ||
    (multiFloorNav.toBuildingName === thisGeoArea.gaName && multiFloorNav.toFloorId === thisGeoArea.floorToShow) ||
    (multiFloorNav.transferBuildingName === thisGeoArea.gaName && multiFloorNav.transferFloorId === thisGeoArea.floorToShow)) {
    //alert(floor);
    initializeRouter(thisGeoArea.map, thisGeoArea.gaFloorPathUrls[thisGeoArea.floorToShow],
      function () {
        if (multiFloorNav.fromBuildingName === thisGeoArea.gaName && multiFloorNav.fromFloorId === thisGeoArea.floorToShow) {
          if (multiFloorNav.toBuildingName === thisGeoArea.gaName && multiFloorNav.toFloorId === thisGeoArea.floorToShow) {
            //alert("SAMEFLOORNAV:"+floor);
            showIndoorRoute(multiFloorNav.fromLatLng[0], multiFloorNav.fromLatLng[1], multiFloorNav.toLatLng[0], multiFloorNav.toLatLng[1], false, this.gaShowFloorPathNetwork);
          } else {
            //    alert("FROMFLOOR:"+floor);
            /** To draw a paht on group locate  date:180702*/
            var selectedassetsfloorarr = JSON.parse(window.localStorage.getItem('multifloorselectedAssets'));
            if (selectedassetsfloorarr && selectedassetsfloorarr.length > 1 && getAllUrlParams().pn === 'cartaddedassets' &&
              window.localStorage.getItem('clearPath') !== 'true' && window.localStorage.getItem('updatemap') === 'true') {
              // clearPathGrouplocate();
              var endpointds = JSON.parse(window.localStorage.getItem('neareststairs'));
              if (thisGeoArea.specialPOIs['L60-SelectedAssets'] && thisGeoArea.specialPOIs['L60-SelectedAssets'].length > 0) {
                var specialfleets = thisGeoArea.specialPOIs['L60-SelectedAssets'];
              } else {
                var specialfleets = thisGeoArea.specialPOIs['L70-Staircase'];
              }
              // start to show entry coordinates in Group locate 181102
              // var selectedassetsfloorarr = JSON.parse(window.localStorage.getItem('multifloorselectedAssets'));
              // var floorEntryCoordinates = entrycordinates[selectedassetsfloorarr[0]];
              // var entryCoOrdinates = [endpointds[0], endpointds[1]];
              // specialfleets.push(entryCoOrdinates);
              // end to show entry coordinates in Group locate 181102
              showIndoorShortestMultiplePOIRoute(
                floorEntryCoordinates[0], floorEntryCoordinates[1],
                specialfleets,
                // thisGeoArea.specialPOIs['L60-SelectedAssets'], // changed 180712
                false,
                thisGeoArea.gaShowFloorPathNetwork
              );
            } else if (selectedassetsfloorarr && selectedassetsfloorarr.length > 1 && getAllUrlParams().pn === 'predefinedaddedassets' &&
              window.localStorage.getItem('clearPath') !== 'true' && window.localStorage.getItem('updatemap') === 'true') {
              // clearPathGrouplocate();
              var endpointds = JSON.parse(window.localStorage.getItem('neareststairs'));
              if (thisGeoArea.specialPOIs[localStorage.getItem('routeNames')] && thisGeoArea.specialPOIs[localStorage.getItem('routeNames')].length > 0) {
                var specialfleets = thisGeoArea.specialPOIs[localStorage.getItem('routeNames')];
              } else {
                var specialfleets = thisGeoArea.specialPOIs['L70-Staircase'];
              }
              // start to show entry coordinates in Group locate 181102
              var selectedassetsfloorarr = JSON.parse(window.localStorage.getItem('multifloorselectedAssets'));
              var floorEntryCoordinates = entrycordinates[selectedassetsfloorarr[0]];
              var entryCoOrdinates = [endpointds[0], endpointds[1]];
              specialfleets.push(entryCoOrdinates);
              // end to show entry coordinates in Group locate 181102
              showIndoorShortestMultiplePOIRoute(
                floorEntryCoordinates[0], floorEntryCoordinates[1],
                specialfleets,
                // thisGeoArea.specialPOIs['L60-SelectedAssets'], // changed 180712
                false,
                thisGeoArea.gaShowFloorPathNetwork
              );
            } else {
              showIndoorRoute(multiFloorNav.fromLatLng[0], multiFloorNav.fromLatLng[1], multiFloorNav.fromExit[0], multiFloorNav.fromExit[1], false, this.gaShowFloorPathNetwork);
            }
            /* end */
            showMultiFloorNavPopup(thisGeoArea);
          }
        } else if (multiFloorNav.toBuildingName === thisGeoArea.gaName && multiFloorNav.toFloorId === thisGeoArea.floorToShow) {
          //  alert("TOFLOOR:"+floor);
          /** start To draw a paht on group locate  date:180702*/
          var selectedassetsfloorarr = JSON.parse(window.localStorage.getItem('multifloorselectedAssets'));
          if (selectedassetsfloorarr && selectedassetsfloorarr.length > 1 && getAllUrlParams().pn === 'cartaddedassets' &&
            window.localStorage.getItem('clearPath') !== 'true' && window.localStorage.getItem('updatemap') === 'true') {
            // clearPathGrouplocate();
            var endpointds = JSON.parse(window.localStorage.getItem('neareststairs'));
            if (thisGeoArea.specialPOIs['L60-SelectedAssets'] && thisGeoArea.specialPOIs['L60-SelectedAssets'].length > 0) {
              var specialfleets = thisGeoArea.specialPOIs['L60-SelectedAssets'];
            } else {
              var specialfleets = thisGeoArea.specialPOIs['L70-Staircase'];
            }
            showIndoorShortestMultiplePOIRoute(
              endpointds[0], endpointds[1],
              specialfleets,
              // thisGeoArea.specialPOIs['L60-SelectedAssets'], // changed 180712
              false,
              thisGeoArea.gaShowFloorPathNetwork
            );
          } else if (selectedassetsfloorarr && selectedassetsfloorarr.length > 1 && getAllUrlParams().pn === 'predefinedaddedassets' &&
            window.localStorage.getItem('clearPath') !== 'true' && window.localStorage.getItem('updatemap') === 'true') {
            // clearPathGrouplocate();
            var endpointds = JSON.parse(window.localStorage.getItem('neareststairs'));
            if (thisGeoArea.specialPOIs[localStorage.getItem('routeNames')] && thisGeoArea.specialPOIs[localStorage.getItem('routeNames')].length > 0) {
              var specialfleets = thisGeoArea.specialPOIs[localStorage.getItem('routeNames')];
            } else {
              var specialfleets = thisGeoArea.specialPOIs['L70-Staircase'];
            }
            showIndoorShortestMultiplePOIRoute(
              endpointds[0], endpointds[1],
              specialfleets,
              // thisGeoArea.specialPOIs['L60-SelectedAssets'], // changed 180712
              false,
              thisGeoArea.gaShowFloorPathNetwork
            );
          } else {
            showIndoorRoute(multiFloorNav.toEntry[0], multiFloorNav.toEntry[1], multiFloorNav.toLatLng[0], multiFloorNav.toLatLng[1], false, this.gaShowFloorPathNetwork);
          }
          /* End */
          showMultiFloorNavPopup(thisGeoArea);
        } else if (multiFloorNav.transferBuildingName === thisGeoArea.gaName && multiFloorNav.transferFloorId === thisGeoArea.floorToShow) {
          // alert("TRANSFERFLOOR:"+floor);
          showIndoorRoute(multiFloorNav.fromExit[0], multiFloorNav.fromExit[1], multiFloorNav.toEntry[0], multiFloorNav.toEntry[1], false, this.gaShowFloorPathNetwork);
          showMultiFloorNavPopup(thisGeoArea);
        }
      }.bind(thisGeoArea)
    );
  }
}

function clearPathGrouplocate() {
  var endpointds = JSON.parse(window.localStorage.getItem('neareststairs'));
  if (thisGeoArea.specialPOIs['L60-SelectedAssets'] && thisGeoArea.specialPOIs['L60-SelectedAssets'].length > 0) {
    var specialfleets = thisGeoArea.specialPOIs['L60-SelectedAssets'];
  } else {
    var specialfleets = thisGeoArea.specialPOIs['L70-Staircase'];
  }
  showIndoorShortestMultiplePOIRoute(
    endpointds[0], endpointds[1],
    specialfleets,
    // thisGeoArea.specialPOIs['L60-SelectedAssets'], changed 180712
    fasle,
    thisGeoArea.gaShowFloorPathNetwork
  );
}


function doMultiFloorNavigation(thisgeoArea) {
  curValue = true;
  var arrCommonStairs1 = [];
  var arrCommonStairs2 = [];
  arrCommonStairs1 = findCommonStairsBetweenFloors(thisgeoArea, multiFloorNav.fromFloorId, multiFloorNav.toFloorId)
  if (arrCommonStairs1.length > 0) {
    //If common stairs are found find the nearest stairs to start location
    multiFloorNav.fromExit = window.getNearestPOI(multiFloorNav.fromLatLng, arrCommonStairs1);
    multiFloorNav.toEntry = multiFloorNav.fromExit;
  } else {
    var transitFloor = null;
    if (thisgeoArea.gaFloorStairs) {
      Object.keys(thisgeoArea.gaFloorStairs)
        .map(function (floorID) {
          var found = false;
          if (!found) {
            arrCommonStairs1 = findCommonStairsBetweenFloors(thisgeoArea, multiFloorNav.fromFloorId, floorID);
            if (arrCommonStairs1.length > 0) {
              arrCommonStairs2 = findCommonStairsBetweenFloors(thisgeoArea, multiFloorNav.toFloorId, floorID);
              if (arrCommonStairs2.length > 0) {
                found = true;
                multiFloorNav.fromExit = getNearestPOI(multiFloorNav.fromLatLng, arrCommonStairs1);
                multiFloorNav.toEntry = getNearestPOI(multiFloorNav.fromExit, arrCommonStairs2);
                multiFloorNav.transferBuildingName = thisgeoArea.gaName;
                multiFloorNav.transferFloorId = floorID;
              }
            }
          }
        });
    }
  }
  thisgeoArea.floorToShow = multiFloorNav.fromFloorId;
  if (getAllUrlParams().api == 'local') {
    thisgeoArea.updateMap();
  } else {
    thisgeoArea.enableHeatMap(thisgeoArea.gaFloorIds[thisgeoArea.floorToShow]);
  }

}

function findCommonStairsBetweenFloors(thisgeoArea, floor1ID, floor2ID) {
  var floor1Stairs = thisgeoArea.gaFloorStairs ? thisgeoArea.gaFloorStairs[floor1ID] : [];
  var floor2Stairs = thisgeoArea.gaFloorStairs ? thisgeoArea.gaFloorStairs[floor2ID] : [];
  var commonStairs = null;
  var arrCommonStairs = [];

  for (var i = 0; i < floor1Stairs.length; i++) {
    for (var i = 0; i < floor1Stairs.length; i++) {
      for (var j = 0; j < floor2Stairs.length; j++) {
        if (floor1Stairs[i][0] === floor2Stairs[j][0] && floor1Stairs[i][1] === floor2Stairs[j][1]) {
          arrCommonStairs.push(floor1Stairs[i]);
        }
      }
    }
  }
  return arrCommonStairs;
}

function showMultiFloorNavPopup(thisGeoArea) {
  var coordPopup1, coordPopup2;
  var contentPopup1, contentPopup2;
  var fromFloor, toFloor;
  var myIcon1 = new L.divIcon({
    iconSize: new L.Point(10, 10),
    iconAnchor: [5, 10]
  });
  var myIcon2 = new L.divIcon({
    iconSize: new L.Point(10, 10),
    iconAnchor: [5, 10]
  });
  var floorName = document.getElementById('floor');
  floorName.innerHTML = thisGeoArea.floorToShow;
  if (multiFloorNav.floorStartTooltip != null) thisGeoArea.removeLayer(multiFloorNav.floorStartTooltip);
  if (multiFloorNav.floorEndTooltip != null) thisGeoArea.removeLayer(multiFloorNav.floorEndTooltip);
  if (thisGeoArea.floorToShow === multiFloorNav.fromFloorId) {
    fromFloor = multiFloorNav.fromFloorId;
    if ((localStorage.getItem('currentpostion') && getAllUrlParams().pn === 'cartaddedassets' && curValue === true) ||
      (localStorage.getItem('currentpostion') && getAllUrlParams().pn === 'predefinedaddedassets' && curValue === true)) {
      var currentpostion = JSON.parse(localStorage.getItem('currentpostion'));
      var startLat = currentpostion.latitude;
      var startLon = currentpostion.longitude;
      coordPopup1 = [startLat, startLon];
      curValue = false;
    } else {
      if ((window.localStorage.getItem('multifloorselectedAssets') && getAllUrlParams().pn === 'cartaddedassets') ||
        (window.localStorage.getItem('multifloorselectedAssets') && getAllUrlParams().pn === 'predefinedaddedassets')) {
        curValue = false;
        var selectedassetsfloorarr = JSON.parse(window.localStorage.getItem('multifloorselectedAssets'));
        var floorEntryCoordinates = entrycordinates[selectedassetsfloorarr[0]];
        coordPopup1 = [floorEntryCoordinates[0], floorEntryCoordinates[1]]; //multiFloorNav.fromLatLng; // changed 181108
      } else {
        curValue = false;
        // multiFloorNav.toFloorId = localStorage.getItem('fcurrentfloorname');
        // var currentFloorName = window.localStorage.getItem('fcurrentfloorname');
        // multiFloorNav.fromFloorId = currentFloorName;
        // var startLat = entrycordinates[currentFloorName][0];
        // var startLon = entrycordinates[currentFloorName][1];
        // coordPopup1 = [startLat, startLon];
        coordPopup1 = multiFloorNav.fromLatLng;
      }
    }
    for (var i = 0; i < instrData.length; i++) {
      if (instrData.length - 1 === i) {
        instrData.splice(i, 1);
        if (multiFloorNav.transferBuildingName != null) {
          instrData.push(mapNamesObj.take_escalator + ' ' + multiFloorNav.transferFloorId);
        } else {
          instrData.push(mapNamesObj.take_escalator + ' ' + multiFloorNav.toFloorId);
        }
      }
    }
    // coordPopup1 = multiFloorNav.fromLatLng;
    coordPopup2 = multiFloorNav.fromExit;
    // highlight the from floor in the floor level
    var floorIndex = thisGeoArea.gaFloors.indexOf(multiFloorNav.fromFloorId);
    if (floorIndex < 0) floorIndex = thisGeoArea.gaFloors.length;
    //New function highlightButton is added in the control
    thisGeoArea.gaFloorSelectionControl.highlightButton(floorIndex);
    contentPopup1 = ("<p>" + mapNamesObj.start + "<p>");
    if (multiFloorNav.transferBuildingName != null) {
      contentPopup2 = ("<p>" + mapNamesObj.transfer_to_floor + " " + multiFloorNav.transferFloorId + "<p>");
      toFloor = multiFloorNav.transferFloorId;
    } else {
      contentPopup2 = ("<p>" + mapNamesObj.transfer_to_floor + " " + multiFloorNav.toFloorId + "<p>");
      toFloor = multiFloorNav.toFloorId;
    }
  } else if (thisGeoArea.floorToShow === multiFloorNav.toFloorId) {
    toFloor = multiFloorNav.toFloorId;
    coordPopup1 = multiFloorNav.toEntry;
    coordPopup2 = multiFloorNav.toLatLng;
    if (instrData.length > 0) {
      instrData.splice(0, 1);
    }
    contentPopup2 = ("<p>" + mapNamesObj.arrive_at_destination + "<p>");
    if (multiFloorNav.transferBuildingName != null) {
      contentPopup1 = ("<p>" + mapNamesObj.transfer_from_floor + " " + multiFloorNav.transferFloorId + "<p>");
      fromFloor = multiFloorNav.transferFloorId;
    } else {
      contentPopup1 = ("<p>" + mapNamesObj.transfer_from_floor + " " + multiFloorNav.fromFloorId + "<p>");
      fromFloor = multiFloorNav.fromFloorId;
    }
  } else if (thisGeoArea.floorToShow === multiFloorNav.transferFloorId) {
    fromFloor = multiFloorNav.fromFloorId;
    toFloor = multiFloorNav.toFloorId;
    coordPopup1 = multiFloorNav.fromExit;
    contentPopup1 = ("<p>" + mapNamesObj.transfer_from_floor + " " + multiFloorNav.fromFloorId + "<p>");
    coordPopup2 = multiFloorNav.toEntry;
    contentPopup2 = ("<p>" + mapNamesObj.transfer_to_floor + " " + multiFloorNav.toFloorId + "<p>");
  }
  var direction1, direction2;
  // Popup directions based on the coordinates so that they do not intersect each other
  if (coordPopup1[1] < coordPopup2[1]) {
    direction1 = "left";
    direction2 = "right";
  } else {
    direction1 = "right"
    direction2 = "left";
  }
  multiFloorNav.floorStartTooltip = L.marker(coordPopup1, {
    icon: myIcon1
  });
  multiFloorNav.floorStartTooltip.setOpacity(0);
  multiFloorNav.floorStartTooltip.bindTooltip(contentPopup1, {
    permanent: true,
    direction: direction1,
    interactive: true,
    opacity: 0.7
  }).addTo(thisGeoArea);
  multiFloorNav.floorEndTooltip = L.marker(coordPopup2, {
    icon: myIcon2
  });
  multiFloorNav.floorEndTooltip.setOpacity(0);
  multiFloorNav.floorEndTooltip.bindTooltip(contentPopup2, {
    permanent: true,
    direction: direction2,
    interactive: true,
    opacity: 0.7
  }).addTo(thisGeoArea);
  multiFloorNav.floorStartTooltip.on('click', function (e) {
    thisGeoArea.changeFloorTo(fromFloor);
  }.bind(thisGeoArea));
  multiFloorNav.floorEndTooltip.on('click', function (e) {
    thisGeoArea.changeFloorTo(toFloor);
  }.bind(thisGeoArea));
  if (bookMarkEnable === true) {
    thisGeoArea.map.addControl(controlBookmark);
  }
}

L.LayerGroup.GeoArea = L.FeatureGroup.extend({
  // ***** Info needed for multifloor navigation
  gaStairs: null,
  gaFloorStairs: null,


  // ***** Input Parameters ************
  gaName: null,
  facilityDisplayName: null,
  gaGeojsonurl: null,
  floorid: null,
  gaFloorMapsUrls: [],
  gaFloormapcoords: [],
  gaFloorPathUrls: [],
  gaFloorPathBounds: [],
  gaFloors: [],
  floorDisplayNames: [],
  gaFloorIds: [], // to get floors ids
  gaShowFloorMaps: true,
  showFloorResizeMarkers: false,
  gaShowFloorPathNetwork: false,
  floorToShow: "0",
  disableClusterAtZoom: "17",
  map: null,
  feature: null, // To get feature data
  gaPopupCallback: null,
  gaHitMapCallback: null,
  // ***** Processed Parameters ********
  gaFloorSelectionControl: null,
  // gaFloorSelectionControlHeatMap: null,
  gafloorMap: null,
  rectForIndoorContextMenu: null,
  specialPOIs: {},
  enabledspecial: false,

  createFloorSelectionControl: function () {
    var localFloorIds = this.gaFloorIds; // floor ids
    var options;
    if (this.gaFloors === 0) {
      // Name & level show only when the floor map is Available.
      options = [];
    } else {
      options = [];
      var floorview = window.localStorage.getItem('floorsenable');

      for (i = 0; i < this.gaFloors.length; i++) {
        if (floorview == 'true' || floorview == true) {
          for (i = 0; i < this.floorDisplayNames.length; i++) {
            options[i] = {};
            options[i].content = "" + this.floorDisplayNames[i];
            options[i].bgColor = mapsettingsblock.theme_settings.button_primary_active_text_color;
            options[i].position = 'bottomleft';
            options[i].highColor = mapsettingsblock.theme_settings.button_primary_active_bg_color;
            options[i].color = mapsettingsblock.theme_settings.button_primary_active_text_color;
            options[i].fontColor = mapsettingsblock.theme_settings.button_primary_active_bg_color;
          }
          options[i] = {};
          options[i].content = '<p>' + this.facilityDisplayName + '</p>';
          options[i].bgColor = mapsettingsblock.theme_settings.button_primary_active_text_color;
          options[i].position = 'bottomleft';
          options[i].highColor = mapsettingsblock.theme_settings.button_primary_active_bg_color;
          options[i].textColor = mapsettingsblock.theme_settings.button_primary_active_text_color;
          options[i].color = mapsettingsblock.theme_settings.button_primary_active_text_color;
          options[i].fontColor = mapsettingsblock.theme_settings.button_primary_active_bg_color;
        } else {
          window.localStorage.removeItem('floorsenable');
        }

      }


    }

    // Initialize floor selection control
    this.gaFloorSelectionControl = L.functionButtons(options);
    // Set initial floor selection based on floorToShow
    var floorIndex = this.gaFloors.indexOf(this.floorToShow);
    if (floorIndex < 0) floorIndex = this.gaFloors.length;
    this.gaFloorSelectionControl.setSelectedButton(floorIndex);
    // Initialize onClick of the floor selection callback
    var thisLayer = this; //Needed to access this in callback
    this.gaFloorSelectionControl.on('clicked', function (data) {
      clearPolylines(); // animation path clear 190116
      navAnimationPolylinesColour = false; // need of color for Polylines 190123
      thisLayer.enabledspecial = false;
      //thisLayer.gaFloorSelectionControl.contextmenu.hide();
      thisLayer.map.contextmenu.hide();
      window.localStorage.removeItem('searchedId');
      thisLayer.map.removeControl(controlSearch);
      thisLayer.map.addControl(controlSearch);
      window.localStorage.setItem('fcurrentfloorname', thisLayer.gaFloors[data.idx]);
      window.localStorage.setItem('curfloorname', thisLayer.gaFloors[data.idx]);
      visitorHeatMap(localFloorIds[thisLayer.gaFloors[data.idx]], false);
      thisLayer.map.removeControl(controlBookmark);
      // Added 180905 -  To resolve icons order mismatch when changing the floor
      thisLayer.map.removeControl(zoomControl);
      thisLayer.map.addControl(zoomControl);
      // thisLayer.map.removeControl(lc);
      // thisLayer.map.addControl(lc);
      if (window.localStorage.getItem('fcurrentfloorname') === 'undefined') {
        thisLayer.map.removeControl(facilitiesControl);
        if (heatMapEnabled) {
          thisLayer.map.removeControl(heatMapControl);
        }
      } else {
        thisLayer.map.removeControl(facilitiesControl);
        thisLayer.map.addControl(facilitiesControl);
        if (heatMapEnabled) {
          thisLayer.map.removeControl(heatMapControl);
          thisLayer.map.addControl(heatMapControl);
        }
      }
      // thisLayer.map.removeControl(refreshControl);
      // thisLayer.map.addControl(refreshControl);
      // Commented code for disable explore icon -190103
      // thisLayer.map.removeControl(exploreControl);
      // thisLayer.map.addControl(exploreControl);
      // thisLayer.map.removeControl(googleNavigationControl);
      // thisLayer.map.addControl(googleNavigationControl);
      //thisLayer.rectForIndoorContextMenu.unbindContextMenu(); 
      map.closePopup();
      if (getAllUrlParams().api == 'local') {
        if (data.idx == thisLayer.gaFloors.length) { //if allfloors are selected
          thisLayer.floorToShow = "";
          thisLayer.updateMap();
        } else {
          this.floorid = localFloorIds[thisLayer.gaFloors[data.idx]]
          lrObj.floorid = this.floorid;
          thisLayer.floorToShow = thisLayer.gaFloors[data.idx];
          window.localStorage.setItem('updatemap', 'true');
          thisLayer.updateMap();
        }
      } else {

        if (data.idx == thisLayer.gaFloors.length) { //if allfloors are selected
          thisLayer.floorToShow = "";
          thisLayer.updateMap();
        } else {
          this.floorid = localFloorIds[thisLayer.gaFloors[data.idx]]
          lrObj.floorid = this.floorid;
          thisLayer.floorToShow = thisLayer.gaFloors[data.idx];
          thisLayer.enableHeatMap(this.floorid);
        }
      }
      if (theMarker != undefined) {
        map.removeLayer(theMarker);
      };
    });
  },
  clearSearch: function () {
    var thisLayer = this;
    thisLayer.map.removeControl(controlSearch);
    thisLayer.map.addControl(controlSearch);
    thisLayer.map.removeControl(controlBookmark);
    // thisLayer.map.addControl(controlBookmark);
    thisLayer.map.removeControl(zoomControl);
    thisLayer.map.addControl(zoomControl);
    // thisLayer.map.removeControl(lc);
    // thisLayer.map.addControl(lc);
    thisLayer.map.removeControl(facilitiesControl);
    thisLayer.map.addControl(facilitiesControl);
    localStorage.removeItem('selectedFleet');
    // thisLayer.map.removeControl(refreshControl);
    //   thisLayer.map.addControl(refreshControl);
    // Commented code for disable explore icon -190103
    // thisLayer.map.removeControl(exploreControl);
    // thisLayer.map.addControl(exploreControl);
    // thisLayer.map.removeControl(googleNavigationControl);
    // thisLayer.map.addControl(googleNavigationControl);
  },
  clearBottomSheet: function () {
    var bottomBox = $("#bottomSheet");
    bottomBox.hide();
    /* Added to show location popup */
    var locateIcon = document.getElementById("mapid");
    removeClasses(locateIcon, 'bottomSheetadded');
    document.getElementById('mapid').style.height = '100vh';
  },
  changeFloorTo: function (floorID) {
    navAnimationPolylinesColour = false; // need of color for Polylines 190123
    clearPolylines();
    this.enabledspecial = false;
    var thisLayer = this;
    //SREENADH: Added function to allow to change floors during multi-floor navigation
    var floorIndex = this.gaFloors.indexOf(floorID);
    if (floorIndex < 0) floorIndex = this.gaFloors.length;
    //SREENADH: highlight the floor in the floor selection control
    //New function highlightButton is added in the control
    this.gaFloorSelectionControl.highlightButton(floorIndex);
    window.localStorage.removeItem('searchedId');
    thisLayer.map.removeControl(controlSearch);
    thisLayer.map.addControl(controlSearch);
    window.localStorage.setItem('curfloorname', floorID);
    thisLayer.map.removeControl(controlBookmark);
    //   thisLayer.map.addControl(controlBookmark);
    //  }, 200)
    // Added 180905 -  To resolve icons order mismatch when changing the floor
    thisLayer.map.removeControl(zoomControl);
    thisLayer.map.addControl(zoomControl);
    // thisLayer.map.removeControl(lc);
    // thisLayer.map.addControl(lc);
    thisLayer.map.removeControl(facilitiesControl);
    thisLayer.map.addControl(facilitiesControl);
    // thisLayer.map.removeControl(refreshControl);
    //   thisLayer.map.addControl(refreshControl);
    // Commented code for disable explore icon -190103
    // thisLayer.map.removeControl(exploreControl);
    // thisLayer.map.addControl(exploreControl);
    // thisLayer.map.removeControl(googleNavigationControl);
    // thisLayer.map.addControl(googleNavigationControl);
    this.floorToShow = floorID;
    visitorHeatMap(this.gaFloorIds[this.floorToShow], false);
    window.localStorage.setItem('updatemap', 'true'); // changed 180702
    if (getAllUrlParams().api == 'local') {
      this.updateMap();
    } else {
      this.enableHeatMap(this.gaFloorIds[this.floorToShow]);
    }
  },
  createFloorSelectionControlHeatMap: function () {
    // options = { content: "Reload", bgColor: "grey", position: "topleft", highColor: "#555599" }
    // Initialize floor selection control
    // this.gaFloorSelectionControlHeatMap = L.functionButtons(options);
    // Set initial floor selection based on floorToShow
    var thisLayer = this; //Needed to access this in callback
    lrObj = this;
    // this.gaFloorSelectionControlHeatMap.on('clicked', function (data) {
    // }
    // );
  },
  addGeoAreaDetails: function (options) {
    this.gaName = options.gaName;
    this.facilityDisplayName = options.facilityDisplayName;

    // SREENADH: Hardcoded values for multifloor nvigation for mid coast hospital
    // Need to be changed to come from the JSON file
    if (getAllUrlParams().fp === 'true') {
      var fleetInfo = JSON.parse(localStorage.getItem(getAllUrlParams().sr));
      fleetInfo = fleetInfo['floorsData'];
      if (fleetInfo && fleetInfo.length > 1) {
        this.gaStairs = getMultifloorStairCases();
        this.gaFloorStairs = getFloorlevelStairCases();
      }
    }
    this.gaGeojsonurl = options.gaGeojsonurl;
    this.gaFloorMapsUrls = options.gaFloorMapsUrls;
    this.gaFloormapcoords = options.gaFloormapcoords;
    this.gaFloorPathUrls = options.gaFloorPathUrls;
    this.gaFloorPathBounds = options.gaFloorPathBounds;
    this.gaFloors = options.gaFloors;
    this.floorDisplayNames = options.floorDisplayNames;
    this.gaFloorIds = options.gaFloorIds;
    this.gaShowFloorMaps = options.gaShowFloorMaps;
    this.gaShowFloorPathNetwork = options.gaShowFloorPathNetwork;
    this.showFloorResizeMarkers = options.showFloorResizeMarkers;
    this.floorToShow = options.floorToShow; //a==> all floors
    this.disableClusterAtZoom = options.disableClusterAtZoom;
    this.map = options.map;
    this.gaPopupCallback = options.gaPopupCallback;
    if (this.gaFloors != 0) { // hide heat map button
      this.createFloorSelectionControl();
      this.createFloorSelectionControlHeatMap();
    }
  },
  enableHeatMap: function (floorid) { // To enable heat map  
    this.clearLayers(); //Clear any existing markers, images.. in layers
    this.removeFloorMap();
    this.specialPOIs = {};
    var hitmaprul;
    if ((floorid != null) && (parseInt(getAllUrlParams().cufloorid) !== floorid)) {
      if (getAllUrlParams().cstdate && getAllUrlParams().ceddate) {
        hitmaprul = localStorage.getItem('apiendpoint') + 'api/v1/facilities?type=list&facility_id=' + floorid + '/' +
          getAllUrlParams().cstdate + '/' + getAllUrlParams().ceddate;
      } else {
        hitmaprul = localStorage.getItem('apiendpoint') + 'api/v1/facilities?type=list&facility_id=' + floorid + '&map_locate=true'; // To get floor level heat map data based on floor level fleet id api
      }
    } else {
      if (getAllUrlParams().cstdate && getAllUrlParams().ceddate) {
        hitmaprul = localStorage.getItem('apiendpoint') + 'api/v1/facilities?type=list&facility_id=' + getAllUrlParams().cfleetid + '&map_locate=true/' +
          getAllUrlParams().cstdate + '/' + getAllUrlParams().ceddate;
      } else {
        hitmaprul = localStorage.getItem('apiendpoint') + 'api/v1/facilities?type=list&facility_id=' + getAllUrlParams().cfleetid + '&map_locate=true'; // To get floor level heat map data based on current fleet id api
      }
    }
    addGeoAreaOverlayToenableHeatMap(this,
      hitmaprul, this.gaFloorMapsUrls, this.gaFloormapcoords, this.gaFloors, this.floorToShow, this.disableClusterAtZoom);
    this.addFloorMap();
  },
  updateMap: function () {
    this.clearLayers(); //Clear any existing markers, images.. in layers
    this.removeFloorMap();
    this.specialPOIs = {};
    var startLat = window.localStorage.getItem('startboundlat');
    var startLon = window.localStorage.getItem('startboundlan');
    var endLat = window.localStorage.getItem('endboundlat');
    var endLon = window.localStorage.getItem('endboundlan');
    // commented code to display near by fleets - 190103
    instrData = [];
    coordinatesData = [];
    instrNumber = 0;
    instrValue = true;
    addGeoAreaOverlay(this,
      this.gaGeojsonurl, this.gaFloorMapsUrls, this.gaFloormapcoords, this.gaFloors, this.floorToShow, this.disableClusterAtZoom);
    this.addFloorMap();
    // Added code (getAllUrlParams().pn !== 'home') fro enabling all the fleets when map screen as home screen while floor changing =190131(shravani)
    if (!window.localStorage.getItem('kioskFromToAssets') && getAllUrlParams().pn !== 'home') {
      // groupLocateFleets(startLat, startLon, endLat, endLon); Commented for Map Refresh by Srinivas
    }
    /** Start:  To Show group locate multi floor navigation changed:180702 */
    setTimeout(function () {
      var selectedassetsfloorarr = JSON.parse(window.localStorage.getItem('multifloorselectedAssets'));
      if (selectedassetsfloorarr && selectedassetsfloorarr.length >= 1 && getAllUrlParams().pn === 'cartaddedassets' &&
        window.localStorage.getItem('clearPath') !== 'true' && window.localStorage.getItem('updatemap') === 'true') {
        // clearPathGrouplocate();
        var endpointds = JSON.parse(window.localStorage.getItem('neareststairs'));
        if (thisGeoArea.specialPOIs['L60-SelectedAssets'] && thisGeoArea.specialPOIs['L60-SelectedAssets'].length > 0) {
          var specialfleets = thisGeoArea.specialPOIs['L60-SelectedAssets'];
        } else {
          var specialfleets = thisGeoArea.specialPOIs['L70-Staircase'];
        }
        // start to show entry coordinates in Group locate 181102
        var selectedassetsfloorarr = JSON.parse(window.localStorage.getItem('multifloorselectedAssets'));
        var floorEntryCoordinates = entrycordinates[selectedassetsfloorarr[0]];
        // end to show entry coordinates in Group locate 181102
        if (Object.keys(thisGeoArea.specialPOIs).length > 0) {
          if (thisGeoArea.floorToShow === multiFloorNav.fromFloorId) {
            showIndoorShortestMultiplePOIRoute(
              floorEntryCoordinates[0], floorEntryCoordinates[1],
              specialfleets,
              // thisGeoArea.specialPOIs['L60-SelectedAssets'], // changed 180712
              false,
              thisGeoArea.gaShowFloorPathNetwork
            );
          } else {
            showIndoorShortestMultiplePOIRoute(
              endpointds[0], endpointds[1],
              specialfleets,
              // thisGeoArea.specialPOIs['L60-SelectedAssets'], // changed 180712
              false,
              thisGeoArea.gaShowFloorPathNetwork
            );
          }
        }
      } else if (selectedassetsfloorarr && selectedassetsfloorarr.length >= 1 && getAllUrlParams().pn === 'predefinedaddedassets' &&
        window.localStorage.getItem('clearPath') !== 'true' && window.localStorage.getItem('updatemap') === 'true') {
        // clearPathGrouplocate();
        var endpointds = JSON.parse(window.localStorage.getItem('neareststairs'));
        if (thisGeoArea.specialPOIs[localStorage.getItem('routeNames')] && thisGeoArea.specialPOIs[localStorage.getItem('routeNames')].length > 0) {
          var specialfleets = thisGeoArea.specialPOIs[localStorage.getItem('routeNames')];
        } else {
          var specialfleets = thisGeoArea.specialPOIs['L70-Staircase'];
        }
        // start to show entry coordinates in Group locate 181102
        var selectedassetsfloorarr = JSON.parse(window.localStorage.getItem('multifloorselectedAssets'));
        var floorEntryCoordinates = entrycordinates[selectedassetsfloorarr[0]];
        // end to show entry coordinates in Group locate 181102
        if (Object.keys(thisGeoArea.specialPOIs).length > 0) {
          if (thisGeoArea.floorToShow === multiFloorNav.fromFloorId) {
            showIndoorShortestMultiplePOIRoute(
              floorEntryCoordinates[0], floorEntryCoordinates[1],
              specialfleets,
              // thisGeoArea.specialPOIs['L60-SelectedAssets'], // changed 180712
              false,
              thisGeoArea.gaShowFloorPathNetwork
            );
          } else {
            showIndoorShortestMultiplePOIRoute(
              endpointds[0], endpointds[1],
              specialfleets,
              // thisGeoArea.specialPOIs['L60-SelectedAssets'], // changed 180712
              false,
              thisGeoArea.gaShowFloorPathNetwork
            );
          }
        }
      }
    }, 2000)
    if (multiFloorNav.fromFloorId === null) {
      window.localStorage.removeItem('fromNavPath');
      setOpactiyOnMap(thisGeoArea);
    }
    /** End */
  },
  addFloorMap: function () {
    if (!this.gaShowFloorMaps) return;
    var floor = this.floorToShow;
    /*   if (this.gaFloors.indexOf(floor) >= 0) // changes on building image 180625
           this.gafloorMap = addFloorMapOverlay(this.gaFloorMapsUrls[floor], this.gaFloormapcoords[floor], this.showFloorResizeMarkers);
       else
           this.gafloorMap = null;*/
    if (floor === '') {
      floor = 0;
      this.gafloorMap = addFloorMapOverlay(this.gaFloorMapsUrls[floor], this.gaFloormapcoords[floor], this.showFloorResizeMarkers);
    }
    if (this.gaFloors.indexOf(floor) >= 0) {
      this.gafloorMap = addFloorMapOverlay(this.gaFloorMapsUrls[floor], this.gaFloormapcoords[floor], this.showFloorResizeMarkers);
    }
    if (this.gafloorMap != null) this.gafloorMap.addTo(this.map);

    // SREENADH: Restore any previous navigation paths for this floor
    restorePrevMultifloorNavPaths(this);
  },
  addIndoorContextMenu: function () {
    if (this.rectForIndoorContextMenu != null) this.map.removeLayer(this.rectForIndoorContextMenu); //Clear any previous rects
    window.removeIndoorRoute();
    window.removePrevIndoorCoords();
    if (this.gaFloorPathBounds != null) {
      this.rectForIndoorContextMenu = L.polygon(this.gaFloorPathBounds, {
        stroke: '#ffffff',
        opacity: '0',
        weight: 3.5,
        fillOpacity: 0,
        interactive: true,
        bubblingMouseEvents: false
      });
      this.rectForIndoorContextMenu.addTo(this.map);
      bindIndNavContextMenu(this.rectForIndoorContextMenu, this);
      //  bindIndNavContextMenu(this.rectForIndoorContextMenu, this);
      /*this.rectForIndoorContextMenu.on('contextmenu', function (e) {
          alert("CONTEXT MENU CLICKED");
          flShow = this.floorToShow;
          if (flShow === "") flShow = this.gaFloors[0];
          initializeRouter(this.map, this.gaFloorPathUrls[flShow]);
       //   showIndoorRoute(this.map, this.gaFloorPathUrls[flShow], this.gaShowFloorPathNetwork, null, null, null, null, false);
      }.bind(this));
      */
    }
  },
  addFloorMapSelectionControl: function () {
    if (!this.gaShowFloorMaps) return;
    if (this.gaFloorSelectionControl != null) {
      this.gaFloorSelectionControl.addTo(this.map)
      // if (this.gaFloorSelectionControlHeatMap != null)
      //     this.gaFloorSelectionControlHeatMap.addTo(this.map)
    };
  },
  removeFloorMap: function () {
    if (this.gafloorMap != null) this.gafloorMap.remove();

  },
  removeFloorMapSelectionControl: function () {
    if (this.gaFloorSelectionControl != null) {
      this.gaFloorSelectionControl.remove();
      // if (this.gaFloors != 0)
      // this.gaFloorSelectionControlHeatMap.remove()
    };
  },
  onRemove: function () {
    this.clearLayers();
    this.removeFloorMap();
    this.removeFloorMapSelectionControl();
    L.LayerGroup.prototype.onRemove.call(this, this.map);
  },
  onAdd: function () {
    this.clearLayers(); //Clear any existing markers, images.. in layers
    this.removeFloorMap();
    this.removeFloorMapSelectionControl();
    this.specialPOIs = {};
    addGeoAreaOverlay(this,
      this.gaGeojsonurl, this.gaFloorMapsUrls, this.gaFloormapcoords, this.gaFloors, this.floorToShow, this.disableClusterAtZoom);
    if (getAllUrlParams().api == 'local') {
      this.addFloorMap();
    }
    this.addFloorMapSelectionControl();
    L.LayerGroup.prototype.onAdd.call(this, this.map);
  },
  /****** START GEOJSON LOADING **************************/
  onEachFeature: function (feature, layer) {
    //Store the JSON feature properties to the layer to retrieve and display during onclick
    layer.properties = feature.properties;
    if (feature.properties.special != 'true') {
      layer.setOpacity(1); // to set opacity on Markers
    } else {
      if (feature.properties.addedToCart === true || feature.properties.predefinedPath === true) {
        layer.setOpacity(1);
      } else {
        layer.setOpacity(0); // to set opacity on Markers
      }
    }
    // dont attache context menu here since all layers may not be loaded
    if (this.gaPopupCallback) {
      layer.on('click', gaPopupCallback);
      if (feature.fleetId == parseInt(getAllUrlParams().cfleetid) && getAllUrlParams().pn !== 'cartaddedassets' &&
        window.localStorage.getItem('navigate') !== 'true' && getAllUrlParams().pn !== 'predefinedaddedassets') {
        // setTimeout(function () {
        var latlng = {
          "lat": feature.geometry.coordinates[1],
          "lng": feature.geometry.coordinates[0]
        }
        window.localStorage.setItem('ordinates', JSON.stringify(latlng));
        var onmap = window.localStorage.getItem('showonmap');
        // }
        var checkiskiosk = window.localStorage.getItem('devicetypecheck');
        if (checkiskiosk === 'true') {
          parent.window.dispatchEvent(new Event('custom-event12'));
        } else {
        }
        // }, 1000);
      } else {
        layer.on('click', gaPopupCallback);

      }
    } else {
      layer.on('click', displayFleetInfo);
    }
    if (feature.properties.special === "true" || feature.properties.special === true) {
      if (getAllUrlParams().pn !== 'cartaddedassets' && getAllUrlParams().pn !== 'predefinedaddedassets' || window.localStorage.getItem('clearPath') === 'true') {

        // if (feature.properties.predefinedPath !== undefined) {
        //   if (!(feature.properties.routeName in this.specialPOIs)) { //  181009 enable fleettype language varible code
        //     this.specialPOIs[feature.properties.routeName] = [
        //       [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]
        //     ];
        //     this.specialPOIs[feature.properties.routeName].icontype = feature.properties.facilityIconFileName;
        //   } else {
        //     this.specialPOIs[feature.properties.routeName].push([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
        //   }
        // } else {
        if (feature.properties.displayName !== undefined && languagecode != 'en' && feature.properties.displayName[languagecode]) {
          if (!(feature.properties.displayName[languagecode] in this.specialPOIs)) { //  181009 enable fleettype language varible code
            this.specialPOIs[feature.properties.displayName[languagecode]] = [
              [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]
            ];
            this.specialPOIs[feature.properties.displayName[languagecode]].icontype = feature.properties.iconName;
            this.specialPOIs[feature.properties.displayName[languagecode]].facilityTypeDisplayName = feature.properties.facilityTypeDisplayName;
          } else {
            this.specialPOIs[feature.properties.displayName[languagecode]].push([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
          }
        } else {
          if (!(feature.properties.facilityType in this.specialPOIs)) { //  181009 enable fleettype language varible code
            this.specialPOIs[feature.properties.facilityType] = [
              [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]
            ];
            this.specialPOIs[feature.properties.facilityType].icontype = feature.properties.iconName;
            this.specialPOIs[feature.properties.facilityType].facilityTypeDisplayName = feature.properties.facilityTypeDisplayName;
          } else {
            this.specialPOIs[feature.properties.facilityType].push([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
          }
        }

        //  }

      } else {
        if (feature.properties.addedToCart) {
          var selectedAssetsType = 'L60-SelectedAssets'
          if (!(feature.properties.groupLocate in this.specialPOIs)) {
            this.specialPOIs[selectedAssetsType] = [
              [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]
            ];
            this.specialPOIs[selectedAssetsType].icontype = feature.properties.iconName;
            this.specialPOIs[selectedAssetsType].facilityTypeDisplayName = feature.properties.facilityTypeDisplayName;
            this.specialPOIs[selectedAssetsType].action = (feature && feature.action) ? feature.action : '';
          } else
            this.specialPOIs[selectedAssetsType].push([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
        } else if (feature.properties.predefinedPath !== undefined) {
          if (!(feature.properties.routeName in this.specialPOIs)) { //  181009 enable fleettype language varible code
            this.specialPOIs[feature.properties.routeName] = [
              [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]
            ];
            this.specialPOIs[feature.properties.routeName].icontype = feature.properties.iconName;
            this.specialPOIs[feature.properties.routeName].facilityTypeDisplayName = feature.properties.facilityTypeDisplayName;
          } else {
            this.specialPOIs[feature.properties.routeName].push([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
          }

        } else {
          if (feature.properties.displayName !== undefined && languagecode != 'en') {
            if (!(feature.properties.displayName[languagecode] in this.specialPOIs)) { //  181009 enable fleettype language varible code
              this.specialPOIs[feature.properties.displayName[languagecode]] = [
                [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]
              ];
              this.specialPOIs[feature.properties.displayName[languagecode]].icontype = feature.properties.iconName;
              this.specialPOIs[feature.properties.displayName[languagecode]].facilityTypeDisplayName = feature.properties.facilityTypeDisplayName;
            } else {
              this.specialPOIs[feature.properties.displayName[languagecode]].push([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
            }
          } else {
            if (!(feature.properties.facilityType in this.specialPOIs)) { //  181009 enable fleettype language varible code
              this.specialPOIs[feature.properties.facilityType] = [
                [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]
              ];
              this.specialPOIs[feature.properties.facilityType].icontype = feature.properties.iconName;
              this.specialPOIs[feature.properties.facilityType].facilityTypeDisplayName = feature.properties.facilityTypeDisplayName;
            } else {
              this.specialPOIs[feature.properties.facilityType].push([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
            }
          }
        }
      }
    }
    return;
  },
  pointToLayer: function (feature, latlng) {
    //return L.marker(latlng);
    if (feature.facilityId == parseInt(getAllUrlParams().cfleetid) && getAllUrlParams().pn !== 'cartaddedassets' && getAllUrlParams().pn !== 'predefinedaddedassets') { // to set pin for normal floor plan
      // feature.properties.pin = "asset-icon-marker bgcolor";
    }
    if (feature.properties) {
      var facilityIconFileName = mapsettingsblock.map_settings?.is_marker_enabled ? feature.properties.iconName : '';
      var iconColor = feature.properties.FacilityTypeBackgroundColor;
      var markerIcon =
        mapsettingsblock.map_settings &&
          mapsettingsblock.map_settings.icon &&
          mapsettingsblock.map_settings.icon.icon_class_name
          ? mapsettingsblock.map_settings.icon.icon_class_name
          : 'asset-icon-marker-with-circle';
      if (iconColor) {
        var gIcon;
        if (facilityIconFileName) {
          gIcon =
            // createIcon(facilityIconFileName, iconColor, feature.properties.pin);
            createIcon(facilityIconFileName, feature.properties.FacilityTypeBackgroundColor, feature.properties.pin, feature.properties.facilityType, markerIcon);
        }
        //        gIcon = createDivIcon(iconColor);
        else {
          if (getAllUrlParams().fp == 'true' && (facilityIconFileName == '' || facilityIconFileName == undefined)) {
            if (feature.properties.pin != undefined) {
              facilityIconFileName = markerIcon + 'bgcolor';
              iconColor = 'red';
            } else {
              facilityIconFileName = '';
              iconColor = '';
            }
          } else {
            facilityIconFileName = 'dot-maper';
          }
          gIcon =
            createIcon(facilityIconFileName, iconColor, feature.properties.pin);
        }
        //
        //
        var mapmarks = L.marker(latlng, {
          icon: gIcon
        });
        //  bindIndNavContextMenu(mapmarks, this);
        return mapmarks;
      }
    }
  },
  filterGeoJsonOpts: function (mIconColor, floor) {
    var geojsonOpts = {
      pointToLayer: this.pointToLayer.bind(this),
      onEachFeature: this.onEachFeature.bind(this),
      filter: function (feature, layer) {
        if (feature.properties.iconcolor && feature.properties.iconcolor === mIconColor) {
          //iconcolor matches the cluster color
          if (floor === null) return true; // Show all floors
          if ((!feature.properties.level && floor === "0") //level is not defined in json or current floor is zero
            ||
            (feature.properties.level === floor)) // level is defined in json and matches the current floor
            return true;
          else return false;
        } else return false;
      }
    };
    return geojsonOpts;
  },
  filterGeoJsonOptsNotIn: function (mIconColors, floor) {
    var geojsonOpts = {
      pointToLayer: this.pointToLayer.bind(this),
      onEachFeature: this.onEachFeature.bind(this),
      filter: function (feature, layer) {
        if (mIconColors.indexOf(feature.properties.iconcolor) > -1)
          return false;
        //iconcolor not in the set of predefined cluster colors
        if (floor === null) return false; // Show all floors
        if ((!feature.properties.level && floor === "0") //level is not defined in json but current floor is zero
          ||
          (feature.properties.level === floor)) // level is defined in json and matches the current floor
          return true;
        else
          return false;
      }
    };
    return geojsonOpts;
  },
  createMarkerCluster: function (mColor, position, disableClusterAtZoom) {
    var clstGrp = L.markerClusterGroup({
      iconCreateFunction: function (cluster) {
        // get all Child markers of the cluster
        var markers = mapsettingsblock.map_settings?.is_marker_enabled ? cluster.getAllChildMarkers() : [];
        var fleetsLength;

        var numPins = 0;
        for (i = 0; i < markers.length; i++) {
          if (markers[i].properties.pin) numPins++;
        }
        // if (window.localStorage.getItem('groupLocLength') === 'groupLocLength') {
        //   fleetsLength = window.localStorage.getItem('groupLocateLength');
        // } else {
        //   fleetsLength = markers.length;
        // }
        fleetsLength = markers.length;
        var options = {
          iconSize: [30, 30],
          iconAnchor: position,
          isAlphaNumericIcon: true,
          text:
            // '<div style="line-height:70%;">' +
            // numPins +
            //   '<br>--<br>' +
            fleetsLength,
          //  '</div>',
          iconShape: 'circle',
          borderColor: 'white',
          backgroundColor: mColor,
          textColor: 'white',
          innerIconStyle: 'font-weight:bold;font-size:10px;padding-top:8px;'
        };
        return L.BeautifyIcon.icon(options);
      },
      // spiderfyOnMaxZoom: true,
      //singleMarkerMode: true,
      disableClusteringAtZoom: disableClusterAtZoom,
      removeOutsideVisibleBounds: true
    });
    return clstGrp;
  }
});

function updateOtherProperties(dataObj, displayproperties, otherproperties, displayColumns) {
  $.each(dataObj, function (index, value) {
    if (displayproperties.indexOf(index) > -1) {
      var concatOp = '';
      var oldValue = otherproperties[displayColumns[displayproperties.indexOf(index)]];
      var indexValue = displayColumns[displayproperties.indexOf(index)];
      if (indexValue == 'Fleet Address' || indexValue == 'Resource Address' || indexValue == 'Address') {
        concatOp = ', ';
      } else if (indexValue == 'Resource Name' || indexValue == 'User Name') {
        concatOp = ' ';
      } else if (indexValue == 'Work #' || indexValue == 'Mobile #') {
        if (value.includes('-')) {
          var valuearr = value.split('-');
          if (valuearr.length == 2) {
            value = valuearr[0].trim();
          }
        }
        var concatOp = '-';
      }
      if (!oldValue) {
        otherproperties[displayColumns[displayproperties.indexOf(index)]] = value;
      } else if (oldValue && value && value != 'null' && concatOp) {
        otherproperties[displayColumns[displayproperties.indexOf(index)]] = otherproperties[displayColumns[displayproperties.indexOf(index)]] + concatOp + value;
      }
    } else if (typeof (value) == 'object' && value != null && displayproperties.indexOf(index) <= -1) {
      updateOtherProperties(value, displayproperties, otherproperties, displayColumns);
    }
  });
}

function displayFleetInfo(e) {
  feature = e.target;
  popupLocation = e.latlng;
  var popupContent = '<iframe src="https://www.youtube.com/embed/1?autoplay=1"></iframe>';
  var popup = L.popup({
    maxHeight: 100,
    maxWidth: 100
  });
  popup
    .setLatLng(popupLocation)
    .setContent(popupContent)
    .openOn(map);
};

/*
** Create separate clusters for each of the iconColors and club the
remaining in blue
*/
function addGeoJsonFloorLayer(geoAreaLayer, json, floor, disableClusterAtZoom) {
  //geoAreaLayer.gaGeoJsonLayers[floor]=new L.LayerGroup();
  // this.totaljson = json;
  var iconColors = getUniqueColorPropertiesFromJson(json); // ["Red", "Yellow", "Green"];
  var i, s, len = iconColors.length;
  var geojsonOpts, geojson, markercluster;
  var geojsonOpts =
    geoAreaLayer.filterGeoJsonOptsNotIn(iconColors, floor);
  // Automatically calculate the disablecluster at zoom if it is -1
  if (disableClusterAtZoom === -1) {
    var geojson = L.geoJSON(json);
    disableClusterAtZoom = map.getBoundsZoom(geojson.getBounds());
  }
  geojson = L.geoJSON(json, geojsonOpts);
  var cIconX = 0,
    cIconY = 0; //to prevent overlap of cluster icons
  if (Object.keys(geojson._layers).length > 0) {
    var markerCluster = mapsettingsblock.map_settings?.is_marker_enabled ? geoAreaLayer.createMarkerCluster("blue", [0, 0], disableClusterAtZoom) : '';
    if (markerCluster) {
      markerCluster.addLayer(geojson);
    }
    map.on('moveend', function (a) {
      // animationend
      setOpactiyOnMap(geoAreaLayer);
      //    setOpactiyOncluster(geoAreaLayer, a.target)
    }); //.bind(geoAreaLayer));
    if (markerCluster) {
      geoAreaLayer.addLayer(markerCluster);
    }
    cIconX += 30;
  }

  for (i = 0; i < len; ++i) {
    var mColor = iconColors[i];
    geojsonOpts = geoAreaLayer.filterGeoJsonOpts(mColor, floor);
    geojson = L.geoJSON(json, geojsonOpts);
    if (Object.keys(geojson._layers).length > 0) {
      markerCluster =
        geoAreaLayer.createMarkerCluster(mColor, [cIconX, cIconY], disableClusterAtZoom);
      cIconX += 30;
      markerCluster.addLayer(geojson);

      map.on('moveend', function (a) {
        setOpactiyOnMap(geoAreaLayer);
        // setOpactiyOncluster(geoAreaLayer, a.target)
      }); //.bind(geoAreaLayer));
      geoAreaLayer.addLayer(markerCluster);
    }
  }
}

function enableContextMenuOnMarker(geoAreaLayer) {
  geoAreaLayer.eachLayer(function (layer) {
    //  dont show special fleets on map loading
    layer.getLayers().forEach(function (mk) {
      bindIndNavContextMenu(mk, geoAreaLayer); // to show special icon on map context menu
    })
  });
}
// To set opacity for enable and disabled special fleets.
function setOpactiyOnMap(geoAreaLayer) {
  if (localStorage.getItem('fromNavPath') !== 'fromNavPath') {
    geoAreaLayer.eachLayer(function (layer) {
      if (geoAreaLayer.enabledspecial == false) { //  dont show special fleets on map loading
        try {
          layer.getLayers().forEach(function (mk) {
            if (mk.properties.special != "true") {
              mk.setOpacity(1);
            } else {
              if (mk.properties.addedToCart === true || mk.properties.predefinedPath === true) {
                mk.setOpacity(1);
                if (window.localStorage.getItem('showallFleets') !== 'showallFleets') {
                  nearFleets = true;
                }
              } else if (mk.feature.facilityId == parseInt(getAllUrlParams().cfleetid) || (window.localStorage.getItem('searchwith') === 'facilityName' && mk.feature.facilityId === parseInt(window.localStorage.getItem('searchedId')))) {
                // } else if (mk.feature.fleetId == parseInt(getAllUrlParams().cfleetid)|| mk.feature.fleetId == window.localStorage.getItem('searchedId')) {
                // changed from === to ==
                mk.setOpacity(1);
              } else {
                mk.setOpacity(0);
              }
            }
          })
        } catch (err) { }
      } else { //  dont show special fleets on map loading
        //  clearMultiFloorNavData();
        try {
          layer.getLayers().forEach(function (mk) {
            clearMultiFloorNavData();
            // to show special icon on map context menu
            if (mk.properties.displayName !== undefined && languagecode != 'en') {
              if (thisGeoArea.enabledspecial === mk.properties.displayName[languagecode] || mk.feature.facilityId == window.localStorage.getItem('searchedId')) { // to show current fleet 181009 enable fleettype language varible code
                mk.setOpacity(1);
              } else {
                mk.setOpacity(0);
              }
            } else {
              if (thisGeoArea.enabledspecial === mk.properties.facilityType || mk.feature.facilityId == window.localStorage.getItem('searchedId')) { // to show current fleet 181009 enable fleettype language varible code
                mk.setOpacity(1);
              } else {
                mk.setOpacity(0);
              }
            }
          })
        } catch (err) { }
      }
    });
    if ((nearFleets === true && getAllUrlParams().pn === 'cartaddedassets') || (nearFleets === true && getAllUrlParams().pn === 'predefinedaddedassets')) {
      var startLat = window.localStorage.getItem('startboundlat');
      var startLon = window.localStorage.getItem('startboundlan');
      var endLat = window.localStorage.getItem('endboundlat');
      var endLon = window.localStorage.getItem('endboundlan');
      groupLocateFleets(startLat, startLon, endLat, endLon);
    }
  } else {
    var latitude = localStorage.getItem('pathCoordinateslat');
    var langitude = localStorage.getItem('pathCoordinateslng');
    nearestFleets(latitude, langitude);
  }
}
function groupLocateFleets(startLat, startLon, endLat, endLon) {
  if (window.localStorage.getItem('showallFleets') !== 'showallFleets') {
    var condObj = [];
    var resObj = [];
    var resultObj = [];
    var constObj = [];
    var radiusMeters = localStorage.getItem('radiusMeters')
    var showFleets = localStorage.getItem('showFleets');
    window.localStorage.setItem('startboundlat', startLat);
    window.localStorage.setItem('startboundlan', startLon);
    window.localStorage.setItem('endboundlat', endLat);
    window.localStorage.setItem('endboundlan', endLon);
    var entryLan;
    var entryLon;
    if (localStorage.getItem('currentpostion')) {
      var currentpostion = JSON.parse(localStorage.getItem('currentpostion'));
      entryLan = currentpostion.latitude;
      entryLon = currentpostion.longitude;
    } else {
      var selectedassetsfloorarr = JSON.parse(window.localStorage.getItem('multifloorselectedAssets'));
      if (selectedassetsfloorarr) {
        var floorEntryCoordinates = entrycordinates[selectedassetsfloorarr[0]];
        entryLan = floorEntryCoordinates[0];
        entryLon = floorEntryCoordinates[1];
      } else {
        entryLan = startLat;
        entryLon = startLon;
      }
    }
    // var bounds = L.latLng(entryLan, entryLon).toBounds(radiusMeters);

    if (startLat !== null && startLon !== null && startLat !== 'null' && startLon !== 'null') {
      var startBounds = L.latLng(startLat, startLon).toBounds(radiusMeters);
    }
    if (endLat !== null && endLon !== null && endLat !== 'null' && endLon !== 'null') {
      var endBounds = L.latLng(endLat, endLon).toBounds(radiusMeters);
    }
    if (Object.keys(thisGeoArea.specialPOIs).length > 0) { // condition for when we click on multifloor
      thisGeoArea.eachLayer(function (layer) {
        try {
          layer.getLayers().forEach(function (sk) {
            sk.setOpacity(0);
            if (sk.properties.addedToCart === true || sk.properties.predefinedPath === true) {
              condObj.push(sk);
            } else if (thisGeoArea.enabledspecial === sk.properties.fleetType || thisGeoArea.enabledspecial === sk.properties.routeName) {
              condObj.push(sk);
            }
            if (bounds.contains(sk._latlng) == true) {
              var distance = getDistanceFromLatLonInKm(entryLan, entryLon, sk._latlng.lat, sk._latlng.lng);
              sk._distancekm = distance;
              resObj.push(sk);
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
            if (startBounds.contains(sk._latlng) == true) {
              var distance = getDistanceFromLatLonInKm(startLat, startLon, sk._latlng.lat, sk._latlng.lng);
              sk._distancekm1 = distance;
              resultObj.push(sk);
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
            if (endBounds.contains(sk._latlng) == true) {
              var distance = getDistanceFromLatLonInKm(endLat, endLon, sk._latlng.lat, sk._latlng.lng);
              sk._distancekm2 = distance;
              constObj.push(sk);
              constObj.sort(function (x, y) {
                if (x._distancekm2 === y._distancekm2) {
                  return 0;
                }
                if (x._distancekm2 > y._distancekm2) {
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
        resObj[i].setOpacity(1);
      }
      resultObj = resultObj.slice(0, showFleets)
      for (var k = 0; k < resultObj.length; k++) {
        resultObj[k].setOpacity(1);
      }
      constObj = constObj.slice(0, showFleets)
      for (var l = 0; l < constObj.length; l++) {
        constObj[l].setOpacity(1);
      }
      for (var j = 0; j < condObj.length; j++) {
        condObj[j].setOpacity(1);
      }
    } else {
      thisGeoArea.eachLayer(function (layer) {
        try {
          layer.getLayers().forEach(function (sk) {
            sk.setOpacity(0);
          })
        } catch (error) { }
      });
    }
  }
}

function setOpactiyOncluster(geoAreaLayer, markercl) {
  var markers = markercl.getLayers();
  if (geoAreaLayer.enabledspecial == false) { //  dont show special fleets on map loading

    markers.forEach(function (mk) {
      if (markercl.getVisibleParent(mk) != mk) return;
      if (mk.properties.special != "true") {
        mk.setOpacity(1);
      } else {
        if (mk.feature.fleetId == parseInt(getAllUrlParams().cfleetid)) {
          mk.setOpacity(1);
        } else {
          mk.setOpacity(0);
        }
      }
    })
  } else { //  dont show special fleets on map loading
    markers.forEach(function (mk) {
      if (markercl.getVisibleParent(mk) != mk) return;
      // to show special icon on map context menu
      if (mk.properties.displayName !== undefined && languagecode != 'en') {
        if (thisGeoArea.enabledspecial === mk.properties.displayName[languagecode]) { // to show current fleet  181009 enable fleettype language varible code
          mk.setOpacity(1);
        } else {
          mk.setOpacity(0);
        }
      } else {
        if (thisGeoArea.enabledspecial === mk.properties.fleetType) { // to show current fleet  181009 enable fleettype language varible code
          mk.setOpacity(1);
        } else {
          mk.setOpacity(0);
        }
      }
    })
  }

}

function addGeoAreaOverlayToenableHeatMap(geoAreaLayer, gaGeojsonurl, gaFloorMapsUrls, gaFloormapcoords, gaFloors, floorToShow, disableClusterAtZoom) {
  if (gaGeojsonurl != null) {
    $.getJSON(gaGeojsonurl,
      createCallback(geoAreaLayer, gaGeojsonurl, gaFloorMapsUrls, gaFloormapcoords, gaFloors, floorToShow, disableClusterAtZoom));
  }
}

function addGeoAreaOverlay(geoAreaLayer, gaGeojsonurl, gaFloorMapsUrls, gaFloormapcoords, gaFloors, floorToShow, disableClusterAtZoom) {
  if (getAllUrlParams().ut === 'locate' && geojsonUrl.substring(0, 2) === 'lc') {
    var fn = createCallback(geoAreaLayer, gaGeojsonurl, gaFloorMapsUrls, gaFloormapcoords, gaFloors, floorToShow, disableClusterAtZoom);
    var listjson = JSON.parse(localStorage.getItem(gaGeojsonurl));
    if (getAllUrlParams().fp == 'true') {
      fn(listjson['floorsData']);
    } else {
      fn(listjson);
    }
    if (getAllUrlParams().fp == 'true' && getAllUrlParams().api != 'local') {
      if (floorToShow) {
        geoAreaLayer.enableHeatMap(lrObj.floorid);
      }
    }
  } else if (gaGeojsonurl != null) {
    $.getJSON(gaGeojsonurl,
      createCallback(geoAreaLayer, gaGeojsonurl, gaFloorMapsUrls, gaFloormapcoords, gaFloors, floorToShow, disableClusterAtZoom));
  }
}

function createCallback(geoAreaLayer, gaGeojsonurl, gaFloorMapsUrls, gaFloormapcoords, gaFloors, floorToShow, disableClusterAtZoom) {
  return function (json) {
    if (json !== undefined) {
      json = json;
    }
    if (json.facilitiesData) {
      json = CreateHeatMapJson(json); // Geo json Heat map creation method
    }
    var numFloors = gaFloors.length;

    if ((floorToShow === null) || (gaFloors.indexOf(floorToShow) < 0)) {
      addGeoJsonFloorLayer(geoAreaLayer, json, null, disableClusterAtZoom);
    } else {
      addGeoJsonFloorLayer(geoAreaLayer, json, floorToShow, disableClusterAtZoom);
    }
    geoAreaLayer.addIndoorContextMenu();
    enableContextMenuOnMarker(geoAreaLayer);

  }
}
//***************************FLOOR MAP FUNCTIONS******************************************/
function transformXY(XCoord, YCoord, rotX, rotY, rotAngle) {
  //X1 = Cos(angle)*X - Sin (angle)*Y
  //Y1 = Sin(angle)*X + Cos (angle)*Y
  var TXCoord = XCoord - rotX;
  var TYCoord = YCoord - rotY;
  var TX = Math.cos(rotAngle) * TXCoord - Math.sin(rotAngle) * TYCoord;
  var TY = Math.sin(rotAngle) * TXCoord + Math.cos(rotAngle) * TYCoord;
  return [TX + rotX, TY + rotY];
}

function addFloorMapOverlay(imgurl, mFloorMapCoords, showEdgeMarkers) {
  var overlay;
  var marker1, marker2, marker3;

  function repositionFloorMap() {
    overlay.reposition(marker1.getLatLng(), marker2.getLatLng(), marker3.getLatLng());
  };
  if (imgurl == null) {
    return null;
  }
  var point1 = mFloorMapCoords[0], // mFloorMapCoords[0], //L.latLng(mltx, mlty),
    point2 = mFloorMapCoords[1], //L.latLng(mrtx, mrty),
    point3 = mFloorMapCoords[2]; //L.latLng(mrbx, mrby);
  // Infer coordinate of bottom right
  // var point4 = [point2[0]-point1[0]+point3[0],point2[1]-point1[1]+point3[1]]
  // rect=   L.rectangle([point1,point2,point3,point4], {color: 'red', weight: 1, fillOpacity: 0.03, interactive: true}).addTo(map);
  // rect.bindContextMenu({
  //      contextmenu: true,
  //      contextmenuInheritItems: true,
  //      contextmenuItems: [ {
  //      text: 'Polygon marker item' }]
  //  });
  if (showEdgeMarkers) {
    marker1 = L.marker(point1, {
      draggable: true
    }).addTo(map).bindPopup("HELLO: " + imgurl);
    marker2 = L.marker(point2, {
      draggable: true
    }).addTo(map).bindPopup("HELLO: " + imgurl);;
    marker3 = L.marker(point3, {
      draggable: true
    }).addTo(map).bindPopup("HELLO: " + imgurl);;
    marker1.on('drag dragend', repositionFloorMap).on('click', getPreciseLocationDetails);
    marker2.on('drag dragend', repositionFloorMap).on('click', getPreciseLocationDetails);
    marker3.on('drag dragend', repositionFloorMap).on('click', getPreciseLocationDetails);

    function getPreciseLocationDetails(ev) {
      var latlng = map.mouseEventmultiFloorNav.toLatLng(ev.originalEvent);

    }
  }
  //overlay = L.imageOverlay(imgurl,[point2,point3]);
  overlay = L.imageOverlay.rotated(imgurl, point1, point2, point3, {
    opacity: 1,
    //	interactive: true
    //	attribution: "&copy; <a href='http://christ-church.org.nz/'>CHRIST CHURCH</a>"
  });
  //map.addLayer(overlay);
  return overlay;
}

function getContextMenuItems(thisGeoArea) {
  let mapNamesObj = JSON.parse(window.localStorage.getItem('mapNameObj'))

  var contextScrollPois = [];
  var t = [{
    // text: thisGeoArea.gaName + ": " + thisGeoArea.floorToShow,
    text: mapNamesObj.indoors, //'Indoors',
    disabled: true
  }, {
    text: mapNamesObj.directionsfrom, // 'Directions from',
    icon: '../dist/images/play.png',
    callback: setIFromLatLon
  }, {
    text: mapNamesObj.directionsto, // 'Directions to',
    icon: '../dist/images/pause.png',
    callback: setIToLatLon
  },];
  // if (getAllUrlParams().pn != 'cartaddedassets' || (getAllUrlParams().pn === 'cartaddedassets' && window.localStorage.getItem('clearPath') === 'true')) {
  t.push({
    text: mapNamesObj.clear, // 'Clear',
    icon: '../dist/images/layers.png',
    callback: clearIPath
  }, '-', {
    text: mapNamesObj.showall, // 'Show All',
    icon: '',
    callback: showAll
  },
    '-');
  // }
  /*

     for (var poi in thisGeoArea.specialPOIs) {

         menuItem={
             text: poi,
             icon: 'dist/images/run.png',
             callback: (function(mPoi){
                             return function(e){
                                 showIndoorNearestPOIRoute(
                                     thisGeoArea.map,
                                     thisGeoArea.gaFloorPathUrls[thisGeoArea.floorToShow],
                                     thisGeoArea.gaShowFloorPathNetwork,
                                     e.latlng.lat,e.latlng.lng,
                                     thisGeoArea.specialPOIs[mPoi],
                                     true
                                 )
                             }
                         })(poi)
         };
         t.push(menuItem);
     }
     */
  /*Another iteration syntax*/
  Object.keys(thisGeoArea.specialPOIs)
    .map(function (poi) {
      var poinname = poi;
      //SREENADH: May not work in android TV. Use .indexOf instead
      if (poi.includes("-")) {
        var poin = poi.split("-");
        poinname = poin[1];
      } else {
        poinname = poi;
      }
      // getAllUrlParams().pn != 'cartaddedassets' || (getAllUrlParams().pn === 'cartaddedassets' &&
      var menuItem = {
        text: thisGeoArea.specialPOIs[poi].facilityTypeDisplayName,
        iconCls: thisGeoArea.specialPOIs[poi].icontype,
        /* callback: function (e) {
             showIndoorNearestPOIRoute(
                 thisGeoArea.map,
                 thisGeoArea.gaFloorPathUrls[thisGeoArea.floorToShow],
                 thisGeoArea.gaShowFloorPathNetwork,
                 e.latlng.lat, e.latlng.lng,
                 thisGeoArea.specialPOIs[poi],
                 true
             )
         }*/
        callback: function (e) {
          if (theMarker != undefined) {
            map.removeLayer(theMarker);
          };
          nearSpecialPath = true;
          thisGeoArea.enabledspecial = poi;
          window.localStorage.removeItem('fromNavPath');
          // changes for near by fleets
          nearFleets = true;
          window.localStorage.removeItem('showallFleets');
          setOpactiyOnMap(thisGeoArea);
          //showIndoorNearestPOIRoute(
          if (localStorage.getItem('currentpostion')) {
            var currentpostion = JSON.parse(localStorage.getItem('currentpostion'));
            var startLat = currentpostion.latitude;
            var startLon = currentpostion.longitude;
          } else {
            var startLat = e.latlng.lat;
            var startLon = e.latlng.lng;
          }
          clearPolylines(); // animation path clear 190116
          navAnimationPolylinesColour = true; // need of color for Polylines 190123
          groupAnimationpathMove = true;
          showIndoorShortestMultiplePOIRoute(
            // thisGeoArea.map,
            // thisGeoArea.gaFloorPathUrls[thisGeoArea.floorToShow],
            //  thisGeoArea.gaShowFloorPathNetwork,
            startLat, startLon,
            thisGeoArea.specialPOIs[poi],
            true,
            thisGeoArea.gaShowFloorPathNetwork
          )
        }
      };
      // t.push(menuItem);
      //  }
      if (menuItem.text !== 'SelectedAssets') {
        contextScrollPois.push(menuItem);
      }

      function compare(a, b) {
        if (a.text < b.text)
          return -1;
        if (a.text > b.text)
          return 1;
        return 0;
      }
      contextScrollPois.sort(compare);
    });
  var test = {};
  for (i = 0; i < contextScrollPois.length; i++) {
    t.push(contextScrollPois[i]);
  }

  function setIFromLatLon(e) {
    clearPolylines(); // animation path clear 190116
    navAnimationPolylinesColour = false; // need of color for Polylines 190123
    /*flShow = thisGeoArea.floorToShow;
    if (flShow === "") flShow = thisGeoArea.gaFloors[0];
    */
    window.localStorage.setItem('fromNavPath', 'fromNavPath');
    thisGeoArea.map.removeControl(controlBookmark);
    multiFloorNav.fromBuildingName = thisGeoArea.gaName;
    multiFloorNav.fromFloorId = thisGeoArea.floorToShow;
    multiFloorNav.fromLatLng = [e.latlng.lat, e.latlng.lng];
    clearMultiFloorPopups();
    if (multiFloorNav.toBuildingName === null) {
      showIndoorRoute(multiFloorNav.fromLatLng[0], multiFloorNav.fromLatLng[1], null, null, false, thisGeoArea.gaShowFloorPathNetwork);
    } else if (multiFloorNav.fromBuildingName === multiFloorNav.toBuildingName) {
      if (multiFloorNav.fromFloorId === multiFloorNav.toFloorId) {
        showIndoorRoute(multiFloorNav.fromLatLng[0], multiFloorNav.fromLatLng[1], multiFloorNav.toLatLng[0], multiFloorNav.toLatLng[1], false, thisGeoArea.gaShowFloorPathNetwork);
      } else {
        doMultiFloorNavigation(thisGeoArea);
        //showIndoorRoute(multiFloorNav.fromLatLng[0],multiFloorNav.fromLatLng[1],multiFloorNav.fromExit[0],multiFloorNav.fromExit[1], false, thisGeoArea.gaShowFloorPathNetwork);
      }
    }
    // showIndoorRoute(thisGeoArea.map, thisGeoArea.gaFloorPathUrls[flShow], thisGeoArea.gaShowFloorPathNetwork, e.latlng.lat, e.latlng.lng, null, null, false);
  }

  function setIToLatLon(e) {
    clearPolylines(); // animation path clear 190116
    navAnimationPolylinesColour = false; // need of color for Polylines 190123
    /** Live navigation code changes starts - Ramohan - 181106 */
    // if (typeof liveNavigationControl !== 'undefined') map.addControl(liveNavigationControl);
    /** Live navigation code changes ends - Ramohan - 181106 */
    /*flShow = thisGeoArea.floorToShow;
    if (flShow === "") flShow = thisGeoArea.gaFloors[0];
    */
    window.localStorage.setItem('fromNavPath', 'fromNavPath');
    thisGeoArea.map.removeControl(controlBookmark);
    multiFloorNav.toBuildingName = thisGeoArea.gaName;
    multiFloorNav.toFloorId = thisGeoArea.floorToShow;
    multiFloorNav.toLatLng = [e.latlng.lat, e.latlng.lng];
    clearMultiFloorPopups();
    if (multiFloorNav.fromBuildingName === null) {
      if (localStorage.getItem('currentpostion')) {
        var currentpostion = JSON.parse(localStorage.getItem('currentpostion'));
        var startLat = currentpostion.latitude;
        var startLon = currentpostion.longitude;
        window.localStorage.setItem('navigate', 'true');
        showSpinner();
        var timestamp = Date.now();
        timeoutFunction(timestamp, startLat, startLon, multiFloorNav.toLatLng[0], multiFloorNav.toLatLng[1]);
      } else {
        showIndoorRoute(null, null, multiFloorNav.toLatLng[0], multiFloorNav.toLatLng[1], false, thisGeoArea.gaShowFloorPathNetwork);
      }
    } else if (multiFloorNav.fromBuildingName === multiFloorNav.toBuildingName) {
      if (multiFloorNav.fromFloorId === multiFloorNav.toFloorId) {
        showIndoorRoute(multiFloorNav.fromLatLng[0], multiFloorNav.fromLatLng[1], multiFloorNav.toLatLng[0], multiFloorNav.toLatLng[1], false, thisGeoArea.gaShowFloorPathNetwork);
      } else {
        doMultiFloorNavigation(thisGeoArea);
        //showIndoorRoute(multiFloorNav.toEntry[0],multiFloorNav.toEntry[1],multiFloorNav.toLatLng[0],multiFloorNav.toLatLng[1], false, thisGeoArea.gaShowFloorPathNetwork);
      }
    }
  }

  function showSpinner() {
    parent.window.dispatchEvent(new Event('custom-event'));
  }

  function clearIPath(e) {
    var instrBox = $("#instruction");
    instrBox.hide();
    if (instrMarker) {
      instrMarker.remove(map);
    }
    clearPolylines(); // animation path clear 190116
    /** Live navigation code changes starts - Ramohan - 181106 */
    // livenavpath('stop');
    // if (typeof liveNavigationControl !== 'undefined') map.removeControl(liveNavigationControl);
    /** Live navigation code changes ends - Ramohan - 181106 */
    window.localStorage.removeItem('fromNavPath');
    window.localStorage.setItem('showallFleets', 'showallFleets');
    nearFleets = false;
    window.localStorage.removeItem('searchedId');
    thisGeoArea.clearSearch();
    thisGeoArea.clearBottomSheet();
    clearMultiFloorNavData();
    window.removeIndoorRoute();
    window.removePrevIndoorCoords();
    thisGeoArea.enabledspecial = false;
    setOpactiyOnMap(thisGeoArea);
    var floorid = thisGeoArea.gaFloorIds[thisGeoArea.floorToShow]; // changed 180702 get floor id
    if (getAllUrlParams().pn !== 'cartaddedassets' && getAllUrlParams().pn !== 'predefinedaddedassets') {
      setOpactiyOnMap(thisGeoArea);
    } else {
      var enterpriseId;
      var buildingCode;
      var rotationAngle;
      if (window.localStorage.getItem('selected_enterprise')) {
        enterpriseId = window.localStorage.getItem('selected_enterprise');
        buildingCode = window.localStorage.getItem('buildingCode');
        rotationAngle = window.localStorage.getItem('rotationAngle');
      }
      else {
        enterpriseId = window.localStorage.getItem('enterprise_obj.parent_enterprise_id');
        buildingCode = window.localStorage.getItem('parentBuildingCode');
        rotationAngle = window.localStorage.getItem('parentRotationAngle');
      }
      // For selected fleets group locate clear button in map
      //   // var buildingCode = localStorage.getItem('buildingCode')
      // model bucketURL/assets/enterprises/9/facilities/MM0001/en.json
      var url = localStorage.getItem('s3bucket_url') + 'assets/enterprises/' + enterpriseId + '/facilities/' + buildingCode + '/' + languagecode + '.json';
      $.getJSON(url, function () { })
        .done(function (data) {
          window.localStorage.setItem('clearPath', true);
          window.localStorage.setItem('lcsinglefleet', JSON.stringify(data));
          thisGeoArea.updateMap();
        })
        .fail(function (err) {
          window.localStorage.setItem('clearPath', true); // changed 180702
          thisGeoArea.enableHeatMap(floorid); // changed 180702
          // If buliding json file dosen't occur in local file it will call server side building json
        })
    }

  }

  function showAll(e) {
    // removeIndoorRoute();
    // removePrevIndoorCoords();
    // thisGeoArea.enabledspecial = false;
    // setOpactiyOnMap(thisGeoArea);
    clearPolylines();
    window.localStorage.removeItem('fromNavPath');
    window.localStorage.setItem('showallFleets', 'showallFleets');
    nearFleets = false;
    window.localStorage.removeItem('searchedId');
    thisGeoArea.clearSearch();
    thisGeoArea.clearBottomSheet();
    clearMultiFloorNavData();
    window.removeIndoorRoute();
    window.removePrevIndoorCoords();
    thisGeoArea.enabledspecial = false;
    setOpactiyOnMap(thisGeoArea);
    var floorid = thisGeoArea.gaFloorIds[thisGeoArea.floorToShow]; // changed 180702 get floor id
    if (getAllUrlParams().pn !== 'cartaddedassets' && getAllUrlParams().pn !== 'predefinedaddedassets') {
      setOpactiyOnMap(thisGeoArea);
    } else {
      var enterpriseId;
      var buildingCode;
      var rotationAngle;
      if (window.localStorage.getItem('selected_enterprise')) {
        enterpriseId = window.localStorage.getItem('selected_enterprise');
        buildingCode = window.localStorage.getItem('buildingCode');
        rotationAngle = window.localStorage.getItem('rotationAngle');
      } else {
        // enterpriseId = window.localStorage.getItem('parentEnterpriseId');
        enterpriseId = JSON.parse(localStorage.getItem('selected_enterprise_obj')).parent_enterprise_id;
        buildingCode = window.localStorage.getItem('parentBuildingCode');
        rotationAngle = window.localStorage.getItem('parentRotationAngle');
      }
      // For selected fleets group locate clear button in map
      //  var buildingCode = localStorage.getItem('buildingCode')
      var url = localStorage.getItem('s3bucket_url') + 'assets/enterprises/' + enterpriseId + '/' + buildingCode + '.json';
      $.getJSON(url, function () { })
        .done(function (data) {
          window.localStorage.setItem('clearPath', true);
          window.localStorage.setItem('lcsinglefleet', JSON.stringify(data));
          thisGeoArea.updateMap();
        })
        .fail(function (err) {
          window.localStorage.setItem('clearPath', true); // changed 180702
          thisGeoArea.enableHeatMap(floorid); // changed 180702
          // If buliding json file dosen't occur in local file it will call server side building json
        })
    }

  }
  return t;
}

function bindIndNavContextMenu(mObject, thisGeoArea) {

  mObject.unbindContextMenu();
  mObject.bindContextMenu({
    contextmenu: true,
    contextmenuInheritItems: true,
    contextmenuItems: getContextMenuItems(thisGeoArea)
  });

  /** To enable special fleets list in custom context menu - start - 181120 */
  facilitiesObj = [];
  var temp = document.getElementById('bar');
  temp.innerHTML = '';
  var listContent = '';
  facilitiesObj = thisGeoArea.specialPOIs;
  var listContent = '<ul class="facilities">';
  for (var key in facilitiesObj) {
    nearSpecialPath = true;
    var spLabel = key.split('-')[1];
    if (spLabel === undefined) spLabel = key;
    listContent += "<li onclick='specialsPath(\"" + key + "\")'><a class='search-tip'>";
    listContent += "<i class='" + facilitiesObj[key]['icontype'] + "'></i>" + facilitiesObj[key]['facilityTypeDisplayName'] + "</a></li>";
  }
  listContent += '</ul>';
  temp.innerHTML = listContent;
  /** To enable special fleets list in custom context menu - end - 181120 */

  mObject.on('contextmenu', function (e) {
    var flShow = thisGeoArea.floorToShow;
    //alert("CONTEXT MENU CLICKED:" + flShow);
    if (flShow === "") flShow = thisGeoArea.gaFloors[0];
    initializeRouter(thisGeoArea.map, thisGeoArea.gaFloorPathUrls[flShow]);
    //   showIndoorRoute(this.map, this.gaFloorPathUrls[flShow], this.gaShowFloorPathNetwork, null, null, null, null, false);
  });

}
/** To enable special fleets path on map for custom context menu - start - 181120 */
function specialsPath(key) {
  nearSpecialPath = true;
  nearFleets = true;
  window.localStorage.removeItem('showallFleets');
  window.localStorage.removeItem('fromNavPath');
  clearPolylines(); // animation path clear 190116
  navAnimationPolylinesColour = true; // need of color for Polylines 190123
  groupAnimationpathMove = true;
  thisGeoArea.enabledspecial = key;
  setOpactiyOnMap(thisGeoArea);
  var startLat;
  var startLon;
  if (localStorage.getItem('currentpostion')) {
    var currentpostion = JSON.parse(localStorage.getItem('currentpostion'));
    startLat = currentpostion.latitude;
    startLon = currentpostion.longitude;
  } else {
    var currentFloorName = window.localStorage.getItem('fcurrentfloorname');
    startLat = entrycordinates[currentFloorName][0];
    startLon = entrycordinates[currentFloorName][1];
  }
  initializeRouter(thisGeoArea.map, thisGeoArea.gaFloorPathUrls[thisGeoArea.gaFloors[0]]);
  showIndoorShortestMultiplePOIRoute(startLat, startLon,
    thisGeoArea.specialPOIs[key], true, thisGeoArea.gaShowFloorPathNetwork);
  var confirmBox = $("#confirm");
  confirmBox.hide();
}
/** To enable special fleets path on map for custom context menu - end - 181120 */

function getUniqueColorPropertiesFromJson(varjson) {
  //return ["red","orange","blue"];
  var temp = {}

  // Store each of the elements in an object keyed of of the name field.  If there is a collision (the name already exists) then it is just replaced with the most recent one.
  if (varjson.features) {
    for (var i = 0; i < varjson.features.length; i++) {
      temp[varjson.features[i].properties.iconcolor] = varjson.features[i].properties.iconcolor;
    }
  }
  var colorArray = [];
  // Push each of the values back into the array.
  for (var o in temp) {
    colorArray.push(temp[o]);
  }
  return colorArray;
}
//**** Factory function for L.LayerGroup.GeoArea class
L.layerGroup.GeoArea = function (options) {
  return new L.LayerGroup.GeoArea(options);
}
//  To call function Reload
function check() {
  //  lrObj.enableHeatMap(lrObj.floorid);
}
// Heat map geo json creation
function CreateHeatMapJson(builingcode) {
  var gsettings = JSON.parse(localStorage.getItem('generalsettings'));
  var finalJson = [];
  var fleetsData = builingcode['facilitiesData'];;
  var reservationsData = builingcode['reservationsData'];;
  var fleetTypesData = gsettings.rows[0].configoption_json.generalConfigOptions.facility_background_colors;
  var assetIcon;
  var label;
  var iconcolor;
  var data = {
    'features': finalJson
  }
  var fleetCodesPathArray = [];
  var reservationCodesPathArray = [];
  var fleetTypesarray = builingcode['facilityTypesData'];

  for (var i = 0; i < fleetsData.length; i++) {
    for (var k = 0; k < fleetTypesarray.length; k++) {
      if (fleetsData[i].facility_type.facility_type_name === fleetTypesarray[k].facility_type_name) {
        assetIcon = fleetTypesarray[k].facility_type_icon;
        iconcolor = fleetTypesarray[k].facility_type_background_color
      }
    }
    for (var l = 0; l < fleetsData.length; l++) {
      if (fleetsData[i].floor_plan_facilityObj === fleetsData[l]._id) {
        label = fleetsData[l].facility_name;
      }
    }

    fleetsData[i].address.geo_coordinates = [fleetsData[i].address.geo_coordinates[1], fleetsData[i].address.geo_coordinates[0]]
    if (fleetsData[i].settings.is_special == true) {
      var fleettype = fleetsData[i].facility_type.facility_type_name.split("-");
      fleetsData[i].fleetType = fleettype[1];
    }
    if (fleetsData[i].settings.is_transactable == false) {
      var Object = {
        'parent_facility_hierarchy': fleetsData[i].parent_facility_hierarchy,
        'type': 'Feature',
        'facilityId': fleetsData[i]._id,
        "eventId": "",
        "facilityReservationId": "",
        "facilityReservationUserId": "",
        "reservedResourceId": "",
        "facilityReservationStatus": "",
        "eventStatus": "",
        "is_transactable": fleetsData[i].settings.is_transactable,
        "is_special": fleetsData[i].settings.is_special,
        "fleetStatus": fleetsData[i].status.lookup_name,
        "parentchild": false,
        'geometry': {
          'type': 'Point',
          "coordinates": fleetsData[i].address.geo_coordinates
        },
        "properties": {
          "level": label,
          "facilityId": fleetsData[i].facility_code,
          "facilityName": fleetsData[i].facility_name,
          "enterpriseId": fleetsData[i].enterprise.enterprise_id,
          "geometry/type": "Point",
          "special": String(fleetsData[i].settings.is_special),
          "facilityType": fleetsData[i].facility_type.facility_type_name,
          "FacilityTypeBackgroundColor": iconcolor,
          "iconcolor": iconcolor,
          "iconName": assetIcon
        }
      }
    } else {
      var Object = {
        'parent_facility_hierarchy': fleetsData[i].parent_facility_hierarchy,
        'type': 'Feature',
        'facilityId': fleetsData[i]._id,
        "eventId": "",
        "facilityReservationId": "",
        "facilityReservationUserId": "",
        "reservedResourceId": "",
        "facilityReservationStatus": "",
        "eventStatus": "",
        "is_transactable": fleetsData[i].settings.is_transactable,
        "is_special": fleetsData[i].settings.is_special,
        "fleetStatus": fleetsData[i].status.lookup_name,
        "parentchild": true,
        "multiReservationCount": 0,
        'geometry': {
          'type': 'Point',
          "coordinates": fleetsData[i].address.geo_coordinates
        },
        "properties": {
          "level": label,
          "facilityId": fleetsData[i].facility_code,
          "facilityName": fleetsData[i].facility_name,
          "enterpriseId": fleetsData[i].enterprise.enterprise_id,
          "geometry/type": "Point",
          "special": String(fleetsData[i].settings.is_special),
          "facilityType": fleetsData[i].facility_type.facility_type_name,
          "FacilityTypeBackgroundColor": '#00FF00',
          "iconcolor": '#00FF00',
          "iconName": assetIcon
        }
      }
    }
    finalJson.push(Object);
  }

  for (var j = 0; j < reservationsData.length; j++) {
    // reservationCodesPathArray.push(reservationsData[j].fleetId.path);
    // var arrayCode = reservationCodesPathArray[j].split('=>');
    // var arrayLastValue = arrayCode[arrayCode.length - 1];
    if (!reservationsData[j].check_in_datetime) {
      var iconColor = '#FFA500';
    } else if (reservationsData[j].check_in_datetime) {
      var iconColor = '#FF0000';
    }
    var multiId = reservationsData[j].facility ? reservationsData[j].facility.facility_id : '';
    var count = 0;
    for (var k = 0; k < reservationsData.length; k++) {
      var facilityId = reservationsData[k].facility ? reservationsData[k].facility.facility_id : '';
      if (multiId === facilityId) {
        count = count + 1;
      }
    }
    for (var i = 0; i < data.features.length; i++) {
      // Direct Match Update
      if (multiId === data['features'][i].facilityId) {
        data['features'][i].properties.iconcolor = iconColor;
        data['features'][i].properties.FacilityTypeBackgroundColor = iconColor;
        // data['features'][i].eventId = reservationsData[j].eventId;
        data['features'][i].fleetReservationId = reservationsData[j]._id;
        data['features'][i].fleetReservationUserId = reservationsData[j].reserved_by.user_profile_id;
        data['features'][i].reservedResourceId = reservationsData[j].reserved_by.user_profile_id;
        // data['features'][i].fleetReservationStatus = reservationsData[j].reservation_status.lookup_name;
      }
      var isChildReservale = false;
      // for (var k = 0; k < fleetTypesarray.length; k++) {
      //     if (reservationsData[j].fleetId.fleetType === fleetTypesarray[k].fleetTypeName && fleetTypesarray[k].canChildBeReserved) {
      //         isChildReservale = fleetTypesarray[k].canChildBeReserved;
      //     }
      // }

      // parent Update
      // if (fleetsData[i].facility_code.trim() === arrayLastValue.trim()) {
      //   data['features'][i].properties.iconcolor = fleetTypesData.enterprise.fleetNonTransactableColorCode;
      //   data['features'][i].is_transactable = false;
      //   data['features'][i].parentchild = false;
      //   // data['features'][i].eventId = reservationsData[j].eventId;
      //   // data['features'][i].fleetReservationId = reservationsData[j]._id;
      //   // data['features'][i].fleetReservationUserId = reservationsData[j].userId._id;
      //   // data['features'][i].reservedResourceId = reservationsData[j].userId.enterpriseResourceObj._id;
      //   // data['features'][i].fleetReservationStatus = reservationsData[j].reservationStatus;
      // }
      // Child Update
      fleetCodesPathArray.push(data['features'][i].parent_facility_hierarchy);
      var fleetArrayPath = fleetCodesPathArray[i].split('=>');
      var fleetarrayLastValue = fleetArrayPath[fleetArrayPath.length - 1];
      // if (!isChildReservale && reservationsData[j].fleetId.fleetCode.trim() === fleetarrayLastValue.trim()) {
      //   data['features'][i].properties.iconcolor = fleetTypesData.enterprise.fleetNonTransactableColorCode;
      //   data['features'][i].is_transactable = false;
      //   data['features'][i].parentchild = false;
      //   // data['features'][i].eventId = reservationsData[j].eventId;
      //   // data['features'][i].fleetReservationId = reservationsData[j]._id;
      //   // data['features'][i].fleetReservationUserId = reservationsData[j].userId._id;
      //   // data['features'][i].reservedResourceId = reservationsData[j].userId.enterpriseResourceObj._id;
      //   // data['features'][i].fleetReservationStatus = reservationsData[j].reservationStatus;
      // }
      // if (data['features'][i].properties.iconname == '' || data['features'][i].properties.iconname == undefined) {
      //   data['features'][i].properties.iconcolor = '';
      // }
      // if (reservationsData[j].fleetId._id === data['features'][i].fleetId) {
      //   data['features'][i].multiReservationCount = count;
      // }
    }

  }
  var clearPath = window.localStorage.getItem('clearPath');
  if (getAllUrlParams().pn === 'cartaddedassets' && clearPath !== 'true') {
    var cartAddedAssetsArr = JSON.parse(window.localStorage.getItem('selectedAssets'));
    var selectedAssetsArr = [];
    for (var i = 0; i < data.features.length; i++) {
      for (var j = 0; j < cartAddedAssetsArr.length; j++) {
        if (data.features[i].fleetId === cartAddedAssetsArr[j]._id) {
          data.features[i].properties.special = 'true'
          data.features[i].properties.addedToCart = true;
          data.features[i].properties.fleetType = 'L60-SelectedAssets';
          selectedAssetsArr.push(data.features[i]);
        }
      }
      if (i === data.features.length - 1) {
        data.features = [];
        data.features = selectedAssetsArr;
      }
    }
  }
  return data;
}

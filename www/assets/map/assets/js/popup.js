"use strict";
function displayFleetInfo(e) {
    var popup = L.popup();
    // create popup contents
    var mydata = JSON.parse(staticvedicdata);
    var zz = e.target.fleetID;
    var yy =0;
    for (i = 0; i < mydata.length; i++) {
        if(zz == mydata[i].fleetId){
        yy =i;
        break;
        }
    }
    var customPopup =
    //  "<div id='myModal' class='modal-dialog modal-lg'><B>C H R I S T  C H U R C H - New Zealand</B><br/><P align=center>Plot Number: " + e.target.fleetID + "<BR/><img align='center' src='face.png'/></P><br/><B>First Name:</B> abcd  <B>Last Name:</B> abcd<br/><B>DOB:</B> dd:mm:yyyy</div>";
    "<div id='myModal' class='modal-dialog modal-md'><div class='modal-content'><div class='modal-header'> <button aria-label='Close' class='close' data-dismiss='modal' type='button' onclick='map.closePopup();' > <span aria-hidden='true'>×</span> </button> <div class='row'> <div class='col-md-6 text-left'> <img height='30' src='assets/img/mapapp-logo.png'><br></div><div class='col-md-6 text-right clntlogo'> <img height='30' src='assets/img/oracle_logo.png'><br></div></div><div class='row'> <div class='col-md-12'> </div></div></div><div class='modal-body'> <div class='row'> <div class='col-md-8'> <div class='row'><div class='col-md-12 form-group'><label>First Name</label><input class='form-control input-sm text-capitalize' disabled='' id='firstName' name='firstName' type='text' value='"+mydata[yy].firstName+"'></div><div class='col-md-12 form-group'><label>Last Name</label><input class='text-capitalize form-control input-sm' disabled='' id='lastname' Value='"+mydata[yy].lastName+"' name='lastname' type='text'> </div><div class='col-md-12 form-group'><label>Gender</label><input value='"+mydata[yy].gender+"' class='form-control input-sm ng-untouched ng-pristine' disabled='' id='gender' name='gender' type='text' ng-reflect-name='gender' ng-reflect-is-disabled='' ng-reflect-model='Female'> </div></div></div><div class='col-md-4 text-center img-block'> <div class='row img-block-content'> <div class='col-md-12 img-block-column'> <img alt='' class='' height='77' id='profilepageprofilePicimg' onerror='this.onerror=null;this.src='/assets/img/default-profile-icon.png';' src='assets/img/profilepic/"+mydata[yy].imagesrc+"'> <p align=center>Plot Number: " + e.target.fleetID + "</p></div></div></div></div></div><div class='modal-footer'> <div class='row'> <div class='col-md-6 text-left'> Powered by <a href='https://pigeon-tech.com' target='_blank'><img src='assets/img/footer-logo.png'> Pigeon-Tech Inc</a> </div><div class='col-md-6 pull-right'> <button class='btn btn-primary leaflet-popup-close-button'>Close</button> </div></div></div></div></div>";

    // specify popup options
    // var customOptions =
    //     {
    //         'maxWidth': '500',
    //         'className': 'custom'
    //     }

    // create marker object, pass custom icon as option, pass content and options to popup, add to map
    //L.marker([43.64701, -79.39425], {icon: firefoxIcon}).bindPopup(customPopup,customOptions).addTo(map);

    popup
        .setLatLng(e.latlng)
        //          .setContent("You clicked the fleet at " + e.target.fleetID + " " + e.latlng.toString())
        .setContent(customPopup)
        .openOn(mymap);
}
//// new popup

function displayFleetInfo2(e) {
    var popup = L.popup();
    // create popup contents

    var mydata = JSON.parse(staticvedicdata);
    var zz = e.target.fleetID;
    var yy =0;
    for (i = 0; i < mydata.length; i++) {
        if(zz == mydata[i].fleetId){
        yy =i;
        break;
        }
    }
    var customPopup =
      "<div class='contentwrap'><B>C H R I S T  C H U R C H - New Zealand</B><br/><P align=center>Plot Number: "+mydata[yy].fleetId+"<BR/><img align='center' src='assets/img/profilepic/"+mydata[yy].imagesrc+"'/></P><br/>"+mydata[yy].firstName+" "+mydata[yy].lastName+"<br/> "+mydata[yy].dob+"<B> To </B>"+mydata[yy].dod+"</div>";
  //  "<div id='myModal' class='modal-dialog modal-md'><div class='modal-content'><div class='modal-header'> <button aria-label='Close' class='close' data-dismiss='modal' type='button' onclick='map.closePopup();' > <span aria-hidden='true'>×</span> </button> <div class='row'> <div class='col-md-6 text-left'> <img height='30' src='assets/img/mapapp-logo.png'><br></div><div class='col-md-6 text-right clntlogo'> <img height='30' src='assets/img/oracle_logo.png'><br></div></div><div class='row'> <div class='col-md-12'> </div></div></div><div class='modal-body'> <div class='row'> <div class='col-md-8'> <div class='row'><div class='col-md-12 form-group'><label>Name</label><input class='form-control input-sm text-capitalize' disabled='' id='firstName' name='firstName' type='text' value='Name'></div><div class='col-md-12 form-group'><label>Date Of Birth</label><input class='text-capitalize form-control input-sm' disabled='' id='lastname' Value='MM/DD/YYYY' name='lastname' type='text'> </div><div class='col-md-12 form-group'><label>Date Of Death</label><input value='MM/DD/YYYY' class='form-control input-sm ng-untouched ng-pristine' disabled='' id='gender' name='gender' type='text' ng-reflect-name='gender' ng-reflect-is-disabled='' ng-reflect-model='Female'> </div></div></div><div class='col-md-4 text-center img-block'> <div class='row img-block-content'> <div class='col-md-12 img-block-column'> <img alt='' class='' height='77' id='profilepageprofilePicimg' onerror='this.onerror=null;this.src='/assets/img/default-profile-icon.png';' src='assets/img/man.png'> <p align=center>Plot Number: " + e.target.fleetID + "</p></div></div></div></div></div><div class='modal-footer'> <div class='row'> <div class='col-md-6 text-left'> Powered by <a href='https://pigeon-tech.com' target='_blank'><img src='assets/img/footer-logo.png'> Pigeon-Tech Inc</a> </div><div class='col-md-6 pull-right'> <button class='btn btn-primary leaflet-popup-close-button'>Close</button> </div></div></div></div></div>";

    popup
        .setLatLng(e.latlng)
        //          .setContent("You clicked the fleet at " + e.target.fleetID + " " + e.latlng.toString())
        .setContent(customPopup)
        .openOn(mymap);
}

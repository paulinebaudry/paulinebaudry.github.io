

$('#Arrow').click(function(){
  $('html, body').animate({
        scrollTop: $('.text').offset().top},
        'slow');
      });

//$('.checkmark').click(function(){
  //$('.checkmark').css("background-color","#2196F3");
  //$('.checkmark:after').css("display","block")
//});


//VISUALISATION PAGE
//MAP
// Load all accidents
var map, heatmap;
var variable = 'all';
var filter1 = 'all';
var filter2 = 'all';
var filter3 = 1;
var filter4 = 4;
var markers = [];
var markerinfo = new google.maps.InfoWindow();
var dataArray = [];
var heatmapArray = [];
var latLng;
var icon;

$(document).ready(function() {
function initialize() {

    var mapOptions = {
    center: {lat: 51.509865, lng: 	-0.118092},
    zoom: 11,
    styles: darkMapNames,
    zoomControl: true,
    zoomControlOptions: {position: google.maps.ControlPosition.RIGHT_CENTER},
		mapTypeControl: false,
		streetViewControl: false,
		fullscreenControl: false,
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}


getData(variable,filter1,filter2,filter3,filter4);


//Variables
$(".container").click(function(event){
  //heatmap.setMap(null);
  clearMarkers();
  event.preventDefault();
  $(".container").removeClass("active");
  $(this).addClass("active");
  //Get div of active buttons
  variable = $('#variables2 .container.active').attr('id');
  //Markers
  google.maps.event.clearListeners(map, 'dragend');
  getData(variable,filter1,filter2,filter3,filter4);
});

//Months filter
$(".button").click(function(event){
  //heatmap.setMap(null);
  clearMarkers();
  event.preventDefault();
  $(".button").removeClass("active");
  $(this).addClass("active");
  //Get div of active buttons
  filter1 = $('#months .button.active').attr('id');
  console.log(filter1);
  //Markers
  google.maps.event.clearListeners(map, 'dragend');
  getData(variable,filter1,filter2,filter3,filter4);
});

//Severity filter
$('#selector').change(function(event){
  //heatmap.setMap(null);
  clearMarkers();
  event.preventDefault();
  var selector_value = document.getElementById("selector");
  filter2 = selector_value.options[selector_value.selectedIndex].value;
  //Markers
  google.maps.event.clearListeners(map, 'dragend');
  getData(variable,filter1,filter2,filter3,filter4);
});



//Number of casualties filters
$(function(event) {
      $("#slider-range").slider({
      range: true,
      min: 1,
      max: 16 ,
      values: [ 1, 4 ],
      slide: function( event, ui ) {
        if(ui.values[0] == 16 || ui.values[1] == 16){
          $( "#number" ).val( ui.values[ 0 ] + " - " +  "16+ casualties");
        }
        else{
        $( "#number" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] + " casualties");
      }
      filter3 = ui.values[ 0 ];
      filter4 = ui.values[ 1 ];
      clearMarkers();
      google.maps.event.clearListeners(map, 'dragend');
      getData(variable,filter1,filter2,filter3,filter4);
        }
    });
  });



//Function to retrieve data from the API according to variables/filters
function getData(variable,filter1,filter2,filter3,filter4){
  document.getElementById("loader").style.display = 'block';
  document.getElementById("map").style.opacity = '0.5';
  document.getElementById("analysis-popup").style.display = 'none';
  console.log('working...');
  url = "http://dev.spatialdatacapture.org:8824/accidentdata/" + variable + "/" + filter1 + "/" + filter2 + "/" + filter3 + "/" + filter4;

var zIndex;
$.getJSON( url, function(data){
dataArray = [];
markers = [];
  $.each(data, function(k,v){


    var latLng = new google.maps.LatLng(v.Latitude, v.Longitude);
    //var latLng = new GLatLng(v.Latitude, v.Longitude);

    dataArray.push(latLng);

    if (v.Accident_Severity == 1){
      var icon = {
        url: './img/red_icon.png',
        scaledSize: new google.maps.Size(5, 5)
      };
      zIndex = 1;
    }
    else if (v.Accident_Severity == 2){
      var icon = {
        url: './img/orange_marker.png',
        scaledSize: new google.maps.Size(5, 5)
      };
      zIndex = 0;
    }
    else if (v.Accident_Severity == 3){
        var icon = {
        url: './img/yellow_marker.png',
        scaledSize: new google.maps.Size(5, 5)
      };
      zIndex = -1;
    }

    var marker = new google.maps.Marker({
      					position: latLng,
                icon: icon,
                map:map,
                zIndex:zIndex
      				});
        /*var marker = new GMarker({
          position: latLng,
          icon:icon,
          map:map,
          zIndex:zIndex
        });

        clusterer.AddMarker(marker);*/



    //Marker Info on click

    google.maps.event.addListener(marker, 'click', function(content){
      return function(){
        markerinfo.setContent("");
        $.getJSON( url, function( data ) {
          //Assign content to accident severity
          if(v.Accident_Severity == 1){var accident_severity = 'Fatal';}
          else if (v.Accident_Severity == 2){var accident_severity = 'Serious';}
          else if (v.Accident_Severity == 3){var accident_severity = 'Slight';}
          //Assign content to weather conditions
          if(v.Weather_Conditions == 1){
            var weather_conditions = 'Fine';
            var weather_analysis = '';
          }
          else if(v.Weather_Conditions == 2){
            var weather_conditions = 'Rain';
            var weather_analysis = 'Accidents that happened in rain were likely to be more severe than those in fine weather, with a coefficient of 0.1567.';
          }
          else if(v.Weather_Conditions == 3){
            var weather_conditions = 'Snow';
            var weather_analysis = 'Accidents that happened in snow were likely to be more severe than those in fine weather, with a coefficient of 1.5693.';
          }
          else if(v.Weather_Conditions == 4){
            var weather_conditions = 'Fog or mist';
            var weather_analysis = 'Accidents that happened in fog were likely to be less severe than those in fine weather, with a coefficient of -0.1691.';
          }

          if(v.Light_Conditions == 1){
            var light_conditions = 'Daylight';
            var light_analysis ='';
          }
          else if (v.Light_Conditions == 2){
            var light_conditions = 'Darkness - lights lit';
            var light_analysis = 'Accidents that happened in dark but lit roads were likely to be less severe than those in daylight, with a coefficient of -0.0537.';
          }
          else if (v.Light_Conditions == 3){
            var light_conditions = 'Darkness - lights unlit';
            var light_analysis = 'Accidents that happened in completely dark roads were likely to be more severe than those in daylight, with a coefficient of 0.0406.';
          }


          //Assign popup analysis text according to speed limit
          if (v.Speed_limit == 20){var speed_analysis = 'Accidents that happened on roads with speed limits of 20 mph were likely to be less severe than those on 30mph roads, with a coefficient of -0.1898.';}
          else if (v.Speed_limit == 30){var speed_analysis = '';}
          else if (v.Speed_limit == 40){var speed_analysis = 'Accidents that happened on roads with speed limits of 40 mph were likely to be less severe than those on 30mph roads, with a coefficient of -0.0822.';}
          else if (v.Speed_limit == 50){var speed_analysis = 'Speed limits of 50 mph are not significant in determining the severity of accidents.';}
          else if (v.Speed_limit == 60){var speed_analysis = 'Accidents that happened on roads with speed limits of 60 mph were likely to be more severe than those on 30mph roads, with a coefficient of 0.3627.';}
          else if (v.Speed_limit == 70){var speed_analysis = 'Speed limits of 70 mph are not significant in determining the severity of accidents.';}
        //Assign content to casualty info
          //Age
          if(v.Age_of_Casualty == 'NA'){var age = ' ';}
          else{var age = "</br><b>Age of casualty: </b>"+Math.floor(v.Age_of_Casualty);}
          //Sex
          if(v.Sex_of_Casualty == 'NA'){var sex = ' ';}
          else if(v.Sex_of_Casualty == 1.0){var sex = "</br><b>Sex of casualty: </b>Male";}
          else if(v.Sex_of_Casualty == 2.0){var sex = "</br><b>Sex of casualty: </b>Female";}
          //class
          if(v.Casualty_Class == 'NA'){var casclass = ' ';}
          else if(v.Casualty_Class == 1){var casclass = "</br><b>Class of casualty: </b>Driver or rider";}
          else if (v.Casualty_Class == 2){var casclass = "</br><b>Class of casualty: </b>Passenger"; }
          else if(v.Casualty_Class == 3){var casclass = "</br><b>Class of casualty: </b>Pedestrian";}

          //Content
          var content = "<span style='color:black'><b>Date: </b>"+v.Date+"<br/><b>Time: </b>"+v.Time
          +"</br><b>Weather conditions: </b>"+weather_conditions+"</br><b>Speed limit of the road: </b>"+v.Speed_limit
          +" mph</br><b>Light conditions: </b>"+light_conditions+"</br><b>Number of casualties: </b>"+v.Number_of_Casualties
          +"</br><b>Accident severity: </b>"+accident_severity+age+sex+casclass+"</span>";
          //Set content to display in window on marker click
          markerinfo.setContent(content);


          if(variable == 'weather'){
            document.getElementById("analysis-popup").innerHTML = weather_analysis;
            document.getElementById("analysis-popup").style.display = 'block';
          }
          else if(variable == 'light'){
            document.getElementById("analysis-popup").innerHTML = light_analysis;
            document.getElementById("analysis-popup").style.display = 'block';
          }
          else if(variable == 'speed'){
            document.getElementById("analysis-popup").innerHTML = speed_analysis;
            document.getElementById("analysis-popup").style.display = 'block';
          }

        });
        markerinfo.open(map,this);


      }
    }(""));

    markers.push(marker);


  });

  //Assign text for selected variable and content of analysis popup
  if(variable == 'weather'){
    var variable_text = "in bad weather conditions";

  }
  else if(variable == 'speed'){
    var variable_text = "in roads with high speed limits";
  }
  else if(variable == 'light'){
    var variable_text = "in dark lighting conditions";
  }
  else if(variable == 'all'){
    document.getElementById("analysis-popup").style.display = 'none';
    var variable_text = "";
  }
  //Assign text for selected month
  var month_text = $("#"+filter1+"").text();
  if(filter1 == 'all'){var month_text = '';}
  //Assign text for selected level of severity of accident
  if(filter2 == 1){var severity_text = ", which were fatal and";}
  else if(filter2 == 2){var severity_text = ", which were serious and";}
  else if(filter2 == 3){var severity_text = ", which were slight and";}
  else if(filter2 == 'all'){var severity_text = ", which";}
  //Assign text fo selected number of casualties
  if(filter4 == 16){var filter_4 = "16 or more";}
  else{var filter_4 = filter4;}
  //Assign all parts of text to the displayed text box
  document.getElementById("text-box").innerHTML = "There were <span style='color:#2196F3'><b>" + data.length + "</b></span> accidents " + variable_text + " in " + month_text + " 2016" + severity_text + " had between " + filter3 + " and " + filter_4 +" casualties.";

  console.log(url);
  console.log('done');
  deleteHeatmap();
$("#heatmap.togglebutton").removeClass("active");
document.getElementById("loader").style.display = 'none';
document.getElementById("welcome-box").style.display = 'none';
document.getElementById("map").style.opacity = '1';
});


}

	google.maps.event.addDomListener(window, 'load', initialize);

});



$(".togglebutton").click(function(event){
  if($(this).hasClass("active")){
    $(this).removeClass("active");
  }
  else {
    $(this).addClass("active");
  }

  if($(this).hasClass('active')){
    createHeatmap(map);
    console.log('heatmap selected');
  }
  else  {
    deleteHeatmap();
  }
});



//Creates heatmap
function createHeatmap(map){
  clearMarkers();
  heatmap = new google.maps.visualization.HeatmapLayer({

    data: dataArray
  });
  heatmapArray.push(heatmap);
  heatmap.setMap(map);
}

//Deletes heatmap
function deleteHeatmap(){
  setMapOnAll(map);
  for (var k = 0; k < heatmapArray.length; k++) {
          heatmapArray[k].setMap(null);
}
heatmapArray=[];
}




// Sets the map on all markers in the array.
      function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

// Removes the markers from the map, but keeps them in the array.
      function clearMarkers() {
        setMapOnAll(null);
      }

//Navigation button
      $("#menuheader").click(function(){
            $("#menu").toggle();
      	});


      $( ".menuitem" ).mouseenter(function() {
        $( this ).fadeOut(200);
        $( this ).fadeIn(200);
      });



Highcharts.chart('graph1', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Average Accidents in a Week'
    },
    colors:['#2196F3'],

    xAxis: {
        categories: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        ],
        crosshair: true
    },
    yAxis: {
        min: 250,
		max: 450,
        title: {
            text: 'Average No. of Accidents'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
	legend: {
        enabled: false
    },
    series: [{
        name: 'Accidents',
        data: [370.6923, 386.6145, 401.3654, 402.8654, 426.0189, 336.1887, 288.9231]

    }]
});

Highcharts.chart('graph2', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Average Accidents in a Day'
    },

    colors:['#2196F3'],

    xAxis: {
		categories: ['00:00', '01:00', '02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00','24:00'],
        crosshair: true
    },
    yAxis: {
        max: 35,
        title: {
            text: 'Average No. of Accidents'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
	legend: {
        enabled: false
    },
    series: [{
        name: 'Accidents',
        data: [5.3562,3.9918,2.8411,2.5534,2.1315,3.3836,7.8712,17.2548,27.2740,18.0658,17.4301,19.0301,21.3014,22.0521,23.0630,28.5342,30.3589,33.0630,26.7890,19.7068,14.0685,11.2685,9.6493,7.2603],
	}]
});

var array_accidents = [];
$.getJSON(
    'http://dev.spatialdatacapture.org:8824/accidentdata/day', // insert data json link here
    function (data) {
      $.each(data, function(k,v){
        var dateParts = v.Date.split("/");
        var dateObject = new Date(dateParts[2], dateParts[1] -1, dateParts[0]);
        var day = dateObject.getDate();
        var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
        var month = dateObject.getMonth();
        var monthName = monthNames[month];
        var datestring = day + " " + monthName;
        var date_accident = [datestring, v.Number_of_Accidents];
        array_accidents.push(date_accident);
        });
        Highcharts.chart('graph3', {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'Total Number of Accidents'
            },
            colors:['#2196F3'],

            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'category',
                minTickInterval: 60
            },
            yAxis: {
                max:600,
                min:100,
                tickInterval: 50,
                title: {
                    text: 'Number of Accidents'
                }
            },

            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series:
            [{
                name: 'Accidents',
                data: array_accidents,
                showInLegend: false
            }]
        });


  });

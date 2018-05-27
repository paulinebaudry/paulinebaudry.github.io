/*Fade away effect
   $(window).scroll(function(){
    $("#middle-top").css("opacity", 1 - $(window).scrollTop() / 1000);
  });
  */

//Fade in effect of elements appearing
  $(document).ready(function() {
    //ABOUT page
    $("#top-container").delay(500).fadeIn(500);
    $("#photo").delay(1000).fadeIn(500);
    $("#links").delay(1500).fadeIn(500);


    //BLOG page
    $('#description').delay(500).fadeIn(500);
    $('#main').delay(1000).fadeIn(500);





  //Mapbox
 mapboxgl.accessToken = 'pk.eyJ1IjoicGF1bGluZWJhdWRyeSIsImEiOiJjaXYyaHY3aDkwMDBpMnRwbDJjdzYyN3V6In0.TZTM6a3u0YfAQghLEtlnzw';


var nyc = {text:'<b>New York</b> </br> 1996', lnglat:  [-73.935242,40.730610]}
var paris = {text:'<b>Paris</b> </br> 1996-2014', lnglat: [2.349014,48.864716]}
var london = {text:'<b>London</b> </br> 2014-Present', lnglat: [-0.118092,51.509865]}
var fbo = {text:'<b>Falsterbo</b> </br> The motherland', lnglat: [12.85,55.4]}


 var map = new mapboxgl.Map({
   container: 'map', // container id
  style:'mapbox://styles/paulinebaudry/cjeof2tpbx22q2rt52vmwtu65', // stylesheet location
  center: [-88.021094, 16.732281],
  zoom: 1
});




 function citypopup (city,direction,delay){

  setTimeout(function(){
    popuptext = city['text'];
    LngLat = city['lnglat'];
    console.log(popuptext +":"+LngLat);
     new mapboxgl.Popup({anchor:direction, offset: 20})
        .setHTML(popuptext)
        .setLngLat(LngLat)
        .addTo(map)
  }, delay);

};

citypopup(fbo,'bottom',1500);
citypopup(nyc,'bottom',2500);
citypopup(paris,'top',3500);
citypopup(london,'left',4500);





map.scrollZoom.disable();
});

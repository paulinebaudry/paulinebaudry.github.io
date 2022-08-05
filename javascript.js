/*Fade away effect
   $(window).scroll(function(){
    $("#middle-top").css("opacity", 1 - $(window).scrollTop() / 1000);
  });
  */


$('#arrow').on('click', function(event){
  $('html, body').animate({
    scrollTop: $('#arrow').offset().top
  },500);
});



//Fade in effect of elements appearing
  $(document).ready(function() {
    //ABOUT page

    $('html, body').animate({
      scrollTop: 50},
      1000);
    $("#top-container").delay(500).fadeIn(500);
    $("#photo").delay(1000).fadeIn(500);
    //$("#arrow").delay(3500).slideDown(500);
    //$("#link-title").delay(4000).fadeIn(500);
    $("#link-container").delay(1000).fadeIn(500);


    //BLOG page
    $('#description').delay(500).fadeIn(500);
    $('#main').delay(1000).fadeIn(500);





/*
  //Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoicGF1bGluZWJhdWRyeSIsImEiOiJjaXYyaHY3aDkwMDBpMnRwbDJjdzYyN3V6In0.TZTM6a3u0YfAQghLEtlnzw';

var nyc = {text:'<b>New York</b> </br> 1996', lnglat:  [-73.935242,40.730610]}
var paris = {text:'<b>Paris</b> </br> 1996-2014 </br> 2018-Present', lnglat: [2.349014,48.864716]}
var london = {text:'<b>London</b> </br> 2014-2018', lnglat: [-0.118092,51.509865]}
var fbo = {text:'<b>Falsterbo</b> </br> The motherland', lnglat: [12.85,55.4]}


 var map = new mapboxgl.Map({
   container: 'map', // container id
  style:'mapbox://styles/paulinebaudry/cjeof2tpbx22q2rt52vmwtu65', // stylesheet location
  center: [-40, 30],
  zoom: 1
});


map.scrollZoom.disable();

 function citypopup (city,direction,delay,offset){

  setTimeout(function(){
    popuptext = city['text'];
    LngLat = city['lnglat'];
    console.log(popuptext +":"+LngLat);
     new mapboxgl.Popup({anchor:direction, offset: offset})
        .setHTML(popuptext)
        .setLngLat(LngLat)
        .addTo(map)
  }, delay);

};

$(window).scroll(function () {
  if ($(window).scrollTop() > 300) {
    $(window).off("scroll");
    citypopup(fbo,'bottom',500,-20);
    citypopup(nyc,'bottom',1500,-30);
    citypopup(london,'right',2500,20);
    citypopup(paris,'top',3500,60);
  }
});







map.scrollZoom.disable();
});
*/

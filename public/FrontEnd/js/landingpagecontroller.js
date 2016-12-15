/**
 * Created by tasu on 24/11/16.
 */


function landingpagecontroller() {
    if(serachmap!="")
    {
        sessionStorage.setItem("searchmap","");
    }
    $(document).ready(function () {
       if(sessionStorage.getItem("lang") !==null)
       {
           lang=sessionStorage.getItem("lang");
       }

         $('.dropdown-toggle').dropdown();
        $('#viewall').on('click', function()
        {
           window.location.href="#searchtours";        });

        console.log("Welcome to the trip Around -- landing page");
        $('#login').on('click', function () {
            window.location.href = "#login";

        });

        $('#SearchTour').on('click', function(evt)
        {
            console.log("Search tour has been clicked");
            window.location.href="#searchtours";
            //window.location.reload();

        });

        $('#SaveTour').on('click', function(evt){
            console.log("The Save button has been clicked");
            window.location.href="#login";
        });

        $('#langdropdown').on('click', function(evt){
            console.log("trans has been clicked");
        });

      /*  $('#About').on('click', function(evt){
            console.log("The about button has been clicked");
            window.location.href="#About";
        })*/
/*         var data = '{ "button_tourssearch": "Tour sssssss"}';
         var obj = $.parseJSON(data);
        document.getElementById("SearchTour").innerHTML = obj.button_tourssearch;*/

/*        var mydata = JSON.parse(data);
	    document.getElementById("SearchTour").innerHTML = mydata.button_tourssearch;*/

	   /* $.getJSON( 'de.json', function(data) {
            *//*var obj = $.parseJSON(data);*//*
            *//*document.getElementById("SearchTour").innerHTML = obj.button_tourssearch; *//*
            $('#SearchTour').html(data.button_tourssearch);

	    });*/


        /*
        $('#fullpage').fullpage({
            menu: null,
            direction: 'vertical',
            verticalCentered: true,
            sectionsColor: [],
            anchors: [],
            scrollingSpeed: 700,
            easing: 'swing',
            loopBottom: false,
            sectionsColor: ['#f2f2f2', '#4BBFC3', '#F8C471',  '#7BAABE', 'whitesmoke', '#000'],
            loopTop: false,
            css3: true,
            navigation: {
              'textColor': '#000',
              'bulletsColor': '#000',
              'position': 'right',
              'tooltips': ['section1', 'section2', 'section3', 'section4']
            },
            normalScrollElements: true,
            normalScrollElementTouchThreshold: 5,
            touchSensitivity: 5,
            keyboardScrolling: true,
            sectionSelector: '.section',
            animateAnchor: false,
            scrollOverflow: true,
            //events
            onLeave: function(index, nextIndex, direction){},
            afterLoad: function(anchorLink, index){},
            afterRender: function(){},
        });*/
/*        setTimeout(function() {
            $("#page3").trigger('click');
        },10);*/
        var arraynull=[];
        if(lang === "")
        {
        if($("#eng").text()===""){
            lang = "Deutsch";
            sessionStorage.setItem("lang", lang);
        }
        }
       translateFunction(arraynull,translateLanding);

    });
}





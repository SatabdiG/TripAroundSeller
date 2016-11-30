/**
 * Created by tasu on 24/11/16.
 */


function landingpagecontroller() {
    $(document).ready(function () {
        userid="";
        mapname="";
        serachmap="";
        name="";
        console.log("Welcome to the trip Around -- landing page");
        $('#login').on('click', function () {
            window.location.href = "#login";
            window.location.reload();

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
            normalScrollElements: null,
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
        });
        setTimeout(function() {
            $("#page3").trigger('click');
        },10);

    });
}


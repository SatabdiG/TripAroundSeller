/**
 * Created by tasu on 24/11/16.
 */
//Contains the controller for the View Tours Page

function viewtourcontroller()
{
    if(document.getElementById("pp-nav") != null)
    {
       document.getElementById("pp-nav").remove();

    }
    locations=[];

    $(document).ready(function(){
        initialize();
        itemarkers=[];
        console.log("you are now viewing the tour page "+name+serachmap);
       //Generate map with reference to :
        var ReferenceMap=serachmap;
       $('#Goback').on('click', function(evt){
          window.location.href="#";
           window.location.reload();
       });

       $("#dispcontent").fullpage({
           navigation:true,
           scrollingSpeed: 1000
       });

       socket.emit("getSearchTours", {mapname:serachmap});
       socket.on('viewserachtours', function(msg)
       {
          console.log("In View serach"+msg.name);
          //Make the iterniary Page
           var nmt=msg.name;
           var description=msg.description;
           var vehicle=msg.vehicle;
           var lat=msg.lat;
           var lon=msg.lng;

           var pos=new google.maps.LatLng(lat,lon);
           map.panTo(pos);
           //Create Markers according to exsiting markers
           console.log("Positions is"+pos);
           var marker=new google.maps.Marker({
               icon:"http://maps.google.com/mapfiles/ms/micons/blue.png",
               position:pos,
               map:map
           });
           itemarkers.push(marker);
           locations.push(msg.name);
           tempstr = nmt;
           var mother = document.createElement('div');
           mother.setAttribute('class', 'row');
           var momsec = document.createElement('div');
           momsec.setAttribute('class', 'col-lg-6');
           var container = document.createElement('div');
           container.setAttribute("id", nmt);
           container.setAttribute("class", "itenary-panel");
           //Footer div
           var footer = document.createElement('div');
           footer.setAttribute("id", "foot" + nmt);
           footer.setAttribute("class", "itenary-footer");
           //Thumbnail div
           var thumb = document.createElement('div');
           thumb.setAttribute("id", "thumb" + nmt);
           thumb.setAttribute("class", "itenary-thumbnail");

           var des = document.createElement("div");
           des.setAttribute("id", "des" + nmt);
           des.setAttribute("class", "itenary-des");

           var head = document.createElement("div");
           head.setAttribute("id", "head" + nmt);
           head.setAttribute("class", "itenary-header");


           //Adding Header elements
           var tempstyling = document.createElement("H2");
           var newconent = document.createTextNode(tempstr);
           tempstyling.appendChild(newconent);
           //Add to head
           head.appendChild(newconent);
           container.appendChild(head);
           //Adding Thumbnail
           container.appendChild(thumb);
           // ** Add Text Box - for adding descriptions **//
           var tempbox = document.createElement("textarea");
           tempbox.setAttribute("id", "text" + nmt);
           tempbox.setAttribute("class", "textboxiteniarypage");
           tempbox.innerHTML = description;
           //Add to div des
           des.appendChild(tempbox);
           container.appendChild(des);

           var imfpar=document.createElement("div");
           imfpar.setAttribute("class","row");
           var imgholder = document.createElement("div");
           imgholder.setAttribute("id", "gall" + nmt);
           imgholder.setAttribute("class", "jcarousel-wrapper");
           var slideshow = document.createElement("div");
           slideshow.setAttribute("id", "slide" + nmt);
           slideshow.setAttribute("class", "jcarousel");
           var ul = document.createElement("ul");
           ul.setAttribute("id", "ul" + nmt);
           slideshow.appendChild(ul);
           imgholder.appendChild(slideshow);
           imfpar.appendChild(imgholder);
           container.appendChild(imfpar);
           momsec.appendChild(container);
           mother.appendChild(momsec);
           $('#IteniaryPage').append(mother);

           $('#slide' + nmt).jcarousel();


           $('#slide' + nmt).mousewheel(function (event, delta) {
               event.preventDefault();
               if (delta < 0) {
                   $('#slide' + nmt).jcarousel('scroll', -1);
               }
               else if (delta > 0) {
                   $('#slide' + nmt).jcarousel('scroll', +1);
               }

           });
           var prev = document.createElement("a");
           prev.setAttribute("href", "#");
           prev.setAttribute("class", "jcarousel-control-prev");
           prev.setAttribute("id", "prev");
           var textnode = document.createTextNode("<<");
           prev.appendChild(textnode);

           var next = document.createElement("a");
           next.setAttribute("id", "next");
           next.setAttribute("href", "#");
           next.setAttribute("class", "jcarousel-control-next");
           var textnode1 = document.createTextNode(">>");
           next.appendChild(textnode1);
           var appendd = document.getElementById("gall" + nmt);
           appendd.appendChild(prev);
           appendd.appendChild(next);


           $('.jcarousel-control-prev')
               .on('jcarouselcontrol:active', function () {
                   $(this).removeClass('inactive');
               })
               .on('jcarouselcontrol:inactive', function () {
                   $(this).addClass('inactive');
               })
               .jcarouselControl({
                   target: '-=1'
               });

           $('.jcarousel-control-next')
               .on('jcarouselcontrol:active', function () {
                   $(this).removeClass('inactive');
               })
               .on('jcarouselcontrol:inactive', function () {
                   $(this).addClass('inactive');
               })
               .jcarouselControl({
                   target: '+=1'
               });
           var picarray = [];

           socket.emit("fetchImgsrc", {"tourstopname": nmt, "mapname": serachmap});
           socket.on("getImgsrc", function (msg) {
               var picname = msg.picname;
               var picpath = msg.picpath;
               if (picarray.includes(picname) === false) {
                   picarray.push(picname);
                   console.log("the Data returned is" + picname + "  " + picpath);
                   var totalpath = picpath + "/" + picname;
                   console.log("The picpath is Search Page" + totalpath);
                   var appendto = document.getElementById('ul' + nmt);

                   var div = document.createElement("div");
                   var li = document.createElement("li");
                   var img = document.createElement("img");
                   img.setAttribute("class", "displayimg");
                   //$('#gall'+marker.title).append('<img src="'+e.target.result+'" class="displayimg" >');
                   img.setAttribute("src", totalpath);
                   li.appendChild(img);
                   //div.appendChild(img);
                   appendto.appendChild(li);

                   $('#slide' + nmt).jcarousel('scroll', '+=2');
                   $('#slide' + nmt).jcarousel('reload');
                   //appendto.appendChild(div);
                   //var name=marker.title;
                   /// console.log("Name is"+name);
                   //Create two button
                   $('#slide' + nmt).jcarousel('reload');


               }


           });



       });


    });

}


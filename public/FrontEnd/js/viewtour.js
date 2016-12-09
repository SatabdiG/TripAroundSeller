/**
 * Created by tasu on 24/11/16.
 */
//Contains the controller for the View Tours Page

//Contains controllers for Overview Page  Iterniary Page Gallery Page -->
//serachmap is a global varibale that holds the current map

var seen=[];
var active=0;

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

        $('#IteniaryPage').slimScroll({
           height:'250px'
        });

        console.log("you are now viewing the tour page "+name+serachmap);
       //Generate map with reference to :
        var ReferenceMap=serachmap;
       $('#Goback').on('click', function(evt){
          window.location.href="#";
           window.location.reload();
       });

       /*
       $("#dispcontent").fullpage({

           navigation:true,
           scrollingSpeed: 1000,
           scrollOverflow:true
       });*/

       socket.emit("getSearchTours", {mapname:serachmap});
       socket.on('viewserachtours', function(msg)
       {
          console.log("In View serach"+msg.name);
          //Make the iterniary Page
           //var nmt=msg.name;
           var str1=msg.name.toString().replace(/. /g,'');
           var str2=str1.replace(/,/g,'');
           var nmt=str2;
           var description=msg.description;
           var vehicle=msg.vehicle;
           var lat=msg.lat;
           var lon=msg.lng;

           var pos=new google.maps.LatLng(lat,lon);
           map.panTo(pos);
           map.setZoom(5);
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
           var tempid=document.getElementById("headsrc"+nmt);
           console.log("Tempid"+tempid);
           if(tempid === null) {
               var momite = document.createElement('div');
               momite.setAttribute("id", "containsrc" + nmt);
               momite.setAttribute('class', 'row');
               var mother = document.createElement('div');
               mother.setAttribute('class', 'row');
               var momsec = document.createElement('div');
               momsec.setAttribute('class', 'col-lg-6');
               var container = document.createElement('div');
               container.setAttribute("id", "src" + nmt);
               container.setAttribute("class", "itenary-panel");
               //Footer div
               var footer = document.createElement('div');
               footer.setAttribute("id", "footsrc" + nmt);
               footer.setAttribute("class", "itenary-footer");
               var thumb = document.createElement('div');
               thumb.setAttribute("id", "thumb" + marker.title);
               thumb.setAttribute("class", "itenary-thumbnail");
               //Thumbnail div

               var des = document.createElement("div");
               des.setAttribute("id", "dessrc" + nmt);
               des.setAttribute("class", "itenary-dessviewsrc");

               var head = document.createElement("div");
               head.setAttribute("id", "headsrc" + nmt);
               head.setAttribute("class", "itenary-header");


               //Adding Header elements
               var tempstyling = document.createElement("H2");
               var newconent = document.createTextNode(tempstr);
               tempstyling.appendChild(newconent);
               //Add to head
               head.appendChild(newconent);
               momite.appendChild(head);
               //container.appendChild(head);
               //Adding Thumbnail
               //momite.appendChild(thumb);
               //container.appendChild(thumb);
               // ** Add Text Box - for adding descriptions **//
               /*
                var tempbox = document.createElement("div");
                tempbox.setAttribute("id", "textsrc" + nmt);
                tempbox.setAttribute("class", "textboxiteniarypage");
                //tempbox.setAttribute("resize","none");
                console.log("Description $$$$"+description);
                tempbox.innerHTML=description;*/
               //Add to div des
               des.innerHTML = description;
               //des.appendChild(tempbox);
               momite.appendChild(des);
               //container.appendChild(des);
               container.appendChild(momite);
               var imfpar = document.createElement("div");
               imfpar.setAttribute("class", "row");
               var imgholder = document.createElement("div");
               imgholder.setAttribute("id", "gallsrc" + nmt);
               imgholder.setAttribute("class", "jcarousel-wrapper");
               var slideshow = document.createElement("div");
               slideshow.setAttribute("id", "slidesrc" + nmt);
               slideshow.setAttribute("class", "jcarousel");
               var ul = document.createElement("ul");
               ul.setAttribute("id", "ulsrc" + nmt);
               slideshow.appendChild(ul);
               imgholder.appendChild(slideshow);
               imfpar.appendChild(imgholder);
               container.appendChild(imfpar);
               momsec.appendChild(container);
               mother.appendChild(momsec);
               $('#IteniaryPageSrc').append(mother);
           }

           $('#slidesrc' + nmt).jcarousel();


           $('#slidesrc' + nmt).mousewheel(function (event, delta) {
               event.preventDefault();
               if (delta < 0) {
                   $('#slidesrc' + nmt).jcarousel('scroll', -1);
               }
               else if (delta > 0) {
                   $('#slidesrc' + nmt).jcarousel('scroll', +1);
               }

           });
           var prev = document.createElement("a");
           prev.setAttribute("href", "#");
           prev.setAttribute("class", "jcarousel-control-prev");
           prev.setAttribute("id", "prevsrc");
           var textnode = document.createTextNode("<<");
           prev.appendChild(textnode);

           var next = document.createElement("a");
           next.setAttribute("id", "nextsrc");
           next.setAttribute("href", "#");
           next.setAttribute("class", "jcarousel-control-next");
           var textnode1 = document.createTextNode(">>");
           next.appendChild(textnode1);
           var appendd = document.getElementById("gallsrc" + nmt);
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
           var tempvar=msg.name;
           socket.emit("fetchImgsrc", {"tourstopname": msg.name, "mapname": serachmap});
           socket.on("getImgsrc", function (msg) {
               console.log("Get Images"+msg.tourstopname);
               var picname = msg.picname;
               var picpath = msg.picpath;

                   var totalpath = picpath + "/" + picname;
                   var appendto = document.getElementById('ulsrc' + nmt);
                   var div = document.createElement("div");
                   var li = document.createElement("li");
                   var img = document.createElement("img");
                   img.setAttribute("class", "displayimg");
                   img.setAttribute("id", "img"+nmt+picname);
                   //$('#gall'+marker.title).append('<img src="'+e.target.result+'" class="displayimg" >');
                   img.setAttribute("src", totalpath);
                   var tempele=document.getElementById("img"+nmt+picname);
                   if(tempele === null) {
                       if(msg.tourstopname === tempvar ) {
                           li.appendChild(img);
                           //div.appendChild(img);
                           appendto.appendChild(li);
                       }
                   }

                   $('#slidesrc' + nmt).jcarousel('scroll', '+=2');
                   $('#slidesrc' + nmt).jcarousel('reload');
                   //appendto.appendChild(div);
                   //var name=marker.title;
                   /// console.log("Name is"+name);
                   //Create two button
                   $('#slidesrc' + nmt).jcarousel('reload');




           });
            var routearr=[];
           var route=function(src, des){
               this.src=src;
               this.des=des;
           };
           var route=[];
           var routeobj={};
            var tempcount=0;
            console.log("Itemarkers length   "+itemarkers[2].getPosition());
            for(var i=0;i<itemarkers.length;i++)
            {
                tempcount+=1;
                if(tempcount<itemarkers.length) {
                    console.log("*******"+tempcount+"  "+i);
                    var src = itemarkers[i].getPosition();
                    des = itemarkers[tempcount].getPosition();
                    console.log("Src Des"+ src+"  "+des);
                    getDirections(map, src, des);
                }


            }
            //Get count of tourstops
            /*
           socket.emit("getNumTourStops", {mapname:serachmap});
           socket.on("viewNumTourStops", function(msg){
                   console.log("Number of tourstops are" + msg.count);
                   console.log(itemarkers.length);
                   if (itemarkers.length === msg.count) {
                       if (active === 0) {
                           active = 1;
                           console.log("Optimal Length reached" + itemarkers);
                           //Draw the path Now!!
                           for (var i = 0; i < itemarkers.length; i+=2) {
                               var src = itemarkers[i].getPosition();
                               if(i<itemarkers.length) {
                                   var des = itemarkers[i + 1].getPosition();
                                   getDirections(map, src, des);
                               }
                           }
                       }
                   }


           });*/

            //Get Count of routes manually
           //Set the count of routes ma

           //console.log("Contents of the array are"+routearr);


       });


    });

}

//The OverView Page Controller
function overviewpagecontroller()
{
    if(document.getElementById("pp-nav") != null)
    {
        document.getElementById("pp-nav").remove();

    }
    console.log("You are viewing the overview page for"+serachmap+"  "+name);
    $(document).ready(function(){
        console.log("Ready to launch");
        $('#Goback').on('click', function(evt){
            window.location.href="#";
        });
        //Start of overViewController
        //Fetch Background Image
        var doc=document.getElementById('overimagecontainer');
        socket.emit("searchimage", {mapname:serachmap});
        socket.on("getimagesearch", function(msg){
            piclocation=msg.location+"/"+msg.picname;
            console.log("in OverView Images "+piclocation);
            var temele=document.getElementById("imgsrc"+msg.picname);
            if(temele == null) {
                var imgele = document.createElement("img");
                imgele.setAttribute("id", "imgsrc" + msg.picname);
                imgele.setAttribute("src", piclocation);
                doc.appendChild(imgele);
                //$('#overimagecontainer').attr('background-image','url("'+piclocation+'")');

            }

            $('#MapName').text(serachmap);
            //$('#description').text("Fancy Trip");
            //Get the description for the trip
            socket.emit("getdes", {mapname:serachmap});
            socket.on("recdes", function(msg)
            {
               var des=msg.description;
               console.log("Description text"+$('#description').text());
               //Check to see if the description object contains text
                if($('#description').text() === "")
                {
                    $('#description').text(des);
                }


            });

        });



    });

}

//The View Gallery Controller
function viewgallerycontrol()
{
    console.log("In View Gallery controller"+ serachmap);
    $(document).ready(function(){
        loc1=[];
        $('#mapname').text("You are viewing Map "+serachmap);
        //Put Gallery Code Here
        $('#viewgallery').magnificPopup({
            delegate:'a',
            type:'image',
            image:{
                verticalFit:true
            },
            gallery:{
                enabled:true
            },
            callbacks:{
                open:function(){

                },
                beforeClose:function (){
                }
            }
        });

        socket.emit("ViewGall",{mapid:serachmap});
        socket.on("ViewGallReturn", function(mssg){
            console.log(mssg.description);
            console.log(mssg.picname);
            console.log(mssg.picpath);

            if(mssg.picname != undefined && mssg.picpath!=undefined) {
                var loc=mssg.picpath+"/"+mssg.picname;
                console.log("loc"+loc);
                loc1.push(loc);
                var temp=document.getElementById(mssg.picname);
                if(temp == undefined)
                {
                    var text=mssg.description;
                    if(text == "")
                        text="No description yet";

                    $('#viewgallery').append('<div class="col-xs-6 col-sm-4 col-md-3 col-lg-2" id="div'+mssg.picname+'"><a href="' + loc + '" class="thumbnail"><img class="img-responsive" src="' + loc + '" alt="' + mssg.picname + '" id="'+mssg.picname+'"></a></div>');
                }



            }
        });


        });




}

var requestarr=[];


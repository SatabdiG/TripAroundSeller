//Description: This script contains the controllers to generate specific views of the Iteniary Page

//Controller for the iteniary page
var itemarkers=[];


function iteniarygenerator()
{
    $(".modal-backdrop").remove()
    var count=1;
    $(document).ready(function(){
        if(userid === undefined)
        {
            userid=sessionStorage.getItem("username");
            mapname=sessionStorage.getItem("mapname");
        }
        if(lang === "")
        {
            lang=sessionStorage.getItem("lang");
        }
        $('#itelogout').click(function(){
            sessionStorage.setItem("username",undefined);
            sessionStorage.setItem("mapname",undefined);
            userid="";
            name="";
            mapname="";
            return true;
        });
        console.log("You are in the iteniary page"+userid);
        initialize();
        var dat={};
        dat.mapID=mapname;
        dat.userid=userid;

        $.ajax({
            url: '/fetchiter',
            method: 'POST',
            data: JSON.stringify(dat),
            contentType: 'application/json'
        }).done(function(msg){
            // console.log(typeof msg);
            // console.log(msg);
            myobj = JSON.parse(msg);
            for(i = 1; i <= parseInt(myobj["tot_contents"]); i++){
                heading = "heading_";
                content = "content_";
                heading_name = heading.concat(i.toString());
                content_name = content.concat(i.toString());
                //Main Container div
                var mother=document.createElement('div');
                mother.setAttribute('class','row');
                var momsec=document.createElement('div');
                momsec.setAttribute('class','col-lg-6');
                var replaced_heading_name = myobj[heading_name].split(' ').join('-');
                var container = document.createElement('div');
                container.setAttribute("id", replaced_heading_name);
                container.setAttribute("class", "itenary-panel");
                //Thumbnail div
                var thumb = document.createElement('div');
                thumb.setAttribute("id", "thumb" + replaced_heading_name);
                thumb.setAttribute("class", "itenary-thumbnail");
                //Description div
                var des = document.createElement("div");
                des.setAttribute("id", "des" + replaced_heading_name);
                des.setAttribute("class", "itenary-des");

                //Header
                var head = document.createElement("div");
                head.setAttribute("id", "head" + replaced_heading_name);
                head.setAttribute("class", "itenary-header");

                //Adding Header elements
                var tempstyling = document.createElement("H2");
                var newconent = document.createTextNode(myobj[heading_name]);
                tempstyling.appendChild(newconent);

                //Add to head
                head.appendChild(newconent);
                container.appendChild(head);
                //Adding Thumbnail
                container.appendChild(thumb);
                // ** Add Text Box - for adding descriptions **//
                var tempbox = document.createElement("textarea");
                tempbox.setAttribute("id", "text" + replaced_heading_name);
                tempbox.setAttribute("class", "textboxiteniarypage");
                tempbox.innerHTML = myobj[content_name]
                // tempbox.setAttribute("placeholder", "Please enter Text Description for tour stop here");
                //Add to div des
                des.appendChild(tempbox);
                container.appendChild(des);

                // *** Buttons ****//

                //Delete button
                var button = document.createElement('button');
                var tmp = document.createTextNode('Delete');
                button.setAttribute("id", "del" + replaced_heading_name);
                button.setAttribute("class", "btn btn-danger");
                button.appendChild(tmp);

                // **  Add Button for Finishing edits and saving to the server **//
                var buttonsave = document.createElement("button");
                buttonsave.setAttribute("id", "buttonsubmit" + replaced_heading_name);
                buttonsave.setAttribute("class", "btn btn-primary");
                var textsave = document.createTextNode(' Save ');
                buttonsave.appendChild(textsave);

                //** Edit Button for Rediting the tour stop **//
                var editbutton = document.createElement("button");
                editbutton.setAttribute("id", "editbutton" + replaced_heading_name);
                editbutton.setAttribute("class", "btn btn-primary");
                var textedit = document.createTextNode('Edit');
                editbutton.appendChild(textedit);
                //**Edit Transportation **//

                //container.appendChild(footer);
                container.appendChild(button);
                container.appendChild(buttonsave);
                container.appendChild(editbutton);

                //newconent.setAttribute("type", "text");
                //newconent.setAttribute("placeholder", "Enter Place Name");
                momsec.appendChild(container);
                mother.appendChild(momsec);
                $('#IteniaryPage').append(mother);
            }

        });

        var durationtotal=4;
        for(i=1;i<durationtotal;i++)
        {
            var buttontxt="dur"+i;
            $("#"+buttontxt).on("click", function () {
               console.log("Clicked");
                var values=$(this).text();
               $("#duration").val(values);
            });
        }
       $("#dur1").on("click", function(evt)
       {
          var values=$(this).text();
          $("#duration").val(values);
       });
    //Contains user created markers
    var markers = [];

    var createMarker=0;
    var seennames=[];
    $(".itenary-panel").accordion({
        collapsible: true
    });

    $("#logoutbutton").on('click', function()
    {
        console.log("Logout button is clicked");
       //Logout and cancel the sesion
        userid="";
        name="";
        mapname="";
        window.location.href="#";
    });
    locnames=[];

    //fetch Results and populate the page
    socket.emit("getTourStops",{"userid":userid,"mapname":mapname});
    socket.on("viewTourStops",function(msg){
        console.log("Got message"+msg.name);
        //Create existing tourStops
        console.log("Name is"+locnames.indexOf(msg.name));
        if(locnames.indexOf(msg.name) === -1) {
            locnames.push(msg.name);
            console.log("locnames"+locnames);
            //var nmt=msg.name.replace(/ /g,'');
            var dur=msg.duration;
            var strtmp=msg.name;
            var str1=strtmp.replace(/. /g,'');
            var str2=str1.replace(/,/g,'');
            var str3=str2.replace("/",'');
            var nmt=str3;
            console.log("Iterniary page nmt "+str3);
            var description=msg.description;
            var vehcile=msg.vehicle;
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
            //Create the rest of the structure
            //Create a header for the string

            tempstr = "Duration : "+dur+" Days in "+msg.name;
            //Main Container div
            var tempid=document.getElementById("head"+nmt);
            if(tempid === null) {
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
                //Add input tp thumb
                var inp = document.createElement("input");
                inp.setAttribute("type", "file");
                inp.setAttribute("multiple", "multiple");
                inp.setAttribute("id", "inp" + nmt);
                inp.setAttribute("accept", "image/*");
                inp.setAttribute("resize", "none");
                thumb.appendChild(inp);
                //Description div
                var des = document.createElement("div");
                des.setAttribute("id", "des" + nmt);
                des.setAttribute("class", "itenary-des");

                //Header
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

                // *** Buttons ****//

                //Delete button
                var button = document.createElement('button');
                var tmp = document.createTextNode('Delete');
                button.setAttribute("id", "del" + nmt);
                button.setAttribute("class", "btn btn-danger");
                button.appendChild(tmp);
                //footer.appendChild(button);
                // **  Add Button for Finishing edits and saving to the server **//
                var buttonsave = document.createElement("button");
                buttonsave.setAttribute("id", "buttonsubmit" + nmt);
                buttonsave.setAttribute("class", "btn btn-primary");
                var textsave = document.createTextNode(' Save ');
                buttonsave.appendChild(textsave);
                //footer.appendChild(buttonsave);
                //** Edit Button for Rediting the tour stop **//
                var editbutton = document.createElement("button");
                editbutton.setAttribute("id", "editbutton" + nmt);
                editbutton.setAttribute("class", "btn btn-primary");
                var textedit = document.createTextNode('Edit');
                editbutton.appendChild(textedit);
                //**Edit Transportation **//
                //**Edit Transportation **//
                //Create Image Gallery
                //This becomes the gallerry
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

                //footer.appendChild(editbutton);

                //container.appendChild(footer);
                container.appendChild(button);
                container.appendChild(buttonsave);
                container.appendChild(editbutton);
                container.appendChild(imgholder);
                //newconent.setAttribute("type", "text");
                //newconent.setAttribute("placeholder", "Enter Place Name");
                momsec.appendChild(container);
                mother.appendChild(momsec);
                $('#IteniaryPage').append(mother);
            }

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
            //$('#IteniaryPage').append(tempbox);
            //$('#IteniaryPage').append(button);
            //$('#IteniaryPage').append(buttonsave);
            //$('#IteniaryPage').append(editbutton);

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
            var tempmapname=msg.name;
            //Initialize the gallery if present
            console.log("tourstopname is"+userid);
            socket.emit("fetchImg", {"userid": userid, "tourstopname": msg.name, "mapname": mapname});
            socket.on("getImg", function (msg) {
                //Fetch and draw the gallery
                console.log("Nmt is"+nmt);
                var picname = msg.picname;
                var picpath = msg.picpath;

                    console.log("the Data returned is" + picname + "  " + picpath);
                    var totalpath = picpath + "/" + picname;
                    console.log("The picpath is" + totalpath);
                    var appendto = document.getElementById('ul' + nmt);
                    var div = document.createElement("div");
                    var li = document.createElement("li");
                    var img = document.createElement("img");
                    img.setAttribute("class", "displayimg");
                    img.setAttribute("id", "img"+nmt+picname);
                    var temlpele=document.getElementById("img"+nmt+picname);

                    //$('#gall'+marker.title).append('<img src="'+e.target.result+'" class="displayimg" >');
                    img.setAttribute("src", totalpath);
                    if(temlpele === null) {
                        if(msg.tourstopname === tempmapname ) {
                            li.appendChild(img);
                            //div.appendChild(img);
                            appendto.appendChild(li);
                        }
                    }

                    $('#slide' + nmt).jcarousel('scroll', '+=2');
                    $('#slide' + nmt).jcarousel('reload');
                    //appendto.appendChild(div);
                    //var name=marker.title;
                    /// console.log("Name is"+name);
                    //Create two button
                    $('#slide' + nmt).jcarousel('reload');


            });


            //Delete the marker stop
            $('#del' + nmt).on('click', function () {
                console.log("Delete button is pressed");
                var tempobj = document.getElementById(nmt);
                tempobj.remove();
                var del = document.getElementById("del" + nmt);
                if (del != undefined)
                    del.remove();
                var sav = document.getElementById("buttonsubmit" + nmt);
                if (sav != undefined)
                    sav.remove();
                var edit = document.getElementById("editbutton" + nmt);
                if (edit != undefined)
                    edit.remove();
                //Remove the Database entry
                var sentdata = {};
                sentdata.username = userid;
                sentdata.mapname = mapname;
                sentdata.tourstopname = nmt;
                console.log("Sending data" + sentdata);
                $.ajax({
                    url: ('/deleteTourStop'),
                    method: "POST",
                    data: JSON.stringify(sentdata),
                    contentType: 'application/JSON'

                }).done(function (msg) {
                    console.log("Your Map has been deleted" + msg);
                    if (msg === "yes") {
                        //Set status message
                        $("#statusText").css("color", "green");
                        $("#statusText").text("Your Map has been deleted");

                    } else {
                        $("#statusText").css("color", "red");
                        $("#statusText").text("Your Map has not  been deleted");
                    }
                });
                //$('#IteniaryPage').remove($('#del'+marker.title));
                //Set the Map marker to null
                //Remove to itemarkers
                marker.setMap(null);
                //Remove a marker from the array List
                var index = itemarkers.indexOf(marker);
                if (index > 1) {
                    itemarkers.splice(index, 1);
                }

            });

            //SaveButton clicked save the details on the database
            $('#buttonsubmit' + nmt).on('click', function () {
                this.seennames=[];

                    console.log("The save button is clicked!" + msg.name + "  " + this.seennames);
                    this.seennames.push(strtmp);
                    seennames.push(strtmp);

                    //Get the Text Area and make it an div elements
                    var replacediv = document.createElement("div");
                    var data = $('#text' + nmt).val();
                    var tempnode = document.createTextNode($('#text' + nmt).val());
                    console.log("Data is" + $('#text' + nmt).val());
                    replacediv.appendChild(tempnode);
                    replacediv.setAttribute("id", "text" + nmt);
                    $('#text' + nmt).replaceWith(replacediv);
                    var filename = [];
                    var form = new FormData();
                    var senddata = {};
                    senddata.user = userid;
                    senddata.name = mapname;
                    form.append('details', JSON.stringify(senddata));
                    var fileele = document.getElementById("inp" + nmt).files;
                    if (fileele.length > 0) {
                        //There are enough pictures to save

                        for (var i = 0; i < fileele.length; i++) {
                            var filetmp = fileele[i];
                            console.log("File name" + filetmp.name);
                            form.append('uploads[]', filetmp, filetmp.name);
                            filename.push(filetmp.name);
                            picobj = filetmp.name;

                        }
                    }
                    var usertourstopname = {};
                    usertourstopname.mapname = mapname;
                    usertourstopname.tourstopname = strtmp;
                    console.log("Sending data !!!"+strtmp);
                    usertourstopname.userid = userid;
                    usertourstopname.filename = filename;
                    form.append("usetourstop", JSON.stringify(usertourstopname));

                    $.ajax({
                        url: "/usertourstop",
                        type: "POST",
                        data: form,
                        processData: false,
                        contentType: false
                    }).done(function (msg) {
                        console.log(msg);
                        if (msg == "yes") {

                            $("#statusText").text("File has been uploaded");
                            $("#statusText").css({"color": "green"});

                        }
                        else
                            $("#uploadstatus").text("File has not been uploaded");
                    });

                    var userobj = {};

                    userobj.markername = msg.name;
                    userobj.lat = marker.getPosition().lat();
                    userobj.lng = marker.getPosition().lng();
                    userobj.des = data;
                    userobj.pos = count;
                    count += 1;


                    userobj.name = userid;
                    userobj.mapname = mapname;

                    console.log("Sending data" + userobj);
                    //Code Stub -- All contents are saved to the iteniary page in the database
                    $.ajax({
                        url: ('/tourstopsave'),
                        method: 'POST',
                        data: JSON.stringify(userobj),
                        contentType: 'application/JSON'
                    }).done(function (msg) {
                        console.log("returedn" + msg);
                        if (msg == "yes") {
                            $('#statusText').css("color", "green");
                            $('#statusText').text("Your Tour stops are now saved");

                        } else {
                            $('#statusText').css("color", "red");
                            $('#statusText').text("Your Tour stops are not saved");
                        }
                    });



            });
            //Editbutton is clicked make changes editable
            $('#editbutton' + nmt).on('click', function () {
                console.log("Edit button is clicked");
                //Write contents to make the text line editable
                //Get the Text Box back again
                $('#text' + nmt).focus();
                $('#text' + nmt).focus().select;
                if ($('#text' + nmt)[0].tagName == 'DIV') {
                    //Then Replace else do nothing
                    $('#text' + nmt).focus();
                    $('#text' + nmt).focus().select;
                    var inputbox = document.createElement("textarea");
                    var currdata = document.getElementById("text" + nmt);
                    var data = currdata.innerHTML;
                    inputbox.setAttribute("id", "text" + nmt);
                    inputbox.innerHTML = data;
                    $('#text' + nmt).replaceWith(inputbox);

                }
            });

            //The gallery controller
            $('#inp' + nmt).on("change", function (evt) {

                console.log("Images have been uploaded");
                //Create the gallery
                // The gallery controller is : gall+marker.title
                //get the individual pictures
                var appendto = document.getElementById('ul' + nmt);
                var appendd = document.getElementById('gall' + nmt);
                var input = $('#inp' + nmt).get(0).files;
                var srcs = [];

                for (var i = 0; i < input.length; i++) {
                    console.log("Printing to console");
                    //contains each pic file

                    var eachfil = input[i];
                    //Create an a element
                    var reader = new FileReader();
                    reader.readAsDataURL(eachfil);
                    reader.onload = function (e) {
                        console.log("In Reader");
                        var div = document.createElement("div");
                        var li = document.createElement("li");
                        var img = document.createElement("img");
                        img.setAttribute("class", "displayimg");
                        //$('#gall'+marker.title).append('<img src="'+e.target.result+'" class="displayimg" >');
                        img.setAttribute("src", e.target.result);
                        li.appendChild(img);
                        //div.appendChild(img);
                        appendto.appendChild(li);
                        /*
                         $('#slide'+marker.title).cycle({
                         fx:'scrollHorz',
                         speed: 300,
                         delay:-2000,
                         timeout:0,
                         //next:'#slide'+marker.title,
                         next:'#slide'+marker.title,
                         pause:1
                         });*/
                        $('#slide' + nmt).jcarousel('scroll', '+=2');
                        $('#slide' + nmt).jcarousel('reload');
                    };
                    //sliderInit(marker.title);
                }
                $('#slide' + nmt).jcarousel('reload');

            });
            //Replay tour button Click
            $('#replayTourAnimation').trigger('click');
        }
    });


    var input=document.getElementById('place');
    var serachbOx = new google.maps.places.SearchBox(input);
    // map.controls[google.maps.ControlPosition.CENTER].push(input);

    map.addListener('bounds_changed', function () {
        serachbOx.setBounds(map.getBounds());
    });
    var tempstr;
    //Create Tour Stop button
    $('#createTourStop').on("click", function(evt)
    {
        console.log("In Create Tour");
        createMarker=1;
        if(markers.length>0 && $('#place').val()!="") {
            //Empty the text field
            $('#place').val("");

            markers.forEach(function (marker) {
                itemarkers.push(marker);
                if(marker.title != null){
                    //Create a header for the string
                    if($("#duration").val()!== "")
                    {
                        tempstr = "Duration :"+$('#duration').val()+" Days in "+marker.title;
                    }else
                    tempstr = marker.title;
                    //Main Container div
                    var mother=document.createElement('div');
                    mother.setAttribute('class','row');
                    var momsec=document.createElement('div');
                    momsec.setAttribute('class','col-lg-6');
                    var container = document.createElement('div');
                    container.setAttribute("id", marker.title);
                    container.setAttribute("class", "itenary-panel");
                    //Footer div
                    var footer = document.createElement('div');
                    footer.setAttribute("id", "foot" + marker.title);
                    footer.setAttribute("class", "itenary-footer");
                    //Thumbnail div
                    var thumb = document.createElement('div');
                    thumb.setAttribute("id", "thumb" + marker.title);
                    thumb.setAttribute("class", "itenary-thumbnail");
                    //Add input tp thumb
                    var inp=document.createElement("input");
                    inp.setAttribute("type","file");
                    inp.setAttribute("multiple","multiple");
                    inp.setAttribute("id","inp"+marker.title);
                    inp.setAttribute("accept","image/*");
                    inp.setAttribute("resize","none");
                    thumb.appendChild(inp);
                    //Description div
                    var des = document.createElement("div");
                    des.setAttribute("id", "des" + marker.title);
                    des.setAttribute("class", "itenary-des");

                    //Header
                    var head = document.createElement("div");
                    head.setAttribute("id", "head" + marker.title);
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
                    tempbox.setAttribute("id", "text" + marker.title);
                    tempbox.setAttribute("class", "textboxiteniarypage");
                    tempbox.setAttribute("placeholder", "Please enter Text Description for tour stop here");
                    //Add to div des
                    des.appendChild(tempbox);
                    container.appendChild(des);

                    // *** Buttons ****//

                    //Delete button
                    var button = document.createElement('button');
                    var tmp = document.createTextNode('Delete');
                    button.setAttribute("id", "del" + marker.title);
                    button.setAttribute("class", "btn btn-danger");
                    button.appendChild(tmp);
                    //footer.appendChild(button);
                    // **  Add Button for Finishing edits and saving to the server **//
                    var buttonsave = document.createElement("button");
                    buttonsave.setAttribute("id", "buttonsubmit" + marker.title);
                    buttonsave.setAttribute("class", "btn btn-primary");
                    var textsave = document.createTextNode(' Save ');
                    buttonsave.appendChild(textsave);
                    //footer.appendChild(buttonsave);
                    //** Edit Button for Rediting the tour stop **//
                    var editbutton = document.createElement("button");
                    editbutton.setAttribute("id", "editbutton" + marker.title);
                    editbutton.setAttribute("class", "btn btn-primary");
                    var textedit = document.createTextNode('Edit');
                    editbutton.appendChild(textedit);
                    //**Edit Transportation **//
                    //Create Image Gallery
                    //This becomes the gallerry
                    var imgholder=document.createElement("div");
                    imgholder.setAttribute("id","gall"+marker.title);
                    imgholder.setAttribute("class","jcarousel-wrapper");
                    var slideshow=document.createElement("div");
                    slideshow.setAttribute("id","slide"+marker.title);
                    slideshow.setAttribute("class","jcarousel");
                    var ul=document.createElement("ul");
                    ul.setAttribute("id","ul"+marker.title);
                    slideshow.appendChild(ul);
                    imgholder.appendChild(slideshow);

                    //footer.appendChild(editbutton);
                    //container.appendChild(footer);

                    container.appendChild(button);
                    container.appendChild(buttonsave);
                    container.appendChild(editbutton);
                    container.appendChild(imgholder);
                    //newconent.setAttribute("type", "text");
                    //newconent.setAttribute("placeholder", "Enter Place Name");
                    momsec.appendChild(container);
                    mother.appendChild(momsec);
                    $('#IteniaryPage').append(mother);

                    $('#slide'+marker.title).jcarousel();


                    $('#slide'+marker.title).mousewheel(function(event, delta) {
                        event.preventDefault();
                        if (delta < 0) {
                            $('#slide' + marker.title).jcarousel('scroll', -1);
                        }
                        else if (delta > 0) {
                            $('#slide' + marker.title).jcarousel('scroll', +1);
                        }

                    });



                    //$('#IteniaryPage').append(tempbox);
                    //$('#IteniaryPage').append(button);
                    //$('#IteniaryPage').append(buttonsave);
                    //$('#IteniaryPage').append(editbutton);


                    //Delete the marker stop
                    $('#del' + marker.title).on('click', function () {
                        console.log("Delete button is pressed");
                        var tempobj = document.getElementById(marker.title);
                        tempobj.remove();
                        var del = document.getElementById("del" + marker.title);
                        if(del!=undefined)
                            del.remove();
                        var sav = document.getElementById("buttonsubmit" + marker.title);
                        sav.remove();
                        var edit = document.getElementById("editbutton" + marker.title);
                        edit.remove();

                        //$('#IteniaryPage').remove($('#del'+marker.title));
                        //Set the Map marker to null
                        //Remove to itemarkers
                        marker.setMap(null);
                        //Remove a marker from the array List
                        var index = itemarkers.indexOf(marker);
                        if (index > 1) {
                            itemarkers.splice(index, 1);
                        }
                    });

                    //SaveButton clicked save the details on the database
                    $('#buttonsubmit' + marker.title).on('click', function () {
                        console.log("The save button is clicked");
                        //Get the Text Area and make it an div elements
                        var replacediv = document.createElement("div");
                        var data = $('#text' + marker.title).val();
                        var tempnode = document.createTextNode(data);
                        var filename=[];
                        var usertourstopname={};
                        replacediv.appendChild(tempnode);
                        replacediv.setAttribute("id", "text" + marker.title);
                        $('#text' + marker.title).replaceWith(replacediv);
                        //Save the images uploaded
                        var form=new FormData();
                        var senddata={};
                        senddata.user=userid;
                        senddata.name=mapname;
                        form.append('details',JSON.stringify(senddata));
                        var fileele=document.getElementById("inp"+marker.title).files;
                        if(fileele.length>0)
                        {
                            //There are enough pictures to save

                            for(var i=0;i<fileele.length;i++)
                            {
                                var filetmp=fileele[i];
                                console.log("File name"+filetmp.name);
                                form.append('uploads[]',filetmp,filetmp.name);
                                filename.push(filetmp.name);
                                picobj=filetmp.name;

                            }
                        }
                        usertourstopname.mapname=mapname;
                        usertourstopname.tourstopname=marker.title;
                        usertourstopname.userid=userid;
                        usertourstopname.filename=filename;
                        form.append("usetourstop",JSON.stringify(usertourstopname));

                        $.ajax({
                            url:"/usertourstop",
                            type:"POST",
                            data:form,
                            processData:false,
                            contentType:false
                        }).done(function(msg){
                            console.log(msg);
                            if(msg == "yes") {

                                $("#statusText").text("File has been uploaded");
                                $("#statusText").css({"color":"green"});

                            }
                            else
                                $("#uploadstatus").text("File has not been uploaded");
                        });
                        var userobj={};

                        userobj.markername = marker.title;
                        userobj.lat = marker.getPosition().lat();
                        userobj.lng = marker.getPosition().lng();
                        userobj.des = $('#text' + marker.title).text();
                        userobj.pos=count;
                        userobj.duration=$("#duration").val();
                        count+=1;


                    userobj.name = userid;
                    userobj.mapname = mapname;

                    console.log("Sending data"+userobj);
                    //Code Stub -- All contents are saved to the iteniary page in the database
                    $.ajax({
                        url: ('/tourstopsave'),
                        method: 'POST',
                        data: JSON.stringify(userobj),
                        contentType: 'application/JSON'
                    }).done(function (msg) {
                        console.log("returedn" + msg);
                        if (msg == "yes") {
                            $('#statusText').css("color","green");
                            $('#statusText').text("Your Tour stops are now saved");

                        }else
                        {
                            $('#statusText').css("color","red");
                            $('#statusText').text("Your Tour stops are not saved");
                        }
                    });
                    });
                    //Editbutton is clicked make changes editable
                    $('#editbutton' + marker.title).on('click', function () {
                        console.log("Edit button is clicked");
                        //Write contents to make the text line editable
                        //Get the Text Box back again
                        $('#text'+marker.title).focus();
                        $('#text'+marker.title).focus().select;
                        if ($('#text' + marker.title)[0].tagName == 'DIV') {
                            //Then Replace else do nothing
                            $('#text'+marker.title).focus();
                            $('#text'+marker.title).focus().select;
                            var inputbox = document.createElement("textarea");
                            var currdata = document.getElementById("text" + marker.title);
                            var data = currdata.innerHTML;
                            inputbox.setAttribute("id", "text" + marker.title);
                            inputbox.innerHTML = data;
                            $('#text' + marker.title).replaceWith(inputbox);

                        }
                    });

                    //The gallery controller
                    $('#inp'+marker.title).on("change", function(evt)
                    {

                       console.log("Images have been uploaded");
                       //Create the gallery
                       // The gallery controller is : gall+marker.title
                        //get the individual pictures
                        var appendto=document.getElementById('ul'+marker.title);
                        var appendd=document.getElementById('gall'+marker.title);
                        var input=$('#inp'+marker.title).get(0).files;
                        var srcs=[];

                        for(var i=0;i<input.length;i++)
                        {
                            console.log("Printing to console");
                            //contains each pic file

                            var eachfil=input[i];
                            //Create an a element
                            var reader=new FileReader();
                            reader.readAsDataURL(eachfil);
                            reader.onload=function(e){
                                console.log("In Reader");
                                var div=document.createElement("div");
                                var li=document.createElement("li");
                                var img=document.createElement("img");
                                img.setAttribute("class","displayimg");
                                //$('#gall'+marker.title).append('<img src="'+e.target.result+'" class="displayimg" >');
                                img.setAttribute("src",e.target.result);
                                li.appendChild(img);
                                //div.appendChild(img);
                                appendto.appendChild(li);
                                /*
                                $('#slide'+marker.title).cycle({
                                    fx:'scrollHorz',
                                    speed: 300,
                                    delay:-2000,
                                    timeout:0,
                                    //next:'#slide'+marker.title,
                                    next:'#slide'+marker.title,
                                    pause:1
                                });*/
                                $('#slide'+marker.title).jcarousel('scroll','+=2');
                                $('#slide'+marker.title).jcarousel('reload');
                            };
                            //sliderInit(marker.title);
                        }
                        //appendto.appendChild(div);
                        //var name=marker.title;
                       /// console.log("Name is"+name);
                        //Create two button
                        var prev=document.createElement("a");
                       prev.setAttribute("href","#");
                       prev.setAttribute("class","jcarousel-control-prev");
                        prev.setAttribute("id","prev");
                        var textnode=document.createTextNode("<<");
                      prev.appendChild(textnode);

                       var next=document.createElement("a");
                        next.setAttribute("id","next");
                        next.setAttribute("href","#");
                        next.setAttribute("class","jcarousel-control-next");
                       var textnode1=document.createTextNode(">>");
                       next.appendChild(textnode1);

                       appendd.appendChild(prev);
                       appendd.appendChild(next);
                        $('.jcarousel-control-prev')
                            .on('jcarouselcontrol:active', function() {
                                $(this).removeClass('inactive');
                            })
                            .on('jcarouselcontrol:inactive', function() {
                                $(this).addClass('inactive');
                            })
                            .jcarouselControl({
                                target: '-=1'
                            });

                        $('.jcarousel-control-next')
                            .on('jcarouselcontrol:active', function() {
                                $(this).removeClass('inactive');
                            })
                            .on('jcarouselcontrol:inactive', function() {
                                $(this).addClass('inactive');
                            })
                            .jcarouselControl({
                                target: '+=1'
                            });

                        $('#slide'+marker.title).jcarousel('reload');

                    });
                }
            });


        }
        console.log("In Loop The size of array"+itemarkers.length);
        if(itemarkers.length>1)
        {
            src=itemarkers[(itemarkers.length)-2].getPosition();
            des=itemarkers[(itemarkers.length)-1].getPosition();
            getDirections(map,src,des);

        }

    });

    // getDirections(map);

    serachbOx.addListener('places_changed', function () {
        var places = serachbOx.getPlaces();

        if (places.length == 0) {
            return;
        }

        /*
         markers.forEach(function (marker) {
         marker.setMap(null);
         });*/

        markers = [];

        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("PLace has no geometry --- Error");
                return;
            }
            /*
             var icon = {
             url:"http://maps.google.com/mapfiles/ms/micons/blue.png",
             size: new google.maps.Size(120, 120),
             origin: new google.maps.Point(0, 0),
             anchor: new google.maps.Point(17, 34),
             scaledSize: new google.maps.Size(25, 25)
             };*/

            markers.push(new google.maps.Marker({
                map: map,
                icon:"http://maps.google.com/mapfiles/ms/micons/blue.png",
                title: place.name,
                position: place.geometry.location
            }));
            map.panTo(place.geometry.location);
            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }

        });

    });
    //Blah
   //Add handler for ReplayTour button

    $('#replayTourAnimation').on('click', function(evt)
    {

            console.log("Inreplay tour aimation");
            //Check to see the contents of itemarkers
            if (itemarkers.length == 0) {
                //No markers ! ask users to add markers
                $('#statusText').text("Please Enter a tour stop");
                $('#place').css('background-color', " #f3c4e2 ");

            } else {
                if (itemarkers.length == 1) {
                    //Only One marker unable to animate path
                    $('#statusText').text("Please Enter at least two tour stop");
                    $('#place').css('background-color', " #f3c4e2 ");
                } else {
                    //Set the status messages to null. remove the css on place if present
                    $('#statusText').text("");
                    $('#place').css('background-color', "#f9f6f8");
                    //Draw the route marker
                    console.log("Length of itemarker" + itemarkers.length);
                    var tempcount=0;
                    for (var i = 0; i < itemarkers.length; i ++) {
                        if(tempcount<itemarkers.length) {
                            //console.log("*******"+tempcount+"  "+i);
                            src = itemarkers[i].getPosition();
                            des = itemarkers[tempcount].getPosition();
                            getDirections(map, src, des);
                        }

                    }
                }
            }



    });
         translateFunction(translateNavbar, translateIteniary);
    });

    $('#saveIteniary').on('click', function(evt)
    {
        console.log("Saving Iteniary"+itemarkers.length);
        var userobj={};
        var routeobjs=[];
        var count=1;
        if(itemarkers.length>0) {
            itemarkers.forEach(function (marker) {
                var routeobj = {};
                routeobj.name = marker.title;
                routeobj.lat = marker.getPosition().lat();
                routeobj.lng = marker.getPosition().lng();
                routeobj.des = $('#text' + marker.title).text();
                routeobj.pos=count;
                routeobjs.push(routeobj);
                count+=1;

            });
            userobj.name = userid;
            userobj.mapname = mapname;
            userobj.objs = routeobjs;

            //Code Stub -- All contents are saved to the iteniary page in the database
            $.ajax({
                url: ('/itesave'),
                method: 'POST',
                data: JSON.stringify(userobj),
                contentType: 'application/JSON'
            }).done(function (msg) {
                console.log("returedn" + msg);
                if (msg == "yes") {
                    $('#statusText').css("color","green");
                    $('#statusText').text("Your Tour stops are now saved");

                }else
                {
                    $('#statusText').css("color","red");
                    $('#statusText').text("Your Tour stops are not saved");
                }
            });

        }
        else
        {
            $('#statusText').css("color","red");
            $('#statusText').text("Please enter at least one Tour Stop to proceed");
        }

    });


}

function moveMarker(map,marker,latlng)
{
    marker.setPosition(latlng);
    map.panTo(latlng);
}

function autoRefresh(map,pathcoords)
{
    //console.log("Returend path"+pathcoords);
    var i, marker, route;

    route= new google.maps.Polyline({
        path:[],
        geodesic:true,
        strokeColor:'#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        editable:false,
        map:map

    });

    marker= new google.maps.Marker({
        map:map,
        icon:"http://maps.google.com/mapfiles/ms/micons/blue.png"
    });


    for(var i=0;i<pathcoords.length;i++)
    {
        setTimeout(function(coords){
            route.getPath().push(coords);
           // moveMarker(map,marker,coords);

        }, 50 *i, pathcoords[i]);
    }
}

function getDirections(map,src,des)
{
    //Shut off the Replay event Handler Until taskcomplete
    var directionservice= new google.maps.DirectionsService();
    //console.log("The direction"+src+"  "+des);

    var request={
        //Modify this here
        //origin: new google.maps.LatLng(51.5087531, -0.1281153),
        origin:src,
        //destination: new google.maps.LatLng(48.8583694, 2.2944796),
        destination:des,
        travelMode:google.maps.TravelMode.DRIVING
    };

    directionservice.route(request,function(result, status){
        if(status == google.maps.DirectionsStatus.OK)
        {
            autoRefresh(map,result.routes[0].overview_path);
        }

    });
}


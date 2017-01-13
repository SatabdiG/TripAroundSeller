/**
 * Created by tasu on 24/11/16.
 */
//The Search Page Controller
//Globalvariable contains the map that has been clicked.
serachmap="";
function serachpage()
{


    console.log("In Search Page in controller");
    $(document).ready(function()
    {
        //Change button text
        if(sessionStorage.getItem("username")!== null && userid !=="")
        {
            console.log();
            $("#logoutsearch").html('Go back to Dashboard');
        }

        console.log("Username is "+sessionStorage.getItem("username"));
        if(sessionStorage.getItem("username") === null || userid === "")
        {
            //Display save button
            console.log("To remove button");
            $("#SearchTour").remove();

        }else
        {
            username=sessionStorage.getItem("username");
        }

         $('#logoutsearch').on('click', function(evt){
             console.log("username"+userid);
            if(sessionStorage.getItem("username")!== null && userid !=="")
             {
                 //Rout back to dasboard
                 window.location.href="#dashboard";
             }else
            {
                sessionStorage.setItem("username", null);
                window.location.href="#";
            }
        });

        $('#durationmodal').on("click", function(){
           console.log("Element had been clicked");

        });


       console.log("In Controller");
        console.log("Hello");
        socket.emit("getpublishedmaps", {userid:userid});
        socket.on('receivepublishedmaps', function(msg) {
            console.log("Activated");
            console.log(msg.name);
            console.log(msg.description);
            //$('#viewmapregion').append(msg.name+msg.description);
            var obj = document.getElementById("maps"+msg.name);
            console.log("Objobj"+obj);
            if (obj == null) {
                $('#viewmapregionsearch').append('<div class="col-md-4 col-lg-6"> <div class="favthumbcontainer"><a id="a'+msg.name+'" class="searchlink"><div id="maps' + msg.name + '"><h3>' + msg.name + '</h3>' + '<p>Description: ' + msg.description + '</p></div></a><input type="checkbox" id="check'+msg.name+'" class="customplacementcheck"><div id="imagecontainer'+msg.name+'" class="thumbnail"></div></div></div>');
                var doc = document.getElementById("imagecontainer" + msg.name);
                var location=msg.name;
                //If user if not logged in
                if(sessionStorage.getItem("username") === null || userid === "")
                {
                    $('#check'+msg.name).remove();
                }

                socket.emit("searchimage", {mapname:msg.name});
                socket.on("getimagesearch", function(msg){
                    console.log("Mapname"+location);
                    piclocation=msg.location+"/"+msg.picname;
                    console.log("in get Search Images"+piclocation);
                    var temele=document.getElementById("imgsrc"+location);
                    if(temele == null) {
                        var imgele = document.createElement("img");
                        imgele.setAttribute("id", "imgsrc"+location);
                        imgele.setAttribute("class","thumbnailimg");
                        imgele.setAttribute("src", piclocation);
                        doc.appendChild(imgele);
                    }
                });
                $('#check'+msg.name).on("click", function () {
                    console.log("Checkbox clicked");
                }) ;

                $('#SearchTour').on('click', function () {
                    var input = $( "input:checkbox" );

                    console.log("number of checkboxes found"+input.length);
                    if(input.length > 0) {
                        for (i = 0; i < input.length; i++) {
                            console.log(input[i]);
                            console.log(input[i].getAttribute("id"));
                            var map=input[i].getAttribute("id");
                            var newmap=map.substr(5,map.length);
                            console.log("Sending map"+newmap);
                            if(username !== undefined)
                            {
                                console.log("User currently logged in is"+ username);
                                //Make a database entry with the checkbox

                                var data={};
                                data.username=username;
                                data.favmap=newmap;
                                $.ajax({
                                    url:"/savefav",
                                    method:"POST",
                                    data:JSON.stringify(data),
                                    contentType:'application/JSON'
                                }).done(function (mssg) {
                                   console.log("The mssg returned is"+mssg);
                                   if(mssg === "yes")
                                   {
                                       $("#status").css("color","green");
                                       $("#status").text("Your favorites are now saved");
                                   }
                                });
                            }
                        }
                    }

                });
            }

            $('#a'+msg.name).on('click', function(evt){
               evt.preventDefault();
                sessionStorage.setItem("searchmap", msg.name);
                serachmap=msg.name;
                window.location.href="#overview";
            });
        });
    });

}
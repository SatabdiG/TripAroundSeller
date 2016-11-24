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
        $('#logout').on('click', function(evt){
           window.location.href="#";
        });

       console.log("In Controller");
        console.log("Hello");
        socket.emit("getpublishedmaps", {userid:userid});
        socket.on('receivepublishedmaps', function(msg) {
            console.log("Activated")
            console.log(msg.name);
            console.log(msg.description);
            //$('#viewmapregion').append(msg.name+msg.description);
            var obj = document.getElementById("maps"+msg.name);
            console.log("Objobj"+obj);
            if (obj == null) {
                $('#viewmapregion').append('<div class="row"><div class="col-lg-6"><div class="thumbcontainer"><a id="a'+msg.name+'" class="searchlink"><div id="maps' + msg.name + '"><h3>' + msg.name + '</h3>' + '<p>Description: ' + msg.description + '</p></div></a><div id="imagecontainer'+msg.name+'" class="thumbnail"></div></div></div></div>');
                var doc = document.getElementById("imagecontainer" + msg.name);
                socket.emit("searchimage", {mapname:msg.name});
                socket.on("getimagesearch", function(msg){
                    piclocation=msg.location+"/"+msg.picname;
                    console.log("in get Search Images"+piclocation);
                    var temele=document.getElementById("img"+msg.name);
                    if(temele == null) {
                        var imgele = document.createElement("img");
                        imgele.setAttribute("id", "img" + msg.name);
                        imgele.setAttribute("class","thumbnailimg");
                        imgele.setAttribute("src", piclocation);
                        doc.appendChild(imgele);
                    }

                });



            }





            $('#a'+msg.name).on('click', function(evt){
               evt.preventDefault();
                serachmap=msg.name;
                window.location.href="#viewtour";
            });
        });
    });
}
/**
 * Created by tasu on 24/11/16.
 */
//The Search Page Controller
//Globalvariable contains the map that has been clicked.
serachmap="";
function serachpage()
{
    if(document.getElementById("fp-nav") != null)
    {
        document.getElementById("fp-nav").remove();

    }
    console.log("In Search Page in controller");
    $(document).ready(function()
    {
            $('#logoutsearch').on('click', function(evt){
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
                $('#viewmapregionsearch').append('<div class="col-md-4 col-lg-6"> <div class="thumbcontainer"><a id="a'+msg.name+'" class="searchlink"><div id="maps' + msg.name + '"><h3>' + msg.name + '</h3>' + '<p>Description: ' + msg.description + '</p></div></a><div id="imagecontainer'+msg.name+'" class="thumbnail"></div></div></div>');
                var doc = document.getElementById("imagecontainer" + msg.name);
                var location=msg.name;
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



            }





            $('#a'+msg.name).on('click', function(evt){
               evt.preventDefault();
                serachmap=msg.name;
                window.location.href="#overview";
            });
        });
    });

}
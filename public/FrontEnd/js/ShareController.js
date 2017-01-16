serachmap="";
var map=mapname;

function ShareController()
{
    console.log("In Share Page controller");
    $(document).ready(function()
    {
        $('#logoutsearch').on('click', function(evt){
             window.location.href="#";
        });

        $('#facebook').on('click', function(evt){
             console.log("mapname:"+mapname);
             socket.emit("getmapdet", {mapname:mapname});
             socket.on("viewmapdet", function(msg){
             console.log("publish"+msg.publish);
                 if(msg.publish ==="N") {
                    alert("Please make the map public before sharing");
                }
             })
        });

        userid = sessionStorage.getItem("username");
        mapname = sessionStorage.getItem("mapname");
        console.log(userid);

        $('#viewshare').append('<div id = "imagecontainer'+mapname+'" class="thumbnail" ></div>');
        $('#viewshare').append('');
        $('#viewshare').append('<a id="map'+mapname+'" class="searchlink"><div id="maps' + mapname + '"><h4> http://localhost:3030/#/overview </h4></div></a></br>');
        var doc = document.getElementById("imagecontainer" + mapname);
        var location = mapname;
        socket.emit("searchimage", {mapname:mapname}, {userid:userid});
        socket.on("getimagesearch", function(msg){
            console.log("Mapname"+location);
            console.log(userid);
            piclocation = msg.location+"/"+msg.picname;
            console.log("in get Search Images"+piclocation);
             var temele=document.getElementById("imgsrc" + location);
                    if(temele == null) {
                        var imgele = document.createElement("img");
                        imgele.setAttribute("id", "imgsrc"+location);
                        imgele.setAttribute("class","thumbnailimg");
                        imgele.setAttribute("src", piclocation);
                        console.log(imgele);
                        doc.appendChild(imgele);
                    }
        });


        $('#map'+mapname).on('click', function(evt){
               /*evt.preventDefault();*/
           sessionStorage.setItem("searchmap", mapname);
           serachmap=mapname;
           window.location.href="#overview";
        });

        translateFunction(translateNavbar,translateShare);
    });
}
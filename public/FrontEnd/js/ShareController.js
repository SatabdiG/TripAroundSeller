serachmap="";
var map=mapname;

function ShareController()
{
    console.log("In Share Page controller");
    $(document).ready(function()
    {
        // -muaz This is where map generation gets triggered.
        $('#download_map').on('click', function (evt) {
            var dat={};
            dat.mapID=mapname;
            dat.userid=userid;
            $.ajax({
                url: '/downloadMap',
                method: 'POST',
                data: JSON.stringify(dat),
                contentType: 'application/json'
            }).done(function(msg){
                console.log('This is my msg : '+msg);
                var mymapDownloadObj = document.getElementById("mymapDownload");
                var imgele = document.getElementById("imgsrcmymapDownload");
                if(imgele == null){
                    var linnk = document.createElement("a");
                    var imgele = document.createElement("img");
                    linnk.setAttribute("download", mapname+".png");
                    linnk.setAttribute("href", msg);
                    linnk.setAttribute("title", mapname);
                    imgele.setAttribute("id", "imgsrcmymapDownload");
                    imgele.setAttribute("class","thumbnailimg");
                    imgele.setAttribute("src", msg);
                    imgele.setAttribute("height", 170);
                    imgele.setAttribute("width", 360);
                    linnk.appendChild(imgele);
                    mymapDownloadObj.appendChild(linnk);
                }

            });
        });

// <<<<<<< HEAD
// =======
        // });

// >>>>>>> 26e1487131df0512ef23bd5f3c26185a8383795f
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

        $('#viewshare').append('<div id = "imagecontainer'+mapname+'" class="thumbnail"></div>');
        $('#viewshare').append('');
        $('#viewshare').append('<a target="_blank"><i class="fa fa-facebook-official fa-2x" aria-hidden="true"></i></a></li>');
       // $('#viewshare').append('<a id="map'+mapname+'" class="searchlink"><div id="maps' + mapname + '"><h4> http://localhost:3030/#/overview </h4></div></a></br>');
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
                        // console.log(imgele);
                        doc.appendChild(imgele);
                    }
        });

        $("#viewshare a").click(function(e) {
            shareFacebook("http://www.triparound.de/#/overview","hi","TripAroundSeller\public\FrontEnd\Pictures\downloads-bg.jpg");
            return false;
        });

        function shareFacebook(url, text, image) {
            open('http://facebook.com/sharer.php?s=100&p[url]=' + url + '&p[images][0]=' + image + '&p[title]=' + text, 'fbshare', 'height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0');
        }

        $('#map'+mapname).on('click', function(evt){
               /*evt.preventDefault();*/
           sessionStorage.setItem("searchmap", mapname);
           serachmap=mapname;
           window.location.href="#overview";
        });

        translateFunction(translateNavbar,translateShare);
    });
}
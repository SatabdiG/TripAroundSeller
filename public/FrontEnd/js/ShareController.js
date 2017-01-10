serachmap="";
mapname1 = mapname;
function ShareController()
{
    console.log("In Share Page controller");
    $(document).ready(function()
    {
        $('#logoutsearch').on('click', function(evt){
             window.location.href="#";
        });

        console.log(userid);
        console.log("Maaaaap:"+mapname);

            console.log("Activated");

            $('#viewshare').append('<a id="map'+mapname+'" class="searchlink"><div id="maps' + mapname + '"><h3>' + mapname + '</h3></div></a>');

            $('#map'+mapname).on('click', function(evt){
               /*evt.preventDefault();*/
                sessionStorage.setItem("searchmap", mapname);
                serachmap=mapname;
                window.location.href="#overview";
            });

    });
}
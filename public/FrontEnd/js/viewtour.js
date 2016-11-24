/**
 * Created by tasu on 24/11/16.
 */
//Contains the controller for the View Tours Page

function viewtourcontroller()
{
    console.log("you are now viewing the tour page "+name+serachmap);
    $(document).ready(function(){
       //Generate map with reference to :
        var ReferenceMap=serachmap;
       $('#Goback').on('click', function(evt){
          window.location.href="#";
           window.location.reload();
       });


    });

}


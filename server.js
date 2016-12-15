
const express	=	require("express");
var bodyParser =	require("body-parser");
var multer	=	require('multer');
var multerguest=require('multer');
var path=require('path');
const app	=	express();
var fs=require('fs');
var http=require("http").Server(app);
var socket=require("socket.io")(http);
//var cookiep=require("cookie-parser");
//var session=require("express-session");
var formidable=require('formidable');
var mv= require('mv');
var busboy = require('connect-busboy');
app.use(bodyParser.json());


//app.use(express.session({secret:"qwertsvcyeA"}));

app.use(busboy());
//var mongofil="mongodb://satabdi:trip@ds041536.mlab.com:41536/heroku_jllqwp1p";

var mongofil="mongodb://localhost:27017/testimages";

//Computer Vision Middlewares//

//Blurred Detection middlewares.

// Image Compressione
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

var userid;
var filename;
const mkdirp = require('mkdirp');


//Path for loading static files
app.use(bodyParser.json());
app.use("/FrontEnd/css",express.static(__dirname+'/public/FrontEnd/css'));
app.use("/FrontEnd/js",express.static(__dirname+'/public/FrontEnd/js'));
app.use("/FrontEnd/partials",express.static(__dirname+'/public/FrontEnd/partials'));
app.use("/uploads",express.static(__dirname+'/uploads'));
app.use("/FrontEnd/Pictures",express.static(__dirname+'/public/FrontEnd/Pictures'));
var connect=require('./AdditionServerSide/MongoDbLib');
var trail=require('./AdditionServerSide/Classes');

/*
//Json Data Extraction
var extractionjsondata =   multer.diskStorage({
  guest: function (req, file, callback) {
      callback(null, __dirname +'/uploads' + _userid+'/'+_mapid+'/version_1');
  },
  userid: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  },
  username: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  },
  userpassword: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  },
  mapid: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  },
  mapdataversionid: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  },
  markerid: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  },
  Latid: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  },
  Lngid: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  },
});

var extractiondata = multer({ extractionjsondata : extractionjsondata}).array('userPhoto',8);
_guest= req.files[0].guest;
_userid = req.files[0].userid;
_userpassword = req.files[0].userpassword;
_username = req.files[0].username;
_mapid= req.files[0].mapid;
_mapdataversionid =  req.files[0].mapdataversionid;
_markerid = req.files[0].markerid;
//_Latid = req.files[0].latid;
//_Lngid = req.files[0].lngid;
*/

//Multer Storage


var gueststore =   multerguest.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname+'/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});




app.get('/',function(req,res){
    res.sendFile(__dirname + "/public/index.html");
});
//Image Upload form
app.post('/api/photo',function(req,res){
  console.log("In server");
  console.log(JSON.stringify(req.body));
  console.log(JSON.stringify(req.body.files.context.location));
  console.log(JSON.stringify(req.body.userid));
  console.log(JSON.stringify(req.body.filename));
  console.log("User id"+__userid);
  console.log(filedata);
    upload(req,res,function(err) {
        //console.log(req.body);
        //console.log( req.files[0].destination);
        //console.log( req.files[0].filename);
        //console.log( req.files[0].path);
        _userid = req.body.userid;
      // _userpassword = req.files[0].userpassword;
     // _username = req.files[0].username;
      _mapid= req.body.mapid;
      _mapdataversionid =  req.body.mapdataversionid;
      _markerid = req.body.markerid;
      //_Latid = req.files[0].Latid;
      //_Lngid = req.files[0].Lngid;
      _imagename= req.body.filename;
      //_imagepath = req.files[0].destination;
      if(__userid == "guest")
      {
        _imagename=__dirname+'/uploads/guest';
        _mapid="guestmap";
        _mapdataversionid="guestid";
      }
      if(__userid != "guest") {
        connect.addusers(mongofil, 'usercollection', _userid, _username, _userpassword);
        connect.addmaps(mongofil, 'mapcollection', _mapid, _userid);
        connect.addmapversion(mongofil, 'mapdataversioncollection', _mapdataversionid, _mapid, _userid);
        connect.addmarkers(mongofil, 'markercollection', _mapdataversionid, _markerid, _userid, _mapid, _Latid, _Lngid);
        connect.addvalues(mongofil, 'storedimages', _mapdataversionid, _markerid, _imagename, _imagepath, _userid, _mapid);
      }
      else
      {
          console.log("In here");
      }
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");

    });
});
//Drag and Drop Form Control
app.post('/photos',function(req,res){
  uploaddragdrop(req,res,function(err){
      if(err){
        return res.end("Error Uploading file");
      }else {
        return res.end("Success");
      }
  });
});

var uploadguest= multer({dest:__dirname+'/uploads'});
/* Guest Log in */
app.post('/guestlogin', function(req,res){
  console.log("In guest handler");
  var form=new formidable.IncomingForm();
  form.multiple=true;
  form.uploadDir=path.join(__dirname,'/uploads');
  form.on('file',function(field,file){
    //fs.rename(file.path,path.join(form.uploadDir,file.name));
    mv(file.path,join(form.uploadDir,file.name), function(err){
      if(!err)
      {
        console.log("File uploaded");
      }else
        console.log("Error occurs"+err);
    });
  });
  form.on('error',function(err){
    console.log("Error has ocurred");
    return res.end("no");
  });
  form.on('end',function(){
    res.send("yes");
  });

  form.parse(req);

});


//Register New users
app.post('/registeruser', function(req,res){
  var userid=req.body.username;
  var username=req.body.name;
  var password=req.body.password;
  var email=req.body.email;
  var type=req.body.type;
  console.log("Email  "+ email);

  //Access Mongodb See is user is there
  connect.userPresent(mongofil, userid, function(msg){
    if(msg!=undefined){
      console.log("Returned data"+msg);
      if(msg =='present'){
        return res.end(msg);
      }
      else
      {
          connect.addusers(mongofil, userid, username, password,type, function (mssg) {
            if (mssg != undefined) {
              console.log("Returned data" + mssg);
              return res.end(mssg);
            }
          });

      }
    }

  });

});


//Handler for Map publish

app.post("/publishmap", function(req, res){
  var userid=req.body.userid;
  var mapid=req.body.id;
  var publish=req.body.publish;
  console.log("Publish Map"+publish+mapid+userid);
  //Make the database connect and update the database
  connect.updateMaps(mongofil,userid,mapid,publish, function(message)
  {

    if(message!=undefined) {
      console.log("Returned message" + message);
      if (message == "done") {
        return res.end("yes");
      } else {
        return res.end("no");
      }
    }
  });
  return res.end("yes");

});


app.post('/guestdetailssave',function(req,res){
  var filename=req.body.filename;
  console.log("In guest details handler");
  console.log(req.body);
  console.log("User id "+req.body.userid);
  for(var i=0;i<filename.length;i++)
  {
    if(req.body.userid == 'guest') {
      var mapid = 'guestmap';
      var pathid='/uploads';
      var mapversionid="something";
    }
    connect.storeImages(mongofil,mapversionid,req.body.userid,mapid,"markerid",filename[i],pathid,function(message){
      console.log("Message"+message);
      if(message == "yes")
        return res.end("yes");
      else
        return res.end("no");
    })
  }
});

//User created markers save

app.post('/usermarkersave', function(req, res){
  var userid=req.body.userid;
  var mapid=req.body.mapname;
  var filename=req.body.filename;
  var lat=req.body.lat;
  var lon=req.body.lon;
  var date=new Date();
  var currenthours=date.getMinutes();
  var markerid=req.body.userid+currenthours;

  connect.addmarkers(mongofil,"someversion",markerid,userid,mapid,lat,lon, currenthours,filename,function(mssg){
    if(mssg!=undefined)
    {
      console.log("Retrived mssg"+mssg);
      if(mssg == "yes")
        return res.end("yes");
      else
        return res.end("no");
    }
  });


});

app.post('/traildescription', function (req,res) {
  //Trail description
  var username=req.body.name;
  var mapid=req.body.map;
  var trails=req.body.pathobj;
  var mode=req.body.mode;
  var coorarr=[];
  var temparr=trails.split(',');
  var src={};
  var des={};
  var descr=req.body.description;
  console.log("trails"+trails);
  for(var i=0;i<temparr.length;i++)
  {

    if(temparr[i].indexOf("(")>=0)
    {
      var tempstr=temparr[i].replace('(','');
      coorarr.push(parseFloat(tempstr));
    }else if(temparr[i].indexOf(')')>0)
    {
      var tempstr=temparr[i].replace(')','');
      coorarr.push(parseFloat(tempstr));
    }else
    {
      coorarr.push(parseFloat(temparr[i]));
    }

  }
  console.log(coorarr);
  var count=0;

  src.lon=coorarr[count];
  count=count+1;
  src.lat=coorarr[count];
  count=count+1;
  des.lon=coorarr[count];
  count=count+1;
  des.lat=coorarr[count];

  console.log(src.lat+"  "+src.lon);
  connect.updatetrail(mongofil,username, mapid, src, des,descr,mode, function(msg){
    console.log("Returned "+msg);
    if(msg!=undefined)
    {
      if(msg == "done")
        return res.end("yes");
      else
        return res.end("no");
    }
  });
});



//Save trails for user's manual trails on the map page
app.post('/usertrailmanual', function(req, res){
  console.log("User trail manual Save");
  var username=req.body.userid;
  var mapid=req.body.mapname;
  var mode=req.body.mode;
  var paths=[];
  var path=req.body.path;
  var coorarr=[];
  var temparr=path.split(',');
  var desc=req.body.des;
  for(var i=0;i<temparr.length;i++)
  {

    if(temparr[i].indexOf("(")>=0)
    {
      var tempstr=temparr[i].replace('(','');
      coorarr.push(tempstr);
    }else if(temparr[i].indexOf(')')>0)
    {
      var tempstr=temparr[i].replace(')','');
      coorarr.push(tempstr);
    }else
    {
      coorarr.push(temparr[i]);
    }

  }
  console.log("array "+coorarr);
  //Create the trail array
  var finalarr=[];
  for(var i=0;i<coorarr.length;i=i+2)
  {
    var obj={};
    obj.lat=coorarr[i];
    obj.lon=coorarr[i+1];
    console.log("obj is"+obj);
    finalarr.push(obj);

  }
  var src = [];
  var dest = {};
  for(var i=0;i<finalarr.length;i++) {
    if (i == finalarr[i].length - 1) {
      dest.lon = finalarr[i].lon;
      dest.lat = finalarr[i].lat;
    } else {
      var tempsrc = {};
      tempsrc.lon = finalarr[i].lon;
      tempsrc.lat = finalarr[i].lat;
      src.push(tempsrc);
    }
  }


    connect.addtrails(mongofil, username, mapid, src, dest,desc, mode, function (msg) {
      console.log("The msg is" + msg);
      if (msg != undefined) {
        if (msg == "yes")
          return res.end("yes");
        else
          return res.end("no");
      }
    });


});


app.post('/tourstopsave', function(req,res){
    console.log("In tourstopsave");
    res.end("yes");
    var username=req.body.name;
    var mapname=req.body.mapname;
    console.log("Mapname"+mapname);

        var markername=req.body.markername;
        var lat=req.body.lat;
        var lon=req.body.lng;
        var des=req.body.des;
        var veh="driving";
        var pos=req.body.pos;
        console.log("In Tour Stop Save"+markername);
        //Make respective db entry
        connect.addTourStops(mongofil,username,mapname,veh,markername,lat,lon,des,pos, function(message)
        {
            if(message!=undefined) {
                if (message == "yes") {
                    res.end("yes");

                } else {
                    res.end("no");
                }
            }
        });


});

app.post('/itesave', function(req,res){
  console.log("In Itesave");
  res.end("yes");
  var username=req.body.name;
  var mapname=req.body.mapname;
  console.log("Mapname"+mapname);
  var markers=req.body.objs;
  markers.forEach(function(marr){
    var markername=marr.name;
    var lat=marr.lat;
    var lon=marr.lng;
    var des=marr.des;
    var veh="driving";
    var pos=marr.pos;
    //Make respective db entry
    connect.addTourStops(mongofil,username,mapname,veh,markername,lat,lon,des,pos, function(message)
    {
      if(message!=undefined) {
        if (message == "yes") {
          res.end("yes");

        } else {
          res.end("no");
        }
      }
    })
  });

});

app.post('/usertrailsave', function(req, res){
  console.log("In user trail Save");
  var marker=[];
  (req.body.markerobj).forEach(function(eve){
    console.log(eve);
    marker.push(eve);
  });
  var username=req.body.username;
  var mapname=req.body.map;
  var descp=req.body.description;
  var mode=req.body.mode;
  if(marker.length >1) {
    for (var i = 0; i < marker.length; i++) {
      console.log("I is" + i);
      var src = {};
      src.lon = marker[i].lon;
      src.lat = marker[i].lat;
      var dest = {};

      if((i+1)>= marker.length) {
        dest.lon = marker[i].lon;
        dest.lat = marker[i].lat;
      }else {
        dest.lon = marker[i + 1].lon;
        dest.lat = marker[i + 1].lat;
      }
      connect.addtrails(mongofil, username, mapname, src, dest,descp,mode, function (msg) {
        console.log("The msg is" + msg);
        if (msg != undefined) {
          if (msg == "yes")
            return res.end("yes");
          else
            return res.end("no");
        }
      });
    }
  }else
  {
    return res.end("no");
  }

});


//** upload and save map coordinates
app.post('/mapupload', function(req,res){
  var flag=true;
  var date=new Date();
  var marker=[];
  var currenthours=date.getMinutes();
  (req.body.markerobj).forEach(function(eve){
    console.log(eve);
    marker.push(eve);
  });

  if(marker.length>0) {
    console.log("Marker length"+marker.length);


    for(i=0;i<marker.length;i++)
    {
      var markerid=req.body.id+i+currenthours;
      console.log("Got Marker"+marker[i].tourstopname);
      connect.addmarkers(mongofil, marker[i].tourstopname,"someversion",marker[i].id,req.body.id,req.body.name,marker[i].lat,marker[i].lon, marker[i].time,marker[i].filename,function(mssg){
      console.log(mssg);
        if(mssg!=undefined) {
          if (mssg == "yes")
            flag = true;
          else
            flag = false;
        }
      });
      connect.addTourStops(mongofil,req.body.id, req.body.name, "car",marker[i].tourstopname,marker[i].lat,marker[i].lon,"",0, function (message) {
         if(message!=undefined)
         {
             if (message == "yes")
                 flag = true;
             else
                 flag = false;
         }
      });
    }

    console.log("flag    "+flag);
    if(flag == true)
    {
      return res.end("yes");
    }
    else
      return res.end("no");
  }
  else {
    console.log("Empty");
    return res.end("no");
  }

});

//Handler for Map description edit
app.post('/mapdescriptionedit', function(req, res){
  console.log(req.body);
  var username=req.body.userid;
  var mapid=req.body.mapid;
  var newdes=req.body.text;
  console.log("In map description edit"+username+"  "+mapid);
  //Call MongoDb server
  connect.updateDescription(mongofil,username, mapid,newdes,function(msg){
    if(msg!=undefined)
    {
      console.log("Retrived Message"+msg);
      if(msg == "done")
        return res.end("yes");
      else
        return res.end("no");
    }
  });

});

//Delete Map
app.post("/detelemap", function(req, res){

  var username=req.body.userid;
  var delmap=req.body.mapid;

  //Call mongodb delete all referneces to mongodb
  connect.deleteallmap(mongofil, username, delmap, function(msg){
    if(msg!=undefined) {
      console.log("Retrived message" + msg);
      if(msg =="done")
      {
        return res.end("yes");
      }
      else
        return res.end("no");
    }
  });


});

app.post("/deleteTourStop", function(req, res)
{
  console.log("In delete tour Stop");
  var username=req.body.username;
  var mapname=req.body.mapname;
  var tourstopname=req.body.tourstopname;
  console.log("Got data"+username+" v"+mapname+" v"+tourstopname);
  connect.deleteTourStop(mongofil,username,mapname,tourstopname, function(msg){
    if(msg!=undefined)
    {
      console.log("Retrived message is"+msg);
      if(msg === "done")
      {
        return res.end("yes");
      }else
      {
        return res.end("no");
      }
    }


  });



});

//Handler for drag and drop
app.post('/dragdrop', function(req,res){
  var form=new formidable.IncomingForm();
  form.multiple=true;
  form.uploadDir=path.join(__dirname,'/uploads');
  form.on('file',function(field,file){
    console.log("File Name"+file.name);
    fs.rename(file.path, path.join(form.uploadDir, file.name), function(){
        imagemin([path.join(form.uploadDir,file.name)], path.join(form.uploadDir), {
            plugins: [
                imageminMozjpeg({quality: 40}),
                imageminPngquant({quality: '40-45'})
            ]
        }).then(function(files) {
            console.log('File compressed successfully.');
        });

        console.log('\t In drag drop my upload dir is '+form.uploadDir+' and my filename is '+file.name);
    });
  });
  form.on('field', function(name,value){
    console.log("In Drag and Drop"+ name +"  "+ value);

    if(name == "mapname") {
      var obj=JSON.parse(value);
      console.log(obj['name']);
      var dir = __dirname + '/uploads/'+obj['user'];
      var actual=__dirname+'/uploads/'+obj['user']+'/'+obj['name'];
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        if(!fs.existsSync(actual)){
          fs.mkdirSync(actual);
        }
      }
      else
      {
        if(!fs.existsSync(actual)){
          fs.mkdirSync(actual);
        }
      }
      //form.uploadDir=path.join(__dirname,'/uploads');
      form.uploadDir = actual;
    }else
    {
      if(name=="userobj"){
        //call data base to update mappings
        var obj=JSON.parse(value);
        var filenames=obj['filename'];
        var mapname=obj['mapname'];
        var userid=obj['id'];
        var uploadpath='/uploads/'+userid+'/' + mapname;
        var mapversion="something";
        console.log("The value of object user"+JSON.parse(value));
        console.log("The value of user pictures are"+obj['id']);
        //call database and update the database
          connect.storeImages(mongofil,mapversion,userid,mapname,"markerid",filenames,uploadpath,0,0,"",function(msg){
            if(msg!=undefined)
            {
              if(msg == "yes"){
                console.log("Yay "+msg);
              }else
              {
                console.log("Could add to user database. Check");
              }
            }
          });
        }else
      {
        if(name === "tourstop")
        {
          console.log("In Tourstop");
          var obj=JSON.parse(value);
          var lat=obj["lat"];
          var lon=obj["lon"];
          var mapname=obj["mapname"];
          var tourst=obj["userid"];
          var tourstopname=obj["address"];
          connect.addTourStops(mongofil,tourst,mapname,"bus", tourstopname,lat,lon, "",0, function (mssg) {
            if(mssg!=undefined)
            {
              if(mssg ===  "yes")
              {
                console.log("Done");
              }else
              {
                console.log("Not Done");
              }
            }


          });
        }
      }

    }

  });
  form.on('error',function(err){
    console.log("Error has ocurred");
    return res.end("no");
  });
  form.on('end',function(){
    res.send("yes");
  });

  form.parse(req);


});

app.post('/login',function(req,res){
  var username=req.body.name;
  var password=req.body.password;
  console.log("in Login printing cookies",req.cookies);


  //Access MongoDB - see if user is authorized
  connect.verifyusers(mongofil,'usercollection',username, password,function(results, username){
    if(results!=undefined){
      console.log("fetched results"+ results);
      if(results == 'success')
      {
        //user present entered correct password allow login
        var data={};
        data.username=username;
        data.status="success";
        return res.end(JSON.stringify(data));

      }
      else
      {
        //Either username or password id incorrect disallow login
        var data={};
        data.username="";
        data.status="fail";
        return res.end(JSON.stringify(data));

      }
    }
    else {
        console.log("Fetched results were undefined");

    }

  });

});



app.post('/mapsave', function(req, res){
  var mapname=req.body.name;
  var description=req.body.description;
  console.log("Name is  "+ mapname);
  var user=req.body.userid;
  //Call mongodb function and save the map
  connect.addmaps(mongofil,user, mapname, description,function(msg){
    if(msg!=undefined){
      console.log("Map returned "+msg);
       if(msg == "add"){
         return res.end('yes');
       }
      else
         return res.end('no');
    }

  });
});

app.post('/viewmap', function(req,res){
  var userid=req.body.name;
  //call database and return
  connect.mapPresent(mongofil,userid, function(msg){
    if(msg!=undefined){
      if(msg=="nothing"){
        return res.end("no");
      }
       else
      {
        return res.end("yes");
      }

    }
  });
});

//Save images wrt to each tourStop


app.post('/usertourstop', function(req,res){
    console.log("In registered user handler");
    var form=new formidable.IncomingForm();
    var mapname;
    var dir;
    var filenames;
    var uploaddir;
    form.multiple=true;
    form.on('field',function(name,value){
        console.log("Response  "+name+":"+value);
        if(name == "details") {
            var obj=JSON.parse(value);
            console.log(obj['name']);
            var dir = __dirname + '/uploads/'+obj['user'];
            var actual=__dirname+'/uploads/'+obj['user']+'/'+obj['name'];
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
                if(!fs.existsSync(actual)){
                    fs.mkdirSync(actual);
                }
            }
            else
            {
                if(!fs.existsSync(actual)){
                    fs.mkdirSync(actual);
                }
            }
            //form.uploadDir=path.join(__dirname,'/uploads');
            form.uploadDir = actual;
        }else
        {
            if(name=="usetourstop"){
                //call data base to update mappings
                var obj=JSON.parse(value);
                var filenames=obj['filename'];
                var mapname=obj['mapname'];
                var userid=obj['userid'];
                var uploadpath='/uploads/'+userid+'/' + mapname;
                var tourstopname=obj['tourstopname'];
                var description=obj['description'];

                //call database and update the database
                for(var i=0;i<filenames.length;i++)
                {
                    console.log("The filename is"+filenames[i]);
                    connect.storeImages(mongofil,tourstopname,userid,mapname,"markerid",filenames[i],uploadpath,0,0,"", function(msg){
                        if(msg!=undefined)
                        {
                            if(msg == "yes"){
                                console.log("Yay "+msg);
                            }else
                            {
                                console.log("Could add to user database. Check");
                            }
                        }
                    });
                }
            }
        }

    });

    form.on('file',function(field,file){
        console.log("File name"+file.path+"  "+path.join(form.uploadDir,file.name));
        fs.rename(file.path,path.join(form.uploadDir,file.name));
    });
    form.on('error',function(err){
        console.log("Error has ocurred");
        return res.end("no");
    });

    form.on('end',function(){
        res.send("yes");
    });

    form.parse(req);
});
//Save registered user details
app.post('/userdetailssave', function(req, res){
    console.log("Resgistered user details"+req.body);
    return res.end("yes");

});

//Save Images of registered users

app.post('/userimageupload', function(req,res){
  console.log("In registered user handler");
  var form=new formidable.IncomingForm();
  var mapname;
  var dir;
  var filenames;
  var uploaddir;
  form.multiple=true;
  form.on('field',function(name,value){
    console.log("Response  "+name+":"+value);
    if(name == "mapname") {
      var obj=JSON.parse(value);
      console.log(obj['name']);
      var dir = __dirname + '/uploads/'+obj['user'];
      var actual=__dirname+'/uploads/'+obj['user']+'/'+obj['name'];
      if (!fs.existsSync(dir)) {
       fs.mkdirSync(dir);
        if(!fs.existsSync(actual)){
          fs.mkdirSync(actual);
        }
      }
      else
      {
        if(!fs.existsSync(actual)){
          fs.mkdirSync(actual);
        }
      }
      //form.uploadDir=path.join(__dirname,'/uploads');
      form.uploadDir = actual;
    }else
    {
      if(name=="userobj"){
        //call data base to update mappings
        var obj=JSON.parse(value);
        var filenames=obj['filename'];
        var mapname=obj['mapname'];
        var userid=obj['id'];
        var uploadpath='/uploads/'+userid+'/' + mapname;
        var mapversion=obj['tourstopname'];
        console.log("User store images"+filenames);
        //call database and update the database
        for(var i=0;i<filenames.length;i++)
        {
          console.log("The filename is"+filenames[i]);
          connect.storeImages(mongofil,mapversion,userid,mapname,"markerid",filenames[i],uploadpath,0,0,"", function(msg){
            if(msg!=undefined)
            {
              if(msg == "yes"){
                console.log("Yay "+msg);
              }else
              {
                console.log("Could add to user database. Check");
              }
            }
          });
        }
      }
      else
      {
          if(name === "tourstop")
          {
            console.log("Got tourstop!!");
            var obj=JSON.parse(value);
              var filenames=obj['filename'];

          }
      }
    }

  });

  form.on('file',function(field,file){
    console.log("File name"+file.path+"  "+path.join(form.uploadDir,file.name));
    fs.rename(file.path, path.join(form.uploadDir, file.name), function(){
        imagemin([path.join(form.uploadDir,file.name)], path.join(form.uploadDir), {
            plugins: [
                imageminMozjpeg({quality: 40}),
                imageminPngquant({quality: '40-45'})
            ]
        }).then(function(files) {
            console.log('File compressed successfully.');
        });

        console.log('\t In drag drop my upload dir is '+form.uploadDir+' and my filename is '+file.name);
    });
  });
  form.on('error',function(err){
    console.log("Error has ocurred");
    return res.end("no");
  });

  form.on('end',function(){
    res.send("yes");
  });

  form.parse(req);
});
//Save registered user details
app.post('/userdetailssave', function(req, res){
  console.log("Resgistered user details"+req.body);
  return res.end("yes");

});

app.post('/updateimagedescription', function (req, res) {
  console.log("In image update description");
  var filename=req.body.filename;
  var username=req.body.username;
  var mapname=req.body.mapid;
  var desc=req.body.description;
  connect.updatePictures(mongofil,username,mapname,filename, desc, function (msg) {
    if(msg!= undefined)
    {
      if(msg == "done")
      {
        console.log("ImageDescription updated"+ msg);
        return res.end("yes");
      }else
        return res.end("no");
    }

  });
});

app.post('/file_upload', function(req, res) {
    // var user=req.body.sessioninfo.userid;
    console.log("\n\n\tUploading: I am here : halllllloooo2");
    var form = new formidable.IncomingForm();
    form.multiple=true;
    var userID;
    var mapID;
    var fstream;
    var myFileName;
    var spawn = require('child_process').spawn;
    py = spawn('python', ['process_doc.py']);
    dataString = '';
    var flag = 0;
    form.on('field', function(field, value) {
        console.log("Trying to find field " + field + " and value is "+ value);
        var jvObject = JSON.parse(value);
        userID = jvObject['userid'];
        mapID = jvObject['mapname'];
    });

    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        myFileName = filename;
        // check if file with same name already exist, if yes change the name.
        fstream = fs.createWriteStream(__dirname + '/uploads/' + filename);
        file.pipe(fstream);
    });

    req.busboy.on('finish', function () {
        console.log("OK Everything is done now.");
        console.log("userid: " + userID);
        console.log("mapID: " + mapID);
        console.log("myFileName: " + myFileName);

        py.stdout.on('data', function(data){
            dataString += data.toString();
            console.log("\n\t\t\t\tIn data");
        });
        py.stdout.on('end', function(){
            // console.log ("I am hereeeee "+dataString)
            var jsonObj = JSON.parse(dataString);
            jsonObj.userID = userID
            jsonObj.mapID = mapID
            // console.log("This is heading number 1"+jsonObj["heading_1"])
            connect.saveDocs(mongofil, jsonObj, function (msg) {
                if(msg!= undefined) {
                    if(msg == "done") //{
                        console.log("Document saved: "+ msg);
                    // return res.end("yes doc saved");}
                    else
                    // return res.end("no");
                        console.log("No");
                }
            });

            return res.end('Completed');

        });
        py.stdin.write(JSON.stringify(myFileName));
        py.stdin.end();


        res.end('Yes');
    });
    form.parse(req);
});

// myjson = '{ "_id": "583af12e6c3e6b16f4b81b36", "content_5": "Gut gestärkt machen Sie sich morgens auf den Weg zur Bongani Mountain Lodge. Diese liegt an der südwestlichen Grenze des Krüger Nationalparks, ca. 45 km vom Eingang entfernt. Ein idealer Ausgangspunkt für Safaris auf dem ca. 8000 Hektar großen Privatgelände des Mthethomusha Private Game Reserves. Dieses ist ebenfalls die Heimat der Big Five. Nach dem Mittagessen und ein paar Stunden Ruhe steht eine Geländewagensafari an. Zum Abschluss des Tages genießen Sie ein köstliches Abendessen und übernachten in der Bongani Mountain Lodge.", "content_7": "Transfer zum Flughafen nach Johannesburg (ca. 450 km) und Flug nach Kapstadt. Hier erwartet Sie schon Ihre deutschsprachige Reiseleitung. Der Rest des Tages steht Ihnen zur freien Verfügung. Nutzen Sie die Zeit, um die „Mutterstadt“ auf eigene Faust zu entdecken. Die nächsten Nächte verbringen Sie in Ihrem Hotel in der Region Kapstadt.", "content_6": "In den frühen Morgenstunden unternehmen Sie die erste Safari im Geländewagen. Mal sehen, ob sich die Tiere im Morgengrauen blicken lassen. Im Anschluss an das ausgiebige Frühstück können Sie sich bereits auf ein leckeres Mittagessen freuen. Am Nachmittaggeht es wieder auf Spurensuche. Vielleicht haben Sie ja schon Ihr Lieblingsgeschöpf im Reservat entdeckt? Abendessen und Übernachtung in der Bongani Mountain Lodge.","tot_contents": "12","content_4": "Während der Fahrt im Reisefahrzeug entdecken Sie den Park. Können Sie sich die unglaublichen Weiten des Krüger Parks vorstellen, der 1898 von Paul Krüger zum Schutz gefährdeter Arten gegründet wurde? Seit 1926 gilt er als Nationalpark und umfasst eine Fläche von über 18.000 km². Er erstreckt sich 350 km von Nord nach Süd und 60 km von Ost nach West. Somit gilt er als eines der größtenWildreservate Afrikas. Mit Hilfe Ihres Reiseleiters halten Sie Ausschau nach den berühmten “Big Five” - Löwen, Leoparden, Elefanten, Büffel und Nashörner. Nach diesem einmaligen Erlebnis fahren Sie zurück in die Region Lowveld, wo die Übernachtung erfolgt.","content_3": "Auf dem Weg in die Region Lowveld, deren bildhübsche Landschaft von subtropischen Obstplantagen geprägt ist, besuchen Sie Dullstoom. Bekannt als Südafrikas „Hauptstadt des Fliegenfischens“ bietet der beschauliche Ort weit mehr als das. Während Sie gemütlich über die Straßen schlendern, entdecken Sie die vielen kleinen Läden und Restaurants. Beim Anblick des Blyde River Canyons schweigen Sie vermutlich für einen Moment. Sei es aus Ehrfurcht, sei es aus Erstaunen – dieser Canyon ist riesig! Nicht umsonst gilt er als eines der größten Naturwunder Afrikas. Anschließend besichtigen Sie „Bourke’s Luck Potholes“, ein Wunderwerk der Flusserosion. Sehen dievom Wasser erschaffenen Löcher nicht so aus, als hätte sie jemand mit einem großen Bohrer erschaffen? Nach einem spannenden Tag beziehen Sie Ihr Nachtquartier in der Region Lowveld.","content_2": "Ankunft in Johannesburg und Begrüßung durch Ihre deutschsprachige Reiseleitung. Sie brechen auf zu einer Orientierungsfahrt durch Pretoria, der Verwaltungshauptstadt Südafrikas. Diese wurde im Jahre 1855 gegründet und 5 Jahre später zur Hauptstadt der Buren ernannt. Sie bewundern den „Church Square“ mit seiner imposanten Statue von „Uncle Paul Kruger“, dem ehemaligen Präsidenten der Südafrikanischen Republik. Lassen Sie sich am „Voortrekker Monument“ und bei den „Union Buildings“ in die Zeit der Einwanderer zurückversetzen. Am Nachmittag tauchen Sie in das Township Soweto ein, das vor allem durch Nelson Mandela und die schreckliche Zeit der Apartheid bekannt wurde. Wussten Sie, dass ein Großteil Sowetos heute der farbigen Mittelschicht gehört und hier sogar einige prachtvolle Villen stehen? Die Übernachtung findet in der Region Johannesburg statt.","content_1": "Linienflug von Frankfurt n2ach Johannesburg. ","heading_10": "10. Tag - Kapstadt - Weinregion - Kapstadt (auf Wunsch). ","heading_11": "11. Tag - Abreise. ","heading_12": "12. Tag - Ankunft in Deutschland.","content_8": "Auch dieser Tag steht Ihnen zur freien Verfügung. Sollten Sie das optionale Ausflugspaket gebucht haben, erwartet Sie heute eine halbtägige Stadtrundfahrt. Lassen Sie sich beindrucken von den Sehenswürdigkeiten und dem multi-ethnischen Charakter, der denPuls dieser Stadt prägt. Als ruhige Oase im Herzen der Stadt ist der Stadtgarten „Company‘sGardens“ bekannt. Kurz durchatmen inmittender grünen Oase, bevor es vorbei am Old Slave House weiter zum Malay- Viertel geht. Dieses wird auch „Bo-Kaap“ genannt. Die knallbunten Häuser in Bonbon- Farben sind ein beliebtes Fotomotiv. Den krönenden Abschluss bietet Ihnen der überwältigende Ausblick auf Kapstadt und Robben Island vom „Signal Hill“ aus.","content_12": "Änderungen des Reiseverlaufs vorbehalten.","content_11": "Transfer zum Flughafen von Kapstadt und Rückflug mit Zwischenstopp nach Deutschland.","content_10": "Nutzen Sie einen weiteren freien Tag um Kapstadt noch einmal auf eigene Faust zu erkunden. Im Rahmen des Ausflugspaketslernen Sie heute die berühmten, südafrikanischen Weine kennen. Sie entdecken die herrliche Weinroute um Franschhoek und Stellenbosch.Bei zwei Proben kitzelt der leckere Wein Ihre Geschmacksnerven wach. Fruchtig oder herb, was mundet Ihnen mehr? Dies war ein traumhafter Tag, welchen Sie sicherlich in positiver Erinnerung behalten werden.","tot_headings": "12","content_9": "Genießen Sie Ihre freie Zeit in Kapstadt. Sie wollten schon immer mal das südwestliche Ende Afrikas erkunden? Dann habenwir genau das Richtige für Sie! Bei Buchung des optionalen Ausflugspakets ist Ihr erster Stopp das ehemalige Fischerdorf Hout Bay. Kurios ist die Tatsache, dass das Ortseingangsschild die „RepublicofHout Bay“ ausweist. Dann endlich erblicken Sie das Kap der Guten Hoffnung, welches einst wegen seiner schroffen Klippen unter Seefahrern gefürchtet war. Danach geht es weiter zum Cape Point. Auf dem Rückweg erwartet Sie ein weiteres Highlight! Der botanische Garten von Kirstenbosch. Ein wahres Meer an bunten Pflanzen und Blumen ist unter anderem der Grund dafür, warum dieser Garten zu den schönsten weltweit zählt. Gemütliche kleine Parkbänke schmiegen sich perfekt in das idyllische Landschaftsbild und laden zum Verweilen ein.","status": "1","heading_8": "8. Tag - Kapstadt (auf Wunsch). ","heading_9": "9. Tag - Kapstadt - Kap der Guten Hoffnung - Kirstenbosch - Kapstadt (auf Wunsch). ","heading_2": "2. Tag - Johannesburg - Pretoria - Johannesburg. ","heading_3": "3. Tag - Johannesburg - Region Lowveld (ca. 560 km). ","heading_1": "1. Tag - Anreise. ","heading_6": "6. Tag - Malelane. ","heading_7": "7. Tag - Malelane - Johannesburg - Kapstadt. ","heading_4": "4. Tag - Region Lowveld - Krüger Nationalpark - Region Lowveld. ","heading_5": "5. Tag - Region Lowveld - Malelane (ca. 150 km). ","userID": "muaz","mapID": "My First Map" }'
// myjson2 = '{ "_id": "583b84ed2ce47604907f8447", "status": "1", "heading_2": "Day 2: Los Angeles", "tot_headings": "5", "heading_1": "Day 1: Los Angeles", "content_5": "Simple Content 5", "heading_4": "Day 4: Palm Springs - Williams / Grand Canyon", "heading_5": "Day 5: Williams - Page (Classic) / Grand Canyon (Superior)", "tot_contents": "5", "content_4": "Simple Content 4", "content_3": "Simple Content 3", "content_2": "Simple Content 2", "content_1": "Simple content 1 ", "heading_3": "Day 3: Los Angeles – PalmSprings", "userID": "muaz", "mapID": "My First Map" }'
// myjson3 = '{"_id":"58404317bce2800d28d0781e","status":"1","heading_2":"Day 2: Los Angeles","tot_headings":"5","heading_1":"Day 1: Los Angeles","content_5":"Simple Content 5","heading_4":"Day 4: Palm Springs - Williams / Grand Canyon","heading_5":"Day 5: Williams - Page (Classic) / Grand Canyon (Superior)","tot_contents":"5","content_4":"Simple Content 4","content_3":"Simple Content 3","content_2":"Simple Content 2","content_1":"Simple content 1 ","heading_3":"Day 3: Los Angeles â€“ PalmSprings","userID":"muaz","mapID":"My First Map"}'
app.post('/fetchiter', function(req, res){
    var mapID=req.body.mapID;
    var userid=req.body.userid;
    console.log("\n\t\tIn fetchiter with mapID = "+ mapID + " and userid = " + userid);

    connect.fetchData(mongofil, userid, mapID, function (doc) {
        // console.log(typeof doc);
        // console.log(typeof myjson3);
        // console.log(doc);
        // console.log(myjson3);

        return res.end(doc);
    });
});


//******** Socket Function to receive data *********

socket.on('connection',function(socket){
  socket.on('disconnect', function(){
   console.log("A user has disconnected");
  });

  socket.on('Latitude', function(msg){
    _Latid = msg;
    console.log("Latitude"+ msg);
  });

  socket.on('Longitude', function(msg){
    _Lngid = msg
   console.log("Longittude"+msg);
  });

 socket.on('picdetailsimageupload', function(msg){

   var filename=msg.filename;
   var tourstop=msg.tourstopname;
     console.log("Pic details update" + filename+ tourstop);
   //Update the imagedetails in picturescollection

     connect.updateImageDescription(mongofil,filename,tourstop, function(mssg){
       if(mssg == "done")
       {
         console.log("Picture has been updated");
       }

     });


 });

    socket.on('tourstopdetailsupdate', function(msg){

        var lat=msg.lat;
        var lon=msg.lon;
        var tourstopname=msg.tourstopname;
        console.log("Tour details update" + lat+ tourstopname);
        //Update the imagedetails in picturescollection

        connect.updateTour(mongofil,lat,lon,tourstopname, function(mssg){
            if(mssg == "done")
            {
                console.log("Picture has been updated");
            }

        });


    });

  socket.on('UserData',function(msg){
    console.log("In user data function");
    user=msg.id;
    map=msg.mapid;
    console.log("The user is"+user+"  "+map);

  });

  /****outdated Function***/
  //Request from page to load images
  socket.on("LoadImage",function(msg){
    //Connect to data base and extract images
    connect.establishConnection(mongofil,"storedimages",null,null,function(results){
      if(results!=undefined) {
       if(msg.toUpperCase()=="YES"){
          socket.emit("ImageUploads", results+','+__dirname);
        }
      }
    })
  });


  socket.on("LoadMarker",function(msg){
  //Access database and retrive markers
    var userid=msg.id;
    var maps=msg.mapid;
    //create the intitial trail database
    connect.getMarkers(mongofil,userid,maps,function(lat,lng,time,filename, mapid, id){
      if(lat != undefined && lng != undefined) {
        console.log("Retrived   " + lat + "  " + lng);
        socket.emit("drawmarkers", {lat: lat, lng: lng, time:time, filename:filename, map:mapid, id:id});
      }
    });

  });

  socket.on("getNumTourStops", function(msg){
    console.log("Get Number of tour stops"+msg.mapname);
    var mapname=msg.mapname;
    connect.getTourStopCount(mongofil, mapname, function(number){
      if(number!= null)
      {
        console.log("Sending data"+number);
        socket.emit("viewNumTourStops", {count:number});
      }


    });

  });

  socket.on("GetTrails", function(msg){
    console.log("In get trails");
    //Get the trails
    var userid=msg.id;
    var maps=msg.mapid;

    connect.getTrails(mongofil,userid,maps,function(userid,mapid,src,des, description, mode){
      console.log("In get Trails");
      if(src != undefined || des != undefined ||mode != undefined ) {
        console.log("Retrived for trails   " + src.lat + "  " + des.lon+"  "+mode);
        socket.emit("drawtrails", {src: src, des: des, map:mapid, mode:mode, description:description});
      }
    });

  });

  socket.on('ImageGall', function(msg){
    console.log("Message received"+ msg.mapid);
    connect.getPictures(mongofil, msg.userid, msg.mapid,function(picname, picpath, mapid, description, facevar, smilevar){
      if(picname!=undefined && picpath!= undefined && mapid!= undefined) {
        console.log(picname + "  " + facevar + "   " + mapid);
        socket.emit("imagereturn", {picname: picname, picpath: picpath, mapid: mapid, userid:msg.userid, description:description, facevar:facevar, smilevar:smilevar});
      }
    });

  });

    socket.on('ViewGall', function(msg){
        console.log("Message received"+ msg.mapid);
        connect.getPicturesViewPage(mongofil, msg.mapid,function(picname, picpath, mapid, description, facevar, smilevar){
            if(picname!=undefined && picpath!= undefined && mapid!= undefined) {
                console.log(picname + "  " + facevar + "   " + mapid);
                socket.emit("ViewGallReturn", {picname: picname, picpath: picpath, mapid: mapid, userid:msg.userid, description:description, facevar:facevar, smilevar:smilevar});
            }
        });

    });

  socket.on("fetchImg", function(msg)
  {
    console.log("Message received in g=fetch Img"+msg.tourstopname);
    var userid=msg.userid;
    var mapname=msg.mapname;
    var tourstopname=msg.tourstopname;
    connect.getPicturesTourStop(mongofil, userid,mapname,tourstopname, function(picname,picpath,tourstopname){
      if(picname!=undefined && picpath!=undefined )
      {
        console.log("picname"+picname);
        socket.emit("getImg", {"picname":picname,"picpath":picpath, "tourstopname":tourstopname});
      }
    });

  });

    socket.on("fetchImgsrc", function(msg)
    {
        console.log("Message received in g=fetch Img"+msg.userid);
        var userid=msg.userid;
        var mapname=msg.mapname;
        var tourstopname=msg.tourstopname;
        connect.getPicturesTourStopsrc(mongofil, mapname,tourstopname, function(picname,picpath,tourstopname){
            if(picname!=undefined && picpath!=undefined )
            {
                console.log("picname"+picname);
                socket.emit("getImgsrc", {"picname":picname,"picpath":picpath,"tourstopname":tourstopname});
            }
        });

    });

  socket.on('getpublishedmaps', function(msg){

    connect.getpublishedmaps(mongofil,function(mapname, mapdescription){
      if(mapname!=undefined && mapdescription!=undefined){
        console.log("Map description"+mapdescription);
        socket.emit('receivepublishedmaps', {name:mapname, description:mapdescription});
      }
    });
  });

  socket.on('getTourStops', function(msg){
    console.log("Message received"+msg.userid);
    console.log("Mapname"+msg.mapname);
    connect.getTourStops(mongofil,msg.userid,msg.mapname,function(tourstopnam, vehicle,lat,lon,description)
    {
      if(tourstopnam!=undefined ) {
        console.log("Sending Data"+description);
        socket.emit("viewTourStops", {name: tourstopnam, description: description, vehicle: vehicle, lat: lat, lng: lon});
      }
    });
  });
  socket.on('getSearchTours', function(msg){
    console.log("Message received is"+msg.mapname);
        connect.getSearchTours(mongofil,msg.mapname,function(tourstopnam, vehicle,lat,lon,description)
      {
          if(tourstopnam!=undefined ) {
              console.log("Sending Data"+description);
              socket.emit("viewserachtours", {name: tourstopnam, description: description, vehicle: vehicle, lat: lat, lng: lon});
          }
      });
  });
  socket.on('searchimage', function(msg){
    console.log("In search images"+msg.mapname);
    connect.getOneImage(mongofil, msg.mapname, function(picname, picloction){
      if(picname != undefined && picloction != undefined)
      {
        console.log("Sending data"+picname+"  "+picloction);
        socket.emit("getimagesearch",{picname:picname,location:picloction})
      }
    });
  });

  socket.on('getdes', function(msg){
    console.log("In get Description"+msg.mapname);
    connect.getDes(mongofil,msg.mapname, function(mapname, mapdes){

      if(mapname!= null || mapdes != null)
      {
        console.log("Sending data"+ mapname+ mapdes);
        socket.emit("recdes", {mapname:mapname,description:mapdes});
      }

    });


  });

  socket.on('getmaps', function(msg){
     console.log('Message received'+msg.userid);
    connect.getMaps(mongofil, msg.userid, function(mapname, mapdescription){
      if(mapname!=undefined && mapdescription!=undefined){
        console.log("Map description"+mapdescription);
        socket.emit('viewmaps', {name:mapname, description:mapdescription});
      }
    });
  });
});




http.listen(process.env.PORT || 3030,function(){
  console.log("Working on port 3030");
});

//For Node to exit gracefully
process.on('SIGTERM', function(){
  http.close(function(){
    process.exit(0);
  });
});




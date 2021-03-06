
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
var mongofil="mongodb://satabdi:trip@ds041536.mlab.com:41536/heroku_jllqwp1p";

//var mongofil="mongodb://localhost:27017/testimages";

//Computer Vision Middlewares//

//Blurred Detection middlewares.

// -muaz for compression at server side, imagemin middleware is used, link: https://www.npmjs.com/package/imagemin
// -muaz Follow installation instruction mentioned on web page.
// Image Compression
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

// -muaz for map generation in order to fit linear and quadratic model between two points
var math = require('mathjs');
var linspace = require('linspace');

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
    res.sendFile(__dirname + "/index.html");
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

//Save the user favorite tours

app.post('/savefav', function (req, res) {
  var user=req.body.username;
  var favmaps=req.body.favmap;
  console.log("In the sav fav handler"+user+" "+favmaps);
  //Make the  database entry
  connect.addfavmap(mongofil, user, favmaps, function(mssg){
    if(mssg != undefined)
    {
      if(mssg === "yes")
         return res.end("yes");
      else
        return res.end("no");
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
//Is user a seller for fileupload handlers
app.post("/isuserseller", function(req, res){

    var userid=req.body.username;
    console.log("In the user seller"+userid);
    //log into MongoDb get the userid reference
    connect.isuserseller(mongofil, userid, function(response){

      if(response!=null)
      {
        if(response === "user account")
        {
          return res.end("no");
        }else
        {
          return res.end("yes");
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
        var dur=req.body.duration;
        console.log("In Tour Stop Save"+markername);
        //Make respective db entry
        connect.addTourStops(mongofil,username,mapname,veh,markername,lat,lon,des,pos,dur, function(message)
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
    var dur=1;
    //Make respective db entry
    connect.addTourStops(mongofil,username,mapname,veh,markername,lat,lon,des,pos, dur, function(message)
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
      connect.addTourStops(mongofil,req.body.id, req.body.name, "car",marker[i].tourstopname,marker[i].lat,marker[i].lon,"",0, 1, function (message) {
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
    // -muaz Image compression at server side, this compression is for the images which are received using dropzone.
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
          connect.addTourStops(mongofil,tourst,mapname,"bus", tourstopname,lat,lon, "",0,1, function (mssg) {
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
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;
  var geoTagsStatus = req.body.geoTagsStatus;

  //Call mongodb function and save the map
  connect.addmaps(mongofil,user, mapname, description, startDate, geoTagsStatus, endDate, function(msg){
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
// -muaz Following code accepts image from client and compresses it.
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

  // -muaz actual file compression goes here. Compresses it and saves it in to folder. This compression is for single image upload.
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

// -muaz  Recieves the file with extension '.docx', saves it in folder 'uploads', calls the script process_doc.py which parses
// -muaz  the doc file and send the parsed content back to this function by which data get saved in to database.
app.post('/file_upload', function(req, res) {
    // var user=req.body.sessioninfo.userid;
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
    // receiving file and saving it on file system.
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        myFileName = filename;
        // check if file with same name already exist, if yes change the name.
        fstream = fs.createWriteStream(__dirname + '/uploads/' + filename);
        file.pipe(fstream);
    });

    // -muaz  once saved on file system, a thread is generated in order to call process_doc.py file which then parses it.
    req.busboy.on('finish', function () {
        console.log("OK Everything is done now.");
        console.log("userid: " + userID);
        console.log("mapID: " + mapID);
        console.log("myFileName: " + myFileName);

        // -muaz  receiving data from python file asynchronously,
        py.stdout.on('data', function(data){
            dataString += data.toString();
            console.log("\n\t\t\t\tIn data");
        });
        // -muaz  Once thread is finished this function gets triggered where parsed data get saved in to database.
        py.stdout.on('end', function(){

            // -muaz jsonObj is a json object with keys heading_x and content_x where 'x' is the number of a heading, so
            // -muaz if we have 10 headings and contents, jsonObj will contain heading_1 to heading_10 and similar is for
            // -muaz contents.
            var jsonObj = JSON.parse(dataString);
            jsonObj.userID = userID;
            jsonObj.mapID = mapID;

            // -muaz  saving data in to database.
            connect.saveDocs(mongofil, jsonObj, function (msg) {
                if(msg!= undefined) {
                    if(msg == "done") //{
                        console.log("Document saved: "+ msg)
                    else
                        console.log("No");
                }
            });

            return res.end('Completed');

        });
        // -muaz  calling the pyton file with name of file as argument.
        py.stdin.write(JSON.stringify(myFileName));
        py.stdin.end();


        res.end('Yes');
    });
    form.parse(req);
});

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

function geotoPix(lat, lng, width, height, transX, transY, scaleFactor){
    return [(lng + transX)* scaleFactor, height - (lat - transY)* scaleFactor];
}

function findLinearModel(y2, y1, x2, x1){
    m = (y2 - y1)/(x2 - x1);
    b = y2 - m*x2;
    // console.log('Between vector: ('+x1+', '+y1+') and ('+x2+', '+y2+')  Slope : '+m);
    // console.log('Bias: '+b);
    return [m, b];
}

function findQuadraticModel(y3, y2, y1, x3, x2, x1){
    A = [[x3*x3, x3, 1], [x2*x2, x2, 1], [x1*x1, x1, 1]];
    Y = [[y3], [y2], [y1]];
    AInv = math.inv(A);
    X = math.multiply(AInv, Y);
    newX = [X[0][0], X[1][0], X[2][0]];
    return newX;
}
polynomials = 2;

function findBasisFunctionModel(int_x_pts, int_y_pts){
  i = 0;
  A = [];
  for(p=0;p<int_x_pts.length;p++){
    ptt = int_x_pts[p];
    rowVector = [];
    for(i=0;i<=polynomials;i++){
        rowVector.push(Math.pow(ptt, i));
        // if(i%2==0)
        //   rowVector.push(Math.sin(i*ptt));
        // else
        //     rowVector.push(Math.cos(i*ptt));
    }
    A.push(rowVector);
  }
  Y = [];
  for(p=0;p<int_y_pts.length;p++) {
      Y.push([int_y_pts[p]]);
  }
  // console.log(A);
  ATranspose = math.transpose(A);
  matMul = math.multiply(ATranspose, A);
  matMulInv = math.inv(matMul);
  matMulInvMulATranspose = math.multiply(matMulInv, ATranspose);
  weights = math.multiply(matMulInvMulATranspose, Y);
  // W = [weights[0][0], weights[1][0], weights[2][0]];
    W = [];
    for(p=0;p<=polynomials;p++){
      W.push(weights[p][0]);
    }
  // W = [weights[0][0], weights[1][0]];
  return W;
}

function getCurvesBetweenPoints(last_point, pts){
    console.log('Fetching points between '+last_point+' and '+pts);
    lin_model = findLinearModel(pts[1], last_point[1], pts[0], last_point[0]);
    slope = lin_model[0];
    bias = lin_model[1];

    numberofPointsInBetween = 1;
    int_x_pts = [];
    int_y_pts = [];

    // -muaz Following code is working and it used generate route like a polynomial
    // START
    // int_x_pts.push(last_point[0]);
    // int_y_pts.push(last_point[1]);
    // for(ix=0;ix<numberofPointsInBetween;ix++){
    //     random_ratio = Math.random();
    //     x_int = (pts[0]+ last_point[0]) * random_ratio;
    //     int_x_pts.push(x_int);
    //
    //     y_int = slope*x_int + bias;
    //
    //     preturb_amount = Math.random();
    //     diff_y = (pts[1] - last_point[1]);
    //     preturbation = diff_y * preturb_amount;
    //     y_int_preturbed = y_int + preturbation;
    //     int_y_pts.push(y_int_preturbed);
    // }
    // int_x_pts.push(pts[0]);
    // int_y_pts.push(pts[1]);
    // console.log(int_x_pts);
    // W = findBasisFunctionModel(int_x_pts, int_y_pts);

    x_int = (pts[0]+ last_point[0])/2;

    y_int = slope*x_int + bias;

    curveFactor = 0.01; // 0 is no curve, 1 is fully curved
    diff_y = (pts[1] - last_point[1]);
    preturbation = diff_y * curveFactor;
    y_int_preturbed = y_int + preturbation;

    diff_x = Math.abs(pts[0] - last_point[0]);
    points_to_generate = parseInt(diff_x * 1.25);

    lins = linspace(last_point[0], pts[0], points_to_generate);
    QM = findQuadraticModel(y_int_preturbed, pts[1], last_point[1], x_int, pts[0], last_point[0]);
    hess = QM[0];
    lin = QM[1];
    bias = QM[2];
    x1 = lins[0];

    newPtList = [];
    // console.log(lins.length)
    for(idx = 0; idx < lins.length; idx++){

        yy = hess*Math.pow(lins[idx],2) + lin*lins[idx] + bias;
        // yy=0;
        // for(p =0;p<=polynomials;p++){
        //   yy+=W[p]*Math.pow(lins[idx], p);
        // }
        // yy = W[0]*Math.sin(0*lins[idx]) + W[1]*Math.cos(1*lins[idx]) ;
        newPt = [parseInt(lins[idx]), yy];
        newPtList.push(newPt);
    }
    return newPtList;
}

// -muaz Code where fancy map gets generated
app.post('/downloadMap', function(req, res){
    var mime = require('mime');
    var mapID=req.body.mapID;
    var userid=req.body.userid;
    console.log("\n\t\tIn downloadMap with mapID = "+ mapID + " and userid = " + userid);

    lats = [];
    lngs = [];
    connect.fetchMarkers(mongofil, userid, mapID, function (locs) {
        // -muaz latitudes and longitudes are fetched from database.
        obj = JSON.parse(locs);
        for(i = 0; i< obj.length; i++){
          lats.push(obj[i]["Lat"]);
          lngs.push(obj[i]["Lng"]);
        }

        // scaleFactor controls actual size of the image.
        scaleFactor = 5 ;
        line_width = scaleFactor;
        basic_w = 360;
        basic_h = 170;

        // -muaz Ultimate width and height of image.
        width = basic_w*scaleFactor;
        height = basic_h*scaleFactor;

        // -muaz Translating Geolocations to pixels
        for(x = 0; x < lngs.length; x++) {
            // console.log('Lat = '+ lats[x]+', Lng = '+lngs[x]);
            pts = geotoPix(lats[x], lngs[x], width, height, basic_w/2, -basic_h/2, scaleFactor);
            lngs[x] = pts[0];
            lats[x] = pts[1];
        }

        // -muaz  canvas middleware is used in order to draw/plot things on image. Middleware can be found at following
        // -muaz location: https://www.npmjs.com/package/canvas. Please following proper instruction in order to use
        // -muaz canvas properly
        var Canvas = require('canvas')
            , Image = Canvas.Image
            , canvas = new Canvas(width, height)
            , ctx = canvas.getContext('2d');

        var min_lat = Math.min.apply(null, lats),
            max_lat = Math.max.apply(null, lats);
        var min_lng = Math.min.apply(null, lngs),
            max_lng = Math.max.apply(null, lngs);
        var diff_lat = max_lat - min_lat;
        var diff_lng = max_lng - min_lng;

        // -muaz y-axis margin was kept to be 25% of th height such that map looks centered
        margin_y = 0.25 * height; // margin_y is 25% of total height
        margin_x = 2 * margin_y; // margin_x is twice as margin_y

        // -muaz scaling factors for latitude and longitude to have a "zoom" effect.
        scaling_lat = (height - 2 * margin_y) / diff_lat;
        scaling_lng = (width - 2 * margin_x) / diff_lng;

        // -muaz Here is where background image is placed. Change this image/location in order to have different background.
        require("fs").readFile(__dirname+'/public/FrontEnd/Pictures/bg.png', function(err1, squid){
            if (err1) throw err1;
            map_img = new Image;
            map_img.src = squid;

            ctx.drawImage(map_img, 0, 0, width, height);

            // -muaz marker image has to be loaded first in order to place it at multiple places.
            require("fs").readFile(__dirname+'/public/FrontEnd/Pictures/marker_2.png', function(err, squid){
                if (err) throw err;
                img = new Image;
                img.src = squid;

                ctx.font = "20px Arial";

                // -muaz these offsets are found empirically, these offsets are used because without these marker images
                // -muaz and "routes" does not coincide. So to remove that artifact these offsets are used.
                offset_x = 0.023*width; // found 0.023 empirically
                offset_y = 0.0353*height; // found 0.0353 empirically
                last_point = [];
                for(x = 0; x < lngs.length; x++) {
                    // -muaz lats and lngs (which were already in form of pixels) are then scaled and margins were added
                    pts = [(lngs[x] - min_lng ) * scaling_lng+ margin_x, (lats[x] - min_lat ) *scaling_lat+ margin_y];

                    ctx.lineWidth = line_width;
                    if (x >= 1){
                        // -muaz in between two points, list of curvy points has to be generated such that route looks fancier.
                        ptList = getCurvesBetweenPoints(last_point, pts);

                        // -muaz once points are found they get rendered to the image.

                        for(idx = 0; idx < ptList.length; idx++){
                            pt = ptList[idx];
                            if(idx==0){
                                ctx.moveTo(pt[0] + offset_x, pt[1]+ offset_y);
                            }
                            else{
                                ctx.lineTo(pt[0]+ offset_x, pt[1]+ offset_y);
                            }

                        }
                        ctx.stroke();
                        // break
                    }


                    ctx.drawImage(img, pts[0], pts[1], img.width * 0.05*scaleFactor, img.height * 0.05*scaleFactor);
                    last_point = pts;
                }

                // -muaz once finished rendering, image get saved to proper location.
                var base64Data = canvas.toDataURL().replace(/^data:image\/png;base64,/, "");
                require("fs").writeFile(__dirname+"/uploads/"+userid+"/"+mapID+".png", base64Data, 'base64', function(err) {
                    return res.end("/uploads/"+userid+"/"+mapID+".png");
                });
            });

        });


        // console.log(typeof myjson3);
        // console.log(locs);
        // var img = fs.readFileSync('./sample.jpg');
        // res.setHeader('Content-disposition', 'attachment; filename=sample.jpg');
        // res.setHeader('Content-type', mimetype);
        // var filestream = fs.createReadStream(file);
      // filestream.pipe(res);
        // res.writeHead(200, {'Content-Type': 'image/jpeg' });
        // res.end(img, 'binary');
        // console.log(myjson3);

        // return res.end(doc);

    });


    // res.send(img, 'binary');
    // res.end("Hello :) with mapID = "+ mapID + " and userid = " + userid);

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
        //console.log("Tour details update" + lat+ tourstopname);
        //Update the imagedetails in picturescollection

        connect.updateTour(mongofil,lat,lon,tourstopname, function(mssg){
            if(mssg == "done")
            {
                //console.log("Picture has been updated");
            }

        });


    });

  socket.on('UserData',function(msg){
    //console.log("In user data function");
    user=msg.id;
    map=msg.mapid;
    //console.log("The user is"+user+"  "+map);

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

  //Get favorite map details.

    socket.on("viewfavmaps", function (mssg) {
       console.log("In view fav maps "+mssg.username);
       connect.getfavmapdetails(mongofil, mssg.username, function(mapname, description, username)
       {

         if(mapname!== undefined || description !== undefined || username !== undefined)
         {
           console.log("In view fav maps got"+ mapname+"  "+ description+"  "+username);
           socket.emit("getfavmaps", {username:username, mapname:mapname, description:description})

         }


       });
    });

  socket.on("GetTrails", function(msg){
    //console.log("In get trails");
    //Get the trails
    var userid=msg.id;
    var maps=msg.mapid;

    connect.getTrails(mongofil,userid,maps,function(userid,mapid,src,des, description, mode){
      //console.log("In get Trails");
      if(src != undefined || des != undefined ||mode != undefined ) {
        //console.log("Retrived for trails   " + src.lat + "  " + des.lon+"  "+mode);
        socket.emit("drawtrails", {src: src, des: des, map:mapid, mode:mode, description:description});
      }
    });

  });

  socket.on('ImageGall', function(msg){
    //console.log("Message received"+ msg.mapid);
    connect.getPictures(mongofil, msg.userid, msg.mapid,function(picname, picpath, mapid, description, facevar, smilevar){
      if(picname!=undefined && picpath!= undefined && mapid!= undefined) {
        //console.log(picname + "  " + facevar + "   " + mapid);
        socket.emit("imagereturn", {picname: picname, picpath: picpath, mapid: mapid, userid:msg.userid, description:description, facevar:facevar, smilevar:smilevar});
      }
    });

  });

    socket.on('ViewGall', function(msg){
        //console.log("Message received"+ msg.mapid);
        connect.getPicturesViewPage(mongofil, msg.mapid,function(picname, picpath, mapid, description, facevar, smilevar){
            if(picname!=undefined && picpath!= undefined && mapid!= undefined) {
                //console.log(picname + "  " + facevar + "   " + mapid);
                socket.emit("ViewGallReturn", {picname: picname, picpath: picpath, mapid: mapid, userid:msg.userid, description:description, facevar:facevar, smilevar:smilevar});
            }
        });

    });

  socket.on("fetchImg", function(msg)
  {
    //console.log("Message received in g=fetch Img"+msg.tourstopname);
    var userid=msg.userid;
    var mapname=msg.mapname;
    var tourstopname=msg.tourstopname;
    connect.getPicturesTourStop(mongofil, userid,mapname,tourstopname, function(picname,picpath,tourstopname){
      if(picname!=undefined && picpath!=undefined )
      {
        //console.log("picname"+picname);
        socket.emit("getImg", {"picname":picname,"picpath":picpath, "tourstopname":tourstopname});
      }
    });

  });

    socket.on("fetchImgsrc", function(msg)
    {
        //console.log("Message received in g=fetch Img"+msg.userid);
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
    connect.getTourStops(mongofil,msg.userid,msg.mapname,function(tourstopnam, vehicle,lat,lon,description, duration)
    {
      if(tourstopnam!=undefined ) {
        console.log("Sending Data"+description);
        socket.emit("viewTourStops", {name: tourstopnam, description: description, vehicle: vehicle, lat: lat, lng: lon, duration:duration});
      }
    });
  });
  socket.on('getSearchTours', function(msg){
    console.log("Message received is"+msg.mapname);
        connect.getSearchTours(mongofil,msg.mapname,function(tourstopnam, vehicle,lat,lon,description, duration)
      {
          if(tourstopnam!=undefined ) {
              console.log("Sending Data"+description);
              socket.emit("viewserachtours", {name: tourstopnam, description: description, vehicle: vehicle, lat: lat, lng: lon, duration:duration});
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
    connect.getMaps(mongofil, msg.userid, function(mapname, mapdescription, publish){
      if(mapname!=undefined && mapdescription!=undefined){
        console.log("Map description"+mapdescription);
        socket.emit('viewmaps', {name:mapname, description:mapdescription, publish:publish});
      }
    });
  });

  socket.on('getmapdet', function(msg){
    connect.getmapdet(mongofil, msg.mapname, msg.userid, function(mapdescription, publish){
      if(mapdescription!=undefined){
        console.log("Map description"+mapdescription);
        socket.emit('viewmapdet', {description:mapdescription, publish:publish});
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




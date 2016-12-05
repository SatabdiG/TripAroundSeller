/**
 * Created by tasu on 07.07.16.
 */
/*** Name : MongoDB library
/*** Description: Written for node module. Needs to be included in the main node entry point code
 * Established connection. Adds files. Querys data
 * Dependencies : The database should exist. The collection should exist. The connection string should be allright
 */

var mongodb = require('mongodb').MongoClient;


module.exports= {
  establishConnection: function (connectionstring, databasename, queryby, queryval, callback) {
    var filenames = [];
    var filepaths = [];
    var results;

    mongodb.connect(connectionstring, function (err, db) {
      if (callback) {
        callback();
      }
      if (!err) {
        var cursor = db.collection(databasename).find();
        cursor.each(function (err, doc) {
          if (doc != null) {
            callback(doc.filename + "," + doc.filepath);
          }
        })
      }
      else
        console.log("Error happened");
    });
  },
  getMarkers:function(connectionstring, userid,mapid, callback){
  if(callback)
    callback();
    console.log("UserID"+userid);
    mongodb.connect(connectionstring,function(err,db){
      if(!err){
        var cursor=db.collection('markercollection').find({"userid":userid, "mapid":mapid});
        cursor.each(function(err,doc){
          if(doc!=null)
          {
            callback(doc.Lat,doc.Lng,doc.time,doc.filename, doc.mapid, doc._id);
          }
        });

      }
    });
  },
  getTrails:function(connectionstring, userid,mapid, callback){
    console.log("In get Trails mongodb");
    if(callback)
      callback();
    mongodb.connect(connectionstring,function(err,db){
      if(!err){
        var cursor=db.collection('trailcollection').find({"userid":userid, "mapid":mapid});
        cursor.each(function(err,doc){
          if(doc!=null)
          {
            console.log("In cursor"+doc.mode);
            callback(doc.userid, doc.mapid, doc.src, doc.des, doc.description, doc.mode);
          }
        });

      }
    });
  },

  //Delete all references of the map
  deleteallmap:function(connectionstring, userid, mapid, callback)
  {
    if(callback)
      callback();

    mongodb.connect(connectionstring,function(err,db){
      if(!err){

        //Delete from Mapcollection
        db.collection("mapcollection").removeMany({"userid":userid, "mapname":mapid});
        db.collection("markercollection").removeMany({"userid":userid, "mapid":mapid});
        db.collection("picturescollection").removeMany({"userid":userid, "mapid":mapid});
        return callback("done");
      }
    });


  },

    deleteTourStop:function(connectionstring, userid, mapid, tourstopname, callback)
    {
        if(callback)
            callback();

        mongodb.connect(connectionstring,function(err,db){
            if(!err){

                //Delete from Mapcollection
                db.collection("tourstop").removeMany({"userid":userid, "mapid":mapid, "tourstopname":tourstopname});
                return callback("done");
            }
        });


    },

  updateDescription:function(connectionstring, userid, mapid,usertext, callback){
    if(callback)
      callback();
    //find the description
     console.log("In Update Description");
    mongodb.connect(connectionstring,function(err,db){
      if(!err){
        var cursor=db.collection("mapcollection").find({"userid":userid, "mapname":mapid});
        cursor.each(function(err,doc){
          console.log("In doc"+userid+"  "+mapid);
          if(doc!=null)
          {
            console.log("Document ID"+doc._id+"  "+usertext);
            var docid=doc._id;
            db.collection("mapcollection").update({_id:docid},{$set:{"mapdescription":usertext}});
            return callback("done");

          }
        });

      }
    });

  },

  updatePictures:function(connectionstring, userid, mapid,filename,usertext, callback){
    if(callback)
      callback();
    //find the description
    console.log("In Update Pictures"+filename);
    mongodb.connect(connectionstring,function(err,db){
      if(!err){
        var cursor=db.collection("picturescollection").find({"userid":userid, "mapid":mapid, "picname":filename});
        cursor.each(function(err,doc){
          console.log("In doc"+userid+"  "+mapid);
          if(doc!=null)
          {
            console.log("Document ID"+doc._id+"  "+usertext);
            var docid=doc._id;
            db.collection("picturescollection").update({_id:docid},{$set:{"description":usertext}});
            return callback("done");

          }
        });

      }
    });

  },

  getPictures:function(connectionstring, userid,mapid, callback){
    if(callback)
      callback();
    console.log("UserID"+userid+"MapId"+mapid);
    mongodb.connect(connectionstring,function(err,db){
      if(!err){
        var cursor=db.collection('picturescollection').find({"userid":userid, "mapid":mapid});
        cursor.each(function(err,doc){
          if(doc!=null)
          {
            console.log("Document"+doc.face);
            callback(doc.picname,doc.picpath,doc.mapid, doc.description, doc.face, doc.smile);
          }
        });

      }
    });
  },

    getPicturesViewPage:function(connectionstring, mapid, callback){
        if(callback)
            callback();
        console.log("MapId"+mapid);
        mongodb.connect(connectionstring,function(err,db){
            if(!err){
                var cursor=db.collection('picturescollection').find({"mapid":mapid});
                cursor.each(function(err,doc){
                    if(doc!=null)
                    {
                        console.log("Document"+doc.face);
                        callback(doc.picname,doc.picpath,doc.mapid, doc.description, doc.face, doc.smile);
                    }
                });

            }
        });
    },

    getPicturesTourStop:function(connectionstring, userid,mapid, tourstopname, callback){
        if(callback)
            callback();
        console.log("UserID"+userid+"MapId"+tourstopname);
        mongodb.connect(connectionstring,function(err,db){
            if(!err){
                var cursor=db.collection('picturescollection').find({"userid":userid, "mapid":mapid, "tourstopname":tourstopname});
                cursor.each(function(err,doc){
                    if(doc!=null)
                    {
                        console.log("Document"+doc.face);
                        callback(doc.picname,doc.picpath);
                    }
                });

            }
        });
    },

    getPicturesTourStopsrc:function(connectionstring, mapid, tourstopname, callback){
        if(callback)
            callback();
        console.log("UserID"+"MapId"+tourstopname);
        mongodb.connect(connectionstring,function(err,db){
            if(!err){
                var cursor=db.collection('picturescollection').find({"mapid":mapid, "tourstopname":tourstopname});
                cursor.each(function(err,doc){
                    if(doc!=null)
                    {
                        console.log("Document"+doc.face);
                        callback(doc.picname,doc.picpath);
                    }
                });

            }
        });
    },

  getpublishedmaps:function(connectionstring, callback){
    if(callback)
      callback();

    mongodb.connect(connectionstring,function(err,db){
      if(!err){
        var cursor=db.collection('mapcollection').find({"publish":"Y"});
        cursor.each(function(err,doc){
          if(doc!=null)
          {
            console.log(doc);
            callback(doc.mapname, doc.mapdescription);
          }
        });

      }
    });
  },

    getDes:function(connectionstring, mapname, callback){
        if(callback)
            callback();

        mongodb.connect(connectionstring,function(err,db){
            if(!err){
                var cursor=db.collection('mapcollection').find({"mapname":mapname});
                cursor.each(function(err,doc){
                    if(doc!=null)
                    {
                        console.log(doc);
                        callback(doc.mapname, doc.mapdescription);
                    }
                });

            }
        });
    },


  getMaps:function(connectionstring, userid, callback){
    if(callback)
      callback();
    console.log("UserID"+userid);
    mongodb.connect(connectionstring,function(err,db){
      if(!err){
        var cursor=db.collection('mapcollection').find({"userid":userid});
        cursor.each(function(err,doc){
          if(doc!=null)
          {
            console.log(doc);
            callback(doc.mapname, doc.mapdescription);
          }
        });

      }
    });
  },

  getTourStops:function(connectionstring, userid,mapname, callback)
  {

    if(callback)
      callback();
    console.log("In get Tours"+userid+mapname);
    mongodb.connect(connectionstring,function(err,db){
      if(!err){
        var cursor=db.collection('tourstop').find({"userid":userid, "mapid":mapname}).sort({"position":+1});
        cursor.each(function(err,doc){
          if(doc!=null)
          {

              console.log("Got Data" + doc.tourstopname);
              callback(doc.tourstopname, doc.vehicle, doc.lat, doc.lon, doc.description);

          }
        });

      }
    });
  }
  ,

    getSearchTours:function(connectionstring, mapname, callback)
    {

        if(callback)
            callback();
        console.log("In get Tours"+mapname);
        mongodb.connect(connectionstring,function(err,db){
            if(!err){
                var cursor=db.collection('tourstop').find({"mapid":mapname}).sort({"position":+1});
                cursor.each(function(err,doc){
                    if(doc!=null)
                    {

                        console.log("Got Data" + doc.tourstopname);
                        callback(doc.tourstopname, doc.vehicle, doc.lat, doc.lon, doc.description);

                    }
                });

            }
        });
    },

  verifyusers:function (connectionstring, databasename, queryby, queryval, callback) {
    mongodb.connect(connectionstring, function (err, db) {
      if (callback) {
        callback();
      }
      if (!err) {
        var cursor = db.collection(databasename).find({"userid": queryby});
            cursor.each(function (err, doc) {
              if (doc != null) {
                console.log("Password  "+doc.userpassword);
                if(doc.userpassword == queryval) {

                  return callback("success", doc.username);

                }
                else {
                  return callback("fail");
                }
              }
            })
      }
      else
        console.log("Error happened");
    });

  },
  //First check to see if user is already present
  userPresent:function(connectionstring,userid, callback){
    if (callback) {
      callback();
    }

    mongodb.connect(connectionstring, function (err, db) {
      var collec = db.collection('usercollection');
       if (collec != null) {
        var tempsur = db.collection('usercollection').count({userid: userid}, function(err, count){
          if(!err){
            console.log("User present "+ count);
            if(count>0){
              return callback("present");
            }
            else
              return callback("nothing");
          }
        });

      }
    });
  },
    //Count the Number of Tour Stops
    getTourStopCount:function(connectionstring,mapname, callback){
        if (callback) {
            callback();
        }

        mongodb.connect(connectionstring, function (err, db) {
            var collec = db.collection('tourstop');
            if (collec != null) {
                var tempsur = db.collection('tourstop').count({mapid: mapname}, function(err, count){
                    if(!err){
                        console.log("User present "+ count);
                        return callback(count);
                    }
                });

            }
        });
    },

  mapPresent:function(connectionstring,userid, callback){
    if (callback) {
      callback();
    }
    mongodb.connect(connectionstring, function (err, db) {
      var collec = db.collection('mapcollection');
      if (collec != null) {
        var tempsur = db.collection('mapcollection').count({userid: userid}, function(err, count){
          if(!err){
            console.log("User present "+ count);
            if(count>0){
              return callback("present");
            }
            else
              return callback("nothing");
          }
        });

      }
    });
  },

  trailPresent:function(connectionstring,userid, mapid, callback){
    if (callback) {
      callback();
    }

    mongodb.connect(connectionstring, function (err, db) {
        var tempsur = db.collection('trailcollection').count({"userid": userid, "mapid":mapid}, function(err, count){
          if(!err){
            console.log("User present "+ count);
            if(count>0){
              return callback("present");
            }
            else
              return callback("nothing");
          }
        });
    });
  },

  getmarkerssorted:function (connectionstring,userid,mapid, callback) {
    console.log("In added Trail");

    if (callback) {
      callback();
    }
    var time=0;
    var temparr=[];
    //get markerdata based on the time paramter
    mongodb.connect(connectionstring, function (err, db) {
      time=0;

      if(!err)
      {
        console.log("userid"+userid+"  "+mapid);
        var cursor=db.collection("markercollection").find({"userid":userid, "mapid":mapid}).sort({"time":1});
          cursor.each(function(err, doc){
            if(!err) {
              if (doc != undefined) {
                time += 1;
                console.log("Obj" + doc.Lat + "  " + doc.Lng);
                temparr.push(doc.Lat);
                callback(temparr);
                }
              }
          });
      }
    });

  },



  addTourStops:function(connectionstring, userid, mapname, vehicle, tourstopname,lat,lng, description,pos, callback)
  {
    if(callback)
      callback();
    mongodb.connect(connectionstring, function (err, db) {
      var cursor = db.collection("tourstop").count({"userid": userid, "mapid": mapname, "tourstopname": tourstopname}, function(err, count){
      var pos1=0;
      console.log("Count"+count);
      if (count === 0) {
        //Get the Max value of present position
          var options = { "sort": [['position',-1]] };
          db.collection("tourstop").findOne({$query:{"userid":userid,"mapid":mapname},$orderby:{position:-1}} , function(err, doc) {
              if(!err) {
                  if(doc== null)
                  {
                      pos1=0;
                  }else {
                      console.log("Returned # " + doc.position + " documents");
                      pos1=doc.position+1;
                  }
              }


              //New Tour
              mongodb.connect(connectionstring, function (err, db) {
                  var collec = db.collection('tourstop');
                  if (collec != null) {
                      db.collection('tourstop').insert({
                          "userid": userid,
                          "mapid": mapname,
                          "vehicle": vehicle,
                          "tourstopname": tourstopname,
                          "lat": lat,
                          "lon": lng,
                          "description": description,
                          "position":pos1
                      }, {w: 1}, function (err, records) {

                          if (records != null) {
                              console.log("Trail Added");
                              callback("yes");
                              db.close();
                          }
                          else {
                              callback("no");
                              console.log("Trail cannot add");
                          }
                      });

                  }


              });

          });


      }
      else {
        //Update exsisting
          var cursortemp=db.collection("tourstop").find({"userid": userid, "mapid": mapname, "tourstopname": tourstopname});
          cursortemp.each(function(err,doc){
              if(doc!=null)
              {

                  var docid=doc._id;
                  console.log("Update the tourstop"+doc.userid+"  "+docid);
                  //db.collection("tourstop").update({_id: docid}, {$set: {"description": description}});
                  db.collection("tourstop").update({_id: docid}, {$set: {"description": description, "vehicle":vehicle}});
                  return callback("done");

              }
          });

      }
      });
    });
  },

  //Add trailsby extracting two markers
  addtrails:function(connectionstring, userid, mapid, src,des,descp,mode, callback){
    console.log("In add trails");
    if(callback)
      callback();
    mongodb.connect(connectionstring, function (err, db) {

      var collec = db.collection('trailcollection');
      if (collec != null) {
        db.collection('trailcollection').insert({
          "userid": userid,
          "mapid": mapid,
          "src": src,
          "des": des,
          "description": descp,
          "mode" : mode
        }, {w: 1}, function (err, records) {

          if (records != null) {
            console.log("Trail Added");
            callback("yes");
            db.close();
          }
          else {
            callback("no");
            console.log("Trail cannot add");
          }
        });

      }



    });

  },


  //add face to database
  //add face variable to the column of face for each image
  addface: function (connectionstring, imagename, userid,mapid,facevar, callback) {
    if (callback) {
      callback();
    }
    console.log("Imagename "+userid+"  "+mapid+"  "+imagename+"  "+facevar);
     mongodb.connect(connectionstring,function(err,db){
        if(!err){
          var cursor=db.collection("picturescollection").find({"userid":userid, "mapid":mapid, "picname":imagename});
          cursor.each(function(err,doc){
            if(doc!=null)
            {
              console.log("Document ID "+doc._id+"  "+facevar);
              var docid=doc._id;
              db.collection("picturescollection").update({_id:docid},{$set:{"face":facevar}});
              return callback("done");

            }
          });

        }
      });
  },

    getOneImage: function (connectionstring, mapname, callback) {
        if (callback) {
            callback();
        }
        console.log("Imagename "+mapname);
        mongodb.connect(connectionstring,function(err,db){
            if(!err){
                var doc=db.collection("picturescollection").findOne({"mapid":mapname}, function(err, item){
                  if(!err)
                  {
                      var name=item.picname;
                      var location=item.picpath;
                      console.log("Name location"+ name+"v "+ location);
                      return callback(name, location);
                  }
                });


                /*
                cursor.each(function(err,doc){
                    if(doc!=null)
                    {
                        console.log("Document ID "+doc._id+"  "+doc.picname+doc.picpath);
                        return callback(doc.picname, doc.picpath);

                    }
                });*/

            }
        });
    },
   //Update the Maps so that they can be published
    updateMaps:function (connectionstring, userid,mapid,publish, callback) {
        if(callback){
            callback();
        }
        console.log("In mongoDb"+mapid+publish);
        mongodb.connect(connectionstring, function (err, db) {
           if(!err){
            var cursor=db.collection("mapcollection").find({"userid":userid, "mapname":mapid});
               cursor.each(function (err,doc) {
                  if(doc!=null)
                  {
                      var docid=doc._id;
                      console.log("Doc"+docid);
                      db.collection("mapcollection").update({_id:docid},{$set:{"publish":publish}});
                      return callback("done");
                  }else
                  {
                      console.log("Doc is null");
                  }
               });
           }
        });
    },
  //update trail description

    updatetrail: function (connectionstring, userid,mapid, src, des, desc,mode, callback) {
    if (callback) {
      callback();
    }
    var srclat=Math.round(src.lat*100)/100;
    var srclon=Math.round(src.lon*100)/100;

    mongodb.connect(connectionstring,function(err,db){
      if(!err){
        var cursor=db.collection("trailcollection").find({"userid":userid, "mapid":mapid});
        cursor.each(function(err,doc){
          if(doc!=null)
          {
            console.log("Src"+doc.src.lat);
            var lat= Math.round((doc.src.lon)*100)/100;
            if(lat === srclat)
            {
              var docid=doc._id;
              db.collection("trailcollection").update({_id:docid},{$set:{"description":desc, "mode":mode}});
              return callback("done");
            }
            console.log("Trail ID "+lat+"  "+srclat);


          }

        });

      }
    });
  },


  //add smile to database
  //add smile variable to the column of smile for each image
  addsmile: function (connectionstring,mapdataversionid, imagename, imagepath,userid,mapid,smilvar, callback) {
    if (callback) {
      callback();
    }
    mongodb.connect(connectionstring, function (err, db) {

      var collec = db.collection('storedimages');
      if (collec != null) {
        db.collection('storedimages').insert({
          "mapdataversionid": mapdataversionid,
          "imagename": imagename,
          "imagepath": imagepath,
          "userid": userid,
          "mapid": mapid,
          "smile" : smilevar
        }, {w: 1}, function (err, records) {

          if (records != null) {
            console.log("Smile Record added");
            callback("yes");
            db.close();
          }
          else {
            callback("no");
            console.log("Smile Cannot add");
          }
        });

      }
      else {
        console.log("Database not found! error");
      }
    });
  },
  //Save Maps to database
  addmaps:function (connectionstring,userid, mapname, mapdescription, callback) {

    if (callback) {
      callback();
    }

    mongodb.connect(connectionstring, function (err, db) {
      var collec = db.collection('usercollection');
      var flag=0;
      if (collec != null) {
        console.log("Flag " + flag);
        db.collection('mapcollection').insert({
          "userid": userid,
          "mapname": mapname,
          "mapdescription": mapdescription,
          "publish":"N"
        }, {w: 1}, function (err, records) {

          if (records != null) {
            console.log("Map record added");
            db.close();
            return callback("add");

          }
          else {

            console.log("Mapp Cannot add");
            return callback('err');
          }
        });

      }
      else {
        console.log("Database not found! error");
      }

    });
  },
  //Add users to database
  addusers: function (connectionstring,userid, username, userpassword, type,callback) {
  if (callback) {
    callback();
  }

  mongodb.connect(connectionstring, function (err, db) {
    var collec = db.collection('usercollection');
    var flag=0;
    if (collec != null) {
      console.log("Flag " + flag);
      db.collection('usercollection').insert({
        "userid": userid,
        "username": username,
        "userpassword": userpassword,
        "type":type

      }, {w: 1}, function (err, records) {

        if (records != null) {
          return callback("add");
          console.log("User Record added");
          db.close();
        }
        else {

          console.log("User Cannot add");
          return callback('err');
        }
      });

      }
      else {
        console.log("Database not found! error");
      }

  });
},

  storeImages: function (connectionstring, mapdataversionid, userid,mapid, markerid,picname,picpath,facevar, smilevar, des,callback) {
    if (callback) {
      callback();
    }

    mongodb.connect(connectionstring, function (err, db) {
      var collec = db.collection('picturescollection');
      if (collec != null) {
        console.log("In store Images");
        db.collection('picturescollection').insert({
          "tourstopname": mapdataversionid,
          "mapid": mapid,
          "userid": userid,
          "markerid":markerid,
          "picname":picname,
          "picpath":picpath,
          "face":facevar,
          "smile":smilevar,
          "description":des,
        }, {w: 1}, function (err, records) {
          if (records != null) {
            console.log("Map Data Version Record added");
            callback("yes");
            db.close();
          }
          else{
            console.log("Map Data Version Cannot add");
            callback("no");
          }
        });

      }
      else {
        console.log("Database not found! error");
      }
    });
  },


addmapversion: function (connectionstring, databasename,_mapdataversionid, _userid,_mapid, callback) {


  if (callback) {
    callback();
  }
  mongodb.connect(connectionstring, function (err, db) {

    var collec = db.collection(databasename);
    if (collec != null) {
      db.collection('mapdataversioncollection').insert({
        "_mapdataversionid": _mapdataversionid,
        "mapid": _mapid,
        "userid": _userid
      }, {w: 1}, function (err, records) {

        if (records != null) {
          console.log("Map Data Version Record added");
          db.close();
        }
        else
          console.log("Map Data Version Cannot add");
      });

    }
    else {
      console.log("Database not found! error");
    }
  });
},

addmarkers: function (connectionstring,mapdataversionid,markerid,userid,mapid,Latid,Lngid,time,filename, callback) {
  if (callback) {
    callback();
  }
  mongodb.connect(connectionstring, function (err, db) {

    var collec = db.collection('markercollection');
    if (collec != null) {
      db.collection('markercollection').insert({
        "mapdataversionid": mapdataversionid,
        "markerid": markerid,
        "userid": userid,
        "mapid": mapid,
        "Lat": Latid,
        "Lng": Lngid,
        "time":time,
        "filename":filename
     }, {w: 1}, function (err, records) {

        if (records != null) {
          callback("yes");
          console.log("Marker Record added");
          db.close();
        }
        else {
          console.log("Marker Cannot add");
          callback("no");
        }
      });

    }
    else {
      console.log("Database not found! error");
    }
  });
},
addvalues: function (connectionstring,mapdataversionid, imagename, imagepath,userid,mapid,  callback) {


    if (callback) {
      callback();
    }
    mongodb.connect(connectionstring, function (err, db) {

      var collec = db.collection('storedimages');
      if (collec != null) {
        db.collection('storedimages').insert({
          "mapdataversionid": mapdataversionid,
          "imagename": imagename,
          "imagepath": imagepath,
          "userid": userid,
          "mapid": mapid
        }, {w: 1}, function (err, records) {

          if (records != null) {
            console.log("Image Record added");
            callback("yes");
            db.close();
          }
          else {
            callback("no");
            console.log("Image Cannot add");
          }
        });

      }
      else {
        console.log("Database not found! error");
      }
    });
  },
retrievevalues: function ( connectionstring, databasename, mapdataversionid, markerid,_imagename, _imagepath,_userid,_mapid, callback) {
      if (callback) {
        callback();
      }
      mongodb.connect(connectionstring, function (err, db) {

        var collec = db.collection('picturescollection');
        if (collec != null) {
          db.collection('picturescollection').find({
            "mapdataversionid": mapdataversionid,
            "markerid": markerid,
            "imagename": _imagename,
            "imagepath": _imagepath,
            "userid": _userid,
            "mapid": _mapid
          },{w:1},function(err,records){
            if(records!=null) {
              console.log("Image Record retrieved");
              db.close();
            }
            else
              console.log("Image Cannot retrieve");
          });

        }
        else {
          console.log("Database not found! error");
        }
      });
    },
    saveDocs: function(connectionstring, json_data, callback){
        if (callback) callback();

        var coll_name = "docscollection";
        mongodb.connect(connectionstring, function (err, db) {
            db.collection(coll_name).save(json_data, function (err, result) {
                if (err) return console.log(err);
                console.log('saved to database');
            });
        });
        return callback("done");
    },
    fetchData: function(connectionstring, userid, mapID, callback){
        var coll_name = "docscollection";
        // console.log(q)
        // console.log(typeof q)
        mongodb.connect(connectionstring, function (err, db) {
            if(!err){
                var cursor = db.collection(coll_name).find({
                    "userID": userid,
                    "mapID": mapID,
                });
                cursor.each(function (err2, doc) {
                    if(doc!=null){
                        callback(JSON.stringify(doc));
                    }
                });
            }
        });
    }



}



/**
* Project class to hold the project data
* @class Project
*/

function Project( data, user, flags )
{
	if(this.constructor !== Project)
		throw("You must use new to create a Project");
    if(!flags.no_construct)
	   this._ctor( data );
    this._user = user;
    this._default_measure_options = {
        display: true,
        push: true
    }
}

Project.prototype._ctor = function( data )
{
    
    this._last_project_id = 0;
    this._last_measure_id = 0;
    this._last_seg_measure_id = 100;
    this._last_area_measure_id = 1000;
    
    this._anotations    = [];
    this._textures      = [];
    this._measures      = [];
    this._segments      = [];
    this._areas         = [];
    
    this._auto_save = false;
//    this._max_extra_size = 20;
//    this._max_measures_size = 20;
    
	this.FROMJSON( data );
}

/*
*   @methods setters of attrs
*/

Project.prototype.setAuthor = function(author)
{
    this._author = author;
    
    if(this._auto_save)
        this.save();
}

Project.prototype.setLocation = function(location)
{
    this._location = location;
    
    if(this._auto_save)
        this.save();
}


/*
*   @method pushExtra
*   Insert extra information to the _extra list.
*   @param type {string} data type (pdf, image, etc)
*   @param data {string} path to data (or link)
*/
Project.prototype.pushExtra = function( name, type, data )
{
    this._extra.push( {
        type: type,
        data: data,
        name: name
    });
    
    if(this._auto_save)
        this.save();
}

/*
*   @method deleteExtra
*   Delete one single extra information of the _extra list.
*   @param type {string} data type (pdf, image, etc)
*   @param data {string} path to data (or link)
*/
Project.prototype.deleteExtra = function( selector, type )
{
    var index = null;
    var searched = null;
    
    if(type == "text"){
        searched = selector.attr("class").split(" ")[1];
    }
        
    else{
        searched = selector.attr("class").split(" ")[2];
    }
    
//    console.log(searched);
    
    for(var i = 0; i < this._extra.length; i++){
        if(this._extra[i].name == searched)
            var index = i;
    }
    
    if (index > -1) {
        this._extra.splice(index, 1);
    }
    
    if(this._auto_save)
        this.save();
}

/*
*   Anotations
*   @class Project
*/

/*
*   @method insertAnotation
*   @param camera {vec3} contains position, target and up
*   @param position {vec3} x y z of the anotation
*   @param status {string} text of the anotation
*/
Project.prototype.insertAnotation = function( id, camera, position, text, options )
{
    var a = new Annotation(id, camera, position, text);
    this._anotations.push(a.TO_JSON());
    
    var totalString = '<tr a id="' + id + '" draggable="true" ondragstart="drag(event)" onclick="lookAtAnot( GFX.camera, [' + a._camera_position  + "], [" + a._camera_target + "], [" + a._camera_up + '], ' + id + ')">'+ "<td>" + id + "</td>" + "<td>" + text + "</td>"
    +"</tr>";
    
    $("#anotacion_tabla").append(totalString);
    
    // only if auto_saving on and not parsing
    if(this._auto_save && options.display)
        this.save();
}

Project.prototype.getAnnotations = function()
{
    return this._anotations;
}

/*
*   @method deleteAnotation
*   Deletes a single annotation
*   @param id {integer} id of the annotation to delete
*/
Project.prototype.deleteAnotation = function( id )
{
    //anotations list
    var index = null;
	for(var i = 0; i < this._anotations.length; ++i)
        if(this._anotations[i].id == id){
            index = i;
            break;
        }
                
    if(index === null)
        throw("no annotation to delete");
    
    //table
    $("#" + (index+1)).remove();
    
    // reorder table
    for(var i = index; i < this._anotations.length; ++i)
    {
        
        var rowindex = i + 1;
        var row = $("#" + rowindex);
        var sub = row.attr("id") - 1;
        
        if(!sub)
            continue;
        
        row.attr("id", sub);
        this._anotations[i].id = sub;
        
        // testing
        row = $("#" + sub);
        var tmp = row.html();
        tmp = tmp.replace("<td>" + (sub+1) + "</td>", "<td>" + sub + "</td>");
        row.html(tmp);
        //
    }
    
    // list
    this._anotations.splice(index, 1);
    
    // scene
    for(var i = 0, child; child = GFX.model.children[i]; ++i)
        if(child.id == id)
        {
            child.destroy();
            return;
        }
    
    if(this._auto_save)
        this.save();
}

/*
*   @method deleteAllAnotations
*   Deletes all annotations
*   @param obj {sceneNode} current global mesh of the project
*/

Project.prototype.deleteAllAnotations = function( model )
{
	// list
    this._anotations = [];
    // html
    $('#anotacion_tabla').empty();
    // scene
    model.children.splice(0, model.children.length);
    
    if(this._auto_save)
        this.save();
}

/*
*  Rotations
*  @class Project
*/

Project.prototype.getRotations = function()
{
    return this._rotations;
}

/*
*   @method setRotations
*   Sets the current rotations to the project
*   @param rotation {vec4} array list of the object rotations
*/

Project.prototype.setRotations = function( rotation )
{
    this._rotations = rotation;
    
    if(this._auto_save)
        this.save();
}

/*
*   Distances
*   @class Project
*/

Project.prototype.getMeasurements = function()
{
    return this._measures;
}

Project.prototype.getSegmentMeasurements = function()
{
    return this._segments;
}

Project.prototype.getAreas = function()
{
    return this._areas;
}

Project.prototype.getMeasure = function(id)
{
    for(var i = 0; i < this._measures.length; i++)
        if(this._measures[i].id == id)
            return this._measures[i];
    return 0;
}

Project.prototype.getSegmentMeasure = function(id)
{
    for(var i = 0; i < this._segments.length; i++)
        if(this._segments[i].id == id)
            return this._segments[i];
    return 0;
}

Project.prototype.getArea = function(id)
{
    for(var i = 0; i < this._areas.length; i++)
        if(this._areas[i].id == id)
            return this._areas[i];
    return 0;
}

/*
*   @method deleteDistance
*   Delete one single measured distance from any of the 3 lists
*   @param id {number} id of the measure
*   @param type {string} data type (pdf, image, etc)
*/
Project.prototype.deleteDistance = function( id, type )
{
    var index = null;
    var list = null;
    
    switch(type){
        case "d": list = this._measures; break;
        case "s": list = this._segments; break;
        case "a": list = this._areas; break;
    }
    
    for(var i = 0; i < list.length; i++){
        if(list[i].id == id)
            index = i;
    }
    
    if (index > -1) {
        list.splice(index, 1);
    }
    else{
        console.error("bad index");
    }
    
    if(this._auto_save)
        this.save();
}

/*  
*   @method setDistances
*   Insertar solo las medidas en las tablas
*   cuando se actualiza el metro
*/
Project.prototype.restoreDistances = function( )
{
    $('#distances-table').find("tbody").empty();
    $('#segment-distances-table').find("tbody").empty();
    $('#areas-table').find("tbody").empty();
    
    for(var i = 0, msr; msr = this._measures[i]; i++)
    {
        var camera = {
            "position": msr.camera_position,
            "target": msr.camera_target,
            "up": msr.camera_up
        };
        this.insertMeasure(camera, msr.points, msr.distance, msr.name, {display: false, push: false, id: msr.id});
    }

    for(var i = 0, msr; msr = this._segments[i]; i++)
    {
        var camera = {
            "position": msr.camera_position,
            "target": msr.camera_target,
            "up": msr.camera_up
        };        
        this.insertSegmentMeasure( camera, msr.points, msr.distance, msr.name, {display: false, push: false, id: msr.id} );
    }
        
    
    for(var i = 0, msr; msr = this._areas[i]; i++)
    {
        var points = [];
        for(var j = 0; j < msr.points.length; j++)
        {
            var obj = msr.points[j];
            var point = [obj[0], obj[1], obj[2]];
            points.push(point);
        }
        this.insertArea( points, msr.area, msr.index, msr.name, {display: false, push: false, id: msr.id});    
    }
    
    if(this._auto_save)
        this.save();
}

Project.prototype.update_meter = function(relation)
{
    // recalcular distancias 
    for(var i = 0; i < this._measures.length; ++i)
    {
        var msr = this._measures[i];
        msr.distance *= this._meter;
        msr.distance /= relation;
    }
    
    // recalcular segmentos
    for(var i = 0; i < this._segments.length; ++i)
    {
        var msr = this._segments[i];
        msr.distance *= this._meter;
        msr.distance /= relation;
    }
    
    // recalcular areas
    for(var i = 0; i < this._areas.length; ++i)
    {
        var msr = this._areas[i];
        msr.area *= Math.pow(this._meter, 2);
        msr.area /= Math.pow(relation, 2);
    }
    
    this._meter = relation;
    this.restoreDistances();
    if(this._auto_save)
        this.save();
}

/*
*   @method updateAllMeasures
*   Push each measure as a node child to avoid losing all of them
*   @param parent_node {SceneNode} 3d model or any other node to push childs
*/
Project.prototype.updateAllMeasures = function( parent_node )
{
    
    
//    if(this._auto_save)
//        this.save();
}

/*
*   @method insertMeasure
*   Push a new measure to the list project
*   @param camera {vec3} get camera properties
*   @param points {array} points within distance is calculated
*   @param options {object} push / display flags
*/

Project.prototype.insertMeasure = function( camera, points, distance, name, options )
{   
    if(!distance)
    {
        console.error("distance 0");
        return;
    }
        
    options = options || {};
    
    var table = $('#distances-table');
    var bodyTable = table.find('tbody');
    var id = options.id >= 0 ? options.id : this._last_measure_id++;
    
    var aux = "dist-name" + id;
    
    var row = "<tr id=" + id + " a class='pointer'>" + 
    "<td onclick='show($(this))' data-type='m'>" + "<i class='material-icons show'>fiber_manual_record</i></td>" +
    "<td id='" + aux + "'><p onclick='setInput(" + id + ", " + '"dist"' + ")'>" + name + "</p></td>" + 
    "<td>" + Math.round(distance * 1000) / 1000 + "</td>"; 
    if(window.mode != "player")
        row += "<td><i onclick='remove(this)' class='material-icons'>close</i></td>"; 
    row += "</tr>";
    
    bodyTable.append(row);
    
    APP.showing["t1"] = options.display;
    revealDOMElements(table, options.display);
    
    if(options.push)
        this._measures.push( {
            "id": id,
            "name": name,
            "camera_position": vec3.clone(camera.position),
            "camera_target": vec3.clone(camera.target),
            "camera_up": vec3.clone(camera.up),
            "points": points,
            "distance": distance
        });
    
    // only if auto_saving on and not parsing
    if(this._auto_save && options.display)
        this.save();
}

/*
*   @method insertSegmentMeasure
*   Push a new segment measure to the list project
*   @param points {array} list of vertices
*   @param display {bool} show or not the table after inserting measure
*/

Project.prototype.insertSegmentMeasure = function( camera, points, distance, name, options )
{   
    if(!distance)
        return;
    
    options = options || {};
    
    var table = $('#segment-distances-table');
    var bodyTable = table.find('tbody');
    var id = options.id ? options.id : this._last_seg_measure_id++;
    
    var aux = "seg-name" + id;
    
    var row = "<tr id=" + id + " a class='pointer'>" + 
    "<td onclick='show($(this))' data-type='s'>" + "<i class='material-icons show'>fiber_manual_record</i></td>" +
    "<td id='" + aux + "'><p onclick='setInput(" + id + ", " + '"seg"' + ")'>" + name + "</p></td>";
    if(window.mode != "player")
        row += "<td>" + (points.length - 1) + "</td>";
    row += "<td>" + Math.round(distance * 1000) / 1000 + "</td>";
    if(window.mode != "player")
        row += "<td><i onclick='remove(this)' class='material-icons'>close</i></td>"; 
    row += "</tr>";
    
    bodyTable.append(row);
    
    APP.showing["t2"] = options.display;
    revealDOMElements(table, options.display);
    
    if(options.push)
        this._segments.push( {
            "id": id,
            "name": name,
            "camera_position": vec3.clone(camera.position),
            "camera_target": vec3.clone(camera.target),
            "camera_up": vec3.clone(camera.up),
            "points": points,
            "distance": distance
        } );
    
    // only if auto_saving on and not parsing
    if(this._auto_save && options.display)
        this.save();
}

/*
*   @method insertArea
*   Push a new area measure to the list project
*   @param points {array} list of vertices
*   @param display {bool} show or not the table after inserting measure
*/

Project.prototype.insertArea = function( points, area, index, name, options )
{   
    if(!area)
        return;
    
    options = options || {};
    
    var table = $('#areas-table');
    var bodyTable = table.find('tbody');
    var id = options.id ? options.id : this._last_area_measure_id++;
    var style = index === 1 ? "Planta" : "Otra";
    
    var aux = "area-name" + id;
    
    var row = "<tr id=" + id + " a class='pointer'>" + 
    "<td onclick='show($(this))' data-type='a'>" + "<i class='material-icons show'>fiber_manual_record</i></td>" + 
    "<td id='" + aux + "'><p onclick='setInput(" + id + ", " + '"area"' + ")'>" + name + "</p></td>";
    if(window.mode != "player")
        row += "<td>" + style + "</td>";
    row += "<td>" + Math.round(area * 1000) / 1000 + "</td>";
    if(window.mode != "player")
        row += "<td><i onclick='remove(this)' class='material-icons'>close</i></td>"; 
    row += "</tr>";
    
    bodyTable.append(row);
    
    APP.showing["t3"] = options.display;
    revealDOMElements(table, options.display);
    
    if(options.push)
        this._areas.push( {
            "id": id,
            "name": name,
            "points": points,
            "index": index,
            "area": area
        } );
    
    // only if auto_saving on and not parsing
    if(this._auto_save && options.display)
        this.save();
}

/*
*   JSON
*   @class Project
*/

/*  
*   @method FROMJSON
*   Crear el proyecto a partir del json creado
*   @param data
*/
Project.prototype.FROMJSON = function( data )
{
    data = data || {};
    
    this._uid = this._last_project_id++;
    this._json = data;
    
    this._auto_save = data.config["auto-save"];
    
	// data
	this._description = data.descripcion;
    this._id = data.id;
	this._author = data.autor;
    this._location = data.lugar;
    this._coordinates = data.coordenadas;
    
    this._render = data.render;
    this._mesh = data.render.mesh;
    
    for(var i = 0; i < data.render.texture.length; ++i)
        this._textures.push(data.render.texture[i]);    
    
    this._extra = data.extra;
    
    // anotations
    var len = data.anotaciones.length? data.anotaciones.length : 0;
    
    for(var i = 0; i < len; i++)
    {
        var camera = {
            "position": data.anotaciones[i].camera_position,
            "target": data.anotaciones[i].camera_target,
            "up": data.anotaciones[i].camera_up
        };
        this.insertAnotation(   data.anotaciones[i].id, camera,
                                data.anotaciones[i].position,
                                data.anotaciones[i].text,
                                {display: false} // parsing so prevent auto_saving
                            );
    }
    
    // rotations
    this._rotations = data.render.rotaciones || {};
    
    //distances
    this._meter = data.render.metro || -1;
    
    len = data.medidas ? data.medidas.length : 0;
    
    for(var i = 0; i < len; i++)
    {
        var camera = {
            "position": data.medidas[i].camera_position,
            "target": data.medidas[i].camera_target,
            "up": data.medidas[i].camera_up
        };
        this.insertMeasure(camera,
                           data.medidas[i].points,
                           data.medidas[i].distance,
                           data.medidas[i].name,
                           {display: false, push: true}); // parsing so prevent auto_saving
    }
    
    len = data.segmentos ? data.segmentos.length : 0;
    
    for(var i = 0; i < len; i++)
    {
        var camera = {
            "position": data.segmentos[i].camera_position,
            "target": data.segmentos[i].camera_target,
            "up": data.segmentos[i].camera_up
        };
        this.insertSegmentMeasure( camera, 
                                  data.segmentos[i].points,
                                  data.segmentos[i].distance,
                                  data.segmentos[i].name,
                                  {display: false, push: true} ); // parsing so prevent auto_saving
    }
    
    len = data.areas ? data.areas.length : 0;
    
    for(var i = 0; i < len; i++)
    {
        var points = [];
        for(var j = 0; j < data.areas[i].points.length; j++)
        {
            var obj = data.areas[i].points[j];
            var point = [obj[0], obj[1], obj[2]];
            points.push(point);
        }
        this.insertArea( points,
                        data.areas[i].area,
                        data.areas[i].index,
                        data.areas[i].name,
                        {display: false, push: true} );  // parsing so prevent auto_saving
    }
}

/*  
*   @method save
*   Guardar todos los datos a disco
*   Se trata de sobreescribir (o no) el json original,
*   con los atributos actuales del proyecto
*   @param overwrite {bool}
*   @param extra {string}
*/
Project.prototype.save = function( overwrite, extra )
{
    if( this._user == "guest" && window.guest_mode == undefined)
    {
        alert( "Please register to save your progress" );
        return 0;
    }
    
    var project_name = this._id;
    
    if(overwrite && extra.length)
        project_name += extra;
    
    var o = {
        "id": project_name,
        "descripcion": this._description,
        "autor": this._author,
        "lugar": this._location,
        "coordenadas": {"lat": this._coordinates.lat, "lng": this._coordinates.lng},
        "render":{"id": this._id, "mesh": this._mesh, "texture": this._textures,
                  "rotaciones": this._rotations, "metro": this._meter},
        "extra": this._extra,
        "anotaciones": this._anotations,
        "medidas": this._measures,
        "segmentos": this._segments,
        "areas": this._areas,
        "config": {
                "auto-save": this._auto_save
        }
    };
    
    var that = this;
    
    var on_complete = function(){
        console.log("saved");
        // update the project copy in session storage
        // to avoid getting a not updated version in next
        // fills
        sessionStorage.setItem("project", JSON.stringify(that));     
    }
    
    var on_error = function(err){
        console.error(err);
    }

    /* 
    *   Upload configuration file as JSON
    */
    var path = current_user + "/projects/" + project_name + ".json";
    session.uploadFile( path, JSON.stringify(o), 0, on_complete, on_error);
}

/*  
*   @method config
*   Cambiamos propiedades de la página dependiendo de 
*   atributos del proyecto
*/
Project.prototype.config = function()
{
    
}


/*  
*   @method fill
*   Crea un proyecto a partir de un string con los datos
*   @param data {json}
*/
Project.prototype.fill = function( data )
{
    var copy = JSON.parse(data);
    this._json = copy._json;
    
    this._last_project_id = copy._last_project_id;
    this._last_measure_id = copy._last_measure_id;
    this._last_seg_measure_id = copy._last_seg_measure_id;
    this._last_area_measure_id = copy._last_area_measure_id;
    
    this._id = copy._id;
    this._user = copy._user;
    this._uid = copy._uid;
    this._description = copy._description;
    this._author = copy._author;
    this._location = copy._location;
    this._coordinates = copy._coordinates;
    this._render = copy._render;
    this._rotations = copy._rotations;
    this._mesh = copy._mesh;
    this._textures = copy._textures;
    this._anotations = copy._anotations;
    
    this._extra = copy._extra;
    this._meter = copy._meter;
    this._measures = copy._measures;
    this._segments = copy._segments;
    this._areas = copy._areas;
    this._auto_save = copy._auto_save;
}

// some projects events

$("#auto-save-btn").click(function(){
   
    var e = $(this);
    
    if(!project){
        console.error("no project");
        return 0;
    }
    
    if(!e.hasClass("auto-saving")){
        e.addClass("auto-saving");
        
        project._auto_save = true;
        project.save();
    }
    else{
        e.removeClass("auto-saving");
        project._auto_save = false;
        project.save();
    }
});

/**
* Annotation class to hold an annotation data
* @class Annotation
*/

function Annotation(id, camera, position, text)
{
	if(this.constructor !== Annotation)
		throw("You must use new to create a new annotation");
	this._ctor();
    if(id !== null)
        this.set(id, camera, position, text);
}

Annotation.prototype._ctor = function()
{
    this._id = -1;
    
	this._camera_position = vec3.create();
    this._camera_target = vec3.create();
    this._camera_up = vec3.create();
    
    this._position = vec3.create();
    
    this._text = "anot text";
}

Annotation.prototype.set = function(id, camera, position, text)
{
    this._id = id;
    
    for(var i in camera.position)
	   this._camera_position[i] = camera.position[i];
    for(var i in camera.target)
	   this._camera_target[i] = camera.target[i];
    for(var i in camera.up)
	   this._camera_up[i] = camera.up[i];
    
     for(var i in position)
	   this._position[i] = position[i];
    
    this._text = text;
}

/*
*  @class Annotation
*  @method FROM_JSON
*  - data: information about the annotation in JSON
*/
Annotation.prototype.FROM_JSON = function( data )
{
    data = data || {};
    
    this._id = data.id;
    
	this._camera_position = data.camera_position;
    this._camera_target = data.camera_target
    this._camera_up = data.camera_up
    
    this._position = data.position;
    
    this._text = data.text;
}

/*
*  @class Annotation
*  @method TO_JSON
*  return {object}
*/
Annotation.prototype.TO_JSON = function()
{
     return {
        "id": this._id,
        "camera_position": this._camera_position,
        "camera_target": this._camera_target,
        "camera_up": this._camera_up,
        "text": this._text,
        "position": {
            "0": this._position[0],
            "1": this._position[1],
            "2": this._position[2],
        }
    };
}
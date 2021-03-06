/**
* SceneIndication class return scene nodes as balls to 
* indicate distances configurations
* @class Indication
*/

function SceneIndication(o)
{
	if(this.constructor !== SceneIndication)
		throw("You must use new to create a new annotation");
    
    this.blink = function(dt)
    {
        this.time += dt;
        if(!this.active)
            this.color =  [0, 0.44, 0.78];
        else
            this.color = [Math.sin(this.time*5), 0.44 + Math.sin(this.time*5), 0.78 + Math.sin(this.time*5)];
    }
    
    if(o)
        this.configure(o);
}

SceneIndication.prototype.configure = function(o)
{
    var node = new RD.SceneNode({
        mesh: "sphere",
        layers: 0x4,
        opacity: 0.35,
        scaling: 1.35,
        color: [0, 0.44, 0.78]
	});
    
    node.blend_mode = RD.BLEND_ALPHA;
    node.render_priority = RD.PRIORITY_ALPHA;
    
    var node_inside = new RD.SceneNode({
        mesh: "sphere",
        layers: 0x4,
        color: [0, 0.44, 0.78],
        scaling: 0.6
	});
    
    node.addChild( node_inside );
    
    node.description = "config";
    this.node = node;
    this.node_inside = node_inside;
    
    var params = Object.keys(o);
    for(var i = 0, key; key = params[i]; ++i)
    {
        switch(key)
        {
            case "mesh":
                node.mesh = o[key];
                break;
            case "position":
                node.position = o[key];
                break;
            case "depth_test":
                node.flags.depth_test = o[key];
                break;
            case "id":
                node.id = o[key];
                break;
            case "color":
                node.color = o[key];
                break;
            case "type":
                if(o[key] == "view")
                    node.color = [0.258, 0.525, 0.956, 1]; 
                break;
            default:
                //special cases
                if(key == "onupdate")
                    continue;
                if(key == "scene")
                    continue;
                //normal cases
                node[key] = o[key];
                break;
        }
    }
    
    if(o.onupdate)
        node.update = this.blink;
    
    if(o.scene && GFX.scene)
        GFX.scene.root.addChild(node);
}

/*
*  @class SceneIndication
*  @prototype SceneIndication
*  returns the scene node created
*/
SceneIndication.prototype.ball = function(scene, position, options)
{
    var node = new RD.SceneNode({
		position: position,
		color: [0.3,0.8,0.1,1],
        layers: 0x4,
		mesh: "sphere"
	});
    
    node.description = "config";
    
    options = options || {};
    
    if(options && options.depth_test)
        node.flags.depth_test = options.depth_test;
        
    if(options && options.color)
        node.color = options.color;
        
    if(options && options.id)
        node.id = options.id;
    
    if(options && options.type)
        if(options.type == "view")
            node.color = [0.258, 0.525, 0.956,1];           
        
    if(scene !== null)
        scene.root.addChild(node);
    
    this.node = node;
}

/*
*  @class SceneIndication
*  @prototype grid
*  returns a scene node equal to a grid
*/
SceneIndication.prototype.grid = function(size, options)
{
    options = options || {};
    
    var grid = new RD.SceneNode();
    var grid_mesh = GL.Mesh.grid({size:size});
    GFX.renderer.meshes["grid"] = grid_mesh;
    grid.flags.visible = options.visible;
    grid.flags.ignore_collisions = true;
    grid.name = "grid";
    grid.mesh = "grid";
    grid.primitive = gl.LINES;
    grid.color = [0, 0, 0];
    grid.scale([50, 50, 50]);
    grid.opacity = 0.3;
    grid.blend_mode = RD.BLEND_ALPHA;
    
    if(options.position)
        grid.position = options.position;
    
    if(options.rotations){
        for(var i in options.rotations){
//            console.log("rotation");
            grid.rotate(options.rotations[i].angle, options.rotations[i].axis);
        }
        grid.updateMatrices();
    }
        
    this.node = grid;
}
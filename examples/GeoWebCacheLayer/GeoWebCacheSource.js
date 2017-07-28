function GeoWebCacheSource(options){
	var tileRoot=options.tileRoot;
	var format=options.format;
	var srid;
	switch(options.srid){
		case 'epsg:4326':
			srid='4326';
			break;
		case 'epsg:3857':
			srid='900913';
			break;
		case 'epsg:900913':
			srid='900913';
			break;
		case 'epsg:102100':
			srid='900913';
			break;	
		default:
			console.log('srid必须输入，支持4326与3857');
			break;
	} 
  var tileUrlFunction=function (xyz, obj1, obj2) {
		if (!xyz) 
			return "";		
		var z=xyz[0];
		var x=Math.abs(xyz[1]);
		var y=Math.abs(xyz[2]);
		var xyz_convert= convert_(z,x,y);
		x=xyz_convert[0];
		y=xyz_convert[1];
		z=xyz_convert[2];
		var shift = z / 2;
		var half = 2 << shift;
		var digits = 1;
		if (half > 10)
			digits = parseInt(Math.log(half)/Math.log(10)) + 1;
		var halfx = parseInt(x / half);
		var halfy = parseInt(y / half);
		x=parseInt(x);
		y=parseInt(y)+1;
		var url=tileRoot+"/EPSG_"+srid+"_"+padLeft_(2,z)+"/"+padLeft_(digits,halfx)+"_"+padLeft_(digits,halfy)+"/"+padLeft_(2*digits,x)+"_"+padLeft_(2*digits,y)+"."+format;
		return url;
	};
	return new ol.source.XYZ({
		tileUrlFunction:tileUrlFunction
	});
}


//字符截取
var padLeft_ = function(num, val) {
   return (new Array(num).join('0') + val).slice(-num);
};
//xy行列转换
var convert_=function(zoomLevel, x, y) {
	var extent = Math.pow(2, zoomLevel);
	if (x < 0 || x > extent - 1) {
		console.log("The X coordinate is not sane: " + x);
		return;
	}
	if (y < 0 || y > extent - 1) {
		console.log("The Y coordinate is not sane: " + y);
		return;
	}
	var gridLoc = [x, extent - y - 1, zoomLevel];
	return gridLoc;
}
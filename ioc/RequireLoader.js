define([
	"dojo/_base/declare",
	"./Util",
	"require"
], function(declare, Util, require){
	
	var RequireLoader = declare("ioc.RequireLoader", null, {
		// summary:
		//		Source code loader.
		
		load : function(/*String|Array*/scripts, /*Function?*/callback) {
			// summary:
			//		Loads a java script file.
			// 
			// scripts: 
			// 		A string or array of strings of java script files to load. 
			// callback: 
			// 		A callback to execute once all scripts have loaded
			
			if(typeof scripts === "string") {
				scripts = [ scripts ];
			}
			
			//exit early if no scripts to load
			if(scripts.length === 0) {
				if(typeof callback === "function") {
					callback.apply();
				}
				return;
			}
			
			require(scripts, function() {
				console.log("Loaded");
				if(typeof callback === "function") {
					callback.apply();
				}
			});
		}
	});
	
	return RequireLoader;
});
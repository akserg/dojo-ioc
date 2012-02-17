define([
	"doh/runner",
	"ioc/RequireLoader"
], function(doh, RequireLoader){
	doh.register("RequireLoaderTestCase",[
         {
        	 name : "RequireLoader_loadTest",
        	 requireLoader : null,
        	 setUp : function() {
        		 requireLoader = new RequireLoader();
        	 },
        	 runTest : function() {
        		 var dohDeferred = new doh.Deferred();
        		 
        		 requireLoader.load("ioc/RequireLoader",function(){
        			 dohDeferred.callback(true);
            	 });
        		 
        		 return dohDeferred;
        	 }
         }
    ]);
	
	doh.run();
});
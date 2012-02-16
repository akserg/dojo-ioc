define([
	"doh/runner",
	"ioc/RequireLoader"
], function(doh, RequireLoader){
	doh.register("RequireLoaderTestCase",[
         // RequireLoader load one script
         function RequireLoader_loadTest(){
        	 var requireLoader = new RequireLoader();
        	 requireLoader.load("ioc/RequireLoader",function(){
        		 doh.assertTrue(true);
        	 });
         },
         
         // RequireLoader load several script
         function RequireLoader_loadTest2(){
        	 var requireLoader = new RequireLoader();
        	 requireLoader.load(["ioc/RequireLoader", "ioc/RequireLoader"],function(){
        		 doh.assertTrue(true);
        	 });
         },
         
         {
        	 name : "RequireLoader_loadTest3",
        	 requireLoader : null,
        	 setUp : function() {
        		 console.log("setUp");
        		 requireLoader = new RequireLoader();
        	 },
        	 runTest : function() {
        		 console.log("runTest");
        		 var deferred = new doh.Deferred();
        		 setTimeout(deferred.getTestCallback(function(){
        			 requireLoader.load("ioc/RequireLoader",function(){
        				 deferred.resolved();
                	 });
        		 }), 100);
        	 }
         }
    ]);
	
	doh.run();
});
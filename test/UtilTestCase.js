define([
	"doh/runner",
	"ioc/Util"
], function(doh, Util){
	console.log("Util TestCase initialised");
	
	doh.register("UtilTestCase",[
         // Util.isArray
         function(){ doh.assertTrue(Util.isArray([1, 2])); },
         function(){ doh.assertFalse(Util.isArray(1, 2)); },
         // Util.inArray
         function(){ doh.assertTrue(Util.inArray(1, [1, 2]) === 0); },
         function(){ doh.assertFalse(Util.inArray(3, [1, 2]) !== -1); },
         // Util.getDojoObject
         function(){
        	 var obj = {description : {name:"Test name"}};
        	 doh.assertTrue(Util.getDojoObject("description.name", obj) === "Test name");
         }
    ]);
	
	doh.run();
});
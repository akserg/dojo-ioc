define([
	"doh/runner",
	"ioc/ObjectFactory"
], function(doh, ObjectFactory){
	doh.register("ObjectFactoryTestCase",[
        {
     	 	name : "ObjectFactory_getObjectTest",
     	 	objectFactory : null,
     	 	setUp : function() {
     	 		
     	 		var def = {
     	 			"name" : "Mickle",
     	 			"numInt" : 10,
     	 			"numFloat" : 3.141567,
     	 			"date" : new Date("31/12/2012").getTime(),
     	 			"array" : ["1", 2, true]
     	 		};
     	 		
     		 	objectFactory = new ObjectFactory(def);
     	 	},
     	 	runTest : function() {
   		 		doh.assertEqual(objectFactory.getObject("name"), "Mickle");
   		 		doh.assertEqual(objectFactory.getObject("numInt"), 10);
   		 		doh.assertEqual(objectFactory.getObject("numFloat"), 3.141567);
   		 		doh.assertEqual(objectFactory.getObject("date"), new Date("31/12/2012").getTime());
   		 		doh.assertEqual(objectFactory.getObject("array").length, 3);
   		 		doh.assertEqual(objectFactory.getObject("array")[2], true);
     	 	}
    	}
    ]);
	
	doh.run();
});

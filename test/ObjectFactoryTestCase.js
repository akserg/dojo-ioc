define([
	"doh/runner",
	"dojo/_base/declare",
	"ioc/ObjectFactory"
], function(doh, declare, ObjectFactory){
	doh.register("ObjectFactoryTestCase",[
        {
     	 	name : "ObjectFactory_getObjectTest",
     	 	objectFactory : null,
     	 	setUp : function() {
     	 		
     	 		declare("TestPostInitClazz", null, {
     	 			name : null,
     	 			
     	 			constructor : function(newname) {
     	 				this.name = newname;
     	 			},
     	 			
     	 			postInit : function () {
     	 				console.log('postInit has executed');
     	 				this.name = "Changed";
     	 			}
     	 		});
     	 		
     	 		declare("TestPostInitRenamedClazz", null, {
     	 			name : null,
     	 			
     	 			constructor : function(newname) {
     	 				this.name = newname;
     	 			},
     	 			
     	 			postInit2 : function () {
     	 				console.log('postInit2 has executed');
     	 				this.name = "Changed2";
     	 			}
     	 		});
     	 		
     	 		declare("TestPostInitComplexClazz", null, {
     	 			name : null,
     	 			link : null,
     	 			
     	 			constructor : function(newname) {
     	 				this.name = newname;
     	 			},
     	 			
     	 			postInit3 : function (otherName) {
     	 				console.log('postInit3 has executed');
     	 				this.name = otherName;
     	 			}
     	 		});
     	 		
     	 		declare("TestRefClazz", null, {
     	 			name : null
     	 		});
     	 		
     	 		var def = {
     	 			name : "Mickle",
     	 			numInt : 10,
     	 			numFloat : 3.141567,
     	 			date : new Date("31/12/2012").getTime(),
     	 			array : ["1", 2, true],
     	 			
     	 			postInitTest : {
     	 				type : "TestPostInitClazz",
     	 				args : ["New Name"]
     	 			},
     	 			
     	 			postInitRenamedTest : {
     	 				type : "TestPostInitRenamedClazz",
     	 				args : ["New Name"],
     	 				postInit : "postInit2"
     	 			},
     	 			
     	 			testPostInitComplexClazz : {
     	 				type : "TestPostInitComplexClazz",
     	 				args : ["*postInitRenamedTest.name"],
     	 				props : {
     	 					link : "*postInitTest"
     	 				},
     	 				postInit : {
     	 					name : "postInit3",
     	 					args : ["Changed3"]
     	 				}
     	 			},
     	 			
     	 			testRefClazz : {
     	 				type : "TestRefClazz",
     	 				props : {
     	 					name : "*testPostInitComplexClazz.link.name"
     	 				}
     	 			}
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
   		 		doh.assertEqual(objectFactory.getObject("postInitTest").name, "Changed");
   		 		doh.assertEqual(objectFactory.getObject("postInitRenamedTest").name, "Changed2");
   		 		doh.assertEqual(objectFactory.getObject("testPostInitComplexClazz").name, "Changed3");
   		 		doh.assertEqual(objectFactory.getObject("testRefClazz").name, "Changed");
     	 	}
    	}
    ]);
	
	doh.run();
});

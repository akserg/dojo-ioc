define([
	"doh/runner",
	"ioc/Util"
], function(doh, Util){
	doh.register("UtilTestCase",[
         // Util.inArray
         function Util_inArrayTest(){ doh.assertTrue(Util.inArray(1, [1, 2]) === 0); },
         function Util_inArrayTest2(){ doh.assertFalse(Util.inArray(3, [1, 2]) !== -1); },
         // Util.getDojoObject
         function Util_getDojoObjectTest(){
        	 var obj = {description : {name:"Test name"}};
        	 doh.assertTrue(Util.getDojoObject("description.name", obj) === "Test name");
         }
    ]);
	
	doh.run();
});
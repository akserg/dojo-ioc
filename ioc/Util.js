define([
	"dojo/_base/lang"
], function(lang){
	
	function Util() {
		// summary:
		//		Static utility class.
		// tags:
		//		public static
	};
	
	Util.isArray = function(/*Object*/obj) {
		// summary:
		//		Strict check to see if an object is an array.
		// tags:
		//		public static
		// obj:
		// 		Any type to check
		// returns:Boolean
		// 		Result of check

		return Array.isArray(obj) || Object.prototype.toString.call(obj) === "[object Array]";
	};

	Util.inArray = function(/*Object*/elem, /*Array*/array) {
		// summary:
		//		Check is element in array
		// tags:
		//		public static
		// elem:
		// 		Any type to check
		// array:
		// 		Array where we search any type
		// returns:Number
		// 		Found index of element or -1 

		if(array.indexOf) {
			return array.indexOf(elem);
		}

		for( var i = 0, length = array.length; i < length; i++) {
			if(array[i] === elem) {
				return i;
			}
		}

		return -1;
	};
	
	Util.getDojoObject = function(/*String*/propPath, /*Object?*/context) {
		// summary:
		//		Find and return object in path.
		// tags:
		//		public static
		// propPath:
		// 		Path to search
		// context:
		//		Context where dojo will search properties from propPath
		// returns:Object|null
		// 		Found object or null

		var obj = lang.getObject(propPath, false, context);
		return typeof obj === "undefined" ? null : obj;
	};
	
	return Util;
});
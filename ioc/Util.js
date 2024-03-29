define([
	"dojo/_base/lang"
], function(lang){
	
	function Util() {
		// summary:
		//		Static utility class.
		// tags:
		//		public static
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
	
	Util.checkPrimitiveType = function(metadata/*Primitives|Object*/) {
		// summary:
		//		If metadata contains primitive class definition - update it accordingly.
		// tag:
		//		private
		// metadata:
		//		Standard Object definition or primitives
		var result = null;
		if (lang.isString(metadata)) {
			// Simple string
			result = { type : "String", args : [metadata]};
		} else if (typeof metadata === "number") {
			// Simple number
			result = { type : "Number", args : [metadata]};
		} else if (metadata instanceof Date) {
			// Simple date
			result = { type : "Date", args : [metadata]};
		} else if (dojo.isArray(metadata)) {
			// Simple array
			result = { type : "Array", args : metadata};
		} else if (typeof metadata === 'boolean') {
			// Simple array
			result = { type : "Boolean", args : metadata};
		}
		
		return result ? result : metadata;
	};
	
	Util.getRefDef = function(id/*string*/)/*string*/ {
		// summary:
		//		Convert id to object with ref and prop properties
		// tag:
		//		public
		// id:Object|String
		//		Object or string contains reference definition info.
		// returns:Object
		//		id converted to Object with "ref" and "prop" properties
		var res = {};
		var ids = id.split(".");
		if (ids.length > 0) {
			res.ref = ids[0];
			// If ids has more items means it contains properties
			if (ids.length > 1) {
				// Remove first element of array contains id
				ids.shift();
				// Joint left items of array
				res.prop = ids.join(".");
			}
		} else {
			res.ref = id;
		}
		return res;
	};
	
	return Util;
});
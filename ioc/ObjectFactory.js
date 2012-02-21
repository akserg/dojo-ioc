define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"./Util"
], function(declare, lang, Util){

	/**
	 * ObjectFactory instantiate definition through "getObject" method.
	 */
	var ObjectFactory = declare("ioc.ObjectFactory", null, {

		/**
		 * Objects Definition map
		 */
		_definitions : null,
		
		constructor : function/*Object?*/(definitions) {
			// summary:
			//		ObjectFactory instantiate definitions through "getObject" method.
			// tags:
			//		constructor
			// definitions:
			//		Objects Definition map
			this.updateDefinitions(definitions);
		},
		
		updateDefinitions : function (/*Object?*/definitions) {
			//summary:
			//		Update Objects Definition map.
			// tags:
			//		public
			// definitions:
			//		Objects Definition map
			this._definitions = definitions || {};
		},
		
		getObject : function(/*String*/id) {
			// summary:
			//		Gets an instance of a definition.
			// tags:
			//		public
			// id:
			//		Definition identifier
			// returns:
			//		Definition instance return in scope (singleton or prototype)
			// metadata:Object
			//		Keeps found definition information.
			// instance:Function
			//		Instance of definition
			
			console.debug("Getting definition for ", id, "...");
			
			var instance = null;
			
			var metadata = this.getById(id);
			
			metadata = this._checkPrimitiveType(metadata);
			
			if (metadata) {
				if (!metadata.scope) {
					// Set prototype scope by default
					metadata.scope = "prototype";
				}
				// Check our scope
				if (metadata.scope === "singleton") {
					// Check has instance been instantiated
					if (metadata.instance) {
						// Just return it
						console.debug("Singleton instance already exists for ", id);
						instance = metadata.instance;
					} else {
						console.debug("Creating new singleton instance for ", id, "...");
						// Create new one
						instance = this._createInstance(metadata.type, metadata.args, metadata.props, metadata.extendsRef);
						// Save for future using
						metadata.instance = instance;
					}
				} else {
					// Just create new instance
					console.debug("Creating new instance for ", id, "...");
					instance = this._createInstance(metadata.type, metadata.args, metadata.props, metadata.extendsRef);
				}
				// Run 'postInit' feature
				if (metadata.postInit) {
					var postInitName = null;
					var postInitArgs = null;
					// Process special 'postInit' structure
					if (lang.isString(metadata.postInit)) {
						// metadata.postInit is string - use as is
						postInitName = metadata.postInit;
					} else {
						// 'postInit' is object and it must has 'name' and 'args' properties
						if (metadata.postInit['name'] && metadata.postInit['args']) {
							// Name of method
							postInitName = metadata.postInit['name'];
							// Create arguments for 'postInit'
							postInitArgs = this._createArgs(metadata.postInit['args']);
						} else {
							throw new Error('Incorrect definition of postInit function in ' + metadata.type);
						}
					}
					if (instance[postInitName] && dojo.isFunction(instance[postInitName])) {
						instance[postInitName].apply(instance, postInitArgs);
					}
				} else if (instance['postInit'] && dojo.isFunction(instance['postInit'])) {
					// Call 'postInit' method in instance
					instance['postInit'].apply(instance, null);
				}
			}			
			return instance;
		},
		
		_checkPrimitiveType : function(metadata/*Primitives|Object*/) {
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
		},
		
		_createInstance : function(/*String|Object*/type, /*Array?*/argData, /*Object?*/propData, /*String?*/extendsRef) {
			// summary:
			//		Uses factory definitions to create a new instance.
			// tags:
			//		private
			// type:
			// 		Class name or function
			// argData:
			// 		Array of arguments
			// propData:
			// 		Map of properties.
			// extendsRef:
			// 		Definition identifier which instance will be used to like super class.
			// 		TODO: Must be array of definitions for mixins.
			// returns:
			// 		Instance of class created with arguments, filled with properties and extended with super class.
			//
			// instance:Function
			//		Instance of definition

			
			var instance = null;
			
			if(typeof type === "string") {
				type = Util.getDojoObject(type);
			}
			
			// constructor injection
			var args = this._createArgs(argData);
			
			// inheritance
			if(extendsRef) {
				this._prepareTypeToExtension(type, this.getObject(extendsRef));
			}

			instance = type.apply(this, args);
			
			// property injection
			if(propData) {
				for( var propName in propData) {
					if(propData.hasOwnProperty(propName)) {
						var propertyArgs = this._createArgs([ propData[propName] ]);

						if(typeof instance[propName] === "function") {
							instance[propName].apply(instance, propertyArgs[0]);
						} else {
							instance[propName] = propertyArgs[0];
						}
					}
				}
			}

			return instance;
		},
		
		_createInstanceFromFactory : function(/*String*/factoryRef, /*String|Function*/factoryMethod) {
			// summary:
			//		Uses factory definitions to create a new instance.
			// tags:
			//		private
			// factoryRef:
			// 		Definition identifier used to factory class.
			// factoryMethod:
			// 		Factory method or property name.
			// returns:
			// 		Result return from factory class.
			//
			// factory:
			//		Factory instance found by factoryRef.

			var factory = this.getObject(factoryRef);

			if(factoryMethod) {
				if (typeof factoryMethod === "function") {
					return factory[factoryMethod].apply(factory);
				} else {
					return factory[factoryMethod];
				}
				
			} else {
				throw new Error("No factory method defined with " + factoryRef);
			}
		},
		
		_createArgs : function(/*Array?*/defArgs) {
			// summary:
			//		Scans arg definitions for values, generating definitions where required
			// tags:
			//		private
			// defArgs:
			// 		Array of arguments
			// returns:Array
			// 		Array of arguments with injected definitions where required

			// figure out constructors
			var args = [];
			if(defArgs) {
				for( var i = 0; i < defArgs.length; i++) {
					var argData = defArgs[i];

					// easier to deal with nulls here)
					if(argData === null || typeof argData === "undefined") {
						args[i] = argData;
						continue;
					}

					var isObject = typeof argData === "object";

					// if arg has ref
					if((isObject && argData.ref) || (typeof argData === "string" && argData.match(/^\*[^\*]/) !== null)) {
						// 'ref' specifying or argData is string with '*' letter (means reference to definition in configuration)
						// So we take 'ref' either definition id after '*' letter
						args[i] = this.getObject(argData.ref || argData.substr(1));
						// If we specifying 'ref' and 'prop' - find property and use it instead of referenced definition 
						if (argData.ref && argData.prop) {
							// Dive into object properties path
							args[i] = Util.getDojoObject(argData.prop, args[i]);
						}
					} else if(isObject && argData.factoryRef) {
						// 'factoryRef' specifying
						args[i] = this._createInstanceFromFactory(argData.factoryRef, argData.factoryMethod);
					} else if(isObject && argData.type) {
						// 'type' specifying
						args[i] = this._createInstance(argData.type, argData.args, argData.props);
					} else if(isObject) {
						// nothing specifying - just create object
						args[i] = {};
						// if arg is object containing values
						for( var key in argData) {
							if(argData.hasOwnProperty(key)) {
								var obj = argData[key];

								if(obj && (obj.ref || (typeof obj === "string" && obj.match(/^\*[^\*]/) !== null))) {
									// 'ref' specifying or obj is string with '*' letter (means reference to definition in configuration)
									// So we take 'ref' either definition id after '*' letter
									args[i][key] = this.getObject(obj.ref || obj.substr(1));
									if (obj.prop && typeof obj.prop === "string") {
										// Dive into object properties path
										args[i][key] = Util.getDojoObject(obj.prop, args[i][key]);
									}
								} else if(obj && obj.factoryRef) {
									// 'factoryRef' specifying
									args[i][key] = this._createInstanceFromFactory(obj.factoryRef, obj.factoryMethod);
								} else if(obj && obj.type) {
									// 'type' specifying
									args[i][key] = this._createInstance(obj.type, obj.args, obj.props);
								} else {
									// Use object as is
									args[i][key] = obj;
								}
							}
						}
					} else {
						// just a value
						args[i] = argData;
					}
				}
			}
			return args;
		},
		
		_prepareTypeToExtension : function(/*Function*/type, /*Function*/superType) {
			// summary:
			//		Extend class with super class
			// tags:
			//		private
			// type:
			// 		Constructor function
			// superType:
			// 		Super class constructor function
			//
			// methods:Object
			//		All methods found in class prototype to be saved to override methods from super class


			// backup methods/props
			var methods = {};
			for( var method in type.prototype) {
				methods[method] = type.prototype[method];
			}

			// extend prototype
			type.prototype = superType;
			type.prototype._super = superType.constructor;

			// put methods back
			for( var methodBackup in methods) {
				type.prototype[methodBackup] = methods[methodBackup];
			}

			// fix the constructor
			type.prototype.constructor = type;
		},
		
		getById : function(/*String*/id) {
			// summary:
			//		Searches the definitions for a type matching the specified id
			// tags:
			//		public
			// id:
			// 		Class name
			// returns:Object|null
			// 		Found definition or error.

			if (this._definitions.hasOwnProperty(id)) {
				return this._definitions[id];
			} else {
				throw new Error("No type is defined for " + id);
			}
		}
	});
	
	return ObjectFactory;
});
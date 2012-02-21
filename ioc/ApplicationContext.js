define([
	"dojo/_base/declare",
	"dojo/_base/lang", // For hitch
	"dojo/_base/Deferred",
	"./ObjectFactory",
	"./RequireLoader",
	"./Util"
], function(declare, lang, Deferred, ObjectFactory, RequireLoader, Util){
	
	var ApplicationContext = declare("ioc.ApplicationContext", null, {
		// _definitions:Object
		//		Objects Definition map
		_definitions : {}, 
		// objectFactory:Object
		//		Instance of Object factory
		objectFactory : null,
		// loader:Object
		//		Instance of Class loader
		loader : null,
		// async:Boolean
		//		Flag shows async mode comes from dojoConfig or djConfig
		async : false,
		
		constructor : function(/*Object|Array?*/definitions) {
			// summary:
			//		ApplicationContext helps to instantiate and return instances of definitions.
			// description:
			//		ApplicationContext keeps all definitions and instantiate them with Object factory.
			// definitions:
			//		Objects Definition map

			this.addDefinitions(definitions);
			this.objectFactory = new ObjectFactory(this._definitions);
			this.loader = new RequireLoader();
			// Check our current mode (asynchronous or synchronous)
			var cfg = dojoConfig || djConfig || null;
			if (cfg) {
				this.async = cfg.async;
			}
			console.debug('async: ' + this.async);
		},
		
		getObject : function(/*...*/) {
			// summary:
			//		Gets an instance of a dependency using the specified identifiers.
			// tags:
			//		public
			// ids: String
			//		Commas separated identifier of requested components.
			// defs:Array
			//		Keeps all found definitions.
			// sources:Array
			//		Keeps converted to path module names
			
			// Turn arguments list in to array of definition identifiers
			var ids = Array.prototype.slice.call(arguments, 0);
			
			console.log("Getting definitions for (" + ids.join(", ") + ")");
			
			// Walk through to get array of definitions so they can be loaded if required
			var defs = [];
			for( var i = 0; i < ids.length; i++) {
				defs = defs.concat(this._getDefinitions(ids[i]));
			}
			
			// Convert definitions into source files
			var sources = [];
			for( var j = 0; j < defs.length; j++) {
				if(!Util.getDojoObject(defs[j])) {
					var src = this._sourcePathResolver(defs[j]);
					if(Util.inArray(src, sources) === -1) {
						sources.push(src);
					}
				}			
			}
			
			// Depends on mode we will return either Deferred instance for asynchronous mode
			// or instance of requested objects
			if (this.async) {
				// Create Deferred object for managing our promise situation 
				var def = new Deferred();
				
				// Load all modules
				this.loader.load(sources, lang.hitch(this, function(){
					var modules = [];
					for( var j = 0; j < ids.length; j++) {
						var module = this.objectFactory.getObject(ids[j]);
						module._appContext = this;						
						modules.push(module);
					}
	
					def.resolve.apply(this, modules);
				})); 
				
				return def;
			} else {
				var modules = [];
				// Load all modules in synchronous mode
				this.loader.load(sources, lang.hitch(this, function(){
					
					for( var j = 0; j < ids.length; j++) {
						var module = this.objectFactory.getObject(ids[j]);
						module._appContext = this;						
						modules.push(module);
					}

				}));
				
				if (modules.length > 1) {
					return modules;
				} else if (modules.length == 1) {
					return modules[0];
				} else {
					return null;
				}

			}
		},
		
		_sourcePathResolver : function(/*String*/value) {
			// summary:
			//		Return correct path from class name
			// tags:
			//		private
			// value:String
			//		Full class name.
			// return:String
			//		Converted to path full class name.
			value = value || "";
			return value.replace(/\./g, "/");
		},

		addDefinitions : function(/*Object|Array*/defs) {
			// summary:
			//		Add definitions to current set. Name Duplicate Violation will generate if name duplicate will be found.
			// tags:
			//		public
			// defs:
			//		Map or Array of Maps of definitions to add.
			
			if (!Util.isArray(defs)) {
				defs = [defs];
			}
			
			for (var i in defs) {
				for (id in defs[i]) {
					if (this._definitions[id]) {
						console.err("Name Duplicate Violation. Found duplicate definition with id '" + id + "' has been ignored.");
					} else {
						this._definitions[id] = defs[i][id];
					}
				}
			}
		},
		
		_getDefinitions : function(/*String*/id, /*Array?*/defs) {
			// summary:
			//		Find and add all definitions to definitions array.
			// tags:
			//		private
			// id:
			//		Object identifier.
			// defs:
			//		Array of Objects Definition map.
			// returns:Array
			//		Updated array of Objects Definition map.

			defs = defs || [];
			var metadata = this.objectFactory.getById(id);

			metadata = Util.checkPrimitiveType(metadata);
			
			// metadata has next properties:
			// type - class name
			// extendsRef - pointer to super class
			// args - set of arguments to instantiate class by name
			// props - map with properties
			
			defs.push(metadata.type);

			// inheritance - find superclass
			if(metadata.extendsRef) {
				defs = this._getDefinitions(metadata.extendsRef, defs);
			}

			// Check constructor arguments to find other references
			if(metadata.args) {
				defs = this._getDefinitionsFromArgs(metadata.args, defs);
			}

			// Check properties as well
			if(metadata.props) {
				for( var propName in metadata.props) {
					if(metadata.props.hasOwnProperty(propName)) {
						defs = this._getDefinitionsFromArgs([ metadata.props[propName] ], defs);
					}
				}
			}

			return defs;
		},
		
		_getDefinitionsFromArgs : function(/*Array*/defArgs, /*Array*/defs) {
			// summary:
			//		Gets an array of definitions from arguments definitions.
			// tags:
			//		private
			// defArgs:
			//		Array of arguments to search references to definitions.
			// defs:
			//		Array of Objects Definition map.
			// returns: Array
			//		Updated array of Objects Definition map

			if(defArgs) {
				for( var i = 0; i < defArgs.length; i++) {
					var argData = defArgs[i];

					// easier to deal with nulls here)
					if(argData === null || typeof argData === "undefined") {
						continue;
					}

					var isObject = typeof argData === "object";
					// if arg has ref
					if((isObject && argData.ref) || (typeof argData === "string" && argData.match(/^\*[^\*]/) !== null)) {
						defs = this._getDefinitions(argData.ref || argData.substr(1), defs);
					}
					else if(isObject && argData.factoryRef) {
						defs = this._getDefinitions(argData.factoryRef, defs);
					}
					else if(isObject && argData.type) {
						defs.push(argData.type);
					}
					else if(isObject) {
						// if arg is object containing values
						for( var key in argData) {
							if(argData.hasOwnProperty(key)) {
								var obj = argData[key];
								if(obj && (obj.ref || (typeof obj === "string" && obj.match(/^\*[^\*]/) !== null))) {
									defs = this._getDefinitions(obj.ref || obj.substr(1), defs);
								}
								else if(obj && obj.factoryRef) {
									defs = this._getDefinitions(obj.factoryRef, defs);
								}
								else if(obj && obj.type) {
									defs.push(obj.type);
								}
							}
						}
					}
				}
			}
			return defs;
		}
	});
	
	return ApplicationContext;
});
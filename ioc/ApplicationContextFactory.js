define([
	"./ApplicationContext"
], function(ApplicationContext){
	
	function ApplicationContextFactory() {
		// summary:
		//		Create new ApplicationContextFactory.
		// description:
		//		Internally check instance and generate Singleton Violation Error.
		// tags:
		//		constructor public
		// _instance:ApplicationContext
		//		Private static variable keeps instance

		if (ApplicationContextFactory._instance) {
			throw Error("Singleton violation.\nPlease use ApplicationContextFactory.getInstance() instead of create new instance of ApplicationContextFactory.");
		}
	};
	
	ApplicationContextFactory._instance = null;
	
	ApplicationContextFactory.getInstance = function(/*Object|Array*/definitions) {
		// summary:
		//		Static function return instance of ApplicationContext.
		// tags:
		//		public static
		// definitions:
		//		Create or just return ApplicationContext instance. If 'definitions' argument specifying
		//		it will use as Objects Definition map or array of Objects Definition maps to register new definitions.
		// returns:ApplicationContext
		//		The ApplicationContext instance
		if (!ApplicationContextFactory._instance) {
			ApplicationContextFactory._instance = new ApplicationContext(definitions);
		} else if (definitions) {
			ApplicationContextFactory._instance.addDefinitions(definitions);
		}
		return ApplicationContextFactory._instance;
	};
	
	ApplicationContextFactory.registerDefinitions = function(/*Object|Array*/definitions) {
		// summary:
		//		Register new Objects Definition map
		// tags:
		//		public static
		// definitions:
		//		Objects Definition map or array of Objects Definition maps
		ApplicationContextFactory.getInstance(definitions);
	};
	
	return ApplicationContextFactory;
});
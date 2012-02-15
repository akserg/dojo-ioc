var dojoConfig = {
    baseUrl: "./",
    async: true,
    isDebug: true,
    tlmSiblingOfDojo: false,
    locale: "en-us",
    aliases: [
        ["domReady", "dojo/domReady"]
    ],
    packages: [
        // Dojo stuff
        { name: "dojo", location: "lib/dojo" },
        { name: "dijit", location: "lib/dijit" },
        { name: "dojox", location: "lib/dojox" },
        { name: "doh", location: "lib/util/doh" },
        { name: "ioc", location: "../ioc" },

        // Portal stuff
        { name: "test", location: "" },
    ],
    deps: ["TestLoader"]
};

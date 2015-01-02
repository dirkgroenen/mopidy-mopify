angular.module("mopify.services.servicemanager", [
    "LocalStorageModule"
])

.factory("ServiceManager", function($rootScope, localStorageService){
    "use strict";

    var rootkey = "settings";

    function ServiceManager(){
        this.availableServices = [
            {
                name: "Spotify",
                description: "Search and manage playlists and get the latests charts",
                image: "http://icons.iconarchive.com/icons/danleech/simple/256/spotify-icon.png"
            },
            /*{
                name: "Facebook",
                description: "Get more music based on your Facebook likes.",
                image: "http://www.ednfoundation.org/wp-content/uploads/facebook-logo-square.png",
                connected: ($scope.connectedServices !== null) ? $scope.connectedServices.facebook : false
            }*/
        ];

       this.initializeSavedObject();
    }

    ServiceManager.prototype.initializeSavedObject = function(){
        var that = this;
        var trackedservices = localStorageService.get("services");

        if(trackedservices === null){
            trackedservices = {};
        }

        for(var x = 0; x < that.availableServices.length; x++){
            var service = that.availableServices[x];
            var servicename = service.name.replace(" ", "").toLowerCase();

            if(trackedservices[servicename] === undefined)
                trackedservices[servicename] = false;
        }

        localStorageService.set("services", trackedservices);
    };

    ServiceManager.prototype.getAvailableServices = function() {
        return this.availableServices;
    };

    ServiceManager.prototype.getEnabledServices = function() {
        return localStorageService.get("services");
    };

    ServiceManager.prototype.enableService = function(service) {
        var servicename = service.name.replace(" ", "").toLowerCase();
        var services = localStorageService.get("services");

        services[servicename] = true;

        localStorageService.set("services", services);

        $rootScope.$broadcast("mopify:services:enabled", service);
    };

    ServiceManager.prototype.disableService = function(service) {
        var servicename = service.name.replace(" ", "").toLowerCase();
        var services = localStorageService.get("services");

        services[servicename] = false;

        localStorageService.set("services", services);
        
        $rootScope.$broadcast("mopify:services:disabled", service);
    };    

    ServiceManager.prototype.isEnabled = function(service) {
        var servicename = (typeof service === "string") ? service.replace(" ", "").toLowerCase() : service.name.replace(" ", "").toLowerCase();
        return localStorageService.get("services")[servicename];
    };


    return new ServiceManager();
});
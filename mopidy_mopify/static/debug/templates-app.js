angular.module('templates-app', ['account/menu.tmpl.html', 'account/services/facebook/menu.tmpl.html', 'account/services/services.menu.tmpl.html', 'account/services/services.tmpl.html', 'account/services/spotify/menu.tmpl.html', 'account/services/spotify/spotify.tmpl.html', 'account/services/sync/menu.tmpl.html', 'account/services/sync/sync.tmpl.html', 'account/services/tasteprofile/menu.tmpl.html', 'account/services/tasteprofile/tasteprofile.tmpl.html', 'account/settings/settings.tmpl.html', 'dashboard/dashboard.tmpl.html', 'directives/album.directive.tmpl.html', 'directives/artist.directive.tmpl.html', 'directives/browse.directive.tmpl.html', 'directives/playlist.directive.tmpl.html', 'directives/service.directive.tmpl.html', 'directives/station.directive.tmpl.html', 'directives/track.directive.tmpl.html', 'discover/browse/browse.tmpl.html', 'discover/featured/featured.tmpl.html', 'discover/menu.tmpl.html', 'discover/newreleases/newreleases.tmpl.html', 'modals/playlistselect.tmpl.html', 'music/artist/artist.tmpl.html', 'music/library/albums/albums.tmpl.html', 'music/library/artists/artists.tmpl.html', 'music/library/playlists/playlists.tmpl.html', 'music/menu.tmpl.html', 'music/stations/stations.tmpl.html', 'music/tracklist/tracklist.tmpl.html', 'player/controls/controls.left.tmpl.html', 'player/controls/controls.right.tmpl.html', 'player/player.tmpl.html', 'player/seekbar/seekbar.tmpl.html', 'search/menu.tmpl.html', 'search/search.tmpl.html']);

angular.module("account/menu.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("account/menu.tmpl.html",
    "<div class=\"block row\" id=\"yourmusic\">\n" +
    "    <div class=\"title\">Account</div>\n" +
    "    <div class=\"content\">\n" +
    "        <ul>\n" +
    "            <li><a href=\"#/account/settings\">Settings</a></li>\n" +
    "            <li><a href=\"#/account/services\">Services</a></li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("account/services/facebook/menu.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("account/services/facebook/menu.tmpl.html",
    "<section id=\"spotifyuser\" class=\"account\" ng-controller=\"FacebookMenuController\">\n" +
    "    <div class=\"profileimage\">\n" +
    "        <img ng-src=\"{{ userProfile.profile_image }}\" />\n" +
    "    </div>\n" +
    "    <div class=\"content\">\n" +
    "        <span class=\"username\" ng-show=\"authorized\">\n" +
    "            {{ userProfile.first_name }} {{ userProfile.last_name }}\n" +
    "        </span>\n" +
    "        <span class=\"username\" ng-hide=\"authorized\">\n" +
    "        Connecting...\n" +
    "        </span>\n" +
    "        <span class=\"status\">\n" +
    "            <div class=\"connection\" ng-class=\"authorized == true ? 'connected' : 'disconnected'\"></div> {{ authorized == true ? 'connected' : 'disconnected' }} - Facebook\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</section>");
}]);

angular.module("account/services/services.menu.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("account/services/services.menu.tmpl.html",
    "<div id=\"accounts\" ng-controller=\"AccountServicesMenuController\" ng-class=\"(connectedCount > 2) ? 'small' : ''\">\n" +
    "    <div class=\"title\"><a href=\"#/account/services\">Connected services</a></div>\n" +
    "\n" +
    "    <ng-include ng-if=\"connectedServices.spotify\" src=\"'account/services/spotify/menu.tmpl.html'\"></ng-include>\n" +
    "    <ng-include ng-if=\"connectedServices.facebook\" src=\"'account/services/facebook/menu.tmpl.html'\"></ng-include>\n" +
    "    <ng-include ng-if=\"connectedServices.tasteprofile\" src=\"'account/services/tasteprofile/menu.tmpl.html'\"></ng-include>\n" +
    "    <ng-include ng-if=\"connectedServices.sync\" src=\"'account/services/sync/menu.tmpl.html'\"></ng-include>\n" +
    "\n" +
    "    <div ng-if=\"!hasServicesConnected\">\n" +
    "        <div class=\"notify\"><a href=\"#/account/services\">You have no connected services. Click here to connect a service.</a></div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("account/services/services.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("account/services/services.tmpl.html",
    "<div id=\"header\" class=\"small row\" style=\"background-image: url('./assets/images/services-header.jpg');\">\n" +
    "    <div class=\"col-md-10 lefttext\">\n" +
    "        <div class=\"inner\"><i class=\"ss-icon ss-merge\"></i>  Services</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            services </span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 col-md-offset-3 alignright\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row note\">\n" +
    "        <div class=\"col-md-10\">\n" +
    "            <p>Note: browsers are likely to block the login popups. Please enable popups from this domain to prevent the browser from blocking them.</p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div id=\"tileview\">\n" +
    "            <div class=\"row\">\n" +
    "                <div ng-repeat=\"service in availableServices\"> \n" +
    "                    <mopify-service service=\"service\" class=\"col-lg-2 col-md-3 col-sm-4 col-xs-6 single-tile service\"></mopify-service>\n" +
    "                    <div ng-if=\"($index + 1) % 6 == 0\" class=\"row\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("account/services/spotify/menu.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("account/services/spotify/menu.tmpl.html",
    "<section id=\"spotifyuser\" class=\"account\" ng-controller=\"SpotifyMenuController\">\n" +
    "    <div class=\"profileimage\">\n" +
    "        <img src=\"./assets/images/spotify-icon.png\" ng-src=\"{{ userProfile.images[0].url }}\" />\n" +
    "    </div>\n" +
    "    <div class=\"content\">\n" +
    "        <span class=\"username\" ng-show=\"authorized\">\n" +
    "            {{ userProfile.display_name || userProfile.id }}\n" +
    "        </span>\n" +
    "        <span class=\"username\" ng-hide=\"authorized\">\n" +
    "        Connecting...\n" +
    "        </span>\n" +
    "        <span class=\"status\">\n" +
    "            <div class=\"connection\" ng-class=\"authorized == true ? 'connected' : 'disconnected'\"></div> {{ authorized == true ? 'connected' : 'disconnected' }} - Spotify\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</section>");
}]);

angular.module("account/services/spotify/spotify.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("account/services/spotify/spotify.tmpl.html",
    "<div id=\"header\" class=\"small row\" style=\"background-image: url('./assets/images/spotify-header.jpg');\">\n" +
    "    <div class=\"col-md-10 lefttext\">\n" +
    "        <div class=\"inner\"><i class=\"ss-icon ss-settings\"></i>  Settings</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Service <span class=\"sub\">Spotify</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label>Description</label>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-8\">\n" +
    "                <p>The Spotify service adds extra features like Featured Playlists, New Releases and managing playlists.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Settings <span class=\"sub\">Spotify</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label>Use Spotify as playlist source</label>\n" +
    "            </div>\n" +
    "            <div class=\"input col-md-4\">\n" +
    "                <toggle-switch ng-model=\"settings.spotify.loadspotifyplaylists\"><toggle-switch>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-4 col-md-offset-1\">\n" +
    "                <p>When enabled playlists will be loaded from your connected Spotify account instead of Mopidy. The playlist folder structure won't be visible when this option is enabled.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Account <span class=\"sub\">Spotify</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label>Profile name</label>\n" +
    "            </div>\n" +
    "            <div class=\"input col-md-4\">\n" +
    "                <input type=\"text\" value=\"{{ profile.display_name }}\" readonly=\"readonly\">\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-4 col-md-offset-1\">\n" +
    "                <p>The profile name of the current logged in Spotfiy user.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label>Reconnect</label>\n" +
    "            </div>\n" +
    "            <div class=\"input col-md-4\">\n" +
    "                <div class=\"button white fullwidth\" ng-click=\"reconnect()\">\n" +
    "                    <span class=\"text\">Reconnect with Spotify</span>\n" +
    "                    <i class=\"ss-icon ss-refresh\"></i> \n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-4 col-md-offset-1\">\n" +
    "                <p>Use this button to reconnect with Spotify. This can be usefull if you wan't to login with an other account.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("account/services/sync/menu.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("account/services/sync/menu.tmpl.html",
    "<section id=\"sync\" class=\"account\" ng-controller=\"SyncMenuController\">\n" +
    "    <div class=\"profileimage\">\n" +
    "        <img src=\"./assets/images/sync-icon-menu.png\" />\n" +
    "    </div>\n" +
    "    <div class=\"content\">\n" +
    "        <span class=\"username\">\n" +
    "            {{ client.name }}\n" +
    "        </span>\n" +
    "        <span class=\"status\">\n" +
    "            <div class=\"connection connected\"></div>Connected - Sync Service\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</section>");
}]);

angular.module("account/services/sync/sync.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("account/services/sync/sync.tmpl.html",
    "<div id=\"header\" class=\"small row\" style=\"background-image: url('./assets/images/sync-header.jpg');\">\n" +
    "    <div class=\"col-md-10 lefttext\">\n" +
    "        <div class=\"inner\"><i class=\"ss-icon ss-settings\"></i>  Settings</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Service <span class=\"sub\">Sync</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label>Description</label>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-8\">\n" +
    "                <p>The Sync service extends Mopify with the possibility to synchronize the settings and credentials of other services (like Spotify) with other Mopify clients in your network. There is no difference between a master or slave. Which means that every 'client' can override the synced data by clicking on 'Push'.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Synchronize <span class=\"sub\">Sync</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label>Spotify credentials</label>\n" +
    "            </div>\n" +
    "            <div class=\"input col-md-1\">\n" +
    "                <toggle-switch ng-model=\"settings.sync.spotify\" ng-click=\"spotifyToggle()\"></toggle-switch>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-sm-6\">\n" +
    "                        <div class=\"button white fullwidth\" ng-click=\"sendCurrentSpotifyTokens()\" ng-show=\"settings.sync.spotify\">\n" +
    "                            <span class=\"text\">Push</span>\n" +
    "                            <i class=\"ss-icon ss-upload\"></i> \n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-sm-6\">\n" +
    "                        <div class=\"button white fullwidth\" ng-click=\"getSyncSpotifyTokens()\" ng-show=\"settings.sync.spotify\">\n" +
    "                            <span class=\"text\">Get</span>\n" +
    "                            <i class=\"ss-icon ss-download\"></i> \n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"description col-md-4 col-md-offset-1\">\n" +
    "                <p>When enabled every client that has Sync enabled will use the same Spotify credentials.</p>\n" +
    "                <p><b>GET:</b> Retrieve the credentials from the Sync server<br/><b>PUSH:</b> Push your current credentials to the sync server</p>\n" +
    "                <p ng-show=\"settings.sync.spotify\">Currently using credentials from device: <i>{{ spotifyclient.name }} <span ng-show=\"spotifyclient.id == client.id\">(That's you)</span></i></p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label>TasteProfile ID</label>\n" +
    "            </div>\n" +
    "            <div class=\"input col-md-1\">\n" +
    "                <toggle-switch ng-model=\"settings.sync.tasteprofile\" ng-click=\"tasteProfileToggle()\"></toggle-switch>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-sm-6\">\n" +
    "                        <div class=\"button white fullwidth\" ng-click=\"sendCurrentTasteProfileID()\" ng-show=\"settings.sync.tasteprofile\">\n" +
    "                            <span class=\"text\">Push</span>\n" +
    "                            <i class=\"ss-icon ss-upload\"></i> \n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-sm-6\">\n" +
    "                        <div class=\"button white fullwidth\" ng-click=\"getSyncTasteProfileID()\" ng-show=\"settings.sync.tasteprofile\">\n" +
    "                            <span class=\"text\">Get</span>\n" +
    "                            <i class=\"ss-icon ss-download\"></i> \n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"description col-md-4 col-md-offset-1\">\n" +
    "                <p>When enabled every client that has Sync enabled will use the same TasteProfile.</p>\n" +
    "                <p><b>GET:</b> Retrieve the credentials from the Sync server<br/><b>PUSH:</b> Push your current credentials to the sync server</p>\n" +
    "                <p ng-show=\"settings.sync.tasteprofile\">Currently using credentials from device: <i>{{ tasteprofileclient.name }} <span ng-show=\"tasteprofileclient.id == client.id\">(That's you)</span></i></p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Client <span class=\"sub\">Sync</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label>Client name</label>\n" +
    "            </div>\n" +
    "            <div class=\"input col-md-4\">\n" +
    "                <input type=\"text\" ng-model=\"client.name\" ng-blur=\"updateClient()\">\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-4 col-md-offset-1\">\n" +
    "                <p>The name of this client which will be used to identify this client against the others in your network. You can change this name to something more human.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("account/services/tasteprofile/menu.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("account/services/tasteprofile/menu.tmpl.html",
    "<section id=\"tasteprofile\" class=\"account\" ng-controller=\"TasteProfileMenuController\">\n" +
    "    <div class=\"profileimage\">\n" +
    "        <img src=\"./assets/images/echonest-menu-logo.jpg\" />\n" +
    "    </div>\n" +
    "    <div class=\"content\">\n" +
    "        <span class=\"username\" ng-hide=\"authorized\">\n" +
    "            {{ tasteprofile.id }}\n" +
    "        </span>\n" +
    "        <span class=\"status\">\n" +
    "            <div class=\"connection connected\"></div>Connected - Taste Profile\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</section>");
}]);

angular.module("account/services/tasteprofile/tasteprofile.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("account/services/tasteprofile/tasteprofile.tmpl.html",
    "<div id=\"header\" class=\"small row\" style=\"background-image: url('./assets/images/echonest-header.jpg');\">\n" +
    "    <div class=\"col-md-10 lefttext\">\n" +
    "        <div class=\"inner\"><i class=\"ss-icon ss-settings\"></i>  Settings</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Service <span class=\"sub\">Taste Profile</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label>Description</label>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-8\">\n" +
    "                <p>Taste Profile is an <a href=\"http://the.echonest.com/\" target=\"_blank\">Echonest service</a>. This services keeps track of the songs you listen. This list is called a Taste Profile and can be used to create personal music recommendations. Those recommendations can be viewed at the 'Browse' page. This Taste Profile is completely anonymous and can always be deleted.</p>\n" +
    "                <p><i>Songs can only be saved to your Taste Profile when Mopify is opened.</i></p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label>Profile ID</label>\n" +
    "            </div>\n" +
    "            <div class=\"input col-md-4\">\n" +
    "                <input name=\"trackingid\" ng-model=\"tasteprofile.id\" class=\"field\" readonly=\"readonly\" />\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-4 col-md-offset-1\">\n" +
    "                <p>This profile ID was generated for you when you enabled the service. This ID is used to keep track of your personal Taste Profile.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Danger zone <span class=\"sub\">Taste Profile</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label>Delete</label>\n" +
    "            </div>\n" +
    "            <div class=\"input col-md-4\">\n" +
    "                <div class=\"button white dangerous fullwidth\" ng-click=\"deleteProfile()\">\n" +
    "                    <span class=\"text\">Delete profile</span>\n" +
    "                    <i class=\"ss-icon ss-trash\"></i> \n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-4 col-md-offset-1\">\n" +
    "                <p>You can delete your Taste Profile and all its contents by clicking on this button. Note that this action can't be undone.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("account/settings/settings.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("account/settings/settings.tmpl.html",
    "<div id=\"header\" class=\"small row\" style=\"background-image: url('./assets/images/settings-header.jpg');\">\n" +
    "    <div class=\"col-md-10 lefttext\">\n" +
    "        <div class=\"inner\"><i class=\"ss-icon ss-settings\"></i>  Settings</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Settings <span class=\"sub\">Mopidy</span>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-md-3 col-md-offset-6 alignright\">\n" +
    "            <div class=\"button white\" ng-class=\"{ active: buttonactive }\">\n" +
    "                <span class=\"text\">Saved automatically</span>\n" +
    "                <i class=\"ss-icon ss-sync\"></i> \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label for=\"mopidyip\">Mopidy IP address</label>\n" +
    "            </div>\n" +
    "            <div class=\"input col-md-4\">\n" +
    "                <input name=\"mopidyip\" placeholder=\"For example: 192.168.1.1 or localhost\" ng-model=\"settings.mopidyip\" ng-blur=\"highlightSaveButton()\" class=\"field\"/>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-4 col-md-offset-1\">\n" +
    "                <p>Change this IP address if Mopidy is running on a different computer than Mopify. Normally you don't have to change this IP address</p>\n" +
    "                <p><i>New Mopidy connection settings will be applied after a page refresh.</i></p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label for=\"mopidyport\">Mopidy port</label>\n" +
    "            </div>\n" +
    "            <div class=\"input col-md-4\">\n" +
    "                <input name=\"mopidyport\" placeholder=\"For example: 6680\" ng-model=\"settings.mopidyport\" ng-blur=\"highlightSaveButton()\" class=\"field\"/>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-4 col-md-offset-1\">\n" +
    "                <p>Change this port if Mopidy is running on a port other than 6680. Normally you don't have to change this port.</p>\n" +
    "                 <p><i>New Mopidy connection settings will be applied after a page refresh.</i></p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Settings <span class=\"sub\">Localization</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label for=\"mopidyip\">Language code</label>\n" +
    "            </div>\n" +
    "            <div class=\"input col-md-4\">\n" +
    "                <input name=\"locale\" placeholder=\"For example: nl_NL\" ng-model=\"settings.locale\" ng-blur=\"highlightSaveButton()\" class=\"field\"/>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-4 col-md-offset-1\">\n" +
    "                <p>The desired language, consisting of a lowercase <a href=\"http://en.wikipedia.org/wiki/ISO_639\" target=\"_blank\">ISO 639</a> language code and an uppercase <a href=\"http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2\" target=\"_blank\">ISO 3166-1 alpha-2</a> country code, joined by an underscore. </p>\n" +
    "                <p>This language code is used for services like Spotify or Echonest to provide better content.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label for=\"mopidyip\">Country code</label>\n" +
    "            </div>\n" +
    "            <div class=\"input col-md-4\">\n" +
    "                <input name=\"locale\" placeholder=\"For example: NL\" ng-model=\"settings.country\" ng-blur=\"highlightSaveButton()\" class=\"field\"/>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-4 col-md-offset-1\">\n" +
    "                <p>An <a href=\"http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2\" target=\"_blank\">ISO 3166-1 alpha-2</a> country code which is used to localize services like Spotify.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Settings <span class=\"sub\">Personalization</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label for=\"startpage\">Startpage</label>\n" +
    "            </div>\n" +
    "            <div class=\"input col-md-4\">\n" +
    "                <input name=\"Start page\" placeholder=\"For example: /music/playlists\" ng-model=\"settings.startpage\" ng-blur=\"highlightSaveButton()\" class=\"field\"/>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-4 col-md-offset-1\">\n" +
    "                <p>Enter the URL of the page you want to see when starting Mopify.<br/><b>Warning:</b> entering an URL that doesn't exist will result in a redirect loop.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Settings <span class=\"sub\">Automatic updating (BETA)</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label>Automatically update to new versions</label>\n" +
    "            </div>\n" +
    "            <div class=\"input col-md-4\">\n" +
    "                <toggle-switch ng-model=\"settings.autoupdate\" ng-disabled=\"!autoupdate\"><toggle-switch>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-4 col-md-offset-1\">\n" +
    "                <p>Automatically update to a new version when available. This feature can only be used when Mopidy is running as root.</p>\n" +
    "                <p ng-if=\"!autoupdate\"><b>Run Mopidy as root to enable automatic updating</b></p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            About <span class=\"sub\">Mopify</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label>Support</label>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-6\">\n" +
    "                <p>Mopify is just like many other Open Source projects maintained in my free time. If you like it and want to support this project you can make a <a href=\"https://pledgie.com/campaigns/28130\" target=\"_blank\">donation via Pledgie</a>, or directly via <a href=\"https://www.paypal.com/us/cgi-bin/webscr?cmd=_flow&SESSION=vFdWMOLqpZK4Aw2AiOns44fWPW6fF-LmLmdzukqwjmG7UhVCA_NtBSeBOzO&dispatch=5885d80a13c0db1f8e263663d3faee8da8649a435e198e44a05ba053bc68d12e\" target=\"_blank\">PayPal</a>.</p>\n" +
    "                <p>Don't want to donate? No hard feelings! You can also help me a lot by giving me your feedback. You can do this via the <a href=\"https://github.com/dirkgroenen/mopidy-mopify/issues\" target=\"_blank\">Github Issues</a> page, or just send me an e-mail. </p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label>Author</label>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-6\">\n" +
    "                <p><a href=\"https://github.com/dirkgroenen/mopidy-mopify\" target=\"_blank\">Mopify</a> is a project developed by <a href=\"http://github.com/dirkgroenen\" target=\"_blank\">Dirk Groenen</a>.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label>License</label>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-6\">\n" +
    "                <p>Licensed under the <a href=\"https://github.com/dirkgroenen/mopidy-mopify/blob/master/LICENSE.md\" target=\"_blank\">Apache 2 license</a>.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label>Version</label>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-6\">\n" +
    "                <p>Current version: {{ mopifyversion }}</p>\n" +
    "                <p ng-if=\"newversion\" style=\"font-weight: bold\">A new version of Mopify is available ({{ newversionnumber }}). Read the <a href=\"https://github.com/dirkgroenen/mopidy-mopify/blob/master/README.md\" target=\"_blank\">Github readme</a> on how to update mopify or use the button below.</p>\n" +
    "                <div class=\"button white fullwidth\" ng-click=\"update()\" ng-if=\"newversion == true && autoupdate == true\">\n" +
    "                    <span class=\"text\">Autoupdate Mopify to version: {{ newversionnumber }}</span>\n" +
    "                    <i class=\"ss-icon ss-refresh\"></i> \n" +
    "                </div>\n" +
    "                <div class=\"button white fullwidth\" ng-if=\"newversion == true && autoupdate == false\">\n" +
    "                    <span class=\"text\">Autoupdate isn't possible. Is Mopidy running as root user?</span>\n" +
    "                    <i class=\"ss-icon ss-refresh\"></i> \n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label>Contact</label>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-6\">\n" +
    "                <p>Encounter problems or having questions while using Mopify? Please post them on <a href=\"https://github.com/dirkgroenen/mopidy-mopify/issues\" target=\"_blank\">Mopify's Github page</a>.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Tracking <span class=\"sub\">Mopify</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label>Data collecting</label>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-6\">\n" +
    "                <p>Mopify uses Google Analytics to collect usage information and errors. This data is all collected anonymously and isn't connected to your connected services.</p>\n" +
    "                <p>This data is used to improve Mopify and make it an even better web client.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("dashboard/dashboard.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dashboard/dashboard.tmpl.html",
    "");
}]);

angular.module("directives/album.directive.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/album.directive.tmpl.html",
    "<div ng-show=\"visible\">\n" +
    "    <div class=\"tileart\" context-menu=\"onContextShow()\"\n" +
    "         data-target=\"menu-{{ album.uri }}\"\n" +
    "         ng-class=\"{ 'highlight': highlight, 'expanded' : expanded }\">\n" +
    "        <div class=\"hoverwrap\">\n" +
    "            <div class=\"iconwrap row\">\n" +
    "                <div class=\"icon small col-xs-4\" title=\"Show album's tracks\">\n" +
    "                    <a href=\"{{ tracklistUrl }}\"><i class=\"ss-icon ss-list\"></i></a>\n" +
    "                </div>\n" +
    "                <div class=\"icon col-xs-4\" title=\"Play album\">\n" +
    "                    <i class=\"ss-icon ss-play\" ng-click=\"play()\"></i>\n" +
    "                </div>\n" +
    "                <div class=\"icon small col-xs-4\" title=\"Start new station for: {{ album.name }}\">\n" +
    "                    <i class=\"ss-icon ss-wifi\" ng-click=\"startStation()\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <img ng-src=\"{{ album.images[1].url }}\" />\n" +
    "    </div>\n" +
    "    <div class=\"tileinfo clickable\">\n" +
    "        <a href=\"{{ tracklistUrl }}\">\n" +
    "            <span class=\"name\">{{ album.name}}</span>\n" +
    "            <span class=\"year ng-binding\">{{ artiststring }}</span>\n" +
    "        </a>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"contextmenu position-fixed\" id=\"menu-{{ album.uri }}\">\n" +
    "        <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "            <li ng-click=\"play()\">\n" +
    "                Play\n" +
    "            </li>\n" +
    "            <li ng-click=\"addToQueue()\">\n" +
    "                Add to queue\n" +
    "            </li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li ng-click=\"showPlaylists()\">\n" +
    "                Add to playlist\n" +
    "            </li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li ng-click=\"startStation()\">\n" +
    "                Start station\n" +
    "            </li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li ng-click=\"toggleSaveAlbum()\" ng-show='showSaveAlbum'>\n" +
    "                {{ (albumAlreadySaved) ? 'Remove album' : 'Save album' }}\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("directives/artist.directive.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/artist.directive.tmpl.html",
    "<div class=\"tileart\" context-menu=\"onContextShow()\"\n" +
    "     data-target=\"menu-{{ artist.uri }}\"\n" +
    "     ng-class=\"{ 'highlight': highlight, 'expanded' : expanded }\">\n" +
    "    <div class=\"hoverwrap\">\n" +
    "        <div class=\"iconwrap row\">\n" +
    "            <div class=\"icon small col-xs-4\" title=\"Show artist's tracks\">\n" +
    "                <a href=\"#/music/artist/{{ artist.uri }}\"><i class=\"ss-icon ss-list\"></i></a>\n" +
    "            </div>\n" +
    "            <div class=\"icon col-xs-4\" title=\"Play artist\">\n" +
    "                <i class=\"ss-icon ss-play\" ng-click=\"play()\"></i>\n" +
    "            </div>\n" +
    "            <div class=\"icon small col-xs-4\" title=\"Start new station for: {{ artist.name }}\">\n" +
    "                <i class=\"ss-icon ss-wifi\" ng-click=\"startStation()\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <img ng-src=\"{{ artist.images[1].url }}\" />\n" +
    "</div>\n" +
    "<div class=\"tileinfo clickable\">\n" +
    "    <a href=\"#/music/artist/{{ artist.uri }}\">\n" +
    "        <span class=\"name\">{{ artist.name}}</span>\n" +
    "    </a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"contextmenu position-fixed\" id=\"menu-{{ artist.uri }}\">\n" +
    "    <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "        <li ng-click=\"play()\">\n" +
    "            Play\n" +
    "        </li>\n" +
    "        <li ng-click=\"addToQueue()\">\n" +
    "            Add to queue\n" +
    "        </li>\n" +
    "        <li class=\"divider\"></li>\n" +
    "        <li ng-click=\"startStation()\">\n" +
    "            Start station\n" +
    "        </li>\n" +
    "        <li class=\"divider\"></li>\n" +
    "        <li ng-click=\"toggleFollowArtist()\" ng-show='showFollowArtist'>\n" +
    "            {{ (followingArtist) ? 'Unfollow artist' : 'Follow artist' }}\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("directives/browse.directive.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/browse.directive.tmpl.html",
    "<div class=\"browseitem\">\n" +
    "    <div class=\"text\">\n" +
    "        <span ng-bind-html=\"titleslogan\"></span>\n" +
    "    </div>\n" +
    "    <div class=\"imagewrap\">\n" +
    "        <div class=\"hoverwrap\">\n" +
    "            <div class=\"iconwrap row\">\n" +
    "                <div class=\"icon small col-xs-4\" title=\"Show tracks\">\n" +
    "                    <a href=\"#/music/artist/{{ spotifyuri }}\" ng-if=\"item.type == 'artist'\"><i class=\"ss-icon ss-list\"></i></a>\n" +
    "                    <a href=\"#/music/tracklist/{{ spotifyuri }}\" ng-if=\"item.type == 'echonest'\"><i class=\"ss-icon ss-list\"></i></a>\n" +
    "                </div>\n" +
    "                <div class=\"icon col-xs-4\" title=\"Play\">\n" +
    "                    <i class=\"ss-icon ss-play\" ng-click=\"play()\"></i>\n" +
    "                </div>\n" +
    "                <div class=\"icon small col-xs-4\" title=\"Start new station for: {{ suggestion.name }}\">\n" +
    "                    <i class=\"ss-icon ss-wifi\" ng-click=\"startStation()\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <img ng-src=\"{{ image }}\"/>\n" +
    "    </div>  \n" +
    "    <div class=\"text\">\n" +
    "        <span class=\"title\">{{ suggestion.name }}</span><br>\n" +
    "        <span class=\"artist\" ng-if=\"suggestion.artist\">{{ suggestion.artist }}</span>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("directives/playlist.directive.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/playlist.directive.tmpl.html",
    "<div class=\"tileart\" context-menu\n" +
    "     data-target=\"menu-{{ playlist.uri }}\"\n" +
    "     ng-class=\"{ 'highlight': highlight, 'expanded' : expanded }\">\n" +
    "    <div class=\"hoverwrap\">\n" +
    "        <div class=\"iconwrap row\">\n" +
    "            <div class=\"icon small col-xs-4\" title=\"Show playlist's tracks\">\n" +
    "                <a href=\"{{ tracklistUrl }}\"><i class=\"ss-icon ss-list\"></i></a>\n" +
    "            </div>\n" +
    "            <div class=\"icon col-xs-4\" title=\"Play playlist\">\n" +
    "                <i class=\"ss-icon ss-play\" ng-click=\"play()\"></i>\n" +
    "            </div>\n" +
    "            <div class=\"icon small col-xs-4\" title=\"Start new station for: {{ playlist.name }}\">\n" +
    "                <i class=\"ss-icon ss-wifi\" ng-click=\"startStation()\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <img ng-src=\"{{ coverImage }}\" />\n" +
    "</div>\n" +
    "<div class=\"tileinfo clickable\">\n" +
    "    <a href=\"{{ tracklistUrl }}\">\n" +
    "        <span class=\"name\">{{ playlist.name}}</span>\n" +
    "        <span class=\"year\">{{ playlist.tracks.length || playlist.tracks.total }} tracks</span>\n" +
    "    </a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"contextmenu position-fixed\" id=\"menu-{{ playlist.uri }}\">\n" +
    "    <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "        <li ng-click=\"playTrack(track)\">\n" +
    "            Play\n" +
    "        </li>\n" +
    "        <li ng-click=\"addTrackToQueue(track)\">\n" +
    "            Add to queue\n" +
    "        </li>\n" +
    "        <li class=\"divider\"></li>\n" +
    "        <li ng-click=\"startStation()\">\n" +
    "            Start station\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("directives/service.directive.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/service.directive.tmpl.html",
    "<div class=\"tileart\">\n" +
    "    <div class=\"hoverwrap\">\n" +
    "        <div class=\"iconwrap\">\n" +
    "            <div class=\"icon\" ng-class=\"(service.hasSettings && service.connected) ? 'col-xs-6' : 'col-xs-12'\" title=\"Connect/Disconnect service\">\n" +
    "                <i class=\"ss-icon \" ng-class=\"!service.connected ? 'ss-contract' : 'ss-expand'\" ng-click=\"!service.connected ? connectService() : disconnectService()\"></i>\n" +
    "            </div>\n" +
    "            <div class=\"icon col-xs-6\" ng-if=\"(service.hasSettings && service.connected)\" title=\"Open service's settings\">\n" +
    "                <a href=\"#/account/services/{{ service.name.replace(' ', '').toLowerCase() }}\"><i class=\"ss-icon ss-settings\"></i></a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <img ng-src=\"{{ service.image }}\"/>\n" +
    "</div>\n" +
    "<div class=\"tileinfo\">\n" +
    "    <span class=\"name\">{{ service.name }} <div class=\"status\"><div class=\"connection\" ng-class=\"service.connected ? 'connected' : 'disconnected'\"></div></div></span>\n" +
    "    <span class=\"year\">{{ service.description }}</span>\n" +
    "</div>");
}]);

angular.module("directives/station.directive.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/station.directive.tmpl.html",
    "<div class=\"col-lg-2 col-md-3 col-sm-4 col-xs-6 single-tile\" ng-show=\"visible\">\n" +
    "    <div class=\"tileart\" context-menu\n" +
    "         data-target=\"menu-{{ index }}\"\n" +
    "         ng-class=\"{ 'highlight': highlight, 'expanded' : expanded }\">\n" +
    "        <div class=\"hoverwrap\">\n" +
    "            <div class=\"iconwrap\">\n" +
    "                <div class=\"icon\" title=\"Start station\">\n" +
    "                    <i class=\"ss-icon ss-wifi\" ng-click=\"start()\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <img ng-src=\"{{ station.coverImage }}\"/>\n" +
    "    </div>\n" +
    "    <div class=\"tileinfo\">\n" +
    "        <a href=\"{{ getStationUrl() }}\">\n" +
    "            <span class=\"name\">{{ station.name }}</span>\n" +
    "            <span class=\"year\">Radio type: {{ station.type }}</span>\n" +
    "        </a>\n" +
    "    </div>\n" +
    "    <div class=\"contextmenu position-fixed\" id=\"menu-{{ index }}\">\n" +
    "        <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "            <li ng-click=\"start()\">\n" +
    "                Start\n" +
    "            </li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li ng-click=\"delete()\">\n" +
    "                Delete\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("directives/track.directive.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/track.directive.tmpl.html",
    "<div class=\"track\" context-menu=\"onContextShow()\" context-menu-close=\"onContextClose()\"\n" +
    "    data-target=\"{{ track.uri || track.tlid }}\"\n" +
    "    ng-class=\"{ 'highlight': highlight, 'expanded' : expanded, 'loading': track.loading, 'selected': selected }\"\n" +
    "    hm-doubletap=\"play()\"\n" +
    "    ng-click=\"selectTrack($event)\"\n" +
    "    ng-show=\"visible\">\n" +
    "\n" +
    "    <div class=\"row\" ng-class=\"{'nowplaying': ($parent.currentPlayingTrack.uri == track.uri)}\">\n" +
    "        <div class=\"col-sm-4 col-xs-12 name\">\n" +
    "            {{ track.name }} \n" +
    "        </div>\n" +
    "        <div class=\"col-sm-3 col-xs-6 artists\">\n" +
    "            <span ng-bind-html=\"artistsString()\"></span>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-4 col-xs-6 album\">\n" +
    "            <a href=\"#/music/tracklist/{{ track.album.uri }}/{{ track.album.name }}\">{{ track.album.name }}</a>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-1 visible-lg-block visible-md-block visible-sm-blocklength\">\n" +
    "            {{ lengthHuman() }}\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"contextmenu position-fixed\" id=\"{{ track.uri || track.tlid }}\">\n" +
    "    <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "        <li ng-click=\"play()\">\n" +
    "            Play track<span ng-show=\"multipleselected\">s</span>\n" +
    "        </li>\n" +
    "        <li class=\"divider\"></li>\n" +
    "        <li ng-click=\"addToQueue()\">\n" +
    "            Add track<span ng-show=\"multipleselected\">s</span> to queue\n" +
    "        </li>\n" +
    "        <li ng-show=\"$parent.type == 'tracklist'\" ng-click=\"removeFromQueue()\">\n" +
    "            Remove from queue\n" +
    "        </li>\n" +
    "        <li class=\"divider\"></li>\n" +
    "        <li ng-click=\"startStation()\">\n" +
    "            Start station\n" +
    "        </li>\n" +
    "        <li class=\"divider\"></li>\n" +
    "        <li ng-click=\"showPlaylists()\">\n" +
    "            Add to playlist\n" +
    "        </li>\n" +
    "        <li ng-if=\"$parent.isowner\" ng-click=\"removeFromPlaylist()\">\n" +
    "            Remove from playlist\n" +
    "        </li>\n" +
    "        <li class=\"divider\"></li>\n" +
    "        <li ng-click=\"toggleSaveTrack()\" ng-show='showSaveTrack'>\n" +
    "            {{ (trackAlreadySaved) ? 'Remove track from library' : 'Save track in library' }}\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("discover/browse/browse.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("discover/browse/browse.tmpl.html",
    "<div id=\"header\" class=\"small row\" style=\"background-image: url('./assets/images/discover-header.jpg');\">\n" +
    "    <div class=\"col-md-4 lefttext\">\n" +
    "        <div class=\"inner\"><i class=\"ss-icon ss-list\"></i>  Browse</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Discover <span class=\"sub\">Browse</span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 col-md-offset-3 alignright\">\n" +
    "            <div class=\"button white\" ng-click=\"startStation()\">\n" +
    "                <span class=\"text\">Start station</span>\n" +
    "                <i class=\"ss-icon ss-wifi\"></i> \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div id=\"browsewrap\" infinite-scroll=\"buildblocks()\" infinite-scroll-distance=\"1\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-lg-3 col-md-4 col-sm-6 col-xs-12\">\n" +
    "                     <div ng-repeat=\"item in blocks\" ng-if=\"$index % 4 == 0\">\n" +
    "                        <mopify-browse item=\"item\"></mopify-browse>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-lg-3 col-md-4 col-sm-6 col-xs-12 visible-lg-block visible-md-block visible-sm-block\">\n" +
    "                    <div ng-repeat=\"item in blocks\" ng-if=\"$index % 4 == 1\">\n" +
    "                        <mopify-browse item=\"item\"></mopify-browse>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-lg-3 col-md-4 col-sm-6 col-xs-12 visible-lg-block visible-md-block\">\n" +
    "                    <div ng-repeat=\"item in blocks\" ng-if=\"$index % 4 == 2\">\n" +
    "                        <mopify-browse item=\"item\"></mopify-browse>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-lg-3 col-md-3 col-sm-6 col-xs-12 visible-lg-block\">\n" +
    "                    <div ng-repeat=\"item in blocks\" ng-if=\"$index % 4 == 3\">\n" +
    "                        <mopify-browse item=\"item\"></mopify-browse>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("discover/featured/featured.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("discover/featured/featured.tmpl.html",
    "<div id=\"header\" class=\"big row\" style=\"background-image: url('./assets/images/discover-header.jpg');\">\n" +
    "    <div id=\"featured\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-lg-8 col-lg-offset-2\">\n" +
    "                <div class=\"title\">\n" +
    "                    {{ titletext }}\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\" ng-show=\"headerplaylist.tracks !== undefined\">\n" +
    "            <div class=\"playlist col-lg-4 col-md-8 col-sm-10 col-lg-offset-4 col-md-offset-2 col-sm-offset-1\">\n" +
    "                <div class=\"cover\">\n" +
    "                    <img ng-src=\"{{ headerplaylist.images[0].url }}\" />\n" +
    "                </div>\n" +
    "                <div class=\"details\">\n" +
    "                    <div class=\"tracklist\">\n" +
    "                        <div class=\"row track\" ng-repeat=\"track in headerplaylist.tracks\" >\n" +
    "                            <div class=\"col-xs-7 name\">\n" +
    "                                {{ track.name }}    \n" +
    "                            </div>\n" +
    "                            <div class=\"col-xs-5 artist\">\n" +
    "                                {{ track.artiststring }}\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"hoverwrap\">\n" +
    "                    <div class=\"iconwrap row\">\n" +
    "                        <div class=\"icon small col-sm-4\">\n" +
    "                            <a href=\"#/music/tracklist/{{ headerplaylist.uri }}\"><i class=\"ss-icon ss-list\"></i></a>\n" +
    "                        </div>\n" +
    "                        <div class=\"icon col-sm-4\">\n" +
    "                            <i class=\"ss-icon ss-play\" ng-click=\"playHeaderPlaylist()\"></i>\n" +
    "                        </div>\n" +
    "                        <div class=\"icon small col-sm-4\">\n" +
    "                            <i class=\"ss-icon ss-wifi\" ng-click=\"startHeaderPlaylistStation()\"></i>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Discover <span class=\"sub\">Featured</span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 col-md-offset-3 alignright\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div id=\"tileview\">\n" +
    "            <div class=\"row\">\n" +
    "                <div ng-repeat=\"playlist in featuredplaylists\"> \n" +
    "                    <mopify-playlist playlist=\"playlist\" class=\"col-lg-2 col-md-3 col-sm-4 col-xs-6  single-tile\"></mopify-playlist>\n" +
    "                    <div ng-if=\"($index + 1) % 6 == 0\" class=\"clearfix visible-lg-block\"></div>\n" +
    "                    <div ng-if=\"($index + 1) % 4 == 0\" class=\"clearfix visible-md-block\"></div>\n" +
    "                    <div ng-if=\"($index + 1) % 3 == 0\" class=\"clearfix visible-sm-block\"></div>\n" +
    "                    <div ng-if=\"($index + 1) % 2 == 0\" class=\"clearfix visible-xs-block\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("discover/menu.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("discover/menu.tmpl.html",
    "<div class=\"block row\" id=\"discover\">\n" +
    "    <div class=\"title\">Discover</div>\n" +
    "    <div class=\"content\">\n" +
    "        <ul>\n" +
    "            <li><a href=\"#/discover/browse\">Browse</a></li>\n" +
    "            <li><a href=\"#/discover/featured\">Featured playlists</a></li>\n" +
    "            <li><a href=\"#/discover/newreleases\">New releases</a></li>\n" +
    "        </ul>   \n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("discover/newreleases/newreleases.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("discover/newreleases/newreleases.tmpl.html",
    "<div id=\"header\" class=\"big row\" style=\"background-image: url('https://d2c87l0yth4zbw.global.ssl.fastly.net/i/home/lifestyle-hero-lg.jpg');\">\n" +
    "    <div id=\"featured\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-8 col-md-offset-2\">\n" +
    "                <div class=\"title\">\n" +
    "                    {{ titletext }}\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\" ng-show=\"headeralbum.tracks !== undefined\">\n" +
    "            <div class=\"playlist col-lg-4 col-md-8 col-sm-10 col-lg-offset-4 col-md-offset-2 col-sm-offset-1\">\n" +
    "                <div class=\"cover\">\n" +
    "                    <img ng-src=\"{{ headeralbum.images[0].url }}\" />\n" +
    "                </div>\n" +
    "                <div class=\"details\">\n" +
    "                    <div class=\"tracklist\">\n" +
    "                        <div class=\"row track\" ng-repeat=\"track in headeralbum.tracks\" >\n" +
    "                            <div class=\"col-xs-7 name\">\n" +
    "                                {{ track.name }}    \n" +
    "                            </div>\n" +
    "                            <div class=\"col-xs-5 artist\">\n" +
    "                                {{ track.artiststring }}\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"hoverwrap\">\n" +
    "                    <div class=\"iconwrap row\">\n" +
    "                        <div class=\"icon small col-sm-4\">\n" +
    "                            <a href=\"#/music/tracklist/{{ headeralbum.uri }}\"><i class=\"ss-icon ss-list\"></i></a>\n" +
    "                        </div>\n" +
    "                        <div class=\"icon col-sm-4\">\n" +
    "                            <i class=\"ss-icon ss-play\" ng-click=\"playHeaderAlbum()\"></i>\n" +
    "                        </div>\n" +
    "                        <div class=\"icon small col-sm-4\">\n" +
    "                            <i class=\"ss-icon ss-wifi\" ng-click=\"startHeaderAlbumStation()\"></i>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Discover <span class=\"sub\">New releases</span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 col-md-offset-3 alignright\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div id=\"tileview\">\n" +
    "            <div class=\"row\">\n" +
    "                <div ng-repeat=\"album in newreleases\"> \n" +
    "                    <mopify-album album=\"album\" class=\"col-lg-2 col-md-3 col-sm-4 col-xs-6  single-tile\"></mopify-album>\n" +
    "                    <div ng-if=\"($index + 1) % 6 == 0\" class=\"clearfix visible-lg-block\"></div>\n" +
    "                    <div ng-if=\"($index + 1) % 4 == 0\" class=\"clearfix visible-md-block\"></div>\n" +
    "                    <div ng-if=\"($index + 1) % 3 == 0\" class=\"clearfix visible-sm-block\"></div>\n" +
    "                    <div ng-if=\"($index + 1) % 2 == 0\" class=\"clearfix visible-xs-block\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("modals/playlistselect.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modals/playlistselect.tmpl.html",
    "<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title ng-binding\">Select playlist</h4>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"selectplaylist row\">\n" +
    "    <div class=\"col-sm-6\">\n" +
    "        <ul class=\"playlists\" role=\"menu\">\n" +
    "            <li ng-repeat=\"playlist in userplaylists\" ng-if=\"$index % 2 == 0\" ng-click=\"addToPlaylist(playlist.uri)\">\n" +
    "                {{ playlist.name }}\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <div class=\"col-sm-6\">\n" +
    "        <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "            <li ng-repeat=\"playlist in userplaylists\" ng-if=\"$index % 2 == 1\" ng-click=\"addToPlaylist(playlist.uri)\">\n" +
    "                {{ playlist.name }}\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>");
}]);

angular.module("music/artist/artist.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("music/artist/artist.tmpl.html",
    "<div id=\"header\" class=\"small row\" ng-class=\"(currentview.id == 'bio') ? 'big' : ''\" style=\"background-image: url('{{ artist.coverimage }}');\">\n" +
    "    <div class=\"col-md-4 col-sm-3 lefttext\">\n" +
    "        <div class=\"inner\">{{ artist.name }}</div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-8 col-lg-4 col-sm-9 centertext\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-xs-4 music\"><a href=\"#/music/artist/{{ artistId }}\" ng-class=\"{ 'active': currentview.id == 'music' }\" ng-click=\"setView('music')\">Music</a></div>\n" +
    "            <div class=\"col-xs-4 biography\"><a href=\"#/music/artist/{{ artistId }}\" ng-class=\"{ 'active': currentview.id == 'bio' }\" ng-click=\"setView('bio')\">Biography</a></div>\n" +
    "            <div class=\"col-xs-4 related\"><a href=\"#/music/artist/{{ artistId }}\" ng-class=\"{ 'active': currentview.id == 'related' }\" ng-click=\"setView('related')\">Related Artists</a></div>\n" +
    "        </div>  \n" +
    "    </div>\n" +
    "</div>\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\" ng-if=\"currentview.id == 'music'\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            {{ artist.name }} <span class=\"sub\">Top tracks</span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 col-md-offset-3 alignright\" >\n" +
    "            <div class=\"button white\" ng-click=\"startStation()\">\n" +
    "                <span class=\"text\">Start station</span>\n" +
    "                <i class=\"ss-icon ss-wifi\"></i> \n" +
    "            </div>\n" +
    "            <div class=\"button white\" ng-click=\"toggleFollowArtist()\">\n" +
    "                <span class=\"text\">{{ (followingArtist) ? 'Unfollow' : 'follow' }} artist</span>\n" +
    "                <i class=\"ss-icon ss-check\" ng-show=\"!followingArtist\"></i> \n" +
    "                <i class=\"ss-icon ss-delete\" ng-show=\"followingArtist\"></i> \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagecontent row\" ng-if=\"currentview.id == 'music'\">\n" +
    "        <div id=\"tracklist\">\n" +
    "            <div class=\"row\" ng-repeat=\"track in toptracks\" >\n" +
    "                <mopify-track track=\"track\" surrounding=\"toptracks\" currentplayingtrack=\"currentPlayingTrack\" type=\"type\"> </mopify-track>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            {{ artist.name }} <span class=\"sub\">{{ currentview.name }}</span>\n" +
    "        </div>\n" +
    "        <div class=\"col-lg-2 col-md-3 col-sm-4 col-xs-6 alignright\" ng-if=\"currentview.id != 'music'\">\n" +
    "            <div class=\"button white\" ng-click=\"startStation()\">\n" +
    "                <span class=\"text\">Start station</span>\n" +
    "                <i class=\"ss-icon ss-wifi\"></i> \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div id=\"tileview\" ng-if=\"currentview.id == 'music'\">\n" +
    "            <div ng-repeat=\"album in albums\"> \n" +
    "                <mopify-album album=\"album\" class=\"single-tile col-lg-2 col-md-3 col-sm-4 col-xs-6\"></mopify-album>\n" +
    "                <div ng-if=\"($index + 1) % 6 == 0\" class=\"clearfix visible-lg-block\"></div>\n" +
    "                <div ng-if=\"($index + 1) % 4 == 0\" class=\"clearfix visible-md-block\"></div>\n" +
    "                <div ng-if=\"($index + 1) % 3 == 0\" class=\"clearfix visible-sm-block\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"textcontent\" ng-if=\"currentview.id == 'bio'\">\n" +
    "            {{ artist.bio.text }}\n" +
    "        </div>\n" +
    "\n" +
    "        <div id=\"tileview\" ng-if=\"currentview.id == 'related'\">\n" +
    "            <div ng-repeat=\"relatedartist in related\"> \n" +
    "                <mopify-artist artist=\"relatedartist\" class=\"single-tile col-lg-2 col-md-3 col-sm-4 col-xs-6\"></mopify-artist>\n" +
    "                <div ng-if=\"($index + 1) % 6 == 0\" class=\"clearfix visible-lg-block\"></div>\n" +
    "                <div ng-if=\"($index + 1) % 4 == 0\" class=\"clearfix visible-md-block\"></div>\n" +
    "                <div ng-if=\"($index + 1) % 3 == 0\" class=\"clearfix visible-sm-block\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("music/library/albums/albums.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("music/library/albums/albums.tmpl.html",
    "<div id=\"header\" class=\"small row\" style=\"background-image: url('./assets/images/playlists-header.jpg');\">\n" +
    "    <div class=\"col-md-4 lefttext\">\n" +
    "        <div class=\"inner\"><i class=\"ss-icon ss-list\"></i> Your music: Albums</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Your Music <span class=\"sub\">Albums</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div id=\"tileview\">\n" +
    "            <div class=\"row\">\n" +
    "                <div ng-repeat=\"album in albums\"> \n" +
    "                    <mopify-album album=\"album\" class=\"col-lg-2 col-md-3 col-sm-4 col-xs-6 single-tile\"></mopify-album>\n" +
    "                    <div ng-if=\"($index + 1) % 6 == 0\" class=\"clearfix visible-lg-block\"></div>\n" +
    "                    <div ng-if=\"($index + 1) % 4 == 0\" class=\"clearfix visible-md-block\"></div>\n" +
    "                    <div ng-if=\"($index + 1) % 3 == 0\" class=\"clearfix visible-sm-block\"></div>\n" +
    "                    <div ng-if=\"($index + 1) % 2 == 0\" class=\"clearfix visible-xs-block\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("music/library/artists/artists.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("music/library/artists/artists.tmpl.html",
    "<div id=\"header\" class=\"small row\" style=\"background-image: url('./assets/images/playlists-header.jpg');\">\n" +
    "    <div class=\"col-md-4 lefttext\">\n" +
    "        <div class=\"inner\"><i class=\"ss-icon ss-list\"></i> Your music: Artists</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Your Music <span class=\"sub\">Artists</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div id=\"tileview\">\n" +
    "            <div class=\"row\">\n" +
    "                <div ng-repeat=\"artist in artists\"> \n" +
    "                    <mopify-artist artist=\"artist\" class=\"col-lg-2 col-md-3 col-sm-4 col-xs-6 single-tile\"></mopify-artist>\n" +
    "                    <div ng-if=\"($index + 1) % 6 == 0\" class=\"clearfix visible-lg-block\"></div>\n" +
    "                    <div ng-if=\"($index + 1) % 4 == 0\" class=\"clearfix visible-md-block\"></div>\n" +
    "                    <div ng-if=\"($index + 1) % 3 == 0\" class=\"clearfix visible-sm-block\"></div>\n" +
    "                    <div ng-if=\"($index + 1) % 2 == 0\" class=\"clearfix visible-xs-block\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("music/library/playlists/playlists.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("music/library/playlists/playlists.tmpl.html",
    "<div id=\"header\" class=\"small row\" style=\"background-image: url('./assets/images/playlists-header.jpg');\">\n" +
    "    <div class=\"col-md-4 lefttext\">\n" +
    "        <div class=\"inner\"><i class=\"ss-icon ss-list\"></i> Your music: Playlists</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Your Music <span class=\"sub\">Playlists <span ng-if=\"foldername\">></span> {{ foldername }}</span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 col-md-offset-3 alignright\">\n" +
    "            <div class=\"button white\" ng-click=\"createPlaylist()\" ng-show=\"spotifyplaylists\">\n" +
    "                <span class=\"text\">Create new playlist</span>\n" +
    "                <i class=\"ss-icon ss-plus\"></i> \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div id=\"tileview\">\n" +
    "            <div class=\"row\">\n" +
    "                <div ng-repeat=\"playlist in playlists\"> \n" +
    "                    <mopify-playlist playlist=\"playlist\" class=\"col-lg-2 col-md-3 col-sm-4 col-xs-6 single-tile\"></mopify-playlist>\n" +
    "                    <div ng-if=\"($index + 1) % 6 == 0\" class=\"clearfix visible-lg-block\"></div>\n" +
    "                    <div ng-if=\"($index + 1) % 4 == 0\" class=\"clearfix visible-md-block\"></div>\n" +
    "                    <div ng-if=\"($index + 1) % 3 == 0\" class=\"clearfix visible-sm-block\"></div>\n" +
    "                    <div ng-if=\"($index + 1) % 2 == 0\" class=\"clearfix visible-xs-block\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("music/menu.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("music/menu.tmpl.html",
    "<div class=\"block row\" id=\"yourmusic\" ng-controller=\"PlaylistsMenuController\">\n" +
    "    <div class=\"title\">Your music</div>\n" +
    "    <div class=\"content\">\n" +
    "        <ul>\n" +
    "            <li>\n" +
    "                <a href=\"#/music/playlists\">Playlists</a>\n" +
    "                <ul class=\"submenu playlists\" ng-if=\"numberoffolders > 0\" ng-class=\"{ small: hide }\" ng-mouseenter=\"showPlaylists()\" ng-mouseleave=\"hidePlaylists()\">\n" +
    "                    <li ng-repeat=\"(key, value) in playlists\"><a href=\"#/music/playlists/{{ key }}\">{{ key }}</a></li>\n" +
    "                    <div class=\"shadow\"></div>\n" +
    "                </ul>\n" +
    "            </li>\n" +
    "            <li><a href=\"#/music/tracklist/spotify:library:songs\">Songs</a></li>\n" +
    "            <li><a href=\"#/music/albums\">Albums</a></li>\n" +
    "            <li><a href=\"#/music/artists\">Artists</a></li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"block row\" id=\"stations\">\n" +
    "    <div class=\"title\">Stations</div>\n" +
    "    <div class=\"content\">\n" +
    "        <ul>\n" +
    "            <li><a href=\"#/music/stations\">Stations</a></li>      \n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("music/stations/stations.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("music/stations/stations.tmpl.html",
    "<div id=\"header\" class=\"row\" ng-class=\"headerSize\" style=\"background-image: url('./assets/images/stations-header.jpg');\">\n" +
    "    <div class=\"col-md-4 lefttext\" ng-hide=\"creatingRadio\">\n" +
    "        <div class=\"inner\"><i class=\"ss-icon ss-wifi\"></i>  Stations</div>\n" +
    "    </div>\n" +
    "    <div ng-show=\"creatingRadio\" id=\"radiosearch\" ng-class=\"wrapclass\">\n" +
    "        <div class=\"col-md-8 col-md-offset-2\">\n" +
    "            <div class=\"title\">\n" +
    "                Sit back, relax and enjoy\n" +
    "            </div>\n" +
    "            <div class=\"inputwrap\">\n" +
    "                <input type=\"text\" ng-model=\"searchQuery\" ng-keyup=\"search($event)\" placeholder=\"Search for an artist, album or song\"/>\n" +
    "            </div>\n" +
    "            <div class=\"resultswrap\">\n" +
    "                <ul>\n" +
    "                    <li class=\"divider\">Albums</li>\n" +
    "                    <li class=\"result\" ng-repeat=\"result in searchResults.albums.items\" ng-click=\"startFromNew('album', result)\">\n" +
    "                        <div class=\"thumb\">\n" +
    "                            <img ng-src=\"{{ result.images[0].url }}\" />\n" +
    "                        </div>\n" +
    "                        <div class=\"text\">\n" +
    "                            {{ result.name }}\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                    <li class=\"divider\">Artists</li>\n" +
    "                    <li class=\"result\" ng-repeat=\"result in searchResults.artists.items\" ng-click=\"startFromNew('artist', result)\">\n" +
    "                        <div class=\"thumb\">\n" +
    "                            <img ng-src=\"{{ result.images[0].url }}\" />\n" +
    "                        </div>\n" +
    "                        <div class=\"text\">\n" +
    "                            {{ result.name }}\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                    <li class=\"divider\">Tracks</li>\n" +
    "                    <li class=\"result\" ng-repeat=\"result in searchResults.tracks.items\" ng-click=\"startFromNew('track', result)\">\n" +
    "                        <div class=\"thumb\">\n" +
    "                            <img ng-src=\"{{ result.album.images[0].url }}\" />\n" +
    "                        </div>\n" +
    "                        <div class=\"text\">\n" +
    "                            {{ result.name }} - {{ buildArtistString(result.artists) }}\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                    <li class=\"divider\">Playlists</li>\n" +
    "                    <li class=\"result\" ng-if=\"spotifyConnected\" ng-repeat=\"result in searchResults.playlists.items\" ng-click=\"startFromNew('track', result)\">\n" +
    "                        <div class=\"text\">\n" +
    "                            {{ result.name }} - {{ result.owner.id }}\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                    <li class=\"result\" ng-if=\"!spotifyConnected\">\n" +
    "                        <div class=\"text\">\n" +
    "                            If you want to search through Spotify playlists you first have to connect with Spotify\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Stations <span class=\"sub\">Recently played</span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 col-md-offset-6 alignright\">\n" +
    "            <div class=\"button white\" ng-click=\"create()\">\n" +
    "                <span class=\"text\">Create new</span>\n" +
    "                <i class=\"ss-icon ss-wifi\"></i> \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div id=\"tileview\">\n" +
    "            <div class=\"row\">\n" +
    "                <div ng-repeat=\"station in stations | reverse\">\n" +
    "                    <mopify-station station=\"station\" index=\"$index\"></mopify-station>\n" +
    "                    <div ng-if=\"($index + 1) % 6 == 0\" class=\"clearfix visible-lg-block\"></div>\n" +
    "                    <div ng-if=\"($index + 1) % 4 == 0\" class=\"clearfix visible-md-block\"></div>\n" +
    "                    <div ng-if=\"($index + 1) % 3 == 0\" class=\"clearfix visible-sm-block\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("music/tracklist/tracklist.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("music/tracklist/tracklist.tmpl.html",
    "<div id=\"header\" class=\"small row\" style=\"background-image: url('{{ coverImage }}');\">\n" +
    "    <div class=\"col-md-10 lefttext\">\n" +
    "        <div class=\"inner\"><i class=\"ss-icon ss-list\"></i>  {{ name }}</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            tracks <span class=\"sub\">{{ type }}</span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 col-md-offset-3 alignright\">\n" +
    "            <div class=\"button white\" ng-click=\"toglgeSaveAlbum()\" ng-show=\"type == 'Album'\">\n" +
    "                <span class=\"text\">{{ (albumAlreadySaved) ? 'Remove' : 'Save' }} album</span>\n" +
    "                <i class=\"ss-icon ss-check\" ng-show=\"!albumAlreadySaved\"></i> \n" +
    "                <i class=\"ss-icon ss-delete\" ng-show=\"albumAlreadySaved\"></i> \n" +
    "            </div>\n" +
    "            <div class=\"button white\" ng-click=\"toglgeFollowPlaylist()\" ng-show=\"type == 'Playlist' &&!isowner\">\n" +
    "                <span class=\"text\">{{ (followingPlaylist) ? 'Unfollow' : 'Follow' }} playlist</span>\n" +
    "                <i class=\"ss-icon ss-check\" ng-show=\"!followingPlaylist\"></i> \n" +
    "                <i class=\"ss-icon ss-delete\" ng-show=\"followingPlaylist\"></i> \n" +
    "            </div>\n" +
    "            <div class=\"button white\" ng-click=\"startStation()\">\n" +
    "                <span class=\"text\">Start station</span>\n" +
    "                <i class=\"ss-icon ss-wifi\"></i> \n" +
    "            </div>\n" +
    "            <div class=\"button white\" ng-click=\"shuffle()\" ng-if=\"type != 'tracklist'\">\n" +
    "                <span class=\"text\">Shuffle {{ type }}</span>\n" +
    "                <i class=\"ss-icon ss-shuffle\"></i> \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row note\" ng-if=\"type == 'My Music - Songs'\">\n" +
    "        <div class=\"col-md-10\">\n" +
    "            <p><b>Note:</b> loading the Library songs tracks into Mopidy <a href=\"https://github.com/dirkgroenen/mopidy-mopify/issues/62\" target=\"_blank\">can be slow</a> since Mopidy has no official support for directly playing this list. Use CTRL to select multiple tracks and add them through the context menu to prevent Mopidy from hanging.</p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div id=\"tracklist\" infinite-scroll=\"getMoreTracks()\" infinite-scroll-distance=\"1\">\n" +
    "            <div class=\"row\" ng-repeat=\"track in tracks track by $index\" >\n" +
    "                <mopify-track track=\"track\" currentplayingtrack=\"currentPlayingTrack\" type=\"type\"> </mopify-track>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("player/controls/controls.left.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("player/controls/controls.left.tmpl.html",
    "<div class=\"row\">\n" +
    "    <div class=\"iconwrap\">\n" +
    "        <div class=\"col-xs-3\">\n" +
    "            <a href=\"#/music/tracklist/mopidy:current\"><i class=\"ss-icon ss-list\"></i></a>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-3\">\n" +
    "            <i class=\"ss-icon ss-navigateleft\" ng-click=\"prev();\"></i>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-3\">\n" +
    "            <i class=\"ss-icon {{ stateIcon }}\" ng-click=\"playpause();\"></i>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-3\">\n" +
    "            <i class=\"ss-icon ss-navigateright\" ng-click=\"next();\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("player/controls/controls.right.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("player/controls/controls.right.tmpl.html",
    "<div class=\"row\">\n" +
    "    <div class=\"iconwrap\">\n" +
    "        <div class=\"col-sm-2 col-xs-6\">\n" +
    "            <i class=\"ss-icon ss-shuffle\" ng-class=\"{ 'active': isRandom }\" ng-click=\"toggleShuffle();\"></i>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-2 col-xs-6\">\n" +
    "            <i class=\"ss-icon ss-repeat\" ng-class=\"{ 'active': isRepeat }\" ng-click=\"toggleRepeat();\"></i>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-8 hidden-xs\">\n" +
    "            <i class=\"ss-icon {{ volumeIcon }}\"></i>\n" +
    "            <div class=\"volumebar\" ng-click=\"volumebarMouseClick($event)\" ng-mousedown=\"volumebarMouseDown($event)\" ng-mouseup=\"volumebarMouseUp($event)\" ng-mousemove=\"volumebarMouseMove($event)\">\n" +
    "                <div class=\"outer\">\n" +
    "                    <div class=\"inner\" style=\"width: {{ volume }}%;\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("player/player.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("player/player.tmpl.html",
    "<div class=\"bgimage\">\n" +
    "    <img ng-src=\"{{ playerBackground }}\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\" ng-controller=\"PlayerControlsController\">\n" +
    "    <div class=\"controlwrap column left\"  ng-if=\"!mobiledisplay\">\n" +
    "        <ng-include src=\"'player/controls/controls.left.tmpl.html'\"></ng-include>\n" +
    "    </div>\n" +
    "    <div class=\"seekwrap column\" id=\"seekbar\">\n" +
    "        <a class=\"trackname\" href=\"#/music/tracklist/{{ albumUri }}\">\n" +
    "            <span class=\"title\">{{ trackTitle }}</span> <span class=\"delimiter\">-</span> <span class=\"artist\">{{ trackArtist }}</span>\n" +
    "        </a>\n" +
    "        <div ng-controller=\"PlayerSeekbarController\">\n" +
    "            <ng-include src=\"'player/seekbar/seekbar.tmpl.html'\"></ng-include>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"controlwrap column left\" ng-if=\"mobiledisplay\">\n" +
    "        <ng-include src=\"'player/controls/controls.left.tmpl.html'\"></ng-include>\n" +
    "    </div>\n" +
    "    <div class=\"controlwrap column right\">\n" +
    "        <ng-include src=\"'player/controls/controls.right.tmpl.html'\"></ng-include>\n" +
    "    </div>\n" +
    "    <div class=\"clearfix\"></div>\n" +
    "</div>");
}]);

angular.module("player/seekbar/seekbar.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("player/seekbar/seekbar.tmpl.html",
    "<div class=\"barwrap\">\n" +
    "    <div class=\"time\" id=\"passed\">{{ timeCurrent }}</div>\n" +
    "    <div class=\"bar\" ng-mouseup=\"seekbarMouseUp()\" ng-mousedown=\"seekbarMouseDown()\" ng-mousemove=\"seekbarMouseMove($event)\" ng-click=\"seekbarMouseClick($event)\" >\n" +
    "        <div class=\"outer\">\n" +
    "            <div class=\"inner\" style=\"width: {{ seekbarWidth }}%;\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"time\" id=\"total\">{{ timeTotal }}</div>\n" +
    "</div>");
}]);

angular.module("search/menu.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("search/menu.tmpl.html",
    "<div class=\"block row\" ng-controller=\"SearchMenuController\">\n" +
    "    <div class=\"content\" id=\"search\">\n" +
    "        <i class=\"ss-icon ss-search\"></i>\n" +
    "        <span class=\"inputwrap\" ng-class=\"{ 'focus': focused }\"><input type=\"text\" name=\"query\" ng-model=\"query\" ng-focus=\"focused = true\" ng-blur=\"focused = false\" placeholder=\"Search\" ng-keyup=\"typing($event)\" /></span>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("search/search.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("search/search.tmpl.html",
    "<div id=\"header\" ng-class=\"{ small: topresult.type == 'tracks', big: topresult.type != 'tracks' }\" style=\"background-image: url('./assets/images/discover-header.jpg');\">\n" +
    "    <div id=\"featured\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-8 col-md-offset-2\">\n" +
    "                <div class=\"title\" ng-hide=\"topresult.item.name === undefined\">\n" +
    "                    Top result: {{ topresult.item.name }}\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"playlist col-lg-4 col-md-8 col-sm-10 col-lg-offset-4 col-md-offset-2 col-sm-offset-1\">\n" +
    "                <div class=\"cover\" ng-hide=\"topresult.item.images === undefined\">\n" +
    "                    <img ng-src=\"{{ topresult.item.images[0].url }}\" />\n" +
    "                </div>\n" +
    "                <div class=\"details\" ng-class=\"{ 'fullwidth': topresult.item.images === undefined }\">\n" +
    "                    <div class=\"tracklist\">\n" +
    "                        <div class=\"row track\" ng-repeat=\"track in topresult.item.tracks\" ng-if=\"topresult.item.tracks\" >\n" +
    "                            <div class=\"col-xs-7 name\">\n" +
    "                                {{ track.name }}    \n" +
    "                            </div>\n" +
    "                            <div class=\"col-xs-5 artist\">\n" +
    "                                {{ track.artiststring }}\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"hoverwrap\">\n" +
    "                    <div class=\"iconwrap row\">\n" +
    "                        <div class=\"icon small col-xs-4\">\n" +
    "                            <a href=\"#/music/tracklist/{{ topresult.item.uri }}\"><i class=\"ss-icon ss-list\"></i></a>\n" +
    "                        </div>\n" +
    "                        <div class=\"icon col-xs-4\">\n" +
    "                            <i class=\"ss-icon ss-play\" ng-click=\"playTopItem()\"></i>\n" +
    "                        </div>\n" +
    "                        <div class=\"icon small col-xs-4\">\n" +
    "                            <i class=\"ss-icon ss-wifi\" ng-click=\"startTopItemStation()\"></i>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    \n" +
    "    <div class=\"pagetitle row\" ng-show=\"results.artists.items.length > 0\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Artists <span class=\"sub\">{{ query }}</span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 col-md-offset-3 alignright\">\n" +
    "            <div class=\"button white\" ng-click=\"searchLimitsToggle('artists')\">\n" +
    "                <span class=\"text\" ng-show=\"searchLimits.artists != 50\">Show more artists</span>\n" +
    "                <span class=\"text\" ng-show=\"searchLimits.artists == 50\">Show less artists</span>\n" +
    "                <i class=\"ss-icon ss-plus\" ng-show=\"searchLimits.artists != 50\"></i>\n" +
    "                <i class=\"ss-icon ss-hyphen\" ng-show=\"searchLimits.artists == 50\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\" id=\"searchresults\" ng-show=\"results.artists.items.length > 0\">\n" +
    "        <div id=\"tileview\" class=\"row\">\n" +
    "            <div ng-repeat=\"artist in results.artists.items | limitTo:searchLimits.artists\">\n" +
    "                <mopify-artist artist=\"artist\" class=\"col-lg-2 col-md-3 col-sm-4 col-xs-6 single-tile\"></mopify-artist>\n" +
    "                <div ng-if=\"($index + 1) % 6 == 0\" class=\"clearfix visible-lg-block\"></div>\n" +
    "                <div ng-if=\"($index + 1) % 4 == 0\" class=\"clearfix visible-md-block\"></div>\n" +
    "                <div ng-if=\"($index + 1) % 3 == 0\" class=\"clearfix visible-sm-block\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagetitle row\" ng-show=\"results.albums.items.length > 0\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Albums <span class=\"sub\">{{ query }}</span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 col-md-offset-3 alignright\">\n" +
    "            <div class=\"button white\" ng-click=\"searchLimitsToggle('albums')\">\n" +
    "                <span class=\"text\" ng-show=\"searchLimits.albums != 50\">Show more albums</span>\n" +
    "                <span class=\"text\" ng-show=\"searchLimits.albums == 50\">Show less albums</span>\n" +
    "                <i class=\"ss-icon ss-plus\" ng-show=\"searchLimits.albums != 50\"></i>\n" +
    "                <i class=\"ss-icon ss-hyphen\" ng-show=\"searchLimits.albums == 50\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\" id=\"searchresults\" ng-show=\"results.albums.items.length > 0\">\n" +
    "        <div id=\"tileview\" class=\"row\">\n" +
    "            <div ng-repeat=\"album in results.albums.items | limitTo:searchLimits.albums\">\n" +
    "                <mopify-album album=\"album\" class=\"col-lg-2 col-md-3 col-sm-4 col-xs-6 single-tile\"></mopify-album>\n" +
    "                <div ng-if=\"($index + 1) % 6 == 0\" class=\"clearfix visible-lg-block\"></div>\n" +
    "                <div ng-if=\"($index + 1) % 4 == 0\" class=\"clearfix visible-md-block\"></div>\n" +
    "                <div ng-if=\"($index + 1) % 3 == 0\" class=\"clearfix visible-sm-block\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagetitle row\" ng-show=\"results.tracks.length > 0\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Tracks <span class=\"sub\">{{ query }}</span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 col-md-offset-3 alignright\">\n" +
    "            <div class=\"button white\" ng-click=\"searchLimitsToggle('tracks')\">\n" +
    "                <span class=\"text\" ng-show=\"searchLimits.tracks != 50\">Show more tracks</span>\n" +
    "                <span class=\"text\" ng-show=\"searchLimits.tracks == 50\">Show less tracks</span>\n" +
    "                <i class=\"ss-icon ss-plus\" ng-show=\"searchLimits.tracks != 50\"></i>\n" +
    "                <i class=\"ss-icon ss-hyphen\" ng-show=\"searchLimits.tracks == 50\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\" id=\"searchresults\" ng-show=\"results.tracks.length > 0\">\n" +
    "        <div id=\"tracklist\" class=\"row\">\n" +
    "            <div ng-repeat=\"track in results.tracks | limitTo:searchLimits.tracks\">\n" +
    "                <mopify-track track=\"track\" surrounding=\"results.tracks\"> </mopify-track>\n" +
    "                <div ng-if=\"($index + 1) % 6 == 0\" class=\"clearfix visible-lg-block\"></div>\n" +
    "                <div ng-if=\"($index + 1) % 4 == 0\" class=\"clearfix visible-md-block\"></div>\n" +
    "                <div ng-if=\"($index + 1) % 3 == 0\" class=\"clearfix visible-sm-block\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagetitle row\" ng-show=\"results.playlists.items.length > 0\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Playlists <span class=\"sub\">{{ query }}</span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 col-md-offset-3 alignright\">\n" +
    "            <div class=\"button white\" ng-click=\"searchLimitsToggle('playlists')\">\n" +
    "                <span class=\"text\" ng-show=\"searchLimits.playlists != 50\">Show more playlists</span>\n" +
    "                <span class=\"text\" ng-show=\"searchLimits.playlists == 50\">Show less playlists</span>\n" +
    "                <i class=\"ss-icon ss-plus\" ng-show=\"searchLimits.playlists != 50\"></i>\n" +
    "                <i class=\"ss-icon ss-hyphen\" ng-show=\"searchLimits.playlists == 50\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\" id=\"searchresults\" ng-show=\"results.playlists.items.length > 0\">\n" +
    "        <div id=\"tileview\" class=\"row\">\n" +
    "            <div ng-repeat=\"playlist in results.playlists.items | limitTo:searchLimits.playlists\">\n" +
    "                <mopify-playlist playlist=\"playlist\" play=\"play(playlist)\" class=\"col-lg-2 col-md-3 col-sm-4 col-xs-6 single-tile\"></mopify-playlist>\n" +
    "                <div ng-if=\"($index + 1) % 6 == 0\" class=\"clearfix visible-lg-block\"></div>\n" +
    "                <div ng-if=\"($index + 1) % 4 == 0\" class=\"clearfix visible-md-block\"></div>\n" +
    "                <div ng-if=\"($index + 1) % 3 == 0\" class=\"clearfix visible-sm-block\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

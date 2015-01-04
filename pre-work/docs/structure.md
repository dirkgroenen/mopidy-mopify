Structure
=========
Since this is the first time I'm developing an application with AngularJS I'm trying to write down the Angular app's structure in this document. Feel free to give feedback on it since you've already stumbled up on this document.


####Directory structure
```
src/
  |- app/
  |  |- dashboard/
  |  |  |- [...]
  |  |
  |  |- discover/
  |  |  |- charts/
  |  |  |  |- [...]
  |  |  |- featured/
  |  |  |  |- [...]     
  |  |  |- newreleases/
  |  |  |  |- [...]
  |  |
  |  |- music/
  |  |  |- playlists/
  |  |  |  |- [...]
  |  |  |- stations/
  |  |  |  |- [...]
  |  |  |- history/
  |  |  |  |- [...]
  |  |  |- artist/
  |  |  |  |- albums/
  |  |  |  |  |- [...]
  |  |  |  |- biography/
  |  |  |  |  |- [...]
  |  |  |  |- related/
  |  |  |  |  |- [...]
  |  |  |- album/
  |  |  |  |- [...]
  |  |
  |  |- player/
  |  |  |- controls/
  |  |  |  |- [...]
  |  |  |- seekbar/
  |  |  |  |- [...]
  |  |
  |  |- search/
  |  |  |- [...]
  |  |
  |  |- services/
  |  |  |- mopidyservice.js
  |  |  |- spotifyservice.js
  |  |  |- echonestservice.js
  |  |
  |  |- widgets/ 
  |  |  |- artist.js
  |  |  |- album.js
  |  |  |- [...]
  |  |
  |  |- settings/
  |  |  |- [...]
  |  |
  |  |- app.js
  |  |- [...]
```

Almost every directory contains three files by default:
 - {name}.tmpl.html
 - {name}.controller.js 
 - {name}.test.js (for later implementation, maybe)

/*:::::::::::::::::::::::::::::::::::::::: Vibe Check Legacy.js */

/*———————————————————————————————————————— notes

  updated to allow new Illustrator SVG format

  https://www.toptal.com/developers/javascript-minifier

  github.com/svijalove/vibe
  
  ©Svija SAS, Cusset France

  When there are two elements with the same name, it's just
  debug, debug-2 for id

  empty layers are not included in SVG, so can't
  create empty layer for debug */

/*———————————————————————————————————————— EULA

    Copyright (c) Svija

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.
    
    The software is provided "as is", without warranty of any kind, express or
    implied, including but not limited to the warranties of merchantability,
    fitness for a particular purpose and noninfringement. In no event shall the
    authors or copyright holders be liable for any claim, damages or other
    liability, whether in an action of contract, tort or otherwise, arising from,
    out of or in connection with the software or the use or other dealings in
    the software.

    svija.com · hello@svija.com*/


//:::::::::::::::::::::::::::::::::::::::: initialization

var version = '1.0.26'

/*———————————————————————————————————————— start timer */

const d3 = new Date()
let start_time2= d3.getTime()

/*———————————————————————————————————————— version check

    [data-name] is 27.0-28.5
    [id*="_x2F_"] is 28.6+        */

var valid   = true
var allSvgs = document.getElementsByTagName('svg')

for (var x=0; x<allSvgs.length; x++){

  var svgId = allSvgs[x].id
  if (svgId.slice(0,4) == 'svg_') svgId = svgId.substr(4)

  var stem = "[id*='_x2F_']"

  var newStyle = Array.from(allSvgs[x].querySelectorAll(stem)).length

  if (newStyle != 0){
    valid = false
    break
  }

}

/*———————————————————————————————————————— messages 

    right now, if any element of the page contains a data-name
    it is considered as 28 or newer

    but if there are conflicting elements, it should be alerted

    I have a way to say: there is at least one element of 28+
    and I need a way to know if there is at least one element of 27- */

var   msg = 'Incompatible SVG: xxx\n\n'
          + 'Illustrator 28.6 or later detected:\n\n'
          + '• resave your AI files with Illustrator 28.5 or earlier.\n\n'
          + '• or change Svija Vibe version in Svija Cloud/Script Sets '
          + '& change Cloud Component version in Svija Cloud/Components.'

var msgFr = 'SVG Incompatible : xxx\n\n'
          + 'Illustrator 28.6 ou plus récent detecté :\n\n'
          + '• resauvegardez vos fichiers AI files avec '
          + 'Illustrator 28.5 ou plus ancien.\n\n'
          + '• ou changer la version de Svija Vibe dans '
          + 'Svija Cloud/Script Sets et changer la version de '
          + 'Cloud Component dans Svija Cloud/Components.'

if (isFrench()) msg = msgFr

/*———————————————————————————————————————— alert */

if (!valid) alert(msg.replace('xxx', svgId))

/*———————————————————————————————————————— end timer */

const d4 = new Date()
let end_time2 = d4.getTime()

//alert((end_time2-start_time2)+'ms elapsed')


//:::::::::::::::::::::::::::::::::::::::: functions

/*———————————————————————————————————————— isFrench() */

function isFrench(){
  if (typeof navigator.language != 'undefined'){
    if (navigator.language.substr(0,2) == 'fr') return true
  }
  return false
}


//:::::::::::::::::::::::::::::::::::::::: fin


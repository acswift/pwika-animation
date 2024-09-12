
/*:::::::::::::::::::::::::::::::::::::::: Vibe x2F Check.js */

/*———————————————————————————————————————— notes

  compatible AI 28.6 & later
  compatible AI 28.4.0 & earlier (with earlier Tools)

  https://www.toptal.com/developers/javascript-minifier

  github.com/svijalove/vibe
  
  ©Svija SAS, Cusset France */

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

var version = '1.0.27'

/*———————————————————————————————————————— start timer */

const d3 = new Date()
let start_time2= d3.getTime()

/*———————————————————————————————————————— version check

    [data-name] is 27.0-28.5
    [id*="x2F"] is 28.6+

    ai28.6

<rect id="mouse_x2F_name9_x2F_n" class="cls-4" x="180" y="970" width="400" height="40"/>
<g id="mouse_events">

    ai27.0

<rect id="mouse_name9_n" data-name="mouse/name9/n" class="cls-13" x="180" y="970" width="400" height="40"/>
<g id="mouse_events" data-name="mouse events">


    ai 28.5

<rect id="mouse_name9_n" data-name="mouse/name9/n" class="cls-3" x="180" y="970" width="400" height="40"/>
<g id="mouse_events" data-name="mouse events"> */

var valid   = true
var allSvgs = document.getElementsByTagName('svg')

for (var x=0; x<allSvgs.length; x++){

  var svgId = allSvgs[x].id
  if (svgId.slice(0,4) == 'svg_') svgId = svgId.substr(4)

  //———————————————————— exclude files with _x2F_ in ID

  var stem = "[id*='_x2F_']"
  var occurences = Array.from(allSvgs[x].querySelectorAll(stem)).length
  if (occurences > 0) continue

  //———————————————————— if data-name contains a slash but ID does
  //———————————————————— not have _x2F_ then it's old style

  var stem = "[data-name*='/']"

  var objArray = Array.from(allSvgs[x].querySelectorAll(stem))
  if (objArray.length > 0){
    var objID = Array.from(allSvgs[x].querySelectorAll(stem))[0].id
  
    if (objID.indexOf('_x2F_') < 0){
      valid = false
      break
    }
  }
}

/*———————————————————————————————————————— messages */

var   msg = 'Incompatible File\n\n'
          + 'SVG "xxx" is of format "Data Name"\n\n'
          + 'Visit tech.svija.love and search for "x2f".'

var msgFr = 'Fichier Incompatible\n\n'
          + 'SVG "xxx" est de format "Data Name"\n\n'
          + 'Visiter tech.svija.love et chercher "x2f".'


if (isFrench()) msg = msgFr

/*———————————————————————————————————————— alert */

if (!valid) alert(msg.replace('xxx', svgId))

/*———————————————————————————————————————— end timer
    */

const d4 = new Date()
let end_time2 = d4.getTime()

//alert((end_time2-start_time2)+'ms elapsed')


//:::::::::::::::::::::::::::::::::::::::: functions

/*———————————————————————————————————————— isFrench()

    */

function isFrench(){
  if (typeof navigator.language != 'undefined'){
    if (navigator.language.substr(0,2) == 'fr') return true
  }
  return false
}


//:::::::::::::::::::::::::::::::::::::::: fin


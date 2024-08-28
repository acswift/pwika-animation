
/*:::::::::::::::::::::::::::::::::::::::: Vibe Check.js 1.0.27 */

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

    [data-name] is 28.4.1-28.5
    [id*="x2F"] is 28.4- & 28.6+ */

var valid   = true
var allSvgs = document.getElementsByTagName('svg')

for (var x=0; x<allSvgs.length; x++){
  var id = allSvgs[x].id
  if (id.slice(0,4) == 'svg_') id = id.substr(4)

  // mouse links
  var stem = "[id^='mouse']"
  var oldStyle = Array.from(allSvgs[x].querySelectorAll(stem)).length

  var stem = "[id^='mouse_x2F_']"
  var newStyle = Array.from(allSvgs[x].querySelectorAll(stem)).length

  if (oldStyle != newStyle) valid = false; break

  // scroll links
  var stem = "[id^='scroll']"
  var oldStyle = Array.from(allSvgs[x].querySelectorAll(stem)).length

  var stem = "[id^='scroll_x2F_']"
  var newStyle = Array.from(allSvgs[x].querySelectorAll(stem)).length

  if (oldStyle != newStyle) valid = false; break

  // time links
  var stem = "[id^='time']"
  var oldStyle = Array.from(allSvgs[x].querySelectorAll(stem)).length

  var stem = "[id^='time_x2F_']"
  var newStyle = Array.from(allSvgs[x].querySelectorAll(stem)).length

  if (oldStyle != newStyle) valid = false; break
}

/*———————————————————————————————————————— messages */

var   msg = 'Incompatible SVG: xxx\n\n'
          + 'Illustrator 28.5 or earlier detected:\n\n'
          + '• resave your AI files with Illustrator 28.6 or later.\n\n'
          + '• or change Svija Vibe version in Svija Cloud/Script Sets & change Cloud Component version in Svija Cloud/Components.'

var msgFr = 'SVG Incompatible : xxx\n\n'
          + 'Illustrator 28.5 ou plus ancien detecté :\n\n'
          + '• resauvegardez vos fichiers AI files avec Illustrator 28.6 ou plus récent.\n\n'
          + '• ou changer la version de Svija Vibe dans Svija Cloud/Script Sets et changer la version de Cloud Component dans Svija Cloud/Components.'

if (isFrench()) msg = msgFr

/*———————————————————————————————————————— alert */

if (!valid) alert(msg.replace('xxx', id))

/*———————————————————————————————————————— end timer
    */

const d4 = new Date()
let end_time2 = d4.getTime()

// alert((end_time2-start_time2)+'ms elapsed')


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



/*:::::::::::::::::::::::::::::::::::::::: Vibe Check 1.0.26.js */

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

/*———————————————————————————————————————— version check */

var valid   = true

var oldStyle = null !== document.querySelector('[id*="x2F"]')

if (oldStyle) valid = false

/*———————————————————————————————————————— messages 

    right now, if any element of the page contains a data-name
    it is considered as 28 or newer

    but if there are conflicting elements, it should be alerted

    I have a way to say: there is at least one element of 28+
    and I need a way to know if there is at least one element of 27- */

var msg   = 'Compatibility Issue\n'
          + 'Content created with Illustrator 27 or earlier.\n'
          + 'Svija Vibe ' + version + ' requires Adobe Illustrator 28 or later.\n\n'
          + 'See Svija Cloud › Script Sets › Svija Vibe'

var msgFr = 'Problème de compatibilité\n'
          + 'Contenu créé avec Illustrator 27 ou plus ancien.\n'
          + 'Svija Vibe ' + version + ' requiert la version 28 ou plus récente.\n\n'
          + 'Voir Svija Cloud › Script Sets › Svija Vibe'

if (isFrench()) msg = msgFr

/*———————————————————————————————————————— alert  */

if (!valid) alert(msg1)

/*———————————————————————————————————————— end timer */

const d4 = new Date()
let end_time2 = d4.getTime()

alert((end_time2-start_time2)+'ms elapsed')


//:::::::::::::::::::::::::::::::::::::::: functions

/*———————————————————————————————————————— isFrench() */

function isFrench(){
  if (typeof navigator.language != 'undefined'){
    if (navigator.language.substr(0,2) == 'fr') return true
  }
  return false
}


//:::::::::::::::::::::::::::::::::::::::: fin


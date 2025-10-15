//:::::::::::::::::::::::::::::::::::::::: Anchor Links Program.js

/*———————————————————————————————————————— notes

   Version 1.0.27

    This version integrates an ease function to make the scrolling
    look much nicer.
    
    NOTE: this program won't work if pages are wider than screen
    because it scrolls to the left each time */

/*———————————————————————————————————————— parameters in Svija Cloud

// length in seconds of movement

var totalTime = 1.5                                                                 

// frames per second of movement

var fps = 60    */

//———————————————————————————————————————— initialization

var totalIntervals = totalTime * fps
var stepInterval   = 1000 / fps
    stepInterval   = Math.round(stepInterval)

//———————————————————————————————————————— execution

function anchorLinks(px){
  var oldTop = 0 - document.body.getBoundingClientRect().top
  var newTop = px * aiPixel
  var totalDist = newTop - oldTop

  setTimeout(anc_recursive, stepInterval, stepInterval, totalIntervals, 0, oldTop, totalDist)
}


//:::::::::::::::::::::::::::::::::::::::: functions

/*———————————————————————————————————————— anc_recursive(stepInterval, totalIntervals, totalDist, oldTop, whichInterval)

    given:

    • information to call itself
    • a starting point & total distance

    will calculate a scroll step using an ease function */

function anc_recursive(stepInterval, totalIntervals, whichInterval, oldTop, totalDist){

  var input = whichInterval / totalIntervals
  var multiplier = anc_ease(input)
  var newTop = oldTop + totalDist * multiplier

  anc_scroll(newTop)

  whichInterval += 1
  if (whichInterval < totalIntervals)
    setTimeout(anc_recursive, stepInterval, stepInterval, totalIntervals, whichInterval, oldTop, totalDist)

  else if (oldTop+totalDist != newTop){
    var difference = Math.abs(oldTop+totalDist-newTop)

 // console.log('difference: '+(oldTop+totalDist-newTop))
    if (difference > 1)
      setTimeout(anc_recursive, 15, stepInterval, totalIntervals, whichInterval, oldTop, totalDist)
  }

}

/*———————————————————————————————————————— anc_scroll(px)

    scrolls to a given spot
    scrolls far left as well */

function anc_scroll(px){
  var current = 0 - document.body.getBoundingClientRect().top
  px = Math.round(px)
  if (px != current){
//  console.log(px)
    window.scrollTo(0, px)
  }
}

/*———————————————————————————————————————— anc_ease(num)

    https://www.desmos.com/calculator
    see \"Anchor Links Equation.jpg\" in repo

    equation to return s-curve from 0-1:

    y = 1- (1/ 2** ((x-0.5)*20))


    modify 20 to adjust steepness:

    15 less steep
    50 very steep

    ** means exponent

    this has been tested and returns 0 for 0 and 1 for 1
*/

function anc_ease(num){
  var raw = 1-   1/(1+ 2** ((num-0.5)*15))
  return raw
}

// alert(anc_ease(0) +':'+ anc_ease(1))


//:::::::::::::::::::::::::::::::::::::::: fin

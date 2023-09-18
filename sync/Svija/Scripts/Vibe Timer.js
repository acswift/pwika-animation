
/*:::::::::::::::::::::::::::::::::::::::: Vibe Timer.js 1.0.23

https://www.toptal.com/developers/javascript-minifier

*/

setInterval(vibeAugment, 200)

function vibeAugment(){
  var newTime = +vibeTimer.value + 0.2
  vibeTimer.value = fourDigits(newTime)
}

function fourDigits(x){

       if (x<10 ) var left = '00'
  else if (x<100) var left = '0'
  else            var left = ''

  return left + x.toFixed(1)
}
/*
fourDigits(0.2) // 0:2
fourDigits(1.2) // 1:1.999999999
fourDigits(120) // 120:0 */

//:::::::::::::::::::::::::::::::::::::::: fin


/*:::::::::::::::::::::::::::::::::::::::: Cloud Module.js

    https://www.toptal.com/developers/javascript-minifier

    generates links to:
    - the page settings in Svija Cloud
    - a mobile version of the page */

//———————————————————————————————————————— ▼ begin program:{

program:{

if (typeof admin == 'undefined') break program
if (       admin != true       ) break program

cloudModule.style.display = 'block'

//———————————————————————————————————————— ▲ end program

}


//:::::::::::::::::::::::::::::::::::::::: main functions

/*———————————————————————————————————————— func_cloudModuleLink()

    only used for pages, to go directly to the page being
    visited  — modules & fonts are just regular links */

function func_cloudModuleLink(){
  window.open("/cloud/svija/page/"+page_pk+"/change/", '_blank')
}

/*———————————————————————————————————————— func_cloudMobileLink()

    used to redirect to mobile or desktop on the opposite
    platform. cookieName is a supplied variable

    cloudForce is used by templates/svija/js/screens.js
    to NOT redirect if used */

function func_cloudForceLink(code){
  code = convertCode(code)

  var name = cookieName('cloudModule', svija_version)

  setCookie(name, 'true')
  setCookie('screen_code', code, 7)

  window.location.replace(document.URL)
}


//:::::::::::::::::::::::::::::::::::::::: utility functions

/*———————————————————————————————————————— convertCode(code)

    the module sends either mb or cp, and doesn't know
    if it's really mobile or ordinateur or 1200 etc.

    in system js:

    var all_screens = [[0, "1200"], [700, "300"]]; */

// need if it's cp I look for 0 else teh other one

function convertCode(code){
  if (all_screens[0][0] == 0){
    var cpCode = all_screens[0][1]
    var mbCode = all_screens[1][1]
  }
  else{
    var cpCode = all_screens[1][1]
    var mbCode = all_screens[0][1]
  }

  if (code == 'mb') return mbCode
  else return cpCode
  
}


//:::::::::::::::::::::::::::::::::::::::: fin

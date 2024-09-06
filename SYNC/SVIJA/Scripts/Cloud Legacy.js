/*:::::::::::::::::::::::::::::::::::::::: Cloud Module Legacy.js

/*———————————————————————————————————————— notes

    https://www.toptal.com/developers/javascript-minifier

    Cloud Component contains 5 links:

    1. logo        mouse/cloudModuleLink/n          /cloud/svija/
    2. pages       mouse/cloudModuleLink/n/func
    3. components  mouse/cloudModuleLink/n          /cloud/svija/module/
    4. fonts       mouse/cloudModuleLink/n          /cloud/svija/font/
    5. mobile      mouse/cloudForceLink/func/mb

    this script handles the PAGES and MOBILE link */

/*———————————————————————————————————————— show if admin */

program:{

if (typeof admin != 'undefined')
  if (admin == true )
    cloudModule.style.display = 'block'

}


//:::::::::::::::::::::::::::::::::::::::: main functions

/*———————————————————————————————————————— page link

    only used for pages, to go directly to the page being
    visited  — modules & fonts are just regular links */

function func_cloudModuleLink(){
  window.open("/cloud/svija/page/"+page_pk+"/change/", '_blank')
}

/*———————————————————————————————————————— mobile/desktop link

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

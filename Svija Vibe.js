
//:::::::::::::::::::::::::::::::::::::::: Svija Vibe.js

/*———————————————————————————————————————— notes

  Svija Vibe 1.0.11

  github.com/svijalove/animation
  
  ©2022 Svija SAS, Cusset France */

/*———————————————————————————————————————— EULA

    Copyright (c) 2023 Svija

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

//———————————————————————————————————————— start timer

const d1 = new Date();
let start_time = d1.getTime();

//———————————————————————————————————————— separator · types of triggers and events

const     separator = '_x2F_'; // regular slash

const trigger_types = [ 'mouse', 'time', 'scroll' ];
const   event_types = [ 'click', 'over',  'away',  'ovaway', 'press', 'down', 'toggle', 'delay', 'point', 'zone', 'scrub' ];

//———————————————————————————————————————— conversion dictionaries

const entity_conversion = {
  'x002D': '-',
  'x2F'  : '/',
  'x2B'  : '+',
  'x25'  : '%',
  'x3C'  : '<',
  'x3E'  : '>',
  'x2C'  : ','
};

const trigger_flag_value_to_key = {

  // name & kind are given

  // trigger flags
  'func'  : 'func'       , // no value
  'a'     : 'cursor'     , // no value
  'h'     : 'cursor'     , // no value
  'i'     : 'cursor'     , // no value
  'n'     : 'blank'      , // no value

}

const cursors = {
  'a'           : 'default',
  'h'           : 'pointer',
  'i'           : 'text',
  'default_link': 'pointer'
}

const trigger_flag_value_to_key_value = {
  'a'   : 'a',
  'h'   : 'h',
  'i'   : 'i',
  'func': true,
  'n'   : true
}

const flag_length = { 

  // so we can get value from end of flag
  // # of characters, value follows

  'blank'      : 0,
  'cursor'     : 0,
  'delay'      : 1,
  'ease'       : 0,
  'func'       : 0,
  'handoff'    : 5,
  'order'      : 0,
  'origin'     : 1,
  'rotate'     : 1,
  'transpFinal'  : 1,
  'xmove'      : 1,
  'ymove'      : 1,
  'scale'      : 1,
  'xscale'     : 2,
  'yscale'     : 2,

}

const eases = {
  'softin' : Power1.easeIn,
  'softout': Power1.easeOut,
  'soft'   : Power1.easeInOut,
  'hard'   : 'none' 
}

const fromtos = {
  '>' : 'to',
  '<' : 'from'
}

//———————————————————————————————————————— defaults

const trigger_defaults = {

  'func'       : false,
  'link'       : false,
  'blank'      : false

}

const time_trigger_default = 5.0;

const event_defaults = {
  'delay'   : 5.0, // only for time/delay anims
  'duration': 0.5,
  'fromto'  : 'to' 
}


//:::::::::::::::::::::::::::::::::::::::: model definitions

//———————————————————————————————————————— class Animation

// https://www.w3schools.com/js/js_classes.asp

var animations = {}   // Animations
var functions  = []   // mouse functions called by func flag

class Animation{

  constructor( name, triggers, evnt ){

    this.name     = name;     // 20-character string
    this.triggers = triggers; // array of trigger_types
    this.evnt     = evnt;     // array of event_types
  }

  add_trigger(obj, kind, flags){ //—————————————————————————————————————————————

    // initialize

    var zoopy  = new Trigger;
    zoopy.obj  = obj;
    zoopy.kind = kind;

    if (zoopy.kind == 'mouse') set_existence(zoopy.obj, true);

    // set defaults

    Object.keys(trigger_defaults).forEach(
      key => { zoopy[key] = trigger_defaults[key]; }
    );
     
    if (kind=='time') zoopy['delay'] = time_trigger_default;

    for(var x=2; x<flags.length; x++){ //————————————————————————————— loop through flags (kind|name|parameters...)

      // determine flag key from value
      // entity conversion not necessary for trigger_types

      // get correct key
      var val = flags[x];

      if (not_number(val))
        var key = trigger_flag_value_to_key[val];
      else if (kind == 'time') var key = 'delay';

      if (kind=='time' && key=='delay') zoopy[key] = 1 * val; 
      else if (key=='func') {
        zoopy.func = true;
        zoopy.args = [];
        for (var y=x+1; y<flags.length; y++)
          zoopy.args.push(decodeEntities(flags[y]));
        x = 1000; // get out of loop — no other flags can follow func
      }
      else{
        var v = trigger_flag_value_to_key_value[val];
        if (val == '')
          errLog('Extra slash',  obj);
        else if (typeof v == 'undefined')
          errLog('Unknown flag "' + val + '"', obj);
        else zoopy[key] = v;
      }

    } //—————————————————————————————————————————————————————————————————————-

    // set link & parent target
 
    zoopy.link = obj.parentNode.hasAttribute('xlink:href'); // true false

    if (zoopy.link && zoopy.blank)
      zoopy.obj.parentNode.setAttribute("target", "_blank");

    if (typeof this.triggers == 'undefined') this.triggers = [];
    this.triggers.push(zoopy);

  }

  add_event(obj, kind, objId){

    // initialize
    var flags     = objId.slice(2)
    var flagLen   = flags.length
    var zoopy     = new Evnt
    zoopy.obj     = obj
    zoopy.kind    = kind
    zoopy.name    = this.name

    // create dictionary zoopy[key] = flag value

    for(var x=0; x<flags.length; x++){

      var flag = flags[x]

      if (flag.indexOf('_') > -1) flag = convertEntities(flag)

      var key = this.event_key_from_flag(flag, obj)

      if (typeof zoopy[key] == 'undefined')
          zoopy[key] =  this.get_flag_val(key, flag, obj)
      else
          errLog('Duplicate "'+key+'" flag ignored', zoopy.obj)

    }

    // set default fromto

    if (typeof zoopy.fromto=='undefined') zoopy.fromto = event_defaults.fromto

    /* set transparency · see logic spreadsheet

    display is set to none by CSS
    needs to be updated here for initially-visible objects

    docs.google.com/spreadsheets/d/1wq1By47vzXZzdvb6JZS3AqR8mhwZ3c2ZSoF0eR1m25Y/edit#gid=1328156795 */

//  toggle_x2F_trigger1_x2F__x25_200_x2F_o50_x2C_0_x2F_2_x2F_hard.style.display = 'block'; alert(262); // works
//  obj.style.display = 'block'; alert(264); // broken

//  var nutsId = String(obj.id);                    // toggle_x2F_trigger1_x2F__x25_200_x2F_o50_x2C_0_x2F_2_x2F_hard
//  var nuts = document.getElementById(nutsId);     // broken
//  nuts.style.display = 'block'; alert(267+'*');   // broken


//  var nuts = document.getElementById('toggle_x2F_trigger1_x2F__x25_200_x2F_o50_x2C_0_x2F_2_x2F_hard'); // this works
//  nuts.style.display = 'block'; alert(270);                                                            // this works

//toggle_x2F_trigger1_x2F__x25_200_x2F_o50_x2C_0_x2F_2_x2F_hard.style.display = 'block'; alert(269); // works

    var transCurrent = window.getComputedStyle(obj).getPropertyValue('opacity')
// toggle_x2F_trigger1_x2F__x25_200_x2F_o50_x2C_0_x2F_2_x2F_hard.style.display = 'block'; alert(264); // broken

    var isVisible    = transCurrent != '0'
    var noFlag       = typeof zoopy['transpFinal'] == 'undefined'
    var isTransform  = containsTransform(zoopy)

    if (noFlag && !isVisible){  // lines 3-5 √
      zoopy['transpInit' ] = 0
      zoopy['transpFinal'] = 1
    }

    else if (noFlag && isVisible && !isTransform){  // lines 7-8 √
      zoopy['transpInit' ] = 0
      zoopy['transpFinal'] = transCurrent
      zoopy.obj.style.opacity = 0
      zoopy.obj.style.display = 'none'
    }

    else if (noFlag && isVisible && isTransform){  // line 10 √
      zoopy.obj.style.display = 'block'
    }

    else if (!isVisible && zoopy['transpFinal'] == 0) // lines 12-13 √
      errLog('Transparent object has "t0" flag', obj)

    else if (zoopy['transFinal'] == 0){     // lines 15-16
      zoopy['transpInit' ] = transCurrent
    }

    else if (!noFlag){                      // lines 18-20
      zoopy['transpInit' ] = transCurrent
      zoopy.obj.style.display = 'block'
    }

    //—————————————————————————————— sumpn sumpn
    if (zoopy.fromTo == '>')
      zoopy.obj.style.opacity = zoopy.transInit
    else
      zoopy.obj.style.opacity = zoopy.transFinal

    // set default duration
    if (typeof zoopy.duration=='undefined')
      zoopy.duration= event_defaults.duration;
    else zoopy.duration = 1 * zoopy.duration;

    // convert rotation to number
    if (typeof zoopy.rotation != 'undefined')
      zoopy.rotation = 1 * zoopy.rotation;

    // convert delay to number
    if (typeof zoopy.delay!='undefined')
      zoopy.delay= 1 * zoopy.delay;

    // scrub event_types default to hard ease
    if (zoopy.kind == 'scrub' && typeof zoopy.ease == 'undefined')
      zoopy.ease = 'none';

    // add to evnt array
    if (typeof this.evnt == 'undefined') this.evnt = []
    this.evnt.push(zoopy)
    

  }

  set_cursor(){
  
    for (var t=0; t<this.triggers.length; t++){

      if (typeof this.triggers[t].cursor != 'undefined')
        this.triggers[t].obj.style.cursor = cursors[this.triggers[t].cursor];
  
      else{
        var is_hand = false;
  
        if (this.triggers[t].link ) is_hand = true;
        if (this.triggers[t].func ) is_hand = true;
        if (this.kind == 'click' ) is_hand = true;
        if (this.kind == 'down'  ) is_hand = true;
        if (this.kind == 'toggle') is_hand = true;

        if (is_hand){
          this.triggers[t].obj.style.cursor = cursors['default_link'];
        }
      }
    }
  
  }

  activate_func_flag(){

    // https://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string
    // https://www.geeksforgeeks.org/how-to-call-function-from-it-name-stored-in-a-string-using-javascript/

    for (var x=0; x<this.triggers.length; x++){
      if (!this.triggers[x].func) continue;

      var args = this.triggers[x].args;

      functions[this.name] = window['func_'+this.name];

      /* only create if necessary (could have been created on previous pass if
         a single trigger calls several events */

      if (typeof functions[this.name] == 'undefined')
        errLog('Function func_'+this.name+' not found.', this.triggers[x].obj);

      else switch (this.triggers[x].kind) {
        case 'mouse' :    mouse_trigger_funcs(this.name, this.triggers[x], args); break;
        case 'time'  :   time_trigger_funcs(this.name, this.triggers[x], args); break;
        case 'scroll': scroll_triggers_funcs(this.name, this.triggers[x], args); break;

        default:
          log('⚠️ unimplemented trig kind: "'+animations[name].triggers[0].kind+'" in animation "'+animation.name+'"');
      }
    }
  }

  delete_if_no_event(){
    for (var t=0; t<this.triggers.length; t++){
      if (typeof this.evnt == 'undefined')
        if (!this.triggers[t].func && !this.triggers[t].link){
          errLog('Trigger with no event, link or function', this.triggers[t].obj);
          delete animations[this.name];
        }
    }
    
    return true;
  }

  flagDump(){
    console.group('animation ' + this.name + ':');

    Object.keys(this).forEach(key => {
      if (typeof this[key] != 'undefined')
        if (key=='name') log(key+' ('+typeof(this[key])+'): '+this[key]);
        else log(key+' ('+typeof(this[key])+'): '+this[key].length+' object(s)');
    });

    for (var t=0; t<this.triggers.length; t++){
      log('\nTrigger['+t+']');
      Object.keys(this.triggers[t]).forEach(key => {
        if (typeof this.triggers[t][key] != 'undefined')
          if(key=='obj')log('obj (object): '+convertEntities(this.triggers[t][key].id));
          else log(key+' ('+typeof(this.triggers[t][key])+'): '+this.triggers[t][key]);
      });
    }

    if (typeof this.evnt != 'undefined'){
      for (var x=0; x<this.evnt.length; x++){
        log('\nEvnt[' + x + ']');
        Object.keys(this.evnt[x]).forEach(key => {
          if (typeof this.evnt[x][key] != 'undefined')
            if(key=='obj')log('obj (object): '+convertEntities(this.evnt[x][key].id));
            else log(key+' ('+typeof(this.evnt[x][key])+'): '+this.evnt[x][key]);
        });
      }
    }
    
    console.groupEnd();
  }

  event_key_from_flag(flag, obj){

/*   should return key & flag w/o key
     rename to split_key_flag
     https://stackoverflow.com/a/2917186  for how to do it

     is programmed specifically to optimize key finding
     needs to be updated when flags are modified  */

    switch(flag){
      case 'softout': return 'ease'    // whole flag
      case 'softin' : return 'ease'
      case 'soft'   : return 'ease'
      case 'hard'   : return 'ease'
      case '>'      : return 'fromto'
      case '<'      : return 'fromto'
    
    }

    switch(flag.slice(0,3)){
      case '+x%'   : return 'xscale'    // first 3 chars
      case '-x%'   : return 'xscale'
      case '+y%'   : return 'yscale'
      case '-y%'   : return 'yscale'
    }

    switch(flag.slice(0,2)){
      case '+x'    : return 'xmove'     // first 2 chars
      case '-x'    : return 'xmove'
      case '+y'    : return 'ymove'
      case '-y'    : return 'ymove'
      case 'x%'    : return 'xscale'
      case 'y%'    : return 'yscale'
      case '+%'    : return 'scale'
      case '-%'    : return 'scale'
    }

    switch(flag.slice(0,1)){
      case '%'    : return 'scale'      // first 1 char
      case '<'    : return 'rotate'
      case 'd'    : return 'delay'
      case 'o'    : return 'origin'
      case 't'    : return 'transpFinal'
//    case 'x'    : return 'xmove'
//    case 'y'    : return 'ymove'
    }

    if (flag.slice(-1) == '>')    return 'rotate'    // /130> rotation clockwise
    if (parseFloat(flag) == flag) return 'duration'  // integer means duration

    if (flag != '')
      errLog('Unknown flag "' + flag + '"', obj)
    else
      errLog('Extra slash', obj)

    return null 
  }

  get_flag_val(key, flag, obj){
    var flag_len = flag_length[key];
  
    if (key=='ease')   return eases[flag];
    if (key=='fromto') return fromtos[flag];
    if (flag_len == 0) return flag;
    if (key=='origin') return convert_origin(flag);

    if (key=='rotate')
      if (flag.slice(-1)=='>') return flag.slice(0, flag.length-1);
      else return 0-flag.slice(1, flag.length);
  
    if (key=='transpFinal'){
       var v = flag.substr(flag_len)/100;
       return v;
    }

    if (key=='xmove' || key=='ymove')
      if (flag.slice(0,1)=='-')           // -x200
        return 0-1*flag.substr(flag_len+1);
      else if (flag.slice(0,1)=='+')      // +x200
        return flag.substr(flag_len+1);
      else return flag.substr(flag_len);  //  x200
  
    if (key=='scale' || key=='xscale' || key=='yscale'){
      var rest;

      if (flag.slice(0,1)=='-')                 // -%200, -x%200
        rest = (0-flag.substr(flag_len+1))/100;

      else if (flag.slice(0,1)=='+')            // +%200, +x%200
        rest = (flag.substr(flag_len+1)/100);

      else rest = (flag.substr(flag_len)/100);  //  %200, x%200

      if (!isNaN(rest)) return rest
      else{
        errLog('Invalid scaling factor', obj)
        return 1
      }
    }

    return flag.substr(flag_len);
  }

}


//———————————————————————————————————————— class Trigger

class Trigger{

  constructor( name, obj, kind, cursor, func, args, link, blank, delay ){

    this.name       = name;         // 20-character string
    this.obj    = obj;      // object reference
    this.kind       = kind;         // string · kind of trig                    scroll, mouse, time 

    // flags
    this.cursor     = cursor;       // string · cursor on pointerover              a, h, t (arrow, hand, text)
    this.func       = func;         // boolean · calls function of same name     onclick only 
    this.args       = args;         // array · args passed to function           all flags following name
    this.link       = link;         // boolean · is an SVG link                  programmatically
    this.blank      = blank;        // boolean · link target is _blank           n
    this.delay      = delay;        // number of seconds before activation (time trig)
  }
}

//———————————————————————————————————————— class Evnt

class Evnt{

  constructor( name, obj, kind, delay, handoff, handwait, duration, ease,
               xmove, ymove, origin, rotate, scale, xscale, yscale, transpFinal, transpInit ){

    this.name        = name;         // 20-character string
    this.obj         = obj;          // object reference
    this.kind        = kind;         // string · kind of evnt                  click, over, down, away, ovaway, down, toggle, visible

    // flags
    this.delay       = delay;        // number · seconds before animation starts
    this.handoff     = handoff;      // string · following animation
    this.handwait    = handwait;     // number · seconds before calling following animation

    // GSAP-related flags
    this.duration    = duration;     // number · duration in seconds             34.5 (1st number)
    this.ease        = ease;         // animation ease                           in, out, inout, noease
    this.xmove       = xmove;        // x movement                               x-30
    this.ymove       = ymove;        // y movement                               y+25
    this.origin      = origin;       // origin point                             o0,0 to o100,100
    this.rotate      = rotate;       // number · rotation                        >20 or <45.5
    this.scale       = scale;        // number · percentage to scale             %150
    this.xscale      = xscale;       // number · percentage to scale x           x%20
    this.yscale      = yscale;       // number · percentage to scale y           y%30
    this.transpFinal   = transpFinal;    // number · percentage transpFinal            o30
    this.transpInit = transpInit;  // number · transpInit/transpFinal           programmatically
  }
}


//:::::::::::::::::::::::::::::::::::::::: program

//———————————————————————————————————————— ▼ start logging

console.groupCollapsed('Svija Vibe');

/*———————————————————————————————————————— disambiguate clipping masks

——— A clipping path has three elements:

    1. rect object (the actual path used to clip)
    2. clipPath object (with a <use tag referring to #1)
    3. clipped object (with a style="clip-path:url(# declaration referring to #2

——— problems with this:

    1. animating the mask itself (clipping path has a custom name in AI)

       the clipping masks in the SVG use duplicate ID's for the mask and the
       parent container. in order to animate the mask only, we change the IDs
       of #2 and #3 above, leaving only #1 to be animated

    2. a group is being clipped

       the clipped group is given the style="clip-path" attribute itself,
       instead of being in a sub <g>. this means that animating the 
       clipped group animates the clipping path with it

       this is why adding a second level of group solved the problem.

    3. in AI, a clipping mask is named with a minus sign -

       in exporting the .svg, Illustrator is inconsistent about converting
       the - to an entity
   

——— the script does three things:

    1. "moves" the clippedObject status to the parent <g> element
       so that when the clipped object is moved, the clipping path
       is not (problem #2 above)

    2. modifies the ID elements #2 and #3 above so that only the rect
       keeps the original ID and will thus be animated (probem #1 above)

    3. fixes the issue where a - sign is not consistently represented */

log('cleaning up clipping paths…');

const clippedObjects = document.querySelectorAll("[style^='clip']")

for(var x=0; x<clippedObjects.length; x++){

  var clippedObj = clippedObjects[x]                   // #3 above
  var pathUrl    = clippedObj.style.clipPath;
  var pathId     = pathUrl.slice(6, pathUrl.length-2)
  var clipPath   = document.getElementById(pathId);      // #2 above

  // move clipped object status to parent <g> 
  var parentG = getParentG(clippedObj);
  if (parentG != null){
    parentG.style.clipPath = pathUrl
    clippedObj.style.clipPath = ''
    clippedObj = parentG
  }

  if (pathId.slice(0,6) != 'SVGID_'){ // if it has custom name
    try{

      // disambigate custom path names (problem #1 above)
      var newId = 'CP' + pathId;
      var newUrl = 'url("#' + newId + '")'

      clipPath.id               = newId;
      clippedObj.style.clipPath = newUrl;
  
      // fix minus sign (problem #3 above)
      if (r = fix_minus(clipPath)){}

    }
    catch(msg){ log('⚠️  object with ID '+convertEntities(pathId)+' could not be updated'); }
  }
}

log('clipping paths verified');

//———————————————————————————————————————— register triggers by type

console.groupCollapsed('registering triggers…');

trigger_types.forEach(kind => {
  var stem = "[id^='" + kind + separator + "']";
  var obj_array = Array.from(document.querySelectorAll(stem));

  // loop through adding trigger_types
  for(var x=obj_array.length-1; x>-1; x--){ // reverse order to match layer palette order
    var obj = obj_array[x];
    var flags = obj.id.split(separator);

    // doesn't have at least trig and name
    if (flags.length<2) continue; 

    // is a duplicate; AI added _00000018952208152505492020000014739121534903857057_ to ID
    if (flags[flags.length-1].length > 50)
      flags[flags.length-1] = flags[flags.length-1].slice(0, -52);

    //  kind = flags[0];
    var name = flags[1];

    if (typeof animations[name] == 'undefined') animations[name] = new Animation(name);
    animations[name].add_trigger(obj, kind, flags);
  }

  // log results
  if (obj_array.length != 0)log(obj_array.length+' '+ kind+' triggers registered');
  //                   else log('—› no '+kind+' trigger_types');
});

console.groupEnd();

//———————————————————————————————————————— register events by type

console.groupCollapsed('registering events…')

event_types.forEach(kind => {
  var stem = "[id^='" + kind + separator + "']"
  var obj_array = Array.from(document.querySelectorAll(stem))

  // loop through adding events
  for(var x=0; x<obj_array.length; x++){

    var obj   = obj_array[x]
    var flags = obj.id.split(separator)

    // is a duplicate; AI added _00000018952208152505492020000014739121534903857057_ to ID
    if (flags[flags.length-1].length > 50)
      flags[flags.length-1] = flags[flags.length-1].slice(0, -52)

    //  kind = flags[0]
    var name = flags[1]

    if (Object.keys(animations).includes(name))
      animations[name].add_event(obj, kind, flags)
    else
      errLog('Event with no trigger', obj)
  }

  // log results
  if (obj_array.length != 0) log(obj_array.length+' '+ kind+' events registered')
  //                    else log('—› no '+kind+' event_types')

})

console.groupEnd()


//———————————————————————————————————————— set cursors and activate "func" flags

console.groupCollapsed('setup & error checking…')
log('setting cursors & activating "/func" functions…')

Object.keys(animations).forEach(name => {
  animations[name].set_cursor()
  animations[name].activate_func_flag() // method of Animation class, line 327
})

//———————————————————————————————————————— delete unused trigger_types

log('checking for eventless triggers…');

Object.keys(animations).forEach(name =>
  animations[name].delete_if_no_event()
)

console.groupEnd();

//———————————————————————————————————————— activate events by type

console.groupCollapsed('activating events…');

Object.keys(animations).forEach(name => {

  // not necessary to go through all trigger_types
  // the first one is enough to set up the event

  switch (animations[name].triggers[0].kind) {
    case 'mouse' :  activate_mouse_events(animations[name]); break
    case 'time'  :   activate_time_events(animations[name]); break
    case 'scroll': activate_scroll_events(animations[name]); break

    default:
      log('⚠️ unimplemented trigger kind: "'+animations[name].triggers[0].kind+'" in animation "'+name+'"')
  }

})

console.groupEnd();

//———————————————————————————————————————— end timer

const d2 = new Date();
let end_time = d2.getTime();

log((end_time-start_time)+'ms elapsed');

//———————————————————————————————————————— visible triggers

// https://stackoverflow.com/a/1938465

if (typeof debug != 'undefined'){
  var arrMatches = getElementsByRegex('^time_x2F_.*');
  for (var x=0; x<arrMatches.length; x++)
    arrMatches[x].style.opacity = 0.3;

  var arrMatches = getElementsByRegex('^scroll_x2F_.*');
  for (var x=0; x<arrMatches.length; x++)
    arrMatches[x].style.opacity = 0.3;

  var arrMatches = getElementsByRegex('^mouse_x2F_.*');
  for (var x=0; x<arrMatches.length; x++)
    arrMatches[x].style.opacity = 0.3;
}

//———————————————————————————————————————— ▲ end console.groupCollapsed

console.groupEnd();


//:::::::::::::::::::::::::::::::::::::::: program trigger "func" functions

//———————————————————————————————————————— mouse_trigger_funcs(name, triggers, args)

function mouse_trigger_funcs(name, triggers, args){
  triggers.obj.addEventListener('click', functions[name].bind(null, ...args)) 
}

//———————————————————————————————————————— time_trigger_funcs(name, triggers, args)

function time_trigger_funcs(name, triggers, args){
  setTimeout(functions[name].bind(null, ...args), triggers.delay*1000)
}

//———————————————————————————————————————— scroll_triggers_funcs(name, triggers, args)

function scroll_triggers_funcs(name, triggers, args){

  var obj = triggers.obj

  var box = obj.getBBox()      // get bounding box of trig object
  var trig_top = box['y']             // top

  window.addEventListener('scroll', lstn_scroll_func.bind(null, name, triggers, trig_top, args)) 
}


//:::::::::::::::::::::::::::::::::::::::: activate events

//———————————————————————————————————————— activate_mouse_events(animation)

function activate_mouse_events(animation){

  if (typeof animation.evnt == 'undefined')
    return true;  // is link or function

  for (var x=0; x<animation.evnt.length; x++){
    switch (animation.evnt[x].kind) {
      case undefined: break; // if it's just a link or func
  
      case 'click' : add_mouse_single(animation, x, 'pointerup'  ); break;
      case 'press' : add_mouse_single(animation, x, 'pointerdown'); break;
      case 'over'  : add_mouse_single(animation, x, 'pointerover'); break;
      case 'away'  : add_mouse_single(animation, x, 'pointerout' ); break; // or pointerleave
  
      // special cases
      case 'ovaway': add_mouse_ovaway(animation, x); break;
      case 'down'  :   add_mouse_down(animation, x); break;
      case 'toggle': add_mouse_toggle(animation, x); break;
  
      default:
        errLog('Unknown mouse event', animation.evnt[x]);
    }
  }

  log('mouse events activated');
}

//———————————————————————————————————————— activate_time_events(animation)

function activate_time_events(animation){

  if (typeof animation.evnt == 'undefined')
    return true  // is link or function

  for (var x=0; x<animation.evnt.length; x++){
    switch (animation.evnt[x].kind) {
    case 'delay':
      add_time_delay(animation, x)
      break

    default:
      if (typeof animation.evnt[x].kind != 'undefined')
           errLog('Unknown time event', animation.evnt[x])
      else errLog('Missing time event', animation.evnt[x])
    }
  }

  log('time events activated')
}

//———————————————————————————————————————— activate_scroll_events(animation)

function activate_scroll_events(animation){

  if (typeof animation.evnt == 'undefined') return true   // is link or function

  for (var x=0; x<animation.evnt.length; x++){
    switch (animation.evnt[x].kind) {
    case 'point':
      add_scroll_point(animation, x)
      break

    case 'zone':
      add_scroll_zone(animation, x)
      break

    case 'scrub':
      addScrollScrub(animation, x)
      break

    default:
      if (typeof animation.evnt[x].kind != 'undefined')
           errLog('Unknown scroll event', animation.evnt[x])
      else errLog('Missing scroll event', animation.evnt[x])
    }
  }

  log('scroll events activated')
}


//:::::::::::::::::::::::::::::::::::::::: addEventListener type functions

//———————————————————————————————————————— add_time_delay(animation)

function add_time_delay(animation, x){

  delay  = animation.triggers[0].delay * 1000
  params = gsap_params(animation.evnt[x])

  create_tline(animation.name+x, animation.evnt[x], params)
  setTimeout(lstn_play, delay, animation.name+x, animation.evnt[x])

}

//———————————————————————————————————————— add_mouse_single(animation, x, type)

function add_mouse_single(animation, x, type){

  params = gsap_params(animation.evnt[x])

  for (var t=0; t<animation.triggers.length; t++){

    create_tline(animation.name+x, animation.evnt[x], params)

    animation.triggers[t].obj.addEventListener(type, lstn_play.bind(null, animation.name+x, animation.evnt[x]), false)
  }
}

//———————————————————————————————————————— add_mouse_ovaway(animation, x)

// rotation is not cumulative (rotating to 90° twice just turns to 90°)

function add_mouse_ovaway(animation, x){

  params = gsap_params(animation.evnt[x]);

  for (var t=0; t<animation.triggers.length; t++){
    create_tline(animation.name+x, animation.evnt[x], params);
    animation.triggers[t].obj.addEventListener('pointerover',  lstn_play.bind(null, animation.name+x, animation.evnt[x]   ), false);
    animation.triggers[t].obj.addEventListener('pointerout',   lstn_reverse.bind(null, animation.name+x , animation.evnt[x]), false);
  }

}

//———————————————————————————————————————— add_mouse_down(animation, x)

// rotation is not cumulative (rotating to 90° twice just turns to 90°)

function add_mouse_down(animation, x){

  params = gsap_params(animation.evnt[x]);

  for (var t=0; t<animation.triggers.length; t++){

    create_tline(animation.name+x, animation.evnt[x], params);

    animation.triggers[t].obj.addEventListener('pointerdown', lstn_play.bind(null, animation.name+x, animation.evnt[x]), false);

    animation.triggers[t].obj.addEventListener('pointerup',   lstn_reverse.bind(null, animation.name+x , animation.evnt[x]                         ), false);
  }

}

//———————————————————————————————————————— add_mouse_toggle(animation, x)

function add_mouse_toggle(animation, x){

  params = gsap_params(animation.evnt[x]);

  for (var t=0; t<animation.triggers.length; t++){
    create_tline(animation.name+x, animation.evnt[x], params);
    animation.triggers[t].obj.addEventListener('pointerup', lstn_mouse_toggle.bind(null, animation.name+x, animation.evnt[x]), false);
  }
}

/*———————————————————————————————————————— add_scroll_point(animation,x)

    can have multiple triggers that set off the animation

    it is the fact that the "point" crosses the top border of the window
    that triggers the animation — not if it's visible already or not */

function add_scroll_point(animation, which_event){

  for (var t=0; t<animation.triggers.length; t++){

    var obj         = animation.triggers[t].obj
    var rect        = obj.getBBox()              // get bounding box of trig object
    var trigger_top = rect['y']                  // top of box, in pixels

    var params = gsap_params(animation.evnt[which_event])
    create_tline(animation.name+which_event, animation.evnt[which_event], params)

    window.addEventListener('scroll', lstn_scroll_point.bind(null, animation, which_event, trigger_top)) 

  }
}

//———————————————————————————————————————— addScrollScrub(animation,x)

function addScrollScrub(animation, x){

  for (var t=0; t<animation.triggers.length; t++){

    var obj = animation.triggers[t].obj //———————————————————————— ERROR

    var box    = obj.getBBox()                // get bounding box of trig object
    var boxTop = box['y'] < 0 ? 0 : box['y']  // top
    var boxBot = boxTop + box['height']       // bottom

    var params = gsap_params(animation.evnt[x])

    create_tline(animation.name+x, animation.evnt[x], params)
    window.addEventListener('scroll', lstn_scroll_scrub.bind(null, animation, x, boxTop, boxBot, 0)) 

    // in case something should already be visible
    lstn_scroll_scrub(animation, x, boxTop, boxBot, params, 0) 
  }
}

//———————————————————————————————————————— add_scroll_zone(animation,x)

function add_scroll_zone(animation, x){

  for (var t=0; t<animation.triggers.length; t++){
    var obj = animation.triggers[t].obj;

    var box = obj.getBBox();      // get bounding box of trig object
    var t = box['y'];             // top
    var b = t + box['height'];    // bottom

    var params = gsap_params(animation.evnt[x]);

    create_tline(animation.name+x, animation.evnt[x], params);
    window.addEventListener('scroll', lstn_scroll_zone.bind(null, animation, x, t, b)); 

    // in case something should already be visible
    lstn_scroll_zone(animation, x, t, b); 
  }
}


//:::::::::::::::::::::::::::::::::::::::: functions called by events

/*———————————————————————————————————————— lstn_scroll_func(name, triggers, trig_top, args)

    this was not finished betriggers it involves adding new variables and
    making the triggers functionality more complex.

    since most of that code will have to be rewritten when loop, reset and reverse
    are added, I decided to hold off (nobody will be using this in the near future).

    also: consider changing to "when triggers is entirely visible"
    instead of "when top crosses top" */

function lstn_scroll_func(name, triggers, trig_top, args){

  var page_top     = document.documentElement.scrollTop || document.body.scrollTop
  var pixel_height = window.innerHeight

  var rem_top = page_top / aiPixel
/*

    for this to execute:

    1. scroll triggers has to be below top of page, then
    2. scroll triggers has to be above top of page, and
    3. function cannot already have been set off by the 1-2 transition

    need a boolean variable specific to this triggers above/below (is_above), set on load
    need a boolean variable specific to this triggers already done (is_done), initialized false on load

*/

  if (trig_top < rem_top)
    if (typeof functions[name] != 'undefined'){
      functions[name](...args) 
      delete functions[name]
    }


}

//———————————————————————————————————————— lstn_scroll_point(animation, x, trig_top, params)

// https://stackoverflow.com/questions/4096863/how-to-get-and-set-the-current-web-page-scroll-position

/*    special cases:
 
      • top is visible to start with
      • evnt transparency default is visible to start with */

// called every time a scroll evnt

      // tline.totalTime(0)
      // tline.totalTime(tline.totalDuration())

  // goes on when trig object top scrolls up past top of page
  

function lstn_scroll_point(animation, which_event, trig_top){

  var page_top     = document.documentElement.scrollTop || document.body.scrollTop
  var pixel_height = window.innerHeight
  var rem_top      = page_top / aiPixel

  var obj          = animation.evnt[which_event].obj
  var funcName     = animation.name + which_event + '_timeline'
  var tline        = window[funcName]

  if (trig_top < rem_top)
    if (tline.totalTime() == 0) tline.play() // if hasn't yet run, play it

}

/*———————————————————————————————————————— lstn_scroll_scrub(animation, x, trig_top, trig_bot, params)

    executed for the first time the first time on load
    and thereafter each time the window is scrolled

    ways to get to correct position:
    - seek(seconds) · allows relative jumps
    - time(seconds) · doesn't include repeats & delays
    - totalTime() · includes repeats & delays (what I want)

    ways to get timeline length
    - .totalDuration()

    https://greensock.com/docs/v3/GSAP/Timeline/totalTime()
    https://greensock.com/forums/topic/8287-most-efficient-way-of-setting-timeline-playhead/

    "first" is used to know if it was requestd from outside the function, or recursively
    this has been added to double the frequency of checking for scroll trigger_types
    betriggers the experience on mobile was bad bad bad
*/

var scrub_foix = 8 // how many extra calls are made compared to scroll trigger_types
var scrub_rate = 10 // how many ms between extra calls

function lstn_scroll_scrub(animation, x, trig_top, trig_bot, params, fois){

  var page_top     = document.documentElement.scrollTop || document.body.scrollTop
  var pixel_height = window.innerHeight

  var rem_top = page_top / aiPixel

  var obj      = animation.evnt[x].obj
  var funcName = animation.name + x + '_timeline'
  var tline    = window[funcName]

  if (typeof tline == 'undefined'){
    log(funcName+' created')
    window[funcName] = new gsap.timeline({paused:true})
    var tline = window[funcName]
//log('💥 1116 '+animation.name+x+' fromto is ' + animation.evnt[x].fromto)
    tline[animation.evnt[x].fromto](obj, params)
//    set_existence(obj, true)
  }

  // % of bar above top of window = % of timeline

  var active = false
  
  // trig is activated
  if (trig_top < rem_top && trig_bot > rem_top){
    active = true

    set_existence(obj, true) //—————————————————————————————————————————————————————————————————-- is this too much?
    var obj_height = trig_bot - trig_top
    var passed = rem_top - trig_top
    var pcent = passed/obj_height
    pcent = Math.round(pcent * 10000)/10000 // percent + 2 decimals
    var new_time = tline.totalDuration() * pcent

    tline.totalTime(new_time)
  
  }

  else {

    // if trig object is below top of page, snap to 0
    if (trig_top > rem_top){
      tline.totalTime(0)
    }

    // if trig object is above top of page, snap to 100
    if (trig_bot < rem_top){
      tline.totalTime(tline.totalDuration())
//    if (params['autoAlpha'] == 0) set_existence(obj, false)
    }
  }

  // re-request same function to double frequency

  if (active && fois < scrub_foix)
    setTimeout(lstn_scroll_scrub, scrub_rate, animation, x, trig_top, trig_bot, params, fois+1)
}

//———————————————————————————————————————— lstn_scroll_zone(animation, x, trig_top, trig_bot, params)

  // goes on when trig top scrolls up past top of page
  // goes off when trig object bottom < bottom of page

/*    called on load then on each scroll trig

   https://stackoverflow.com/questions/4096863/how-to-get-and-set-the-current-web-page-scroll-position

      special cases:
 
      • top is visible to start with
      • evnt transparency default is visible to start with */

// called every time a scroll evnt

function lstn_scroll_zone(animation, which_event, trig_top, trig_bot, params){

  var page_top     = document.documentElement.scrollTop || document.body.scrollTop
  var pixel_height = window.innerHeight
  var page_bot     = page_top + pixel_height

  var rem_top      = page_top / aiPixel
  var rem_bot      = page_bot / aiPixel

  var rem_dist     = rem_bot - trig_bot // distance between bottom of trigger
  if (rem_dist < 0) rem_dist = 0        // and bottom of window

  var obj          = animation.evnt[which_event].obj
  var funcName     = animation.name + which_event + '_timeline'
  var tline        = window[funcName]

    if (trig_top > rem_top && trig_bot < rem_bot) var triggerActive = true
                                             else var triggerActive = false

  if (tline.totalTime() == tline.totalDuration()) var tlPosition    = 'end'
                 else if (tline.totalTime() == 0) var tlPosition    = 'beginning'
                                             else var tlPosition    = 'middle'

                                                  var tlReversed    = tline.reversed()
                                                  var tlPlaying     = tline.isActive()

/*

                                trigger:   visible  hidden

    animation !playing && pos != end        play     -
                       if rem_dist>100      » end                    commented out below; I don't know how to tell whether it's that the animation has
                                                                     played to the end and we're now scrolling up, or whether the page has simply been
    animation playing && reversed           play     -               loaded with the scroll trigger entirely visible
    animation !playing && pos != beginning  -        reverse
    animation playing && !reversed          -        reverse 

		doesn't work when we scroll down the page

*/

  var dist_limit = 100

  if(triggerActive){
    if (!tlPlaying && tlPosition != 'end'){
//    if (rem_dist > dist_limit){
//      tline.totalTime(tline.totalDuration(), false)
//      log(animation.name+which_event + ' skipping to end')
//    }
//    else{
        tline.play()
//      log(animation.name+which_event + ' playing from beginning')
//    }
    }
    if ( tlPlaying && tlReversed) tline.play()
  }

  if(!triggerActive){
    if (!tlPlaying && tlPosition != 'beginning') tline.reverse()
    if ( tlPlaying && !tlReversed)               tline.reverse()
  }

//log('active: ' + triggerActive + ', playing: ' + tlPlaying + ', position: ' + tlPosition + ', reversed: ' + tlReversed + ', display: '+ obj.style.display);

/* INSERT DISPLAY:BLOCK AT BEGINNING OF TIMELINES FROM 0 OPACITY ETC. */

}

//———————————————————————————————————————— lstn_mouse_toggle(obj, params)

function lstn_mouse_toggle(namex, evntx, params){

  var obj      = evntx.obj
  var funcName = namex + '_timeline'
  var tline    = window[funcName]

  if (tline.isActive())
    if (tline.reversed()) tline.play() // was playing backwards: play forwards
    else tline.reverse()               // was playing forwards: play backwards
  else{
    if (tline.totalTime() == 0){       // was stopped at beginning
      set_existence(obj, true)         // play forwards
      tline.play()
    }
    else{                              // was stopped at end
      set_existence(obj, true)         // play backwards
      tline.reverse()
    }
  }

}

//———————————————————————————————————————— lstn_play(obj, params)

//nction lstn_play(animation, params){
function lstn_play(namex, evntx){

  obj = evntx.obj

  var funcName = namex + '_timeline'
  var tline    = window[funcName]

  // play if it's not playing or if it's reversed
  if (!tline.isActive() || (tline.isActive() && tline.reversed())){
    set_existence(obj, true)
    tline.play()
  }
}

//———————————————————————————————————————— lstn_reverse(obj, params)

//nction lstn_reverse(animation){
function lstn_reverse(namex, evntx){
// NEED TO MAKE OBJECT VISIBLE IF IT WAS MADE NON-EXISTANT
  var funcName = namex + '_timeline';
  set_existence(evntx.obj, true);
  window[funcName].reverse();
}


//:::::::::::::::::::::::::::::::::::::::: utility functions

/*———————————————————————————————————————— set_existence(obj, exists)

    used only for triggers, which are not animated */

function set_existence(obj, exists){
//log(convertEntities(obj.id)+' exists set to '+exists);

  if (exists){
    obj.style.pointerEvents = 'visiblePainted';
    obj.style.display       = 'block';
//  log(convertEntities(obj.id) + ' made clickable');
  }
  else{
    obj.style.pointerEvents = 'none';
    obj.style.display       = 'none';
//  log(convertEntities(obj.id) + ' hidden');
  }
}

//———————————————————————————————————————— convert_origin(origin)

/*  the _x2C_ is not converted when the flags are read betriggers
    flags are only converted if they have entities in first
    three characters */

// bug is betriggers when , is in first three characters it's converted, otherwise not

function convert_origin(origin){
  if (typeof origin == 'undefined') return "50% 50%";

  origin = origin.slice(1);

  var parts = origin.split(',');

//if (origin.indexOf(',') > 0)
//  var parts = origin.split(',');
//else
//  var parts = origin.split('_x2C_');

  return parts.join('% ') + '%';
}

//———————————————————————————————————————— gsap_params(evnt)

function gsap_params(evntx){

  var params = {};

  params['duration']          = evntx.duration==0 ? 0.001:evntx.duration;

  if (typeof evntx.ease      != 'undefined') params['ease'           ] = evntx.ease; else params['ease'] = Power1.easeInOut ;

  if (typeof evntx.delay     != 'undefined') params['delay'          ] = evntx.delay        ;
  if (typeof evntx.origin    != 'undefined') params['transformOrigin'] = evntx.origin       ;
  else params['transformOrigin'] = '50% 50%';

  if (typeof evntx.xmove     != 'undefined') params['x'              ] = '+=' + evntx.xmove ;
  if (typeof evntx.ymove     != 'undefined') params['y'              ] = '+=' + evntx.ymove ;

  if (typeof evntx.scale     != 'undefined') params['scale'          ] = '*=' + evntx.scale ;
  if (typeof evntx.xscale    != 'undefined') params['scaleX'         ] = '*=' + evntx.xscale;
  if (typeof evntx.yscale    != 'undefined') params['scaleY'         ] = '*=' + evntx.yscale;

  if (typeof evntx.transpFinal != 'undefined') params['autoAlpha'      ] = evntx.transpFinal    ;
  if (typeof evntx.rotate    != 'undefined') params['rotation'       ] = '+=' + evntx.rotate;

  if (params['autoAlpha']==0) params['display'] = 'none';
  if (params['autoAlpha']!=0) params['display'] = 'block';

  return params;
}

//———————————————————————————————————————— log(arg)

function log(arg){
  console.log(arg)
}

//———————————————————————————————————————— errLog(arg)

function errLog(arg, obj){

  if (typeof obj != 'undefined'){
    var id   = decodeEntities(obj.id)
    if (id.length > 50) id = id.slice(0, -52);

    arg += ' in ' + svgName(obj) + '.ai' + ' › ' + id
  }

  if (typeof debug != 'undefined') alert('⚠️  '+arg);
  log('⚠️  '+arg);

}

//———————————————————————————————————————— not_number(x)

function not_number(x) {
  return parseFloat(x) != x;
};

/*———————————————————————————————————————— convertEntities(in)

    id="toggle_x2F_name15_x2F_-y10_x2F_x_x2B_30_x2F_t100" */

function convertEntities(str){

  var parts = str.split('_');
  
  for (var x=1; x<parts.length; x+=1){
    if (Object.keys(entity_conversion).includes(parts[x]))
      parts[x] = entity_conversion[parts[x]];
  }

  str2= parts.join('');

  // log('—————————————————————————————— 😈 conversion from '+str+' to '+str2);
  return str2;

}

/*———————————————————————————————————————— fixMinus(clip_path)

    fix illustrator bug with clipping masks with a - in the name

    In the SVG code, the path definition looks like this:
        <rect id="clipping-path" ... >

    but the reference to it looks like this:
        <use xlink:href="#clipping_x002D_path" ... >

    https://illustrator.uservoice.com/forums/601447-illustrator-desktop-bugs/suggestions/45420952-clipping-mask-broken-in-svg-export-if-name-contain */

function fix_minus(clip_path){
  // fix illustrator bug
  // reported at: https://illustrator.uservoice.com/forums/601447-illustrator-desktop-bugs/suggestions/45420952-clipping-mask-broken-in-svg-export-if-name-contain
  
  var first_child = clip_path.innerHTML
  var correct_id  = first_child.split('"')[1].slice(1);
  
  if (correct_id.indexOf('_x002D_') > 0){
    var wrong_id = correct_id.replace('_x002D_', '-');
    var path = document.getElementById(wrong_id);
    path.id  = correct_id;
    return correct_id;
  }
  return false;
}

function fixMinusx(clipPath){
  if (clipPath.indexOf('-') < 0) return true
  
  var first_child = clipPath.innerHTML
  var correct_id  = first_child.split('"')[1].slice(1)
  
  if (correct_id.indexOf('_x002D_') < 0) return true

  var wrong_id = correct_id.replace('_x002D_', '-')
  var path = document.getElementById(wrong_id)
  path.id  = correct_id

  return true
}

//———————————————————————————————————————— getElementsByRegex(pattern)

// https://stackoverflow.com/a/1938465
function getElementsByRegex(pattern){
   var arrElements = [];   // to accumulate matching elements
   var re = new RegExp(pattern);   // the regex to match with

   function findRecursively(aNode) { // recursive function to traverse DOM
      if (!aNode) 
          return;
      if (aNode.id !== undefined && aNode.id.search(re) != -1)
          arrElements.push(aNode);  // FOUND ONE!
      for (var idx in aNode.childNodes) // search children...
          findRecursively(aNode.childNodes[idx]);
   };

   findRecursively(document); // initiate recursive matching
   return arrElements; // return matching elements
};

/*———————————————————————————————————————— decodeEntities(arg)

    used for args passed to func trigger flag

    converts illustrator style entites to html entites
    _x22_ to &#x22; to get normal entity

    then converts those to regular text
    &#x22; to ! */

function decodeEntities(arg){
  if (typeof arg == 'undefined') return ''

  const regex = /_x([0-9A-Z]{2})_/g

  var html = arg.replace(regex, function($1){
    var x = $1.toLowerCase() 
        x = x.replaceAll('_x','&#x')
        return x.replaceAll('_', ';')
  })

  html = html.replaceAll('_', ' ')

  var tmpObject = document.createElement('textarea')

  tmpObject.innerHTML = html
  var val = tmpObject.value
  tmpObject.remove()

  return val
}

//———————————————————————————————————————— create_tline(obj, params)

//nction create_tline(animation, params){
function create_tline(namex, evntx, params){

  obj = evntx.obj;

  var funcName = namex + '_timeline';

  var tline    = window[funcName];

  if (typeof tline == 'undefined'){

    window[funcName] = new gsap.timeline({paused:true});

    var tline = window[funcName];

    tline[evntx.fromto](obj, params);

//  log('timeline '+funcName + '.'+evntx.fromto+' created');

  }
}

//———————————————————————————————————————— svgName(obj)

function svgName(obj){
  while (obj.tagName != 'svg')
    obj = obj.parentElement
  return decodeEntities(obj.id)
}

//———————————————————————————————————————— containsTransform(trigger)

function containsTransform(trigger){
  if ( typeof trigger.xmove     == 'undefined' &&
       typeof trigger.ymove     == 'undefined' &&
       typeof trigger.rotate    == 'undefined' &&
       typeof trigger.scale     == 'undefined' &&
       typeof trigger.xscale    == 'undefined' &&
       typeof trigger.yscale    == 'undefined'  ) return false

  return true
}

/*———————————————————————————————————————— getParentG()

    accepts object <g... tag in an SVG
    returns the parent <g... tag

    used to move the style="clip-path... to the parent tag,
    in order to avoid a problem where the clip path was animated
    along with its contents */

function getParentG(obj){
  // create array of parent objects
  // max length 3 (à voir)
  // go up array until find G or get to end of array
  // return G or null
  var parts = []

  if (typeof obj.parentElement != 'undefined'){
    parts.push(obj.parentElement)
    if (typeof obj.parentElement.parentElement != 'undefined'){
      parts.push(obj.parentElement.parentElement)
      if (typeof obj.parentElement.parentElement.parentElement != 'undefined'){
        parts.push(obj.parentElement.parentElement.parentElement)
      }
    }
  }
  for (var x=0; x<parts.length; x++)
    if (parts[x].tagName == 'g') return parts[x]

  return null;
}

//———————————————————————————————————————— debugging

//var a = 'trigger1'; try { animations[a].flagDump(); } catch (error) { log('⚠️  dumpFlags: "'+a+'" is not listed.'); }


//:::::::::::::::::::::::::::::::::::::::: fin


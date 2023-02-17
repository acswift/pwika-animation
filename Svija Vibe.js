
//:::::::::::::::::::::::::::::::::::::::: svija-vibe.js

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
log("——— svija-vibe.js ———");

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

const evnt_flag_value_to_key = {

  // name & kind are given

//'softin'  : 'ease'        , // no value
//'softout' : 'ease'        , // no value
//'soft'    : 'ease'        , // no value
//'hard '   : 'ease'        , // no value
//'d'       : 'delay'       , // value follows
//'o'       : 'origin'      , // value follows
//'t'       : 'transp_to'   , // value follows

  '_x002D_x': 'xmove'       , // value follows -x
  '_x2B_x'  : 'xmove'       , // value follows +x
  '_x2B_y'  : 'ymove'       , // value follows +y
  '_x3C_'   : 'rotate'      , // value follows
  '_x3E_'   : 'rotate'      , // value precedes
  '_x25_'   : 'scale'       , // value follows
  'x_x25'   : 'xscale'      , // value follows
  'y_x25'   : 'yscale'      , // value follows

  '_x2B_'   : 'handoff'       // value follows
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
  'origin'     : 1,
  'rotate'     : 1,
  'transp_to'  : 1,
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

//———————————————————————————————————————— defaults

const trigger_defaults = {

  'func'       : false,
  'link'       : false,
  'blank'      : false

}

const time_trigger_default = 5.0;

const event_defaults = {
  'delay'   : 5.0, // only for time/delay anims
  'duration': 0.5
}


//:::::::::::::::::::::::::::::::::::::::: model definitions

//———————————————————————————————————————— class Animation

// https://www.w3schools.com/js/js_classes.asp

var animations = {};   // Animations
var functions  = [];   // mouse functions called by func flag

class Animation{

  constructor( name, triggers, evnt ){

    this.name   = name;     // 20-character string
    this.triggers  = triggers;    // array of trigger_types
    this.evnt   = evnt;     // array of event_types
  }

  add_trig(obj, kind, flags){ //—————————————————————————————————————————————

    // initialize

    var zoopy     = new Trigger;
    zoopy.obj = obj;
    zoopy.kind    = kind;

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
      if (not_number(val)) var key = trigger_flag_value_to_key[val];
      else if (kind == 'time') var key = 'delay';

      if (kind=='time' && key=='delay') zoopy[key] = 1 * val; 
      else if (key=='func') {
        zoopy.func = true;
        zoopy.args = [];
        for (var y=x+1; y<flags.length; y++)
          zoopy.args.push(flags[y]);
        x = 1000; // get out of loop — no other flags can follow func
      }
      else{
        var v = trigger_flag_value_to_key_value[val];
        if (val == '') errlog('Trigger "'+this.name+'" has an extra slash.');
        else if (typeof v == 'undefined') errlog('Trigger "'+this.name+'" has unknown flag: "'+val+'".');
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

  add_event(obj, kind, flags){

    // initialize

    var zoopy     = new Evnt;
    zoopy.obj     = obj;
    zoopy.kind    = kind;
    zoopy.name    = this.name;

    // loop through flags (kind|name|parameters...)

    for(var x=2; x<flags.length; x++){

      // get key
      var key;
      var flag = flags[x];

      // convert entites to real characters
      var char1 = flag.substr(0,1);
      var char2 = flag.substr(1,1);
      var char3 = flag.substr(2,1);
      var charX = flag.slice(-1);
//    if (char1=='_' || char2=='_' || char3=='_' || charX=='_') flag = convert_entities(flag);
      if (flag.indexOf('_') > 0) flag = convert_entities(flag);

      // assign value to flag
      key = this.evnt_key_from_flag(flag);
      if (typeof zoopy[key] != 'undefined') errlog('Evnt "'+this.name +'" ('+kind+') has duplicate "'+key+'" flags');

      zoopy[key] = this.get_flag_val(key, flag);

    }

    // special cases (so absence of flags behaves as expected) ———————————————————————————————

    // set transparency 0 to 1
    if ( typeof zoopy.xmove     == 'undefined' &&
         typeof zoopy.ymove     == 'undefined' &&
         typeof zoopy.rotate    == 'undefined' &&
         typeof zoopy.scale     == 'undefined' &&
         typeof zoopy.xscale    == 'undefined' &&
         typeof zoopy.yscale    == 'undefined' &&
         typeof zoopy.transp_to == 'undefined' ){
      zoopy.transp_from = 0;
      zoopy.transp_to   = 1;
    }

    // set default duration
    if (typeof zoopy.duration=='undefined')
      zoopy.duration= event_defaults.duration;
    else zoopy.duration = 1 * zoopy.duration;

    // convert rotation to number
    if (typeof zoopy.rotation!='undefined')
      zoopy.rotation = 1 * zoopy.rotation;

    // convert delay to number
    if (typeof zoopy.delay!='undefined')
      zoopy.delay= 1 * zoopy.delay;

    // if set to disappear, need starting transp of 1
    if (zoopy.transp_to == 0 && typeof zoopy.transp_from == 'undefined')
      zoopy.transp_from = 1;

    // if destination transparency is not 0, default starting transparency is 0
    if (typeof zoopy.transp_from == 'undefined' && typeof zoopy.transp_to != 'undefined'){ 
      zoopy.transp_from = 0;
      zoopy.obj.style.opacity = 0;
    }

		// scrub event_types default to hard ease
    if (zoopy.kind == 'scrub' && typeof zoopy.ease == 'undefined')
      zoopy.ease = 'none';

    // add to evnt array
    if (typeof this.evnt == 'undefined') this.evnt = [];
    this.evnt.push(zoopy);

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

  activate_function(){

    // https://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string
    // https://www.geeksforgeeks.org/how-to-call-function-from-it-name-stored-in-a-string-using-javascript/

    for (var x=0; x<this.triggers.length; x++){
      if (!this.triggers[x].func) continue;

      var args = this.triggers[x].args;

      functions[this.name] = window['func_'+this.name];

      if (typeof functions[this.name] == 'undefined')
        errlog('Function func_'+this.name+' not found.');

      else switch (this.triggers[x].kind) {
        case 'mouse' :  activate_mice_func(this.name, this.triggers[x], args); break;
        case 'time'  :   activate_times_func(this.name, this.triggers[x], args); break;
        case 'scroll': activate_scrolls_func(this.name, this.triggers[x], args); break;

        default:
          log('⚠️ unimplemented trig kind: "'+animations[name].triggers[0].kind+'" in animation "'+animation.name+'"');
      }
    }
  }

  make_visible(){

    if (typeof this.evnt=='undefined') return true;

    for (var x=0; x<this.evnt.length; x++){

      // hidden at load
      if (this.evnt[x].transp_from == 0){
        set_existence(this.evnt[x].obj, false);
        continue;
      }

      // if no transparency event_types, make visible
      if (typeof this.evnt[x].transp_from == 'undefined')
        this.evnt[x].obj.style.opacity = 1;

      // set specified transparency
      else
        this.evnt[x].obj.style.opacity = this.evnt[x].transp_from;

      set_existence(this.evnt[x].obj, true);
    }

  }

  delete_if_no_evnt(){
    for (var t=0; t<this.triggers.length; t++){
      if (typeof this.evnt == 'undefined')
        if (!this.triggers[t].func && !this.triggers[t].link){
          errlog('Event object "'+this.name+'" ('+this.triggers[t].kind+') de-registered (no evnt, link or function). SVG NAME');
          delete animations[this.name];
        }
    }
    
    return true;
  }

  dump_flags(){
    log('\n\nv debug output —————————————————————————— ⚠️\ '+this.name);
    Object.keys(this).forEach(key => {
      if (typeof this[key] != 'undefined')
        if (key=='name') log(key+' ('+typeof(this[key])+'): '+this[key]);
        else log(key+' ('+typeof(this[key])+'): '+this[key].length+' object(s)');
    });

    for (var t=0; t<this.triggers.length; t++){
      log('\nTrigger['+t+']');
      Object.keys(this.triggers[t]).forEach(key => {
        if (typeof this.triggers[t][key] != 'undefined')
          if(key=='obj')log('obj (object): '+convert_entities(this.triggers[t][key].id));
          else log(key+' ('+typeof(this.triggers[t][key])+'): '+this.triggers[t][key]);
      });
    }

    if (typeof this.evnt != 'undefined'){
      for (var x=0; x<this.evnt.length; x++){
        log('\nEvnt[' + x + ']');
        Object.keys(this.evnt[x]).forEach(key => {
          if (typeof this.evnt[x][key] != 'undefined')
            if(key=='obj')log('obj (object): '+convert_entities(this.evnt[x][key].id));
            else log(key+' ('+typeof(this.evnt[x][key])+'): '+this.evnt[x][key]);
        });
      }
    }
    
    log('^ end debug output —————————————————————————— ⚠️\n\n');
  }

  evnt_key_from_flag(flag){

/*   should return key & flag w/o key
     rename to split_key_flag
     https://stackoverflow.com/a/2917186  for how to do it

     is programmed specifically to optimize key finding
     needs to be updated when flags are modified  */

    switch(flag){
      case 'softout': return 'ease'   ; break; // whole flag
      case 'softin' : return 'ease'   ; break;
      case 'soft'   : return 'ease'   ; break;
      case 'hard'   : return 'ease'   ; break;
    }

    switch(flag.slice(0,3)){
      case '+x%'   : return 'xscale'  ; break; // first 3 chars
      case '-x%'   : return 'xscale'  ; break;
      case '+y%'   : return 'yscale'  ; break;
      case '-y%'   : return 'yscale'  ; break;
    }

    switch(flag.slice(0,2)){
      case '+x'    : return 'xmove'   ; break; // first 2 chars
      case '-x'    : return 'xmove'   ; break;
      case '+y'    : return 'ymove'   ; break;
      case '-y'    : return 'ymove'   ; break;
      case 'x%'    : return 'xscale'  ; break;
      case 'y%'    : return 'yscale'  ; break;
      case '+%'    : return 'scale'   ; break;
      case '-%'    : return 'scale'   ; break;
    }

    switch(flag.slice(0,1)){
      case '%'    : return 'scale'    ; break; // first 1 char
      case '<'    : return 'rotate'   ; break;
      case 'd'    : return 'delay'    ; break;
      case 'o'    : return 'origin'   ; break;
      case 't'    : return 'transp_to'; break;
      case 'x'    : return 'xmove'    ; break;
      case 'y'    : return 'ymove'    ; break;
    }

    if (flag.slice(-1) == '>')    return 'rotate';   // /130> rotation clockwise
    if (parseFloat(flag) == flag) return 'duration'; // integer means duration

    if (flag != '')
      errlog('Evnt "'+this.name+'" has an unknown flag: "'+flag +'".');
    else
      errlog('Evnt "'+this.name+'" has an extra slash.');

    return null;
  }

  get_flag_val(key, flag){
    var flag_len = flag_length[key];
  
    if (key=='ease')   return eases[flag];
    if (flag_len == 0) return flag;
    if (key=='origin') return convert_origin(flag);

    if (key=='rotate')
      if (flag.slice(-1)=='>') return flag.slice(0, flag.length-1);
      else return 0-flag.slice(1, flag.length);
  
    if (key=='transp_to'){
       var v = flag.substr(flag_len)/100;
       return v;
    }

    if (key=='xmove' || key=='ymove')
      if (flag.slice(0,1)=='-')           // -x200
        return 0-1*flag.substr(flag_len+1);
      else if (flag.slice(0,1)=='+')      // +x200
        return flag.substr(flag_len+1);
      else return flag.substr(flag_len);  //  x200
  
    if (key=='scale' || key=='xscale' || key=='yscale')
      if (flag.slice(0,1)=='-')                 // -%200
        return (0-flag.substr(flag_len+1))/100;
      else if (flag.slice(0,1)=='+')            // +%200
        return (flag.substr(flag_len+1)/100);
      else return (flag.substr(flag_len)/100);  //  %200

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
               xmove, ymove, origin, rotate, scale, xscale, yscale, transp_to, transp_from ){

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
    this.transp_to   = transp_to;    // number · percentage transp_to            o30
    this.transp_from = transp_from;  // number · transp_from/transp_to           programmatically
  }
}


//:::::::::::::::::::::::::::::::::::::::: program

/*———————————————————————————————————————— disambiguate clipping masks

    Illustrator's clipping masks use duplicate ID's
    for the mask and the parent container

    in order to animate the mask only, it's necessary
    to change the container's id 

  <defs>
    <rect id="this" x="81.5" y="122.5" width="134" height="134"/>
  </defs>

  <clipPath id="this_00000008131292206288288250000010619513817506336950_">
    <use xlink:href="#this"  style="overflow:visible;"/>
  </clipPath>

  <g style="clip-path:url(#this_00000008131292206288288250000010619513817506336950_);">
      <image style="overflow:visible;" width="1185" height="1800" xlink:href="pod20180-1.jpg"  transform="matrix(0.75 0 0 0.75 64 85)"></image>
  </g>

  the program will ignore the 52 last characters of an AI generated ID
  which results in multiple same ID's

  What we are animating is the rect.
  We do NOT want to animat the clipPath, so we will change its ID

  If we change the clipPath ID, we need to change the reference to it
  just after, in the g style="clip-path:"...

  SEPARATELY

  if the rect ID contains a minus sign, we need to correct for an Illustrator bug
  that converts it to an entity when called, but not when declared  */


const clip_users = document.querySelectorAll("[style^='clip']")

log('verifying clipping paths…');
for(var x=0; x<clip_users.length; x++){

  var path_url = clip_users[x].style.clipPath;
  if (path_url.slice(6,12)=='SVGID_') continue; // should be 'SVGID_', or match parent SVG ID
  id = path_url.slice(6, path_url.length-2);
  var new_id = 'CP' + id;
  clip_path = document.getElementById(id);
  log('clipping paths verified');

  try{
    clip_path.id = new_id;
    clip_users[x].style.clipPath = 'url("#' + new_id + '")';
//  log('clipping path disambiguated: '+convert_entities(id.slice(0,-52)));

    if (r=fix_minus(clip_path)) var z = 0; // log('minus-sign bug corrected for '+convert_entities(r));
  }
  catch(msg){
//  log('⚠️  object with ID '+convert_entities(id)+' could not be updated');
  }
}

//———————————————————————————————————————— add trigger_types

log('\nregistering trigger_types…');

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
    animations[name].add_trig(obj, kind, flags);
  }

  // log results
  if (obj_array.length != 0)log(obj_array.length+' '+ kind+' trigger_types registered');
  //                   else log('—› no '+kind+' trigger_types');
});

//———————————————————————————————————————— add event_types

log('\nregistering events…');

event_types.forEach(kind => {
  var stem = "[id^='" + kind + separator + "']";
  var obj_array = Array.from(document.querySelectorAll(stem));

  // loop through adding events
  for(var x=0; x<obj_array.length; x++){

    var obj   = obj_array[x];
    var flags = obj.id.split(separator);

    // is a duplicate; AI added _00000018952208152505492020000014739121534903857057_ to ID
    if (flags[flags.length-1].length > 50)
      flags[flags.length-1] = flags[flags.length-1].slice(0, -52);

    //  kind = flags[0];
    var name = flags[1];

    if (Object.keys(animations).includes(name))
      animations[name].add_event(obj, kind, flags)
    else
      errlog('Evnt "'+name+'" has no trig and was not registered (id='+obj_array[x].id+') SVG NAME');

  }

  // log results
  if (obj_array.length != 0) log(obj_array.length+' '+ kind+' events registered');
  //                    else log('—› no '+kind+' event_types');

});

//———————————————————————————————————————— set cursors, and activate functions, turn on "default on" objs

log('\nsetting cursors, activating functions & making objects visible…');

Object.keys(animations).forEach(name => {
  animations[name].set_cursor();
  animations[name].activate_function();
  animations[name].make_visible();
})

//———————————————————————————————————————— delete unused trigger_types

log('checking for evntless trigger_types…');

Object.keys(animations).forEach(name =>
  animations[name].delete_if_no_evnt()
)

//———————————————————————————————————————— activate event_types

log('activating events…');

Object.keys(animations).forEach(name => {

  // not necessary to go through all trigger_types
  // the first one is enough to set up the evnt

  switch (animations[name].triggers[0].kind) {
    case 'mouse' :    activate_mice(animations[name]); break;
    case 'time'  :   activate_times(animations[name]); break;
    case 'scroll': activate_scrolls(animations[name]); break;

    default:
      log('⚠️ unimplemented trigger kind: "'+animations[name].triggers[0].kind+'" in animation "'+animation.name+'"');
  }

})

//———————————————————————————————————————— end timer

const d2 = new Date();
let end_time = d2.getTime();

log('\n———————————————————— finished in '+(end_time-start_time)+'ms\n\n');

//———————————————————————————————————————— visible triggers

// https://stackoverflow.com/a/1938465

if (typeof triggers_visible != 'undefined'){
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


//:::::::::::::::::::::::::::::::::::::::: build functions & event_types

//———————————————————————————————————————— activate_mice_func(name, triggers, args)

function activate_mice_func(name, triggers, args){
  triggers.obj.addEventListener('click', functions[name].bind(null, ...args)); 
}

//———————————————————————————————————————— activate_times_func(name, triggers, args)

function activate_times_func(name, triggers, args){
  setTimeout(functions[name].bind(null, ...args), triggers.delay*1000);
}

//———————————————————————————————————————— activate_scrolls_func(name, triggers, args)

function activate_scrolls_func(name, triggers, args){

  var obj = triggers.obj;

  var box = obj.getBBox();      // get bounding box of trig object
  var trig_top = box['y'];             // top

  window.addEventListener('scroll', execute_scroll_func.bind(null, name, triggers, trig_top, args)); 
}


//———————————————————————————————————————— activate_mice(animation)

function activate_mice(animation){

  if (typeof animation.evnt == 'undefined')
    return true;  // is link or function

  for (var x=0; x<animation.evnt.length; x++){
    switch (animation.evnt[x].kind) {
    case undefined: break; // if it's just a link or func

    case 'click' : mouse_single(animation, x, 'pointerup'  ); break;
    case 'press' : mouse_single(animation, x, 'pointerdown'); break;
    case 'over'  : mouse_single(animation, x, 'pointerover'); break;
    case 'away'  : mouse_single(animation, x, 'pointerout' ); break; // or pointerleave

    // special cases
    case 'ovaway': mouse_ovaway(animation, x); break;
    case 'down'  :   mouse_down(animation, x); break;
    case 'toggle': mouse_toggle(animation, x); break;

    default:
      log('⚠️ unimplemented mouse evnt: "'+animation.evnt[0].kind+'" in animation "'+animation.name+'"');
    }
  }

  log('mouse trigger_types activated');
}

//———————————————————————————————————————— activate_times(animation)

function activate_times(animation){

  if (typeof animation.evnt == 'undefined')
    return true;  // is link or function

  for (var x=0; x<animation.evnt.length; x++){
    switch (animation.evnt[x].kind) {
    case 'delay':
      time_delay(animation, x);
      break;

    default:
      if (typeof animation.evnt[x].kind != 'undefined') errlog('unknown time kind: '+animation.evnt[x].kind);
      else errlog('missing time evnt: '+animation.name);
    }
  }

  log('time trigger_types activated');
}

//———————————————————————————————————————— activate_scrolls(animation)

function activate_scrolls(animation){

  if (typeof animation.evnt == 'undefined')
    return true;  // is link or function

  for (var x=0; x<animation.evnt.length; x++){
    switch (animation.evnt[x].kind) {
    case 'point':
      scroll_point(animation, x);
      break;

    case 'zone':
      scroll_zone(animation, x);
      break;

    case 'scrub':
      scroll_scrub(animation, x);
      break;

    default:
      if (typeof animation.evnt[x].kind != 'undefined') errlog('unknown scroll kind: '+animation.evnt[x].kind);
      else errlog('missing scroll evnt: '+animation.name);
    }
  }

  log('scroll event_types activated');
}


//:::::::::::::::::::::::::::::::::::::::: evnt functions

//———————————————————————————————————————— time_delay(animation)

function time_delay(animation, x){

  delay  = animation.triggers[0].delay * 1000;
  params = gsap_params(animation.evnt[x]);
  setTimeout(play_tline.bind(null, animation.name+x, animation.evnt[x], params), delay);

}


//———————————————————————————————————————— mouse_single(animation, x, type)

function mouse_single(animation, x, type){

  params = gsap_params(animation.evnt[x]);
  for (var t=0; t<animation.triggers.length; t++){
    animation.triggers[t].obj.addEventListener(type, play_tline.bind(null, animation.name+x, animation.evnt[x], params), false);
  }
}

//———————————————————————————————————————— mouse_ovaway(animation, x)

// rotation is not cumulative (rotating to 90° twice just turns to 90°)

function mouse_ovaway(animation, x){

  params = gsap_params(animation.evnt[x]);
  for (var t=0; t<animation.triggers.length; t++){
    animation.triggers[t].obj.addEventListener('pointerover',  play_tline.bind(null, animation.name+x, animation.evnt[x], params), false);
    animation.triggers[t].obj.addEventListener('pointerout',   reverse_tline.bind(null, animation.name+x , animation.evnt[x]                            ), false);
  }

}

//———————————————————————————————————————— mouse_down(animation, x)

// rotation is not cumulative (rotating to 90° twice just turns to 90°)

function mouse_down(animation, x){

  params = gsap_params(animation.evnt[x]);
  for (var t=0; t<animation.triggers.length; t++){
    animation.triggers[t].obj.addEventListener('pointerdown', play_tline.bind(null, animation.name+x, animation.evnt[x], params), false);
    animation.triggers[t].obj.addEventListener('pointerup',   reverse_tline.bind(null, animation.name+x , animation.evnt[x]                         ), false);
  }

}

//———————————————————————————————————————— mouse_toggle(animation, x)

function mouse_toggle(animation, x){
  params = gsap_params(animation.evnt[x]);
  for (var t=0; t<animation.triggers.length; t++){
    animation.triggers[t].obj.addEventListener('pointerup', execute_toggle.bind(null, animation.name+x, animation.evnt[x], params), false);
  }
}


//———————————————————————————————————————— scroll_point(animation,x)

function scroll_point(animation, x){

  for (var t=0; t<animation.triggers.length; t++){
    var obj = animation.triggers[t].obj;

    var box = obj.getBBox();      // get bounding box of trig object
    var trig_top = box['y'];             // top

    var params = gsap_params(animation.evnt[x]);
    window.addEventListener('scroll', execute_scroll_point.bind(null, animation, x, trig_top, params)); 

    // in case something should already be visible
    execute_scroll_point(animation, x, t, params); 
  }
}

//———————————————————————————————————————— scroll_scrub(animation,x)

function scroll_scrub(animation, x){

  for (var t=0; t<animation.triggers.length; t++){
    var obj = animation.triggers[t].obj;

    var box = obj.getBBox();      // get bounding box of trig object
    var t = box['y'];             // top
    var b = t + box['height'];    // bottom

    var params = gsap_params(animation.evnt[x]);
    window.addEventListener('scroll', execute_scroll_scrub.bind(null, animation, x, t, b, params, 0)); 

    // in case something should already be visible
    execute_scroll_scrub(animation, x, t, b, params, 0); 
  }
}

//———————————————————————————————————————— scroll_zone(animation,x)

function scroll_zone(animation, x){

  for (var t=0; t<animation.triggers.length; t++){
    var obj = animation.triggers[t].obj;

    var box = obj.getBBox();      // get bounding box of trig object
    var t = box['y'];             // top
    var b = t + box['height'];    // bottom

    var params = gsap_params(animation.evnt[x]);
    window.addEventListener('scroll', execute_scroll_zone.bind(null, animation, x, t, b, params)); 

    // in case something should already be visible
    execute_scroll_zone(animation, x, t, b, params); 
  }
}


//:::::::::::::::::::::::::::::::::::::::: evnt-related functions

/*———————————————————————————————————————— execute_scroll_func(name, triggers, trig_top, args)

    this was not finished betriggers it involves adding new variables and
    making the triggers functionality more complex.

    since most of that code will have to be rewritten when loop, reset and reverse
    are added, I decided to hold off (nobody will be using this in the near future).

    also: consider changing to "when triggers is entirely visible"
    instead of "when top crosses top" */

function execute_scroll_func(name, triggers, trig_top, args){

  var page_top     = document.documentElement.scrollTop || document.body.scrollTop;
  var pixel_height = window.innerHeight;

  var rem_top = page_top / aiPixel;
/*

    for this to execute:

    1. scroll triggers has to be below top of page, then
    2. scroll triggers has to be above top of page, and
    3. function cannot already have been set off by the 1-2 transition

    need a boolean variable specific to this triggers above/below (is_above), set on load
    need a boolean variable specific to this triggers already done (is_done), initialized false on load

*/

  // trig is activated
  if (trig_top < rem_top){
    functions[name](...args); 
  }

}

//———————————————————————————————————————— execute_scroll_point(animation, x, trig_top, params)

// https://stackoverflow.com/questions/4096863/how-to-get-and-set-the-current-web-page-scroll-position

/*    special cases:
 
      • top is visible to start with
      • evnt transparency default is visible to start with */

// called every time a scroll evnt

function execute_scroll_point(animation, x, trig_top, params){

  var page_top     = document.documentElement.scrollTop || document.body.scrollTop;
  var pixel_height = window.innerHeight;

  var rem_top = page_top / aiPixel;

  var obj      = animation.evnt[x].obj;
  var funcName = animation.name + x + '_timeline';

  var tline    = window[funcName];

  // goes on when trig object top scrolls up past top of page
  
  // trig is activated
  if (trig_top < rem_top){
    if (typeof tline != 'undefined'){
      if (tline.reversed()) tline.play();       //  if reversed play it · not relevant but will be useful when reset flag is added
    }
    else{
      //  doesn't exist: create & play it
      window[funcName] = new gsap.timeline({paused:true});
      var tline = window[funcName];
      tline.to(obj, params);
      set_existence(obj, true);
      tline.play();
    }
  }

}

/*———————————————————————————————————————— execute_scroll_scrub(animation, x, trig_top, trig_bot, params)

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

var scrub_foix = 8; // how many extra calls are made compared to scroll trigger_types
var scrub_rate = 10; // how many ms between extra calls

function execute_scroll_scrub(animation, x, trig_top, trig_bot, params, fois){

  var page_top     = document.documentElement.scrollTop || document.body.scrollTop;
  var pixel_height = window.innerHeight;

  var rem_top = page_top / aiPixel;

  var obj      = animation.evnt[x].obj;
  var funcName = animation.name + x + '_timeline';
  var tline    = window[funcName];

  if (typeof tline == 'undefined'){
    log('———————————————————————————- '+funcName+' created');
    window[funcName] = new gsap.timeline({paused:true});
    var tline = window[funcName];
    tline.to(obj, params);
//    set_existence(obj, true);
  }

  // % of bar above top of window = % of timeline

  var active = false;
  
  // trig is activated
  if (trig_top < rem_top && trig_bot > rem_top){
    active = true;

    set_existence(obj, true); //—————————————————————————————————————————————————————————————————-- is this too much?
    var obj_height = trig_bot - trig_top;
    var passed = rem_top - trig_top;
    var pcent = passed/obj_height;
    pcent = Math.round(pcent * 10000)/10000; // percent + 2 decimals
    var new_time = tline.totalDuration() * pcent;

    tline.totalTime(new_time);
  
  }

  else {

    // if trig object is below top of page, snap to 0
    if (trig_top > rem_top){
      tline.totalTime(0);
    }

    // if trig object is above top of page, snap to 100
    if (trig_bot < rem_top){
      tline.totalTime(tline.totalDuration());
      if (params['autoAlpha'] == 0) set_existence(obj, false);
    }
  }

  // re-request same function to double frequency

  if (active && fois < scrub_foix)
    setTimeout(execute_scroll_scrub, scrub_rate, animation, x, trig_top, trig_bot, params, fois+1);
}

//———————————————————————————————————————— execute_scroll_zone(animation, x, trig_top, trig_bot, params)

/*    called on load then on each scroll trig

   https://stackoverflow.com/questions/4096863/how-to-get-and-set-the-current-web-page-scroll-position

      special cases:
 
      • top is visible to start with
      • evnt transparency default is visible to start with */

// called every time a scroll evnt

function execute_scroll_zone(animation, x, trig_top, trig_bot, params){

  var page_top     = document.documentElement.scrollTop || document.body.scrollTop;
  var pixel_height = window.innerHeight;
  var page_bot     = page_top + pixel_height;

  var rem_top = page_top / aiPixel;
  var rem_bot = page_bot / aiPixel;

  var obj      = animation.evnt[x].obj;
  var funcName = animation.name + x + '_timeline';
  var tline    = window[funcName];

  // goes on when trig top scrolls up past top of page
  // goes off when trig object bottom < bottom of page
  
  // trig is activated
  if (trig_top > rem_top && trig_bot < rem_bot){
    if (typeof tline != 'undefined'){
      if (tline.reversed()) tline.play();       //  if reversed play it
    }
    else{
      //  doesn't exist: create & play it
      window[funcName] = new gsap.timeline({paused:true});
      var tline = window[funcName];
      tline.to(obj, params);
      set_existence(obj, true);
      tline.play();
    }
  }

  // trig is deactivated
  else{
    if (typeof tline == 'undefined') return true;                      //  doesn't exist: do nothing
    if (!tline.isActive() && !tline.reversed()) tline.reverse();       //  paused not reversed (at end): reverse it
    else if (tline.isActive() && !tline.reversed()) tline.reverse();   //  playing not reversed: reverse it */
    return true;
  }

}

//———————————————————————————————————————— play_tline(obj, params)

//nction play_tline(animation, params){
function play_tline(namex, evntx, params){

  obj = evntx.obj;

  var funcName = namex + '_timeline';
  var tline    = window[funcName];

  if (typeof tline == 'undefined'){
    window[funcName] = new gsap.timeline({paused:true});
    var tline = window[funcName];
    tline.to(obj, params);
  }

  // play if it's not playing or if it's reversed
  if (!tline.isActive() || (tline.isActive() && tline.reversed())){
    set_existence(obj, true);
    tline.play();
  }

//// make unexists to avoid layering conflicts                // now handled by timeline
//if (params.autoAlpha==0) set_existence(obj, false);
//                    else set_existence(obj, true );
}

//———————————————————————————————————————— reverse_tline(obj, params)

//nction reverse_tline(animation){
function reverse_tline(namex, evntx){
// NEED TO MAKE OBJECT VISIBLE IF IT WAS MADE NON-EXISTANT
  var funcName = namex + '_timeline';
  set_existence(evntx.obj, true);
  window[funcName].reverse();
}

//———————————————————————————————————————— execute_toggle(obj, params)

// only called when clicked

//nction execute_toggle(animation, params){
function execute_toggle(namex, evntx, params){

  var obj      = evntx.obj;
  var funcName = namex + '_timeline';
  var tline    = window[funcName];

  // create & play if doesn't exist
  if (typeof tline == 'undefined'){

    window[funcName] = new gsap.timeline({paused:true});
    var tline = window[funcName];
    tline.to(obj, params);
    set_existence(obj, true);
    tline.play();

  } else {

    if (tline.reversed()){
      set_existence(obj, true);
      tline.play();
    }
    else{
      set_existence(obj, true);
      tline.reverse();
    }

  }

}


//:::::::::::::::::::::::::::::::::::::::: utility functions

//———————————————————————————————————————— set_existence(obj, exists)

function set_existence(obj, exists){
//log(convert_entities(obj.id)+' exists set to '+exists);

  if (exists){
    obj.style.pointerEvents = 'visiblePainted';
    obj.style.display       = 'block';
//  log(convert_entities(obj.id) + ' made clickable');
  }
  else{
    obj.style.pointerEvents = 'none';
    obj.style.display       = 'none';
//  log(convert_entities(obj.id) + ' hidden');
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

  log('💥 ——————————————————— converted to '+parts.join('% ') + '%');

  return parts.join('% ') + '%';
}

//———————————————————————————————————————— gsap_params(evnt)

function gsap_params(evntx){

  var params = {};

  params['duration'       ] = evntx.duration==0 ? 0.001:evntx.duration

  if (typeof evntx.ease      != 'undefined') params['ease'           ] = evntx.ease; else params['ease'] = Power1.easeInOut ;

  if (typeof evntx.delay     != 'undefined') params['delay'          ] = evntx.delay        ;
  if (typeof evntx.origin    != 'undefined') params['transformOrigin'] = evntx.origin       ;
  else params['transformOrigin'] = '50% 50%';

  if (typeof evntx.xmove     != 'undefined') params['x'              ] = '+=' + evntx.xmove ;
  if (typeof evntx.ymove     != 'undefined') params['y'              ] = '+=' + evntx.ymove ;

  if (typeof evntx.scale     != 'undefined') params['scale'          ] = '*=' + evntx.scale ;
  if (typeof evntx.xscale    != 'undefined') params['scaleX'         ] = '*=' + evntx.xscale;
  if (typeof evntx.yscale    != 'undefined') params['scaleY'         ] = '*=' + evntx.yscale;

  if (typeof evntx.transp_to != 'undefined') params['autoAlpha'      ] = evntx.transp_to    ;
  if (typeof evntx.rotate    != 'undefined') params['rotation'       ] = '+=' + evntx.rotate;

  //————— make exists if not 0 opacity

//if (params['autoAlpha']==1){                          // this has to happen before anim is called
//  params['onComplete'      ] = set_existence;
//  params['onCompleteParams'] = [evntx.obj, true];
//}

  if (params['autoAlpha']==0){
      params['onComplete'      ] = set_existence;
      params['onCompleteParams'] = [evntx.obj, false];
  }

  return params;
}

//———————————————————————————————————————— log(arg)

function log(arg){
  console.log(arg)
}

//———————————————————————————————————————— errlog(arg)

function errlog(arg){
  log('⚠️  '+arg);
  var do_alert = true;

  if (typeof anim_debug == 'undefined') return true;
  if (anim_debug == false ) return true;

  alert('⚠️  '+arg);
}

//———————————————————————————————————————— not_number(x)

function not_number(x) {
  return parseFloat(x) != x;
};

/*———————————————————————————————————————— convert_entities(in)

    id="toggle_x2F_name15_x2F_-y10_x2F_x_x2B_30_x2F_t100" */

function convert_entities(str){

  var parts = str.split('_');
  
  for (var x=1; x<parts.length; x+=1){
    if (Object.keys(entity_conversion).includes(parts[x]))
      parts[x] = entity_conversion[parts[x]];
  }

  str2= parts.join('');

  // log('—————————————————————————————— 😈 conversion from '+str+' to '+str2);
  return str2;

}

//———————————————————————————————————————— fix_minus(clip_path)

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

//———————————————————————————————————————— debugging

// var a = 'name1'; try { animations[a].dump_flags(); } catch (error) { log('⚠️  "'+a+'" is not listed.'); }


//:::::::::::::::::::::::::::::::::::::::: fin

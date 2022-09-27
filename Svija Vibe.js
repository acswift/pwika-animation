
//———————————————————————————————————————— svija-vibe.js

/*———————————————————————————————————————— notes

  Svija Vibe 1.0.8

  github.com/svijalove/animation
  
  ©2022 Svija SAS, Cusset France

—————————————————————————————————————————— */
//———————————————————————————————————————— start timer

const d1 = new Date();
let start_time = d1.getTime();
log("——— svija-vibe.js ———");

//———————————————————————————————————————— separator, types of events and effects

const separator = '_x2F_'; // regular slash
const    events = [ 'mouse', 'time', 'scroll' ];
const   effects = [ 'click', 'over',  'away',  'ovaway', 'press', 'down', 'toggle', 'delay', 'point', 'zone', 'scrub' ];

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

const event_flag_value_to_key = {

  // name & kind are given

  // event flags
  'func'  : 'func'       , // no value
  'a'     : 'cursor'     , // no value
  'h'     : 'cursor'     , // no value
  'i'     : 'cursor'     , // no value
  'n'     : 'blank'      , // no value

}

const effect_flag_value_to_key = {

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
  'hard'   : "none" 
}

const cursors = {
  'a'           : 'default',
  'h'           : 'pointer',
  'i'           : 'text',
  'default_link': 'pointer'
}

const event_flag_value_to_key_value = {
  'a'   : 'a',
  'h'   : 'h',
  'i'   : 'i',
  'func': true,
  'n'   : true
}


//———————————————————————————————————————— defaults

const event_defaults = {

  'func'       : false,
  'link'       : false,
  'blank'      : false

}

const time_event_default = 5.0;

const effect_defaults = {
  'delay'   : 5.0, // only for time/delay anims
  'duration': 0.5
}


//:::::::::::::::::::::::::::::::::::::::: MODEL DEFINITIONS

//———————————————————————————————————————— class Animation

// https://www.w3schools.com/js/js_classes.asp

var animations = {};   // Animations
var functions  = [];   // mouse functions called by func flag

class Animation{

  constructor( name, cause, effect ){

    this.name     = name;       // 20-character string
    this.cause    = cause;      // array of events
    this.effect   = effect;     // array of effects
  }

  add_event(obj, kind, flags){ //—————————————————————————————————————————————

    // initialize

    var zoopy     = new Trigger;
    zoopy.obj = obj;
    zoopy.kind    = kind;

    if (zoopy.kind == 'mouse') set_existence(zoopy.obj, true);

    // set defaults

    Object.keys(event_defaults).forEach(
      key => { zoopy[key] = event_defaults[key]; }
    );
     
    if (kind=='time') zoopy['delay'] = time_event_default;

    for(var x=2; x<flags.length; x++){ //————————————————————————————— loop through flags (kind|name|parameters...)

      // determine flag key from value
      // entity conversion not necessary for events

      // get correct key
      var val = flags[x];
      if (not_number(val)) var key = event_flag_value_to_key[val];
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
        var v = event_flag_value_to_key_value[val];
        if (val == '') errlog('Trigger "'+this.name+'" has an extra slash.');
        else if (typeof v == 'undefined') errlog('Trigger "'+this.name+'" has unknown flag: "'+val+'".');
        else zoopy[key] = v;
      }

    } //—————————————————————————————————————————————————————————————————————-

    // set link & parent target
 
    zoopy.link = obj.parentNode.hasAttribute('xlink:href'); // true false

    if (zoopy.link && zoopy.blank)
      zoopy.obj.parentNode.setAttribute("target", "_blank");

    if (typeof this.cause == 'undefined') this.cause = [];
    this.cause.push(zoopy);

  }

  add_effect(obj, kind, flags){

    // initialize

    var zoopy     = new Effect;
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
      if (char1=='_' || char2=='_' || char3=='_' || charX=='_') flag = convert_entities(flag);

      // assign value to flag
      key = this.effect_key_from_flag(flag);
      if (typeof zoopy[key] != 'undefined') errlog('Effect "'+this.name +'" ('+kind+') has duplicate "'+key+'" flags');

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
      zoopy.duration= effect_defaults.duration;
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

		// scrub effects default to hard ease
    if (zoopy.kind == 'scrub' && typeof zoopy.ease == 'undefined')
      zoopy.ease = 'none';

    // add to effect array
    if (typeof this.effect == 'undefined') this.effect = [];
    this.effect.push(zoopy);

  }

  set_cursor(){
  
    for (var t=0; t<this.cause.length; t++){

      if (typeof this.cause[t].cursor != 'undefined')
        this.cause[t].obj.style.cursor = cursors[this.cause[t].cursor];
  
      else{
        var is_hand = false;
  
        if (this.cause[t].link ) is_hand = true;
        if (this.cause[t].func ) is_hand = true;
        if (this.kind == 'click' ) is_hand = true;
        if (this.kind == 'down'  ) is_hand = true;
        if (this.kind == 'toggle') is_hand = true;

        if (is_hand){
          this.cause[t].obj.style.cursor = cursors['default_link'];
        }
      }
    }
  
  }

  activate_function(){

    // https://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string
    // https://www.geeksforgeeks.org/how-to-call-function-from-it-name-stored-in-a-string-using-javascript/

    for (var x=0; x<this.cause.length; x++){
      if (!this.cause[x].func) continue;

      var args = this.cause[x].args;

      functions[this.name] = window['func_'+this.name];

      if (typeof functions[this.name] == 'undefined')
        errlog('Function func_'+this.name+' not found.');

      else switch (this.cause[x].kind) {
        case 'mouse' :  activate_mice_func(this.name, this.cause[x], args); break;
        case 'time'  :   activate_times_func(this.name, this.cause[x], args); break;
        case 'scroll': activate_scrolls_func(this.name, this.cause[x], args); break;

        default:
          log('⚠️ unimplemented event kind: "'+animations[name].cause[0].kind+'" in animation "'+animation.name+'"');
      }
    }
  }

  make_visible(){

    if (typeof this.effect=='undefined') return true;

    for (var x=0; x<this.effect.length; x++){

      // hidden at load
      if (this.effect[x].transp_from == 0){
        set_existence(this.effect[x].obj, false);
        continue;
      }

      // if no transparency effects, make visible
      if (typeof this.effect[x].transp_from == 'undefined')
        this.effect[x].obj.style.opacity = 1;

      // set specified transparency
      else
        this.effect[x].obj.style.opacity = this.effect[x].transp_from;

      set_existence(this.effect[x].obj, true);
    }

  }

  delete_if_no_effect(){
    for (var t=0; t<this.cause.length; t++){
      if (typeof this.effect == 'undefined')
        if (!this.cause[t].func && !this.cause[t].link){
          errlog('Event object "'+this.name+'" ('+this.cause[t].kind+') de-registered (no effect, link or function). SVG NAME');
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

    for (var t=0; t<this.cause.length; t++){
      log('\nTrigger['+t+']');
      Object.keys(this.cause[t]).forEach(key => {
        if (typeof this.cause[t][key] != 'undefined')
          if(key=='obj')log('obj (object): '+convert_entities(this.cause[t][key].id));
          else log(key+' ('+typeof(this.cause[t][key])+'): '+this.cause[t][key]);
      });
    }

    if (typeof this.effect != 'undefined'){
      for (var x=0; x<this.effect.length; x++){
        log('\nEffect[' + x + ']');
        Object.keys(this.effect[x]).forEach(key => {
          if (typeof this.effect[x][key] != 'undefined')
            if(key=='obj')log('obj (object): '+convert_entities(this.effect[x][key].id));
            else log(key+' ('+typeof(this.effect[x][key])+'): '+this.effect[x][key]);
        });
      }
    }
    
    log('^ end debug output —————————————————————————— ⚠️\n\n');
  }

  effect_key_from_flag(flag){

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
      errlog('Effect "'+this.name+'" has an unknown flag: "'+flag +'".');
    else
      errlog('Effect "'+this.name+'" has an extra slash.');

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
    this.kind       = kind;         // string · kind of event                    scroll, mouse, time 

    // flags
    this.cursor     = cursor;       // string · cursor on pointerover              a, h, t (arrow, hand, text)
    this.func       = func;         // boolean · calls function of same name     onclick only 
    this.args       = args;         // array · args passed to function           all flags following name
    this.link       = link;         // boolean · is an SVG link                  programmatically
    this.blank      = blank;        // boolean · link target is _blank           n
    this.delay      = delay;        // number of seconds before activation (time event)
  }
}

//———————————————————————————————————————— class Effect

class Effect{

  constructor( name, obj, kind, delay, handoff, handwait, duration, ease,
               xmove, ymove, origin, rotate, scale, xscale, yscale, transp_to, transp_from ){

    this.name        = name;         // 20-character string
    this.obj         = obj;          // object reference
    this.kind        = kind;         // string · kind of effect                  click, over, down, away, ovaway, down, toggle, visible

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


//:::::::::::::::::::::::::::::::::::::::: PROGRAM

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

//———————————————————————————————————————— add events

log('\nregistering events…');

events.forEach(kind => {
  var stem = "[id^='" + kind + separator + "']";
  var obj_array = Array.from(document.querySelectorAll(stem));

  // loop through adding events
  for(var x=obj_array.length-1; x>-1; x--){ // reverse order to match layer palette order
    var obj = obj_array[x];
    var flags = obj.id.split(separator);

    // doesn't have at least event and name
    if (flags.length<2) continue; 

    // is a duplicate; AI added _00000018952208152505492020000014739121534903857057_ to ID
    if (flags[flags.length-1].length > 50)
      flags[flags.length-1] = flags[flags.length-1].slice(0, -52);

    //  kind = flags[0];
    var name = flags[1];

    if (typeof animations[name] == 'undefined') animations[name] = new Animation(name);
    animations[name].add_event(obj, kind, flags);
  }

  // log results
  if (obj_array.length != 0)log(obj_array.length+' '+ kind+' events registered');
  //                   else log('—› no '+kind+' events');
});

//———————————————————————————————————————— add effects

log('\nregistering effects…');

effects.forEach(kind => {
  var stem = "[id^='" + kind + separator + "']";
  var obj_array = Array.from(document.querySelectorAll(stem));

  // loop through adding effects
  for(var x=0; x<obj_array.length; x++){

    var obj   = obj_array[x];
    var flags = obj.id.split(separator);

    // is a duplicate; AI added _00000018952208152505492020000014739121534903857057_ to ID
    if (flags[flags.length-1].length > 50)
      flags[flags.length-1] = flags[flags.length-1].slice(0, -52);

    //  kind = flags[0];
    var name = flags[1];

    if (Object.keys(animations).includes(name))
      animations[name].add_effect(obj, kind, flags)
    else
      errlog('Effect "'+name+'" has no event and was not registered (id='+obj_array[x].id+') SVG NAME');

  }

  // log results
  if (obj_array.length != 0) log(obj_array.length+' '+ kind+' effects registered');
  //                    else log('—› no '+kind+' effects');

});

//———————————————————————————————————————— set cursors, and activate functions, turn on "default on" objs

log('\nsetting cursors, activating functions & making objects visible…');

Object.keys(animations).forEach(name => {
  animations[name].set_cursor();
  animations[name].activate_function();
  animations[name].make_visible();
})

//———————————————————————————————————————— delete unused events

log('checking for effectless events…');

Object.keys(animations).forEach(name =>
  animations[name].delete_if_no_effect()
)

//———————————————————————————————————————— activate effects

log('activating effects…');

Object.keys(animations).forEach(name => {

  // not necessary to go through all events
  // the first one is enough to set up the effect

  switch (animations[name].cause[0].kind) {
    case 'mouse' :    activate_mice(animations[name]); break;
    case 'time'  :   activate_times(animations[name]); break;
    case 'scroll': activate_scrolls(animations[name]); break;

    default:
      log('⚠️ unimplemented event kind: "'+animations[name].cause[0].kind+'" in animation "'+animation.name+'"');
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


//:::::::::::::::::::::::::::::::::::::::: BUILD FUNCTIONS & EFFECTS

//———————————————————————————————————————— activate_mice_func(name, cause, args)

function activate_mice_func(name, cause, args){
  cause.obj.addEventListener('click', functions[name].bind(null, ...args)); 
}

//———————————————————————————————————————— activate_times_func(name, cause, args)

function activate_times_func(name, cause, args){
  setTimeout(functions[name].bind(null, ...args), cause.delay*1000);
}

//———————————————————————————————————————— activate_scrolls_func(name, cause, args)

function activate_scrolls_func(name, cause, args){

  var obj = cause.obj;

  var box = obj.getBBox();      // get bounding box of event object
  var event_top = box['y'];             // top

  window.addEventListener('scroll', execute_scroll_func.bind(null, name, cause, event_top, args)); 
}


//———————————————————————————————————————— activate_mice(animation)

function activate_mice(animation){

  if (typeof animation.effect == 'undefined')
    return true;  // is link or function

  for (var x=0; x<animation.effect.length; x++){
    switch (animation.effect[x].kind) {
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
      log('⚠️ unimplemented mouse effect: "'+animation.effect[0].kind+'" in animation "'+animation.name+'"');
    }
  }

  log('mouse events activated');
}

//———————————————————————————————————————— activate_times(animation)

function activate_times(animation){

  if (typeof animation.effect == 'undefined')
    return true;  // is link or function

  for (var x=0; x<animation.effect.length; x++){
    switch (animation.effect[x].kind) {
    case 'delay':
      time_delay(animation, x);
      break;

    default:
      if (typeof animation.effect[x].kind != 'undefined') errlog('unknown time kind: '+animation.effect[x].kind);
      else errlog('missing time effect: '+animation.name);
    }
  }

  log('time events activated');
}

//———————————————————————————————————————— activate_scrolls(animation)

function activate_scrolls(animation){

  if (typeof animation.effect == 'undefined')
    return true;  // is link or function

  for (var x=0; x<animation.effect.length; x++){
    switch (animation.effect[x].kind) {
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
      if (typeof animation.effect[x].kind != 'undefined') errlog('unknown scroll kind: '+animation.effect[x].kind);
      else errlog('missing scroll effect: '+animation.name);
    }
  }

  log('scroll effects activated');
}


//:::::::::::::::::::::::::::::::::::::::: EFFECTS

//———————————————————————————————————————— time_delay(animation)

function time_delay(animation, x){

  delay  = animation.cause[0].delay * 1000;
  params = gsap_params(animation.effect[x]);
  setTimeout(play_tline.bind(null, animation.name+x, animation.effect[x], params), delay);

}


//———————————————————————————————————————— mouse_single(animation, x, type)

function mouse_single(animation, x, type){

  params = gsap_params(animation.effect[x]);
  for (var t=0; t<animation.cause.length; t++){
    animation.cause[t].obj.addEventListener(type, play_tline.bind(null, animation.name+x, animation.effect[x], params), false);
  }
}

//———————————————————————————————————————— mouse_ovaway(animation, x)

// rotation is not cumulative (rotating to 90° twice just turns to 90°)

function mouse_ovaway(animation, x){

  params = gsap_params(animation.effect[x]);
  for (var t=0; t<animation.cause.length; t++){
    animation.cause[t].obj.addEventListener('pointerover',  play_tline.bind(null, animation.name+x, animation.effect[x], params), false);
    animation.cause[t].obj.addEventListener('pointerout',   reverse_tline.bind(null, animation.name+x , animation.effect[x]                            ), false);
  }

}

//———————————————————————————————————————— mouse_down(animation, x)

// rotation is not cumulative (rotating to 90° twice just turns to 90°)

function mouse_down(animation, x){

  params = gsap_params(animation.effect[x]);
  for (var t=0; t<animation.cause.length; t++){
    animation.cause[t].obj.addEventListener('pointerdown', play_tline.bind(null, animation.name+x, animation.effect[x], params), false);
    animation.cause[t].obj.addEventListener('pointerup',   reverse_tline.bind(null, animation.name+x , animation.effect[x]                         ), false);
  }

}

//———————————————————————————————————————— mouse_toggle(animation, x)

function mouse_toggle(animation, x){
  params = gsap_params(animation.effect[x]);
  for (var t=0; t<animation.cause.length; t++){
    animation.cause[t].obj.addEventListener('pointerup', execute_toggle.bind(null, animation.name+x, animation.effect[x], params), false);
  }
}


//———————————————————————————————————————— scroll_point(animation,x)

function scroll_point(animation, x){

  for (var t=0; t<animation.cause.length; t++){
    var obj = animation.cause[t].obj;

    var box = obj.getBBox();      // get bounding box of event object
    var event_top = box['y'];             // top

    var params = gsap_params(animation.effect[x]);
    window.addEventListener('scroll', execute_scroll_point.bind(null, animation, x, event_top, params)); 

    // in case something should already be visible
    execute_scroll_point(animation, x, t, params); 
  }
}

//———————————————————————————————————————— scroll_scrub(animation,x)

function scroll_scrub(animation, x){

  for (var t=0; t<animation.cause.length; t++){
    var obj = animation.cause[t].obj;

    var box = obj.getBBox();      // get bounding box of event object
    var t = box['y'];             // top
    var b = t + box['height'];    // bottom

    var params = gsap_params(animation.effect[x]);
    window.addEventListener('scroll', execute_scroll_scrub.bind(null, animation, x, t, b, params)); 

    // in case something should already be visible
    execute_scroll_scrub(animation, x, t, b, params); 
  }
}

//———————————————————————————————————————— scroll_zone(animation,x)

function scroll_zone(animation, x){

  for (var t=0; t<animation.cause.length; t++){
    var obj = animation.cause[t].obj;

    var box = obj.getBBox();      // get bounding box of event object
    var t = box['y'];             // top
    var b = t + box['height'];    // bottom

    var params = gsap_params(animation.effect[x]);
    window.addEventListener('scroll', execute_scroll_zone.bind(null, animation, x, t, b, params)); 

    // in case something should already be visible
    execute_scroll_zone(animation, x, t, b, params); 
  }
}


//:::::::::::::::::::::::::::::::::::::::: EFFECT-RELATED

/*———————————————————————————————————————— execute_scroll_func(name, cause, event_top, args)

    this was not finished because it involves adding new variables and
    making the cause functionality more complex.

    since most of that code will have to be rewritten when loop, reset and reverse
    are added, I decided to hold off (nobody will be using this in the near future).

    also: consider changing to "when cause is entirely visible"
    instead of "when top crosses top" */

function execute_scroll_func(name, cause, event_top, args){

  var page_top     = document.documentElement.scrollTop || document.body.scrollTop;
  var pixel_height = window.innerHeight;

  var rem_top = page_top / illustrator_pixel;
/*

    for this to execute:

    1. scroll cause has to be below top of page, then
    2. scroll cause has to be above top of page, and
    3. function cannot already have been set off by the 1-2 transition

    need a boolean variable specific to this cause above/below (is_above), set on load
    need a boolean variable specific to this cause already done (is_done), initialized false on load

*/

  // event is activated
  if (event_top < rem_top){
    functions[name](...args); 
  }

}

//———————————————————————————————————————— execute_scroll_point(animation, x, event_top, params)

// https://stackoverflow.com/questions/4096863/how-to-get-and-set-the-current-web-page-scroll-position

/*    special cases:
 
      • top is visible to start with
      • effect transparency default is visible to start with */

// called every time a scroll effect

function execute_scroll_point(animation, x, event_top, params){

  var page_top     = document.documentElement.scrollTop || document.body.scrollTop;
  var pixel_height = window.innerHeight;

  var rem_top = page_top / illustrator_pixel;

  var obj      = animation.effect[x].obj;
  var funcName = animation.name + x + '_timeline';

  var tline    = window[funcName];

  // goes on when event object top scrolls up past top of page
  
  // event is activated
  if (event_top < rem_top){
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

/*———————————————————————————————————————— execute_scroll_scrub(animation, x, event_top, event_bot, params)

    executed for the first time the first time on load
    and thereafter each time the window is scrolled

    ways to get to correct position:
    - seek(seconds) · allows relative jumps
    - time(seconds) · doesn't include repeats & delays
    - totalTime() · includes repeats & delays (what I want)

    ways to get timeline length
    - .totalDuration()

    https://greensock.com/docs/v3/GSAP/Timeline/totalTime()
    https://greensock.com/forums/topic/8287-most-efficient-way-of-setting-timeline-playhead/ */

function execute_scroll_scrub(animation, x, event_top, event_bot, params){

  var page_top     = document.documentElement.scrollTop || document.body.scrollTop;
  var pixel_height = window.innerHeight;

  var rem_top = page_top / illustrator_pixel;

  var obj      = animation.effect[x].obj;
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
  
  // event is activated
  if (event_top < rem_top && event_bot > rem_top){

    set_existence(obj, true); //—————————————————————————————————————————————————————————————————-- is this too much?
    var obj_height = event_bot - event_top;
    var passed = rem_top - event_top;
    var pcent = passed/obj_height;
    pcent = Math.round(pcent * 10000)/10000; // percent + 2 decimals
    var new_time = tline.totalDuration() * pcent;
    tline.totalTime(new_time);
  
  }

  else {

    // if event object is below top of page, snap to 0
    if (event_top > rem_top){
      tline.totalTime(0);
    }

    // if event object is above top of page, snap to 100
    if (event_bot < rem_top){
      tline.totalTime(tline.totalDuration());
      if (params['autoAlpha'] == 0) set_existence(obj, false);
    }
  }
}

//———————————————————————————————————————— execute_scroll_zone(animation, x, event_top, event_bot, params)

// https://stackoverflow.com/questions/4096863/how-to-get-and-set-the-current-web-page-scroll-position

/*    special cases:
 
      • top is visible to start with
      • effect transparency default is visible to start with */

// called every time a scroll effect

function execute_scroll_zone(animation, x, event_top, event_bot, params){

  var page_top     = document.documentElement.scrollTop || document.body.scrollTop;
  var pixel_height = window.innerHeight;
  var page_bot     = page_top + pixel_height;

  var rem_top = page_top / illustrator_pixel;
  var rem_bot = page_bot / illustrator_pixel;

  var obj      = animation.effect[x].obj;
  var funcName = animation.name + x + '_timeline';
  var tline    = window[funcName];

  // goes on when event top scrolls up past top of page
  // goes off when event object bottom < bottom of page
  
  // event is activated
  if (event_top > rem_top && event_bot < rem_bot){
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

  // event is deactivated
  else{
    if (typeof tline == 'undefined') return true;                      //  doesn't exist: do nothing
    if (!tline.isActive() && !tline.reversed()) tline.reverse();       //  paused not reversed (at end): reverse it
    else if (tline.isActive() && !tline.reversed()) tline.reverse();   //  playing not reversed: reverse it */
    return true;
  }

}

//———————————————————————————————————————— play_tline(obj, params)

//nction play_tline(animation, params){
function play_tline(namex, effectx, params){

  obj = effectx.obj;

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
function reverse_tline(namex, effectx){
// NEED TO MAKE OBJECT VISIBLE IF IT WAS MADE NON-EXISTANT
  var funcName = namex + '_timeline';
  set_existence(effectx.obj, true);
  window[funcName].reverse();
}

//———————————————————————————————————————— execute_toggle(obj, params)

// only called when clicked

//nction execute_toggle(animation, params){
function execute_toggle(namex, effectx, params){

  var obj      = effectx.obj;
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


//:::::::::::::::::::::::::::::::::::::::: UTILITIES

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

/*  the _x2C_ is not converted when the flags are read because
    flags are only converted if they have entities in first
    three characters */

function convert_origin(origin){
  if (typeof origin == 'undefined') return "50% 50%";

  origin = origin.slice(0);

  var parts = origin.split('_x2C_');
  var result = parts.join('% ') + '%';
  return result.slice(1);
}

//———————————————————————————————————————— gsap_params(effect)

function gsap_params(effectx){

  var params = {};

  params['duration'       ] = effectx.duration==0 ? 0.001:effectx.duration

  if (typeof effectx.ease      != 'undefined') params['ease'           ] = effectx.ease; else params['ease'] = Power1.easeInOut ;

  if (typeof effectx.delay     != 'undefined') params['delay'          ] = effectx.delay        ;
  if (typeof effectx.origin    != 'undefined') params['transformOrigin'] = effectx.origin       ;
  else params['transformOrigin'] = '50% 50%';

  if (typeof effectx.xmove     != 'undefined') params['x'              ] = '+=' + effectx.xmove ;
  if (typeof effectx.ymove     != 'undefined') params['y'              ] = '+=' + effectx.ymove ;

  if (typeof effectx.scale     != 'undefined') params['scale'          ] = '*=' + effectx.scale ;
  if (typeof effectx.xscale    != 'undefined') params['scaleX'         ] = '*=' + effectx.xscale;
  if (typeof effectx.yscale    != 'undefined') params['scaleY'         ] = '*=' + effectx.yscale;

  if (typeof effectx.transp_to != 'undefined') params['autoAlpha'      ] = effectx.transp_to    ;
  if (typeof effectx.rotate    != 'undefined') params['rotation'       ] = '+=' + effectx.rotate;

  //————— make exists if not 0 opacity

//if (params['autoAlpha']==1){                          // this has to happen before anim is called
//  params['onComplete'      ] = set_existence;
//  params['onCompleteParams'] = [effectx.obj, true];
//}

  if (params['autoAlpha']==0){
      params['onComplete'      ] = set_existence;
      params['onCompleteParams'] = [effectx.obj, false];
  }

  return params;
}

//———————————————————————————————————————— log(arg)

function log(arg){ console.log(arg) }

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

//———————————————————————————————————————— document['getElementsByRegex'] = function(pattern){

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

var a = 'homeTrans'; try { animations[a].dump_flags(); } catch (error) { log('⚠️  "'+a+'" is not listed.'); }


//———————————————————————————————————————— fin

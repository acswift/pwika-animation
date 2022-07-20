
//———————————————————————————————————————— svija-life.js

/*———————————————————————————————————————— notes

  Svija Life 1.0.6.3

  github.com/svijalove/animation
  
  ©2022 Svija SAS, Cusset France

—————————————————————————————————————————— */
//———————————————————————————————————————— start timer

const d1 = new Date();
let start_time = d1.getTime();
log("——— svija-life.js ———");

//———————————————————————————————————————— separator, types of triggers and actions

const  separator = '_x2F_'; // regular slash
const   triggers = [ 'mouse', 'time', 'scroll' ];
const    actions = [ 'click', 'over',  'away',  'ovaway', 'press', 'down', 'toggle', 'delay', 'point', 'zone', 'scrub' ];

//———————————————————————————————————————— conversion dictionaries

const entity_conversion = {
  'x002D': '-',
  'x2F'  : '/',
  'x2B'  : '+',
  'x25'  : '%',
  'x3C'  : '<',
  'x3E'  : '>'
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

const action_flag_value_to_key = {

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
  'scale'      : 1,
  'transp_to'  : 1,
  'xmove'      : 2,
  'xscale'     : 2,
  'ymove'      : 2,
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

const action_defaults = {
  'delay'   : 5.0, // only for time/delay anims
  'duration': 0.5
}


//:::::::::::::::::::::::::::::::::::::::: MODEL DEFINITIONS

//———————————————————————————————————————— class Animation & methods

// https://www.w3schools.com/js/js_classes.asp

var animations = {};   // Animations
var functions  = [];   // mouse functions called by func flag

class Animation{

  constructor( name, trigger, action ){

    this.name       = name;         // 20-character string
    this.trigger    = trigger;      // trigger
    this.action     = action;       // array of actions
  }

  add_trigger(obj, kind, flags){

    // initialize

    var zoopy     = new Trigger;
    zoopy.element = obj;
    zoopy.kind    = kind;

    // set defaults

    Object.keys(trigger_defaults).forEach(
      key => { zoopy[key] = trigger_defaults[key]; }
    );


    // loop through flags (kind|name|parameters...)

    for(var x=2; x<flags.length; x++){ //————————————————————————————————————-

      // determine flag key from value
      // entity conversion not necessary for triggers

      var val = flags[x];
      var key = trigger_flag_value_to_key[val];

      // if not function, set flag

      if (key != 'func'){
        var v = trigger_flag_value_to_key_value[val];
        if (val == '') errlog('Trigger "'+this.name+'" has an extra slash.');
        else if (typeof v == 'undefined') errlog('Trigger "'+this.name+'" has unknown flag: "'+val+'".');
        else zoopy[key] = v;
      }

      // if function, add arguments to "args"
      else {
        zoopy.func = true;
        zoopy.args = [];
        for (var y=x+1; y<flags.length; y++)
          zoopy.args.push(flags[y]);

        x = 1000; // get out of loop — no other flags can follow func
      }
      
      // set link & parent target
  
      zoopy.link = obj.parentNode.hasAttribute('xlink:href'); // true false
      if (zoopy.link && zoopy.blank)
        zoopy.element.parentNode.setAttribute("target", "_blank");
  
    } //—————————————————————————————————————————————————————————————————————-


    if (typeof this.trigger == 'undefined') this.trigger = [];
    this.trigger.push(zoopy);

  }

  add_action(obj, kind, flags){

    // initialize

    var zoopy     = new Action;
    zoopy.element = obj;
    zoopy.kind    = kind;

    // loop through flags (kind|name|parameters...)

    for(var x=2; x<flags.length; x++){

      // get key
      var key;
      var flag = flags[x];

      // convert entites to real characters
      var char1 = flag.substr(0,1);
      var char2 = flag.substr(1,1);
      var charX = flag.slice(-1);
      if (char1=='_' || char2=='_' || charX=='_') flag = convert_entities(flag);

      // assign value to flag
      key = this.get_action_key(flag);
      if (typeof zoopy[key] != 'undefined') errlog('Action "'+this.name +'" ('+kind+') has duplicate "'+key+'" flags');

      zoopy[key] = this.get_val(key, flag);

    }

    // special cases (so absence of flags behaves as expected) ———————————————————————————————

    // set transparency 0 to 100
    if ( typeof zoopy.xmove     == 'undefined' &&
         typeof zoopy.ymove     == 'undefined' &&
         typeof zoopy.rotate    == 'undefined' &&
         typeof zoopy.scale     == 'undefined' &&
         typeof zoopy.xscale    == 'undefined' &&
         typeof zoopy.yscale    == 'undefined' &&
         typeof zoopy.transp_to == 'undefined' ){
      zoopy.transp_from = 0;
      zoopy.transp_to   = 100;
    }

    // set default duration
    if (typeof zoopy.duration=='undefined')
      zoopy.duration= action_defaults.duration;

    // set default delay
    if (zoopy.kind=='delay' && typeof zoopy.delay=='undefined')
      zoopy.delay= action_defaults.delay;

    if (zoopy.transp_to == 0 && typeof zoopy.transp_from == 'undefined')
      zoopy.transp_from = 100;

    // if destination transparency is not 0, default starting transparency is 0
    if (typeof zoopy.transp_from == 'undefined' && typeof zoopy.transp_to != 'undefined') 
      zoopy.transp_from = 0;

    if (typeof this.action == 'undefined') this.action = [];
    this.action.push(zoopy);

  }

  set_cursor(){
  
    for (var t=0; t<this.trigger.length; t++){

      if (typeof this.trigger[t].cursor != 'undefined')
        this.trigger[t].element.style.cursor = cursors[this.trigger[t].cursor];
  
      else{
        var is_hand = false;
  
        if (this.trigger[t].link ) is_hand = true;
        if (this.trigger[t].func ) is_hand = true;
        if (this.kind == 'click' ) is_hand = true;
        if (this.kind == 'down'  ) is_hand = true;
        if (this.kind == 'toggle') is_hand = true;

        if (is_hand){
          this.trigger[t].element.style.cursor = cursors['default_link'];
        }
      }
    }
  
  }

  activate_function(){

    // https://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string
    // https://www.geeksforgeeks.org/how-to-call-function-from-it-name-stored-in-a-string-using-javascript/

    for (var x=0; x<this.trigger.length; x++){
      if (!this.trigger[x].func) continue;

      var args = this.trigger[x].args;

      functions[this.name] = window['func_'+this.name];

      log('activating function '+this.name);
      if (typeof functions[this.name] != 'undefined')
        this.trigger[x].element.addEventListener('click', functions[this.name].bind(null, ...args)); 
      else
        errlog('Function func_'+this.name+' does not exist.');
    }
  }

  make_visible(){


    if (typeof this.action=='undefined') return true;

    for (var x=0; x<this.action.length; x++){

      if (this.action[x].transp_from == 0) continue;

      if (typeof this.action[x].transp_from != 'undefined')
        this.action[x].element.style.opacity = this.action[x].transp_from/100;
      else this.action[x].element.style.opacity = 1;

      this.action[x].element.style.display = 'block';
      set_clickable(this.action[x].element, true);
    }

  }

  delete_if_no_action(){
  
    for (var t=0; t<this.trigger.length; t++){
      if (typeof this.action == 'undefined')
        if (!this.trigger[t].func && !this.trigger[t].link){
          delete animations[this.name];
          errlog('Animation '+this.name+' deleted (no action, link or function). SVG NAME');
        }
    }
    
    return true;
  }

  dump_flags(){
    log('\n\nv debug output —————————————————————————— ⚠️\ '+this.name);
    Object.keys(this).forEach(key => {
      if (typeof this[key] != 'undefined')
        log(key+' ('+typeof(this[key])+') — '+this[key]);
    });

    for (var t=0; t<this.trigger.length; t++){
      log('\nTrigger['+t+']');
      Object.keys(this.trigger[t]).forEach(key => {
        if (typeof this.trigger[t][key] != 'undefined')
          if(key=='element')log('element (object) — '+convert_entities(this.trigger[t][key].id));
          else log(key+' ('+typeof(this.trigger[t][key])+') — '+this.trigger[t][key]);
      });
    }

    for (var x=0; x<this.action.length; x++){
      log('\nAction[' + x + ']');
      Object.keys(this.action[x]).forEach(key => {
        if (typeof this.action[x][key] != 'undefined')
          if(key=='element')log('element (object) — '+convert_entities(this.action[x][key].id));
          else log(key+' ('+typeof(this.action[x][key])+') — '+this.action[x][key]);
      });
    }
    
    log('^ end debug output —————————————————————————— ⚠️\n\n');
  }

  get_action_key(flag){

  // is programmed specifically to optimize key finding
  // needs to be updated when flags are modified

    var key = '';

    try {
      var char1  = flag.slice(0,1);
      var char2  = flag.slice(1,2);

      switch(char1){
        case 'd': key = 'delay'    ; break;
        case 'n': key = 'blank'    ; break;
        case 'o': key = 'origin'   ; break;
        case 's': key = 'ease'     ; break;
        case 't': key = 'transp_to'; break;
        case 'y': key = 'yscale'   ; break;
        case '%': key = 'scale'    ; break;
        case '<': key = 'rotate'   ; break;

        case 'h': if (char2=='a') key = 'ease'     ; else key = 'cursor'  ; break;
        case 'x': if (char2=='0') key = 'xmove'    ; else key = 'xscale'  ; break; // entity x002DX · see clipping masks
        case '-': if (char2=='x') key = 'xmove'    ; else key = 'ymove'   ; break;
        case '+': if (char2=='x') key = 'xmove'    ; else key = 'ymove'   ; break;

        default:
          var charx  = flag.slice(-1);
          if (charx == '>')                  key = 'rotate';
          else if (parseFloat(flag) == flag) key = 'duration';

          if (key==''){
            if (flag != '')
              errlog('Action "'+this.name+'" has an unknown flag: "'+flag +'".');
            else
              errlog('Action "'+this.name+'" has an extra slash.');
            return null;
          }

      }
      
      //log('🦚 '+key+' :: '+flag + '::::'+flag.slice(1,2));
      return key;
    }
    catch (error) {
      if (flag == '') errlog('Action "'+this.name+'" has an extra slash.');
      else errlog('Action "'+this.name+'" has an unknown flag: "'+flag +'".');
      return null;
    }


  }

get_val(key, flag){
  var flag_len = flag_length[key];
  if (flag_len == 0) return flag;

  if ((key=='xmove' || key=='ymove') && flag.slice(0,1)=='-')
    return 0-flag.substr(flag_len);

  if (key=='rotate')
    if (flag.slice(-1)=='>') return flag.slice(0, flag.length-1);
    else return 0-flag.slice(1, flag.length);

  return flag.substr(flag_len);
}


}

//———————————————————————————————————————— class Trigger

class Trigger{

  constructor( name, element, kind, cursor, func, args, link, blank ){

    this.name       = name;         // 20-character string
    this.element    = element;      // object reference
    this.kind       = kind;         // string · kind of trigger                  scroll, mouse, time 

    // flags
    this.cursor     = cursor;       // string · cursor on pointerover              a, h, t (arrow, hand, text)
    this.func       = func;         // boolean · calls function of same name     onclick only 
    this.args       = args;         // array · args passed to function           all flags following name
    this.link       = link;         // boolean · is an SVG link                  programmatically
    this.blank      = blank;        // boolean · link target is _blank           n
  }
}

//———————————————————————————————————————— class Action

class Action{

  constructor( name, element, kind, delay, handoff, handwait, duration, ease,
               xmove, ymove, origin, rotate, scale, xscale, yscale, transp_to, transp_from ){

    this.name        = name;         // 20-character string
    this.element     = element;      // object reference
    this.kind        = kind;         // string · kind of action                  click, over, down, away, ovaway, down, toggle, visible

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

for(var x=0; x<clip_users.length; x++){

  var path_url = clip_users[x].style.clipPath;
  if (path_url.slice(6,12)=='animat') continue; // should be 'SVGID_', or match parent SVG ID
  id = path_url.slice(6, path_url.length-2);
  var new_id = 'CP' + id;
  clip_path = document.getElementById(id);

  try{
    clip_path.id = new_id;
    clip_users[x].style.clipPath = 'url("#' + new_id + '")';
    log('clipping path disambiguated: '+convert_entities(id.slice(0,-52)));

    if (r=fix_minus(clip_path)) log('minus-sign bug corrected for '+convert_entities(r));
  }
  catch(msg){
    log('⚠️ object with ID '+convert_entities(id)+' could not be updated');
  }
}

//———————————————————————————————————————— register triggers

log('\nregistering triggers…');

triggers.forEach(kind => {
  var stem = "[id^='" + kind + separator + "']";
  var obj_array = Array.from(document.querySelectorAll(stem));

  // loop through adding triggers
  for(var x=obj_array.length-1; x>-1; x--){ // reverse order to match layer palette order
    var obj = obj_array[x];
    var flags = obj.id.split(separator);

    // doesn't have at least trigger and name
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
  //                   else log('—› no '+kind+' triggers');
});

//———————————————————————————————————————— register actions

log('\nregistering actions…');

actions.forEach(kind => {
  var stem = "[id^='" + kind + separator + "']";
  var obj_array = Array.from(document.querySelectorAll(stem));

  // loop through adding actions
  for(var x=0; x<obj_array.length; x++){

    var obj   = obj_array[x];
    var flags = obj.id.split(separator);

    // is a duplicate; AI added _00000018952208152505492020000014739121534903857057_ to ID
    if (flags[flags.length-1].length > 50)
      flags[flags.length-1] = flags[flags.length-1].slice(0, -52);

    //  kind = flags[0];
    var name = flags[1];

    if (Object.keys(animations).includes(name))
      animations[name].add_action(obj, kind, flags)
    else
      errlog('Action "'+name+'" has no trigger and was not registered (id='+obj_array[x].id+') SVG NAME');

  }

  // log results
  if (obj_array.length != 0) log(obj_array.length+' '+ kind+' actions registered');
  //                    else log('—› no '+kind+' actions');

});

//———————————————————————————————————————— turn on "default on" elements, set cursors, and activate functions  · deactivated

log('\nturning on "default on" elements & setting cursors…');

Object.keys(animations).forEach(name => {
  animations[name].set_cursor();
  animations[name].activate_function();
  animations[name].make_visible();
})

//———————————————————————————————————————— delete unused triggers

log('deleting actionless animations…');

Object.keys(animations).forEach(name =>
  animations[name].delete_if_no_action()
)

//———————————————————————————————————————— enable actions

log('\nactivating animations…');

Object.keys(animations).forEach(name => {

  // not necessary to go through all triggers
  // the first one is enough to set up the action

  if (animations[name].trigger[0].kind=='mouse') // 2ms
    activate_mouse(animations[name]);  

  if (animations[name].trigger[0].kind=='time') // 2ms
    activate_time(animations[name]);

  if (animations[name].trigger[0].kind=='scroll') // 11ms
    activate_scroll(animations[name]);

})

//———————————————————————————————————————— end timer

const d2 = new Date();
let end_time = d2.getTime();

log('\n———————————————————— finished in '+(end_time-start_time)+'ms\n\n');


//:::::::::::::::::::::::::::::::::::::::: BUILD EACH ACTION

//———————————————————————————————————————— activate_mouse(animation)

// TODO make dict of function names for each type, with parameters

function activate_mouse(animation){

  if (typeof animation.action == 'undefined'){
    // is link or function
    return true;
  }

  for (var x=0; x<animation.action.length; x++){
    switch (animation.action[x].kind) {
    case undefined: break; // if it's just a link or func

    case 'click':
      mouse_single(animation, x, 'pointerup');
      break;
    case 'press':
      mouse_single(animation, x, 'pointerdown');
      break;
    case 'over':
      mouse_single(animation, x, 'pointerover'); 
      break;
    case 'away':
      mouse_single(animation, x, 'pointerout'); // or pointerleave
      break;

    // special cases
    case 'ovaway':
      mouse_ovaway(animation, x);
      break;
    case 'down':
      mouse_down(animation, x);
      break;
    case 'toggle':
      mouse_toggle(animation, x);
      break;

    default:
      log('⚠️ unimplemented mouse action: "'+animation.action[0].kind+'" in animation "'+animation.name+'"');
    }
  }

  log('mouse animations activated');
}

//———————————————————————————————————————— activate_time(animation)

function activate_time(animation){

  for (var x=0; x<animation.action.length; x++){
    switch (animation.action[x].kind) {
    case 'delay':
      time_delay(animation, x);
      break;

    default:
      if (typeof animation.action[x].kind != 'undefined') errlog('unknown time kind: '+animation.action[x].kind);
      else errlog('missing time action: '+animation.name);
    }
  }

  log('time animations activated');
}

//———————————————————————————————————————— activate_scroll(animation)

function activate_scroll(animation){

  for (var x=0; x<animation.action.length; x++){
    switch (animation.action[x].kind) {
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
      if (typeof animation.action[x].kind != 'undefined') errlog('unknown scroll kind: '+animation.action[x].kind);
      else errlog('missing scroll action: '+animation.name);
    }
  }

  log('scroll animations activated');
}


//:::::::::::::::::::::::::::::::::::::::: ACTIONS

//———————————————————————————————————————— time_delay(animation)

function time_delay(animation, x){

  delay  = animation.action[x].delay * 1000;
  params = gsap_params(animation.action[x]);
  setTimeout(execute_anim.bind(null, animation.name+x, animation.action[x], params), delay);

}


//———————————————————————————————————————— mouse_single(animation, x, type)

function mouse_single(animation, x, type){

  params = gsap_params(animation.action[x]);
  for (var t=0; t<animation.trigger.length; t++){
    animation.trigger[t].element.addEventListener(type, execute_anim.bind(null, animation.name+x, animation.action[x], params), false);
  }
}

//———————————————————————————————————————— mouse_ovaway(animation, x)

// rotation is not cumulative (rotating to 90° twice just turns to 90°)

function mouse_ovaway(animation, x){

  params = gsap_params(animation.action[x]);
  for (var t=0; t<animation.trigger.length; t++){
    animation.trigger[t].element.addEventListener('pointerover',  execute_anim.bind(null, animation.name+x, animation.action[x], params), false);
    animation.trigger[t].element.addEventListener('pointerout',   reverse_anim.bind(null, animation.name+x                             ), false);
  }

}

//———————————————————————————————————————— mouse_down(animation, x)

// rotation is not cumulative (rotating to 90° twice just turns to 90°)

function mouse_down(animation, x){

  params = gsap_params(animation.action[x]);
  for (var t=0; t<animation.trigger.length; t++){
    animation.trigger[t].element.addEventListener('pointerdown', execute_anim.bind(null, animation.name+x, animation.action[x], params), false);
    animation.trigger[t].element.addEventListener('pointerup',   reverse_anim.bind(null, animation.name+x                             ), false);
  }

}

//———————————————————————————————————————— mouse_toggle(animation, x)

function mouse_toggle(animation, x){
  params = gsap_params(animation.action[x]);
  for (var t=0; t<animation.trigger.length; t++){
    animation.trigger[t].element.addEventListener('pointerup', execute_toggle.bind(null, animation.name+x, animation.action[x], params), false);
  }
}


//———————————————————————————————————————— scroll_point(animation,x)

function scroll_point(animation, x){

  for (var t=0; t<animation.trigger.length; t++){
    var obj = animation.trigger[t].element;

    var box = obj.getBBox();      // get bounding box of trigger
    var t = box['y'];             // top

    var params = gsap_params(animation.action[x]);
    window.addEventListener('scroll', execute_scroll_point.bind(null, animation, x, t, params)); 

    // in case something should already be visible
    execute_scroll_point(animation, x, t, params); 
  }
}

//———————————————————————————————————————— scroll_scrub(animation,x)

function scroll_scrub(animation, x){

  for (var t=0; t<animation.trigger.length; t++){
    var obj = animation.trigger[t].element;

    var box = obj.getBBox();      // get bounding box of trigger
    var t = box['y'];             // top
    var b = t + box['height'];    // bottom

    var params = gsap_params(animation.action[x]);
    window.addEventListener('scroll', execute_scroll_scrub.bind(null, animation, x, t, b, params)); 

    // in case something should already be visible
    execute_scroll_scrub(animation, x, t, b, params); 
  }
}

//———————————————————————————————————————— scroll_zone(animation,x)

function scroll_zone(animation, x){

  for (var t=0; t<animation.trigger.length; t++){
    var obj = animation.trigger[t].element;

    var box = obj.getBBox();      // get bounding box of trigger
    var t = box['y'];             // top
    var b = t + box['height'];    // bottom

    var params = gsap_params(animation.action[x]);
    window.addEventListener('scroll', execute_scroll_zone.bind(null, animation, x, t, b, params)); 

    // in case something should already be visible
    execute_scroll_zone(animation, x, t, b, params); 
  }
}


//:::::::::::::::::::::::::::::::::::::::: ACTION-RELATED

//———————————————————————————————————————— execute_scroll_point(animation, x, trig_top, params)

// https://stackoverflow.com/questions/4096863/how-to-get-and-set-the-current-web-page-scroll-position

/*    special cases:
 
      • top is visible to start with
      • action transparency default is visible to start with */

// called every time a scroll action

function execute_scroll_point(animation, x, trig_top, params){

  var page_top     = document.documentElement.scrollTop || document.body.scrollTop;
  var pixel_height = window.innerHeight;

  var rem_top = page_top / illustrator_pixel;

  var obj      = animation.action[x].element;
  var funcName = animation.name + x + '_timeline';
  var tline    = window[funcName];

  // goes on when trigger top scrolls up past top of page
  
  // trigger is activated
  if (trig_top < rem_top){
    if (typeof tline != 'undefined'){
      if (tline.reversed()) tline.play();       //  if reversed play it · not relevant but will be useful when reset flag is added
    }
    else{
      //  doesn't exist: create & play it
      window[funcName] = new gsap.timeline({paused:true});
      var tline = window[funcName];
      tline.to(obj, params);
      tline.play();
    }
  }

}

/*———————————————————————————————————————— execute_scroll_scrub(animation, x, trig_top, trig_bot, params)

    ways to get to correct position:
    - seek(seconds) · allows relative jumps
    - time(seconds) · doesn't include repeats & delays
    - totalTime() · includes repeats & delays (what I want)

    ways to get timeline length
    - .totalDuration()

    https://greensock.com/docs/v3/GSAP/Timeline/totalTime()
    https://greensock.com/forums/topic/8287-most-efficient-way-of-setting-timeline-playhead/ */

function execute_scroll_scrub(animation, x, trig_top, trig_bot, params){

  var page_top     = document.documentElement.scrollTop || document.body.scrollTop;
  var pixel_height = window.innerHeight;

  var rem_top = page_top / illustrator_pixel;

  var obj      = animation.action[x].element;
  var funcName = animation.name + x + '_timeline';
  var tline    = window[funcName];

  // % of bar above top of window = % of timeline
  
  // trigger is activated
  if (trig_top < rem_top && trig_bot > rem_top){
    if (typeof tline == 'undefined'){
      window[funcName] = new gsap.timeline({paused:true});
      var tline = window[funcName];
      tline.to(obj, params);
    }

    var obj_height = trig_bot - trig_top;
    var passed = rem_top - trig_top;
    var pcent = passed/obj_height;
    pcent = Math.round(pcent * 10000)/10000; // percent + 2 decimals
    var new_time = tline.totalDuration() * pcent;
    tline.totalTime(new_time);
  
  }

  else {
    if (typeof tline != 'undefined'){

      // if trigger is below top of page, snap to 0
      if (trig_top > rem_top) tline.totalTime(0);

      // if trigger is above top of page, snap to 100
      if (trig_bot < rem_top) tline.totalTime(tline.totalDuration());
    }
  }
}

//———————————————————————————————————————— execute_scroll_zone(animation, x, trig_top, trig_bot, params)

// https://stackoverflow.com/questions/4096863/how-to-get-and-set-the-current-web-page-scroll-position

/*    special cases:
 
      • top is visible to start with
      • action transparency default is visible to start with */

// called every time a scroll action

function execute_scroll_zone(animation, x, trig_top, trig_bot, params){

  var page_top     = document.documentElement.scrollTop || document.body.scrollTop;
  var pixel_height = window.innerHeight;
  var page_bot     = page_top + pixel_height;

  var rem_top = page_top / illustrator_pixel;
  var rem_bot = page_bot / illustrator_pixel;

  var obj      = animation.action[x].element;
  var funcName = animation.name + x + '_timeline';
  var tline    = window[funcName];

  // goes on when trigger top scrolls up past top of page
  // goes off when trigger bottom < bottom of page
  
  // trigger is activated
  if (trig_top > rem_top && trig_bot < rem_bot){
    if (typeof tline != 'undefined'){
      if (tline.reversed()) tline.play();       //  if reversed play it
    }
    else{
      //  doesn't exist: create & play it
      window[funcName] = new gsap.timeline({paused:true});
      var tline = window[funcName];
      tline.to(obj, params);
      tline.play();
    }
  }

  // trigger is deactivated
  else{
    if (typeof tline == 'undefined') return true;                      //  doesn't exist: do nothing
    if (!tline.isActive() && !tline.reversed()) tline.reverse();       //  paused not reversed (at end): reverse it
    else if (tline.isActive() && !tline.reversed()) tline.reverse();   //  playing not reversed: reverse it */
    return true;
  }

}

//———————————————————————————————————————— execute_anim(obj, params)

//nction execute_anim(animation, params){
function execute_anim(namex, actionx, params){

  obj = actionx.element;

  var funcName = namex + '_timeline';

  // create if it doesn't exist
  if (typeof window[funcName] == 'undefined'){
    window[funcName] = new gsap.timeline({paused:true});
    window[funcName].to(obj, params);
  }

  // play if it's not playing or if it's reversed
  if (!window[funcName].isActive() || (window[funcName].isActive() && window[funcName].reversed())){
    window[funcName].play();
  }

  // make unclickable to avoid layering conflicts
  if (params.autoAlpha==0) set_clickable(obj, false);
                      else set_clickable(obj, true );
}

//———————————————————————————————————————— execute_toggle(obj, params)

// only called when clicked

//nction execute_toggle(animation, params){
function execute_toggle(namex, actionx, params){

  var obj      = actionx.element;
  var funcName = namex + '_timeline';
  var tline    = window[funcName];

  // create & play if doesn't exist
  if (typeof tline == 'undefined'){

    window[funcName] = new gsap.timeline({paused:true});
    var tline = window[funcName];
    tline.to(obj, params);
    tline.play();

  } else {

    if (tline.reversed()) tline.play();
    else                  tline.reverse();

  }

}


//:::::::::::::::::::::::::::::::::::::::: GENERIC

//———————————————————————————————————————— reverse_anim(obj, params)

//nction reverse_anim(animation){
function reverse_anim(name){
  var funcName = name + '_timeline';
  window[funcName].reverse();
}


//:::::::::::::::::::::::::::::::::::::::: UTILITIES

//———————————————————————————————————————— set_clickable(obj, clickable)

function set_clickable(obj, clickable){
  if (clickable)
    obj.style.pointerEvents = 'visiblePainted';
  else
    obj.style.pointerEvents = 'none';
}

//———————————————————————————————————————— convert_transform(origin)

function convert_transform(origin){
  if (typeof origin == 'undefined') return "50% 50%";

  var parts = origin.split('_x2C_');
  var result = parts.join('% ') + '%';
  return result;
}

//———————————————————————————————————————— gsap_params(action)

function gsap_params(action){

  var params = {};

  params['duration'       ] = action.duration==0 ? 0.001:action.duration
  params['transformOrigin'] = convert_transform(action.origin);

  if (typeof action.ease     == 'undefined') params['ease'     ] = Power1.easeInOut     ;
                                        else params['ease'     ] = eases[action.ease]   ;

  if (typeof action.delay    != 'undefined') params['delay'    ] = action.delay         ;

  if (typeof action.xmove    != 'undefined') params['x'        ] = '+=' + action.xmove  ;
  if (typeof action.ymove    != 'undefined') params['y'        ] = '+=' + action.ymove  ;

  if (typeof action.scale    != 'undefined') params['scale'    ] = action.scale    / 100;
  if (typeof action.xscale   != 'undefined') params['scaleX'   ] = action.xscale   / 100;
  if (typeof action.yscale   != 'undefined') params['scaleY'   ] = action.yscale   / 100;

  if (typeof action.transp_to  != 'undefined') params['autoAlpha'] = action.transp_to  / 100;
  if (typeof action.rotate   != 'undefined') params['rotation' ] = action.rotate        ;

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

//———————————————————————————————————————— debugging

//var a = 'name1'; try { animations[a].dump_flags(); } catch (error) { log('⚠️  "'+a+'" is not listed.'); }


//———————————————————————————————————————— fin

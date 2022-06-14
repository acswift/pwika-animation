
//———————————————————————————————————————— animations-1.0.3.js

/*———————————————————————————————————————— notes

  only make opacity 0 if there's not a physical transform
  by default opacity goes 0-100
  with one argument it's —› the argument from the opposite
  o20-40 is range of opacities

  move eases to end of list page

  change scrolling so it's when bar gets to top of page? 

  instead of null use undefined, don't bother setting values we don't use

  triggers:
    scroll
    mouse 
    delay

  mouse actions:
    click
    over
    away
    press
    ovaway
    toggle

  delay actions:
    timed

  scroll actions:
    zone

https://docs.google.com/spreadsheets/d/1_INTDgE9-XKC63PSlRClXJDoC7afz6V7FFB3hiN7bhE/edit#gid=1328156795
https://docs.google.com/document/d/1nImxZ6IgWFqDx6cOtrN-s9yZu564oMAxRxPwx_9lXSs/edit
https://www.freecodecamp.org/news/how-javascript-implements-oop/

————————————————————————————————————————*/
//———————————————————————————————————————— start timer

const d1 = new Date();
let start_time = d1.getTime();
log("animations-1.0.3.js");

//———————————————————————————————————————— separator, types of triggers and actions

const  separator = '_x2F_'; // regular slash
const   triggers = [ 'mouse',                                               'delay', 'scroll' ];
const    actions = [ 'click',  'over', 'away', 'ovaway', 'press', 'toggle', 'timed', 'zone'   ];

//———————————————————————————————————————— conversion dictionaries

const flag_value_to_key = {

  // name & kind are given

  // trigger flags
  'func'  : 'func'       , // no value
  'a'     : 'cursor'     , // no value
  'h'     : 'cursor'     , // no value
  't'     : 'cursor'     , // no value
  'n'     : 'blank'      , // no value

  // GSAP-related flags
  'softin' : 'ease'       , // no value
  'softout': 'ease'       , // no value
  'soft'   : 'ease'       , // no value
  'hard '  : 'ease'       , // no value

  'x'     : 'xmove'      , // value follows
  'y'     : 'ymove'      , // value follows
  'f'     : 'fixed'      , // value follows
  '_x3C_' : 'rotate'     , // value follows
  '_x3E_' : 'rotate'     , // value follows
  '_x25_' : 'scale'      , // value follows
  'x_x25_': 'xscale'     , // value follows
  'y_x25_': 'yscale'     , // value follows
  'o'     : 'opac_to'   , // value follows

  '_x2B_' : 'handoff'      // value follows
}

const key_length = { 

  // so we can get value from end of flag
  // # of characters, value follows

  'cursor'     : 0,
  'func'       : 0,
  'blank'      : 0,
  'handoff'    : 5,
  'ease'       : 0,
  'xmove'      : 1,
  'ymove'      : 1,
  'fixed'      : 1,
  'rotate'     : 5,
  'scale'      : 5,
  'xscale'     : 6,
  'yscale'     : 6,
  'opac_to'    : 1

}

const eases = {
  'softin'    : Power1.easeIn,
  'softout'   : Power1.easeOut,
  'soft' : Power1.easeInOut,
  'hard': "none" 
}

const cursors = {
  'a'           : 'default',
  'h'           : 'pointer',
  't'           : 'text',
  'default_link': 'pointer'
}

const flag_value_to_key_value = {
  'a'   : 'a',
  'h'   : 'h',
  't'   : 't',
  'func': true,
  'n'   : true
}

//———————————————————————————————————————— defaults

const action_defaults = { 'duration': 0.5 }

const trigger_defaults = {

  'func'       : false,
  'link'       : false,
  'blank'      : false,

}


//:::::::::::::::::::::::::::::::::::::::: MODEL DEFINITION

//———————————————————————————————————————— class Animation

// https://www.w3schools.com/js/js_classes.asp

var animations = {};   // list of Animation's
var functions  = [];   // list of mouse functions called by buttons

class Animation{

  constructor( name, trigger, t_kind, cursor, func, args, link, blank, action,
               a_kind, delay, handoff, handwait, duration, ease, xmove, ymove,
               fixed, rotate, scale, xscale, yscale, opac_to, opac_from ){

    this.name       = name;         // 20-character string

    // trigger-specified
    this.trigger    = trigger;      // object reference
    this.t_kind     = t_kind;       // string · kind of trigger                  scroll, mouse, delay
    this.cursor     = cursor;       // string · cursor on pointerover              a, h, t (arrow, hand, text)
    this.func       = func;         // boolean · calls function of same name     onclick only 
    this.args       = args;         // array · args passed to function           all flags following name
    this.link       = link;         // boolean · is an SVG link                  programmatically
    this.blank      = blank;        // boolean · link target is _blank           n

    // action-specified
    this.action     = action;       // object reference
    this.a_kind     = a_kind;       // string · kind of action                   click, over, down, away, ovaway, toggle, visible
    this.delay      = delay;        // number · seconds before animation starts  33 (2nd number)
    this.handoff    = handoff;      // string · following animation
    this.handwait   = handwait;     // number · seconds before calling following animation

    // GSAP-related
    this.duration   = duration;     // number · duration in seconds              34.5 (1st number)
    this.ease       = ease;         // animation ease                            in, out, inout, noease
    this.xmove      = xmove;        // x movement                                x-30
    this.ymove      = ymove;        // y movement                                y25
    this.fixed      = fixed;        // fixed point                               0f0 to 100f100
    this.rotate     = rotate;       // number · rotation                         >20 or <45.5
    this.scale      = scale;        // number · percentage to scale              %150
    this.xscale     = xscale;       // number · percentage to scale x            x%20
    this.yscale     = yscale;       // number · percentage to scale y            y%30
    this.opac_to   = opac_to;     // number · percentage opac_to              o30
    this.opac_from    = opac_from;      // number · opac_from/opac_to      programmatically
  }

  add_trigger(obj, kind, flags){

    // set defaults

    Object.keys(trigger_defaults).forEach(
      key => { this[key] = trigger_defaults[key]; }
    );

    // initialize

    this.trigger    = obj;
    this.t_kind     = kind;

    // loop through flags (kind|name|parameters...)

    for(var x=2; x<flags.length; x++){

      // determine flag key from value
      // entity conversion not necessary for triggers

      var val = flags[x];
      var key = flag_value_to_key[val];

      // if not function, set flag

      if (key != 'func'){
        var v = flag_value_to_key_value[val];
        if (val == '') errlog('Trigger '+this.name+' has an extra slash.');
        else if (typeof v == 'undefined') errlog('Trigger '+this.name+' has unknown flag: "'+val+'".');
        this[key] = flag_value_to_key_value[val];
      }

      // if function, add arguments to "args"
      else {
        this.func = true;
        this.args = [];
        for (var y=x+1; y<flags.length; y++)
          this.args.push(flags[y]);

        x = 1000; // get out of loop — no other flags can follow func
      }
      
    // set link & parent target

    this.link = obj.parentNode.hasAttribute('xlink:href'); // true false
    if (this.link && this.blank)
      this.trigger.parentNode.setAttribute("target", "_blank");


    }

    // log trigger add results

//  log('——— trigger '+this.name+' — '+
//    ' cursor: '+this.cursor+
//    ' func: '+this.func+
//    ' args: '+this.args+
//    ' link: '+this.link+
//    ' blank: '+this.blank);


  }

  add_action(obj, kind, flags){

    // set defaults

    this.duration = action_defaults.duration;

    // initialize

    this.action   = obj;
    this.a_kind   = kind;

    // loop through flags (kind|name|parameters...)

    var is_duration = true;

    for(var x=2; x<flags.length; x++){

      // get key
      var key;
      var flag = flags[x];

      [key, is_duration] = this.get_key(flag, is_duration);

      // assign value to flag
      this[key] = this.get_val(key, flag);
//    log(this.name+': '+key+' = '+this[key]);

      if (key == 'rotate') this[key] = this[key] * this.fix_rotation(flag);

    }

    // special cases (so absence of flags behaves as expected)

    // set opacity 0 to 100
    if ( typeof this.xmove    == 'undefined' &&
         typeof this.ymove    == 'undefined' &&
         typeof this.rotate   == 'undefined' &&
         typeof this.scale    == 'undefined' &&
         typeof this.xscale   == 'undefined' &&
         typeof this.yscale   == 'undefined' &&
         typeof this.opac_to  == 'undefined' ){
      this.opac_from = 0;
      this.opac_to   = 100;
    }

    // set default duration
    if (this.a_kind=='timed' && typeof this.delay=='undefined'){
      this.delay    = this.duration;
      this.duration = action_defaults.duration;
    }

    // if destination opacity is not 0, default starting opacity is 0
    if (typeof this.opac_from == 'undefined' && typeof this.opac_to != 'undefined') 
      this.opac_from = 0;


  }

  delete_if_no_action(){
  
    if (this.a_kind == undefined && !this.func && !this.link){
      errlog('Trigger '+this.name+' deleted (no action, link or function).');
      delete animations[this.name];
      return true;
    }
    return false;
  }

  turn_on_if_on(){

    if (typeof this.action=='undefined') return true;
    if (this.opac_from == 0            ) return true;

    if (typeof this.opac_from != 'undefined')
      this.action.style.opacity = this.opac_from/100;
    else this.action.style.opacity = 1;

    this.action.style.display = 'block';
    set_clickable(this.action, true);

  }

  set_cursor(){
  
    if (typeof this.cursor != 'undefined')
      this.trigger.style.cursor = cursors[this.cursor];
  
    else{
      var is_hand = false;
  
      if (this.trigger.link      ) is_hand = true;
      if (this.trigger.func      ) is_hand = true;
      if (this.a_kind == 'click' ) is_hand = true;
      if (this.a_kind == 'toggle') is_hand = true;
  
      if (is_hand){
        this.trigger.style.cursor = cursors['default_link'];
      }
    }
  
  }

  dump_flags(){
    Object.keys(this).forEach(key => {
      log(key+', '+typeof(this[key])+': '+this[key]);
    });
    
    log('\n\n');
  }

  get_key(flag, is_duration){

  // is programmed specifically to optimize key finding
  // needs to be updated when flags are modified

    try {
      var first = flag.substr(0,1);

      // has to be rewritten when flags are modified
      // the point is to avoid a loop
      switch(first){
        case 'a':                            key = 'cursor'  ; break;
        case 'i':                            key = 'ease'    ; break;
        case 't':                            key = 'cursor'  ; break;
        case 'n':                            key = 'blank'   ; break;
        case 's':                            key = 'ease'    ; break;
        case 'o':                            key = 'opac_to'; break;
        case 'f': if (flag=='func'         ) key = 'func'    ; else key = 'fixed'   ; break;
        case 'h': if (flag=='hard'         ) key = 'ease'    ; else key = 'cursor'  ; break;
        case 'x': if (flag.substr(1,1)=='_') key = 'xscale'  ; else key = 'xmove'   ; break;
        case 'y': if (flag.substr(1,1)=='_') key = 'yscale'  ; else key = 'ymove'   ; break;
        case '_': key = flag_value_to_key[flag.substr(0,5)]  ; break;

      default:
        if (parseFloat(flag) != flag){
          if (flag == '') errlog('Action '+this.name+' has an extra slash.');
          else errlog('Action '+this.name+' has an unknown flag: "'+flag +'".');
          return [null, false];
        }

        // presume it's a number
        if (is_duration){
          key = 'duration';
          is_duration = false;
        }
        else key = 'delay';

      }
      return [key, is_duration];
    }
    catch (error) {
      if (flag == '') errlog('Action '+this.name+' has an extra slash.');
      else errlog('Action '+this.name+' has an unknown flag: "'+flag +'".');
      return [null, false];
    }


  }

  get_val(key, flag){

    var key_len = key_length[key];

    if (key_len == 0) return flag;
    else return flag.substr(key_len);
  }

  activate_function(){

    // https://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string
    // https://www.geeksforgeeks.org/how-to-call-function-from-it-name-stored-in-a-string-using-javascript/

    if (!this.func) return true;

    // var args = this.args;

    // TODO need to check if function exists, or will throw error:
    // TODO need to activate args
    functions[this.name] = window['func_'+this.name];

    log('activating function '+this.name);
    this.trigger.addEventListener('click', functions[this.name].bind(null, 'fuckin-a')); 
  }

  fix_rotation(flag){
    if (flag.substr(0,5) == '_x3C_') return -1;
    else return 1;
  }


}


//:::::::::::::::::::::::::::::::::::::::: PROGRAM

//———————————————————————————————————————— register triggers

log('\n——— registering triggers ———');

triggers.forEach(kind => {
  var stem = "[id^='" + kind + separator + "']";
  var obj_array = Array.from(document.querySelectorAll(stem));

  // loop through adding triggers
  for(var x=0; x<obj_array.length; x++){
    var obj = obj_array[x];
    var flags = obj.id.split(separator);

    // doesn't have at least trigger and name
    if (flags.length<2) continue; 

    //  kind = flags[0];
    var name = flags[1];
    animations[name] = new Animation(name);
    animations[name].add_trigger(obj, kind, flags);
  }

  // log results
//if (obj_array.length == 0)
//  log('—› no '+kind+' triggers');
//else
//  log(obj_array.length+' '+ kind+' triggers');


});

//———————————————————————————————————————— register actions

log('\n——— registering actions ———');

actions.forEach(kind => {
  var stem = "[id^='" + kind + separator + "']";
  var obj_array = Array.from(document.querySelectorAll(stem));

  // loop through adding actions
  for(var x=0; x<obj_array.length; x++){
    var obj = obj_array[x];
    var flags = obj.id.split(separator);

    //  kind = flags[0];
    var name = flags[1];

    if (Object.keys(animations).includes(name))
      animations[name].add_action(obj, kind, flags)
    else
      errlog('Action "'+name+'" has no trigger and was not registered.');

  }

  // log results
  if (obj_array.length == 0) log('—› no '+kind+' actions');
                        else log(obj_array.length+' '+ kind+' actions registered');

});

//———————————————————————————————————————— turn on "default on" elements, set cursors, and activate functions  · deactivated

log('\n——— turning on "default on" elements & settings cursors ———');

Object.keys(animations).forEach(name => {
  animations[name].turn_on_if_on();
  animations[name].set_cursor();
  animations[name].activate_function();
})

//———————————————————————————————————————— delete unused triggers · DISABLED

//  log('\n——— deleting actionless animations ———');

//  Object.keys(animations).forEach(name =>
//    animations[name].delete_if_no_action()
//  )

//———————————————————————————————————————— enable actions

log('\n——— activating animations ———');

Object.keys(animations).forEach(name => {

  if (animations[name].t_kind=='mouse') // 2ms
    activate_mouse(animations[name]);  

  if (animations[name].t_kind=='delay') // 2ms
    activate_delay(animations[name]);

  if (animations[name].t_kind=='scroll') // 11ms
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

  switch (animation.a_kind) {
  case undefined: break; // if it's just a link or func

  case 'click':
    mouse_single(animation, 'pointerup');
    break;
  case 'press':
    mouse_single(animation, 'pointerdown');
    break;
  case 'over':
    mouse_single(animation, 'pointerover'); 
    break;
  case 'away':
    mouse_single(animation, 'pointerout'); // or pointerleave
    break;

  // special cases
  case 'ovaway':
    mouse_ovaway(animation);
    break;
  case 'toggle':
    mouse_toggle(animation);
    break;

  default:
    log('⚠️ unimplemented mouse a_kind:'+animation.a_kind+'in animation '+animation.name);
  }

  log('mouse animations activated');
}

//———————————————————————————————————————— activate_delay(animation)

function activate_delay(animation){

  switch (animation.a_kind) {
  case 'timed':
    delay_timed(animation);
    break;

  default:
    if (typeof a_kind != 'undefined') errlog('unknown delay a_kind: '+a_kind);
    else errlog('missing action: '+animation.name);
  }

  log('delay animations activated');
}

//———————————————————————————————————————— activate_scroll(animation)

function activate_scroll(animation){

  switch (animation.a_kind) {
  case 'zone':
    scroll_anim(animation);
    break;

  default:
    if (typeof a_kind != 'undefined') errlog('unknown scroll a_kind: '+a_kind);
    else errlog('missing action: '+animation.name);
  }

  log('scroll animations activated');
}


//:::::::::::::::::::::::::::::::::::::::: ACTIONS

//———————————————————————————————————————— delay_timed(animation)

function delay_timed(animation){

  delay  = animation.delay * 1000;
  params = gsap_params(animation);
  setTimeout(create_anim.bind(null, animation, params), delay);

}


//———————————————————————————————————————— mouse_single (animation, type)

function mouse_single(animation, type){

  params = gsap_params(animation);
  animation.trigger.addEventListener(type, create_anim.bind(null, animation, params), false);

}

//———————————————————————————————————————— mouse_ovaway(animation)

// rotation is not cumulative (rotating to 90° twice just turns to 90°)

function mouse_ovaway(animation){

  params = gsap_params(animation);

  animation.trigger.addEventListener('pointerover',  create_anim.bind(null, animation, params), false);
  animation.trigger.addEventListener('pointerout',  reverse_anim.bind(null, animation        ), false);

}

//———————————————————————————————————————— mouse_toggle(animation)

function mouse_toggle(animation){

  params = gsap_params(animation);
  animation.trigger.addEventListener('pointerup', create_toggle_anim.bind(null, animation, params), false);
}


//———————————————————————————————————————— scroll_anim(animation)

function scroll_anim(animation){

  var obj = animation.trigger;

  var box = obj.getBBox();      // get bounding box of trigger
  var t = box['y'];             // top
  var b = t + box['height'];    // bottom
  var params = gsap_params(animation);

  window.addEventListener('scroll', create_scroll_anim.bind(null, animation, t, b, params)); 
}


//:::::::::::::::::::::::::::::::::::::::: ACTION-RELATED

//———————————————————————————————————————— create_scroll_anim(animation, trig_top, trig_bot)

// https://stackoverflow.com/questions/4096863/how-to-get-and-set-the-current-web-page-scroll-position

/*    special cases:
 
      • top is visible to start with
      • action opacity default is visible to start with */

// called every time a scroll action

function create_scroll_anim(animation, trig_top, trig_bot, params){

  var page_top     = document.documentElement.scrollTop || document.body.scrollTop;
  var pixel_height = window.innerHeight;
  var page_bot     = page_top + pixel_height;

  var rem_top = page_top / illustrator_pixel;
  var rem_bot = page_bot / illustrator_pixel;

  var obj      = animation.action;
  var funcName = animation.name + '_timeline';
  var tline    = window[funcName];

// WAS:
// activated if top of trigger bar is not > bot of page
//          and bot of trigger bar is not < top of page

// IS:
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
    if (typeof tline == 'undefined') return true;                    //  doesn't exist: do nothing
    if (!tline.isActive() && !tline.reversed()) tline.reverse();     //  paused not reversed (at end): reverse it
    else if (tline.isActive() && tline.reversed()) tline.reverse();  //  playing not reversed: reverse it */
    return true;
  }

}

//———————————————————————————————————————— create_scroll_anim1(animation, trig_top, trig_bot) VERSION 1

// https://stackoverflow.com/questions/4096863/how-to-get-and-set-the-current-web-page-scroll-position

/*    special cases:
 
      • top is visible to start with
      • action opacity default is visible to start with */

// called every time a scroll action

function create_scroll_anim1(animation, trig_top, trig_bot, params){

  var page_top     = document.documentElement.scrollTop || document.body.scrollTop;
  var pixel_height = window.innerHeight;
  var page_bot     = page_top + pixel_height;

  var rem_top = page_top / illustrator_pixel;
  var rem_bot = page_bot / illustrator_pixel;

  var obj      = animation.action;
  var funcName = animation.name + '_timeline';
  var tline    = window[funcName];

// activated if top of trigger bar is not > bot of page
//          and bot of trigger bar is not < top of page

  if (trig_top < rem_bot && trig_bot > rem_top){
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
    if (typeof tline == 'undefined') return true;                    //  doesn't exist: do nothing
    if (!tline.isActive() && !tline.reversed()) tline.reverse();     //  paused not reversed (at end): reverse it
    else if (tline.isActive() && tline.reversed()) tline.reverse();  //  playing not reversed: reverse it */
    return true;
  }

}

//———————————————————————————————————————— create_toggle_anim(obj, params)

// only called when clicked

function create_toggle_anim(animation, params){

  var obj      = animation.action;
  var funcName = animation.name + '_timeline';
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

function reverse_anim(animation){
  var funcName = animation.name + '_timeline';
  window[funcName].reverse();
}

//———————————————————————————————————————— create_anim(obj, params)

function create_anim(animation, params){

  obj = animation.action;

  var funcName = animation.name + '_timeline';


if(animation.name=="name3") log('———————————————————————————————————- line 798');



  // create if it doesn't exist
  if (typeof window[funcName] == 'undefined'){
    window[funcName] = new gsap.timeline({paused:true});
    window[funcName].to(obj, params);
  }

  // play if it's not playing
  if (!window[funcName].isActive())
//if (!window[funcName].isActive() && !window[funcName].reversed()) // apparently it's still reversed after the end
    window[funcName].play();

  // make unclickable to avoid layering conflicts
  if (params.autoAlpha==0) set_clickable(obj, false);
                      else set_clickable(obj, true );
}

//———————————————————————————————————————— set_clickable(obj, clickable)

function set_clickable(obj, clickable){
  if (clickable)
    obj.style.pointerEvents = 'visiblePainted';
  else
    obj.style.pointerEvents = 'none';
}

//———————————————————————————————————————— convert_transform(fixed)

function convert_transform(fixed){
  if (typeof fixed == 'undefined') return "50% 50%";

  var parts = fixed.split('_x2C_');
  result = parts.join('% ') + '%';
  return result;
}

//———————————————————————————————————————— gsap_params(animation)

function gsap_params(animation){

  var params = {};

  params['duration'       ] = animation.duration;
  params['transformOrigin'] = convert_transform(animation. fixed);

  if (typeof animation.ease     == 'undefined') params['ease'     ] = Power1.easeInOut        ;
                                           else params['ease'     ] = eases[animation.ease]   ;

  if (typeof animation.delay    != 'undefined') params['delay'    ] = animation.delay         ;

  if (typeof animation.xmove    != 'undefined') params['x'        ] = '+=' + animation.xmove  ;
  if (typeof animation.ymove    != 'undefined') params['y'        ] = '+=' + animation.ymove  ;

  if (typeof animation.scale    != 'undefined') params['scale'    ] = animation.scale    / 100;
  if (typeof animation.xscale   != 'undefined') params['scaleX'   ] = animation.xscale   / 100;
  if (typeof animation.yscale   != 'undefined') params['scaleY'   ] = animation.yscale   / 100;

  if (typeof animation.opac_to != 'undefined') params['autoAlpha'] = animation.opac_to / 100;
  if (typeof animation.rotate   != 'undefined') params['rotation' ] = animation.rotate        ;

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

//———————————————————————————————————————— debugging

// var a = 'name2'; try { animations[a].dump_flags(); } catch (error) { log('⚠️  cannot dump flags for unknown animation "'+a+'"'); }


//———————————————————————————————————————— fin

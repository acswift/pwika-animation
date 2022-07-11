
//———————————————————————————————————————— svija-life.js

/*———————————————————————————————————————— notes

  github.com/svijalove/animation
  
  ©2022 Svija SAS, Cusset France

————————————————————————————————————————*/
//———————————————————————————————————————— start timer

const d1 = new Date();
let start_time = d1.getTime();
log("——— svija-fvx.js ———");

//———————————————————————————————————————— separator, types of triggers and actions

const  separator = '_x2F_'; // regular slash
const   triggers = [ 'mouse', 'delay', 'scroll' ];
const    actions = [ 'click', 'over',  'away',  'ovaway', 'press', 'down', 'toggle', 'timed', 'point', 'zone', 'scrub' ];

//———————————————————————————————————————— conversion dictionaries

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

  'softin' : 'ease'       , // no value
  'softout': 'ease'       , // no value
  'soft'   : 'ease'       , // no value
  'hard '  : 'ease'       , // no value

  'd'     : 'delay'      , // value follows
  'x'     : 'xmove'      , // value follows
  'y'     : 'ymove'      , // value follows
  'f'     : 'fixed'      , // value follows
  '_x3C_' : 'rotate'     , // value follows
  '_x3E_' : 'rotate'     , // value follows
  '_x25_' : 'scale'      , // value follows
  'x_x25_': 'xscale'     , // value follows
  'y_x25_': 'yscale'     , // value follows
  't'     : 'transp_to'   , // value follows

  '_x2B_' : 'handoff'      // value follows
}

const flag_length = { 

  // so we can get value from end of flag
  // # of characters, value follows

  'cursor'     : 0,
  'delay'      : 1,
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
  'transp_to'    : 1

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

const action_defaults = {
  'delay'   : 5.0, // only for timed anims
  'duration': 0.5
}

const trigger_defaults = {

  'func'       : false,
  'link'       : false,
  'blank'      : false

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

      // assign value to flag
      key = this.get_action_key(flag);

      if (typeof zoopy[key] != 'undefined') errlog('Action "'+this.name +'" ('+kind+') has duplicate "'+key+'" flags');

      zoopy[key] = this.get_val(key, flag);

      if (key == 'rotate') zoopy[key] = zoopy[key] * this.fix_rotation(flag);

    }

    // special cases (so absence of flags behaves as expected) ———————————————————————————————

    // set transparency 0 to 100
    if ( typeof zoopy.xmove    == 'undefined' &&
         typeof zoopy.ymove    == 'undefined' &&
         typeof zoopy.rotate   == 'undefined' &&
         typeof zoopy.scale    == 'undefined' &&
         typeof zoopy.xscale   == 'undefined' &&
         typeof zoopy.yscale   == 'undefined' &&
         typeof zoopy.transp_to  == 'undefined' ){
      zoopy.transp_from = 0;
      zoopy.transp_to   = 100;
    }

    // set default duration
    if (typeof zoopy.duration=='undefined')
      zoopy.duration= action_defaults.duration;

    // set default delay
    if (zoopy.kind=='timed' && typeof zoopy.delay=='undefined')
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
          if(key=='element')log('element (object) — '+this.trigger[t][key].id);
          else log(key+' ('+typeof(this.trigger[t][key])+') — '+this.trigger[t][key]);
      });
    }

    for (var x=0; x<this.action.length; x++){
      log('\nAction[' + x + ']');
      Object.keys(this.action[x]).forEach(key => {
        if (typeof this.action[x][key] != 'undefined')
          if(key=='element')log('element (object) — '+this.action[x][key].id);
          else log(key+' ('+typeof(this.action[x][key])+') — '+this.action[x][key]);
      });
    }
    
    log('^ end debug output —————————————————————————— ⚠️\n\n');
  }

  get_action_key(flag, is_duration){

  // is programmed specifically to optimize key finding
  // needs to be updated when flags are modified

    try {
      var first = flag.substr(0,1);

      // has to be rewritten when flags are modified
      // the point is to avoid a loop
      switch(first){
        case 'd':                              key = 'delay'   ; break;
        case 'n':                              key = 'blank'   ; break;
        case 's':                              key = 'ease'    ; break;
        case 't':                              key = 'transp_to' ; break;
        case 'f':                              key = 'fixed'   ; break;
        case 'h': if (flag=='hard'           ) key = 'ease'    ; else key = 'cursor'  ; break;
        case 'x': if (flag.substr(2,3)=='x25') key = 'xscale'  ; else key = 'xmove'   ; break; // +: _x2B_ · %: _x25_
        case 'y': if (flag.substr(2,3)=='x25') key = 'yscale'  ; else key = 'ymove'   ; break;
        case '_': key = action_flag_value_to_key[flag.slice(0,5)]     ; break;

      default:
        if (parseFloat(flag) != flag){
          if (flag == '') errlog('Action "'+this.name+'" has an extra slash.');
          else errlog('Action "'+this.name+'" has an unknown flag: "'+flag +'".');
          return null;
        }

        key = 'duration';

      }
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

  if (key == 'xmove'){ // correct for + being converted to _x2B_
    if (flag.slice(1,2) == '_')      var val = flag.slice(6, flag.length);  // +30
    else if (flag.slice(1,2) == '-') var val = flag.slice(1, flag.length);  // -60
    else {                                                                  // neither
      var val = 0;
      errlog('Action "'+this.name+'" requires a "+" for positive x move values');
    }
    if (not_number(val)) errlog('Action "'+this.name+'" requires a numerical value (was '+val+')');
    flag = 'x' + val;
  }

  if (key == 'ymove'){ // correct for + being converted to _x2B_
    if (flag.slice(1,2) == '_')      var val = flag.slice(6, flag.length);  // +30
    else if (flag.slice(1,2) == '-') var val = flag.slice(1, flag.length);  // -60
    else {                                                                  // neither
      var val = 0;
      errlog('Action "'+this.name+'" requires a "+" for positive y move values');
    }
    if (not_number(val)) errlog('Action "'+this.name+'" requires a numerical value (was '+val+')');
    flag = 'y' + val;
  }

  if (flag_len == 0) return flag;
  else return flag.substr(flag_len);
}

/*get_val(key, flag){

    var flag_len = flag_length[key];

    if (key == 'xmove'){ // correct for + being converted to _x2B_
      if (flag.slice(1,2) == '_') var val = flag.slice(6, flag.length);
      else if (flag.slice(1,2) != '-') {
        var val = 0;
        errlog('Action "'+this.name+'" requires a "+" for positive x move values');
      }
      if (is_number(val)) flag = 'x' + val;
      else {
        errlog('Action "'+this.name+'" requires a numerical value (value: "x'+val+'")');
        val = 0;
      }
    }

    if (key == 'ymove'){ // correct for + being converted to _x2B_
      if (flag.slice(1,2) == '_') var val = flag.slice(6, flag.length);
      else if (flag.slice(1,2) != '-') {
        var val = 0;
        errlog('Action "'+this.name+'" requires a "+" for positive y move values');
      }
      if (not_number(val)) errlog('Action "'+this.name+'" requires a numerical value (value: "y'+val+'")');
      flag = 'y' + val;
    }

    if (flag_len == 0) return flag;
    else return flag.substr(flag_len);
  } */

  fix_rotation(flag){
    if (flag.substr(0,5) == '_x3C_') return -1;
    else return 1;
  }


}

//———————————————————————————————————————— class Trigger

class Trigger{

  constructor( name, element, kind, cursor, func, args, link, blank ){

    this.name       = name;         // 20-character string
    this.element    = element;      // object reference
    this.kind       = kind;         // string · kind of trigger                  scroll, mouse, delay

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
               xmove, ymove, fixed, rotate, scale, xscale, yscale, transp_to, transp_from ){

    this.name       = name;         // 20-character string
    this.element    = element;      // object reference
    this.kind       = kind;       // string · kind of action                   click, over, down, away, ovaway, down, toggle, visible

    // flags
    this.delay      = delay;        // number · seconds before animation starts  33 (2nd number)
    this.handoff    = handoff;      // string · following animation
    this.handwait   = handwait;     // number · seconds before calling following animation

    // GSAP-related flags
    this.duration   = duration;     // number · duration in seconds              34.5 (1st number)
    this.ease       = ease;         // animation ease                            in, out, inout, noease
    this.xmove      = xmove;        // x movement                                x-30
    this.ymove      = ymove;        // y movement                                y+25
    this.fixed      = fixed;        // fixed point                               0f0 to 100f100
    this.rotate     = rotate;       // number · rotation                         >20 or <45.5
    this.scale      = scale;        // number · percentage to scale              %150
    this.xscale     = xscale;       // number · percentage to scale x            x%20
    this.yscale     = yscale;       // number · percentage to scale y            y%30
    this.transp_to   = transp_to;     // number · percentage transp_to              o30
    this.transp_from    = transp_from;      // number · transp_from/transp_to      programmatically
  }
}


//:::::::::::::::::::::::::::::::::::::::: PROGRAM

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
      errlog('Action "'+name+'" has no trigger and was not registered (id='+obj_array[x].id+')');

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

  if (animations[name].trigger[0].kind=='delay') // 2ms
    activate_delay(animations[name]);

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

//———————————————————————————————————————— activate_delay(animation)

function activate_delay(animation){

  for (var x=0; x<animation.action.length; x++){
    switch (animation.action[x].kind) {
    case 'timed':
      delay_timed(animation, x);
      break;

    default:
      if (typeof animation.action[x].kind != 'undefined') errlog('unknown delay kind: '+animation.action[x].kind);
      else errlog('missing delay action: '+animation.name);
    }
  }

  log('delay animations activated');
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

//———————————————————————————————————————— delay_timed(animation)

function delay_timed(animation, x){

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

//———————————————————————————————————————— convert_transform(fixed)

function convert_transform(fixed){
  if (typeof fixed == 'undefined') return "50% 50%";

  var parts = fixed.split('_x2C_');
  var result = parts.join('% ') + '%';
  return result;
}

//———————————————————————————————————————— gsap_params(action)

function gsap_params(action){

  var params = {};

  params['duration'       ] = action.duration==0 ? 0.001:action.duration
  params['transformOrigin'] = convert_transform(action.fixed);

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

//———————————————————————————————————————— debugging

// var a = 'name5'; try { animations[a].dump_flags(); } catch (error) { log('⚠️  "'+a+'" is not listed.'); }


//———————————————————————————————————————— fin


//———————————————————————————————————————— animations-1.0.1.js

/*———————————————————————————————————————— notes

for tying in to javascript, can I add something?

user|Submit
I need to add listener, AND CSS for cursor:pointer

for cursor: add a flag |v for visible hand cursor TO ACTION
for javascript: add flag |function TO ACTION

user|submit|v|func = ???

  triggers:
    scroll
    user
    delay

  actions:
    click
    msover
    msout
    msovout
    toggle
    visible

https://docs.google.com/spreadsheets/d/1_INTDgE9-XKC63PSlRClXJDoC7afz6V7FFB3hiN7bhE/edit#gid=1328156795
https://docs.google.com/document/d/1nImxZ6IgWFqDx6cOtrN-s9yZu564oMAxRxPwx_9lXSs/edit
https://www.freecodecamp.org/news/how-javascript-implements-oop/

// utf-8 entities
☀  9728  2600     BLACK SUN WITH RAYSTry it
☗  9751  2617     BLACK SHOGI PIECETry it
☤  9764  2624     CADUCEUSTry it
☻  9787  263B     BLACK SMILING FACETry it
♚  9818  265A     BLACK CHESS KINGTry it
♛  9819  265B     BLACK CHESS QUEENTry it
♜  9820  265C     BLACK CHESS ROOKTry it
♝  9821  265D     BLACK CHESS BISHOPTry it
♞  9822  265E     BLACK CHESS KNIGHTTry it
♟  9823  265F     BLACK CHESS PAWNTry it
♠  9824  2660  &spades;  BLACK SPADE SUITTry it
♣  9827  2663  &clubs;  BLACK CLUB SUITTry it
♥  9829  2665  &hearts;  BLACK HEART SUITTry it
♦  9830  2666  &diams;  BLACK DIAMOND SUITTry it
♻  9851  267B     BLACK UNIVERSAL RECYCLING SYMBOLTry it
♼  9852  267C     RECYCLED PAPER SYMBOLTry it
⚈  9864  2688     BLACK CIRCLE WITH WHITE DOT RIGHTTry it
⚉  9865  2689     BLACK CIRCLE WITH TWO WHITE DOTSTry it
⛋  9931  26CB     WHITE DIAMOND IN SQUARETry it
⛒  9938  26D2     CIRCLED CROSSING LANESTry it

————————————————————————————————————————*/
//———————————————————————————————————————— start timer

const d1 = new Date();
let start_time = d1.getTime();
console.log("animations-1.0.1.js");

//———————————————————————————————————————— separator, types of triggers and actions

const  separator = '_x2F_'; // regular slash
const   triggers = [ 'scroll', 'user',   'delay'                                 ];
const    actions = [ 'click',  'msover', 'msout', 'msovout', 'toggle', 'visible' ];


//———————————————————————————————————————— conversion dictionaries

const flag_value_to_name = {

  // name & kind are given

  // trigger flags
  'func'  : 'is_func'    , // hand off to JS
  'a'     : 'cursor'     , // arrow (for general emptiness)
  'h'     : 'cursor'     , // hand (for links)
  't'     : 'cursor'     , // I (text selection)
  'n'     : 'new_window' , // sets link targets to _blank

  // action flags
  'on'    : 'initial'    ,
  'off'   : 'initial'    ,
  'in'    : 'ease'       ,
  'out'   : 'ease'       ,
  'inout' : 'ease'       ,
  'noease': 'ease'       ,

  // xNUM, yNUM, >NUM, <NUM we'll check manually (movement & rotation)
  // number we'll check last with return parseFloat(x) == x

}

const ease_dict = {
  'in'    : Power1.easeIn,
  'out'   : Power1.easeOut,
  'inout' : Power1.easeInOut,
  'noease': "none" 
}

const cursor_dict = {
  'a'           : 'default',
  'h'           : 'pointer',
  't'           : 'text',
  'default_link': 'pointer'
}

const state_opacity_dict = {
  'on' : '1.0',
  'off': '0.0' 
}

const state_opposite_dict = {
  'on' : 'off',
  'off': 'on'
}

const action_dict = {
  'click'  : 'click',
  'msover' : 'mouseover', 
  'msout'  : 'mouseout', 
  'msovout': 'msovout', 
  'toggle' : 'toggle', 
  'visible': 'visible' 
}

const defaults_dict = {
  // triggers
  'cursor'     : '',                 // a, t, h
  'link_cursor': 'h',                // hand cursor (links)
  'new_window' : false,              // boolean
  'is_func'    : false,              // boolean
  'args'       : [],                 // function arguments

  // actions
  'delay'      : 0.0,                // number
  'duration'   : 0.5,                // number
  'ease'       : 'inout',            // [in, out, inout]
  'x'          : 0,                  // x movement
  'y'          : 0,                  // y movement
  'r'          : 0,                  // rotation
  'hand_off'   : '',                 // hand off to different animation

  // action kinds initial states
  'click'      : 'off',
  'msover'     : 'off',
  'msout'      : 'on',
  'msovout'    : 'off',
  'toggle'     : 'off',
  'visible'    : 'off'
}



//:::::::::::::::::::::::::::::::::::::::: DATA STRUCTURE

//———————————————————————————————————————— class Animation

// https://www.w3schools.com/js/js_classes.asp

var  animations = {} // list of Animation's

class Animation{

  constructor(name, trigger, t_kind, cursor,  is_func, args, is_link, new_window,
                     action, a_kind,  delay, duration, init,   state, ease, x, y, r, hand_off){

    this.name       = name;         // 20-character string

    // set when trigger added
    this.trigger    = trigger;      // object reference
    this.t_kind     = t_kind;       // [scroll, user, delay, series]
    this.cursor     = cursor;       // a h t = arrow hand text
    this.is_func    = is_func;      // true/false
    this.args       = args;         // array of func args
    this.is_link    = is_link;      // boolean
    this.new_window = new_window;   // boolean

    // set when action added
    this.action     = action;       // object reference
    this.a_kind     = a_kind;       // [click, msover, mosout, msovout, series, toggle, visible]
    this.delay      = delay;        // xx.xx floating point
    this.duration   = duration;     // xx.xx floating point
    this.init       = init;         // [on, off] initial state
    this.state      = state;        // [on, off] current state
    this.ease       = ease;         // [in, out, inout]
    this.x          = y;            // xNUM
    this.y          = y;            // yNUM
    this.r          = r;            // <NUM or >NUM
    this.handoff    = handoff;      // =ANIM NAME

  }

  add_trigger(obj, kind, flags){

    // set defaults

    this.trigger    = obj;
    this.t_kind     = kind;
    this.cursor     = defaults_dict['cursor'];
    this.is_func    = defaults_dict['is_func'];
    this.args       = []; // defaults_dict['args']; was sticky
    this.is_link    = defaults_dict['args'];
    this.new_window = defaults_dict['new_window'];

    // flags = kind|name|parameters...

    for(var x=2; x<flags.length; x++){

      // determine flag name from value

      var flag_value = flags[x];
      var flag_name  = flag_value_to_name[flag_value];

      // set flag and check if function

      if (flag_name != 'is_func')
        this[flag_name] = flag_value;

      else {
        for (var y=x+1; y<flags.length; y++)
          this.args.push(flags[y]);

        x = flags.length;
      }
      
    // set is_link & parent target

    this.is_link = obj.parentNode.hasAttribute('xlink:href'); // true false
    if (this.is_link && this.new_window)
      this.trigger.parentNode.setAttribute("target", "_blank");


    }

    // log trigger add results · deactivated

//  console.log('trigger '+this.name+' — '+
//    ' cursor: '+this.cursor+
//    ' is_func: '+this.is_func+
//    ' args: '+this.args.join('|')+
//    ' is_link: '+this.is_link+
//    ' new_window: '+this.new_window);


  }

  add_action(obj, kind, flags){

    // set defaults

    this.action   = obj;
    this.a_kind   = kind;
    this.delay    = defaults_dict['delay'];
    this.duration = defaults_dict['duration'];
    this.ease     = defaults_dict['ease'];
    this.x        = defaults_dict['x'];
    this.y        = defaults_dict['y'];
    this.r        = defaults_dict['r'];
    this.handoff  = defaults_dict['handoff'];

    this.init     = defaults_dict[kind];   // initial state
    this.state    = this.init;             // & current state

    // flags = kind|name|parameters...

    for(var x=2; x<flags.length; x++){

      // number: delay or duration

      if (parseFloat(flag_value)==flag_value){
        console.log('flag value '+flag_value+' indicates delay or duration');
      }

      // x y < > movement & rotation

      var first_char = flag_value.slice(0,0);
      var other_chars = flag_value.slice(1);
  
      if (parseFloat(other_chars)==other_chars){
        // check first_char against dictionary to get flag
        console.log('flag value '+other_chars+' indicates delay or duration, first_char='+first_char);
      }

      // = hand off to function

      if (first_char == '='){
        flag_name = 'is_func';
        console.log('flag value '+other_chars+' is action to be handed off to');
      }

      // exact text ease or init

      //try
      try {
        var flag_name = flag_value_to_name[flag_value];
        this[flag_name] = flag_value;
        console.log(this.name+'.'+flag_name+' set to '+flag_value);
      } catch (error) {
        console.error('⚠️  unknown flag: '+this.name+'.'+flag_value);
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
      }


    }

    // log action add results

    console.log('action'+this.name+' — '+
      ' cursor: '+this.cursor+
      ' is_func: '+this.is_func+
      ' args: '+this.args.join('|')+
      ' is_link: '+this.is_link+
      ' new_window: '+this.new_window);

//            // previous programming to clean up
//      
//            var flag1, flag2 = '';
//            if (flag_value.len > 1){
//              flag1 = flag_value.slice(0,0);
//              flag2 = flag_value.slice(1);
//            }
//      
//            var flag_is_num, flag2_is_num = false;
//            flag_is_num  = parseFloat(flag_value)==flag_value;
//            flag2_is_num = parseFloat(flag2)==flag2;
//      
//      
//            // number flag: 123
//            if (flag_is_num){
//              this['delay'] = flag_value;
//              has_number = true;
//              continue;
//            }
//      
//            // single letter followed by number: >123
//            if (parseFloat(flag_value)==flag_value){ // make sure it's at least two charactes
//              continue;
//            }
//      
//            // is duration (not a delay trigger, or first number flag)
//            else if (parseFloat(flag_value)==flag_value){
//              this['duration'] = flag_value;
//              has_number = true;
//      //      console.log (this.name+' second number flag '+flag_value);
//            }
//      
//            // is not a number
//            else {
//              var flag_name = flag_value_to_name[flag_value];
//      //      console.log(this.name+' has flag '+f['flag']+' with value '+f['init']);
//              this[f['flag']] = defaults_dict[f[flag]];
//            }
//      
//          }
//      
//          this.state    = this.init;                 // default on or off

  }

//delete_if_no_action(){

//  if (this.a_kind == undefined && !this.is_func && !this.is_link){
//    console.log('trigger '+this.name+' deleted (no action, link or function)');
//    delete animations[this.name];
//    return true;
//  }
//  return false;
//}

//turn_on_if_on(){
//  if (this.init == 'on'){
//    this.action.style.opacity = 1;
//    this.action.style.display = 'block';
//    set_clickable(this.action, true);
//  }
//}

//set_cursor(){
//  if (this.cursor != ''){
//    this.trigger.style.cursor = cursor_dict[this.cursor];
//  }
//  else{
//    var is_hand = false;

//    if (this.trigger.is_link   ) is_hand = true;
//    if (this.trigger.is_func   ) is_hand = true;

//    if (this.a_kind == 'click' ) is_hand = true;
//    if (this.a_kind == 'toggle') is_hand = true;

//    if (is_hand){
//      this.trigger.style.cursor = cursor_dict['default_link'];
//    }
//  }
//}


}


//:::::::::::::::::::::::::::::::::::::::: PROGRAM

//———————————————————————————————————————— register triggers

console.log('\n——— registering triggers ———');

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
  if (obj_array.length == 0)
    console.log('—› no '+kind+' triggers');
  else
    console.log(obj_array.length+' '+ kind+' triggers registered');


});

//———————————————————————————————————————— register actions

console.log('\n——— registering actions ———');

actions.forEach(kind => {
  var stem = "[id^='" + kind + separator + "']";
  var obj_array = Array.from(document.querySelectorAll(stem));

  // loop through adding actions
  for(var x=0; x<obj_array.length; x++){
    var obj = obj_array[x];
    var flags = obj.id.split(separator);

    // doesn't have at least trigger and name
    if (flags.length<2) continue;

    //  kind = flags[0];
    var name = flags[1];
    if (Object.keys(animations).includes(name))
      animations[name].add_action(obj, kind, flags)
    else
      console.log('—› '+kind+' action '+name+' was not registered (no trigger)');
  }

  // log results
  if (obj_array.length == 0)
    console.log('—› no '+kind+' actions');
  else
    console.log(obj_array.length+' '+ kind+' actions registered');


});

//———————————————————————————————————————— delete unused triggers

console.log('\n——— deleting actionless animations ———');

Object.keys(animations).forEach(name =>
  animations[name].delete_if_no_action()
)

//———————————————————————————————————————— turn on "default on" elements & set cursors 

console.log('\n——— turning on "default on" elements ———');

Object.keys(animations).forEach(name => {
  animations[name].turn_on_if_on();
  animations[name].set_cursor();
})

//———————————————————————————————————————— activate animations

console.log('\n——— activating animations ———');

Object.keys(animations).forEach(name => {

  if (animations[name].t_kind=='user')
    activate_user(animations[name]);  

  if (animations[name].t_kind=='delay')
    activate_delay(animations[name]);

  if (animations[name].t_kind=='scroll')
    activate_scroll(animations[name]);
})

//———————————————————————————————————————— end timer

const d2 = new Date();
let end_time = d2.getTime();

console.log('\n———————————————————— finished in '+(end_time-start_time)+'ms\n\n');


//:::::::::::::::::::::::::::::::::::::::: ACTION TYPES 

//———————————————————————————————————————— activate_user(animation)

function activate_user(animation){
  console.log('use animations activated');

  switch (animation.a_kind) {
  case undefined: break; // if it's just a link or func
  case 'click':
    user_click(animation);
    break;
  case 'msover':
    user_msover(animation);
    break;
  case 'msout':
    user_msout(animation);
    break;
  case 'msovout':
    user_msovout(animation);
    break;
  case 'toggle':
    user_toggle(animation);
    break;

  default:
    console.log('⚠️ unknown user a_kind:'+animation.a_kind+'in animation '+animation.name);
  }
}

//———————————————————————————————————————— activate_delay(animation)

function activate_delay(animation){
  console.log('delay animations activated');

  switch (animation.a_kind) {
  case 'visible':
    delay_visible(animation);
    break;

  default:
    console.log('⚠️ unknown delay a_kind:'+a_kind);
  }
}

//———————————————————————————————————————— activate_scroll(animation)

function activate_scroll(animation){
  console.log('scroll animations activated');

  switch (animation.a_kind) {
  case 'visible':
    scroll_visible(animation);
    break;

  default:
    console.log('⚠️ unknown scroll a_kind:'+a_kind);
  }
}


//:::::::::::::::::::::::::::::::::::::::: ACTIONS

//———————————————————————————————————————— scroll_visible(animation)

function scroll_visible(animation){

  var obj = animation.trigger;
  var box = obj.getBBox();
  var t = box['y'];             // top
  var b = t + box['height'];    // bottom

  window.addEventListener('scroll', check_scroll.bind(null, animation, t, b)); 
}

//———————————————————————————————————————— delay_visible(animation)

function delay_visible(animation){

  delay    = animation.delay * 1000;
  duration = animation.duration;
  state    = animation.init;
  ease     = animation.ease;

  setTimeout(change_visibility.bind(null, animation, duration, state, ease), delay);
//console.log(animation.name+' has timeout '+delay+', duration '+duration+', state '+state+', ease '+ease); 
}


//———————————————————————————————————————— user_click(animation)

function user_click(animation){

  duration = animation.duration;
  state    = animation.init;
  ease     = animation.ease;

  animation.trigger.addEventListener('click', change_visibility.bind(null, animation, duration, state, ease), false);
}

//———————————————————————————————————————— user_msover(animation)

function user_msover(animation){

  duration = animation.duration;
  state    = animation.init;
  ease     = animation.ease;

  animation.trigger.addEventListener('mouseover', change_visibility.bind(null, animation, duration, state, ease), false);
}

//———————————————————————————————————————— user_msout(animation)

function user_msout(animation){

  duration = animation.duration;
  state    = animation.init;
  ease     = animation.ease;

  animation.trigger.addEventListener('mouseout', change_visibility.bind(null, animation, duration, state, ease), false);
//console.log('user_msout'+animation.trigger.id);
}

//———————————————————————————————————————— user_msovout(animation)

function user_msovout(animation){

  duration  = animation.duration;
  state_ov  = animation.init;
  state_out = state_opposite_dict[animation.init];
  ease      = animation.ease;

  animation.trigger.addEventListener('mouseover', change_visibility.bind(null, animation, duration, state_ov,  ease), false);
  animation.trigger.addEventListener('mouseout',  change_visibility.bind(null, animation, duration, state_out, ease), false);
//console.log('user_msout'+animation.trigger.id);
}

//———————————————————————————————————————— user_toggle(animation)

function user_toggle(animation){

  duration = animation.duration;
  ease     = animation.ease;

  animation.trigger.addEventListener('click', opposite_visibility.bind(null, animation, duration, ease), false);
//console.log('user_toggle'+animation.trigger.id);
}


//:::::::::::::::::::::::::::::::::::::::: GENERIC FUNCTIONS

//———————————————————————————————————————— check_scroll(animation, trig_top, trig_bot)

// https://stackoverflow.com/questions/4096863/how-to-get-and-set-the-current-web-page-scroll-position

/*    special cases:
 
      • top is visible to start with
      • action state default is visible to start with */

function check_scroll(animation, trig_top, trig_bot){

  var page_top     = document.documentElement.scrollTop || document.body.scrollTop;
  var pixel_height = window.innerHeight;
  var page_bot     = page_top + pixel_height;

  var rem_top = page_top / illustrator_pixel;
  var rem_bot = page_bot / illustrator_pixel;

/* visible if top of trigger bar is not > bot of page
          and bot of trigger bar is not < top of page */

/*   all the checking of state is to make sure we don't add an animation when there's already one running */


// I should be able to do some sort of translation matrix: activate, deactivate, default, state
// I should just be able to call change_opacity, and THAT function should be able to tell by the state if it's not necessary to intervene

/*  activated = true/false
    default = off/on
    state = off/on */

  // trigger is activated
  if (trig_top < rem_bot && trig_bot > rem_top){ //——————————————————————————————

    if (animation.init == 'off' && animation.state == 'off'){
//    animation.action.style.opacity = 1;
      opposite_visibility(animation, animation.duration, animation.ease);
      animation.state = 'on';
      console.log('1 turned '+animation.state+' '+animation.name);
    }

    else if (animation.init == 'on' && animation.state == 'on') {
//    animation.action.style.opacity=0;
      opposite_visibility(animation, animation.duration, animation.ease);
      animation.state='off'
      console.log('2 turned '+animation.state+' '+animation.name);
    }
  }

  // trigger is deactivated
  else {//——————————————————————————————————————————————————————————————————————

    if (animation.init == 'off' && animation.state == 'on'){
//    animation.action.style.opacity=0;
      opposite_visibility(animation, animation.duration, animation.ease);
      animation.state='off'
      console.log('3 turned '+animation.state+' '+animation.name);
    }

    else if (animation.init == 'on' && animation.state == 'off') {
//    animation.action.style.opacity=1;
      opposite_visibility(animation, animation.duration, animation.ease);
      animation.state = 'on';
      console.log('4 turned '+animation.state+' '+animation.name);
    }
  }

}

//———————————————————————————————————————— opposite_visibility(animation, duration, ease)

function opposite_visibility(animation, duration, ease){
  change_visibility(animation, duration, animation.state, ease);
}

//———————————————————————————————————————— change_visibility(duration, state, ease)

// need to add display:none or set cursor painted to off

function change_visibility(animation, duration, state_prev, ease){

  name      = animation.name;
  action    = animation.action;
  state_new = state_opposite_dict[state_prev];
  opacity   = 1 * state_opacity_dict[state_new];
  ease      = ease_dict[ease];

  console.log(name+' running: duration='+duration+', opacity='+opacity+', ease '+animation.ease);
  gsap.to(action, { duration:duration, autoAlpha:opacity, ease });
  animation.state = state_new;
  if (opacity == 0) set_clickable(animation.action, true);
               else set_clickable(animation.action, false);
}

//———————————————————————————————————————— set_clickable(obj, clickable)

function set_clickable(obj, clickable){
  if (clickable)
    obj.style.pointerEvents = 'visiblePainted';
  else
    obj.style.pointerEvents = 'none';
}


//———————————————————————————————————————— fin

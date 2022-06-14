
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

//———————————————————————————————————————— constants

//nst  separator = '_x7C_'; // |
const  separator = '_x2F_'; // /
const        lng = separator.length;

// names & default values

const   triggers = [ 'scroll', 'user',   'delay'                                 ];
const    actions = [ 'click',  'msover', 'msout', 'msovout', 'toggle', 'visible' ];

//———————————————————————————————————————— conversion dictionaries

const flag_dict = {

  // name & kind are given

  // trigger flags
  ['func']  : {'flag':'is_function', 'val':true              },
  ['h']     : {'flag':'cursor'     , 'val':'h'               }, // hand (for links)
  ['a']     : {'flag':'cursor'     , 'val':'a'               }, // arrow (for general emptiness)
  ['t']     : {'flag':'cursor'     , 'val':'t'               }, // I (text selection)
  ['n']     : {'flag':'new_window' , 'val':true              }, // I (text selection)

  // action flags
  ['on']    : {'flag':'dfault'     , 'val':'on'              },
  ['off']   : {'flag':'dfault'     , 'val':'off'             },
  ['in']    : {'flag':'ease'       , 'val':'Power1.easeIn'   },
  ['out']   : {'flag':'ease'       , 'val':'Power1.easeOut'  },
  ['inout'] : {'flag':'ease'       , 'val':'Power1.easeInOut'},
  ['noease']: {'flag':'ease'       , 'val':'none'},
  ['num1']  : {'flag':'delay'      , 'val':'n/a'             },
  ['num2']  : {'flag':'duration'   , 'val':'n/a'             }

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


//———————————————————————————————————————— default values
// not applicable = commented out

const defaults_dict = {
  'cursor'     : '',                 // a, t, h
  'link_cursor': 'h',                // hand cursor (links)
  'new_window' : false,              // boolean
  'is_func'    : false,              // boolean
  'delay'      : 5.0,                // number
  'duration'   : 0.5,                // number
  'ease'       : 'inout',            // [in, out, inout]
  'click'      : 'off',
  'msover'     : 'off',
  'msout'      : 'on',
  'msovout'    : 'off',
  'toggle'     : 'off',
  'visible'    : 'off'
}

//———————————————————————————————————————— animations list

var  animations = {}


//:::::::::::::::::::::::::::::::::::::::: DATA STRUCTURE

//———————————————————————————————————————— class Animation

// https://www.w3schools.com/js/js_classes.asp

class Animation{

  constructor(name, trigger, t_kind, cursor, is_func, is_link, action, a_kind, duration, dfault, state, ease){

    this.name    = name;      // 20-character string

    // from trigger
    this.trigger = trigger;   // object reference
    this.t_kind  = t_kind;    // [scroll, user, delay, series]
    this.cursor  = cursor;    // 1-character string
    this.is_func = is_func;   // boolean
    this.is_link = is_link;   // boolean

    // from action
    this.action   = action;   // object reference
    this.a_kind   = a_kind;   // [click, msover, mosout, msovout, series, toggle, visible]
    this.duration = duration; // xx.xx floating point
    this.dfault   = dfault;   // [on, off] default state
    this.state    = state;    // [on, off] current state
    this.ease     = ease;     // [in, out, inout]

  }

  add_trigger(obj, kind, parts){

    // parts = user|name|parameters...
    this.trigger = obj;
    this.t_kind = kind;

    // flags (overridden just below)
    this.cursor     = defaults_dict['cursor'];                   // a h t = arrow hand text
    this.is_func    = defaults_dict['is_func'];                  // true false
    this.is_link    = obj.parentNode.hasAttribute('xlink:href'); // true false
    this.new_window = defaults_dict['new_window'];                  // true false

    console.log('trigger '+this.name+' has '+parts.length+'parts');
    for(var x=2; x<parts.length; x++){
      var z = parts[x];
      var f = flag_dict[z];
      console.log(this.name+' has flag '+f['flag']+' with value '+f['val']);
      this[f['flag']] = f['val'];
    }

    // set link target if specified
    if (this.is_link && this.new_window){
      this.trigger.parentNode.setAttribute("target", "_blank");
      console.log('link target '+this.name+' set to _blank');
    }

  }

  add_action(obj, kind, parts){

    // parts = user|name|parameters...
    this.action = obj;
    this.a_kind = kind;

    // flags
    this.delay    = defaults_dict['delay'];      // number
    this.duration = defaults_dict['duration'];   // number
    this.ease     = defaults_dict['ease'];       // in out inout
    this.dfault   = defaults_dict[kind];         // default on or off

    if (this.name == 'dc') console.log('———› here: '+parts.join(':'));

    var has_number = false;

    for(var x=2; x<parts.length; x++){
      var z = parts[x];

// I was wrong: first number is delay if t_kind = delay

      // is first number flag (duration unless changed below)
      if (parseFloat(z)==z && !has_number && this.t_kind=='delay'){
        this['delay'] = z;
        has_number = true;
        console.log (this.name+' has delay '+z);
      }

      // is duration (not a delay trigger, or first number flag)
      else if (parseFloat(z)==z){
        this['duration'] = z;
        has_number = true;
        console.log (this.name+' second number flag '+z);
      }

      // is not a number
      else {
        var f = flag_dict[z];
        console.log('z='+z);
        console.log(this.name+' has flag '+f['flag']+' with value '+f['val']);
        this[f['flag']] = f['val'];
      }

    }

    this.state    = this.dfault;                 // default on or off

//      possible flags:
//
//      cursor: boolean [flag a h t] # arrow/hand/bar cursor over trigger
//      isfunc: boolean [flag func] #hand off to JS

  }

  delete_if_no_action(){

    if (this.a_kind == undefined && !this.is_func && !this.is_link){
      delete animations[this.name];
      console.log(this.name+' deleted (no action)');
      return true;
    }
    return false;
  }

  turn_on_if_on(){
    if (this.dfault == 'on'){
      this.action.style.opacity = 1;
      this.action.style.display = 'block';
      set_clickable(this.action, true);
    }
  }

  set_cursor(){
    if (this.cursor != ''){
      this.trigger.style.cursor = cursor_dict[this.cursor];
      console.log(this.name+' had flag '+this.cursor+' so style was set to '+cursor_dict[this.cursor]);
    }
    else{
      var is_hand = false;

      if (this.trigger.is_link   ) is_hand = true;
      if (this.trigger.is_func   ) is_hand = true;

      if (this.a_kind == 'click' ) is_hand = true;
      if (this.a_kind == 'toggle') is_hand = true;

      if (is_hand){
        this.trigger.style.cursor = cursor_dict['default_link'];
			  console.log(':::::::::::::::::::::::::::::::: '+this.name+' SET TO POINTER');
      }
    }
  }


}


//:::::::::::::::::::::::::::::::::::::::: PROGRAM

//———————————————————————————————————————— get triggers

console.log('\n——— registering triggers ———');

triggers.forEach(kind => {
  var stem = "[id^='" + kind + separator + "']";
  var obj_array = Array.from(document.querySelectorAll(stem));

  for(var x=0; x<obj_array.length; x++){
    var obj = obj_array[x];
    var parts = obj.id.split(separator);
    if (parts.length<2) continue;

    var name = parts[1];
    animations[name] = new Animation(name);
    animations[name].add_trigger(obj, kind, parts);
  }

  if (obj_array.length == 0)
    console.log('—› no '+kind+' triggers');
  else
    console.log(kind+' triggers registered');

});

//———————————————————————————————————————— get actions

console.log('\n——— registering actions ———');

actions.forEach(kind => {
  var stem = "[id^='" + kind + separator + "']";
  var obj_array = Array.from(document.querySelectorAll(stem));

  if (obj_array.length == 0)
    console.log('—› no '+kind+' actions');

  for(var x=0; x<obj_array.length; x++){
    var obj = obj_array[x];
    var parts = obj.id.split(separator);
    if (parts.length<2) continue;

    var kind = kind;
    var name = parts[1];

    if (Object.keys(animations).includes(name)){
      animations[name].add_action(obj, kind, parts)
    }
    else console.log('—› action not found: '+name);
  }
});

//———————————————————————————————————————— delete unused animations (trigger only)

console.log('\n——— deleting actionless animations ———');

Object.keys(animations).forEach(name =>
  animations[name].delete_if_no_action()
)

//———————————————————————————————————————— turn on "default on" elements & set cursors 

Object.keys(animations).forEach(name => {
  animations[name].turn_on_if_on();
  animations[name].set_cursor();
})

console.log('\n——— "default on" elements turned on  ———');

//———————————————————————————————————————— activate animations

console.log('\n——— activating animations ———');

Object.keys(animations).forEach(name => {

  if (animations[name].t_kind=='user')
    activate_user(animations[name]);  

  if (animations[name].t_kind=='delay')
    activate_delay(animations[name]);
})

//———————————————————————————————————————— end timer

const d2 = new Date();
let end_time = d2.getTime();

console.log('\n———————————————————— finished in '+(end_time-start_time)+'ms\n\n');


//:::::::::::::::::::::::::::::::::::::::: ACTION TYPES 

//———————————————————————————————————————— activate_user(animation)

function activate_user(animation){
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
  switch (animation.a_kind) {
  case 'visible':
    delay_visible(animation);
    break;

  default:
    console.log('⚠️ unknown delay a_kind:'+a_kind);
  }
}


//:::::::::::::::::::::::::::::::::::::::: ACTIONS

//———————————————————————————————————————— delay_visible(animation)

function delay_visible(animation){

  delay    = animation.delay * 1000;
  duration = animation.duration;
  state    = animation.dfault;
  ease     = animation.ease;

  setTimeout(change_visibility.bind(null, animation, duration, state, ease), delay);
  console.log(animation.name+' has timeout '+delay+', duration '+duration+', state '+state+', ease '+ease); 
}


//———————————————————————————————————————— user_click(animation)

function user_click(animation){

  duration = animation.duration;
  state    = animation.dfault;
  ease     = animation.ease;

  animation.trigger.addEventListener('click', change_visibility.bind(null, animation, duration, state, ease), false);
}

//———————————————————————————————————————— user_msover(animation)

function user_msover(animation){

  duration = animation.duration;
  state    = animation.dfault;
  ease     = animation.ease;

  animation.trigger.addEventListener('mouseover', change_visibility.bind(null, animation, duration, state, ease), false);
}

//———————————————————————————————————————— user_msout(animation)

function user_msout(animation){

  duration = animation.duration;
  state    = animation.dfault;
  ease     = animation.ease;

  animation.trigger.addEventListener('mouseout', change_visibility.bind(null, animation, duration, state, ease), false);
  console.log('user_msout'+animation.trigger.id);
}

//———————————————————————————————————————— user_msovout(animation)

function user_msovout(animation){

  duration  = animation.duration;
  state_ov  = animation.dfault;
  state_out = state_opposite_dict[animation.dfault];
  ease      = animation.ease;

  animation.trigger.addEventListener('mouseover', change_visibility.bind(null, animation, duration, state_ov,  ease), false);
  animation.trigger.addEventListener('mouseout',  change_visibility.bind(null, animation, duration, state_out, ease), false);
  console.log('user_msout'+animation.trigger.id);
}

//———————————————————————————————————————— user_toggle(animation)

function user_toggle(animation){

  duration = animation.duration;
  ease     = animation.ease;

  animation.trigger.addEventListener('click', opposite_visibility.bind(null, animation, duration, ease), false);
  console.log('user_toggle'+animation.trigger.id);
}


//:::::::::::::::::::::::::::::::::::::::: GENERIC FUNCTIONS

//———————————————————————————————————————— opposite_visibility(duration, ease)

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

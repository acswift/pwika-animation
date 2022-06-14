/*————————————————————————————————————————

for tying in to javascript, can I add something?

user|Submit
I need to add listener, AND CSS for cursor:pointer

for cursor: add a flag |v for visible hand cursor TO ACTION
for javascript: add flag |function TO ACTION

user|submit|v|func

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

————————————————————————————————————————*/

//———————————————————————————————————————— types

const  triggers = ['scroll', 'user', 'delay'];
const   actions = ['click', 'msover', 'msout', 'msovout', 'toggle', 'visible']
const separator = '_x7C_';
const       lng = separator.length;

//———————————————————————————————————————— setup

const users = Array.from(document.querySelectorAll('[id^=\'user'    + separator + '\']'));
const  mice = Array.from(document.querySelectorAll('[id^=\'msovout' + separator + '\']'));

for (var x=0; x<triggers.length; x++){
  var z = 0;
//var triggers[x] + 'list' = Array.from(document.querySelectorAll("[id^='" + triggers[x] + separator + "']"));
}

//———————————————————————————————————————— make array of users


var userList = [];
for(var x=0; x<users.length; x++){
  var id = users[x].id.slice(4 + lng);
  userList.push(id);
}

//———————————————————————————————————————— make dictionary of mouseovers


var mousList = {};
for(var x=0; x<mice.length; x++){
  var id = mice[x].id.slice(7 + lng);
  mousList[id] = true;
}

//———————————————————————————————————————— make matched list where both links & MO's exist

var finalList = [];
for(var x=0; x<userList.length; x++){
  if (mousList[userList[x]])
    finalList.push(userList[x]);
}

//———————————————————————————————————————— add listeners


for (var x=0; x<finalList.length; x++){

  var id = finalList[x];
  var trigger = getId('user' + separator + id);

  document.getElementById(trigger).addEventListener('mouseover', movrFunction.bind(null, id), false);
  document.getElementById(trigger).addEventListener('mouseout' , moutFunction.bind(null, id), false);
}

//———————————————————————————————————————— mouseover/out functions

function movrFunction(id){
  id = 'msovout' + separator + id
  gsap.to('#'+id, {duration:0.5, ease:Power1.easeInOut, autoAlpha:1});
}

function moutFunction(id){
  id = 'msovout' + separator + id
  gsap.to('#'+id, {duration:0.5, autoAlpha:0});
}

function gsapKill(){
  gsap.kill();
}

function getId(stem){
  var searchTerm = "[id^='" + stem + "']";

  allIds = document.querySelectorAll(searchTerm);
  if (allIds.length == 0) return null;

  return allIds[0].id;
}

//———————————————————————————————————————— fin

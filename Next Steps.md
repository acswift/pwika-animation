
So I have problem where everyting is 1-to-1

Meaning that if you "over" something to open a menu, you can't close that same menu with a different animation — it's uniquely tied to the first trigger

You can have a second trigger with the same name, but if I do "ovaway", the "away" will be triggered immediately.

What I want is "over" to open the menu, then "over" a ring around the menu to close it.

————————————————————————————————————————

Secondly, I can't steer a spaceship.

I can turn on the left thruster, but then I have to turn it off before turning right.

There's no way to "click here to turn left 20°" over and over or "click here to turn right 20°" over and over.

So this makes me think that I should retreat into a more classic programming state of mind.

————————————————————————————————————————

In javascript, you have:

1. a timeline that can control any object on the page
2. it can be controlled by any object on the page

So let us say that we have:

• triggers — listen for events
• events   — control timelines

To keep it simple, you CAN continue to declare a single event timeline by combining: click/name/90>

But now you will be able to create more complex timelines:

menuLogoAnim.to('#menuLogoCancel',    0.5, {x:"-=34.2", y:"-=9.5"}, "-=0.5");
sbonanim.from('#panon'    , 0.5, { scaleX:0, transformOrigin:'right', }, 0);

So there will be objects in a group:

> tline/name
  - obj1/90>/5        with all the same parameters that exist in GSAP including oncomplete, ease, etc.
  - obj2/%200/-x100


could have an artifical box (symbol) with groups, like a grid
https://helpx.adobe.com/illustrator/using/symbols.html


what I don't like is the idea of typing code into Illustrator, or having rectangles etc. that aren't used graphically
the layers panel is relatively easy to use, because you can just tab between elements
but it is cool that I can use folding in the groups

I could pick one color for timelines...



event "name" will affect a timeline
  - mouse/click/name/> (plays it)     don't need a special character if I can check for name or control character
  - mouse/click/name/< (rewinds it)
  - mouse/click/name/ll (pauses it)

<l skip to start
l> skip to end

a single trigger should be able to listen for multiple events
and do multiple actions based on the type of event

like a mouseover that you can also click on

So we KEEP the trigger simple — this trigger listens for mouse events
the events, now called controllers or listeners, control the timeline

———————————————————————————————————————— thought experiment

Right now I have

listeners     rectangles                   mouse/name1       
controllers   attached to listeners        click/name1 (right now objects are attached here)
timelines     GSAP timeline                look like abbreviated javascript
objects       things to animate            would be nice if this was just a name "vibe/myName"

it would be nice to combine the listeners and controllers

so I have a pink rectangle
  click:tl1#>/over:tl2#<12

this way the timeline can be composed of actual objects — it avoids having abstract programming

object:
  v/tlname/%150/4/d20

>> this means that an object can't belong to different timelines or have different transformations
not a good idea

I need to be able to expand an object with one timeline, and collapse it with another

so I still need an abstract timeline ON TOP of this solution

tl/objname... all the javascript stuff

a special layer called "timelines"

———————————————————————————————————————— action items

make a list of GSAP params to integrate
thought experiment for ps.svija.love menu
thought experiment for flying spaceship



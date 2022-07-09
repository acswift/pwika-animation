# Scroll Animations

Scroll trigger: **scroll**.

There are no scroll trigger flags.

### scroll triggers

 action | description
--------|---------------
 zone   | on when trigger is entirely visible, off when partly hidden
 point  | on when point becomes visible
 scrub  | % of bar above top of window = % of timeline
 \*dscrub | scrub to do, second to undo (they can't overlap!)

---
# Mouse Animations

Mouse trigger: **mouse**.

### Trigger Flags

flag            | action | default | description
----------------|--------|---------|----------------------------
/n              | timed  | 0.5     | open link in new tab/window
/func/arg1/arg2 | timed  | 0.5     | call function "func_name()"
/a /h /i        | timed  | 0.5     | set cursor to **A**rrow, **H**and or **I**-beam

---
### mouse trigger actions

action | default | description
-------|---------|---------------------------------------------
over   | x       |passes over trigger
away   | x       |moves away from trigger
press  | x       |presses down on trigger (before release)
click  | x       |clicks on trigger (at release)
down   | x       |double: press & release
ovaway | x       |double: pass over & moves away
toggle | x       |double: click & click

---
# delay triggers

Delay trigger: **delay**.

trigger | action | default | description
-------:|--------|------------------------------|---------------
delay   | timed | 0.5 | after given number of seconds | 0.5

---
### mouse action flags

d23 delay 23 seconds

number is duration, d24 is delay

d23-45 is double delay
```
238     // set default duration                                                      
239     if (zoopy.kind=='timed' && typeof zoopy.delay=='undefined'){                 
240       zoopy.delay    = zoopy.duration;                                           
241       zoopy.duration = action_defaults.duration;                                 
242     }
```

default delay for timed is 5 seconds

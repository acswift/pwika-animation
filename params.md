# Action Flags

flag            | meaning | default | description
----------------|--------|---------|----------------------------
number          | duration | 0.5     | open link in new tab/window
d[number]       | delay | 0 | delay at beginning of timeline
x[sign][number] | move | 0 | move along x-axis
y[sign][number] | move | 0 | move along y-axis
%[number] | scale | 100 | scale to given percent
x%[number] | scale | 100 | scale horizontally to given percent
y%[number] | scale | 100 | scale vertically to given percent
\<[number] | rotate | 0 | rotate counter-clockwise
\>[number] | rotate | 0 | rotate clockwise

/func/arg1/arg2 | function|—     | call function **func_name(arg1, arg2)**

# Scroll Animations

Scroll trigger: **scroll**.

There are no scroll trigger flags.

### Actions

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
### Actions

action | default | description
-------|---------|---------------------------------------------
over   | x       |passes over trigger
away   | x       |moves away from trigger
press  | x       |presses down on trigger (before release)
click  | x       |clicks on trigger (at release)
down   | x       |double: press & release
ovaway | x       |double: pass over & moves away
toggle | x       |double: click & click

### Action Flags

flag            | meaning | default | description
----------------|--------|---------|----------------------------
/d              | delay | 0.5     | delay added at beginning of timeline
/func/arg1/arg2 | function | —     | call function "func_name()"
/a /h /i        | timed  | 0.5     | set cursor to **A**rrow, **H**and or **I**-beam

---
# Time Triggers

Time trigger: **delay**.

action | default | description
-------|------------------------------|---------------
timed | 0.5 | after given number of seconds | 0.5

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

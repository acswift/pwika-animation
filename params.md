---
### scroll triggers

trigger  | action | description
--------:|--------|---------------
scroll   | zone   | on when trigger is entirely visible, off when partly hidden
scroll   | point  | on when point becomes visible
scroll   | scrub  | % of bar above top of window = % of timeline
scroll\* | dscrub | scrub to do, second to undo (they can't overlap!)

---
### mouse trigger flags

trigger | flag            | action | default | description
-------:|-----------------|--------|---------|----------------------------
mouse   | /n              | timed  | 0.5     | open link in new tab/window
mouse   | /func/arg1/arg2 | timed  | 0.5     | call function "func_name()"
mouse   | /a /h /t        | timed  | 0.5     | set cursor to **A**rrow, **H**and or **T**ext

---
### mouse trigger actions

trigger | action | default | description
-------:|--------|---------|---------------------------------------------
mouse   | over   | x       |passes over trigger
mouse   | away   | x       |moves away from trigger
mouse   | press  | x       |presses down on trigger (before release)
mouse   | click  | x       |clicks on trigger (at release)
mouse   | down   | x       |double: press & release
mouse   | ovaway | x       |double: pass over & moves away
mouse   | toggle | x       |double: click & click

---
### delay triggers

trigger | action | default | description
-------:|--------|------------------------------|---------------
delay   | timed | 0.5 | after given number of seconds | 0.5



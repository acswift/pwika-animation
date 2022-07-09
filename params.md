<details><summary>Vim Folds</summary>

---
To restore Vim folds when starting work:
```
cp ~=*params.md* ~/.vim/view/
```
To add folds to repo at commit:
```
cp ~/.vim/view/*params.md* ./
```
---
</details>

# Action Flags

\### = number

flag            | meaning  | default | description                         | example
---------------:|----------|---------|-------------------------------------|-----------
number          | duration | 0.5     | duration of animation               | over/name/4
d###            | delay    | 0       | delay at beginning of timeline      | over/name/d4
x[sign]###      | move     | 0       | move along x-axis                   | over/name/x+20
y[sign]###      | move     | 0       | move along y-axis                   | over/name/y-20
%###            | scale    | 100     | scale to given percent              | over/name/%150
x%###           | scale    | 100     | scale horizontally to given percent | over/name/y%150
y%###           | scale    | 100     | scale vertically to given percent   | over/name/x%150
\<###           | rotate   | 0       | rotate counter-clockwise            | over/name/\<30
\>###           | rotate   | 0       | rotate clockwise                    | over/name/\>30
f###,###        | fixed    | 50,50   | point of rotation that doesn't move | over/name/<90/f0,100
hard            | ease     | soft    | abrupt start & stop                 | over/name/x+20/hard
soft            | ease     | soft    | soft start & stop                   | over/name/x+20/soft
softin          | ease     | soft    | soft start & hard stop              | over/name/x+20/softin
softout         | ease     | soft    | hard start & soft stop              | over/name/x+20/softout

---
# Scroll Animations

Scroll trigger: **scroll**.

There are no scroll trigger flags.

---
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

---

---
# Time-based Animations

Time trigger: **delay**.

---
### Trigger Flags

*None.*

---
### Actions

flag            | meaning  | default | description                         | example
-------|------------------------------|---------------
timed | 5 | after given number of seconds | 0.5

---
### Action Flags

flag            | meaning  | default | description                         | example
-------|------------------------------|---------------
d### | delay | 5 | after given number of seconds | timed/name/d10


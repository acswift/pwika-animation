<details><summary>Vim Folds</summary>

---
To restore Vim folds when starting work:
```
cp folds/* ~/.vim/view/
```
To add folds to repo at commit:
```
cp ~/.vim/view/*svija.dev=+sync=+Svija=+Scripts* ./folds/
```
---
</details>

[logo]: http://files.svija.love/github/readme-logo.png "Svija: SVG-based websites built in Adobe Illustrator"

*Updated 14 June, 2022*

![Svija: SVG-based websites built in Adobe Illustrator][logo]

### Svija Life 1.0.6.2 Parameters

All current triggers, actions and flags are listed below.

---
# Action Flags

Action flags can be used with any kind of trigger.

It is possible to use multiple different triggers with multiple different actions.

\### = number

flag            | meaning  | default | description                         | example
---------------:|--------------|---------|-------------------------------------|-----------
\###            | duration     | 0.5     | duration of animation               | over/name/4
d###            | delay        | 0       | delay at beginning of timeline      | over/name/d4
[sign]x###      | move         | 0       | move along x-axis                   | over/name/+x20
[sign]y###      | move         | 0       | move along y-axis                   | over/name/-y20
t###            | transparency | —       | % transparent                       | over/name/t50
%###            | scale        | 100     | scale to given percent              | over/name/%150
x%###           | scale        | 100     | scale horizontally to given percent | over/name/y%150
y%###           | scale        | 100     | scale vertically to given percent   | over/name/x%150
\<###           | rotate       | 0       | rotate counter-clockwise            | over/name/\<30
###\>           | rotate       | 0       | rotate clockwise                    | over/name/30\>
o###,###        | origin       | 50,50   | center of rotation                  | over/name/<90/o0,100
hard            | ease         | soft    | abrupt start & stop                 | over/name/+x20/hard
soft            | ease         | soft    | soft start & stop                   | over/name/+x20/soft
softin          | ease         | soft    | soft start & hard stop              | over/name/+x20/softin
softout         | ease         | soft    | hard start & soft stop              | over/name/+x20/softout

---
# Mouse Animations

Trigger: **mouse**.

### Trigger Flags

flag            | meaning  | default | description                       | example
----------------|----------|---------|-----------------------------------|---------------------------
/n              | target   | same    | open link in new tab/window       | over/name/n
/func/arg1/arg2 | function | —       | call function "func_name()"       | over/name/func/arg1/arg2
/a /h /i        | cursor   | a       | **A**rrow, **H**and or **I**-beam | over/name/h

---
### Actions

action | example          | description
-------|------------------|---------------------------------------------
over   | over/name/%150   | passes over trigger
away   | away/name/%150   | moves away from trigger
press  | press/name/%150  | presses down on trigger (before release)
click  | click/name/%150  | clicks on trigger (at release)
down   | down/name/%150   | **double**: press & release
ovaway | ovaway/name/%150 | **double**: pass over & moves away
toggle | toggle/name/%150 | **double**: click & click


---
# Scroll Animations

Trigger: **scroll**. There are no scroll trigger flags.

---
### Actions

action | example         | description
-------|-----------------|---------------------------------------------
 zone  | zone/name/%150  | **double**: on when trigger is unhidden, off when partly hidden
 point | point/name/%150 | on when point becomes visible
 scrub | scrub/name/%150 | % of bar above top of window = % of timeline

*Planned addition:*
**dscrub**: one scrub to do, a second scrub to undo (they can't overlap).


---
# Time-based Animations

Trigger: **time**. There are no time trigger flags.

### Actions

action | example       | description
-------|---------------|------------------------------------------
delay  | delay/name/d3 | delay after page load (default 5 seconds)

---


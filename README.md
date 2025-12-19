
[logo]: http://files.pwika.com/github/github_banner.png "Pwika: SVG-based websites built in Adobe Illustrator"

*Updated 18 December, 2025*

![Pwika: SVG-based websites built in Adobe Illustrator][logo]

<details><summary>Illustrator Version 28</summary>

---
I should just use the current Pwika Tools with the next version of AI

I should have two version of Vibe
- check for AI version
- alert if wrong version, give address to download ZIP

How can I identify if new-style SVG? If there's:
- a style named "cls-1"
- a data-name="page color"

1. get first SVG element
2. get first <g> element (or cycle through)
3. see if dataset is defined



when I get to css:
https://stackoverflow.com/questions/5324415/select-elements-by-attribute-in-css

---
</details>


### Pwika Vibe 1.0.27

#### AI 28.6+

[GSAP Forum link](https://greensock.com/forums/topic/36423-how-can-i-get-a-breakdown-of-a-timeline-once-its-been-created/)

This repository contains the development files for Pwika Animation, which is included with each new Pwika website.

The files are developed at `pwika.dev/sync/Pwika/Scripts` (which also contains other files that are *not* part of this repository).

---
### Releasing a New Version

Update the version numbers:
```
vi -O pwika-vibe.css pwika-vibe.js
```

---
### 1. Commit the Beta Branch

In Pwika Admin, check for unsaved changes and commit:
```
cd ~/Desktop/pwika.dev/sync/Pwika/Scripts
git status
```
---
### 2. Merge to Master

Check out the **destination branch** and merge ([list of commits](https://github.com/pwikapanel/vibe/commits/beta)):
```
git checkout master
git merge beta --no-ff
```
Push the new version:
```
git push origin master
```
---
### 3. Update the Documentation

Copy info from/to:

- [github.com/pwikapanel/admin/commits/master](https://github.com/pwikapanel/vibe/commits/master)
- [tech.pwika.com/manual/changelog-vibe](https://tech.pwika.com/programs/vibe/changelog)

---
### 4. Create Fixtures

Need to learn how to do this!

---
### 5. Create A New Github Release

On Github, create a [new release](https://github.com/pwikapanel/admin/releases) from the **master branch**.

- use the current version number for the tag (1.0.10)
- choose target **Master**
- use the month & year for the title (October 2021)
- if there is more than one release in a month, append -1, -2 etc. to all releases for the month
- use the [commit list](https://github.com/pwikapanel/admin/commits/master) for the description

---
### 6. Update Existing Sites

Open the two login spreadsheets to get a list of pwika sites ([pwika][ss1], [clients][ss2])

[ss1]: https://docs.google.com/spreadsheets/d/1kZYUpenHkvHLGCyQgu5RaOrrRiOUIHVx4bQcugrhJQI/edit#gid=213266802
[ss2]: https://docs.google.com/spreadsheets/d/1yz3OETWWM-lpTyubIba8ptQf7MJV6ft38_yTNd0MGcg/edit#gid=1287837631

1. open all the admin sites and navigate to **Script Sets**
2. replace the various script parts with the contents of the **master** branch

---
### 7. Check Out the Beta Branch

Commit any changes, then check out the beta branch:
```
git status
git commit -m "last commit before going back to beta" -a
```
Commit any changes, then check out the beta branch:
```
git checkout beta 
git merge master --no-ff -m "starting new version"
git push -u
```
---
### 8. Increment the Version Number

**NOTE:** copy to websites *before* incrementing to new version.
Places to update the version number:
```
cd ~/Desktop/pwika.dev/sync/Pwika/Scripts
vi -O README.md params.md pwika-vibe.js pwika-vibe.css
# :windo %s/1.0.10/1.0.11/g
```
Then commit the version number change:
```
git commit -m "updated version number" -a && git push -u  
```
---
### Diverse Notes

function minusPeriod(clip_path){
  // fix illustrator bug
  // reported at: https://illustrator.uservoice.com/forums/601447-illustrator-desktop-bugs/suggestions/45420952-clipping-mask-broken-in-svg-export-if-name-contain

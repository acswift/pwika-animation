[logo]: http://files.svija.love/github/readme-logo.png "Svija: SVG-based websites built in Adobe Illustrator"

*Updated 23 September, 2022 · maintained at svija.love*

![Svija: SVG-based websites built in Adobe Illustrator][logo]

### Svija Vibe 1.0.8

Added beta branch.

This repository contains the development files for Svija Animation, which is included with each new Svija website.

The files are developed at `svija.dev/sync/Svija/Scripts` (which also contains other files that are *not* part of this repository).

---
### Releasing a New Version

Update the version numbers:
```
vi -O svija-vibe.css svija-vibe.js
```

---
### 1. Commit the Beta Branch

In Svija Admin, check for unsaved changes and commit:
```
cd ~/Desktop/svija.dev/sync/Svija/Scripts
git status
```
---
### 2. Merge to Master

Check out the **destination branch** and merge ([list of commits](https://github.com/svijalove/animation/commits/beta)):
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

- [github.com/svijalove/admin/commits/master](https://github.com/svijalove/animation/commits/master)    
- [tech.svija.love/manual/changelog-vibe](https://tech.svija.love/manual/changelog-vibe)   

---
### 4. Create Fixtures

Need to learn how to do this!

---
### 5. Create A New Github Release

On Github, create a [new release](https://github.com/svijalove/admin/releases) from the **master branch**.

- use the current version number for the tag (1.0.6.3)
- choose target **Master**
- use the month & year for the title (October 2021)
- if there is more than one release in a month, append -1, -2 etc. to all releases for the month
- use the [commit list](https://github.com/svijalove/admin/commits/master) for the description

---
### 6. Update Existing Sites

Open the two login spreadsheets to get a list of svija sites ([svija][ss1], [clients][ss2])

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
cd ~/Desktop/svija.dev/sync/Svija/Scripts
vi -O README.md params.md svija-vibe.js svija-vibe.css
# :windo %s/1.0.5/1.0.6.3/g
```
Then commit the version number change:
```
git commit -m "updated version number" -a && git push -u  
```
---

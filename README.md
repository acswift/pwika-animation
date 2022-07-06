[logo]: http://files.svija.love/github/readme-logo.png "Svija: SVG-based websites built in Adobe Illustrator"

*Updated 14 June, 2022*

![Svija: SVG-based websites built in Adobe Illustrator][logo]

### Svija FVX 1.0.5

Added beta branch.

This repository contains the development files for Svija Animation, which is included with each new Svija website.

The files are developed at `svija.dev/sync/Svija/Scripts` (which also contains other files that are *not* part of this repository).

---

### Saving/Restoring Vim Folds

To restore Vim folds when starting work:
```
cp ~=* ~/.vim/view/
```
To save folds when stopping work:
```
cp ~/.vim/view/*animation-1.0.4* ./
git commit -m "updated folding info" -a
```
---
### Releasing a New Version

Update the version numbers:
```
vi -O svija-fvx.css svija-fvx.js
```

<details><summary>completely unrelated</summary>


Once development is finished, code is moved to the [tools][l1] repository.

[l1]: https://github.com/svijalove/tools

---
### Releasing a New Version

---
### Commit & Merge

Check for any unsaved changes:
```
cd ~/Documents/scripts-presets
git status
```
If there *are* unsaved changes, commit:
```
git commit -m "last commit before merge to master" -a && git push -u
```
Check out the destination branch and merge ([list of commits][l2]):

[l2]: https://github.com/svijalove/scripts-presets/commits/beta
```
git checkout master
git merge beta --no-ff
```
Push the new version:
```
git push origin master
```
---
### Update the Documentation

Copy info from this repo to a new issue in the **tools repository**:

- [commits to master branch][l3]
- [new issue in tools repo][l4]

[l3]: https://github.com/svijalove/scripts-presets/commits/master
[l4]: https://github.com/svijalove/tools/issues/new/choose

---
### Create A New Github Release

On Github, create a [new release][l5] from the master branch.

[l5]: https://github.com/svijalove/scripts-presets/releases/new

- use the current version number for the tag (1.0.3)
- choose target **Master**
- use the month & year for the title (october 2022 v1)
- use the [commit list][l3] for the description

---
### Check Out the Beta Branch

Commit any changes, then check out the beta branch:
```
git status
```
If there are changes:
```
git commit -m "last commit before going back to beta" -a
```
Commit any changes, then check out the beta branch:
```
git checkout beta 
git merge master --no-ff -m "starting new version"
git push -u
```
---
### Increment the Version Number

Places to update the version number:

```
cd /Documents/scripts-presets
vi README.md
```
Then the individual scripts:
```
vi -O *.jsx
# :windo %s/1.0.3/1.0.4/g
```
Then commit the version number change:
```
git commit -m "updated version number" -a && git push -u  
```
</details>

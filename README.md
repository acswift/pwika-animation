<details><summary>Vim Folds</summary>

---
To restore Vim folds when starting work:
```
cp folds/*svija.dev=+sync=+Svija=+Scripts* ~/.vim/view/
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

### Svija Life 1.0.5

Added beta branch.

This repository contains the development files for Svija Animation, which is included with each new Svija website.

The files are developed at `svija.dev/sync/Svija/Scripts` (which also contains other files that are *not* part of this repository).

---
### Releasing a New Version

Update the version numbers:
```
vi -O svija-life.css svija-life.js
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
- [tech.svija.love/manual/changelog-life](https://tech.svija.love/manual/changelog-life)   

---
### 4. Create an Installable Version

Create an **installable version** so that will be available in case of future compatibility problems:

Run the tarball creation script:
```
cd /opt/Svija-Admin
./save_tar.sh
```
---
### 8. Update the Svija Servers

First, update the **server software**
```
apt-get update
```
```
apt-get dist-upgrade
```

Run the Svija Admin **update script:**
```
admin-update/update.sh
```
---
### 9. Create A New Github Release

On Github, create a [new release](https://github.com/svijalove/admin/releases) from the **master branch**.

- use the current version number for the tag (2.2.7)
- choose target **Master**
- use the month & year for the title (October 2021)
- if there is more than one release in a month, append -1, -2 etc. to all releases for the month
- use the [commit list](https://github.com/svijalove/admin/commits/master) for the description

---
### 10. Check Out the Beta Branch

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
### 11. Increment the Version Number

Places to update the version number:
```
cd /opt/Svija-Admin
vi -O README.md setup.py save_tar.sh svija/views/__init__.py svija/templates/admin/base_site.html
# :windo %s/2.2.6/2.2.7/g
```
Then commit the version number change:
```
git commit -m "updated version number" -a && git push -u  
```
---
### 12. Update Websites

Look at the [issues][li] for **⚠️ updates for version 2.2.17** (for example)

Update websites accordingly.

[li]: https://github.com/svijalove/admin-update/issues

---

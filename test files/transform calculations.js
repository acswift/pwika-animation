<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 27.5.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 1200 1808" style="enable-background:new 0 0 1200 1808;" xml:space="preserve">
<style type="text/css">
	.st0{fill:#FFFFFF;}
	.st1{fill:#FF00FF;}
</style>
<g id="page_color">
	<rect id="computer" class="st0" width="1200" height="1808"/>
</g>
<g id="content">
</g>
<g>
	<rect id="here" x="100" y="100" class="st1" width="50" height="50" transform="matrix(1 2 0 1 0 0)" />
</g>
</svg><script>

  var rect  = here.getBBox() // x, y, width, height
  var trans = [1, 2, 0, 1, 0, 0]

  var nRect = transformed(rect, trans)

  alert('x: '+rect['x']+' to '+nRect['x'] + 
      '\ny: '+rect['y']+' to '+nRect['y'] +
      '\nwidth: ' +rect['width'] +' to '+nRect['width'] +
      '\nheight: '+rect['height']+' to '+nRect['height']
  )

//———————————————————————————————————————— return transformed rect

function transformed(rect, trans){
  [a, b, c, d, e, f] = trans
  var x, y, w, h

  x = rect['x']
  y = rect['y']
  w = rect['width']
  h = rect['height']

  var cornOld = {
    'tl': [],
    'tr': [],
    'bl': [],
    'br': []
  }

  var cornNew = {
    'tl': [],
    'tr': [],
    'bl': [],
    'br': []
  }

  cornOld['tl'] = [x,   y  ]
  cornOld['tr'] = [x+w, y  ]
  cornOld['bl'] = [  x, y+h]
  cornOld['br'] = [x+w, y+h]

  var oldX = cornOld['tl'][0] // top left
  var oldY = cornOld['tl'][1]
  newX = a * oldX + c * oldY + e
  newY = b * oldX + d * oldY + f
  cornNew['tl'] = [newX, newY]

  var oldX = cornOld['tr'][0] // top right
  var oldY = cornOld['tr'][1]
  newX = a * oldX + c * oldY + e
  newY = b * oldX + d * oldY + f
  cornNew['tr'] = [newX, newY]

  var oldX = cornOld['bl'][0] // bottom left
  var oldY = cornOld['bl'][1]
  newX = a * oldX + c * oldY + e
  newY = b * oldX + d * oldY + f
  cornNew['bl'] = [newX, newY]

  var oldX = cornOld['br'][0] // bottom right
  var oldY = cornOld['br'][1]
  newX = a * oldX + c * oldY + e
  newY = b * oldX + d * oldY + f
  cornNew['br'] = [newX, newY]

  x = Math.min(cornNew['tl'][0], cornNew['bl'][0])
  y = Math.min(cornNew['tl'][1], cornNew['tr'][1])

  var maxX = Math.max(cornNew['tr'][0], cornNew['br'][0])
  var maxY = Math.max(cornNew['bl'][1], cornNew['br'][1])

  w = maxX - x
  h = maxY - y

  return {'x': x, 'y': y, 'width':w, 'height':h}
}

</script>

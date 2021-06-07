/**
 * @license
 * Copyright 2013 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview JavaScript for Puzzle game.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Puzzle');

goog.require('Blockly.utils.math');
goog.require('BlocklyDialogs');
goog.require('BlocklyGames');
goog.require('BlocklyInterface');
goog.require('Puzzle.soy');
goog.require('Puzzle.Blocks');


BlocklyGames.NAME = 'puzzle';

/**
 * Initialize Blockly and the puzzle.  Called on page load.
 */
Puzzle.init = function() {
  // Render the Soy template.
  document.body.innerHTML = Puzzle.soy.start({}, null,
      {lang: BlocklyGames.LANG,
       html: BlocklyGames.IS_HTML});

  BlocklyInterface.init();

  var rtl = BlocklyGames.isRtl();
  var blocklyDiv = document.getElementById('blockly');
  var onresize = function(e) {
    blocklyDiv.style.width = (window.innerWidth - 20) + 'px';
    blocklyDiv.style.height =
        (window.innerHeight - blocklyDiv.offsetTop - 15) + 'px';
  };
  onresize(null);
  window.addEventListener('resize', onresize);

  BlocklyInterface.injectBlockly(
      {'rtl': rtl,
       'scrollbars': false,
       'trashcan': false});

  var savedBlocks =
      BlocklyGames.loadFromLocalStorage(BlocklyGames.NAME, BlocklyGames.LEVEL);
  // Add the blocks.
  try {
    var loadOnce = window.sessionStorage.loadOnceBlocks;
  } catch (e) {
    // Firefox sometimes throws a SecurityError when accessing sessionStorage.
    // Restarting Firefox fixes this, so it looks like a bug.
    var loadOnce = null;
  }
  if (loadOnce) {
    delete window.sessionStorage.loadOnceBlocks;
    var xml = Blockly.Xml.textToDom(loadOnce);
    Blockly.Xml.domToWorkspace(xml, BlocklyInterface.workspace);
  } else if (savedBlocks) {
    var xml = Blockly.Xml.textToDom(savedBlocks);
    Blockly.Xml.domToWorkspace(xml, BlocklyInterface.workspace);
  } else {
    // Create one of every block.
    var blocksAnimals = [];
    var blocksPictures = [];
    var blocksTraits = [];
    var i = 1;
    var block;
    while (BlocklyGames.getMsgOrNull('Puzzle_animal' + i)) {
      block = BlocklyInterface.workspace.newBlock('animal');
      block.populate(i);
      blocksAnimals.push(block);
      block = BlocklyInterface.workspace.newBlock('picture');
      block.populate(i);
      blocksPictures.push(block);
      var j = 1;
      while (BlocklyGames.getMsgOrNull('Puzzle_animal' + i + 'Trait' + j)) {
        block = BlocklyInterface.workspace.newBlock('trait');
        block.populate(i, j);
        blocksTraits.push(block);
        j++;
      }
      i++;
    }
    Puzzle.shuffle(blocksAnimals);
    Puzzle.shuffle(blocksPictures);
    Puzzle.shuffle(blocksTraits);
    var blocks = [].concat(blocksAnimals, blocksPictures, blocksTraits);
    if (rtl) {
      blocks.reverse();
    }
    // Initialize all the blocks.
    for (var i = 0, block; (block = blocks[i]); i++) {
      block.setDeletable(false);
      block.initSvg();
      block.render();
    }
    var totalArea = 0;
    // Measure the surface area of each block.
    for (var i = 0, block; (block = blocks[i]); i++) {
      var blockBox = block.getSvgRoot().getBBox();
      block.cached_width_ = blockBox.width;
      block.cached_height_ = blockBox.height;
      block.cached_area_ = blockBox.width * blockBox.height;
      totalArea += block.cached_area_;
    }
    // Position the blocks randomly.
    var MARGIN = 50;
    Blockly.svgResize(BlocklyInterface.workspace);
    var workspaceBox = BlocklyInterface.workspace.getCachedParentSvgSize();
    workspaceBox.width -= MARGIN;
    workspaceBox.height -= MARGIN;
    var countedArea = 0;
    for (var i = 0, block; (block = blocks[i]); i++) {
      var blockBox = block.getSvgRoot().getBBox();
      // Spread the blocks horizontally, grouped by type.
      // Spacing is proportional to block's area.
      if (rtl) {
        var dx = blockBox.width +
                 (countedArea / totalArea) * workspaceBox.width;
      } else {
        var dx = (countedArea / totalArea) *
                 (workspaceBox.width - blockBox.width);
      }
      dx = Math.round(dx + Math.random() * MARGIN);
      var dy = Math.round(Math.random() *
                          (workspaceBox.height - blockBox.height));
      block.moveBy(dx, dy);
      countedArea += block.cached_area_;
    }
  }
  BlocklyInterface.workspace.clearUndo();

  BlocklyGames.bindClick('checkButton', Puzzle.checkAnswers);
  BlocklyGames.bindClick('helpButton', function(){Puzzle.showHelp(true);});

  if (!savedBlocks) {
    Puzzle.showHelp(false);
  }

  // Make connecting blocks easier for beginners.
  Blockly.SNAP_RADIUS *= 2;
  Blockly.CONNECTING_SNAP_RADIUS = Blockly.SNAP_RADIUS;
  // Preload the win sound.
  BlocklyInterface.workspace.getAudioManager().load(
      ['puzzle/win.mp3', 'puzzle/win.ogg'], 'win');
};

/**
 * Shuffles the values in the specified array using the Fisher-Yates in-place
 * shuffle (also known as the Knuth Shuffle).
 * Runtime: O(n)
 * Based on Closure's goog.array.shuffle.
 * @param {!Array} arr The array to be shuffled.
 */
Puzzle.shuffle = function(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    // Choose a random array index in [0, i] (inclusive with i).
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
};

/**
 * Return a list of all legs.
 * @return {!Array.<!Array.<string>>} Array of human-readable and
 *   language-neutral tuples.
 */
Puzzle.legs = function() {
  var list = [[BlocklyGames.getMsg('Puzzle_legsChoose'), '0']];
  var i = 1;
  var legs;
  while (legs = BlocklyGames.getMsgOrNull('Puzzle_animal' + i + 'Legs')) {
    list[i] = [legs, String(i)];
    i++;
  }
  // Sort numerically.
  list.sort(function(a, b) {return a[0] - b[0];});
  return list;
};

/**
 * Count and highlight the errors.
 */
Puzzle.checkAnswers = function() {
  var blocks = BlocklyInterface.workspace.getAllBlocks();
  var errors = 0;
  var badBlocks = [];
  for (var b = 0, block; (block = blocks[b]); b++) {
    if (!block.isCorrect()) {
      errors++;
      // Bring the offending blocks to the front.
      block.select();
      badBlocks.push(block);
    }
  }

  var graphValue = document.getElementById('graphValue');
  setTimeout(function() {
      graphValue.style.width =
          (100 * (blocks.length - errors) / blocks.length) + 'px';
  }, 500);

  var messages;
  if (errors == 1) {
    messages = [BlocklyGames.getMsg('Puzzle_error1'),
                BlocklyGames.getMsg('Puzzle_tryAgain')];
  } else if (errors) {
    messages = [BlocklyGames.getMsg('Puzzle_error2').replace('%1', errors),
                BlocklyGames.getMsg('Puzzle_tryAgain')];
  } else {
    messages = [BlocklyGames.getMsg('Puzzle_error0').replace(
        '%1', blocks.length)];
    BlocklyInterface.executedCode = BlocklyInterface.getCode();
    BlocklyInterface.saveToLocalStorage();
  }
  var textDiv = document.getElementById('answerMessage');
  textDiv.textContent = '';
  for (var i = 0; i < messages.length; i++) {
    var line = document.createElement('div');
    line.appendChild(document.createTextNode(messages[i]));
    textDiv.appendChild(line);
  }

  var content = document.getElementById('answers');
  var button = document.getElementById('checkButton');
  var rtl = BlocklyGames.isRtl();
  var style = {
    width: '25%',
    left: rtl ? '5%' : '70%',
    top: '5em'
  };
  var action = errors ? BlocklyDialogs.stopDialogKeyDown :
      BlocklyInterface.indexPage;
  BlocklyDialogs.showDialog(content, button, true, true, style, action);
  BlocklyDialogs.startDialogKeyDown();

  if (badBlocks.length) {
    // Pick a random bad block and blink it until the dialog closes.
    Puzzle.shuffle(badBlocks);
    var badBlock = badBlocks[0];
    var blink = function() {
      badBlock.select();
      if (BlocklyDialogs.isDialogVisible_) {
        setTimeout(function() {badBlock.unselect();}, 150);
        setTimeout(blink, 300);
      }
    };
    blink();
  } else {
    setTimeout(Puzzle.endDance, 2000);
    if (Blockly.selected) {
      Blockly.selected.unselect();
    }
  }
};

/**
 * All blocks correct.  Do the end dance.
 */
Puzzle.endDance = function() {
  BlocklyInterface.workspace.getAudioManager().play('win', 0.5);
  // Enable dragging of workspace.  This sets Blockly to allow blocks to
  // move off-screen, rather than auto-bump them back in bounds.
  // This has no UI change, since the workspace is now permanently
  // non-interactive due to the modal winning dialog.
  BlocklyInterface.workspace.options.moveOptions.drag = true;
  var blocks = BlocklyInterface.workspace.getTopBlocks(false);
  for (var i = 0, block; (block = blocks[i]); i++) {
    var angle = 360 * (i / blocks.length);
    Puzzle.animate(block, angle);
  }
};

/**
 * Animate a block moving around after the puzzle is complete.
 * @param {!Blockly.Block} block Block to move.
 * @param {number} angleOffset Degrees offset in circle.
 */
Puzzle.animate = function(block, angleOffset) {
  if (!BlocklyDialogs.isDialogVisible_) {
    // Firefox can navigate 'back' to this page with the animation running
    // but the dialog gone.
    return;
  }
  // Collect all the metrics.
  var workspaceMetrics = BlocklyInterface.workspace.getMetrics();
  var halfHeight = workspaceMetrics.viewHeight / 2;
  var halfWidth = workspaceMetrics.viewWidth / 2;
  var blockHW = block.getHeightWidth();
  var blockXY = block.getRelativeToSurfaceXY();
  if (BlocklyGames.isRtl()) {
    blockXY.x -= blockHW.width;
  }
  var radius = Math.max(175, Math.min(halfHeight, halfWidth) -
      Math.max(blockHW.height, blockHW.width) / 2);

  var ms = Date.now();
  // Rotate the blocks around the centre.
  var angle = angleOffset + (ms / 50 % 360);
  // Vary the radius sinusoidally.
  radius *= Math.sin(((ms % 5000) / 5000) * (Math.PI * 2)) / 8 + 7 / 8;
  var targetX = Puzzle.angleDx(angle, radius) + halfWidth -
      blockHW.width / 2;
  var targetY = Puzzle.angleDy(angle, radius) + halfHeight -
      blockHW.height / 2;
  var speed = 5;

  var distance = Math.sqrt(Math.pow(targetX - blockXY.x, 2) +
                           Math.pow(targetY - blockXY.y, 2));
  if (distance < speed) {
    var dx = targetX - blockXY.x;
    var dy = targetY - blockXY.y;
  } else {
    var heading = Puzzle.pointsToAngle(blockXY.x, blockXY.y, targetX, targetY);
    var dx = Math.round(Puzzle.angleDx(heading, speed));
    var dy = Math.round(Puzzle.angleDy(heading, speed));
  }
  block.moveBy(dx, dy);
  setTimeout(Puzzle.animate.bind(null, block, angleOffset), 50);
};

/**
 * For a given angle and radius, finds the X portion of the offset.
 * Copied from Closure's goog.math.angleDx.
 * @param {number} degrees Angle in degrees (zero points in +X direction).
 * @param {number} radius Radius.
 * @return {number} The x-distance for the angle and radius.
 */
Puzzle.angleDx = function(degrees, radius) {
  return radius * Math.cos(Blockly.utils.math.toRadians(degrees));
};

/**
 * For a given angle and radius, finds the Y portion of the offset.
 * Copied from Closure's goog.math.angleDy.
 * @param {number} degrees Angle in degrees (zero points in +X direction).
 * @param {number} radius Radius.
 * @return {number} The y-distance for the angle and radius.
 */
Puzzle.angleDy = function(degrees, radius) {
  return radius * Math.sin(Blockly.utils.math.toRadians(degrees));
};

/**
 * Computes the angle between two points (x1,y1) and (x2,y2).
 * Angle zero points in the +X direction, 90 degrees points in the +Y
 * direction (down) and from there we grow clockwise towards 360 degrees.
 * Copied from Closure's goog.math.angle.
 * @param {number} x1 x of first point.
 * @param {number} y1 y of first point.
 * @param {number} x2 x of second point.
 * @param {number} y2 y of second point.
 * @return {number} Standardized angle in degrees of the vector from
 *     x1,y1 to x2,y2.
 */
Puzzle.pointsToAngle = function(x1, y1, x2, y2) {
  var angle = Blockly.utils.math.toDegrees(Math.atan2(y2 - y1, x2 - x1));
  return BlocklyGames.normalizeAngle(angle);
};

/**
 * Show the help pop-up.
 * @param {boolean} animate Animate the pop-up opening.
 */
Puzzle.showHelp = function(animate) {
  var xml = [
      '<xml>',
        '<block type="animal" x="5" y="5">',
          '<mutation animal="1"></mutation>',
          '<title name="LEGS">1</title>',
          '<value name="PIC">',
            '<block type="picture">',
              '<mutation animal="1"></mutation>',
            '</block>',
          '</value>',
          '<statement name="TRAITS">',
            '<block type="trait">',
              '<mutation animal="1" trait="2"></mutation>',
              '<next>',
                '<block type="trait">',
                  '<mutation animal="1" trait="1"></mutation>',
                '</block>',
              '</next>',
            '</block>',
          '</statement>',
        '</block>',
      '</xml>'];
  BlocklyInterface.injectReadonly('sample', xml);

  var help = document.getElementById('help');
  var button = document.getElementById('helpButton');
  var style = {
    width: '50%',
    left: '25%',
    top: '5em'
  };
  BlocklyDialogs.showDialog(help, button, animate, true, style,
      BlocklyDialogs.stopDialogKeyDown);
  BlocklyDialogs.startDialogKeyDown();
};

window.addEventListener('load', Puzzle.init);

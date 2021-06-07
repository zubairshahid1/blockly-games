/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Blocks for Maze game.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Maze.Blocks');

goog.require('Blockly');
goog.require('Blockly.JavaScript');
goog.require('Blockly.FieldDropdown');
goog.require('Blockly.FieldImage');
goog.require('BlocklyGames');


/**
 * Common HSV hue for all movement blocks.
 */
Maze.Blocks.MOVEMENT_HUE = 290;

/**
 * HSV hue for loop block.
 */
Maze.Blocks.LOOPS_HUE = 120;

/**
 * Common HSV hue for all logic blocks.
 */
Maze.Blocks.LOGIC_HUE = 210;

/**
 * Left turn arrow to be appended to messages.
 */
Maze.Blocks.LEFT_TURN = ' \u21BA';

/**
 * Left turn arrow to be appended to messages.
 */
Maze.Blocks.RIGHT_TURN = ' \u21BB';

// Extensions to Blockly's existing blocks and JavaScript generator.

Blockly.Blocks['maze_moveForward'] = {
  /**
   * Block for moving forward.
   * @this {Blockly.Block}
   */
  init: function() {
    this.jsonInit({
      //"message0": 'E ',
      "message0": "E %1",
      "args0": [
        {
          "type": "field_image",
          "src": "maze/moveright.png",  
          "width": 15,
          "height": 15,
          "alt": "*"
        }
      ],
      //BlocklyGames.getMsg('Maze_moveForward'),
      "previousStatement": null,
      "nextStatement": null,
      "colour": "rgb(0, 176, 189)" ,
      //Maze.Blocks.MOVEMENT_HUE,
      "tooltip": BlocklyGames.getMsg('Maze_moveForwardTooltip')
    });
  
  }
};


Blockly.JavaScript['maze_moveForward'] = function(block) {
  // Generate JavaScript for moving forward.
  return 'moveForward(\'block_id_' + block.id + '\');\n';
};


/////// Move Backward    Zubair

Blockly.Blocks['maze_moveBackward'] = {
  /**
   * Block for moving backward.
   * @this {Blockly.Block}
   */
  init: function() {
    this.jsonInit({
      //"message0": 'E ',
      "message0": "W %1",
      "args0": [
        {
          "type": "field_image",
          "src": "maze/moveleft.png",  
          "width": 15,
          "height": 15,
          "alt": "*"
        }
      ],
      //BlocklyGames.getMsg('Maze_moveForward'),
      "previousStatement": null,
      "nextStatement": null,
      "colour": "rgb(0, 176, 189)" ,
      //Maze.Blocks.MOVEMENT_HUE,
      "tooltip": BlocklyGames.getMsg('Maze_moveBackwardTooltip')
    });
  
  }
};
Blockly.JavaScript['maze_moveBackward'] = function(block) {
  // Generate JavaScript for moving backward zubair.
  return 'moveBackward(\'block_id_' + block.id + '\');\n';
};


/// for delete

Blockly.Blocks['maze_moveUp'] = {
  /**
   * Block for moving up.
   * @this {Blockly.Block}
   */
  init: function() {
    this.jsonInit({
      
      "message0": "N %1",
      "args0": [
        {
          "type": "field_image",
          "src": "maze/moveup.png",  
          "width": 15,
          "height": 15,
          "alt": "*"
        }
      ],
      //BlocklyGames.getMsg('Maze_moveForward'),
      "previousStatement": null,
      "nextStatement": null,
      "colour": "rgb(0, 176, 189)" ,
      //Maze.Blocks.MOVEMENT_HUE,
      "tooltip": BlocklyGames.getMsg('Maze_moveUpTooltip')
    });
  
  }
};
Blockly.JavaScript['maze_moveUp'] = function(block) {
  // Generate JavaScript for moving up zubair.
  return 'turnLeft' + '(\'block_id_' + block.id + '\');\n' + 'moveForward(\'block_id_' + block.id + '\');\n';
};

/// Down 

Blockly.Blocks['maze_moveDown'] = {
  /**
   * Block for moving Down.
   * @this {Blockly.Block}
   */
  init: function() {
    this.jsonInit({
      //"message0": 'E ',
      "message0": "S %1",
      "args0": [
        {
          "type": "field_image",
          "src": "maze/movedown.png",  
          "width": 15,
          "height": 15,
          "alt": "*"
        }
      ],
      //BlocklyGames.getMsg('Maze_moveForward'),
      "previousStatement": null,
      "nextStatement": null,
      "colour": "rgb(0, 176, 189)" ,
      //Maze.Blocks.MOVEMENT_HUE,
      "tooltip": BlocklyGames.getMsg('Maze_moveDownTooltip')
    });
  
  }
};
Blockly.JavaScript['maze_moveDown'] = function(block) {
  // Generate JavaScript for moving down zubair.
  return 'turnRight' + '(\'block_id_' + block.id + '\');\n' + 'moveForward(\'block_id_' + block.id + '\');\n';
  };

/// for delete end

// Blockly.Blocks['maze_turn'] = {
//   /**
//    * Block for turning left or right.
//    * @this {Blockly.Block}
//    */
//   init: function() {
//     var DIRECTIONS =
//         [[BlocklyGames.getMsg('Maze_turnLeft'), 'turnLeft'],
//          [BlocklyGames.getMsg('Maze_turnRight'), 'turnRight']];
//     // Append arrows to direction messages.
//     DIRECTIONS[0][0] += Maze.Blocks.LEFT_TURN;
//     DIRECTIONS[1][0] += Maze.Blocks.RIGHT_TURN;
//     this.setColour(Maze.Blocks.MOVEMENT_HUE);
//     this.appendDummyInput()
//         .appendField(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
//     this.setPreviousStatement(true);
//     this.setNextStatement(true);
//     this.setTooltip(BlocklyGames.getMsg('Maze_turnTooltip'));
//   }
// };

// Blockly.JavaScript['maze_turn'] = function(block) {
//   // Generate JavaScript for turning left or right.
//   var dir = block.getFieldValue('DIR');
//   return dir + '(\'block_id_' + block.id + '\');\n';
// };

/// Zubair

// Blockly.Blocks['maze_turnLeft'] = {
//   /**
//    * Block for turning left.
//    * @this {Blockly.Block}
//    */
// init: function() {
//   var DIRECTIONS =
//       [[BlocklyGames.getMsg('Maze_turnLeft'), 'turnLeft']];
//   // Append arrows to direction messages.
//   DIRECTIONS[0][0] += Maze.Blocks.LEFT_TURN;
//   this.setColour("rgb(0, 176, 189)");
//   this.appendDummyInput()
//       .appendField('S')
//       .appendField(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
//   this.setPreviousStatement(true);
//   this.setNextStatement(true);
//   this.setTooltip(BlocklyGames.getMsg('Maze_turnTooltip'));
// }
// };

// Blockly.JavaScript['maze_turnLeft'] = function(block) {
// // Generate JavaScript for turning left.
// var dir = block.getFieldValue('DIR');
// console.log(dir + '(\'block_id_' + block.id + '\');\n' + 'moveForward(\'block_id_' + block.id + '\');\n' );
// return 'turnLeft' + '(\'block_id_' + block.id + '\');\n' + 'moveForward(\'block_id_' + block.id + '\');\n'; 
// };

// /// turn right

// Blockly.Blocks['maze_turnRight'] = {
//   /**
//    * Block for turning right.
//    * @this {Blockly.Block}
//    */
// init: function() {
//   var DIRECTIONS =
//       [[BlocklyGames.getMsg('Maze_turnRight'), 'turnRight']];
//   // Append arrows to direction messages.
//   DIRECTIONS[0][0] += Maze.Blocks.RIGHT_TURN;
//   this.setColour("rgb(0, 176, 189)");
//   this.appendDummyInput()
//       .appendField('W')
//       .appendField(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
//   this.setPreviousStatement(true);
//   this.setNextStatement(true);
//   this.setTooltip(BlocklyGames.getMsg('Maze_turnTooltip'));
// }
// };

// Blockly.JavaScript['maze_turnRight'] = function(block) {
// // Generate JavaScript for turning right.
// var dir = block.getFieldValue('DIR');
// return dir + '(\'block_id_' + block.id + '\');\n' + 'moveForward(\'block_id_' + block.id + '\');\n';
// };


/// End Zubair







Blockly.Blocks['maze_if'] = {
  /**
   * Block for 'if' conditional if there is a path.
   * @this {Blockly.Block}
   */
  init: function() {
    var DIRECTIONS =
        [[BlocklyGames.getMsg('Maze_pathAhead'), 'isPathForward'],
         [BlocklyGames.getMsg('Maze_pathLeft'), 'isPathLeft'],
         [BlocklyGames.getMsg('Maze_pathRight'), 'isPathRight']];
    // Append arrows to direction messages.
    DIRECTIONS[1][0] += Maze.Blocks.LEFT_TURN;
    DIRECTIONS[2][0] += Maze.Blocks.RIGHT_TURN;
    this.setColour(Maze.Blocks.LOGIC_HUE);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.appendStatementInput('DO')
        .appendField(BlocklyGames.getMsg('Maze_doCode'));
    this.setTooltip(BlocklyGames.getMsg('Maze_ifTooltip'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['maze_if'] = function(block) {
  // Generate JavaScript for 'if' conditional if there is a path.
  var argument = block.getFieldValue('DIR') +
      '(\'block_id_' + block.id + '\')';
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  var code = 'if (' + argument + ') {\n' + branch + '}\n';
  return code;
};

Blockly.Blocks['maze_ifElse'] = {
  /**
   * Block for 'if/else' conditional if there is a path.
   * @this {Blockly.Block}
   */
  init: function() {
    var DIRECTIONS =
        [[BlocklyGames.getMsg('Maze_pathAhead'), 'isPathForward'],
         [BlocklyGames.getMsg('Maze_pathLeft'), 'isPathLeft'],
         [BlocklyGames.getMsg('Maze_pathRight'), 'isPathRight']];
    // Append arrows to direction messages.
    DIRECTIONS[1][0] += Maze.Blocks.LEFT_TURN;
    DIRECTIONS[2][0] += Maze.Blocks.RIGHT_TURN;
    this.setColour(Maze.Blocks.LOGIC_HUE);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.appendStatementInput('DO')
        .appendField(BlocklyGames.getMsg('Maze_doCode'));
    this.appendStatementInput('ELSE')
        .appendField(BlocklyGames.getMsg('Maze_elseCode'));
    this.setTooltip(BlocklyGames.getMsg('Maze_ifelseTooltip'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['maze_ifElse'] = function(block) {
  // Generate JavaScript for 'if/else' conditional if there is a path.
  var argument = block.getFieldValue('DIR') +
      '(\'block_id_' + block.id + '\')';
  var branch0 = Blockly.JavaScript.statementToCode(block, 'DO');
  var branch1 = Blockly.JavaScript.statementToCode(block, 'ELSE');
  var code = 'if (' + argument + ') {\n' + branch0 +
             '} else {\n' + branch1 + '}\n';
  return code;
};

Blockly.Blocks['maze_forever'] = {
  /**
   * Block for repeat loop.
   * @this {Blockly.Block}
   */
  init: function() {
    this.setColour(Maze.Blocks.LOOPS_HUE);
    this.appendDummyInput()
        .appendField(BlocklyGames.getMsg('Maze_repeatUntil'))
        .appendField(new Blockly.FieldImage(Maze.SKIN.marker, 12, 16));
    this.appendStatementInput('DO')
        .appendField(BlocklyGames.getMsg('Maze_doCode'));
    this.setPreviousStatement(true);
    this.setTooltip(BlocklyGames.getMsg('Maze_whileTooltip'));
  }
};

Blockly.JavaScript['maze_forever'] = function(block) {
  // Generate JavaScript for repeat loop.
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
    branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'block_id_' + block.id + '\'') + branch;
  }
  return 'while (notDone()) {\n' + branch + '}\n';
};

/**
 * @license
 * Copyright 2013 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Blocks for Puzzle game.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Puzzle.Blocks');

goog.require('Blockly');
goog.require('Blockly.FieldDropdown');
goog.require('Blockly.FieldImage');
goog.require('BlocklyGames');


/**
 * Common HSV hue for all animal blocks.
 */
Puzzle.Blocks.ANIMAL_HUE = 120;

/**
 * Common HSV hue for all picture blocks.
 */
Puzzle.Blocks.PICTURE_HUE = 30;

/**
 * Common HSV hue for all trait blocks.
 */
Puzzle.Blocks.TRAIT_HUE = 290;

Blockly.Blocks['animal'] = {
  /**
   * Block to represent an animal.
   * @this {Blockly.Block}
   */
  init: function() {
    this.setColour(Puzzle.Blocks.ANIMAL_HUE);
    this.appendDummyInput()
        .appendField('', 'NAME');
    this.appendValueInput('PIC')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(BlocklyGames.getMsg('Puzzle_picture'));
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(BlocklyGames.getMsg('Puzzle_legs'))
        .appendField(new Blockly.FieldDropdown(Puzzle.legs), 'LEGS');
    this.appendStatementInput('TRAITS')
        .appendField(BlocklyGames.getMsg('Puzzle_traits'));
    this.setInputsInline(false);
  },
  /**
   * Save the animal number.
   * @this {Blockly.Block}
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('animal', this.animal);
    return container;
  },
  /**
   * Restore the animal number.
   * @this {Blockly.Block}
   */
  domToMutation: function(xmlElement) {
    this.populate(parseInt(xmlElement.getAttribute('animal'), 10));
  },
  animal: 0,
  /**
   * Set the animal.
   * @this {Blockly.Block}
   */
  populate: function(n) {
    this.animal = n;
    this.setFieldValue(BlocklyGames.getMsg('Puzzle_animal' + n), 'NAME');
    this.helpUrl = BlocklyGames.getMsg('Puzzle_animal' + n + 'HelpUrl');
  },
  /**
   * Evaluate the correctness of this block.
   * @this {Blockly.Block}
   */
  isCorrect: function() {
    return this.getFieldValue('LEGS') == this.animal;
  }
};

Blockly.Blocks['picture'] = {
  /**
   * Block to represent a picture.
   * @this {Blockly.Block}
   */
  init: function() {
    this.setColour(Puzzle.Blocks.PICTURE_HUE);
    this.appendDummyInput('PIC');
    this.setOutput(true);
    this.setTooltip('');
  },
  mutationToDom: Blockly.Blocks['animal'].mutationToDom,
  domToMutation: Blockly.Blocks['animal'].domToMutation,
  animal: 0,
  /**
   * Set the animal and picture.
   * @this {Blockly.Block}
   */
  populate: function(n) {
    this.animal = n;
    var pic = 'puzzle/' + BlocklyGames.getMsg('Puzzle_animal' + n + 'Pic');
    var picHeight = BlocklyGames.getMsg('Puzzle_animal' + n + 'PicHeight');
    var picWidth = BlocklyGames.getMsg('Puzzle_animal' + n + 'PicWidth');
    this.getInput('PIC')
        .appendField(new Blockly.FieldImage(pic, picWidth, picHeight));
  },
  /**
   * Evaluate the correctness of this block.
   * @this {Blockly.Block}
   */
  isCorrect: function() {
    var parent = this.getParent();
    return parent && (parent.animal == this.animal);
  }
};

Blockly.Blocks['trait'] = {
  /**
   * Block to represent a trait.
   * @this {Blockly.Block}
   */
  init: function() {
    this.setColour(Puzzle.Blocks.TRAIT_HUE);
    this.appendDummyInput().appendField('', 'NAME');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  },
  /**
   * Save the animal and trait numbers.
   * @this {Blockly.Block}
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('animal', this.animal);
    container.setAttribute('trait', this.trait);
    return container;
  },
  /**
   * Restore the animal and trait numbers.
   * @this {Blockly.Block}
   */
  domToMutation: function(xmlElement) {
    this.populate(parseInt(xmlElement.getAttribute('animal'), 10),
                  parseInt(xmlElement.getAttribute('trait'), 10));
  },
  animal: 0,
  trait: 0,
  /**
   * Set the animal and trait.
   * @this {Blockly.Block}
   */
  populate: function(n, m) {
    this.animal = n;
    this.trait = m;
    // Set the trait name.
    this.setFieldValue(BlocklyGames.getMsg(
        'Puzzle_animal' + n + 'Trait' + m), 'NAME');
  },
  /**
   * Evaluate the correctness of this block.
   * @this {Blockly.Block}
   */
  isCorrect: function() {
    var parent = this.getSurroundParent();
    return parent && (parent.animal == this.animal);
  }
};

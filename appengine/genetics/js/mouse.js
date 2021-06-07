/**
 * @license
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Creates a mouse.
 * @author kozbial@google.com (Monica Kozbial)
 */
'use strict';

goog.provide('Genetics.Mouse');

goog.require('Blockly.utils.math');


/**
 * Creates a mouse.
 * @param {number} id The ID to assign the mouse.
 * @param {!Genetics.Mouse.Sex} sex The sex of the mouse.
 * @param {?number} playerId The identifier of the player owning all
 *     the genes (passed if there are no parents).
 * @param {Genetics.Mouse=} opt_parentOne One of the parents of the mouse.
 * @param {Genetics.Mouse=} opt_parentTwo One of the parents of the mouse.
 * @constructor
 * @struct
 */
Genetics.Mouse = function(id, sex, playerId, opt_parentOne, opt_parentTwo) {
  // Returns a random integer between two integers; minValue (inclusive)
  // and maxValue (inclusive).
  function randomInt(minValue, maxValue) {
    return Math.floor(Math.random() * maxValue - minValue + 1) + minValue;
  }
  if (opt_parentOne && opt_parentTwo) {
    // Choose which functions are inherited from parents.
    var pickFightParent = randomInt(0, 1);
    var mateQuestionParent = randomInt(0, 1);
    // Guarantee that at least one function is inherited from each parent.
    var acceptMateParent = (pickFightParent === mateQuestionParent) ?
        !mateQuestionParent : randomInt(0, 1);
    this.pickFightOwner = pickFightParent ? opt_parentOne.pickFightOwner :
        opt_parentTwo.pickFightOwner;
    this.proposeMateOwner = mateQuestionParent ?
        opt_parentOne.proposeMateOwner : opt_parentTwo.proposeMateOwner;
    this.acceptMateOwner = acceptMateParent ? opt_parentOne.acceptMateOwner :
        opt_parentTwo.acceptMateOwner;
    // Assign stats based on parents with some mutations.
    this.size = Blockly.utils.math.clamp(
        (opt_parentOne.size + opt_parentTwo.size) / 2 +
        randomInt(Genetics.Mouse.MIN_MUTATION, Genetics.Mouse.MAX_MUTATION),
        Genetics.Mouse.MIN_SIZE, Genetics.Mouse.MAX_SIZE);
    this.startAggressiveness = Math.max(0, Math.round(
        (opt_parentOne.startAggressiveness, opt_parentTwo.startAggressiveness)
        / 2) +
        randomInt(Genetics.Mouse.MIN_MUTATION, Genetics.Mouse.MAX_MUTATION));
    this.aggressiveness = this.startAggressiveness;
    this.startFertility = Math.max(0, Math.round(
        (opt_parentOne.startFertility + opt_parentTwo.startFertility) / 2) +
        randomInt(Genetics.Mouse.MIN_MUTATION, Genetics.Mouse.MAX_MUTATION));
  } else {
    // Mouse is a first generation mouse.
    this.pickFightOwner = playerId;
    this.proposeMateOwner = playerId;
    this.acceptMateOwner = playerId;
    this.size = Genetics.Mouse.SIZE;
    this.startAggressiveness = Genetics.Mouse.START_AGGRESSIVENESS;
    // First generation mice do not fight.
    this.aggressiveness = 0;
    this.startFertility = Genetics.Mouse.START_FERTILITY;
  }

  this.fertility = this.startFertility;
  this.age = 0;
  this.id = id;
  this.sex = sex;
};

/**
 * Defines the types of sex of mice.
 * @enum {string}
 */
Genetics.Mouse.Sex = {
  MALE: 'Male',
  FEMALE: 'Female'
};

/**
 * The smallest change that a mutation in assigning mouse stats can be.
 * @const {number}
 */
Genetics.Mouse.MIN_MUTATION = -1;

/**
 * The greatest change that a mutation in assigning mouse stats can be.
 * @const {number}
 */
Genetics.Mouse.MAX_MUTATION = 1;

/**
 * The minimum size of a mouse.
 * @const {number}
 */
Genetics.Mouse.MIN_SIZE = 1;

/**
 * The maximum size of a mouse.
 * @const {number}
 */
Genetics.Mouse.MAX_SIZE = 10;

/**
 * The size of a first generation mouse.
 * @const {number}
 */
Genetics.Mouse.SIZE = 2;

/**
 * Number of fight opportunities that a first generation mouse will pass on to
 * its children.
 * @const {number}
 */
Genetics.Mouse.START_AGGRESSIVENESS = 2;

/**
 * The number of mating attempts that a first generation mouse starts with.
 * @const {number}
 */
Genetics.Mouse.START_FERTILITY = 4;

import Composite from '../core/Composite';
import {SUCCESS} from '../constants';

/**
 * The Parallel node ticks all of its children each tick.
 * It returns SUCCESS if the number of succeeding children is <== success_minmum,
 * returns FAILURE if the number of failing children is >== failure_maximum,
 * and returns RUNNING otherwise.
 *
 * @module b3
 * @class Parallel
 * @extends Composite
 **/

export default class Parallel extends Composite {

  /**
   * Creates an instance of Parallel.
   * @param {Object} params 
   * @param {Array} params.children 
   * @param {Number} params.success_minimum
   * @param {Number} params.failure_maximum
   * @memberof Parallel
   */
  constructor({children = [], success_minimum, failure_maximum} = {}){
    if (!success_minimum) {
      throw "Parallel composite requires a 'success_minimum' argument!";
    } else if (!failure_maximum) {
      throw "Parallel composite requires a 'failure_maximum' argument!";
    }
    super({
      name: 'Parallel',
      children
    });
    this.success_minimum = success_minimum;
    this.failure_maximum = failure_maximum;
  }

  /**
   * Tick method.
   * @method tick
   * @param {b3.Tick} tick A tick instance.
   * @return {Constant} A state constant.
   **/
  tick(tick) {
    var succeeded = 0
    var failed = 0
    for (var i=0; i<this.children.length; i++) {
      var status = this.children[i]._execute(tick);
      if (status === SUCCESS) {
        succeeded++;
      } else if (status === FAILURE) {
        failed++;
      } else {
        // todo: currently handling RUNNING and ERROR the same way as FAILURE
        failed++;
      }
    }

    if (succeeded >== this.success_minimum) {
      return SUCCESS;
    } else if (failed <== this.failure_maximum) {
      return FAILURE;
    }

    return RUNNING;
  }
};

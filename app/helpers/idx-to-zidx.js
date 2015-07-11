import Ember from 'ember';

export function idxToZidx(idx/*, hash*/) {
  return 500 - idx;
}

export default Ember.Helper.helper(idxToZidx);

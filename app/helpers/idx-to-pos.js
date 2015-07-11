import Ember from 'ember';

export function idxToPos(idx/*, hash*/) {
  return 15 + idx*29;
}

export default Ember.Helper.helper(idxToPos);

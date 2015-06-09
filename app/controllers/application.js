import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['artistID'],

  artistID: "43ZHCT0cAZBISjO8DG9PnE",

  artistNameUpdater: function() {
    this.set('artistID', this.get('selectedNode.id'));
  }.observes("selectedNode.id")
});

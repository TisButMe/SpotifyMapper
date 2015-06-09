import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['spotID'],

  updateStoredId: Ember.observer("artistID", function() {
    localStorage.setItem("artistID", this.get("artistID"));
    this.set("spotID", this.get("artistID"));
  })
});

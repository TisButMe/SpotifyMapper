import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    let storedId = localStorage.getItem("artistID");

    if(Ember.isPresent(params.spotID)) {
      return params.spotID;
    } else if(Ember.isPresent(storedId)) {
      return storedId;
    } else {
      return "2ZvrvbQNrHKwjT7qfGFFUW";
    }
  },

  setupController: function(controller, model) {
    controller.set("artistID", model);
  }
});

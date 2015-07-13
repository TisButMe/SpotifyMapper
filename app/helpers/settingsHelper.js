import Ember from 'ember';

export default Ember.Object.reopenClass({
  Settings: Ember.Object.extend({
    keys: ['showMagic'],
    isDirty: false,

    asJson: Ember.computed(function() {
      return JSON.stringify(this.getProperties(...this.get('keys')));
    }).volatile(),

    saver: Ember.observer('showMagic', function() {
      this.set("isDirty", true);
    })
  }),

  createDefault: function() {
    return this.Settings.create({
      showMagic: false
    });
  },

  save: function(settings) {
    let settingsAsJSONString = settings.get('asJson');
    localStorage.setItem("settings", settingsAsJSONString);
  },

  fromJson: function(jsonString) {
    return this.Settings.create(JSON.parse(jsonString));
  }
});


import Ember from 'ember';
import SettingsHelper from '../helpers/settingsHelper'

export default Ember.Controller.extend({
  queryParams: ['spotID'],

  updateStoredId: Ember.observer("artistID", function() {
    localStorage.setItem("artistID", this.get("artistID"));
    this.set("spotID", this.get("artistID"));
  }),

  settingsSaver: Ember.observer('settings.isDirty', function() {
    this.set('settings.isDirty', false);
    SettingsHelper.save(this.get('settings'));
  })
});

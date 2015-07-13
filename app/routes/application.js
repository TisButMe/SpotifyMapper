import Ember from 'ember';
import SettingsHelper from '../helpers/settingsHelper'

export default Ember.Route.extend({
  model: function (params) {
    let storedId = localStorage.getItem("artistID");

    if (Ember.isPresent(params.spotID)) {
      return params.spotID;
    } else if (Ember.isPresent(storedId)) {
      return storedId;
    } else {
      return "2ZvrvbQNrHKwjT7qfGFFUW";
    }
  },

  setupController: function (controller, model) {
    let storedSettings = localStorage.getItem("settings");

    if(Ember.isPresent(storedSettings)) {
      let loadedSettings = SettingsHelper.fromJson(storedSettings);
      controller.set("settings", loadedSettings);
    } else {
      let defaultSettings = SettingsHelper.createDefault();
      controller.set("settings", defaultSettings);
      SettingsHelper.save(defaultSettings);
    }

    controller.set("artistID", model);
  },

  actions: {
    openModal: function (modalName, model) {
      this.render(modalName, {
        into: 'application',
        outlet: 'modal',
        model: model
      });

      // Needed because this.render is async
      // but there is no way to do something after the rendering is done easily.

      Ember.run.later(() => {
        $('.ui.modal')
          .modal('show');
      }, 50);
    },

    closeModal: function() {
      $(".ui.modal").modal('hide');

      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  }
});

import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['side-bar'],

  contentVisible: true,

  url: function () {
    return this.get("selectedNode").images[0].url;
  }.property("selectedNode"),

  actions: {
    updateArtistID: function(name) {
      Ember.$.get("https://api.spotify.com/v1/search?q=" + name + "&type=artist").then((data) => {
        if(data.artists.items.length > 0) {
          this.set("artistID", data.artists.items[0].id);
        }
      });
    },

    toggleContentVisible: function() {
      this.toggleProperty('contentVisible');
    },

    searchOnYoutube: function(selectedNode) {
      window.open("https://www.youtube.com/results?search_query=" + selectedNode.name, '_blank');
    }
  }
});

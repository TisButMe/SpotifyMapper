import Ember from 'ember';

export default Ember.Controller.extend({
  artistID: "43ZHCT0cAZBISjO8DG9PnE",

  actions: {
    updateArtistID: function(name) {
      Ember.$.get("https://api.spotify.com/v1/search?q=" + name + "&type=artist").then((data) => {
        if(data.artists.items.length > 0) {
          this.set("artistID", data.artists.items[0].id)
        }
      });
    }
  }
});

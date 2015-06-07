import Ember from 'ember';
/* global d3 */

export default Ember.Component.extend({
  didInsertElement: function () {
    var width = Ember.$(document).width() - 15;
    var height = Ember.$(document).height() - Ember.$("header").height() - 25;

    let force = d3.layout.force()
      .charge(-240)
      .linkDistance(120)
      .size([width, height]);

    let svg = d3.select(".d3-map")
      .attr("width", width)
      .attr("height", height);

    let baseId = "43ZHCT0cAZBISjO8DG9PnE";

    Ember.$.get("https://api.spotify.com/v1/artists/" + baseId).then((data) => {
      let node = this.artistToNode(data);
      node.fixed = true;
      node.x = width / 2;
      node.y = height / 2;
      node.searched = true;

      force.nodes().push(node);

      this.findConnections(node).then((newNodes) => {
        let nodeIndex = force.nodes().indexOf(node);
        newNodes.forEach((node) => force.nodes().push(node));

        for (let i = force.nodes().length - newNodes.length; i < force.nodes().length; i++) {
          force.links().push({target: nodeIndex, source: i});
        }



        let links = svg.selectAll(".link")
          .data(force.links())
          .enter().append("line")
          .attr("class", "link");

        let gNodes = svg.selectAll("g")
          .data(force.nodes())
          .enter().append('g');

        this.createLabeledCircles(force, gNodes);

        force.on("tick", function () {
          links.attr("x1", function (d) {
            return d.source.x;
          }).attr("y1", function (d) {
            return d.source.y;
          }).attr("x2", function (d) {
            return d.target.x;
          }).attr("y2", function (d) {
            return d.target.y;
          });

          gNodes.attr("transform", function (d) {
            return 'translate(' + [d.x, d.y] + ')';
          });
        });

        force.start();
      });
    });
  },

  artistToNode: function (artist) {
    return {id: artist.id, name: artist.name, popularity: artist.popularity};
  },

  findConnections: function (node) {
    return Ember.$.get("https://api.spotify.com/v1/artists/" + node.id + "/related-artists").then((data) => {
      return data.artists.map((artist) => this.artistToNode(artist));
    });
  },

  createLabeledCircles: function (force, gNodes) {
    let popularityScale = d3.scale.linear()
      .domain([1, Math.max(...force.nodes().mapBy("popularity"))])
      .range([6, 24]);

    gNodes.append("circle")
      .attr("class", "node")
      .attr("r", (d) => popularityScale(d.popularity))
      .call(force.drag)
      .on("click", (d) => console.log(d));

    gNodes.append("text")
      .attr("transform", (d) => "translate(" + popularityScale(d.popularity) + ", 5)")
      .text(function (d) {
        return d.name;
      });
  }
});

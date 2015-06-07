import Ember from 'ember';
/* global d3 */

export default Ember.Component.extend({
  didInsertElement: function () {
    var width = Ember.$(document).width() - 15;
    var height = Ember.$(document).height() - Ember.$("header").height() - 25;

    let force = d3.layout.force()
      .charge(-240)
      .linkDistance(120)
      .gravity(0)
      .size([width, height]);

    let svg = d3.select(".d3-map")
      .attr("width", width)
      .attr("height", height);

    d3.json("miserables.json", function(error, graph) {
      graph.nodes[0].fixed = true;
      graph.nodes[0].x = width / 2;
      graph.nodes[0].y = height/ 2;

      let popularityScale = d3.scale.linear()
        .domain([1, Math.max(...graph.nodes.mapBy("popularity"))])
        .range([6, 24]);

      force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

      let link = svg.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link");

      let gNodes = svg.selectAll("g")
        .data(graph.nodes)
        .enter().append('g');

      gNodes.append("circle")
        .attr("class", "node")
        .attr("r", (d) => popularityScale(d.popularity))
        .call(force.drag)
        .on("click", (d) => console.log(d));

      gNodes.append("text")
        .attr("transform", (d) => "translate(" + popularityScale(d.popularity) + ", 5)")
        .text(function(d) { return d.name; });

      force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

        gNodes.attr("transform", function(d) {
          console.log(d);
          return 'translate(' + [d.x, d.y] + ')';
        });
      });
    });
  }
});

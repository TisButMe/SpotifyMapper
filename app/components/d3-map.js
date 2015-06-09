import Ember from 'ember';
/* global d3 */

export default Ember.Component.extend({
  drawGraph: function(artistId) {
    Ember.$(".d3-map").remove();
    Ember.$(".base-visuals").append('<svg class="d3-map"></svg>');

    var width = Ember.$(document).width() - 5;
    var height = Ember.$(document).height() - 5;

    let force = d3.layout.force()
      .charge(-200)
      .linkDistance(120)
      .linkStrength(0.2)
      .friction(0.95)
      .gravity(0)
      .size([width, height]);

    let svg = d3.select(".d3-map")
      .attr("width", width)
      .attr("height", height);

    Ember.$.get("https://api.spotify.com/v1/artists/" + artistId).then((data) => {
      this.set("selectedNode", data);
      let node = data;
      node.fixed = true;
      node.x = width / 2;
      node.y = height / 2;
      node.searched = true;

      force.nodes().push(node);

      this.addConnectionsForNode(node, force).then(() => {
        Ember.RSVP.all(force.nodes().map((node) => this.addConnectionsForNode(node, force)))
          .then(() => this.update(force, svg));
      });
    });

    Ember.run.later(this, function() {
      force.resume();

      Ember.run.later(this, function() {
        force.resume();
      }, 7000);
    }, 7000);
  },

  didInsertElement: function() {
    this.drawGraph(this.get('artistID'));
  },

  centerNodeUpdater: function() {
    this.drawGraph(this.get('artistID'));
  }.observes('artistID'),

  addConnectionsForNode: function(node, force) {
    let connectionsPromise = this.findConnections(node).then((linkedNodes) => {
      let nodeIndex = force.nodes().indexOf(node);

      let newNodes = linkedNodes
        .reject((node) => Ember.isPresent(force.nodes().findBy("id", node.id)));

      let duplicates = linkedNodes
        .filter((node) => Ember.isPresent(force.nodes().findBy("id", node.id)));

      // We add the new nodes, and the links from the node to the new ones
      newNodes.forEach((node) => force.nodes().push(node));
      for (let i = force.nodes().length - newNodes.length; i < force.nodes().length; i++) {
        force.links().push({target: nodeIndex, source: i});
      }

      // We add links between the node and the one we already have.
      duplicates.map((node) => this.findIndexOfNode(force.nodes(), node)).forEach((oldNodeIndex) => {
        force.links().push({target: nodeIndex, source: oldNodeIndex});
      });
    });

    return connectionsPromise;
  },

  findConnections: function (node) {
    return Ember.$.get("https://api.spotify.com/v1/artists/" + node.id + "/related-artists").then((data) => {
      return data.artists;
    });
  },

  createLabeledCircles: function (force, gNodes) {
    let popularityScale = d3.scale.pow(3)
      .domain([Math.min(...force.nodes().mapBy("popularity")), Math.max(...force.nodes().mapBy("popularity"))])
      .range([1, 25]);

    gNodes.append("circle")
      .attr("class", "node")
      .attr("r", (d) => popularityScale(d.popularity))
      .call(force.drag)
      .on("dblclick", (d) => this.set("artistID", d.id))
      .on("click", (d) => this.set("selectedNode", d));

    gNodes.append("text")
      .attr("transform", (d) => "translate(" + popularityScale(d.popularity) + ", 5)")
      .text(function (d) {
        return d.name;
      });
  },

  findIndexOfNode(nodes, node) {
    let result = -1;
    for(let i = 0; i < nodes.length; i++) {
      if(nodes[i].id === node.id) {
        result = i;
        break;
      }
    }

    return result;
  },

  update: function(force, svg) {
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
  }
});

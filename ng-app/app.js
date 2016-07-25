// create module for custom directives
var d3DemoApp = angular.module('d3DemoApp', []);

// controller business logic
// controller business logic
d3DemoApp.controller('AppCtrl', function AppCtrl ($scope, $http) {
	$scope.data = {
		"globalpropIDX": {

			"histogram": [{
				"price": "50000",
				"frequency": 16,
				"color": "blue",
				"picture": "cdn.mlhdocs.com/rcp_files/auctions/O-859/photos/thumbnails/2103803-1-G_bigThumb.jpg"
			}, {
				"price": "100000",
				"frequency": 11,
				"color": "blue",
				"picture": "None"
			}, {
				"price": "150000",
				"frequency": 15,
				"color": "grey",
				"picture": "None"
			}, {
				"price": "200000",
				"frequency": 123,
				"color": "grey",
				"picture": "None"
			}, {
				"price": "250000",
				"frequency": 95,
				"color": "blue",
				"picture": "cdn.mlhdocs.com/rcp_files/auctions/O-859/photos/thumbnails/2159615-1-G_bigThumb.jpg"
			}, {
				"price": "300000",
				"frequency": 245,
				"color": "grey",
				"picture": "None"
			}, {
				"price": "350000",
				"frequency": 189,
				"color": "blue",
				"picture": "None"
			}, {
				"price": "400000",
				"frequency": 167,
				"color": "grey",
				"picture": "None"
			}, {
				"price": "450000",
				"frequency": 75,
				"color": "grey",
				"picture": "None"
			}, {
				"price": "500000",
				"frequency": 7,
				"color": "blue",
				"picture": "cdn.mlhdocs.com/rcp_files/auctions/O-870/photos/thumbnails/2159496-1-G_bigThumb.jpg"
			}, {
				"price": "550000",
				"frequency": 17,
				"color": "grey",
				"picture": "None"
			}],

            "metadata": {
    			"avg_price": 240000,
    			"median_price": 200000,
    			"high_price": 500000,
    			"estimate": 550000
    		}

		}
	};
});

d3DemoApp.directive('trueHouse', function () {

  // constants
  var margin = 20,
    width = 960,
    height = 500 - .5 - margin,
    color = d3.interpolateRgb("#f77", "#77f");

  return {
    restrict: 'E',
    scope: {
      val: '='
    },
    link: function (scope, element, attrs) {
    	var margin = {top: 40, right: 20, bottom: 60, left: 40},
		    width = 960 - margin.left - margin.right,
		    height = 500 - margin.top - margin.bottom,
		    legendWidth  = 200,
      		legendHeight = 30;

		var x = d3.scale.ordinal()
		    .rangeRoundBands([0, width], .1);

		var y = d3.scale.linear()
		    .range([height, 0]);

        var z = d3.scale.ordinal()
		    .range([0, width], .1);
		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");


		var svg = d3.select("body").append("svg")
		    .attr("width", width + margin.left + margin.right + 100)
		    .attr("height", height + margin.top + margin.bottom + 100)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
		return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
		})
        var valueline = d3.svg.line()
            .x(function(d){ return x(d.price) })
            .y(function(d){ return y(d.frequency) })
            .interpolate('basis');

		svg.call(tip);


		var test = function(data) {
			metadata = data.metadata;
			data = data.histogram;
			x.domain(data.map(function(d) { return d.price; }));
			y.domain([0, d3.max(data, function(d) { return d.frequency; })]);
            var sortedPrice = [];
            for (var label in metadata)
                  sortedPrice.push([label, metadata[label]]);
            sortedPrice.sort(
                function(a, b) {
                    return a[1] - b[1]
                }
            );
            var lablePosition = {};
            for (i=0; i < sortedPrice.length; i++){
                lablePosition[sortedPrice[i][0]] = i * width/sortedPrice.length;
            }

			svg.append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate(0," + height + ")")
			  .call(xAxis);

			svg.append("g")
			  .attr("class", "y axis")
			  .call(yAxis)
			.append("text")
			  .attr("transform", "rotate(-90)")
			  .attr("y", 6)
			  .attr("dy", ".71em")
			  .style("text-anchor", "end")
			  .text("Frequency");

			svg.selectAll(".bar")
			  .data(data)
			.enter().append("rect")
			  .attr("class", function(d) { return (d.color == 'blue')?"bar-blue":"bar-green"})
			  .attr("x", function(d) { return x(d.price); })
			  .attr("width", x.rangeBand())
			  .attr("y", function(d) { return y(d.frequency); })
			  .attr("height", function(d) { return height - y(d.frequency); })
			  .on('mouseover', tip.show)
			  .on('mouseout', tip.hide);

              svg.append('path')
                .datum(data)
                .attr('d', valueline)
                .attr('class', 'line');


            var legend = svg
			  .append("circle")
	          .attr({
	              r: 10,
	              cx: x(metadata.estimate)+x.rangeBand()/2,
                  cy: height,
	              fill: 'grey'
	          });
            var legend = svg
              .append("circle")
	          .attr({
	              r: 10,
	              cx: x(metadata.avg_price)+x.rangeBand()/2,
                  cy: height,
	              fill: 'grey'
	          });
              var legend = svg
    			  .append("circle")
    	          .attr({
    	              r: 10,
    	              cx: x(metadata.median_price)+x.rangeBand()/2,
                      cy: height,
    	              fill: 'grey'
    	          });
            console.log(z(metadata.median_price));
            console.log(z(metadata.avg_price));
              var legend = svg
                .append("circle")
    	          .attr({
    	              r: 10,
    	              cx: x(metadata.high_price)+x.rangeBand()/2,
                      cy: height,
    	              fill: 'grey'
    	          });
                //Draw the label for median price
                svg.append('foreignObject')
                  .attr({
                      'x': lablePosition.median_price,
                      'y': height +105,
                      'width': 100,
                      'height': 60,
                      'class': 'svg-price-label'
                  })
                  .append('xhtml:div')
                  .append('div')
                  .attr({
                      'class': 'tooltip'
                  })
                  .append('p')
                  .html('Median Price: $' + metadata.median_price);
                svg.append('rect')
                    .attr({
                        'x':lablePosition.median_price,
                        'y': height +100,
                        'width': 100,
                        'height': 60,
                        'fill': '#D8D8D8',
                        'opacity': 0.4,
                    })

                //Draw the label for average price
                svg.append('foreignObject')
                  .attr({
                      'x': lablePosition.avg_price,
                      'y': height +105,
                      'width': 100,
                      'height': 60,
                      'class': 'svg-price-label'
                  })
                  .append('xhtml:div')
                  .append('div')
                  .attr({
                      'class': 'tooltip'
                  })
                  .append('p')
                  .html('Average Price: $' + metadata.avg_price);
                svg.append('rect')
                    .attr({
                        'x': lablePosition.avg_price,
                        'y': height +100,
                        'width': 100,
                        'height': 60,
                        'fill': '#D8D8D8',
                        'opacity': 0.4,
                    })

                //Draw the label for estimate price
                svg.append('foreignObject')
                  .attr({
                      'x': lablePosition.estimate,
                      'y': height +105,
                      'width': 100,
                      'height': 60,
                      'class': 'svg-price-label'
                  })
                  .append('xhtml:div')
                  .append('div')
                  .attr({
                      'class': 'tooltip'
                  })
                  .append('p')
                  .html('Estimated Price: $' + metadata.estimate);
                svg.append('rect')
                    .attr({
                        'x': lablePosition.estimate,
                        'y': height +100,
                        'width': 100,
                        'height': 60,
                        'fill': '#D8D8D8',
                        'opacity': 0.4,
                    })

                //Draw the label for high price
                svg.append('foreignObject')
                  .attr({
                      'x': lablePosition.high_price,
                      'y': height +105,
                      'width': 100,
                      'height': 60,
                      'class': 'svg-price-label'
                  })
                  .append('xhtml:div')
                  .append('div')
                  .attr({
                      'class': 'tooltip'
                  })
                  .append('p')
                  .html('High Price: $' + metadata.high_price);
                svg.append('rect')
                    .attr({
                        'x': lablePosition.high_price,
                        'y': height +100,
                        'width': 100,
                        'height': 60,
                        'fill': '#D8D8D8',
                        'opacity': 0.4,
                    });

                //Link of circle and label for high_price
                svg.append('polyline')
                    .attr({
                        points: (x(metadata.high_price)+x.rangeBand()/2) + ',' + (height+10) + ' '
                                + lablePosition.high_price + ',' + (height+100),
                        fill: 'none',
                        stroke: "blue",
                        width: "2"
                    });

                //Link of circle and label for estimate
                svg.append('polyline')
                    .attr({
                        points: (x(metadata.estimate)+x.rangeBand()/2) + ',' + (height+10) + ' '
                                + lablePosition.estimate + ',' + (height+100),
                        fill: 'none',
                        stroke: "blue",
                        width: "2"
                    });

                //Link of circle and label for high_price
                svg.append('polyline')
                    .attr({
                        points: (x(metadata.median_price)+x.rangeBand()/2) + ',' + (height+10) + ' '
                                + lablePosition.median_price + ',' + (height+100),
                        fill: 'none',
                        stroke: "blue",
                        width: "2"
                    });

                //Link of circle and label for high_price
                svg.append('polyline')
                    .attr({
                        points: (x(metadata.avg_price)+x.rangeBand()/2) + ',' + (height+10) + ' '
                                + lablePosition.avg_price + ',' + (height+100),
                        fill: 'none',
                        stroke: "blue",
                        width: "2"
                    });

		};
		scope.$watch('val', function (newVal, oldVal) {
			svg.selectAll('*').remove();

	        // if 'val' is undefined, exit
	        if (!newVal) {
	          return;
	        }
			test(newVal);
		});
    }
  }
});

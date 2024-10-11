import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { SearchNode } from '../types';

interface RadialTreeChartProps {
  data: SearchNode;
  onAskClick: (nodeName: string) => void;
}

const RadialTreeChart: React.FC<RadialTreeChartProps> = ({ data, onAskClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;
    const radius = Math.min(width, height) / 2 - 40;

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const tree = d3.tree<SearchNode>()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

    const root = d3.hierarchy(data);
    tree(root);

    const link = g.selectAll(".link")
      .data(root.links())
      .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.linkRadial<any, any>()
        .angle(d => d.x)
        .radius(d => d.y));

    const node = g.selectAll(".node")
      .data(root.descendants())
      .enter().append("g")
      .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
      .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y}, 0)`);

    node.append("circle")
      .attr("r", 4)
      .style("fill", d => d.depth === 0 ? "#4299E1" : "#48BB78");

    node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
      .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
      .text(d => d.data.name)
      .style("font-size", "12px")
      .style("fill", "#E2E8F0");

    node.append("text")
      .attr("dy", "1.31em")
      .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
      .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
      .text("Ask")
      .style("font-size", "10px")
      .style("fill", "#4FD1C5")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation();
        onAskClick(d.data.name);
      });
  }, [data, onAskClick]);

  return <svg ref={svgRef}></svg>;
};

export default RadialTreeChart;
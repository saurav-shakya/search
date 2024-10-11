import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { SearchNode } from '../types';
import { generateSearchResults } from './GeminiService';

interface TreeChartProps {
  initialData: SearchNode;
  onAskClick: (nodeName: string) => void;
}

const TreeChart: React.FC<TreeChartProps> = ({ initialData, onAskClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<SearchNode>(initialData);
  const [activeNode, setActiveNode] = useState<d3.HierarchyNode<SearchNode> | null>(null);
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<d3.HierarchyNode<SearchNode>[]>([]);

  const updateChart = (root: d3.HierarchyNode<SearchNode>) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = window.innerWidth * 0.95;
    const height = window.innerHeight * 0.8;
    const margin = { top: 40, right: 120, bottom: 40, left: 120 };

    const dx = 60;
    const dy = (width - margin.left - margin.right) / (root.height || 1);

    const tree = d3.tree<SearchNode>().nodeSize([dx, dy]);
    const diagonal = d3.linkHorizontal<any, any>().x(d => d.y).y(d => d.x);

    const treeData = tree(root);
    const nodes = treeData.descendants();
    const links = treeData.links();

    svg.attr("width", width)
       .attr("height", height)
       .attr("viewBox", [0, -height / 2, width, height])
       .attr("style", "width: 100%; height: auto; font: 18px sans-serif;");

    const g = svg.append("g")
      .attr("font-family", "Arial, sans-serif")
      .attr("font-size", 18)
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll(".link")
      .data(links)
      .join("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 3)
        .attr("d", diagonal);

    const node = g.selectAll(".node")
      .data(nodes)
      .join("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .on("click", (event, d) => handleNodeClick(event, d));

    node.append("circle")
      .attr("r", 10)
      .attr("fill", d => d.children ? "#4299E1" : "#48BB78")
      .attr("stroke", "#2D3748")
      .attr("stroke-width", 3);

    node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.children ? -15 : 15)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name)
      .attr("fill", "#E2E8F0")
      .attr("font-weight", "bold")
      .clone(true).lower()
        .attr("stroke", "#1A202C")
        .attr("stroke-width", 3);

    node.append("text")
      .attr("dy", "1.51em")
      .attr("x", d => d.children ? -15 : 15)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text("Ask")
      .attr("fill", "#4FD1C5")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .attr("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation();
        setActiveNode(d);
        setQuery(d.data.name);
      });
  };

  const handleNodeClick = async (event: any, d: d3.HierarchyNode<SearchNode>) => {
    event.stopPropagation();
    if (!d.children && !d._children) {
      try {
        const newData = await generateSearchResults(d.data.name);
        d.data.children = newData.children;
        setData({ ...data });
        setHistory([...history, d]);
      } catch (error) {
        console.error("Error fetching node data:", error);
      }
    } else if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    updateChart(d3.hierarchy(data));
  };

  const handleAskSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (activeNode) {
      try {
        const newData = await generateSearchResults(query);
        activeNode.data.children = newData.children;
        setData({ ...data });
        updateChart(d3.hierarchy(data));
        onAskClick(query);
        setHistory([...history, activeNode]);
      } catch (error) {
        console.error("Error fetching node data:", error);
      }
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const lastNode = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      updateChart(d3.hierarchy(lastNode.data));
    }
  };

  useEffect(() => {
    if (svgRef.current && data) {
      updateChart(d3.hierarchy(data));
    }

    const handleResize = () => {
      if (svgRef.current && data) {
        updateChart(d3.hierarchy(data));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data]);

  return (
    <div className="overflow-x-auto bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex justify-between mb-4">
        <button
          onClick={handleBack}
          disabled={history.length <= 1}
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        >
          Back
        </button>
      </div>
      <svg ref={svgRef}></svg>
      {activeNode && (
        <form onSubmit={handleAskSubmit} className="mt-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question..."
            className="p-3 rounded-l-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 text-lg w-3/4"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg"
          >
            Ask
          </button>
        </form>
      )}
    </div>
  );
};

export default TreeChart;
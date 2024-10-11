export interface SearchNode {
  id: string;
  name: string;
  children?: SearchNode[];
  category: 'science' | 'history' | 'technology' | 'main';
}

export interface TreeChartProps {
  data: SearchNode;
  onAskClick: (nodeName: string) => void;
}
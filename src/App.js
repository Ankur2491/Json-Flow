import ELK from 'elkjs/lib/elk.bundled.js';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import CustomNode from './CustomNode';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';

const elk = new ELK();

// Elk has a *huge* amount of options to configure. To see everything you can
// tweak check out:
//
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html
const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': '700',
  'elk.spacing.nodeNode': '500',
};

const getLayoutedElements = (nodes, edges, options = {}) => {
  const isHorizontal = options?.['elk.direction'] === 'RIGHT';
  const graph = {
    id: 'root',
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',

      // Hardcode a width and height for elk to use when layouting.
      width: 150,
      height: 50,
    })),
    edges: edges,
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children.map((node) => ({
        ...node,
        // React Flow expects a position property on the node instead of `x`
        // and `y` fields.
        position: { x: node.x, y: node.y },
      })),

      edges: layoutedGraph.edges,
    }))
    .catch(console.error);
};



function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [initNodes, setInitNodes] = useState([])
  const [initEdges, setInitEdges] = useState([])
  const [colorMode, setColorMode] = useState('dark')
  const[reload, setReload] = useState(false);
  const { fitView } = useReactFlow();
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );


  const onLayout = useCallback(
    ({ direction, useInitialNodes = true }) => {
      const opts = { 'elk.direction': direction, ...elkOptions };
      const ns = useInitialNodes ? initNodes : nodes;
      const es = useInitialNodes ? initEdges : edges;
      getLayoutedElements(ns, es, opts).then(
        ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);

          window.requestAnimationFrame(() => fitView());
        },
      );
    },
    [nodes, edges],
  );

  // Calculate the initial layout on mount.
  useLayoutEffect(() => {
    onLayout({ direction: 'DOWN', useInitialNodes: true });
  }, [initNodes]);
  const nodeTypes = { textUpdater: CustomNode }
  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-5'>
          <Editor height={'90vh'} defaultLanguage='json' theme='vs-dark' onChange={(e)=>callFormStructure(e)} />
        </div>
        <div className='col-md-7'>
          <div style={{ width: '100%', height: '90vh' }}>
            <ReactFlow
              colorMode={colorMode}
              nodes={nodes}
              edges={edges}
              onConnect={onConnect}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              panOnScroll
              selectionOnDrag
              minZoom={0.2}
              fitView
            >
              <Panel position="top-right">
                <button type="button" className="btn btn-primary btn-sm" onClick={() => {return onLayout({ direction: 'DOWN' })}}>
                  vertical layout
                </button>

                <button type="button" className="btn btn-primary btn-sm" onClick={() => onLayout({ direction: 'RIGHT' })}>
                  horizontal layout
                </button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => colorMode === 'dark' ? setColorMode('light') : setColorMode('dark')}>toggle color</button>
              </Panel>
              <MiniMap />
              <Controls />
              <Background variant={BackgroundVariant.Dots} />
            </ReactFlow>
          </div>
        </div>
      </div>
    </div>
  );

  async function callFormStructure(jsonRaw) {
    try{
    if(JSON.parse(jsonRaw)){  
    const reqBody = {
      jsonPayload: jsonRaw
    }
    let res = await axios.post(`https://json-flow-api.vercel.app/formStructure`, {reqBody})
    let data  = await res.data;
    setNodes([])
    setEdges([])
    setInitNodes([])
    setInitEdges([])
    setInitNodes(Object.values(data.nodeMap))
    setInitEdges(Object.values(data.edgeMap))
  }
}
catch(error) {
  console.error("error in serialising json",error);
}
}
}

export default () => (
  <ReactFlowProvider>
    <App />
  </ReactFlowProvider>
);

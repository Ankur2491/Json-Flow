import { useCallback } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

const handleStyle = { background: '#fff' };

function CustomNode({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="text-updater-node">
      {/* <NodeResizer minWidth={100} minHeight={10} /> */}
      <Handle
        type="target"
        position={Position.Left}
        style={handleStyle}
        isConnectable={isConnectable}
      />
      <div>
      { typeof data.value== 'string' || typeof data.value =='number' || typeof data.value =='boolean' ? <p style={{color:'#6741d9'}}><small>{data.value}</small></p>
      :Object.keys(data.value).map(key=><p style={{color:'#6741d9'}}><small>{key}: <span style={{color:'#000000'}}> {String(data?.value[key])}</span></small></p>)}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={handleStyle}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default CustomNode;

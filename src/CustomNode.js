import { Handle, Position, NodeResizer } from '@xyflow/react';
import ObjectNode from './ObjectNode';

const handleStyle = { background: '#fff' };

function CustomNode({ data, isConnectable }) {
  return (
    <div className="text-updater-node">
      {/* <NodeResizer minWidth={100} minHeight={10} /> */}
      <Handle
        className="customHandle"
        type="target"
        position={Position.Left}
        style={handleStyle}
        isConnectable={isConnectable}
      />
      <div>
      { typeof data.value== 'string' || typeof data.value =='number' || typeof data.value =='boolean' ? <p key={data.value} style={{color:'#6741d9'}}><small>{data.value}</small></p>
      :<ObjectNode objectValues={data}></ObjectNode>}
      </div>
      <Handle
        className="customHandle"
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

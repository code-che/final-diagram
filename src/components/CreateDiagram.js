import React, {useState} from 'react';
import Diagram, {createSchema, useSchema} from 'beautiful-react-diagrams';
import 'beautiful-react-diagrams/styles.css';

const CustomRender = ({ id, content, data, inputs, outputs }) => (
    <div className="node">
        <div className="header-node">
            <span className="controller-name">ali</span>
            <button onClick={()=>data.onClick(id)} >X</button>
        </div>
        <div role="button" style={{padding: '15px'}}>
            {content}
        </div>
        <div style={{marginTop: '10px',display:'flex', justifyContent:'space-between'}}>
            {inputs.map((port) => React.cloneElement(port, {style: { width: '25px', height: '25px', background: '#1B263B' }}))}
            {outputs.map((port) => React.cloneElement(port, {style: { width: '25px', height: '25px', background: '#1B263B' }}))}
        </div>
    </div>
);

function CreateDiagram( props ) {

    let nodes = props.nodes;
    let nodesOfTree = [];
    let links = [];

    // const [schema, { onChange, addNode, removeNode }] = useSchema(initialSchema);

    const createNode = (node) => {
        let y = node.treeLevel * 200;
        let x = Math.floor(Math.random() * Math.floor(1000));
        return {
            id : node.id,
            content: node.title,
            coordinates: [x,y],
        }

        const nextNode = {
            id: node.id,
            content: node.title,
            coordinates: [
                Math.floor(Math.random() * Math.floor(1000)),
                node.treeLevel * 200,
            ],
            render: CustomRender,
            data: {onClick: deleteNodeFromSchema},
            inputs: [{ id: node.id}],
        };

        addNode(nextNode);
    }


    const createLink = (node) => {
        return {
            input: node.parentId,
            output: node.id
        }
    }

    const drawTree = (nodes) => {
        for ( let node of nodes) {
            nodesOfTree.push(createNode(node));
            if ( node.parentId !== '') {
                links.push(createLink(node))
            }
        }
    }

    drawTree(nodes)
    // console.log(nodesOfTree);
    // console.log(links);

    const [titleInputState, setTitleInputState] = useState("");
    const handlerTitleInput = (event) => {
        setTitleInputState(event.target.value);
    }

    // const logNodes = (event) => {
    //     console.log(schema.nodes);
    //     console.log(titleInputState);
    // }

    const deleteNodeFromSchema = (id) => {
        const nodeToRemove = schema.nodes.find(node => node.id === id);
        removeNode(nodeToRemove);
    };

    const addNewNode = () => {
        const nextNode = {
            id: `node-${schema.nodes.length+1}`,
            content: titleInputState,
            coordinates: [
                schema.nodes[schema.nodes.length - 1].coordinates[0] + 100,
                schema.nodes[schema.nodes.length - 1].coordinates[1],
            ],
            render: CustomRender,
            data: {onClick: deleteNodeFromSchema},
            inputs: [{ id: `port-${Math.random()}`}],
            outputs: [{ id: `port-${Math.random()}`}],
        };

        addNode(nextNode);
    }

    // console.log(Math.floor(Math.random() * Math.floor(1000)));

    // function searchNode(node, matchingIdNode){
    //     if(node.id === matchingIdNode){
    //         return node;
    //     }else if (node.children != null){
    //         var i;
    //         var result = null;
    //         for(i=0; result == null && i < node.children.length; i++){
    //             result = searchNode(node.children[i], matchingIdNode);
    //         }
    //         return result;
    //     }
    //     return null;
    // }

    // const initialSchema = createSchema({
    //     nodes: [
    //         { id: 'node-1', content: 'Node 1', coordinates: [250, 0], },
    //         { id: 'node-2', content: 'Node 2', coordinates: [100, 200], },
    //         { id: 'node-3', content: 'Node 3', coordinates: [250, 220], },
    //         { id: 'node-4', content: 'Node 4', coordinates: [400, 200], },
    //     ],
    //     links: [
    //         { input: 'node-1',  output: 'node-2' },
    //         { input: 'node-1',  output: 'node-3' },
    //         { input: 'node-1',  output: 'node-4' },
    //     ]
    // });

    const initialSchema = createSchema({
        nodes: [
            ...nodesOfTree
        ],
        links: [
            ...links
        ]
    });

    const [schema, { onChange, addNode, removeNode }] = useSchema(initialSchema);
    // console.log(schema);


    return (
        <div className="Simple-diagram">
            <div className="add-node">
                <button className="add-node-btn" onClick={addNewNode} >add node</button>
                <input className="title-input" onChange={handlerTitleInput} type="text" placeholder="title of node" />
            </div>
            <div className="tree-container">
                <Diagram schema={schema} onChange={onChange} />
            </div>
        </div>
    );
}

export default CreateDiagram;

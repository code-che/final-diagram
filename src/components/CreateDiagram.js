import React, {useState} from 'react';
import Diagram, {createSchema, useSchema} from 'beautiful-react-diagrams';
import 'beautiful-react-diagrams/styles.css';



const NewNodeRender = ({ id, content, data, inputs }) => (
    <div className="new-node" onMouseUp={(event)=>data.onMouseUp(event)}>
        <div className="header-node">
            <span className="controller-name">ali</span>
            <button onClick={()=>data.onClick(id)} >X</button>
        </div>
        <div role="button" style={{padding: '15px'}}>
            {content}
        </div>
        <div style={{marginTop: '10px',display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
            {inputs.map((port) => React.cloneElement(port, {style: { width: '100%', height: '1.5em', background: '#1B263B' }}))}
        </div>
    </div>
);

const NodeRender = ({ id, content, data, inputs }) => (
    <div className="node" onMouseUp={(event)=>data.onMouseUp(event, id)}>
        <div className="header-node">
            <span className="controller-name">ali</span>
        </div>
        <div role="button" style={{padding: '15px'}}>
            {content}
        </div>
        <div style={{marginTop: '10px',display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
            {inputs.map((port) => React.cloneElement(port, {style: { width: '100%', height: '1.5em', background: 'darkgray' }}))}
        </div>
    </div>
);

function CreateDiagram( props ) {

    let nodes = props.nodes;
    let nodesOfTree = [];
    let links = [];

    const updateCoordinates = ( event, id ) => {
        console.log("che khabar");
        console.log(event);
        console.log(id);
        let x = 0;
        let y = 0;
        for ( let node of schema.nodes ){
            if ( node.id === id ) {
                x = node.coordinates[0] - node.coordinates[0]%200;
                y = node.coordinates[1] - node.coordinates[1]%100;
            }
        }

        const axios = require('axios');
        axios.post(`https://project.dinavision.org/api/v1/Project/UpdateProjectLocation?projectId=${id}&xLocation=${x}&yLocation=${y}`)
            .then(response => {
                console.log(response.message)
            }).catch( error => {
                console.log(error)
            })
    }

    const [newNodeListState, setNewNodeList] = useState([]);
    // const [hasLink]
    const updateNodeData = ( event, id ) => {
        let x = 0;
        let y = 0;
        for ( let node of schema.nodes ){
            if ( node.id === id ) {
                x = node.coordinates[0] - node.coordinates[0]%200;
                y = node.coordinates[1] - node.coordinates[1]%100;
            }
        }
        let parentId = "";
        for ( let link of schema.links ){
            if ( id === link["input"] ){
                if (link["output"] < link["input"]) {
                    parentId = link["output"];
                }
            }
            if ( id === link["output"] ){
                if (link["input"] < link["output"]) {
                    parentId = link["input"];
                }
            }
        }
        let temp;
        let data;
        if (parentId !== ''){
            temp = nodes.filter(node => node.id === parentId );
            data = {
                id: id,
                parentId: parentId,
                route: temp[0].route + `/${parentId}`,
                xLocation: x,
                yLocation: y
            }

        }



        // setNewNodeList(prevState =>{
        //     for ( let node of prevState ){
        //         if ( node.id === id )
        //
        //     }
        //     return [...prevState, data]
        // })

        const axios = require('axios');
        axios.post(`https://project.dinavision.org/api/v1/Project/UpdateProjectLocation?projectId=${id}&xLocation=${x}&yLocation=${y}`)
            .then(response => {
                console.log(response.message)
            }).catch( error => {
            console.log(error)
        })
    }

    const createNode = (node) => {
        let y = 0;
        let x = 0;
        if (node.coordinates.length === 0 ) {
            y = node.treeLevel * 300;
            x = Math.floor(Math.random() * Math.floor(1000));
        }
        else {
            y = node.coordinates[1];
            x = node.coordinates[0];
        }
        return {
            id: node.id,
            content: node.title,
            coordinates: [x, y],
            render: NodeRender,
            data: {onMouseUp: updateCoordinates},
            inputs: [ { id: node.id } ],
        }
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


    const [idRenderState, setIdRender] = useState(999999);
    const addNewNode = () => {
        setIdRender(prevState => prevState + 1)
        let newNodeId = idRenderState.toString();
        setNewNodeList(prevState => [...prevState, newNodeId]);
        const nextNode = {
            id: newNodeId,
            content: titleInputState,
            coordinates: [
                schema.nodes[schema.nodes.length - 1].coordinates[0] + 100,
                schema.nodes[schema.nodes.length - 1].coordinates[1],
            ],
            render: updateNodeData,
            data: {
                onClick: deleteNodeFromSchema,
                onMouseUp: updateCoordinates
            },
            inputs: [{ id: newNodeId}]
        };

        addNode(nextNode);
    }

    const submit = (event) => {
        // let listOfNodes = []
        // for ( let newNode of newNodeListState) {
        //     let parentId = "";
        //     for ( let link of schema.links ){
        //         if ( newNode === link["input"] ){
        //             if (link["output"] < link["input"]) {
        //                 parentId = link["output"];
        //             }
        //         }
        //         if ( newNode === link["output"] ){
        //             if (link["input"] < link["output"]) {
        //                 parentId = link["input"];
        //             }
        //         }
        //     }
        //     let temp = nodes.filter(node => node.id === parentId );
        //     let data = {
        //         id: newNode,
        //         parentId: parentId,
        //         route: temp[0].route + `/${parentId}`,
        //     }
        // }
        // for ( let node of schema.nodes ) {
        //     let x = node.coordinates[0] - node.coordinates[0]%100;
        //     let y = node.coordinates[1] - node.coordinates[1]%200;
        //     let parentId = "";
        //     let inputId = node.inputs[0]["id"];
        //     // for ( let link of schema.links ){
        //     //     if ( inputId === link["input"]){
        //     //         if (link["output"] < link["input"]) {
        //     //             parentId = link["output"];
        //     //         }
        //     //     }
        //     //     if ( inputId === link["output"]){
        //     //         if (link["input"] < link["output"]) {
        //     //             parentId = link["input"];
        //     //         }
        //     //     }
        //     // }
        //     let temp = {
        //         title: node.content,
        //         id: node.id,
        //         treeLevel: y/200,
        //         coordinates: [x, y],
        //         parentId: parentId
        //     }
        //     listOfNodes.push(temp);
        // }
        console.log(newNodeListState);
    }

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
                <button className="add-node-btn" onClick={addNewNode} >اضافه کردن تسک</button>
                <input className="title-input" onChange={handlerTitleInput} type="text" placeholder="title of node" />
            </div>
            <div className="tree-container">
                <Diagram schema={schema} onChange={onChange} />
            </div>
            <div className="sbmit">
                <button className="submit-btn" onClick={submit} >ثبت</button>
            </div>
        </div>
    );
}

export default CreateDiagram;

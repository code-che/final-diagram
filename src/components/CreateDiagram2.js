import React, {useState, useEffect} from 'react';
import Diagram, {createSchema, useSchema} from 'beautiful-react-diagrams';
import 'beautiful-react-diagrams/styles.css';



const NewNodeRender = ({ id, content, data, inputs }) => (
    <div className="new-node" onMouseUp={(event)=>data.onMouseUp(event, id, content)}>
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
    <div className="node" onMouseUp={(event)=>data.onMouseUp( event, id)}>
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

function CreateDiagram( {nodes} ) {

    let nodesOfTree = [];
    let links = [];

    const updateCoordinates = ( event, id ) => {
        let tempX = event.clientX - document.getElementsByClassName("tree-container")[0].offsetLeft + event.view.scrollX;
        let tempY = event.clientY - document.getElementsByClassName("tree-container")[0].offsetTop + event.view.scrollY;
        let x = tempX - tempX%200;
        let y = tempY - tempY%100;

        const axios = require('axios');
        axios.post(`https://project.dinavision.org/api/v1/Project/UpdateProjectLocation?projectId=${id}&xLocation=${x}&yLocation=${y}`)
            .then(response => {
                console.log(response.message)
            }).catch( error => {
                console.log(error)
            })
    }

    const [newNodeListState, setNewNodeList] = useState([]);
    const updateNodeData = ( event, id, content ) => {
        let tempX = event.clientX - document.getElementsByClassName("tree-container")[0].offsetLeft;
        let tempY = event.clientY - document.getElementsByClassName("tree-container")[0].offsetTop;
        let x = tempX - tempX%200;
        let y = tempY - tempY%100;
        let data = {
            id,
            content,
            xLocation: x,
            yLocation: y
        }
        setNewNodeList(prevState =>{
            let tempList = prevState;
            let exist = false;
            for ( let index in tempList ){
                if ( tempList[index].id === id ){
                    tempList[index] = data;
                    exist = true;
                }
            }
            if ( !exist ) {
                tempList.push(data);
            }
            return tempList
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

    const [nodesOfTreeState, setNodesOfTree] = useState([]);
    const [linksState, setLinkState] = useState([]);
    useEffect(() => {
        for ( let node of nodes) {
            nodesOfTree.push(createNode(node));
            if ( node.parentId !== '') {
                links.push(createLink(node))
            }
        }
        setNodesOfTree(nodesOfTree);
        setLinkState(links);
    }, [nodes])
    // const drawTree = (nodes) => {
    //     for ( let node of nodes) {
    //         nodesOfTree.push(createNode(node));
    //         if ( node.parentId !== '') {
    //             links.push(createLink(node))
    //         }
    //     }
    //     setNodesOfTree(nodesOfTree);
    //     setLinkState(links)
    // }

    const [titleInputState, setTitleInputState] = useState("");
    const handlerTitleInput = (event) => {
        setTitleInputState(event.target.value);
    }

    const deleteNodeFromSchema = (id) => {
        const nodeToRemove = initialSchema.nodes.find(node => node.id === id);
        removeNode(nodeToRemove);
    };


    const [idRenderState, setIdRender] = useState(999999);
    const addNewNode = () => {
        setIdRender(prevState => prevState + 1);
        let newNodeId = idRenderState.toString();
        const nextNode = {
            id: newNodeId,
            content: titleInputState,
            coordinates: [
                Math.floor(Math.random() * Math.floor(1000)),
                Math.floor(Math.random() * Math.floor(300)),
            ],
            render: NewNodeRender,
            data: {
                onClick: deleteNodeFromSchema,
                onMouseUp: updateNodeData
            },
            inputs: [{ id: newNodeId}]
        };
        addNode(nextNode);
    }

    const submit = (event) => {
        for ( let newNode of newNodeListState) {
            let parentId = "";
            for ( let link of initialSchema.links ){
                if ( newNode.id === link["input"] ){
                    if (parseInt(link["output"]) < parseInt(link["input"])) {
                        parentId = link["output"];
                    }
                }
                if ( newNode.id === link["output"] ){
                    if (parseInt(link["input"]) < parseInt(link["output"])) {
                        parentId = link["input"];
                    }
                }
            }
            let data;
            if ( parentId !== ""){
                let temp = nodes.filter(node => node.id === parentId );
                data = {
                    userCreatedId: 1233,
                    route: temp[0].route + `/${parentId}`,
                    name: newNode.content.replace(" ", "_"),
                    title: newNode.content,
                    parentId: parentId,
                    treeLevel: temp[0].treeLevel + 1,
                    xLocation: newNode.xLocation,
                    yLocation: newNode.yLocation
                }
                console.log(initialSchema);
                console.log(data);
                // addRequest(data)
            }
        }

        // {
        //     "userCreatedId": 0,
        //     "route": "string",
        //     "name": "string",
        //     "title": "string",
        //     "parentId": 0,
        //     "treeLevel": 0,
        //     "xLocation": 0,
        //     "yLocation": 0
        // }

    }

    const addRequest = ( data ) => {
        const axios = require('axios');
        axios.post('https://project.dinavision.org/api/v1/Project', data).then(response => {
            console.log(response);
        }).catch( error => {
            console.log(error);
        })
    }

    const initialSchema = createSchema({
        nodes: [
            ...nodesOfTreeState
        ],
        links: [
            ...linksState
        ]
    });

    const [schema, { onChange, addNode, removeNode }] = useSchema(initialSchema);

    return (
        <div className="Simple-diagram">
            <div className="add-node">
                <button className="add-node-btn" onClick={addNewNode} >اضافه کردن تسک</button>
                <input className="title-input" onChange={handlerTitleInput} type="text" placeholder="title of node" />
            </div>
            <div className="tree-container" id="tree-container">
                <Diagram schema={initialSchema} onChange={onChange} />
            </div>
            <div className="sbmit">
                <button className="submit-btn" onClick={submit} >ثبت</button>
            </div>
        </div>
    );
}

export default CreateDiagram;

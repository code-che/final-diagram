import React, {useState , useEffect} from 'react';
import CreateDiagram from "./CreateDiagram";

function Diagram() {


    let node21 = {
        title: "node 21",
        id: "node21",
        treeLevel: 4,
        parentId : "node8"
    }
    let node2 = {
        title: "node 2",
        id: "node2",
        treeLevel: 2,
        parentId : "node1"
    }
    let node3 = {
        title: "node 3",
        id: "node3",
        treeLevel: 2,
        parentId : "node1"
    }
    let node4 = {
        title: "node 4",
        id: "node4",
        treeLevel: 2,
        parentId : "node1"
    }
    let node5 = {
        title: "node 5",
        id: "node5",
        treeLevel: 3,
        parentId : "node2"
    }
    let node6 = {
        title: "node 6",
        id: "node6",
        treeLevel: 3,
        parentId : "node2"
    }
    let node7 = {
        title: "node 7",
        id: "node7",
        treeLevel: 4,
        parentId : "node6"
    }
    let node8 = {
        title: "node 8",
        id: "node8",
        treeLevel: 3,
        parentId : "node3"
    }
    let node9 = {
        title: "node 9",
        id: "node9",
        treeLevel: 3,
        parentId : "node3"
    }

    let node1 = {
        title: "start",
        id: "node1",
        treeLevel: 1,
        parentId : ""
    }

    let listOfNodes = [];
    // listOfNodes = [node1, node2, node3, node4, node5, node6, node7, node8, node9, node21]

    const [dataState, setDataState] = useState([])

    const axios = require('axios');
    axios.get('https://project.dinavision.org/api/v1/Project/GenerateLevels?userId=1233').then(response => {
        setDataState(response.data.data.projects)
    }).catch( error => {
        console.log(error);
    })


    const click = (event) => {
        console.log(dataState);

        for ( let project of dataState ){
            // console.log(typeof project.id);
            listOfNodes.push({
                title: project.title,
                id: project.id.toString(),
                treeLevel: 3,
                parentId : project.parentId.toString()
            })
        }
        console.log(listOfNodes);
    }

    return (
        <>
            <button onClick={click}>click</button>
            <CreateDiagram nodes={listOfNodes}/>
        </>
    );
}

export default Diagram;

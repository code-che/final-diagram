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

    // listOfNodes = [node1, node2, node3, node4, node5, node6, node7, node8, node9, node21]

    const [dataState, setDataState] = useState({
        projects: [],
        routes: [],
        nodes: []
    });
    const [dataIsReady, setDataIsReady] = useState(false);
    const [listOfNodesState, setListOfNodesState] = useState([]);
    const [styleState, setStyleState] = useState({
        height: "1000px",
        width : "1500px",
    });

    useEffect(() => {
        const axios = require('axios');
        axios.get('https://project.dinavision.org/api/v1/Project/GenerateLevels?userId=1233').then(response => {
            setDataState({
                projects: response.data.data.projects,
                routes:response.data.data.projects.filter( item => item.parentId === 0),
                nodes: []
            })
        }).catch( error => {
            console.log(error);
        })
    }, [])


    let listOfNodes = [];
    const render = (event) => {
        console.log(dataState.projects);

        let maxWidth = 0, maxHeight = 0;
        let routeProject = dataState.routes[2];
        let coordinatesRoute = [];
        if (!(routeProject.xLocation === 0 && routeProject.yLocation === 0)) {
            coordinatesRoute = [routeProject.xLocation, routeProject.yLocation];
            if ( maxWidth < routeProject.xLocation)
                maxWidth = routeProject.xLocation;
            if ( maxHeight < routeProject.yLocation)
                maxHeight = routeProject.yLocation;
        }
        listOfNodes.push({
            title: routeProject.title,
            id: routeProject.id.toString(),
            treeLevel: routeProject.treeLevel,
            parentId: '',
            coordinates: coordinatesRoute
        })
        let routeId = routeProject.id.toString();

        for ( let project of dataState.projects ){
            // console.log(project.route);
            if ( project.route !== null) {
                let parentList = project.route.split("/");
                if ( parentList.indexOf(routeId) >= 0) {
                    let coordinates = [];
                    if (!(project.xLocation === 0 && project.yLocation === 0)) {
                        coordinates = [project.xLocation, project.yLocation];
                        if ( maxWidth < project.xLocation)
                            maxWidth = project.xLocation;
                        if ( maxHeight < project.yLocation)
                            maxHeight = project.yLocation;
                    }
                    listOfNodes.push({
                        title: project.title,
                        id: project.id.toString(),
                        treeLevel: project.treeLevel,
                        parentId: project.parentId.toString(),
                        coordinates: coordinates,
                        route: project.route
                    })
                }
            }
        }
        if ( 1000 < maxHeight * 2 ){
            setStyleState( prevState => ({
                ...prevState,
                height: (maxHeight * 2).toString() + "px",
            }))
        }
        if ( 1500 < maxWidth * 2 ){
            setStyleState( prevState => ({
                ...prevState,
                width: (Math.floor(maxWidth * 1.5)).toString() + "px",
            }))
        }
        setListOfNodesState(listOfNodes);
        setDataIsReady(true);
        console.log(listOfNodes);
        // console.log(listOfNodesState);
        // console.log(dataIsReady);
    }

    const creatDiagram = () => {
        if (dataIsReady){
            return (
                <div className="frame" style={styleState}>
                    <CreateDiagram nodes={listOfNodesState}/>
                </div>
            )
        }
        else
            return null;
    }

    return (
        <>
            <button onClick={render}>click</button>
            {/*<CreateDiagram nodes={listOfNodes}/>*/}
            {creatDiagram()}
        </>
    );
}

export default Diagram;

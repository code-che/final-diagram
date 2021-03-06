import React, {useState , useEffect} from 'react';
import CreateDiagram from "./CreateDiagram";
import CreateDiagram2 from "./CreateDiagram2";

const RootDiv = ( id, content, rootNode, onClick ) => {
    return (
        <div className="root" onClick={ () => onClick(id, rootNode)}>
            <span>{content}</span>
        </div>
    )
}

function Diagram() {


    // listOfNodes = [node1, node2, node3, node4, node5, node6, node7, node8, node9, node21]

    const [dataState, setDataState] = useState({
        projects: [],
        roots: [],
        nodes: []
    });
    const [dataIsReady, setDataIsReady] = useState(false);
    const [listOfNodesState, setListOfNodesState] = useState([]);
    const [styleState, setStyleState] = useState({
        height: "1000px",
        width : "100%",
    });

    useEffect(() => {
        const axios = require('axios');
        axios.get('https://project.dinavision.org/api/v1/Project/GenerateLevels?userId=1233').then(response => {
            setDataState({
                projects: response.data.data.projects,
                roots:response.data.data.projects.filter( item => item.parentId === 0),
                nodes: []
            })
            setDataIsReady(true);
        }).catch( error => {
            console.log(error);
        })
    }, [])

    // const render = (event) => {
    //     console.log(dataState.projects);
    //     if ( dataState.projects.length !== 0 ){
    //         let maxWidth = 0, maxHeight = 0;
    //         let rootProject = dataState.roots[2];
    //         let coordinatesRoot = [];
    //         if (!(rootProject.xLocation === 0 && rootProject.yLocation === 0)) {
    //             coordinatesRoot = [rootProject.xLocation, rootProject.yLocation];
    //             if ( maxWidth < rootProject.xLocation)
    //                 maxWidth = rootProject.xLocation;
    //             if ( maxHeight < rootProject.yLocation)
    //                 maxHeight = rootProject.yLocation;
    //         }
    //         listOfNodes.push({
    //             title: rootProject.title,
    //             id: rootProject.id.toString(),
    //             treeLevel: rootProject.treeLevel,
    //             parentId: '',
    //             coordinates: coordinatesRoot,
    //             route: rootProject.route
    //         })
    //         let rootId = rootProject.id.toString();
    //
    //         for ( let project of dataState.projects ){
    //             // console.log(project.root);
    //             if ( project.route !== null) {
    //                 let parentList = project.route.split("/");
    //                 if ( parentList.indexOf(rootId) >= 0) {
    //                     let coordinates = [];
    //                     if (!(project.xLocation === 0 && project.yLocation === 0)) {
    //                         coordinates = [project.xLocation, project.yLocation];
    //                         if ( maxWidth < project.xLocation)
    //                             maxWidth = project.xLocation;
    //                         if ( maxHeight < project.yLocation)
    //                             maxHeight = project.yLocation;
    //                     }
    //                     listOfNodes.push({
    //                         title: project.title,
    //                         id: project.id.toString(),
    //                         treeLevel: project.treeLevel,
    //                         parentId: project.parentId.toString(),
    //                         coordinates: coordinates,
    //                         route: project.route
    //                     })
    //                 }
    //             }
    //         }
    //         if ( 1000 < maxHeight * 2 ){
    //             setStyleState( prevState => ({
    //                 ...prevState,
    //                 height: (maxHeight * 2).toString() + "px",
    //             }))
    //         }
    //         if ( 1500 < maxWidth * 2 ){
    //             setStyleState( prevState => ({
    //                 ...prevState,
    //                 width: (Math.floor(maxWidth * 1.5)).toString() + "px",
    //             }))
    //         }
    //         setListOfNodesState(listOfNodes);
    //         setDataIsReady(true);
    //         console.log(listOfNodes);
    //         // console.log(listOfNodesState);
    //         // console.log(dataIsReady);
    //     }
    // }


    const clickOnRoot = (id, rootNode) => {
        let listOfNodes = [];
        if ( dataState.projects.length !== 0 ){
            let maxWidth = 0, maxHeight = 0;
            let coordinatesRoot = [];
            if (!(rootNode.xLocation === 0 && rootNode.yLocation === 0)) {
                coordinatesRoot = [rootNode.xLocation, rootNode.yLocation];
                if ( maxWidth < rootNode.xLocation)
                    maxWidth = rootNode.xLocation;
                if ( maxHeight < rootNode.yLocation)
                    maxHeight = rootNode.yLocation;
            }
            listOfNodes.push({
                title: rootNode.title,
                id: rootNode.id.toString(),
                treeLevel: rootNode.treeLevel,
                parentId: '',
                coordinates: coordinatesRoot,
                route: rootNode.route
            })
            let rootId = id.toString();

            for ( let project of dataState.projects ){
                // console.log(project.root);
                if ( project.route !== null) {
                    let parentList = project.route.split("/");
                    if ( parentList.indexOf(rootId) >= 0) {
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
            if ( 2000 < maxWidth * 2 ){
                setStyleState( prevState => ({
                    ...prevState,
                    width: (Math.floor(maxWidth * 1.5)).toString() + "px",
                }))
            }
            setListOfNodesState(listOfNodes);
            setDataIsReady(true);
            console.log(listOfNodesState);
            // console.log(listOfNodesState);
            // console.log(dataIsReady);
        }
    }

    const renderListOfRoot = () => {
        if (dataIsReady){
            return (
                <div className="list-of-root">
                    {dataState.roots.map( rootNode => RootDiv(rootNode.id, rootNode.title, rootNode, clickOnRoot))}
                </div>
            )
        }
        else
            return null;
    }

    const creatDiagram = () => {
        if (listOfNodesState.length !== 0){
            return (
                <CreateDiagram nodes={listOfNodesState}/>
            )
        }
        else
            return null;
    }

    return (
        <>
            {/*<button onClick={render}>click</button>*/}
            {/*<CreateDiagram nodes={listOfNodes}/>*/}
            <div className="frame" style={styleState}>
                {renderListOfRoot()}
                {listOfNodesState.length !== 0 && <CreateDiagram2 nodes={listOfNodesState}/>}
                {/*{creatDiagram()}*/}
            </div>
        </>
    );
}

export default Diagram;

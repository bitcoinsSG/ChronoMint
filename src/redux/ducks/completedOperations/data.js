import AppDAO from '../../../dao/AppDAO';
import {Map} from 'immutable';
import {createCompletedOperationInStore, updateCompletedOperationInStore} from './reducer';
import {store} from '../../configureStore';

const account = localStorage.getItem('chronoBankAccount');

const initialState = new Map([]);

const operationExists = (operation)=>{
    return !!store.getState().get('completedOperations').get(operation);
};

const handleCompletedOperation = operation => {
//update only 'needed' number
    const callback = (needed)=>{
        updateCompletedOperationInStore(operation, 'needed', needed);
        // if (needed.toNumber()){
        //     return;
        // }
        // updateCompletedOperation(operation);
    };

    AppDAO.pendingYetNeeded(operation, account).then( needed => callback(needed) );
};

// const updateCompletedOperation = (operation)=>{
//     const callback = (valueName, value) => {
//         updateCompletedOperationInStore(operation, valueName, value);
//     };
//
//     AppDAO.getTxsData(operation, account).then( data => callback('data', data) );
//     AppDAO.getTxsType(operation, account).then( type => callback('type', type) );
// };

const handleConfirmation = (e, r) => {
    if(!e){
        let operation = r.args.operation;
        if (!operationExists(operation)){
            createCompletedOperationInStore(operation);
        }
        handleCompletedOperation(operation);
    }
};

const handleGetConfirmations = (e, r) => {
    if(!e){
        for(let i=0; i< r.length; i++){
            let operation = r[i].args.operation;
            if (!operationExists(operation)){
                createCompletedOperationInStore(operation);
                handleCompletedOperation(operation);
            }
        }
    }
};

AppDAO.confirmationWatch(handleConfirmation);
AppDAO.confirmationGet(handleGetConfirmations, {fromBlock: 0, toBlock: 'latest'});

export default initialState;

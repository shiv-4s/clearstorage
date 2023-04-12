import { LightningElement, wire } from 'lwc';
import fetchAllObject from '@salesforce/apex/CallClearStorageBatch.fetchAllObject';
import fetchObjectRecords from '@salesforce/apex/CallClearStorageBatch.fetchObjectRecords';

export default class ClearStorage extends LightningElement {

    isShowModal = false;
    searchKey; 
    allObjects = [];
    error;
    objectId;


    handleClick(){
        this.isShowModal = true;
        console.log("++++++++");
    }

    closeModal(){
        this.isShowModal = false;
    }

    handleKeyChange(event){
        this.searchKey = event.target.value;
        console.log("+++++searchKey+++++ ", this.searchKey);
        fetchAllObject()
        .then(result=>{
            console.log("++++++++++result++++++++ ", result);
            this.allObjects = result;
            let filteredObject = this.allObjects.filter(record => {
                record.includes(this.searchKey)
            });
            console.log("+++++++filteredObject++++++++ ", filteredObject);
        })
        .catch(error=>{
            console.log("++++++++error++++++++ ", error);
        })
       
    }

    
    handleSelectedObject(event){
        this.objectId = event.target.dataset.id;
        console.log("++++++39 log+++++++ ", event.target);
        console.log("++++++++objectId++++++++++ ", this.objectId);
    }
       
    handleClearStorage(){
        this.isShowModal = false;
        fetchObjectRecords({objName : this.allObjects[0]})
        .then(result=>{
            console.log("+++++++++result++++ ", result);
        })
        .catch(error=>{
            console.log("+++++++++error+++++ ", error);
        })

    }
}
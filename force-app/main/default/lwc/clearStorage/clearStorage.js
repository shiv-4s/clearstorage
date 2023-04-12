import { LightningElement, track, wire } from 'lwc';
import fetchAllObject from '@salesforce/apex/CallClearStorageBatch.fetchAllObject';
import fetchObjectRecords from '@salesforce/apex/CallClearStorageBatch.fetchObjectRecords';

export default class ClearStorage extends LightningElement {

    isShowModal = false;
    @track searchKey; 
    error;
    objectId;
    selectedItems = [];
    selectedRecord = [];
    showRecord = 20;
    allRecord = [];

    handleClick(){
        this.isShowModal = true;
    }

    closeModal(){
        this.isShowModal = false;
    }

    @wire(fetchAllObject)
    wiredFetchObject({data, error}){
        if(data){
            console.log("+++++++data++++++++ ", data);
            this.allRecord = data;
            console.log("++++allrecord+++++ ", this.allRecord);
        }
        else if(error){
            console.log("+++++++++error+++++++++ ", error);
            this.error = error;
        }
    }

    handleKeyChange(event){
        this.searchKey = event.target.value;
        this.selectedItems=[];
        this.allRecord.forEach(element => {
        if(element.includes(this.searchKey)){
            this.selectedItems.push(element);
        }
        });
        this.selectedRecord = this.selectedItems.slice(0, this.showRecord);
        console.log("++++++++++selectedRecord+++++++++ ", this.selectedRecord);   
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
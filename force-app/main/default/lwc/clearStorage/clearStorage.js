import { LightningElement, track, wire } from 'lwc';
import fetchAllObject from '@salesforce/apex/CallClearStorageBatch.fetchAllObject';
import fetchObjectRecords from '@salesforce/apex/CallClearStorageBatch.fetchObjectRecords';

export default class ClearStorage extends LightningElement {

    isShowModal = false;
    @track searchKey; 
    error;
    objectValue;
    selectedItems = [];
    selectedRecord = [];
    showRecord = 20;
    allRecord = [];
    pillValues = [];

    handleClick(){
        this.isShowModal = true;
    }

    closeModal(){
        this.isShowModal = false;
        this.pillValues = [];
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
    }

    
    handleSelectedObject(event){
        this.objectValue = event.target.value
        this.pillValues.push(this.objectValue);
        console.log("++++++++objectId++++++++++ ", this.pillValues);
    }

    removePillItem(event) {
        const pillIndex = event.detail.index ? event.detail.index : event.detail.name;
        const itempill = this.pillValues; 
        itempill.splice(pillIndex, 1);       
        this.pillValues = [...itempill];
        console.log(pillIndex, this.pillValues);
    }
       
    handleClearStorage(){
        this.isShowModal = false;
        fetchObjectRecords({objName : this.pillValues})
        .then(result=>{
            console.log("+++++++++result++++ ", result);
        })
        .catch(error=>{
            console.log("+++++++++error+++++ ", error);
        })

    }
}
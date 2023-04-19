import { LightningElement, api, track, wire } from 'lwc';
import fetchAllObject from '@salesforce/apex/ClearStorageHandler.fetchAllObject';
import fetchObjectRecords from '@salesforce/apex/ClearStorageHandler.fetchObjectRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { subscribe, unsubscribe } from 'lightning/empApi';

export default class ClearStorage extends LightningElement {

    IsAsyncRecordShow = false;
    isShowModal = false;
    @track searchKey; 
    error;
    objectValue;
    selectedItems = [];
    selectedRecord = [];
    showRecord = 20;
    allRecord = [];
    pillValues = [];
    subscription = {};
    @api channelName = '/event/Batch_Event__e';

    connectedCallback() {
        this.handleSubscribe();
    }

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
        console.log("++++++++event++++++ ", event.target);
       if(!this.pillValues.includes(this.objectValue)){
        this.pillValues.push(this.objectValue);
       }
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
        this.IsAsyncRecordShow = true;
        fetchObjectRecords({objName : this.pillValues})
        .then(result=>{
            console.log("+++++result+++++ ", result);
            const evt = new ShowToastEvent({
                title: 'Started',
                message: 'Job Started Successfully',
                variant: 'Success',
                mode: 'dismissible'
            });
            this.dispatchEvent(evt);
            this.pillValues = [];
        })
        .catch(error=>{
            console.log("+++++++++error+++++ ", error);
        })
    }

    // Handles subscribe button click
    handleSubscribe() {
        // Callback invoked whenever a new event message is received
        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, this.messageCallback).then(response => {
            // Response contains the subscription information on subscribe call
            console.log('Subscription request sent to: ', JSON.stringify(response.channel));
            this.subscription = response;
            console.log("+++++++subs++++++++ ",JSON.stringify(this.subscription));
        });
    }

    messageCallback = function (response) {
        console.log('New message received 1: ', JSON.stringify(response));
        console.log('New message received 2: ', response);
        var obj = JSON.parse(JSON.stringify(response));
        console.log("+++obj+++", obj.data.payload);

    };
    
}
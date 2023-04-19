global with sharing class CallClearStorageBatch implements Database.Batchable<sObject>, Database.Stateful { 

    public List<String> objApiName;
    public String query;
    public Integer objectIndex = 0;
    public Id apexId;


    public CallClearStorageBatch(List<String> sobjectName, Integer previousIndex){
        objApiName = sobjectName;
        objectIndex = previousIndex;
    }

    global Database.QueryLocator start(Database.BatchableContext BC){
        
        try {
            query = 'SELECT Id FROM ' + objApiName[objectIndex] + ' ORDER BY CreatedDate DESC LIMIT 2';
            System.debug('++++query++++ ' + query);
        } 
        catch (Exception e) {
            System.debug('+++++exception+++++ ' + e);
        }
        return Database.getQueryLocator(query);
    }
  
    global void execute(Database.BatchableContext BC, List<sObject> scope){
        try {
            List<Database.DeleteResult> deleterecord =  Database.delete(scope);
            AsyncApexJob secondJob = [SELECT Id, 
                                        Status,
                                        JobItemsProcessed,
                                        TotalJobItems, 
                                        NumberOfErrors 
                                        FROM AsyncApexJob WHERE ID =: BC.getJobId()];
             //Creating PE instances
            List<Batch_Event__e> batchIdList = new List<Batch_Event__e>();
            Batch_Event__e batchEvent = new Batch_Event__e();
            batchEvent.ApexJobId__c = BC.getJobId();
            batchEvent.ApexApiName__c = objApiName[objectIndex];
            batchEvent.ApexStatus__c = secondJob.Status;
            batchIdList.add(batchEvent);
            System.debug('+++batchIdList++' + batchIdList);
                // Call method to publish events
            Database.SaveResult[] batchResultList = EventBus.publish(batchIdList); 
        } 
        catch (Exception e) {

        }
    }
  
    global void finish(Database.BatchableContext BC){
        if (objectIndex < objApiName.size()-1){
           // objectIndex = objectIndex + 1;
           // query = 'SELECT Id FROM ' + objApiName[objectIndex] + ' ORDER BY CreatedDate DESC LIMIT 2';
            System.debug('+++objApiName+++' + objApiName);
            CallClearStorageBatch clearObj = new CallClearStorageBatch(objApiName,++objectIndex);
            //System.debug('++objectIndex+++' + objectIndex);
            //System.debug('++++finishquery++++ ' + query);    
            apexId = Database.executeBatch(clearObj);
            
        }
      
        /* Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new String[] {email});
        mail.setReplyTo('sbarya254@gmail.com');
        mail.setSenderDisplayName('Batch Processing');
        mail.setSubject('Batch Process Completed');
        mail.setPlainTextBody('Batch Process has completed');
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });*/
    }


    
}
global with sharing class CallClearStorageBatch implements Database.Batchable<sObject>, Database.Stateful { 

    public  List<String> objApiName;
    public String query;
    public Integer objectIndex = 0;


    public CallClearStorageBatch(List<String> sobjectName, Integer previousIndex){
        objApiName = sobjectName;
        objectIndex = previousIndex;
        System.debug('+++++sobjectName list++++ ' + sobjectName);         
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
        } 
        catch (Exception e) {
        }
    }
  
    global void finish(Database.BatchableContext BC){
        if (objectIndex < objApiName.size()-1){
           // objectIndex = objectIndex + 1;
           // query = 'SELECT Id FROM ' + objApiName[objectIndex] + ' ORDER BY CreatedDate DESC LIMIT 2';
            CallClearStorageBatch clearObj = new CallClearStorageBatch(objApiName,++objectIndex);
            //System.debug('++objectIndex+++' + objectIndex);
            //System.debug('++++finishquery++++ ' + query);
            Database.executeBatch(clearObj);

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
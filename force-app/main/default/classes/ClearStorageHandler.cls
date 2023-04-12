global with sharing class ClearStorageHandler implements Database.Batchable<sObject>{ 

    public String objApiName;

    public ClearStorageHandler(String objectRecord){
        this.objApiName = objectRecord;
        System.debug('+++++objectRecord++++ ' + this.objApiName);
    }
 
    global Database.QueryLocator start(Database.BatchableContext BC){
        String query = 'SELECT Id FROM ' + this.objApiName + ' ORDER BY CreatedDate DESC LIMIT 10';
        System.debug('++++query++++ ' + query);
        return Database.getQueryLocator(query);
    }
  
    global void execute(Database.BatchableContext BC, List<sObject> scope){
        try {
            System.debug('+++++scope++++ '+  scope);
            List<Database.DeleteResult> deleterecord =  Database.delete(scope);
            System.debug('++++++++deleteresult+++ ' + deleterecord);

        } catch (Exception e) {
            System.debug('+++++exception+++' + e);
        }
    }
  
    global void finish(Database.BatchableContext BC){

    }
    

}
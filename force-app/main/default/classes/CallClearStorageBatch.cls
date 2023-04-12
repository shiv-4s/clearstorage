public with sharing class CallClearStorageBatch { 


    @AuraEnabled
    public static List<Object> fetchAllObject(){
        List<Schema.SObjectType> gd = Schema.getGlobalDescribe().Values();
        List<Object> objName = new List<String>();
        for(Schema.SObjectType f : gd){
            objName.add(f.getDescribe().getName());
        }
        return objName;
    }

    @AuraEnabled
    public static void fetchObjectRecords(String objName){
        Id jobId = Database.executeBatch(new ClearStorageHandler(objName));
        System.debug('++++batchId++++' + jobId);
    }
}
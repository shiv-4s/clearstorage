public with sharing class ClearStorageHandler{

    @AuraEnabled(cacheable=true)
    public static List<Object> fetchAllObject(){
        List<Schema.SObjectType> gd = Schema.getGlobalDescribe().Values();
        List<Object> objName = new List<String>();
        for(Schema.SObjectType f : gd){
            objName.add(f.getDescribe().getName()); 
        }
        return objName;
    }

    @AuraEnabled
    public static void fetchObjectRecords(List<String> objName){ // Account, Task , Case
        CallClearStorageBatch clearObj = new CallClearStorageBatch(objName, 0);
        ID firstBatchId = Database.executeBatch(clearObj);
    }
}
using { TEAM_LEAVE_PLANNER } from '../db/TRANSACTIONAL_TABLE';
using {  TEAM_LEAVE_PLANNER.MASTER_EMPLOYEE,
TEAM_LEAVE_PLANNER.MASTER_PROJECT,
TEAM_LEAVE_PLANNER.MASTER_LEAVE_TYPE,
TEAM_LEAVE_PLANNER.EMPLOYEE_PROJECT
 } from '../db/MASTER_TABLES';


service team_leave_planner {

    // @restrict :[{grant : ['CREATE','READ','UPDATE','DELETE'], to :'Admin'},
    //             {grant : ['CREATE','READ','DELETE'], to :['Requestor','Approver']}]
    
    entity LeaveRequest as projection on TEAM_LEAVE_PLANNER.LEAVE_REQUEST;

    // @readonly
    entity LeaveEventLog as projection on TEAM_LEAVE_PLANNER.LEAVE_EVENT_LOG; 
    // @requires : ['Admin','Approver'] //Approver can change the designation of an employee
   @odata.draft.enabled
   // @odata.draft.bypass
   entity MasterEmployee as projection on TEAM_LEAVE_PLANNER.MASTER_EMPLOYEE; 
    // @requires : ['Admin','Approver']
   @odata.draft.enabled
   entity employeeProject as projection on TEAM_LEAVE_PLANNER.EMPLOYEE_PROJECT;
//    @requires : 'Admin'
   @odata.draft.enabled
   entity MasterDesignation as projection on TEAM_LEAVE_PLANNER.MASTER_DESIGNATION;
//    @requires : 'Admin'
   @odata.draft.enabled
   entity MasterProject as projection on TEAM_LEAVE_PLANNER.MASTER_PROJECT; 
//    @requires : 'Admin'
   entity MasterLeaveType as projection on TEAM_LEAVE_PLANNER.MASTER_LEAVE_TYPE; 
   // @requires : 'Admin'
   entity MasterStatus as projection on TEAM_LEAVE_PLANNER.MASTER_STATUS; 
//    @requires :['Admin','Approver','Requestor']
    action TeamLeaveAction(sAction:String, aLeaveRequestInfo :many LeaveRequest, aLeaveEventLog : many LeaveEventLog ) returns String;
    // @requires : 'Admin'
    action InsertMasterData(sAction:String, aEmployeeMaster: many MasterEmployee,aEmployeeProject : many employeeProject)returns String;
    // @requires :['Admin','Approver','Requestor']
    function getEmployeeLeaveData(vEmployeeId:Integer,sRole:String ) returns many String;

}

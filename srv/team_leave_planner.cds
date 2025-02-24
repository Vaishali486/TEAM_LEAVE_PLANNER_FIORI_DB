using { TEAM_LEAVE_PLANNER } from '../db/TRANSACTIONAL_TABLE';
using {  TEAM_LEAVE_PLANNER.MASTER_EMPLOYEE,
TEAM_LEAVE_PLANNER.MASTER_PROJECT,
TEAM_LEAVE_PLANNER.MASTER_LEAVE_TYPE,
 } from '../db/MASTER_TABLES';


service team_leave_planner {

    @restrict :[{grant : ['CREATE','READ','UPDATE','DELETE'], to :'Admin'},
                {grant : ['CREATE','READ','DELETE'], to :['Requestor','Approver']}]
    // @restrict :[{grant : 'READ', to :'Admin'},
    //             {grant : 'READ', to :['Requestor','Approver']}]
    entity LeaveRequest as projection on TEAM_LEAVE_PLANNER.LEAVE_REQUEST;

    @readonly
    entity LeaveEventLog as projection on TEAM_LEAVE_PLANNER.LEAVE_EVENT_LOG; 
    @requires : ['Admin','Approver'] //Approver can change the designation of an employee
   entity MasterEmployee as projection on TEAM_LEAVE_PLANNER.MASTER_EMPLOYEE; 
   @requires : 'Admin'
   entity MasterDesignation as projection on TEAM_LEAVE_PLANNER.MASTER_DESIGNATION;
   @requires : 'Admin'
   entity MasterProject as projection on TEAM_LEAVE_PLANNER.MASTER_PROJECT; 
   @requires : 'Admin'
   entity MasterLeaveType as projection on TEAM_LEAVE_PLANNER.MASTER_LEAVE_TYPE; 
   
   @requires :['Admin','Approver','Requestor']
    action TeamLeaveAction(sAction:String, aLeaveRequestInfo :many LeaveRequest, aLeaveEventLog : many LeaveEventLog ) returns String;
    // action TeamLeaveApproval(sAction:String, aLeaveRequestInfo :many Leave_Request, aLeaveEventLog : many Leave_Event_Log ) returns String;
    @requires : 'Admin'
    action InsertMasterData(sAction:String, aEmployeeMaster: many MasterEmployee)returns String;
    @requires :['Admin','Approver','Requestor']
    function getEmployeeLeaveData(vEmployeeId:Integer,sRole:String ) returns many String;

}

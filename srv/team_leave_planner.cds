using { TEAM_LEAVE_PLANNER } from '../db/TRANSACTIONAL_TABLE';
using {  TEAM_LEAVE_PLANNER.MASTER_EMPLOYEE
,TEAM_LEAVE_PLANNER.MASTER_PROJECT
,TEAM_LEAVE_PLANNER.MASTER_LEAVE_TYPE } from '../db/MASTER_TABLES';


service team_leave_planner {
    entity LeaveRequest as projection on TEAM_LEAVE_PLANNER.LEAVE_REQUEST;
    entity LeaveEventLog as projection on TEAM_LEAVE_PLANNER.LEAVE_EVENT_LOG; 

   entity MasterEmployee as projection on TEAM_LEAVE_PLANNER.MASTER_EMPLOYEE; 
   entity MasterProject as projection on TEAM_LEAVE_PLANNER.MASTER_PROJECT; 
   entity MasterLeaveType as projection on TEAM_LEAVE_PLANNER.MASTER_LEAVE_TYPE; 
   
    action TeamLeaveAction(sAction:String, aLeaveRequestInfo :many LeaveRequest, aLeaveEventLog : many LeaveEventLog ) returns String;
    // action TeamLeaveApproval(sAction:String, aLeaveRequestInfo :many Leave_Request, aLeaveEventLog : many Leave_Event_Log ) returns String;
    action InsertMasterData(sAction:String, aEmployeeMaster: many MasterEmployee);

}

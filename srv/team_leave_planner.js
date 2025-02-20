const cds = require('@sap/cds')
const dbClass = require("sap-hdbext-promisfied")
const hdbext = require("@sap/hdbext")
const { response } = require('express')

module.exports = cds.service.impl(function () {
    const {Master_Employee,Leave_Request,Leave_Event_Log}=this.entities
    this.on('TeamLeaveAction',async(req) =>{
        try {
        var client = await dbClass.createConnectionFromEnv();
        var dbconn = new dbClass(client);
        let connection = await cds.connect.to('db');
        var sResponse = null;
        var Result = null;
            var { 
                sAction,       
                aLeaveRequestInfo,
                aLeaveEventLog
            } = req.data;
            var balanceLeave ,totalLeave, eventNo;

            

            if(sAction === 'CREATE'){
                eventNo = 1;
                var existingData = await SELECT.from`TEAM_LEAVE_PLANNER_MASTER_EMPLOYEE` .where`EMPLOYEE_ID=${aLeaveRequestInfo[0].EMPLOYEE_ID}`;


            
                var sp = await dbconn.loadProcedurePromisified(hdbext, null, 'LEAVE_ACTIONS');
                var output = await dbconn.callProcedurePromisified(sp, [sAction,eventNo, aLeaveRequestInfo,aLeaveEventLog ]);
                Result = output.outputScalar.OUT_SUCCESS;
                return Result;
            }
            else if(sAction === 'DELETE'){
                var eventData = await SELECT `MAX(EVENT_NO) AS EVENT` .from`TEAM_LEAVE_PLANNER_LEAVE_EVENT_LOG` .where`LEAVE_ID=${aLeaveRequestInfo[0].LEAVE_ID}`;
                eventNo = eventData[0].EVENT + 1;
                var leaveStatusData = await SELECT .from`TEAM_LEAVE_PLANNER_LEAVE_REQUEST` .where`LEAVE_ID=${aLeaveRequestInfo[0].LEAVE_ID} AND EMPLOYEE_ID=${aLeaveRequestInfo[0].EMPLOYEE_ID}`;
                var existingData = await SELECT.from`TEAM_LEAVE_PLANNER_MASTER_EMPLOYEE` .where`EMPLOYEE_ID=${aLeaveRequestInfo[0].EMPLOYEE_ID}`;
                
                    var sp = await dbconn.loadProcedurePromisified(hdbext, null, 'LEAVE_ACTIONS');
                    var output = await dbconn.callProcedurePromisified(sp, [sAction,eventNo, aLeaveRequestInfo,aLeaveEventLog ]);
                    Result = output.outputScalar.OUT_SUCCESS;
                    return Result;
                   
            }
            else if(sAction === 'APPROVE'){
                var eventData = await SELECT `MAX(EVENT_NO) AS EVENT` .from`TEAM_LEAVE_PLANNER_LEAVE_EVENT_LOG` .where`LEAVE_ID=${aLeaveRequestInfo[0].LEAVE_ID}`;
                eventNo = eventData[0].EVENT + 1;

                var leaveStatusData = await SELECT .from`TEAM_LEAVE_PLANNER_LEAVE_REQUEST` .where`LEAVE_ID=${aLeaveRequestInfo[0].LEAVE_ID} AND EMPLOYEE_ID=${aLeaveRequestInfo[0].EMPLOYEE_ID}`;
                if(leaveStatusData[0].LEAVE_STATUS == 3){
                    return "The leave is already approved";
                }
                var sp = await dbconn.loadProcedurePromisified(hdbext, null, 'LEAVE_ACTIONS');
                    var output = await dbconn.callProcedurePromisified(sp, [sAction,eventNo, aLeaveRequestInfo,aLeaveEventLog ]);
                    Result = output.outputScalar.OUT_SUCCESS;
                    return Result;
                
                
            }
            else if(sAction === 'REJECT'){
                var eventData = await SELECT `MAX(EVENT_NO) AS EVENT` .from`TEAM_LEAVE_PLANNER_LEAVE_EVENT_LOG` .where`LEAVE_ID=${aLeaveRequestInfo[0].LEAVE_ID}`;
                eventNo = eventData[0].EVENT + 1;

                var leaveStatusData = await SELECT .from`TEAM_LEAVE_PLANNER_LEAVE_REQUEST` .where`LEAVE_ID=${aLeaveRequestInfo[0].LEAVE_ID} AND EMPLOYEE_ID=${aLeaveRequestInfo[0].EMPLOYEE_ID}`;
                if(leaveStatusData[0].LEAVE_STATUS == 3 || leaveStatusData[0].LEAVE_STATUS == 2){
                    return "The leave is Approved";
                }
                if(leaveStatusData[0].LEAVE_STATUS == 5 || leaveStatusData[0].LEAVE_STATUS == 4){
                    return "The leave is already Rejected";
                }
                var sp = await dbconn.loadProcedurePromisified(hdbext, null, 'LEAVE_ACTIONS');
                    var output = await dbconn.callProcedurePromisified(sp, [sAction,eventNo, aLeaveRequestInfo,aLeaveEventLog ]);
                    Result = output.outputScalar.OUT_SUCCESS;
                    return Result;
            }
            

            
        } 
        catch (error) {
            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;

            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }


    }) ;
    this.on('InsertMasterData',async(req) =>{
        try {
        var client = await dbClass.createConnectionFromEnv();
        var dbconn = new dbClass(client);
        let connection = await cds.connect.to('db');
        var sResponse = null;
        var Result = null;
            var { 
                sAction,       
                aEmployeeMaster
                } = req.data;
            if(sAction === 'INSERT'){

                await INSERT.into('TEAM_LEAVE_PLANNER_MASTER_EMPLOYEE')
                .entries({ EMPLOYEE_ID: aEmployeeMaster[0].EMPLOYEE_ID,
                    EMPLOYEE_NAME: aEmployeeMaster[0].EMPLOYEE_NAME , 
                    DESIGNATION_CODE: aEmployeeMaster[0].DESIGNATION_CODE,
                    PROJECT_CODE: aEmployeeMaster[0].PROJECT_CODE, 
                    MOBILE_NO : aEmployeeMaster[0].MOBILE_NO,
                    EMAIL_ID: aEmployeeMaster[0].EMAIL_ID,
                    REPORTING_MANAGER_ID: aEmployeeMaster[0].REPORTING_MANAGER_ID , 
                    REPORTING_LEAD_ID: aEmployeeMaster[0].REPORTING_LEAD_ID,
                    GENERAL_LEAVE_BALANCE:aEmployeeMaster[0].GENERAL_LEAVE_BALANCE ,
                    CASUAL_LEAVE_BALANCE: aEmployeeMaster[0].CASUAL_LEAVE_BALANCE
                });

            }
            var Result = "success"
            return Result;

            
        } 
        catch (error) {
            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;

            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }


    })   

})
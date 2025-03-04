const cds = require('@sap/cds')
const dbClass = require("sap-hdbext-promisfied")
const hdbext = require("@sap/hdbext")
const { response } = require('express')

module.exports = cds.service.impl(function () {
    // const {Master_Employee,Leave_Request,Leave_Event_Log}=this.entities
    this.on('TeamLeaveAction',async(req) =>{
        try {
        var client = await dbClass.createConnectionFromEnv();
        var dbconn = new dbClass(client);
        // let connection = await cds.connect.to('db');
        // var sResponse = null;
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
            var { 
                sAction,       
                aEmployeeMaster,
                aEmployeeProject
                } = req.data;
            if(sAction === 'INSERT'){

                await INSERT.into('TEAM_LEAVE_PLANNER_MASTER_EMPLOYEE')
                .entries({ EMPLOYEE_ID: aEmployeeMaster[0].EMPLOYEE_ID,
                    EMPLOYEE_NAME: aEmployeeMaster[0].EMPLOYEE_NAME , 
                    DESIGNATION_CODE: aEmployeeMaster[0].DESIGNATION_CODE,
                    MOBILE_NO : aEmployeeMaster[0].MOBILE_NO,
                    EMAIL_ID: aEmployeeMaster[0].EMAIL_ID,
                    REPORTING_MANAGER_ID: aEmployeeMaster[0].REPORTING_MANAGER_ID , 
                    REPORTING_LEAD_ID: aEmployeeMaster[0].REPORTING_LEAD_ID,
                    GENERAL_LEAVE_BALANCE:aEmployeeMaster[0].GENERAL_LEAVE_BALANCE ,
                    CASUAL_LEAVE_BALANCE: aEmployeeMaster[0].CASUAL_LEAVE_BALANCE
                });
                await INSERT.into('TEAM_LEAVE_PLANNER_EMPLOYEE_PROJECT')
                .entries({ EMPLOYEE_ID: aEmployeeProject[0].EMPLOYEE_ID,
                    PROJECT_CODE: aEmployeeProject[0].PROJECT_CODE
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


    }) ;
    this.on('getEmployeeLeaveData',async(req)=>{
        var vEmployeeId = req.data.vEmployeeId;
        var sRole = req.data.sRole;
        var aApproverData,aApproverLeaveData, aEmployeeData, aEmployeeLeaveData, oData;
        // aDesignationData = await SELECT .from`TEAM_LEAVE_PLANNER_MASTER_DESIGNATION`;
        aApproverData = await SELECT .from`TEAM_LEAVE_PLANNER_MASTER_EMPLOYEE` .where`EMPLOYEE_ID=${vEmployeeId}`;
        var aApproversDesignation = await SELECT .from`TEAM_LEAVE_PLANNER_MASTER_DESIGNATION` .where`DESIGNATION_CODE=${aApproverData[0].DESIGNATION_CODE}`;
        var aApproversProjectIds= await SELECT .from`TEAM_LEAVE_PLANNER_EMPLOYEE_PROJECT` .where`EMPLOYEE_ID=${vEmployeeId}`;
        var aProjectId = aApproversProjectIds.map(function(item){return item.PROJECT_CODE});

        var aApproversProjectDiscription = await SELECT .from`TEAM_LEAVE_PLANNER_MASTER_PROJECT` .where`CODE IN ${aProjectId}`;
        var aApproversManagerId = aApproverData[0].REPORTING_MANAGER_ID;
        var aApproversLeadId = aApproverData[0].REPORTING_LEAD_ID;
        if(aApproversManagerId){
            var aApproverManagerData = await SELECT .from`TEAM_LEAVE_PLANNER_MASTER_EMPLOYEE` .where`EMPLOYEE_ID=${aApproverData[0].REPORTING_MANAGER_ID}`;
        }
        if(aApproversLeadId){
            var aApproverLeadData = await SELECT .from`TEAM_LEAVE_PLANNER_MASTER_EMPLOYEE` .where`EMPLOYEE_ID=${aApproverData[0].REPORTING_LEAD_ID}`;
        }

        aApproverLeaveData = await SELECT .from`TEAM_LEAVE_PLANNER_LEAVE_REQUEST` .where`EMPLOYEE_ID=${vEmployeeId}`;

        if(sRole ==="Approver"){
            aEmployeeData = await SELECT .from`TEAM_LEAVE_PLANNER_MASTER_EMPLOYEE` .where`REPORTING_LEAD_ID=${vEmployeeId}`;
        }
        else if(sRole === "Manager"){
            aEmployeeData = await SELECT .from`TEAM_LEAVE_PLANNER_MASTER_EMPLOYEE` .where`REPORTING_MANAGER_ID=${vEmployeeId}`;
        }
        // var aEmployeeProjectId = await SELECT;
        

        var aData = aEmployeeData.map(function(item){return item.EMPLOYEE_ID});
        aEmployeeLeaveData = await SELECT .from`TEAM_LEAVE_PLANNER_LEAVE_REQUEST` .where`EMPLOYEE_ID IN ${aData}`;

        oData = {
            // "startDate": "",
            "CASUAL_LEAVE_BALANCE": aApproverData[0].CASUAL_LEAVE_BALANCE,
            "DESIGNATION_CODE": aApproversDesignation[0].DESIGNATION_CODE, //change DESIGNATION to DESIGNATION_CODE
            "DESIGNATION": aApproversDesignation[0].DESIGNATION_NAME,
            "ROLE": aApproversDesignation[0].ROLE,
            "EMAIL_ID": aApproverData[0].EMAIL_ID,
            "EMPLOYEE_ID": aApproverData[0].EMPLOYEE_ID,
            "EMPLOYEE_NAME": aApproverData[0].EMPLOYEE_NAME,
            "GENERAL_LEAVE_BALANCE": aApproverData[0].GENERAL_LEAVE_BALANCE,
            "MOBILE_NO": aApproverData[0].MOBILE_NO,
            // "PROJECT_CODE": aApproverData[0].PROJECT_CODE, //change PROJECT to PROJECT_CODE
            "REPORTING_LEAD_ID": aApproverLeadData ?aApproverLeadData[0].EMPLOYEE_ID:null, // change REPORTING_LEAD to REPORTING_LEAD_ID
            "REPORTING_LEAD": aApproverLeadData ?aApproverLeadData[0].EMPLOYEE_NAME:null,
            "REPORTING_MANAGER_ID": aApproverManagerData ? aApproverManagerData[0].EMPLOYEE_ID:null, //change REPORTING_MANAGER to REPORTING_MANAGER_ID
            "REPORTING_MANAGER": aApproverManagerData ? aApproverManagerData[0].EMPLOYEE_NAME:null,
            "LeaveRequests": {
                "LeaveInfo" :[]
            },
            "Subordinates": { 
                "EmployeeDetails":[]    
            }
        };
        oData.ProjectDetails = aApproversProjectDiscription;
        for(let i=0;i<aApproverLeaveData.length;i++){
            var oApproverLeaveData = {
                    "EMPLOYEE_ID": aApproverLeaveData[i].EMPLOYEE_ID,
                    "END_DATE": aApproverLeaveData[i].END_DATE,
                    "IS_DELETED": aApproverLeaveData[i].IS_DELETED,
                    "LEAVE_ID": aApproverLeaveData[i].LEAVE_ID,
                    "LEAVE_NOTES": aApproverLeaveData[i].LEAVE_NOTES,
                    "LEAVE_STATUS": aApproverLeaveData[i].LEAVE_STATUS,
                    "LEAVE_TYPE": aApproverLeaveData[i].LEAVE_TYPE,
                    "NO_OF_LEAVES": aApproverLeaveData[i].NO_OF_LEAVES,
                    "START_DATE": aApproverLeaveData[i].START_DATE
            }
            oData.LeaveRequests.LeaveInfo.push(oApproverLeaveData);   
        }

        for(var j=0;j<aEmployeeData.length;j++){
            var aDesignationMaster = await SELECT .from`TEAM_LEAVE_PLANNER_MASTER_DESIGNATION` .where`DESIGNATION_CODE=${aEmployeeData[j].DESIGNATION_CODE}`;

            var aEmployeesProjectIds =  await SELECT .from`TEAM_LEAVE_PLANNER_EMPLOYEE_PROJECT` .where`EMPLOYEE_ID=${aEmployeeData[j].EMPLOYEE_ID}`;
            if(aEmployeesProjectIds.length){
            var aProjectIds = aEmployeesProjectIds.map(function(item){return item.PROJECT_CODE});
            var aEmployeeProjectDiscription = await SELECT .from`TEAM_LEAVE_PLANNER_MASTER_PROJECT` .where`CODE IN ${aProjectIds}`;
            }
           


            var oSubordinates ={
                "CASUAL_LEAVE_BALANCE": aEmployeeData[j].CASUAL_LEAVE_BALANCE,
                "DESIGNATION_CODE": aDesignationMaster[0].DESIGNATION_CODE, //change DESIGNATION to DESIGNATION_CODE
                "DESIGNATION": aDesignationMaster[0].DESIGNATION_NAME,
                "ROLE": aDesignationMaster[0].ROLE,
                "EMAIL_ID": aEmployeeData[j].EMAIL_ID,
                "EMPLOYEE_ID": aEmployeeData[j].EMPLOYEE_ID,
                "EMPLOYEE_NAME": aEmployeeData[j].EMPLOYEE_NAME,
                "GENERAL_LEAVE_BALANCE": aEmployeeData[j].GENERAL_LEAVE_BALANCE,
                "MOBILE_NO": aEmployeeData[j].MOBILE_NO,
                // "PROJECT_CODE": aEmployeeData[j].PROJECT_CODE, //change PROJECT to PROJECT_CODE
                "REPORTING_LEAD_ID": aEmployeeData[j].REPORTING_LEAD_ID , // change REPORTING_LEAD to REPORTING_LEAD_ID
                "REPORTING_MANAGER_ID": aEmployeeData[j].REPORTING_MANAGER_ID,
                "appointments":{
                    "LeaveInfo":[]
                }
                }
                oSubordinates.EmployeeProjectDetail = aEmployeeProjectDiscription;
            for(let k=0 ;k<aEmployeeLeaveData.length;k++){
                if(aEmployeeData[j].EMPLOYEE_ID == aEmployeeLeaveData[k].EMPLOYEE_ID){
                    var arrayEmployeeLeaveData = {
                        "EMPLOYEE_ID": aEmployeeLeaveData[k].EMPLOYEE_ID,
                        "END_DATE": aEmployeeLeaveData[k].END_DATE,
                        "IS_DELETED": aEmployeeLeaveData[k].IS_DELETED,
                        "LEAVE_ID": aEmployeeLeaveData[k].LEAVE_ID,
                        "LEAVE_NOTES": aEmployeeLeaveData[k].LEAVE_NOTES,
                        "LEAVE_STATUS": aEmployeeLeaveData[k].LEAVE_STATUS,
                        "LEAVE_TYPE": aEmployeeLeaveData[k].LEAVE_TYPE,
                        "NO_OF_LEAVES": aEmployeeLeaveData[k].NO_OF_LEAVES,
                        "START_DATE": aEmployeeLeaveData[k].START_DATE
                }
                oSubordinates.appointments.LeaveInfo.push(arrayEmployeeLeaveData);
                }
               
            }
            oData.Subordinates.EmployeeDetails.push(oSubordinates);

        }
        return oData;
    });



})
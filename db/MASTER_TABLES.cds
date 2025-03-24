using { TEAM_LEAVE_PLANNER.LEAVE_REQUEST, TEAM_LEAVE_PLANNER.EMPLOYEE_PROJECT } from './TRANSACTIONAL_TABLE';
using {cuid,managed} from '@sap/cds/common';
context TEAM_LEAVE_PLANNER  {
    entity MASTER_STATUS {
            key CODE :Integer;
                DESCRIPTION : String(30);
    }
     entity MASTER_PROJECT : cuid{
                CODE :Integer;
                DESCRIPTION : String(50);
                IS_BILLABLE : Boolean;
    }
     entity MASTER_LEAVE_TYPE {
            key CODE :String(15);
                DESCRIPTION : String(30);
    }
    entity MASTER_EVENT{
        key EVENT_CODE: String(5);
            EVENT_DESCRIPTION : String(30)

    }
    
    entity MASTER_EMPLOYEE :cuid {
                EMPLOYEE_ID :Integer;
                EMPLOYEE_NAME : String(100);
                DESIGNATION_CODE : Integer;
            // key PROJECT_CODE : Integer;
                MOBILE_NO : String(20);
                EMAIL_ID : String(50);
                REPORTING_MANAGER_ID:Integer;
                REPORTING_LEAD_ID:Integer;
                GENERAL_LEAVE_BALANCE:Decimal(16,1);
                CASUAL_LEAVE_BALANCE:Decimal(16,1);
                TO_MREPORTING_EMPLOYEE:Association to many MASTER_EMPLOYEE on
                                       TO_MREPORTING_EMPLOYEE.REPORTING_MANAGER_ID = EMPLOYEE_ID;
                // EMPLOYEE_MREPORTING:Association to many MASTER_EMPLOYEE on
                //                        EMPLOYEE_MREPORTING.REPORTING_MANAGER_ID = REPORTING_MANAGER_ID;  
                TO_LREPORTING_EMPLOYEE : Association to many MASTER_EMPLOYEE on
                                       TO_LREPORTING_EMPLOYEE.REPORTING_LEAD_ID = EMPLOYEE_ID;
                // EMPLOYEE_LREPORTING:Association to many MASTER_EMPLOYEE on
                //                        EMPLOYEE_LREPORTING.REPORTING_LEAD_ID = REPORTING_LEAD_ID;                     
                TO_LEAVE : Association to many  TEAM_LEAVE_PLANNER.LEAVE_REQUEST on
                                TO_LEAVE.EMPLOYEE_ID = EMPLOYEE_ID;
                TO_DESIGNATION_CODE : Association to many MASTER_DESIGNATION on
                                    TO_DESIGNATION_CODE.DESIGNATION_CODE = DESIGNATION_CODE;
    }

    entity EMPLOYEE_PROJECT :cuid{
        EMPLOYEE_ID :Integer;
        PROJECT_CODE : Integer;
        TO_PROJECT_CODE : Association to many MASTER_PROJECT on 
                        TO_PROJECT_CODE.CODE = PROJECT_CODE;
        TO_EMPLOYEE_ID : Association to one MASTER_EMPLOYEE on
                    TO_EMPLOYEE_ID.EMPLOYEE_ID = EMPLOYEE_ID;
    }
    // entity MASTER_EMPLOYEE_TEMP : cuid,managed {
    //             EMPLOYEE_ID :Integer;
    //             EMPLOYEE_NAME : String(100);
    //             DESIGNATION_CODE : Integer;
    //         // key PROJECT_CODE : Integer;
    //             MOBILE_NO : String(20);
    //             EMAIL_ID : String(50);
    //             REPORTING_MANAGER_ID:Integer;
    //             REPORTING_LEAD_ID:Integer;
    //             GENERAL_LEAVE_BALANCE:Decimal(16,1);
    //             CASUAL_LEAVE_BALANCE:Decimal(16,1);                     
    //             TO_LEAVE :  Association to many  TEAM_LEAVE_PLANNER.LEAVE_REQUEST on
    //                             TO_LEAVE.EMPLOYEE_ID = EMPLOYEE_ID;
    //             TO_DESIGNATION_CODE : Association to many MASTER_DESIGNATION on
    //                                 TO_DESIGNATION_CODE.DESIGNATION_CODE = DESIGNATION_CODE;
    // }
     entity MASTER_DESIGNATION:cuid {
            SEQUENCE_ID :Integer;
            DESIGNATION_CODE: Integer ;
            DESIGNATION_NAME: String(50) ;
            ROLE: String(50);
    }
    
}
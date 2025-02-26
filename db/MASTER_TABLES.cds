using { TEAM_LEAVE_PLANNER.LEAVE_REQUEST } from './TRANSACTIONAL_TABLE';

context TEAM_LEAVE_PLANNER {
    entity MASTER_STATUS {
            key CODE :Integer;
                DESCRIPTION : String(30);
    }
     entity MASTER_PROJECT {
            key CODE :Integer;
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
    entity MASTER_EMPLOYEE {
            key EMPLOYEE_ID :Integer;
                EMPLOYEE_NAME : String(100);
                DESIGNATION_CODE : Integer;
            // key PROJECT_CODE : Integer;
                MOBILE_NO : String(20);
                EMAIL_ID : String(50);
                REPORTING_MANAGER_ID:Integer;
                REPORTING_LEAD_ID:Integer;
                GENERAL_LEAVE_BALANCE:Decimal;
                CASUAL_LEAVE_BALANCE:Decimal;
                TO_MREPORTING_EMPLOYEE:Association to many MASTER_EMPLOYEE on
                                       TO_MREPORTING_EMPLOYEE.REPORTING_MANAGER_ID = EMPLOYEE_ID; 
                TO_LREPORTING_EMPLOYEE : Association to many MASTER_EMPLOYEE on
                                       TO_LREPORTING_EMPLOYEE.REPORTING_LEAD_ID = EMPLOYEE_ID;
                                        
                TO_LEAVE : Association to many  TEAM_LEAVE_PLANNER.LEAVE_REQUEST on
                                TO_LEAVE.EMPLOYEE_ID = EMPLOYEE_ID;

                TO_DESIGNATION_CODE : Association to many MASTER_DESIGNATION on
                                    TO_DESIGNATION_CODE.DESIGNATION_CODE = DESIGNATION_CODE;
    }
     entity MASTER_DESIGNATION {
            key SEQUENCE_ID :Integer;
            key DESIGNATION_CODE: Integer ;
            key DESIGNATION_NAME: String(50) ;
            key ROLE: String(50);
    }
    
}
context TEAM_LEAVE_PLANNER {
    entity MASTER_STATUS {
            key CODE :Integer;
                DESCRIPTION : String(30);
    }
     entity MASTER_PROJECT {
            key CODE :Integer;
                DESCRIPTION : String(50);
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
                DESIGNATION : String(30);
                PROJECT_CODE : Integer;
                REPORTING_MANAGER_ID:Integer;
                REPORTING_LEAD_ID:Integer;
                GENERAL_LEAVE_BALANCE:Integer;
                CASUAL_LEAVE_BALANCE:Integer;
                TO_PROJECT_CODE : Association to many MASTER_PROJECT on
                                    TO_PROJECT_CODE.CODE = PROJECT_CODE;
    }
}
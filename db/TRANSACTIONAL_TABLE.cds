namespace TEAM_LEAVE_PLANNER;
using { TEAM_LEAVE_PLANNER as TLP} from './MASTER_TABLES';


entity LEAVE_REQUEST {
    key LEAVE_ID: Integer64; //sequence 1000001	
    EMPLOYEE_ID: Integer;	
    LEAVE_TYPE: String(15);	
    NO_OF_LEAVES: Decimal(16,1);	
    START_DATE: Timestamp	;
    END_DATE: Timestamp	;
    LEAVE_STATUS: Integer;	
    LEAVE_NOTES: String(50);
    IS_DELETED	: String(2);
    // TO_EMPLOYEE : Association to one TLP.MASTER_EMPLOYEE on 
    //                 TO_EMPLOYEE.EMPLOYEE_ID = EMPLOYEE_ID;
    TO_LEAVE_TYPE : Association to one TLP.MASTER_LEAVE_TYPE on 
                    TO_LEAVE_TYPE.CODE = LEAVE_TYPE;
    TO_LEAVE_STATUS : Association to one TLP.MASTER_STATUS on
                    TO_LEAVE_STATUS.CODE = LEAVE_STATUS;
    
}
entity EMPLOYEE_PROJECT{
    key EMPLOYEE_ID :Integer;
    key PROJECT_CODE : Integer;
    TO_PROJECT_CODE : Association to many TLP.MASTER_PROJECT on 
                    TO_PROJECT_CODE.CODE = PROJECT_CODE;
    TO_EMPLOYEE_ID : Association to one TLP.MASTER_EMPLOYEE on
                    TO_EMPLOYEE_ID.EMPLOYEE_ID = EMPLOYEE_ID;


}

entity LEAVE_EVENT_LOG{
        key LEAVE_ID : Integer64;//hardcode
        key EVENT_NO   : Integer;//sequence
            EVENT_CODE : String(5);
            USER_ID    : String(50);
            USER_NAME  : String(100);
            REMARK     : String(100);//hardcode
            COMMENT    : String(50);
            CREATED_ON : Timestamp;
   
}




namespace TEAM_LEAVE_PLANNER;
using { TEAM_LEAVE_PLANNER as TLP} from './MASTER_TABLES';


entity LEAVE_REQUEST {
    key LEAVE_ID: Integer64; //sequence 1000001	
    EMPLOYEE_ID: Integer;	
    LEAVE_TYPE: String(15);	
    NO_OF_LEAVES: Decimal;	
    START_DATE: Timestamp	;
    END_DATE: Timestamp	;
    LEAVE_STATUS: Integer;	
    LEAVE_NOTES: String(50);
    IS_DELETED	: String(2);
    TO_LEAVE_TYPE : Association to one TLP.MASTER_LEAVE_TYPE on 
                    TO_LEAVE_TYPE.CODE = LEAVE_TYPE;
    TO_LEAVE_STATUS : Association to one TLP.MASTER_STATUS on
                    TO_LEAVE_STATUS.CODE = LEAVE_STATUS;
    
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

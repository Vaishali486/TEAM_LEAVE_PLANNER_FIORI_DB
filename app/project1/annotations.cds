using team_leave_planner as service from '../../srv/team_leave_planner';
annotate service.MasterDesignation with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'SEQUENCE_ID',
                Value : SEQUENCE_ID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'DESIGNATION_CODE',
                Value : DESIGNATION_CODE,
            },
            {
                $Type : 'UI.DataField',
                Label : 'DESIGNATION_NAME',
                Value : DESIGNATION_NAME,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ROLE',
                Value : ROLE,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'SEQUENCE_ID',
            Value : SEQUENCE_ID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'DESIGNATION_CODE',
            Value : DESIGNATION_CODE,
        },
        {
            $Type : 'UI.DataField',
            Label : 'DESIGNATION_NAME',
            Value : DESIGNATION_NAME,
        },
        {
            $Type : 'UI.DataField',
            Label : 'ROLE',
            Value : ROLE,
        },
    ],
);


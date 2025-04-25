sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'project1/test/integration/FirstJourney',
		'project1/test/integration/pages/MasterDesignationList',
		'project1/test/integration/pages/MasterDesignationObjectPage'
    ],
    function(JourneyRunner, opaJourney, MasterDesignationList, MasterDesignationObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('project1') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheMasterDesignationList: MasterDesignationList,
					onTheMasterDesignationObjectPage: MasterDesignationObjectPage
                }
            },
            opaJourney.run
        );
    }
);
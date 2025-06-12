# Automated-Integration-of-Test-Automation-with-Test-Management-Tools
Automated Integration of Test Automation with Test Management Tools[qTest]
**Title: Automated Integration of Test Automation with Test Management Tools**
**Problem Statement**
The QA team was spending significant manual effort updating test results and evidence in the test management tool after each automation run. Despite having automated test scripts, all corresponding test scenarios and their evidence had to be manually entered into the tool (qTest) to reflect accurate status for every sprint. This process was essential for tracking test coverage and ensuring proper release sign-off.
However, during large releases, this manual task became increasingly time-consuming and error-prone. On average, each QA team member was spending 3–4 hours per sprint manually updating test case statuses, attaching execution evidence, and organizing execution folders in qTest. This inefficiency created a bottleneck in the release cycle and reduced the overall value of automation.
**Solution**
To address this challenge and streamline the QA workflow, I implemented an automated integration between the automation framework and qTest, leveraging qTest's REST API.
**Key steps in the solution:**
•	API Integration: Used qTest APIs to programmatically interact with the test management system.
•	Automated Execution Folder Creation: Automatically created sprint-specific test execution folders based on sprint metadata.
•	Test Case Mapping: Mapped automated test cases to corresponding qTest test cases using unique identifiers.
•	Automated Result Upload: After each test run, the automation framework updates execution status (Pass/Fail) in qTest.
•	Evidence Attachment: Captured test evidence (screenshots, logs) is automatically uploaded and attached to each executed test case in qTest.
**Impact**
•	Saved 3–4 hours per QA engineer per sprint by eliminating manual test case updates.
•	Improved accuracy and consistency in test result reporting and traceability.
•	Enhanced release readiness by ensuring real-time synchronization of test results with qTest and Jira.
•	Maximized the ROI of automation by extending its impact beyond execution to reporting and compliance.
**Tool Detail :** qTest, the test management tool by Tricentis, integrates seamlessly with Jira to support end-to-end test lifecycle management. Requirements defined in Jira are automatically synchronized with qTest, allowing teams to create, manage, and execute test cases aligned with sprint goals. Test evidence can be added for traceability, and test execution results are reflected back in Jira, ensuring real-time visibility and alignment between QA and development teams.

**Technical Implementation Detail:**
qTest planned approach:  **qTest url: qTest - Login (qtestnet.com)**
Part1: API authentication manually using Postman
Part2: Baseline automated qTest integration within webdriver.io framework
•	Integrate qTest APIs (for fetching and updating the Test Execution result) with WebDriver IO
•	Integrate the Code for reading the execution results from allure reports
Part3: Review with the Wawa team (Sheela) and socialize with the RPOS team
Part4: Review/Modify to integrate with RPOS test results
Prerequisite: The name of the qTest test case name and the automation test case name must be the same.

Part1: API authentication manually using Postman
Step1: Gather GET and POST API url’s from qTest
GET URL : https://wawa.qtestnet.com/api/v3/projects/107214/test-runs?parentId=10658816&parentType=test-suite
POST URL : https://wawa.qtestnet.com/api/v3/projects/107214/test-runs?parentId=10658816&parentType=test-suite
Values to update the test case via POST method:
"name": "Automation",
  "properties": [
    {
      "field_id": 11018831,
      "field_name": "Status",
      "field_value": "601",
      "field_value_name": "Passed"
    },
    {
      "field_id": 13298266,
      "field_name": "Automation Execution Status",
      "field_value": "1",
      "field_value_name": "PASSED"
    }
  ],
  "test_case": {
    "id": 121255076
  }
});


To retrieve the API URLs:
1.	Login to Qtest application and Click on Resource button (↓) and click on API specific document. It will take the user to “Tricentis API documentation” page.
 

2.	Click on Test Run APIs section under APIs.  

3.	Then user can be able to retrieve the URL for GET/POST method.
 

API issue: GET failure:
1.	401 Unauthorized error thrown: To GET the details of the test case using “Basic Auth” type, by sending qTest username and password. 
	 

Solution to fix GET failure: Identify ‘Bearer token’ from our Qtest application and pass it in GET – Authorization
Steps to get bearer token:
1.	Login to Qtest application and Click on Resource button (↓) and copy the Bearer token. Note: Bearer token is different for each user
 
2.	Go to Postman, choose Bearer token in authorization. Enter the token copied from the Qtest.
Choose GET method and paste the URL and Hit send button to get the Response.
 


Part2: Baseline automated qTest integration within webdriver.io framework
•	Integrate qTest APIs (for fetching and updating the Test Execution result) with WebDriver IO
•	Integrate the Code for reading the execution results from allure reports

Step1: Creation of libraries for GET/POST/PUT
Step2: Integrate the code to read the execution results from allure reports.

We have 3 implementation files and one properties file in qTest folder:
•	compareSuitesToQtest
•	ExportQtestTCDetails
•	FetchExecutionStatus
•	Property.json (API URLs and bearer token will be passed from this file).
 
	
In compareSuitesToQtest file, we have 3 methods.
•	getQtestDetails method
•	updateQtestStatus method
•	updateQtestComment method

getQtestDetails method:
The getQtestDetails method fetches the test run ID, test case name, PID, field ID, field name, field value, and field value name from qTest. This script will fetch all the test case details from qTest and write them to the “qTestTestRunDetails.json” file.
qTest:

 
 

updateQtestComment method:
	The POST method is used to update the comment in a test case. This method checks how many test cases have failed, and then update the comment in qTest accordingly.
 For example, if test case 001 has failed, the comment will be updated to "Testcase001 is failed" in qTest.
 

updateQtestStatus method:
	The PUT method is used to update the Automation status in qTest. If the status is "Pass", the field value 1 will be sent to the input, and the Automation status will be updated to "Passed". If the status is "Broken," the field value two (2) will be sent to the input, and the Automation status will be updated to "Failed." 




FetchExecutionStatus:
	Once the automation test scripts are executed, the suites.json file will be generated in the Allure report folder. The suites.json file contains the test case name, sub-test case name, and its execution status. The execution status can be either "Broken" or "PASS".
In  FetchExecutionStatus, the get_status method fetches the automation TC_name, Sub_TC_name, Sub_TC_status from the suites.json file and writes them to the “AutomationOutput.json” file.
 

compareSuitesToQtest:

	In compareSuitesToQtest, the get_TcDetails method, it will compare the two JSON files qTestTestRunDetails.json and AutomationOutput.json. It will check if the test case from qTestTestRunDetails.json is the same as the sub-test case name from AutomationOutput.json. If they are the same, then it will check the Sub_TC_status is "PASS” or “Broken”. If any of the test cases from the data set fail, then that test case status will be updated as failed. If all the test cases are passed, then the test case status will be updated as Passed in qTest.
	For example:
	{"name": "WawaTestcase01","Sub_TC_name": "Validate build instruction from OMP portal",   "Sub_TC_status": "Broken"},
 {"name": "WawaTestcase02","Sub_TC_name": "Validate build instruction from OMP portal", "Sub_TC_status": "PASS"},
{ "name": "WawaTestcase03", "Sub_TC_name": "Validate build instruction from OMP portal", “Sub_TC_status": "Broken"},

	In the JSON data shows that only one sub-test case, "Validate build instruction from OMP portal", is passed in the data set. Therefore, the test case should be updated as "Failed" in qTest.

	Once the comparison with qTestTestRunDetails.json and AutomationOutput.json files are done, then the results are written in another JSON file, which is the OverallOutput.json file.

 

qTest Status after update

 

 

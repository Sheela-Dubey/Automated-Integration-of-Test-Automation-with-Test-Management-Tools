import data from "C:/Wawa/e2e-test-automation/allure-report/data/suites.json" assert { type: "json" };
import fs from "fs";

export const get_status = async () => {
    console.log("Entered get_status")

    let getChildren = data.children;
    let json_arr =[];
    console.log("getChildren.length" + getChildren.length);
    for(let i=0; i<getChildren.length; i++) {
        let parentTCName = getChildren[i].name;
        let getCofChildren = getChildren[i].children;
        console.log("parenttcname,child" + getChildren[i].name,getChildren[i].children);

        for(let j=0; j<1; j++) {
            let json_struct = {};
            let subTCName = getCofChildren[j].name
            let subTCStatus = getCofChildren[j].status;
            console.log("subtcname,status" + getCofChildren[j].name,getCofChildren[j].status);

            json_struct["name"] = parentTCName;
            json_struct["Sub_TC_name"] = subTCName;
            json_struct["Sub_TC_status"] = subTCStatus;
            json_arr.push(json_struct);      
        }
    }
    var json_string = JSON.stringify(json_arr);
    console.log("autooutput"+json_string)
    fs.writeFileSync("./AutomationOutput.json",json_string);
    return json_arr;
}
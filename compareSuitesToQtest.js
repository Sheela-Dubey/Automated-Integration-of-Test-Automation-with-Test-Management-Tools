import fs from "fs"

export const compareData = async (json1, json2) => {
    console.log("Entered compareData")
    const foundItems = [];
    for (const item1 of json1) {
        let finalStatus = "PASS";
        let datasetName = [];
        for (const item2 of json2) {
            if (item1.name === item2.Sub_TC_name) {
                if (item2.Sub_TC_status != 'PASS') {
                    finalStatus = "Broken";
                    datasetName.push(item2.name);
                }
            }
        }
        foundItems.push(
            {
                id: item1.id,
                name: item1.name,
                pid: item1.pid,
                field_id: item1.field_id,
                field_name: item1.field_name,
                field_value: item1.field_value,
                field_value_name: item1.field_value_name,
                datasetName,
                finalStatus,
            }
        );
    }
    var json_string = JSON.stringify(foundItems);
    fs.writeFileSync("./OverAllOutput.json", json_string);
    return foundItems;
}
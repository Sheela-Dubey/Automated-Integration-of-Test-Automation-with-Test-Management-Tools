import data from "./Properties.json" assert {type: "json"};
import fs from "fs";
import { timeStamp } from "console";
import { compareValuesAndSkip } from "../assertions";

const get_url = data.GET_URL;
const put_url = data.PUT_URL;
const post_url = data.POST_URL;
const ApiToken = data.token;
const CTvalue = data["Content-Type"];

export const getQtestDetails = async () => {
  console.log("Entered getQtestDetails");
  console.log(get_url,put_url,post_url,ApiToken);

  var myHeaders = new Headers();
  myHeaders.append("Authorization", ApiToken);
  console.log(myHeaders);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  console.log(requestOptions);
  let response = await fetch(get_url, requestOptions);
  let data = await response.json();
  console.log(data);

  let json_arr = [];
  let count = data.total;
  for (let i = 0; i < count; i++) {
    let newObj = {};
    let len = data.items[i].properties.length;
    newObj["id"] = data.items[i].id;
    newObj["name"] = data.items[i].name;
    newObj["pid"] = data.items[i].pid;
    newObj["field_id"] = data.items[i].properties[len - 1].field_id;
    newObj["field_name"] = data.items[i].properties[len - 1].field_name;
    newObj["field_value"] = data.items[i].properties[len - 1].field_value;
    newObj["field_value_name"] = data.items[i].properties[len - 1].field_value_name;
    json_arr.push(newObj);
    console.log(json_arr);
  }
  var json_string = JSON.stringify(json_arr);
  console.log(json_string)
  fs.writeFileSync("./qTestTestRunDetails.json", json_string);
  return json_arr;
}

export const updateQtestStatus = async (json, i) => {
  let url_put = put_url;
  const myHeaders = new Headers();

  // Check the status of the field and set the field value accordingly
  if (json.finalStatus === "Broken") {
    json.field_value = 2;
  } else if (json.finalStatus === "PASS") {
    json.field_value = 1;
  }
  const temp1 = {
    field_id: json.field_id,
    field_name: json.field_name,
    field_value: json.field_value,
  };
  myHeaders.append("Content-Type", CTvalue);
  myHeaders.append("Authorization", ApiToken);
  // Create the JSON payload
  const raw = JSON.stringify({
    properties: [
      temp1
    ],
  });

  // Create the request options
  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  // Set the URL of the PUT request
  url_put = url_put + json.id;
  const response = await fetch(url_put, requestOptions);
  const data = await response.json();
  const json_string = JSON.stringify(data);
  // Write the JSON string to a file
  console.log(json_string)

  fs.writeFileSync("./updateStatusOutput" + i + ".json", json_string);
};


export const updateQtestComment = async (args) => {
  let url_post = post_url;
  const myHeaders = new Headers();

  // Set the Content-Type and Authorization headers
  myHeaders.append("Content-Type", CTvalue);
  myHeaders.append("Authorization", ApiToken);
  // if (args.finalStatus != "PASS") {
  //   let TCstatus = args.datasetName + " is failed";
  if (args.finalStatus != "PASS") {
    if (args.datasetName.length > 1) {
      TCstatus = args.datasetName + " are failed.";
    }
    else {
      TCstatus = args.datasetName + " is failed.";
    }
    // Create the JSON payload
    const raw = JSON.stringify({
      "id": args.id,
      "content": TCstatus
    });
    // Create the request options
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    // Set the URL of the POST request
    url_post = url_post + args.id + "/comments";
    const response = await fetch(url_post, requestOptions);
    console.log(response)

  }
}


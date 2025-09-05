import { getQtestDetails } from "../../utils/qTest/ExportQtestTCDetails";
import { updateQtestComment } from "../../utils/qTest/ExportQtestTCDetails";
import { updateQtestStatus } from "../../utils/qTest/ExportQtestTCDetails";
import {get_status} from "../../utils/qTest/FetchExecutionStatus";
import {compareData} from "../../utils/qTest/compareSuitesToQtest";


export const qTestIntegration = async () => {
     console.log("qTestIntegration entered")
     const result1 = await getQtestDetails();
     const result2 = await get_status();
     const result3 = await compareData(result1, result2);
     for(let i=0; i<result3.length; i++) {
      await updateQtestStatus(result3[i], i);
      await updateQtestComment(result3[i]);
  }
};

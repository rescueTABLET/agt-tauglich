import { setGlobalOptions } from "firebase-functions";

setGlobalOptions({ region: "europe-west1" });

export * from "./scheduleReminders";
export * from "./triggerReminders";

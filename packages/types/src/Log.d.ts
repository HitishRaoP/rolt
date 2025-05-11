export type LogType = "Info" | "Error";

export type Log = {
    id: string;
    log: string
    deploymentId: string
    type: LogType
    timestamp: string
}

export type IncomingLog = Omit<Log, "id">
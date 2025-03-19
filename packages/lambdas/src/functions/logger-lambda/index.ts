import { DynamoDBStreamEvent, Callback, Context } from "aws-lambda"

export const handler = (event: DynamoDBStreamEvent, context: Context,
    callback: Callback) => {
    event.Records.forEach((record) => {
        console.log('Stream record: ', JSON.stringify(record, null, 2));

        if (record.eventName == 'INSERT') {
            const who = JSON.stringify(record?.dynamodb?.NewImage?.Username);
            const when = JSON.stringify(record?.dynamodb?.NewImage?.Timestamp?.S);
            const what = JSON.stringify(record?.dynamodb?.NewImage?.Message?.S);
            const params = {
                Subject: 'A new bark from ' + who,
                Message: 'Woofer user ' + who + ' barked the following at ' + when + ':\n\n ' + what,
            };
        }
    });
    callback(null, `Successfully processed ${event.Records.length} records.`);
};
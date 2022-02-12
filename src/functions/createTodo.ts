import { APIGatewayProxyHandler } from "aws-lambda"
import { document } from "../utils/dynamodbClient";
import {v4 as uuidv4 } from "uuid"

interface ICreateTodo {
    title: string;
    deadLine: Date;
}

export const handler: APIGatewayProxyHandler = async (event) => {
    const { user_id } = event.pathParameters;
    const { title, deadLine } = JSON.parse(event.body) as ICreateTodo;

    const id = uuidv4()

    await document.put({
        TableName: "todos",
        Item: {
            id,
            userId: user_id,
            title,
            done: false,
            deadLine
        },
    }).promise();

    const response = await document.query({
        TableName: "todos",
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": id
        }
    }).promise();

    return {
        statusCode: 201,
        body: JSON.stringify(response.Items[0]),
    }

    
}
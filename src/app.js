const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');
// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;

const TABLE_NAME = process.env.My_TABLE;
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.saveEmployee = async (event) => {
    console.log("EVENT:" + event)

    const {name, lastName} = getParams(event);

    const item = {
        id: uuid.v4(),
        name: name,
        lastName: lastName,
        date: Date.now(),
    }
    console.log('ITEM: ' + item);

    const savedItem = await saveItem(item);
    
    return{
        statusCode: 200,
        body: JSON.stringify(savedItem)
    }

 

    
};

const saveItem = async (item) => {
    const params = {
        TableName: TABLE_NAME,
        Item: item
    }
    return dynamo.put(params).promise().then(() => {
        return item;
    });
};

const getParams = (event)=>{
    return JSON.parse(event.body);        
};
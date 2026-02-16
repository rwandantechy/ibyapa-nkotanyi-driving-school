const getTwentyQuestions = {
    tags:['Traffic Questions'],
    description:"Retrieve Twenty Questions for the user to answer",
    security: [
        {
          token: [],
        },
      ],
    responses:{
        200:{
            description:"OK",
            content:{
                 "application/json":{
                    type:'object',
                    example:{
                        status:"success",
                        data:[]
                    }
                 }
            }
        }
    }
}

const createQuestion = {
    tags:['Traffic Questions'],
    description:"Create a new question for the user to answer",
    security: [
        {
          token: [],
        },
      ],
    requestBody:{
        content:{
            "application/json":{
                schema:{
                    type:'object',
                    properties:{
                        question:{
                            type:'string',
                            example:"What is the color of the sky"
                        },
                        options:{
                            type:'array',
                            example:[
                                {
                                    option:"Element",
                                    is_correct:true
                                },
                                {
                                    option:"Kizz",
                                    is_correct:false
                                },
                                {
                                    option:"Yago",
                                    is_correct:false
                                },
                                {
                                    option:"coach gael",
                                    is_correct:false
                                },
                            ]
                        }
                    }
                }
            }
        }
    },
    responses:{
        201:{
            description:"OK",
            content:{
                 "application/json":{
                    type:'object',
                    example:{
                        status:"success",
                        data:[]
                    }
                 }
            }
        }
    }
}



export const trafficQuestionsDocs = {
    '/api/traffic/get-questions':{
        get:getTwentyQuestions
    },
    '/api/traffic/add-question':{
        post:createQuestion
    }
}
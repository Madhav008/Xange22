const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        "swagger": "2.0",
        "info": {
            "version": "1.0.0",
            "title": "REST API",
            "description": ""
        },
        "host": "localhost:3132",
        "basePath": "/",
        "schemes": [
            "http"
        ],
        "paths": {
            "/": {
                "get": {
                    "description": "",
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "401": {
                            "description": "Unauthorized"
                        }
                    }
                },
                "post": {
                    "description": "",
                    "parameters": [
                        {
                            "name": "body",
                            "in": "body",
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "matchkey": {
                                        "example": "any"
                                    }
                                }
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                }
            },
            "/google/login": {
                "get": {
                    "description": "",
                    "responses": {
                        "default": {
                            "description": ""
                        }
                    }
                }
            },
            "/success": {
                "get": {
                    "description": "",
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "401": {
                            "description": "Unauthorized"
                        },
                        "403": {
                            "description": "Forbidden"
                        }
                    }
                }
            },
            "/google/callback": {
                "get": {
                    "description": "",
                    "parameters": [
                        {
                            "name": "code",
                            "in": "query",
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                }
            },
            "/register": {
                "post": {
                    "description": "",
                    "parameters": [
                        {
                            "name": "body",
                            "in": "body",
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "password": {
                                        "example": "any"
                                    },
                                    "username": {
                                        "example": "any"
                                    },
                                    "email": {
                                        "example": "any"
                                    }
                                }
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                }
            },
            "/login": {
                "post": {
                    "description": "",
                    "parameters": [
                        {
                            "name": "body",
                            "in": "body",
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "email": {
                                        "example": "any"
                                    },
                                    "password": {
                                        "example": "any"
                                    }
                                }
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "400": {
                            "description": "Bad Request"
                        },
                        "404": {
                            "description": "Not Found"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                }
            },
            "/logout": {
                "get": {
                    "description": "",
                    "responses": {
                        "default": {
                            "description": ""
                        }
                    }
                }
            },
            "/cron/seed/matches": {
                "get": {
                    "description": "",
                    "responses": {
                        "200": {
                            "description": "OK"
                        }
                    }
                }
            },
            "/cron/seed/players": {
                "get": {
                    "description": "",
                    "responses": {
                        "200": {
                            "description": "OK"
                        }
                    }
                }
            },
            "/upcomming": {
                "get": {
                    "description": "",
                    "responses": {
                        "200": {
                            "description": "OK"
                        }
                    }
                }
            },
            "/live": {
                "get": {
                    "description": "",
                    "responses": {
                        "200": {
                            "description": "OK"
                        }
                    }
                }
            },
            "/result": {
                "get": {
                    "description": "",
                    "responses": {
                        "200": {
                            "description": "OK"
                        }
                    }
                }
            },
            "/create": {
                "post": {
                    "description": "",
                    "parameters": [
                        {
                            "name": "body",
                            "in": "body",
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "price": {
                                        "example": "any"
                                    },
                                    "amount": {
                                        "example": "any"
                                    },
                                    "qty": {
                                        "example": "any"
                                    },
                                    "timestamp": {
                                        "example": "any"
                                    },
                                    "status": {
                                        "example": "any"
                                    },
                                    "user": {
                                        "example": "any"
                                    },
                                    "orderType": {
                                        "example": "any"
                                    },
                                    "playerId": {
                                        "example": "any"
                                    },
                                    "walletId": {
                                        "example": "any"
                                    }
                                }
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "400": {
                            "description": "Bad Request"
                        },
                        "404": {
                            "description": "Not Found"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                }
            },
            "/close": {
                "post": {
                    "description": "",
                    "parameters": [
                        {
                            "name": "body",
                            "in": "body",
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "orderId": {
                                        "example": "any"
                                    },
                                    "walletId": {
                                        "example": "any"
                                    },
                                    "currentPrice": {
                                        "example": "any"
                                    }
                                }
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "404": {
                            "description": "Not Found"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                }
            },
            "/{userId}": {
                "get": {
                    "description": "",
                    "parameters": [
                        {
                            "name": "userId",
                            "in": "path",
                            "required": true,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                }
            },
            "/players": {
                "get": {
                    "description": "",
                    "responses": {
                        "default": {
                            "description": ""
                        }
                    }
                }
            },
            "/{playerId}": {
                "get": {
                    "description": "",
                    "parameters": [
                        {
                            "name": "playerId",
                            "in": "path",
                            "required": true,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK"
                        }
                    }
                }
            },
            "/createwallet": {
                "post": {
                    "description": "",
                    "parameters": [
                        {
                            "name": "body",
                            "in": "body",
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "userid": {
                                        "example": "any"
                                    }
                                }
                            }
                        }
                    ],
                    "responses": {
                        "201": {
                            "description": "Created"
                        },
                        "400": {
                            "description": "Bad Request"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                }
            },
            "/getbalance/{userid}": {
                "get": {
                    "description": "",
                    "parameters": [
                        {
                            "name": "userid",
                            "in": "path",
                            "required": true,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "400": {
                            "description": "Bad Request"
                        },
                        "404": {
                            "description": "Not Found"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                }
            },
            "/deposit": {
                "post": {
                    "description": "",
                    "parameters": [
                        {
                            "name": "body",
                            "in": "body",
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "userid": {
                                        "example": "any"
                                    },
                                    "amount": {
                                        "example": "any"
                                    }
                                }
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "400": {
                            "description": "Bad Request"
                        },
                        "404": {
                            "description": "Not Found"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                }
            },
            "/withdraw": {
                "post": {
                    "description": "",
                    "parameters": [
                        {
                            "name": "body",
                            "in": "body",
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "userid": {
                                        "example": "any"
                                    },
                                    "amount": {
                                        "example": "any"
                                    }
                                }
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "400": {
                            "description": "Bad Request"
                        },
                        "404": {
                            "description": "Not Found"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                }
            },
            "/gettransactions": {
                "get": {
                    "description": "",
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                }
            },
            "/getusertransactions/{walletId}": {
                "get": {
                    "description": "",
                    "parameters": [
                        {
                            "name": "walletId",
                            "in": "path",
                            "required": true,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "400": {
                            "description": "Bad Request"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                }
            },
            "/updatetransaction/{transactionId}": {
                "put": {
                    "description": "",
                    "parameters": [
                        {
                            "name": "transactionId",
                            "in": "path",
                            "required": true,
                            "type": "string"
                        },
                        {
                            "name": "body",
                            "in": "body",
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "transactionStatus": {
                                        "example": "any"
                                    }
                                }
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "400": {
                            "description": "Bad Request"
                        },
                        "404": {
                            "description": "Not Found"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                }
            },
            "/getpendingdeposits": {
                "get": {
                    "description": "",
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                }
            },
            "/getpendingwithdrawals": {
                "get": {
                    "description": "",
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                }
            }
        }
    },
    apis: ['./app/*.js', './api/routes/*.js'], // Specify the path to your route files
};

const specs = swaggerJsdoc(options);

module.exports = specs;

import os
from dotenv import load_dotenv
from pymongo import MongoClient
load_dotenv()

client = MongoClient(os.getenv("MONGODB_URI"));
db = client["VizualyAi"];
collection = db["users"];


"""
mogo collection schema

db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "email", "name", "chats"],
      properties: {
        user_id: { bsonType: "string" },
        email: { bsonType: "string" },
        name: { bsonType: "string" },
        chats: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["chat_id", "history"],
            properties: {
              chat_id: { bsonType: "string" },
              history: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  required: ["role", "content"],
                  properties: {
                    role: { bsonType: "string" },
                    content: { bsonType: "string" }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
});"""
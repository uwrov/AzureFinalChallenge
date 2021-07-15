# AzureFinalChallenge
Application for Mate's final Azure challenge for detecting fish.


### Socket-io Interface:

| Module | Port Number |
| --- | --- |
| Server | **4040** |


### Dependencies:

- Socket-io
- Flask-socket-io


### Server API:

| Event Name| Data type Structure| Description | Get or Post|
| --- | --- | --- | --- |
| "Send Video" | *TBD | Upload a video and relevant information to analyze with our machine learning model | Post |
| "Get Server State" | *TBD | Gets the current state of our server | Get |
| "Get Analysis Video" | *TBD | Gets the analyzed video for the given token if available | Get |
| "Get Analysis Data" | *TBD | Gets the analyzed data for the given token if available | Get |
| "Get Tokens" | *TBD | Returns list of currently available tokens | Get |

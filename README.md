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
| "Send Video" | {video: "base64blob", fishes:[array of fish to detect]} | Upload a video and relevant information to analyze with our machine learning model | Post |
| "Receive Token" | string | callback for video sent | Get | 
| "Get Server State" | *TBD | Gets the current state of our server | Get |
| "Get Analysis Video" | {video: "base64blob", data:[list of fish detections]} | Gets the analyzed video for the given token if available | Get |
| "Get Tokens" | [list of tokens] | Returns list of currently available tokens | Get |

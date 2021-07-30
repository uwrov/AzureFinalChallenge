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
| "Get Server State" | none | Gets the current state of server | Get |
| "Get Analysis Video" | token string| Gets the analyzed video for the given token if available | Get |
| "Get Tokens" | token string | Returns list of currently available tokens | Get |

### Client API:
| Event Name| Data type Structure| Description |
| "Receive Token" | string | Event for receiving token from video sent | 
| "Receive Analysis Video" | {video: "base64blob", data:[list of fish detections]}| Event for receiving analysis videos |
| "Receive Tokens" | [list of tokens] | Event for receiving list of tokens |

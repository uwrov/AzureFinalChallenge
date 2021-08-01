import React, {Component} from 'react';

//Expects the props int videoIdx and video[] videos
class VideoSection extends Component {
  constructor(props) {
    super(props);

    this.videoRef = React.createRef();
    this.prevURL = this.props.video;
  }

  render() {
    return(
      <div className="video-section">
        {this.renderVideo()}
      </div>
    );
  }

  renderVideo() {
    let type = "video/mp4"
    if(this.videoRef.current !== null && this.props.video !== this.prevURL) {
      this.videoRef.current.load();
    }
    if(this.props.type) {
      type = "video/" + this.props.type;
    }
    this.prevURL = this.props.video;
    return this.props.video ?
          (<video controls ref={this.videoRef}><source src={this.props.video} type={type}></source></video>) :
          (<div>Upload a video!</div>);
  }
}

export default VideoSection;

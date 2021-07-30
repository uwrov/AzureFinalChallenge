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
    if(this.videoRef.current !== null && this.props.video !== this.prevURL) {
      this.videoRef.current.load();
    }
    this.prevURL = this.props.video;
    return this.props.video ?
          (<video controls ref={this.videoRef}><source src={this.props.video} type="video/mp4"></source></video>) :
          (<div>Upload a video!</div>);
  }
}

export default VideoSection;

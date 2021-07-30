import React, {Component} from 'react';

//Expects the props int videoIdx and video[] videos
class VideoSection extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div id={"video-section"}>
        {this.renderVideo()}
      </div>
    );
  }

  renderVideo() {
    return this.props.video ?
          (<video controls><source src={this.props.video} type="video/mp4"></source></video>) :
          (<div>Upload a video!</div>);
  }
}

export default VideoSection;

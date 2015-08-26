import React from 'react';
import {connect} from 'react-redux';
import {ReverseLink} from 'react-router-reverse';
import {bindActionCreators} from 'redux';

import {fetch, publish} from '../actions/review';
import AddonListing from '../components/addonListing';
import addonReviewSelector from '../selectors/review';


export class AddonReview extends React.Component {
  static propTypes = {
    addons: React.PropTypes.array.isRequired,
    fetch: React.PropTypes.func,
    publish: React.PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.props.fetch();
  }
  render() {
    return (
      <section>
        <h1>Reviewing Firefox OS Add-ons</h1>
        <AddonListing addons={this.props.addons}
                      isReview={true}
                      publish={this.props.publish}/>
      </section>
    );
  }
};


export default connect(
  addonReviewSelector,
  dispatch => bindActionCreators({
    fetch,
    publish,
  }, dispatch)
)(AddonReview);

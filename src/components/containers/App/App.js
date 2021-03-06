import React, { Component } from 'react';
import classNames from 'classnames';
import LoadingBar from 'react-redux-loading-bar';
import { connect } from 'react-redux';
import { get } from 'lodash';
import _ from 'lodash/fp';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { themeConfigs } from '../../../themes.config';
import { requestErrorSelector, patientInfoSelector } from './selectors';
import TopHeader from '../TopHeader/TopHeader';
import Header from '../Header/Header';
import Main from '../Main/Main';
import Footer from '../../presentational/Footer/Footer';
import MainSpinner from '../MainSpinner/MainSpinner';
import HandleErrors from '../HandleErrors/HandleErrors';
import HeaderList from '../HeaderList/HeaderList';
import ExtraPlugins from '../../theme/components/ExtraPlugins';
import { isPageNonCore, getNonCorePage } from '../../../utils/nonCorePage-helper';
import { image } from './HeaderImage';

import '../../../config/styles';

export class App extends Component {

  componentDidMount(){
    // Has High Contrast Mode been enabled?
    if (document.cookie.split(';').filter((item) => item.includes('enabledHighContrast=true')).length) {
      let bodyTag = document.getElementsByTagName("body")[0];
      bodyTag.classList.add("high-contrast");
    }
  }

  render() {
    const { requestError, patientsInfo } = this.props;
    const isTouchDevice = (this.props.isTouchDevice) ? 'touch-device' : ('ontouchstart' in window) ? 'touch-device' : 'is-not-touch-device';
    const UA = window.navigator.userAgent.toLowerCase();
    const isIE = (/trident/gi).test(UA) || (/msie/gi).test(UA);
    const pathname = get(this.props, 'location.pathname', null);
    if (isPageNonCore(pathname)) {
      const Page = getNonCorePage(pathname);
      return (
        <Page />
      );
    }
    return (
      <div className="page">
        <LoadingBar className="loading-bar" />
        {!_.isEmpty(requestError) ? <HandleErrors /> : <MainSpinner /> }
        {!_.isEmpty(patientsInfo) ? <div style={{height: '100%'}}>
          <div className={classNames('wrapper', isTouchDevice)}>
            <header className="header">
              <TopHeader
                isHasSearch={themeConfigs.headerHasSearch}
              >
                {themeConfigs.isLeedsPHRHeaderList ?
                  <HeaderList items={[
                    <img src={image} alt="header img 2" />,
                  ]}
                  />
                  : <div />}
              </TopHeader>
              <Header />
            </header>
            <Main />
            <ExtraPlugins />
          </div>
          <Footer
            copyright={themeConfigs.footerCopyright}
            isShowSupportedBy={themeConfigs.footerHasShowSupportedByText}
          />
        </div> : null}
      </div>
    )
  }
}

export default withRouter(compose(connect(requestErrorSelector), connect(patientInfoSelector))(App))

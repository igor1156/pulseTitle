import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { lifecycle } from 'recompose';
import _ from 'lodash/fp';

import SimpleDashboardPanel from './SimpleDashboardPanel';
import ConfirmationModal from '../../ui-elements/ConfirmationModal/ConfirmationModal';
import PatientsSummaryListHeader from './header/PatientsSummaryListHeader';
import patientSummarySelector from './selectors';
import { patientsSummaryConfig, patientsSummaryLoading, defaultViewOfBoardsSelected } from './patients-summary.config';
import { fetchPatientSummaryRequest } from '../../../ducks/fetch-patient-summary.duck';
import { fetchPatientSummaryOnMount } from '../../../utils/HOCs/fetch-patients.utils';
import { dashboardVisible } from '../../../plugins.config';

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ fetchPatientSummaryRequest }, dispatch) });

@connect(patientSummarySelector, mapDispatchToProps)
@lifecycle(fetchPatientSummaryOnMount)
export default class PatientsSummary extends PureComponent {
    static propTypes = {
      boards: PropTypes.object.isRequired,
    };

    static contextTypes = {
      router: PropTypes.shape({
        history: PropTypes.object,
      }),
    };

    state = {
      selectedCategory: [],
      selectedViewOfBoards: defaultViewOfBoardsSelected,
      isDisclaimerModalVisible: false
    };

    componentWillMount() {
      const isShowDisclaimerOfRedirect = localStorage.getItem('isShowDisclaimerOfRedirect');
      localStorage.removeItem('isShowDisclaimerOfRedirect');

      if (isShowDisclaimerOfRedirect) {
        this.setState({isDisclaimerModalVisible: true});
      }

      this.setState({selectedCategory: this.getDefaultCategorySelected()});
    }

    getDefaultCategorySelected = () => {
      const defaultCategorySelected = {};

      patientsSummaryConfig.forEach((item) => {
        if (dashboardVisible[item.key] !== undefined) {
          defaultCategorySelected[item.key] = dashboardVisible[item.key];
        } else {
          defaultCategorySelected[item.key] = item.isDefaultSelected;
        }
      });

      return defaultCategorySelected;
    };

    closeDisclaimer = () => this.setState({isDisclaimerModalVisible: false});

    handleCategorySelected = selectedCategory => this.setState({ selectedCategory });

    handleViewOfBoardsSelected = selectedViewOfBoards => this.setState({ selectedViewOfBoards });

    handleGoToState = (state) => {
      this.context.router.history.push(state);
    };

    render() {
      const { boards } = this.props;
      const { selectedCategory, selectedViewOfBoards, isDisclaimerModalVisible } = this.state;
      const isHasPreview = selectedViewOfBoards.full || selectedViewOfBoards.preview;
      const isHasList = selectedViewOfBoards.full || selectedViewOfBoards.list;

      return (<section className="page-wrapper">
        <Row>
          <Col xs={12}>
            <div className="panel panel-primary panel-dashboard">
              <PatientsSummaryListHeader
                onCategorySelected={this.handleCategorySelected}
                onViewOfBoardsSelected={this.handleViewOfBoardsSelected}
                selectedCategory={selectedCategory}
                selectedViewOfBoards={selectedViewOfBoards}
                title={'Home'}
              />
              <div className="panel-body">
                <div className="dashboard">
                  {patientsSummaryConfig.map((item, index) => {
                    return (selectedCategory[item.key] ?
                      <SimpleDashboardPanel
                        key={index}
                        title={item.title}
                        items={boards[item.key]}
                        navigateTo={console.log}
                        state={item.state}
                        goToState={this.handleGoToState}
                        srcPrevirew={item.imgPreview}
                        isHasPreview={isHasPreview}
                        isHasList={isHasList}
                      />
                      : null)
                  })}
                </div>
              </div>
            </div>
          </Col>
        </Row>
        {isDisclaimerModalVisible && <ConfirmationModal
          title={'Notification'}
          isShow={true}
          onOk={this.closeDisclaimer}
          onHide={this.closeDisclaimer}
          isShowOkButton
        >
          <span>You was redirected to your home page because you are logged in as a PHR user.</span>
        </ConfirmationModal>}
      </section>)
    }
}

import React, { PureComponent } from 'react';

import PluginDetailPanel from '../../../plugin-page-component/PluginDetailPanel'
import ProblemsDiagnosisDetailForm from './ProblemsDiagnosisDetailForm'
import { getDDMMMYYYY } from '../../../../utils/time-helpers.utils';
import { valuesNames, valuesLabels } from '../forms.config';

const DIAGNOSES_PANEL = 'diagnosesPanel';

export default class ProblemsDiagnosisDetail extends PureComponent {
  render() {
    const { onExpand, openedPanel, expandedPanel, currentPanel, onEdit, editedPanel, onCancel, onSaveSettings, diagnosisPanelFormValues, isSubmit } = this.props;
    let { detail } = this.props;
    detail = detail || {};
    const dateCreated = getDDMMMYYYY(detail[valuesNames.DATE_CREATED]);
    const dateOfOnset = getDDMMMYYYY(detail[valuesNames.DATE_OF_ONSET]);
    return (
      <div className="section-detail">
        <div className="panel-group accordion">
          {(expandedPanel === DIAGNOSES_PANEL || expandedPanel === 'all') && !editedPanel[DIAGNOSES_PANEL] ? <PluginDetailPanel
            onExpand={onExpand}
            name={DIAGNOSES_PANEL}
            title="Problem / Diagnosis"
            isOpen={openedPanel === DIAGNOSES_PANEL}
            currentPanel={currentPanel}
            onEdit={onEdit}
            editedPanel={editedPanel}
            onCancel={onCancel}
            onSaveSettings={onSaveSettings}
            formValues={diagnosisPanelFormValues}
            isBtnShowPanel={false}
          >
            <div className="panel-body-inner">
              <div className="form">
                <div className="form-group-wrapper">
                  <div>
                    <div className="row-expand">
                      <div className="col-expand-left">
                        <div className="form-group">
                          <label className="control-label">{valuesLabels.PROBLEM}</label>
                          <div className="form-control-static">{detail[valuesNames.PROBLEM]}</div>
                        </div>
                      </div>
                      <div className="col-expand-right">
                        <div className="form-group">
                          <label className="control-label">{valuesLabels.DATE_OF_ONSET}</label>
                          <div className="form-control-static">{dateOfOnset}</div>
                        </div>
                      </div>
                    </div>
                    <div className="row-expand">
                      <div className="col-expand-left">
                        <div className="form-group">
                          <label className="control-label">{valuesLabels.DESCRIPTION}</label>
                          <div className="form-control-static">{detail[valuesNames.DESCRIPTION]}</div>
                        </div>
                      </div>
                    </div>
                    <div className="row-expand">
                      <div className="col-expand-left">
                        <div className="form-group">
                          <label className="control-label">{valuesLabels.TERMINOLOGY}</label>
                          <div className="form-control-static">{detail[valuesNames.TERMINOLOGY]}</div>
                        </div>
                      </div>
                      <div className="col-expand-right">
                        <div className="form-group">
                          <label className="control-label">{valuesLabels.CODE}</label>
                          <div className="form-control-static">{detail[valuesNames.CODE]}</div>
                        </div>
                      </div>
                    </div>
                    <div className="row-expand">
                      <div className="col-expand-left">
                        <div className="form-group">
                          <label className="control-label">{valuesLabels.AUTHOR}</label>
                          <div className="form-control-static">{detail[valuesNames.AUTHOR]}</div>
                        </div>
                      </div>
                      <div className="col-expand-right">
                        <div className="form-group">
                          <label className="control-label">{valuesLabels.DATE}</label>
                          <div className="form-control-static">{dateCreated}</div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="control-label">{valuesLabels.SOURCE}</label>
                      <div className="form-control-static">{detail[valuesNames.SOURCE]}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PluginDetailPanel> : null}
          {(expandedPanel === DIAGNOSES_PANEL || expandedPanel === 'all') && editedPanel[DIAGNOSES_PANEL] ? <PluginDetailPanel
            onExpand={onExpand}
            name={DIAGNOSES_PANEL}
            title="Edit Problem / Diagnosis"
            isOpen={openedPanel === DIAGNOSES_PANEL}
            currentPanel={currentPanel}
            onEdit={onEdit}
            editedPanel={editedPanel}
            onCancel={onCancel}
            onSaveSettings={onSaveSettings}
            formValues={diagnosisPanelFormValues}
            isBtnShowPanel={false}
          >
            <ProblemsDiagnosisDetailForm
              detail={detail}
              isSubmit={isSubmit}
            />
          </PluginDetailPanel> : null }
        </div>
      </div>
    )
  }
}
import _ from 'lodash/fp';
import { Observable } from 'rxjs';
import { createAction } from 'redux-actions';
import { get } from 'lodash';

import { fetchInitialiseRequest, FETCH_INITIALISE_SUCCESS, POLL_START } from './fetch-initialise.duck';
import { fetchUserAccountRequest, FETCH_USER_ACCOUNT_SUCCESS } from './fetch-user-account.duck';
import { fetchPatientsInfoRequest, FETCH_PATIENTS_INFO_SUCCESS } from './fetch-patients-info.duck';
import { setTheme } from './set-theme.duck';
import { setLogo } from './set-logo.duck';
import { setTitle } from './set-title.duck';
import { redirectToLoginUrl } from './login-status.duck';
import { redirectAccordingRole } from '../utils/redirect-helpers.utils';

export const INITIALISE_START = 'INITIALISE_START';
export const INITIALISE_SUCCESS = 'INITIALISE_SUCCESS';
export const INITIALISE_FAILURE = 'INITIALISE_FAILURE';

export const initialiseStart = createAction(INITIALISE_START);
export const initialiseSuccess = createAction(INITIALISE_SUCCESS);
export const initialiseFailure = createAction(INITIALISE_FAILURE);

//TODO should be refactored to actual sequence, not parallel listening
export const initialiseEpic = (action$, store) => Observable.merge(
  action$
    .ofType(INITIALISE_START)
    .map(fetchInitialiseRequest, _.head(window.document.getElementsByTagName('body')).className = 'loading'),
  action$
    .ofType(POLL_START)
    .switchMap(response => {
      const isNewPatient = get(response, 'payload.new_patient', false);
      const bodyLoaderClass = isNewPatient ? 'loading with-tips progress-long' : 'loading with-tips progress-short';
      _.head(window.document.getElementsByTagName('body')).className = bodyLoaderClass;
      const timeOut = isNewPatient ? 5000 : 1000;
      return Observable.interval(timeOut)
              .takeUntil(action$.ofType(FETCH_PATIENTS_INFO_SUCCESS))
                .exhaustMap(() => Observable.of(fetchInitialiseRequest()))
    }
  ),
  action$
    .ofType(FETCH_INITIALISE_SUCCESS)
    .map((action) => {
      return (action.payload.redirectURL) ? redirectToLoginUrl(action.payload) : fetchUserAccountRequest(action);
    }),
  action$
    .ofType(FETCH_USER_ACCOUNT_SUCCESS)
    .map((action) => {
      return fetchPatientsInfoRequest(action);
    }),
  action$
    .ofType(FETCH_PATIENTS_INFO_SUCCESS)
    .map((action) => {
      return store.dispatch(setTheme(action.payload.themeColor)), store.dispatch(setLogo(action.payload.logoB64)), store.dispatch(setTitle(action.payload.browserTitle));
    }),
  action$
    .ofType(FETCH_USER_ACCOUNT_SUCCESS)
    .map((action) => {
      redirectAccordingRole(action.payload);
      return initialiseSuccess(action.payload);
    })
);

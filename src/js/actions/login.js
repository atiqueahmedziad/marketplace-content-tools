import {Actions} from 'flummox';
import req from 'superagent-bluebird-promise';
import urlJoin from 'url-join';


export default class LoginActions extends Actions {
  startLogin(popup) {
    return popup;
  }
  async login(authResponse, authState, clientId) {
    let data = {
      auth_response: authResponse,
      state: authState,
    }
    if (clientId) {
      data.client_id = clientId;
    }

    return await this.serverLogin(data);
  }
  serverLogin(data) {
    // Post login data to server.
    const url = urlJoin(process.env.MKT_API_ROOT,
                        '/api/v2/account/fxa-login/');
    return req.post(url).send(data).promise();
  }
}
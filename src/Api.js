import axios from 'axios';
import * as Constants from './Constants';

axios.defaults.baseURL = Constants.API_BASE_URL;

export default axios;
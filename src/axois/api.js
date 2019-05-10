import { get } from './http';

const getExhibitionList = params => get('exhibition_list', params);
const getConsole = (params) => { console.log(params); };

export {
  getExhibitionList,
  getConsole,
};

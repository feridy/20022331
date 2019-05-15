import { get } from './http';

const getExhibitionList = params => get('exhibition_list', params);
const getMapList = params => get('map_list', params);

export {
  getExhibitionList,
  getMapList,
};

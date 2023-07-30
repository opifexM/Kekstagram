import {initializeFullScreenViewer} from '../fullscreen-viewer/index.js';
import {
  imgFilters,
  pictureFilterDefault,
  pictureFilterDiscussed,
  pictureFilterRandom,
  pictureList,
  pictureTemplate
} from './dom-elements.js';
import {PICTURE_SORT_BY_RANDOM_LIMIT, PICTURE_SORT_FILTER_DELAY} from './constants.js';
import {debounce} from '../utils/debounce.js';

let serverPictureData;

function updatePictureList(pictureData) {
  const pictureElements = document.querySelectorAll('.pictures .picture');
  pictureElements.forEach((element) => {
    element.remove();
  });

  const pictureListFragment = new DocumentFragment();
  pictureData.forEach((picture) => {
    const pictureElement = pictureTemplate.cloneNode(true);

    const pictureImg = pictureElement.querySelector('.picture__img');
    pictureImg.src = picture.url;
    pictureImg.alt = picture.description;

    const pictureInfo = pictureElement.querySelector('.picture__info');
    pictureInfo.querySelector('.picture__likes').textContent = picture.likes;
    pictureInfo.querySelector('.picture__comments').textContent = `${picture.comments.length}`;

    pictureListFragment.appendChild(pictureElement);
    pictureElement.addEventListener('click', () => initializeFullScreenViewer(picture));
  });
  pictureList.appendChild(pictureListFragment);
}

function sortByCommentDesc(pictureData) {
  return pictureData
    .slice()
    .sort((a, b) => {
      if (a.comments.length === b.comments.length) {
        return 0;
      }
      return (a.comments.length > b.comments.length) ? -1 : 1;
    });
}

function sortByRandom(pictureData, limit) {
  const array = pictureData.slice();
  for (let imageIdA = array.length - 1; imageIdA > 0; imageIdA--) {
    const imageIdB = Math.floor(Math.random() * (imageIdA + 1));
    [array[imageIdA], array[imageIdB]] = [array[imageIdB], array[imageIdA]];
  }
  return array.slice(0, limit);
}

function deselectPictureFilter() {
  pictureFilterDefault.classList.remove('img-filters__button--active');
  pictureFilterRandom.classList.remove('img-filters__button--active');
  pictureFilterDiscussed.classList.remove('img-filters__button--active');
}

const debouncedUpdateByComment = debounce(() => {
  updatePictureList(sortByCommentDesc(serverPictureData));
}, PICTURE_SORT_FILTER_DELAY);

const debouncedUpdateByDefault = debounce(() => {
  updatePictureList(serverPictureData);
}, PICTURE_SORT_FILTER_DELAY);

const debouncedUpdateByRandom = debounce(() => {
  updatePictureList(sortByRandom(serverPictureData, PICTURE_SORT_BY_RANDOM_LIMIT));
}, PICTURE_SORT_FILTER_DELAY);

function cancelAllDebounced() {
  debouncedUpdateByComment.cancel();
  debouncedUpdateByDefault.cancel();
  debouncedUpdateByRandom.cancel();
}

function changePictureSortByComment() {
  cancelAllDebounced();
  deselectPictureFilter();
  pictureFilterDiscussed.classList.add('img-filters__button--active');
  debouncedUpdateByComment();
}

function changePictureSortByDefault() {
  cancelAllDebounced();
  deselectPictureFilter();
  pictureFilterDefault.classList.add('img-filters__button--active');
  debouncedUpdateByDefault();
}

function changePictureSortByRandom() {
  cancelAllDebounced();
  deselectPictureFilter();
  pictureFilterRandom.classList.add('img-filters__button--active');
  debouncedUpdateByRandom();
}

function activateFilters() {
  imgFilters.classList.remove('img-filters--inactive');
}

function pictureFilterDefaultClickHandler() {
  changePictureSortByDefault();
}

function pictureFilterRandomClickHandler() {
  changePictureSortByRandom();
}

function pictureFilterDiscussedClickHandler() {
  changePictureSortByComment();
}

function initializeImageFilters() {
  pictureFilterDefault.addEventListener('click', pictureFilterDefaultClickHandler);
  pictureFilterRandom.addEventListener('click', pictureFilterRandomClickHandler);
  pictureFilterDiscussed.addEventListener('click', pictureFilterDiscussedClickHandler);
}

function initializePicturesAndFilters(pictureData) {
  serverPictureData = pictureData;
  initializeImageFilters();
  activateFilters();
  changePictureSortByDefault();
}

export {initializePicturesAndFilters};

import {COMMENT_LENGTH_MAX, HASHTAG_COUNT_MAX, HASHTAG_LENGTH_MAX} from './constants.js';
import {effectLevelSliderElement, imageUploadFormTag, imageUploadFormText} from './dom-elements.js';
import {splitTextWithSpace} from './utils.js';

export const noUiSliderConfig = noUiSlider.create(effectLevelSliderElement, {
  start: [100],
  range: {
    'min': [0],
    'max': [100]
  }
});

export const noUiSliderEffectLevelConfig = {
  'chrome': {min: 0, max: 1, step: 0.1, filter: (value) => `grayscale(${value})`},
  'sepia': {min: 0, max: 1, step: 0.1, filter: (value) => `sepia(${value})`},
  'marvin': {min: 0, max: 100, step: 1, filter: (value) => `invert(${value}%)`},
  'phobos': {min: 0, max: 3, step: 0.1, filter: (value) => `blur(${value}px)`},
  'heat': {min: 1, max: 3, step: 0.1, filter: (value) => `brightness(${value})`},
  'none': {min: 0, max: 0, step: 0, filter: () => 'none'}
};

export const pristineConfig = {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'has-error',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'span',
  errorTextClass: 'error-message'
};

function preparePristineValidationRules(pristine) {

  pristine.addValidator(imageUploadFormText, (text) =>
    text.length <= COMMENT_LENGTH_MAX, 'The comment is too long');

  pristine.addValidator(imageUploadFormTag, (value) =>
    value.trim() === '' || splitTextWithSpace(value).every((hashtag) =>
      hashtag[0] === '#'), 'All hashtags must start with #', 1, true);

  pristine.addValidator(imageUploadFormTag, (value) =>
    value.trim() === '' || splitTextWithSpace(value).every((hashtag) =>
      /^#[A-Za-z0-9А-Яа-я]+$/.test(hashtag.toString())), 'Hashtags should contain only letters and numbers', 2, true);

  pristine.addValidator(imageUploadFormTag, (value) =>
    value.trim() === '' || splitTextWithSpace(value).every((hashtag) =>
      hashtag.length > 1), 'Hashtag cannot consist of a single #', 3, true);

  pristine.addValidator(imageUploadFormTag, (value) =>
    value.trim() === '' || splitTextWithSpace(value).every((hashtag) =>
      hashtag.length <=
      HASHTAG_LENGTH_MAX), `Hashtag length should not exceed ${HASHTAG_LENGTH_MAX} characters`, 4, true);

  pristine.addValidator(imageUploadFormTag, (value) =>
    value.trim() === '' || splitTextWithSpace(value).length <=
    HASHTAG_COUNT_MAX, `Number of hashtags should not exceed ${HASHTAG_COUNT_MAX}`, 5, true);

  pristine.addValidator(imageUploadFormTag, (value) => {
    if (value.trim() === '') {
      return true;
    }
    const lowercaseHashtags = splitTextWithSpace(value).map((hashtag) => hashtag.toLowerCase());
    const uniqueHashtags = new Set(lowercaseHashtags);
    return uniqueHashtags.size === lowercaseHashtags.length;
  }, 'Each hashtag should be unique', 6, true);
}

export {preparePristineValidationRules};

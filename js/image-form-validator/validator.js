import {IMAGE_UPLOAD_ENCTYPE, IMAGE_UPLOAD_METHOD, IMAGE_UPLOAD_URL} from '../constants/constants.js';
import {
  IMAGE_UPLOAD_FILE_TYPES,
  IMAGE_UPLOAD_TAG_REQUIRED,
  IMAGE_UPLOAD_TEXT_REQUIRED,
  NO_UI_SLIDER_RADIO_BUTTON_RESET,
  SCALE_CONTROL_DEFAULT,
  SCALE_CONTROL_VALUE_MAX,
  SCALE_CONTROL_VALUE_MIN,
  SCALE_CONTROL_VALUE_STEP
} from './constants.js';
import {
  bodyElement,
  effectLevelRadioButtonDefault,
  effectLevelRadioButtons,
  effectLevelValueElement,
  effectsPreviewElements,
  imageUploadCancel,
  imageUploadEffectLevel,
  imageUploadForm,
  imageUploadFormTag,
  imageUploadFormText,
  imageUploadInput,
  imageUploadOverlay,
  imageUploadPreview,
  imageUploadScaleControlBigger,
  imageUploadScaleControlSmaller,
  imageUploadScaleControlValue,
  imageUploadSubmitButton
} from './dom-elements.js';
import {
  noUiSliderConfig,
  noUiSliderEffectLevelConfig,
  preparePristineValidationRules,
  pristineConfig
} from './validator-rules.js';
import {fetchData} from '../api/api.js';
import {showGlobalErrorForm} from '../errors/global-error-form.js';

const pristine = new Pristine(imageUploadForm, pristineConfig, true);
let scaleControlValueCurrent = SCALE_CONTROL_DEFAULT;
let successForm;
let successFormInner;
let successFormButton;
let errorForm;
let errorFormInner;
let errorFormButton;

function changeEffectLevelRadioButton(radioButton) {
  imageUploadPreview.style.filter = noUiSliderEffectLevelConfig.none.filter(0);
  const effectOptions = noUiSliderEffectLevelConfig[radioButton.value];
  noUiSliderConfig.updateOptions({
    start: effectOptions.max,
    step: effectOptions.step,
    range: {
      'min': effectOptions.min,
      'max': effectOptions.max
    }
  });
  if (radioButton.value === 'none') {
    imageUploadEffectLevel.classList.add('hidden');
  } else {
    imageUploadEffectLevel.classList.remove('hidden');
  }
}

function effectLevelRadioButtonHandler() {
  changeEffectLevelRadioButton(this);
}

function closeFormImageClickHandler() {
  closeFormEditImage();
}

function closeFormImageEscKeyHandler(event) {
  if (document.activeElement === imageUploadFormTag || document.activeElement === imageUploadFormText) {
    return;
  }
  if (event.code === 'Escape') {
    closeFormEditImage();
  }
}

function setScaleControl(value) {
  scaleControlValueCurrent = value;
  imageUploadScaleControlValue.setAttribute('value', `${scaleControlValueCurrent}%`);
  imageUploadPreview.style.transform = `scale(${scaleControlValueCurrent / 100})`;
}

function calculateScaleControl(step) {
  const scaleControlValueUpdated = scaleControlValueCurrent + step;
  if (scaleControlValueUpdated < SCALE_CONTROL_VALUE_MIN || scaleControlValueUpdated > SCALE_CONTROL_VALUE_MAX) {
    return;
  }
  setScaleControl(scaleControlValueUpdated);
}

function scaleControlSmallerClickHandler() {
  calculateScaleControl(-SCALE_CONTROL_VALUE_STEP);
}

function scaleControlBiggerClickHandler() {
  calculateScaleControl(SCALE_CONTROL_VALUE_STEP);
}

function openFormEditImage() {
  document.addEventListener('keydown', closeFormImageEscKeyHandler);
  imageUploadCancel.addEventListener('click', closeFormImageClickHandler);
  imageUploadForm.addEventListener('submit', submitFormEditHandler);
  imageUploadScaleControlSmaller.addEventListener('click', scaleControlSmallerClickHandler);
  imageUploadScaleControlBigger.addEventListener('click', scaleControlBiggerClickHandler);
  effectLevelRadioButtons.forEach((radioButton) => {
    radioButton.addEventListener('change', effectLevelRadioButtonHandler);
  });

  bodyElement.classList.add('modal-open');
  imageUploadOverlay.classList.remove('hidden');
  imageUploadSubmitButton.disabled = false;
}

function closeFormEditImage() {
  document.removeEventListener('keydown', closeFormImageEscKeyHandler);
  imageUploadCancel.removeEventListener('click', closeFormImageClickHandler);
  imageUploadForm.removeEventListener('submit', submitFormEditHandler);
  imageUploadScaleControlSmaller.removeEventListener('click', scaleControlSmallerClickHandler);
  imageUploadScaleControlBigger.removeEventListener('click', scaleControlBiggerClickHandler);
  effectLevelRadioButtons.forEach((radioButton) => {
    radioButton.removeEventListener('change', effectLevelRadioButtonHandler);
  });
  effectLevelRadioButtonDefault.checked = true;

  imageUploadInput.value = '';
  imageUploadFormText.value = '';
  imageUploadFormTag.value = '';
  bodyElement.classList.remove('modal-open');
  imageUploadOverlay.classList.add('hidden');
  pristine.reset();
  setScaleControl(SCALE_CONTROL_DEFAULT);
  changeEffectLevelRadioButton(NO_UI_SLIDER_RADIO_BUTTON_RESET);
}

function imageUploadInputChangeHandler() {
  if (imageUploadInput.files.length > 0) {
    const file = imageUploadInput.files[0];
    if (!IMAGE_UPLOAD_FILE_TYPES.includes(file.type)) {
      showGlobalErrorForm(`Unsupported file type. Please select one of ${IMAGE_UPLOAD_FILE_TYPES}`);
      return;
    }

    const url = URL.createObjectURL(file);
    imageUploadPreview.src = url;
    effectsPreviewElements.forEach((element) => {
      element.style.backgroundImage = `url("${url}")`;
    });
    openFormEditImage();
  }
}

function successFormClickHandler() {
  hideSuccessForm();
}

function successFormEscKeyHandler(event) {
  if (event.code === 'Escape') {
    hideSuccessForm();
  }
}

function successFormClickOutsideHandler(event) {
  if (successFormInner.contains(event.target)) {
    return;
  }
  hideSuccessForm();
}

function errorFormClickHandler() {
  hideErrorForm();
}

function errorFormClickOutsideHandler(event) {
  if (errorFormInner.contains(event.target)) {
    return;
  }
  hideErrorForm();
}

function errorFormEscKeyHandler(event) {
  if (event.code === 'Escape') {
    hideErrorForm();
  }
}

function showSuccessForm() {
  createSuccessForm();
  document.removeEventListener('keydown', closeFormImageEscKeyHandler);
  successForm.classList.remove('hidden');
  document.addEventListener('keydown', successFormEscKeyHandler);
  successFormButton.addEventListener('click', successFormClickHandler);
  document.addEventListener('click', successFormClickOutsideHandler);
  closeFormEditImage();
}

function hideSuccessForm() {
  document.addEventListener('keydown', closeFormImageEscKeyHandler);
  successForm.classList.add('hidden');
  document.removeEventListener('keydown', successFormEscKeyHandler);
  successFormButton.removeEventListener('click', successFormClickHandler);
  document.removeEventListener('click', successFormClickOutsideHandler);
  deleteSuccessForm();
}

function showErrorForm() {
  createErrorForm();
  document.removeEventListener('keydown', closeFormImageEscKeyHandler);
  errorForm.classList.remove('hidden');
  document.addEventListener('keydown', errorFormEscKeyHandler);
  errorFormButton.addEventListener('click', errorFormClickHandler);
  document.addEventListener('click', errorFormClickOutsideHandler);
  imageUploadSubmitButton.disabled = false;
}

function hideErrorForm() {
  document.addEventListener('keydown', closeFormImageEscKeyHandler);
  errorForm.classList.add('hidden');
  document.removeEventListener('keydown', errorFormEscKeyHandler);
  errorFormButton.removeEventListener('click', errorFormClickHandler);
  document.removeEventListener('click', errorFormClickOutsideHandler);
  deleteErrorForm();
}

function validateAndSend() {
  if (pristine.validate()) {
    imageUploadSubmitButton.disabled = true;
    const formData = new FormData(imageUploadForm);
    fetchData(IMAGE_UPLOAD_URL, IMAGE_UPLOAD_METHOD, formData)
      .then(() => showSuccessForm())
      .catch(() => showErrorForm());
  }
}

function submitFormEditHandler(event) {
  event.preventDefault();
  validateAndSend();
}

function prepareHtmlForms() {
  imageUploadInput.accept = IMAGE_UPLOAD_FILE_TYPES
    .map((type) => `.${type.split('/')[1]}`).join(', ');
  imageUploadForm.method = IMAGE_UPLOAD_METHOD;
  imageUploadForm.action = IMAGE_UPLOAD_URL;
  imageUploadForm.enctype = IMAGE_UPLOAD_ENCTYPE;
  imageUploadFormTag.required = IMAGE_UPLOAD_TAG_REQUIRED;
  imageUploadFormText.required = IMAGE_UPLOAD_TEXT_REQUIRED;
}

function deleteSuccessForm() {
  document.body.removeChild(successForm);
  errorForm = null;
  errorFormInner = null;
  errorFormButton = null;
}

function deleteErrorForm() {
  document.body.removeChild(errorForm);
  successForm = null;
  successFormInner = null;
  successFormButton = null;
}

function createSuccessForm() {
  successForm = document.querySelector('#success')
    .content.querySelector('.success')
    .cloneNode(true);
  successFormInner = successForm.querySelector('.success__inner');
  successFormButton = successForm.querySelector('.success__button');
  document.body.appendChild(successForm);
}

function createErrorForm() {
  errorForm = document.querySelector('#error')
    .content.querySelector('.error')
    .cloneNode(true);
  errorFormInner = errorForm.querySelector('.error__inner');
  errorFormButton = errorForm.querySelector('.error__button');
  document.body.appendChild(errorForm);
}

function prepareImageUpload() {
  imageUploadEffectLevel.classList.add('hidden');
  imageUploadInput.addEventListener('change', imageUploadInputChangeHandler);
}

function prepareNoUiSlider() {
  noUiSliderConfig.on('update', (values, handle) => {
    const value = values[handle];
    const effectType = document.querySelector('.effects__radio:checked').value;
    const filterValue = noUiSliderEffectLevelConfig[effectType].filter(value);
    effectLevelValueElement.value = value;
    imageUploadPreview.style.filter = filterValue;
  });
}

function initializeValidator() {
  prepareHtmlForms();
  preparePristineValidationRules(pristine);
  prepareImageUpload();
  prepareNoUiSlider();
}

export {initializeValidator};

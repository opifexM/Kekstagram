let globalErrorForm;
let globalErrorFormInner;
let globalErrorFormButton;
let globalErrorFormMessage;

function globalErrorFormClickHandler() {
  hideGlobalErrorForm();
}

function globalErrorFormClickOutsideHandler(event) {
  if (globalErrorFormInner.contains(event.target)) {
    return;
  }
  hideGlobalErrorForm();
}

function globalErrorFormEscKeyHandler(event) {
  if (event.code === 'Escape') {
    hideGlobalErrorForm();
  }
}

function showGlobalErrorForm(errorMessage) {
  createGlobalErrorForm();
  globalErrorFormMessage.textContent = errorMessage;
  globalErrorForm.classList.remove('hidden');
  document.addEventListener('keydown', globalErrorFormEscKeyHandler);
  globalErrorFormButton.addEventListener('click', globalErrorFormClickHandler);
  document.addEventListener('click', globalErrorFormClickOutsideHandler);
}

function hideGlobalErrorForm() {
  globalErrorForm.classList.add('hidden');
  document.removeEventListener('keydown', globalErrorFormEscKeyHandler);
  globalErrorFormButton.removeEventListener('click', globalErrorFormClickHandler);
  document.removeEventListener('click', globalErrorFormClickOutsideHandler);
  deleteGlobalErrorForm();
}

function deleteGlobalErrorForm() {
  document.body.removeChild(globalErrorForm);
  globalErrorForm = null;
  globalErrorFormInner = null;
  globalErrorFormButton = null;
  globalErrorFormMessage = null;
}

function createGlobalErrorForm() {
  globalErrorForm = document.querySelector('#error')
    .content.querySelector('.error')
    .cloneNode(true);
  globalErrorFormInner = globalErrorForm.querySelector('.error__inner');
  globalErrorFormInner.classList.replace('error__inner', 'global_error__inner');

  globalErrorFormButton = globalErrorForm.querySelector('.error__button');
  globalErrorFormButton.classList.replace('error__button', 'global_error__button');

  globalErrorFormMessage = document.createElement('p');
  globalErrorFormMessage.classList.add('error__message');
  globalErrorFormInner.appendChild(globalErrorFormMessage);
  document.body.appendChild(globalErrorForm);
}

export {showGlobalErrorForm};

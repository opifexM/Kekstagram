[![Node CI](https://github.com/opifexM/Kekstagram/actions/workflows/check.yml/badge.svg)](https://github.com/opifexM/Kekstagram/actions/workflows/check.yml)
[![Qodana Code Quality](https://github.com/opifexM/Kekstagram/actions/workflows/qodana_code_quality.yml/badge.svg)](https://github.com/opifexM/Kekstagram/actions/workflows/qodana_code_quality.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/8067eede78ffecbdbab0/maintainability)](https://codeclimate.com/github/opifexM/Kekstagram/maintainability)

# Kekstagram

Kekstagram is a web application that allows users to view and edit images, apply filters, and manage comments. It's built using modern JavaScript features and techniques.

## Features

-   Image Viewing
-   Fullscreen Viewer
-   Image Editing and Filtering
-   Comment Management
-   Error Handling
-   API Integration

## Technologies

-   JavaScript (ES6+)
-   HTML5
-   CSS3

## File Structure

### Main Entry Point

-   `main.js`: Initializes the application, fetches image data, and sets up the main components.

### API Integration

-   `api.js`: Contains functions for fetching data from the server.

### Constants

-   `constants.js`: Defines constant values used throughout the application.

### Error Handling

-   `global-error-form.js`: Manages global error display.

### Fullscreen Viewer

-   `fullscreen.js`: Handles the fullscreen view of images and comments.
-   `constants.js`: Defines constants specific to the fullscreen viewer.
-   `dom-elements.js`: Exports DOM elements for the fullscreen viewer.

### Image Form Validator

-   `validator.js`: Contains the main logic for image form validation.
-   `constants.js`: Defines constants for image form validation.
-   `dom-elements.js`: Exports DOM elements for image form validation.
-   `utils.js`: Utility functions for image form validation.
-   `validator-rules.js`: Defines validation rules and configurations.


## Usage

Start the development server:

bashCopy code

`npm start`

Build the project for production:

bashCopy code

`npm run build`

## License

This project is licensed under the ISC License.

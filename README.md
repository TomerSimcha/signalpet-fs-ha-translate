# Translate SignalPET Report

## Introduction

**Translate SignalPET Report** is a ReactJS (TypeScript) application designed to generate comprehensive reports for veterinarians based on their uploaded X-Ray scans. To support SignalPET’s commitment to inclusivity, this project introduces a dynamic translation feature that allows reports to be translated into multiple languages, catering to clients from various linguistic backgrounds.

---

## Features

- **Dynamic Translation:** Automatically translates report content marked with `translate="yes"` into selected languages.
- **Language Support:** Supports German, Spanish, French, and Portuguese.
- **Language Switching:** Users can seamlessly switch between supported languages and English.
- **User-Friendly Interface:** Maintains the original report structure while providing translated content.
- **Cost Efficiency:** Implements deduplication and caching to minimize translation costs.

---

## Technologies Used

### Frontend

- **ReactJS (TypeScript):** Provides a robust framework for building dynamic user interfaces.

### Backend

- **Node.js with Express:** Serves as a backend proxy to handle translation requests securely.

### Additional Tools

- **Docker:** Facilitates running LibreTranslate locally if needed.
- **LibreTranslate:** An open-source translation API alternative for local deployments.

---

### Technology Decisions

- **Node.js and Express:** Selected for their lightweight and efficient handling of HTTP requests, making them ideal for creating a translation server.

---

## Security Measures


- **CORS Configuration:** Configured to allow only trusted origins to communicate with the backend server, mitigating cross-origin attacks.
  
- **Helmet:** Utilized Helmet middleware to set various HTTP headers, enhancing the security of the application by protecting against well-known vulnerabilities.

- **Morgan:** Implemented Morgan for logging HTTP requests, which aids in monitoring and detecting suspicious activities or potential security threats.

- **Input Validation:** Backend validates incoming requests to ensure only valid and expected data is processed, preventing malicious inputs and ensuring data integrity.

- **Error Handling:** Sensitive error information is not exposed to the client, reducing the risk of information leakage. The server handles errors gracefully and provides generic error messages to the frontend.
---

## Installation

### Prerequisites


Before you begin, ensure you have the following installed on your machine:


- **Node.js** (v14 or later)
- **npm** or **yarn**
- **Docker** (optional, for running LibreTranslate locally)

### Backend Setup


   cd signalpet-fs-ha-translate-server
    npm install
    npm start

    DISCLAIMER: no need to set up local env with api keys, because they are hardcoded for the sake of this project, in the future it is important
    to safely configure the environmental variables to store the private keys.

### Frontend Setup

cd signalpet-fs-ha-translate
npm install
npm start

### Running LibreTranslate Locally 

Clone LibreTranslate Repository:
git clone https://github.com/LibreTranslate/LibreTranslate.git
cd LibreTranslate
make sure you are running at port 5000
./run.sh --load-only en,es,de,pt,fr --port 5000


### Usage
Access the Application:

Open your browser and navigate to http://localhost:3000.

Select Language:

Use the LanguageSelector component in the top of the page to choose your desired language (German, Spanish, French, Portuguese).

View Translated Reports:

Elements marked with translate="yes" will automatically display their content in the selected language.
The translation may take a number of seconds to load.


Switch Back to English:

Select English from the language selector to instantly restore the original text.

Unsupported language Error Handling:

You can only select a supported language, preventing user mistakes.


### Components created or changed

Language selector - To help select a language


Language context - to manage the global language selection


Translation Manager - to manage the translation process, finding the corresponding elements that need to be translated, and fetching the relevant translations.


InputTag - made changes to address a bug where the input text was not translated

### Known Bugs and Future Improvements
## Known Bugs

Duplicate Text Segments: Although deduplication is implemented, certain edge cases might still cause duplicate translations and rendering after refreshing the page, specifically the text input field.

The user language selection is saved in the system storage, but the input field specifically shows the default language after refresh.

### Future Improvements
Enhanced DOM Traversal: Improve the translation logic to handle complex nested structures.

User Feedback Mechanisms: Implement loading indicators and success/error notifications to enhance user experience.

UseFetch refactoring - switch to react-query for better performance and to reduce rerendering

Addressing duplicate code - Input tag component include another useEffect fetch to solve problems with input field translation fetching, it can be adjusted to use the global way to fetch translation data instead of duplicating a part of it.

Support for Additional Languages: Expand language support beyond German, Spanish, French, and Portuguese.

Real-Time Translation: Implementing instant translation as the user types or edits the report.

Automatic Language Detection

Loading translated data directly from the database in the required language, instead of translating in the current way - fetching english data and then translating it. 


### Addressing the Bonus requests: 
Display Error Messages for Unsupported Languages: The users can only select a supported language, preventing user mistakes.

Automatic Language Detection: To be implemented in the future, decided to be out of scope for this current version.

Cost Reduction Mechanism: I implemented a Cache on the server in order to prevent multiple similar requests to the translation service. 
in addition, i implemented a cache on the frontend so it won't overload the server with multiple requests for the same text translation.

Store User Preferences: user preferences are stored in local storage, it's working except the bug in the input field mentioned above.

Unit and Functional Tests: Out of scope because of time constraints.



# Week 6 Assessment: From Script to CLI Package

## Task 1: Anatomy Quiz

### package.json fields

- name: Identifies the project or package.
- version: Specifies the current package version.
- description: Gives a short explanation of the project.
- main: Specifies the main entry file.
- scripts: Defines commands that can be run using npm.
- keywords: Provides search terms for the package.
- author: Identifies the package creator.
- license: Specifies the terms for using the package.
- type: module: Enables ES module syntax using import and export.

### Dependencies vs devDependencies

- dependencies: Packages needed when the application runs.
- devDependencies: Packages needed during development and building.

### Installed devDependencies

- @tailwindcss/vite: Integrates Tailwind CSS with Vite.
- tailwindcss: Provides utility classes for styling.
- vite: Provides the development server and production build tools.

### npm scripts

- test: Displays a message that no tests are configured.
- dev: Starts the Vite development server.
- build: Creates the production build.
- preview: Previews the production build.

## Task 2: Semver Drills

The version numbers tested are:
1.2.3, 1.2.9, 1.3.0, 1.9.9, 2.0.0

| Version Range | 1.2.3 | 1.2.9 | 1.3.0 | 1.9.9 | 2.0.0 |
|---|---|---|---|---|---|
| ^1.2.3 | Yes | Yes | Yes | Yes | No |
| ~1.2.3 | Yes | Yes | No | No | No |
| 1.2.3 | Yes | No | No | No | No |
| >=1.3.0 | No | No | Yes | Yes | Yes |

### Explanation

- ^1.2.3: Allows compatible updates below version 2.0.0.
- ~1.2.3: Allows patch updates but not minor or major updates.
- 1.2.3: Allows only the exact version.
- >=1.3.0: Allows version 1.3.0 and any newer version.

## Task 3: Package Evaluation

### Day.js

- Weekly downloads: 108,587,460.
- Version: 1.11.23.
- Minified size: 7 kB.
- Minified + Gzipped size: 3 kB.
- Description: A lightweight JavaScript library for parsing, validating, manipulating, and displaying dates and times.
- Evaluation: Day.js is small, fast, and suitable for applications that need simple date and time operations.

### Moment.js
- Version: 2.31.0.
- Weekly downloads: Approximately 19.4 million (npm listing; download counts change over time).
- Minified size: 61.2 kB.
- Minified + Gzipped size: 19.8 kB.
- Description: A JavaScript library for parsing, validating, manipulating, and formatting dates and times.
- Evaluation: Moment.js offers many date and time features, but it is larger than Day.js and is considered a legacy project in maintenance mode.

### date-fns
- Version: 4.4.0.
- Weekly downloads: Approximately 72.4 million.
- Minified size: 69.1 kB.
- Minified + Gzipped size: 17.1 kB.
- Description: A modern JavaScript library that provides functions for working with dates.
- Evaluation: date-fns provides separate functions for date operations and supports tree-shaking, allowing applications to include only the functions they need.
### Comparison
| Feature | Day.js | Moment.js | date-fns |
|---|---|---|---|
| Minified size | 7 kB | 61.2 kB | 69.1 kB |
| Gzipped size | 3 kB | 19.8 kB | 17.1 kB |
| Main advantage | Lightweight | Rich date features | Modular functions |
| Main disadvantage | Needs plugins for extra features | Larger size and legacy status | Requires importing functions |
### My Recommendation
I would choose Day.js for a small application because it has a very small bundle size, a simple API, and supports common date and time operations. It helps keep the application lightweight.
### Can Intl.DateTimeFormat Replace Them?
Intl.DateTimeFormat can replace these libraries when the application only needs to format dates and times according to different languages and regions.

However, it does not provide all the date parsing and manipulation features offered by these libraries. Therefore, it cannot completely replace them in applications that require advanced date operations.


## Task 4: Build a CLI
Not started.

## Task 5: Audit
Not started.
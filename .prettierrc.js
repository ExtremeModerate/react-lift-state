/**
 * These rules work only with the Prettier extension.
 * The rules inside the '.eslintrc.js' file are the same
 * but work together with ESLint without the need of having
 * Prettier installed
 */
module.exports = {
    bracketSpacing: true,
    printWidth: 120, // TODO: set to 80
    semi: true,
    singleQuote: true,
    tabWidth: 4, // TODO: set to 2
    trailingComma: 'all',
};

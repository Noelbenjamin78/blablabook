// Temporary declaration to satisfy TypeScript in the container build
// The project already installs @types/validator, but in some build environments
// TypeScript may not pick it up. This declaration prevents TS7016 errors.
declare module 'validator';

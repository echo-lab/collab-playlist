

/**
 * static type assertion
 * makes the compiler check that the argument is of type T; get autocompletion
 *  hints in a much safer way than `as` type casting that gives proper errors
 *  for missing, mismatched, or extraneous properties
 * source: https://github.com/microsoft/TypeScript/issues/7481
 */
export const asType = <T> (t: T): T => t




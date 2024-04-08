/**
 * Note: This file is NOT used in the project. It is for feature implementations!!
 * 
 * This hook is used to validate input fields in forms.
 * It takes the initial value of the input field and a validation function as arguments.
 */

import { useState, useEffect } from 'react';

const useValidation = (initialValue, validate) => {
  const [value, setValue] = useState(initialValue);
  const [errors, setErrors] = useState({});
  const [shouldFlagEmpty, setShouldFlagEmpty] = useState(false);

  useEffect(() => {
    if (shouldFlagEmpty || value !== '') {
      const validationErrors = validate(value);
      setErrors(validationErrors);
    }
  }, [value, shouldFlagEmpty, validate]);

  return {
    value,
    errors,
    setValue,
    setShouldFlagEmpty,
  };
};

export default useValidation;

/* eslint-disable prettier/prettier */

/* File not in use in the project*/

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

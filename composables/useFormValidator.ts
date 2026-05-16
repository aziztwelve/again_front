export function useFormValidator( form: Ref ) {
    const isFormError = ref( false );

    const resetErrors = () => {
        for ( const key in form.value ) {
            form.value[ key ].error = '';
        }
    }

    const resetForm = () => {
        for ( const key in form.value ) {
            form.value[ key ].value = '';
        }
    }

    const validateForm = () => {
        for ( const key in form.value ) {
            if ( ! form.value[key].hasOwnProperty( 'validation' ) ) {
                continue;
            }

            const validationRules = form.value[key].validation;
            for ( const rule in validationRules ){
                if ( rule === 'required' && form.value[key].value === '' ) {
                    form.value[key].error = 'Это поле является обязательным';
                    isFormError.value = true;
                }
            }
        }
    }

    return {
        isFormError,
        resetErrors,
        validateForm,
        resetForm
    };
}
import {ModalsSuccess} from "#components";

export const useForm = ( form: Ref, url: string, method?: string | 'POST'  ) => {
    const modal = useModal();

    const resetErrors = () => {
        for ( let key in form.value ) {
            form.value[key].error = '';
        }
    }

    const resetForm = () => {
        for ( let key in form.value ) {
            form.value[key].value = '';
        }
    }

    const setErrors = ( errors: Ref ) => {
        for ( const key in errors.value.data.errors ){
          if ( form.value[ key ] ){
            form.value[ key ].error = errors.value.data.errors[ key ][0];
          }
        }
    }

    const getData = () => {
        const newData = {};
        for ( let key in form.value ) {
            newData[key] = form.value[key].value;
        }

        return newData;
    }

    const sendRequest = async () => {
        resetErrors();

        const { data, status, error } = await useApi(url, {
            body: getData()
        }, '', method );

        if ( status.value === 'error' || error?.value?.data?.errors ){
            setErrors( error?.value?.data?.errors );
        } else {
            modal.openModal( ModalsSuccess, {
              title: 'Спасибо!',
              text: 'Ваша заявка отправлена'
            } );

            resetErrors();
            resetForm();
        }
    }

    return {
        form,
        sendRequest
    }
}
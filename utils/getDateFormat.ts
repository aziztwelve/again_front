export const getDateFormat = () => {
    const formattedDate = ( date: string ) => {
        const parsedDate = new Date( date );
        return parsedDate.toLocaleString( 'ru', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        } );
    }

    const formatDateOutput = ( date: Date ) => {
        if ( ! date ) {
            return '';
        }

        date = new Date( date );

        return date.getFullYear() + '-' +  ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    }

    return {
        formattedDate,
        formatDateOutput
    }
}
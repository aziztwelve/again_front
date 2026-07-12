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

export interface FormattedReviewDate {
    text: string;
    datetime: string;
}

const REVIEW_DATE_LOCALE = 'ru-RU';
const REVIEW_DATE_TIME_ZONE = 'Europe/Moscow';
const LEGACY_REVIEW_DATE_PATTERN = /^(\d{2})\.(\d{2})\.(\d{4})(?:\s+(\d{2}):(\d{2}))?$/;

/**
 * Formats both the new ISO review dates and the legacy `d.m.Y H:i` values.
 * Returning null keeps invalid legacy data out of the rendered <time> element.
 */
export const formatReviewDate = (value: string | null | undefined): FormattedReviewDate | null => {
    if (!value) {
        return null;
    }

    const legacyMatch = value.trim().match(LEGACY_REVIEW_DATE_PATTERN);
    let date: Date;
    let datetime: string;

    if (legacyMatch) {
        const [, day, month, year, hours = '00', minutes = '00'] = legacyMatch;
        const timestamp = Date.UTC(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hours) - 3,
            Number(minutes),
        );

        date = new Date(timestamp);
        datetime = `${year}-${month}-${day}T${hours}:${minutes}:00+03:00`;

        const localCalendarProbe = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
        const partsAreValid =
            localCalendarProbe.getUTCFullYear() === Number(year)
            && localCalendarProbe.getUTCMonth() === Number(month) - 1
            && localCalendarProbe.getUTCDate() === Number(day)
            && Number(hours) <= 23
            && Number(minutes) <= 59;

        if (!partsAreValid) {
            return null;
        }
    } else {
        date = new Date(value);
        datetime = value;
    }

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return {
        text: new Intl.DateTimeFormat(REVIEW_DATE_LOCALE, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: REVIEW_DATE_TIME_ZONE,
        }).format(date),
        datetime,
    };
};

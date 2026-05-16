import {orderStatuses} from "~/types/statuses";

export const getStatus = ( status: string ) => {
    const statuses = orderStatuses;

    if ( statuses.hasOwnProperty( status ) ) {
        return statuses[ status ];
    }

    return '';
}
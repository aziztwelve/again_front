export const getFilterParams = () => {
    const route = useRoute();
    const filters = ref({
        color: "",
        price: {
            before: '',
            after: '',
        },
        search: '',
        in_stock: 0,
        absorbency_level: '',
        fit_type: '',
        is_new: 0

    });

    for (const key in route.query) {
        if (!filters.value.hasOwnProperty(key)) {
            continue;
        }

        filters.value[key] = route.query[key];
    }

    return filters;
}
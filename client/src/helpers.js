export const parseQuery = queryParamsString => {
    const normalized = queryParamsString.trim().replace('?', '');
    const arrayOfParams = normalized.split('&');

    return arrayOfParams.reduce((current, param) => {
        let newResult = current;
        const hasEqualSign = param.indexOf('=') >= 0;
        const keyValue = param.trim().split('=');
        if (param !== '') {
            if (keyValue[0] && hasEqualSign) {
                newResult = {
                    ...current,
                    [keyValue[0]]: keyValue[1]
                }
            } else if (keyValue[0] && !hasEqualSign) {
                newResult = {
                    ...current,
                    [keyValue[0]]: true
                }
            }
        }

        return newResult;
    }, {});
};